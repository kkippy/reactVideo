import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

export const EventLoopWheel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Infinite rotation
  const rotation = interpolate(frame, [0, 300], [0, 360]);

  return (
    <div style={{
      width: 200,
      height: 200,
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Background Circle */}
      <div style={{
        position: 'absolute',
        width: 180,
        height: 180,
        border: '10px dashed #f1fa8c',
        borderRadius: '50%',
        transform: `rotate(${rotation}deg)`,
      }} />
      
      {/* Center Text */}
      <div style={{
        position: 'absolute',
        textAlign: 'center',
        color: '#f1fa8c',
        fontWeight: 'bold',
        fontSize: 24,
        textShadow: '0 0 10px rgba(241, 250, 140, 0.5)',
      }}>
        Event Loop
      </div>
      
      {/* Arrows indicating check direction */}
      <div style={{
        position: 'absolute',
        top: -20,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 0, 
        height: 0, 
        borderLeft: '10px solid transparent',
        borderRight: '10px solid transparent',
        borderBottom: '20px solid #f1fa8c',
      }} />
    </div>
  );
};
