"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Backspace, CheckCircle, X } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { GALLERIES, OBJECTS, galleryById, objectByCode, type GalleryId, type MuseumObject } from "@/lib/ona/museum";
import { sfx } from "@/lib/ona/sound";
import { Emblem, Mono, snappy } from "../primitives";

/** A row in any object list: stamp tile, label number, title and tombstone. */
export function ObjectRow({ o, seen, onOpen, index, dark = false }: { o: MuseumObject; seen: boolean; onOpen: () => void; index?: number; dark?: boolean }) {
  return (
    <button type="button" onClick={onOpen} className={`group flex w-full items-center gap-3.5 border-t py-3 text-left ${dark ? "border-cream/15" : "border-ink/15"}`}>
      <span className="relative flex size-[58px] shrink-0 items-center justify-center rounded-[14px]" style={{ background: o.tone.bg }}>
        <Emblem name={o.emblem} size={42} color={o.tone.fg} bg={o.tone.bg} rough={1.2} speckle={false} />
        {index !== undefined && (
          <span className="t-mono absolute -left-1.5 -top-1.5 flex size-6 items-center justify-center rounded-full bg-ink text-[10px] text-gold ring-2 ring-cream">{index}</span>
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline gap-2">
          <Mono className={`shrink-0 text-[10px] ${dark ? "text-gold" : "text-brick"}`}>Nº {o.code}</Mono>
          {seen && <CheckCircle size={14} weight="fill" className={dark ? "text-gold" : "text-forest"} aria-label="Seen" />}
        </span>
        <span className="block text-[16px] font-bold leading-tight">{o.title}</span>
        <span className={`block truncate text-[12.5px] ${dark ? "text-cream/70" : "text-muted"}`}>
          {o.culture} · {o.date}
        </span>
      </span>
      <span className={`t-serif text-[22px] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 ${dark ? "text-gold" : "text-brick"}`}>→</span>
    </button>
  );
}

const W = 330;
const H = 210;
const cellW = W / 3;
const cellH = H / 2;
const centre = (g: GalleryId): [number, number] => {
  const c = galleryById(g).cell;
  return [c[0] * cellW + cellW / 2, c[1] * cellH + cellH / 2];
};

/** The exhibition floor plan: six rooms in two rows; an optional route through tour stops. */
export function FloorPlan({ active, onRoom, route, seen, current }: { active?: GalleryId | null; onRoom?: (g: GalleryId) => void; route?: string[]; seen?: string[]; current?: number }) {
  const pts = (route ?? []).map((id, i) => {
    const o = OBJECTS.find((x) => x.id === id)!;
    const [cx, cy] = centre(o.gallery);
    const same = (route ?? []).slice(0, i).filter((r) => OBJECTS.find((x) => x.id === r)!.gallery === o.gallery).length;
    return [cx - 18 + same * 18, cy + 14] as [number, number];
  });
  return (
    <svg viewBox={`-6 -6 ${W + 12} ${H + 30}`} className="block h-auto w-full" role="group" aria-label="Floor plan of the exhibition">
      <rect x={-2} y={-2} width={W + 4} height={H + 4} rx={10} fill="none" stroke="var(--color-ink)" strokeWidth={2.5} />
      {GALLERIES.map((g) => {
        const [x, y] = [g.cell[0] * cellW, g.cell[1] * cellH];
        const on = active === g.id;
        return (
          <g key={g.id} onClick={onRoom ? () => onRoom(g.id) : undefined} className={onRoom ? "cursor-pointer" : undefined} role={onRoom ? "button" : undefined} aria-label={onRoom ? `Room ${g.n}: ${g.name}` : undefined} tabIndex={onRoom ? 0 : undefined} onKeyDown={onRoom ? (e) => (e.key === "Enter" || e.key === " ") && onRoom(g.id) : undefined}>
            <rect x={x + 3} y={y + 3} width={cellW - 6} height={cellH - 6} rx={6} style={{ fill: on ? g.tone.bg : "var(--color-paper)" }} stroke="var(--color-ink)" strokeOpacity={on ? 1 : 0.35} strokeWidth={1.5} />
            <text x={x + 10} y={y + 22} style={{ fill: on ? g.tone.fg : "var(--color-ink)" }} fontFamily="var(--font-anybody)" fontWeight={850} fontSize={20}>
              {g.n}
            </text>
            <text x={x + 10} y={y + 38} style={{ fill: on ? g.tone.fg : "var(--color-muted)" }} fontFamily="var(--font-archivo)" fontWeight={600} fontSize={9.5}>
              {g.name.length > 18 ? `${g.name.slice(0, 17)}…` : g.name}
            </text>
          </g>
        );
      })}
      {/* doorway / entrance */}
      <path d={`M${W / 2 - 18} ${H + 2} h36`} stroke="var(--color-cream)" strokeWidth={5} />
      <text x={W / 2} y={H + 20} textAnchor="middle" fontFamily="var(--font-jetbrains)" fontSize={8.5} letterSpacing={1.5} style={{ fill: "var(--color-muted)" }}>
        ENTRANCE
      </text>
      {pts.length > 1 && <polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke="var(--color-brick)" strokeWidth={2} strokeDasharray="3 4" strokeLinecap="round" />}
      {pts.map(([x, y], i) => {
        const done = seen?.includes(route![i]);
        const here = current === i;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={here ? 9 : 7.5} style={{ fill: here ? "var(--color-gold)" : done ? "var(--color-forest)" : "var(--color-ink)" }} stroke="var(--color-paper)" strokeWidth={1.5} />
            <text x={x} y={y + 3} textAnchor="middle" fontFamily="var(--font-jetbrains)" fontSize={8.5} style={{ fill: here ? "var(--color-ink)" : "var(--color-cream)" }}>
              {i + 1}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** The audio-guide keypad: type the number on a wall label. */
export function Keypad({ open, onClose, onFound }: { open: boolean; onClose: () => void; onFound: (id: string) => void }) {
  const [code, setCode] = useState("");
  const [miss, setMiss] = useState(false);
  useEffect(() => {
    if (!open) {
      setCode("");
      setMiss(false);
    }
  }, [open]);
  const press = (d: string) => {
    sfx.tap();
    setMiss(false);
    const next = (code + d).slice(0, 3);
    setCode(next);
    if (next.length === 3) {
      const o = objectByCode(next);
      if (o) {
        window.setTimeout(() => onFound(o.id), 180);
      } else {
        setMiss(true);
        sfx.wrong();
        window.setTimeout(() => setCode(""), 700);
      }
    }
  };
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"];
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="absolute inset-0 z-40 flex flex-col justify-end bg-ink/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Enter a label number"
            className="rounded-t-[28px] bg-paper px-5 pb-[max(env(safe-area-inset-bottom),20px)] pt-4 text-ink"
            initial={{ y: 400 }}
            animate={{ y: 0 }}
            exit={{ y: 400 }}
            transition={snappy}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <Mono className="text-brick">Audio guide</Mono>
              <button type="button" onClick={onClose} aria-label="Close keypad" className="flex size-10 items-center justify-center">
                <X size={20} weight="light" />
              </button>
            </div>
            <p className="t-display text-[min(30px,8cqw)] leading-[0.95]">Type the number on the label</p>
            <motion.div animate={miss ? { x: [0, -10, 10, -6, 6, 0] } : {}} transition={{ duration: 0.4 }} className="mt-4 flex justify-center gap-3" aria-live="polite">
              {[0, 1, 2].map((i) => (
                <span key={i} className={`t-display-wide flex h-[64px] w-[56px] items-center justify-center rounded-[14px] text-[36px] tabular-nums ring-2 ${miss ? "text-brick ring-brick" : code[i] ? "ring-ink" : "ring-ink/20"}`}>
                  {code[i] ?? ""}
                </span>
              ))}
            </motion.div>
            <p className={`mt-2 min-h-5 text-center text-[13px] ${miss ? "font-semibold text-brick" : "text-muted"}`}>
              {miss ? "No object has that number. Check the label and try again." : "Numbers run 101 to 603, by room."}
            </p>
            <div className="mx-auto mt-2 grid max-w-[300px] grid-cols-3 gap-2.5">
              {keys.map((k, i) =>
                k === "" ? (
                  <span key={i} />
                ) : (
                  <motion.button
                    key={i}
                    type="button"
                    whileTap={{ scale: 0.92 }}
                    transition={snappy}
                    onClick={() => (k === "del" ? (sfx.tap(), setCode(code.slice(0, -1)), setMiss(false)) : press(k))}
                    aria-label={k === "del" ? "Delete" : k}
                    className={`flex h-[58px] items-center justify-center rounded-full text-[24px] font-bold ${k === "del" ? "" : "bg-cream ring-1 ring-ink/15"}`}
                  >
                    {k === "del" ? <Backspace size={24} weight="light" /> : k}
                  </motion.button>
                ),
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
