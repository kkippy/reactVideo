import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, useVideoConfig } from 'remotion';
import { ObjectBox } from './ObjectBox';
import { CodeBlock } from './CodeBlock';

export const Scene2_Objects: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 步骤控制
  const showCode = frame > 10;
  const showObject = frame > 40;
  const highlightName = frame > 100 && frame < 200;
  const highlightMissing = frame > 200;

  const searchBeamOpacity = interpolate(frame, [100, 120, 180, 200], [0, 1, 1, 0], { extrapolateRight: 'clamp' });
  const searchBeamY = interpolate(frame, [120, 180], [450, 500], { extrapolateRight: 'clamp' }); // 扫描 name

  const searchBeam2Opacity = interpolate(frame, [220, 240, 300, 320], [0, 1, 1, 0], { extrapolateRight: 'clamp' });
  
  return (
    <AbsoluteFill style={{ backgroundColor: 'white' }}>
      <h2 style={{ position: 'absolute', top: 30, width: '100%', textAlign: 'center', fontFamily: 'Comic Sans MS' }}>
        第一步：在对象自身查找
      </h2>

      {showCode && (
        <CodeBlock 
          code={`const bird = {
  fly: true,
  color: "blue"
};

console.log(bird.color); // "blue"
console.log(bird.size);  // undefined`}
          x={100} 
          y={200}
          highlightLine={highlightName ? 5 : highlightMissing ? 6 : -1}
        />
      )}

      {showObject && (
        <ObjectBox 
          x={800} 
          y={300} 
          width={300} 
          height={200} 
          label="bird" 
          properties={['fly: true', 'color: "blue"']} 
        />
      )}

      {/* 模拟查找 color 的光束 */}
      <div style={{
        position: 'absolute',
        left: 800,
        top: searchBeamY,
        width: 300,
        height: 40,
        backgroundColor: 'rgba(255, 255, 0, 0.5)',
        opacity: searchBeamOpacity,
        pointerEvents: 'none',
        borderRadius: 5,
      }} />

      {/* 查找结果反馈 */}
      {frame > 180 && frame < 220 && (
        <div style={{ position: 'absolute', left: 1150, top: 350, fontSize: 40, color: 'green', fontWeight: 'bold' }}>
          ✔ 找到了!
        </div>
      )}

      {/* 模拟查找 size 的光束 - 全局扫描 */}
      <div style={{
        position: 'absolute',
        left: 790,
        top: 290,
        width: 320,
        height: 220,
        border: '4px solid red',
        opacity: searchBeam2Opacity,
        pointerEvents: 'none',
        borderRadius: 15,
      }} />

      {frame > 300 && (
        <div style={{ position: 'absolute', left: 1150, top: 450, fontSize: 40, color: 'red', fontWeight: 'bold' }}>
          ✖ 没找到
        </div>
      )}

      {frame > 350 && (
        <div style={{ position: 'absolute', bottom: 100, width: '100%', textAlign: 'center', fontSize: 30, fontFamily: 'Comic Sans MS' }}>
          如果对象自己没有这个属性，JS 引擎会放弃吗？<br/>
          <b>绝不！它会继续向上找！</b>
        </div>
      )}

    </AbsoluteFill>
  );
};
