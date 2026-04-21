"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { creerClientNavigateur } from "@/lib/supabase/client";
import StarField from "@/components/layout/StarField";
import MoonWordmark from "@/components/layout/MoonWordmark";

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

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const compteSupprime = searchParams.get("compte") === "supprime";

  const [supabase] = useState(() => creerClientNavigateur());

  const [etape, setEtape] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [enTraitement, setEnTraitement] = useState(false);
  const [messageErreur, setMessageErreur] = useState<string | null>(null);

  const emailValide = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const codeValide = /^\d{6}$/.test(code);

  const envoyerCode = async () => {
    if (!emailValide) return;
    setEnTraitement(true);
    setMessageErreur(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    });

    setEnTraitement(false);

    if (error) {
      setMessageErreur(
        error.message.includes("rate")
          ? "Tu as demandé trop de codes récemment. Attends quelques minutes."
          : "Une erreur est survenue. Réessaie dans un instant."
      );
    } else {
      setEtape("code");
    }
  };

  const verifierCode = async () => {
    if (!codeValide) return;
    setEnTraitement(true);
    setMessageErreur(null);

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });

    setEnTraitement(false);

    if (error) {
      if (error.message.toLowerCase().includes("expired")) {
        setMessageErreur("Ce code a expiré. Demande-en un nouveau.");
      } else if (error.message.toLowerCase().includes("invalid")) {
        setMessageErreur("Ce code n'est pas reconnu. Vérifie bien les chiffres.");
      } else {
        setMessageErreur("Une erreur est survenue. Réessaie.");
      }
    } else {
      router.push("/");
    }
  };

  const retourEmail = () => {
    setEtape("email");
    setCode("");
    setMessageErreur(null);
  };

  return (
    <div className="relative z-10 flex flex-col min-h-screen">
      <MoonWordmark />

      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        {compteSupprime && (
          <div
            className="mb-6 rounded-[16px] px-4 py-3 animate-[fadein_600ms_ease-out]"
            style={{
              background: "rgba(212, 175, 122, 0.08)",
              border: "0.5px solid rgba(212, 175, 122, 0.25)",
            }}
          >
            <p className="font-serif italic text-sm text-lune-creme leading-snug">
              Ton compte a été effacé. Merci pour ce bout de chemin parcouru.
            </p>
          </div>
        )}

        {etape === "email" && (
          <div className="animate-[fadein_600ms_ease-out]">
            <h1 className="font-serif text-3xl text-lune-creme leading-tight mb-3">
              Retrouve ton espace
            </h1>
            <p className="font-serif italic text-base text-lune-or mb-10">
              Pas de mot de passe — juste un code reçu par email
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
              onKeyDown={(e) => e.key === "Enter" && envoyerCode()}
              placeholder="toi@exemple.com"
              className="w-full bg-transparent border-0 border-b border-lune-lavande/30 font-serif text-xl text-lune-creme py-3 focus:outline-none focus:border-lune-or transition-colors duration-500 placeholder:text-lune-lavande/30"
            />

            {messageErreur && (
              <p className="text-xs text-cycle-rose mt-3 italic">
                {messageErreur}
              </p>
            )}

            <p className="text-xs text-lune-lavande/70 mt-6 italic leading-relaxed">
              Nous t&apos;enverrons un code à 6 chiffres à saisir ici.
              Aucun mot de passe, aucune complication.
            </p>
          </div>
        )}

        {etape === "code" && (
          <div className="animate-[fadein_600ms_ease-out]">
            <h1 className="font-serif text-3xl text-lune-creme leading-tight mb-3">
              Ton code est en chemin
            </h1>
            <p className="font-serif italic text-base text-lune-or mb-2">
              Regarde ta boîte aux lettres
            </p>
            <p className="text-xs text-lune-lavande/70 mb-8 leading-relaxed">
              Un code à 6 chiffres vient d&apos;être envoyé à{" "}
              <span className="text-lune-creme">{email}</span>
            </p>

            <label
              htmlFor="code"
              className="block text-[10px] tracking-[0.25em] uppercase text-lune-lavande font-medium mb-2"
            >
              Code reçu
            </label>
            <input
              id="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="\d{6}"
              maxLength={6}
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              onKeyDown={(e) => e.key === "Enter" && verifierCode()}
              placeholder="123456"
              autoFocus
              className="w-full bg-transparent border-0 border-b border-lune-lavande/30 font-serif text-3xl text-lune-creme py-3 focus:outline-none focus:border-lune-or transition-colors duration-500 placeholder:text-lune-lavande/20 tracking-[0.4em] text-center"
            />

            {messageErreur && (
              <p className="text-xs text-cycle-rose mt-3 italic text-center">
                {messageErreur}
              </p>
            )}

            <button
              type="button"
              onClick={retourEmail}
              className="mt-8 font-serif italic text-sm text-lune-lavande hover:text-lune-creme transition-colors duration-300 block mx-auto"
            >
              ← utiliser une autre adresse
            </button>
          </div>
        )}
      </div>

      <div className="px-6 pb-10 flex justify-end">
        {etape === "email" && (
          <button
            type="button"
            onClick={envoyerCode}
            disabled={!emailValide || enTraitement}
            className="font-serif text-base text-nuit-abysse bg-lune-or px-6 py-2.5 rounded-full hover:bg-lune-or-pale transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {enTraitement ? "Envoi…" : "Recevoir le code ✦"}
          </button>
        )}
        {etape === "code" && (
          <button
            type="button"
            onClick={verifierCode}
            disabled={!codeValide || enTraitement}
            className="font-serif text-base text-nuit-abysse bg-lune-or px-6 py-2.5 rounded-full hover:bg-lune-or-pale transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {enTraitement ? "Vérification…" : "Entrer ✦"}
          </button>
        )}
      </div>
    </div>
  );
}
