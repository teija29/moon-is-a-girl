"use client";

import { useEffect, useState } from "react";
import { creerClientNavigateur } from "@/lib/supabase/client";
import { migrerDonneesLegacy } from "@/lib/migration";
import { useUserProfile } from "@/hooks/useUserProfile";

export default function MigrationRunner() {
  const { utilisateur, chargement } = useUserProfile();
  const [supabase] = useState(() => creerClientNavigateur());

  useEffect(() => {
    if (chargement || !utilisateur) return;
    migrerDonneesLegacy(supabase, utilisateur.id).then((res) => {
      if (res && (res.profilMigre || res.entreesMigrees > 0)) {
        console.info("Migration locale → Supabase effectuée:", res);
      }
    });
  }, [supabase, utilisateur, chargement]);

  return null;
}
