"use client";

import { useEffect, useState } from "react";
import { animate, motion, useReducedMotion } from "framer-motion";
import { Emblem, Mono, spring } from "../primitives";

export function Splash({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const controls = animate(0, 100, {
      duration: reduce ? 0.2 : 2.4,
      ease: [0.6, 0, 0.2, 1],
      onUpdate: (v) => setPct(Math.round(v)),
      onComplete: () => window.setTimeout(onDone, reduce ? 0 : 350),
    });
    return () => controls.stop();
  }, [onDone, reduce]);

  return (
    <button
      type="button"
      onClick={onDone}
      aria-label="Enter ọ̀nà"
      className="relative flex h-full w-full flex-col bg-cream text-left text-ink"
    >
      <div className="flex w-full justify-between px-[22px] pt-14">
        <Mono>Nº 001 — First edition</Mono>
        <Mono>9.08°N · 8.68°E</Mono>
      </div>

      <div className="mt-20 grid w-full grid-cols-[1fr_auto] items-end gap-2 pl-[22px]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.25 }}
          className="self-start"
        >
          <span className="t-mono block text-[10.5px] text-brick">Vol. I · The roads</span>
          <span className="t-serif mt-3 block max-w-[10ch] text-[26px] leading-[1.05]">a living almanac of Nigeria</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, rotate: -20, scale: 0.9 }}
          animate={{ opacity: 1, rotate: -8, scale: 1 }}
          transition={{ ...spring, delay: 0.05 }}
          className="-mr-16"
        >
          <Emblem name="esu" size={250} rough={2.6} label="ọ̀nà crossroads mark" />
        </motion.div>
      </div>

      <motion.span
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: 0.4 }}
        className="t-display-wide mt-4 block pl-[18px] text-[150px] leading-[0.8] text-brick"
      >
        ọ̀nà
      </motion.span>

      <div className="absolute inset-x-[22px] bottom-14">
        <div className="flex justify-between">
          <Mono>Loading the roads</Mono>
          <Mono className="tabular-nums">{String(pct).padStart(2, "0")}%</Mono>
        </div>
        <div className="mt-2.5 h-[2px] bg-ink/15">
          <div className="h-[2px] origin-left bg-brick" style={{ transform: `scaleX(${pct / 100})` }} />
        </div>
      </div>
      <div className="band-kente absolute inset-x-0 bottom-0 h-[10px]" />
    </button>
  );
}
