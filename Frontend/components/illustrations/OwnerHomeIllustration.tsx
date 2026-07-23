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

interface OwnerHomeIllustrationProps {
  width?: number;
  height?: number;
}

export default function OwnerHomeIllustration({
  width = 160,
  height = 120,
}: OwnerHomeIllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 160 120">
      <Defs>
        <LinearGradient id="gradientPrimary" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#6366f1" />
          <Stop offset="1" stopColor="#4f46e5" />
        </LinearGradient>
        <LinearGradient id="gradientSuccess" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#34d399" />
          <Stop offset="1" stopColor="#059669" />
        </LinearGradient>
        <LinearGradient id="gradientWarning" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#fbbf24" />
          <Stop offset="1" stopColor="#d97706" />
        </LinearGradient>
        <LinearGradient id="gradientDanger" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#f87171" />
          <Stop offset="1" stopColor="#dc2626" />
        </LinearGradient>
      </Defs>

      {/* Decorative background circle */}
      <Circle cx="80" cy="60" r="45" fill="#e0e7ff" opacity="0.4" />
      <Circle cx="30" cy="80" r="20" fill="#ede9fe" opacity="0.5" />
      <Circle cx="130" cy="30" r="25" fill="#f5f3ff" opacity="0.6" />

      {/* Shadow under characters and charts */}
      <Ellipse cx="80" cy="108" rx="60" ry="6" fill="#6366f1" opacity="0.08" />

      {/* === Floating Miniature Charts (representing attendance stats) === */}
      {/* Mini Bar 1 (Present - Green) */}
      <G transform="translate(15, 30)">
        <Rect x="0" y="20" width="8" height="40" rx="4" fill="url(#gradientSuccess)" />
        <Circle cx="4" cy="14" r="2" fill="#34d399" />
      </G>

      {/* Mini Bar 2 (Late - Orange/Yellow) */}
      <G transform="translate(30, 30)">
        <Rect x="0" y="35" width="8" height="25" rx="4" fill="url(#gradientWarning)" />
        <Circle cx="4" cy="29" r="2" fill="#fbbf24" />
      </G>

      {/* Mini Bar 3 (On Leave - Indigo) */}
      <G transform="translate(115, 30)">
        <Rect x="0" y="28" width="8" height="32" rx="4" fill="url(#gradientPrimary)" />
        <Circle cx="4" cy="22" r="2" fill="#6366f1" />
      </G>

      {/* Mini Bar 4 (Absent - Red) */}
      <G transform="translate(130, 30)">
        <Rect x="0" y="42" width="8" height="18" rx="4" fill="url(#gradientDanger)" />
        <Circle cx="4" cy="36" r="2" fill="#f87171" />
      </G>

      {/* Connecting dotted dashboard lines */}
      <Path
        d="M20 50 Q50 35 80 50 T140 50"
        stroke="#a5b4fc"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="3,3"
        fill="none"
        opacity="0.6"
      />

      {/* === Center Figure (Owner/Manager looking at dashboard) === */}
      <G transform="translate(55, 35)">
        {/* Torso */}
        <Path d="M12 40 L38 40 L34 72 L16 72 Z" fill="#6366f1" />
        <Rect x="15" y="40" width="20" height="26" rx="6" fill="#818cf8" />
        
        {/* Tie */}
        <Path d="M24 40 L22 55 L25 58 L28 55 Z" fill="#fbbf24" />

        {/* Head */}
        <Circle cx="25" cy="26" r="11" fill="#fcd9b6" />
        
        {/* Hair */}
        <Path d="M14 24 Q14 14 25 14 Q36 14 36 24" fill="#312e81" />

        {/* Hands / Arms */}
        {/* Left Arm holding magnifying glass or tablet */}
        <Path
          d="M16 48 C6 50 2 62 10 65"
          stroke="#fcd9b6"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        {/* Right Arm pointing to chart */}
        <Path
          d="M34 48 C44 46 48 38 46 30"
          stroke="#fcd9b6"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Decorative shadow inside character */}
        <Path d="M22 66 L28 66 L26 72 L24 72 Z" fill="#4338ca" opacity="0.3" />
      </G>

      {/* Target/Goal icon (near manager's hand) */}
      <G transform="translate(100, 55)" opacity="0.85">
        <Circle cx="8" cy="8" r="8" fill="#dcfce7" />
        <Circle cx="8" cy="8" r="5" fill="#34d399" />
        <Circle cx="8" cy="8" r="2.5" fill="#ffffff" />
      </G>

      {/* Plus badge (representing recruitment or management) */}
      <G transform="translate(42, 82)">
        <Circle cx="7" cy="7" r="7" fill="#e0e7ff" />
        <Path d="M7 4 L7 10 M4 7 L10 7" stroke="#6366f1" strokeWidth="1.8" strokeLinecap="round" />
      </G>
    </Svg>
  );
}
