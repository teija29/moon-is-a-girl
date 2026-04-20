export type TypeNotif = "rituel" | "lune" | "regles" | "ovulation";

export type MessageNotif = {
  titre: string;
  corps: string;
};

function pick<T>(variants: T[], seed: number): T {
  return variants[seed % variants.length];
}

export function messageRituel(
  prenom: string,
  phaseCycle: "menstruation" | "folliculaire" | "ovulation" | "luteale",
  jourMois: number
): MessageNotif {
  const parPhase: Record<string, string[]> = {
    menstruation: [
      `Bonsoir ${prenom}. Prends trois minutes pour toi — ton journal t'attend.`,
      `Bonsoir ${prenom}. C'est le moment de ralentir et de noter comment tu te sens.`,
      `Bonsoir ${prenom}. Une pause douce avant la nuit, dans ton journal ?`,
    ],
    folliculaire: [
      `Bonsoir ${prenom}. Prends trois minutes pour toi — ton journal t'attend.`,
      `Bonsoir ${prenom}. Qu'est-ce qui t'a portée aujourd'hui ?`,
      `Bonsoir ${prenom}. Un petit passage dans ton journal avant la nuit ?`,
    ],
    ovulation: [
      `Bonsoir ${prenom}. Prends trois minutes pour toi — ton journal t'attend.`,
      `Bonsoir ${prenom}. Qu'est-ce qui a rayonné en toi aujourd'hui ?`,
      `Bonsoir ${prenom}. Note ce que cette journée t'a apporté.`,
    ],
    luteale: [
      `Bonsoir ${prenom}. Prends trois minutes pour toi — ton journal t'attend.`,
      `Bonsoir ${prenom}. Écoute-toi ce soir, et dépose ce qui vient.`,
      `Bonsoir ${prenom}. Une page de journal pour faire le tri intérieur ?`,
    ],
  };

  return {
    titre: "Moon is a Girl",
    corps: pick(parPhase[phaseCycle], jourMois),
  };
}

export function messageLune(prenom: string): MessageNotif {
  return {
    titre: "Pleine lune demain ✦",
    corps: `Pleine lune demain, ${prenom}. Le bon moment pour faire une pause dehors.`,
  };
}

export function messageRegles(prenom: string, jours: number): MessageNotif {
  return {
    titre: "Tes règles approchent",
    corps: `Tes règles arrivent dans ${jours} jour${jours > 1 ? "s" : ""}, ${prenom}. Écoute-toi et ralentis si tu peux.`,
  };
}

export function messageOvulation(prenom: string): MessageNotif {
  return {
    titre: "Ovulation aujourd'hui",
    corps: `Ovulation aujourd'hui, ${prenom} — c'est la période la plus fertile de ton cycle.`,
  };
}
