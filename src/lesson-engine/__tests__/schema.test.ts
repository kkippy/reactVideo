import {describe, expect, it} from 'vitest';
import {lessonSpecSchema} from '../schema';

describe('lessonSpecSchema', () => {
  it('accepts a valid lesson spec', () => {
    const result = lessonSpecSchema.safeParse({
      meta: {
        id: 'promise-basic',
        title: 'Promise',
        topic: 'Promise',
        audience: 'beginner',
        fps: 30,
        width: 1920,
        height: 1080,
      },
      audio: {
        narrationScript: 'hello',
        narrationSrc: '/audio/promise.wav',
        bgmSrc: '/audio/default-bgm.wav',
        bgmVolume: 0.18,
      },
      scenes: [
        {
          type: 'title',
          durationInFrames: 90,
          title: 'Promise',
          subtitle: '从回调到异步',
        },
      ],
      subtitles: [{startFrame: 0, endFrame: 30, text: '先看一个问题'}],
    });

    expect(result.success).toBe(true);
  });

  it('rejects scenes with non-positive duration', () => {
    const result = lessonSpecSchema.safeParse({
      meta: {
        id: 'x',
        title: 'x',
        topic: 'x',
        audience: 'x',
        fps: 30,
        width: 1920,
        height: 1080,
      },
      audio: {
        narrationScript: 'hello',
        narrationSrc: '/audio/x.wav',
        bgmSrc: '/audio/default-bgm.wav',
        bgmVolume: 0.2,
      },
      scenes: [{type: 'title', durationInFrames: 0, title: 'x', subtitle: 'y'}],
      subtitles: [],
    });

    expect(result.success).toBe(false);
  });
});
