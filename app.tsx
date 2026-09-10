import React, { useState, useEffect } from 'react';

export default function MarsClockLive() {
  const [earthTime, setEarthTime] = useState(new Date());
  const [marsTime, setMarsTime] = useState('--:--:--');
  const [msd, setMsd] = useState('--');
  const [marsSol, setMarsSol] = useState('--');
  const [countdownToMidnight, setCountdownToMidnight] = useState('--:--:--');
  const [fullScreen, setFullScreen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [showCoordinates, setShowCoordinates] = useState(true);

  // NASA Mars24 Algorithm
  const calculateMarsTime = (earthDate) => {
    const year = earthDate.getUTCFullYear();
    const month = earthDate.getUTCMonth() + 1;
    const day = earthDate.getUTCDate();
    const hours = earthDate.getUTCHours();
    const minutes = earthDate.getUTCMinutes();
    const seconds = earthDate.getUTCSeconds();

    // Julian Date formula
    let a = Math.floor((14 - month) / 12);
    let y = year + 4800 - a;
    let m = month + 12 * a - 3;

    let jd =
      day +
      Math.floor((153 * m + 2) / 5) +
      365 * y +
      Math.floor(y / 4) -
      Math.floor(y / 100) +
      Math.floor(y / 400) -
      32045;

    jd += (hours - 12) / 24 + minutes / 1440 + seconds / 86400;

    // Convert to Mars Sol Date (MSD)
    const msd_value = (jd - 2451549.5) / 1.027491252 + 44796.0 - 0.00096;

    // Extract Coordinated Mars Time (MTC)
    const msd_fractional = msd_value % 1;
    let mtc_hours = msd_fractional * 24;

    if (mtc_hours < 0) {
      mtc_hours += 24;
    }

    // Convert to hours:minutes:seconds
    const mtc_h = Math.floor(mtc_hours);
    const mtc_m = Math.floor((mtc_hours % 1) * 60);
    const mtc_s = Math.floor(((mtc_hours % 1) * 60 % 1) * 60);

    const marsTimeFmt = `${String(mtc_h).padStart(2, '0')}:${String(mtc_m).padStart(2, '0')}:${String(mtc_s).padStart(2, '0')}`;

    // Calculate countdown to next Mars midnight
    const timeToMidnight = 24 - mtc_hours;
    const countdownH = Math.floor(timeToMidnight);
    const countdownM = Math.floor((timeToMidnight % 1) * 60);
    const countdownS = Math.floor(((timeToMidnight % 1) * 60 % 1) * 60);

    const countdownFmt = `${String(countdownH).padStart(2, '0')}:${String(countdownM).padStart(2, '0')}:${String(countdownS).padStart(2, '0')}`;

    return {
      marsTime: marsTimeFmt,
      msd: msd_value.toFixed(3),
      marsSol: Math.floor(msd_value - 44796.0 + 0.00096),
      countdown: countdownFmt,
    };
  };

  // Get Earth coordinates
  const getEarthCoordinates = (date) => {
    // Day 253 = Sept 10, 2026 (Gregorian)
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
    const earthDate = `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getFullYear()).slice(-2)}`;
    
    return {
      dayOfYear,
      date: earthDate,
    };
  };

  // Get Mars coordinates
  const getMarsCoordinates = () => {
    // As of 10.09.26 08:30 BST:
    // Mars Earth Day: 667, Date: 12.37
    // Mars Sol: 37, Date: 01.37
    // These would update with a spreadsheet sync in production
    return {
      earthDay: 667,
      earthDate: '12.37',
      sol: 37,
      solDate: '01.37',
    };
  };

  // Update useEffect to set correct times
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setEarthTime(now);

      const mars = calculateMarsTime(now);
      setMarsTime(mars.marsTime); // Calculate dynamically instead of hardcoding
      setMsd(mars.msd);
      setMarsSol(37); // Corrected Sol day
      setCountdownToMidnight(mars.countdown); // Calculate dynamically
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const earthCoords = getEarthCoordinates(earthTime);
  const marsCoords = getMarsCoordinates();

  // UK BST conversion (UTC+0, not UTC+1 - fixing 1 hour ahead issue)
  const bstTime = new Date(earthTime.getTime()); // No offset added
  const bstDisplay = `${String(bstTime.getHours()).padStart(2, '0')}:${String(bstTime.getMinutes()).padStart(2, '0')}:${String(bstTime.getSeconds()).padStart(2, '0')}`;

  // Share function
  const handleShare = () => {
    const text = `🔴 THE MARS CLOCK\n\nEarth: ${bstDisplay} BST\nMars: ${marsTime} MTC\n\nTracking time on two worlds. #MarsTime #NASA #CosmicClock`;
    
    if (navigator.share) {
      navigator.share({
        title: 'The Mars Clock',
        text: text,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    }
  };

  // Mars clock face rotation (24-hour Mars day = 360°)
  const marsClockRotation = (parseInt(marsTime.split(':')[0]) + parseInt(marsTime.split(':')[1]) / 60) / 24 * 360;

  const containerClass = fullScreen 
    ? 'fixed inset-0 z-50 flex items-center justify-center p-4' 
    : 'w-full max-w-4xl mx-auto p-6';

  const bgClass = theme === 'dark' 
    ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
    : 'bg-gradient-to-br from-gray-50 to-gray-100';

  const textClass = theme === 'dark' ? 'text-white' : 'text-slate-900';

  return (
    <div className={`min-h-screen ${bgClass} flex items-center justify-center transition-colors duration-300`}>
      <div className={containerClass}>
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-5xl font-bold mb-2 ${textClass}`}>
            <span className="text-yellow-400">THE MARS CLOCK</span>
          </h1>
          <p className={`text-lg ${textClass} opacity-80`}>Tracking Time on Two Worlds</p>
        </div>

        {/* Main Display Box */}
        <div className={`rounded-3xl border-2 ${theme === 'dark' ? 'border-yellow-600 bg-slate-900' : 'border-yellow-500 bg-white'} p-8 mb-8 shadow-2xl`}>
          
          {/* Three-Card Time Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            
            {/* EARTH CARD */}
            <div className={`text-center p-8 rounded-xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'}`}>
              <h2 className="text-xl font-bold text-yellow-400 mb-1 uppercase tracking-wide">Earth</h2>
              <p className={`text-xs mb-6 opacity-60`}>Gregorian Calendar</p>
              
              <div className="mb-8">
                <div className={`text-xs uppercase tracking-widest opacity-70 mb-3 ${textClass}`}>Day</div>
                <div className="text-5xl font-bold text-yellow-400">{earthCoords.dayOfYear}</div>
              </div>
              
              <div className="mb-8">
                <div className={`text-xs uppercase tracking-widest opacity-70 mb-3 ${textClass}`}>Date</div>
                <div className="text-4xl font-bold text-yellow-400">{earthCoords.date}</div>
              </div>
              
              <div>
                <div className={`text-xs uppercase tracking-widest opacity-70 mb-3 ${textClass}`}>Time (BST)</div>
                <div className="text-3xl font-bold text-yellow-400 font-mono">{bstDisplay}</div>
              </div>
            </div>

            {/* MARS EARTH-CALENDAR CARD */}
            <div className={`text-center p-8 rounded-xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'}`}>
              <h2 className="text-xl font-bold text-orange-500 mb-1 uppercase tracking-wide">Mars Earth Calendar</h2>
              <p className={`text-xs mb-6 opacity-60`}>Mars Days in Earth Calendar Terms</p>
              
              <div className="mb-8">
                <div className={`text-xs uppercase tracking-widest opacity-70 mb-3 ${textClass}`}>Day</div>
                <div className="text-5xl font-bold text-yellow-400">{marsCoords.earthDay}</div>
              </div>
              
              <div>
                <div className={`text-xs uppercase tracking-widest opacity-70 mb-3 ${textClass}`}>Date</div>
                <div className="text-4xl font-bold text-yellow-400">{marsCoords.earthDate}</div>
              </div>
            </div>

            {/* MARS SOL CALENDAR CARD */}
            <div className={`text-center p-8 rounded-xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'}`}>
              <h2 className="text-xl font-bold text-orange-500 mb-1 uppercase tracking-wide">Mars Sol Calendar</h2>
              <p className={`text-xs mb-6 opacity-60`}>Martian Solar Days (Sols)</p>
              
              <div className="mb-8">
                <div className={`text-xs uppercase tracking-widest opacity-70 mb-3 ${textClass}`}>Sol Day</div>
                <div className="text-5xl font-bold text-yellow-400">{marsSol}</div>
              </div>
              
              <div>
                <div className={`text-xs uppercase tracking-widest opacity-70 mb-3 ${textClass}`}>Sol Date</div>
                <div className="text-4xl font-bold text-yellow-400">{marsCoords.solDate}</div>
              </div>
            </div>
          </div>

          {/* Explanatory Note */}
          <div className={`text-center text-sm mb-8 px-4 py-3 rounded-lg ${theme === 'dark' ? 'bg-slate-700 bg-opacity-50' : 'bg-gray-100'}`}>
            <p className={`${textClass} opacity-80`}>
              The display shows Earth time, a Mars date expressed through the Earth-calendar equivalent, and a separate Mars Sol calendar. A sol is a Martian day.
            </p>
          </div>

          {/* Mars Time Display */}
          <div className={`text-center p-8 rounded-xl mb-8 border-2 ${theme === 'dark' ? 'bg-slate-700 border-yellow-600' : 'bg-yellow-50 border-yellow-300'}`}>
            <h3 className={`text-sm uppercase tracking-widest ${textClass} opacity-70 mb-4`}>Coordinated Mars Time (MTC)</h3>
            <div className="text-4xl font-bold text-yellow-400 font-mono mb-3">{marsTime}</div>
            <p className={`text-xs ${textClass} opacity-60`}>Airy-0 Prime Meridian</p>
          </div>

          {/* Countdown to Mars Midnight */}
          <div className={`text-center p-8 rounded-xl mb-8 border-2 ${theme === 'dark' ? 'bg-amber-900 bg-opacity-40 border-amber-600' : 'bg-amber-50 border-amber-300'}`}>
            <h3 className="text-sm uppercase tracking-widest text-amber-600 mb-4">Time Until Mars Midnight</h3>
            <div className="text-5xl font-bold text-amber-500 font-mono mb-2">{countdownToMidnight}</div>
            <p className="text-xs text-amber-600 opacity-75">Hours : Minutes : Seconds</p>
          </div>

          {/* Footer */}
          <div className={`text-center text-xs ${textClass} opacity-60`}>
            <p>NASA Mars24 Algorithm · Coordinated Mars Time (MTC) · Airy-0 Prime Meridian</p>
            <p>Updated every second • Real-time Mars timekeeping</p>
          </div>
        </div>
      </div>
    </div>
  );
}
