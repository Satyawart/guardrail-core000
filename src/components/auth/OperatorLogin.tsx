import React, { useState } from 'react';
import { Shield, ArrowRight, ArrowLeft, Loader2, AlertCircle, Fingerprint } from 'lucide-react';
import { supabase } from '../../utils/supabase';
import { motion } from 'motion/react';

interface OperatorLoginProps {
  onBack: () => void;
}

export const OperatorLogin: React.FC<OperatorLoginProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        if (signInError.message.includes('Email not confirmed')) {
          setError('Email not confirmed. Please check your inbox.');
        } else {
          setError('Invalid operator credentials. Access denied.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] relative flex flex-col justify-center py-12 sm:px-6 lg:px-8 overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 bg-tech-grid opacity-30 z-0"></div>
      
      {/* Background glow for operator context */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full z-0 pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <button 
          onClick={onBack}
          className="group flex items-center text-sm font-mono text-white/40 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          ABORT SEQUENCE
        </button>

        <div className="mx-auto h-16 w-16 bg-blue-500/10 border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.3)] rounded-2xl flex items-center justify-center">
          <Shield className="h-8 w-8 text-blue-400" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
          OPERATOR ACCESS
        </h2>
        <p className="mt-3 text-center text-xs font-mono tracking-widest text-blue-400/80 uppercase">
          Secure Platform Kernel Authentication
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="bg-black/60 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-white/10 relative overflow-hidden">
          
          {/* Top highlight bar */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>

          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start space-x-3 text-red-400 backdrop-blur-md"
              >
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <p className="text-sm font-mono">{error}</p>
              </motion.div>
            )}

            <div>
              <label className="block text-xs font-mono tracking-widest text-white/50 uppercase mb-2">
                Operator Identity
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Fingerprint className="h-5 w-5 text-blue-500/50 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 rounded-xl border-0 py-3 bg-white/5 text-white shadow-inner ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 focus:bg-white/10 transition-all sm:text-sm sm:leading-6 font-mono"
                  placeholder="operator@guardrail.core"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono tracking-widest text-white/50 uppercase mb-2">
                Cryptographic Key
              </label>
              <div className="relative group">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border-0 py-3 px-4 bg-white/5 text-white shadow-inner ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 focus:bg-white/10 transition-all sm:text-sm sm:leading-6 font-mono tracking-widest"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] text-sm font-bold tracking-widest text-white bg-blue-600 hover:bg-blue-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-black transition-all disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin relative z-10" />
              ) : (
                <span className="flex items-center relative z-10 font-mono">
                  AUTHORIZE SESSION
                  <ArrowRight className="ml-3 h-5 w-5 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </span>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
