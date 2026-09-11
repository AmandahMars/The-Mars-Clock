import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            The Mars Clock
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Real-time Earth and Mars time synchronization
          </p>
          <p className="text-gray-400">
            Using NASA Mars24 Algorithm
          </p>
        </div>
      </div>
    </div>
  );
}
