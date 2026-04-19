import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { creerClientServeur } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await creerClientServeur();
    const {
      data: { user },
      error: erreurSession,
    } = await supabase.auth.getUser();

    if (erreurSession || !user) {
      return NextResponse.json(
        { message: "Non authentifié" },
        { status: 401 }
      );
    }

    const urlSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const cleService = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!urlSupabase || !cleService) {
      console.error("Variables d'environnement Supabase manquantes.");
      return NextResponse.json(
        { message: "Configuration serveur invalide" },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(urlSupabase, cleService, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { error: erreurSuppression } =
      await supabaseAdmin.auth.admin.deleteUser(user.id);

    if (erreurSuppression) {
      console.error("Erreur deleteUser:", erreurSuppression);
      return NextResponse.json(
        { message: "Échec de la suppression" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Erreur route /api/compte/supprimer:", e);
    return NextResponse.json(
      { message: "Erreur serveur" },
      { status: 500 }
    );
  }
}
