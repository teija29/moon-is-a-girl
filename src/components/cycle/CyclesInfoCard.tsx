import { phrasePleineLune } from "@/lib/lune";

type Props = {
  cycleDay: number;
  cyclePhase: string;
  lunarPhaseName: string;
  lunarPhaseSubtitle: string;
  joursJusquaPleineLune?: number;
};

export default function CyclesInfoCard({
  cycleDay,
  cyclePhase,
  lunarPhaseName,
  lunarPhaseSubtitle,
  joursJusquaPleineLune,
}: Props) {
  return (
    <div>
      <div className="card-nocturne rounded-[20px] px-[18px] py-4 mb-3">
        <div className="flex justify-between items-start gap-[14px]">
          <div className="flex-1">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cycle-rose inline-block" />
              <p className="text-[10px] text-lune-lavande m-0 tracking-[0.15em] uppercase font-medium">
                Ton cycle
              </p>
            </div>
            <p className="font-serif text-2xl text-lune-creme m-0 font-normal leading-none">
              Jour {cycleDay}
            </p>
            <p className="text-xs text-cycle-rose mt-1.5 italic">{cyclePhase}</p>
          </div>

          <div
            className="w-px self-stretch"
            style={{ background: "rgba(184, 169, 217, 0.2)" }}
          />

          <div className="flex-1">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-lune-or inline-block" />
              <p className="text-[10px] text-lune-lavande m-0 tracking-[0.15em] uppercase font-medium">
                La lune
              </p>
            </div>
            <p className="font-serif text-2xl text-lune-creme m-0 font-normal leading-none">
              {lunarPhaseName}
            </p>
            <p className="text-xs text-lune-or mt-1.5 italic">
              {lunarPhaseSubtitle}
            </p>
          </div>
        </div>
      </div>

      {typeof joursJusquaPleineLune === "number" && (
        <p className="font-serif italic text-sm text-lune-lavande/70 text-center mb-[18px]">
          ✦ {phrasePleineLune(joursJusquaPleineLune)}
        </p>
      )}
    </div>
  );
}
