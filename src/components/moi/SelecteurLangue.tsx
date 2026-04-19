"use client";

import { useState } from "react";

type Langue = { code: string; label: string; dispo: boolean };

const LANGUES: Langue[] = [
  { code: "fr", label: "Français", dispo: true },
  { code: "en", label: "English", dispo: false },
  { code: "es", label: "Español", dispo: false },
  { code: "pt", label: "Português", dispo: false },
];

export default function SelecteurLangue() {
  const [ouvert, setOuvert] = useState(false);
  const [selectionnee] = useState("fr");

  const langueActive = LANGUES.find((l) => l.code === selectionnee)!;

  return (
    <div className="card-nocturne rounded-[20px] px-[18px] py-4">
      <button
        type="button"
        onClick={() => setOuvert((o) => !o)}
        className="w-full flex items-center justify-between gap-3 bg-transparent border-0 cursor-pointer"
        aria-expanded={ouvert}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-[38px] h-[38px] rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(212, 175, 122, 0.15)" }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#D4AF7A"
              strokeWidth="1.4"
              strokeLinecap="round"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12 h18" />
              <path d="M12 3 a12 12 0 0 1 0 18 a12 12 0 0 1 0 -18 z" />
            </svg>
          </div>
          <div className="text-left">
            <p className="font-serif text-[15px] text-lune-creme leading-tight">
              Langue
            </p>
            <p className="text-[11px] text-lune-lavande mt-0.5">
              {langueActive.label}
            </p>
          </div>
        </div>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#D4AF7A"
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{
            transform: ouvert ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 400ms ease",
          }}
        >
          <path d="M9 6 L15 12 L9 18" />
        </svg>
      </button>

      {ouvert && (
        <div className="mt-4 pt-4 border-t border-lune-lavande/10 space-y-2 animate-[fadein_400ms_ease-out]">
          {LANGUES.map((l) => (
            <div
              key={l.code}
              className="flex items-center justify-between py-2"
            >
              <span
                className={
                  "font-serif text-sm " +
                  (l.dispo ? "text-lune-creme" : "text-lune-lavande/50")
                }
              >
                {l.label}
              </span>
              {l.dispo ? (
                <span
                  className="text-[10px] tracking-[0.2em] uppercase px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(212, 175, 122, 0.15)",
                    color: "#D4AF7A",
                  }}
                >
                  Active
                </span>
              ) : (
                <span className="text-[10px] tracking-[0.2em] uppercase text-lune-lavande/50 italic">
                  bientôt ✦
                </span>
              )}
            </div>
          ))}
          <p className="text-[11px] text-lune-lavande/60 italic mt-3 leading-relaxed">
            D&apos;autres langues arriveront pour accompagner les femmes partout
            dans le monde.
          </p>
        </div>
      )}
    </div>
  );
}
