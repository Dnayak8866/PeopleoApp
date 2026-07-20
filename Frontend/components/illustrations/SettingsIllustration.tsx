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

interface SettingsIllustrationProps {
  width?: number;
  height?: number;
}

export default function SettingsIllustration({
  width = 150,
  height = 110,
}: SettingsIllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 150 110">
      <Defs>
        <LinearGradient id="gear1Grad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#a855f7" />
          <Stop offset="1" stopColor="#6366f1" />
        </LinearGradient>
        <LinearGradient id="gear2Grad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#34d399" />
          <Stop offset="1" stopColor="#059669" />
        </LinearGradient>
      </Defs>

      {/* Decorative background circles */}
      <Circle cx="75" cy="55" r="42" fill="#ede9fe" opacity="0.4" />
      <Circle cx="30" cy="30" r="18" fill="#e0f2fe" opacity="0.6" />
      <Circle cx="120" cy="70" r="22" fill="#f5f3ff" opacity="0.5" />

      {/* Shadow */}
      <Ellipse cx="75" cy="98" rx="55" ry="5.5" fill="#6366f1" opacity="0.08" />

      {/* === Big Gear (Center) === */}
      <G transform="translate(42, 22)">
        <Circle cx="24" cy="24" r="18" fill="#ffffff" stroke="#c7d2fe" strokeWidth="1.5" />
        <Circle cx="24" cy="24" r="14" fill="url(#gear1Grad)" />
        <Circle cx="24" cy="24" r="6" fill="#ffffff" />
        {/* Teeth */}
        <Path d="M24 2 L24 6 M24 42 L24 46 M2 24 L6 24 M42 24 L46 24" stroke="#c7d2fe" strokeWidth="3" strokeLinecap="round" />
        <Path d="M8 8 L11 11 M37 37 L40 40 M8 40 L11 37 M37 8 L40 11" stroke="#c7d2fe" strokeWidth="3" strokeLinecap="round" />
      </G>

      {/* === Small Gear (Foreground right) === */}
      <G transform="translate(84, 48)">
        <Circle cx="14" cy="14" r="11" fill="#ffffff" stroke="#a7f3d0" strokeWidth="1" />
        <Circle cx="14" cy="14" r="8.5" fill="url(#gear2Grad)" />
        <Circle cx="14" cy="14" r="3.5" fill="#ffffff" />
        {/* Teeth */}
        <Path d="M14 2 L14 5 M14 23 L14 26 M2 14 L5 14 M23 14 L26 14" stroke="#a7f3d0" strokeWidth="2.2" strokeLinecap="round" />
        <Path d="M5.5 5.5 L7.5 7.5 M20.5 20.5 L22.5 22.5 M5.5 20.5 L7.5 17.5 M20.5 7.5 L22.5 5.5" stroke="#a7f3d0" strokeWidth="2.2" strokeLinecap="round" />
      </G>

      {/* Decorative stars */}
      <Path d="M125 15 L127 17 L125 19 L123 17 Z" fill="#fbbf24" opacity="0.8" />
      <Circle cx="14" cy="55" r="1.5" fill="#6366f1" opacity="0.3" />
      <Circle cx="138" cy="28" r="2" fill="#34d399" opacity="0.4" />
      <Circle cx="20" cy="85" r="1.8" fill="#fbbf24" opacity="0.5" />
    </Svg>
  );
}
