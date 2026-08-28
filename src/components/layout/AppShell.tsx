import React from 'react';
import { useGuardrail } from '../../context/GuardrailContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';
import { CommandPalette } from '../command/CommandPalette';
import { TransactionExplorerDrawer } from '../command/TransactionExplorerDrawer';
import { AgentDrawer } from '../command/AgentDrawer';
import { PitchModeModal } from '../modals/PitchModeModal';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useGuardrail();

  return (
    <div className="h-screen bg-[#0A0A0A] text-[#E0E0E0] flex flex-col relative overflow-hidden selection:bg-[#FF3D00]/30 selection:text-[#FF3D00]">
      {/* Top Header */}
      <Header />

      {/* Main Center Stage */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Console */}
        <Sidebar />

        {/* Content View with Geometric Grid */}
        <main className="flex-1 overflow-y-auto grid-bg p-3 sm:p-4 lg:p-6 space-y-5 w-full">
          {children}
        </main>
      </div>

      {/* Bottom Status Rail */}
      <Footer />

      {/* Modals & Drawers */}
      <CommandPalette />
      <TransactionExplorerDrawer />
      <AgentDrawer />
      <PitchModeModal />

      {/* Global Toast Alert */}
      {toast && (
        <div className="fixed bottom-12 right-6 z-50 animate-in slide-in-from-bottom-2 fade-in duration-200">
          <div className={`p-3.5 bg-[#0E0E0E] border shadow-2xl flex items-start gap-3 mono text-xs max-w-sm ${
            toast.type === 'warning' ? 'border-[#FFA000]' : toast.type === 'error' ? 'border-[#FF3D00]' : 'border-[#00FF41]'
          }`}>
            <div className="mt-0.5">
              {toast.type === 'warning' ? (
                <AlertTriangle className="w-4 h-4 text-[#FFA000]" />
              ) : toast.type === 'error' ? (
                <XCircle className="w-4 h-4 text-[#FF3D00]" />
              ) : (
                <CheckCircle className="w-4 h-4 text-[#00FF41]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-white text-xs">{toast.title}</div>
              <p className="text-[11px] text-[#AAA] mt-0.5 leading-normal">{toast.message}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
