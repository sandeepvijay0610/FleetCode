import React from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, // <-- Added this to fix the web proportions
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';
import { MOCK_RADAR_DB } from '../../data/mockData.js';

export default function MuscleMap({ target }) {
  // Fallback to "Team" if the user clicks a teammate that doesn't exist in our mock DB yet
  const activeData = MOCK_RADAR_DB[target] || MOCK_RADAR_DB["Team"];
  const radarColor = target === "Team" ? "#10B981" : "#3B82F6"; 

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-grow min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart 
            cx="50%" 
            cy="50%" 
            outerRadius="70%" 
            data={activeData} 
            margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
          >
            {/* 1. Explicitly setting gridType and brightening the web color so it's visible */}
            <PolarGrid gridType="polygon" stroke="#334155" strokeWidth={1.5} />
            
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 'bold' }} 
            />
            
            {/* 2. Adding a fixed Radius Axis ensures the spiderweb is perfectly symmetrical */}
            <PolarRadiusAxis 
              angle={30} 
              domain={[0, 150]} // Locks the outer edge to a max of 150 XP
              tick={false} 
              axisLine={false} 
            />
            
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} 
              itemStyle={{ color: radarColor, fontWeight: 'bold' }}
            />
            
            <Radar 
              name={target} 
              dataKey="A" 
              stroke={radarColor} 
              strokeWidth={3} 
              fill={radarColor} 
              fillOpacity={0.4} 
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      
      {(target === "Team" || target === "Teammate_2") && (
        <div className="mt-4 p-3 bg-red-950/20 border border-red-900/40 rounded-xl text-center">
          <p className="text-[10px] text-red-500 font-black uppercase tracking-[0.2em]">⚠️ Critical Vulnerability: Dynamic Programming</p>
        </div>
      )}
    </div>
  );
}