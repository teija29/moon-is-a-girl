// Moteur de calculs statistiques pour la page /statistiques.
// Fonctions pures : prennent des données en entrée, retournent des résultats.
// Aucune dépendance à React, Supabase ou au DOM.

import type { EntreeJournal } from "@/lib/journal";
import { joursEcoules, phaseDuCycle, type CyclePhase } from "@/lib/cycle";
import { getEtatLune } from "@/lib/lune";

// ============================================================
// 1. Reconstruction des cycles passés
// ============================================================

export type CyclePasse = {
  debut: string; // "YYYY-MM-DD"
  dureeJours: number;
  probabiliteInference: "certain" | "infere"; // certain = ancrage profil, infere = déduit via crampes
};

/**
 * Détecte les débuts de cycles passés à partir des entrées journal.
 * Hypothèse : entrée avec `crampes`, sans entrée `crampes` dans les 5 jours précédents
 * → probable début de cycle.
 */
export function reconstruireCyclesPasses(
  dernieresReglesISO: string,
  dureeCycleMoyenne: number,
  entrees: EntreeJournal[]
): CyclePasse[] {
  const cycles: CyclePasse[] = [];

  // 1. Ancrage certain : les dernières règles déclarées par l'utilisatrice.
  cycles.push({
    debut: dernieresReglesISO,
    dureeJours: dureeCycleMoyenne,
    probabiliteInference: "certain",
  });

  // 2. Détection des débuts inférés via symptôme crampes.
  const entreesAvecCrampes = entrees
    .filter((e) => e.symptomes.includes("crampes"))
    .sort((a, b) => (a.date < b.date ? -1 : 1));

  const debutsInferes: string[] = [];
  for (const e of entreesAvecCrampes) {
    if (e.date >= dernieresReglesISO) continue; // on ne remonte que dans le passé
    const dernierInfereOuCertain =
      debutsInferes[debutsInferes.length - 1] ?? null;
    if (dernierInfereOuCertain === null) {
      debutsInferes.push(e.date);
      continue;
    }
    const gap = joursEcoules(new Date(dernierInfereOuCertain), new Date(e.date));
    if (gap >= 5) {
      debutsInferes.push(e.date);
    }
  }

  // 3. Calculer la durée de chaque cycle inféré (= écart jusqu'au suivant).
  const debutsComplets = [...debutsInferes, dernieresReglesISO].sort();
  for (let i = 0; i < debutsComplets.length - 1; i++) {
    const duree = joursEcoules(
      new Date(debutsComplets[i]),
      new Date(debutsComplets[i + 1])
    );
    if (duree >= 21 && duree <= 45) {
      cycles.unshift({
        debut: debutsComplets[i],
        dureeJours: duree,
        probabiliteInference: "infere",
      });
    }
  }

  return cycles;
}

// ============================================================
// 2. Régularité du cycle
// ============================================================

export type StatRegularite = {
  cyclesAnalyses: number;
  dureeMoyenne: number;
  ecartMax: number;
  niveau: "regulier" | "variable" | "irregulier" | "donnees-insuffisantes";
  message: string;
};

export function analyserRegularite(cycles: CyclePasse[]): StatRegularite {
  if (cycles.length < 2) {
    return {
      cyclesAnalyses: cycles.length,
      dureeMoyenne: 0,
      ecartMax: 0,
      niveau: "donnees-insuffisantes",
      message:
        "Reviens dans quelques semaines — j'ai besoin d'au moins deux cycles pour te parler de ta régularité.",
    };
  }

  const durees = cycles.map((c) => c.dureeJours);
  const moyenne = durees.reduce((a, b) => a + b, 0) / durees.length;
  const ecartMax = Math.max(...durees) - Math.min(...durees);

  let niveau: StatRegularite["niveau"];
  let message: string;

  if (ecartMax <= 2) {
    niveau = "regulier";
    message = `Ton cycle est très régulier — ${Math.round(moyenne)} jours en moyenne, avec moins de 2 jours de variation.`;
  } else if (ecartMax <= 5) {
    niveau = "variable";
    message = `Ton cycle est plutôt stable — ${Math.round(moyenne)} jours en moyenne, avec une variation de ${ecartMax} jours.`;
  } else {
    niveau = "irregulier";
    message = `Ton cycle varie de ${ecartMax} jours selon les mois — moyenne de ${Math.round(moyenne)} jours. C'est plus courant qu'on ne le pense, surtout lors de changements de vie.`;
  }

  return {
    cyclesAnalyses: cycles.length,
    dureeMoyenne: Math.round(moyenne * 10) / 10,
    ecartMax,
    niveau,
    message,
  };
}

