"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Play, Pause } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { GREETINGS, INTERESTS, guideById } from "@/lib/ona/data";
import { Bubble, Emblem, KeyCap, Marquee, Mono, PrimaryButton, Waveform, snappy, spring } from "../primitives";

export function Onboarding({
  interests,
  onToggle,
  onNext,
  onSecular,
}: {
  interests: string[];
  onToggle: (i: string) => void;
  onNext: () => void;
  onSecular: () => void;
}) {
  const esu = guideById("esu");
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return;
    const t = window.setTimeout(() => setPlaying(false), 9000);
    return () => window.clearTimeout(t);
  }, [playing]);
  const ready = interests.length > 0;

  return (
    <div className="flex h-full flex-col bg-cream text-ink">
      <section className="ht-light relative h-[396px] shrink-0 overflow-hidden bg-brick text-cream">
        <motion.div
          initial={{ rotate: -30, x: 60, opacity: 0 }}
          animate={{ rotate: -10, x: 0, opacity: 0.95 }}
          transition={{ ...spring, delay: 0.1 }}
          className="absolute -right-[104px] top-[120px]"
        >
          <Emblem name="esu" size={320} color="var(--color-cream)" bg="var(--color-brick)" rough={3} />
        </motion.div>
        <div className="relative flex justify-between px-[22px] pt-14">
          <Mono>ọ̀nà — Nº 001</Mono>
          <Mono>Step 1 / 3</Mono>
        </div>
        <h1 className="relative ml-5 mt-5">
          {["Where the", "roads", "meet."].map((line, i) => (
            <motion.span
              key={line}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ...spring, delay: 0.15 + i * 0.08 }}
              className={
                i === 1
                  ? "t-serif -ml-1 mb-1 mt-0.5 block text-[112px] leading-[0.78] text-gold"
                  : "t-display block text-[84px]"
              }
            >
              {line}
            </motion.span>
          ))}
        </h1>
        <div className="absolute bottom-5 left-[22px] flex flex-col gap-[3px]">
          <Mono className="text-[10px]">Fig. 01 — Èṣù</Mono>
          <Mono className="text-[10px] opacity-70">keeper of the crossroads</Mono>
        </div>
      </section>

      <Marquee words={GREETINGS} />

      <section className="flex flex-1 flex-col gap-4 px-5 pt-[18px]">
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 shrink-0">
            <Emblem name="esu" size={48} disc color="var(--color-cream)" bg="var(--color-brick)" rough={1.6} speckle={false} />
          </div>
          <Bubble
            who={esu.name}
            action={
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                aria-label={playing ? "Pause Èṣù’s voice" : "Play Èṣù’s voice, 9 seconds"}
                aria-pressed={playing}
                className="flex min-h-[28px] items-center gap-2 text-ink"
              >
                <Waveform bars={12} height={16} playing={playing} />
                <span className="flex size-7 items-center justify-center rounded-full bg-ink text-gold">
                  {playing ? <Pause size={12} weight="fill" /> : <Play size={12} weight="fill" />}
                </span>
              </button>
            }
          >
            {esu.greeting}
          </Bubble>
        </div>

        <fieldset>
          <legend className="mb-2.5">
            <Mono className="text-muted">Pick any · change later</Mono>
          </legend>
          <motion.div layout className="flex flex-wrap gap-2">
            {INTERESTS.slice(0, 4).map((i) => {
              const on = interests.includes(i);
              return (
                <motion.button
                  layout
                  key={i}
                  type="button"
                  aria-pressed={on}
                  onClick={() => onToggle(i)}
                  whileTap={{ scale: 0.96 }}
                  transition={snappy}
                  className={`flex h-11 items-center gap-1.5 rounded-full border-[1.5px] border-ink px-4 text-[14.5px] transition-colors duration-200 ${
                    on ? "bg-ink pl-3 font-semibold text-cream" : "bg-transparent font-medium text-ink"
                  }`}
                >
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.span
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 16, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={snappy}
                        className="flex overflow-hidden text-gold"
                      >
                        <Check size={16} weight="light" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {i}
                </motion.button>
              );
            })}
          </motion.div>
        </fieldset>

        <div className="flex-1" />
        <div className="flex flex-col gap-2.5 pb-[max(env(safe-area-inset-bottom),22px)]">
          <PrimaryButton onClick={onNext} disabled={!ready} aria-describedby="interest-hint">
            Choose your guide
            <KeyCap>
              <ArrowRight size={20} weight="light" />
            </KeyCap>
          </PrimaryButton>
          <p id="interest-hint" className="min-h-[18px] text-center text-[13px]">
            {ready ? (
              <button type="button" onClick={onSecular} className="underline underline-offset-[3px]">
                No deities, please. Travel with the Almanac Keeper
              </button>
            ) : (
              <span className="font-semibold text-brick">Pick at least one so Èṣù knows where to point you.</span>
            )}
          </p>
        </div>
      </section>
    </div>
  );
}
