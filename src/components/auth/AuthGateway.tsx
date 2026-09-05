import React from 'react';
import { 
  Shield, 
  Briefcase, 
  ArrowRight, 
  Activity, 
  Terminal,
  ShieldCheck,
  Zap,
  Database,
  TrendingUp,
  ShoppingCart,
  Globe,
  Lock,
  Users,
  BrainCircuit,
  Clock,
  LineChart,
  Building
} from 'lucide-react';
import { motion } from 'framer-motion';
import { GuardrailCore3D } from '../hero/GuardrailCore3D';

interface AuthGatewayProps {
  onSelectMode: (mode: 'OPERATOR' | 'MERCHANT') => void;
}

export const AuthGateway: React.FC<AuthGatewayProps> = ({ onSelectMode }) => {
  return (
    <div className="h-screen max-h-screen bg-[#050505] relative flex flex-col lg:flex-row overflow-hidden">
      
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 bg-tech-grid opacity-30 z-0"></div>
      
      {/* Left Side: 3D Core Visualizer & Capabilities */}
      <div className="hidden lg:flex flex-1 relative z-10 flex-col border-r border-white/10 bg-black/40 backdrop-blur-3xl overflow-hidden py-4 px-8 justify-between">
         {/* Decorative scanning line */}
         <motion.div 
           animate={{ top: ['-10%', '110%'] }}
           transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
           className="absolute left-0 right-0 h-[2px] bg-blue-500/50 blur-[2px] z-20"
         />
         
         <div className="relative w-full max-w-2xl mx-auto flex-1 flex items-center justify-center min-h-[260px]">
            {/* Massive glowing orb behind the 3D model */}
            <div className="absolute inset-0 bg-blue-600/20 blur-[120px] rounded-full animate-pulse-slow z-0"></div>
            
            <div className="relative z-10 scale-100 lg:scale-110">
              <GuardrailCore3D statusText="AUTHENTICATION KERNEL ACTIVE" isEnforcing={true} />
            </div>
         </div>

         {/* Bottom Left Area: Capability Cards and Metrics Strip */}
         <div className="mt-2 flex flex-col gap-4 w-full max-w-2xl mx-auto relative z-10">
            {/* 4 Capability Cards */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-2">
              {[
                { icon: ShieldCheck, title: 'ZERO TRUST', l1: 'RLS ENFORCED', l2: 'MULTI-TENANT SAFE', color: 'text-blue-500', bg: 'bg-blue-500/20', border: 'border-blue-500/30', hover: 'hover:border-blue-500/50' },
                { icon: Zap, title: 'REAL-TIME AI', l1: 'POLICY CHECKS', l2: 'INSTANT DECISIONS', color: 'text-emerald-500', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30', hover: 'hover:border-emerald-500/50' },
                { icon: Database, title: 'AUDIT READY', l1: 'CRYPTOGRAPHIC LEDGER', l2: 'TAMPER-PROOF', color: 'text-purple-500', bg: 'bg-purple-500/20', border: 'border-purple-500/30', hover: 'hover:border-purple-500/50' },
                { icon: TrendingUp, title: 'REVENUE SAFE', l1: 'MARGIN PROTECTION', l2: 'GOVERNED GROWTH', color: 'text-cyan-500', bg: 'bg-cyan-500/20', border: 'border-cyan-500/30', hover: 'hover:border-cyan-500/50' },
              ].map((card, i) => (
                <div key={i} className={`p-3 rounded-xl border border-white/5 bg-white/[0.03] backdrop-blur-md ${card.hover} transition-colors group relative overflow-hidden flex flex-col items-start`}>
                  <div className={`p-2 rounded-lg ${card.bg} ${card.border} border mb-2 group-hover:scale-110 transition-transform duration-500`}>
                    <card.icon className={`w-4 h-4 ${card.color}`} />
                  </div>
                  <h4 className="text-[10px] font-bold text-white mb-1 tracking-wider">{card.title}</h4>
                  <p className="text-[9px] text-white/60 leading-tight font-mono">{card.l1}<br/>{card.l2}</p>
                </div>
              ))}
            </div>

            {/* Metric Strip */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 backdrop-blur-md">
              {[
                { icon: ShoppingCart, val: '10M+', label: 'Transactions\nProtected', color: 'text-emerald-500' },
                { icon: Globe, val: '99.99%', label: 'Platform\nUptime', color: 'text-cyan-500' },
                { icon: Lock, val: '100%', label: 'Audit\nIntegrity', color: 'text-purple-500' },
                { icon: Users, val: '50+', label: 'Enterprises\nTrust Us', color: 'text-blue-500' },
              ].map((metric, i) => (
                <div key={i} className="flex items-center gap-2 group" >
                  <metric.icon className={`w-5 h-5 ${metric.color} opacity-90 group-hover:opacity-100 transition-opacity`} />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white tracking-wide">{metric.val}</span>
                    <span className="text-[9px] text-white/60 leading-[1.1]">
                      {metric.label.split('\n').map((l, j) => <React.Fragment key={j}>{l}<br/></React.Fragment>)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Telemetry Footer */}
            <div className="flex justify-between text-[10px] font-mono text-white/40 px-2 pb-2">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald-400 animate-pulse" />
                <span>KERNEL SYNCED</span>
              </div>
              <div>IDEMPOTENCY: <span className="text-blue-400 font-bold">100%</span></div>
            </div>
         </div>
      </div>

      {/* Right Side: Login Interaction Panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-4 lg:p-6 relative z-10 bg-gradient-to-l from-black/90 to-black/60 lg:bg-transparent backdrop-blur-lg">
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md flex flex-col justify-between h-full py-4"
        >
          {/* Top Tagline */}
          <div className="text-right mb-4">
             <span className="text-[8px] font-mono tracking-widest text-white/40 uppercase">SECURE &bull; INTELLIGENT &bull; COMPLIANT</span>
          </div>

          <div className="space-y-4">
            {/* Header */}
            <div className="space-y-2 text-left">
              <div className="inline-flex items-center justify-center h-10 w-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 rounded-xl shadow-[0_0_30px_rgba(59,130,246,0.3)] mb-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-400/20 animate-pulse-slow"></div>
                <Terminal className="h-5 w-5 text-blue-400 relative z-10" />
              </div>
              <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                GUARDRAIL <span className="text-blue-500">CORE</span>
              </h2>
              <p className="text-xs text-blue-400/80 font-mono tracking-widest uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                Governance & Execution Control
              </p>
            </div>

            {/* Action Cards */}
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectMode('OPERATOR')}
                className="relative w-full flex items-center justify-between p-4 lg:p-5 bg-white/5 border border-white/10 rounded-2xl hover:border-blue-500/50 hover:bg-blue-900/10 transition-all group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
                
                <div className="flex items-center space-x-4 relative z-10">
                  <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-shadow">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm lg:text-base font-bold text-white group-hover:text-blue-100 transition-colors">OPERATOR ACCESS</h3>
                    <p className="text-[9px] lg:text-[10px] text-white/50 mt-0.5 font-mono tracking-wide">SECURE PLATFORM CONTROL</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-white/30 group-hover:text-blue-400 transition-colors relative z-10 group-hover:translate-x-1 duration-300" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectMode('MERCHANT')}
                className="relative w-full flex items-center justify-between p-4 lg:p-5 bg-white/5 border border-white/10 rounded-2xl hover:border-emerald-500/50 hover:bg-emerald-900/10 transition-all group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>

                <div className="flex items-center space-x-4 relative z-10">
                  <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-shadow">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm lg:text-base font-bold text-white group-hover:text-emerald-100 transition-colors">SANDBOX PROVISION</h3>
                    <p className="text-[9px] lg:text-[10px] text-white/50 mt-0.5 font-mono tracking-wide">ISOLATED TENANT ENVIRONMENT</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-white/30 group-hover:text-emerald-400 transition-colors relative z-10 group-hover:translate-x-1 duration-300" />
              </motion.button>
            </div>

            {/* Tagline separator */}
            <div className="relative flex items-center justify-center py-2">
              <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
              <div className="relative px-3 bg-[#050505] text-[8px] font-mono tracking-[0.2em] text-blue-400/80 uppercase text-center whitespace-nowrap">
                Safer Commerce. Higher Margins. Brighter Tomorrow.
              </div>
            </div>

            {/* Right-side Capabilities Row */}
            <div className="grid grid-cols-5 gap-1 pb-2">
              {[
                { icon: BrainCircuit, label: 'AI-Native', sub: 'Decisioning', color: 'text-purple-500' },
                { icon: ShieldCheck, label: 'Policy', sub: 'Enforcement', color: 'text-emerald-500' },
                { icon: Clock, label: 'Real-Time', sub: 'Risk Control', color: 'text-amber-500' },
                { icon: LineChart, label: 'Revenue', sub: 'Intelligence', color: 'text-blue-500' },
                { icon: Building, label: 'Enterprise', sub: 'Ready', color: 'text-pink-500' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-1.5 group">
                  <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5 group-hover:bg-white/[0.08] transition-colors duration-300 relative overflow-hidden">
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity bg-gradient-to-t from-current to-transparent ${item.color}`}></div>
                    <item.icon className={`w-4 h-4 ${item.color} opacity-90 group-hover:opacity-100 transition-opacity relative z-10`} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-semibold text-white/90">{item.label}</span>
                    <span className="text-[8px] text-white/50 leading-tight hidden sm:block">{item.sub}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Optional Quote / System Message */}
            <div className="relative p-4 rounded-2xl border border-white/5 bg-gradient-to-br from-blue-900/10 to-transparent overflow-hidden group hidden sm:block">
              {/* Abstract tech background effect */}
              <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors duration-1000"></div>
              
              {/* Digital Globe Abstract */}
              <div className="absolute right-0 bottom-0 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-1000 pointer-events-none mix-blend-screen scale-150 translate-x-1/4 translate-y-1/4">
                <Globe className="w-32 h-32 text-blue-300" strokeWidth={1} />
              </div>
              
              <div className="relative z-10 flex items-start gap-4">
                <div className="text-blue-500/50 text-3xl leading-none font-serif pt-1">"</div>
                <div className="flex-1">
                  <p className="text-xs italic text-white/70 leading-relaxed font-light mt-1">
                    Turning every transaction into a more secure, profitable future.
                  </p>
                  <div className="mt-2 flex items-center justify-end gap-2">
                    <div className="w-4 h-[1px] bg-blue-500/40"></div>
                    <span className="text-[9px] font-mono tracking-widest text-white/40 uppercase">Guardrail Core</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto text-center">
            <p className="text-[8px] text-white/40 font-mono tracking-widest uppercase flex items-center justify-center gap-3">
              PEOPLE &bull; POLICIES &bull; AI &bull; PROFIT &bull; A SAFER TOMORROW
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
