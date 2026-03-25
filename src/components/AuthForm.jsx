import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Lock, User, ArrowRight, Radar, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function AuthForm({ onVerified }) {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1); // 1: Form, 2: Radar Sweep
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('scanning'); // scanning, success, failed
  const [timeLeft, setTimeLeft] = useState(180);

  // --- RADAR LOGIC ---
  useEffect(() => {
    let timer;
    let pollInterval;

    if (step === 2 && status === 'scanning' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);

      pollInterval = setInterval(async () => {
        try {
          // MOCKING SUCCESS FOR DEMO 
          const isVerified = Math.random() > 0.8; 
          
          if (isVerified) {
            setStatus('success');
            clearInterval(timer);
            clearInterval(pollInterval);
            setTimeout(() => onVerified(username), 2000); 
          }
        } catch (error) { console.error(error); }
      }, 5000);
    } else if (timeLeft === 0) {
      setStatus('failed');
    }

    return () => { clearInterval(timer); clearInterval(pollInterval); };
  }, [step, status, timeLeft, username, onVerified]);

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) return;
    
    if (isLogin) {
      // LOGIN: Instant bypass if credentials match
      onVerified(username);
    } else {
      // REGISTER: Trigger the Radar Sweep
      setStep(2);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-fleet-bg text-white p-6">
      <div className="w-full max-w-md bg-fleet-card p-10 rounded-3xl border border-gray-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-fleet-radar shadow-[0_0_15px_rgba(59,130,246,0.5)]" />

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div 
              key="form"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            >
              <div className="text-center mb-10">
                <Terminal className="text-fleet-radar mx-auto mb-4" size={40} />
                <h2 className="text-3xl font-black tracking-tighter italic uppercase">FleetCode</h2>
                <p className="text-gray-500 font-mono text-[10px] mt-2 uppercase tracking-[0.3em]">
                  {isLogin ? 'Secure Uplink' : 'Initialize Operator'}
                </p>
              </div>

              <form onSubmit={handleInitialSubmit} className="flex flex-col gap-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                  <input 
                    type="text" placeholder="LeetCode Username" 
                    className="w-full p-4 pl-11 bg-fleet-bg border border-gray-800 rounded-xl focus:border-fleet-radar transition-all font-mono text-sm"
                    value={username} onChange={(e) => setUsername(e.target.value)} required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                  <input 
                    type="password" placeholder="System Passcode" 
                    className="w-full p-4 pl-11 bg-fleet-bg border border-gray-800 rounded-xl focus:border-fleet-radar transition-all font-mono text-sm"
                    value={password} onChange={(e) => setPassword(e.target.value)} required
                  />
                </div>
                <button type="submit" className="bg-fleet-radar hover:bg-blue-600 text-white font-black py-4 rounded-xl shadow-lg mt-2 flex items-center justify-center gap-2 uppercase tracking-widest transition-all">
                  {isLogin ? 'Authenticate' : 'Begin Verification'} <ArrowRight size={18} />
                </button>
              </form>

              <button onClick={() => setIsLogin(!isLogin)} className="w-full mt-8 text-[10px] font-mono text-gray-600 hover:text-white uppercase tracking-widest">
                {isLogin ? '> Request Account <' : '> Return to Login <'}
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="radar"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-8 text-center"
            >
              {status === 'scanning' && (
                <>
                  <motion.div 
                    animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                    className="text-fleet-radar p-4 border-4 border-fleet-radar/20 rounded-full"
                  >
                    <Radar size={80} strokeWidth={1.5} />
                  </motion.div>
                  
                  <div>
                    <p className="text-3xl font-black font-mono text-fleet-radar tracking-tighter">{formatTime(timeLeft)}</p>
                    <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-widest font-bold italic animate-pulse">Scanning LeetCode API...</p>
                  </div>

                  <div className="bg-black/40 p-5 rounded-2xl border border-gray-800 w-full text-left font-mono">
                    <p className="text-fleet-accent text-[10px] font-black mb-3 uppercase tracking-widest italic">// HANDSHAKE PROTOCOL</p>
                    <p className="text-[11px] text-gray-400 leading-relaxed mb-3">
                      To link <span className="text-white">{username}</span>, submit any code to "Two Sum" with this signature:
                    </p>
                    <code className="block bg-fleet-radar/5 border border-fleet-radar/20 p-3 rounded-lg text-xs text-fleet-radar">
                      # FleetCodeAuth: {username.toUpperCase()}
                    </code>
                  </div>
                </>
              )}

              {status === 'success' && (
                <div className="py-10">
                  <CheckCircle size={80} className="text-fleet-accent mb-6 mx-auto" />
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter">Identity Confirmed</h3>
                </div>
              )}

              {status === 'failed' && (
                <div className="py-10 text-fleet-danger">
                  <XCircle size={80} className="mb-6 mx-auto" />
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter">Link Timeout</h3>
                  <button onClick={() => {setStep(1); setTimeLeft(180); setStatus('scanning');}} className="mt-6 px-8 py-3 bg-gray-800 rounded-xl font-bold uppercase text-xs tracking-widest">Retry</button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}