"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Basket, Check, Confetti, Sparkle, Translate } from "@phosphor-icons/react";
import { GREETINGS, INTERESTS, guideById } from "@/lib/ona/data";
import { Bubble, Emblem, KeyCap, Marquee, Mono, PrimaryButton, snappy, spring } from "../primitives";
import { SpeakButton } from "../Speak";
import { sfx } from "@/lib/ona/sound";

const ICONS = { "Myths & gods": Sparkle, Language: Translate, "Food & markets": Basket, Festivals: Confetti } as const;
const LINES: Record<string, string> = {
  "Myths & gods": "Òrìṣà, spirits, founders",
  Language: "Greet like you belong",
  "Food & markets": "Kola, yam, market days",
  Festivals: "The year, month by month",
};

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
  const ready = interests.length > 0;

  return (
    <div className="flex h-full flex-col bg-cream text-ink">
      {/* Everything scrolls; the action bar below never leaves the screen. */}
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto">
        <section className="ht-light relative h-[clamp(236px,42cqh,390px)] overflow-hidden bg-brick text-cream">
          <motion.div
            initial={{ rotate: -30, x: 60, opacity: 0 }}
            animate={{ rotate: -10, x: 0, opacity: 0.95 }}
            transition={{ ...spring, delay: 0.1 }}
            className="absolute -bottom-[16%] -right-[12%] w-[min(200px,46cqw,24cqh)]"
          >
            <Emblem name="esu" size={200} color="var(--color-cream)" bg="var(--color-brick)" rough={2.6} className="h-auto w-full" />
          </motion.div>
          <div className="relative flex justify-between px-[22px] pt-safe">
            <Mono>ọ̀nà — Nº 001</Mono>
            <Mono>Step 1 / 3</Mono>
          </div>
          <h1 className="relative ml-5 mt-[min(20px,2.4cqh)]">
            {["Where the", "roads", "meet."].map((line, i) => (
              <motion.span
                key={line}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ ...spring, delay: 0.15 + i * 0.08 }}
                className={
                  i === 1
                    ? "t-serif -ml-1 mb-1 mt-0.5 block text-[min(104px,26cqw,10.6cqh)] leading-[0.78] text-gold"
                    : "t-display block text-[min(78px,20cqw,7.9cqh)]"
                }
              >
                {line}
              </motion.span>
            ))}
          </h1>
          <div className="absolute bottom-4 left-[22px] flex flex-col gap-[3px]">
            <Mono className="text-[10px]">Fig. 01 — Èṣù</Mono>
            <Mono className="text-[10px] opacity-70">keeper of the crossroads</Mono>
          </div>
        </section>

        <Marquee words={GREETINGS} />

        <section className="flex flex-col gap-5 px-5 pb-6 pt-5">
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 shrink-0">
              <Emblem name="esu" size={44} disc color="var(--color-cream)" bg="var(--color-brick)" rough={1.6} speckle={false} />
            </div>
            <Bubble who={esu.name} action={<SpeakButton text={esu.greeting} guide="esu" label="Èṣù’s greeting" wave={10} />}>
              {esu.greeting}
            </Bubble>
          </div>

          <fieldset>
            <legend className="mb-3 flex w-full items-baseline justify-between">
              <Mono className="text-muted">What pulls you · pick any</Mono>
            </legend>
            <div className="grid grid-cols-2 gap-2.5">
              {INTERESTS.slice(0, 4).map((i, k) => {
                const on = interests.includes(i);
                const Icon = ICONS[i as keyof typeof ICONS] ?? Sparkle;
                return (
                  <motion.button
                    key={i}
                    type="button"
                    aria-pressed={on}
                    onClick={() => {
                      sfx.tap();
                      onToggle(i);
                    }}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...spring, delay: 0.35 + k * 0.05 }}
                    whileTap={{ scale: 0.97 }}
                    className={`rounded-[22px] p-[5px] text-left ring-1 transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                      on ? "bg-brick/10 ring-brick/30" : "bg-ink/[0.035] ring-ink/10"
                    }`}
                  >
                    <span
                      className={`relative flex min-h-[92px] flex-col justify-between rounded-[17px] p-3 transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                        on ? "bg-ink text-cream shadow-[inset_0_1px_0_rgb(255_255_255_/_0.12)]" : "bg-paper text-ink shadow-[inset_0_1px_0_rgb(255_255_255_/_0.9)]"
                      }`}
                    >
                      <span className="flex items-start justify-between">
                        <Icon size={22} weight={on ? "fill" : "light"} className={on ? "text-gold" : "text-brick"} />
                        <AnimatePresence initial={false}>
                          {on && (
                            <motion.span
                              initial={{ scale: 0, rotate: -40 }}
                              animate={{ scale: 1, rotate: 0 }}
                              exit={{ scale: 0 }}
                              transition={snappy}
                              className="flex size-[22px] items-center justify-center rounded-full bg-gold text-ink"
                            >
                              <Check size={13} weight="bold" />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </span>
                      <span>
                        <span className="block text-[15px] font-bold leading-tight">{i}</span>
                        <span className={`mt-0.5 block text-[11.5px] leading-[1.3] ${on ? "text-cream/70" : "text-muted"}`}>{LINES[i]}</span>
                      </span>
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </fieldset>
        </section>
      </div>

      {/* Pinned action bar */}
      <div className="relative shrink-0 px-5 pb-[max(env(safe-area-inset-bottom),14px)] pt-3">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-8 h-8 bg-gradient-to-b from-cream/0 to-cream" />
        <PrimaryButton onClick={onNext} disabled={!ready} aria-describedby="interest-hint">
          Choose your guide
          <KeyCap>
            <ArrowRight size={20} weight="light" />
          </KeyCap>
        </PrimaryButton>
        <p id="interest-hint" className="mt-2 min-h-[20px] text-center text-[12.5px]">
          {ready ? (
            <button type="button" onClick={onSecular} className="underline underline-offset-[3px]">
              No deities, please. Travel with the Almanac Keeper
            </button>
          ) : (
            <span className="font-semibold text-brick">Pick at least one so Èṣù knows where to point you.</span>
          )}
        </p>
      </div>
    </div>
  );
}
