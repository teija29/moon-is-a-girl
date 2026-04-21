"use client";

import type { JourCalendrier } from "@/lib/statistiques";
import type { CyclePhase } from "@/lib/cycle";

type Props = {
  jours: JourCalendrier[];
  mois: number;
  annee: number;
  onMoisPrecedent: () => void;
  onMoisSuivant: () => void;
  onAujourdhui: () => void;
};

const NOMS_MOIS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

const JOURS_SEMAINE = ["L", "M", "M", "J", "V", "S", "D"];

const COULEURS_PHASES: Record<CyclePhase, string> = {
  menstruation: "#C89CA8",
  folliculaire: "rgba(184, 169, 217, 0.5)",
  ovulation: "#D4AF7A",
  luteale: "#D4A5A5",
};

export default function CalendrierMois({
  jours,
  mois,
  annee,
  onMoisPrecedent,
  onMoisSuivant,
  onAujourdhui,
}: Props) {
  return (
    <div className="card-nocturne rounded-[20px] px-4 py-4 mb-4">
      {/* En-tête avec navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={onMoisPrecedent}
          aria-label="Mois précédent"
          className="w-8 h-8 flex items-center justify-center text-lune-lavande hover:text-lune-or transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M15 6 L 9 12 L 15 18" />
          </svg>
        </button>
        <button
          type="button"
          onClick={onAujourdhui}
          className="font-serif text-base text-lune-creme hover:text-lune-or transition-colors"
        >
          {NOMS_MOIS[mois]} {annee}
        </button>
        <button
          type="button"
          onClick={onMoisSuivant}
          aria-label="Mois suivant"
          className="w-8 h-8 flex items-center justify-center text-lune-lavande hover:text-lune-or transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M9 6 L 15 12 L 9 18" />
          </svg>
        </button>
      </div>

      {/* Jours de la semaine */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {JOURS_SEMAINE.map((j, i) => (
          <div
            key={i}
            className="text-center text-[10px] tracking-[0.1em] uppercase text-lune-lavande/60 font-medium"
          >
            {j}
          </div>
        ))}
      </div>

      {/* Grille des jours */}
      <div className="grid grid-cols-7 gap-1">
        {jours.map((j) => {
          const couleurPhase = j.phase ? COULEURS_PHASES[j.phase] : null;
          const opacite = j.dansLeMois ? 1 : 0.3;

          return (
            <div
              key={j.date}
              className="aspect-square flex flex-col items-center justify-center relative rounded-full"
              style={{
                opacity: opacite,
                background: couleurPhase ? `${couleurPhase}20` : "transparent",
                border: j.estAujourdhui
                  ? "1px solid #D4AF7A"
                  : "0.5px solid transparent",
              }}
            >
              <span
                className="text-xs font-serif"
                style={{
                  color:
                    couleurPhase && j.dansLeMois
                      ? "#F5EFE6"
                      : "rgba(245, 239, 230, 0.5)",
                }}
              >
                {j.jour}
              </span>
              {j.aEntreeJournal && j.dansLeMois && (
                <span
                  className="absolute bottom-1 w-1 h-1 rounded-full"
                  style={{ background: "#D4AF7A" }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Légende */}
      <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-lune-lavande/10">
        <Legende couleur="#C89CA8" label="Règles" />
        <Legende couleur="rgba(184, 169, 217, 0.7)" label="Folliculaire" />
        <Legende couleur="#D4AF7A" label="Ovulation" />
        <Legende couleur="#D4A5A5" label="Lutéale" />
      </div>
    </div>
  );
}

function Legende({ couleur, label }: { couleur: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="w-2.5 h-2.5 rounded-full"
        style={{ background: couleur }}
      />
      <span className="text-[10px] text-lune-lavande">{label}</span>
    </div>
  );
}
