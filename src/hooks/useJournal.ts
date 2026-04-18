"use client";

import { useCallback, useEffect, useState } from "react";
import { creerClientNavigateur } from "@/lib/supabase/client";
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
import type { User } from "@supabase/supabase-js";

type EtatJournal = {
  chargement: boolean;
  entrees: Record<string, EntreeJournal>;
  entreeDuJour: EntreeJournal;
  aEcritAujourdhui: boolean;
  enregistrer: (entree: EntreeJournal) => Promise<void>;
  supprimerJour: (dateISO: string) => Promise<void>;
};

export function useJournal(): EtatJournal {
  const [supabase] = useState(() => creerClientNavigateur());
  const [chargement, setChargement] = useState(true);
  const [utilisateur, setUtilisateur] = useState<User | null>(null);
  const [entrees, setEntrees] = useState<Record<string, EntreeJournal>>({});

  useEffect(() => {
    let annule = false;

    const charger = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (annule) return;
      setUtilisateur(user);
      if (user) {
        const es = await lireEntreesJournal(supabase, user.id);
        if (!annule) setEntrees(es);
      } else {
        setEntrees({});
      }
      if (!annule) setChargement(false);
    };

    charger();

    const { data: sub } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const u = session?.user ?? null;
        setUtilisateur(u);
        if (u) {
          const es = await lireEntreesJournal(supabase, u.id);
          setEntrees(es);
        } else {
          setEntrees({});
        }
      }
    );

    return () => {
      annule = true;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  const aujourdhui = dateLocaleISO();
  const entreeExistante = entrees[aujourdhui] ?? null;
  const entreeDuJour = entreeExistante ?? creerEntreeVide(aujourdhui);
  const aEcritAujourdhui =
    entreeExistante !== null &&
    (entreeExistante.humeur !== null ||
      entreeExistante.symptomes.length > 0 ||
      entreeExistante.pensee.trim().length > 0);

  const enregistrer = useCallback(
    async (entree: EntreeJournal) => {
      if (!utilisateur) throw new Error("Non connectée");
      await sauvegarderEntreeJournal(supabase, utilisateur.id, entree);
      setEntrees((curr) => ({
        ...curr,
        [entree.date]: { ...entree, modifieLe: new Date().toISOString() },
      }));
    },
    [supabase, utilisateur]
  );

  const supprimerJour = useCallback(
    async (dateISO: string) => {
      if (!utilisateur) return;
      await supprimerEntreeJournal(supabase, utilisateur.id, dateISO);
      setEntrees((curr) => {
        const copie = { ...curr };
        delete copie[dateISO];
        return copie;
      });
    },
    [supabase, utilisateur]
  );

  return {
    chargement,
    entrees,
    entreeDuJour,
    aEcritAujourdhui,
    enregistrer,
    supprimerJour,
  };
}

export function useEntreeJournal(dateISO: string): {
  chargement: boolean;
  entree: EntreeJournal | null;
} {
  const [supabase] = useState(() => creerClientNavigateur());
  const [chargement, setChargement] = useState(true);
  const [entree, setEntree] = useState<EntreeJournal | null>(null);

  useEffect(() => {
    let annule = false;
    setChargement(true);

    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        if (!annule) {
          setEntree(null);
          setChargement(false);
        }
        return;
      }
      const e = await lireEntreeJournal(supabase, user.id, dateISO);
      if (!annule) {
        setEntree(e);
        setChargement(false);
      }
    })();

    return () => {
      annule = true;
    };
  }, [supabase, dateISO]);

  return { chargement, entree };
}
