import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  Series,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {SubtitleSystem} from '../PrototypeChain/SubtitleSystem';
import {duckVolume} from './audio';
import {lessonSpecSchema} from './schema';
import {SceneRenderer} from './SceneRenderer';
import type {LessonSpec} from './types';

const BackgroundMusic: React.FC<{
  spec: LessonSpec;
}> = ({spec}) => {
  const frame = useCurrentFrame();
  const activeCue = spec.subtitles.find(
    (cue) => frame >= cue.startFrame && frame <= cue.endFrame,
  );

  return (
    <Audio
      src={resolveAssetSrc(spec.audio.bgmSrc)}
      loop
      volume={() =>
        duckVolume({
          frame,
          startFrame: activeCue?.startFrame ?? -1,
          endFrame: activeCue?.endFrame ?? -1,
          baseVolume: spec.audio.bgmVolume,
          duckedVolume: Math.min(spec.audio.bgmVolume, 0.06),
        })
      }
    />
  );
};

const resolveAssetSrc = (src: string) => {
  if (/^https?:\/\//.test(src)) {
    return src;
  }

  return staticFile(src.replace(/^\/+/, ''));
};

export const LessonVideo: React.FC<{spec: LessonSpec}> = ({spec}) => {
  const parsedSpec = lessonSpecSchema.parse(spec);

  return (
    <AbsoluteFill style={{backgroundColor: '#020617'}}>
      <BackgroundMusic spec={parsedSpec} />
      <Audio src={resolveAssetSrc(parsedSpec.audio.narrationSrc)} volume={1} />
      <Series>
        {parsedSpec.scenes.map((scene, index) => (
          <Series.Sequence key={`${scene.type}-${index}`} durationInFrames={scene.durationInFrames}>
            <SceneRenderer scene={scene} />
          </Series.Sequence>
        ))}
      </Series>
      <Sequence>
        <SubtitleSystem subtitles={parsedSpec.subtitles} />
      </Sequence>
    </AbsoluteFill>
  );
};
