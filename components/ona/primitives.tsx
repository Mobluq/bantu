"use client";

import { memo, useId, type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { EMBLEMS, type EmblemName } from "@/lib/ona/emblems";

export const spring = { type: "spring", stiffness: 100, damping: 20 } as const;
export const snappy = { type: "spring", stiffness: 380, damping: 30 } as const;

type EmblemProps = {
  name: EmblemName;
  size?: number;
  color?: string;
  bg?: string;
  /** Draw a filled disc behind the emblem (avatar style). */
  disc?: boolean;
  /** Ink displacement strength. 0 disables the print texture. */
  rough?: number;
  speckle?: boolean;
  label?: string;
  className?: string;
};

/** Stamp-printed guide emblem. Shapes inherit `color`; cut-outs use `bg`. */
export const Emblem = memo(function Emblem({
  name,
  size = 120,
  color = "var(--color-brick)",
  bg = "var(--color-cream)",
  disc = false,
  rough = 2.2,
  speckle = true,
  label,
  className,
}: EmblemProps) {
  const id = useId().replace(/:/g, "");
  const seed = name.length * 7 + size;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      style={{ color, overflow: "visible", ["--emb-bg" as string]: bg, display: "block" }}
    >
      {rough > 0 && (
        <defs>
          <filter id={`ink${id}`} x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves={2} seed={seed % 97} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={rough} xChannelSelector="R" yChannelSelector="G" result="d" />
            {speckle && (
              <>
                <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves={1} seed={(seed * 3) % 89} result="s" />
                <feColorMatrix in="s" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -5 0 0 0 3.45" result="m" />
                <feComposite in="d" in2="m" operator="in" />
              </>
            )}
          </filter>
        </defs>
      )}
      {disc && <circle cx="100" cy="100" r="100" style={{ fill: bg }} />}
      <g transform={disc ? "translate(22 22) scale(.78)" : undefined}>
        <g
          filter={rough > 0 ? `url(#ink${id})` : undefined}
          fill="currentColor"
          dangerouslySetInnerHTML={{ __html: EMBLEMS[name] }}
        />
      </g>
    </svg>
  );
});

export function Cowrie({ size = 18, fill = "var(--color-paper)", stroke = "var(--color-ink)" }: { size?: number; fill?: string; stroke?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className="block shrink-0">
      <ellipse cx="12" cy="12" rx="7.5" ry="10" style={{ fill, stroke }} strokeWidth="2" />
      <path d="M12 4 C10.6 9 10.6 15 12 20" fill="none" style={{ stroke }} strokeWidth="2" />
      <path
        d="M10.6 7h-1.6M10.3 10h-1.8M10.3 13h-1.8M10.6 16h-1.6M13.4 7h1.6M13.7 10h1.8M13.7 13h1.8M13.4 16h1.6"
        style={{ stroke }}
        strokeWidth="1.4"
      />
    </svg>
  );
}

const BAR_HEIGHTS = [0.4, 0.7, 1, 0.6, 0.85, 0.5, 0.9, 0.65, 1, 0.45, 0.75, 0.95, 0.55, 0.8, 0.4, 0.7, 0.9, 0.5];

/** Voice waveform. Bars animate only while `playing`. */
export const Waveform = memo(function Waveform({ bars = 16, height = 18, playing = false, className = "" }: { bars?: number; height?: number; playing?: boolean; className?: string }) {
  return (
    <span aria-hidden="true" className={`flex items-center gap-[2.5px] ${className}`} style={{ height }}>
      {Array.from({ length: bars }, (_, k) => (
        <i
          key={k}
          className="block w-[3px] origin-center rounded-[2px] bg-current"
          style={{
            height: Math.round(height * BAR_HEIGHTS[k % BAR_HEIGHTS.length]),
            animation: playing ? `wave-bar 1.1s ease-in-out ${((k * 0.07) % 1).toFixed(2)}s infinite` : undefined,
            opacity: playing ? 1 : 0.55,
          }}
        />
      ))}
    </span>
  );
});

export const Marquee = memo(function Marquee({ words, className = "" }: { words: string[]; className?: string }) {
  const run = (key: string) => (
    <div key={key} className="flex shrink-0 items-center">
      {words.map((w, i) => (
        <span key={i} className="flex items-center gap-4 whitespace-nowrap pr-4">
          <span>{w}</span>
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
            <path d="M5 0 L6.2 3.8 L10 5 L6.2 6.2 L5 10 L3.8 6.2 L0 5 L3.8 3.8 Z" className="fill-gold" />
          </svg>
        </span>
      ))}
    </div>
  );
  return (
    <div className={`overflow-hidden bg-ink py-[9px] text-cream ${className}`} aria-label={words.slice(0, 4).join(", ")}>
      <div className="t-display-wide flex w-max animate-marquee text-[15px] uppercase leading-none tracking-[0.02em]" aria-hidden="true">
        {run("a")}
        {run("b")}
      </div>
    </div>
  );
});

export function Mono({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`t-mono text-[10.5px] ${className}`}>{children}</span>;
}

type PressProps = HTMLMotionProps<"button"> & { tone?: "ink" | "gold" | "night" };

/** Primary action: label left, square key right. Tactile press via scale. */
export function PrimaryButton({ children, tone = "ink", disabled, className = "", ...rest }: PressProps & { children: ReactNode }) {
  const tones = {
    ink: "bg-ink text-cream",
    gold: "bg-gold text-ink",
    night: "bg-gold text-ink",
  } as const;
  return (
    <motion.button
      type="button"
      whileTap={disabled ? undefined : { scale: 0.98, y: 1 }}
      transition={snappy}
      disabled={disabled}
      className={`flex h-[58px] w-full items-center justify-between rounded-[14px] pl-5 pr-2 text-[16.5px] font-semibold transition-opacity duration-300 disabled:cursor-not-allowed disabled:opacity-40 ${tones[tone]} ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  );
}

export function KeyCap({ tone = "ink", children }: { tone?: "ink" | "gold" | "night"; children: ReactNode }) {
  const key = { ink: "bg-gold text-ink", gold: "bg-ink text-gold", night: "bg-night text-gold" } as const;
  return <span className={`flex size-[42px] items-center justify-center rounded-[10px] ${key[tone]}`}>{children}</span>;
}

/** Guide speech bubble: paper, ink hairline, square corner at the speaker. */
export function Bubble({ who, whoClass = "text-brick", action, children, dark = false }: { who: string; whoClass?: string; action?: ReactNode; children: ReactNode; dark?: boolean }) {
  return (
    <div
      className={`flex-1 rounded-[4px_20px_20px_20px] px-[14px] pb-3 pt-[11px] ${
        dark ? "border border-cream/25 bg-paper/[0.08] text-cream" : "border-[1.5px] border-ink bg-paper text-ink"
      }`}
    >
      <div className="mb-1 flex items-center justify-between">
        <span className={`text-[13.5px] font-bold ${whoClass}`}>{who}</span>
        {action}
      </div>
      <div className="text-[15px] leading-[1.42]">{children}</div>
    </div>
  );
}
