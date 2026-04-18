"use client";

import { useCallback, useEffect, useState } from "react";
import {
  lireEntreesJournal,
  lireEntreeJournal,
  sauvegarderEntreeJournal,
  supprimerEntreeJournal,
} from "@/lib/storage";
import {
  type EntreeJournal,
  dateLocaleISO,
  creerEntreeVide,
} from "@/lib/journal";

type EtatJournal = {
  /** true tant que le localStorage n'a pas été lu. */
  chargement: boolean;
  /** Toutes les entrées connues, indexées par date ISO. */
  entrees: Record<string, EntreeJournal>;
  /** Entrée du jour (ou squelette vide si absente). */
  entreeDuJour: EntreeJournal;
  /** true si une entrée non vide existe pour aujourd'hui. */
  aEcritAujourdhui: boolean;
  /** Sauvegarde une entrée (et met à jour l'état). */
  enregistrer: (entree: EntreeJournal) => void;
  /** Supprime l'entrée du jour. */
  supprimerJour: (dateISO: string) => void;
};

export function useJournal(): EtatJournal {
  const [chargement, setChargement] = useState(true);
  const [entrees, setEntrees] = useState<Record<string, EntreeJournal>>({});

  useEffect(() => {
    setEntrees(lireEntreesJournal());
    setChargement(false);
  }, []);

  const aujourdhui = dateLocaleISO();
  const entreeExistante = entrees[aujourdhui] ?? null;
  const entreeDuJour = entreeExistante ?? creerEntreeVide(aujourdhui);
  const aEcritAujourdhui =
    entreeExistante !== null &&
    (entreeExistante.humeur !== null ||
      entreeExistante.symptomes.length > 0 ||
      entreeExistante.pensee.trim().length > 0);

  const enregistrer = useCallback((entree: EntreeJournal) => {
    sauvegarderEntreeJournal(entree);
    setEntrees(lireEntreesJournal());
  }, []);

  const supprimerJour = useCallback((dateISO: string) => {
    supprimerEntreeJournal(dateISO);
    setEntrees(lireEntreesJournal());
  }, []);

  return {
    chargement,
    entrees,
    entreeDuJour,
    aEcritAujourdhui,
    enregistrer,
    supprimerJour,
  };
}

/**
 * Hook spécifique pour charger une entrée précise (utilisé par la page détail).
 * Re-synchronise si la clé change.
 */
export function useEntreeJournal(dateISO: string): {
  chargement: boolean;
  entree: EntreeJournal | null;
} {
  const [chargement, setChargement] = useState(true);
  const [entree, setEntree] = useState<EntreeJournal | null>(null);

  useEffect(() => {
    setChargement(true);
    setEntree(lireEntreeJournal(dateISO));
    setChargement(false);
  }, [dateISO]);

  return { chargement, entree };
}
