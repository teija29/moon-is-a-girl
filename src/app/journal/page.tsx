"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useJournal } from "@/hooks/useJournal";
import StarField from "@/components/layout/StarField";
import MoonWordmark from "@/components/layout/MoonWordmark";
import BottomNav from "@/components/layout/BottomNav";
import JournalEditor from "@/components/journal/JournalEditor";

export default function JournalPage() {
  const router = useRouter();
  const { chargement: chargementProfil, profil } = useUserProfile();
  const { chargement: chargementJournal, entreeDuJour } = useJournal();

  useEffect(() => {
    if (!chargementProfil && !profil) {
      router.replace("/onboarding");
    }
  }, [chargementProfil, profil, router]);

  if (chargementProfil || chargementJournal || !profil) {
    return (
      <main className="relative min-h-screen overflow-hidden">
        <StarField />
        <MoonWordmark />
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden pb-28">
      <StarField />
      <div className="relative z-10">
        <MoonWordmark />
        <div className="px-6">
          <JournalEditor entreeInitiale={entreeDuJour} />
        </div>
      </div>
      <BottomNav activeTab="journal" />
    </main>
  );
}
