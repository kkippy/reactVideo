import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import type {FlowSceneSpec} from '../types';

export const FlowScene: React.FC<FlowSceneSpec> = ({
  heading,
  steps,
  stateLabels,
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        background:
          'linear-gradient(180deg, rgba(15,23,42,1) 0%, rgba(30,41,59,1) 100%)',
        color: '#e2e8f0',
        padding: '96px 100px',
      }}
    >
      <div style={{fontSize: 64, fontWeight: 800, marginBottom: 50}}>
        {heading}
      </div>
      <div
        style={{
          display: 'flex',
          gap: 22,
          alignItems: 'stretch',
          flex: 1,
        }}
      >
        {steps.map((step, index) => {
          const start = index * 18;
          const reveal = interpolate(frame, [start, start + 14], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          return (
            <React.Fragment key={step}>
              <div
                style={{
                  flex: 1,
                  borderRadius: 28,
                  border: '1px solid rgba(148,163,184,0.18)',
                  backgroundColor: `rgba(15, 23, 42, ${0.45 + reveal * 0.25})`,
                  padding: '34px 28px',
                  transform: `translateY(${(1 - reveal) * 30}px)`,
                  opacity: reveal,
                  boxShadow:
                    index === 1
                      ? '0 0 0 1px rgba(56,189,248,0.3), 0 0 36px rgba(56,189,248,0.18)'
                      : 'none',
                }}
              >
                <div style={{fontSize: 24, color: '#7dd3fc', marginBottom: 18}}>
                  Step {index + 1}
                </div>
                <div style={{fontSize: 42, fontWeight: 700, marginBottom: 16}}>
                  {step}
                </div>
                {stateLabels?.[index] ? (
                  <div style={{fontSize: 28, color: '#cbd5e1', lineHeight: 1.5}}>
                    {stateLabels[index]}
                  </div>
                ) : null}
              </div>
              {index < steps.length - 1 ? (
                <div
                  style={{
                    width: 70,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: '#38bdf8',
                    fontSize: 46,
                    opacity: reveal,
                  }}
                >
                  →
                </div>
              ) : null}
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
