"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const CLE_VISITES = "moon-is-a-girl:visites";
const CLE_INVITE_VUE = "moon-is-a-girl:install-prompt-vu";
const SEUIL_VISITES = 3;

function estIOS(): boolean {
  if (typeof window === "undefined") return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !("MSStream" in (window as unknown as Record<string, unknown>))
  );
}

function estStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

export default function InstallPrompt() {
  const [visible, setVisible] = useState(false);
  const [modeIOS, setModeIOS] = useState(false);
  const [evenementInstall, setEvenementInstall] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (estStandalone()) return;
    if (window.localStorage.getItem(CLE_INVITE_VUE) === "1") return;

    const visites = Number(window.localStorage.getItem(CLE_VISITES) ?? "0") + 1;
    window.localStorage.setItem(CLE_VISITES, String(visites));
    if (visites < SEUIL_VISITES) return;

    const surIOS = estIOS();
    setModeIOS(surIOS);

    if (surIOS) {
      const t = window.setTimeout(() => setVisible(true), 1500);
      return () => window.clearTimeout(t);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setEvenementInstall(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const fermer = () => {
    setVisible(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(CLE_INVITE_VUE, "1");
    }
  };

  const installer = async () => {
    if (!evenementInstall) return;
    await evenementInstall.prompt();
    await evenementInstall.userChoice;
    fermer();
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-4 bottom-[96px] z-30 animate-[fadein_600ms_ease-out]"
      role="dialog"
      aria-labelledby="install-titre"
    >
      <div
        className="rounded-[20px] border px-4 py-4"
        style={{
          background: "rgba(11, 13, 31, 0.92)",
          borderColor: "rgba(212, 175, 122, 0.35)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(212, 175, 122, 0.15)" }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#D4AF7A"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <path d="M20 12 A 8 8 0 1 1 12 4 A 6 6 0 0 0 20 12 Z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p
              id="install-titre"
              className="font-serif italic text-[15px] text-lune-creme leading-tight"
            >
              Garde la lune à portée de main
            </p>
            {modeIOS ? (
              <p className="text-[12px] text-lune-lavande mt-1.5 leading-relaxed">
                Tape le bouton{" "}
                <strong className="text-lune-or">Partager</strong> de Safari,
                puis{" "}
                <strong className="text-lune-or">
                  Sur l&apos;écran d&apos;accueil
                </strong>
                .
              </p>
            ) : (
              <p className="text-[12px] text-lune-lavande mt-1.5 leading-relaxed">
                Ajoute Moon is a Girl à ton écran d&apos;accueil, comme une
                vraie app.
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={fermer}
            aria-label="Fermer"
            className="text-lune-lavande/60 hover:text-lune-creme text-lg leading-none"
          >
            ×
          </button>
        </div>
        {!modeIOS && (
          <div className="flex justify-end gap-3 mt-3">
            <button
              type="button"
              onClick={fermer}
              className="font-serif italic text-xs text-lune-lavande hover:text-lune-creme transition-colors duration-300"
            >
              plus tard
            </button>
            <button
              type="button"
              onClick={installer}
              className="font-serif text-xs text-nuit-abysse bg-lune-or px-4 py-1.5 rounded-full hover:bg-lune-or-pale transition-all duration-500"
            >
              Installer ✦
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
