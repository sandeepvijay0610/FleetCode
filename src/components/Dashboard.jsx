import React, { useState } from 'react';
import { Activity, Shield, Zap, TrendingUp } from 'lucide-react';
import MuscleMap from './MuscleMap';
import SpotterModal from './SpotterModal'; 
import TargetPayload from './TargetPayload';

export default function Dashboard({ username }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [radarTarget, setRadarTarget] = useState("Team");
  const squadMates = ["Teammate_2", "Teammate_3", "Teammate_4"];

  const squadStats = { name: "Tee-Toddlers", score: 14250, rank: 4, streak: 12 };

  return (
    <div className="bg-fleet-bg text-white p-4 lg:p-10 flex flex-col items-center">
      <div className="w-full max-w-[1600px]">
        
        {/* Uniform Stats Header */}
        <div className="flex flex-col lg:flex-row justify-between items-end mb-8 border-b border-gray-800 pb-8 gap-6">
          <div className="space-y-1">
            <h1 className="text-6xl font-black tracking-tighter text-white italic">OPERATIONS</h1>
            <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">Sector: Global // Squad: <span className="text-fleet-accent">{squadStats.name}</span></p>
          </div>
          
          <div className="flex flex-wrap md:flex-nowrap gap-4 w-full lg:w-auto">
              <StatCard label="Active Streak" value={squadStats.streak} suffix="Days" icon={<Zap size={22} />} color="text-yellow-400" />
              <StatCard label="Global Rank" value={`#${squadStats.rank}`} icon={<TrendingUp size={22} />} color="text-fleet-radar" />
              <StatCard label="Squad Score" value={squadStats.score.toLocaleString()} suffix="XP" icon={<Shield size={22} />} color="text-fleet-accent" />
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
                <ActivityItem user={username} problem="Two Sum" time="2m ago" onClick={setRadarTarget} />
                <ActivityItem user="Teammate_2" problem="LRU Cache" time="1h ago" onClick={setRadarTarget} />
                <ActivityItem user="Teammate_3" problem="Valid Anagram" time="4h ago" onClick={setRadarTarget} />
                <ActivityItem user="Teammate_4" problem="Rain Water" time="12h ago" onClick={setRadarTarget} />
              </div>
            </div>

            <div className="bg-fleet-danger/5 border border-fleet-danger/30 rounded-3xl p-6">
              <h3 className="text-fleet-danger font-black text-xs tracking-widest uppercase mb-2">Spotter Protocol</h3>
              <p className="text-[10px] text-gray-500 mb-6 uppercase leading-relaxed">System identifies teammate drift. Deploy intervention?</p>
              <button onClick={() => setIsModalOpen(true)} className="w-full py-4 bg-fleet-danger hover:bg-red-600 text-white font-black rounded-xl transition-all shadow-lg text-sm">SPOT TEAMMATE</button>
            </div>

            <TargetPayload weakness="Dynamic Programming" />
          </div>
        </div>
      </div>
      <SpotterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={(u) => console.log(u)} teammates={squadMates} />
    </div>
  );
}

function StatCard({ icon, label, value, suffix, color }) {
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

function ActivityItem({ user, problem, time, onClick }) {
  return (
    <div onClick={() => onClick(user)} className="flex justify-between items-center p-4 bg-black/20 rounded-xl border border-transparent hover:border-gray-700 transition-all cursor-pointer group">
      <div>
        <p className="text-sm font-black text-gray-300 group-hover:text-white">{user}</p>
        <p className="text-[10px] text-fleet-radar uppercase font-mono">{problem}</p>
      </div>
      <span className="text-[9px] text-gray-600 font-mono uppercase">{time}</span>
    </div>
  );
}