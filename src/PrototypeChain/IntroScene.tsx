import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { CodeWindow } from './CodeWindow';
import { ObjectBox } from './ObjectBox';

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation Constants
  const codeStart = 30;
  const codeEnd = 600; // Typing duration
  const shakeStart = 700;
  
  // Spring entrance for CodeWindow
  const codeEntrance = spring({
    frame: frame - 10,
    fps,
    config: { damping: 12 },
  });
  const codeX = interpolate(codeEntrance, [0, 1], [-600, 100]);

  // Spring entrance for ObjectBox
  const objEntrance = spring({
    frame: frame - 300, // Enters later
    fps,
    config: { damping: 12 },
  });
  const objScale = interpolate(objEntrance, [0, 1], [0, 1]);

  // Shake Animation
  const shakeProgress = Math.max(0, frame - shakeStart);
  const shakeIntensity = interpolate(shakeProgress, [0, 20, 50], [0, 20, 0], { extrapolateRight: 'clamp' });
  const shakeX = Math.sin(frame * 0.8) * shakeIntensity;

  // Question Mark Opacity
  const questionOpacity = interpolate(shakeProgress, [0, 10], [0, 1], { extrapolateRight: 'clamp' });

  const codeText = `const obj = {};\n\n// Look for toString?\nconsole.log(\n  obj.toString()\n);`;

  return (
    <AbsoluteFill>
      {/* Left: Code Window */}
      <div style={{ transform: `translateX(${codeX}px)` }}>
        <CodeWindow
          code={codeText}
          startFrame={codeStart}
          endFrame={codeEnd}
          x={100}
          y={200}
          width={600}
          height={400}
        />
      </div>

      {/* Right: Floating Object */}
      <div style={{
        position: 'absolute',
        left: 1000,
        top: 300,
        transform: `scale(${objScale}) translateX(${shakeX}px)`,
      }}>
        <ObjectBox
          x={0}
          y={0}
          width={300}
          height={300}
          label="{ }"
          color="#ff79c6" // Pinkish
          properties={[]}
        />
        
        {/* Giant Question Mark */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: 150,
          color: '#ff5555',
          fontWeight: 'bold',
          opacity: questionOpacity,
          textShadow: '0 0 20px #ff5555',
        }}>
          ?
        </div>
      </div>

      {/* Title/Label */}
      <div style={{
        position: 'absolute',
        top: 100,
        width: '100%',
        textAlign: 'center',
        color: '#fff',
        fontSize: 60,
        fontWeight: 'bold',
        opacity: interpolate(frame, [0, 60], [0, 1]),
        textShadow: '0 0 10px rgba(255,255,255,0.5)',
      }}>
        The Illusion (幻象层)
      </div>

    </AbsoluteFill>
  );
};
