import StarField from "@/components/layout/StarField";
import MoonWordmark from "@/components/layout/MoonWordmark";
import GreetingHeader from "@/components/layout/GreetingHeader";
import BottomNav from "@/components/layout/BottomNav";
import CycleWheel from "@/components/cycle/CycleWheel";
import CyclesInfoCard from "@/components/cycle/CyclesInfoCard";
import JournalCTA from "@/components/journal/JournalCTA";

const DEMO_PRENOM = "Véronique";
const DEMO_CYCLE = {
  cycleDay: 14,
  cyclePhase: "Phase d'ovulation",
  lunarPhaseName: "Gibbeuse",
  lunarPhaseQualifier: "Croissante",
  lunarPhasePercent: 82,
};

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden pb-28">
      <StarField />

      <div className="relative z-10">
        <MoonWordmark />

        <div className="px-6">
          <GreetingHeader prenom={DEMO_PRENOM} />

          <div className="flex justify-center mb-7">
            <CycleWheel
              cycleDay={DEMO_CYCLE.cycleDay}
              lunarPhasePercent={DEMO_CYCLE.lunarPhasePercent}
            />
          </div>

          <CyclesInfoCard {...DEMO_CYCLE} />

          <JournalCTA />
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
