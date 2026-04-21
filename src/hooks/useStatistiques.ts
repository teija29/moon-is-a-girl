"use client";

import { useEffect, useState } from "react";
import { creerClientNavigateur } from "@/lib/supabase/client";
import { lireProfil, lireEntreesJournal } from "@/lib/storage";
import {
  reconstruireCyclesPasses,
  analyserRegularite,
  analyserHumeursParPhase,
  detecterRetard,
  analyserCorrelationLune,
  genererCalendrierMois,
  type CyclePasse,
  type StatRegularite,
  type StatHumeursParPhase,
  type StatRetard,
  type StatCorrelationLune,
  type JourCalendrier,
} from "@/lib/statistiques";
import type { EntreeJournal } from "@/lib/journal";
import type { ProfilUtilisatrice } from "@/lib/storage";
import type { User } from "@supabase/supabase-js";

type EtatStatistiques = {
  chargement: boolean;
  utilisateur: User | null;
  profil: ProfilUtilisatrice | null;
  entrees: EntreeJournal[];
  cyclesPasses: CyclePasse[];
  regularite: StatRegularite | null;
  humeursParPhase: StatHumeursParPhase | null;
  retard: StatRetard | null;
  correlationLune: StatCorrelationLune | null;
  calendrier: JourCalendrier[];
  moisAffiche: number;
  anneeAffichee: number;
  moisPrecedent: () => void;
  moisSuivant: () => void;
  revenirAujourdhui: () => void;
};

export function useStatistiques(): EtatStatistiques {
  const [supabase] = useState(() => creerClientNavigateur());
  const [chargement, setChargement] = useState(true);
  const [utilisateur, setUtilisateur] = useState<User | null>(null);
  const [profil, setProfil] = useState<ProfilUtilisatrice | null>(null);
  const [entrees, setEntrees] = useState<EntreeJournal[]>([]);

  const [moisAffiche, setMoisAffiche] = useState(() => new Date().getMonth());
  const [anneeAffichee, setAnneeAffichee] = useState(() =>
    new Date().getFullYear()
  );

  useEffect(() => {
    let annule = false;
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (annule) return;
      setUtilisateur(user);
      if (user) {
        const [p, map] = await Promise.all([
          lireProfil(supabase, user.id),
          lireEntreesJournal(supabase, user.id),
        ]);
        if (annule) return;
        setProfil(p);
        setEntrees(Object.values(map));
      }
      setChargement(false);
    })();
    return () => {
      annule = true;
    };
  }, [supabase]);

  const moisPrecedent = () => {
    if (moisAffiche === 0) {
      setMoisAffiche(11);
      setAnneeAffichee(anneeAffichee - 1);
    } else {
      setMoisAffiche(moisAffiche - 1);
    }
  };

  const moisSuivant = () => {
    if (moisAffiche === 11) {
      setMoisAffiche(0);
      setAnneeAffichee(anneeAffichee + 1);
    } else {
      setMoisAffiche(moisAffiche + 1);
    }
  };

  const revenirAujourdhui = () => {
    const d = new Date();
    setMoisAffiche(d.getMonth());
    setAnneeAffichee(d.getFullYear());
  };

  // Calculs dérivés (uniquement si profil présent)
  let cyclesPasses: CyclePasse[] = [];
  let regularite: StatRegularite | null = null;
  let humeursParPhase: StatHumeursParPhase | null = null;
  let retard: StatRetard | null = null;
  let correlationLune: StatCorrelationLune | null = null;
  let calendrier: JourCalendrier[] = [];

  if (profil) {
    cyclesPasses = reconstruireCyclesPasses(
      profil.dernieresRegles,
      profil.dureeCycle,
      entrees
    );
    regularite = analyserRegularite(cyclesPasses);
    humeursParPhase = analyserHumeursParPhase(
      profil.dernieresRegles,
      profil.dureeCycle,
      entrees
    );
    retard = detecterRetard(profil.dernieresRegles, profil.dureeCycle);
    correlationLune = analyserCorrelationLune(cyclesPasses);
    calendrier = genererCalendrierMois(
      moisAffiche,
      anneeAffichee,
      profil.dernieresRegles,
      profil.dureeCycle,
      entrees
    );
  }

  return {
    chargement,
    utilisateur,
    profil,
    entrees,
    cyclesPasses,
    regularite,
    humeursParPhase,
    retard,
    correlationLune,
    calendrier,
    moisAffiche,
    anneeAffichee,
    moisPrecedent,
    moisSuivant,
    revenirAujourdhui,
  };
}
