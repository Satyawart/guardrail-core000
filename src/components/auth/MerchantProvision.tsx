import React, { useState } from 'react';
import { Briefcase, ArrowRight, ArrowLeft, Loader2, AlertCircle, Building, User } from 'lucide-react';
import { supabase } from '../../utils/supabase';
import { motion } from 'motion/react';

interface MerchantProvisionProps {
  onBack: () => void;
  onSuccess: (email: string) => void;
}

export const MerchantProvision: React.FC<MerchantProvisionProps> = ({ onBack, onSuccess }) => {
  const [merchantName, setMerchantName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProvision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('provision-sandbox', {
        body: {
          email,
          password,
          merchantName
        }
      });

      if (functionError) {
        if (functionError.message.includes('non-2xx')) {
          throw new Error('PROVISION_OFFLINE. Sandbox provisioning is temporarily unavailable. Please try again later.');
        }
        throw new Error(functionError.message || 'Failed to invoke provisioning service.');
      }

      if (data?.error) {
        if (data.error.includes('already registered')) {
          throw new Error('DUPLICATE_ACCOUNT. This account already exists. Use Operator Login or choose another identity.');
        }
        throw new Error(`PROVISIONING_FAILED. ${data.error}`);
      }

      const { error: finalSignInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (finalSignInError) {
        console.error('Auto-login failed after provisioning:', finalSignInError);
      }

      onSuccess(email);

    } catch (err: any) {
      if (err.message?.includes('DUPLICATE_ACCOUNT') || err.message?.includes('already registered')) {
        setError('DUPLICATE_ACCOUNT. This account already exists. Use Operator Login or choose another identity.');
      } else if (err.message?.includes('PROVISION_OFFLINE')) {
        setError('OFFLINE. Sandbox provisioning is temporarily unavailable. Please try again later.');
      } else {
        setError(`ERROR. ${err.message || 'Failed to provision merchant environment.'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] relative flex flex-col justify-center py-12 sm:px-6 lg:px-8 overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 bg-tech-grid opacity-30 z-0"></div>
      
      {/* Background glow for merchant context */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/10 blur-[150px] rounded-full z-0 pointer-events-none"></div>

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

        <div className="mx-auto h-16 w-16 bg-emerald-500/10 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.3)] rounded-2xl flex items-center justify-center">
          <Briefcase className="h-8 w-8 text-emerald-400" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
          PROVISION SANDBOX
        </h2>
        <p className="mt-3 text-center text-xs font-mono tracking-widest text-emerald-400/80 uppercase">
          Initialize Tenant Environment
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
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>

          <form className="space-y-5" onSubmit={handleProvision}>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start space-x-3 text-red-400 backdrop-blur-md"
              >
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <div className="text-xs font-mono">
                  <p className="font-bold text-red-300 mb-1">{error.split('.')[0]}.</p>
                  <p className="opacity-80">{error.split('.').slice(1).join('.').trim()}</p>
                </div>
              </motion.div>
            )}

            <div>
              <label className="block text-xs font-mono tracking-widest text-white/50 uppercase mb-2">
                Merchant Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-4 w-4 text-emerald-500/50 group-focus-within:text-emerald-400 transition-colors" />
                </div>
                <input
                  type="text"
                  required
                  value={merchantName}
                  onChange={(e) => setMerchantName(e.target.value)}
                  className="block w-full pl-10 rounded-xl border-0 py-3 bg-white/5 text-white shadow-inner ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-emerald-500 focus:bg-white/10 transition-all sm:text-sm sm:leading-6 font-mono"
                  placeholder="Acme Corporation"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono tracking-widest text-white/50 uppercase mb-2">
                Merchant Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-emerald-500/50 group-focus-within:text-emerald-400 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 rounded-xl border-0 py-3 bg-white/5 text-white shadow-inner ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-emerald-500 focus:bg-white/10 transition-all sm:text-sm sm:leading-6 font-mono"
                  placeholder="admin@acme.inc"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono tracking-widest text-white/50 uppercase mb-2">
                Passphrase
              </label>
              <div className="relative group">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border-0 py-3 px-4 bg-white/5 text-white shadow-inner ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-emerald-500 focus:bg-white/10 transition-all sm:text-sm sm:leading-6 font-mono tracking-widest"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono tracking-widest text-white/50 uppercase mb-2">
                Confirm Passphrase
              </label>
              <div className="relative group">
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full rounded-xl border-0 py-3 px-4 bg-white/5 text-white shadow-inner ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-emerald-500 focus:bg-white/10 transition-all sm:text-sm sm:leading-6 font-mono tracking-widest"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] text-sm font-bold tracking-widest text-white bg-emerald-600 hover:bg-emerald-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:ring-offset-black transition-all disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden mt-6"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin relative z-10" />
              ) : (
                <span className="flex items-center relative z-10 font-mono">
                  PROVISION SECURE KERNEL
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
