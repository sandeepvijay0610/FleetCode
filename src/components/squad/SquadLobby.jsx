import React, { useState } from 'react';
import { Terminal, ArrowRight, Loader2 } from 'lucide-react';
// import { FleetCodeAPI } from '../../services/api.js'; // Commented out for placeholder testing

export default function SquadLobby({ username, onSquadSelected }) {
  const [activeTab, setActiveTab] = useState('join');
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async () => {
    if (!inputValue.trim()) {
      setErrorMsg(activeTab === 'join' ? "Enter a valid Designation ID" : "Enter a Squad Name");
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      // --- MOCKED API LOGIC FOR PLACEHOLDER TESTING ---
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate 1.5s network delay
      
      if (inputValue.toLowerCase() === 'error') {
        throw new Error(activeTab === 'join' ? 'Squad not found.' : 'Squad name taken.');
      }
      
      // If successful, pass the squad info up to App.jsx
      onSquadSelected(inputValue);

      // --- REAL API LOGIC (Uncomment when backend is ready) ---
      /*
      if (activeTab === 'join') {
        await FleetCodeAPI.joinSquad(username, inputValue);
      } else {
        await FleetCodeAPI.createSquad(username, inputValue);
      }
      onSquadSelected(inputValue); // Store the squad name/id in your app state
      */

    } catch (err) {
      setErrorMsg(err.message || 'Transmission failed. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-fleet-bg flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-fleet-card border border-gray-800 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-green-400" />
        
        <div className="text-center mb-10">
          <Terminal className="text-green-400 mx-auto mb-4" size={32} />
          <h1 className="text-2xl font-black text-white tracking-widest uppercase italic">Squad Lobby</h1>
          <p className="text-gray-500 font-mono text-[10px] mt-2 uppercase tracking-widest">Linked Operator: <span className="text-white font-bold">{username}</span></p>
        </div>

        <div className="flex bg-black/40 rounded-xl p-1.5 mb-8 border border-gray-800">
          <button 
            onClick={() => { setActiveTab('join'); setErrorMsg(''); setInputValue(''); }} 
            className={`flex-1 py-3 text-xs font-black rounded-lg transition-all ${activeTab === 'join' ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
          >
            JOIN SQUAD
          </button>
          <button 
            onClick={() => { setActiveTab('create'); setErrorMsg(''); setInputValue(''); }} 
            className={`flex-1 py-3 text-xs font-black rounded-lg transition-all ${activeTab === 'create' ? 'bg-green-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
          >
            FORM SQUAD
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 block">
              {activeTab === 'join' ? "Designation ID" : "Designation Name"}
            </label>
            <input 
              type="text" 
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)} 
              placeholder={activeTab === 'join' ? "e.g., SQUAD-1234" : "e.g., Fleet Unit Alpha"} 
              className="w-full bg-fleet-bg border border-gray-800 text-white rounded-xl px-4 py-4 focus:outline-none focus:border-gray-500 font-mono text-sm transition-all"
              disabled={isLoading}
            />
          </div>

          {errorMsg && <p className="text-red-500 text-xs font-bold text-center">{errorMsg}</p>}

          <button 
            onClick={handleSubmit} 
            disabled={isLoading}
            className={`w-full py-5 text-white font-black rounded-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 ${activeTab === 'join' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'}`}
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
              <>{activeTab === 'join' ? 'ESTABLISH LINK' : 'INITIALIZE SQUAD'} <ArrowRight size={20} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}