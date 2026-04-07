import {z} from 'zod';

const subtitleCueSchema = z.object({
  startFrame: z.number().int().min(0),
  endFrame: z.number().int().min(0),
  text: z.string().min(1),
});

const durationSchema = z.number().int().positive();

const titleSceneSchema = z.object({
  type: z.literal('title'),
  durationInFrames: durationSchema,
  title: z.string().min(1),
  subtitle: z.string().min(1),
});

const bulletSceneSchema = z.object({
  type: z.literal('bullet'),
  durationInFrames: durationSchema,
  heading: z.string().min(1),
  bullets: z.array(z.string().min(1)).min(1),
  emphasis: z.string().min(1).optional(),
});

const codeSceneSchema = z.object({
  type: z.literal('code'),
  durationInFrames: durationSchema,
  heading: z.string().min(1),
  code: z.string().min(1),
  highlights: z
    .array(
      z.object({
        startLine: z.number().int().positive(),
        endLine: z.number().int().positive(),
        label: z.string().min(1),
      }),
    )
    .min(1),
});

const flowSceneSchema = z.object({
  type: z.literal('flow'),
  durationInFrames: durationSchema,
  heading: z.string().min(1),
  steps: z.array(z.string().min(1)).min(1),
  stateLabels: z.array(z.string().min(1)).optional(),
});

const summarySceneSchema = z.object({
  type: z.literal('summary'),
  durationInFrames: durationSchema,
  heading: z.string().min(1),
  takeaways: z.array(z.string().min(1)).min(1),
});

export const lessonSceneSchema = z.discriminatedUnion('type', [
  titleSceneSchema,
  bulletSceneSchema,
  codeSceneSchema,
  flowSceneSchema,
  summarySceneSchema,
]);

export const lessonSpecSchema = z.object({
  meta: z.object({
    id: z.string().min(1),
    title: z.string().min(1),
    topic: z.string().min(1),
    audience: z.string().min(1),
    fps: z.number().int().positive(),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  }),
  audio: z.object({
    narrationScript: z.string().min(1),
    narrationSrc: z.string().min(1),
    bgmSrc: z.string().min(1),
    bgmVolume: z.number().min(0).max(1),
  }),
  scenes: z.array(lessonSceneSchema).min(1),
  subtitles: z.array(subtitleCueSchema),
});
