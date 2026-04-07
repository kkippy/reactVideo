# Text-Driven Lesson Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a text-driven lesson-video pipeline for this Remotion project so a structured content spec can render a complete programming explainer video with subtitles, narration audio, and BGM.

**Architecture:** Keep the system data-driven. A lesson spec file defines scenes, narration, subtitles, and audio choices; a reusable lesson renderer maps that spec into Remotion scenes. Audio generation is handled by local PowerShell scripts so the first version works without any paid external service.

**Tech Stack:** Remotion 4, React 19, TypeScript, Zod, PowerShell, a lightweight TypeScript test runner for pure utilities.

---

## Scope and Assumptions

- This plan targets one vertical slice first: `Promise` for beginners.
- The first implementation should optimize for **stable generation from structured text**, not arbitrary free-form one-shot prompt rendering.
- Narration and BGM are mandatory outputs:
  - narration is generated locally from the lesson script
  - default BGM is generated locally as a simple reusable backing track
  - user-provided BGM can override the default track later
- The plan avoids large refactors to existing `PrototypeChain` / `EventLoop` compositions and instead adds a new reusable pipeline beside them.

## File Structure

### New files

- `vitest.config.ts` — lightweight test runner config for pure TypeScript utilities
- `src/lesson-engine/types.ts` — lesson spec TypeScript types
- `src/lesson-engine/schema.ts` — Zod schema for validating lesson specs
- `src/lesson-engine/timing.ts` — helpers for seconds/frames/subtitle timing
- `src/lesson-engine/audio.ts` — audio timing helpers and volume envelopes
- `src/lesson-engine/LessonVideo.tsx` — composition entry that renders a lesson spec
- `src/lesson-engine/SceneRenderer.tsx` — dispatches scene configs to scene components
- `src/lesson-engine/scenes/TitleScene.tsx` — intro / title card scene
- `src/lesson-engine/scenes/BulletScene.tsx` — concept bullets / definition scene
- `src/lesson-engine/scenes/CodeScene.tsx` — code + explanation scene
- `src/lesson-engine/scenes/FlowScene.tsx` — state / timeline / flow visualization scene
- `src/lesson-engine/scenes/SummaryScene.tsx` — recap / takeaway scene
- `src/lesson-engine/__tests__/schema.test.ts` — schema validation tests
- `src/lesson-engine/__tests__/timing.test.ts` — frame/timing helper tests
- `src/lesson-engine/__tests__/audio.test.ts` — audio envelope helper tests
- `src/content/promiseLesson.ts` — the first real structured lesson spec
- `scripts/generate-voiceover.ps1` — synthesize narration WAV from lesson script
- `scripts/generate-default-bgm.ps1` — synthesize a simple default backing WAV
- `public/audio/.gitkeep` — ensure audio output directory exists in repo
- `docs/prompt-to-video.md` — user-facing workflow doc
- `docs/templates/video-request-template.md` — reusable text input template

### Modified files

- `package.json` — add test scripts and audio generation scripts
- `src/Root.tsx` — register the new lesson composition
- `README.md` — document prompt-to-video workflow

## Target Data Model

The reusable lesson spec should look like this:

```ts
type LessonSpec = {
  meta: {
    id: string;
    title: string;
    topic: string;
    audience: string;
    fps: number;
    width: number;
    height: number;
  };
  audio: {
    narrationScript: string;
    narrationSrc: string;
    bgmSrc: string;
    bgmVolume: number;
  };
  scenes: Array<
    | {
        type: 'title';
        durationInFrames: number;
        title: string;
        subtitle: string;
      }
    | {
        type: 'bullet';
        durationInFrames: number;
        heading: string;
        bullets: string[];
        emphasis?: string;
      }
    | {
        type: 'code';
        durationInFrames: number;
        heading: string;
        code: string;
        highlights: Array<{startLine: number; endLine: number; label: string}>;
      }
    | {
        type: 'flow';
        durationInFrames: number;
        heading: string;
        steps: string[];
        stateLabels?: string[];
      }
    | {
        type: 'summary';
        durationInFrames: number;
        heading: string;
        takeaways: string[];
      }
  >;
  subtitles: Array<{
    startFrame: number;
    endFrame: number;
    text: string;
  }>;
};
```

