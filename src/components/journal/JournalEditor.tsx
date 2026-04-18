"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  type EntreeJournal,
  type Humeur,
  type Symptome,
  LONGUEUR_PENSEE_MAX,
  formatDateHumaine,
  toggleSymptome,
} from "@/lib/journal";
import { HUMEURS, SYMPTOMES } from "@/lib/humeurs";
import HumeurIcon from "@/components/journal/HumeurIcon";
import { useJournal } from "@/hooks/useJournal";

type Props = {
  entreeInitiale: EntreeJournal;
};

export default function JournalEditor({ entreeInitiale }: Props) {
  const router = useRouter();
  const { enregistrer } = useJournal();

  const [humeur, setHumeur] = useState<Humeur | null>(entreeInitiale.humeur);
  const [symptomes, setSymptomes] = useState<Symptome[]>(entreeInitiale.symptomes);
  const [pensee, setPensee] = useState(entreeInitiale.pensee);

  const valider = () => {
    enregistrer({
      date: entreeInitiale.date,
      humeur,
      symptomes,
      pensee: pensee.trim(),
      modifieLe: new Date().toISOString(),
    });
    router.push("/");
  };

  const basculerSymptome = (s: Symptome) => {
    setSymptomes((curr) => toggleSymptome(curr, s));
  };

  return (
    <div className="pb-10">
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.25em] uppercase text-lune-lavande font-medium mb-2">
          {formatDateHumaine(entreeInitiale.date)}
        </p>
        <h1 className="font-serif text-3xl text-lune-creme leading-tight">
          Ta page du jour
        </h1>
        <p className="font-serif italic text-sm text-lune-or mt-2">
          Prends quelques instants pour te déposer ici
        </p>
      </div>

      {/* Zone 1 : humeur */}
      <section className="mb-8">
        <h2 className="text-[10px] tracking-[0.25em] uppercase text-lune-lavande font-medium mb-4">
          Comment te sens-tu&nbsp;?
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {HUMEURS.map((h) => {
            const actif = humeur === h.id;
            return (
              <button
                key={h.id}
                type="button"
                onClick={() => setHumeur(actif ? null : h.id)}
                aria-pressed={actif}
                className={
                  "flex flex-col items-center gap-2 p-3 rounded-[18px] border transition-all duration-500 " +
                  (actif
                    ? "border-lune-or/60 bg-lune-or/10"
                    : "border-lune-lavande/15 bg-transparent hover:bg-nuit-encre/40")
                }
              >
                <HumeurIcon humeur={h.id} taille={32} />
                <span
                  className={
                    "font-serif text-sm " +
                    (actif ? "text-lune-creme" : "text-lune-lavande")
                  }
                >
                  {h.titre}
                </span>
                <span className="text-[10px] italic text-lune-lavande/60 -mt-1">
                  {h.sousTitre}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Zone 2 : symptômes */}
      <section className="mb-8">
        <h2 className="text-[10px] tracking-[0.25em] uppercase text-lune-lavande font-medium mb-4">
          Ton corps te dit&nbsp;?
        </h2>
        <div className="flex flex-wrap gap-2">
          {SYMPTOMES.map((s) => {
            const actif = symptomes.includes(s.id);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => basculerSymptome(s.id)}
                aria-pressed={actif}
                className={
                  "text-xs px-3.5 py-2 rounded-full border transition-all duration-300 " +
                  (actif
                    ? "border-cycle-rose/60 bg-cycle-rose/15 text-lune-creme"
                    : "border-lune-lavande/20 bg-transparent text-lune-lavande hover:border-lune-lavande/40")
                }
              >
                {s.libelle}
              </button>
            );
          })}
        </div>
      </section>

      {/* Zone 3 : pensée libre */}
      <section className="mb-10">
        <h2 className="text-[10px] tracking-[0.25em] uppercase text-lune-lavande font-medium mb-4">
          Une pensée&nbsp;?
        </h2>
        <textarea
          value={pensee}
          onChange={(e) =>
            setPensee(e.target.value.slice(0, LONGUEUR_PENSEE_MAX))
          }
          placeholder="Ce que tu traverses, ce qui te traverse..."
          rows={6}
          className="w-full bg-nuit-encre/40 border border-lune-lavande/15 rounded-[18px] p-4 font-serif italic text-base text-lune-creme placeholder:text-lune-lavande/40 focus:outline-none focus:border-lune-or/40 transition-colors duration-500 resize-none"
        />
        <p className="text-[10px] text-lune-lavande/50 text-right mt-1.5">
          {pensee.length} / {LONGUEUR_PENSEE_MAX}
        </p>
      </section>

      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="font-serif italic text-sm text-lune-lavande hover:text-lune-creme transition-colors duration-300"
        >
          ← Retour
        </button>
        <button
          type="button"
          onClick={valider}
          className="font-serif text-base text-nuit-abysse bg-lune-or px-6 py-2.5 rounded-full hover:bg-lune-or-pale transition-all duration-500"
        >
          Déposer ✦
        </button>
      </div>
    </div>
  );
}
