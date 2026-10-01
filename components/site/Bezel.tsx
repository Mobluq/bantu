import type { CSSProperties, ReactNode } from "react";

/**
 * Double-bezel enclosure: a hairline tray (outer shell) holding a machined plate (inner core).
 * Radii are concentric: inner = outer − padding.
 */
export function Bezel({
  children,
  className = "",
  coreClassName = "",
  coreStyle,
  radius = 32,
  pad = 6,
  dark = false,
}: {
  children: ReactNode;
  className?: string;
  coreClassName?: string;
  coreStyle?: CSSProperties;
  radius?: number;
  pad?: number;
  dark?: boolean;
}) {
  return (
    <div
      className={`${dark ? "bg-cream/[0.06] ring-cream/10" : "bg-ink/[0.04] ring-ink/[0.08]"} ring-1 ${className}`}
      style={{ borderRadius: radius, padding: pad }}
    >
      <div
        className={`relative h-full overflow-hidden shadow-[inset_0_1px_1px_rgb(255_255_255_/_0.18)] ${coreClassName}`}
        style={{ borderRadius: radius - pad, ...coreStyle }}
      >
        {children}
      </div>
    </div>
  );
}

export function Eyebrow({ children, tone = "light" }: { children: ReactNode; tone?: "light" | "dark" }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] ring-1 ${
        tone === "light" ? "bg-paper/70 text-brick ring-ink/10" : "bg-cream/10 text-gold ring-cream/15"
      }`}
    >
      <span className="size-1 rounded-full bg-current" />
      {children}
    </span>
  );
}
