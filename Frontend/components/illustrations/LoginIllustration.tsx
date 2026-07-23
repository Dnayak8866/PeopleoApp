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

interface LoginIllustrationProps {
  width?: number;
  height?: number;
}

export default function LoginIllustration({
  width = 320,
  height = 240,
}: LoginIllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 320 240">
      <Defs>
        <LinearGradient id="deskGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#6366f1" stopOpacity="0.1" />
          <Stop offset="1" stopColor="#818cf8" stopOpacity="0.05" />
        </LinearGradient>
        <LinearGradient id="screenGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#6366f1" />
          <Stop offset="1" stopColor="#4f46e5" />
        </LinearGradient>
        <LinearGradient id="plantGrad" x1="0" y1="1" x2="0" y2="0">
          <Stop offset="0" stopColor="#22c55e" />
          <Stop offset="1" stopColor="#4ade80" />
        </LinearGradient>
      </Defs>

      {/* Background decorative circles */}
      <Circle cx="50" cy="40" r="60" fill="#6366f1" opacity="0.04" />
      <Circle cx="270" cy="60" r="80" fill="#818cf8" opacity="0.05" />
      <Circle cx="160" cy="200" r="100" fill="#6366f1" opacity="0.03" />

      {/* Floor / ground shadow */}
      <Ellipse cx="160" cy="210" rx="140" ry="12" fill="#6366f1" opacity="0.06" />

      {/* === Desk === */}
      <Rect x="60" y="150" width="200" height="8" rx="4" fill="#6366f1" opacity="0.15" />
      {/* Desk legs */}
      <Rect x="80" y="158" width="4" height="40" rx="2" fill="#6366f1" opacity="0.12" />
      <Rect x="236" y="158" width="4" height="40" rx="2" fill="#6366f1" opacity="0.12" />

      {/* === Monitor (center) === */}
      <G>
        {/* Monitor stand */}
        <Rect x="148" y="140" width="24" height="12" rx="2" fill="#c7d2fe" />
        <Rect x="155" y="130" width="10" height="12" rx="1" fill="#a5b4fc" />
        {/* Monitor body */}
        <Rect x="120" y="82" width="80" height="50" rx="6" fill="#4f46e5" />
        {/* Screen */}
        <Rect x="125" y="87" width="70" height="40" rx="3" fill="url(#screenGrad)" />
        {/* Screen content - chart bars */}
        <Rect x="133" y="108" width="8" height="14" rx="2" fill="#a5b4fc" opacity="0.7" />
        <Rect x="145" y="100" width="8" height="22" rx="2" fill="#818cf8" opacity="0.8" />
        <Rect x="157" y="104" width="8" height="18" rx="2" fill="#a5b4fc" opacity="0.7" />
        <Rect x="169" y="96" width="8" height="26" rx="2" fill="#c7d2fe" opacity="0.9" />
        <Rect x="181" y="102" width="8" height="20" rx="2" fill="#818cf8" opacity="0.8" />
        {/* Screen header dots */}
        <Circle cx="132" cy="93" r="1.5" fill="#f87171" />
        <Circle cx="137" cy="93" r="1.5" fill="#fbbf24" />
        <Circle cx="142" cy="93" r="1.5" fill="#4ade80" />
      </G>

      {/* === Person 1 (Left - sitting) === */}
      <G>
        {/* Chair */}
        <Path d="M70 170 L66 198 M90 170 L94 198" stroke="#c7d2fe" strokeWidth="2.5" />
        <Path d="M60 170 Q80 175 100 170" stroke="#a5b4fc" strokeWidth="3" fill="none" />
        {/* Body */}
        <Path
          d="M80 148 Q80 165 80 168"
          stroke="#6366f1"
          strokeWidth="2"
          fill="none"
        />
        {/* Torso */}
        <Rect x="70" y="128" width="20" height="24" rx="8" fill="#6366f1" />
        {/* Head */}
        <Circle cx="80" cy="118" r="12" fill="#fcd9b6" />
        {/* Hair */}
        <Path
          d="M68 114 Q68 102 80 102 Q92 102 92 114"
          fill="#4338ca"
        />
        {/* Arm reaching to keyboard */}
        <Path
          d="M88 135 Q100 140 108 148"
          stroke="#fcd9b6"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        {/* Left arm */}
        <Path
          d="M72 135 Q65 145 68 150"
          stroke="#fcd9b6"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      </G>

      {/* === Keyboard on desk === */}
      <Rect x="105" y="143" width="30" height="6" rx="2" fill="#e0e7ff" />
      <Rect x="107" y="144.5" width="3" height="3" rx="0.5" fill="#a5b4fc" />
      <Rect x="112" y="144.5" width="3" height="3" rx="0.5" fill="#a5b4fc" />
      <Rect x="117" y="144.5" width="3" height="3" rx="0.5" fill="#a5b4fc" />
      <Rect x="122" y="144.5" width="3" height="3" rx="0.5" fill="#a5b4fc" />
      <Rect x="127" y="144.5" width="3" height="3" rx="0.5" fill="#a5b4fc" />

      {/* === Coffee mug === */}
      <Rect x="140" y="140" width="10" height="10" rx="2" fill="#fbbf24" />
      <Path d="M150 142 Q155 142 155 147 Q155 150 150 150" stroke="#fbbf24" strokeWidth="1.5" fill="none" />
      {/* Steam */}
      <Path d="M143 138 Q144 134 143 130" stroke="#94a3b8" strokeWidth="0.8" fill="none" opacity="0.4" />
      <Path d="M147 137 Q148 133 147 129" stroke="#94a3b8" strokeWidth="0.8" fill="none" opacity="0.3" />

      {/* === Person 2 (Right - standing) === */}
      <G>
        {/* Legs */}
        <Path d="M228 178 L224 208" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
        <Path d="M238 178 L242 208" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
        {/* Shoes */}
        <Ellipse cx="222" cy="209" rx="6" ry="3" fill="#4338ca" />
        <Ellipse cx="244" cy="209" rx="6" ry="3" fill="#4338ca" />
        {/* Body / Torso */}
        <Rect x="222" y="130" width="22" height="50" rx="10" fill="#818cf8" />
        {/* Head */}
        <Circle cx="233" cy="118" r="14" fill="#e8c4a0" />
        {/* Hair */}
        <Path
          d="M219 112 Q219 98 233 98 Q247 98 247 112"
          fill="#92400e"
        />
        {/* Arm holding tablet */}
        <Path
          d="M224 142 Q210 150 205 148"
          stroke="#e8c4a0"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        {/* Tablet */}
        <Rect x="195" y="142" width="14" height="10" rx="2" fill="#4f46e5" />
        <Rect x="197" y="144" width="10" height="6" rx="1" fill="#818cf8" />
        {/* Right arm */}
        <Path
          d="M242 140 Q252 148 250 155"
          stroke="#e8c4a0"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      </G>

      {/* === Plant decoration (far left) === */}
      <G>
        {/* Pot */}
        <Path d="M22 198 L18 180 L38 180 L34 198 Z" fill="#c7d2fe" />
        <Rect x="16" y="176" width="24" height="6" rx="2" fill="#a5b4fc" />
        {/* Leaves */}
        <Path d="M28 176 Q20 160 28 148" stroke="#22c55e" strokeWidth="2" fill="none" />
        <Path d="M28 156 Q18 150 14 140" stroke="#4ade80" strokeWidth="2" fill="none" />
        <Ellipse cx="14" cy="138" rx="5" ry="3" fill="#4ade80" transform="rotate(-30 14 138)" />
        <Path d="M28 162 Q38 155 42 145" stroke="#22c55e" strokeWidth="2" fill="none" />
        <Ellipse cx="43" cy="143" rx="5" ry="3" fill="#22c55e" transform="rotate(30 43 143)" />
        <Path d="M28 168 Q22 158 24 148" stroke="#4ade80" strokeWidth="1.5" fill="none" />
        <Ellipse cx="24" cy="146" rx="4" ry="2.5" fill="#86efac" transform="rotate(-15 24 146)" />
      </G>

      {/* === Floating elements / decorations === */}
      {/* Notification bell */}
      <G opacity="0.6">
        <Circle cx="270" cy="30" r="10" fill="#fef3c7" />
        <Path d="M266 32 Q270 28 274 32 L275 26 Q275 22 270 22 Q265 22 265 26 Z" fill="#fbbf24" />
        <Circle cx="270" cy="33" r="1.5" fill="#f59e0b" />
      </G>

      {/* Chat bubble */}
      <G opacity="0.5">
        <Rect x="36" y="55" width="28" height="18" rx="8" fill="#e0e7ff" />
        <Path d="M48 73 L44 78 L52 73" fill="#e0e7ff" />
        <Circle cx="44" cy="64" r="1.5" fill="#6366f1" />
        <Circle cx="50" cy="64" r="1.5" fill="#6366f1" />
        <Circle cx="56" cy="64" r="1.5" fill="#6366f1" />
      </G>

      {/* Checkmark badge */}
      <G opacity="0.5">
        <Circle cx="290" cy="120" r="10" fill="#dcfce7" />
        <Path d="M285 120 L288 123 L295 116" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </G>

      {/* Small decorative dots */}
      <Circle cx="100" cy="50" r="2" fill="#6366f1" opacity="0.15" />
      <Circle cx="250" cy="90" r="2.5" fill="#818cf8" opacity="0.12" />
      <Circle cx="180" cy="40" r="1.5" fill="#a5b4fc" opacity="0.2" />
      <Circle cx="55" cy="95" r="2" fill="#c7d2fe" opacity="0.2" />
    </Svg>
  );
}
