"use client";

import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, CalendarBlank, Moon, Translate } from "@phosphor-icons/react";
import { useState } from "react";
import { HISTORY, VERTICALS, objectById, objectsInVertical, verticalById, type VerticalId } from "@/lib/ona/museum";
import { TabBar } from "../TabBar";
import { Emblem, Mono, snappy, spring } from "../primitives";
import { ObjectRow } from "../museum/parts";
import type { Screen } from "../state";

type Props = {
  id: VerticalId;
  seen: string[];
  onBack: () => void;
  onObject: (id: string) => void;
  onVertical: (id: VerticalId) => void;
  onCalendar: () => void;
  onGo: (s: Screen) => void;
  onNightMap: () => void;
};

const ERAS = ["Ancient", "Kingdoms", "Colonial", "Independence", "Today"];

export function Vertical({ id, seen, onBack, onObject, onVertical, onCalendar, onGo, onNightMap }: Props) {
  const v = verticalById(id);
  const objs = objectsInVertical(id);
  const [era, setEra] = useState<string | null>(null);
  const events = HISTORY.filter((e) => !era || e.era === era);

  return (
    <div className="flex h-full flex-col bg-cream text-ink">
      <div className="no-scrollbar flex-1 overflow-y-auto">
        <header className="relative overflow-hidden px-5 pb-6 pt-safe" style={{ background: v.tone.bg, color: v.tone.fg }}>
          <span className="pointer-events-none absolute -right-12 -top-4 opacity-90">
            <Emblem name={v.emblem} size={170} color={v.tone.fg} bg={v.tone.bg} rough={2.2} />
          </span>
          <button type="button" onClick={onBack} aria-label="Back" className="relative -ml-3.5 flex size-11 items-center justify-center">
            <ArrowLeft size={22} weight="light" />
          </button>
          <Mono className="relative mt-2 block text-[10px] opacity-80">Explore by subject</Mono>
          <h1 className="t-display relative mt-1 max-w-[9ch] text-[min(58px,15cqw,6.7cqh)] leading-[0.88]">{v.name}</h1>
          <p className="t-serif relative mt-2 max-w-[26ch] pr-16 text-[20px] leading-[1.2] opacity-90">{v.line}</p>
        </header>

        {/* other subjects */}
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 pt-4">
          {VERTICALS.filter((x) => x.id !== id).map((x) => (
            <button key={x.id} type="button" onClick={() => onVertical(x.id)} className="h-9 shrink-0 rounded-full px-3.5 text-[13px] font-semibold ring-1 ring-ink/25">
              {x.name}
            </button>
          ))}
        </div>

        {id === "history" && (
          <section className="px-5 pt-6" aria-label="Timeline">
            <div role="tablist" aria-label="Era" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5">
              {[null, ...ERAS].map((e) => (
                <button
                  key={e ?? "all"}
                  type="button"
                  role="tab"
                  aria-selected={era === e}
                  onClick={() => setEra(e)}
                  className={`h-9 shrink-0 rounded-full px-3.5 text-[13px] font-semibold ring-1 ${era === e ? "bg-ink text-cream ring-ink" : "ring-ink/25"}`}
                >
                  {e ?? "All eras"}
                </button>
              ))}
            </div>
            <ol className="relative mt-5 border-l-2 border-ink pl-5">
              {events.map((e, i) => {
                const o = e.object ? objectById(e.object) : undefined;
                return (
                  <motion.li key={e.title} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ ...spring, delay: Math.min(i, 10) * 0.03 }} className="relative pb-6">
                    <span className="absolute -left-[27px] top-1.5 size-3 rounded-full border-2 border-ink bg-gold" aria-hidden="true" />
                    <Mono className="text-[10px] text-brick">
                      {e.when} · {e.era}
                    </Mono>
                    <h2 className="mt-0.5 text-[17px] font-extrabold leading-tight">{e.title}</h2>
                    <p className="mt-1 text-[14px] leading-[1.5] text-ink/85">{e.text}</p>
                    {o && (
                      <button type="button" onClick={() => onObject(o.id)} className="mt-2 flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-[12.5px] font-semibold ring-1 ring-ink/20">
                        <span className="flex size-7 items-center justify-center rounded-full" style={{ background: o.tone.bg }}>
                          <Emblem name={o.emblem} size={20} color={o.tone.fg} bg={o.tone.bg} rough={0} speckle={false} />
                        </span>
                        See Nº {o.code}, {o.title}
                      </button>
                    )}
                  </motion.li>
                );
              })}
            </ol>
          </section>
        )}

        {id === "culture" && (
          <section className="grid grid-cols-2 gap-2.5 px-5 pt-6" aria-label="Culture today">
            {(
              [
                { label: "Festival calendar", sub: "The whole year, month by month", Icon: CalendarBlank, go: onCalendar, tone: "bg-brick text-cream" },
                { label: "Languages", sub: "Greetings in Yorùbá, Igbo, Hausa", Icon: Translate, go: () => onGo("learn"), tone: "bg-forest text-gold" },
                { label: "Moonlight tales", sub: "Àlọ́, told aloud on the night map", Icon: Moon, go: onNightMap, tone: "bg-night text-cream" },
                { label: "The almanac", sub: "Gods, founders and spirits", Icon: BookOpen, go: () => onGo("almanac"), tone: "bg-ink text-gold" },
              ] as const
            ).map(({ label, sub, Icon, go, tone }) => (
              <motion.button key={label} type="button" whileTap={{ scale: 0.97 }} transition={snappy} onClick={go} className={`flex min-h-[124px] flex-col justify-between rounded-[18px] p-3.5 text-left ${tone}`}>
                <Icon size={26} weight="light" />
                <span>
                  <span className="block text-[16px] font-extrabold leading-tight">{label}</span>
                  <span className="mt-0.5 block text-[12.5px] leading-[1.3] opacity-85">{sub}</span>
                </span>
              </motion.button>
            ))}
          </section>
        )}

        {objs.length > 0 && (
          <section className="px-5 pb-10 pt-7" aria-labelledby="objs-h">
            <div className="flex items-baseline justify-between">
              <h2 id="objs-h" className="t-display text-[min(30px,8cqw)]">
                {id === "history" ? "Objects that tell it" : "Objects"}
              </h2>
              <Mono className="text-muted">{objs.length}</Mono>
            </div>
            <div className="mt-2">
              {objs.map((o) => (
                <ObjectRow key={o.id} o={o} seen={seen.includes(o.id)} onOpen={() => onObject(o.id)} />
              ))}
            </div>
          </section>
        )}
      </div>
      <TabBar active="museum" onGo={onGo} />
    </div>
  );
}
