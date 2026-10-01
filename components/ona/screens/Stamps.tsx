"use client";

import { motion } from "framer-motion";
import { CaretRight, LockSimple } from "@phosphor-icons/react";
import { useEffect } from "react";
import { STAMPS, TOTAL_PLACES, type StampDef } from "@/lib/ona/data";
import { TabBar } from "../TabBar";
import { Emblem, Mono, spring } from "../primitives";
import type { Screen } from "../state";

const SLOTS: Record<string, { left?: number; right?: number; top: number; rotate: number }> = {
  osogbo: { left: 18, top: 6, rotate: -4 },
  ife: { right: 16, top: 20, rotate: 3 },
  lagos: { left: 28, top: 262, rotate: 2.5 },
  benin: { right: 22, top: 276, rotate: -2 },
};

function StampCard({ s }: { s: StampDef }) {
  return (
    <div className="stamp-edge w-[158px] bg-paper drop-shadow-[0_6px_10px_rgb(30_20_12_/_0.25)]">
      <div className="relative flex h-[210px] flex-col overflow-hidden outline outline-[1.5px] -outline-offset-[5px] outline-ink" style={{ background: s.bg, color: s.fg }}>
        <div className="flex items-start justify-between px-[11px] pt-[11px]">
          <span className="t-mono text-[9px] tracking-[0.18em]">Nigeria</span>
          <span className="t-display-wide text-[22px] leading-[0.9]">{s.value}</span>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <Emblem name={s.emblem} size={104} color={s.fg} bg={s.bg} rough={1.8} />
        </div>
        <div className="px-[11px] pb-3">
          <div className="text-[12.5px] font-extrabold leading-[1.15]">{s.title}</div>
          <div className="t-mono mt-[3px] text-[8.5px] opacity-80">{s.sub}</div>
        </div>
      </div>
    </div>
  );
}

function Postmark() {
  return (
    <svg width="118" height="118" viewBox="0 0 118 118" aria-hidden="true" className="block">
      <g fill="none" stroke="var(--color-ink)" opacity="0.8">
        <circle cx="59" cy="59" r="46" strokeWidth="2.6" />
        <circle cx="59" cy="59" r="33" strokeWidth="1.4" />
        <path d="M-30 40 C-10 30 0 48 14 40 M-30 60 C-10 50 0 68 14 60 M-30 80 C-10 70 0 88 14 80" strokeWidth="2.2" />
      </g>
      <text x="59" y="56" textAnchor="middle" fontFamily="var(--font-archivo)" fontWeight="800" fontSize="13" fill="var(--color-ink)" opacity="0.85">
        ÒṢOGBO
      </text>
      <text x="59" y="72" textAnchor="middle" fontFamily="var(--font-jetbrains)" fontSize="9" letterSpacing="1.5" fill="var(--color-ink)" opacity="0.85">
        STAMPED TODAY
      </text>
    </svg>
  );
}

export function Stamps({ stamps, justStamped, onClearFlash, onGo }: { stamps: string[]; justStamped: string | null; onClearFlash: () => void; onGo: (s: Screen) => void }) {
  useEffect(() => {
    if (!justStamped) return;
    const t = window.setTimeout(onClearFlash, 4000);
    return () => window.clearTimeout(t);
  }, [justStamped, onClearFlash]);

  const hasGrove = stamps.includes("osogbo");

  return (
    <div className="ht-light relative flex h-full flex-col overflow-hidden bg-forest text-cream">
      <header className="relative px-5 pt-14">
        <div className="flex justify-between text-gold">
          <Mono>Passport · Yorùbá &amp; Edo roads</Mono>
          <Mono>p. 01</Mono>
        </div>
        <div className="mt-2.5 flex items-end justify-between">
          <h1 className="leading-[0.84]">
            <span className="t-display block text-[68px]">Stamp</span>
            <span className="t-serif block text-[66px] text-gold">book</span>
          </h1>
          <div className="pb-1.5 text-right">
            <motion.div key={stamps.length} initial={{ scale: 1.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={spring} className="t-display-wide text-[44px] tabular-nums text-gold">
              {String(stamps.length).padStart(2, "0")}
            </motion.div>
            <Mono className="text-[9.5px]">of {TOTAL_PLACES} places</Mono>
          </div>
        </div>
      </header>

      <div className="relative mt-3.5 h-[520px]">
        {STAMPS.map((s, i) => {
          const pos = SLOTS[s.id];
          const owned = stamps.includes(s.id);
          const fresh = justStamped === s.id;
          const style = { left: pos.left, right: pos.right, top: pos.top };
          if (!owned) {
            return (
              <div key={s.id} className="absolute" style={{ ...style, rotate: `${pos.rotate}deg` }}>
                <div className="flex h-[226px] w-[158px] flex-col items-center justify-center gap-2 rounded-md border-[1.5px] border-dashed border-cream/50 p-3 text-center">
                  <LockSimple size={24} weight="bold" className="text-gold" />
                  <span className="text-[13.5px] font-bold">{s.title}</span>
                  <span className="t-mono text-[9px] leading-[1.5] opacity-75">Finish Ọ̀ṣun’s road to earn this stamp</span>
                </div>
              </div>
            );
          }
          const Card = (
            <motion.div
              initial={fresh ? { scale: 1.5, rotate: pos.rotate - 18, opacity: 0, y: -40 } : { opacity: 0, y: 20 }}
              animate={{ scale: 1, rotate: pos.rotate, opacity: 1, y: 0 }}
              transition={{ ...spring, delay: fresh ? 0.15 : 0.06 * i }}
              whileTap={{ scale: 0.97 }}
            >
              <StampCard s={s} />
            </motion.div>
          );
          return (
            <div key={s.id} className="absolute" style={style}>
              {s.opens ? (
                <button type="button" onClick={() => onGo(s.opens!)} aria-label={`${s.title}: open ${s.opens}`}>
                  {Card}
                </button>
              ) : (
                Card
              )}
            </div>
          );
        })}
        {hasGrove && (
          <motion.div
            className="pointer-events-none absolute left-32 top-[150px]"
            initial={justStamped === "osogbo" ? { scale: 2.4, opacity: 0, rotate: -40 } : false}
            animate={{ scale: 1, opacity: 1, rotate: -16 }}
            transition={{ type: "spring", stiffness: 420, damping: 18, delay: justStamped === "osogbo" ? 0.7 : 0 }}
          >
            <Postmark />
          </motion.div>
        )}
      </div>

      <button type="button" onClick={() => onGo("map")} className="relative mx-4 flex items-center gap-3 border-t border-cream/25 px-0.5 pb-4 pt-3.5 text-left">
        <LockSimple size={20} weight="bold" className="text-gold" />
        <span className="flex-1">
          <span className="block text-[14px] font-semibold">{hasGrove ? "Next: Nri, in Igbo country" : "Next: Ọ̀ṣun’s grove, Òṣogbo"}</span>
          <Mono className="text-[9.5px] opacity-70">{hasGrove ? "Ala’s road opens with the Igbo release" : "Finish today’s lesson to stamp it"}</Mono>
        </span>
        <CaretRight size={18} weight="bold" />
      </button>

      <div className="flex-1" />
      <TabBar active="stamps" onGo={onGo} />
    </div>
  );
}
