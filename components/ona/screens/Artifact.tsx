"use client";

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { ArrowLeft, ArrowsClockwise, Cube, Pause, Play } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { Emblem, Mono, Waveform, snappy } from "../primitives";

/** Illustrated Ifẹ̀ head. Lighting shifts with the turn angle to fake a 3D turntable. */
function IfeHead({ hi }: { hi: MotionValue<number> }) {
  const s1 = useTransform(hi, (v) => v - 0.16);
  const s3 = useTransform(hi, (v) => v + 0.22);
  const lines = [];
  for (let x = 104; x < 198; x += 6) {
    lines.push(
      <path
        key={x}
        d={`M${x} ${78 + Math.abs(150 - x) * 0.5} C${x} 150 ${x + (x - 150) * 0.05} 210 ${150 + (x - 150) * 0.82} 262`}
        fill="none"
        stroke="#5A2A12"
        strokeWidth="1.1"
        opacity="0.55"
      />,
    );
  }
  const beads = [];
  const rows: [number, number, number][] = [
    [70, 64, 22],
    [58, 60, 20],
    [46, 55, 18],
    [34, 48, 16],
  ];
  for (const [y, rx, n] of rows) {
    for (let i = 0; i < n; i++) {
      const a = Math.PI * (i / (n - 1));
      beads.push(<circle key={`${y}-${i}`} cx={150 - rx * Math.cos(a)} cy={y + 6 * Math.sin(a)} r="4.2" fill="url(#cu2)" stroke="#4A2410" strokeWidth="0.6" />);
    }
  }
  return (
    <svg width="300" height="340" viewBox="0 0 300 340" role="img" aria-label="Ifẹ̀ copper-alloy head with a beaded crown and fine vertical lines on the face" className="block overflow-visible">
      <defs>
        <linearGradient id="cu" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5E2C12" />
          <motion.stop offset={s1} stopColor="#C47A3E" />
          <motion.stop offset={hi} stopColor="#EDB074" />
          <motion.stop offset={s3} stopColor="#A65A28" />
          <stop offset="1" stopColor="#4A2210" />
        </linearGradient>
        <linearGradient id="cu2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F0BE7A" />
          <stop offset="1" stopColor="#8A4A1E" />
        </linearGradient>
      </defs>
      <path d="M120 262 L180 262 L186 324 L114 324 Z" fill="url(#cu)" />
      <path d="M92 92 C92 46 208 46 208 92 L206 160 C204 226 178 266 150 266 C122 266 96 226 94 160 Z" fill="url(#cu)" />
      {lines}
      <path d="M112 150 C122 140 136 140 142 150 C134 156 120 156 112 150 Z M158 150 C164 140 178 140 188 150 C180 156 166 156 158 150 Z" fill="#3A1A0A" opacity="0.85" />
      <path d="M108 140 C120 130 136 132 144 140 M156 140 C164 132 180 130 192 140" stroke="#3A1A0A" strokeWidth="2.4" fill="none" opacity="0.8" />
      <path d="M150 156 C146 176 140 192 138 200 C144 206 156 206 162 200 C160 192 154 176 150 156" fill="#8C4720" opacity="0.6" />
      <path d="M128 222 C140 216 160 216 172 222 C162 232 138 232 128 222 Z" fill="#5A2810" />
      <path d="M98 84 C98 40 202 40 202 84 C202 88 98 88 98 84 Z" fill="url(#cu)" />
      {beads}
      <path d="M150 6 C140 14 140 28 150 34 C160 28 160 14 150 6 Z" fill="url(#cu2)" stroke="#4A2410" strokeWidth="0.8" />
    </svg>
  );
}

