import React from 'react';
import { Target, ExternalLink } from 'lucide-react';
import { MOCK_TARGET_PAYLOAD } from '../../data/mockData.js';

export default function TargetPayload() {
  const t = MOCK_TARGET_PAYLOAD;
  
  // Format the LeetCode URL string (e.g., "Climbing Stairs" -> "climbing-stairs")
  const problemSlug = t.name.toLowerCase().replace(/\s+/g, '-');
  const leetcodeUrl = `https://leetcode.com/problems/${problemSlug}/`;

  return (
    <div className="bg-fleet-card border border-gray-800 rounded-3xl p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <Target size={18} className="text-blue-500" />
        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Recommended Strike</h3>
      </div>
      
      {/* Wrap the clickable area in an anchor tag */}
      <a 
        href={leetcodeUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block bg-black/30 border border-gray-800 rounded-2xl p-5 hover:border-blue-500 transition-all cursor-pointer group"
      >
        <div className="flex justify-between items-start mb-2 text-sm font-black text-white group-hover:text-blue-500 transition-colors">
          <span>{t.id}. {t.name.toUpperCase()}</span>
          <ExternalLink size={14} className="opacity-50 group-hover:opacity-100" />
        </div>
        <div className="flex gap-3 text-[9px] font-black uppercase tracking-widest">
          <span className="text-green-500 bg-green-950/20 px-2 py-1 rounded-md">{t.diff}</span>
          <span className="text-green-400 bg-green-400/10 px-2 py-1 rounded-md">{t.xp}</span>
        </div>
      </a>
    </div>
  );
}