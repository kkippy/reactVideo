import React from 'react';
import { useCurrentFrame } from 'remotion';

export const CodePanel: React.FC<{ code: string; currentLine: number }> = ({ code, currentLine }) => {
  return (
    <div style={{
      width: 400,
      height: 500,
      backgroundColor: '#282a36',
      border: '4px solid #6272a4',
      borderRadius: 10,
      padding: 10,
      fontFamily: 'monospace',
      fontSize: 16,
      color: '#f8f8f2',
      overflow: 'hidden',
    }}>
      {code.split('\n').map((line, i) => (
        <div
          key={i}
          style={{
            backgroundColor: i === currentLine ? '#44475a' : 'transparent',
            padding: '2px 5px',
            borderLeft: i === currentLine ? '4px solid #50fa7b' : '4px solid transparent',
          }}
        >
          {line}
        </div>
      ))}
    </div>
  );
};
