import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { ObjectBox } from './ObjectBox';

const Ripple: React.FC<{ x: number; y: number; color: string; startFrame: number }> = ({ x, y, color, startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 20 },
  });
  
  const scale = interpolate(progress, [0, 1], [0, 2]);
  const opacity = interpolate(progress, [0, 1], [0.8, 0]);

  if (frame < startFrame) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: x - 50,
        top: y - 50,
        width: 100,
        height: 100,
        borderRadius: '50%',
        border: `4px solid ${color}`,
        transform: `scale(${scale})`,
        opacity,
        pointerEvents: 'none',
      }}
    />
  );
};

const ScanningLine: React.FC<{ x: number; y: number; width: number; height: number; startFrame: number; endFrame: number; color: string }> = ({ x, y, width, height, startFrame, endFrame, color }) => {
    const frame = useCurrentFrame();
    
    if (frame < startFrame || frame > endFrame) return null;

    const progress = interpolate(frame, [startFrame, endFrame], [0, 1]);
    const scanY = interpolate(progress, [0, 1], [0, height]);
    const opacity = interpolate(progress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    return (
        <div style={{ position: 'absolute', left: x, top: y, width, height, overflow: 'hidden', pointerEvents: 'none' }}>
            <div style={{
                position: 'absolute',
                top: scanY,
                left: 0,
                width: '100%',
                height: 4,
                backgroundColor: color,
                boxShadow: `0 0 10px ${color}`,
                opacity
            }} />
        </div>
    );
};

const StatusText: React.FC<{ x: number; y: number; text: string; color: string; startFrame: number }> = ({ x, y, text, color, startFrame }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const progress = spring({
        frame: frame - startFrame,
        fps,
        config: { damping: 15 }
    });
    
    const translateY = interpolate(progress, [0, 1], [20, 0]);
    const opacity = interpolate(progress, [0, 1], [0, 1]);

    if (frame < startFrame) return null;

    return (
        <div style={{
            position: 'absolute',
            left: x,
            top: y,
            color: color,
            fontWeight: 'bold',
            fontSize: 24,
            transform: `translateY(${translateY}px)`,
            opacity,
            textShadow: `0 0 5px ${color}`,
            whiteSpace: 'nowrap'
        }}>
            {text}
        </div>
    );
};

export const ChainSearch: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Layout
  const centerX = width / 2;
  const bottomY = height - 200;
  const middleY = height / 2;
  const topY = 200;

  // Animation Timings (Slower pace for more detail)
  const jump1Start = 30;
  const jump1End = 90;
  const scan1Start = 90;
  const scan1End = 140;
  const fail1Start = 140;
  
  const jump2Start = 180;
  const jump2End = 240;
  const scan2Start = 240;
  const scan2End = 290;
  const foundStart = 290;

  // Jump 1: Bottom -> Middle
  const jump1Progress = interpolate(frame, [jump1Start, jump1End], [0, 1], { extrapolateRight: 'clamp' });
  const jump1Y = interpolate(jump1Progress, [0, 1], [bottomY, middleY]);
  const jump1XOffset = Math.sin(jump1Progress * Math.PI) * 100;

  // Jump 2: Middle -> Top
  const jump2Progress = interpolate(frame, [jump2Start, jump2End], [0, 1], { extrapolateRight: 'clamp' });
  const jump2Y = interpolate(jump2Progress, [0, 1], [middleY, topY]);
  const jump2XOffset = Math.sin(jump2Progress * Math.PI) * -100;

  // Dot Color Logic
  const isFound = frame >= foundStart;
  const dotColor = isFound ? '#50fa7b' : '#ff79c6'; 

  // Current Dot Position
  let dotX = centerX;
  let dotY = bottomY;

  if (frame < jump1Start) {
    dotY = bottomY;
  } else if (frame < jump1End) {
    dotX = centerX + jump1XOffset;
    dotY = jump1Y;
  } else if (frame < jump2Start) {
    dotY = middleY;
    // Shake effect on fail
    if (frame > fail1Start && frame < fail1Start + 20) {
        dotX = centerX + Math.sin(frame) * 5;
    } else {
        dotX = centerX;
    }
  } else if (frame < jump2End) {
    dotX = centerX + jump2XOffset;
    dotY = jump2Y;
  } else {
    dotY = topY;
  }

  // Dot Visibility
  const showDot = frame >= jump1Start;

  return (
    <AbsoluteFill>
      <div style={{
        position: 'absolute',
        top: 50,
        width: '100%',
        textAlign: 'center',
        color: '#fff',
        fontSize: 60,
        fontWeight: 'bold',
        opacity: interpolate(frame, [0, 30], [0, 1]),
        textShadow: '0 0 10px rgba(255, 121, 198, 0.5)',
      }}>
        The Chain (接力赛)
      </div>

      {/* Layers */}
      <div style={{ position: 'absolute', left: centerX - 150, top: topY - 75 }}>
        <ObjectBox label="Object.prototype" width={300} height={150} color="#bd93f9" properties={['toString: fn']} />
        <ScanningLine x={0} y={0} width={300} height={150} startFrame={scan2Start} endFrame={scan2End} color="#50fa7b" />
      </div>
      
      <div style={{ position: 'absolute', left: centerX - 150, top: middleY - 75 }}>
        <ObjectBox label="Constructor.prototype" width={300} height={150} color="#8be9fd" properties={['No toString']} />
        <ScanningLine x={0} y={0} width={300} height={150} startFrame={scan1Start} endFrame={scan1End} color="#ff5555" />
      </div>

      <div style={{ position: 'absolute', left: centerX - 150, top: bottomY - 75 }}>
        <ObjectBox label="Instance" width={300} height={150} color="#ff79c6" properties={['No toString']} />
      </div>

      {/* Status Texts */}
      <StatusText x={centerX + 200} y={middleY} text="Not Found (未找到)" color="#ff5555" startFrame={fail1Start} />
      <StatusText x={centerX + 200} y={topY} text="Found! (已找到)" color="#50fa7b" startFrame={foundStart} />

      {/* Connection Lines (Vertical) */}
      <div style={{
        position: 'absolute', left: centerX, top: bottomY - 75, height: middleY - bottomY + 150, width: 2, background: '#44475a', zIndex: -1
      }} />
      <div style={{
        position: 'absolute', left: centerX, top: middleY - 75, height: topY - middleY + 150, width: 2, background: '#44475a', zIndex: -1
      }} />

      {/* Ripples */}
      <Ripple x={centerX} y={middleY} color="#ff79c6" startFrame={fail1Start} />
      <Ripple x={centerX} y={topY} color="#50fa7b" startFrame={foundStart} />

      {/* Jumping Dot */}
      {showDot && (
        <div
          style={{
            position: 'absolute',
            left: dotX - 15,
            top: dotY - 15,
            width: 30,
            height: 30,
            borderRadius: '50%',
            backgroundColor: dotColor,
            boxShadow: `0 0 20px ${dotColor}`,
            zIndex: 100,
          }}
        />
      )}

    </AbsoluteFill>
  );
};
