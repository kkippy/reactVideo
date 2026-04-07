import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import type {SummarySceneSpec} from '../types';

export const SummaryScene: React.FC<SummarySceneSpec> = ({
  heading,
  takeaways,
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(circle at center, rgba(56,189,248,0.12), transparent 42%), #020617',
        color: '#e2e8f0',
        padding: '100px 140px',
      }}
    >
      <div style={{fontSize: 68, fontWeight: 800, marginBottom: 34}}>
        {heading}
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 24}}>
        {takeaways.map((takeaway, index) => {
          const start = index * 16;
          const opacity = interpolate(frame, [start, start + 12], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          return (
            <div
              key={takeaway}
              style={{
                display: 'flex',
                gap: 20,
                alignItems: 'center',
                opacity,
                borderRadius: 26,
                backgroundColor: 'rgba(15, 23, 42, 0.72)',
                border: '1px solid rgba(148,163,184,0.18)',
                padding: '24px 28px',
              }}
            >
              <div
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: 18,
                  backgroundColor: '#38bdf8',
                  color: '#082f49',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: 28,
                  fontWeight: 800,
                }}
              >
                {index + 1}
              </div>
              <div style={{fontSize: 38, lineHeight: 1.5}}>{takeaway}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
