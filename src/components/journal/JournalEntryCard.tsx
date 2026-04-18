import type { EntreeJournal } from "@/lib/journal";
import { formatDateHumaine } from "@/lib/journal";
import { HUMEURS, SYMPTOMES } from "@/lib/humeurs";
import HumeurIcon from "@/components/journal/HumeurIcon";

type Props = {
  entree: EntreeJournal;
};

export default function JournalEntryCard({ entree }: Props) {
  const humeurOpt = entree.humeur
    ? HUMEURS.find((h) => h.id === entree.humeur)
    : null;

  const symptomeLibelles = entree.symptomes
    .map((s) => SYMPTOMES.find((opt) => opt.id === s)?.libelle)
    .filter((v): v is string => Boolean(v));

  return (
    <article className="card-nocturne rounded-[20px] px-[18px] py-4">
      <header className="flex items-center justify-between mb-3">
        <p className="text-[10px] tracking-[0.25em] uppercase text-lune-lavande font-medium">
          {formatDateHumaine(entree.date)}
        </p>
        {humeurOpt && (
          <div className="flex items-center gap-2">
            <HumeurIcon humeur={humeurOpt.id} taille={18} />
            <span className="font-serif text-sm text-lune-creme">
              {humeurOpt.titre}
            </span>
          </div>
        )}
      </header>

      {symptomeLibelles.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {symptomeLibelles.map((lib) => (
            <span
              key={lib}
              className="text-[11px] px-2.5 py-1 rounded-full border border-cycle-rose/40 bg-cycle-rose/10 text-lune-creme"
            >
              {lib}
            </span>
          ))}
        </div>
      )}

      {entree.pensee.trim().length > 0 && (
        <p className="font-serif italic text-sm text-lune-creme leading-relaxed">
          « {entree.pensee} »
        </p>
      )}
    </article>
  );
}
