"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CaretLeft, CaretRight, MoonStars } from "@phosphor-icons/react";
import { useRef, useState } from "react";
import { FESTIVALS, MONTHS, seasonOf, type Festival } from "@/lib/ona/almanac";
import { sfx } from "@/lib/ona/sound";
import { Mono, snappy } from "../primitives";

/** One colour per people, reused across the year grid, the ribbon and the cards. */
const TONE: Record<string, { bg: string; fg: string }> = {
  "Yorùbá": { bg: "var(--color-brick)", fg: "var(--color-cream)" },
  "Yorùbá (Lagos)": { bg: "var(--color-brick)", fg: "var(--color-cream)" },
  Igbo: { bg: "var(--color-indigo)", fg: "var(--color-cream)" },
  Hausa: { bg: "var(--color-forest)", fg: "var(--color-gold)" },
  "Hausa and Nupe": { bg: "var(--color-forest)", fg: "var(--color-gold)" },
  Edo: { bg: "var(--color-ochre)", fg: "var(--color-ink)" },
  "Efik and visitors": { bg: "var(--color-gold)", fg: "var(--color-ink)" },
  Yakurr: { bg: "var(--color-clay)", fg: "var(--color-ink)" },
  Nigeria: { bg: "var(--color-ink)", fg: "var(--color-cream)" },
};
const toneOf = (f: Festival) => TONE[f.people] ?? { bg: "var(--color-ink)", fg: "var(--color-cream)" };

type Slot = { f: Festival; kind: "starts" | "continues" | "expected"; note?: string };

function slotsFor(month: number): Slot[] {
  const out: Slot[] = [];
  for (const f of FESTIVALS) {
    const i = f.months.indexOf(month);
    if (i === 0) out.push({ f, kind: "starts" });
    else if (i > 0) out.push({ f, kind: "continues", note: `Continues from ${MONTHS[f.months[0] - 1]}` });
    for (const e of f.expected ?? []) if (e.month === month) out.push({ f, kind: "expected", note: e.note });
  }
  return out;
}

const SHORT = MONTHS.map((m) => m.slice(0, 3));

