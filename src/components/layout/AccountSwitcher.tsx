import React, { useState } from 'react';
import { LogOut, User as UserIcon, Shield, Briefcase, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AccountSwitcher: React.FC = () => {
  const { user, role, accountType, merchantName, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="relative z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-[#141414] border border-[#333] hover:border-[#555] rounded-md transition-colors group"
      >
        {accountType === 'OPERATOR' ? (
          <Shield className="w-3.5 h-3.5 text-blue-500" />
        ) : (
          <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
        )}
        <div className="text-left hidden md:block">
          <div className="text-[9px] text-[#888] font-mono leading-none mb-0.5">
            {accountType === 'OPERATOR' ? 'OPERATOR' : 'SANDBOX MERCHANT'}
          </div>
          <div className="text-[11px] font-bold text-white leading-none truncate max-w-[120px]">
            {merchantName || user.email}
          </div>
        </div>
        <ChevronDown className={`w-3 h-3 text-[#666] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 bg-[#0E0E0E] border border-[#333] shadow-2xl rounded-lg overflow-hidden z-50 py-1">
            <div className="px-3 py-2 border-b border-[#222]">
              <div className="text-[10px] font-mono text-[#888]">AUTHENTICATED AS</div>
              <div className="text-sm font-medium text-white truncate" title={user.email}>
                {user.email}
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="px-1.5 py-0.5 bg-[#222] text-[#AAA] text-[9px] rounded font-mono">ROLE: {role?.toUpperCase() || 'UNKNOWN'}</span>
              </div>
            </div>
            
            <div className="p-1">
              <button
                onClick={async () => {
                  setIsOpen(false);
                  await signOut();
                }}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors text-left font-mono"
              >
                <LogOut className="w-3.5 h-3.5" />
                SIGN OUT & SWITCH
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
