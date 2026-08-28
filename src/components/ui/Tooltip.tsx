import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface TooltipProps {
  content: string;
  term?: string;
  children?: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, term, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <span 
      className="relative inline-flex items-center gap-1 cursor-help group"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children ? (
        children
      ) : (
        <span className="inline-flex items-center gap-0.5 text-inherit border-b border-dotted border-[#666]">
          {term}
          <HelpCircle className="w-2.5 h-2.5 text-[#888] opacity-70 group-hover:opacity-100" />
        </span>
      )}

      {isVisible && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2.5 bg-[#141414] border border-[#333] shadow-2xl text-[11px] mono text-[#DDD] leading-relaxed z-50 pointer-events-none rounded-none before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-[#333]">
          <span className="block text-[#00FF41] font-bold mb-1 tracking-wider text-[10px]">
            {term ? `[DEFINITION: ${term.toUpperCase()}]` : '[SYSTEM PARAMETER]'}
          </span>
          {content}
        </span>
      )}
    </span>
  );
};
