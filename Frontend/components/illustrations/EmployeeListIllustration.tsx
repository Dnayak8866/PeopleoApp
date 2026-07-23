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

interface EmployeeListIllustrationProps {
  width?: number;
  height?: number;
}

export default function EmployeeListIllustration({
  width = 160,
  height = 110,
}: EmployeeListIllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 160 110">
      <Defs>
        <LinearGradient id="avatarGrad1" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#818cf8" />
          <Stop offset="1" stopColor="#6366f1" />
        </LinearGradient>
        <LinearGradient id="avatarGrad2" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#34d399" />
          <Stop offset="1" stopColor="#059669" />
        </LinearGradient>
        <LinearGradient id="avatarGrad3" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#fbbf24" />
          <Stop offset="1" stopColor="#f59e0b" />
        </LinearGradient>
      </Defs>

      {/* Background circle blobs */}
      <Circle cx="80" cy="55" r="40" fill="#e0e7ff" opacity="0.4" />
      <Circle cx="40" cy="40" r="20" fill="#e0f2fe" opacity="0.6" />
      <Circle cx="120" cy="70" r="25" fill="#f5f3ff" opacity="0.5" />

      {/* Shadow */}
      <Ellipse cx="80" cy="98" rx="55" ry="6" fill="#6366f1" opacity="0.08" />

      {/* === Character 1: Left (Woman with glasses) === */}
      <G transform="translate(30, 25)">
        {/* Torso */}
        <Path d="M4 35 L26 35 L22 55 L8 55 Z" fill="url(#avatarGrad2)" />
        {/* Head */}
        <Circle cx="15" cy="22" r="10" fill="#fcd9b6" />
        {/* Hair */}
        <Path d="M5 20 Q5 8 15 8 Q25 8 25 20" fill="#78350f" />
        <Path d="M4 18 L6 30 M26 18 L24 30" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
        {/* Glasses */}
        <Rect x="8" y="18" width="6" height="4" rx="1.5" stroke="#1e293b" strokeWidth="1" fill="none" />
        <Rect x="16" y="18" width="6" height="4" rx="1.5" stroke="#1e293b" strokeWidth="1" fill="none" />
        <Path d="M14 20 L16 20" stroke="#1e293b" strokeWidth="1" />
      </G>

      {/* === Character 2: Right (Man with beard) === */}
      <G transform="translate(95, 30)">
        {/* Torso */}
        <Path d="M4 32 L26 32 L22 52 L8 52 Z" fill="url(#avatarGrad3)" />
        {/* Head */}
        <Circle cx="15" cy="20" r="9.5" fill="#e8c4a0" />
        {/* Hair & Beard */}
        <Path d="M6 18 Q6 10 15 10 Q24 10 24 18" fill="#1e293b" />
        <Path d="M9 22 Q15 28 21 22 Z" fill="#1e293b" />
      </G>

      {/* === Character 3: Center (Man, taller/foreground) === */}
      <G transform="translate(60, 15)">
        {/* Torso */}
        <Path d="M2 38 L32 38 L28 65 L6 65 Z" fill="url(#avatarGrad1)" />
        <Path d="M17 38 L15 50 L19 50 Z" fill="#ffffff" opacity="0.3" />
        {/* Head */}
        <Circle cx="17" cy="22" r="11" fill="#fcd9b6" />
        {/* Hair */}
        <Path d="M7 20 Q7 8 17 8 Q27 8 27 20" fill="#1e1b4b" />
      </G>

      {/* Chat bubble (representing communication) */}
      <G transform="translate(15, 8)" opacity="0.8">
        <Rect x="0" y="0" width="22" height="15" rx="6" fill="#6366f1" />
        <Path d="M10 15 L7 19 L13 15" fill="#6366f1" />
        <Path d="M5 8 L17 8" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
      </G>

      {/* Checkmark badge (representing completed tasks/active check-in) */}
      <G transform="translate(125, 12)" opacity="0.8">
        <Circle cx="8" cy="8" r="8" fill="#34d399" />
        <Path d="M5 8 L7 10 L11 6" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </G>

      {/* Heart or like badge (representing employee satisfaction) */}
      <G transform="translate(132, 50)" opacity="0.75">
        <Circle cx="7" cy="7" r="7" fill="#f87171" />
        <Path d="M7 10 Q7 10 5.2 8.2 Q4.2 7.2 5.2 6.2 Q6.2 5.2 7 7 Q7.8 5.2 8.8 6.2 Q9.8 7.2 8.8 8.2 Z" fill="#ffffff" />
      </G>

      {/* Decorative stars / dots */}
      <Circle cx="12" cy="75" r="1.5" fill="#6366f1" opacity="0.3" />
      <Circle cx="85" cy="92" r="2" fill="#34d399" opacity="0.4" />
      <Circle cx="78" cy="7" r="1.8" fill="#fbbf24" opacity="0.4" />
    </Svg>
  );
}
