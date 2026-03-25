import React from 'react';
import { LogOut, Users } from 'lucide-react';

export default function TopNav({ activeUser, hasSquad, onLogout, onLeaveSquad }) {
  return (
    <nav className="border-b border-gray-800 bg-fleet-card px-6 py-4 flex justify-between items-center z-40 relative">
      <div className="text-green-400 font-black text-xl tracking-wide italic underline decoration-blue-500 underline-offset-4">FleetCode</div>
      
      <div className="flex items-center gap-6">
        <div className="text-xs font-mono text-gray-500 uppercase tracking-widest bg-black/30 px-3 py-1.5 rounded border border-gray-800">
          Operator: <span className="text-white font-bold">{activeUser}</span>
        </div>
        
        <div className="flex items-center gap-4 border-l border-gray-800 pl-4">
          {/* Only show "Leave Squad" if they are currently in a squad */}
          {hasSquad && (
            <button 
              onClick={onLeaveSquad}
              className="text-gray-500 hover:text-yellow-500 transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
            >
              <Users size={16} />
              <span className="hidden sm:inline">Leave Squad</span>
            </button>
          )}

          <button 
            onClick={onLogout}
            className="text-gray-500 hover:text-red-500 transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}