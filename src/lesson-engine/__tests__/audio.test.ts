import {describe, expect, it} from 'vitest';
import {duckVolume} from '../audio';

describe('duckVolume', () => {
  it('reduces bgm volume while narration is active', () => {
    expect(
      duckVolume({
        frame: 10,
        startFrame: 0,
        endFrame: 30,
        baseVolume: 0.2,
        duckedVolume: 0.08,
      }),
    ).toBe(0.08);

    expect(
      duckVolume({
        frame: 40,
        startFrame: 0,
        endFrame: 30,
        baseVolume: 0.2,
        duckedVolume: 0.08,
      }),
    ).toBe(0.2);
  });
});