## Task 1: Add Testing and Output Scaffolding

**Files:**
- Create: `vitest.config.ts`
- Create: `public/audio/.gitkeep`
- Modify: `package.json`

- [ ] **Step 1: Add failing test script references**

Update `package.json` scripts to include:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "audio:voice": "powershell -ExecutionPolicy Bypass -File scripts/generate-voiceover.ps1",
    "audio:bgm": "powershell -ExecutionPolicy Bypass -File scripts/generate-default-bgm.ps1"
  }
}
```

- [ ] **Step 2: Install the test runner**

Run: `npm install -D vitest`

Expected: `package.json` and lockfile include `vitest`

- [ ] **Step 3: Create minimal test config**

Add `vitest.config.ts`:

```ts
import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
```

- [ ] **Step 4: Create audio output folder marker**

Create `public/audio/.gitkeep`

- [ ] **Step 5: Run empty test command**

Run: `npm run test`

Expected: exits cleanly or reports no matching tests until Task 2 adds tests

## Task 2: Define the Lesson Spec Contract

**Files:**
- Create: `src/lesson-engine/types.ts`
- Create: `src/lesson-engine/schema.ts`
- Create: `src/lesson-engine/timing.ts`
- Create: `src/lesson-engine/__tests__/schema.test.ts`
- Create: `src/lesson-engine/__tests__/timing.test.ts`

- [ ] **Step 1: Write failing schema tests**

Add tests covering:

```ts
import {describe, expect, it} from 'vitest';
import {lessonSpecSchema} from '../schema';

describe('lessonSpecSchema', () => {
  it('accepts a valid lesson spec', () => {
    const result = lessonSpecSchema.safeParse({
      meta: {id: 'promise-basic', title: 'Promise', topic: 'Promise', audience: 'beginner', fps: 30, width: 1920, height: 1080},
      audio: {narrationScript: 'hello', narrationSrc: '/audio/promise.wav', bgmSrc: '/audio/default-bgm.wav', bgmVolume: 0.18},
      scenes: [{type: 'title', durationInFrames: 90, title: 'Promise', subtitle: '从回调到异步'}],
      subtitles: [{startFrame: 0, endFrame: 30, text: '先看一个问题'}],
    });
    expect(result.success).toBe(true);
  });

  it('rejects scenes with non-positive duration', () => {
    const result = lessonSpecSchema.safeParse({
      meta: {id: 'x', title: 'x', topic: 'x', audience: 'x', fps: 30, width: 1920, height: 1080},
      audio: {narrationScript: 'hello', narrationSrc: '/audio/x.wav', bgmSrc: '/audio/default-bgm.wav', bgmVolume: 0.2},
      scenes: [{type: 'title', durationInFrames: 0, title: 'x', subtitle: 'y'}],
      subtitles: [],
    });
    expect(result.success).toBe(false);
  });
});
```

- [ ] **Step 2: Write failing timing tests**

Add tests covering:

```ts
import {describe, expect, it} from 'vitest';
import {secondsToFrames, buildSubtitleTrack} from '../timing';

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
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npm run test -- src/lesson-engine/__tests__/schema.test.ts src/lesson-engine/__tests__/timing.test.ts`

Expected: FAIL because schema and timing helpers do not exist yet

- [ ] **Step 4: Implement the lesson types**

Add `src/lesson-engine/types.ts` with:

```ts
export type SubtitleCue = {
  startFrame: number;
  endFrame: number;
  text: string;
};

export type LessonScene =
  | {type: 'title'; durationInFrames: number; title: string; subtitle: string}
  | {type: 'bullet'; durationInFrames: number; heading: string; bullets: string[]; emphasis?: string}
  | {type: 'code'; durationInFrames: number; heading: string; code: string; highlights: Array<{startLine: number; endLine: number; label: string}>}
  | {type: 'flow'; durationInFrames: number; heading: string; steps: string[]; stateLabels?: string[]}
  | {type: 'summary'; durationInFrames: number; heading: string; takeaways: string[]};

