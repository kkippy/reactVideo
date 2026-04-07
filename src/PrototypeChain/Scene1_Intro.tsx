import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { StickFigure } from './StickFigure';
import { CodeBlock } from './CodeBlock';

export const Scene1_Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 0-2秒: 标题进场
  const titleOpacity = interpolate(frame, [0, 20], [0, 1]);
  const titleY = interpolate(frame, [0, 20], [50, 0]);

  // 2-5秒: 代码展示
  const codeOpacity = interpolate(frame, [60, 80], [0, 1]);
  const code = `const alice = {
  name: "Alice",
  intro: function() {
    console.log("Hi!");
  }
};

alice.intro(); // "Hi!"
alice.toString(); // "[object Object]" ??`;

  // 5-8秒: 疑问
  const questionOpacity = interpolate(frame, [150, 170], [0, 1]);
  const questionScale = spring({ frame: frame - 150, fps, config: { damping: 10 } });

  // 8-12秒: 小人困惑
  const stickFigureOpacity = interpolate(frame, [240, 260], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: 'white', fontFamily: 'Comic Sans MS' }}>
      <div style={{ position: 'absolute', top: 100, width: '100%', textAlign: 'center', opacity: titleOpacity, transform: `translateY(${titleY}px)` }}>
        <h1 style={{ fontSize: 60 }}>JavaScript 原型链</h1>
        <h2 style={{ fontSize: 30, color: '#666' }}>它到底从哪里来？</h2>
      </div>

      <div style={{ opacity: codeOpacity }}>
        <CodeBlock code={code} x={300} y={300} />
      </div>

      <div style={{ 
        position: 'absolute', right: 400, top: 400, 
        opacity: questionOpacity, transform: `scale(${questionScale})`,
        fontSize: 40, color: '#d32f2f', fontWeight: 'bold', width: 400
      }}>
        等等... <br/>
        toString() 是哪来的？<br/>
        我们并没有定义它！
      </div>

      <div style={{ opacity: stickFigureOpacity }}>
         <StickFigure x={1400} y={500} scale={1.5} mood="confused" />
      </div>
    </AbsoluteFill>
  );
};
