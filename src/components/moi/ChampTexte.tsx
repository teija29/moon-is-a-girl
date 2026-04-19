type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  maxLength?: number;
};

export default function ChampTexte({
  id,
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
  maxLength,
}: Props) {
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
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        maxLength={maxLength}
        className="w-full bg-transparent border-0 border-b border-lune-lavande/30 font-serif text-xl text-lune-creme py-3 focus:outline-none focus:border-lune-or transition-colors duration-500 placeholder:text-lune-lavande/30"
      />
    </div>
  );
}
