import React from 'react';

export const CodeBlock: React.FC<{
  code: string;
  x?: number;
  y?: number;
  scale?: number;
  highlightLine?: number;
}> = ({ code, x = 0, y = 0, scale = 1, highlightLine = -1 }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `scale(${scale})`,
        backgroundColor: '#282c34',
        color: '#abb2bf',
        padding: 20,
        borderRadius: 10,
        fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
        fontSize: 24,
        whiteSpace: 'pre',
        boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
      }}
    >
      {code.split('\n').map((line, i) => (
        <div
          key={i}
          style={{
            backgroundColor: i === highlightLine ? '#3e4451' : 'transparent',
            width: '100%',
            padding: '2px 0',
          }}
        >
          <span style={{ color: '#5c6370', marginRight: 15, userSelect: 'none' }}>{i + 1}</span>
          {line}
        </div>
      ))}
    </div>
  );
};
