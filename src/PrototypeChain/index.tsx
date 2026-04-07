import React from 'react';
import { Series } from 'remotion';
import { Scene1_Intro } from './Scene1_Intro';
import { Scene2_Objects } from './Scene2_Objects';
import { Scene3_Prototype } from './Scene3_Prototype';
import { Scene4_Chain } from './Scene4_Chain';
import { Scene5_FullMap } from './Scene5_FullMap';
import { Scene6_Outro } from './Scene6_Outro';

export const PrototypeChainVideo: React.FC = () => {
  return (
    <Series>
      {/* 
         Total: 9000 frames (300s / 5min)
         Scene 1: 30s (900)
         Scene 2: 60s (1800)
         Scene 3: 60s (1800)
         Scene 4: 90s (2700)
         Scene 5: 30s (900) - New
         Scene 6: 30s (900) - Outro
      */}
      <Series.Sequence durationInFrames={900}>
        <Scene1_Intro />
      </Series.Sequence>
      <Series.Sequence durationInFrames={1800}>
        <Scene2_Objects />
      </Series.Sequence>
      <Series.Sequence durationInFrames={1800}>
        <Scene3_Prototype />
      </Series.Sequence>
      <Series.Sequence durationInFrames={2700}>
        <Scene4_Chain />
      </Series.Sequence>
      <Series.Sequence durationInFrames={900}>
        <Scene5_FullMap />
      </Series.Sequence>
      <Series.Sequence durationInFrames={900}>
        <Scene6_Outro />
      </Series.Sequence>
    </Series>
  );
};
