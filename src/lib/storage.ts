// Couche de persistance du profil utilisatrice.
// Utilise localStorage pour l'instant. Remplaçable par Supabase plus tard
// sans modifier le reste du code (mêmes signatures).

export type ProfilUtilisatrice = {
  prenom: string;
  /** Date des dernières règles au format ISO "YYYY-MM-DD" (jour local). */
  dernieresRegles: string;
  /** Durée moyenne du cycle, en jours (21-35). */
  dureeCycle: number;
};

const CLE_PROFIL = "moon-is-a-girl:profil-v1";

/**
 * Lit le profil stocké. Renvoie null si absent, invalide, ou côté serveur.
 */
export function lireProfil(): ProfilUtilisatrice | null {
  if (typeof window === "undefined") return null;
  try {
    const brut = window.localStorage.getItem(CLE_PROFIL);
    if (!brut) return null;
    const parsed = JSON.parse(brut) as Partial<ProfilUtilisatrice>;
    if (
      typeof parsed.prenom !== "string" ||
      parsed.prenom.trim().length === 0 ||
      typeof parsed.dernieresRegles !== "string" ||
      typeof parsed.dureeCycle !== "number"
    ) {
      return null;
    }
    return {
      prenom: parsed.prenom.trim(),
      dernieresRegles: parsed.dernieresRegles,
      dureeCycle: parsed.dureeCycle,
    };
  } catch {
    return null;
  }
}

/**
 * Sauvegarde le profil.
 */
export function sauvegarderProfil(profil: ProfilUtilisatrice): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CLE_PROFIL, JSON.stringify(profil));
}

/**
 * Supprime le profil (déconnexion / reset).
 */
export function effacerProfil(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CLE_PROFIL);
}

// --- Journal ---

import type { EntreeJournal } from "@/lib/journal";

const CLE_JOURNAL = "moon-is-a-girl:journal-v1";

/**
 * Lit toutes les entrées du journal, indexées par date ISO.
 * Renvoie un objet vide si aucune entrée n'est stockée.
 */
export function lireEntreesJournal(): Record<string, EntreeJournal> {
  if (typeof window === "undefined") return {};
  try {
    const brut = window.localStorage.getItem(CLE_JOURNAL);
    if (!brut) return {};
    const parsed = JSON.parse(brut);
    if (typeof parsed !== "object" || parsed === null) return {};
    return parsed as Record<string, EntreeJournal>;
  } catch {
    return {};
  }
}

/**
 * Lit une entrée précise (null si absente).
 */
export function lireEntreeJournal(dateISO: string): EntreeJournal | null {
  return lireEntreesJournal()[dateISO] ?? null;
}

/**
 * Écrit une entrée (crée ou écrase selon la date).
 */
export function sauvegarderEntreeJournal(entree: EntreeJournal): void {
  if (typeof window === "undefined") return;
  const tout = lireEntreesJournal();
  tout[entree.date] = { ...entree, modifieLe: new Date().toISOString() };
  window.localStorage.setItem(CLE_JOURNAL, JSON.stringify(tout));
}

/**
 * Supprime une entrée (no-op si absente).
 */
export function supprimerEntreeJournal(dateISO: string): void {
  if (typeof window === "undefined") return;
  const tout = lireEntreesJournal();
  if (!(dateISO in tout)) return;
  delete tout[dateISO];
  window.localStorage.setItem(CLE_JOURNAL, JSON.stringify(tout));
}
