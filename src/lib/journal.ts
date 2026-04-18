// Modèle et utilitaires du journal.
// Fonctions pures (aucune dépendance à React, au DOM ou au localStorage).

export type Humeur =
  | "repliee"
  | "eveillee"
  | "determinee"
  | "rayonnante"
  | "reflexive"
  | "lachee";

export type Symptome =
  | "crampes"
  | "seins-sensibles"
  | "maux-de-tete"
  | "fatigue"
  | "ballonnements"
  | "libido-haute"
  | "libido-basse"
  | "insomnie"
  | "appetit-fort";

export type EntreeJournal = {
  date: string;
  humeur: Humeur | null;
  symptomes: Symptome[];
  pensee: string;
  modifieLe: string;
};

export const LONGUEUR_PENSEE_MAX = 2000;

/**
 * Format ISO "YYYY-MM-DD" pour la date locale fournie (par défaut : aujourd'hui).
 */
export function dateLocaleISO(d: Date = new Date()): string {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const jj = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${jj}`;
}

/**
 * Entrée vide pour initialiser un formulaire.
 */
export function creerEntreeVide(date: string = dateLocaleISO()): EntreeJournal {
  return {
    date,
    humeur: null,
    symptomes: [],
    pensee: "",
    modifieLe: new Date().toISOString(),
  };
}

/**
 * true si l'entrée contient une donnée significative (au moins une des 3 zones remplie).
 */
export function entreeNonVide(e: EntreeJournal): boolean {
  return (
    e.humeur !== null || e.symptomes.length > 0 || e.pensee.trim().length > 0
  );
}

/**
 * Ajoute ou retire un symptôme d'une liste (immuable).
 */
export function toggleSymptome(
  liste: Symptome[],
  symptome: Symptome
): Symptome[] {
  return liste.includes(symptome)
    ? liste.filter((s) => s !== symptome)
    : [...liste, symptome];
}

/**
 * Format humain d'une date ISO "YYYY-MM-DD" : "mardi 18 avril".
 */
export function formatDateHumaine(dateISO: string): string {
  const [annee, mois, jour] = dateISO.split("-").map(Number);
  const d = new Date(annee, mois - 1, jour);
  return d.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}
