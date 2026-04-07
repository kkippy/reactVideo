import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, random } from 'remotion';

export const TheVoid: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Animation Timings
  const fadeStart = 30;
  const fadeDuration = 60;
  const shatterStart = 90;
  const endTextStart = 150;

  // Background fade to black
  const bgOpacity = interpolate(frame, [fadeStart, fadeStart + fadeDuration], [0, 1]);

  // Shrinking Lines (Simulated with scaling a central container)
  const scale = interpolate(frame, [0, fadeStart + fadeDuration], [1, 0]);

  // NULL Text Shatter Effect
  // We'll split "NULL" into letters and explode them
  const nullLetters = "NULL".split('');
  
  const shatterProgress = interpolate(frame, [shatterStart, shatterStart + 60], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#050505' }}> {/* Ensure base is dark */}
      
      {/* Title */}
      <div style={{
        position: 'absolute',
        top: 100,
        width: '100%',
        textAlign: 'center',
        color: '#fff',
        fontSize: 60,
        fontWeight: 'bold',
        opacity: interpolate(frame, [0, 30, 100], [0, 1, 0]), // Fade in then out quickly
        textShadow: '0 0 10px rgba(255, 85, 85, 0.5)',
        zIndex: 5,
      }}>
        The Void (虚无之境)
      </div>

      {/* Background Fade Overlay */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: '#000',
        opacity: bgOpacity,
        zIndex: 1,
      }} />

      {/* Shrinking Content */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: `translate(-50%, -50%) scale(${scale})`,
        zIndex: 2,
      }}>
         {/* Representing the connections shrinking */}
         <div style={{ width: 400, height: 400, border: '2px dashed #44475a', borderRadius: '50%' }} />
         <div style={{ position: 'absolute', top: '50%', left: '50%', width: 200, height: 2, background: '#bd93f9', transform: 'translate(-50%, -50%) rotate(45deg)' }} />
         <div style={{ position: 'absolute', top: '50%', left: '50%', width: 200, height: 2, background: '#bd93f9', transform: 'translate(-50%, -50%) rotate(-45deg)' }} />
      </div>

      {/* The NULL Text (Exploding) */}
      {frame > fadeStart && (
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 3,
          display: 'flex',
          gap: 20,
        }}>
          {nullLetters.map((char, i) => {
            const seed = i * 123;
            const xDir = (random(seed) - 0.5) * 2; // -1 to 1
            const yDir = (random(seed + 1) - 0.5) * 2;
            
            const x = interpolate(shatterProgress, [0, 1], [0, xDir * 500]);
            const y = interpolate(shatterProgress, [0, 1], [0, yDir * 500]);
            const rotation = interpolate(shatterProgress, [0, 1], [0, xDir * 360]);
            const opacity = interpolate(shatterProgress, [0, 0.8, 1], [1, 1, 0]);

            return (
              <span
                key={i}
                style={{
                  color: '#ff5555',
                  fontSize: 120,
                  fontWeight: 'bold',
                  fontFamily: 'monospace',
                  transform: `translate(${x}px, ${y}px) rotate(${rotation}deg)`,
                  opacity,
                  textShadow: '0 0 20px #ff5555',
                }}
              >
                {char}
              </span>
            );
          })}
        </div>
      )}

      {/* End Text */}
      <div style={{
        position: 'absolute',
        top: '60%',
        width: '100%',
        textAlign: 'center',
        color: '#f8f8f2',
        fontSize: 40,
        fontFamily: 'serif',
        opacity: interpolate(frame, [endTextStart, endTextStart + 30], [0, 1]),
        zIndex: 4,
        letterSpacing: 5,
      }}>
        End of the Chain. (链条终点)
      </div>

    </AbsoluteFill>
  );
};
