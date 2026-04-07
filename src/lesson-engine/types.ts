export type SubtitleCue = {
  startFrame: number;
  endFrame: number;
  text: string;
};

export type CodeHighlight = {
  startLine: number;
  endLine: number;
  label: string;
};

export type TitleSceneSpec = {
  type: 'title';
  durationInFrames: number;
  title: string;
  subtitle: string;
};

export type BulletSceneSpec = {
  type: 'bullet';
  durationInFrames: number;
  heading: string;
  bullets: string[];
  emphasis?: string;
};

export type CodeSceneSpec = {
  type: 'code';
  durationInFrames: number;
  heading: string;
  code: string;
  highlights: CodeHighlight[];
};

export type FlowSceneSpec = {
  type: 'flow';
  durationInFrames: number;
  heading: string;
  steps: string[];
  stateLabels?: string[];
};

export type SummarySceneSpec = {
  type: 'summary';
  durationInFrames: number;
  heading: string;
  takeaways: string[];
};

export type LessonScene =
  | TitleSceneSpec
  | BulletSceneSpec
  | CodeSceneSpec
  | FlowSceneSpec
  | SummarySceneSpec;

export type LessonSpec = {
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
  scenes: LessonScene[];
  subtitles: SubtitleCue[];
};
