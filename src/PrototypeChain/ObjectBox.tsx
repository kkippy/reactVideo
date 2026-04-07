import React from 'react';

export const ObjectBox: React.FC<{
  x: number;
  y: number;
  width?: number;
  height?: number;
  label: string;
  properties?: string[];
  color?: string;
  icon?: React.ReactNode;
}> = ({ x, y, width = 200, height = 150, label, properties = [], color = 'black', icon }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        border: `4px solid ${color}`,
        borderRadius: 10,
        padding: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Slight transparency for tech bg
        color: '#333', // Ensure text is visible on light background
        fontFamily: 'sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backdropFilter: 'blur(5px)',
      }}
    >
      <div style={{ fontWeight: 'bold', borderBottom: `2px solid ${color}`, width: '100%', textAlign: 'center', marginBottom: 5, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
        {icon}
        {label}
      </div>
      <div style={{ fontSize: 14, width: '100%' }}>
        {properties.map((prop, i) => (
          <div key={i}>{prop}</div>
        ))}
      </div>
    </div>
  );
};
