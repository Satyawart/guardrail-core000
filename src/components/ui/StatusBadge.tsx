import React from 'react';
import { TransactionStatus } from '../../types';

interface StatusBadgeProps {
  status: TransactionStatus;
  label?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, size = 'md' }) => {
  const getStyles = () => {
    switch (status) {
      case 'SUCCESS':
        return {
          bg: 'bg-[#00FF41]/10 border border-[#00FF41]/40 text-[#00FF41]',
          text: label || '[PERMIT]'
        };
      case 'BLOCKED':
        return {
          bg: 'bg-[#FF3D00]/10 border border-[#FF3D00]/40 text-[#FF3D00]',
          text: label || '[BLOCK]'
        };
      case 'REVIEW':
        return {
          bg: 'bg-[#FFB52E]/10 border border-[#FFB52E]/40 text-[#FFB52E]',
          text: label || '[REVIEW]'
        };
      case 'PROCESSING':
        return {
          bg: 'bg-white/10 border border-white/30 text-white',
          text: label || '[PROCESSING]'
        };
      case 'AI':
        return {
          bg: 'bg-[#1A1A1A] border border-[#444] text-[#E0E0E0]',
          text: label || '[ADJUST]'
        };
      default:
        return {
          bg: 'bg-[#1A1A1A] border border-[#333] text-[#888]',
          text: label || `[${status}]`
        };
    }
  };

  const config = getStyles();
  const padding = size === 'sm' ? 'px-1.5 py-0.2 text-[10px]' : 'px-2 py-0.5 text-[11px]';

  return (
    <span className={`inline-flex items-center mono font-bold tracking-wider ${config.bg} ${padding} select-none`}>
      {config.text}
    </span>
  );
};
