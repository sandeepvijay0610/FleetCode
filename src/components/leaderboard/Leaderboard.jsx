import React from 'react';
import { Medal } from 'lucide-react';
import { MOCK_LEADERBOARD } from '../../data/mockData.js';

export default function Leaderboard({ currentSquad }) {
  return (
    <div className="bg-fleet-bg text-white p-4 lg:p-10 flex flex-col items-center">
      <div className="w-full max-w-[1200px]">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-black text-white italic tracking-tighter mb-2">GLOBAL LADDER</h1>
          <p className="text-gray-500 font-mono uppercase tracking-[0.3em] text-[10px]">Top Ranked Units // Season One</p>
        </div>
        
        <div className="bg-fleet-card border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-8 border-b border-gray-800 bg-black/40 text-[10px] font-black text-gray-500 uppercase tracking-widest">
            <div className="col-span-1 text-center">Pos</div>
            <div className="col-span-6">Designation</div>
            <div className="col-span-2 text-center">Total XP</div>
            <div className="col-span-3 text-center">Status</div>
          </div>
          
          {/* Table Rows */}
          <div className="divide-y divide-gray-800/50">
            {MOCK_LEADERBOARD.map((s) => {
              // Check if this row is the user's active squad
              const isMySquad = s.name === currentSquad;

              return (
                <div 
                  key={s.rank} 
                  className={`grid grid-cols-12 gap-4 p-8 items-center transition-all ${
                    isMySquad 
                      ? 'bg-blue-500/5 border-l-4 border-blue-500' 
                      : 'border-l-4 border-transparent hover:bg-white/5'
                  }`}
                >
                  <div className="col-span-1 flex justify-center">
                    {s.rank === 1 ? <Medal className="text-yellow-400" /> : <span className="font-black text-gray-500">#{s.rank}</span>}
                  </div>
                  
                  <div className="col-span-6">
                    <p className={`font-black text-lg ${isMySquad ? 'text-blue-500' : 'text-white'}`}>
                      {s.name.toUpperCase()}
                      {isMySquad && <span className="ml-3 text-[9px] bg-blue-500 text-white px-2 py-1 rounded-md uppercase tracking-widest">Your Squad</span>}
                    </p>
                  </div>
                  
                  <div className="col-span-2 text-center font-mono font-bold text-green-400">
                    {s.score.toLocaleString()}
                  </div>
                  
                  <div className="col-span-3 text-center text-[10px] text-gray-500 font-mono">
                    {s.streak} DAY STREAK
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}