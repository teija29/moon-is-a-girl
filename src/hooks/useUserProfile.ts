"use client";

import { useEffect, useState } from "react";
import {
  lireProfil,
  sauvegarderProfil,
  effacerProfil,
  type ProfilUtilisatrice,
} from "@/lib/storage";

type EtatProfil = {
  /** true tant que le localStorage n'a pas été lu (évite les flashs d'hydratation). */
  chargement: boolean;
  /** Le profil, ou null s'il n'y en a pas encore. */
  profil: ProfilUtilisatrice | null;
  /** Enregistre un profil et met à jour l'état. */
  enregistrer: (p: ProfilUtilisatrice) => void;
  /** Efface le profil. */
  reinitialiser: () => void;
};

export function useUserProfile(): EtatProfil {
  const [chargement, setChargement] = useState(true);
  const [profil, setProfil] = useState<ProfilUtilisatrice | null>(null);

  useEffect(() => {
    setProfil(lireProfil());
    setChargement(false);
  }, []);

  const enregistrer = (p: ProfilUtilisatrice) => {
    sauvegarderProfil(p);
    setProfil(p);
  };

  const reinitialiser = () => {
    effacerProfil();
    setProfil(null);
  };

  return { chargement, profil, enregistrer, reinitialiser };
}
