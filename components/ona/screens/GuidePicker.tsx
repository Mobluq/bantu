"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Pause, SpeakerHigh } from "@phosphor-icons/react";
import { GUIDES, type GuideId, guideById } from "@/lib/ona/data";
import { Emblem, KeyCap, Mono, PrimaryButton, Waveform, snappy, spring } from "../primitives";
import { useSpeaker } from "../Speak";
import { sfx } from "@/lib/ona/sound";

function GuideVoice({ text, guide, name, color, bg }: { text: string; guide: GuideId; name: string; color: string; bg: string }) {
  const { playing, toggle, blocked } = useSpeaker(text, guide);
  return (
    <div className="relative mt-3.5">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? `Stop ${name}` : `Hear ${name}`}
        className="flex min-h-11 items-center gap-2.5 rounded-full border-[1.5px] py-[5px] pl-[5px] pr-3.5"
        style={{ borderColor: "color-mix(in srgb, currentColor 45%, transparent)", color }}
      >
        <span className="flex size-[34px] items-center justify-center rounded-full bg-current">
          <span style={{ color: bg }}>{playing ? <Pause size={13} weight="fill" /> : <SpeakerHigh size={15} weight="fill" />}</span>
        </span>
        <Waveform bars={16} height={18} playing={playing} />
        <Mono className="text-[10px]">{playing ? "Speaking" : "Hear me"}</Mono>
      </button>
      {blocked && <span className="mt-1.5 block text-[12px] font-semibold">Guide voices are off. Turn them on in Me.</span>}
    </div>
  );
}

export function GuidePicker({ guide, onPick, onBack, onNext }: { guide: GuideId; onPick: (g: GuideId) => void; onBack: () => void; onNext: () => void }) {
  const g = guideById(guide);
  const index = GUIDES.findIndex((x) => x.id === guide) + 1;

  const light = g.id === "keeper";

  return (
    <div className="flex h-full flex-col bg-cream text-ink">
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto pb-4">
      <div className="flex items-center justify-between pl-2 pr-4 pt-safe">
        <button type="button" onClick={onBack} aria-label="Back" className="flex size-11 items-center justify-center">
          <ArrowLeft size={22} weight="light" />
        </button>
        <Mono>Step 2 / 3</Mono>
      </div>
      <h1 className="mx-5 mt-2">
        <span className="t-display block text-[min(64px,16.4cqw,8.2cqh)]">Who walks</span>
        <span className="t-serif block text-[min(62px,15.9cqw,8cqh)] leading-[0.9] text-brick">with you?</span>
      </h1>
      <p className="mx-5 mt-2.5 max-w-[34ch] text-[14px] leading-[1.42] text-muted">
        Every guide teaches the same checked facts. Each tells them in their own voice.
      </p>

      <motion.div
        layout
        transition={spring}
        className={`relative mx-4 mt-4 overflow-hidden rounded-[28px] shadow-[0_24px_48px_-28px_rgb(30_20_12_/_0.55)] ${light ? "ring-1 ring-ink/20" : "ht-light"}`}
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
              <div className="t-display mt-[min(66px,6cqh)] text-[min(76px,19.5cqw,9cqh)]">{g.name}</div>
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
          <GuideVoice key={g.id} text={g.greeting} guide={g.id} name={g.name} color={light ? "var(--color-ink)" : g.tone.fg} bg={g.tone.bg} />
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
              onClick={() => { sfx.tap(); onPick(x.id); }}
              whileTap={{ scale: 0.95 }}
              animate={{ y: on ? -4 : 0 }}
              transition={snappy}
              className={`relative flex h-[min(128px,15cqh)] min-h-[104px] w-[100px] shrink-0 snap-start flex-col justify-between rounded-[18px] px-2.5 pb-2.5 pt-3 text-left shadow-[inset_0_1px_0_rgb(255_255_255_/_0.12)] ${
                x.id === "keeper" ? "ring-1 ring-ink/20" : ""
              }`}
              style={{ background: x.tone.bg, color: x.tone.fg }}
            >
              <span className="self-center">
                <Emblem name={x.emblem} size={48} color={x.tone.fg} bg={x.tone.bg} rough={1.6} />
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="text-[14px] font-bold">{x.name}</span>
                <span className="t-mono text-[9px] opacity-75">{x.people}</span>
              </span>
              {on && <motion.span layoutId="guide-ring" transition={snappy} className="absolute -inset-[4px] rounded-[22px] border-2 border-ink" />}
            </motion.button>
          );
        })}
      </div>

      </div>
      <div className="relative shrink-0 px-5 pb-[max(env(safe-area-inset-bottom),14px)] pt-3">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-8 h-8 bg-gradient-to-b from-cream/0 to-cream" />
        <PrimaryButton onClick={() => { sfx.ona(); onNext(); }}>
          Walk with {g.name}
          <KeyCap>
            <ArrowRight size={20} weight="light" />
          </KeyCap>
        </PrimaryButton>
      </div>
    </div>
  );
}
