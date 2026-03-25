import React from 'react';

export default function StatCard({ icon, label, value, suffix, color }) {
  return (
    <div className="bg-fleet-card border border-gray-800 p-5 rounded-2xl flex items-center gap-5 shadow-lg h-24 min-w-[190px] flex-1">
      <div className={`${color} p-3 bg-black/40 rounded-xl`}>{icon}</div>
      <div>
        <p className="text-[10px] uppercase text-gray-500 font-bold tracking-widest mb-1">{label}</p>
        <p className={`text-2xl font-black ${color}`}>{value}<span className="text-xs font-normal ml-1 opacity-50">{suffix}</span></p>
      </div>
    </div>
  );
}