// ============================================================
// 3. Graphique humeur × phase du cycle
// ============================================================

export type StatHumeursParPhase = {
  totalEntrees: number;
  suffisant: boolean;
  /** Pour chaque phase, compte des humeurs normalisées en proportion (0-1). */
  parPhase: Record<CyclePhase, Record<string, number>>;
};

export function analyserHumeursParPhase(
  dernieresReglesISO: string,
  dureeCycleMoyenne: number,
  entrees: EntreeJournal[]
): StatHumeursParPhase {
  const entreesAvecHumeur = entrees.filter((e) => e.humeur !== null);

  const parPhase: Record<CyclePhase, Record<string, number>> = {
    menstruation: {},
    folliculaire: {},
    ovulation: {},
    luteale: {},
  };

  for (const entree of entreesAvecHumeur) {
    const dateEntree = new Date(entree.date);
    const dateRegles = new Date(dernieresReglesISO);
    const diff = joursEcoules(dateRegles, dateEntree);
    const jour = ((diff % dureeCycleMoyenne) + dureeCycleMoyenne) % dureeCycleMoyenne + 1;
    const { phase } = phaseDuCycle(jour, dureeCycleMoyenne);
    const humeur = entree.humeur as string;
    parPhase[phase][humeur] = (parPhase[phase][humeur] ?? 0) + 1;
  }

  // Normalisation en proportions par phase.
  const resultats: Record<CyclePhase, Record<string, number>> = {
    menstruation: {},
    folliculaire: {},
    ovulation: {},
    luteale: {},
  };
  (Object.keys(parPhase) as CyclePhase[]).forEach((phase) => {
    const totalPhase = Object.values(parPhase[phase]).reduce(
      (a, b) => a + b,
      0
    );
    if (totalPhase === 0) {
      resultats[phase] = {};
    } else {
      for (const [humeur, count] of Object.entries(parPhase[phase])) {
        resultats[phase][humeur] = count / totalPhase;
      }
    }
  });

  return {
    totalEntrees: entreesAvecHumeur.length,
    suffisant: entreesAvecHumeur.length >= 7,
    parPhase: resultats,
  };
}

// ============================================================
// 4. Détection de retard
// ============================================================

export type StatRetard = {
  enRetard: boolean;
  jourActuel: number;
  dureeMoyenne: number;
  joursDeRetard: number;
  message: string;
};

export function detecterRetard(
  dernieresReglesISO: string,
  dureeCycleMoyenne: number,
  aujourdhui: Date = new Date()
): StatRetard {
  const diff = joursEcoules(new Date(dernieresReglesISO), aujourdhui);
  const jourActuel = diff + 1; // jour 1 = jour des dernières règles
  const joursDeRetard = jourActuel - dureeCycleMoyenne;

  if (joursDeRetard <= 3) {
    return {
      enRetard: false,
      jourActuel,
      dureeMoyenne: dureeCycleMoyenne,
      joursDeRetard: 0,
      message: "",
    };
  }

  return {
    enRetard: true,
    jourActuel,
    dureeMoyenne: dureeCycleMoyenne,
    joursDeRetard,
    message: `Tu es à J${jourActuel}, alors que ton cycle moyen est de ${dureeCycleMoyenne} jours. Écoute ton corps — un retard est possible et courant.`,
  };
}

// ============================================================
// 5. Corrélation cycle × lune
// ============================================================

export type StatCorrelationLune = {
  suffisant: boolean;
  cyclesAnalyses: number;
  /** Phase lunaire la plus fréquente au début des règles. */
  phaseLunaireDominante: "nouvelle" | "croissante" | "pleine" | "decroissante" | null;
  occurrences: number;
  message: string;
};

/**
 * Regroupe les 8 phases lunaires en 4 grands quartiers pour l'analyse.
 */
function simplifierPhaseLune(phase: number): StatCorrelationLune["phaseLunaireDominante"] {
  if (phase < 0.125 || phase >= 0.875) return "nouvelle";
  if (phase < 0.375) return "croissante";
  if (phase < 0.625) return "pleine";
  return "decroissante";
}

