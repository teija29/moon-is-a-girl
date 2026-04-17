"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/hooks/useUserProfile";
import { calculerJourDuCycle, phaseDuCycle } from "@/lib/cycle";
import StarField from "@/components/layout/StarField";
import MoonWordmark from "@/components/layout/MoonWordmark";
import GreetingHeader from "@/components/layout/GreetingHeader";
import BottomNav from "@/components/layout/BottomNav";
import CycleWheel from "@/components/cycle/CycleWheel";
import CyclesInfoCard from "@/components/cycle/CyclesInfoCard";
import JournalCTA from "@/components/journal/JournalCTA";

// Valeurs du cycle lunaire HARDCODÉES pour l'instant.
// Seront remplacées par des données calculées astronomiquement au Prompt 3.
const LUNE_DEMO = {
  lunarPhaseName: "Gibbeuse",
  lunarPhaseQualifier: "Croissante",
  lunarPhasePercent: 82,
};

export default function HomePage() {
  const router = useRouter();
  const { chargement, profil } = useUserProfile();

  // Redirection vers l'onboarding si aucun profil.
  useEffect(() => {
    if (!chargement && !profil) {
      router.replace("/onboarding");
    }
  }, [chargement, profil, router]);

  // Pendant le chargement du localStorage ou juste avant la redirection :
  // on affiche juste le halo nocturne pour éviter un flash de contenu vide.
  if (chargement || !profil) {
    return (
      <main className="relative min-h-screen overflow-hidden">
        <StarField />
        <MoonWordmark />
      </main>
    );
  }

  // Calcul des données du cycle courant.
  const dateRegles = new Date(profil.dernieresRegles);
  const jourCycle = calculerJourDuCycle(dateRegles, profil.dureeCycle);
  const phase = phaseDuCycle(jourCycle, profil.dureeCycle);

  return (
    <main className="relative min-h-screen overflow-hidden pb-28">
      <StarField />

      <div className="relative z-10">
        <MoonWordmark />

        <div className="px-6">
          <GreetingHeader prenom={profil.prenom} />

          <div className="flex justify-center mb-7">
            <CycleWheel
              cycleDay={jourCycle}
              cycleLength={profil.dureeCycle}
              lunarPhasePercent={LUNE_DEMO.lunarPhasePercent}
            />
          </div>

          <CyclesInfoCard
            cycleDay={jourCycle}
            cyclePhase={phase.sousTitre}
            lunarPhaseName={LUNE_DEMO.lunarPhaseName}
            lunarPhaseQualifier={LUNE_DEMO.lunarPhaseQualifier}
            lunarPhasePercent={LUNE_DEMO.lunarPhasePercent}
          />

          <JournalCTA />
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
