import {describe, expect, it} from 'vitest';
import {
  buildSubtitleTrack,
  buildSubtitleTrackFromTimedCues,
  secondsToFrames,
} from '../timing';

describe('secondsToFrames', () => {
  it('converts seconds to rounded frame counts', () => {
    expect(secondsToFrames(2.5, 30)).toBe(75);
  });
});

describe('buildSubtitleTrack', () => {
  it('creates contiguous subtitle windows', () => {
    const track = buildSubtitleTrack(
      [
        {seconds: 2, text: 'A'},
        {seconds: 1, text: 'B'},
      ],
      30,
    );

    expect(track).toEqual([
      {startFrame: 0, endFrame: 60, text: 'A'},
      {startFrame: 60, endFrame: 90, text: 'B'},
    ]);
  });
});

describe('buildSubtitleTrackFromTimedCues', () => {
  it('converts timed cues to frame cues and applies lead-in', () => {
    const track = buildSubtitleTrackFromTimedCues(
      [
        {startMs: 200, endMs: 1200, text: '第一句'},
        {startMs: 1400, endMs: 2200, text: '第二句'},
      ],
      30,
      3,
    );

    expect(track).toEqual([
      {startFrame: 3, endFrame: 36, text: '第一句'},
      {startFrame: 39, endFrame: 66, text: '第二句'},
    ]);
  });

  it('clamps lead-in so subtitle start never becomes negative', () => {
    const track = buildSubtitleTrackFromTimedCues(
      [{startMs: 50, endMs: 600, text: '开场'}],
      30,
      6,
    );

    expect(track).toEqual([{startFrame: 0, endFrame: 18, text: '开场'}]);
  });
});
