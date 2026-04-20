"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/hooks/useUserProfile";
import { creerClientNavigateur } from "@/lib/supabase/client";
import {
  lirePreferencesNotifCompletes,
  sauvegarderPreferencesNotif,
  enregistrerPushSubscription,
  supprimerPushSubscription,
  type PreferencesNotifComplete,
} from "@/lib/storage";
import {
  creerAbonnementPush,
  supprimerAbonnementPush,
  etatPermissionNotif,
} from "@/lib/push/client";
import StarField from "@/components/layout/StarField";
import MoonWordmark from "@/components/layout/MoonWordmark";

const PREFS_DEFAUT: PreferencesNotifComplete = {
  actif: false,
  heureRituelSoir: 21,
  notifRituelSoir: true,
  notifPleineLune: true,
  notifReglesProches: true,
  notifOvulation: true,
  fuseauHoraire: "Europe/Paris",
};

export default function NotificationsPage() {
  const router = useRouter();
  const { chargement, utilisateur } = useUserProfile();
  const [supabase] = useState(() => creerClientNavigateur());

  const [prefs, setPrefs] = useState<PreferencesNotifComplete>(PREFS_DEFAUT);
  const [chargementPrefs, setChargementPrefs] = useState(true);
  const [enTraitement, setEnTraitement] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageErreur, setMessageErreur] = useState<string | null>(null);
  const [permission, setPermission] = useState<
    "default" | "granted" | "denied" | "unsupported"
  >("default");

  useEffect(() => {
    setPermission(etatPermissionNotif());
  }, []);

  useEffect(() => {
    if (chargement) return;
    if (!utilisateur) {
      router.replace("/login");
      return;
    }
    (async () => {
      const p = await lirePreferencesNotifCompletes(supabase, utilisateur.id);
      if (p) setPrefs(p);
      setChargementPrefs(false);
    })();
  }, [chargement, utilisateur, router, supabase]);

  if (chargement || chargementPrefs || !utilisateur) {
    return (
      <main className="relative min-h-screen overflow-hidden">
        <StarField />
        <MoonWordmark />
      </main>
    );
  }

  const activer = async () => {
    setEnTraitement(true);
    setMessageErreur(null);
    setMessage(null);
    try {
      const clePub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!clePub) throw new Error("Clé VAPID manquante");

      const abo = await creerAbonnementPush(clePub);
      if (!abo) {
        setPermission(etatPermissionNotif());
        setMessageErreur(
          "Les notifications ont été refusées. Pour les activer, ajuste les réglages de ton navigateur."
        );
        setEnTraitement(false);
        return;
      }

      await enregistrerPushSubscription(supabase, utilisateur.id, {
        ...abo,
        userAgent: navigator.userAgent,
      });

      const nouvellesPrefs = { ...prefs, actif: true };
      await sauvegarderPreferencesNotif(
        supabase,
        utilisateur.id,
        nouvellesPrefs
      );
      setPrefs(nouvellesPrefs);
      setPermission("granted");
      setMessage("Notifications activées ✦");
    } catch (e) {
      console.error(e);
      setMessageErreur("Une erreur est survenue. Réessaie dans un instant.");
    }
    setEnTraitement(false);
  };

  const desactiver = async () => {
    setEnTraitement(true);
    setMessageErreur(null);
    setMessage(null);
    try {
      const endpoint = await supprimerAbonnementPush();
      if (endpoint) {
        await supprimerPushSubscription(supabase, utilisateur.id, endpoint);
      }
      const nouvellesPrefs = { ...prefs, actif: false };
      await sauvegarderPreferencesNotif(
        supabase,
        utilisateur.id,
        nouvellesPrefs
      );
      setPrefs(nouvellesPrefs);
      setMessage("Notifications désactivées.");
    } catch (e) {
      console.error(e);
      setMessageErreur("Une erreur est survenue.");
    }
    setEnTraitement(false);
  };

  const majChamp = async <K extends keyof PreferencesNotifComplete>(
    champ: K,
    valeur: PreferencesNotifComplete[K]
  ) => {
    const nouvelles = { ...prefs, [champ]: valeur };
    setPrefs(nouvelles);
    try {
      await sauvegarderPreferencesNotif(supabase, utilisateur.id, nouvelles);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden pb-12">
      <StarField />
      <div className="relative z-10">
        <MoonWordmark />

        <div className="px-6 pt-2">
          <div className="mb-6">
            <p className="text-[10px] tracking-[0.25em] uppercase text-lune-lavande font-medium mb-2">
              Ton espace
            </p>
            <h1 className="font-serif text-3xl text-lune-creme leading-tight">
              Notifications
            </h1>
            <p className="font-serif italic text-sm text-lune-or mt-2">
              Reçois des rappels doux, jamais intrusifs.
            </p>
          </div>

          <div className="card-nocturne rounded-[20px] px-[18px] py-5 mb-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <p className="font-serif text-[16px] text-lune-creme">
                  Activer les notifications
                </p>
                <p className="text-[11px] text-lune-lavande mt-1 leading-relaxed">
                  {prefs.actif
                    ? "Tu recevras des rappels selon tes préférences."
                    : "Aucune notification envoyée pour l'instant."}
                </p>
              </div>
              <button
                type="button"
                onClick={prefs.actif ? desactiver : activer}
                disabled={enTraitement || permission === "denied"}
                className="font-serif text-sm text-nuit-abysse px-5 py-2 rounded-full transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  background: prefs.actif ? "#C89CA8" : "#D4AF7A",
                }}
              >
                {enTraitement
                  ? "…"
                  : prefs.actif
                  ? "Désactiver"
                  : "Activer ✦"}
              </button>
            </div>

            {permission === "denied" && (
              <p className="text-xs text-cycle-rose mt-3 italic leading-relaxed">
                Les notifications sont bloquées au niveau de ton navigateur.
                Autorise-les dans les réglages du site pour pouvoir les activer.
              </p>
            )}

            {message && (
              <p className="text-xs text-lune-or mt-3 italic">{message}</p>
            )}
            {messageErreur && (
              <p className="text-xs text-cycle-rose mt-3 italic">
                {messageErreur}
              </p>
            )}
          </div>

          <p className="text-[10px] tracking-[0.25em] uppercase text-lune-lavande/60 font-medium mt-4 mb-3 px-2">
            Quelles notifications recevoir
          </p>

          <div
            className={
              "space-y-2.5 transition-opacity duration-500 " +
              (prefs.actif ? "opacity-100" : "opacity-40 pointer-events-none")
            }
          >
            <LigneToggle
              titre="Rituel du soir"
              description="Une invitation douce à écrire dans ton journal"
              actif={prefs.notifRituelSoir}
              onToggle={() =>
                majChamp("notifRituelSoir", !prefs.notifRituelSoir)
              }
            />

            {prefs.notifRituelSoir && (
              <div className="card-nocturne rounded-[20px] px-[18px] py-4 animate-[fadein_400ms_ease-out]">
                <p className="text-[10px] tracking-[0.25em] uppercase text-lune-lavande font-medium mb-3">
                  Heure du rituel
                </p>
                <div className="flex items-center justify-between gap-4">
                  <input
                    type="range"
                    min={17}
                    max={23}
                    step={1}
                    value={prefs.heureRituelSoir}
                    onChange={(e) =>
                      majChamp("heureRituelSoir", Number(e.target.value))
                    }
                    className="flex-1 accent-lune-or"
                    aria-label="Heure d'envoi du rituel du soir"
                  />
                  <span className="font-serif text-lg text-lune-creme min-w-[56px] text-right">
                    {String(prefs.heureRituelSoir).padStart(2, "0")}h
                  </span>
                </div>
              </div>
            )}

            <LigneToggle
              titre="Pleine lune"
              description="Rappel la veille de chaque pleine lune"
              actif={prefs.notifPleineLune}
              onToggle={() =>
                majChamp("notifPleineLune", !prefs.notifPleineLune)
              }
            />

            <LigneToggle
              titre="Règles imminentes"
              description="2 jours avant la date prévue"
              actif={prefs.notifReglesProches}
              onToggle={() =>
                majChamp("notifReglesProches", !prefs.notifReglesProches)
              }
            />

            <LigneToggle
              titre="Ovulation"
              description="Le jour de ta fenêtre la plus fertile"
              actif={prefs.notifOvulation}
              onToggle={() =>
                majChamp("notifOvulation", !prefs.notifOvulation)
              }
            />
          </div>

          <div className="flex items-center justify-start gap-4 mt-10">
            <button
              type="button"
              onClick={() => router.push("/moi")}
              className="font-serif italic text-sm text-lune-lavande hover:text-lune-creme transition-colors duration-300"
            >
              ← Retour
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function LigneToggle({
  titre,
  description,
  actif,
  onToggle,
}: {
  titre: string;
  description: string;
  actif: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="card-nocturne w-full rounded-[20px] px-[18px] py-4 flex items-center gap-3.5 text-left cursor-pointer hover:bg-nuit-encre/60 transition-colors duration-300"
      aria-pressed={actif}
    >
      <div className="flex-1 min-w-0">
        <p className="font-serif text-[15px] text-lune-creme m-0 leading-tight">
          {titre}
        </p>
        <p className="text-[11px] text-lune-lavande mt-0.5 leading-relaxed">
          {description}
        </p>
      </div>
      <div
        className="relative w-11 h-6 rounded-full transition-colors duration-300 flex-shrink-0"
        style={{
          background: actif ? "#D4AF7A" : "rgba(184, 169, 217, 0.25)",
        }}
      >
        <div
          className="absolute top-0.5 w-5 h-5 rounded-full bg-lune-creme transition-transform duration-300"
          style={{
            transform: actif ? "translateX(22px)" : "translateX(2px)",
          }}
        />
      </div>
    </button>
  );
}
