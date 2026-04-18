// Catalogue des humeurs lunaires et des symptômes.
// Séparé de storage/cycle pour rester facilement éditable sans toucher à la logique.

import type { Humeur, Symptome } from "@/lib/journal";

export type HumeurOption = {
  id: Humeur;
  titre: string;
  sousTitre: string;
  /** Position dans le cycle lunaire pour guider le choix de l'icône (0 à 1). */
  phaseLune: number;
};

export const HUMEURS: HumeurOption[] = [
  { id: "repliee", titre: "Repliée", sousTitre: "introspection", phaseLune: 0 },
  { id: "eveillee", titre: "Éveillée", sousTitre: "curiosité", phaseLune: 0.12 },
  { id: "determinee", titre: "Déterminée", sousTitre: "élan", phaseLune: 0.25 },
  { id: "rayonnante", titre: "Rayonnante", sousTitre: "plénitude", phaseLune: 0.5 },
  { id: "reflexive", titre: "Réflexive", sousTitre: "gratitude", phaseLune: 0.65 },
  { id: "lachee", titre: "Lâchée", sousTitre: "relâchement", phaseLune: 0.85 },
];

export type SymptomeOption = {
  id: Symptome;
  libelle: string;
};

export const SYMPTOMES: SymptomeOption[] = [
  { id: "crampes", libelle: "Crampes" },
  { id: "seins-sensibles", libelle: "Seins sensibles" },
  { id: "maux-de-tete", libelle: "Maux de tête" },
  { id: "fatigue", libelle: "Fatigue" },
  { id: "ballonnements", libelle: "Ballonnements" },
  { id: "libido-haute", libelle: "Libido haute" },
  { id: "libido-basse", libelle: "Libido basse" },
  { id: "insomnie", libelle: "Insomnie" },
  { id: "appetit-fort", libelle: "Appétit fort" },
];
