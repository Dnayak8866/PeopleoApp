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

interface LoaderIllustrationProps {
  width?: number;
  height?: number;
}

export default function LoaderIllustration({
  width = 280,
  height = 220,
}: LoaderIllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 280 220">
      <Defs>
        <LinearGradient id="loaderScreenGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#6366f1" />
          <Stop offset="1" stopColor="#4f46e5" />
        </LinearGradient>
        <LinearGradient id="loaderShieldGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#818cf8" />
          <Stop offset="1" stopColor="#6366f1" />
        </LinearGradient>
        <LinearGradient id="loaderGearGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#a5b4fc" />
          <Stop offset="1" stopColor="#818cf8" />
        </LinearGradient>
      </Defs>

      {/* Background decorative circles */}
      <Circle cx="40" cy="50" r="50" fill="#6366f1" opacity="0.04" />
      <Circle cx="240" cy="40" r="65" fill="#818cf8" opacity="0.05" />
      <Circle cx="140" cy="180" r="80" fill="#6366f1" opacity="0.03" />

      {/* Ground shadow */}
      <Ellipse cx="140" cy="200" rx="110" ry="10" fill="#6366f1" opacity="0.06" />

      {/* === Central Server/Cloud Setup === */}
      <G>
        {/* Server rack base */}
        <Rect x="105" y="120" width="70" height="70" rx="10" fill="#e0e7ff" />
        <Rect x="110" y="125" width="60" height="60" rx="7" fill="#FFFFFF" />

        {/* Server rows */}
        <Rect x="118" y="132" width="44" height="10" rx="3" fill="url(#loaderScreenGrad)" />
        <Circle cx="152" cy="137" r="2.5" fill="#4ade80" />
        <Circle cx="157" cy="137" r="2" fill="#fbbf24" />
        <Rect x="120" y="134" width="16" height="2" rx="1" fill="#a5b4fc" opacity="0.6" />
        <Rect x="120" y="137.5" width="10" height="1.5" rx="0.75" fill="#a5b4fc" opacity="0.4" />

        <Rect x="118" y="148" width="44" height="10" rx="3" fill="url(#loaderScreenGrad)" />
        <Circle cx="152" cy="153" r="2.5" fill="#4ade80" />
        <Circle cx="157" cy="153" r="2" fill="#4ade80" />
        <Rect x="120" y="150" width="20" height="2" rx="1" fill="#a5b4fc" opacity="0.6" />
        <Rect x="120" y="153.5" width="12" height="1.5" rx="0.75" fill="#a5b4fc" opacity="0.4" />

        <Rect x="118" y="164" width="44" height="10" rx="3" fill="#eef2ff" />
        <Circle cx="152" cy="169" r="2.5" fill="#94a3b8" opacity="0.4" />
        <Circle cx="157" cy="169" r="2" fill="#94a3b8" opacity="0.3" />
        <Rect x="120" y="166" width="14" height="2" rx="1" fill="#c7d2fe" opacity="0.5" />
        <Rect x="120" y="169.5" width="8" height="1.5" rx="0.75" fill="#c7d2fe" opacity="0.3" />
      </G>

      {/* === Shield / Security Icon (top center) === */}
      <G>
        <Path
          d="M140 40 L155 48 L155 65 Q155 78 140 85 Q125 78 125 65 L125 48 Z"
          fill="url(#loaderShieldGrad)"
        />
        <Path
          d="M140 46 L150 52 L150 64 Q150 73 140 78 Q130 73 130 64 L130 52 Z"
          fill="#FFFFFF"
          opacity="0.25"
        />
        {/* Checkmark inside shield */}
        <Path
          d="M134 62 L138 66 L147 56"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </G>

      {/* === Data flow lines from shield to server === */}
      <Path
        d="M140 85 L140 118"
        stroke="#a5b4fc"
        strokeWidth="1.5"
        strokeDasharray="4,3"
        opacity="0.6"
      />
      <Circle cx="140" cy="95" r="2" fill="#6366f1" opacity="0.5" />
      <Circle cx="140" cy="105" r="2" fill="#818cf8" opacity="0.4" />

      {/* === Left Person (syncing data) === */}
      <G>
        {/* Body */}
        <Rect x="38" y="130" width="18" height="30" rx="8" fill="#6366f1" />
        {/* Head */}
        <Circle cx="47" cy="120" r="11" fill="#fcd9b6" />
        {/* Hair */}
        <Path d="M36 116 Q36 106 47 106 Q58 106 58 116" fill="#4338ca" />
        {/* Legs */}
        <Path d="M43 160 L41 195" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
        <Path d="M52 160 L54 195" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
        {/* Shoes */}
        <Ellipse cx="40" cy="196" rx="5" ry="2.5" fill="#4338ca" />
        <Ellipse cx="55" cy="196" rx="5" ry="2.5" fill="#4338ca" />
        {/* Arm holding phone */}
        <Path d="M56 138 Q68 142 72 138" stroke="#fcd9b6" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Phone */}
        <Rect x="69" y="128" width="11" height="16" rx="2.5" fill="#1e293b" />
        <Rect x="70.5" y="130" width="8" height="11" rx="1.5" fill="#818cf8" />
        {/* Phone sync icon */}
        <Path d="M73 134 Q76 132 78 134" stroke="#FFFFFF" strokeWidth="1" fill="none" />
        {/* Left arm */}
        <Path d="M40 138 Q30 148 32 155" stroke="#fcd9b6" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Data flow from person to server */}
        <Path d="M80 136 Q92 130 105 140" stroke="#a5b4fc" strokeWidth="1" strokeDasharray="3,3" opacity="0.5" />
      </G>

      {/* === Right Person (at laptop) === */}
      <G>
        {/* Chair */}
        <Path d="M218 168 L215 198" stroke="#c7d2fe" strokeWidth="2" strokeLinecap="round" />
        <Path d="M248 168 L251 198" stroke="#c7d2fe" strokeWidth="2" strokeLinecap="round" />
        <Path d="M213 168 Q233 172 253 168" stroke="#a5b4fc" strokeWidth="2.5" fill="none" />

        {/* Body */}
        <Rect x="224" y="128" width="18" height="28" rx="8" fill="#818cf8" />
        {/* Head */}
        <Circle cx="233" cy="117" r="12" fill="#e8c4a0" />
        {/* Hair */}
        <Path d="M221 113 Q221 102 233 102 Q245 102 245 113" fill="#92400e" />
        {/* Arm reaching to laptop */}
        <Path d="M226 140 Q215 148 208 148" stroke="#e8c4a0" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Right arm */}
        <Path d="M240 140 Q250 146 248 152" stroke="#e8c4a0" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Laptop */}
        <Rect x="195" y="140" width="22" height="14" rx="2" fill="#1e293b" />
        <Rect x="197" y="142" width="18" height="10" rx="1" fill="url(#loaderScreenGrad)" />
        {/* Laptop base */}
        <Rect x="192" y="154" width="28" height="2" rx="1" fill="#334155" />
        {/* Screen content */}
        <Rect x="199" y="144" width="6" height="2" rx="0.5" fill="#a5b4fc" opacity="0.7" />
        <Rect x="199" y="147.5" width="14" height="1.5" rx="0.5" fill="#c7d2fe" opacity="0.5" />
        <Rect x="199" y="150" width="10" height="1.5" rx="0.5" fill="#c7d2fe" opacity="0.4" />

        {/* Data flow from laptop to server */}
        <Path d="M195 148 Q185 145 175 150" stroke="#a5b4fc" strokeWidth="1" strokeDasharray="3,3" opacity="0.5" />
      </G>

      {/* === Floating decorative elements === */}

      {/* Gear icon (top left) */}
      <G opacity="0.5">
        <Circle cx="35" cy="30" r="11" fill="#eef2ff" />
        <Circle cx="35" cy="30" r="6" stroke="#818cf8" strokeWidth="1.5" fill="none" />
        <Circle cx="35" cy="30" r="2" fill="#818cf8" />
        {/* Gear teeth */}
        <Rect x="33.5" y="18" width="3" height="5" rx="1" fill="#818cf8" />
        <Rect x="33.5" y="37" width="3" height="5" rx="1" fill="#818cf8" />
        <Rect x="23" y="28.5" width="5" height="3" rx="1" fill="#818cf8" />
        <Rect x="42" y="28.5" width="5" height="3" rx="1" fill="#818cf8" />
      </G>

      {/* Cloud icon (top right) */}
      <G opacity="0.45">
        <Path
          d="M240 22 Q240 14 248 14 Q254 14 255 19 Q260 18 262 22 Q265 26 261 28 L238 28 Q234 28 234 25 Q234 22 240 22 Z"
          fill="#c7d2fe"
        />
        {/* Upload arrow */}
        <Path d="M249 24 L249 20 M247 22 L249 19 L251 22" stroke="#6366f1" strokeWidth="1" strokeLinecap="round" fill="none" />
      </G>

      {/* Wi-fi signal (right) */}
      <G opacity="0.4">
        <Path d="M260 95 Q265 90 270 95" stroke="#818cf8" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <Path d="M257 90 Q265 83 273 90" stroke="#a5b4fc" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <Path d="M254 85 Q265 76 276 85" stroke="#c7d2fe" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <Circle cx="265" cy="98" r="2" fill="#818cf8" />
      </G>

      {/* Lock icon (bottom left) */}
      <G opacity="0.4">
        <Circle cx="20" cy="170" r="10" fill="#fef3c7" />
        <Rect x="15" y="170" width="10" height="8" rx="2" fill="#f59e0b" />
        <Path d="M18 170 L18 167 Q18 164 20 164 Q22 164 22 167 L22 170" stroke="#f59e0b" strokeWidth="1.5" fill="none" />
        <Circle cx="20" cy="174" r="1" fill="#fef3c7" />
      </G>

      {/* Sync arrows (bottom right) */}
      <G opacity="0.4">
        <Circle cx="265" cy="165" r="10" fill="#dcfce7" />
        <Path d="M260 162 Q265 158 270 162" stroke="#22c55e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <Path d="M269 161 L270 163 L268 163" fill="#22c55e" />
        <Path d="M270 168 Q265 172 260 168" stroke="#22c55e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <Path d="M261 169 L260 167 L262 167" fill="#22c55e" />
      </G>

      {/* Small decorative dots */}
      <Circle cx="90" cy="35" r="2" fill="#6366f1" opacity="0.12" />
      <Circle cx="200" cy="30" r="1.5" fill="#818cf8" opacity="0.15" />
      <Circle cx="160" cy="25" r="2" fill="#a5b4fc" opacity="0.1" />
      <Circle cx="100" cy="90" r="1.5" fill="#c7d2fe" opacity="0.15" />
      <Circle cx="185" cy="95" r="2" fill="#e0e7ff" opacity="0.2" />
    </Svg>
  );
}
