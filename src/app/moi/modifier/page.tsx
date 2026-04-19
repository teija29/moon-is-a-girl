"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/hooks/useUserProfile";
import StarField from "@/components/layout/StarField";
import MoonWordmark from "@/components/layout/MoonWordmark";
import ChampTexte from "@/components/moi/ChampTexte";
import ChampDate from "@/components/moi/ChampDate";
import ChampDureeCycle from "@/components/moi/ChampDureeCycle";

function aujourdhuiISO(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const jj = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${jj}`;
}

export default function ModifierProfilPage() {
  const router = useRouter();
  const { chargement, utilisateur, profil, enregistrer } = useUserProfile();

  const [prenom, setPrenom] = useState("");
  const [dernieresRegles, setDernieresRegles] = useState("");
  const [dureeCycle, setDureeCycle] = useState(28);
  const [sauvegarde, setSauvegarde] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    if (profil) {
      setPrenom(profil.prenom);
      setDernieresRegles(profil.dernieresRegles);
      setDureeCycle(profil.dureeCycle);
    }
  }, [profil]);

  useEffect(() => {
    if (chargement) return;
    if (!utilisateur) {
      router.replace("/login");
      return;
    }
    if (!profil) {
      router.replace("/onboarding");
    }
  }, [chargement, utilisateur, profil, router]);

  if (chargement || !utilisateur || !profil) {
    return (
      <main className="relative min-h-screen overflow-hidden">
        <StarField />
        <MoonWordmark />
      </main>
    );
  }

  const prenomValide = prenom.trim().length >= 2;
  const dateValide = dernieresRegles.length > 0;
  const peutValider = prenomValide && dateValide && !sauvegarde;

  const aChange =
    prenom !== profil.prenom ||
    dernieresRegles !== profil.dernieresRegles ||
    dureeCycle !== profil.dureeCycle;

  const enregistrerModifs = async () => {
    if (!peutValider) return;
    setSauvegarde(true);
    setErreur(null);
    try {
      await enregistrer({
        prenom: prenom.trim(),
        dernieresRegles,
        dureeCycle,
      });
      router.push("/moi");
    } catch (e) {
      console.error("Erreur sauvegarde profil:", e);
      setErreur("Une erreur est survenue. Réessaie dans un instant.");
      setSauvegarde(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden pb-12">
      <StarField />
      <div className="relative z-10">
        <MoonWordmark />

        <div className="px-6 pt-2">
          <div className="mb-8">
            <p className="text-[10px] tracking-[0.25em] uppercase text-lune-lavande font-medium mb-2">
              Ton espace
            </p>
            <h1 className="font-serif text-3xl text-lune-creme leading-tight">
              Modifier mon profil
            </h1>
            <p className="font-serif italic text-sm text-lune-or mt-2">
              Tes données peuvent évoluer — c&apos;est naturel.
            </p>
          </div>

          <div className="space-y-7">
            <ChampTexte
              id="prenom"
              label="Ton prénom"
              value={prenom}
              onChange={setPrenom}
              autoComplete="given-name"
              maxLength={50}
            />

            <ChampDate
              id="dernieres-regles"
              label="Premier jour de tes dernières règles"
              value={dernieresRegles}
              onChange={setDernieresRegles}
              max={aujourdhuiISO()}
            />

            <ChampDureeCycle value={dureeCycle} onChange={setDureeCycle} />
          </div>

          {erreur && (
            <p className="text-xs text-cycle-rose mt-6 italic text-center">
              {erreur}
            </p>
          )}

          <div className="flex items-center justify-between gap-4 mt-10">
            <button
              type="button"
              onClick={() => router.push("/moi")}
              className="font-serif italic text-sm text-lune-lavande hover:text-lune-creme transition-colors duration-300"
            >
              ← Retour
            </button>
            <button
              type="button"
              onClick={enregistrerModifs}
              disabled={!peutValider || !aChange}
              className="font-serif text-base text-nuit-abysse bg-lune-or px-6 py-2.5 rounded-full hover:bg-lune-or-pale transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {sauvegarde ? "Enregistrement…" : "Enregistrer ✦"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
