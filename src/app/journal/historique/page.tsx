"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useJournal } from "@/hooks/useJournal";
import StarField from "@/components/layout/StarField";
import MoonWordmark from "@/components/layout/MoonWordmark";
import EcranChargement from "@/components/layout/EcranChargement";
import BottomNav from "@/components/layout/BottomNav";
import JournalEntryCard from "@/components/journal/JournalEntryCard";

export default function JournalHistoriquePage() {
  const router = useRouter();
  const { chargement: chargementProfil, profil, utilisateur } = useUserProfile();
  const { chargement: chargementJournal, entrees } = useJournal();

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

  // Tri décroissant par date (plus récent en haut).
  const entreesTriees = useMemo(() => {
    return Object.values(entrees).sort((a, b) =>
      a.date < b.date ? 1 : a.date > b.date ? -1 : 0
    );
  }, [entrees]);

  if (chargementProfil || chargementJournal || !utilisateur || !profil) {
    return <EcranChargement />;
  }

  return (
    <main className="relative min-h-screen overflow-hidden pb-28">
      <StarField />
      <div className="relative z-10">
        <MoonWordmark />

        <div className="px-6">
          <div className="mb-6">
            <p className="text-[10px] tracking-[0.25em] uppercase text-lune-lavande font-medium mb-2">
              Ton journal
            </p>
            <h1 className="font-serif text-3xl text-lune-creme leading-tight">
              Tes pages passées
            </h1>
          </div>

          {entreesTriees.length === 0 ? (
            <div className="card-nocturne rounded-[20px] px-6 py-10 text-center">
              <p className="font-serif italic text-base text-lune-creme/80 leading-relaxed">
                Aucune page déposée pour l'instant.
              </p>
              <p className="text-xs text-lune-lavande/70 mt-3">
                Ta première trace commencera ici.
              </p>
              <button
                type="button"
                onClick={() => router.push("/journal")}
                className="mt-5 font-serif text-sm text-nuit-abysse bg-lune-or px-5 py-2 rounded-full hover:bg-lune-or-pale transition-all duration-500"
              >
                Écrire maintenant ✦
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {entreesTriees.map((e) => (
                <JournalEntryCard key={e.date} entree={e} />
              ))}
            </div>
          )}
        </div>
      </div>
      <BottomNav activeTab="historique" />
    </main>
  );
}
