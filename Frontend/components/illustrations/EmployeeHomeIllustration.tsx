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

interface EmployeeHomeIllustrationProps {
  width?: number;
  height?: number;
}

export default function EmployeeHomeIllustration({
  width = 150,
  height = 110,
}: EmployeeHomeIllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 150 110">
      <Defs>
        <LinearGradient id="gradientSuccess" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#34d399" />
          <Stop offset="1" stopColor="#059669" />
        </LinearGradient>
        <LinearGradient id="gradientPrimary" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#818cf8" />
          <Stop offset="1" stopColor="#6366f1" />
        </LinearGradient>
        <LinearGradient id="gradientWarning" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#fbbf24" />
          <Stop offset="1" stopColor="#d97706" />
        </LinearGradient>
      </Defs>

      {/* Decorative background circles */}
      <Circle cx="75" cy="55" r="42" fill="#e0e7ff" opacity="0.4" />
      <Circle cx="30" cy="45" r="18" fill="#e0f2fe" opacity="0.6" />
      <Circle cx="120" cy="65" r="22" fill="#ede9fe" opacity="0.5" />

      {/* Ground Shadow */}
      <Ellipse cx="75" cy="98" rx="55" ry="5.5" fill="#6366f1" opacity="0.08" />

      {/* === Character: Employee (Bust in circle) === */}
      <G transform="translate(48, 15)">
        {/* Background circle behind worker */}
        <Circle cx="26" cy="26" r="25" fill="#ffffff" stroke="#c7d2fe" strokeWidth="1.5" />
        <Circle cx="26" cy="26" r="21" fill="url(#gradientPrimary)" />

        {/* Worker Torso */}
        <Path d="M12 40 Q26 40 40 40 L36 50 L16 50 Z" fill="#ffffff" opacity="0.9" />

        {/* Face */}
        <Circle cx="26" cy="25" r="10" fill="#fcd9b6" />

        {/* Hair */}
        <Path d="M15 23 Q15 11 26 11 Q37 11 37 23" fill="#312e81" />

        {/* Smiling Mouth */}
        <Path d="M23 27 Q26 30 29 27" stroke="#1e293b" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      </G>

      {/* === Floating Punch Badge (Success / Check-in) === */}
      <G transform="translate(94, 15)" opacity="0.95">
        <Circle cx="13" cy="13" r="13" fill="#ffffff" stroke="#a7f3d0" strokeWidth="1" />
        <Circle cx="13" cy="13" r="10.5" fill="url(#gradientSuccess)" />
        {/* Checkmark */}
        <Path d="M9 13 L12 16 L18 10" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </G>

      {/* === Floating Clock Badge (representing timing) === */}
      <G transform="translate(18, 55)" opacity="0.9">
        <Circle cx="11" cy="11" r="11" fill="#ffffff" stroke="#fef3c7" strokeWidth="1" />
        <Circle cx="11" cy="11" r="8.5" fill="url(#gradientWarning)" />
        {/* Hands */}
        <Path d="M11 5 L11 11 L14 11" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
      </G>

      {/* Coffee Cup / Desk accessory on the left */}
      <G transform="translate(20, 22)" opacity="0.75">
        <Rect x="0" y="0" width="8" height="10" rx="2.5" fill="#f87171" />
        <Path d="M8 2 Q10.5 2 10.5 5 Q10.5 8 8 8" stroke="#f87171" strokeWidth="1" fill="none" />
        <Path d="M3 -3 Q4 -5 3 -7" stroke="#94a3b8" strokeWidth="0.8" fill="none" />
      </G>

      {/* Star sparkles */}
      <Path d="M125 78 L127 80 L125 82 L123 80 Z" fill="#fbbf24" opacity="0.8" />
      <Circle cx="15" cy="45" r="1.5" fill="#6366f1" opacity="0.3" />
      <Circle cx="138" cy="48" r="2" fill="#34d399" opacity="0.4" />
      <Circle cx="122" cy="14" r="1.8" fill="#fbbf24" opacity="0.4" />
    </Svg>
  );
}
