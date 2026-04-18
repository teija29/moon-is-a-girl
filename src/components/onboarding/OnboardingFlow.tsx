"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/hooks/useUserProfile";
import StarField from "@/components/layout/StarField";
import MoonWordmark from "@/components/layout/MoonWordmark";

type Etape = 1 | 2 | 3;

/**
 * Format ISO "YYYY-MM-DD" pour aujourd'hui (date locale).
 * Sert de valeur max du date picker (on n'accepte pas de date future).
 */
function aujourdhuiISO(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const jj = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${jj}`;
}

export default function OnboardingFlow() {
  const router = useRouter();
  const { chargement, utilisateur, enregistrer } = useUserProfile();

  const [etape, setEtape] = useState<Etape>(1);
  const [prenom, setPrenom] = useState("");
  const [dernieresRegles, setDernieresRegles] = useState("");
  const [dureeCycle, setDureeCycle] = useState(28);

  useEffect(() => {
    if (!chargement && !utilisateur) {
      router.replace("/login");
    }
  }, [chargement, utilisateur, router]);

  const prenomValide = prenom.trim().length >= 2;
  const dateValide = dernieresRegles.length > 0;

  const suivant = () => {
    if (etape === 1 && prenomValide) setEtape(2);
    else if (etape === 2 && dateValide) setEtape(3);
  };

  const precedent = () => {
    if (etape === 2) setEtape(1);
    else if (etape === 3) setEtape(2);
  };

  const terminer = async () => {
    if (!prenomValide || !dateValide) return;
    if (!utilisateur) {
      router.push("/login");
      return;
    }
    try {
      await enregistrer({
        prenom: prenom.trim(),
        dernieresRegles,
        dureeCycle,
      });
      router.push("/");
    } catch (e) {
      console.error("Erreur sauvegarde profil:", e);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <StarField />

      <div className="relative z-10 flex flex-col min-h-screen">
        <MoonWordmark />

        <div className="flex-1 flex flex-col justify-center px-6 py-8">
          {/* Indicateur de progression : 3 points */}
          <div
            className="flex justify-center gap-2 mb-10"
            role="progressbar"
            aria-valuenow={etape}
            aria-valuemin={1}
            aria-valuemax={3}
          >
            {[1, 2, 3].map((n) => (
              <span
                key={n}
                className={
                  "w-1.5 h-1.5 rounded-full transition-opacity duration-500 " +
                  (n === etape
                    ? "bg-lune-or opacity-100"
                    : "bg-lune-lavande opacity-30")
                }
              />
            ))}
          </div>

          {/* Étape 1 : prénom */}
          {etape === 1 && (
            <div className="animate-[fadein_600ms_ease-out]">
              <h1 className="font-serif text-3xl text-lune-creme leading-tight mb-3">
                Bienvenue dans ce voyage
              </h1>
              <p className="font-serif italic text-base text-lune-or mb-8">
                Comment puis-je t'appeler&nbsp;?
              </p>

              <label
                htmlFor="prenom"
                className="block text-[10px] tracking-[0.25em] uppercase text-lune-lavande font-medium mb-2"
              >
                Ton prénom
              </label>
              <input
                id="prenom"
                type="text"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                placeholder="Luna"
                autoComplete="given-name"
                autoFocus
                className="w-full bg-transparent border-0 border-b border-lune-lavande/30 font-serif text-2xl text-lune-creme py-3 focus:outline-none focus:border-lune-or transition-colors duration-500 placeholder:text-lune-lavande/30"
              />
            </div>
          )}

          {/* Étape 2 : date des dernières règles */}
          {etape === 2 && (
            <div className="animate-[fadein_600ms_ease-out]">
              <h1 className="font-serif text-3xl text-lune-creme leading-tight mb-3">
                Tes derniers jours rouges
              </h1>
              <p className="font-serif italic text-base text-lune-or mb-8">
                Le premier jour de tes dernières règles
              </p>

              <label
                htmlFor="dernieresRegles"
                className="block text-[10px] tracking-[0.25em] uppercase text-lune-lavande font-medium mb-2"
              >
                Date
              </label>
              <input
                id="dernieresRegles"
                type="date"
                value={dernieresRegles}
                onChange={(e) => setDernieresRegles(e.target.value)}
                max={aujourdhuiISO()}
                className="w-full bg-transparent border-0 border-b border-lune-lavande/30 font-serif text-2xl text-lune-creme py-3 focus:outline-none focus:border-lune-or transition-colors duration-500 [color-scheme:dark]"
              />

              <p className="text-xs text-lune-lavande/70 mt-4 italic leading-relaxed">
                Pas certaine du jour exact&nbsp;? Approche-toi au plus près,
                ton corps fera le reste.
              </p>
            </div>
          )}

          {/* Étape 3 : durée moyenne du cycle */}
          {etape === 3 && (
            <div className="animate-[fadein_600ms_ease-out]">
              <h1 className="font-serif text-3xl text-lune-creme leading-tight mb-3">
                Ton rythme intérieur
              </h1>
              <p className="font-serif italic text-base text-lune-or mb-8">
                En moyenne, combien de jours dure ton cycle&nbsp;?
              </p>

              <div className="text-center mb-6">
                <span className="font-serif text-6xl text-lune-creme leading-none">
                  {dureeCycle}
                </span>
                <span className="font-serif italic text-lg text-lune-lavande ml-2">
                  jours
                </span>
              </div>

              <input
                type="range"
                min={21}
                max={35}
                step={1}
                value={dureeCycle}
                onChange={(e) => setDureeCycle(Number(e.target.value))}
                className="w-full accent-lune-or"
                aria-label="Durée moyenne du cycle en jours"
              />

              <div className="flex justify-between text-[10px] tracking-[0.25em] uppercase text-lune-lavande/70 font-medium mt-2">
                <span>21 j</span>
                <span>28 j</span>
                <span>35 j</span>
              </div>

              <p className="text-xs text-lune-lavande/70 mt-6 italic leading-relaxed">
                C'est une moyenne. Ton cycle peut varier d'un mois à l'autre,
                et c'est normal.
              </p>
            </div>
          )}
        </div>

        {/* Zone boutons, fixée en bas */}
        <div className="px-6 pb-10 flex items-center justify-between gap-4">
          {etape > 1 ? (
            <button
              type="button"
              onClick={precedent}
              className="font-serif italic text-sm text-lune-lavande hover:text-lune-creme transition-colors duration-300"
            >
              ← Retour
            </button>
          ) : (
            <span aria-hidden="true" />
          )}

          {etape < 3 ? (
            <button
              type="button"
              onClick={suivant}
              disabled={
                (etape === 1 && !prenomValide) || (etape === 2 && !dateValide)
              }
              className="font-serif text-base text-lune-creme px-6 py-2.5 rounded-full border border-lune-or/40 hover:bg-lune-or/10 transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Suivant →
            </button>
          ) : (
            <button
              type="button"
              onClick={terminer}
              className="font-serif text-base text-nuit-abysse bg-lune-or px-6 py-2.5 rounded-full hover:bg-lune-or-pale transition-all duration-500"
            >
              Commencer ✦
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
