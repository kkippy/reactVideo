import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { ObjectBox } from './ObjectBox';
import { Arrow } from './Arrow';
import { CodeBlock } from './CodeBlock';

export const Scene3_Prototype: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 动画阶段
  // 0-60: 显示代码和基础对象
  // 60-120: 尝试调用 toString，失败
  // 120-180: 揭示 __proto__
  // 180-240: 顺着链路向上
  // 240+: 找到 toString

  const showProto = frame > 120;
  const moveUp = spring({ frame: frame - 180, fps, config: { damping: 20 } }); // 0 -> 1

  return (
    <AbsoluteFill style={{ backgroundColor: 'white' }}>
      <h2 style={{ position: 'absolute', top: 30, width: '100%', textAlign: 'center', fontFamily: 'Comic Sans MS' }}>
        第二步：隐式原型链 (__proto__)
      </h2>

      <CodeBlock 
        code={`const bird = { color: "blue" };\n\nbird.toString();`}
        x={50} y={200}
        highlightLine={2}
      />

      {/* 基础对象 */}
      <ObjectBox 
        x={800} y={600} width={300} height={150} 
        label="bird" 
        properties={['color: "blue"', showProto ? '__proto__' : '']} 
      />

      {/* 查找动画 - 第一阶段：在 bird 中找 */}
      {frame > 60 && frame < 120 && (
        <div style={{
          position: 'absolute', left: 790, top: 590, width: 320, height: 170,
          border: '4px solid red', borderRadius: 15,
          opacity: interpolate(frame, [60, 70, 110, 120], [0, 1, 1, 0])
        }} />
      )}

      {/* 原型对象 */}
      <div style={{ opacity: showProto ? 1 : 0, transition: 'opacity 0.5s' }}>
        <ObjectBox 
          x={800} y={200} width={300} height={200} 
          label="Object.prototype" 
          properties={['toString()', 'hasOwnProperty()', '...']} 
          color="blue"
        />
        <Arrow x1={950} y1={600} x2={950} y2={400} label="__proto__" color="#666" />
      </div>

      {/* 查找动画 - 第二阶段：顺着线上去 */}
      {frame > 180 && (
        <div
          style={{
            position: 'absolute',
            left: 935,
            top: interpolate(frame, [180, 240], [600, 250], { extrapolateRight: 'clamp' }),
            width: 30,
            height: 30,
            borderRadius: '50%',
            backgroundColor: 'orange',
            boxShadow: '0 0 10px orange',
            zIndex: 10
          }}
        />
      )}

      {frame > 240 && (
        <div style={{ position: 'absolute', left: 1150, top: 250, fontSize: 30, color: 'green', fontWeight: 'bold' }}>
          ✔ 在原型中找到了 toString!
        </div>
      )}
      
      {frame > 300 && (
        <div style={{ 
          position: 'absolute', bottom: 50, width: '100%', textAlign: 'center', 
          fontSize: 24, fontFamily: 'Comic Sans MS', padding: '0 100px'
        }}>
          这就是为什么你的对象只有 color 属性，却能调用 toString()。<br/>
          它是从 <b>Object.prototype</b> "继承" 来的（通过查找链）。
        </div>
      )}

    </AbsoluteFill>
  );
};
