import React from 'react';
import Svg, {
  Circle,
  Rect,
  Path,
  G,
  Ellipse,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';

interface LeaveIllustrationProps {
  width?: number;
  height?: number;
}

export default function LeaveIllustration({
  width = 150,
  height = 110,
}: LeaveIllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 150 110">
      <Defs>
        <LinearGradient id="beachGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#fbbf24" />
          <Stop offset="1" stopColor="#f59e0b" />
        </LinearGradient>
        <LinearGradient id="umbrellaGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#f87171" />
          <Stop offset="1" stopColor="#ef4444" />
        </LinearGradient>
        <LinearGradient id="skyGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#a5b4fc" />
          <Stop offset="1" stopColor="#6366f1" />
        </LinearGradient>
      </Defs>

      {/* Background clouds / bubbles */}
      <Circle cx="75" cy="55" r="42" fill="#e0e7ff" opacity="0.4" />
      <Circle cx="35" cy="35" r="20" fill="#e0f2fe" opacity="0.5" />
      <Circle cx="120" cy="70" r="18" fill="#f5f3ff" opacity="0.5" />

      {/* Shadow */}
      <Ellipse cx="75" cy="98" rx="55" ry="5.5" fill="#6366f1" opacity="0.08" />

      {/* === Floating Airplane (Vacation theme) === */}
      <G transform="translate(20, 20)">
        {/* Sky paths / clouds */}
        <Path d="M5 25 Q15 20 25 25 Q35 30 45 25" stroke="#e2e8f0" strokeWidth="1.5" fill="none" opacity="0.5" />
        <Path d="M0 10 L50 10" stroke="#6366f1" strokeWidth="1" strokeDasharray="3,3" opacity="0.4" />
        
        {/* Airplane body */}
        <Path
          d="M12 8 L28 8 Q34 8 36 12 L14 12 Z"
          fill="url(#skyGrad)"
        />
        {/* Airplane wings */}
        <Path d="M20 8 L18 0 L24 8 Z" fill="#4f46e5" />
        <Path d="M20 12 L18 20 L24 12 Z" fill="#4f46e5" />
        {/* Tail */}
        <Path d="M12 8 L8 4 L8 12 Z" fill="#4f46e5" />
      </G>

      {/* === Sun & Palm/Umbrella (Right - Island vacation theme) === */}
      <G transform="translate(85, 25)">
        {/* Sun */}
        <Circle cx="40" cy="10" r="10" fill="url(#beachGrad)" />
        
        {/* Island sand base */}
        <Path d="M10 60 Q30 52 50 60 Z" fill="#fde047" opacity="0.9" />

        {/* Umbrella stand */}
        <Path d="M28 60 L24 35" stroke="#94a3b8" strokeWidth="2.5" />

        {/* Umbrella canopy */}
        <Path
          d="M12 35 Q24 20 36 35 Z"
          fill="url(#umbrellaGrad)"
        />
        <Path d="M12 35 L36 35" stroke="#ffffff" strokeWidth="1.5" />
        <Path d="M24 23 L24 35" stroke="#ffffff" strokeWidth="1.5" />
      </G>

      {/* === Calendar Check Badge (Foreground) === */}
      <G transform="translate(52, 48)">
        <Rect x="0" y="0" width="30" height="32" rx="6" fill="#ffffff" stroke="#c7d2fe" strokeWidth="1.5" />
        <Rect x="0" y="0" width="30" height="9" rx="4" fill="#6366f1" />
        {/* Calendar details */}
        <Circle cx="8" cy="4.5" r="1" fill="#ffffff" />
        <Circle cx="15" cy="4.5" r="1" fill="#ffffff" />
        <Circle cx="22" cy="4.5" r="1" fill="#ffffff" />
        
        {/* Green check inside calendar */}
        <Path d="M8 19 L13 24 L22 15" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </G>

      {/* Decorative stars */}
      <Path d="M72 15 L74 17 L72 19 L70 17 Z" fill="#fbbf24" opacity="0.8" />
      <Circle cx="12" cy="55" r="1.5" fill="#6366f1" opacity="0.3" />
      <Circle cx="138" cy="18" r="2" fill="#34d399" opacity="0.4" />
      <Circle cx="132" cy="85" r="1.8" fill="#fbbf24" opacity="0.5" />
    </Svg>
  );
}
