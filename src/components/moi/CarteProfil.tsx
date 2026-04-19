import type { ProfilUtilisatrice } from "@/lib/storage";
import { formatDateHumaine } from "@/lib/journal";

type Props = {
  profil: ProfilUtilisatrice;
  email: string | null;
};

export default function CarteProfil({ profil, email }: Props) {
  return (
    <div className="card-nocturne rounded-[20px] px-[18px] py-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-[10px] tracking-[0.25em] uppercase text-lune-lavande font-medium mb-1">
            Prénom
          </p>
          <p className="font-serif text-2xl text-lune-creme leading-none">
            {profil.prenom}
          </p>
        </div>
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center font-serif text-xl text-lune-or"
          style={{
            background: "rgba(212, 175, 122, 0.15)",
            border: "0.5px solid rgba(212, 175, 122, 0.3)",
          }}
        >
          {profil.prenom.charAt(0).toUpperCase()}
        </div>
      </div>

      <div className="space-y-3 pt-3 border-t border-lune-lavande/10">
        <Ligne label="Email" valeur={email ?? "—"} italique />
        <Ligne
          label="Dernières règles"
          valeur={formatDateHumaine(profil.dernieresRegles)}
        />
        <Ligne label="Cycle moyen" valeur={`${profil.dureeCycle} jours`} />
      </div>
    </div>
  );
}

function Ligne({
  label,
  valeur,
  italique = false,
}: {
  label: string;
  valeur: string;
  italique?: boolean;
}) {
  return (
    <div className="flex justify-between items-baseline gap-4">
      <span className="text-[11px] tracking-[0.15em] uppercase text-lune-lavande/80 font-medium">
        {label}
      </span>
      <span
        className={`text-sm text-lune-creme text-right truncate ${
          italique ? "italic font-serif" : ""
        }`}
      >
        {valeur}
      </span>
    </div>
  );
}
