import type { StatCorrelationLune } from "@/lib/statistiques";

type Props = { stat: StatCorrelationLune };

export default function CarteCorrelationLune({ stat }: Props) {
  return (
    <div
      className="rounded-[20px] px-[18px] py-5 mb-4"
      style={{
        background:
          "linear-gradient(135deg, rgba(107, 91, 149, 0.15) 0%, rgba(212, 175, 122, 0.08) 100%)",
        border: "0.5px solid rgba(212, 175, 122, 0.25)",
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(212, 175, 122, 0.15)" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4AF7A" strokeWidth="1.5" strokeLinecap="round">
            <path d="M20 12 A 8 8 0 1 1 12 4 A 6 6 0 0 0 20 12 Z" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-[10px] tracking-[0.25em] uppercase text-lune-lavande font-medium mb-1">
            Cycle × lune
          </p>
          <p className="font-serif italic text-sm text-lune-creme leading-relaxed">
            {stat.message}
          </p>
        </div>
      </div>
    </div>
  );
}
