import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";
import {
  messageRituel,
  messageLune,
  messageRegles,
  messageOvulation,
  type TypeNotif,
} from "@/lib/messages-notif";
import { calculerJourDuCycle, phaseDuCycle } from "@/lib/cycle";
import { getEtatLune } from "@/lib/lune";

type LigneGlobale = {
  user_id: string;
  prenom: string;
  dernieres_regles: string;
  duree_cycle: number;
  actif: boolean;
  heure_rituel_soir: number;
  notif_rituel_soir: boolean;
  notif_pleine_lune: boolean;
  notif_regles_proches: boolean;
  notif_ovulation: boolean;
  fuseau_horaire: string;
  derniere_notif_rituel: string | null;
  derniere_notif_lune: string | null;
  derniere_notif_regles: string | null;
  derniere_notif_ovulation: string | null;
};

type Abonnement = {
  endpoint: string;
  p256dh: string;
  auth: string;
};

function dateISOFuseau(date: Date, fuseau: string): string {
  const fmt = new Intl.DateTimeFormat("fr-CA", {
    timeZone: fuseau,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return fmt.format(date);
}

function heureLocale(date: Date, fuseau: string): number {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: fuseau,
    hour: "2-digit",
    hour12: false,
  });
  return Number(fmt.format(date));
}

/**
 * web-push exige que le subject VAPID commence par "mailto:" ou "https:".
 * On normalise pour accepter un simple email dans la variable d'env.
 */
