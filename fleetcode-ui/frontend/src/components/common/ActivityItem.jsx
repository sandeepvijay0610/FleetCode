import React from 'react';

export default function ActivityItem({ user, problem, time, onClick }) {
  return (
    <div onClick={() => onClick(user)} className="flex justify-between items-center p-4 bg-black/20 rounded-xl border border-transparent hover:border-gray-700 transition-all cursor-pointer group">
      <div>
        <p className="text-sm font-black text-gray-300 group-hover:text-white">{user}</p>
        <p className="text-[10px] text-blue-400 uppercase font-mono">{problem}</p>
      </div>
      <span className="text-[9px] text-gray-600 font-mono uppercase">{time}</span>
    </div>
  );
}