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

interface AttendanceIllustrationProps {
  width?: number;
  height?: number;
}

export default function AttendanceIllustration({
  width = 150,
  height = 110,
}: AttendanceIllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 150 110">
      <Defs>
        <LinearGradient id="clockGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#818cf8" />
          <Stop offset="1" stopColor="#6366f1" />
        </LinearGradient>
        <LinearGradient id="calendarGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#fbbf24" />
          <Stop offset="1" stopColor="#f59e0b" />
        </LinearGradient>
        <LinearGradient id="checkGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#34d399" />
          <Stop offset="1" stopColor="#059669" />
        </LinearGradient>
      </Defs>

      {/* Background circles */}
      <Circle cx="75" cy="55" r="42" fill="#e0e7ff" opacity="0.4" />
      <Circle cx="35" cy="35" r="22" fill="#dbeafe" opacity="0.6" />
      <Circle cx="115" cy="75" r="18" fill="#f5f3ff" opacity="0.5" />

      {/* Shadow */}
      <Ellipse cx="75" cy="98" rx="50" ry="5" fill="#6366f1" opacity="0.08" />

      {/* === Calendar (background-left) === */}
      <G transform="translate(25, 30)" opacity="0.85">
        <Rect x="0" y="0" width="32" height="34" rx="6" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
        <Rect x="0" y="0" width="32" height="10" rx="4" fill="url(#calendarGrad)" />
        <Circle cx="8" cy="5" r="1.5" fill="#ffffff" />
        <Circle cx="16" cy="5" r="1.5" fill="#ffffff" />
        <Circle cx="24" cy="5" r="1.5" fill="#ffffff" />
        {/* Calendar lines */}
        <Rect x="6" y="16" width="6" height="4" rx="1.5" fill="#e2e8f0" />
        <Rect x="18" y="16" width="8" height="4" rx="1.5" fill="#e2e8f0" />
        <Rect x="6" y="24" width="8" height="4" rx="1.5" fill="#e2e8f0" />
        <Rect x="20" y="24" width="6" height="4" rx="1.5" fill="#e2e8f0" />
      </G>

      {/* === Clock (Foreground-center) === */}
      <G transform="translate(58, 20)">
        <Circle cx="26" cy="26" r="25" fill="#ffffff" stroke="#c7d2fe" strokeWidth="1.5" />
        <Circle cx="26" cy="26" r="21" fill="url(#clockGrad)" />
        
        {/* Clock lines/hands */}
        <Path d="M26 12 L26 26 L36 26" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <Circle cx="26" cy="26" r="2" fill="#ffffff" />

        {/* Small tick marks */}
        <Rect x="25.5" y="7" width="1" height="2.5" fill="#ffffff" opacity="0.5" />
        <Rect x="25.5" y="42.5" width="1" height="2.5" fill="#ffffff" opacity="0.5" />
        <Rect x="7" y="25.5" width="2.5" height="1" fill="#ffffff" opacity="0.5" />
        <Rect x="42.5" y="25.5" width="2.5" height="1" fill="#ffffff" opacity="0.5" />
      </G>

      {/* === Present/Check-in Badge (foreground-right) === */}
      <G transform="translate(92, 48)">
        <Circle cx="14" cy="14" r="14" fill="#ffffff" stroke="#a7f3d0" strokeWidth="1" />
        <Circle cx="14" cy="14" r="11" fill="url(#checkGrad)" />
        <Path d="M9 14 L12 17 L19 10" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </G>

      {/* Coffee cup or small desk detail */}
      <G transform="translate(18, 76)" opacity="0.8">
        <Rect x="0" y="0" width="10" height="12" rx="2" fill="#f87171" />
        <Path d="M10 2 Q13 2 13 5 Q13 8 10 8" stroke="#f87171" strokeWidth="1.5" fill="none" />
        <Path d="M3 -3 Q4 -6 3 -9 M7 -3 Q8 -6 7 -9" stroke="#94a3b8" strokeWidth="0.8" fill="none" opacity="0.5" />
      </G>

      {/* Decorative stars / ticks */}
      <Path d="M105 15 L108 18 L105 21 L102 18 Z" fill="#fbbf24" opacity="0.7" />
      <Circle cx="16" cy="22" r="1.5" fill="#6366f1" opacity="0.3" />
      <Circle cx="132" cy="38" r="2" fill="#34d399" opacity="0.4" />
      <Circle cx="50" cy="85" r="1.8" fill="#a5b4fc" opacity="0.5" />
    </Svg>
  );
}
