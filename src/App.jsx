import React, { useState } from 'react';
import './index.css';
import AuthForm from './components/AuthForm';
import SquadLobby from './components/SquadLobby';
import Dashboard from './components/Dashboard';
import Leaderboard from './components/LeaderBoard'; 
import { Trophy, LayoutDashboard, LogOut } from 'lucide-react';

function App() {
  // --- SESSION MANAGEMENT ---
  const [activeUser, setActiveUser] = useState(() => localStorage.getItem('fleetcode_user') || null);
  const [hasSquad, setHasSquad] = useState(false); 
  const [currentView, setCurrentView] = useState('dashboard'); 

  // Stage 1: Standard Login / Register
  if (!activeUser) {
    return (
      <AuthForm 
        onVerified={(username) => {
          setActiveUser(username);
          localStorage.setItem('fleetcode_user', username);
        }} 
      />
    );
  }

  // Stage 2: Squad Lobby (Create/Join)
  if (activeUser && !hasSquad) {
    return <SquadLobby username={activeUser} onSquadSelected={() => setHasSquad(true)} />;
  }

  // Stage 3: The Application
  return (
    <div className="min-h-screen bg-fleet-bg flex flex-col relative">
      <nav className="border-b border-gray-800 bg-fleet-card px-6 py-4 flex justify-between items-center z-40 relative">
        <div className="text-fleet-accent font-black text-xl tracking-wide italic underline decoration-fleet-radar underline-offset-4">FleetCode</div>
        
        <div className="flex items-center gap-4">
          <div className="text-xs font-mono text-gray-500 uppercase tracking-widest bg-black/30 px-3 py-1.5 rounded border border-gray-800">
            Operator: <span className="text-white font-bold">{activeUser}</span>
          </div>
          
          <button 
            onClick={() => {
              if(window.confirm("Abandon current session?")) {
                setActiveUser(null);
                setHasSquad(false);
                localStorage.removeItem('fleetcode_user');
              }
            }}
            className="text-gray-500 hover:text-fleet-danger transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>

      <div className="flex-grow pb-24">
        {currentView === 'dashboard' && <Dashboard username={activeUser} />}
        {currentView === 'leaderboard' && <Leaderboard />}
      </div>

      {/* Floating Toggle Navigation */}
      <button 
        onClick={() => setCurrentView(currentView === 'dashboard' ? 'leaderboard' : 'dashboard')}
        className="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-fleet-radar hover:bg-blue-600 text-white px-6 py-4 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all transform hover:scale-105"
      >
        {currentView === 'dashboard' ? (
          <><Trophy size={20} /><span className="font-bold uppercase tracking-tighter">Global Leaderboard</span></>
        ) : (
          <><LayoutDashboard size={20} /><span className="font-bold uppercase tracking-tighter">Command Center</span></>
        )}
      </button>
    </div>
  );
}

export default App;