export type LessonSpec = {
  meta: {id: string; title: string; topic: string; audience: string; fps: number; width: number; height: number};
  audio: {narrationScript: string; narrationSrc: string; bgmSrc: string; bgmVolume: number};
  scenes: LessonScene[];
  subtitles: SubtitleCue[];
};
```

- [ ] **Step 5: Implement schema and timing helpers**

Create `src/lesson-engine/schema.ts` and `src/lesson-engine/timing.ts` to satisfy the tests.

`schema.ts` should export `lessonSpecSchema` using `z.discriminatedUnion('type', [...])`.

`timing.ts` should export:

```ts
export const secondsToFrames = (seconds: number, fps: number) => Math.round(seconds * fps);

export const buildSubtitleTrack = (
  segments: Array<{seconds: number; text: string}>,
  fps: number,
) => {
  let cursor = 0;
  return segments.map((segment) => {
    const startFrame = cursor;
    const endFrame = cursor + secondsToFrames(segment.seconds, fps);
    cursor = endFrame;
    return {startFrame, endFrame, text: segment.text};
  });
};
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npm run test -- src/lesson-engine/__tests__/schema.test.ts src/lesson-engine/__tests__/timing.test.ts`

Expected: PASS

## Task 3: Build the Reusable Lesson Renderer

**Files:**
- Create: `src/lesson-engine/audio.ts`
- Create: `src/lesson-engine/LessonVideo.tsx`
- Create: `src/lesson-engine/SceneRenderer.tsx`
- Create: `src/lesson-engine/scenes/TitleScene.tsx`
- Create: `src/lesson-engine/scenes/BulletScene.tsx`
- Create: `src/lesson-engine/scenes/CodeScene.tsx`
- Create: `src/lesson-engine/scenes/FlowScene.tsx`
- Create: `src/lesson-engine/scenes/SummaryScene.tsx`
- Create: `src/lesson-engine/__tests__/audio.test.ts`

- [ ] **Step 1: Write failing audio helper tests**

Add tests for a helper like:

```ts
import {describe, expect, it} from 'vitest';
import {duckVolume} from '../audio';

describe('duckVolume', () => {
  it('reduces bgm volume while narration is active', () => {
    expect(duckVolume({frame: 10, startFrame: 0, endFrame: 30, baseVolume: 0.2, duckedVolume: 0.08})).toBe(0.08);
    expect(duckVolume({frame: 40, startFrame: 0, endFrame: 30, baseVolume: 0.2, duckedVolume: 0.08})).toBe(0.2);
  });
});
```

- [ ] **Step 2: Run the new tests to verify failure**

Run: `npm run test -- src/lesson-engine/__tests__/audio.test.ts`

Expected: FAIL because `audio.ts` does not exist

- [ ] **Step 3: Implement the minimal audio helper**

Add `src/lesson-engine/audio.ts`:

```ts
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
```

- [ ] **Step 4: Implement the scene components**

Create focused scene components:

- `TitleScene.tsx` — main title + subtitle + simple intro motion
- `BulletScene.tsx` — heading + bullets with staggered reveal
- `CodeScene.tsx` — code block + active highlight label
- `FlowScene.tsx` — step cards or state labels with animated emphasis
- `SummaryScene.tsx` — 2-4 takeaways with end-card treatment

Use existing visual style cues from:

- `src/EventLoop/Main.tsx`
- `src/PrototypeChain/SubtitleSystem.tsx`

- [ ] **Step 5: Implement the scene dispatcher**

`src/lesson-engine/SceneRenderer.tsx` should take a `LessonScene` and render the matching scene component via a `switch`.

- [ ] **Step 6: Implement the top-level lesson composition**

`src/lesson-engine/LessonVideo.tsx` should:

- accept a `spec: LessonSpec` prop
- validate it once with `lessonSpecSchema`
- render scene sequences using `<Series>`
- render the subtitle overlay using the existing `SubtitleSystem`
- mount narration and BGM via `<Audio>`

Skeleton:

```tsx
import {AbsoluteFill, Audio, Series} from 'remotion';
import {SubtitleSystem} from '../PrototypeChain/SubtitleSystem';

