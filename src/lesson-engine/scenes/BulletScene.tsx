import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import type {BulletSceneSpec} from '../types';

export const BulletScene: React.FC<BulletSceneSpec> = ({
  heading,
  bullets,
  emphasis,
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0f172a',
        color: '#e2e8f0',
        padding: '110px 140px',
      }}
    >
      <div style={{fontSize: 68, fontWeight: 800, marginBottom: 28}}>
        {heading}
      </div>
      {emphasis ? (
        <div
          style={{
            display: 'inline-block',
            alignSelf: 'flex-start',
            backgroundColor: 'rgba(56, 189, 248, 0.12)',
            color: '#7dd3fc',
            border: '1px solid rgba(125, 211, 252, 0.35)',
            borderRadius: 999,
            padding: '12px 24px',
            fontSize: 28,
            marginBottom: 36,
          }}
        >
          {emphasis}
        </div>
      ) : null}
      <div style={{display: 'flex', flexDirection: 'column', gap: 28}}>
        {bullets.map((bullet, index) => {
          const start = 12 + index * 16;
          const opacity = interpolate(frame, [start, start + 12], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const translateY = interpolate(
            frame,
            [start, start + 12],
            [24, 0],
            {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            },
          );

          return (
            <div
              key={bullet}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 20,
                opacity,
                transform: `translateY(${translateY}px)`,
                backgroundColor: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid rgba(148, 163, 184, 0.15)',
                borderRadius: 24,
                padding: '24px 28px',
              }}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  marginTop: 16,
                  borderRadius: 999,
                  backgroundColor: '#38bdf8',
                  boxShadow: '0 0 18px rgba(56,189,248,0.65)',
                }}
              />
              <div style={{fontSize: 38, lineHeight: 1.5}}>{bullet}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
