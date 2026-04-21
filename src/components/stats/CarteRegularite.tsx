import type { StatRegularite } from "@/lib/statistiques";

type Props = { stat: StatRegularite };

const COULEURS: Record<StatRegularite["niveau"], string> = {
  regulier: "#D4AF7A",
  variable: "#B8A9D9",
  irregulier: "#C89CA8",
  "donnees-insuffisantes": "#B8A9D9",
};

export default function CarteRegularite({ stat }: Props) {
  const couleur = COULEURS[stat.niveau];
  const insuffisant = stat.niveau === "donnees-insuffisantes";

  return (
    <div className="card-nocturne rounded-[20px] px-[18px] py-5 mb-4">
      <p className="text-[10px] tracking-[0.25em] uppercase text-lune-lavande font-medium mb-3">
        Régularité de ton cycle
      </p>

      {!insuffisant && (
        <div className="flex items-baseline gap-3 mb-3">
          <span className="font-serif text-4xl text-lune-creme leading-none">
            {stat.dureeMoyenne}
          </span>
          <span className="font-serif italic text-sm text-lune-lavande">
            jours en moyenne
          </span>
        </div>
      )}

      {!insuffisant && (
        <div className="flex items-center gap-2 mb-4">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: couleur }}
          />
          <span
            className="text-[11px] tracking-[0.15em] uppercase font-medium"
            style={{ color: couleur }}
          >
            {stat.niveau === "regulier" && "Très régulier"}
            {stat.niveau === "variable" && "Plutôt stable"}
            {stat.niveau === "irregulier" && "Variable"}
          </span>
        </div>
      )}

      <p className="font-serif italic text-sm text-lune-creme leading-relaxed">
        {stat.message}
      </p>
    </div>
  );
}
