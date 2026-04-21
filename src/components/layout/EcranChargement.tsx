import StarField from "@/components/layout/StarField";
import MoonWordmark from "@/components/layout/MoonWordmark";

export default function EcranChargement() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <StarField />
      <div className="relative z-10">
        <MoonWordmark />
        <div className="flex flex-col items-center justify-center pt-24 px-6">
          <div
            className="w-12 h-12 rounded-full mb-6"
            style={{
              background:
                "radial-gradient(circle at 35% 35%, #E8D5A8 0%, #D4AF7A 55%, rgba(212,175,122,0) 100%)",
              boxShadow: "0 0 30px rgba(212,175,122,0.35)",
              animation: "pulse-lune 2.4s ease-in-out infinite",
            }}
            aria-hidden="true"
          />
          <p className="font-serif italic text-sm text-lune-lavande tracking-wide">
            Un instant, la lune s&apos;aligne…
          </p>
        </div>
      </div>
      <style>{`
        @keyframes pulse-lune {
          0%, 100% { opacity: 0.55; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1.05); }
        }
      `}</style>
    </main>
  );
}
