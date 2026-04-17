export default function JournalCTA() {
  return (
    <button
      type="button"
      className="card-or w-full rounded-[20px] px-[18px] py-4 flex items-center gap-3.5 text-left cursor-pointer"
    >
      <div
        className="w-[38px] h-[38px] rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: "rgba(212, 175, 122, 0.18)" }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#D4AF7A"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3 C 14 8, 16 9, 21 10 C 16 12, 14 14, 12 21 C 10 14, 8 12, 3 10 C 8 9, 10 8, 12 3 Z" />
        </svg>
      </div>
      <div className="flex-1">
        <p className="font-serif text-[15px] text-lune-creme m-0 italic leading-tight">
          Comment te sens-tu ce soir&nbsp;?
        </p>
        <p className="text-[11px] text-lune-lavande mt-0.5">
          Écris une page de ton journal
        </p>
      </div>
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#D4AF7A"
        strokeWidth="1.5"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M9 6 L15 12 L9 18" />
      </svg>
    </button>
  );
}
