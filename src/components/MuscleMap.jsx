import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';

const mockDatabase = {
  "Team": [{subject:'Arrays',A:120},{subject:'DP',A:40},{subject:'Trees',A:85},{subject:'Strings',A:110},{subject:'Math',A:90},{subject:'Graphs',A:65}],
  "Sandeep": [{subject:'Arrays',A:140},{subject:'DP',A:120},{subject:'Trees',A:90},{subject:'Strings',A:100},{subject:'Math',A:130},{subject:'Graphs',A:80}],
  "Teammate_2": [{subject:'Arrays',A:80},{subject:'DP',A:10},{subject:'Trees',A:40},{subject:'Strings',A:60},{subject:'Math',A:30},{subject:'Graphs',A:20}]
};

export default function MuscleMap({ target }) {
  const activeData = mockDatabase[target] || mockDatabase["Team"];
  const radarColor = target === "Team" ? "#10B981" : "#3B82F6"; 

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-grow min-h-0"><ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={activeData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
            <PolarGrid stroke="#1e293b" strokeWidth={2} />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 12, fontWeight: 'bold' }} />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} />
            <Radar name={target} dataKey="A" stroke={radarColor} strokeWidth={4} fill={radarColor} fillOpacity={0.5} />
          </RadarChart>
      </ResponsiveContainer></div>
      {(target === "Team" || target === "Teammate_2") && (
        <div className="mt-4 p-3 bg-red-950/20 border border-red-900/40 rounded-xl text-center">
          <p className="text-[10px] text-red-500 font-black uppercase tracking-[0.2em]">⚠️ Critical Vulnerability: Dynamic Programming</p>
        </div>
      )}
    </div>
  );
}