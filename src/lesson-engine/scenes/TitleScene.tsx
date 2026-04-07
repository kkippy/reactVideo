import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import type {TitleSceneSpec} from '../types';

export const TitleScene: React.FC<TitleSceneSpec> = ({title, subtitle}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: {
      damping: 18,
      stiffness: 120,
    },
  });

  const titleTranslate = interpolate(entrance, [0, 1], [50, 0]);
  const subtitleOpacity = interpolate(frame, [12, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(circle at top, rgba(59,130,246,0.22), transparent 45%), #020617',
        color: '#e2e8f0',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 120,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          transform: `translateY(${titleTranslate}px) scale(${0.92 + entrance * 0.08})`,
          opacity: entrance,
          maxWidth: 1400,
        }}
      >
        <div
          style={{
            color: '#38bdf8',
            fontSize: 34,
            letterSpacing: 6,
            textTransform: 'uppercase',
            marginBottom: 24,
          }}
        >
          JavaScript Async Basics
        </div>
        <div
          style={{
            fontSize: 108,
            lineHeight: 1.1,
            fontWeight: 800,
            marginBottom: 24,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 42,
            lineHeight: 1.45,
            opacity: subtitleOpacity,
            color: '#cbd5e1',
          }}
        >
          {subtitle}
        </div>
      </div>
    </AbsoluteFill>
  );
};
