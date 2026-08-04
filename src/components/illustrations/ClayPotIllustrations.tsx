import type { SVGProps } from "react";

interface PotProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

const potGradient = (
  id: string,
  from: string,
  to: string,
  dark: string,
) => (
  <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stopColor={from} />
    <stop offset="55%" stopColor={to} />
    <stop offset="100%" stopColor={dark} />
  </linearGradient>
);

const clayPotGradients = (id: string) => (
  <>
    {potGradient(`${id}-body`, "#c9642f", "#b5653a", "#8f4a28")}
    {potGradient(`${id}-shadow`, "#8f4a28", "#6d4c41", "#5a3e35")}
    {potGradient(`${id}-yogurt`, "#fffdf9", "#f7ecdf", "#efe2dc")}
    {potGradient(`${id}-gold`, "#e6c65a", "#c9a227", "#a98321")}
  </>
);

function ClayPotBody({ id }: { id: string }) {
  return (
    <>
      {/* pot body */}
      <path
        d="M 34 66 C 30 92 34 128 52 150 C 66 168 96 168 110 150 C 128 128 132 92 128 66 Z"
        fill={`url(#${id}-body)`}
      />
      {/* pot rim highlight */}
      <path
        d="M 60 92 C 66 116 74 132 86 142"
        fill="none"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* clay speckles */}
      <g fill="rgba(143,74,40,0.35)">
        <circle cx="84" cy="116" r="2" />
        <circle cx="72" cy="128" r="1.6" />
        <circle cx="95" cy="124" r="1.8" />
        <circle cx="88" cy="140" r="1.4" />
        <circle cx="100" cy="104" r="1.5" />
        <circle cx="66" cy="112" r="1.3" />
      </g>
      {/* rim */}
      <ellipse cx="81" cy="66" rx="48" ry="16" fill={`url(#${id}-shadow)`} />
      <ellipse cx="81" cy="64" rx="48" ry="16" fill={`url(#${id}-body)`} />
      {/* yogurt surface */}
      <ellipse cx="81" cy="63" rx="42" ry="13" fill={`url(#${id}-yogurt)`} />
      {/* yogurt swirl */}
      <path
        d="M 56 62 C 64 55 78 54 92 60 C 100 63 106 62 108 59"
        fill="none"
        stroke="rgba(181,101,58,0.35)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M 60 66 C 70 71 88 71 98 66"
        fill="none"
        stroke="rgba(181,101,58,0.22)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* gold band */}
      <path
        d="M 33 82 C 40 108 54 140 62 150"
        fill="none"
        stroke={`url(#${id}-gold)`}
        strokeWidth="3"
        opacity="0.85"
      />
      <path
        d="M 129 82 C 122 108 108 140 100 150"
        fill="none"
        stroke={`url(#${id}-gold)`}
        strokeWidth="3"
        opacity="0.85"
      />
    </>
  );
}

