import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, spring } from 'remotion';

export const SearchPulse: React.FC<{
  start: { x: number; y: number };
  end: { x: number; y: number };
  triggerFrame: number;
  duration?: number;
}> = ({ start, end, triggerFrame, duration = 60 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Only render if triggered
  if (frame < triggerFrame) return null;

  // Pulse movement (child -> proto)
  const progress = interpolate(frame, [triggerFrame, triggerFrame + duration], [0, 1], { extrapolateRight: 'clamp' });
  
  const currentX = interpolate(progress, [0, 1], [start.x, end.x]);
  const currentY = interpolate(progress, [0, 1], [start.y, end.y]);

  // Shake effect if not found (simulated at the end of the pulse)
  // We assume the pulse ends at 'end' point, and if it's the "not found" case, we shake there.
  // For simplicity, let's just make the pulse itself glow.
  
  const scale = spring({
    frame: frame - triggerFrame,
    fps,
    config: { damping: 10 },
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: currentX - 15, // Center the 30px circle
        top: currentY - 15,
        width: 30,
        height: 30,
        borderRadius: '50%',
        backgroundColor: '#00ffff',
        boxShadow: '0 0 20px #00ffff',
        opacity: 0.8,
        transform: `scale(${scale})`,
        zIndex: 100,
      }}
    />
  );
};
