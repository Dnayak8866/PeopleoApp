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

interface ReportIllustrationProps {
  width?: number;
  height?: number;
  isDarkMode?: boolean;
}

export default function ReportIllustration({
  width = 150,
  height = 110,
  isDarkMode = false,
}: ReportIllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 150 110">
      <Defs>
        <LinearGradient id="gradientLine" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor={isDarkMode ? '#818CF8' : '#6366f1'} />
          <Stop offset="1" stopColor={isDarkMode ? '#A5B4FC' : '#818cf8'} />
        </LinearGradient>
        <LinearGradient id="gradientBar1" x1="0" y1="1" x2="0" y2="0">
          <Stop offset="0" stopColor="#a855f7" />
          <Stop offset="1" stopColor="#c084fc" />
        </LinearGradient>
        <LinearGradient id="gradientBar2" x1="0" y1="1" x2="0" y2="0">
          <Stop offset="0" stopColor="#6366f1" />
          <Stop offset="1" stopColor="#818cf8" />
        </LinearGradient>
        <LinearGradient id="gradientBar3" x1="0" y1="1" x2="0" y2="0">
          <Stop offset="0" stopColor="#06b6d4" />
          <Stop offset="1" stopColor="#22d3ee" />
        </LinearGradient>
      </Defs>

      {/* Background decoration */}
      <Circle cx="75" cy="55" r="42" fill={isDarkMode ? '#312E81' : '#ede9fe'} opacity={isDarkMode ? 0.6 : 0.4} />
      <Circle cx="30" cy="40" r="22" fill={isDarkMode ? '#1E293B' : '#e0f2fe'} opacity="0.5" />
      <Circle cx="120" cy="70" r="20" fill={isDarkMode ? '#3730A3' : '#f3e8ff'} opacity="0.6" />

      {/* Shadow */}
      <Ellipse cx="75" cy="98" rx="55" ry="5" fill={isDarkMode ? '#818CF8' : '#6366f1'} opacity="0.08" />

      {/* Grid structure (underneath charts) */}
      <Path
        d="M25 85 L125 85 M25 65 L125 65 M25 45 L125 45"
        stroke={isDarkMode ? '#334155' : '#e2e8f0'}
        strokeWidth="1"
        opacity="0.8"
      />

      {/* === Bar Charts (Background) === */}
      <G opacity="0.85">
        {/* Bar 1 */}
        <Rect x="30" y="50" width="12" height="35" rx="3" fill="url(#gradientBar1)" />
        {/* Bar 2 */}
        <Rect x="48" y="32" width="12" height="53" rx="3" fill="url(#gradientBar2)" />
        {/* Bar 3 */}
        <Rect x="66" y="44" width="12" height="41" rx="3" fill="url(#gradientBar3)" />
      </G>

      {/* === Line Chart (Foreground - Growth Curve) === */}
      <Path
        d="M25 78 L45 62 L65 48 L85 54 L105 28 L125 36"
        stroke="url(#gradientLine)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Data dots on growth curve */}
      <Circle cx="25" cy="78" r="4" fill={isDarkMode ? '#1E293B' : '#ffffff'} stroke="#6366f1" strokeWidth="2" />
      <Circle cx="45" cy="62" r="4" fill={isDarkMode ? '#1E293B' : '#ffffff'} stroke="#6366f1" strokeWidth="2" />
      <Circle cx="65" cy="48" r="4" fill={isDarkMode ? '#1E293B' : '#ffffff'} stroke="#6366f1" strokeWidth="2" />
      <Circle cx="85" cy="54" r="4" fill={isDarkMode ? '#1E293B' : '#ffffff'} stroke="#6366f1" strokeWidth="2" />
      <Circle cx="105" cy="28" r="4" fill={isDarkMode ? '#1E293B' : '#ffffff'} stroke="#6366f1" strokeWidth="2" />
      <Circle cx="125" cy="36" r="4" fill={isDarkMode ? '#1E293B' : '#ffffff'} stroke="#6366f1" strokeWidth="2" />

      {/* === Magnifying Glass / Insight tool === */}
      <G transform="translate(90, 48)">
        <Circle cx="12" cy="12" r="8" fill={isDarkMode ? '#1E293B' : '#ffffff'} stroke="#6366f1" strokeWidth="2" />
        <Path d="M18 18 L24 24" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />
        <Circle cx="10" cy="10" r="3" fill="#818cf8" opacity="0.3" />
      </G>

      {/* Decorative stars */}
      <Path d="M22 18 L24 20 L22 22 L20 20 Z" fill="#fbbf24" opacity="0.8" />
      <Path d="M132 60 L134 62 L132 64 L130 62 Z" fill="#fbbf24" opacity="0.8" />
      <Circle cx="130" cy="22" r="1.5" fill={isDarkMode ? '#818CF8' : '#6366f1'} opacity="0.3" />
      <Circle cx="10" cy="50" r="2" fill="#34d399" opacity="0.4" />
    </Svg>
  );
}
