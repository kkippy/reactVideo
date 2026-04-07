import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, useVideoConfig } from 'remotion';
import { CodeWindow } from './CodeWindow';
import { ProtoLink } from './ProtoLink';
import { SearchPulse } from './SearchPulse';
import { ObjectBox } from './ObjectBox';
import { TechBackground } from './TechBackground';
import { ObjectIcon, NullIcon } from './Icons';

// Custom dark theme object box wrapper
const DarkObjectBox: React.FC<React.ComponentProps<typeof ObjectBox> & { glowColor?: string }> = (props) => {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ 
        position: 'absolute', 
        left: props.x, 
        top: props.y, 
        width: props.width, 
        height: props.height, 
        boxShadow: `0 0 15px ${props.glowColor || '#bd93f9'}`, 
        borderRadius: 10,
        zIndex: 0
      }} />
      <ObjectBox {...props} color={props.glowColor || '#bd93f9'} />
    </div>
  );
};

export const MainScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Phases
  // 1. Discovery (0-300): Code typing
  // 2. Portal (300-600): Object creation visual
  // 3. ChainClimb (600-1200): Search pulse moving up
  // 4. TheVoid (1200+): Reaching null

  // --- Phase 1: Discovery ---
  const codeOpacity = interpolate(frame, [0, 30], [0, 1]);
  const codeMoveOut = interpolate(frame, [250, 300], [0, -height], { extrapolateLeft: 'clamp' });

  // --- Phase 2: Portal ---
  const portalOpacity = interpolate(frame, [300, 350], [0, 1]);
  
  // Objects positions
  const userObjPos = { x: width / 2 - 150, y: height - 250 };
  const protoObjPos = { x: width / 2 - 150, y: height / 2 - 100 };
  const nullPos = { x: width / 2 - 50, y: 100 };

  // --- Phase 3: ChainClimb ---
  // Pulse starts when code executes user.toString()
  const pulseTrigger = 450;

  return (
    <AbsoluteFill style={{ color: '#F7DF1E' }}>
      
      {/* 1. Tech Background (Animated Grid & Particles) */}
      <TechBackground />
      
      {/* Phase 1: Code Window */}
      <div style={{ opacity: codeOpacity, transform: `translateY(${codeMoveOut}px)` }}>
        <CodeWindow 
          code={`const user = {\n  name: "Neo",\n  role: "The One"\n};\n\n// Where does toString come from?\nuser.toString();`}
          startFrame={50}
          endFrame={200}
          x={width / 2 - 300}
          y={height / 2 - 200}
        />
      </div>

      {/* Phase 2 & 3: Objects and Links */}
      <div style={{ opacity: portalOpacity }}>
        {/* User Object */}
        <DarkObjectBox 
          x={userObjPos.x} y={userObjPos.y} 
          width={300} height={150} 
          label="user (Instance)" 
          properties={['name: "Neo"', 'role: "The One"', '__proto__']}
          glowColor="#ff79c6"
          icon={<ObjectIcon color="#ff79c6" />}
        />

        {/* Object Prototype */}
        <div style={{ opacity: interpolate(frame, [350, 400], [0, 1]) }}>
          <DarkObjectBox 
            x={protoObjPos.x} y={protoObjPos.y} 
            width={300} height={150} 
            label="Object.prototype" 
            properties={['toString()', 'hasOwnProperty()', '__proto__']}
            glowColor="#8be9fd"
            icon={<ObjectIcon color="#8be9fd" />}
          />
        </div>

        {/* Link: User -> Prototype */}
        <ProtoLink 
          start={{ x: userObjPos.x + 150, y: userObjPos.y }} 
          end={{ x: protoObjPos.x + 150, y: protoObjPos.y + 150 }} 
          delay={350}
          color="#bd93f9"
        />

        {/* Null / The Void */}
        <div style={{ 
          position: 'absolute', left: nullPos.x, top: nullPos.y, 
          opacity: interpolate(frame, [400, 450], [0, 1]),
          display: 'flex', flexDirection: 'column', alignItems: 'center'
        }}>
          <div style={{ 
            width: 100, height: 100, 
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            filter: 'drop-shadow(0 0 10px #6272a4)'
          }}>
            <NullIcon size={80} color="#6272a4" />
          </div>
          <div style={{ fontSize: 30, fontWeight: 'bold', color: '#6272a4', marginTop: 10 }}>null</div>
        </div>

        {/* Link: Prototype -> Null */}
        <ProtoLink 
          start={{ x: protoObjPos.x + 150, y: protoObjPos.y }} 
          end={{ x: nullPos.x + 50, y: nullPos.y + 50 }} 
          delay={400}
          color="#6272a4"
        />

        {/* Search Pulse Animation */}
        <SearchPulse 
          start={{ x: userObjPos.x + 150, y: userObjPos.y + 75 }} 
          end={{ x: protoObjPos.x + 150, y: protoObjPos.y + 75 }} 
          triggerFrame={pulseTrigger}
          duration={60}
        />
        
        {/* Second Pulse (Prototype -> Found) */}
        {/* Simulating finding toString inside Object.prototype */}
        
        {frame > pulseTrigger + 60 && (
           <div style={{
             position: 'absolute',
             left: protoObjPos.x + 20,
             top: protoObjPos.y + 60, // approximate position of toString
             width: 260,
             height: 40,
             border: '2px solid #50fa7b',
             borderRadius: 5,
             boxShadow: '0 0 10px #50fa7b',
             opacity: interpolate(frame, [pulseTrigger + 60, pulseTrigger + 80], [0, 1])
           }} />
        )}

      </div>

      {/* Phase 4: The Void / Text Overlay */}
      {frame > 600 && (
        <div style={{ 
          position: 'absolute', bottom: 50, width: '100%', textAlign: 'center',
          opacity: interpolate(frame, [600, 650], [0, 1])
        }}>
          <h2 style={{ fontSize: 50, fontFamily: 'Fira Code, monospace', color: '#f8f8f2' }}>
            Prototype Chain Lookup
          </h2>
          <div style={{ 
            display: 'inline-block', 
            textAlign: 'left', 
            backgroundColor: 'rgba(40, 42, 54, 0.8)', 
            padding: 30, 
            borderRadius: 20,
            backdropFilter: 'blur(10px)',
            border: '1px solid #44475a'
          }}>
            <p style={{ fontSize: 30, color: '#ff5555', margin: '10px 0' }}>
              1. Check Own Properties ❌
            </p>
            <p style={{ fontSize: 30, color: '#bd93f9', margin: '10px 0' }}>
              2. Follow __proto__ Link 🔗
            </p>
            <p style={{ fontSize: 30, color: '#50fa7b', margin: '10px 0' }}>
              3. Check Prototype Properties ✅
            </p>
          </div>
        </div>
      )}

    </AbsoluteFill>
  );
};