export function Artifact({ onBack }: { onBack: () => void }) {
  const drag = useMotionValue(0);
  const turn = useSpring(drag, { stiffness: 100, damping: 20 });
  const rotateY = useTransform(turn, [-160, 160], [-38, 38]);
  const handleX = useTransform(turn, [-160, 160], [40, 320]);
  const highlight = useTransform(turn, [-160, 160], [0.24, 0.56]);

  const [toast, setToast] = useState(false);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(false), 2600);
    return () => window.clearTimeout(t);
  }, [toast]);

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-[radial-gradient(120%_70%_at_50%_42%,#4A3220_0%,#24180F_55%,var(--color-ink)_100%)] text-cream">
      <div className="flex items-center justify-between pl-1.5 pr-3.5 pt-12">
        <button type="button" onClick={onBack} aria-label="Back" className="flex size-11 items-center justify-center">
          <ArrowLeft size={22} weight="light" />
        </button>
        <Mono className="text-gold">Ilé-Ifẹ̀ · Object 07 / 40</Mono>
      </div>
      <h1 className="mx-5 mt-1.5 leading-[0.86]">
        <span className="t-display text-[60px]">Ifẹ̀ </span>
        <span className="t-serif text-[62px] text-gold">head</span>
      </h1>
      <div className="t-mono mx-5 mt-2.5 text-[10px] leading-[1.7] text-cream/70">
        Copper alloy · c. 12th–15th century
        <br />
        Ilé-Ifẹ̀, Yorùbá
      </div>

      <motion.div
        className="relative mt-1 flex h-[380px] cursor-grab touch-pan-y justify-center active:cursor-grabbing"
        onPan={(_, info) => drag.set(Math.max(-160, Math.min(160, drag.get() + info.delta.x)))}
        onPanEnd={() => drag.set(0)}
        aria-label="Drag sideways to turn the head"
      >
        <svg width="360" height="120" viewBox="0 0 360 120" aria-hidden="true" className="absolute left-[15px] top-[250px]">
          <ellipse cx="180" cy="60" rx="168" ry="40" fill="none" stroke="rgb(240 190 60 / 0.55)" strokeWidth="1.3" strokeDasharray="3 5" />
          <ellipse cx="180" cy="66" rx="118" ry="20" fill="#2a1d13" stroke="rgb(240 190 60 / 0.3)" />
        </svg>
        <motion.div className="absolute top-[262px] size-[18px] rounded-full bg-gold shadow-[0_0_0_6px_rgb(240_190_60_/_0.18)]" style={{ left: handleX }} />
        <motion.div style={{ rotateY, transformPerspective: 700 }} className="relative mt-1">
          <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
            <IfeHead hi={highlight} />
          </motion.div>
        </motion.div>
        <div className="absolute right-[18px] top-4 flex flex-col items-center gap-1.5 text-gold">
          <ArrowsClockwise size={22} weight="light" />
          <Mono className="text-[9px]">360°</Mono>
        </div>
        <div className="absolute inset-x-0 bottom-0.5 text-center">
          <Mono className="text-[9.5px] text-cream/60">Drag to turn · pinch to look closer</Mono>
        </div>
      </motion.div>

      <div className="flex items-start gap-2.5 px-[18px] pt-2.5">
        <div className="shrink-0">
          <Emblem name="osun" size={40} disc color="var(--color-gold)" bg="var(--color-forest)" rough={1.4} speckle={false} />
        </div>
        <p className="flex-1 rounded-[4px_18px_18px_18px] border border-cream/25 bg-paper/[0.08] px-[13px] py-2.5 text-[13.5px] leading-[1.42]">
          See the fine lines down the face? Some Ifẹ̀ heads have them and some don’t. Scholars still debate what they mean.
        </p>
      </div>

      <div className="flex-1" />
      <div className="flex gap-2.5 px-[18px] pb-[max(env(safe-area-inset-bottom),30px)]">
        <motion.button
          type="button"
          whileTap={{ scale: 0.98, y: 1 }}
          transition={snappy}
          onClick={() => setToast(true)}
          className="flex h-[54px] flex-1 items-center justify-center gap-2 rounded-full bg-gold text-[15.5px] font-bold text-ink"
        >
          <Cube size={20} weight="light" />
          See it in your room
        </motion.button>
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          transition={snappy}
          onClick={() => setPlaying((p) => !p)}
          aria-pressed={playing}
          aria-label={playing ? "Pause the story" : "Listen to the story"}
          className="flex h-[54px] min-w-[54px] items-center justify-center gap-2 rounded-full border-[1.5px] border-cream/50 px-4 text-cream"
        >
          {playing ? <Pause size={16} weight="fill" /> : <Play size={16} weight="fill" />}
          {playing && <Waveform bars={8} height={16} playing />}
        </motion.button>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            initial={{ y: 30, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={snappy}
            className="absolute inset-x-[18px] bottom-[100px] rounded-2xl border border-cream/20 bg-ink/90 px-4 py-3 text-[13.5px] shadow-[inset_0_1px_0_rgb(255_255_255_/_0.08)] backdrop-blur"
          >
            AR Quick Look opens this head in the iPhone app. The web prototype stops here.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
