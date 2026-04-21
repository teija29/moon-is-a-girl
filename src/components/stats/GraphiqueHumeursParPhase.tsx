import type { StatHumeursParPhase } from "@/lib/statistiques";
import type { CyclePhase } from "@/lib/cycle";
import { HUMEURS } from "@/lib/humeurs";

type Props = { stat: StatHumeursParPhase };

const LIBELLES_PHASES: Record<CyclePhase, string> = {
  menstruation: "Menstruation",
  folliculaire: "Folliculaire",
  ovulation: "Ovulation",
  luteale: "Lutéale",
};

const COULEURS_PHASES: Record<CyclePhase, string> = {
  menstruation: "#C89CA8",
  folliculaire: "#B8A9D9",
  ovulation: "#D4AF7A",
  luteale: "#D4A5A5",
};

export default function GraphiqueHumeursParPhase({ stat }: Props) {
  if (!stat.suffisant) {
    return (
      <div className="card-nocturne rounded-[20px] px-[18px] py-5 mb-4">
        <p className="text-[10px] tracking-[0.25em] uppercase text-lune-lavande font-medium mb-3">
          Humeurs × phase du cycle
        </p>
        <p className="font-serif italic text-sm text-lune-creme leading-relaxed">
          Écris dans ton journal quelques fois par semaine — d&apos;ici sept
          entrées, un motif commencera à se dessiner.
        </p>
        <p className="text-xs text-lune-lavande/60 mt-2 italic">
          {stat.totalEntrees} / 7 entrées avec humeur
        </p>
      </div>
    );
  }

  const phases: CyclePhase[] = [
    "menstruation",
    "folliculaire",
    "ovulation",
    "luteale",
  ];

  // Pour chaque phase, trouver l'humeur dominante.
  const dominantes = phases.map((phase) => {
    const humeurs = stat.parPhase[phase];
    const entries = Object.entries(humeurs);
    if (entries.length === 0) return { phase, humeur: null, proportion: 0 };
    entries.sort((a, b) => b[1] - a[1]);
    return { phase, humeur: entries[0][0], proportion: entries[0][1] };
  });

  return (
    <div className="card-nocturne rounded-[20px] px-[18px] py-5 mb-4">
      <p className="text-[10px] tracking-[0.25em] uppercase text-lune-lavande font-medium mb-4">
        Humeurs × phase du cycle
      </p>

      <div className="space-y-3">
        {dominantes.map(({ phase, humeur, proportion }) => {
          const humeurInfo = humeur
            ? HUMEURS.find((h) => h.id === humeur)
            : null;
          return (
            <div key={phase} className="flex items-center gap-3">
              <div className="flex-shrink-0 w-24">
                <span
                  className="text-[10px] tracking-[0.1em] uppercase font-medium"
                  style={{ color: COULEURS_PHASES[phase] }}
                >
                  {LIBELLES_PHASES[phase]}
                </span>
              </div>
              <div className="flex-1 h-6 rounded-full relative overflow-hidden" style={{ background: "rgba(184, 169, 217, 0.08)" }}>
                {humeurInfo && (
                  <div
                    className="absolute top-0 left-0 h-full rounded-full flex items-center justify-end pr-2 transition-all duration-700"
                    style={{
                      width: `${Math.max(proportion * 100, 15)}%`,
                      background: COULEURS_PHASES[phase],
                      opacity: 0.7,
                    }}
                  >
                    <span className="text-[10px] font-serif italic text-nuit-abysse whitespace-nowrap">
                      {humeurInfo.titre.toLowerCase()}
                    </span>
                  </div>
                )}
                {!humeurInfo && (
                  <div className="h-full flex items-center pl-3">
                    <span className="text-[10px] italic text-lune-lavande/60">
                      pas encore de données
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-lune-lavande/60 italic mt-4 leading-relaxed">
        Humeur dominante observée pour chaque phase, sur {stat.totalEntrees} entrées.
      </p>
    </div>
  );
}
