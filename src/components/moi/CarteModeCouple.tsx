export default function CarteModeCouple() {
  return (
    <div
      className="rounded-[20px] px-[18px] py-5 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, rgba(107, 91, 149, 0.15) 0%, rgba(200, 156, 168, 0.1) 100%)",
        border: "0.5px solid rgba(200, 156, 168, 0.25)",
      }}
    >
      <div className="flex items-start gap-3.5">
        <div
          className="w-[42px] h-[42px] rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(200, 156, 168, 0.18)" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M16 8 A 4 4 0 1 1 12 4 A 3 3 0 0 0 16 8 Z"
              fill="#C89CA8"
              opacity="0.9"
            />
            <path
              d="M14 18 A 4 4 0 1 1 10 14 A 3 3 0 0 0 14 18 Z"
              fill="#D4AF7A"
              opacity="0.9"
            />
          </svg>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-serif text-[15px] text-lune-creme leading-tight">
              Mode couple
            </p>
            <span
              className="text-[9px] tracking-[0.2em] uppercase px-2 py-0.5 rounded-full"
              style={{
                background: "rgba(200, 156, 168, 0.2)",
                color: "#C89CA8",
              }}
            >
              bientôt
            </span>
          </div>
          <p className="font-serif italic text-[13px] text-lune-lavande leading-snug">
            Partage ton cycle avec ta personne de confiance. Pour celles qui
            souhaitent construire, comprendre, accompagner.
          </p>
        </div>
      </div>
    </div>
  );
}
