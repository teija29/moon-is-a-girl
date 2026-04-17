export default function MoonWordmark() {
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#D4AF7A"
        strokeWidth="1.6"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M20 12 A 8 8 0 1 1 12 4 A 6 6 0 0 0 20 12 Z" />
      </svg>
      <span className="font-serif italic text-sm text-lune-or tracking-[0.15em]">
        Moon is a Girl
      </span>
    </div>
  );
}
