"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ChatCircleDots, Check, LockSimple, Play } from "@phosphor-icons/react";
import { guideById } from "@/lib/ona/data";
import { ROADS, lessonsForRoad, roadById, type RoadId } from "@/lib/ona/roads";
import { STAMPS } from "@/lib/ona/data";
import { TabBar } from "../TabBar";
import { Emblem, Mono, snappy, spring } from "../primitives";
import { nextLesson, type Screen } from "../state";

type Props = {
  road: RoadId;
  completed: string[];
  stamps: string[];
  onRoad: (r: RoadId) => void;
  onOpen: (lessonId: string) => void;
  onAsk: () => void;
  onGo: (s: Screen) => void;
};

// Zig-zag path: x offsets for the five nodes, as a share of the column width.
const XS = [0.28, 0.68, 0.36, 0.72, 0.32];
const STEP = 112;

export function Learn({ road, completed, stamps, onRoad, onOpen, onAsk, onGo }: Props) {
  const r = roadById(road);
  const g = guideById(r.guide);
  const lessons = lessonsForRoad(road);
  const next = nextLesson(road, completed);
  const doneCount = lessons.filter((l) => completed.includes(l.id)).length;
  const chapter = ROADS.findIndex((x) => x.id === road) + 1;
  const stamp = STAMPS.find((s) => s.id === r.stamp)!;
  const owned = stamps.includes(r.stamp);
  const [first, ...rest] = r.name.split(" ");

  const [W, setW] = useState(350);
  const pathRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = pathRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const pts = lessons.map((_, i) => ({ x: XS[i] * W, y: 56 + i * STEP }));
  const d = pts.reduce((acc, p, i) => (i === 0 ? `M${p.x} ${p.y}` : `${acc} C${pts[i - 1].x} ${p.y - STEP / 2}, ${p.x} ${pts[i - 1].y + STEP / 2}, ${p.x} ${p.y}`), "");

  return (
    <div className="graph flex h-full flex-col bg-cream text-ink">
      <div className="no-scrollbar flex-1 overflow-y-auto">
        <header className="px-5 pt-safe">
          <div className="flex items-center justify-between">
            <Mono className="text-brick">Chapter {String(chapter).padStart(2, "0")} / {String(ROADS.length).padStart(2, "0")}</Mono>
            <Mono className="tabular-nums">{doneCount} / {lessons.length} lessons</Mono>
          </div>

          <div role="tablist" aria-label="Roads" className="mt-4 grid grid-cols-3 gap-2">
            {ROADS.map((x) => {
              const on = x.id === road;
              const xg = guideById(x.guide);
              const n = lessonsForRoad(x.id).filter((l) => completed.includes(l.id)).length;
              return (
                <motion.button
                  key={x.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => onRoad(x.id)}
                  whileTap={{ scale: 0.96 }}
                  transition={snappy}
                  className={`relative flex flex-col items-start gap-1 rounded-[14px] px-2.5 pb-2.5 pt-2 text-left ${on ? "text-cream" : "bg-paper/70 text-ink ring-1 ring-ink/10"}`}
                >
                  {on && <motion.span layoutId="road-tab" transition={snappy} className="absolute inset-0 rounded-[14px]" style={{ background: xg.tone.bg }} />}
                  <span className="relative">
                    <Emblem name={xg.emblem} size={30} color={on ? xg.tone.fg : "var(--color-ink)"} bg={on ? xg.tone.bg : "var(--color-cream)"} rough={1.2} speckle={false} />
                  </span>
                  <span className="relative text-[13px] font-bold">{x.people}</span>
                  <span className="relative h-1 w-full overflow-hidden rounded-full bg-current/20">
                    <span className="block h-full rounded-full bg-current" style={{ width: `${(n / 5) * 100}%` }} />
                  </span>
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={road} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0, transition: spring }} exit={{ opacity: 0, transition: { duration: 0.1 } }}>
              <h1 className="mt-6 leading-[0.86]">
                <span className="t-display block text-[min(56px,14.4cqw,6.5cqh)]">{first}</span>
                <span className="t-serif block text-[min(56px,14.4cqw,6.5cqh)]" style={{ color: g.tone.bg === "var(--color-ink)" ? "var(--color-brick)" : g.tone.bg }}>
                  {rest.join(" ")}
                </span>
              </h1>
              <p className="mt-3 max-w-[34ch] text-[14.5px] leading-[1.45] text-muted">{r.blurb}</p>
              <button
                type="button"
                onClick={onAsk}
                className="mt-4 flex items-center gap-2.5 rounded-full bg-paper py-1.5 pl-1.5 pr-4 text-[13.5px] font-semibold ring-1 ring-ink/15"
              >
                <Emblem name={g.emblem} size={30} disc color={g.tone.fg} bg={g.tone.bg} rough={1.2} speckle={false} />
                Ask {g.name} anything
                <ChatCircleDots size={18} weight="light" />
              </button>
            </motion.div>
          </AnimatePresence>
        </header>

        <AnimatePresence mode="wait" initial={false}>
          <div ref={pathRef} className="mx-5" aria-hidden="true" />
          <motion.section
            key={road}
            className="relative mx-5 mt-6"
            style={{ height: 56 + lessons.length * STEP + 200 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.3 } }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            aria-label={`${r.name}: ${lessons.length} lessons`}
          >
            <svg width={W} height={56 + lessons.length * STEP} className="absolute left-0 top-0" aria-hidden="true">
              <path d={d} fill="none" stroke="var(--color-ink)" strokeOpacity="0.25" strokeWidth="3" strokeDasharray="2 10" strokeLinecap="round" />
              <motion.path
                d={d}
                fill="none"
                stroke={g.tone.bg === "var(--color-paper)" ? "var(--color-ink)" : g.tone.bg}
                strokeWidth="5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: Math.max(0.001, Math.min(1, (doneCount - 0.0) / (lessons.length - 1))) }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              />
            </svg>
            {lessons.map((l, i) => {
              const done = completed.includes(l.id);
              const current = next?.id === l.id;
              const locked = !done && !current;
              const p = pts[i];
              const labelRight = p.x < W / 2;
              // Labels take whatever room the screen leaves beside the node, up to 150px.
              const lw = Math.min(150, labelRight ? W - p.x - 34 - 12 : p.x - 34 - 12);
              return (
                <motion.div
                  key={l.id}
                  className="absolute flex items-center gap-3"
                  style={{ left: labelRight ? p.x - 34 : p.x - 34 - 12 - lw, top: p.y - 34, flexDirection: labelRight ? "row" : "row-reverse" }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ ...spring, delay: 0.06 * i }}
                >
                  <motion.button
                    type="button"
                    disabled={locked}
                    onClick={() => onOpen(l.id)}
                    whileTap={locked ? undefined : { scale: 0.92 }}
                    transition={snappy}
                    aria-label={`Lesson ${l.n}: ${l.title.join(" ")}${done ? ", done" : current ? ", start" : ", locked"}`}
                    className={`relative flex size-[68px] shrink-0 items-center justify-center rounded-full border-[2.5px] ${
                      done ? "border-ink text-cream" : current ? "border-ink bg-gold text-ink" : "border-dashed border-ink/30 bg-paper text-ink/35"
                    }`}
                    style={done ? { background: g.tone.bg === "var(--color-paper)" ? "var(--color-ink)" : g.tone.bg } : undefined}
                  >
                    {current && <span className="absolute -inset-2 animate-ping rounded-full border-2 border-gold opacity-40" />}
                    {done ? <Check size={28} weight="bold" /> : locked ? <LockSimple size={22} weight="light" /> : <Play size={24} weight="fill" />}
                  </motion.button>
                  <div style={{ width: lw }} className={`${labelRight ? "text-left" : "text-right"} ${locked ? "opacity-50" : ""}`}>
                    <Mono className="text-[9.5px] text-muted">
                      {String(l.n).padStart(2, "0")} · {l.topic} · {l.minutes} min
                    </Mono>
                    <div className="mt-0.5 text-[15px] font-bold leading-tight">{l.title.join(" ")}</div>
                  </div>
                </motion.div>
              );
            })}

            <div className="absolute inset-x-0 flex flex-col items-center gap-2" style={{ top: 56 + (lessons.length - 1) * STEP + 70 }}>
              <div className={`stamp-edge w-[124px] ${owned ? "bg-paper" : "bg-paper/50"}`} style={{ transform: "rotate(-4deg)" }}>
                <div
                  className="flex h-[150px] flex-col items-center justify-between p-2.5 outline outline-[1.5px] -outline-offset-[5px] outline-ink"
                  style={{ background: owned ? stamp.bg : "transparent", color: owned ? stamp.fg : "var(--color-muted)" }}
                >
                  <span className="t-mono self-start text-[8px] tracking-[0.18em]">Nigeria</span>
                  {owned ? <Emblem name={stamp.emblem} size={70} color={stamp.fg} bg={stamp.bg} rough={1.6} /> : <LockSimple size={26} weight="light" />}
                  <span className="self-start text-[10.5px] font-extrabold leading-tight">{stamp.title}</span>
                </div>
              </div>
              <Mono className="text-muted">{owned ? "Stamp earned" : "Finish the road to earn this stamp"}</Mono>
            </div>
          </motion.section>
        </AnimatePresence>
      </div>
      <TabBar active="learn" onGo={onGo} />
    </div>
  );
}
