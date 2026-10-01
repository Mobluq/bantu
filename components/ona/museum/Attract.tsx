"use client";

import { AnimatePresence, motion } from "framer-motion";
import { HandTap } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { EXHIBITION, OBJECTS } from "@/lib/ona/museum";
import { unlockAudio } from "@/lib/ona/sound";
import { Emblem, Marquee, Mono } from "../primitives";

/** Kiosk attract screen: cycles through objects until a visitor touches it. */
export function Attract({ open, onStart }: { open: boolean; onStart: () => void }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!open) return;
    const t = window.setInterval(() => setI((x) => (x + 1) % OBJECTS.length), 3800);
    return () => window.clearInterval(t);
  }, [open]);
  const o = OBJECTS[i];
  return (
    <AnimatePresence>
      {open && (
        <motion.button
          type="button"
          onClick={() => {
            unlockAudio();
            onStart();
          }}
          aria-label="Touch to begin"
          className="absolute inset-0 z-50 flex flex-col overflow-hidden text-left"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, backgroundColor: o.tone.bg, color: o.tone.fg }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex justify-between px-6 pt-10">
            <Mono>{EXHIBITION.venue}</Mono>
            <Mono>ọ̀nà</Mono>
          </div>
          <h1 className="mt-4 px-6 leading-[0.84]">
            <span className="t-display block text-[min(72px,18cqw)]">{EXHIBITION.title.split(" ").slice(0, 2).join(" ")}</span>
            <span className="t-serif block text-[min(72px,18cqw)]">{EXHIBITION.title.split(" ").slice(2).join(" ")}</span>
          </h1>
          <div className="relative flex flex-1 items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div key={o.id} initial={{ rotate: -20, scale: 0.7, opacity: 0 }} animate={{ rotate: -4, scale: 1, opacity: 1 }} exit={{ rotate: 10, scale: 0.9, opacity: 0 }} transition={{ type: "spring", stiffness: 90, damping: 16 }} className="flex flex-col items-center gap-4">
                <Emblem name={o.emblem} size={210} color={o.tone.fg} bg={o.tone.bg} rough={2.6} />
                <span className="text-center">
                  <Mono className="block opacity-80">Nº {o.code}</Mono>
                  <span className="t-display mt-1 block text-[30px] leading-none">{o.title}</span>
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
          <Marquee words={["Ẹ kú àbọ̀", "Nnọọ", "Barka da zuwa", "Welcome", "Touch to begin"]} className="py-3" />
          <div className="flex items-center justify-center gap-3 px-6 pb-12 pt-4">
            <motion.span animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.6, repeat: Infinity }}>
              <HandTap size={34} weight="fill" />
            </motion.span>
            <span className="text-[22px] font-bold">Touch to begin</span>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
