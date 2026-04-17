// Visualisation principale : deux anneaux concentriques.
// - Anneau intérieur (rose) : cycle menstruel, calculé dynamiquement selon cycleDay / cycleLength.
// - Anneau extérieur (violet/or) : cycle lunaire — HARDCODÉ pour l'instant,
//   sera branché à l'API astronomique au Prompt 3.

import { arcParcouruCycle, positionMarqueurCycle } from "@/lib/cycle";

type Props = {
  cycleDay: number;
  cycleLength: number;
  lunarPhasePercent?: number;
};

const CENTRE_X = 125;
const CENTRE_Y = 125;
const RAYON_CYCLE = 82; // anneau intérieur (menstruel)

export default function CycleWheel({
  cycleDay,
  cycleLength,
  lunarPhasePercent = 82,
}: Props) {
  // Arc du cycle menstruel : portion parcourue sur la circonférence totale.
  const { parcouru, circonference } = arcParcouruCycle(
    cycleDay,
    cycleLength,
    RAYON_CYCLE
  );

  // Position du marqueur rose sur l'anneau intérieur.
  const marqueur = positionMarqueurCycle(
    cycleDay,
    cycleLength,
    CENTRE_X,
    CENTRE_Y,
    RAYON_CYCLE
  );

  // Position de l'étiquette "J14", placée au-dessus ou en-dessous du marqueur
  // selon qu'il est dans la moitié haute ou basse, pour éviter de sortir du viewBox.
  const etiquetteOffset = marqueur.y < CENTRE_Y ? -16 : 24;

  return (
    <svg
      width="250"
      height="250"
      viewBox="0 0 250 250"
      className="animate-drift"
      role="img"
      aria-label={`Jour ${cycleDay} d'un cycle de ${cycleLength} jours, lune à ${lunarPhasePercent}%`}
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

      {/* Halo lumineux central */}
      <circle cx={CENTRE_X} cy={CENTRE_Y} r="115" fill="url(#mg-glow)" />

      {/* Anneau extérieur : cycle lunaire (HARDCODÉ, à brancher au Prompt 3) */}
      <circle
        cx={CENTRE_X}
        cy={CENTRE_Y}
        r="110"
        fill="none"
        stroke="#1E2347"
        strokeWidth="1"
      />
      <circle
        cx={CENTRE_X}
        cy={CENTRE_Y}
        r="110"
        fill="none"
        stroke="url(#mg-lunar-ring)"
        strokeWidth="2.5"
        strokeDasharray="245 100"
        opacity="0.85"
        transform={`rotate(-90 ${CENTRE_X} ${CENTRE_Y})`}
      />

      {/* Anneau intérieur : cycle menstruel (DYNAMIQUE) */}
      <circle
        cx={CENTRE_X}
        cy={CENTRE_Y}
        r={RAYON_CYCLE}
        fill="none"
        stroke="#2A2040"
        strokeWidth="1"
      />
      <circle
        cx={CENTRE_X}
        cy={CENTRE_Y}
        r={RAYON_CYCLE}
        fill="none"
        stroke="url(#mg-cycle-ring)"
        strokeWidth="3"
        strokeDasharray={`${parcouru.toFixed(2)} ${circonference.toFixed(2)}`}
        opacity="0.8"
        transform={`rotate(-90 ${CENTRE_X} ${CENTRE_Y})`}
        style={{
          transition: "stroke-dasharray 1200ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />

      {/* Graduations aux 4 phases principales */}
      <g stroke="#B8A9D9" strokeWidth="0.5" opacity="0.4">
        <line x1={CENTRE_X} y1="10" x2={CENTRE_X} y2="18" />
        <line x1="240" y1={CENTRE_Y} x2="232" y2={CENTRE_Y} />
        <line x1={CENTRE_X} y1="240" x2={CENTRE_X} y2="232" />
        <line x1="10" y1={CENTRE_Y} x2="18" y2={CENTRE_Y} />
      </g>

      {/* Lune au centre (gibbeuse croissante HARDCODÉE, à rendre dynamique au Prompt 3) */}
      <circle cx={CENTRE_X} cy={CENTRE_Y} r="42" fill="url(#mg-moon-body)" />
      <path
        d={`M ${CENTRE_X} 83 A 42 42 0 0 0 ${CENTRE_X} 167 A 24 42 0 0 1 ${CENTRE_X} 83 Z`}
        fill="#0B0D1F"
        opacity="0.55"
      />
      <circle cx="113" cy="115" r="2.5" fill="#B89968" opacity="0.4" />
      <circle cx="132" cy="138" r="1.8" fill="#B89968" opacity="0.3" />

      {/* Marqueur position cycle menstruel (DYNAMIQUE) */}
      <circle
        cx={marqueur.x}
        cy={marqueur.y}
        r="7"
        fill="#C89CA8"
        stroke="#F5EFE6"
        strokeWidth="1.5"
        style={{
          transition:
            "cx 1200ms cubic-bezier(0.4, 0, 0.2, 1), cy 1200ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />
      <text
        x={marqueur.x}
        y={marqueur.y + etiquetteOffset}
        fontFamily="var(--font-inter)"
        fontSize="9"
        fontWeight="500"
        fill="#C89CA8"
        textAnchor="middle"
        letterSpacing="1"
      >
        J{cycleDay}
      </text>

      {/* Marqueur position lune (HARDCODÉ pour l'instant) */}
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
