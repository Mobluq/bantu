"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowCounterClockwise, ArrowRight, Check, Play, X } from "@phosphor-icons/react";
import { useState } from "react";
import { LESSON } from "@/lib/ona/data";
import { Bubble, Cowrie, Emblem, KeyCap, Mono, PrimaryButton, snappy, spring } from "../primitives";

type Props = { lives: number; onAnswer: (correct: boolean) => void; onClose: () => void; onComplete: () => void };

export function Lesson({ lives, onAnswer, onClose, onComplete }: Props) {
  const [picked, setPicked] = useState<string | null>(null);
  const chosen = LESSON.options.find((o) => o.id === picked) ?? null;
  const solved = chosen?.correct === true;
  const outOfLives = lives === 0 && !solved;

  const pick = (id: string) => {
    if (solved || picked) return;
    const o = LESSON.options.find((x) => x.id === id)!;
    setPicked(id);
    onAnswer(o.correct);
  };

  // Progress: 2 of 5 done before this card; this card completes the 3rd step.
  const progress = solved ? 0.6 : 0.4;

  return (
    <div className="relative flex h-full flex-col bg-cream text-ink">
      <div className="flex items-center gap-2.5 pl-1.5 pr-4 pt-12">
        <button type="button" onClick={onClose} aria-label="Close lesson" className="flex size-11 shrink-0 items-center justify-center">
          <X size={20} weight="light" />
        </button>
        <div
          role="progressbar"
          aria-label="Lesson progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress * 100}
          className="h-3.5 flex-1 overflow-hidden rounded-full bg-ink/10"
        >
          <motion.div className="band-zigzag h-full origin-left rounded-full" initial={false} animate={{ scaleX: progress }} transition={spring} />
        </div>
        <div className="flex gap-px" aria-label={`${lives} of 5 cowries left`}>
          {Array.from({ length: 5 }, (_, i) => (
            <motion.span key={i} animate={{ scale: i < lives ? 1 : 0.8, opacity: i < lives ? 1 : 0.35 }} transition={snappy}>
              <Cowrie size={17} fill={i < lives ? "var(--color-paper)" : "transparent"} />
            </motion.span>
          ))}
        </div>
      </div>

      <div className="px-5 pt-[22px]">
        <Mono className="text-brick">
          Lesson {String(LESSON.number).padStart(2, "0")} / {String(LESSON.of).padStart(2, "0")} — {LESSON.topic}
        </Mono>
      </div>
      <h1 className="mx-5 mt-2 leading-[0.86]">
        <span className="t-display text-[58px]">{LESSON.title[0]} </span>
        <span className="t-serif text-[60px] text-brick">{LESSON.title[1]}</span>
      </h1>

      <div className="flex items-start gap-2.5 px-5 pt-[18px]">
        <div className="shrink-0">
          <Emblem name="osun" size={46} disc color="var(--color-gold)" bg="var(--color-forest)" rough={1.5} speckle={false} />
        </div>
        <Bubble
          who="Ọ̀ṣun"
          whoClass="text-forest"
          action={
            <button type="button" aria-label="Replay Ọ̀ṣun" className="flex size-7 items-center justify-center rounded-full bg-forest text-gold">
              <Play size={11} weight="fill" />
            </button>
          }
        >
          {LESSON.prompt}
        </Bubble>
      </div>

      <div role="radiogroup" aria-label="Answers" className="flex flex-col gap-2.5 px-5 pt-[18px]">
        {LESSON.options.map((o, i) => {
          const isPicked = picked === o.id;
          const state = !isPicked ? (solved ? "dim" : "idle") : o.correct ? "right" : "wrong";
          return (
            <motion.button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={isPicked}
              disabled={!!picked || outOfLives}
              onClick={() => pick(o.id)}
              initial={{ opacity: 0, y: 14 }}
              animate={{
                opacity: state === "dim" ? 0.5 : 1,
                y: 0,
                x: state === "wrong" ? [0, -8, 8, -5, 5, 0] : 0,
              }}
              transition={{ ...spring, delay: picked ? 0 : 0.08 * i, x: { duration: 0.4 } }}
              whileTap={picked ? undefined : { scale: 0.98, y: 1 }}
              className={`flex min-h-16 w-full items-center gap-3.5 rounded-2xl px-3.5 py-3 text-left ${
                state === "right"
                  ? "border-[2.5px] border-forest bg-paper shadow-[0_4px_0_var(--color-forest)]"
                  : state === "wrong"
                    ? "border-[2.5px] border-brick bg-paper shadow-[0_4px_0_var(--color-brick)]"
                    : "border-[1.5px] border-ink/35 bg-transparent"
              }`}
            >
              <span
                className={`flex size-[34px] shrink-0 items-center justify-center rounded-full ${
                  state === "right" ? "bg-forest text-gold" : state === "wrong" ? "bg-brick text-cream" : "border-[1.5px] border-ink"
                }`}
              >
                {state === "right" ? <Check size={18} weight="light" /> : state === "wrong" ? <X size={16} weight="light" /> : <span className="t-mono text-[12px]">{o.id}</span>}
              </span>
              <span className="flex flex-col gap-[3px]">
                <span className="text-[17.5px] font-bold">{o.yo}</span>
                <span className="text-[13px] text-muted">{o.gloss}</span>
              </span>
            </motion.button>
          );
        })}
      </div>

      <div className="flex-1" />

      <AnimatePresence>
        {chosen && (
          <motion.section
            key={chosen.id}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={spring}
            aria-live="assertive"
            className={`torn-top ht-light absolute inset-x-0 bottom-0 px-5 pb-[max(env(safe-area-inset-bottom),28px)] pt-[26px] text-cream ${
              chosen.correct ? "bg-forest" : "bg-brick"
            }`}
          >
            <div className="flex items-baseline justify-between">
              <span className={`t-display text-[36px] ${chosen.correct ? "text-gold" : "text-cream"}`}>{chosen.correct ? "Ó dáa gan-an!" : "Not quite."}</span>
              <span className="flex items-center gap-1.5">
                <Mono className="text-[12px] text-gold">{chosen.correct ? "+10" : "−1"}</Mono>
                <Cowrie size={16} fill="var(--color-gold)" />
              </span>
            </div>
            <p className="mb-4 mt-2 text-[14px] leading-[1.48] opacity-95">{chosen.why}</p>
            {chosen.correct ? (
              <PrimaryButton tone="gold" onClick={onComplete}>
                Continue
                <KeyCap tone="gold">
                  <ArrowRight size={18} weight="light" />
                </KeyCap>
              </PrimaryButton>
            ) : outOfLives ? (
              <p className="rounded-[14px] border-[1.5px] border-cream/40 p-4 text-[14px]">
                Out of cowries for today. They refill at dawn, or review the lesson to earn one back.
              </p>
            ) : (
              <PrimaryButton tone="gold" onClick={() => setPicked(null)}>
                Try again
                <KeyCap tone="gold">
                  <ArrowCounterClockwise size={18} weight="light" />
                </KeyCap>
              </PrimaryButton>
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
