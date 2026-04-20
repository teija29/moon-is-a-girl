import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const userAgent = request.headers.get("user-agent") ?? "";
  if (!userAgent.includes("vercel")) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }
  }

  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { message: "CRON_SECRET manquant" },
      { status: 500 }
    );
  }

  const url = new URL("/api/push/envoyer", request.url);
  const reponse = await fetch(url.toString(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
  });

  const data = await reponse.json();
  return NextResponse.json(data, { status: reponse.status });
}
