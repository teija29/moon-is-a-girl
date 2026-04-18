"use client";

import { useCallback, useEffect, useState } from "react";
import { creerClientNavigateur } from "@/lib/supabase/client";
import {
  lireProfil,
  sauvegarderProfil,
  effacerProfil,
  type ProfilUtilisatrice,
} from "@/lib/storage";
import type { User } from "@supabase/supabase-js";

type EtatProfil = {
  chargement: boolean;
  utilisateur: User | null;
  profil: ProfilUtilisatrice | null;
  enregistrer: (p: ProfilUtilisatrice) => Promise<void>;
  reinitialiser: () => Promise<void>;
  deconnecter: () => Promise<void>;
};

export function useUserProfile(): EtatProfil {
  const [supabase] = useState(() => creerClientNavigateur());
  const [chargement, setChargement] = useState(true);
  const [utilisateur, setUtilisateur] = useState<User | null>(null);
  const [profil, setProfil] = useState<ProfilUtilisatrice | null>(null);

  useEffect(() => {
    let annule = false;

    const charger = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (annule) return;
      setUtilisateur(user);

      if (user) {
        const p = await lireProfil(supabase, user.id);
        if (!annule) setProfil(p);
      } else {
        setProfil(null);
      }
      if (!annule) setChargement(false);
    };

    charger();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUtilisateur(u);
      if (u) {
        lireProfil(supabase, u.id).then((p) => setProfil(p));
      } else {
        setProfil(null);
      }
    });

    return () => {
      annule = true;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  const enregistrer = useCallback(
    async (p: ProfilUtilisatrice) => {
      if (!utilisateur) throw new Error("Non connectée");
      await sauvegarderProfil(supabase, utilisateur.id, p);
      setProfil(p);
    },
    [supabase, utilisateur]
  );

  const reinitialiser = useCallback(async () => {
    if (!utilisateur) return;
    await effacerProfil(supabase, utilisateur.id);
    setProfil(null);
  }, [supabase, utilisateur]);

  const deconnecter = useCallback(async () => {
    await supabase.auth.signOut();
    setProfil(null);
    setUtilisateur(null);
  }, [supabase]);

  return {
    chargement,
    utilisateur,
    profil,
    enregistrer,
    reinitialiser,
    deconnecter,
  };
}
