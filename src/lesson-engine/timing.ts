export const secondsToFrames = (seconds: number, fps: number) => {
  return Math.round(seconds * fps);
};

export const buildSubtitleTrack = (
  segments: Array<{seconds: number; text: string}>,
  fps: number,
) => {
  let cursor = 0;

  return segments.map((segment) => {
    const startFrame = cursor;
    const endFrame = cursor + secondsToFrames(segment.seconds, fps);

    cursor = endFrame;

    return {
      startFrame,
      endFrame,
      text: segment.text,
    };
  });
};

export const buildSubtitleTrackFromTimedCues = (
  cues: Array<{startMs: number; endMs: number; text: string}>,
  fps: number,
  leadInFrames = 0,
) => {
  return cues.map((cue) => {
    const startFrame = Math.max(
      0,
      secondsToFrames(cue.startMs / 1000, fps) - leadInFrames,
    );
    const endFrame = Math.max(
      startFrame + 1,
      secondsToFrames(cue.endMs / 1000, fps),
    );

    return {
      startFrame,
      endFrame,
      text: cue.text,
    };
  });
};
