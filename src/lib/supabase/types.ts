export type ProfilRow = {
  user_id: string;
  prenom: string;
  dernieres_regles: string;
  duree_cycle: number;
  created_at: string;
  updated_at: string;
};

export type EntreeJournalRow = {
  user_id: string;
  date: string;
  humeur: string | null;
  symptomes: string[];
  pensee: string;
  modifie_le: string;
};

export type PreferencesNotifRow = {
  user_id: string;
  actif: boolean;
  heure_rituel_soir: number;
  notif_pleine_lune: boolean;
  notif_regles_proches: boolean;
  notif_rituel_soir: boolean;
  notif_ovulation: boolean;
  fuseau_horaire: string;
  derniere_notif_rituel: string | null;
  derniere_notif_lune: string | null;
  derniere_notif_regles: string | null;
  derniere_notif_ovulation: string | null;
  updated_at: string;
};

export type PushSubscriptionRow = {
  id: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  user_agent: string | null;
  created_at: string;
};
