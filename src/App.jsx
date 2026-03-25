import React, { useState } from 'react';
import './index.css';
import AuthForm from './components/auth/AuthForm.jsx';
import SquadLobby from './components/squad/SquadLobby.jsx';
import Dashboard from './components/dashboard/Dashboard.jsx';
import Leaderboard from './components/leaderboard/Leaderboard.jsx'; 
import TopNav from './components/common/TopNav.jsx';
import { Trophy, LayoutDashboard } from 'lucide-react';

function App() {
  const [activeUser, setActiveUser] = useState(() => localStorage.getItem('fleetcode_user') || null);
  
  // Now stores the actual squad name (string) instead of a boolean
  const [activeSquad, setActiveSquad] = useState(() => localStorage.getItem('fleetcode_squad') || null); 
  
  const [currentView, setCurrentView] = useState('dashboard'); 

  const handleLogout = () => {
    if(window.confirm("Abandon current session?")) {
      setActiveUser(null);
      setActiveSquad(null); 
      localStorage.removeItem('fleetcode_user');
      localStorage.removeItem('fleetcode_squad');
    }
  };

  const handleLeaveSquad = async () => {
    if(window.confirm("Are you sure you want to abandon your current squad?")) {
      try {
        // --- REAL API CALL (Uncomment when backend is ready) ---
        // await FleetCodeAPI.leaveSquad(activeUser);

        setActiveSquad(null); 
        localStorage.removeItem('fleetcode_squad');
        setCurrentView('dashboard'); 
      } catch (err) {
        alert("Failed to leave squad.");
      }
    }
  };

  // Stage 1: Standard Login / Register
  if (!activeUser) {
    return (
      <AuthForm 
        onVerified={(fleetCodeId) => {
          setActiveUser(fleetCodeId);
          localStorage.setItem('fleetcode_user', fleetCodeId);
        }} 
      />
    );
  }

  // Stage 2: Squad Lobby (Create/Join)
  if (activeUser && !activeSquad) {
    return (
      <SquadLobby 
        username={activeUser} 
        onSquadSelected={(squadName) => {
          setActiveSquad(squadName); // Save the actual name!
          localStorage.setItem('fleetcode_squad', squadName);
        }} 
      />
    );
  }

  // Stage 3: The Application
  return (
    <div className="min-h-screen bg-fleet-bg flex flex-col relative">
      <TopNav 
        activeUser={activeUser} 
        hasSquad={!!activeSquad} // Converts string to true, null to false
        onLogout={handleLogout} 
        onLeaveSquad={handleLeaveSquad} 
      />

      <div className="flex-grow pb-24">
        {currentView === 'dashboard' && <Dashboard username={activeUser} activeSquad={activeSquad} />}
        
        {/* Pass the activeSquad to the Leaderboard so it highlights the correct row */}
        {currentView === 'leaderboard' && <Leaderboard currentSquad={activeSquad} />}
      </div>

      {/* Floating Toggle Navigation */}
      <button 
        onClick={() => setCurrentView(currentView === 'dashboard' ? 'leaderboard' : 'dashboard')}
        className="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-blue-500 hover:bg-blue-600 text-white px-6 py-4 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all transform hover:scale-105"
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