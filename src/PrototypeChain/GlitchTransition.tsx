import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, random } from 'remotion';

export const GlitchTransition: React.FC<{ children: React.ReactNode; duration: number }> = ({ children, duration }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Fade In (0 - 30)
  // Fade Out (duration-30 - duration)
  const fadeInEnd = 30;
  const fadeOutStart = duration - 30;

  // Opacity Control
  const opacity = interpolate(
    frame,
    [0, fadeInEnd, fadeOutStart, duration],
    [0, 1, 1, 0]
  );

  // Glitch Effect Logic (Only during transitions)
  const isTransitioning = frame < fadeInEnd || frame > fadeOutStart;
  
  // Random slice params
  const sliceHeight = isTransitioning ? random(frame) * 50 + 10 : 0;
  const sliceY = isTransitioning ? random(frame + 100) * height : 0;
  const sliceOffset = isTransitioning ? (random(frame + 200) - 0.5) * 50 : 0;
  
  // Color Channel Split (RGB Shift)
  const shiftAmount = isTransitioning ? (random(frame + 300) - 0.5) * 20 : 0;

  return (
    <AbsoluteFill style={{ opacity, backgroundColor: '#000' }}>
      
      {/* Base Content */}
      <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
        {children}
      </div>

      {/* Glitch Overlay (Slice) */}
      {isTransitioning && (
        <div
          style={{
            position: 'absolute',
            top: sliceY,
            left: sliceOffset,
            width: '100%',
            height: sliceHeight,
            overflow: 'hidden',
            opacity: 0.7,
            zIndex: 100,
            filter: 'brightness(1.5) contrast(1.2)',
          }}
        >
          <div style={{ position: 'absolute', top: -sliceY, width: '100%', height: '100%' }}>
            {children}
          </div>
        </div>
      )}

      {/* RGB Split Simulation (Simple CSS text-shadow won't work on complex children, 
          so we use mix-blend-mode with cloned children for a cheap effect, 
          OR just a chromatic aberration filter if available. 
          Here we use a simple overlay color flash for impact.) 
      */}
      {isTransitioning && frame % 5 === 0 && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: frame % 10 === 0 ? 'rgba(255, 0, 0, 0.1)' : 'rgba(0, 255, 255, 0.1)',
            mixBlendMode: 'screen',
            pointerEvents: 'none',
          }}
        />
      )}

    </AbsoluteFill>
  );
};
