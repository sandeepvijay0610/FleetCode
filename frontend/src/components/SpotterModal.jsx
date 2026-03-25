import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ShieldAlert, X } from 'lucide-react';

export default function SpotterModal({ isOpen, onClose, onConfirm, teammates }) {
  const [target, setTarget] = useState('');
  return (
    <AnimatePresence>{isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <motion.div initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.9}} className="w-full max-w-md bg-fleet-card border border-red-900/50 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.2)]">
            <div className="bg-red-950/20 p-8 border-b border-red-900/30 flex justify-between items-center text-red-500">
              <div className="flex gap-4 items-center font-black uppercase italic tracking-wider">
                <AlertTriangle className="animate-pulse" /> Emergency Intervention
              </div>
              <button onClick={onClose}><X size={20} /></button>
            </div>
            <div className="p-8 space-y-8">
              <p className="text-xs text-gray-400 font-mono leading-relaxed uppercase">Initiating a Spotter solve prevents squad XP decay. Select target for rescue:</p>
              <div className="space-y-2">{teammates.map((m) => (
                    <button key={m} onClick={() => setTarget(m)} className={`w-full p-4 rounded-xl border text-left text-xs font-black transition-all ${target === m ? 'bg-red-500 text-white border-red-500' : 'bg-black/40 border-gray-800 text-gray-500 hover:border-gray-600'}`}>{m}</button>
                  ))}</div>
              <button disabled={!target} onClick={() => onConfirm(target)} className="w-full py-5 bg-red-500 text-white font-black rounded-xl flex justify-center gap-3 disabled:opacity-30">INITIATE RESCUE <ShieldAlert size={18} /></button>
            </div>
          </motion.div>
        </div>
    )}</AnimatePresence>
  );
}