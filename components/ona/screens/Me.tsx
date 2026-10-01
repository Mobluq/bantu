"use client";

import { ArrowCounterClockwise } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { guideById, type GuideId } from "@/lib/ona/data";
import { TabBar } from "../TabBar";
import { Cowrie, Emblem, Mono, snappy } from "../primitives";
import type { Screen } from "../state";

export function Me({ guide, cowries, streak, stamps, onGo, onReset }: { guide: GuideId; cowries: number; streak: number; stamps: number; onGo: (s: Screen) => void; onReset: () => void }) {
  const g = guideById(guide);
  const stats = [
    { k: "Day streak", v: streak },
    { k: "Cowries", v: cowries },
    { k: "Stamps", v: stamps },
  ];
  return (
    <div className="flex h-full flex-col bg-cream text-ink">
      <div className="flex-1 px-5 pt-14">
        <div className="flex justify-between">
          <Mono>Traveller’s notebook</Mono>
          <Mono className="text-brick">Walking with {g.name}</Mono>
        </div>
        <h1 className="mt-3 leading-[0.86]">
          <span className="t-display block text-[64px]">Your</span>
          <span className="t-serif block text-[62px] text-brick">notebook</span>
        </h1>
        <dl className="mt-6 grid grid-cols-[1.4fr_1fr_1fr] border-y-2 border-ink">
          {stats.map((s, i) => (
            <div key={s.k} className={`py-3.5 ${i ? "border-l border-ink/20 pl-3.5" : ""}`}>
              <dt className="t-mono text-[9.5px] text-muted">{s.k}</dt>
              <dd className="t-display-wide mt-1 text-[38px] tabular-nums">{s.v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 flex flex-col items-start gap-4 rounded-[20px] border-[1.5px] border-dashed border-ink/35 p-5">
          <Emblem name="keeper" size={72} rough={1.8} />
          <div>
            <div className="t-display text-[30px]">No saved words yet</div>
            <p className="mt-2 max-w-[32ch] text-[14px] leading-[1.45] text-muted">
              Tap the cowrie beside any word in a lesson and it lands here, with its tones and a voice clip.
            </p>
          </div>
          <span className="flex items-center gap-2 text-[13px] font-semibold">
            <Cowrie size={18} /> Try it in today’s lesson
          </span>
        </div>

        <motion.button
          type="button"
          onClick={onReset}
          whileTap={{ scale: 0.97 }}
          transition={snappy}
          className="mt-6 flex items-center gap-2 text-[13px] font-semibold underline underline-offset-[3px]"
        >
          <ArrowCounterClockwise size={16} weight="light" />
          Restart the prototype
        </motion.button>
      </div>
      <TabBar active="me" onGo={onGo} />
    </div>
  );
}
