import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export const StickFigure: React.FC<{
  x: number;
  y: number;
  scale?: number;
  color?: string;
  mood?: 'happy' | 'confused';
}> = ({ x, y, scale = 1, color = 'black', mood = 'happy' }) => {
  const frame = useCurrentFrame();
  const bounce = Math.sin(frame / 10) * 5;

  return (
    <svg
      style={{
        position: 'absolute',
        left: x,
        top: y + bounce,
        transform: `scale(${scale})`,
        overflow: 'visible',
      }}
      width="100"
      height="200"
      viewBox="0 0 100 200"
    >
      {/* Head */}
      <circle cx="50" cy="30" r="20" stroke={color} strokeWidth="4" fill="none" />
      
      {/* Body */}
      <line x1="50" y1="50" x2="50" y2="120" stroke={color} strokeWidth="4" />
      
      {/* Arms */}
      {mood === 'happy' ? (
        <>
          <line x1="50" y1="70" x2="20" y2="50" stroke={color} strokeWidth="4" />
          <line x1="50" y1="70" x2="80" y2="50" stroke={color} strokeWidth="4" />
        </>
      ) : (
        <>
          <line x1="50" y1="70" x2="20" y2="100" stroke={color} strokeWidth="4" />
          <line x1="50" y1="70" x2="80" y2="40" stroke={color} strokeWidth="4" />
          <text x="60" y="20" fontSize="20" fill={color}>?</text>
        </>
      )}

      {/* Legs */}
      <line x1="50" y1="120" x2="30" y2="180" stroke={color} strokeWidth="4" />
      <line x1="50" y1="120" x2="70" y2="180" stroke={color} strokeWidth="4" />
    </svg>
  );
};
