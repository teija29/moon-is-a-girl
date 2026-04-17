// Fonctions de calcul du cycle menstruel.
// Toutes les dates sont traitées en jour calendaire local (heures ignorées).

export type CyclePhase =
  | "menstruation"
  | "folliculaire"
  | "ovulation"
  | "luteale";

export type CyclePhaseInfo = {
  phase: CyclePhase;
  nom: string;
  sousTitre: string;
};

const MS_PAR_JOUR = 24 * 60 * 60 * 1000;

/**
 * Ramène une date à minuit local (élimine les effets d'heure).
 */
function aMinuitLocal(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Nombre de jours calendaires entiers entre deux dates (locale).
 */
export function joursEcoules(debut: Date, fin: Date): number {
  const d = aMinuitLocal(debut).getTime();
  const f = aMinuitLocal(fin).getTime();
  return Math.floor((f - d) / MS_PAR_JOUR);
}

/**
 * Calcule le jour courant dans le cycle (1 à cycleLength).
 * Si la date des dernières règles est dans le futur, renvoie 1.
 */
export function calculerJourDuCycle(
  dernieresRegles: Date,
  dureeCycle: number,
  aujourdhui: Date = new Date()
): number {
  const diff = joursEcoules(dernieresRegles, aujourdhui);
  if (diff < 0) return 1;
  return (diff % dureeCycle) + 1;
}

/**
 * Jour d'ovulation probable : dureeCycle - 14 (phase lutéale constante).
 */
export function jourOvulation(dureeCycle: number): number {
  return dureeCycle - 14;
}

/**
 * Renvoie la phase du cycle pour un jour donné.
 */
export function phaseDuCycle(
  jour: number,
  dureeCycle: number
): CyclePhaseInfo {
  const jOvu = jourOvulation(dureeCycle);

  if (jour <= 5) {
    return {
      phase: "menstruation",
      nom: "Menstruation",
      sousTitre: "Ton hiver intérieur",
    };
  }

  if (jour >= jOvu - 1 && jour <= jOvu + 1) {
    return {
      phase: "ovulation",
      nom: "Ovulation",
      sousTitre: "Ton plein éclat",
    };
  }

  if (jour < jOvu - 1) {
    return {
      phase: "folliculaire",
      nom: "Phase folliculaire",
      sousTitre: "Le printemps s'éveille",
    };
  }

  return {
    phase: "luteale",
    nom: "Phase lutéale",
    sousTitre: "Ton automne intérieur",
  };
}

/**
 * Position angulaire du marqueur sur un anneau, en degrés.
 * 0° = haut de l'anneau (midi), sens horaire.
 */
export function angleMarqueurCycle(
  jour: number,
  dureeCycle: number
): number {
  return (jour / dureeCycle) * 360;
}

/**
 * Coordonnées (x, y) du marqueur sur un cercle SVG.
 * - cx, cy : centre du cercle dans le viewBox
 * - rayon : rayon du cercle
 * Renvoie la position à l'angle correspondant au jour courant.
 */
export function positionMarqueurCycle(
  jour: number,
  dureeCycle: number,
  cx: number,
  cy: number,
  rayon: number
): { x: number; y: number } {
  // -90° pour partir du haut du cercle (au lieu de la droite, convention SVG).
  const angleDeg = angleMarqueurCycle(jour, dureeCycle) - 90;
  const angleRad = (angleDeg * Math.PI) / 180;
  return {
    x: cx + rayon * Math.cos(angleRad),
    y: cy + rayon * Math.sin(angleRad),
  };
}

/**
 * Longueur de l'arc parcouru (en unités de path SVG) sur un cercle.
 * Utilisé pour le strokeDasharray : "${arcParcouru} ${circonferenceTotale}".
 */
export function arcParcouruCycle(
  jour: number,
  dureeCycle: number,
  rayon: number
): { parcouru: number; circonference: number } {
  const circonference = 2 * Math.PI * rayon;
  const parcouru = (jour / dureeCycle) * circonference;
  return { parcouru, circonference };
}
