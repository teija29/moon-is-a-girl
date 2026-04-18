"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/hooks/useUserProfile";
import { calculerJourDuCycle, phaseDuCycle } from "@/lib/cycle";
import { getEtatLune } from "@/lib/lune";
import StarField from "@/components/layout/StarField";
import MoonWordmark from "@/components/layout/MoonWordmark";
import GreetingHeader from "@/components/layout/GreetingHeader";
import BottomNav from "@/components/layout/BottomNav";
import CycleWheel from "@/components/cycle/CycleWheel";
import CyclesInfoCard from "@/components/cycle/CyclesInfoCard";
import JournalCTA from "@/components/journal/JournalCTA";

export default function HomePage() {
  const router = useRouter();
  const { chargement, profil } = useUserProfile();

  useEffect(() => {
    if (!chargement && !profil) {
      router.replace("/onboarding");
    }
  }, [chargement, profil, router]);

  if (chargement || !profil) {
    return (
      <main className="relative min-h-screen overflow-hidden">
        <StarField />
        <MoonWordmark />
      </main>
    );
  }

  // Cycle menstruel (données utilisatrice)
  const dateRegles = new Date(profil.dernieresRegles);
  const jourCycle = calculerJourDuCycle(dateRegles, profil.dureeCycle);
  const phase = phaseDuCycle(jourCycle, profil.dureeCycle);

  // Cycle lunaire (calcul astronomique en temps réel)
  const lune = getEtatLune();

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
              lunePhase={lune.phase}
            />
          </div>

          <CyclesInfoCard
            cycleDay={jourCycle}
            cyclePhase={phase.sousTitre}
            lunarPhaseName={lune.titre}
            lunarPhaseSubtitle={lune.sousTitre}
            joursJusquaPleineLune={lune.joursJusquaPleineLune}
          />

          <JournalCTA />
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
