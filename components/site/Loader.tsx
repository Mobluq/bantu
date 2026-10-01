"use client";

import { AnimatePresence, animate, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const FLUID = [0.32, 0.72, 0, 1] as const;

/** Film-strip loader with a counting number (once per session), then a curtain lift. */
export function Loader() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);
  const [n, setN] = useState(0);

  useEffect(() => {
    let seen = false;
    try {
      seen = window.sessionStorage.getItem("ona.loader") === "1";
      window.sessionStorage.setItem("ona.loader", "1");
    } catch {
      /* storage blocked: show once per load */
    }
    if (seen || reduce) return;
    setShow(true);
    const c = animate(0, 100, { duration: 1.6, ease: [0.6, 0, 0.2, 1], onUpdate: (v) => setN(Math.round(v)), onComplete: () => window.setTimeout(() => setShow(false), 250) });
    return () => c.stop();
  }, [reduce]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[70] flex flex-col justify-between bg-brick text-cream"
          initial={{ y: 0 }}
          exit={{ y: "-100%", transition: { duration: 0.9, ease: FLUID } }}
          aria-hidden="true"
        >
          <Strip />
          <div className="flex items-end justify-between px-6 lg:px-12">
            <span className="t-mono text-[11px]">Loading the roads</span>
            <span className="t-display-wide text-[clamp(120px,22vw,320px)] tabular-nums leading-[0.8]">{n}</span>
          </div>
          <Strip />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Strip() {
  return (
    <div className="flex h-12 items-center gap-3 overflow-hidden bg-ink px-3">
      {Array.from({ length: 60 }, (_, i) => (
        <span key={i} className="h-6 w-4 shrink-0 rounded-[3px] bg-cream/85" />
      ))}
    </div>
  );
}
