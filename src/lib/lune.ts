// Calculs astronomiques du cycle lunaire.
// S'appuie sur suncalc pour la phase et l'illumination, et sur le cycle synodique
// moyen de 29.53 jours pour les projections (prochaine pleine lune, etc.).

import SunCalc from "suncalc";

/** Durée moyenne du cycle synodique (d'une nouvelle lune à la suivante), en jours. */
export const CYCLE_SYNODIQUE_JOURS = 29.53;

export type NomPhaseLune =
  | "nouvelle"
  | "croissant-croissant"
  | "premier-quartier"
  | "gibbeuse-croissante"
  | "pleine"
  | "gibbeuse-decroissante"
  | "dernier-quartier"
  | "croissant-decroissant";

export type EtatLune = {
  /** Position dans le cycle synodique, 0 (nouvelle) à 1 (nouvelle suivante). */
  phase: number;
  /** Proportion illuminée du disque visible, 0 à 1. */
  illumination: number;
  /** Pourcentage entier d'illumination (0 à 100). */
  illuminationPourcent: number;
  /** Identifiant de la phase. */
  nomPhase: NomPhaseLune;
  /** Titre court affiché en UI (« Gibbeuse », « Pleine lune », ...). */
  titre: string;
  /** Sous-titre affiché en UI (« Croissante · 82 % », « invisible cette nuit », ...). */
  sousTitre: string;
  /** true si on est dans la première moitié du cycle (nouvelle → pleine). */
  estCroissante: boolean;
  /** Nombre de jours entiers jusqu'à la prochaine pleine lune (0 = cette nuit). */
  joursJusquaPleineLune: number;
};

/**
 * Identifie la phase à partir de la valeur numérique.
 */
function identifierPhase(phase: number): NomPhaseLune {
  if (phase < 0.03 || phase > 0.97) return "nouvelle";
  if (phase < 0.22) return "croissant-croissant";
  if (phase <= 0.28) return "premier-quartier";
  if (phase < 0.47) return "gibbeuse-croissante";
  if (phase <= 0.53) return "pleine";
  if (phase < 0.72) return "gibbeuse-decroissante";
  if (phase <= 0.78) return "dernier-quartier";
  return "croissant-decroissant";
}

/**
 * Renvoie le titre affiché pour une phase.
 */
function titrePhase(nom: NomPhaseLune): string {
  switch (nom) {
    case "nouvelle":
      return "Nouvelle lune";
    case "croissant-croissant":
    case "croissant-decroissant":
      return "Croissant";
    case "premier-quartier":
      return "Premier quartier";
    case "gibbeuse-croissante":
    case "gibbeuse-decroissante":
      return "Gibbeuse";
    case "pleine":
      return "Pleine lune";
    case "dernier-quartier":
      return "Dernier quartier";
  }
}

/**
 * Renvoie le sous-titre affiché (direction + pourcentage, ou phrase spéciale).
 */
function sousTitrePhase(
  nom: NomPhaseLune,
  illuminationPourcent: number,
  estCroissante: boolean
): string {
  if (nom === "nouvelle") return "invisible cette nuit";
  if (nom === "pleine") return `lumineuse · ${illuminationPourcent} %`;
  const direction = estCroissante ? "Croissante" : "Décroissante";
  return `${direction} · ${illuminationPourcent} %`;
}

/**
 * Nombre de jours entiers restants avant la prochaine pleine lune.
 * 0 signifie « cette nuit » (on est au pic ou tout proche).
 */
function calculerJoursAvantPleineLune(phase: number): number {
  const diff = phase < 0.5 ? 0.5 - phase : 1.5 - phase;
  return Math.round(diff * CYCLE_SYNODIQUE_JOURS);
}

/**
 * Calcule l'état complet de la lune pour une date donnée.
 * Utilise l'heure locale de la date passée (par défaut : maintenant).
 */
export function getEtatLune(date: Date = new Date()): EtatLune {
  const { phase, fraction } = SunCalc.getMoonIllumination(date);
  const nomPhase = identifierPhase(phase);
  const illuminationPourcent = Math.round(fraction * 100);
  const estCroissante = phase < 0.5;

  return {
    phase,
    illumination: fraction,
    illuminationPourcent,
    nomPhase,
    titre: titrePhase(nomPhase),
    sousTitre: sousTitrePhase(nomPhase, illuminationPourcent, estCroissante),
    estCroissante,
    joursJusquaPleineLune: calculerJoursAvantPleineLune(phase),
  };
}

/**
 * Formule la phrase poétique sur la prochaine pleine lune.
 */
export function phrasePleineLune(jours: number): string {
  if (jours <= 0) return "La pleine lune rayonne cette nuit";
  if (jours === 1) return "La pleine lune arrive demain";
  return `Pleine lune dans ${jours} nuits`;
}

/**
 * Coordonnées (x, y) du marqueur or sur l'anneau lunaire extérieur.
 * Part du haut (nouvelle lune à midi) et tourne dans le sens horaire.
 */
export function positionMarqueurLune(
  phase: number,
  cx: number,
  cy: number,
  rayon: number
): { x: number; y: number } {
  const angleDeg = phase * 360 - 90;
  const angleRad = (angleDeg * Math.PI) / 180;
  return {
    x: cx + rayon * Math.cos(angleRad),
    y: cy + rayon * Math.sin(angleRad),
  };
}

/**
 * Arc parcouru sur l'anneau lunaire (pour strokeDasharray).
 */
export function arcParcouruLune(
  phase: number,
  rayon: number
): { parcouru: number; circonference: number } {
  const circonference = 2 * Math.PI * rayon;
  return { parcouru: phase * circonference, circonference };
}
