"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useJournal } from "@/hooks/useJournal";
import { calculerJourDuCycle, phaseDuCycle } from "@/lib/cycle";
import { getEtatLune } from "@/lib/lune";
import StarField from "@/components/layout/StarField";
import MoonWordmark from "@/components/layout/MoonWordmark";
import GreetingHeader from "@/components/layout/GreetingHeader";
import BottomNav from "@/components/layout/BottomNav";
import CycleWheel from "@/components/cycle/CycleWheel";
import CyclesInfoCard from "@/components/cycle/CyclesInfoCard";
import JournalCTA from "@/components/journal/JournalCTA";
import MigrationRunner from "@/components/auth/MigrationRunner";

export default function HomePage() {
  const router = useRouter();
  const { chargement: chargementProfil, profil, utilisateur } = useUserProfile();
  const { chargement: chargementJournal, entreeDuJour, aEcritAujourdhui } =
    useJournal();

  useEffect(() => {
    if (chargementProfil || chargementJournal) return;
    if (!utilisateur) {
      router.replace("/login");
      return;
    }
    if (!profil) {
      router.replace("/onboarding");
    }
  }, [chargementProfil, chargementJournal, utilisateur, profil, router]);

  if (chargementProfil || chargementJournal || !utilisateur || !profil) {
    return (
      <main className="relative min-h-screen overflow-hidden">
        <StarField />
        <MoonWordmark />
      </main>
    );
  }

  const dateRegles = new Date(profil.dernieresRegles);
  const jourCycle = calculerJourDuCycle(dateRegles, profil.dureeCycle);
  const phase = phaseDuCycle(jourCycle, profil.dureeCycle);
  const lune = getEtatLune();

  return (
    <main className="relative min-h-screen overflow-hidden pb-28">
      <StarField />
      <MigrationRunner />
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

          <JournalCTA
            dejaEcrit={aEcritAujourdhui}
            apercuPensee={entreeDuJour.pensee}
          />
        </div>
      </div>
      <BottomNav activeTab="lune" />
    </main>
  );
}
