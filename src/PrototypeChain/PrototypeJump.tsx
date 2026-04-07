import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

// --- Configuration ---
const CONFIG = {
  colors: {
    background: '#050505',
    objectBg: '#1a1a1a',
    objectBorder: '#333',
    text: '#eee',
    highlight: '#F7DF1E', // JS Yellow
    target: '#3fb950',    // Green
    gradientStart: '#F7DF1E',
    gradientEnd: '#3fb950',
  },
  layout: {
    instance: { x: 400, y: 800, width: 200, height: 120 },
    prototype: { x: 1400, y: 300, width: 250, height: 150 },
  },
  animation: {
    stiffness: 100,
    damping: 15,
  },
};

export const PrototypeJump: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- Animation Phases ---
  
  // Phase 1: Local Search (Frame 0-30)
  // Shake effect: sin wave damped
  const shake = interpolate(frame, [0, 30], [5, 0], { extrapolateRight: 'clamp' }) * Math.sin(frame * 0.8);
  
  // Local glow opacity
  const localGlowOpacity = interpolate(frame, [0, 15, 30], [0, 1, 0], { extrapolateRight: 'clamp' });

  // Phase 2: Tunnel Travel (Frame 30-70)
  // Spring controlled progress 0 -> 1
  const travelProgress = spring({
    frame: frame - 30,
    fps,
    config: {
      stiffness: CONFIG.animation.stiffness,
      damping: CONFIG.animation.damping,
    },
    durationInFrames: 40, 
  });

  // Phase 3: Arrival Ripple (Frame 70+)
  const rippleScale = interpolate(frame, [70, 90], [1, 2], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const rippleOpacity = interpolate(frame, [70, 90], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  
  // Highlight property opacity
  const propertyHighlightOpacity = interpolate(frame, [70, 80], [0, 1], { extrapolateLeft: 'clamp' });

  // --- Path Calculation ---
  const startX = CONFIG.layout.instance.x + CONFIG.layout.instance.width / 2;
  const startY = CONFIG.layout.instance.y;
  const endX = CONFIG.layout.prototype.x + CONFIG.layout.prototype.width / 2;
  const endY = CONFIG.layout.prototype.y + CONFIG.layout.prototype.height;

  // Bezier Control Points (creating a nice "S" curve or arc)
  const cp1X = startX;
  const cp1Y = (startY + endY) / 2;
  const cp2X = endX;
  const cp2Y = (startY + endY) / 2;

  const pathData = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;

  // Calculate current dot position along the curve (Approximate using interpolation for visual simplicity, 
  // or precise SVG path logic. For React/Remotion without extra libs, we can approximate curve pos 
  // or use SVG pathLength + dashoffset trick for the line, but for the DOT we need coordinates.
  // Let's implement a Cubic Bezier function for the dot.)
  
  const t = Math.max(0, Math.min(1, travelProgress));
  const cx = 3 * (1 - t) * (1 - t) * t * cp1X + 3 * (1 - t) * t * t * cp2X + t * t * t * endX + (1 - t) * (1 - t) * (1 - t) * startX;
  const cy = 3 * (1 - t) * (1 - t) * t * cp1Y + 3 * (1 - t) * t * t * cp2Y + t * t * t * endY + (1 - t) * (1 - t) * (1 - t) * startY;

  return (
    <div style={{ 
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
      backgroundColor: CONFIG.colors.background, fontFamily: 'Fira Code, monospace', color: CONFIG.colors.text 
    }}>
      
      {/* --- SVG Layer for Connection --- */}
      <svg style={{ position: 'absolute', width: '100%', height: '100%', overflow: 'visible' }}>
        <defs>
          <linearGradient id="linkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={CONFIG.colors.gradientStart} />
            <stop offset="100%" stopColor={CONFIG.colors.gradientEnd} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* The Tunnel Line */}
        <path
          d={pathData}
          stroke="url(#linkGradient)"
          strokeWidth="4"
          fill="none"
          strokeDasharray="10 10"
          strokeOpacity={0.3 + travelProgress * 0.7} // Fade in as we travel
          style={{
            strokeDashoffset: -frame * 2, // Flowing effect
          }}
        />
        
        {/* The Traveling Dot (Phase 2) */}
        {frame >= 30 && (
          <circle
            cx={cx}
            cy={cy}
            r="8"
            fill="#fff"
            filter="url(#glow)"
            style={{
              opacity: frame > 75 ? 0 : 1 // Hide after arrival
            }}
          />
        )}
      </svg>

      {/* --- Instance Object (Bottom Left) --- */}
      <div style={{
        position: 'absolute',
        left: CONFIG.layout.instance.x,
        top: CONFIG.layout.instance.y,
        width: CONFIG.layout.instance.width,
        height: CONFIG.layout.instance.height,
        backgroundColor: CONFIG.colors.objectBg,
        border: `2px solid ${CONFIG.colors.objectBorder}`,
        borderRadius: 12,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `translateX(${shake}px)`, // Phase 1 Shake
        boxShadow: `0 0 ${localGlowOpacity * 30}px ${CONFIG.colors.highlight}`, // Phase 1 Glow
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: 10 }}>dog (Instance)</div>
        <div style={{ fontSize: 14, color: '#888' }}>Searching...</div>
      </div>

      {/* --- Prototype Object (Top Right) --- */}
      <div style={{
        position: 'absolute',
        left: CONFIG.layout.prototype.x,
        top: CONFIG.layout.prototype.y,
        width: CONFIG.layout.prototype.width,
        height: CONFIG.layout.prototype.height,
        backgroundColor: CONFIG.colors.objectBg,
        border: `2px solid ${CONFIG.colors.objectBorder}`,
        borderRadius: 12,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: 10, borderBottom: '1px solid #444', paddingBottom: 5, width: '90%', textAlign: 'center' }}>
          Animal.prototype
        </div>
        
        {/* Target Property */}
        <div style={{
          padding: '5px 15px',
          borderRadius: 4,
          backgroundColor: propertyHighlightOpacity > 0 ? 'rgba(63, 185, 80, 0.2)' : 'transparent',
          color: propertyHighlightOpacity > 0 ? CONFIG.colors.target : '#888',
          border: propertyHighlightOpacity > 0 ? `1px solid ${CONFIG.colors.target}` : '1px solid transparent',
          transition: 'all 0.3s',
        }}>
          .eat()
        </div>

        {/* Ripple Effect (Phase 3) */}
        {frame > 70 && (
          <div style={{
            position: 'absolute',
            left: '50%', top: '50%',
            width: '100%', height: '100%',
            borderRadius: 12,
            border: `2px solid ${CONFIG.colors.target}`,
            transform: `translate(-50%, -50%) scale(${rippleScale})`,
            opacity: rippleOpacity,
          }} />
        )}
      </div>

    </div>
  );
};
