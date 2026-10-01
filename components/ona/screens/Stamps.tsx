"use client";

import { motion } from "framer-motion";
import { LockSimple } from "@phosphor-icons/react";
import { useEffect } from "react";
import { sfx } from "@/lib/ona/sound";
import { STAMPS, TOTAL_PLACES, type StampDef } from "@/lib/ona/data";
import { ROADS } from "@/lib/ona/roads";
import { TabBar } from "../TabBar";
import { Emblem, Mono, spring } from "../primitives";
import type { Screen } from "../state";

const TILT = [-4, 3, 2.5, -2, -3, 2];

function StampCard({ s }: { s: StampDef }) {
  return (
    <div className="stamp-edge w-full bg-paper drop-shadow-[0_6px_10px_rgb(30_20_12_/_0.25)]">
      <div className="relative flex h-[200px] flex-col overflow-hidden outline outline-[1.5px] -outline-offset-[5px] outline-ink" style={{ background: s.bg, color: s.fg }}>
        <div className="flex items-start justify-between px-[11px] pt-[11px]">
          <span className="t-mono text-[9px] tracking-[0.18em]">Nigeria</span>
          <span className="t-display-wide text-[22px] leading-[0.9]">{s.value}</span>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <Emblem name={s.emblem} size={96} color={s.fg} bg={s.bg} rough={1.8} />
        </div>
        <div className="px-[11px] pb-3">
          <div className="text-[12.5px] font-extrabold leading-[1.15]">{s.title}</div>
          <div className="t-mono mt-[3px] text-[8.5px] opacity-80">{s.sub}</div>
        </div>
      </div>
    </div>
  );
}

function Postmark({ place }: { place: string }) {
  return (
    <svg width="112" height="112" viewBox="0 0 118 118" aria-hidden="true" className="block">
      <g fill="none" stroke="var(--color-ink)" opacity="0.8">
        <circle cx="59" cy="59" r="46" strokeWidth="2.6" />
        <circle cx="59" cy="59" r="33" strokeWidth="1.4" />
        <path d="M-30 40 C-10 30 0 48 14 40 M-30 60 C-10 50 0 68 14 60 M-30 80 C-10 70 0 88 14 80" strokeWidth="2.2" />
      </g>
      <text x="59" y="56" textAnchor="middle" fontFamily="var(--font-archivo)" fontWeight="800" fontSize="12" fill="var(--color-ink)" opacity="0.85">
        {place.toUpperCase()}
      </text>
      <text x="59" y="72" textAnchor="middle" fontFamily="var(--font-jetbrains)" fontSize="8.5" letterSpacing="1.5" fill="var(--color-ink)" opacity="0.85">
        STAMPED TODAY
      </text>
    </svg>
  );
}

export function Stamps({
  stamps,
  justStamped,
  onClearFlash,
  onOpenEntry,
  onGo,
  onCalendar,
}: {
  onCalendar: () => void;
  stamps: string[];
  justStamped: string | null;
  onClearFlash: () => void;
  onOpenEntry: (id: string) => void;
  onGo: (s: Screen) => void;
}) {
  useEffect(() => {
    if (!justStamped) return;
    // The thud lands with the postmark.
    const thud = window.setTimeout(() => sfx.stamp(), 850);
    const t = window.setTimeout(onClearFlash, 4500);
    return () => {
      window.clearTimeout(thud);
      window.clearTimeout(t);
    };
  }, [justStamped, onClearFlash]);

  const roadOf = (id: string) => ROADS.find((r) => r.stamp === id);

  return (
    <div className="ht-light relative flex h-full flex-col overflow-hidden bg-forest text-cream">
      <div className="no-scrollbar flex-1 overflow-y-auto">
        <header className="relative px-5 pt-14">
          <div className="flex justify-between text-gold">
            <Mono>Passport · {ROADS.length} roads open</Mono>
            <Mono>p. 01</Mono>
          </div>
          <div className="mt-2.5 flex items-end justify-between">
            <h1 className="leading-[0.84]">
              <span className="t-display block text-[min(68px,17.4cqw)]">Stamp</span>
              <span className="t-serif block text-[min(66px,16.9cqw)] text-gold">book</span>
            </h1>
            <div className="pb-1.5 text-right">
              <motion.div key={stamps.length} initial={{ scale: 1.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={spring} className="t-display-wide text-[min(44px,11.3cqw)] tabular-nums text-gold">
                {String(stamps.length).padStart(2, "0")}
              </motion.div>
              <Mono className="text-[9.5px]">of {TOTAL_PLACES} places</Mono>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-2 gap-x-4 gap-y-6 px-5 pb-10 pt-6">
          {STAMPS.map((s, i) => {
            const owned = stamps.includes(s.id);
            const fresh = justStamped === s.id;
            const road = roadOf(s.id);
            if (!owned) {
              return (
                <div key={s.id} style={{ rotate: `${TILT[i % TILT.length]}deg` }} className="flex h-[216px] flex-col items-center justify-center gap-2 rounded-md border-[1.5px] border-dashed border-cream/45 p-3 text-center">
                  <LockSimple size={24} weight="light" className="text-gold" />
                  <span className="text-[13.5px] font-bold">{s.title}</span>
                  <span className="t-mono text-[9px] leading-[1.5] opacity-75">{road ? `Finish the ${road.people} road` : "Coming later"}</span>
                </div>
              );
            }
            const open = () => {
              sfx.whoosh();
              if (s.opens === "artifact") onGo("artifact");
              else if (s.opens === "calendar") onCalendar();
              else if (s.entry) onOpenEntry(s.entry);
            };
            return (
              <div key={s.id} className="relative">
                <motion.button
                  type="button"
                  onClick={open}
                  disabled={!s.opens}
                  aria-label={s.opens ? `${s.title}: open` : s.title}
                  className="block w-full"
                  initial={fresh ? { scale: 1.5, rotate: TILT[i % TILT.length] - 18, opacity: 0, y: -40 } : { opacity: 0, y: 20 }}
                  animate={{ scale: 1, rotate: TILT[i % TILT.length], opacity: 1, y: 0 }}
                  transition={{ ...spring, delay: fresh ? 0.15 : 0.05 * i }}
                  whileTap={{ scale: 0.97 }}
                >
                  <StampCard s={s} />
                </motion.button>
                {fresh && (
                  <motion.div
                    className="pointer-events-none absolute -right-6 top-16"
                    initial={{ scale: 2.4, opacity: 0, rotate: -40 }}
                    animate={{ scale: 1, opacity: 1, rotate: -16 }}
                    transition={{ type: "spring", stiffness: 420, damping: 18, delay: 0.7 }}
                  >
                    <Postmark place={road?.place === "osogbo" ? "Òṣogbo" : road?.place === "nri" ? "Nri" : "Daura"} />
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <TabBar active="stamps" onGo={onGo} />
    </div>
  );
}
