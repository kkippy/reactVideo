import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { CallStack } from './CallStack';
import { TaskQueue } from './TaskQueue';
import { EventLoopWheel } from './EventLoopWheel';
import { WebAPI } from './WebAPI';
import { CodePanel } from './CodePanel';
import { SubtitleSystem, Subtitle } from '../PrototypeChain/SubtitleSystem'; // Reuse existing component

export const Main: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. The Script
  const code = `console.log('Start');
setTimeout(() => {
  console.log('Timeout');
}, 0);
Promise.resolve().then(() => {
  console.log('Promise');
});
console.log('End');`;

  // 2. Timeline Logic
  // Expanded timeline for slower pacing and emphasis
  const timeline = useMemo(() => [
    // Phase 1: Start (Sync) - Slowed down
    { frame: 0, line: 0, stack: [], log: [], macro: [], micro: [], api: [] },
    { frame: 60, line: 0, stack: ['main()'], log: [], macro: [], micro: [], api: [] },
    { frame: 120, line: 0, stack: ['main()', 'console.log'], log: ['Start'], macro: [], micro: [], api: [] },
    
    // Phase 2: setTimeout (Macro Registration)
    { frame: 180, line: 1, stack: ['main()', 'setTimeout'], log: ['Start'], macro: [], micro: [], api: [{id: 1, name: 'Timer', progress: 0}] },
    { frame: 240, line: 1, stack: ['main()'], log: ['Start'], macro: [], micro: [], api: [{id: 1, name: 'Timer', progress: 0.5}] },
    { frame: 300, line: 1, stack: ['main()'], log: ['Start'], macro: ['Timeout'], micro: [], api: [{id: 1, name: 'Timer', progress: 1}] }, // Timer done

    // Phase 3: Promise (Micro Registration)
    { frame: 360, line: 4, stack: ['main()', 'Promise'], log: ['Start'], macro: ['Timeout'], micro: ['Promise'], api: [] }, 
    
    // Phase 4: End (Sync)
    { frame: 420, line: 7, stack: ['main()', 'console.log'], log: ['Start', 'End'], macro: ['Timeout'], micro: ['Promise'], api: [] },
    { frame: 480, line: 7, stack: [], log: ['Start', 'End'], macro: ['Timeout'], micro: ['Promise'], api: [] }, // Stack Empty, Main done

    // Phase 5: Event Loop Check (Emphasis!)
    // Pause here to show the loop checking queues
    { frame: 540, line: -1, stack: [], log: ['Start', 'End'], macro: ['Timeout'], micro: ['Promise'], api: [] }, 

    // Phase 6: Microtask Execution (Promise)
    { frame: 600, line: -1, stack: ['Micro: Promise'], log: ['Start', 'End', 'Promise'], macro: ['Timeout'], micro: [], api: [] }, 
    { frame: 660, line: -1, stack: [], log: ['Start', 'End', 'Promise'], macro: ['Timeout'], micro: [], api: [] }, 

    // Phase 7: Macrotask Execution (Timeout)
    { frame: 720, line: -1, stack: ['Macro: Timeout'], log: ['Start', 'End', 'Promise', 'Timeout'], macro: [], micro: [], api: [] },
    { frame: 780, line: -1, stack: [], log: ['Start', 'End', 'Promise', 'Timeout'], macro: [], micro: [], api: [] },
  ], []);

  // 3. Subtitles - Adjusted to new timeline
  const subtitles: Subtitle[] = [
    { startFrame: 0, endFrame: 90, text: "JS 是一门单线程语言，代码从上到下依次执行" },
    { startFrame: 100, endFrame: 160, text: "首先执行同步代码：打印 'Start'" },
    { startFrame: 170, endFrame: 280, text: "遇到 setTimeout，它是一个宏任务，交给 Web API 计时" },
    { startFrame: 290, endFrame: 340, text: "计时结束，回调函数进入宏任务队列等待" },
    { startFrame: 350, endFrame: 400, text: "遇到 Promise，它的回调被放入微任务队列" },
    { startFrame: 410, endFrame: 460, text: "继续执行同步代码：打印 'End'" },
    { startFrame: 480, endFrame: 580, text: "此时主线程空闲，Event Loop 开始工作！" },
    { startFrame: 590, endFrame: 640, text: "优先检查微任务队列：执行 Promise 回调" },
    { startFrame: 650, endFrame: 700, text: "微任务清空后，才去检查宏任务队列" },
    { startFrame: 710, endFrame: 770, text: "最后执行 setTimeout 回调，打印 'Timeout'" },
  ];

  // Find current state
  const currentState = timeline.slice().reverse().find(step => frame >= step.frame) || timeline[0];

  return (
    <AbsoluteFill style={{ backgroundColor: '#282a36', color: '#f8f8f2', fontFamily: 'sans-serif' }}>
      
      <div style={{ padding: 20, textAlign: 'center', fontSize: 40, fontWeight: 'bold', color: '#bd93f9' }}>
        Event Loop Visualization (事件循环机制)
      </div>

      {/* Layout Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '400px 1fr 400px', 
        gridTemplateRows: '1fr 1fr', 
        height: 'calc(100% - 100px)', 
        padding: 40, 
        gap: 40 
      }}>
        
        {/* Left Column: Code & Console */}
        <div style={{ gridRow: '1 / 3', gridColumn: '1 / 2', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <CodePanel code={code} currentLine={currentState.line} />
          <div style={{ flex: 1, border: '4px solid #6272a4', borderRadius: 10, padding: 20, backgroundColor: '#1e1f29' }}>
            <h3 style={{ margin: '0 0 10px 0', borderBottom: '1px solid #6272a4', paddingBottom: 10 }}>Console Output</h3>
            {currentState.log.map((l, i) => (
              <div key={i} style={{ fontFamily: 'monospace', fontSize: 20, color: '#50fa7b' }}>&gt; {l}</div>
            ))}
          </div>
        </div>

        {/* Middle Column: Call Stack & Event Loop */}
        <div style={{ gridRow: '1 / 3', gridColumn: '2 / 3', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
          <CallStack stack={currentState.stack} />
          
          <div style={{ margin: '40px 0' }}>
            <EventLoopWheel />
          </div>

          <WebAPI timers={currentState.api} />
        </div>

        {/* Right Column: Queues */}
        <div style={{ gridRow: '1 / 3', gridColumn: '3 / 4', display: 'flex', flexDirection: 'column', gap: 40, justifyContent: 'center' }}>
          <TaskQueue type="Micro" tasks={currentState.micro} color="#bd93f9" /> {/* Microtasks Priority High */}
          <TaskQueue type="Macro" tasks={currentState.macro} color="#ff79c6" />
        </div>

      </div>

      {/* Subtitles Layer */}
      <SubtitleSystem subtitles={subtitles} />

    </AbsoluteFill>
  );
};
