import MoonShape from "@/components/cycle/MoonShape";
import { HUMEURS } from "@/lib/humeurs";
import type { Humeur } from "@/lib/journal";

type Props = {
  humeur: Humeur;
  taille?: number;
};

export default function HumeurIcon({ humeur, taille = 28 }: Props) {
  const option = HUMEURS.find((h) => h.id === humeur);
  if (!option) return null;

  const r = taille / 2 - 1;
  const cx = taille / 2;
  const cy = taille / 2;

  return (
    <svg
      width={taille}
      height={taille}
      viewBox={`0 0 ${taille} ${taille}`}
      aria-hidden="true"
    >
      <MoonShape
        phase={option.phaseLune}
        cx={cx}
        cy={cy}
        r={r}
        idGradient={`humeur-grad-${humeur}`}
      />
    </svg>
  );
}
