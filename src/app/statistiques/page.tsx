"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStatistiques } from "@/hooks/useStatistiques";
import StarField from "@/components/layout/StarField";
import MoonWordmark from "@/components/layout/MoonWordmark";
import BottomNav from "@/components/layout/BottomNav";
import EcranChargement from "@/components/layout/EcranChargement";
import CarteRetard from "@/components/stats/CarteRetard";
import CarteRegularite from "@/components/stats/CarteRegularite";
import GraphiqueHumeursParPhase from "@/components/stats/GraphiqueHumeursParPhase";
import CarteCorrelationLune from "@/components/stats/CarteCorrelationLune";
import CalendrierMois from "@/components/stats/CalendrierMois";

export default function StatistiquesPage() {
  const router = useRouter();
  const stats = useStatistiques();

  useEffect(() => {
    if (stats.chargement) return;
    if (!stats.utilisateur) {
      router.replace("/login");
      return;
    }
    if (!stats.profil) {
      router.replace("/onboarding");
    }
  }, [stats.chargement, stats.utilisateur, stats.profil, router]);

  if (stats.chargement || !stats.utilisateur || !stats.profil) {
    return <EcranChargement />;
  }

  return (
    <main className="relative min-h-screen overflow-hidden pb-28">
      <StarField />

      <div className="relative z-10">
        <MoonWordmark />

        <div className="px-6 pt-2">
          <div className="mb-6">
            <p className="text-[10px] tracking-[0.25em] uppercase text-lune-lavande font-medium mb-2">
              Ton miroir lunaire
            </p>
            <h1 className="font-serif text-3xl text-lune-creme leading-tight">
              Ce que je vois de toi
            </h1>
          </div>

          {/* 1. Retard éventuel (affiché en haut si pertinent) */}
          {stats.retard && <CarteRetard stat={stats.retard} />}

          {/* 2. Calendrier */}
          <CalendrierMois
            jours={stats.calendrier}
            mois={stats.moisAffiche}
            annee={stats.anneeAffichee}
            onMoisPrecedent={stats.moisPrecedent}
            onMoisSuivant={stats.moisSuivant}
            onAujourdhui={stats.revenirAujourdhui}
          />

          {/* 3. Régularité */}
          {stats.regularite && <CarteRegularite stat={stats.regularite} />}

          {/* 4. Humeurs × phase */}
          {stats.humeursParPhase && (
            <GraphiqueHumeursParPhase stat={stats.humeursParPhase} />
          )}

          {/* 5. Corrélation lune */}
          {stats.correlationLune && (
            <CarteCorrelationLune stat={stats.correlationLune} />
          )}

          <p className="text-[10px] text-lune-lavande/40 italic text-center mt-8 leading-relaxed px-4">
            Plus tu écris dans ton journal, plus ton miroir devient précis.
          </p>
        </div>
      </div>

      <BottomNav activeTab="cycle" />
    </main>
  );
}
