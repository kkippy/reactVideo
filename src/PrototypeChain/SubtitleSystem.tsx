import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

export interface Subtitle {
  startFrame: number;
  endFrame: number;
  text: string;
}

export const SubtitleSystem: React.FC<{ subtitles: Subtitle[] }> = ({ subtitles }) => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();

  // Find the current subtitle
  const currentSubtitle = subtitles.find(s => frame >= s.startFrame && frame <= s.endFrame);

  if (!currentSubtitle) return null;

  const duration = currentSubtitle.endFrame - currentSubtitle.startFrame;
  const relativeFrame = frame - currentSubtitle.startFrame;

  // Calculate fade durations safely
  // Ensure strict inequality: 0 < fadeDuration < duration - fadeDuration < duration
  // We use a small epsilon if duration is extremely short, though typically video frames are integers.
  // For safety, let's limit fadeDuration to strictly less than half duration.
  const fadeDuration = Math.max(1, Math.min(15, Math.floor((duration - 1) / 2)));

  // If duration is too short (e.g. < 2 frames), just show it fully opaque or simplify logic
  let opacity;
  if (duration < 2) {
    opacity = 1;
  } else {
    opacity = interpolate(
        relativeFrame,
        [0, fadeDuration, duration - fadeDuration, duration],
        [0, 1, 1, 0],
        { extrapolateRight: 'clamp' }
    );
  }

  const translateY = interpolate(
    relativeFrame,
    [0, fadeDuration],
    [20, 0],
    { extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 80, pointerEvents: 'none' }}>
      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          padding: '15px 40px',
          borderRadius: 50,
          opacity,
          transform: `translateY(${translateY}px)`,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        }}
      >
        <span
          style={{
            color: '#fff',
            fontFamily: 'sans-serif',
            fontSize: 32,
            fontWeight: 500,
            textAlign: 'center',
            letterSpacing: 1,
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
          }}
        >
          {currentSubtitle.text}
        </span>
      </div>
    </AbsoluteFill>
  );
};
