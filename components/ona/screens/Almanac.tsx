"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MagnifyingGlass, X } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { CATEGORIES, ENTRIES, type Category } from "@/lib/ona/almanac";
import { FestivalCalendar } from "./FestivalCalendar";
import { TabBar } from "../TabBar";
import { Emblem, Mono, snappy, spring } from "../primitives";
import type { Screen } from "../state";

/** Strip tone marks and underdots so "osun" finds "Ọ̀ṣun". */
const fold = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function Almanac({
  onOpen,
  onGo,
  initialTab = "entries",
}: {
  onOpen: (id: string) => void;
  onGo: (s: Screen) => void;
  initialTab?: "entries" | "calendar";
}) {
  const [tab, setTab] = useState<"entries" | "calendar">(initialTab);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Category | null>(null);

  const list = useMemo(() => {
    const f = fold(q.trim());
    return ENTRIES.filter((e) => (!cat || e.category === cat) && (!f || fold(`${e.name} ${e.full} ${e.people} ${e.rows.map((r) => r[1]).join(" ")}`).includes(f)));
  }, [q, cat]);


  return (
    <div className="flex h-full flex-col bg-cream text-ink">
      <div className="no-scrollbar flex-1 overflow-y-auto">
        <header className="ht-light relative overflow-hidden bg-ink px-5 pb-6 pt-safe text-cream">
          <div className="absolute right-4 top-10">
            <Emblem name="keeper" size={80} color="var(--color-gold)" bg="var(--color-ink)" rough={1.8} />
          </div>
          <Mono className="relative text-gold">The Almanac · {ENTRIES.length} entries</Mono>
          <h1 className="relative mt-3 leading-[0.86]">
            <span className="t-display block text-[min(56px,14.4cqw,6.5cqh)]">Gods, heroes</span>
            <span className="t-serif block text-[min(54px,13.8cqw,6.3cqh)] text-gold">&amp; feast days</span>
          </h1>
          <div role="tablist" aria-label="Almanac view" className="relative mt-5 flex rounded-full p-[3px] ring-1 ring-cream/30">
            {(
              [
                ["entries", "Entries"],
                ["calendar", "Festival calendar"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                onClick={() => setTab(id)}
                className={`relative h-[38px] flex-1 rounded-full text-[13.5px] font-semibold ${tab === id ? "text-ink" : "text-cream"}`}
              >
                {tab === id && <motion.span layoutId="alm-tab" transition={snappy} className="absolute inset-0 rounded-full bg-cream" />}
                <span className="relative">{label}</span>
              </button>
            ))}
          </div>
        </header>

        <AnimatePresence mode="wait" initial={false}>
          {tab === "entries" ? (
            <motion.div key="entries" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.25 } }} exit={{ opacity: 0, transition: { duration: 0.1 } }}>
              <div className="px-5 pt-5">
                <label htmlFor="alm-search" className="sr-only">
                  Search the almanac
                </label>
                <div className="flex h-12 items-center gap-2 rounded-full bg-paper px-4 ring-1 ring-ink/15 focus-within:ring-2 focus-within:ring-brick">
                  <MagnifyingGlass size={18} weight="light" />
                  <input
                    id="alm-search"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search: osun, thunder, Hausa…"
                    className="h-full flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted"
                  />
                  {q && (
                    <button type="button" onClick={() => setQ("")} aria-label="Clear search" className="flex size-8 items-center justify-center">
                      <X size={16} weight="light" />
                    </button>
                  )}
                </div>
                <div className="no-scrollbar -mx-5 mt-3 flex gap-2 overflow-x-auto px-5">
                  {[null, ...CATEGORIES].map((c) => (
                    <button
                      key={c ?? "all"}
                      type="button"
                      onClick={() => setCat(c)}
                      aria-pressed={cat === c}
                      className={`h-9 shrink-0 rounded-full px-3.5 text-[13px] font-semibold ring-1 ${cat === c ? "bg-ink text-cream ring-ink" : "ring-ink/25"}`}
                    >
                      {c ?? "All"}
                    </button>
                  ))}
                </div>
              </div>

              {list.length === 0 ? (
                <div className="mx-5 mt-6 flex flex-col items-start gap-3 rounded-[20px] border-[1.5px] border-dashed border-ink/30 p-5">
                  <span className="t-display text-[28px]">Nothing under “{q}”</span>
                  <p className="text-[14px] text-muted">Try a people (Igbo), a power (thunder) or a name without its marks (sango).</p>
                </div>
              ) : (
                <ul className="mt-4 px-5 pb-8">
                  {list.map((e, k) => (
                    <motion.li key={e.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: Math.min(k, 8) * 0.03 }}>
                      <button type="button" onClick={() => onOpen(e.id)} className="group flex w-full items-center gap-3.5 border-t border-ink/15 py-3.5 text-left">
                        <span className="flex size-14 shrink-0 items-center justify-center rounded-[14px]" style={{ background: e.tone.bg }}>
                          <Emblem name={e.emblem} size={40} color={e.tone.fg} bg={e.tone.bg} rough={1.2} speckle={false} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-baseline gap-2">
                            <span className="t-display text-[28px]">{e.name}</span>
                            <Mono className="text-[9.5px] text-muted">Nº {e.number}</Mono>
                          </span>
                          <span className="block truncate text-[13px] text-muted">
                            {e.people} · {e.category}
                          </span>
                        </span>
                        <span className="t-serif text-[22px] text-brick transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1">→</span>
                      </button>
                    </motion.li>
                  ))}
                </ul>
              )}
            </motion.div>
          ) : (
            <motion.div key="calendar" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.25 } }} exit={{ opacity: 0, transition: { duration: 0.1 } }}>
              <FestivalCalendar />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <TabBar active="almanac" onGo={onGo} />
    </div>
  );
}
