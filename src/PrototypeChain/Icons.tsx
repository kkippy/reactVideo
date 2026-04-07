import React from 'react';

export const JsIcon: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#F7DF1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 2h20v20H2z" stroke="none" fill="#F7DF1E" fillOpacity="0.1" />
    <path d="M2 2h20v20H2z" stroke="#F7DF1E" strokeWidth="2" />
    <path d="M16 16v-4" />
    <path d="M12 16c0-2.5-2-2.5-2-5" />
  </svg>
);

export const ObjectIcon: React.FC<{ size?: number; color?: string }> = ({ size = 40, color = '#ff79c6' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="9" y1="9" x2="15" y2="9" />
    <line x1="9" y1="15" x2="15" y2="15" />
  </svg>
);

export const FunctionIcon: React.FC<{ size?: number; color?: string }> = ({ size = 40, color = '#50fa7b' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 9l3 3-3 3" />
    <line x1="13" y1="15" x2="16" y2="15" />
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <text x="14" y="11" fontSize="8" fill={color} stroke="none" fontFamily="monospace">f(x)</text>
  </svg>
);

export const NullIcon: React.FC<{ size?: number; color?: string }> = ({ size = 40, color = '#6272a4' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
  </svg>
);
