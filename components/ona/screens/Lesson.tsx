"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowCounterClockwise, ArrowRight, Check, X } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { guideById } from "@/lib/ona/data";
import { lessonById, roadById, type Step } from "@/lib/ona/roads";
import { Bubble, Cowrie, Emblem, KeyCap, Mono, PrimaryButton, snappy, spring } from "../primitives";

type Props = {
  lessonId: string | null;
  lives: number;
  onAnswer: (correct: boolean) => void;
  onRefill: () => void;
  onClose: () => void;
  onFinish: (lessonId: string, earned: number) => void;
};

type Verdict = { ok: boolean; text: string } | null;

/** Deterministic shuffle so a step looks the same on every render. */
function shuffled<T>(xs: T[], seed: number): T[] {
  const a = [...xs];
  let s = seed || 1;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function Lesson({ lessonId, lives, onAnswer, onRefill, onClose, onFinish }: Props) {
  const lesson = lessonById(lessonId ?? "") ?? null;
  const [i, setI] = useState(0);
  const [verdict, setVerdict] = useState<Verdict>(null);
  const [mistakes, setMistakes] = useState(0);
  const [done, setDone] = useState(false);

  if (!lesson) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 bg-cream p-8 text-center text-ink">
        <span className="t-display text-[36px]">Pick a lesson first</span>
        <PrimaryButton onClick={onClose} className="max-w-[260px]">
          Open your roads
          <KeyCap>
            <ArrowRight size={18} weight="light" />
          </KeyCap>
        </PrimaryButton>
      </div>
    );
  }

  const road = roadById(lesson.road);
  const guide = guideById(road.guide);
  const step = lesson.steps[i];
  const earned = Math.max(4, 12 - mistakes * 2);

  const judge = (ok: boolean, text: string) => {
    if (!ok) {
      setMistakes((m) => m + 1);
      onAnswer(false);
    }
    setVerdict({ ok, text });
  };
  const advance = () => {
    setVerdict(null);
    if (i + 1 < lesson.steps.length) setI(i + 1);
    else setDone(true);
  };

  const outOfLives = lives === 0 && verdict && !verdict.ok;

  if (done) {
    return (
      <div className="graph-light ht-light relative flex h-full flex-col bg-forest px-6 pb-[max(env(safe-area-inset-bottom),28px)] pt-16 text-cream">
        <Mono className="text-gold">{road.people} · Lesson {String(lesson.n).padStart(2, "0")} / 05</Mono>
        <motion.h1 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={spring} className="mt-4 leading-[0.86]">
          <span className="t-display block text-[68px]">Ó dáa</span>
          <span className="t-serif block text-[64px] text-gold">gan-an.</span>
        </motion.h1>
        <p className="mt-4 max-w-[30ch] text-[15px] leading-[1.45] text-cream/85">
          You finished “{lesson.title.join(" ")}” with {mistakes === 0 ? "no mistakes" : `${mistakes} slip${mistakes > 1 ? "s" : ""}`}.
        </p>
        <motion.div
          className="sticker mx-auto mt-10"
          initial={{ scale: 0.4, rotate: -30, opacity: 0 }}
          animate={{ scale: 1, rotate: -6, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.2 }}
        >
          <Emblem name={guide.emblem} size={170} color={guide.tone.fg} bg={guide.tone.bg} disc rough={2.2} />
        </motion.div>
        <div className="mt-8 flex items-center justify-center gap-2">
          <Cowrie size={22} fill="var(--color-gold)" />
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="t-display-wide text-[40px] text-gold">
            +{earned}
          </motion.span>
        </div>
        <div className="flex-1" />
        <PrimaryButton tone="gold" onClick={() => onFinish(lesson.id, earned)}>
          {lesson.n === 5 ? "Claim your stamp" : "Back to the road"}
          <KeyCap tone="gold">
            <ArrowRight size={18} weight="light" />
          </KeyCap>
        </PrimaryButton>
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col bg-cream text-ink">
      <div className="flex items-center gap-2.5 pl-1.5 pr-4 pt-12">
        <button type="button" onClick={onClose} aria-label="Close lesson" className="flex size-11 shrink-0 items-center justify-center">
          <X size={20} weight="light" />
        </button>
        <div className="flex flex-1 gap-1" role="progressbar" aria-label="Lesson progress" aria-valuemin={0} aria-valuemax={lesson.steps.length} aria-valuenow={i}>
          {lesson.steps.map((_, k) => (
            <span key={k} className="h-2.5 flex-1 overflow-hidden rounded-full bg-ink/10">
              <motion.span
                className="band-zigzag block h-full rounded-full"
                initial={false}
                animate={{ scaleX: k < i || (k === i && verdict?.ok) ? 1 : 0 }}
                style={{ originX: 0 }}
                transition={spring}
              />
            </span>
          ))}
        </div>
        <span className="flex items-center gap-1 text-[14px] font-bold tabular-nums" aria-label={`${lives} cowries left`}>
          <Cowrie size={18} />
          {lives}
        </span>
      </div>

      <div className="px-5 pt-5">
        <Mono className="text-brick">
          {road.people} · Lesson {String(lesson.n).padStart(2, "0")} / 05 — {lesson.topic}
        </Mono>
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto pb-48">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0, transition: spring }}
            exit={{ opacity: 0, x: -40, transition: { duration: 0.15 } }}
            className="px-5 pt-3"
          >
            {i === 0 && (
              <h1 className="mb-4 leading-[0.86]">
                <span className="t-display text-[52px]">{lesson.title[0]} </span>
                <span className="t-serif text-[54px] text-brick">{lesson.title[1]}</span>
              </h1>
            )}
            <StepView step={step} seed={lesson.n * 31 + i} guideName={guide.name} guideEmblem={guide.emblem} tone={guide.tone} onJudge={judge} onFactDone={advance} locked={!!verdict} />
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {verdict && (
          <motion.section
            key="verdict"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={spring}
            aria-live="assertive"
            className={`torn-top ht-light absolute inset-x-0 bottom-0 px-5 pb-[max(env(safe-area-inset-bottom),28px)] pt-[26px] text-cream ${verdict.ok ? "bg-forest" : "bg-brick"}`}
          >
            <div className="flex items-baseline justify-between">
              <span className={`t-display text-[34px] ${verdict.ok ? "text-gold" : "text-cream"}`}>{verdict.ok ? "Ó dáa!" : "Not quite."}</span>
              {!verdict.ok && (
                <span className="flex items-center gap-1.5">
                  <Mono className="text-[12px] text-gold">−1</Mono>
                  <Cowrie size={16} fill="var(--color-gold)" />
                </span>
              )}
            </div>
            <p className="mb-4 mt-2 text-[14px] leading-[1.48] opacity-95">{verdict.text}</p>
            {verdict.ok ? (
              <PrimaryButton tone="gold" onClick={advance}>
                Continue
                <KeyCap tone="gold">
                  <ArrowRight size={18} weight="light" />
                </KeyCap>
              </PrimaryButton>
            ) : outOfLives ? (
              <div className="flex flex-col gap-2.5">
                <p className="rounded-[14px] border-[1.5px] border-cream/40 p-3.5 text-[13.5px]">Out of cowries. In the full app they refill at dawn.</p>
                <PrimaryButton tone="gold" onClick={() => { onRefill(); setVerdict(null); }}>
                  Refill (prototype)
                  <KeyCap tone="gold">
                    <ArrowCounterClockwise size={18} weight="light" />
                  </KeyCap>
                </PrimaryButton>
              </div>
            ) : (
              <PrimaryButton tone="gold" onClick={() => setVerdict(null)}>
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

function StepView({
  step,
  seed,
  guideName,
  guideEmblem,
  tone,
  onJudge,
  onFactDone,
  locked,
}: {
  step: Step;
  seed: number;
  guideName: string;
  guideEmblem: Parameters<typeof Emblem>[0]["name"];
  tone: { bg: string; fg: string };
  onJudge: (ok: boolean, text: string) => void;
  onFactDone: () => void;
  locked: boolean;
}) {
  const speaker = (
    <div className="shrink-0">
      <Emblem name={guideEmblem} size={44} disc color={tone.fg} bg={tone.bg} rough={1.4} speckle={false} />
    </div>
  );

  if (step.kind === "fact") {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-2.5">
          {speaker}
          <Bubble who={guideName}>
            <span className="block font-bold">{step.title}</span>
            <span className="mt-1 block">{step.body}</span>
          </Bubble>
        </div>
        {step.examples && (
          <dl className="mt-1 border-t-2 border-ink">
            {step.examples.map(({ term, meaning }, k) => (
              <motion.div
                key={term}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...spring, delay: 0.08 * k }}
                className="flex items-baseline justify-between gap-4 border-b border-ink/15 py-3"
              >
                <dt className="t-display text-[34px]">{term}</dt>
                <dd className="t-serif text-right text-[18px] text-muted">{meaning}</dd>
              </motion.div>
            ))}
          </dl>
        )}
        <PrimaryButton onClick={onFactDone} className="mt-2">
          Got it
          <KeyCap>
            <ArrowRight size={18} weight="light" />
          </KeyCap>
        </PrimaryButton>
      </div>
    );
  }

  if (step.kind === "choose") return <Choose step={step} seed={seed} speaker={speaker} guideName={guideName} onJudge={onJudge} locked={locked} />;
  if (step.kind === "match") return <Match step={step} seed={seed} onJudge={onJudge} />;
  return <Order step={step} seed={seed} onJudge={onJudge} locked={locked} />;
}

function Choose({
  step,
  seed,
  speaker,
  guideName,
  onJudge,
  locked,
}: {
  step: Extract<Step, { kind: "choose" }>;
  seed: number;
  speaker: React.ReactNode;
  guideName: string;
  onJudge: (ok: boolean, text: string) => void;
  locked: boolean;
}) {
  const options = useMemo(() => shuffled(step.options, seed), [step, seed]);
  const [picked, setPicked] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-2.5">
        {speaker}
        <Bubble who={guideName}>{step.prompt}</Bubble>
      </div>
      <div role="radiogroup" aria-label="Answers" className="flex flex-col gap-2.5">
        {options.map((o, k) => {
          const isPicked = picked === o.id && locked;
          const state = !isPicked ? "idle" : o.correct ? "right" : "wrong";
          return (
            <motion.button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={picked === o.id}
              disabled={locked}
              onClick={() => {
                setPicked(o.id);
                onJudge(o.correct, o.correct ? step.right : step.wrong);
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0, x: state === "wrong" ? [0, -8, 8, -5, 5, 0] : 0 }}
              transition={{ ...spring, delay: 0.06 * k, x: { duration: 0.4 } }}
              whileTap={{ scale: 0.98, y: 1 }}
              className={`flex min-h-16 w-full items-center gap-3.5 rounded-2xl px-3.5 py-3 text-left ${
                state === "right"
                  ? "border-[2.5px] border-forest bg-paper shadow-[0_4px_0_var(--color-forest)]"
                  : state === "wrong"
                    ? "border-[2.5px] border-brick bg-paper shadow-[0_4px_0_var(--color-brick)]"
                    : "border-[1.5px] border-ink/35 bg-paper/60"
              }`}
            >
              <span
                className={`flex size-[34px] shrink-0 items-center justify-center rounded-full ${
                  state === "right" ? "bg-forest text-gold" : state === "wrong" ? "bg-brick text-cream" : "border-[1.5px] border-ink"
                }`}
              >
                {state === "right" ? <Check size={18} weight="bold" /> : state === "wrong" ? <X size={16} weight="bold" /> : <span className="t-mono text-[12px]">{String.fromCharCode(65 + k)}</span>}
              </span>
              <span className="flex flex-col gap-[3px]">
                <span className="text-[17.5px] font-bold">{o.text}</span>
                {o.sub && <span className="text-[13px] text-muted">{o.sub}</span>}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function Match({ step, seed, onJudge }: { step: Extract<Step, { kind: "match" }>; seed: number; onJudge: (ok: boolean, text: string) => void }) {
  const lefts = useMemo(() => shuffled(step.pairs.map((p) => p[0]), seed), [step, seed]);
  const rights = useMemo(() => shuffled(step.pairs.map((p) => p[1]), seed + 7), [step, seed]);
  const [left, setLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [miss, setMiss] = useState<string | null>(null);
  const answer = Object.fromEntries(step.pairs);

  const pickRight = (r: string) => {
    if (!left) return;
    if (answer[left] === r) {
      const next = [...matched, left];
      setMatched(next);
      setLeft(null);
      if (next.length === step.pairs.length) onJudge(true, "All matched. Say each one out loud once before you move on.");
    } else {
      setMiss(r);
      window.setTimeout(() => setMiss(null), 450);
      setLeft(null);
    }
  };

  const cell = (on: boolean, done: boolean, shake: boolean) =>
    `flex min-h-[58px] w-full items-center justify-center rounded-2xl px-3 py-2 text-center text-[15px] font-bold transition-colors duration-200 ${
      done ? "border-[1.5px] border-forest/40 bg-forest/10 text-forest/60" : on ? "border-[2.5px] border-ink bg-gold" : shake ? "border-[2.5px] border-brick bg-paper" : "border-[1.5px] border-ink/35 bg-paper"
    }`;

  return (
    <div className="flex flex-col gap-4">
      <p className="t-serif text-[22px] leading-tight">{step.prompt}</p>
      <div className="grid grid-cols-2 gap-2.5">
        <div className="flex flex-col gap-2.5">
          {lefts.map((l) => {
            const done = matched.includes(l);
            return (
              <motion.button key={l} type="button" disabled={done} onClick={() => setLeft(l)} whileTap={{ scale: 0.97 }} transition={snappy} aria-pressed={left === l} className={cell(left === l, done, false)}>
                {l}
              </motion.button>
            );
          })}
        </div>
        <div className="flex flex-col gap-2.5">
          {rights.map((r) => {
            const done = matched.some((l) => answer[l] === r);
            return (
              <motion.button
                key={r}
                type="button"
                disabled={done || !left}
                onClick={() => pickRight(r)}
                animate={{ x: miss === r ? [0, -6, 6, -4, 4, 0] : 0 }}
                transition={{ duration: 0.35 }}
                className={`${cell(false, done, miss === r)} font-medium`}
              >
                {r}
              </motion.button>
            );
          })}
        </div>
      </div>
      <Mono className="text-muted">{left ? `Now pick the match for “${left}”` : "Tap a word on the left, then its match"}</Mono>
    </div>
  );
}

function Order({ step, seed, onJudge, locked }: { step: Extract<Step, { kind: "order" }>; seed: number; onJudge: (ok: boolean, text: string) => void; locked: boolean }) {
  const bank = useMemo(() => {
    let s = shuffled(step.words.map((w, k) => ({ w, k })), seed);
    if (s.every((x, k) => x.k === k)) s = [...s.slice(1), s[0]];
    return s;
  }, [step, seed]);
  const [line, setLine] = useState<number[]>([]);
  const full = line.length === step.words.length;
  const check = () => {
    const ok = line.every((k, idx) => step.words[k] === step.words[idx]);
    onJudge(ok, ok ? `“${step.words.join(" ")}”: ${step.meaning}.` : `The order is “${step.words.join(" ")}”. Try building it again.`);
    if (!ok) setLine([]);
  };
  return (
    <div className="flex flex-col gap-5">
      <p className="t-serif text-[22px] leading-tight">{step.prompt}</p>
      <div className="flex min-h-[72px] flex-wrap items-center gap-2 border-b-2 border-ink pb-3">
        {line.length === 0 && <span className="text-[14px] text-muted">Tap the words below in order</span>}
        {line.map((k) => (
          <motion.button
            layoutId={`w-${k}`}
            key={k}
            type="button"
            onClick={() => setLine(line.filter((x) => x !== k))}
            transition={snappy}
            className="rounded-xl bg-ink px-3.5 py-2.5 text-[18px] font-bold text-cream"
          >
            {step.words[k]}
          </motion.button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {bank.map(({ w, k }) =>
          line.includes(k) ? (
            <span key={k} className="rounded-xl border-[1.5px] border-dashed border-ink/25 px-3.5 py-2.5 text-[18px] font-bold text-transparent">
              {w}
            </span>
          ) : (
            <motion.button layoutId={`w-${k}`} key={k} type="button" onClick={() => setLine([...line, k])} transition={snappy} className="rounded-xl border-[1.5px] border-ink bg-paper px-3.5 py-2.5 text-[18px] font-bold shadow-[0_3px_0_var(--color-ink)]">
              {w}
            </motion.button>
          ),
        )}
      </div>
      <PrimaryButton onClick={check} disabled={!full || locked}>
        Check
        <KeyCap>
          <Check size={18} weight="bold" />
        </KeyCap>
      </PrimaryButton>
    </div>
  );
}
