'use client';

import { useEffect, useState } from 'react';
import { calculateMarsTime } from '@/lib/mars';

export default function Home() {
  const [time, setTime] = useState<any>(null);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    const updateTime = () => {
      const mars = calculateMarsTime();
      setTime(mars);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <p className="text-white text-lg">Loading Mars Clock...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-800 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-yellow-300 mb-2">
            THE MARS CLOCK
          </h1>
          <p className="text-cyan-300 text-lg sm:text-xl tracking-widest mb-2">
            TRACKING TIME ON TWO WORLDS
          </p>
          
          {/* Live Indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></div>
            <span className="text-green-400 uppercase text-sm font-semibold tracking-wider">
              LIVE
            </span>
          </div>
          
          <p className="text-gray-400 text-sm">Updated every second</p>
        </div>

        {/* Current Readout Section */}
        <div className="mb-12">
          <h2 className="text-amber-600 text-lg sm:text-xl font-bold mb-6 text-center">
            CURRENT READOUT
          </h2>
          
          {/* Desktop: 3-column layout */}
          <div className="hidden md:grid grid-cols-3 gap-6 mb-8">
            {/* Earth Card */}
            <div className="bg-slate-800/50 border-2 border-amber-600 rounded-2xl p-6">
              <h3 className="text-amber-600 text-sm font-bold tracking-wider mb-4">EARTH</h3>
              
              <div className="mb-6">
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Day of Year</p>
                <p className="text-yellow-300 text-3xl font-bold">{time.earth.dayOfYear}</p>
              </div>
              
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Time</p>
                <p className="text-yellow-300 text-2xl font-bold font-mono">
                  {String(time.earth.hours).padStart(2, '0')}:{String(time.earth.minutes).padStart(2, '0')}:{String(time.earth.seconds).padStart(2, '0')}
                </p>
                <p className="text-gray-500 text-xs mt-2">BST</p>
              </div>
              
              <p className="text-gray-400 text-xs mt-4 leading-relaxed">
                {time.earth.dateString}
              </p>
            </div>

            {/* Mars Day Card */}
            <div className="bg-slate-800/50 border-2 border-amber-600 rounded-2xl p-6">
              <h3 className="text-amber-600 text-sm font-bold tracking-wider mb-2">MARS DAY</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Day</p>
                  <p className="text-yellow-300 text-2xl font-bold">{time.mars.day}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Mars Date</p>
                  <p className="text-yellow-300 text-2xl font-bold">{time.mars.dateFormatted}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Time</p>
                <p className="text-yellow-300 text-xl font-bold font-mono">
                  {String(time.mars.hours).padStart(2, '0')}:{String(time.mars.minutes).padStart(2, '0')}
                </p>
              </div>
              
              <p className="text-gray-400 text-xs leading-relaxed">
                Day count and date within the 687-day Mars year, using Amanda Yahsarael's calendar system.
              </p>
            </div>

            {/* Mars Sol Card */}
            <div className="bg-slate-800/50 border-2 border-amber-600 rounded-2xl p-6">
              <h3 className="text-amber-600 text-sm font-bold tracking-wider mb-2">MARS SOL</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Sol</p>
                  <p className="text-yellow-300 text-2xl font-bold">{time.sol.day}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Mars Date</p>
                  <p className="text-yellow-300 text-2xl font-bold">{time.sol.dateFormatted}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">MTC / AIRY-0</p>
                <p className="text-yellow-300 text-xl font-bold font-mono">
                  {String(time.sol.hours).padStart(2, '0')}:{String(time.sol.minutes).padStart(2, '0')}:{String(time.sol.seconds).padStart(2, '0')}
                </p>
              </div>
            </div>
          </div>

          {/* Mobile: Stacked layout */}
          <div className="md:hidden space-y-4">
            {/* Earth Card */}
            <div className="bg-slate-800/50 border-2 border-amber-600 rounded-2xl p-4">
              <h3 className="text-amber-600 text-sm font-bold tracking-wider mb-3">EARTH</h3>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Day of Year</p>
                  <p className="text-yellow-300 text-2xl font-bold">{time.earth.dayOfYear}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Time</p>
                  <p className="text-yellow-300 text-lg font-bold font-mono">
                    {String(time.earth.hours).padStart(2, '0')}:{String(time.earth.minutes).padStart(2, '0')}:{String(time.earth.seconds).padStart(2, '0')}
                  </p>
                </div>
              </div>
              <p className="text-gray-500 text-xs mb-2">BST</p>
              <p className="text-gray-400 text-xs">{time.earth.dateString}</p>
            </div>

            {/* Mars Day Card */}
            <div className="bg-slate-800/50 border-2 border-amber-600 rounded-2xl p-4">
              <h3 className="text-amber-600 text-sm font-bold tracking-wider mb-3">MARS DAY</h3>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Day</p>
                  <p className="text-yellow-300 text-2xl font-bold">{time.mars.day}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Mars Date</p>
                  <p className="text-yellow-300 text-2xl font-bold">{time.mars.dateFormatted}</p>
                </div>
              </div>
              <div className="mb-3">
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Time</p>
                <p className="text-yellow-300 text-lg font-bold font-mono">
                  {String(time.mars.hours).padStart(2, '0')}:{String(time.mars.minutes).padStart(2, '0')}
                </p>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">
                Day count and date within the 687-day Mars year, using Amanda Yahsarael's calendar system.
              </p>
            </div>

            {/* Mars Sol Card */}
            <div className="bg-slate-800/50 border-2 border-amber-600 rounded-2xl p-4">
              <h3 className="text-amber-600 text-sm font-bold tracking-wider mb-3">MARS SOL</h3>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Sol</p>
                  <p className="text-yellow-300 text-2xl font-bold">{time.sol.day}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Mars Date</p>
                  <p className="text-yellow-300 text-2xl font-bold">{time.sol.dateFormatted}</p>
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">MTC / AIRY-0</p>
                <p className="text-yellow-300 text-lg font-bold font-mono">
                  {String(time.sol.hours).padStart(2, '0')}:{String(time.sol.minutes).padStart(2, '0')}:{String(time.sol.seconds).padStart(2, '0')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-amber-600/30 pt-8 mt-12 text-center space-y-2">
          <p className="text-amber-600">
            <span className="font-bold">The Mars Clock:</span>
            <span className="text-cyan-300"> Mars day, Mars date, sol and sol date follow Amanda Yahsarael's calendar system.</span>
          </p>
          <p className="text-amber-600">
            <span className="font-bold">Mars solar time:</span>
            <span className="text-cyan-300"> MTC calculated using the NASA Mars24 Airy-0 method.</span>
          </p>
          <p className="text-gray-400 text-sm">
            NASA Mars24 is acknowledged for the solar-time calculation method only.
          </p>
        </footer>
      </div>
    </div>
  );
}
