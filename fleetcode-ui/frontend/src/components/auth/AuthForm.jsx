import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Lock, User, ArrowRight, Radar, CheckCircle, XCircle, Code, ExternalLink } from 'lucide-react';
import { FleetCodeAPI } from '../../services/api.js';

export default function AuthForm({ onVerified }) {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1);

  const [fleetCodeId, setFleetCodeId] = useState('');
  const [password, setPassword] = useState('');
  const [leetCodeUsername, setLeetCodeUsername] = useState('');

  const [status, setStatus] = useState('scanning');
  const [timeLeft, setTimeLeft] = useState(180);
  const [errorMsg, setErrorMsg] = useState('');

  // --- REAL RADAR LOGIC ---
  useEffect(() => {
    let timer;
    let pollInterval;
    
    if (step === 2 && status === 'scanning' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      
      // Ping the backend every 5 seconds
      setInterval(async () => {
        try {
          // console.log("AuthForm step/status changed:", { step, status, timeLeft });
          const res = await FleetCodeAPI.verifyUser(fleetCodeId);
          
          if (res.verified) { 
            setStatus('success');
            clearInterval(timer);
            clearInterval(pollInterval);
            setTimeout(() => onVerified(fleetCodeId), 2000); 
          }
        } catch (err) {
          console.error("Verification polling error:", err);
        }
      }, 5000);
    } else if (timeLeft === 0) {
      setStatus('failed');
    }

    return () => { clearInterval(timer); clearInterval(pollInterval); };
  }, [step, status, timeLeft, fleetCodeId, onVerified]);

  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!fleetCodeId || !password) return;
    if (!isLogin && !leetCodeUsername) {
      setErrorMsg('LeetCode username is required for registration.');
      return;
    }
    
try {
      if (isLogin) {
        // REAL API: Log the user in
        const res = await FleetCodeAPI.login(fleetCodeId, password);
        
        // --- THE FIX: Pass both the username AND the squadName ---
        onVerified(res.username, res.squadName); 
      } else {
        // ... (Keep the register logic the same)
        await FleetCodeAPI.register(fleetCodeId, password, leetCodeUsername);
        setStep(2); 
      }
    } catch (err) {
      // Catch backend errors (like "FleetCode ID already taken")
      setErrorMsg(err.response?.data?.error || 'Authentication failed. Please try again.');
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
        <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div key="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="text-center mb-10">
                <Terminal className="text-blue-500 mx-auto mb-4" size={40} />
                <h2 className="text-3xl font-black tracking-tighter italic uppercase">FleetCode</h2>
                <p className="text-gray-500 font-mono text-[10px] mt-2 uppercase tracking-[0.3em]">
                  {isLogin ? 'Secure Uplink' : 'Initialize Operator'}
                </p>
              </div>

              <form onSubmit={handleInitialSubmit} className="flex flex-col gap-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                  <input
                    type="text" placeholder="FleetCode ID"
                    className="w-full p-4 pl-11 bg-fleet-bg border border-gray-800 rounded-xl focus:border-blue-500 transition-all font-mono text-sm"
                    value={fleetCodeId} onChange={(e) => setFleetCodeId(e.target.value)} required
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                  <input
                    type="password" placeholder="System Passcode"
                    className="w-full p-4 pl-11 bg-fleet-bg border border-gray-800 rounded-xl focus:border-blue-500 transition-all font-mono text-sm"
                    value={password} onChange={(e) => setPassword(e.target.value)} required
                  />
                </div>

                {!isLogin && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="relative mt-2">
                    <Code className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" size={18} />
                    <input
                      type="text" placeholder="LeetCode Username (to link)"
                      className="w-full p-4 pl-11 bg-fleet-bg border border-green-500/50 rounded-xl focus:border-green-400 transition-all font-mono text-sm"
                      value={leetCodeUsername} onChange={(e) => setLeetCodeUsername(e.target.value)} required={!isLogin}
                    />
                  </motion.div>
                )}

                {errorMsg && <p className="text-red-500 text-xs font-bold text-center mt-2">{errorMsg}</p>}

                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-black py-4 rounded-xl shadow-lg mt-2 flex items-center justify-center gap-2 uppercase tracking-widest transition-all">
                  {isLogin ? 'Authenticate' : 'Register & Link Account'} <ArrowRight size={18} />
                </button>
              </form>

              <button onClick={() => { setIsLogin(!isLogin); setErrorMsg(''); }} className="w-full mt-8 text-[10px] font-mono text-gray-600 hover:text-white uppercase tracking-widest">
                {isLogin ? '> Request Account <' : '> Return to Login <'}
              </button>
            </motion.div>
          ) : (
            <motion.div key="radar" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-6 text-center">
              {status === 'scanning' && (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} className="text-blue-500 p-3 border-4 border-blue-500/20 rounded-full mt-4">
                    <Radar size={60} strokeWidth={1.5} />
                  </motion.div>

                  <div>
                    <p className="text-3xl font-black font-mono text-blue-500 tracking-tighter">{formatTime(timeLeft)}</p>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest font-bold italic animate-pulse">Scanning LeetCode API...</p>
                  </div>

                  <div className="bg-black/40 p-6 rounded-2xl border border-gray-800 w-full text-center font-mono relative shadow-inner">
                    <p className="text-green-400 text-xs font-black mb-4 uppercase tracking-widest italic">// PROOF OF WORK REQUIRED</p>
                    
                    <p className="text-sm text-gray-300 leading-relaxed mb-6">
                      To prove ownership of <span className="text-white font-bold bg-gray-800 px-2 py-1 rounded">{leetCodeUsername}</span>, 
                      you must get an <span className="text-green-400 font-bold">Accepted</span> verdict on:
                    </p>

                    <a 
                      href="https://leetcode.com/problems/find-the-duplicate-number/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 text-blue-400 px-4 py-3 rounded-xl font-bold transition-all"
                    >
                      Problem 287 <ExternalLink size={16} />
                    </a>
                    
                    <p className="text-[10px] text-gray-500 mt-6 uppercase tracking-widest">
                      Our radar will automatically detect your submission.
                    </p>
                  </div>
                </>
              )}

              {status === 'success' && (
                <div className="py-10">
                  <CheckCircle size={80} className="text-green-400 mb-6 mx-auto" />
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter">Identity Confirmed</h3>
                  <p className="text-xs text-gray-500 mt-2">Account linked successfully.</p>
                </div>
              )}

              {status === 'failed' && (
                <div className="py-10 text-red-500">
                  <XCircle size={80} className="mb-6 mx-auto" />
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter">Link Timeout</h3>
                  <button onClick={() => { setStep(1); setTimeLeft(180); setStatus('scanning'); }} className="mt-6 px-8 py-3 bg-gray-800 rounded-xl font-bold uppercase text-xs tracking-widest text-white">Retry</button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}