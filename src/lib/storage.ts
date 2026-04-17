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
