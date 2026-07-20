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

interface SplashIllustrationProps {
  width?: number;
  height?: number;
}

export default function SplashIllustration({
  width = 240,
  height = 180,
}: SplashIllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 240 180">
      <Defs>
        <LinearGradient id="coreGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#818cf8" />
          <Stop offset="1" stopColor="#6366f1" />
        </LinearGradient>
        <LinearGradient id="accentGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#a78bfa" />
          <Stop offset="1" stopColor="#8b5cf6" />
        </LinearGradient>
        <LinearGradient id="glowGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#34d399" />
          <Stop offset="1" stopColor="#059669" />
        </LinearGradient>
      </Defs>

      {/* Background Soft Glows */}
      <Circle cx="120" cy="90" r="70" fill="#e0e7ff" opacity="0.15" />
      <Circle cx="70" cy="50" r="40" fill="#ede9fe" opacity="0.2" />
      <Circle cx="170" cy="120" r="35" fill="#e0f2fe" opacity="0.2" />

      {/* Main Base Shadow */}
      <Ellipse cx="120" cy="155" rx="90" ry="8" fill="#6366f1" opacity="0.06" />

      {/* === Central Connected Dashboard Board === */}
      <G transform="translate(60, 30)">
        {/* Main Tablet Board */}
        <Rect x="0" y="0" width="120" height="90" rx="12" fill="#ffffff" stroke="#c7d2fe" strokeWidth="2" />
        {/* Top Header stripe */}
        <Rect x="0" y="0" width="120" height="12" rx="6" fill="url(#coreGrad)" />
        <Circle cx="12" cy="6" r="3" fill="#ffffff" opacity="0.8" />
        <Circle cx="20" cy="6" r="2.2" fill="#ffffff" opacity="0.6" />

        {/* Dashboard Grid Lines (Mock interface elements) */}
        <Rect x="10" y="22" width="46" height="30" rx="4" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <Circle cx="22" cy="37" r="6" fill="url(#accentGrad)" />
        <Rect x="32" y="32" width="18" height="3" rx="1.5" fill="#cbd5e1" />
        <Rect x="32" y="38" width="12" height="3" rx="1.5" fill="#cbd5e1" />

        <Rect x="64" y="22" width="46" height="30" rx="4" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <Path d="M70 44 L78 32 L86 38 L98 26" stroke="#34d399" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <Circle cx="98" cy="26" r="2" fill="#34d399" />

        {/* Bottom Details */}
        <Rect x="10" y="62" width="100" height="6" rx="3" fill="#f1f5f9" />
        <Rect x="10" y="74" width="70" height="6" rx="3" fill="#f1f5f9" />
      </G>

      {/* === Floating Success Badge (Foreground right) === */}
      <G transform="translate(164, 96)">
        <Circle cx="16" cy="16" r="16" fill="#ffffff" stroke="#a7f3d0" strokeWidth="1.5" />
        <Circle cx="16" cy="16" r="13" fill="url(#glowGrad)" />
        <Path d="M11 16 L14 19 L21 12" stroke="#ffffff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </G>

      {/* === Floating Clock Indicator (Foreground left) === */}
      <G transform="translate(28, 70)">
        <Circle cx="18" cy="18" r="18" fill="#ffffff" stroke="#ddd6fe" strokeWidth="1.5" />
        <Circle cx="18" cy="18" r="14" fill="#f5f3ff" />
        {/* Clock Hands */}
        <Circle cx="18" cy="18" r="2" fill="#8b5cf6" />
        <Path d="M18 10 L18 18 L24 18" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </G>

      {/* Floating Sparkles & Dots */}
      <Path d="M210 30 L212 32 L210 34 L208 32 Z" fill="#fbbf24" opacity="0.8" />
      <Path d="M36 142 L38 144 L36 146 L34 144 Z" fill="#fbbf24" opacity="0.8" />
      <Circle cx="220" cy="74" r="2" fill="#818cf8" opacity="0.5" />
      <Circle cx="44" cy="24" r="3" fill="#34d399" opacity="0.4" />
      <Circle cx="132" cy="144" r="2" fill="#cbd5e1" />
    </Svg>
  );
}
