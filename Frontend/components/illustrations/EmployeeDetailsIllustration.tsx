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

interface EmployeeDetailsIllustrationProps {
  width?: number;
  height?: number;
}

export default function EmployeeDetailsIllustration({
  width = 150,
  height = 110,
}: EmployeeDetailsIllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 150 110">
      <Defs>
        <LinearGradient id="detailsGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#6366f1" />
          <Stop offset="1" stopColor="#4f46e5" />
        </LinearGradient>
        <LinearGradient id="badgeGreen" x1="0" y1="0" x2="0" y2="1">
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

      {/* === Profile Document Sheet (Background) === */}
      <G transform="translate(35, 18)">
        <Rect x="0" y="0" width="80" height="58" rx="8" fill="#ffffff" stroke="#c7d2fe" strokeWidth="1.5" />
        <Rect x="0" y="0" width="80" height="8" rx="4" fill="url(#detailsGrad)" />

        {/* Avatar circle representation */}
        <Circle cx="20" cy="28" r="10" fill="#e0e7ff" />
        <Path d="M13 38 C13 33, 27 33, 27 38 Z" fill="#6366f1" opacity="0.8" />

        {/* Text detail lines */}
        <Rect x="36" y="20" width="34" height="3" rx="1.5" fill="#cbd5e1" />
        <Rect x="36" y="27" width="24" height="3" rx="1.5" fill="#cbd5e1" />
        
        <Rect x="10" y="44" width="60" height="3" rx="1.5" fill="#e2e8f0" />
        <Rect x="10" y="50" width="48" height="3" rx="1.5" fill="#e2e8f0" />
      </G>

      {/* === Floating Active Stamp (Foreground right) === */}
      <G transform="translate(98, 48)">
        <Circle cx="12" cy="12" r="12" fill="#ffffff" stroke="#a7f3d0" strokeWidth="1" />
        <Circle cx="12" cy="12" r="9.5" fill="url(#badgeGreen)" />
        <Path d="M8 12 L11 15 L16 9" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </G>

      {/* Decorative stars */}
      <Path d="M125 15 L127 17 L125 19 L123 17 Z" fill="#fbbf24" opacity="0.8" />
      <Circle cx="14" cy="55" r="1.5" fill="#6366f1" opacity="0.3" />
      <Circle cx="138" cy="48" r="2" fill="#34d399" opacity="0.4" />
      <Circle cx="118" cy="92" r="1.8" fill="#fbbf24" opacity="0.5" />
    </Svg>
  );
}
