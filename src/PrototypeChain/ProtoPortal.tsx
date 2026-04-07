import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { ObjectBox } from './ObjectBox';
import { ProtoLink } from './ProtoLink';

export const ProtoPortal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Animation Timings
  const splitStart = 30;

  // Spring for splitting
  const splitProgress = spring({
    frame: frame - splitStart,
    fps,
    config: { damping: 15 },
  });

  // Calculate positions
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Dimensions - Scaled Up by 1.5x
  // Original width: 300 -> 450
  // Original height: 200 -> 300
  const boxWidth = 450;
  const boxHeight = 300;
  
  // Obj moves Left (Adjusted for larger size)
  const objX = interpolate(splitProgress, [0, 1], [centerX - boxWidth/2, centerX - boxWidth - 100]);
  
  // Proto moves Right (Adjusted for larger size)
  const protoX = interpolate(splitProgress, [0, 1], [centerX - boxWidth/2, centerX + 100]);
  const protoScale = interpolate(splitProgress, [0, 0.5, 1], [0.5, 0.8, 1]);
  const protoOpacity = interpolate(splitProgress, [0, 0.2, 1], [0, 1, 1]);

  // Link appears after split
  const linkStart = splitStart + 45;
  
  // Glow effect on split
  const glow = interpolate(splitProgress, [0, 0.5, 1], [0, 80, 0]);

  return (
    <AbsoluteFill>
      <div style={{
        position: 'absolute',
        top: 80,
        width: '100%',
        textAlign: 'center',
        color: '#fff',
        fontSize: 70, // Larger Title
        fontWeight: 'bold',
        opacity: interpolate(frame, [0, 30], [0, 1]),
        textShadow: '0 0 10px rgba(0,255,255,0.5)',
      }}>
        The Portal (传送门)
      </div>

      {/* Connection Line - Adjusted anchor points */}
      {frame > linkStart && (
        <ProtoLink
          start={{ x: objX + boxWidth, y: centerY + boxHeight/2 - 50 }} // Right side of Obj
          end={{ x: protoX, y: centerY + boxHeight/2 - 50 }} // Left side of Proto
          color="#00ffff" // Neon Cyan
          delay={linkStart}
        />
      )}

      {/* Object.prototype (The Hidden One) */}
      <div style={{
        position: 'absolute',
        left: protoX,
        top: centerY - 50, // Shift up slightly to center vertically better
        transform: `scale(${protoScale})`,
        opacity: protoOpacity,
        boxShadow: `0 0 ${glow}px #00ffff`,
        fontSize: 24, // Larger Text inside box
      }}>
        <ObjectBox
          x={0}
          y={0}
          width={boxWidth}
          height={boxHeight}
          label="Object.prototype"
          color="#00ffff"
          properties={['toString()', 'hasOwnProperty()', '__proto__: null']}
        />
      </div>

      {/* The Instance (Front) */}
      <div style={{
        position: 'absolute',
        left: objX,
        top: centerY - 50,
        zIndex: 10, // On top
        fontSize: 24, // Larger Text inside box
      }}>
        <ObjectBox
          x={0}
          y={0}
          width={boxWidth}
          height={boxHeight}
          label="{ } (Instance)"
          color="#ff79c6"
          properties={['__proto__ -> Object.prototype']}
        />
      </div>

    </AbsoluteFill>
  );
};
