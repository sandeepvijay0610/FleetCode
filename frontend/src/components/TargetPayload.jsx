import React from 'react';
import { Target, ExternalLink } from 'lucide-react';

export default function TargetPayload({ weakness }) {
  const t = {name: "Climbing Stairs", id: "70", diff: "Easy", xp: "+10 XP"};
  return (
    <div className="bg-fleet-card border border-gray-800 rounded-3xl p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <Target size={18} className="text-fleet-radar" />
        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Recommended Strike</h3>
      </div>
      <div className="bg-black/30 border border-gray-800 rounded-2xl p-5 hover:border-fleet-radar transition-all cursor-pointer group">
        <div className="flex justify-between items-start mb-2 text-sm font-black text-white group-hover:text-fleet-radar transition-colors">
          <span>{t.id}. {t.name.toUpperCase()}</span><ExternalLink size={14} />
        </div>
        <div className="flex gap-3 text-[9px] font-black uppercase tracking-widest">
          <span className="text-green-500 bg-green-950/20 px-2 py-1 rounded-md">{t.diff}</span>
          <span className="text-fleet-accent bg-fleet-accent/10 px-2 py-1 rounded-md">{t.xp}</span>
        </div>
      </div>
    </div>
  );
}