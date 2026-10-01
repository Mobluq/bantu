"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "@phosphor-icons/react";
import { NigeriaMap } from "@/components/ona/NigeriaMap";
import { PLACES, TALES } from "@/lib/ona/data";
import { Bezel } from "./Bezel";

const FLUID = [0.32, 0.72, 0, 1] as const;
const STATUSES = Object.fromEntries(PLACES.map((p) => [p.id, p.status]));

export function MapShowcase() {
  const [night, setNight] = useState(false);
  const [sel, setSel] = useState("osogbo");
  const place = PLACES.find((p) => p.id === sel)!;
  const tale = TALES[place.culture];
  return (
    <Bezel radius={40} pad={8} coreClassName="transition-colors duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]" coreStyle={{ background: night ? "var(--color-night)" : "var(--color-paper)" }}>
      <div className="flex items-center justify-between px-8 pt-7">
        <span className={`t-mono text-[10.5px] ${night ? "text-gold" : "text-brick"}`}>Tap a place</span>
        <div role="radiogroup" aria-label="Map mode" className={`flex rounded-full p-1 ring-1 ${night ? "ring-cream/20" : "ring-ink/15"}`}>
          {[
            { n: false, label: "Day", Icon: Sun },
            { n: true, label: "Àlọ́ night", Icon: Moon },
          ].map(({ n, label, Icon }) => (
            <button
              key={label}
              type="button"
              role="radio"
              aria-checked={night === n}
              onClick={() => setNight(n)}
              className={`relative flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-medium ${night === n ? (night ? "text-ink" : "text-cream") : night ? "text-cream" : "text-ink"}`}
            >
              {night === n && <motion.span layoutId="site-daynight" transition={{ duration: 0.6, ease: FLUID }} className={`absolute inset-0 rounded-full ${night ? "bg-cream" : "bg-ink"}`} />}
              <span className="relative flex items-center gap-1.5">
                <Icon size={15} weight="light" />
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="px-6 pb-2 pt-4">
        <NigeriaMap night={night} statuses={STATUSES} selected={sel} onSelect={setSel} />
      </div>
      <div className={`grid grid-cols-[1fr_auto] items-end gap-6 border-t px-8 py-6 ${night ? "border-cream/10 text-cream" : "border-ink/10"}`} aria-live="polite">
        <div>
          <div className="t-display text-[36px]">{night ? (tale ? tale.title : `No tale from ${place.name} yet`) : place.title}</div>
          <p className={`mt-1.5 max-w-[48ch] text-[14.5px] leading-relaxed ${night ? "text-cream/75" : "text-muted"}`}>
            {night ? (tale ? tale.text : "Àlọ́ for this region arrives with its release.") : place.blurb || `${place.name} is still hidden in the prototype.`}
          </p>
        </div>
        <span className={`t-mono text-[10.5px] ${night ? "text-cream/60" : "text-muted"}`}>
          {place.name} · {place.people}
        </span>
      </div>
    </Bezel>
  );
}
