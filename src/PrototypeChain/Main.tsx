import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { TechBackground } from './TechBackground';
import { IntroScene } from './IntroScene';
import { ProtoPortal } from './ProtoPortal';
import { ChainSearch } from './ChainSearch';
import { TheVoid } from './TheVoid';
import { GlitchTransition } from './GlitchTransition';
import { SubtitleSystem, Subtitle } from './SubtitleSystem';

export const Main: React.FC = () => {
  // Define subtitles with global frame timing
  const subtitles: Subtitle[] = [
    // IntroScene (0 - 1350)
    { startFrame: 30, endFrame: 200, text: "我们创建一个空对象 obj" },
    { startFrame: 250, endFrame: 450, text: "调用 obj.toString() 方法" },
    { startFrame: 500, endFrame: 700, text: "等等，我们并没有定义 toString..." },
    { startFrame: 750, endFrame: 1000, text: "它究竟是从哪里来的？" },

    // ProtoPortal (1350 - 2700)
    { startFrame: 1400, endFrame: 1600, text: "其实，每个对象都有一个隐藏属性" },
    { startFrame: 1650, endFrame: 1900, text: "这就是 __proto__" },
    { startFrame: 1950, endFrame: 2200, text: "它像传送门一样指向构造函数的原型" },
    { startFrame: 2250, endFrame: 2500, text: "在这里，是 Object.prototype" },

    // ChainSearch (2700 - 4500)
    { startFrame: 2750, endFrame: 2950, text: "这就构成了原型链查找机制" },
    { startFrame: 3000, endFrame: 3300, text: "首先在对象自身查找..." },
    { startFrame: 3350, endFrame: 3600, text: "如果没找到，就沿着 __proto__ 向上" },
    { startFrame: 3650, endFrame: 3900, text: "在 Object.prototype 中找到了！" },
    { startFrame: 4000, endFrame: 4300, text: "于是成功调用了 toString 方法" },

    // TheVoid (4500 - 5400)
    { startFrame: 4550, endFrame: 4750, text: "那么，链条的尽头是什么？" },
    { startFrame: 4800, endFrame: 5000, text: "Object.prototype 的原型是 null" },
    { startFrame: 5050, endFrame: 5300, text: "一切始于虚无，归于虚无" },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      
      {/* Background Layer (Persistent) */}
      <TechBackground />

      {/* Scene 1: The Illusion */}
      <Sequence from={0} durationInFrames={1350}>
        <GlitchTransition duration={1350}>
          <IntroScene />
        </GlitchTransition>
      </Sequence>

      {/* Scene 2: The Portal */}
      <Sequence from={1350} durationInFrames={1350}>
        <GlitchTransition duration={1350}>
          <ProtoPortal />
        </GlitchTransition>
      </Sequence>

      {/* Scene 3: The Chain */}
      <Sequence from={2700} durationInFrames={1800}>
        <GlitchTransition duration={1800}>
          <ChainSearch />
        </GlitchTransition>
      </Sequence>

      {/* Scene 4: The Void */}
      <Sequence from={4500} durationInFrames={900}>
        <GlitchTransition duration={900}>
          <TheVoid />
        </GlitchTransition>
      </Sequence>

      {/* Global Subtitles Layer */}
      <SubtitleSystem subtitles={subtitles} />

    </AbsoluteFill>
  );
};
