import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { ObjectBox } from './ObjectBox';
import { Arrow } from './Arrow';

export const Scene6_Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 完整的链条视图
  // myDog -> Dog.prototype -> Object.prototype -> null

  return (
    <AbsoluteFill style={{ backgroundColor: 'white' }}>
      <h2 style={{ position: 'absolute', top: 30, width: '100%', textAlign: 'center', fontFamily: 'Comic Sans MS' }}>
        总结
      </h2>

      <div style={{ transform: `translateY(${50}px)` }}>
        {/* Level 1: Instance */}
        <ObjectBox x={800} y={700} width={200} height={100} label="myDog" properties={['name']} />
        
        <Arrow x1={900} y1={700} x2={900} y2={550} label="__proto__" color="red" />

        {/* Level 2: Dog Prototype */}
        <ObjectBox x={800} y={400} width={200} height={100} label="Dog.prototype" properties={['bark']} color="green" />

        <Arrow x1={900} y1={400} x2={900} y2={250} label="__proto__" color="red" />

        {/* Level 3: Object Prototype */}
        <ObjectBox x={800} y={100} width={200} height={100} label="Object.prototype" properties={['toString']} color="blue" />

        <Arrow x1={900} y1={100} x2={900} y2={-20} label="__proto__" color="red" />

        {/* Level 4: Null */}
        <div style={{ 
          position: 'absolute', left: 850, top: -80, 
          width: 100, height: 50, backgroundColor: '#333', color: 'white',
          borderRadius: 25, display: 'flex', justifyContent: 'center', alignItems: 'center',
          fontWeight: 'bold'
        }}>
          null
        </div>
      </div>

      {frame > 30 && (
        <div style={{ 
          position: 'absolute', bottom: 0, top: 0, left: 0, right: 0,
          backgroundColor: 'rgba(255,255,255,0.9)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          opacity: interpolate(frame, [30, 60], [0, 1])
        }}>
          <h1 style={{ fontSize: 80, fontFamily: 'Comic Sans MS' }}>总结</h1>
          <ul style={{ fontSize: 40, lineHeight: 2 }}>
            <li>1. 查找属性时，先找自身，再找原型。</li>
            <li>2. <b>__proto__</b> 是连接对象的链条。</li>
            <li>3. <b>prototype</b> 是构造函数用来建立链条的蓝图。</li>
            <li>4. 链条的终点是 <b>null</b>。</li>
          </ul>
           <h2 style={{ marginTop: 100, opacity: interpolate(frame, [150, 180], [0, 1]) }}>Thanks for Watching!</h2>
        </div>
      )}
    </AbsoluteFill>
  );
};
