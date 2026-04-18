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
  updated_at: string;
};
