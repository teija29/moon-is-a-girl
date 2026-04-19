"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/hooks/useUserProfile";
import StarField from "@/components/layout/StarField";
import MoonWordmark from "@/components/layout/MoonWordmark";

const MOT_CONFIRMATION = "SUPPRIMER";

export default function SupprimerComptePage() {
  const router = useRouter();
  const { chargement, utilisateur, deconnecter } = useUserProfile();

  const [motTape, setMotTape] = useState("");
  const [suppression, setSuppression] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    if (chargement) return;
    if (!utilisateur) {
      router.replace("/login");
    }
  }, [chargement, utilisateur, router]);

  if (chargement || !utilisateur) {
    return (
      <main className="relative min-h-screen overflow-hidden">
        <StarField />
        <MoonWordmark />
      </main>
    );
  }

  const peutSupprimer = motTape === MOT_CONFIRMATION && !suppression;

  const supprimer = async () => {
    if (!peutSupprimer) return;
    setSuppression(true);
    setErreur(null);

    try {
      const reponse = await fetch("/api/compte/supprimer", {
        method: "POST",
      });

      if (!reponse.ok) {
        const data = await reponse.json().catch(() => ({}));
        throw new Error(data.message || "Échec de la suppression");
      }

      await deconnecter();
      router.push("/login?compte=supprime");
    } catch (e) {
      console.error("Erreur suppression compte:", e);
      setErreur(
        "Une erreur est survenue lors de la suppression. Contacte-nous si le problème persiste."
      );
      setSuppression(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden pb-12">
      <StarField />
      <div className="relative z-10">
        <MoonWordmark />

        <div className="px-6 pt-2">
          <div className="mb-8">
            <p className="text-[10px] tracking-[0.25em] uppercase text-cycle-rose font-medium mb-2">
              Action définitive
            </p>
            <h1 className="font-serif text-3xl text-lune-creme leading-tight">
              Supprimer mon compte
            </h1>
          </div>

          <div
            className="rounded-[20px] px-5 py-5 mb-6"
            style={{
              background: "rgba(200, 156, 168, 0.08)",
              border: "0.5px solid rgba(200, 156, 168, 0.25)",
            }}
          >
            <p className="font-serif italic text-[15px] text-lune-creme leading-relaxed mb-4">
              Tu t&apos;apprêtes à effacer définitivement ton espace Moon is a
              Girl.
            </p>
            <p className="text-sm text-lune-lavande leading-relaxed mb-3">
              Seront supprimés :
            </p>
            <ul className="space-y-1.5 text-sm text-lune-lavande list-none pl-0">
              <li className="flex items-start gap-2">
                <span className="text-cycle-rose mt-0.5">✦</span>
                <span>Ton profil (prénom, cycle, dates)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cycle-rose mt-0.5">✦</span>
                <span>L&apos;intégralité de tes pages de journal</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cycle-rose mt-0.5">✦</span>
                <span>Tes préférences et réglages</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cycle-rose mt-0.5">✦</span>
                <span>Ton adresse email de connexion</span>
              </li>
            </ul>
            <p className="text-sm text-cycle-rose italic mt-4 leading-relaxed">
              Cette action est irréversible. Aucune récupération possible.
            </p>
          </div>

          <p className="text-[11px] tracking-[0.1em] text-lune-lavande mb-3">
            Pour confirmer, tape le mot{" "}
            <span className="font-serif italic text-cycle-rose text-sm tracking-normal">
              {MOT_CONFIRMATION}
            </span>{" "}
            ci-dessous :
          </p>

          <input
            type="text"
            value={motTape}
            onChange={(e) => setMotTape(e.target.value.toUpperCase())}
            placeholder={MOT_CONFIRMATION}
            autoComplete="off"
            className="w-full bg-transparent border-0 border-b border-cycle-rose/30 font-serif text-xl text-cycle-rose py-3 focus:outline-none focus:border-cycle-rose transition-colors duration-500 placeholder:text-cycle-rose/20 tracking-widest"
          />

          {erreur && (
            <p className="text-xs text-cycle-rose mt-4 italic">{erreur}</p>
          )}

          <div className="flex items-center justify-between gap-4 mt-10">
            <button
              type="button"
              onClick={() => router.push("/moi")}
              className="font-serif italic text-sm text-lune-lavande hover:text-lune-creme transition-colors duration-300"
            >
              ← Retour, je renonce
            </button>
            <button
              type="button"
              onClick={supprimer}
              disabled={!peutSupprimer}
              className="font-serif text-base text-nuit-abysse px-6 py-2.5 rounded-full transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background: "#C89CA8" }}
            >
              {suppression ? "Suppression…" : "Supprimer définitivement"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
