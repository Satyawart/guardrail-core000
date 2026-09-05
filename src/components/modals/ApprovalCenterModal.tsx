import React from 'react';
import { useGuardrail } from '../../context/GuardrailContext';
import { formatINR } from '../../utils/formatters';
import { X, Check, ShieldAlert, Clock, AlertTriangle } from 'lucide-react';

interface ApprovalCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export const ApprovalCenterModal: React.FC<ApprovalCenterModalProps> = ({
  isOpen,
  onClose,
  onApprove,
  onReject
}) => {
  const { approvals, approveRequest, rejectRequest } = useGuardrail();
  const requests = approvals.filter(a => a.status === 'PENDING');

  if (!isOpen) return null;

  const handleAction = (id: string, action: 'APPROVED' | 'REJECTED') => {
    if (action === 'APPROVED') {
      approveRequest(id);
      if (onApprove) onApprove(id);
    }
    if (action === 'REJECTED') {
      rejectRequest(id, 'Declined via Supervisor Modal');
      if (onReject) onReject(id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-[#0A0A0A] border border-[#333] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-xs mono">
        {/* Header */}
        <div className="p-4 border-b border-[#222] bg-[#0E0E0E] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 bg-[#FFB52E]" />
            <h2 className="text-sm font-bold text-white tracking-wider">
              SUPERVISOR APPROVAL QUEUE (HUMAN-IN-THE-LOOP)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-[#141414] border border-[#222] text-[#888] hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="p-3 bg-[#0E0E0E] border border-[#222] text-[10px] text-[#888] flex items-center justify-between">
            <span>AUTONOMOUS RISK ROUTING: AI proposals exceeding hard spend or refund caps route here.</span>
            <span className="text-[#FFB52E] font-bold">[{requests.length} PENDING]</span>
          </div>

          {requests.length === 0 ? (
            <div className="p-12 text-center text-[#666] border border-dashed border-[#222]">
              All supervisor approvals cleared. System operational.
            </div>
          ) : (
            requests.map((req) => (
              <div key={req.id} className="p-3.5 bg-[#0E0E0E] border border-[#222] space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{req.id}</span>
                    <span className="text-[#888]">by {req.agentId}</span>
                  </div>
                  <span className="text-sm font-bold text-white">
                    {formatINR(req.amount)}
                  </span>
                </div>

                <div className="p-2.5 bg-[#0A0A0A] border border-[#222] text-[10px] text-[#CCC]">
                  <span className="text-[#666] block mb-0.5">AGENT PROPOSED ACTION:</span>
                  "{req.intent}"
                </div>

                <div className="flex items-center justify-between text-[10px] text-[#888]">
                  <span>TRIGGER: {req.reason}</span>
                  <span className="text-[#FFB52E]">RISK: {(req.riskScore * 100).toFixed(0)}%</span>
                </div>

                {/* Decision Actions */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#222]">
                  <button
                    onClick={() => handleAction(req.id, 'REJECTED')}
                    className="px-3 py-1 bg-[#1A1A1A] hover:bg-[#222] border border-[#FF3D00]/40 text-[#FF3D00] transition"
                  >
                    DECLINE &amp; HALT
                  </button>
                  <button
                    onClick={() => handleAction(req.id, 'APPROVED')}
                    className="px-3 py-1 bg-[#00FF41] hover:bg-[#34d399] text-black font-bold transition"
                  >
                    AUTHORIZE &amp; EXECUTE ON RAZORPAY
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#222] bg-[#0E0E0E] flex items-center justify-between">
          <span className="text-[#666]">SUPERVISOR AUDIT LOG #9914</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-[#1A1A1A] hover:bg-[#222] border border-[#333] text-white"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
