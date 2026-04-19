type Props = {
  value: number;
  onChange: (n: number) => void;
};

export default function ChampDureeCycle({ value, onChange }: Props) {
  return (
    <div>
      <label
        htmlFor="duree-cycle"
        className="block text-[10px] tracking-[0.25em] uppercase text-lune-lavande font-medium mb-3"
      >
        Durée moyenne du cycle
      </label>

      <div className="text-center mb-4">
        <span className="font-serif text-5xl text-lune-creme leading-none">
          {value}
        </span>
        <span className="font-serif italic text-base text-lune-lavande ml-2">
          jours
        </span>
      </div>

      <input
        id="duree-cycle"
        type="range"
        min={21}
        max={35}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-lune-or"
        aria-label="Durée moyenne du cycle en jours"
      />

      <div className="flex justify-between text-[10px] tracking-[0.25em] uppercase text-lune-lavande/70 font-medium mt-2">
        <span>21 j</span>
        <span>28 j</span>
        <span>35 j</span>
      </div>
    </div>
  );
}
