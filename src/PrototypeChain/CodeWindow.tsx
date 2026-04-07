import React from 'react';
import { useCurrentFrame } from 'remotion';

export const CodeWindow: React.FC<{
  code: string;
  startFrame: number;
  endFrame: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}> = ({ code, startFrame, endFrame, x = 100, y = 100, width = 600, height = 400 }) => {
  const frame = useCurrentFrame();

  // Typewriter logic
  const duration = endFrame - startFrame;
  const progress = Math.min(1, Math.max(0, (frame - startFrame) / duration));
  const charCount = Math.floor(progress * code.length);
  const currentText = code.substring(0, charCount);

  // Cursor blinking logic
  const showCursor = frame > startFrame && (frame % 30 < 15);

  // Simple syntax highlighting (manual simulation)
  // This is a basic replacement for prism-react-renderer since we couldn't install it
  const highlight = (text: string) => {
    const parts = text.split(/(\s+|[(){}.=;])/);
    return parts.map((part, i) => {
      let color = '#f8f8f2'; // Default
      if (['const', 'function', 'return', 'if', 'else'].includes(part)) color = '#ff79c6'; // Pink
      else if (['true', 'false', 'null', 'undefined'].includes(part)) color = '#bd93f9'; // Purple
      else if (!isNaN(Number(part))) color = '#bd93f9'; // Number
      else if (part.startsWith('"') || part.startsWith("'")) color = '#f1fa8c'; // Yellow
      else if (['console', 'Object', 'Function'].includes(part)) color = '#8be9fd'; // Cyan
      else if (['log', 'toString'].includes(part)) color = '#50fa7b'; // Green
      
      return <span key={i} style={{ color }}>{part}</span>;
    });
  };

  // Ray.so style gradient padding
  const padding = 40;
  
  return (
    <div
      style={{
        position: 'absolute',
        left: x - padding,
        top: y - padding,
        width: width + padding * 2,
        height: height + padding * 2,
        background: 'linear-gradient(140deg, rgb(165, 55, 253) 0%, rgb(61, 194, 236) 100%)',
        borderRadius: 16,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
      }}
    >
      <div
        style={{
          width,
          height,
          backgroundColor: '#282a36', // Dracula Background
          borderRadius: 8,
          fontFamily: 'Fira Code, Consolas, monospace',
          fontSize: 24,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Window Header */}
        <div style={{ height: 40, backgroundColor: '#21222c', display: 'flex', alignItems: 'center', paddingLeft: 15, borderBottom: '1px solid #191a21' }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ff5555', marginRight: 8 }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#f1fa8c', marginRight: 8 }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#50fa7b', marginRight: 20 }} />
          <div style={{ color: '#6272a4', fontSize: 14, fontFamily: 'sans-serif' }}>script.js</div>
        </div>

        {/* Code Area */}
        <div style={{ display: 'flex', flex: 1 }}>
          {/* Line Numbers */}
          <div style={{ 
            width: 50, 
            backgroundColor: '#282a36', 
            borderRight: '1px solid #44475a',
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'flex-end',
            padding: '20px 10px',
            color: '#6272a4',
            userSelect: 'none'
          }}>
            {code.split('\n').map((_, i) => (
              <div key={i} style={{ lineHeight: '1.5' }}>{i + 1}</div>
            ))}
          </div>

          {/* Code Content */}
          <div style={{ padding: 20, color: '#f8f8f2', whiteSpace: 'pre-wrap', lineHeight: '1.5', flex: 1 }}>
            {highlight(currentText)}
            {showCursor && <span style={{ borderRight: '2px solid #f8f8f2', marginLeft: 2 }}>&nbsp;</span>}
          </div>
        </div>
      </div>
    </div>
  );
};
