import React from 'react';
import { useGuardrail } from '../../context/GuardrailContext';
import { AlertTriangle, ShieldAlert, CheckCircle, Flame, Lock, ArrowRight, Bell } from 'lucide-react';

export const GlobalAlertBar: React.FC = () => {
  const { approvals, transactions, setCurrentNav } = useGuardrail();

  const pendingApprovalsCount = approvals.length;
  const blockedTxCount = transactions.filter(t => t.status === 'BLOCKED').length;

  return (
    <div className="bg-[#0E0E0E] border border-[#222] p-2.5 flex flex-wrap items-center justify-between gap-2 mono text-xs select-none">
      {/* Alert Header */}
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 bg-[#00FF41] animate-pulse" />
        <span className="font-bold text-white tracking-wider text-[11px]">SYSTEM ALERTS & RUNTIME SIGNALS:</span>
      </div>

      {/* Alert Badges Grid */}
      <div className="flex flex-wrap items-center gap-2 text-[10px]">
        {/* Human Reviews Pending */}
        <button
          onClick={() => setCurrentNav('APPROVALS')}
          className={`px-2.5 py-1 border flex items-center gap-1.5 transition ${
            pendingApprovalsCount > 0
              ? 'bg-[#FFA000]/10 border-[#FFA000] text-[#FFA000] hover:bg-[#FFA000]/20'
              : 'bg-[#111] border-[#222] text-[#888]'
          }`}
          title="Click to view Human Supervisor Approval Queue"
        >
          <AlertTriangle className="w-3 h-3" />
          <span>{pendingApprovalsCount} HUMAN REVIEWS PENDING</span>
        </button>

        {/* Policy Violations Blocked */}
        <button
          onClick={() => setCurrentNav('POLICIES')}
          className="px-2.5 py-1 bg-[#FF3D00]/10 border border-[#FF3D00] text-[#FF3D00] hover:bg-[#FF3D00]/20 flex items-center gap-1.5 transition"
          title="Click to view Policy Repository and Blocked Violations"
        >
          <ShieldAlert className="w-3 h-3" />
          <span>142 POLICY VIOLATIONS BLOCKED</span>
        </button>

        {/* Failure Recoveries */}
        <button
          onClick={() => setCurrentNav('FAILURE_LAB')}
          className="px-2.5 py-1 bg-[#00FF41]/10 border border-[#00FF41] text-[#00FF41] hover:bg-[#00FF41]/20 flex items-center gap-1.5 transition"
          title="Click to view Failure Lab & Chaos Recovery"
        >
          <Flame className="w-3 h-3" />
          <span>1 FAILURE RECOVERED</span>
        </button>

        {/* Duplicate Charges Blocked */}
        <button
          onClick={() => setCurrentNav('AUDIT')}
          className="px-2.5 py-1 bg-[#111] border border-[#333] text-[#CCC] hover:border-[#00FF41] flex items-center gap-1.5 transition"
          title="Click to view Idempotency Ledger & Audit Trail"
        >
          <Lock className="w-3 h-3 text-[#00FF41]" />
          <span>0 PAYMENT DUPLICATES</span>
        </button>

        {/* Zero Critical Incidents */}
        <div className="px-2 py-1 bg-[#141414] border border-[#222] text-[#888] flex items-center gap-1">
          <CheckCircle className="w-3 h-3 text-[#00FF41]" />
          <span>0 CRITICAL INCIDENTS</span>
        </div>
      </div>
    </div>
  );
};
