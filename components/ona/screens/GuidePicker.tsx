"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Pause, Play } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { GUIDES, type GuideId, guideById } from "@/lib/ona/data";
import { Emblem, KeyCap, Mono, PrimaryButton, Waveform, snappy, spring } from "../primitives";

export function GuidePicker({ guide, onPick, onBack, onNext }: { guide: GuideId; onPick: (g: GuideId) => void; onBack: () => void; onNext: () => void }) {
  const g = guideById(guide);
  const index = GUIDES.findIndex((x) => x.id === guide) + 1;
  const [playing, setPlaying] = useState(false);
  useEffect(() => setPlaying(false), [guide]);
  useEffect(() => {
    if (!playing) return;
    const t = window.setTimeout(() => setPlaying(false), 7000);
    return () => window.clearTimeout(t);
  }, [playing]);

  const light = g.id === "keeper";

  return (
    <div className="flex h-full flex-col bg-cream text-ink">
      <div className="flex items-center justify-between pl-2 pr-4 pt-12">
        <button type="button" onClick={onBack} aria-label="Back" className="flex size-11 items-center justify-center">
          <ArrowLeft size={22} weight="light" />
        </button>
        <Mono>Step 2 / 3</Mono>
      </div>
      <h1 className="mx-5 mt-2">
        <span className="t-display block text-[64px]">Who walks</span>
        <span className="t-serif block text-[62px] leading-[0.9] text-brick">with you?</span>
      </h1>
      <p className="mx-5 mt-2.5 max-w-[34ch] text-[14px] leading-[1.42] text-muted">
        Every guide teaches the same checked facts. Each tells them in their own voice.
      </p>

      <motion.div
        layout
        transition={spring}
        className={`relative mx-4 mt-4 overflow-hidden rounded-[20px] ${light ? "border-[1.5px] border-ink" : "ht-light"}`}
        style={{ background: g.tone.bg, color: light ? "var(--color-ink)" : "var(--color-cream)" }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={g.id}
            initial={{ opacity: 0, rotate: 25, scale: 0.85 }}
            animate={{ opacity: 0.95, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -25, scale: 0.85 }}
            transition={spring}
            className="absolute -right-[34px] -top-[22px]"
          >
            <Emblem name={g.emblem} size={196} color={g.tone.fg} bg={g.tone.bg} rough={2.4} />
          </motion.div>
        </AnimatePresence>
        <div className="relative p-[18px]">
          <div className="flex items-center gap-2" style={{ color: light ? "var(--color-brick)" : g.tone.fg }}>
            <Mono className="tabular-nums">Guide {String(index).padStart(2, "0")} / {String(GUIDES.length).padStart(2, "0")}</Mono>
            <span className="size-1.5 rounded-full bg-current" />
            <Mono>Selected</Mono>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={g.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={snappy}>
              <div className="t-display mt-[66px] text-[80px]">{g.name}</div>
              <div className="t-serif mt-1 text-[21px]" style={{ color: light ? "var(--color-brick)" : g.tone.fg }}>
                {g.domain}
              </div>
              <div className="t-mono mt-3 text-[9.5px] leading-[1.7] opacity-85">
                {g.people} · {g.home}
                <br />
                {g.people === "No deities" ? "Speaks English" : `Speaks ${g.people} + English`}
              </div>
            </motion.div>
          </AnimatePresence>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-pressed={playing}
            aria-label={playing ? `Pause ${g.name}` : `Hear ${g.name}`}
            className="mt-3.5 flex min-h-11 items-center gap-2.5 rounded-full border-[1.5px] py-[5px] pl-[5px] pr-3.5"
            style={{ borderColor: "color-mix(in srgb, currentColor 45%, transparent)", color: light ? "var(--color-ink)" : g.tone.fg }}
          >
            <span className="flex size-[34px] items-center justify-center rounded-full bg-current">
              <span style={{ color: g.tone.bg }}>{playing ? <Pause size={13} weight="fill" /> : <Play size={13} weight="fill" />}</span>
            </span>
            <Waveform bars={16} height={18} playing={playing} />
            <Mono className="text-[10px]">{playing ? "Playing" : "0:07"}</Mono>
          </button>
        </div>
      </motion.div>

      <div role="radiogroup" aria-label="Guides" className="no-scrollbar mt-3.5 flex snap-x gap-2.5 overflow-x-auto px-4 pb-1">
        {GUIDES.map((x) => {
          const on = x.id === guide;
          return (
            <motion.button
              key={x.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onPick(x.id)}
              whileTap={{ scale: 0.95 }}
              animate={{ y: on ? -4 : 0 }}
              transition={snappy}
              className={`relative flex h-[128px] w-[104px] shrink-0 snap-start flex-col justify-between rounded-[14px] px-2.5 pb-2.5 pt-3 text-left ${
                x.id === "keeper" ? "border-[1.5px] border-ink" : ""
              }`}
              style={{ background: x.tone.bg, color: x.tone.fg }}
            >
              <span className="self-center">
                <Emblem name={x.emblem} size={54} color={x.tone.fg} bg={x.tone.bg} rough={1.6} />
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="text-[14px] font-bold">{x.name}</span>
                <span className="t-mono text-[9px] opacity-75">{x.people}</span>
              </span>
              {on && <motion.span layoutId="guide-ring" transition={snappy} className="absolute -inset-[4px] rounded-[17px] border-2 border-ink" />}
            </motion.button>
          );
        })}
      </div>

      <div className="flex-1" />
      <div className="px-5 pb-[max(env(safe-area-inset-bottom),24px)]">
        <PrimaryButton onClick={onNext}>
          Walk with {g.name}
          <KeyCap>
            <ArrowRight size={20} weight="light" />
          </KeyCap>
        </PrimaryButton>
      </div>
    </div>
  );
}
