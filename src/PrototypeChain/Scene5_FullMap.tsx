import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, useVideoConfig } from 'remotion';
import { ObjectBox } from './ObjectBox';
import { Arrow } from './Arrow';

export const Scene5_FullMap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 布局参数
  const leftColX = 200;
  const midColX = 800;
  const rightColX = 1400;

  const row1Y = 800; // 实例层
  const row2Y = 500; // 构造函数原型层
  const row3Y = 200; // Object 原型层
  const row4Y = 50;  // null 层

  // 动画阶段
  // 1. 显示左侧基本链 (0-60)
  // 2. 显示构造函数 (60-120)
  // 3. 显示 Function 和 Function.prototype (120-180)
  // 4. 显示复杂连接 (180+)

  const showBasic = frame > 0;
  const showConstructors = frame > 60;
  const showFunction = frame > 120;
  const showComplex = frame > 180;

  return (
    <AbsoluteFill style={{ backgroundColor: 'white' }}>
      <h2 style={{ position: 'absolute', top: 30, width: '100%', textAlign: 'center', fontFamily: 'Comic Sans MS' }}>
        终极图谱：原型链的全貌
      </h2>

      {/* --- 左侧列 (实例 -> 原型链) --- */}
      <div style={{ opacity: showBasic ? 1 : 0, transition: 'opacity 0.5s' }}>
        {/* 1. 实例 */}
        <ObjectBox x={leftColX} y={row1Y} width={250} height={120} label="实例 (Instance)" properties={['__proto__']} color="#90EE90" />
        
        {/* 2. 自定义函数原型 */}
        <ObjectBox x={leftColX} y={row2Y} width={250} height={120} label="自定义函数原型" properties={['constructor', '__proto__']} color="#90EE90" />
        
        {/* Arrow: 实例 -> 自定义函数原型 */}
        <Arrow x1={leftColX + 125} y1={row1Y} x2={leftColX + 125} y2={row2Y + 120} label="__proto__" />

        {/* 3. Object 原型 */}
        <ObjectBox x={leftColX} y={row3Y} width={250} height={120} label="Object 原型" properties={['toString', '__proto__']} color="#90EE90" />
        
        {/* Arrow: 自定义函数原型 -> Object 原型 */}
        <Arrow x1={leftColX + 125} y1={row2Y} x2={leftColX + 125} y2={row3Y + 120} label="__proto__" />

        {/* 4. null */}
        <div style={{ position: 'absolute', left: leftColX + 100, top: row4Y, fontSize: 30, fontWeight: 'bold', color: '#666' }}>null</div>
        
        {/* Arrow: Object 原型 -> null */}
        <Arrow x1={leftColX + 125} y1={row3Y} x2={leftColX + 125} y2={row4Y + 40} label="__proto__" />
      </div>

      {/* --- 中间列 (构造函数) --- */}
      <div style={{ opacity: showConstructors ? 1 : 0, transition: 'opacity 0.5s' }}>
        {/* 自定义函数 (构造器) */}
        <ObjectBox x={midColX} y={row2Y} width={250} height={120} label="自定义函数 (构造器)" properties={['prototype', '__proto__']} color="#FFD700" />
        
        {/* Arrow: 自定义函数 -> 自定义函数原型 (prototype) */}
        <Arrow x1={midColX} y1={row2Y + 60} x2={leftColX + 250} y2={row2Y + 60} label="prototype" />
        
        {/* Arrow: 自定义函数 -> 实例 (new) */}
        <Arrow x1={midColX + 50} y1={row2Y + 120} x2={leftColX + 250} y2={row1Y} label="new" dashed color="#aaa" />

        {/* Object 构造函数 */}
        <ObjectBox x={midColX} y={row3Y} width={250} height={120} label="Object (构造器)" properties={['prototype', '__proto__']} color="#FFD700" />

        {/* Arrow: Object -> Object 原型 (prototype) */}
        <Arrow x1={midColX} y1={row3Y + 60} x2={leftColX + 250} y2={row3Y + 60} label="prototype" />
        
         {/* Arrow: Object -> Object 实例 (new) - 这里的 new 实际上是指向 {}，为了简化，我们可以指向 Object 原型或者省略 */}
      </div>

      {/* --- 右侧列 (Function & Function Prototype) --- */}
      <div style={{ opacity: showFunction ? 1 : 0, transition: 'opacity 0.5s' }}>
        {/* Function 原型 */}
        <ObjectBox x={rightColX} y={row2Y} width={250} height={120} label="Function 原型" properties={['call', 'apply', '__proto__']} color="#90EE90" />
        
        {/* Function 构造函数 */}
        <ObjectBox x={rightColX} y={row2Y + 300} width={250} height={120} label="Function (构造器)" properties={['prototype', '__proto__']} color="#FFD700" />
        
        {/* Arrow: Function -> Function 原型 (prototype) */}
        <Arrow x1={rightColX + 125} y1={row2Y + 300} x2={rightColX + 125} y2={row2Y + 120} label="prototype" />
        
        {/* Arrow: Function -> Function 原型 (__proto__) - 自指！ */}
        <div style={{ position: 'absolute', left: rightColX + 260, top: row2Y + 200, width: 100, fontSize: 14, color: 'red' }}>Function.__proto__ === Function.prototype</div>
         <Arrow x1={rightColX + 250} y1={row2Y + 360} x2={rightColX + 250} y2={row2Y + 60} label="__proto__" color="red" />
      </div>

      {/* --- 复杂连接 --- */}
      <div style={{ opacity: showComplex ? 1 : 0, transition: 'opacity 0.5s' }}>
        {/* 1. 自定义函数.__proto__ -> Function 原型 */}
        <Arrow x1={midColX + 250} y1={row2Y + 60} x2={rightColX} y2={row2Y + 60} label="__proto__" color="red" />

        {/* 2. Object.__proto__ -> Function 原型 */}
        <Arrow x1={midColX + 250} y1={row3Y + 60} x2={rightColX + 125} y2={row2Y} label="__proto__" color="red" />

        {/* 3. Function 原型.__proto__ -> Object 原型 */}
        <Arrow x1={rightColX + 125} y1={row2Y} x2={leftColX + 250} y2={row3Y} label="__proto__" color="red" />
      </div>
      
      {frame > 240 && (
         <div style={{ position: 'absolute', bottom: 50, width: '100%', textAlign: 'center', fontSize: 24, fontFamily: 'Comic Sans MS', color: '#555' }}>
            这就构成了完整的 JavaScript 原型宇宙！
         </div>
      )}

    </AbsoluteFill>
  );
};
