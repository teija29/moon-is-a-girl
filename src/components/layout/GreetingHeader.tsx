"use client";

import { useEffect, useState } from "react";

type Props = {
  prenom: string;
};

function getGreeting(hour: number): string {
  if (hour >= 5 && hour < 12) return "Bonjour";
  if (hour >= 12 && hour < 18) return "Bon après-midi";
  if (hour >= 18 && hour < 23) return "Bonsoir";
  return "Bonne nuit";
}

function getPoeticSubtitle(hour: number): string {
  if (hour >= 5 && hour < 12) return "La lune se retire doucement";
  if (hour >= 12 && hour < 18) return "La lune sommeille, tu veilles";
  if (hour >= 18 && hour < 23) return "La lune te parle ce soir";
  return "Elle veille sur ton sommeil";
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export default function GreetingHeader({ prenom }: Props) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  if (!now) {
    return <div className="mb-7 h-[88px]" aria-hidden="true" />;
  }

  const hour = now.getHours();
  const greeting = getGreeting(hour);
  const subtitle = getPoeticSubtitle(hour);
  const dateStr = formatDate(now);

  return (
    <div className="mb-7">
      <p className="text-[10px] tracking-[0.25em] uppercase text-lune-lavande font-medium mb-2">
        {dateStr}
      </p>
      <h1 className="font-serif text-3xl font-normal text-lune-creme leading-[1.1] tracking-wide m-0">
        {greeting}, {prenom}
      </h1>
      <p className="font-serif italic text-sm text-lune-or mt-2 leading-snug">
        {subtitle}
      </p>
    </div>
  );
}
