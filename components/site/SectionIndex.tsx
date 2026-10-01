"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const SECTIONS = [
  ["prototype", "Prototype"],
  ["statement", "Why"],
  ["chapters", "Chapters"],
  ["guides", "The guides"],
  ["map", "The map"],
  ["lessons", "Lessons"],
  ["guardrails", "Guardrails"],
] as const;

/** Fixed bottom-left index: which numbered section is on screen (IntersectionObserver, no scroll listeners). */
export function SectionIndex() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const i = SECTIONS.findIndex(([id]) => id === e.target.id);
            if (i >= 0) setActive(i);
          }
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const [id] of SECTIONS) {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    }
    return () => obs.disconnect();
  }, []);
  const [, label] = SECTIONS[active];
  if (active === 0) return null;
  return (
    <div className="pointer-events-none fixed bottom-6 left-8 z-40 hidden items-baseline gap-3 rounded-full bg-paper/75 px-4 py-2 ring-1 ring-ink/10 backdrop-blur-xl lg:flex" aria-hidden="true">
      <span className="t-mono text-[11px] tabular-nums text-brick">{String(active + 1).padStart(2, "0")} / {String(SECTIONS.length).padStart(2, "0")}</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={label} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }} className="t-mono text-[11px]">
          ({label})
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
