"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Pause, Play } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { ALMANAC_ESU as E } from "@/lib/ona/data";
import { TabBar } from "../TabBar";
import { Emblem, Mono, Waveform, snappy, spring } from "../primitives";
import type { Screen } from "../state";

function Skeleton() {
  return (
    <div className="flex flex-col gap-3 px-5 pt-5" aria-label="Loading entry" role="status">
      <div className="skeleton h-[88px] w-40 rounded" />
      <div className="skeleton h-5 w-64 rounded" />
      <div className="skeleton mt-3 h-11 w-full rounded-full" />
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="grid grid-cols-[96px_1fr] gap-3 border-t border-ink/10 pt-3">
          <div className="skeleton h-3 w-16 rounded" />
          <div className="skeleton h-4 rounded" />
        </div>
      ))}
    </div>
  );
}

export function Almanac({ onGo }: { onGo: (s: Screen) => void }) {
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"nigeria" | "atlantic">("nigeria");
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 650);
    return () => window.clearTimeout(t);
  }, []);
  const rows = tab === "nigeria" ? E.nigeria : E.atlantic;

  return (
    <div className="flex h-full flex-col bg-cream text-ink">
      <div className="no-scrollbar flex-1 overflow-y-auto">
        <section className="torn-bottom ht-light relative h-[300px] overflow-hidden bg-brick text-cream">
          <motion.div initial={{ rotate: -10, opacity: 0 }} animate={{ rotate: 8, opacity: 1 }} transition={spring} className="absolute -right-20 top-[92px]">
            <Emblem name="esu" size={220} color="var(--color-cream)" bg="var(--color-brick)" rough={2.8} />
          </motion.div>
          <div className="relative flex items-center justify-between pl-1.5 pr-3.5 pt-12">
            <button type="button" onClick={() => onGo("stamps")} aria-label="Back" className="flex size-11 items-center justify-center">
              <ArrowLeft size={22} weight="light" />
            </button>
            <Mono>The Almanac</Mono>
          </div>
          <div className="absolute bottom-8 left-5">
            <Mono className="mb-0.5 block text-[10px]">Entry</Mono>
            <div className="t-serif text-[80px] leading-[0.8]">Nº {E.number}</div>
          </div>
        </section>

        {loading ? (
          <Skeleton />
        ) : (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={spring}>
            <div className="flex items-end justify-between px-5 pt-4">
              <h1 className="t-display text-[96px]">{E.name}</h1>
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                aria-pressed={playing}
                className="mb-2 flex h-11 items-center gap-2 rounded-full bg-ink pl-1.5 pr-4 text-[13.5px] font-semibold text-cream"
              >
                <span className="flex size-8 items-center justify-center rounded-full bg-gold text-ink">
                  {playing ? <Pause size={11} weight="fill" /> : <Play size={11} weight="fill" />}
                </span>
                {playing ? <Waveform bars={7} height={14} playing /> : "Listen"}
              </button>
            </div>
            <p className="t-serif px-5 pt-1 text-[21px] leading-[1.25] text-brick">{E.full}</p>

            <div role="tablist" aria-label="View" className="mx-5 mt-[18px] flex rounded-full border-[1.5px] border-ink p-[3px]">
              {(
                [
                  ["nigeria", "In Nigeria"],
                  ["atlantic", "Across the Atlantic"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={tab === id}
                  onClick={() => setTab(id)}
                  className={`relative h-[38px] flex-1 rounded-full text-[13.5px] font-semibold ${tab === id ? "text-cream" : "text-ink"}`}
                >
                  {tab === id && <motion.span layoutId="almanac-tab" transition={snappy} className="absolute inset-0 rounded-full bg-ink" />}
                  <span className="relative">{label}</span>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.dl
                key={tab}
                initial={{ opacity: 0, x: tab === "atlantic" ? 24 : -24 }}
                animate={{ opacity: 1, x: 0, transition: snappy }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                className="px-5 pt-4"
              >
                {rows.map(([k, v], i) => (
                  <motion.div
                    key={k}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...snappy, delay: 0.04 * i }}
                    className="grid grid-cols-[96px_minmax(0,1fr)] gap-3 border-t border-ink/20 py-[11px]"
                  >
                    <dt className="t-mono pt-0.5 text-[10px] text-brick">{k}</dt>
                    <dd className="text-[14.5px] leading-[1.4]">{v}</dd>
                  </motion.div>
                ))}
              </motion.dl>
            </AnimatePresence>

            <article className="mx-5 mt-3.5 border-t-2 border-ink pt-[18px]">
              <Mono className="text-brick">Story · told in many versions</Mono>
              <h2 className="t-display mt-2 text-[40px]">{E.story.title}</h2>
              <p className="mt-3 text-[15.5px] leading-[1.55]">
                <span className="t-serif float-left mr-2 mt-1.5 text-[66px] leading-[0.78] text-brick">È</span>
                {E.story.body}
              </p>
              <p className="t-serif mt-3 text-[20px] leading-[1.3]">{E.story.moral}</p>
            </article>

            <aside className="mx-5 mt-5 flex gap-3 rounded bg-ink p-4 text-cream">
              <span className="t-display-wide text-[34px] leading-[0.8] text-gold">!</span>
              <p className="text-[14px] leading-[1.5]">
                <b className="text-gold">Not the devil.</b> {E.note}
              </p>
            </aside>

            <div className="mx-5 mt-[22px]">
              <Mono className="text-muted">Keep reading</Mono>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {E.related.map((t) => (
                  <span key={t} className="flex h-10 items-center rounded-full border-[1.5px] border-ink px-3.5 text-[14px] font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="mx-5 mt-[22px] flex items-center justify-between border-t border-ink/20 pb-8 pt-3.5">
              <Mono className="text-[9.5px] text-muted">Reviewed by [ADVISOR NAME]</Mono>
              <Mono className="text-[10px] text-brick">Sources (4)</Mono>
            </div>
          </motion.div>
        )}
      </div>
      <TabBar active="almanac" onGo={onGo} />
    </div>
  );
}