export function FestivalCalendar() {
  const now = new Date().getMonth() + 1;
  const [month, setMonth] = useState(now);
  const [dir, setDir] = useState(1);
  const detail = useRef<HTMLDivElement>(null);
  const undated = FESTIVALS.filter((f) => f.months.length === 0 && !f.expected);

  const pick = (m: number, scroll = false) => {
    const next = ((m - 1 + 12) % 12) + 1;
    if (next === month) return;
    sfx.tap();
    setDir(next > month || (month === 12 && next === 1) ? 1 : -1);
    setMonth(next);
    if (scroll) detail.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const slots = slotsFor(month);
  const season = seasonOf(month);

  return (
    <div className="pb-8">
      {/* Year at a glance */}
      <section aria-labelledby="year-h" className="px-5 pt-5">
        <div className="flex items-baseline justify-between">
          <h2 id="year-h" className="t-display text-[min(34px,9cqw)]">
            The year
          </h2>
          <Mono className="text-muted">{FESTIVALS.length} festivals</Mono>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-1.5" role="list">
          {SHORT.map((m, i) => {
            const n = i + 1;
            const s = slotsFor(n);
            const on = n === month;
            return (
              <motion.button
                key={m}
                role="listitem"
                type="button"
                onClick={() => pick(n, true)}
                whileTap={{ scale: 0.95 }}
                transition={snappy}
                aria-current={on ? "date" : undefined}
                aria-label={`${MONTHS[i]}: ${s.length ? `${s.length} festival${s.length > 1 ? "s" : ""}` : "no fixed festivals"}`}
                className={`relative flex aspect-[1/1.05] flex-col justify-between rounded-[14px] p-2 text-left transition-colors ${
                  on ? "bg-ink text-cream" : s.length ? "bg-paper ring-1 ring-ink/15" : "border border-dashed border-ink/20"
                }`}
              >
                <span className="flex items-start justify-between">
                  <span className="t-mono text-[10px]">{m}</span>
                  {n === now && <span className={`size-1.5 rounded-full ${on ? "bg-gold" : "bg-brick"}`} aria-label="this month" />}
                </span>
                <span className="t-display-wide text-[min(26px,7cqw)] leading-none tabular-nums">{s.length || "·"}</span>
                <span className="flex h-2 flex-wrap gap-[3px] overflow-hidden">
                  {s.map(({ f, kind }) => (
                    <span
                      key={`${f.id}-${kind}`}
                      className={`size-2 rounded-full ${kind === "expected" ? "border border-dashed" : ""}`}
                      style={kind === "expected" ? { borderColor: on ? "var(--color-cream)" : toneOf(f).bg } : { background: on && toneOf(f).bg === "var(--color-ink)" ? "var(--color-cream)" : toneOf(f).bg }}
                    />
                  ))}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Ribbon: every festival as a bar across the year */}
        <div className="mt-5 rounded-[18px] bg-paper px-3 pb-2 pt-3 ring-1 ring-ink/10">
          <div className="grid grid-cols-[minmax(0,34%)_1fr] items-end gap-2">
            <Mono className="text-[9px] text-muted">Festival</Mono>
            <div className="grid grid-cols-12">
              {SHORT.map((m, i) => (
                <span key={m} className={`t-mono text-center text-[8.5px] ${i + 1 === month ? "font-bold text-brick" : "text-muted"}`}>
                  {m[0]}
                </span>
              ))}
            </div>
          </div>
          <ul className="mt-1">
            {FESTIVALS.filter((f) => f.months.length || f.expected)
              .sort((x, y) => (x.months[0] ?? x.expected![0].month) - (y.months[0] ?? y.expected![0].month))
              .map((f) => {
                const ms = f.months.length ? f.months : (f.expected ?? []).map((e) => e.month);
                const here = ms.includes(month);
                return (
                  <li key={f.id}>
                    <button
                      type="button"
                      onClick={() => pick(ms.includes(month) ? month : ms[0], true)}
                      className={`grid min-h-[26px] w-full grid-cols-[minmax(0,34%)_1fr] items-center gap-2 rounded-md text-left ${here ? "bg-ink/[0.05]" : ""}`}
                    >
                      <span className={`truncate pl-1 text-[11.5px] ${here ? "font-bold" : "text-ink/80"}`}>{f.name.replace(/ Festival$/, "")}</span>
                      <span className="relative grid h-[26px] grid-cols-12 items-center">
                        {SHORT.map((m, i) => (
                          <span key={m} className={`h-full border-l ${i + 1 === month ? "border-brick/40 bg-brick/[0.07]" : "border-ink/[0.07]"}`} style={{ gridColumnStart: i + 1, gridRowStart: 1 }} />
                        ))}
                        {(f.months.length ? [[Math.min(...ms), Math.max(...ms)]] : ms.map((m) => [m, m])).map(([from, to]) => (
                          <span
                            key={from}
                            className={`z-[1] mx-[2px] h-[10px] rounded-full ${f.months.length ? "" : "border-[1.5px] border-dashed"}`}
                            style={{
                              gridColumn: `${from} / ${to + 1}`,
                              gridRowStart: 1,
                              ...(f.months.length ? { background: toneOf(f).bg } : { borderColor: toneOf(f).bg }),
                            }}
                          />
                        ))}
                      </span>
                    </button>
                  </li>
                );
              })}
          </ul>
        </div>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
          {[
            ["Yorùbá", "var(--color-brick)"],
            ["Igbo", "var(--color-indigo)"],
            ["Hausa", "var(--color-forest)"],
            ["Edo", "var(--color-ochre)"],
            ["Other", "var(--color-clay)"],
          ].map(([k, c]) => (
            <span key={k} className="flex items-center gap-1.5 text-[11.5px] text-muted">
              <span className="size-2 rounded-full" style={{ background: c }} />
              {k}
            </span>
          ))}
          <span className="flex items-center gap-1.5 text-[11.5px] text-muted">
            <span className="size-2 rounded-full border border-dashed border-ink" />
            Moon-dated
          </span>
        </div>
      </section>

      {/* Month view */}
      <section ref={detail} aria-live="polite" aria-labelledby="month-h" className="mt-7 scroll-mt-4">
        <div className="band-kente h-2" aria-hidden="true" />
        <div className="ht-light relative overflow-hidden bg-ink px-5 pb-5 pt-4 text-cream">
          <div className="flex items-center justify-between">
            <button type="button" onClick={() => pick(month - 1)} aria-label={`Previous month, ${MONTHS[(month + 10) % 12]}`} className="flex size-11 items-center justify-center rounded-full ring-1 ring-cream/25">
              <CaretLeft size={18} weight="light" />
            </button>
            <Mono className="text-gold">
              {String(month).padStart(2, "0")} / 12{month === now ? " · this month" : ""}
            </Mono>
            <button type="button" onClick={() => pick(month + 1)} aria-label={`Next month, ${MONTHS[month % 12]}`} className="flex size-11 items-center justify-center rounded-full ring-1 ring-cream/25">
              <CaretRight size={18} weight="light" />
            </button>
          </div>
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={(_, info) => {
              if (info.offset.x < -50) pick(month + 1);
              else if (info.offset.x > 50) pick(month - 1);
            }}
            className="touch-pan-y"
          >
            <AnimatePresence mode="popLayout" initial={false} custom={dir}>
              <motion.div
                key={month}
                custom={dir}
                initial={{ opacity: 0, x: dir * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -40, transition: { duration: 0.12 } }}
                transition={snappy}
              >
                <h2 id="month-h" className="mt-3 leading-[0.84]">
                  <span className="t-display block text-[min(76px,19cqw)]">{MONTHS[month - 1]}</span>
                </h2>
                <p className="mt-2">
                  <span className="t-serif text-[22px] text-gold">{season.name}</span>
                  <span className="mt-0.5 block text-[13px] text-cream/70">{season.note}</span>
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
        <div className="band-zigzag h-3 text-ink" aria-hidden="true" />

        <div className="px-5 pt-4">
          <AnimatePresence mode="wait" initial={false}>
            <motion.ul
              key={month}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              transition={snappy}
              className="flex flex-col gap-3"
            >
              {slots.length === 0 ? (
                <li className="rounded-[18px] border-[1.5px] border-dashed border-ink/30 p-5">
                  <span className="t-display text-[26px]">A quiet month</span>
                  <p className="mt-1.5 text-[14px] leading-[1.45] text-muted">
                    No fixed festival in the almanac yet. Towns hold their own rites through the year, so ask locally, and check the moving dates below.
                  </p>
                </li>
              ) : (
                slots.map(({ f, kind, note }, k) => <FestivalCard key={`${f.id}-${kind}`} f={f} kind={kind} note={note} index={k} />)
              )}
            </motion.ul>
          </AnimatePresence>
        </div>
      </section>

      <section aria-labelledby="moving-h" className="mt-8 px-5">
        <h2 id="moving-h" className="t-display flex items-center gap-2 text-[28px]">
          <MoonStars size={24} weight="light" className="text-brick" />
          Moving dates
        </h2>
        <p className="mt-1.5 text-[13.5px] leading-[1.45] text-muted">
          Sallah festivals follow the Islamic lunar calendar and move about 11 days earlier each year; the day is confirmed by moon sighting. Others are called when the town decides.
        </p>
        <ul className="mt-2">
          {[...FESTIVALS.filter((f) => f.expected), ...undated].map((f) => (
            <li key={f.id} className="flex items-start gap-3 border-t border-ink/15 py-3">
              <span className="mt-1.5 size-2.5 shrink-0 rounded-full border border-dashed" style={{ borderColor: toneOf(f).bg }} />
              <div className="min-w-0 flex-1">
                <div className="text-[15px] font-bold">{f.name}</div>
                <div className="text-[13px] text-muted">
                  {f.place} · {f.when}
                </div>
                {f.expected && (
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {f.expected.map((e) => (
                      <button key={e.month} type="button" onClick={() => pick(e.month, true)} className="rounded-full px-2.5 py-1 text-[11.5px] font-semibold ring-1 ring-ink/25">
                        {MONTHS[e.month - 1]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[12px] leading-[1.45] text-muted">Months are typical windows. Several festivals are announced locally each year.</p>
      </section>
    </div>
  );
}

function FestivalCard({ f, kind, note, index }: { f: Festival; kind: Slot["kind"]; note?: string; index: number }) {
  const t = toneOf(f);
  const tilt = [-0.6, 0.5, -0.3, 0.4][index % 4];
  return (
    <motion.li
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...snappy, delay: index * 0.05 }}
      style={{ rotate: `${tilt}deg` }}
      className={`relative overflow-hidden rounded-[18px] ${kind === "expected" ? "border-[1.5px] border-dashed border-ink/40 bg-cream" : "bg-paper ring-1 ring-ink/15"}`}
    >
      <div className="flex">
        <div className="w-2.5 shrink-0" style={{ background: kind === "expected" ? "transparent" : t.bg }} />
        <div className="min-w-0 flex-1 p-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em]" style={{ background: t.bg, color: t.fg }}>
              {f.people}
            </span>
            {kind !== "starts" && (
              <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] ring-1 ring-ink/25">{kind === "expected" ? "Expected" : "Ongoing"}</span>
            )}
          </div>
          <div className="t-display mt-2 text-[min(28px,7.5cqw)] leading-[0.95]">{f.name}</div>
          <div className="t-serif mt-1 text-[16px] text-muted">
            {f.place} · {kind === "starts" ? f.when : note}
          </div>
          <p className="mt-2 text-[13.5px] leading-[1.45]">{f.text}</p>
        </div>
      </div>
    </motion.li>
  );
}
