"use client";

import { useRouter, usePathname } from "next/navigation";

type TabId = "lune" | "cycle" | "journal" | "historique" | "moi";

type Props = {
  activeTab?: TabId;
};

type NavItemProps = {
  label: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

function NavItem({ label, active, onClick, children }: NavItemProps) {
  const color = active ? "#D4AF7A" : "#B8A9D9";
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-1 bg-transparent border-0 cursor-pointer"
      aria-current={active ? "page" : undefined}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={active ? 1.5 : 1.3}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </svg>
      <span
        className="text-[9px] tracking-widest"
        style={{ color, fontWeight: active ? 500 : 400 }}
      >
        {label}
      </span>
    </button>
  );
}

/**
 * Détermine l'onglet actif à partir du pathname si la prop n'est pas fournie.
 */
function deduireActiveTab(pathname: string): TabId {
  if (pathname === "/") return "lune";
  if (pathname === "/journal") return "journal";
  if (pathname.startsWith("/journal")) return "historique";
  if (pathname.startsWith("/statistiques")) return "cycle";
  if (pathname.startsWith("/moi")) return "moi";
  return "lune";
}

export default function BottomNav({ activeTab }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const courant = activeTab ?? deduireActiveTab(pathname);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-around px-6 pt-3.5 pb-5 border-t"
      style={{
        background: "rgba(11, 13, 31, 0.92)",
        borderTopColor: "rgba(184, 169, 217, 0.12)",
        backdropFilter: "blur(12px)",
      }}
    >
      <NavItem
        label="LUNE"
        active={courant === "lune"}
        onClick={() => router.push("/")}
      >
        <path d="M20 12 A 8 8 0 1 1 12 4 A 6 6 0 0 0 20 12 Z" />
      </NavItem>
      <NavItem
        label="CYCLE"
        active={courant === "cycle"}
        onClick={() => router.push("/statistiques")}
      >
        <rect x="4" y="5" width="16" height="16" rx="2" />
        <line x1="4" y1="10" x2="20" y2="10" />
        <line x1="9" y1="2" x2="9" y2="7" />
        <line x1="15" y1="2" x2="15" y2="7" />
      </NavItem>
      <NavItem
        label="JOURNAL"
        active={courant === "journal" || courant === "historique"}
        onClick={() => router.push("/journal/historique")}
      >
        <path d="M5 4 L5 20 L19 20 L19 8 L15 4 Z" />
        <line x1="8" y1="10" x2="16" y2="10" />
        <line x1="8" y1="14" x2="14" y2="14" />
      </NavItem>
      <NavItem
        label="MOI"
        active={courant === "moi"}
        onClick={() => router.push("/moi")}
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21 C 4 16, 8 14, 12 14 C 16 14, 20 16, 20 21" />
      </NavItem>
    </nav>
  );
}
