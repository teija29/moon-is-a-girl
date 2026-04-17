type Props = {
  cycleDay?: number;
  lunarPhasePercent?: number;
};

export default function CycleWheel({
  cycleDay = 14,
  lunarPhasePercent = 82,
}: Props) {
  return (
    <svg
      width="250"
      height="250"
      viewBox="0 0 250 250"
      className="animate-drift"
      role="img"
      aria-label={`Jour ${cycleDay} du cycle, lune à ${lunarPhasePercent}%`}
    >
      <defs>
        <radialGradient id="mg-glow" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#F5EFE6" stopOpacity="0.35" />
          <stop offset="60%" stopColor="#D4AF7A" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#F5EFE6" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="mg-moon-body" cx="35%" cy="35%">
          <stop offset="0%" stopColor="#F5EFE6" />
          <stop offset="60%" stopColor="#E8D5A8" />
          <stop offset="100%" stopColor="#B89968" />
        </radialGradient>
        <linearGradient id="mg-lunar-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3D3A6B" />
          <stop offset="50%" stopColor="#6B5B95" />
          <stop offset="100%" stopColor="#D4AF7A" />
        </linearGradient>
        <linearGradient id="mg-cycle-ring" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#C89CA8" />
          <stop offset="100%" stopColor="#6B5B95" />
        </linearGradient>
      </defs>

      <circle cx="125" cy="125" r="115" fill="url(#mg-glow)" />

      <circle cx="125" cy="125" r="110" fill="none" stroke="#1E2347" strokeWidth="1" />
      <circle
        cx="125"
        cy="125"
        r="110"
        fill="none"
        stroke="url(#mg-lunar-ring)"
        strokeWidth="2.5"
        strokeDasharray="245 100"
        opacity="0.85"
        transform="rotate(-90 125 125)"
      />

      <circle cx="125" cy="125" r="82" fill="none" stroke="#2A2040" strokeWidth="1" />
      <circle
        cx="125"
        cy="125"
        r="82"
        fill="none"
        stroke="url(#mg-cycle-ring)"
        strokeWidth="3"
        strokeDasharray="180 340"
        opacity="0.8"
        transform="rotate(-90 125 125)"
      />

      <g stroke="#B8A9D9" strokeWidth="0.5" opacity="0.4">
        <line x1="125" y1="10" x2="125" y2="18" />
        <line x1="240" y1="125" x2="232" y2="125" />
        <line x1="125" y1="240" x2="125" y2="232" />
        <line x1="10" y1="125" x2="18" y2="125" />
      </g>

      <circle cx="125" cy="125" r="42" fill="url(#mg-moon-body)" />
      <path
        d="M 125 83 A 42 42 0 0 0 125 167 A 24 42 0 0 1 125 83 Z"
        fill="#0B0D1F"
        opacity="0.55"
      />
      <circle cx="113" cy="115" r="2.5" fill="#B89968" opacity="0.4" />
      <circle cx="132" cy="138" r="1.8" fill="#B89968" opacity="0.3" />

      <circle
        cx="207"
        cy="125"
        r="7"
        fill="#C89CA8"
        stroke="#F5EFE6"
        strokeWidth="1.5"
      />
      <text
        x="207"
        y="105"
        fontFamily="var(--font-inter)"
        fontSize="9"
        fontWeight="500"
        fill="#C89CA8"
        textAnchor="middle"
        letterSpacing="1"
      >
        J{cycleDay}
      </text>

      <circle
        cx="220"
        cy="80"
        r="6"
        fill="#D4AF7A"
        stroke="#F5EFE6"
        strokeWidth="1.5"
      />
    </svg>
  );
}
