"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ChatCircleDots } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { ENTRIES, entryById } from "@/lib/ona/almanac";
import { GUIDES, type GuideId } from "@/lib/ona/data";
import { TabBar } from "../TabBar";
import { Emblem, Mono, snappy, spring } from "../primitives";
import type { Screen } from "../state";

/** Split off the first letter with its tone marks, so "Ọ̀ṣun" never loses its grave accent. */
const dropCap = (t: string): [string, string] => {
  const m = t.normalize("NFC").match(/^(.[\u0300-\u036f]*)/u);
  const first = m ? m[1] : t.slice(0, 1);
  return [first, t.normalize("NFC").slice(first.length)];
};

function Skeleton() {
  return (
    <div className="flex flex-col gap-3 px-5 pt-5" aria-label="Loading entry" role="status">
      <div className="skeleton h-[88px] w-40 rounded" />
      <div className="skeleton h-5 w-64 rounded" />
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="grid grid-cols-[96px_1fr] gap-3 border-t border-ink/10 pt-3">
          <div className="skeleton h-3 w-16 rounded" />
          <div className="skeleton h-4 rounded" />
        </div>
      ))}
    </div>
  );
}

export function Entry({ id, onOpen, onAsk, onBack, onGo }: { id: string; onOpen: (id: string) => void; onAsk: (g: GuideId) => void; onBack: () => void; onGo: (s: Screen) => void }) {
  const e = entryById(id) ?? ENTRIES[0];
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"home" | "abroad">("home");
  useEffect(() => {
    setLoading(true);
    setTab("home");
    const t = window.setTimeout(() => setLoading(false), 450);
    return () => window.clearTimeout(t);
  }, [id]);
  const rows = tab === "home" || !e.abroad ? e.rows : e.abroad;
  const guide = GUIDES.find((g) => g.id === (e.id as GuideId));
  const dark = e.tone.bg !== "var(--color-paper)" && e.tone.bg !== "var(--color-gold)";

  return (
    <div className="flex h-full flex-col bg-cream text-ink">
      <div className="no-scrollbar flex-1 overflow-y-auto" key={e.id}>
        <section className={`torn-bottom relative h-[300px] overflow-hidden ${dark ? "ht-light" : "ht"}`} style={{ background: e.tone.bg, color: e.tone.fg }}>
          <motion.div initial={{ rotate: -10, opacity: 0 }} animate={{ rotate: 8, opacity: 1 }} transition={spring} className="absolute -right-20 top-[92px]">
            <Emblem name={e.emblem} size={220} color={e.tone.fg} bg={e.tone.bg} rough={2.8} />
          </motion.div>
          <div className="relative flex items-center justify-between pl-1.5 pr-3.5 pt-12">
            <button type="button" onClick={onBack} aria-label="Back" className="flex size-11 items-center justify-center">
              <ArrowLeft size={22} weight="light" />
            </button>
            <Mono>The Almanac · {e.category}</Mono>
          </div>
          <div className="absolute bottom-8 left-5">
            <Mono className="mb-0.5 block text-[10px]">Entry</Mono>
            <div className="t-serif text-[80px] leading-[0.8]">Nº {e.number}</div>
          </div>
        </section>

        {loading ? (
          <Skeleton />
        ) : (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={spring}>
            <div className="px-5 pt-4">
              <h1 className="t-display text-[84px]">{e.name}</h1>
              <p className="t-serif mt-1 text-[21px] leading-[1.25] text-brick">{e.full}</p>
              <Mono className="mt-2 block text-muted">{e.people}</Mono>
            </div>

            {e.abroad && (
              <div role="tablist" aria-label="View" className="mx-5 mt-[18px] flex rounded-full border-[1.5px] border-ink p-[3px]">
                {(
                  [
                    ["home", "In Nigeria"],
                    ["abroad", "Across the Atlantic"],
                  ] as const
                ).map(([tid, label]) => (
                  <button
                    key={tid}
                    type="button"
                    role="tab"
                    aria-selected={tab === tid}
                    onClick={() => setTab(tid)}
                    className={`relative h-[38px] flex-1 rounded-full text-[13.5px] font-semibold ${tab === tid ? "text-cream" : "text-ink"}`}
                  >
                    {tab === tid && <motion.span layoutId="entry-tab" transition={snappy} className="absolute inset-0 rounded-full bg-ink" />}
                    <span className="relative">{label}</span>
                  </button>
                ))}
              </div>
            )}

            <AnimatePresence mode="wait" initial={false}>
              <motion.dl
                key={tab}
                initial={{ opacity: 0, x: tab === "abroad" ? 24 : -24 }}
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

            {e.story && (
              <article className="mx-5 mt-3.5 border-t-2 border-ink pt-[18px]">
                <Mono className="text-brick">Story · told in many versions</Mono>
                <h2 className="t-display mt-2 text-[40px]">{e.story.title}</h2>
                <p className="mt-3 text-[15.5px] leading-[1.55]">
                  <span className="t-serif float-left mr-2 mt-1.5 text-[66px] leading-[0.78] text-brick">{dropCap(e.story.body)[0]}</span>
                  {dropCap(e.story.body)[1]}
                </p>
                {e.story.moral && <p className="t-serif mt-3 text-[20px] leading-[1.3]">{e.story.moral}</p>}
              </article>
            )}

            {e.note && (
              <aside className="mx-5 mt-5 flex gap-3 rounded bg-ink p-4 text-cream">
                <span className="t-display-wide text-[34px] leading-[0.8] text-gold">!</span>
                <p className="text-[14px] leading-[1.5]">
                  <b className="text-gold">{e.note.title}</b> {e.note.body}
                </p>
              </aside>
            )}

            {guide && (
              <button
                type="button"
                onClick={() => onAsk(guide.id)}
                className="mx-5 mt-5 flex w-[calc(100%-40px)] items-center gap-3 rounded-[20px] p-3 text-left"
                style={{ background: guide.tone.bg, color: guide.tone.fg }}
              >
                <Emblem name={guide.emblem} size={44} color={guide.tone.fg} bg={guide.tone.bg} rough={1.4} speckle={false} />
                <span className="flex-1">
                  <span className="block text-[15px] font-bold">Ask {guide.name} yourself</span>
                  <span className="block text-[12.5px] opacity-80">Questions answered in their voice, from the almanac</span>
                </span>
                <ChatCircleDots size={22} weight="light" />
              </button>
            )}

            <div className="mx-5 mt-[22px]">
              <Mono className="text-muted">Keep reading</Mono>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {e.related.map((rid) => {
                  const r = entryById(rid);
                  if (!r) return null;
                  return (
                    <button key={rid} type="button" onClick={() => onOpen(rid)} className="flex h-10 items-center rounded-full border-[1.5px] border-ink px-3.5 text-[14px] font-medium">
                      {r.name}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="mx-5 mt-[22px] flex items-center justify-between border-t border-ink/20 pb-8 pt-3.5">
              <Mono className="text-[9.5px] text-muted">Reviewed by [ADVISOR NAME]</Mono>
              <Mono className="text-[10px] text-brick">Draft for review</Mono>
            </div>
          </motion.div>
        )}
      </div>
      <TabBar active="almanac" onGo={onGo} />
    </div>
  );
}
