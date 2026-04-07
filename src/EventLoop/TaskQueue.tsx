import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export const TaskQueue: React.FC<{
  type: 'Macro' | 'Micro';
  tasks: string[];
  color: string;
}> = ({ type, tasks, color }) => {
  return (
    <div style={{
      width: 400,
      height: 120,
      border: `4px solid ${color}`,
      borderRadius: 10,
      backgroundColor: '#282a36',
      display: 'flex',
      alignItems: 'center',
      padding: 10,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        top: -30,
        left: 10,
        color: color,
        fontWeight: 'bold',
        fontSize: 20,
      }}>
        {type} Queue
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        {tasks.map((task, i) => (
          <div
            key={i}
            style={{
              width: 80,
              height: 80,
              backgroundColor: color,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#282a36',
              fontWeight: 'bold',
              fontSize: 14,
              boxShadow: '0 4px 0 rgba(0,0,0,0.3)',
            }}
          >
            {task}
          </div>
        ))}
      </div>
    </div>
  );
};
