import React from 'react';

interface AuthorizationRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  showStatusIndicator?: boolean;
}

export const AuthorizationRing: React.FC<AuthorizationRingProps> = ({
  percentage,
  size = 140,
  strokeWidth = 6,
  label,
  sublabel,
  showStatusIndicator = true
}) => {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const isOver = percentage > 85;
  const isElevated = percentage > 65;

  const strokeColor = isOver ? '#FF3D00' : isElevated ? '#FFB52E' : '#00FF41';
  const textColor = isOver ? 'text-[#FF3D00]' : isElevated ? 'text-[#FFB52E]' : 'text-[#00FF41]';
  const status = isOver ? 'CRITICAL_UTILIZATION' : isElevated ? 'ELEVATED_BAND' : 'OPTIMAL_PERIMETER';

  return (
    <div className="relative inline-flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Geometric crosshairs behind */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox={`0 0 ${size} ${size}`}>
          <line x1={size / 2} y1="0" x2={size / 2} y2={size} stroke="#FFF" strokeWidth="0.5" strokeDasharray="2 2" />
          <line x1="0" y1={size / 2} x2={size} y2={size / 2} stroke="#FFF" strokeWidth="0.5" strokeDasharray="2 2" />
        </svg>

        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          {/* Base track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#222222"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray="4 4"
          />

          {/* Active progress */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="square"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
          <span className={`text-xl font-bold mono tracking-tight ${textColor}`}>
            {percentage.toFixed(1)}%
          </span>
          <span className="text-[9px] mono uppercase tracking-wider text-[#888]">
            {sublabel || 'UTILIZED'}
          </span>
        </div>
      </div>

      {showStatusIndicator && (
        <div className="mt-2 text-center">
          <div className="text-[11px] font-bold mono text-[#E0E0E0]">{label || 'AUTHORITY PERIMETER'}</div>
          <div className="text-[9px] mono text-[#888] tracking-widest mt-0.5">[{status}]</div>
        </div>
      )}
    </div>
  );
};
