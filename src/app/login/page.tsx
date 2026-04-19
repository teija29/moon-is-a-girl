"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { creerClientNavigateur } from "@/lib/supabase/client";
import StarField from "@/components/layout/StarField";
import MoonWordmark from "@/components/layout/MoonWordmark";

function LoginContent() {
  const [supabase] = useState(() => creerClientNavigateur());
  const searchParams = useSearchParams();
  const compteSupprime = searchParams.get("compte") === "supprime";

  const [email, setEmail] = useState("");
  const [etat, setEtat] = useState<"idle" | "envoi" | "envoye" | "erreur">(
    "idle"
  );
  const [messageErreur, setMessageErreur] = useState<string>("");

  const emailValide = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const envoyerLien = async () => {
    if (!emailValide) return;
    setEtat("envoi");
    setMessageErreur("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setEtat("erreur");
      setMessageErreur(error.message);
    } else {
      setEtat("envoye");
    }
  };

  return (
    <div className="relative z-10 flex flex-col min-h-screen">
      <MoonWordmark />

      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        {etat === "envoye" ? (
          <div className="animate-[fadein_600ms_ease-out] text-center">
            <h1 className="font-serif text-3xl text-lune-creme leading-tight mb-4">
              Ton lien est en chemin
            </h1>
            <p className="font-serif italic text-base text-lune-or mb-2">
              Regarde ta boîte aux lettres
            </p>
            <p className="text-xs text-lune-lavande/70 mt-6 leading-relaxed">
              Un email vient d&apos;être envoyé à {email}.
              Clique sur le lien pour te connecter.
            </p>
            <button
              type="button"
              onClick={() => {
                setEtat("idle");
                setEmail("");
              }}
              className="mt-8 font-serif italic text-sm text-lune-lavande hover:text-lune-creme transition-colors duration-300"
            >
              ← utiliser une autre adresse
            </button>
          </div>
        ) : (
          <div className="animate-[fadein_600ms_ease-out]">
            {compteSupprime && (
              <div
                className="mb-6 rounded-[16px] px-4 py-3"
                style={{
                  background: "rgba(212, 175, 122, 0.08)",
                  border: "0.5px solid rgba(212, 175, 122, 0.25)",
                }}
              >
                <p className="font-serif italic text-sm text-lune-creme leading-snug">
                  Ton compte a été effacé. Merci pour ce bout de chemin
                  parcouru.
                </p>
              </div>
            )}

            <h1 className="font-serif text-3xl text-lune-creme leading-tight mb-3">
              Retrouve ton espace
            </h1>
            <p className="font-serif italic text-base text-lune-or mb-10">
              Pas de mot de passe à retenir — juste ton email
            </p>

            <label
              htmlFor="email"
              className="block text-[10px] tracking-[0.25em] uppercase text-lune-lavande font-medium mb-2"
            >
              Ton email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && envoyerLien()}
              placeholder="toi@exemple.com"
              className="w-full bg-transparent border-0 border-b border-lune-lavande/30 font-serif text-xl text-lune-creme py-3 focus:outline-none focus:border-lune-or transition-colors duration-500 placeholder:text-lune-lavande/30"
            />

            {etat === "erreur" && (
              <p className="text-xs text-cycle-rose mt-3 italic">
                {messageErreur}
              </p>
            )}

            <p className="text-xs text-lune-lavande/70 mt-6 italic leading-relaxed">
              Nous t&apos;enverrons un lien magique à cliquer.
              Aucun mot de passe, aucune complication.
            </p>
          </div>
        )}
      </div>

      {etat !== "envoye" && (
        <div className="px-6 pb-10 flex justify-end">
          <button
            type="button"
            onClick={envoyerLien}
            disabled={!emailValide || etat === "envoi"}
            className="font-serif text-base text-nuit-abysse bg-lune-or px-6 py-2.5 rounded-full hover:bg-lune-or-pale transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {etat === "envoi" ? "Envoi…" : "Recevoir le lien ✦"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <StarField />
      <Suspense fallback={null}>
        <LoginContent />
      </Suspense>
    </main>
  );
}
