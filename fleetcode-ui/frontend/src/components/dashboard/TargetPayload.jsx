import React from 'react';
import { Target, ExternalLink } from 'lucide-react';

export default function TargetPayload({ targetData, reason }) {
  if (!targetData) {
    return (
      <div className="bg-fleet-card border border-gray-800 rounded-3xl p-6 h-full flex flex-col justify-center items-center text-gray-500 font-mono text-xs uppercase tracking-widest">
        Awaiting Target Coordinates...
      </div>
    );
  }

  return (
    <div className="bg-[#0a1220] border border-blue-500/30 rounded-3xl p-6 relative overflow-hidden group hover:bg-[#0c1627] transition-all h-full flex flex-col">
      {/* Background Icon */}
      <div className="absolute -right-6 -top-6 text-blue-500/10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
        <Target size={150} />
      </div>

      <div className="relative z-10 flex-grow flex flex-col">
        <h3 className="text-blue-500 font-black text-xs tracking-widest uppercase mb-2 flex items-center gap-2">
          <Target size={14} /> Mission Assigned
        </h3>
        
        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-6">
          Analysis: Vulnerability detected in <br/>
          <span className="text-white font-bold bg-blue-900/50 px-2 py-0.5 rounded mt-1 inline-block border border-blue-500/30">
            {reason}
          </span>
        </p>

        <div className="bg-black/50 border border-gray-800 p-5 rounded-2xl mb-6 flex-grow">
          <p className="font-black text-xl text-white mb-2 leading-tight">
            {targetData.title}
          </p>
          <div className="flex gap-2">
            <span className={`text-[10px] font-black tracking-widest uppercase px-2 py-1 rounded-md ${
              targetData.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
              targetData.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
              'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {targetData.difficulty}
            </span>
          </div>
        </div>

        <a 
          href={targetData.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] text-sm uppercase tracking-widest"
        >
          Engage Target <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );
}