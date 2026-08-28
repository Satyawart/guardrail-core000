import React, { useState } from 'react';
import { useGuardrail } from '../../context/GuardrailContext';
import { CheckSquare, Check, X, AlertTriangle, ShieldCheck, UserCheck, ArrowRight, Clock } from 'lucide-react';
import { ApprovalRequest } from '../../types';
import { Tooltip } from '../ui/Tooltip';

export const ApprovalsView: React.FC = () => {
  const { approvals, approveRequest, rejectRequest } = useGuardrail();
  const [confirmingApproval, setConfirmingApproval] = useState<ApprovalRequest | null>(null);
  const [rejectingApproval, setRejectingApproval] = useState<ApprovalRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="p-4 bg-[#0E0E0E] border border-[#222] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#FF3D00]" />
            <h1 className="text-base font-bold mono text-white tracking-wider">SUPERVISOR APPROVAL QUEUE</h1>
            <span className={`text-[10px] mono px-2 py-0.5 border ${
              approvals.length > 0 ? 'bg-[#FF3D00]/10 border-[#FF3D00] text-[#FF3D00]' : 'bg-[#00FF41]/10 border-[#00FF41] text-[#00FF41]'
            }`}>
              {approvals.length} PENDING DECISIONS
            </span>
          </div>
          <p className="text-xs mono text-[#888] mt-1">
            Human-in-the-loop exception handling. Agents execute autonomously until hard boundaries or risk thresholds trigger supervisor review.
          </p>
        </div>

        {/* Autonomy vs Escalation Ratio */}
        <div className="p-2.5 bg-[#141414] border border-[#222] flex items-center gap-4 mono text-xs">
          <div>
            <span className="text-[9px] text-[#888] block">SAFE AUTONOMY RATIO</span>
            <span className="text-[#00FF41] font-bold text-sm">99.2% AUTONOMOUS</span>
          </div>
          <div className="h-6 w-px bg-[#333]" />
          <div>
            <span className="text-[9px] text-[#888] block">AVG REVIEW TIME</span>
            <span className="text-white font-bold text-sm">42 SECONDS</span>
          </div>
        </div>
      </div>

      {/* Rationale Banner */}
      <div className="p-3 bg-[#111] border border-[#222] mono text-xs flex items-center justify-between">
        <span className="text-[#AAA]">
          <span className="text-[#00FF41] font-bold">CORE PHILOSOPHY: </span>
          Autonomy first. Human oversight strictly on threshold exceptions.
        </span>
        <span className="text-[10px] text-[#888]">12 Decisions Total: 11 Autonomous, 1 Escalated</span>
      </div>

      {/* Approvals Grid */}
      <div className="space-y-3 mono text-xs">
        {approvals.length === 0 ? (
          <div className="p-12 text-center bg-[#0E0E0E] border border-[#222] space-y-2">
            <CheckSquare className="w-8 h-8 text-[#00FF41] mx-auto opacity-80" />
            <div className="text-sm font-bold text-white">ALL SUPERVISOR QUEUES CLEAR</div>
            <p className="text-xs text-[#888]">All agent runtimes are operating safely within autonomous thresholds.</p>
          </div>
        ) : (
          approvals.map((appr) => (
            <div
              key={appr.id}
              className="p-4 bg-[#0E0E0E] border border-[#222] hover:border-[#333] transition space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#1A1A1A]">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 bg-[#FFA000]" />
                  <span className="font-bold text-white text-sm">{appr.agentName}</span>
                  <span className="text-[10px] text-[#888]">({appr.merchant})</span>
                  <span className="text-[9px] px-1.5 py-0.2 bg-[#FFA000]/10 border border-[#FFA000] text-[#FFA000]">
                    [REQUIRES SIGN-OFF]
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[10px] text-[#888]">
                  <span>Requested: {appr.requestedAt}</span>
                  <span className="text-white font-bold text-sm">₹{appr.amount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Intent & Reason */}
              <div className="space-y-1.5">
                <div className="text-white font-bold">{appr.intent}</div>
                <div className="p-2.5 bg-[#141414] border border-[#222] text-[#AAA] text-xs leading-relaxed space-y-1">
                  <div className="flex items-center gap-1.5 text-[#FFA000]">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span className="font-bold">ESCALATION REASON:</span>
                  </div>
                  <p>{appr.reason}</p>
                </div>
              </div>

              {/* Recommendation & Risk */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                <div className="p-2 border border-[#222] bg-[#0A0A0A] sm:col-span-2">
                  <span className="text-[9px] text-[#888] block mb-0.5">GUARDRAIL AI RECOMMENDATION:</span>
                  <span className="text-[#00FF41]">{appr.recommendation}</span>
                </div>
                <div className="p-2 border border-[#222] bg-[#0A0A0A]">
                  <span className="text-[9px] text-[#888] block mb-0.5">RISK SCORE:</span>
                  <span className="text-white font-bold">{appr.riskScore.toFixed(2)} (LOW VELOCITY)</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-[#1A1A1A] flex items-center justify-end gap-2">
                <button
                  onClick={() => setRejectingApproval(appr)}
                  className="px-3 py-1.5 bg-[#141414] border border-[#FF3D00]/40 hover:border-[#FF3D00] text-[#FF3D00] text-xs transition flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>DECLINE REQUEST</span>
                </button>

                <button
                  onClick={() => setConfirmingApproval(appr)}
                  className="px-4 py-1.5 bg-[#00FF41] text-black font-bold text-xs hover:bg-[#00E53A] transition flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>AUTHORIZE TRANSACTION</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmingApproval && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0E0E0E] border border-[#00FF41] p-5 space-y-4 mono text-xs shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-2 text-[#00FF41] font-bold text-sm border-b border-[#222] pb-2">
              <UserCheck className="w-4 h-4" />
              <span>CONFIRM SUPERVISOR AUTHORIZATION</span>
            </div>

            <p className="text-[#CCC] leading-relaxed">
              Are you sure you want to authorize <span className="text-white font-bold">₹{confirmingApproval.amount.toLocaleString('en-IN')}</span> for <span className="text-white font-bold">{confirmingApproval.agentName}</span>?
            </p>

            <div className="p-2.5 bg-[#141414] border border-[#222] space-y-1 text-[11px]">
              <div className="text-[#888]">EXCEPTION: {confirmingApproval.policyException}</div>
              <div className="text-[#888]">SETTLEMENT GATEWAY: Razorpay Testnet (Direct Payout)</div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#222]">
              <button
                onClick={() => setConfirmingApproval(null)}
                className="px-3 py-1.5 bg-[#1A1A1A] text-[#888] hover:text-white"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  approveRequest(confirmingApproval.id);
                  setConfirmingApproval(null);
                }}
                className="px-4 py-1.5 bg-[#00FF41] text-black font-bold hover:bg-[#00E53A]"
              >
                CONFIRM & EXECUTE PAYOUT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {rejectingApproval && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0E0E0E] border border-[#FF3D00] p-5 space-y-4 mono text-xs shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-2 text-[#FF3D00] font-bold text-sm border-b border-[#222] pb-2">
              <AlertTriangle className="w-4 h-4" />
              <span>DECLINE APPROVAL REQUEST</span>
            </div>

            <p className="text-[#CCC]">
              Specify the reason for declining <span className="text-white font-bold">{rejectingApproval.agentName}</span>'s request:
            </p>

            <input
              type="text"
              placeholder="e.g. Breaches quarterly budget cap"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#333] p-2 text-white outline-none"
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-[#222]">
              <button
                onClick={() => setRejectingApproval(null)}
                className="px-3 py-1.5 bg-[#1A1A1A] text-[#888] hover:text-white"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  rejectRequest(rejectingApproval.id, rejectReason);
                  setRejectingApproval(null);
                  setRejectReason('');
                }}
                className="px-4 py-1.5 bg-[#FF3D00] text-black font-bold hover:bg-[#E53600]"
              >
                CONFIRM REJECTION
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
