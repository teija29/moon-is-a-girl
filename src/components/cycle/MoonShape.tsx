// Dessine la lune au centre du CycleWheel, dans sa forme réelle.
// - Disque de base : gradient crème (partie illuminée)
// - Ombre : path à deux arcs (demi-cercle du bord + ellipse du terminateur)
//
// La formule suit la convention SVG standard :
//   path = M haut A rayon rayon 0 0 sweep1 bas A terminatorRx rayon 0 0 sweep2 haut Z
// où :
//   sweep1 = sens du demi-cercle extérieur (0 = gauche, 1 = droit)
//   sweep2 = sens du terminateur elliptique (0 = bombe à droite, 1 = bombe à gauche)

type Props = {
  phase: number;
  cx: number;
  cy: number;
  r: number;
  /** Identifiant unique pour le gradient interne (évite les collisions SVG). */
  idGradient?: string;
};

const EPSILON = 0.02;

export default function MoonShape({
  phase,
  cx,
  cy,
  r,
  idGradient = "moonshape-body",
}: Props) {
  const defs = (
    <defs>
      <radialGradient id={idGradient} cx="35%" cy="35%">
        <stop offset="0%" stopColor="#F5EFE6" />
        <stop offset="60%" stopColor="#E8D5A8" />
        <stop offset="100%" stopColor="#B89968" />
      </radialGradient>
    </defs>
  );

  // Nouvelle lune → disque sombre sans illumination.
  if (phase < EPSILON || phase > 1 - EPSILON) {
    return (
      <g>
        {defs}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="#0B0D1F"
          stroke="#2A2040"
          strokeWidth="1.5"
        />
      </g>
    );
  }

  // Pleine lune → disque entièrement illuminé, pas d'ombre.
  if (Math.abs(phase - 0.5) < EPSILON) {
    return (
      <g>
        {defs}
        <circle cx={cx} cy={cy} r={r} fill={`url(#${idGradient})`} />
        <circle cx={cx - 12} cy={cy - 10} r={2.5} fill="#B89968" opacity="0.4" />
        <circle cx={cx + 7} cy={cy + 13} r={1.8} fill="#B89968" opacity="0.3" />
      </g>
    );
  }

  const estCroissante = phase < 0.5;
  const estPlusDeLaMoitieEclairee = phase > 0.25 && phase < 0.75;

  const terminatorRx = Math.abs(Math.cos(2 * Math.PI * phase)) * r;

  // sweep1 : direction du demi-cercle extérieur.
  const sweep1 = estCroissante ? 0 : 1;

  // sweep2 : direction du terminateur elliptique.
  let sweep2: 0 | 1;
  if (estCroissante) {
    sweep2 = estPlusDeLaMoitieEclairee ? 1 : 0;
  } else {
    sweep2 = estPlusDeLaMoitieEclairee ? 0 : 1;
  }

  const haut = `${cx},${cy - r}`;
  const bas = `${cx},${cy + r}`;
  const pathOmbre = `M ${haut} A ${r} ${r} 0 0 ${sweep1} ${bas} A ${terminatorRx.toFixed(
    2
  )} ${r} 0 0 ${sweep2} ${haut} Z`;

  return (
    <g>
      {defs}
      <circle cx={cx} cy={cy} r={r} fill={`url(#${idGradient})`} />

      {/* Petits cratères décoratifs côté illuminé */}
      {estCroissante ? (
        <>
          <circle cx={cx + 7} cy={cy - 6} r={2.5} fill="#B89968" opacity="0.35" />
          <circle cx={cx + 14} cy={cy + 10} r={1.8} fill="#B89968" opacity="0.3" />
        </>
      ) : (
        <>
          <circle cx={cx - 7} cy={cy - 6} r={2.5} fill="#B89968" opacity="0.35" />
          <circle cx={cx - 14} cy={cy + 10} r={1.8} fill="#B89968" opacity="0.3" />
        </>
      )}

      <path
        d={pathOmbre}
        fill="#0B0D1F"
        opacity="0.85"
        style={{
          transition: "d 1200ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />
    </g>
  );
}
