import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import type {CodeHighlight, CodeSceneSpec} from '../types';

const getActiveHighlight = (
  frame: number,
  highlights: CodeHighlight[],
): CodeHighlight | undefined => {
  if (highlights.length === 0) {
    return undefined;
  }

  const segment = 90 / highlights.length;
  const index = Math.min(
    highlights.length - 1,
    Math.floor(Math.max(frame, 0) / segment),
  );

  return highlights[index];
};

export const CodeScene: React.FC<CodeSceneSpec> = ({
  heading,
  code,
  highlights,
}) => {
  const frame = useCurrentFrame();
  const activeHighlight = getActiveHighlight(frame, highlights);
  const lines = code.split('\n');

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#020617',
        color: '#e2e8f0',
        padding: '100px 120px',
        gap: 30,
      }}
    >
      <div style={{fontSize: 64, fontWeight: 800}}>{heading}</div>
      {activeHighlight ? (
        <div
          style={{
            alignSelf: 'flex-start',
            borderRadius: 999,
            backgroundColor: 'rgba(168, 85, 247, 0.16)',
            border: '1px solid rgba(192, 132, 252, 0.38)',
            color: '#d8b4fe',
            padding: '12px 24px',
            fontSize: 28,
          }}
        >
          当前重点：{activeHighlight.label}
        </div>
      ) : null}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          gap: 30,
          flex: 1,
        }}
      >
        <div
          style={{
            backgroundColor: '#0f172a',
            border: '1px solid rgba(148, 163, 184, 0.18)',
            borderRadius: 28,
            padding: '36px 32px',
            fontFamily: 'Consolas, Monaco, monospace',
            fontSize: 28,
            lineHeight: 1.7,
          }}
        >
          {lines.map((line, index) => {
            const lineNumber = index + 1;
            const highlighted =
              activeHighlight &&
              lineNumber >= activeHighlight.startLine &&
              lineNumber <= activeHighlight.endLine;
            const glow = highlighted
              ? interpolate(frame, [0, 15], [0.7, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                })
              : 0;

            return (
              <div
                key={`${lineNumber}-${line}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '60px 1fr',
                  gap: 20,
                  padding: '4px 8px',
                  borderRadius: 14,
                  backgroundColor: highlighted
                    ? `rgba(56, 189, 248, ${0.12 * glow})`
                    : 'transparent',
                  boxShadow: highlighted
                    ? `0 0 0 1px rgba(56,189,248,${0.22 * glow}) inset`
                    : 'none',
                }}
              >
                <span style={{color: '#64748b'}}>{lineNumber}</span>
                <span>{line || ' '}</span>
              </div>
            );
          })}
        </div>
        <div
          style={{
            background:
              'linear-gradient(180deg, rgba(59,130,246,0.12), rgba(15,23,42,0.65))',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: 28,
            padding: '36px 32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div
              style={{
                color: '#7dd3fc',
                fontSize: 24,
                textTransform: 'uppercase',
                letterSpacing: 3,
                marginBottom: 16,
              }}
            >
              Explanation
            </div>
            <div style={{fontSize: 34, lineHeight: 1.6}}>
              {activeHighlight?.label ?? '代码会按时间轴依次高亮。'}
            </div>
          </div>
          <div
            style={{
              borderTop: '1px solid rgba(148,163,184,0.2)',
              paddingTop: 20,
              color: '#cbd5e1',
              fontSize: 26,
              lineHeight: 1.6,
            }}
          >
            先理解每一行代码在做什么，再去看 Promise 如何把异步结果包装起来。
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