export function analyserCorrelationLune(
  cycles: CyclePasse[]
): StatCorrelationLune {
  if (cycles.length < 3) {
    return {
      suffisant: false,
      cyclesAnalyses: cycles.length,
      phaseLunaireDominante: null,
      occurrences: 0,
      message:
        "Il faut au moins trois cycles pour qu'un motif lunaire se dessine. Patience — la lune révèle ses secrets lentement.",
    };
  }

  const comptes: Record<string, number> = {
    nouvelle: 0,
    croissante: 0,
    pleine: 0,
    decroissante: 0,
  };

  for (const cycle of cycles) {
    const lune = getEtatLune(new Date(cycle.debut));
    const simplifiee = simplifierPhaseLune(lune.phase)!;
    comptes[simplifiee] += 1;
  }

  // Phase dominante.
  let dominante: StatCorrelationLune["phaseLunaireDominante"] = null;
  let maxCount = 0;
  for (const [phase, count] of Object.entries(comptes)) {
    if (count > maxCount) {
      maxCount = count;
      dominante = phase as StatCorrelationLune["phaseLunaireDominante"];
    }
  }

  const seuilDominance = Math.ceil(cycles.length / 2); // majorité simple
  if (maxCount < seuilDominance) {
    return {
      suffisant: true,
      cyclesAnalyses: cycles.length,
      phaseLunaireDominante: null,
      occurrences: 0,
      message:
        "Tes cycles ne suivent pas de motif lunaire marqué — chaque corps a son propre rythme.",
    };
  }

  const labelPhase: Record<string, string> = {
    nouvelle: "de nouvelle lune",
    croissante: "croissante",
    pleine: "de pleine lune",
    decroissante: "décroissante",
  };

  return {
    suffisant: true,
    cyclesAnalyses: cycles.length,
    phaseLunaireDominante: dominante,
    occurrences: maxCount,
    message: `${maxCount} de tes ${cycles.length} derniers cycles ont commencé en phase ${labelPhase[dominante!]}.`,
  };
}

// ============================================================
// 6. Génération du calendrier du mois
// ============================================================

export type JourCalendrier = {
  date: string; // "YYYY-MM-DD"
  jour: number; // 1-31
  dansLeMois: boolean; // false = jour du mois précédent/suivant affiché en gris
  phase: CyclePhase | null;
  aEntreeJournal: boolean;
  estAujourdhui: boolean;
};

/**
 * Génère les 42 cases (6 semaines) du calendrier pour un mois donné.
 * Commence le lundi.
 */
export function genererCalendrierMois(
  mois: number, // 0-11
  annee: number,
  dernieresReglesISO: string,
  dureeCycleMoyenne: number,
  entrees: EntreeJournal[]
): JourCalendrier[] {
  const premierDuMois = new Date(annee, mois, 1);
  const joursPrecedents = (premierDuMois.getDay() + 6) % 7; // lundi = 0
  const debut = new Date(annee, mois, 1 - joursPrecedents);

  const aujourdhuiStr = (() => {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const jj = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${mm}-${jj}`;
  })();

  const entreesMap = new Map(entrees.map((e) => [e.date, e]));
  const dateRegles = new Date(dernieresReglesISO);

  const jours: JourCalendrier[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(debut);
    d.setDate(debut.getDate() + i);
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const jj = String(d.getDate()).padStart(2, "0");
    const dateStr = `${d.getFullYear()}-${mm}-${jj}`;

    let phase: CyclePhase | null = null;
    const diff = joursEcoules(dateRegles, d);
    // On ne calcule la phase que pour les dates >= dernieres_regles (passé proche)
    // ET pour les dates dans une fenêtre raisonnable (< 2 cycles en avant)
    if (diff >= 0 && diff < dureeCycleMoyenne * 2) {
      const jour = (diff % dureeCycleMoyenne) + 1;
      phase = phaseDuCycle(jour, dureeCycleMoyenne).phase;
    }

    jours.push({
      date: dateStr,
      jour: d.getDate(),
      dansLeMois: d.getMonth() === mois,
      phase,
      aEntreeJournal: entreesMap.has(dateStr),
      estAujourdhui: dateStr === aujourdhuiStr,
    });
  }

  return jours;
}
