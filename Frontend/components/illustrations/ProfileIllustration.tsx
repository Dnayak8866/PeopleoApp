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

interface ProfileIllustrationProps {
  width?: number;
  height?: number;
}

export default function ProfileIllustration({
  width = 130,
  height = 90,
}: ProfileIllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 130 90">
      <Defs>
        <LinearGradient id="profileGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#818cf8" />
          <Stop offset="1" stopColor="#6366f1" />
        </LinearGradient>
        <LinearGradient id="gearGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#34d399" />
          <Stop offset="1" stopColor="#059669" />
        </LinearGradient>
      </Defs>

      {/* Decorative background circle */}
      <Circle cx="65" cy="45" r="38" fill="#e0e7ff" opacity="0.4" />
      <Circle cx="25" cy="25" r="16" fill="#e0f2fe" opacity="0.6" />
      <Circle cx="105" cy="65" r="18" fill="#f5f3ff" opacity="0.5" />

      {/* Shadow */}
      <Ellipse cx="65" cy="82" rx="48" ry="4.5" fill="#6366f1" opacity="0.08" />

      {/* === Profile Badge ID (Background) === */}
      <G transform="translate(35, 15)">
        <Rect x="0" y="0" width="60" height="50" rx="8" fill="#ffffff" stroke="#c7d2fe" strokeWidth="1.5" />
        <Rect x="0" y="0" width="60" height="8" rx="4" fill="url(#profileGrad)" />
        
        {/* Profile Avatar outline */}
        <Circle cx="18" cy="28" r="8" fill="#e0e7ff" />
        <Path d="M10 42 C10 36, 26 36, 26 42 Z" fill="#6366f1" opacity="0.8" />
        
        {/* Info lines */}
        <Rect x="32" y="22" width="20" height="3" rx="1.5" fill="#cbd5e1" />
        <Rect x="32" y="29" width="15" height="3" rx="1.5" fill="#cbd5e1" />
        <Rect x="32" y="36" width="18" height="3" rx="1.5" fill="#cbd5e1" />
      </G>

      {/* === Floating Settings Gear === */}
      <G transform="translate(85, 36)">
        <Circle cx="12" cy="12" r="10" fill="#ffffff" stroke="#a7f3d0" strokeWidth="1" />
        <Circle cx="12" cy="12" r="8" fill="url(#gearGrad)" />
        <Circle cx="12" cy="12" r="3.5" fill="#ffffff" />
        {/* Gear teeth */}
        <Path d="M12 2 L12 4 M12 20 L12 22 M2 12 L4 12 M20 12 L22 12" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
        <Path d="M5 5 L6.5 6.5 M17.5 17.5 L19 19 M5 19 L6.5 17.5 M17.5 6.5 L19 5" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
      </G>

      {/* Decorative elements */}
      <Path d="M15 65 L17 67 L15 69 L13 67 Z" fill="#fbbf24" opacity="0.8" />
      <Circle cx="115" cy="20" r="1.5" fill="#6366f1" opacity="0.3" />
      <Circle cx="10" cy="38" r="2" fill="#34d399" opacity="0.4" />
    </Svg>
  );
}
