export const duckVolume = ({
  frame,
  startFrame,
  endFrame,
  baseVolume,
  duckedVolume,
}: {
  frame: number;
  startFrame: number;
  endFrame: number;
  baseVolume: number;
  duckedVolume: number;
}) => {
  return frame >= startFrame && frame <= endFrame ? duckedVolume : baseVolume;
};
