import React, { useState, useEffect } from 'react';
import AuthForm from './components/auth/AuthForm';
import SquadLobby from './components/squad/SquadLobby';
import Dashboard from './components/dashboard/Dashboard';
import Leaderboard from './components/leaderboard/Leaderboard'; // <-- NEW IMPORT
import { FleetCodeAPI } from './services/api';
import { LogOut, UserMinus, Trophy, LayoutDashboard } from 'lucide-react';

export default function App() {
  const [activeUser, setActiveUser] = useState(localStorage.getItem('fleetcode_user') || null);
  const [activeSquad, setActiveSquad] = useState(localStorage.getItem('fleetcode_squad') || null);
  
  // --- NEW: Routing State ---
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' or 'leaderboard'
  
  const [isCheckingDB, setIsCheckingDB] = useState(false);

  const syncWithDatabase = async (username) => {
    setIsCheckingDB(true);
    try {
      const data = await FleetCodeAPI.getDashboard(username);
      if (data && data.hasSquad) {
        setActiveSquad(data.squadName);
        localStorage.setItem('fleetcode_squad', data.squadName);
      } else {
        setActiveSquad(null);
        localStorage.removeItem('fleetcode_squad');
      }
    } catch (error) {
      console.error("Database sync failed.");
    } finally {
      setIsCheckingDB(false);
    }
  };

  useEffect(() => {
    if (activeUser) {
      syncWithDatabase(activeUser);
    }
  }, [activeUser]);

  const handleVerified = (username, squadNameFromLogin = null) => {
    setActiveUser(username);
    localStorage.setItem('fleetcode_user', username);
    
    if (squadNameFromLogin) {
      setActiveSquad(squadNameFromLogin);
      localStorage.setItem('fleetcode_squad', squadNameFromLogin);
    }
  };

  const handleLeaveSquad = async () => {
    if (window.confirm("Are you sure you want to abandon your current squad?")) {
      try {
        await FleetCodeAPI.leaveSquad(activeUser);
        setActiveSquad(null);
        setCurrentView('dashboard'); // Reset view on leave
        localStorage.removeItem('fleetcode_squad'); 
      } catch (err) {
        console.error("Leave Squad Error:", err);
        alert("Failed to leave squad.");
      }
    }
  };

const handleLogout = (e) => {
    // 1. Stop the browser from refreshing if this was a link/form click
    if (e && e.preventDefault) e.preventDefault();

    console.log("Initiating Logout Sequence...");

    // 2. Clear Disk (Highest Priority)
    localStorage.removeItem('fleetcode_user');
    localStorage.removeItem('fleetcode_squad');
    localStorage.clear(); // Nuclear option to be safe

    // 3. Clear Memory (React State)
    setActiveUser(null);
    setActiveSquad(null);
    
    // 4. Force a clean redirect to the login view
    window.location.href = "/"; 
  };

  if (!activeUser) return <AuthForm onVerified={handleVerified} />;

  if (isCheckingDB) {
    return (
      <div className="min-h-screen bg-fleet-bg text-blue-500 flex flex-col items-center justify-center font-mono text-sm tracking-widest uppercase">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        Syncing with FleetCode Servers...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-fleet-bg flex flex-col">
      
      {/* INLINE TOP NAVIGATION BAR */}
      <header className="bg-[#0a0f18] border-b border-gray-800 p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-6">
          <div className="text-xl font-black italic tracking-tighter text-blue-500 uppercase">FleetCode</div>
          <div className="hidden sm:block w-px h-6 bg-gray-800"></div>
          <div className="text-xs font-mono text-gray-400 uppercase tracking-widest hidden sm:block">
            Operator: <span className="text-white font-bold">{activeUser}</span>
          </div>

          {/* --- NEW: VIEW TOGGLE BUTTONS --- */}
          {activeSquad && (
            <div className="flex items-center gap-2 ml-4 bg-gray-900/50 p-1 rounded-lg border border-gray-800">
              <button 
                onClick={() => setCurrentView('dashboard')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${currentView === 'dashboard' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
              >
                <LayoutDashboard size={14} /> Ops
              </button>
              <button 
                onClick={() => setCurrentView('leaderboard')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${currentView === 'leaderboard' ? 'bg-yellow-500/20 text-yellow-400' : 'text-gray-500 hover:text-gray-300'}`}
              >
                <Trophy size={14} /> Global Rank
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {activeSquad && (
            <button 
              onClick={handleLeaveSquad}
              className="flex items-center gap-2 bg-red-900/20 hover:bg-red-900/40 text-red-500 border border-red-900/50 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors"
            >
              <UserMinus size={14} /> Leave Squad
            </button>
          )}

          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      {/* --- NEW: CONDITIONAL RENDERING --- */}
      <main className="flex-grow">
        {!activeSquad ? (
          <SquadLobby 
            username={activeUser} 
            onSquadSelected={(squadName) => {
              setActiveSquad(squadName);
              localStorage.setItem('fleetcode_squad', squadName);
            }} 
          />
        ) : currentView === 'leaderboard' ? (
          <Leaderboard activeSquad={activeSquad} />
        ) : (
          <Dashboard username={activeUser} activeSquad={activeSquad} />
        )}
      </main>
      
    </div>
  );
}