export const LessonVideo: React.FC<{spec: LessonSpec}> = ({spec}) => {
  lessonSpecSchema.parse(spec);

  return (
    <AbsoluteFill style={{backgroundColor: '#0f172a'}}>
      <Audio src={spec.audio.bgmSrc} volume={spec.audio.bgmVolume} />
      <Audio src={spec.audio.narrationSrc} volume={1} />
      <Series>
        {spec.scenes.map((scene, index) => (
          <Series.Sequence key={index} durationInFrames={scene.durationInFrames}>
            <SceneRenderer scene={scene} />
          </Series.Sequence>
        ))}
      </Series>
      <SubtitleSystem subtitles={spec.subtitles} />
    </AbsoluteFill>
  );
};
```

- [ ] **Step 7: Run focused tests**

Run: `npm run test -- src/lesson-engine/__tests__/audio.test.ts`

Expected: PASS

## Task 4: Add Local Audio Generation Scripts

**Files:**
- Create: `scripts/generate-voiceover.ps1`
- Create: `scripts/generate-default-bgm.ps1`

- [ ] **Step 1: Write the narration generator**

`scripts/generate-voiceover.ps1` should:

- load a UTF-8 text file or inline text parameter
- use `.NET` `System.Speech.Synthesis.SpeechSynthesizer`
- write `public/audio/<lesson-id>-narration.wav`

Core implementation:

```powershell
param(
  [string]$TextPath = "tmp/narration.txt",
  [string]$OutputPath = "public/audio/promise-narration.wav"
)

Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.Rate = 0
$synth.Volume = 100
$text = Get-Content $TextPath -Raw -Encoding UTF8
$synth.SetOutputToWaveFile($OutputPath)
$synth.Speak($text)
$synth.Dispose()
```

- [ ] **Step 2: Smoke-test narration generation**

Run:

```powershell
New-Item -ItemType Directory -Force tmp | Out-Null
Set-Content tmp\narration.txt "Promise 可以把异步结果先包装起来。" -Encoding UTF8
npm run audio:voice
```

Expected: `public/audio/promise-narration.wav` exists

- [ ] **Step 3: Write the default BGM generator**

`scripts/generate-default-bgm.ps1` should synthesize a simple low-volume backing WAV by writing PCM samples for:

- a soft sine-wave pad
- a slow pulse every few beats
- fixed duration long enough for first lesson render

The script output should be `public/audio/default-bgm.wav`.

- [ ] **Step 4: Smoke-test BGM generation**

Run: `npm run audio:bgm`

Expected: `public/audio/default-bgm.wav` exists

- [ ] **Step 5: Verify both assets are loadable**

Run:

```powershell
Get-ChildItem public\audio
```

Expected: shows both WAV files

## Task 5: Author the First `Promise` Lesson Spec

**Files:**
- Create: `src/content/promiseLesson.ts`
- Modify: `src/Root.tsx`

- [ ] **Step 1: Write the Promise lesson content**

`src/content/promiseLesson.ts` should export a concrete `LessonSpec`:

```ts
import {LessonSpec} from '../lesson-engine/types';

export const promiseLessonSpec: LessonSpec = {
  meta: {
    id: 'promise-basic',
    title: 'Promise 入门',
    topic: 'Promise',
    audience: 'beginner',
    fps: 30,
    width: 1920,
    height: 1080,
  },
  audio: {
    narrationScript: `
Promise 本身不是异步操作，它更像是一个容器。
它把未来才会得到的结果，先用一种统一的方式表示出来。
`,
    narrationSrc: '/audio/promise-narration.wav',
    bgmSrc: '/audio/default-bgm.wav',
    bgmVolume: 0.16,
  },
  scenes: [
    {type: 'title', durationInFrames: 120, title: 'Promise 入门', subtitle: '为什么需要它，它怎么工作'},
    {type: 'bullet', durationInFrames: 180, heading: '先看问题', bullets: ['回调嵌套越来越深', '错误处理分散', '异步结果不好统一表达']},
    {type: 'flow', durationInFrames: 180, heading: '三种状态', steps: ['pending', 'fulfilled', 'rejected'], stateLabels: ['等待中', '已成功', '已失败']},
    {type: 'code', durationInFrames: 240, heading: '最小示例', code: "const p = new Promise((resolve, reject) => { ... })", highlights: [{startLine: 1, endLine: 1, label: '创建 Promise'}]},
    {type: 'summary', durationInFrames: 120, heading: '记住这三点', takeaways: ['Promise 用来表示未来的结果', '状态一旦改变就不能回头', 'then / catch 让异步流程更清晰']},
  ],
  subtitles: [],
};
```

Then generate `subtitles` from timed narration segments rather than hand-writing every cue inline.

- [ ] **Step 2: Generate subtitle track inside the lesson spec module**

Use `buildSubtitleTrack(...)` so lesson data stays maintainable.

- [ ] **Step 3: Register the new composition**

Modify `src/Root.tsx` to add:

```tsx
import {LessonVideo} from './lesson-engine/LessonVideo';
import {promiseLessonSpec} from './content/promiseLesson';

