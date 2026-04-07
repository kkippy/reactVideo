import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

export const CallStack: React.FC<{ stack: string[] }> = ({ stack }) => {
  const frame = useCurrentFrame();
  
  return (
    <div style={{
      width: 300,
      height: 500,
      border: '4px solid #bd93f9',
      borderRadius: 10,
      backgroundColor: '#282a36',
      display: 'flex',
      flexDirection: 'column-reverse', // Stack grows from bottom
      padding: 10,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        top: -30,
        width: '100%',
        textAlign: 'center',
        color: '#bd93f9',
        fontWeight: 'bold',
        fontSize: 24,
      }}>Call Stack</div>
      
      {stack.map((item, index) => (
        <div
          key={index}
          style={{
            height: 50,
            backgroundColor: '#ff79c6',
            color: '#282a36',
            margin: '5px 0',
            borderRadius: 5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            boxShadow: '0 4px 0 #bd5bb0',
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
};
