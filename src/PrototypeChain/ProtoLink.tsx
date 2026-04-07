import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, spring } from 'remotion';

export const ProtoLink: React.FC<{
  start: { x: number; y: number };
  end: { x: number; y: number };
  color?: string;
  delay?: number;
}> = ({ start, end, color = '#00ff9d', delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate control points for a curved path
  const midX = (start.x + end.x) / 2;
  const controlPoint1 = { x: midX, y: start.y };
  const controlPoint2 = { x: midX, y: end.y };

  const pathData = `M ${start.x} ${start.y} C ${controlPoint1.x} ${controlPoint1.y}, ${controlPoint2.x} ${controlPoint2.y}, ${end.x} ${end.y}`;

  // Animate the path drawing
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
  });

  const dashArray = 1000; // Approximate length
  const dashOffset = interpolate(progress, [0, 1], [dashArray, 0]);

  // Glowing effect
  const glowOpacity = interpolate(frame % 60, [0, 30, 60], [0.5, 1, 0.5]);

  return (
    <svg style={{ position: 'absolute', overflow: 'visible', width: 1, height: 1 }}>
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      {/* Background path (dim) */}
      <path
        d={pathData}
        stroke={color}
        strokeWidth="2"
        fill="none"
        opacity="0.3"
      />

      {/* Animated foreground path (bright) */}
      <path
        d={pathData}
        stroke={color}
        strokeWidth="3"
        fill="none"
        strokeDasharray={dashArray}
        strokeDashoffset={dashOffset}
        filter="url(#glow)"
        style={{
          opacity: glowOpacity,
          strokeLinecap: 'round',
        }}
      />
    </svg>
  );
};