<Composition
  id="PromiseLesson"
  component={LessonVideo}
  durationInFrames={promiseLessonSpec.scenes.reduce((sum, scene) => sum + scene.durationInFrames, 0)}
  fps={promiseLessonSpec.meta.fps}
  width={promiseLessonSpec.meta.width}
  height={promiseLessonSpec.meta.height}
  defaultProps={{spec: promiseLessonSpec}}
/>
```

- [ ] **Step 4: Run lint and tests**

Run: `npm run lint && npm run test`

Expected: PASS

## Task 6: Document the Prompt-to-Video Workflow

**Files:**
- Create: `docs/prompt-to-video.md`
- Create: `docs/templates/video-request-template.md`
- Modify: `README.md`

- [ ] **Step 1: Document the end-user flow**

`docs/prompt-to-video.md` should explain:

1. fill out the request template
2. ask Codex to convert it into a lesson spec
3. generate narration + BGM
4. run Remotion preview
5. render the final MP4

- [ ] **Step 2: Add the reusable text template**

`docs/templates/video-request-template.md` should include:

```md
主题：
受众：
时长：
必讲：
不讲：
风格：
例子：
BGM：
```

- [ ] **Step 3: Update README**

Add a short section linking:

- `docs/prompt-to-video.md`
- `docs/templates/video-request-template.md`
- `docs/superpowers/specs/2026-04-07-promise-video-design.md`

- [ ] **Step 4: Verify docs are readable**

Run: `Get-Content README.md`

Expected: links and workflow section are present

## Task 7: Validate the Full Vertical Slice

**Files:**
- Modify: any of the above if fixes are needed

- [ ] **Step 1: Generate the audio assets**

Run:

```powershell
Set-Content tmp\narration.txt "<replace with promiseLessonSpec.audio.narrationScript>" -Encoding UTF8
npm run audio:voice
npm run audio:bgm
```

Expected: both WAV assets exist

- [ ] **Step 2: Start Remotion Studio**

Run: `npm run dev`

Expected: composition list includes `PromiseLesson`

- [ ] **Step 3: Verify the composition manually**

Check:

- intro title appears
- subtitles line up with narration
- narration audio plays
- BGM is audible but quieter than narration
- scene pacing roughly matches 5-minute beginner explainer goals

- [ ] **Step 4: Render a sample output**

Run: `npx remotion render src/index.ts PromiseLesson out/promise-lesson.mp4`

Expected: MP4 render completes successfully

- [ ] **Step 5: Final regression check**

Run: `npm run lint && npm run test`

Expected: PASS

## Risks to Watch

- Windows TTS voice quality may sound robotic; keep the script wording shorter and cleaner to compensate.
- Programmatically generated BGM should stay intentionally minimal; avoid spending feature time on a music engine.
- Subtitle timing will drift if narration text changes but the cue list is not regenerated; keep subtitle generation data next to narration text.
- Scene scope can grow quickly; keep the first pass to 4-5 scene types only.

## Definition of Done

The feature is done when:

- a structured lesson spec exists for `Promise`
- the project can preview and render a new `PromiseLesson` composition
- narration and BGM audio files can be produced locally
- subtitles are displayed in-sync with the scripted narration
- the workflow is documented so future topics can reuse the same pipeline
