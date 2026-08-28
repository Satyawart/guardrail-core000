import React, { useEffect } from 'react';
import { AlertTriangle, AlertOctagon, RotateCcw, X, Check } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  details?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'success';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  details,
  confirmText = 'CONFIRM ACTION',
  cancelText = 'CANCEL',
  variant = 'danger',
  onConfirm,
  onCancel
}) => {
  // ESC key to cancel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const isDanger = variant === 'danger';
  const isWarning = variant === 'warning';

  const borderColor = isDanger ? 'border-[#FF3D00]' : isWarning ? 'border-[#FFA000]' : 'border-[#00FF41]';
  const iconColor = isDanger ? 'text-[#FF3D00]' : isWarning ? 'text-[#FFA000]' : 'text-[#00FF41]';
  const btnBg = isDanger 
    ? 'bg-[#FF3D00] hover:bg-[#E53600] text-black' 
    : isWarning 
    ? 'bg-[#FFA000] hover:bg-[#E59000] text-black' 
    : 'bg-[#00FF41] hover:bg-[#00E53A] text-black';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className={`w-full max-w-md bg-[#0E0E0E] border ${borderColor} p-5 space-y-4 mono text-xs shadow-2xl animate-in zoom-in-95`}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#222] pb-3">
          <div className="flex items-center gap-2">
            {isDanger ? (
              <AlertOctagon className={`w-4 h-4 ${iconColor}`} />
            ) : isWarning ? (
              <AlertTriangle className={`w-4 h-4 ${iconColor}`} />
            ) : (
              <Check className={`w-4 h-4 ${iconColor}`} />
            )}
            <span className={`font-bold text-sm text-white`}>{title}</span>
          </div>
          <button onClick={onCancel} className="text-[#888] hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message */}
        <p className="text-[#CCC] leading-relaxed text-xs">
          {message}
        </p>

        {/* Optional Details block */}
        {details && (
          <div className="p-2.5 bg-[#0A0A0A] border border-[#222] text-[#888] text-[11px] leading-relaxed">
            {details}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#222]">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 bg-[#1A1A1A] border border-[#333] hover:border-[#555] text-[#888] hover:text-white transition font-bold"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-1.5 ${btnBg} font-bold transition flex items-center gap-1.5 shadow-sm`}
          >
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