function normaliserSubject(subject: string): string {
  if (subject.startsWith("mailto:") || subject.startsWith("https:")) {
    return subject;
  }
  return `mailto:${subject}`;
}

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization") ?? "";
  const tokenAttendu = process.env.CRON_SECRET;
  if (!tokenAttendu || authHeader !== `Bearer ${tokenAttendu}`) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  }

  const vapidPub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const vapidPriv = process.env.VAPID_PRIVATE_KEY;
  const subjectRaw = process.env.VAPID_SUBJECT;
  if (!vapidPub || !vapidPriv || !subjectRaw) {
    return NextResponse.json(
      { message: "Configuration VAPID manquante" },
      { status: 500 }
    );
  }
  webpush.setVapidDetails(normaliserSubject(subjectRaw), vapidPub, vapidPriv);

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { data: lignes, error } = await supabaseAdmin
    .from("preferences_notif")
    .select(
      `
      user_id, actif, heure_rituel_soir,
      notif_rituel_soir, notif_pleine_lune, notif_regles_proches, notif_ovulation,
      fuseau_horaire,
      derniere_notif_rituel, derniere_notif_lune,
      derniere_notif_regles, derniere_notif_ovulation,
      profils!inner (prenom, dernieres_regles, duree_cycle)
    `
    )
    .eq("actif", true);

  if (error) {
    console.error("Erreur lecture préférences:", error);
    return NextResponse.json({ message: "Erreur DB" }, { status: 500 });
  }

  const maintenant = new Date();
  const lune = getEtatLune(maintenant);
  const lunePleineJ1 = lune.joursJusquaPleineLune === 1;

  let envoyees = 0;
  let ignorees = 0;
  let erreurs = 0;

  for (const brut of lignes ?? []) {
    const profils = (
      brut as unknown as {
        profils: {
          prenom: string;
          dernieres_regles: string;
          duree_cycle: number;
        };
      }
    ).profils;
    const base = brut as unknown as {
      user_id: string;
      actif: boolean;
      heure_rituel_soir: number;
      notif_rituel_soir: boolean;
      notif_pleine_lune: boolean;
      notif_regles_proches: boolean;
      notif_ovulation: boolean;
      fuseau_horaire: string;
      derniere_notif_rituel: string | null;
      derniere_notif_lune: string | null;
      derniere_notif_regles: string | null;
      derniere_notif_ovulation: string | null;
    };
    const ligne: LigneGlobale = {
      user_id: base.user_id,
      prenom: profils.prenom,
      dernieres_regles: profils.dernieres_regles,
      duree_cycle: profils.duree_cycle,
      actif: base.actif,
      heure_rituel_soir: base.heure_rituel_soir,
      notif_rituel_soir: base.notif_rituel_soir,
      notif_pleine_lune: base.notif_pleine_lune,
      notif_regles_proches: base.notif_regles_proches,
      notif_ovulation: base.notif_ovulation,
      fuseau_horaire: base.fuseau_horaire,
      derniere_notif_rituel: base.derniere_notif_rituel,
      derniere_notif_lune: base.derniere_notif_lune,
      derniere_notif_regles: base.derniere_notif_regles,
      derniere_notif_ovulation: base.derniere_notif_ovulation,
    };

    const fuseau = ligne.fuseau_horaire || "Europe/Paris";
    const aujourdhuiLocal = dateISOFuseau(maintenant, fuseau);
    const heureLoc = heureLocale(maintenant, fuseau);

    const dateRegles = new Date(ligne.dernieres_regles);
    const jourCycle = calculerJourDuCycle(
      dateRegles,
      ligne.duree_cycle,
      maintenant
    );
    const phase = phaseDuCycle(jourCycle, ligne.duree_cycle);
    const jourOvu = ligne.duree_cycle - 14;
    const joursAvantRegles = ligne.duree_cycle - jourCycle + 1;

    const typesAEnvoyer: TypeNotif[] = [];

    if (
      ligne.notif_rituel_soir &&
      heureLoc === ligne.heure_rituel_soir &&
      ligne.derniere_notif_rituel !== aujourdhuiLocal
    ) {
      typesAEnvoyer.push("rituel");
    }

    if (
      ligne.notif_pleine_lune &&
      lunePleineJ1 &&
      heureLoc === 21 &&
      ligne.derniere_notif_lune !== aujourdhuiLocal
    ) {
      typesAEnvoyer.push("lune");
    }

    if (
      ligne.notif_regles_proches &&
      joursAvantRegles === 2 &&
      heureLoc === 10 &&
      ligne.derniere_notif_regles !== aujourdhuiLocal
    ) {
      typesAEnvoyer.push("regles");
    }

    if (
      ligne.notif_ovulation &&
      jourCycle === jourOvu &&
      heureLoc === 10 &&
      ligne.derniere_notif_ovulation !== aujourdhuiLocal
    ) {
      typesAEnvoyer.push("ovulation");
    }

    if (typesAEnvoyer.length === 0) {
      ignorees += 1;
      continue;
    }

    const { data: abos } = await supabaseAdmin
      .from("push_subscriptions")
      .select("endpoint, p256dh, auth")
      .eq("user_id", ligne.user_id);

    if (!abos || abos.length === 0) {
      ignorees += 1;
      continue;
    }

    const jourMois = Number(aujourdhuiLocal.split("-")[2]);
    for (const type of typesAEnvoyer) {
      let payload;
      if (type === "rituel") {
        payload = {
          ...messageRituel(ligne.prenom, phase.phase, jourMois),
          type,
          url: "/journal",
        };
      } else if (type === "lune") {
        payload = { ...messageLune(ligne.prenom), type, url: "/" };
      } else if (type === "regles") {
        payload = { ...messageRegles(ligne.prenom, 2), type, url: "/" };
      } else {
        payload = { ...messageOvulation(ligne.prenom), type, url: "/" };
      }

      const body = JSON.stringify(payload);

      for (const abo of abos as Abonnement[]) {
        try {
          await webpush.sendNotification(
            {
              endpoint: abo.endpoint,
              keys: { p256dh: abo.p256dh, auth: abo.auth },
            },
            body,
            { TTL: 3600 }
          );
          envoyees += 1;
        } catch (e: unknown) {
          const err = e as { statusCode?: number };
          if (err.statusCode === 404 || err.statusCode === 410) {
            await supabaseAdmin
              .from("push_subscriptions")
              .delete()
              .eq("endpoint", abo.endpoint);
          }
          erreurs += 1;
        }
      }

      const colonneDate = {
        rituel: "derniere_notif_rituel",
        lune: "derniere_notif_lune",
        regles: "derniere_notif_regles",
        ovulation: "derniere_notif_ovulation",
      }[type];

      await supabaseAdmin
        .from("preferences_notif")
        .update({ [colonneDate]: aujourdhuiLocal })
        .eq("user_id", ligne.user_id);
    }
  }

  return NextResponse.json({
    ok: true,
    envoyees,
    ignorees,
    erreurs,
    utilisatricesActives: lignes?.length ?? 0,
  });
}
