import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export const WebAPI: React.FC<{
  timers: { id: number; name: string; progress: number }[];
}> = ({ timers }) => {
  return (
    <div style={{
      width: 250,
      height: 300,
      border: '4px solid #ff5555',
      borderRadius: 10,
      backgroundColor: '#282a36',
      display: 'flex',
      flexDirection: 'column',
      padding: 10,
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute',
        top: -30,
        width: '100%',
        textAlign: 'center',
        color: '#ff5555',
        fontWeight: 'bold',
        fontSize: 24,
      }}>Web APIs</div>

      {timers.map((timer, i) => (
        <div key={i} style={{ marginBottom: 10 }}>
          <div style={{ color: '#f8f8f2', fontSize: 14 }}>{timer.name}</div>
          <div style={{
            width: '100%',
            height: 10,
            backgroundColor: '#44475a',
            borderRadius: 5,
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${timer.progress * 100}%`,
              height: '100%',
              backgroundColor: '#50fa7b',
            }} />
          </div>
        </div>
      ))}
    </div>
  );
};
