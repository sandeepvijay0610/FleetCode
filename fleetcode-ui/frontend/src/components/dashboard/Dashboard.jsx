import React, { useState, useEffect } from 'react';
import { Flame, Trophy, Activity, Loader2, Users } from 'lucide-react';
import { FleetCodeAPI } from '../../services/api';
import MuscleMap from './MuscleMap';
import TargetPayload from './TargetPayload';

export default function Dashboard({ username }) {
  const [squadData, setSquadData] = useState(null);

  useEffect(() => {
    const fetchTelemetry = async () => {
      const data = await FleetCodeAPI.getDashboard(username);
      if (data?.hasSquad) setSquadData(data);
    };
    fetchTelemetry();
  }, [username]);

  if (!squadData) return <div className="p-20 text-center text-blue-500 animate-pulse font-mono">INITIALIZING NEURAL LINK...</div>;

  const myData = squadData.roster.find(r => r.fleetCodeId === username);

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* 1. TOP STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={<Activity/>} label="SQUAD XP" val={squadData.score} color="blue" />
        <StatCard icon={<Trophy/>} label="GLOBAL RANK" val={`#${squadData.rank}`} color="yellow" />
        <StatCard icon={<Flame/>} label="STREAK" val={`${squadData.streak} DAYS`} color="orange" />
      </div>

      {/* 2. MAIN MISSION CONTROL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        <div className="lg:col-span-2 bg-fleet-card border border-gray-800 rounded-3xl p-8">
          <h2 className="text-white font-black uppercase tracking-[0.2em] text-xs mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></span> Your Personal Muscle Map
          </h2>
          <div className="h-[400px]">
            <MuscleMap data={myData.muscleMap} />
          </div>
        </div>
        <TargetPayload targetData={squadData.target} reason={squadData.weakestTopic} />
      </div>

      {/* 3. TEAM ROSTER & GLYPHS */}
      <div className="space-y-4">
        <h2 className="text-gray-500 font-black uppercase tracking-[0.2em] text-xs flex items-center gap-2 px-2">
          <Users size={14}/> Squad Roster // Sub-Unit Comparisons
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {squadData.roster.map(member => (
            <div key={member.fleetCodeId} className={`p-6 rounded-2xl border transition-all ${member.fleetCodeId === username ? 'bg-blue-500/5 border-blue-500/30' : 'bg-fleet-card border-gray-800 hover:border-gray-700'}`}>
              <p className="text-white font-black uppercase tracking-tighter text-sm mb-4 truncate">
                {member.fleetCodeId} {member.fleetCodeId === username && "(YOU)"}
              </p>
              <div className="h-[150px] pointer-events-none opacity-80">
                <MuscleMap data={member.muscleMap} isMini />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ icon, label, val, color }) => (
  <div className="bg-fleet-card border border-gray-800 p-6 rounded-2xl flex items-center gap-4">
    <div className={`bg-${color}-900/20 p-3 rounded-lg text-${color}-500 border border-${color}-500/20`}>{icon}</div>
    <div>
      <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-black text-white">{val.toLocaleString()}</p>
    </div>
  </div>
);