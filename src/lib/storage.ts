// Couche de persistance via Supabase (remplace localStorage).
// Toutes les fonctions sont asynchrones et exigent un client Supabase + userId.
// La RLS protège les accès au niveau Postgres.

import type { SupabaseClient } from "@supabase/supabase-js";
import type { EntreeJournal } from "@/lib/journal";
import type {
  ProfilRow,
  EntreeJournalRow,
  PreferencesNotifRow,
} from "@/lib/supabase/types";
// PushSubscriptionRow est importé plus bas pour maintenir la séparation de sections.

export type ProfilUtilisatrice = {
  prenom: string;
  dernieresRegles: string;
  dureeCycle: number;
};

// ============================================================
// Profil
// ============================================================

function rowVersProfil(row: ProfilRow): ProfilUtilisatrice {
  return {
    prenom: row.prenom,
    dernieresRegles: row.dernieres_regles,
    dureeCycle: row.duree_cycle,
  };
}

export async function lireProfil(
  supabase: SupabaseClient,
  userId: string
): Promise<ProfilUtilisatrice | null> {
  const { data, error } = await supabase
    .from("profils")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Erreur lecture profil:", error);
    return null;
  }
  return data ? rowVersProfil(data as ProfilRow) : null;
}

export async function sauvegarderProfil(
  supabase: SupabaseClient,
  userId: string,
  profil: ProfilUtilisatrice
): Promise<void> {
  const { error } = await supabase.from("profils").upsert(
    {
      user_id: userId,
      prenom: profil.prenom,
      dernieres_regles: profil.dernieresRegles,
      duree_cycle: profil.dureeCycle,
    },
    { onConflict: "user_id" }
  );
  if (error) throw error;
}

export async function effacerProfil(
  supabase: SupabaseClient,
  userId: string
): Promise<void> {
  const { error } = await supabase
    .from("profils")
    .delete()
    .eq("user_id", userId);
  if (error) throw error;
}

// ============================================================
// Journal
// ============================================================

function rowVersEntree(row: EntreeJournalRow): EntreeJournal {
  return {
    date: row.date,
    humeur: row.humeur as EntreeJournal["humeur"],
    symptomes: row.symptomes as EntreeJournal["symptomes"],
    pensee: row.pensee,
    modifieLe: row.modifie_le,
  };
}

export async function lireEntreesJournal(
  supabase: SupabaseClient,
  userId: string
): Promise<Record<string, EntreeJournal>> {
  const { data, error } = await supabase
    .from("entrees_journal")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Erreur lecture journal:", error);
    return {};
  }

  const map: Record<string, EntreeJournal> = {};
  for (const row of (data ?? []) as EntreeJournalRow[]) {
    map[row.date] = rowVersEntree(row);
  }
  return map;
}

export async function lireEntreeJournal(
  supabase: SupabaseClient,
  userId: string,
  dateISO: string
): Promise<EntreeJournal | null> {
  const { data, error } = await supabase
    .from("entrees_journal")
    .select("*")
    .eq("user_id", userId)
    .eq("date", dateISO)
    .maybeSingle();

  if (error) {
    console.error("Erreur lecture entrée:", error);
    return null;
  }
  return data ? rowVersEntree(data as EntreeJournalRow) : null;
}

export async function sauvegarderEntreeJournal(
  supabase: SupabaseClient,
  userId: string,
  entree: EntreeJournal
): Promise<void> {
  const { error } = await supabase.from("entrees_journal").upsert(
    {
      user_id: userId,
      date: entree.date,
      humeur: entree.humeur,
      symptomes: entree.symptomes,
      pensee: entree.pensee,
      modifie_le: new Date().toISOString(),
    },
    { onConflict: "user_id,date" }
  );
  if (error) throw error;
}

export async function supprimerEntreeJournal(
  supabase: SupabaseClient,
  userId: string,
  dateISO: string
): Promise<void> {
  const { error } = await supabase
    .from("entrees_journal")
    .delete()
    .eq("user_id", userId)
    .eq("date", dateISO);
  if (error) throw error;
}

// ============================================================
// Préférences notifications (utilisé au Prompt 6)
// ============================================================

export type PreferencesNotif = {
  actif: boolean;
  heureRituelSoir: number;
  notifPleineLune: boolean;
  notifReglesProches: boolean;
};

export async function lirePreferencesNotif(
  supabase: SupabaseClient,
  userId: string
): Promise<PreferencesNotif | null> {
  const { data, error } = await supabase
    .from("preferences_notif")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Erreur lecture préférences notif:", error);
    return null;
  }
  if (!data) return null;
  const row = data as PreferencesNotifRow;
  return {
    actif: row.actif,
    heureRituelSoir: row.heure_rituel_soir,
    notifPleineLune: row.notif_pleine_lune,
    notifReglesProches: row.notif_regles_proches,
  };
}

// ============================================================
// Push subscriptions & préférences complètes (Prompt 8)
// ============================================================

export type PreferencesNotifComplete = {
  actif: boolean;
  heureRituelSoir: number;
  notifRituelSoir: boolean;
  notifPleineLune: boolean;
  notifReglesProches: boolean;
  notifOvulation: boolean;
  fuseauHoraire: string;
};

export async function lirePreferencesNotifCompletes(
  supabase: SupabaseClient,
  userId: string
): Promise<PreferencesNotifComplete | null> {
  const { data, error } = await supabase
    .from("preferences_notif")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Erreur lecture préférences complètes:", error);
    return null;
  }
  if (!data) return null;

  const row = data as PreferencesNotifRow;
  return {
    actif: row.actif,
    heureRituelSoir: row.heure_rituel_soir,
    notifRituelSoir: row.notif_rituel_soir,
    notifPleineLune: row.notif_pleine_lune,
    notifReglesProches: row.notif_regles_proches,
    notifOvulation: row.notif_ovulation,
    fuseauHoraire: row.fuseau_horaire,
  };
}

export async function sauvegarderPreferencesNotif(
  supabase: SupabaseClient,
  userId: string,
  prefs: PreferencesNotifComplete
): Promise<void> {
  const { error } = await supabase.from("preferences_notif").upsert(
    {
      user_id: userId,
      actif: prefs.actif,
      heure_rituel_soir: prefs.heureRituelSoir,
      notif_rituel_soir: prefs.notifRituelSoir,
      notif_pleine_lune: prefs.notifPleineLune,
      notif_regles_proches: prefs.notifReglesProches,
      notif_ovulation: prefs.notifOvulation,
      fuseau_horaire: prefs.fuseauHoraire,
    },
    { onConflict: "user_id" }
  );
  if (error) throw error;
}

export async function enregistrerPushSubscription(
  supabase: SupabaseClient,
  userId: string,
  abo: { endpoint: string; p256dh: string; auth: string; userAgent?: string }
): Promise<void> {
  const { error } = await supabase.from("push_subscriptions").upsert(
    {
      user_id: userId,
      endpoint: abo.endpoint,
      p256dh: abo.p256dh,
      auth: abo.auth,
      user_agent: abo.userAgent ?? null,
    },
    { onConflict: "user_id,endpoint" }
  );
  if (error) throw error;
}

export async function supprimerPushSubscription(
  supabase: SupabaseClient,
  userId: string,
  endpoint: string
): Promise<void> {
  const { error } = await supabase
    .from("push_subscriptions")
    .delete()
    .eq("user_id", userId)
    .eq("endpoint", endpoint);
  if (error) throw error;
}
