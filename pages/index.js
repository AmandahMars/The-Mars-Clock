import { useState, useEffect } from 'react';

export default function Home() {
  const [earthData, setEarthData] = useState({
    day: 0,
    date: '00.00.00',
    time: '00:00'
  });

  const [marsData, setMarsData] = useState({
    day: 0,
    date: '00.00',
    time: '00:00'
  });

  const [marsSol, setMarsSol] = useState({
    sol: 0,
    date: '00.00',
    time: '00:00'
  });

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();

      // Earth Day of Year
      const startOfYear = new Date(now.getFullYear(), 0, 0);
      const diff = now - startOfYear;
      const oneDay = 1000 * 60 * 60 * 24;
      const dayOfYear = Math.floor(diff / oneDay);

      // Earth Date and Time
      const year = now.getFullYear().toString().slice(-2);
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');

      setEarthData({
        day: dayOfYear,
        date: `${month}.${day}.${year}`,
        time: `${hours}:${minutes}`
      });

      // NASA Mars24 Algorithm
      const J2000 = 2451545.0;
      const jd = (now.getTime() / 86400000) + 2440587.5;
      
      // Mars Mean Solar Time
      const marsSolarLongitude = 19.3871;
      const marsYearStart = 2442165.5;
      const marsYearLength = 668.5921;
      
      const daysSinceMarsYearStart = jd - marsYearStart;
      const marsYear = Math.floor(daysSinceMarsYearStart / marsYearLength) + 1;
      const dayInMarsYear = daysSinceMarsYearStart % marsYearLength;
      
      const marsMeanSolarTime = (24 * dayInMarsYear) % 24;
      const marsHours = Math.floor(marsMeanSolarTime);
      const marsMinutes = Math.floor((marsMeanSolarTime - marsHours) * 60);
      
      // Mars Day counter
      const totalMarsDays = daysSinceMarsYearStart;
      const marsDayCounter = Math.floor(totalMarsDays) + 1;

      // Mars Date format
      const marsDateDay = (Math.floor(dayInMarsYear) % 668) + 1;
      const marsDateMonth = Math.floor(marsDateDay / 28) + 1;
      const marsDateDayOfMonth = (marsDateDay % 28) || 28;

      setMarsData({
        day: marsDayCounter,
        date: `${String(marsDateMonth).padStart(2, '0')}.${String(marsDateDayOfMonth).padStart(2, '0')}`,
        time: `${String(marsHours).padStart(2, '0')}:${String(marsMinutes).padStart(2, '0')}`
      });

      // Mars Sol
      const roverStart = new Date(2012, 7, 5).getTime();
      const solsSinceRover = Math.floor((now.getTime() - roverStart) / 88775244);
      const roverSol = solsSinceRover + 1;
      
      setMarsSol({
        sol: roverSol,
        date: `${String((roverSol % 28) || 28).padStart(2, '0')}.${String(Math.floor((roverSol % 668) / 28) + 1).padStart(2, '0')}`,
        time: `${String(marsHours).padStart(2, '0')}:${String(marsMinutes).padStart(2, '0')}`
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
                  {String(earthData.day).padStart(3, '0')}
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

              <div>
                <p className="text-gray-400 text-sm tracking-widest mb-2">TIME</p>
                <p className="text-3xl md:text-4xl font-black text-orange-500 font-mono">
                  {marsData.time}
                </p>
              </div>
            </div>

            {/* Mars Sol Column */}
            <div className="text-center pl-4 md:pl-8">
              <h2 className="text-xl md:text-2xl font-bold text-orange-500 mb-6 tracking-wide">
                MARS SOL
              </h2>
              
              <div className="mb-6">
                <p className="text-gray-400 text-sm tracking-widest mb-2">SOL</p>
                <p className="text-4xl md:text-5xl font-black text-orange-500">
                  {String(marsSol.sol).padStart(2, '0')}
                </p>
              </div>

              <div className="mb-6">
                <p className="text-gray-400 text-sm tracking-widest mb-2">DATE</p>
                <p className="text-2xl md:text-3xl font-black text-orange-500 font-mono">
                  {marsSol.date}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-sm tracking-widest mb-2">TIME</p>
                <p className="text-3xl md:text-4xl font-black text-orange-500 font-mono">
                  {marsSol.time}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-8 tracking-wider">
          Using NASA Mars24 Algorithm
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
