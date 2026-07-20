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

interface AddEmployeeIllustrationProps {
  width?: number;
  height?: number;
}

export default function AddEmployeeIllustration({
  width = 150,
  height = 110,
}: AddEmployeeIllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 150 110">
      <Defs>
        <LinearGradient id="addGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#818cf8" />
          <Stop offset="1" stopColor="#6366f1" />
        </LinearGradient>
        <LinearGradient id="badgeGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#34d399" />
          <Stop offset="1" stopColor="#059669" />
        </LinearGradient>
      </Defs>

      {/* Decorative background circles */}
      <Circle cx="75" cy="55" r="42" fill="#e0e7ff" opacity="0.4" />
      <Circle cx="30" cy="30" r="18" fill="#e0f2fe" opacity="0.6" />
      <Circle cx="120" cy="70" r="22" fill="#f5f3ff" opacity="0.5" />

      {/* Shadow */}
      <Ellipse cx="75" cy="98" rx="55" ry="5.5" fill="#6366f1" opacity="0.08" />

      {/* === Employee Badge Cards (Background Stack) === */}
      <G transform="translate(30, 24)">
        {/* Card 1 (Behind) */}
        <Rect x="10" y="-8" width="60" height="42" rx="6" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" opacity="0.6" />
        {/* Card 2 (Middle) */}
        <Rect x="5" y="-4" width="60" height="42" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" opacity="0.8" />
        
        {/* Card 3 (Front/Main) */}
        <Rect x="0" y="0" width="60" height="42" rx="6" fill="#ffffff" stroke="#c7d2fe" strokeWidth="1.5" />
        <Rect x="0" y="0" width="60" height="6" rx="3" fill="url(#addGrad)" />

        {/* Small profile icon inside card */}
        <Circle cx="15" cy="22" r="6" fill="#e0e7ff" />
        <Path d="M9 32 C9 28, 21 28, 21 32 Z" fill="#6366f1" opacity="0.8" />

        {/* Details lines */}
        <Rect x="26" y="16" width="24" height="2.5" rx="1" fill="#cbd5e1" />
        <Rect x="26" y="22" width="18" height="2.5" rx="1" fill="#cbd5e1" />
        <Rect x="26" y="28" width="20" height="2.5" rx="1" fill="#cbd5e1" />
      </G>

      {/* === Floating PLUS Tag (Foreground) === */}
      <G transform="translate(92, 42)">
        <Circle cx="12" cy="12" r="12" fill="#ffffff" stroke="#a7f3d0" strokeWidth="1" />
        <Circle cx="12" cy="12" r="9.5" fill="url(#badgeGrad)" />
        {/* Plus Symbol */}
        <Path d="M12 7 L12 17 M7 12 L17 12" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
      </G>

      {/* Decorative stars */}
      <Path d="M125 15 L127 17 L125 19 L123 17 Z" fill="#fbbf24" opacity="0.8" />
      <Circle cx="14" cy="40" r="1.5" fill="#6366f1" opacity="0.3" />
      <Circle cx="138" cy="48" r="2" fill="#34d399" opacity="0.4" />
      <Circle cx="118" cy="92" r="1.8" fill="#fbbf24" opacity="0.5" />
    </Svg>
  );
}
