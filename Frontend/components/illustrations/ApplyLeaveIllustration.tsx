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

interface ApplyLeaveIllustrationProps {
  width?: number;
  height?: number;
}

export default function ApplyLeaveIllustration({
  width = 150,
  height = 110,
}: ApplyLeaveIllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 150 110">
      <Defs>
        <LinearGradient id="gradientPrimary" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#818cf8" />
          <Stop offset="1" stopColor="#6366f1" />
        </LinearGradient>
        <LinearGradient id="gradientSuccess" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#34d399" />
          <Stop offset="1" stopColor="#059669" />
        </LinearGradient>
      </Defs>

      {/* Background clouds / bubbles */}
      <Circle cx="75" cy="55" r="42" fill="#e0e7ff" opacity="0.4" />
      <Circle cx="35" cy="40" r="18" fill="#dbeafe" opacity="0.6" />
      <Circle cx="120" cy="70" r="22" fill="#f5f3ff" opacity="0.5" />

      {/* Shadow */}
      <Ellipse cx="75" cy="98" rx="55" ry="5.5" fill="#6366f1" opacity="0.08" />

      {/* === Checklist Document Card (Background-center) === */}
      <G transform="translate(42, 22)">
        <Rect x="0" y="0" width="56" height="66" rx="8" fill="#ffffff" stroke="#c7d2fe" strokeWidth="1.5" />
        <Rect x="0" y="0" width="56" height="12" rx="6" fill="url(#gradientPrimary)" />
        <Circle cx="10" cy="6" r="1.5" fill="#ffffff" />
        <Circle cx="28" cy="6" r="1.5" fill="#ffffff" />
        <Circle cx="46" cy="6" r="1.5" fill="#ffffff" />

        {/* Form lines / Checkboxes */}
        {/* Item 1 */}
        <Rect x="8" y="22" width="6" height="6" rx="1.5" fill="#e2e8f0" />
        <Rect x="20" y="24" width="28" height="3" rx="1.5" fill="#cbd5e1" />
        
        {/* Item 2 */}
        <Rect x="8" y="36" width="6" height="6" rx="1.5" fill="#e2e8f0" />
        <Rect x="20" y="38" width="22" height="3" rx="1.5" fill="#cbd5e1" />

        {/* Item 3 */}
        <Rect x="8" y="50" width="6" height="6" rx="1.5" fill="#e2e8f0" />
        <Rect x="20" y="52" width="25" height="3" rx="1.5" fill="#cbd5e1" />
      </G>

      {/* === Pen / Writing tool (Foreground right) === */}
      <G transform="translate(85, 45)" rotate="30">
        <Rect x="0" y="0" width="6" height="36" rx="2" fill="#a5b4fc" />
        {/* Nib */}
        <Path d="M0 32 L3 38 L6 32 Z" fill="#6366f1" />
        {/* Clip */}
        <Rect x="-2" y="6" width="2" height="14" rx="0.5" fill="#818cf8" />
      </G>

      {/* === Floating Done Badge (representing submission success) === */}
      <G transform="translate(18, 48)">
        <Circle cx="12" cy="12" r="12" fill="#ffffff" stroke="#a7f3d0" strokeWidth="1" />
        <Circle cx="12" cy="12" r="9.5" fill="url(#gradientSuccess)" />
        {/* Checkmark */}
        <Path d="M8 12 L11 15 L16 9" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </G>

      {/* Decorative stars */}
      <Path d="M125 15 L127 17 L125 19 L123 17 Z" fill="#fbbf24" opacity="0.8" />
      <Circle cx="14" cy="22" r="1.5" fill="#6366f1" opacity="0.3" />
      <Circle cx="138" cy="48" r="2" fill="#34d399" opacity="0.4" />
      <Circle cx="118" cy="92" r="1.8" fill="#fbbf24" opacity="0.5" />
    </Svg>
  );
}
