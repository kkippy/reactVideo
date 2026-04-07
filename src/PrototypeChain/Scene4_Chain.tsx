import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { ObjectBox } from './ObjectBox';
import { Arrow } from './Arrow';
import { CodeBlock } from './CodeBlock';

export const Scene4_Chain: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 0-60: 介绍构造函数
  // 60-150: 介绍 prototype 属性
  // 150-300: 演示 new 的过程

  const showPrototype = frame > 60;
  const showNewProcess = frame > 150;
  
  // new 过程动画
  // 1. 创建空对象
  // 2. 链接 __proto__
  // 3. 执行构造函数
  
  const newObjOpacity = interpolate(frame, [160, 180], [0, 1]);
  const linkOpacity = interpolate(frame, [200, 220], [0, 1]);
  const propsOpacity = interpolate(frame, [240, 260], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: 'white' }}>
       <h2 style={{ position: 'absolute', top: 30, width: '100%', textAlign: 'center', fontFamily: 'Comic Sans MS' }}>
        构造函数：自动组装链条
      </h2>

      <CodeBlock 
        code={`function Dog(name) {
  this.name = name;
}

Dog.prototype.bark = function() {
  console.log("Woof!");
};

const myDog = new Dog("Buddy");`}
        x={50} y={150} scale={0.9}
        highlightLine={frame > 150 ? 8 : frame > 60 ? 4 : 0}
      />

      {/* 构造函数 */}
      <div style={{ position: 'absolute', left: 600, top: 150 }}>
        <div style={{ border: '2px dashed black', padding: 20, borderRadius: 10, background: '#f9f9f9' }}>
          <h3>Dog (函数)</h3>
        </div>
      </div>

      {/* Dog.prototype */}
      <div style={{ opacity: showPrototype ? 1 : 0, transition: 'opacity 0.5s' }}>
        <ObjectBox 
          x={1000} y={150} width={250} height={150} 
          label="Dog.prototype" 
          properties={['bark: function']} 
          color="green"
        />
        <Arrow x1={750} y1={200} x2={1000} y2={200} label="prototype" />
      </div>

      {/* new Dog() 过程演示区域 */}
      {showNewProcess && (
        <div style={{ position: 'absolute', left: 600, top: 400, width: 800, height: 400, border: '2px solid #ddd', borderRadius: 20, padding: 20 }}>
          <h3 style={{ margin: 0, color: '#666' }}>new Dog("Buddy") 发生的事情:</h3>
          
          <div style={{ position: 'relative', height: '100%' }}>
            {/* 1. 新对象 */}
            <div style={{ opacity: newObjOpacity }}>
              <ObjectBox 
                x={200} y={100} width={250} height={150} 
                label="myDog" 
                properties={propsOpacity ? ['name: "Buddy"'] : []} 
              />
            </div>

            {/* 2. 链接 */}
            <div style={{ opacity: linkOpacity }}>
               <Arrow x1={325} y1={100} x2={500} y2={-100} label="__proto__" color="red" /> 
               {/* 这里坐标是相对的，指向上面的 Dog.prototype (大致位置) */}
            </div>
            
            <div style={{ position: 'absolute', right: 20, top: 50, width: 300 }}>
              <ul style={{ fontSize: 24, listStyle: 'none' }}>
                <li style={{ opacity: newObjOpacity, marginBottom: 10 }}>1. 创建一个空对象</li>
                <li style={{ opacity: linkOpacity, marginBottom: 10, color: 'red', fontWeight: 'bold' }}>2. 将 __proto__ 指向 Dog.prototype</li>
                <li style={{ opacity: propsOpacity }}>3. 执行函数，设置属性 (this.name)</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {frame > 350 && (
        <div style={{ position: 'absolute', bottom: 30, width: '100%', textAlign: 'center', fontSize: 24, fontFamily: 'Comic Sans MS' }}>
          现在 myDog.bark() 可以工作了，因为它会沿着红色箭头找到 Dog.prototype！
        </div>
      )}

    </AbsoluteFill>
  );
};
