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

interface NotificationIllustrationProps {
  width?: number;
  height?: number;
}

export default function NotificationIllustration({
  width = 150,
  height = 110,
}: NotificationIllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 150 110">
      <Defs>
        <LinearGradient id="bellGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#fbbf24" />
          <Stop offset="1" stopColor="#d97706" />
        </LinearGradient>
        <LinearGradient id="stripeGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#818cf8" />
          <Stop offset="1" stopColor="#6366f1" />
        </LinearGradient>
      </Defs>

      {/* Decorative background circles */}
      <Circle cx="75" cy="55" r="42" fill="#e0e7ff" opacity="0.4" />
      <Circle cx="30" cy="30" r="18" fill="#e0f2fe" opacity="0.6" />
      <Circle cx="120" cy="70" r="22" fill="#f5f3ff" opacity="0.5" />

      {/* Shadow */}
      <Ellipse cx="75" cy="98" rx="55" ry="5.5" fill="#6366f1" opacity="0.08" />

      {/* === Floating Envelope / Card (Background) === */}
      <G transform="translate(30, 20)">
        <Rect x="0" y="0" width="70" height="46" rx="6" fill="#ffffff" stroke="#c7d2fe" strokeWidth="1.5" />
        <Rect x="0" y="0" width="70" height="6" rx="3" fill="url(#stripeGrad)" />
        {/* Mock Notification Details */}
        <Circle cx="12" cy="22" r="4" fill="#a5b4fc" />
        <Rect x="22" y="19" width="36" height="3" rx="1.5" fill="#e2e8f0" />
        <Rect x="22" y="26" width="24" height="3" rx="1.5" fill="#e2e8f0" />
      </G>

      {/* === Standing Golden Bell (Foreground right) === */}
      <G transform="translate(85, 30)">
        {/* Bell cap */}
        <Circle cx="16" cy="10" r="4" fill="#d97706" />
        {/* Bell body */}
        <Path d="M8 28 C8 20, 24 20, 24 28 Z" fill="url(#bellGrad)" />
        <Rect x="4" y="28" width="24" height="4" rx="2" fill="#f59e0b" />
        {/* Clapper */}
        <Circle cx="16" cy="34" r="3.5" fill="#d97706" />
        {/* Sound ring waves */}
        <Path d="M30 18 Q34 22 30 26" stroke="#fbbf24" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      </G>

      {/* Decorative stars */}
      <Path d="M125 15 L127 17 L125 19 L123 17 Z" fill="#fbbf24" opacity="0.8" />
      <Circle cx="14" cy="55" r="1.5" fill="#6366f1" opacity="0.3" />
      <Circle cx="138" cy="48" r="2" fill="#34d399" opacity="0.4" />
      <Circle cx="118" cy="92" r="1.8" fill="#fbbf24" opacity="0.5" />
    </Svg>
  );
}
