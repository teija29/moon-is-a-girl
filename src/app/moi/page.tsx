"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/hooks/useUserProfile";
import StarField from "@/components/layout/StarField";
import MoonWordmark from "@/components/layout/MoonWordmark";
import BottomNav from "@/components/layout/BottomNav";
import CarteProfil from "@/components/moi/CarteProfil";
import CarteAction from "@/components/moi/CarteAction";
import SelecteurLangue from "@/components/moi/SelecteurLangue";
import CarteModeCouple from "@/components/moi/CarteModeCouple";

export default function MoiPage() {
  const router = useRouter();
  const { chargement, utilisateur, profil, deconnecter } = useUserProfile();

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

  const confirmerDeconnexion = async () => {
    if (!window.confirm("Tu veux bien te déconnecter de Moon is a Girl ?")) {
      return;
    }
    await deconnecter();
    router.push("/login");
  };

  return (
    <main className="relative min-h-screen overflow-hidden pb-28">
      <StarField />
      <div className="relative z-10">
        <MoonWordmark />

        <div className="px-6 pt-2">
          <div className="mb-6">
            <p className="text-[10px] tracking-[0.25em] uppercase text-lune-lavande font-medium mb-2">
              Ton espace
            </p>
            <h1 className="font-serif text-3xl text-lune-creme leading-tight">
              Bonjour, toi
            </h1>
          </div>

          <CarteProfil profil={profil} email={utilisateur.email ?? null} />

          <div className="mt-5 space-y-2.5">
            <CarteAction
              href="/moi/modifier"
              titre="Modifier mon profil"
              description="Prénom, date, durée du cycle"
              icone={
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 20 L9 19 L20 8 A 2 2 0 0 0 17 5 L6 16 Z" />
                </svg>
              }
            />
          </div>

          <p className="text-[10px] tracking-[0.25em] uppercase text-lune-lavande/60 font-medium mt-8 mb-3 px-2">
            Préférences
          </p>
          <div className="space-y-2.5">
            <SelecteurLangue />
          </div>

          <p className="text-[10px] tracking-[0.25em] uppercase text-lune-lavande/60 font-medium mt-8 mb-3 px-2">
            Bientôt
          </p>
          <CarteModeCouple />

          <p className="text-[10px] tracking-[0.25em] uppercase text-lune-lavande/60 font-medium mt-8 mb-3 px-2">
            Compte
          </p>
          <div className="space-y-2.5">
            <CarteAction
              onClick={confirmerDeconnexion}
              titre="Se déconnecter"
              description="Quitter la session actuelle"
              icone={
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 16 L19 12 L15 8" />
                  <path d="M19 12 H9" />
                  <path d="M9 4 H5 A 2 2 0 0 0 3 6 V 18 A 2 2 0 0 0 5 20 H 9" />
                </svg>
              }
            />
            <CarteAction
              href="/moi/supprimer"
              titre="Supprimer mon compte"
              description="Effacement définitif de mes données"
              variant="danger"
              icone={
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 7 H 20" />
                  <path d="M10 11 V 17" />
                  <path d="M14 11 V 17" />
                  <path d="M6 7 L 7 20 A 2 2 0 0 0 9 22 H 15 A 2 2 0 0 0 17 20 L 18 7" />
                  <path d="M9 7 V 4 A 2 2 0 0 1 11 2 H 13 A 2 2 0 0 1 15 4 V 7" />
                </svg>
              }
            />
          </div>

          <p className="text-[10px] text-lune-lavande/40 italic text-center mt-10 leading-relaxed px-4">
            Tes données t&apos;appartiennent. À tout moment, tu peux les
            modifier ou les effacer.
          </p>
        </div>
      </div>
      <BottomNav activeTab="moi" />
    </main>
  );
}
