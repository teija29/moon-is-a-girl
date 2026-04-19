"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

type Props = {
  href?: string;
  onClick?: () => void;
  icone: ReactNode;
  titre: string;
  description?: string;
  variant?: "default" | "danger";
};

export default function CarteAction({
  href,
  onClick,
  icone,
  titre,
  description,
  variant = "default",
}: Props) {
  const router = useRouter();

  const couleursTitre =
    variant === "danger" ? "text-cycle-rose" : "text-lune-creme";
  const bordureIcone =
    variant === "danger"
      ? "rgba(200, 156, 168, 0.18)"
      : "rgba(212, 175, 122, 0.15)";
  const couleurIcone = variant === "danger" ? "#C89CA8" : "#D4AF7A";

  const action = () => {
    if (onClick) onClick();
    else if (href) router.push(href);
  };

  return (
    <button
      type="button"
      onClick={action}
      className="card-nocturne w-full rounded-[20px] px-[18px] py-4 flex items-center gap-3.5 text-left cursor-pointer hover:bg-nuit-encre/60 transition-colors duration-300"
    >
      <div
        className="w-[38px] h-[38px] rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: bordureIcone, color: couleurIcone }}
      >
        {icone}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-serif text-[15px] ${couleursTitre} m-0 leading-tight`}>
          {titre}
        </p>
        {description && (
          <p className="text-[11px] text-lune-lavande mt-0.5 truncate">
            {description}
          </p>
        )}
      </div>
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke={couleurIcone}
        strokeWidth="1.5"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M9 6 L15 12 L9 18" />
      </svg>
    </button>
  );
}