export function TraditionalPot({ size = 200, ...props }: PotProps) {
  const id = "trad";
  return (
    <svg
      viewBox="0 0 162 172"
      width={size}
      height={size * (172 / 162)}
      role="img"
      aria-label="মাটির হাঁড়ির দই"
      {...props}
    >
      <defs>{clayPotGradients(id)}</defs>
      {/* ground shadow */}
      <ellipse cx="81" cy="160" rx="62" ry="10" fill="rgba(109,76,65,0.18)" />
      <ClayPotBody id={id} />
      {/* leaf garnish */}
      <path
        d="M 44 48 C 36 38 36 28 44 22 C 50 30 50 40 44 48 Z"
        fill="#679f6e"
        opacity="0.9"
      />
      <path
        d="M 44 48 C 38 44 36 34 42 26"
        fill="none"
        stroke="#355e3b"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MiniPot({ size = 200, ...props }: PotProps) {
  const id = "mini";
  return (
    <svg
      viewBox="0 0 162 172"
      width={size}
      height={size * (172 / 162)}
      role="img"
      aria-label="ছোট মাটির হাঁড়ির দই"
      {...props}
    >
      <defs>{clayPotGradients(id)}</defs>
      <ellipse cx="81" cy="160" rx="58" ry="9" fill="rgba(109,76,65,0.18)" />
      <ClayPotBody id={id} />
      <g transform="translate(0,-6)">
        <path
          d="M 120 36 C 116 26 120 18 130 16 C 132 27 128 34 120 36 Z"
          fill="#679f6e"
          opacity="0.85"
        />
      </g>
    </svg>
  );
}

export function FamilyPot({ size = 200, ...props }: PotProps) {
  const id = "family";
  return (
    <svg
      viewBox="0 0 190 182"
      width={size}
      height={size * (182 / 190)}
      role="img"
      aria-label="বড় মাটির হাঁড়ির দই"
      {...props}
    >
      <defs>{clayPotGradients(id)}</defs>
      <ellipse cx="95" cy="168" rx="76" ry="11" fill="rgba(109,76,65,0.18)" />
      <g transform="translate(14,0) scale(1.12,1.1)">
        <ClayPotBody id={id} />
      </g>
      {/* gold seal */}
      <g transform="translate(116,36)">
        <circle r="10" fill={`url(#${id}-gold)`} />
        <text
          x="0"
          y="3"
          textAnchor="middle"
          fontSize="9"
          fill="#fff8f0"
          fontWeight="700"
        >
          হা
        </text>
      </g>
    </svg>
  );
}

export function YogurtBowl({ size = 200, ...props }: PotProps) {
  const id = "bowl";
  return (
    <svg
      viewBox="0 0 190 150"
      width={size}
      height={size * (150 / 190)}
      role="img"
      aria-label="দইয়ের বাটি"
      {...props}
    >
      <defs>
        {potGradient(`${id}-bowl`, "#c59f90", "#a97d6c", "#6d4c41")}
        {potGradient(`${id}-yogurt`, "#fffdf9", "#f7ecdf", "#efe2dc")}
      </defs>
      <ellipse cx="95" cy="138" rx="80" ry="9" fill="rgba(109,76,65,0.16)" />
      {/* bowl */}
      <path
        d="M 25 58 C 25 92 42 118 68 130 C 80 136 110 136 122 130 C 148 118 165 92 165 58 Z"
        fill={`url(#${id}-bowl)`}
      />
      <ellipse cx="95" cy="58" rx="70" ry="16" fill={`url(#${id}-yogurt)`} />
      <path
        d="M 62 56 C 74 48 92 48 106 56 C 114 60 120 60 126 56"
        fill="none"
        stroke="rgba(181,101,58,0.4)"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M 68 62 C 80 68 98 68 112 61"
        fill="none"
        stroke="rgba(181,101,58,0.25)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <g fill="#c9a227">
        <circle cx="60" cy="34" r="2.4" />
        <circle cx="128" cy="30" r="2.2" />
        <circle cx="160" cy="58" r="2" />
        <circle cx="28" cy="58" r="2" />
      </g>
    </svg>
  );
}

export function SweetDoi({ size = 200, ...props }: PotProps) {
  const id = "sweet";
  return (
    <svg
      viewBox="0 0 190 182"
      width={size}
      height={size * (182 / 190)}
      role="img"
      aria-label="মিষ্টি দই"
      {...props}
    >
      <defs>
        {clayPotGradients(id)}
        {potGradient(`${id}-gur`, "#e0a45a", "#c9823a", "#9c5a24")}
      </defs>
      <ellipse cx="95" cy="168" rx="76" ry="11" fill="rgba(109,76,65,0.18)" />
      <g transform="translate(14,0) scale(1.12,1.1)">
        <ClayPotBody id={id} />
      </g>
      {/* jaggery topping */}
      <ellipse cx="95" cy="62" rx="26" ry="8" fill={`url(#${id}-gur)`} opacity="0.95" />
      <ellipse cx="84" cy="61" rx="8" ry="3" fill="#e0a45a" opacity="0.8" />
      <g transform="translate(64,30)">
        <text
          x="0"
          y="12"
          fontSize="22"
          fontWeight="700"
          fill="#b5653a"
          opacity="0.9"
        >
          মিষ্টি
        </text>
      </g>
    </svg>
  );
}

export function SourDoi({ size = 200, ...props }: PotProps) {
  const id = "sour";
  return (
    <svg
      viewBox="0 0 190 182"
      width={size}
      height={size * (182 / 190)}
      role="img"
      aria-label="টক দই"
      {...props}
    >
      <defs>
        {clayPotGradients(id)}
        {potGradient(`${id}-cream`, "#fffdf9", "#efe2dc", "#dec3b8")}
      </defs>
      <ellipse cx="95" cy="168" rx="76" ry="11" fill="rgba(109,76,65,0.18)" />
      <g transform="translate(14,0) scale(1.12,1.1)">
        <ClayPotBody id={id} />
      </g>
      {/* cream swirl */}
      <g transform="translate(95,63)">
        <path
          d="M 0 -2 C 14 -8 20 6 6 10 C -6 13 -14 2 0 -2 Z"
          fill={`url(#${id}-cream)`}
        />
        <path
          d="M 0 -2 C 14 -8 20 6 6 10"
          fill="none"
          stroke="rgba(53,94,59,0.35)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </g>
      <g transform="translate(52,32)">
        <text
          x="0"
          y="12"
          fontSize="22"
          fontWeight="700"
          fill="#355e3b"
          opacity="0.9"
        >
          টক
        </text>
      </g>
    </svg>
  );
}

export function GiftBox({ size = 200, ...props }: PotProps) {
  const id = "gift";
  return (
    <svg
      viewBox="0 0 200 190"
      width={size}
      height={size * (190 / 200)}
      role="img"
      aria-label="উপহার বক্স"
      {...props}
    >
      <defs>
        {potGradient(`${id}-box`, "#b5653a", "#a96a44", "#8f4a28")}
        {potGradient(`${id}-lid`, "#c9642f", "#b5653a", "#9c5a2f")}
        {potGradient(`${id}-ribbon`, "#e6c65a", "#c9a227", "#a98321")}
        {potGradient(`${id}-yogurt`, "#fffdf9", "#f7ecdf", "#efe2dc")}
      </defs>
      <ellipse cx="100" cy="176" rx="78" ry="10" fill="rgba(109,76,65,0.18)" />
      {/* box */}
      <rect x="48" y="92" width="104" height="72" rx="10" fill={`url(#${id}-box)`} />
      {/* lid */}
      <rect x="40" y="74" width="120" height="22" rx="8" fill={`url(#${id}-lid)`} />
      {/* vertical ribbon */}
      <rect x="92" y="74" width="16" height="90" fill={`url(#${id}-ribbon)`} />
      {/* horizontal ribbon */}
      <rect x="40" y="88" width="120" height="12" fill={`url(#${id}-ribbon)`} />
      {/* bow */}
      <g transform="translate(100,66)">
        <path
          d="M -2 0 C -16 -12 -26 6 -10 8 C -6 8 -2 4 -2 0 Z"
          fill={`url(#${id}-ribbon)`}
        />
        <path
          d="M 2 0 C 16 -12 26 6 10 8 C 6 8 2 4 2 0 Z"
          fill={`url(#${id}-ribbon)`}
        />
        <circle r="4" fill="#a98321" />
      </g>
      {/* mini pot peek */}
      <ellipse cx="100" cy="92" rx="22" ry="7" fill={`url(#${id}-yogurt)`} opacity="0.6" />
    </svg>
  );
}

export function PremiumJar({ size = 200, ...props }: PotProps) {
  const id = "jar";
  return (
    <svg
      viewBox="0 0 170 190"
      width={size}
      height={size * (190 / 170)}
      role="img"
      aria-label="প্রিমিয়াম জার"
      {...props}
    >
      <defs>
        {potGradient(`${id}-glass`, "#ffffff", "#f7ecdf", "#dec3b8")}
        {potGradient(`${id}-yogurt`, "#fffdf9", "#f7ecdf", "#efe2dc")}
        {potGradient(`${id}-lid`, "#c9a227", "#a98321", "#87651d")}
        {potGradient(`${id}-label`, "#6d4c41", "#5a3e35", "#46312b")}
        {potGradient(`${id}-green`, "#679f6e", "#355e3b", "#25402b")}
      </defs>
      <ellipse cx="85" cy="176" rx="60" ry="9" fill="rgba(109,76,65,0.16)" />
      {/* glass jar body */}
      <path
        d="M 50 38 C 50 58 50 120 55 150 C 58 162 70 168 85 168 C 100 168 112 162 115 150 C 120 120 120 58 120 38 Z"
        fill={`url(#${id}-glass)`}
      />
      {/* yogurt fill */}
      <path
        d="M 55 66 C 60 58 110 58 115 66 L 115 96 C 100 90 70 90 55 96 Z"
        fill={`url(#${id}-yogurt)`}
        opacity="0.85"
      />
      {/* glass highlight */}
      <path
        d="M 62 46 C 62 80 62 120 64 144"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      {/* label */}
      <rect x="56" y="104" width="58" height="44" rx="8" fill={`url(#${id}-label)`} />
      <text x="85" y="124" textAnchor="middle" fontSize="9" fill="#f7ecdf" fontWeight="600">
        হাঁড়ির
      </text>
      <text x="85" y="138" textAnchor="middle" fontSize="8" fill="#e6c65a" fontWeight="600">
        স্বাদ
      </text>
      {/* lid */}
      <rect x="46" y="28" width="78" height="16" rx="6" fill={`url(#${id}-lid)`} />
      <rect x="52" y="24" width="66" height="8" rx="4" fill={`url(#${id}-green)`} />
    </svg>
  );
}
