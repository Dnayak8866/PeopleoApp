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

interface ResetPasswordIllustrationProps {
  width?: number;
  height?: number;
}

export default function ResetPasswordIllustration({
  width = 150,
  height = 110,
}: ResetPasswordIllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 150 110">
      <Defs>
        <LinearGradient id="lockGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#a855f7" />
          <Stop offset="1" stopColor="#6366f1" />
        </LinearGradient>
        <LinearGradient id="keyGrad" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#fbbf24" />
          <Stop offset="1" stopColor="#f59e0b" />
        </LinearGradient>
      </Defs>

      {/* Decorative background circles */}
      <Circle cx="75" cy="55" r="42" fill="#ede9fe" opacity="0.4" />
      <Circle cx="30" cy="30" r="18" fill="#e0f2fe" opacity="0.6" />
      <Circle cx="120" cy="70" r="22" fill="#f5f3ff" opacity="0.5" />

      {/* Shadow */}
      <Ellipse cx="75" cy="98" rx="55" ry="5.5" fill="#6366f1" opacity="0.08" />

      {/* === Lock Shield (Center Background) === */}
      <G transform="translate(45, 18)">
        {/* Shield outline */}
        <Path
          d="M30 0 L60 10 L60 35 C60 50, 30 60, 30 60 C30 60, 0 50, 0 35 L0 10 Z"
          fill="#ffffff"
          stroke="#c7d2fe"
          strokeWidth="1.5"
        />
        {/* Inner Lock shape */}
        <Rect x="18" y="24" width="24" height="18" rx="4" fill="url(#lockGrad)" />
        <Path
          d="M23 24 L23 18 C23 14, 37 14, 37 18 L37 24"
          stroke="url(#lockGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <Circle cx="30" cy="31" r="2" fill="#ffffff" />
        <Path d="M30 33 L30 38" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
      </G>

      {/* === Floating Golden Key (Foreground right) === */}
      <G transform="translate(80, 44)" rotate="-15">
        <Circle cx="10" cy="10" r="8" fill="none" stroke="url(#keyGrad)" strokeWidth="3" />
        <Path d="M18 10 L36 10 L36 16 L32 16 L32 10 L28 10 L28 16 L24 16 L24 10 L18 10" stroke="url(#keyGrad)" strokeWidth="3" strokeLinejoin="round" fill="none" />
      </G>

      {/* Decorative stars */}
      <Path d="M125 15 L127 17 L125 19 L123 17 Z" fill="#fbbf24" opacity="0.8" />
      <Circle cx="14" cy="55" r="1.5" fill="#6366f1" opacity="0.3" />
      <Circle cx="138" cy="48" r="2" fill="#34d399" opacity="0.4" />
      <Circle cx="20" cy="85" r="1.8" fill="#fbbf24" opacity="0.5" />
    </Svg>
  );
}
