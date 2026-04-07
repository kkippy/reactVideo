import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, random } from 'remotion';

export const TechBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Grid configuration
  const gridSize = 100;
  
  // Orb 1 Animation (Dark Purple)
  const orb1X = interpolate(frame, [0, 5400], [width * 0.2, width * 0.8], { extrapolateRight: 'clamp' });
  const orb1Y = interpolate(frame, [0, 5400], [height * 0.2, height * 0.6], { extrapolateRight: 'clamp' });
  const orb1Scale = interpolate(frame, [0, 2700, 5400], [1, 1.2, 1]);

  // Orb 2 Animation (Dark Blue)
  const orb2X = interpolate(frame, [0, 5400], [width * 0.8, width * 0.3], { extrapolateRight: 'clamp' });
  const orb2Y = interpolate(frame, [0, 5400], [height * 0.8, height * 0.4], { extrapolateRight: 'clamp' });
  const orb2Scale = interpolate(frame, [0, 2700, 5400], [1.2, 1, 1.3]);

  // Binary Rain / Data Stream
  const streamColumns = Math.floor(width / 30);
  const streams = useMemo(() => {
    return new Array(20).fill(0).map((_, i) => ({
      x: Math.floor(random(i) * streamColumns) * 30,
      speed: random(i + 100) * 5 + 2,
      length: Math.floor(random(i + 200) * 10) + 5,
      opacity: random(i + 300) * 0.3 + 0.1,
      delay: random(i + 400) * 100,
    }));
  }, [streamColumns]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#050505', overflow: 'hidden' }}>
      
      {/* 1. Glowing Orbs (Framer Motion vibe) */}
      <div
        style={{
          position: 'absolute',
          left: orb1X - 400,
          top: orb1Y - 400,
          width: 800,
          height: 800,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(100, 20, 200, 0.15) 0%, rgba(0,0,0,0) 70%)',
          filter: 'blur(80px)',
          transform: `scale(${orb1Scale})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: orb2X - 400,
          top: orb2Y - 400,
          width: 800,
          height: 800,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(20, 50, 200, 0.15) 0%, rgba(0,0,0,0) 70%)',
          filter: 'blur(80px)',
          transform: `scale(${orb2Scale})`,
        }}
      />

      {/* 2. Binary Data Streams (Matrix-lite) */}
      {streams.map((stream, i) => {
        const y = ((frame - stream.delay) * stream.speed) % (height + 300) - 300;
        if (frame < stream.delay) return null;
        
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: stream.x,
              top: y,
              color: '#00ffff',
              fontSize: 14,
              fontFamily: 'monospace',
              opacity: stream.opacity,
              display: 'flex',
              flexDirection: 'column',
              lineHeight: 1,
              textShadow: '0 0 5px #00ffff',
            }}
          >
            {new Array(stream.length).fill(0).map((_, j) => (
              <span key={j} style={{ opacity: 1 - j / stream.length }}>
                {Math.random() > 0.5 ? '1' : '0'}
              </span>
            ))}
          </div>
        );
      })}

      {/* 3. SVG Grid (Weak lines) */}
      <svg style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.1 }}>
        <defs>
          <pattern id="gridPattern" width={gridSize} height={gridSize} patternUnits="userSpaceOnUse">
            <path d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#gridPattern)" />
      </svg>

      {/* 4. Noise Overlay (Film grain) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.05,
          pointerEvents: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
    </AbsoluteFill>
  );
};
