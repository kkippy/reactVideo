import React from 'react';

export const Arrow: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  label?: string;
  dashed?: boolean;
}> = ({ x1, y1, x2, y2, color = 'black', label, dashed = false }) => {
  const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
  const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

  return (
    <div
      style={{
        position: 'absolute',
        left: x1,
        top: y1,
        width: length,
        height: 2,
        backgroundColor: dashed ? 'transparent' : color,
        borderTop: dashed ? `2px dashed ${color}` : 'none',
        transform: `rotate(${angle}deg)`,
        transformOrigin: '0 0',
      }}
    >
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: -4,
          width: 0,
          height: 0,
          borderTop: '5px solid transparent',
          borderBottom: '5px solid transparent',
          borderLeft: `10px solid ${color}`,
        }}
      />
      {label && (
        <div
          style={{
            position: 'absolute',
            left: length / 2 - 20,
            top: -25,
            color,
            fontSize: 14,
            fontWeight: 'bold',
            transform: `rotate(${-angle}deg)`, // Keep text upright? Or rotate with line? Let's keep it upright relative to screen if possible, but here relative to line is easier. Let's try to un-rotate.
            // Actually, un-rotating is hard without knowing absolute position context. Let's just place it above the line.
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};
