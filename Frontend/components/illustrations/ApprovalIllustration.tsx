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

interface ApprovalIllustrationProps {
  width?: number;
  height?: number;
}

export default function ApprovalIllustration({
  width = 150,
  height = 110,
}: ApprovalIllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 150 110">
      <Defs>
        <LinearGradient id="approveGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#34d399" />
          <Stop offset="1" stopColor="#059669" />
        </LinearGradient>
        <LinearGradient id="refuseGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#f87171" />
          <Stop offset="1" stopColor="#ef4444" />
        </LinearGradient>
        <LinearGradient id="cardGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#818cf8" />
          <Stop offset="1" stopColor="#6366f1" />
        </LinearGradient>
      </Defs>

      {/* Decorative background circles */}
      <Circle cx="75" cy="55" r="42" fill="#ede9fe" opacity="0.4" />
      <Circle cx="30" cy="30" r="18" fill="#e0f2fe" opacity="0.6" />
      <Circle cx="120" cy="70" r="22" fill="#f5f3ff" opacity="0.5" />

      {/* Shadow */}
      <Ellipse cx="75" cy="98" rx="55" ry="5.5" fill="#6366f1" opacity="0.08" />

      {/* === Leave Folder Document Card (Center) === */}
      <G transform="translate(38, 18)">
        <Rect x="0" y="0" width="64" height="52" rx="8" fill="#ffffff" stroke="#c7d2fe" strokeWidth="1.5" />
        <Rect x="0" y="0" width="64" height="8" rx="4" fill="url(#cardGrad)" />
        
        {/* Mock Employee initials avatar inside card */}
        <Circle cx="16" cy="24" r="7" fill="#e0e7ff" />
        <Path d="M11 31 C11 27, 21 27, 21 31 Z" fill="#6366f1" opacity="0.8" />
        
        {/* Mock document texts */}
        <Rect x="28" y="19" width="28" height="3" rx="1.5" fill="#cbd5e1" />
        <Rect x="28" y="26" width="20" height="3" rx="1.5" fill="#cbd5e1" />

        {/* Status indicator badge */}
        <Rect x="12" y="38" width="40" height="6" rx="3" fill="#fef3c7" />
        <Circle cx="16" cy="41" r="2" fill="#f59e0b" />
      </G>

      {/* === Floating Approve Tag (Foreground left) === */}
      <G transform="translate(18, 44)">
        <Circle cx="12" cy="12" r="12" fill="#ffffff" stroke="#a7f3d0" strokeWidth="1" />
        <Circle cx="12" cy="12" r="9.5" fill="url(#approveGrad)" />
        <Path d="M8 12 L11 15 L16 9" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </G>

      {/* === Floating Reject Tag (Foreground right) === */}
      <G transform="translate(98, 48)">
        <Circle cx="12" cy="12" r="12" fill="#ffffff" stroke="#fca5a5" strokeWidth="1" />
        <Circle cx="12" cy="12" r="9.5" fill="url(#refuseGrad)" />
        <Path d="M8 8 L16 16 M16 8 L8 16" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </G>

      {/* Decorative stars */}
      <Path d="M125 15 L127 17 L125 19 L123 17 Z" fill="#fbbf24" opacity="0.8" />
      <Circle cx="14" cy="55" r="1.5" fill="#6366f1" opacity="0.3" />
      <Circle cx="138" cy="48" r="2" fill="#34d399" opacity="0.4" />
      <Circle cx="118" cy="92" r="1.8" fill="#fbbf24" opacity="0.5" />
    </Svg>
  );
}
