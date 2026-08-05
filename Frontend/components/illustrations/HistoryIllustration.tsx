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

interface HistoryIllustrationProps {
  width?: number;
  height?: number;
  isDarkMode?: boolean;
}

export default function HistoryIllustration({
  width = 150,
  height = 110,
  isDarkMode = false,
}: HistoryIllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 150 110">
      <Defs>
        <LinearGradient id="historyGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={isDarkMode ? '#818CF8' : '#818cf8'} />
          <Stop offset="1" stopColor={isDarkMode ? '#4F46E5' : '#6366f1'} />
        </LinearGradient>
        <LinearGradient id="successGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#34d399" />
          <Stop offset="1" stopColor="#059669" />
        </LinearGradient>
      </Defs>

      {/* Decorative background circle */}
      <Circle cx="75" cy="55" r="42" fill={isDarkMode ? '#312E81' : '#e0e7ff'} opacity={isDarkMode ? 0.6 : 0.4} />
      <Circle cx="30" cy="35" r="18" fill={isDarkMode ? '#1E293B' : '#e0f2fe'} opacity="0.6" />
      <Circle cx="120" cy="75" r="22" fill={isDarkMode ? '#3730A3' : '#ede9fe'} opacity="0.5" />

      {/* Shadow */}
      <Ellipse cx="75" cy="98" rx="55" ry="5.5" fill={isDarkMode ? '#818CF8' : '#6366f1'} opacity="0.08" />

      {/* === Calendar Board (Background) === */}
      <G transform="translate(30, 20)">
        <Rect x="0" y="0" width="90" height="65" rx="10" fill={isDarkMode ? '#1E293B' : '#ffffff'} stroke={isDarkMode ? '#334155' : '#c7d2fe'} strokeWidth="1.5" />
        <Rect x="0" y="0" width="90" height="15" rx="8" fill="url(#historyGrad)" />
        <Circle cx="15" cy="7.5" r="2" fill="#ffffff" />
        <Circle cx="45" cy="7.5" r="2" fill="#ffffff" />
        <Circle cx="75" cy="7.5" r="2" fill="#ffffff" />

        {/* Calendar Cells / Grid */}
        {/* Row 1 */}
        <Rect x="8" y="24" width="10" height="10" rx="2" fill="#34d399" opacity="0.75" />
        <Rect x="24" y="24" width="10" height="10" rx="2" fill="#6366f1" opacity="0.8" />
        <Rect x="40" y="24" width="10" height="10" rx="2" fill="#f87171" opacity="0.75" />
        <Rect x="56" y="24" width="10" height="10" rx="2" fill="#fbbf24" opacity="0.8" />
        <Rect x="72" y="24" width="10" height="10" rx="2" fill={isDarkMode ? '#334155' : '#e2e8f0'} />

        {/* Row 2 */}
        <Rect x="8" y="38" width="10" height="10" rx="2" fill={isDarkMode ? '#334155' : '#e2e8f0'} />
        <Rect x="24" y="38" width="10" height="10" rx="2" fill="#34d399" opacity="0.75" />
        <Rect x="40" y="38" width="10" height="10" rx="2" fill="#34d399" opacity="0.75" />
        <Rect x="56" y="38" width="10" height="10" rx="2" fill="#6366f1" opacity="0.8" />
        <Rect x="72" y="38" width="10" height="10" rx="2" fill="#f87171" opacity="0.75" />

        {/* Row 3 */}
        <Rect x="8" y="52" width="10" height="10" rx="2" fill="#fbbf24" opacity="0.8" />
        <Rect x="24" y="52" width="10" height="10" rx="2" fill={isDarkMode ? '#334155' : '#e2e8f0'} />
        <Rect x="40" y="52" width="10" height="10" rx="2" fill={isDarkMode ? '#334155' : '#e2e8f0'} />
        <Rect x="56" y="52" width="10" height="10" rx="2" fill="#34d399" opacity="0.75" />
        <Rect x="72" y="52" width="10" height="10" rx="2" fill="#34d399" opacity="0.75" />
      </G>

      {/* === Floating Timetable Success Tag === */}
      <G transform="translate(10, 52)">
        <Circle cx="12" cy="12" r="12" fill={isDarkMode ? '#1E293B' : '#ffffff'} stroke={isDarkMode ? '#065F46' : '#a7f3d0'} strokeWidth="1" />
        <Circle cx="12" cy="12" r="9.5" fill="url(#successGrad)" />
        {/* Checkmark */}
        <Path d="M8 12 L11 15 L16 9" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </G>

      {/* Decorative stars */}
      <Path d="M125 15 L127 17 L125 19 L123 17 Z" fill="#fbbf24" opacity="0.8" />
      <Circle cx="12" cy="30" r="1.5" fill={isDarkMode ? '#818CF8' : '#6366f1'} opacity="0.3" />
      <Circle cx="138" cy="45" r="2" fill="#34d399" opacity="0.4" />
      <Circle cx="118" cy="92" r="1.8" fill="#a5b4fc" opacity="0.5" />
    </Svg>
  );
}
