import React, { useState } from 'react';
import { Shield, Users, ArrowRight, Terminal } from 'lucide-react';

export default function SquadLobby({ username, onSquadSelected }) {
  const [activeTab, setActiveTab] = useState('join');
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="min-h-screen bg-fleet-bg flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-fleet-card border border-gray-800 rounded-3xl p-10 shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-fleet-radar to-fleet-accent" />
        <div className="text-center mb-10">
          <Terminal className="text-fleet-accent mx-auto mb-4" size={32} />
          <h1 className="text-2xl font-black text-white tracking-widest uppercase italic">Squad Lobby</h1>
          <p className="text-gray-500 font-mono text-[10px] mt-2 uppercase tracking-widest">Linked Operator: {username}</p>
        </div>

        <div className="flex bg-black/40 rounded-xl p-1.5 mb-8 border border-gray-800">
          <button onClick={() => setActiveTab('join')} className={`flex-1 py-3 text-xs font-black rounded-lg transition-all ${activeTab === 'join' ? 'bg-fleet-radar text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>JOIN SQUAD</button>
          <button onClick={() => setActiveTab('create')} className={`flex-1 py-3 text-xs font-black rounded-lg transition-all ${activeTab === 'create' ? 'bg-fleet-accent text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>FORM SQUAD</button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 block">Designation Name</label>
            <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder={activeTab === 'join' ? "TEE-1234" : "Fleet Unit Alpha"} className="w-full bg-fleet-bg border border-gray-800 text-white rounded-xl px-4 py-4 focus:outline-none focus:border-gray-500 font-mono text-sm" />
          </div>
          <button onClick={onSquadSelected} className={`w-full py-5 text-white font-black rounded-xl transition-all flex items-center justify-center gap-3 ${activeTab === 'join' ? 'bg-fleet-radar shadow-blue-500/10' : 'bg-fleet-accent shadow-emerald-500/10'}`}>ESTABLISH LINK <ArrowRight size={20} /></button>
        </div>
      </div>
    </div>
  );
}