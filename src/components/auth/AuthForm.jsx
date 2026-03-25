import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Lock, User, ArrowRight, Radar, CheckCircle, XCircle, Code, ExternalLink, Copy, Check } from 'lucide-react';
// import { FleetCodeAPI } from '../../services/api.js'; 

export default function AuthForm({ onVerified }) {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1); 
  
  const [fleetCodeId, setFleetCodeId] = useState('');
  const [password, setPassword] = useState('');
  const [leetCodeUsername, setLeetCodeUsername] = useState(''); 
  
  const [status, setStatus] = useState('scanning'); 
  const [timeLeft, setTimeLeft] = useState(180); 
  const [errorMsg, setErrorMsg] = useState('');
  
  // State for the copy button feedback
  const [copied, setCopied] = useState(false);

  // --- MOCKED RADAR LOGIC ---
  useEffect(() => {
    let timer;
    let pollInterval;

    if (step === 2 && status === 'scanning' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);

      pollInterval = setInterval(() => {
        const isVerified = Math.random() > 0.85; 
        
        if (isVerified) { 
          setStatus('success');
          clearInterval(timer);
          clearInterval(pollInterval);
          setTimeout(() => onVerified(fleetCodeId), 2000); 
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
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (fleetCodeId.toLowerCase() === 'error') throw new Error('Invalid credentials');
        onVerified(fleetCodeId);
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setStep(2); 
      }
    } catch (err) {
      setErrorMsg('Authentication failed. Please try again.');
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // PROGRAMMATIC COPY FUNCTION
  const handleCopyCode = () => {
    // This string preserves exact Python indentation and newlines
    const rawPythonCode = `class Solution:
    def findDuplicate(self, nums: List[int]) -> int:
        # FleetCodeAuth: ${fleetCodeId.toUpperCase()}
        slow, fast = nums[0], nums[nums[0]]
        while slow != fast:
            slow, fast = nums[slow], nums[nums[fast]]
        slow = 0
        while slow != fast:
            slow, fast = nums[slow], nums[fast]
        return slow`;

    navigator.clipboard.writeText(rawPythonCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
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
                    <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest font-bold italic animate-pulse">Awaiting Submission API...</p>
                  </div>

                  <div className="bg-black/40 p-5 rounded-2xl border border-gray-800 w-full text-left font-mono relative">
                    <p className="text-green-400 text-[10px] font-black mb-3 uppercase tracking-widest italic">// HANDSHAKE PROTOCOL</p>
                    <p className="text-[11px] text-gray-400 leading-relaxed mb-4">
                      To prove ownership of <span className="text-white font-bold">{leetCodeUsername}</span>, you must get an <span className="text-green-400 font-bold">Accepted</span> verdict on <a href="https://leetcode.com/problems/find-the-duplicate-number/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline underline-offset-2 inline-flex items-center gap-1 font-bold">Problem 287 <ExternalLink size={10} /></a> using the exact code below:
                    </p>
                    
                    {/* Code Block Container */}
                    <div className="bg-[#0d1117] border border-gray-700 rounded-lg p-4 relative overflow-x-auto group">
                      
                      {/* Copy Button */}
                      <button 
                        onClick={handleCopyCode}
                        className="absolute top-2 right-2 p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md transition-colors shadow-lg z-10 flex items-center gap-2"
                        title="Copy to clipboard"
                      >
                        {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                        <span className="text-[10px] uppercase tracking-widest font-bold">
                          {copied ? 'Copied' : 'Copy'}
                        </span>
                      </button>

                      <pre className="text-[11px] text-gray-300 leading-relaxed font-mono select-text pt-6 sm:pt-0">
<span className="text-pink-400">class</span> <span className="text-blue-300">Solution</span>:
    <span className="text-pink-400">def</span> <span className="text-blue-300">findDuplicate</span>(self, nums: List[<span className="text-teal-300">int</span>]) -{`>`} <span className="text-teal-300">int</span>:
        <span className="text-green-500"># FleetCodeAuth: {fleetCodeId.toUpperCase()}</span>
        slow, fast = nums[<span className="text-orange-300">0</span>], nums[nums[<span className="text-orange-300">0</span>]]
        <span className="text-pink-400">while</span> slow != fast:
            slow, fast = nums[slow], nums[nums[fast]]
        slow = <span className="text-orange-300">0</span>
        <span className="text-pink-400">while</span> slow != fast:
            slow, fast = nums[slow], nums[fast]
        <span className="text-pink-400">return</span> slow
                      </pre>
                    </div>
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
                  <button onClick={() => {setStep(1); setTimeLeft(180); setStatus('scanning');}} className="mt-6 px-8 py-3 bg-gray-800 rounded-xl font-bold uppercase text-xs tracking-widest text-white">Retry</button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}