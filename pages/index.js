import { useState, useEffect } from 'react';

export default function Home() {
  const [earthData, setEarthData] = useState({
    dayOfYear: 0,
    date: '00.00.00',
    time: '00:00'
  });

  const [marsData, setMarsData] = useState({
    day: 0,
    date: '00.00',
    time: '00:00'
  });

  const [solData, setSolData] = useState({
    sol: 0,
    date: '00.00',
    time: '00:00'
  });

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();

      // ===== EARTH DATA =====
      // Day of year
      const startOfYear = new Date(now.getFullYear(), 0, 0);
      const diff = now - startOfYear;
      const oneDay = 1000 * 60 * 60 * 24;
      const dayOfYear = Math.floor(diff / oneDay);

      // Date as DD.MM.YY
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear().toString().slice(-2);
      const dateFormatted = `${day}.${month}.${year}`;

      // BST Time (live)
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const bstTime = `${hours}:${minutes}`;

      setEarthData({
        dayOfYear: dayOfYear,
        date: dateFormatted,
        time: bstTime
      });

      // ===== MARS DATA (MOD 687) =====
      // Epoch: February 7, 2021
      const epochDate = new Date(2021, 1, 7);
      const totalDays = Math.floor((now - epochDate) / (1000 * 60 * 60 * 24));

      // Days in Mars Year (MOD 687)
      const daysInMarsYear = totalDays % 687;
      const marsCompleteMonths = Math.floor(daysInMarsYear / 57.25);
      const marsDaysUsed = marsCompleteMonths * 57.25;
      const marsRemainingDays = daysInMarsYear - marsDaysUsed;

      const marsMonth = marsRemainingDays === 0 ? marsCompleteMonths : marsCompleteMonths + 1;
      const marsDay = marsRemainingDays === 0 ? 57 : Math.floor(marsRemainingDays);
      const marsDateFormatted = `${String(marsMonth).padStart(2, '0')}.${String(marsDay).padStart(2, '0')}`;

      setMarsData({
        day: marsDay,
        date: marsDateFormatted,
        time: bstTime
      });

      // ===== SOL DATA (MOD 668) + NASA24 AIRY TIME =====
      // Days in Sol Year (MOD 668)
      const daysInSolYear = totalDays % 668;
      const solCompleteMonths = Math.floor(daysInSolYear / 55.666666);
      const solDaysUsed = solCompleteMonths * 55.666666;
      const solRemainingDays = daysInSolYear - solDaysUsed;

      const solMonth = solRemainingDays === 0 ? solCompleteMonths : solCompleteMonths + 1;
      const solDay = solRemainingDays === 0 ? 55 : Math.floor(solRemainingDays);
      const solDateFormatted = `${String(solMonth).padStart(2, '0')}.${String(solDay).padStart(2, '0')}`;

      // NASA24 AIRY ALGORITHM FOR MARS TIME
      // Step A: Calculate Julian Date
      const jd = (now.getTime() / 86400000) + 2440587.5;

      // Step B: Mars Sol Date (MSD)
      // MSD = (JD - 2451549.5) / 1.027491252 + 44796.0 - 0.00096
      const msd = ((jd - 2451549.5) / 1.027491252) + 44796.0 - 0.00096;

      // Step C: Get fractional part of MSD for time of day
      const msdFractional = msd - Math.floor(msd);

      // Step D: Coordinated Mars Time (MTC) in hours
      const mtcHours = msdFractional * 24;

      // Convert to HH:MM format
      const marsHours = Math.floor(mtcHours);
      const marsMinutes = Math.floor((mtcHours - marsHours) * 60);
      const marsTimeFormatted = `${String(marsHours).padStart(2, '0')}:${String(marsMinutes).padStart(2, '0')}`;

      setSolData({
        sol: solDay,
        date: solDateFormatted,
        time: marsTimeFormatted
      });
    };

    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex flex-col items-center justify-center px-4 py-8">
      {/* Stars background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full opacity-20"
            style={{
              width: Math.random() * 2 + 'px',
              height: Math.random() * 2 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animation: `twinkle ${Math.random() * 3 + 2}s infinite`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-2xl">
        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-black text-yellow-400 text-center mb-2 tracking-wider">
          THE MARS CLOCK
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg md:text-xl text-cyan-300 text-center mb-12 tracking-widest">
          TRACKING TIME ON TWO WORLDS
        </p>

        {/* Data Container */}
        <div className="border-2 border-yellow-700 rounded-3xl p-8 md:p-12 bg-gradient-to-b from-gray-900 to-black shadow-2xl">
          {/* Three Column Layout */}
          <div className="grid grid-cols-3 gap-4 md:gap-8">
            {/* Earth Column */}
            <div className="text-center border-r-2 border-gray-700 pr-4 md:pr-8">
              <h2 className="text-xl md:text-2xl font-bold text-yellow-400 mb-6 tracking-wide">
                EARTH
              </h2>
              
              <div className="mb-6">
                <p className="text-gray-400 text-sm tracking-widest mb-2">DAY</p>
                <p className="text-4xl md:text-5xl font-black text-yellow-400">
                  {String(earthData.dayOfYear).padStart(3, '0')}
                </p>
              </div>

              <div className="mb-6">
                <p className="text-gray-400 text-sm tracking-widest mb-2">DATE</p>
                <p className="text-2xl md:text-3xl font-black text-yellow-400 font-mono">
                  {earthData.date}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-sm tracking-widest mb-2">TIME</p>
                <p className="text-3xl md:text-4xl font-black text-yellow-400 font-mono">
                  {earthData.time}
                </p>
              </div>
            </div>

            {/* Mars Day Column */}
            <div className="text-center border-r-2 border-gray-700 px-2 md:px-4">
              <h2 className="text-xl md:text-2xl font-bold text-orange-500 mb-6 tracking-wide">
                MARS DAY
              </h2>
              
              <div className="mb-6">
                <p className="text-gray-400 text-sm tracking-widest mb-2">DAY</p>
                <p className="text-4xl md:text-5xl font-black text-orange-500">
                  {String(marsData.day).padStart(3, '0')}
                </p>
              </div>

              <div className="mb-6">
                <p className="text-gray-400 text-sm tracking-widest mb-2">DATE</p>
                <p className="text-2xl md:text-3xl font-black text-orange-500 font-mono">
                  {marsData.date}
                </p>
              </div>
            </div>

            {/* Sol Column */}
            <div className="text-center pl-4 md:pl-8">
              <h2 className="text-xl md:text-2xl font-bold text-orange-500 mb-6 tracking-wide">
                SOL
              </h2>
              
              <div className="mb-6">
                <p className="text-gray-400 text-sm tracking-widest mb-2">SOL</p>
                <p className="text-4xl md:text-5xl font-black text-orange-500">
                  {String(solData.sol).padStart(2, '0')}
                </p>
              </div>

              <div className="mb-6">
                <p className="text-gray-400 text-sm tracking-widest mb-2">DATE</p>
                <p className="text-2xl md:text-3xl font-black text-orange-500 font-mono">
                  {solData.date}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-sm tracking-widest mb-2">TIME</p>
                <p className="text-3xl md:text-4xl font-black text-orange-500 font-mono">
                  {solData.time}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-8 tracking-wider">
          © 2026 Amanda Murrain | The Mars Clock | themarsclock.com | Using NASA24 Airy for Sol Time
        </p>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
