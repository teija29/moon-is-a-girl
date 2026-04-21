import type { StatRetard } from "@/lib/statistiques";

type Props = { stat: StatRetard };

export default function CarteRetard({ stat }: Props) {
  if (!stat.enRetard) return null;

  return (
    <div
      className="rounded-[20px] px-5 py-5 mb-4"
      style={{
        background: "rgba(200, 156, 168, 0.10)",
        border: "0.5px solid rgba(200, 156, 168, 0.30)",
      }}
    >
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(200, 156, 168, 0.18)" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C89CA8" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7 V 12 L 15 14" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="font-serif text-[16px] text-lune-creme leading-tight">
            Un retard possible
          </p>
          <p className="text-[11px] tracking-[0.15em] uppercase text-cycle-rose font-medium mt-1">
            +{stat.joursDeRetard} jour{stat.joursDeRetard > 1 ? "s" : ""}
          </p>
        </div>
      </div>
      <p className="font-serif italic text-sm text-lune-creme leading-relaxed">
        {stat.message}
      </p>
    </div>
  );
}
