import { arcParcouruCycle, positionMarqueurCycle } from "@/lib/cycle";
import { arcParcouruLune, positionMarqueurLune } from "@/lib/lune";
import MoonShape from "@/components/cycle/MoonShape";

type Props = {
  cycleDay: number;
  cycleLength: number;
  /** Phase lunaire : 0 (nouvelle) à 1 (nouvelle suivante). */
  lunePhase: number;
};

const CENTRE_X = 125;
const CENTRE_Y = 125;
const RAYON_CYCLE = 82; // anneau intérieur (menstruel)
const RAYON_LUNE = 110; // anneau extérieur (lunaire)
const RAYON_DISQUE_LUNE = 42; // disque central représentant la lune

export default function CycleWheel({
  cycleDay,
  cycleLength,
  lunePhase,
}: Props) {
  // ---- Cycle menstruel (anneau intérieur) ----
  const { parcouru: parcouruCycle, circonference: circCycle } =
    arcParcouruCycle(cycleDay, cycleLength, RAYON_CYCLE);
  const marqueurCycle = positionMarqueurCycle(
    cycleDay,
    cycleLength,
    CENTRE_X,
    CENTRE_Y,
    RAYON_CYCLE
  );
  const etiquetteOffsetCycle = marqueurCycle.y < CENTRE_Y ? -16 : 24;

  // ---- Cycle lunaire (anneau extérieur) ----
  const { parcouru: parcouruLune, circonference: circLune } = arcParcouruLune(
    lunePhase,
    RAYON_LUNE
  );
  const marqueurLune = positionMarqueurLune(
    lunePhase,
    CENTRE_X,
    CENTRE_Y,
    RAYON_LUNE
  );

  return (
    <svg
      width="250"
      height="250"
      viewBox="0 0 250 250"
      className="animate-drift"
      role="img"
      aria-label={`Jour ${cycleDay} d'un cycle de ${cycleLength} jours, lune à ${Math.round(
        lunePhase * 100
      )}% du cycle synodique`}
    >
      <defs>
        <radialGradient id="mg-glow" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#F5EFE6" stopOpacity="0.35" />
          <stop offset="60%" stopColor="#D4AF7A" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#F5EFE6" stopOpacity="0" />
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

      {/* Anneau extérieur : cycle lunaire (DYNAMIQUE) */}
      <circle
        cx={CENTRE_X}
        cy={CENTRE_Y}
        r={RAYON_LUNE}
        fill="none"
        stroke="#1E2347"
        strokeWidth="1"
      />
      <circle
        cx={CENTRE_X}
        cy={CENTRE_Y}
        r={RAYON_LUNE}
        fill="none"
        stroke="url(#mg-lunar-ring)"
        strokeWidth="2.5"
        strokeDasharray={`${parcouruLune.toFixed(2)} ${circLune.toFixed(2)}`}
        opacity="0.85"
        transform={`rotate(-90 ${CENTRE_X} ${CENTRE_Y})`}
        style={{
          transition: "stroke-dasharray 1200ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
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
        strokeDasharray={`${parcouruCycle.toFixed(2)} ${circCycle.toFixed(2)}`}
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

      {/* Lune au centre, forme réelle selon la phase */}
      <MoonShape
        phase={lunePhase}
        cx={CENTRE_X}
        cy={CENTRE_Y}
        r={RAYON_DISQUE_LUNE}
      />

      {/* Marqueur cycle menstruel (rose) */}
      <circle
        cx={marqueurCycle.x}
        cy={marqueurCycle.y}
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
        x={marqueurCycle.x}
        y={marqueurCycle.y + etiquetteOffsetCycle}
        fontFamily="var(--font-inter)"
        fontSize="9"
        fontWeight="500"
        fill="#C89CA8"
        textAnchor="middle"
        letterSpacing="1"
      >
        J{cycleDay}
      </text>

      {/* Marqueur cycle lunaire (or, DYNAMIQUE) */}
      <circle
        cx={marqueurLune.x}
        cy={marqueurLune.y}
        r="6"
        fill="#D4AF7A"
        stroke="#F5EFE6"
        strokeWidth="1.5"
        style={{
          transition:
            "cx 1200ms cubic-bezier(0.4, 0, 0.2, 1), cy 1200ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />
    </svg>
  );
}
