export default function StarField() {
  const stars = [
    { cx: 30, cy: 120, r: 0.8, fill: "#F5EFE6", delay: "0s" },
    { cx: 260, cy: 95, r: 1, fill: "#D4AF7A", delay: "1.2s" },
    { cx: 80, cy: 160, r: 0.6, fill: "#F5EFE6", delay: "0.5s" },
    { cx: 220, cy: 200, r: 0.9, fill: "#B8A9D9", delay: "2s" },
    { cx: 50, cy: 400, r: 0.7, fill: "#F5EFE6", delay: "1.8s" },
    { cx: 270, cy: 450, r: 0.8, fill: "#D4AF7A", delay: "0.7s" },
    { cx: 160, cy: 70, r: 0.5, fill: "#F5EFE6", delay: "2.4s" },
    { cx: 200, cy: 640, r: 0.7, fill: "#B8A9D9", delay: "1.5s" },
    { cx: 40, cy: 580, r: 0.6, fill: "#F5EFE6", delay: "0.3s" },
    { cx: 180, cy: 300, r: 0.5, fill: "#F5EFE6", delay: "2.1s" },
    { cx: 110, cy: 520, r: 0.7, fill: "#B8A9D9", delay: "0.9s" },
  ];

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 300 700"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {stars.map((s, i) => (
        <circle
          key={i}
          cx={s.cx}
          cy={s.cy}
          r={s.r}
          fill={s.fill}
          className="animate-twinkle"
          style={{ animationDelay: s.delay }}
        />
      ))}
    </svg>
  );
}
