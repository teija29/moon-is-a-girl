type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  max?: string;
};

export default function ChampDate({ id, label, value, onChange, max }: Props) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[10px] tracking-[0.25em] uppercase text-lune-lavande font-medium mb-2"
      >
        {label}
      </label>
      <input
        id={id}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        max={max}
        className="w-full bg-transparent border-0 border-b border-lune-lavande/30 font-serif text-xl text-lune-creme py-3 focus:outline-none focus:border-lune-or transition-colors duration-500 [color-scheme:dark]"
      />
    </div>
  );
}
