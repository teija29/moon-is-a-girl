// Migration one-shot des données localStorage (pré-Supabase) vers la base.
// S'exécute au premier login post-migration et marque l'opération comme faite.

import type { SupabaseClient } from "@supabase/supabase-js";
import {
  sauvegarderProfil,
  sauvegarderEntreeJournal,
  type ProfilUtilisatrice,
} from "@/lib/storage";
import type { EntreeJournal } from "@/lib/journal";

const CLE_PROFIL_LEGACY = "moon-is-a-girl:profil-v1";
const CLE_JOURNAL_LEGACY = "moon-is-a-girl:journal-v1";
const CLE_MIGRATION_FAITE = "moon-is-a-girl:migration-faite";

export type ResultatMigration = {
  profilMigre: boolean;
  entreesMigrees: number;
  erreurs: string[];
};

export async function migrerDonneesLegacy(
  supabase: SupabaseClient,
  userId: string
): Promise<ResultatMigration | null> {
  if (typeof window === "undefined") return null;
  if (window.localStorage.getItem(CLE_MIGRATION_FAITE)) return null;

  const resultat: ResultatMigration = {
    profilMigre: false,
    entreesMigrees: 0,
    erreurs: [],
  };

  try {
    const brut = window.localStorage.getItem(CLE_PROFIL_LEGACY);
    if (brut) {
      const profil = JSON.parse(brut) as ProfilUtilisatrice;
      await sauvegarderProfil(supabase, userId, profil);
      resultat.profilMigre = true;
    }
  } catch (e) {
    resultat.erreurs.push("profil: " + String(e));
  }

  try {
    const brut = window.localStorage.getItem(CLE_JOURNAL_LEGACY);
    if (brut) {
      const map = JSON.parse(brut) as Record<string, EntreeJournal>;
      for (const entree of Object.values(map)) {
        try {
          await sauvegarderEntreeJournal(supabase, userId, entree);
          resultat.entreesMigrees += 1;
        } catch (e) {
          resultat.erreurs.push(`entrée ${entree.date}: ` + String(e));
        }
      }
    }
  } catch (e) {
    resultat.erreurs.push("journal: " + String(e));
  }

  if (resultat.erreurs.length === 0) {
    window.localStorage.removeItem(CLE_PROFIL_LEGACY);
    window.localStorage.removeItem(CLE_JOURNAL_LEGACY);
    window.localStorage.setItem(CLE_MIGRATION_FAITE, new Date().toISOString());
  }

  return resultat;
}
