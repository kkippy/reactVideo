import React from 'react';
import {BulletScene} from './scenes/BulletScene';
import {CodeScene} from './scenes/CodeScene';
import {FlowScene} from './scenes/FlowScene';
import {SummaryScene} from './scenes/SummaryScene';
import {TitleScene} from './scenes/TitleScene';
import type {LessonScene} from './types';

export const SceneRenderer: React.FC<{scene: LessonScene}> = ({scene}) => {
  switch (scene.type) {
    case 'title':
      return <TitleScene {...scene} />;
    case 'bullet':
      return <BulletScene {...scene} />;
    case 'code':
      return <CodeScene {...scene} />;
    case 'flow':
      return <FlowScene {...scene} />;
    case 'summary':
      return <SummaryScene {...scene} />;
    default:
      return null;
  }
};
