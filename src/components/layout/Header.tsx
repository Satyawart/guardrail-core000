import React from 'react';
import { useGuardrail } from '../../context/GuardrailContext';
import { DemoController } from '../ui/DemoController';
import { NotificationCenter } from '../ui/NotificationCenter';
import { ShieldCheck, Cpu, Search, Terminal, Play, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    activeScenarioId, 
    triggerScenario, 
    isTestMode, 
    toggleTestMode, 
    setIsCommandPaletteOpen,
    setIsPitchModeOpen,
    setCurrentNav
  } = useGuardrail();

  const [isDemoOpen, setIsDemoOpen] = React.useState(false);

  return (
    <header className="h-12 bg-[#0E0E0E] border-b border-[#222] px-3 sm:px-4 flex items-center justify-between z-30 select-none">
      {/* Left: Brand & Emblem */}
      <div className="flex items-center gap-4 sm:gap-6">
        <div 
          onClick={() => setCurrentNav('OVERVIEW')} 
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-4 h-4 bg-[#FF3D00] flex items-center justify-center text-black font-black text-[10px] group-hover:bg-[#00FF41] transition" />
          <span className="font-bold tracking-widest text-xs mono text-white">GUARDRAIL CORE</span>
          <span className="text-[10px] mono px-1.5 py-0.2 bg-[#1A1A1A] border border-[#333] text-[#00FF41]">
            v4.2.0-STABLE
          </span>
        </div>

        {/* Global Command Palette Trigger */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="hidden md:flex items-center gap-2 px-2.5 py-1 bg-[#141414] border border-[#333] hover:border-[#555] text-[11px] mono text-[#888] hover:text-white transition"
          title="Open Command Palette (CMD+K / Ctrl+K)"
        >
          <Search className="w-3 h-3" />
          <span>SEARCH & COMMANDS</span>
          <kbd className="px-1 py-0.2 bg-[#0A0A0A] border border-[#333] text-[9px] text-[#666]">⌘K</kbd>
        </button>
      </div>

      {/* Right: Live Telemetry, Gateway Mode, Pitch Tour & Demo Controls */}
      <div className="flex items-center gap-3 sm:gap-4 text-xs mono">
        {/* Real-time System Metrics */}
        <div className="hidden lg:flex items-center gap-3 text-[#888] text-[10px]">
          <div>LATENCY: <span className="text-[#00FF41] font-bold">1.24ms</span></div>
          <div className="h-3 w-px bg-[#222]" />
          <div>SAFE RATE: <span className="text-white font-bold">99.99%</span></div>
          <div className="h-3 w-px bg-[#222]" />
          <div>MERCHANT: <span className="text-white font-bold">ACME_CORP</span></div>
        </div>

        {/* 90-Second Pitch Walkthrough Button */}
        <button
          onClick={() => setIsPitchModeOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-[#1A1A1A] border border-[#00FF41]/60 hover:border-[#00FF41] text-[#00FF41] text-[10px] mono transition shadow-sm"
          title="Launch 90-second Pitch Walkthrough Tour"
        >
          <Sparkles className="w-3 h-3" />
          <span className="hidden sm:inline">PITCH TOUR</span>
        </button>

        {/* Razorpay Gateway Switcher */}
        <button
          type="button"
          onClick={toggleTestMode}
          className={`flex items-center gap-1.5 px-2.5 py-1 border text-[10px] mono transition ${
            isTestMode
              ? 'bg-[#1A1A1A] border-[#00FF41] text-[#00FF41]'
              : 'bg-[#0E0E0E] border-[#333] text-[#888]'
          }`}
          title="Toggle Razorpay Test / Production Mock Gateway"
        >
          <span className={`w-1.5 h-1.5 ${isTestMode ? 'bg-[#00FF41]' : 'bg-[#666]'}`} />
          <span className="hidden sm:inline">RAZORPAY: {isTestMode ? 'TESTNET_ACTIVE' : 'SIMULATION'}</span>
          <span className="sm:hidden">TESTNET</span>
        </button>

        {/* Notification Center */}
        <NotificationCenter />

        {/* 5-Min Pitch Demo Controller */}
        <DemoController
          activeScenarioId={activeScenarioId}
          onSelectScenario={(id) => {
            triggerScenario(id);
            setIsDemoOpen(false);
          }}
          isOpen={isDemoOpen}
          onToggle={() => setIsDemoOpen(!isDemoOpen)}
        />
      </div>
    </header>
  );
};
