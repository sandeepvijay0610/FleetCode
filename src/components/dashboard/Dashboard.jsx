import React, { useState } from 'react';
import { Shield, Zap, TrendingUp } from 'lucide-react';
import MuscleMap from './MuscleMap.jsx';
import SpotterModal from './SpotterModal.jsx'; 
import TargetPayload from './TargetPayload.jsx';
import StatCard from '../common/StartCard.jsx';
import ActivityItem from '../common/ActivityItem.jsx';
import { FleetCodeAPI } from '../../services/api.js';
import { MOCK_SQUAD_STATS, MOCK_SQUAD_MATES, MOCK_LIVE_ACTIVITY } from '../../data/mockData.js';

export default function Dashboard({ username, activeSquad }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [radarTarget, setRadarTarget] = useState("Team");

  // Real API integration for the Spotter Protocol
  const handleSpotTeammate = async (targetUser) => {
    try {
      // Pass the rescuer (active user), target, and a placeholder squad ID
      await FleetCodeAPI.spotTeammate(username, targetUser, "squad_1");
      alert(`Rescue successfully initiated for ${targetUser}!`);
      setIsModalOpen(false); // Close the modal on success
    } catch (error) {
      console.error("Rescue failed:", error);
      alert("Failed to initiate rescue protocol. System error.");
    }
  };

  return (
    <div className="bg-fleet-bg text-white p-4 lg:p-10 flex flex-col items-center">
      <div className="w-full max-w-[1600px]">
        
        {/* Uniform Stats Header */}
        <div className="flex flex-col lg:flex-row justify-between items-end mb-8 border-b border-gray-800 pb-8 gap-6">
          <div className="space-y-1">
            <h1 className="text-6xl font-black tracking-tighter text-white italic">OPERATIONS</h1>
            <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">
  Sector: Global // Squad: <span className="text-green-400">{activeSquad || MOCK_SQUAD_STATS.name}</span>
</p>
          </div>
          
          <div className="flex flex-wrap md:flex-nowrap gap-4 w-full lg:w-auto">
              <StatCard label="Active Streak" value={MOCK_SQUAD_STATS.streak} suffix="Days" icon={<Zap size={22} />} color="text-yellow-400" />
              <StatCard label="Global Rank" value={`#${MOCK_SQUAD_STATS.rank}`} icon={<TrendingUp size={22} />} color="text-blue-500" />
              <StatCard label="Squad Score" value={MOCK_SQUAD_STATS.score.toLocaleString()} suffix="XP" icon={<Shield size={22} />} color="text-green-400" />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Radar Column */}
          <div className="col-span-12 lg:col-span-8">
            <div className="bg-fleet-card border border-gray-800 rounded-3xl p-8 h-[650px] flex flex-col shadow-2xl relative">
              <div className="flex justify-between items-start mb-8">
                <div>
                   <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Biometric Analysis</h2>
                   <p className="text-xs text-gray-500 font-mono tracking-widest">Target: {radarTarget}</p>
                </div>
                {radarTarget !== "Team" && (
                  <button onClick={() => setRadarTarget("Team")} className="text-[10px] font-bold bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-full border border-white/10 transition-all uppercase">Reset to Squad</button>
                )}
              </div>
              <div className="flex-grow min-h-0"><MuscleMap target={radarTarget} /></div>
            </div>
          </div>

          {/* Comms Column */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            <div className="bg-fleet-card border border-gray-800 rounded-3xl p-6 flex-grow shadow-xl">
              <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-6 border-b border-gray-800 pb-4">Live Activity</h3>
              <div className="space-y-3">
                {MOCK_LIVE_ACTIVITY.map((activity, idx) => (
                  <ActivityItem 
                    key={idx} 
                    user={activity.user || username} 
                    problem={activity.problem} 
                    time={activity.time} 
                    onClick={setRadarTarget} 
                  />
                ))}
              </div>
            </div>

            <div className="bg-red-900/10 border border-red-500/30 rounded-3xl p-6">
              <h3 className="text-red-500 font-black text-xs tracking-widest uppercase mb-2">Spotter Protocol</h3>
              <p className="text-[10px] text-gray-500 mb-6 uppercase leading-relaxed">System identifies teammate drift. Deploy intervention?</p>
              <button onClick={() => setIsModalOpen(true)} className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-black rounded-xl transition-all shadow-lg text-sm">SPOT TEAMMATE</button>
            </div>

            <TargetPayload />
          </div>
        </div>
      </div>
      
      {/* Spotter Modal with the real API handler attached */}
      <SpotterModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleSpotTeammate} 
        teammates={MOCK_SQUAD_MATES} 
      />
    </div>
  );
}