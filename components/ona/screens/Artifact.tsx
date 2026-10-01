"use client";

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { ArrowLeft, ArrowsClockwise, CaretLeft, CaretRight, MagnifyingGlassMinus, MagnifyingGlassPlus, Pause, Play } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { sfx } from "@/lib/ona/sound";
import { useSpeaker } from "../Speak";
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
    <svg viewBox="0 0 300 340" role="img" aria-label="Ifẹ̀ copper-alloy head with a beaded crown and fine vertical lines on the face" className="block h-full max-h-[340px] w-auto overflow-visible">
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

/** Points of interest on the head, in the 300x340 drawing's coordinates. */
const SPOTS = [
  {
    id: "crown",
    x: 150,
    y: 52,
    zoom: { x: 0, y: 95 },
    label: "The beaded crown",
    text: "Rows of beads build a tall crown with a crest at the top. Crowned heads like this are usually read as rulers, an Ọ̀ọ̀ni of Ifẹ̀, though no head carries a name.",
  },
  {
    id: "lines",
    x: 118,
    y: 186,
    zoom: { x: 45, y: -10 },
    label: "Lines down the face",
    text: "Fine vertical lines run from brow to chin. Some heads have them and some do not. They may show scarification, a beaded veil, or a style of the workshop. Scholars still debate it.",
  },
  {
    id: "mouth",
    x: 150,
    y: 224,
    zoom: { x: 0, y: -60 },
    label: "Small holes",
    text: "Several Ifẹ̀ heads have small holes around the mouth or along the hairline. One idea is that a veil, a beard or a crown was once attached there. Nobody knows for certain.",
  },
  {
    id: "metal",
    x: 172,
    y: 296,
    zoom: { x: -30, y: -120 },
    label: "The metal",
    text: "Cast by the lost-wax method in copper alloy, some nearly pure copper, which is hard to cast. Thirteen heads were found together in Ilé-Ifẹ̀ in 1938.",
  },
] as const;

const STORY =
  "This is a head from Ilé-Ifẹ̀, the city Yorùbá tradition calls the place where the world was made. It was cast in copper alloy between the twelfth and fifteenth centuries, by the lost-wax method. When heads like this reached Europe in the early twentieth century, some writers refused to believe Africans had made them. They were wrong. The face is calm and lifelike, and it was made here, in Ifẹ̀. Tap Look closer, and I will show you the crown, the lines, and the small holes that still puzzle scholars.";

export function Artifact({ onBack }: { onBack: () => void }) {
  const drag = useMotionValue(0);
  const turn = useSpring(drag, { stiffness: 100, damping: 20 });
  const rotateY = useTransform(turn, [-160, 160], [-38, 38]);
  const handlePct = useTransform(turn, [-160, 160], ["8%", "92%"]);
  const highlight = useTransform(turn, [-160, 160], [0.24, 0.56]);

  const [closer, setCloser] = useState(false);
  const [spot, setSpot] = useState<(typeof SPOTS)[number]["id"] | null>(null);
  const active = SPOTS.find((x) => x.id === spot) ?? null;
  const story = useSpeaker(STORY, "osun");
  const spotVoice = useSpeaker(active ? `${active.label}. ${active.text}` : "", "osun");

  useEffect(() => {
    if (!closer) setSpot(null);
  }, [closer]);

  const nudge = (d: number) => {
    sfx.tap();
    drag.set(Math.max(-160, Math.min(160, drag.get() + d)));
  };

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-[radial-gradient(120%_70%_at_50%_42%,#4A3220_0%,#24180F_55%,var(--color-ink)_100%)] text-cream">
      <div className="flex shrink-0 items-center justify-between pl-1.5 pr-3.5 pt-safe">
        <button type="button" onClick={onBack} aria-label="Back" className="flex size-11 items-center justify-center">
          <ArrowLeft size={22} weight="light" />
        </button>
        <Mono className="text-gold">Ilé-Ifẹ̀ · Object 07 / 40</Mono>
      </div>
      <div className="shrink-0">
        <h1 className="mx-5 mt-1.5 leading-[0.86]">
          <span className="t-display text-[min(60px,15cqw,7.0cqh)]">Ifẹ̀ </span>
          <span className="t-serif text-[min(62px,15.5cqw,7.2cqh)] text-gold">head</span>
        </h1>
        <div className="t-mono mx-5 mt-2.5 text-[10px] leading-[1.7] text-cream/70 [@media(max-height:640px)]:hidden">
          Copper alloy · c. 12th–15th century
          <br />
          Ilé-Ifẹ̀, Yorùbá
        </div>
      </div>

      <motion.div
        className={`relative mt-1 flex min-h-[150px] flex-1 touch-pan-y justify-center overflow-hidden ${closer ? "" : "cursor-grab active:cursor-grabbing"}`}
        onPan={closer ? undefined : (_, info) => drag.set(Math.max(-160, Math.min(160, drag.get() + info.delta.x)))}
        onPanEnd={closer ? undefined : () => drag.set(0)}
      >
        {!closer && (
          <>
            <svg viewBox="0 0 360 120" aria-hidden="true" preserveAspectRatio="xMidYMid meet" className="absolute bottom-[6%] left-1/2 h-[30%] w-[92%] -translate-x-1/2">
              <ellipse cx="180" cy="60" rx="168" ry="40" fill="none" stroke="rgb(240 190 60 / 0.55)" strokeWidth="1.3" strokeDasharray="3 5" />
              <ellipse cx="180" cy="66" rx="118" ry="20" fill="#2a1d13" stroke="rgb(240 190 60 / 0.3)" />
            </svg>
            <motion.div className="absolute bottom-[16%] size-[18px] -translate-x-1/2 rounded-full bg-gold shadow-[0_0_0_6px_rgb(240_190_60_/_0.18)]" style={{ left: handlePct }} />
          </>
        )}
        <motion.div
          className="relative h-[88%] max-h-[340px]"
          animate={closer && active ? { scale: 1.9, x: active.zoom.x, y: active.zoom.y } : closer ? { scale: 1.12, x: 0, y: 0 } : { scale: 1, x: 0, y: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 22 }}
        >
          <motion.div style={{ rotateY: closer ? 0 : rotateY, transformPerspective: 700 }} className="relative h-full">
            <motion.div animate={closer ? { y: 0 } : { y: [0, -6, 0] }} transition={closer ? snappy : { duration: 5, repeat: Infinity, ease: "easeInOut" }} className="relative h-full">
              <IfeHead hi={highlight} />
              {closer &&
                SPOTS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      sfx.tap();
                      setSpot(spot === p.id ? null : p.id);
                    }}
                    aria-pressed={spot === p.id}
                    aria-label={p.label}
                    className="absolute flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                    style={{ left: `${(p.x / 300) * 100}%`, top: `${(p.y / 340) * 100}%` }}
                  >
                    <span className={`flex size-[18px] items-center justify-center rounded-full ring-2 ring-gold ${spot === p.id ? "bg-gold" : "bg-ink/60"}`}>
                      <span className="size-1.5 rounded-full bg-gold" />
                    </span>
                    {spot !== p.id && <span className="animate-pin absolute size-[18px] rounded-full bg-gold/40" />}
                  </button>
                ))}
            </motion.div>
          </motion.div>
        </motion.div>
        {!closer && (
          <>
            <div className="absolute right-[18px] top-3 flex flex-col items-center gap-1.5 text-gold">
              <ArrowsClockwise size={22} weight="light" />
              <Mono className="text-[9px]">Turn</Mono>
            </div>
            <div className="absolute inset-x-0 bottom-0.5 flex items-center justify-center gap-3">
              <button type="button" onClick={() => nudge(-80)} aria-label="Turn left" className="flex size-10 items-center justify-center text-cream/70">
                <CaretLeft size={18} weight="light" />
              </button>
              <Mono className="text-[9.5px] text-cream/60">Drag to turn</Mono>
              <button type="button" onClick={() => nudge(80)} aria-label="Turn right" className="flex size-10 items-center justify-center text-cream/70">
                <CaretRight size={18} weight="light" />
              </button>
            </div>
          </>
        )}
      </motion.div>

      <div className="flex shrink-0 items-start gap-2.5 px-[18px] pt-2.5" aria-live="polite">
        <div className="shrink-0">
          <Emblem name="osun" size={40} disc color="var(--color-gold)" bg="var(--color-forest)" rough={1.4} speckle={false} />
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active?.id ?? (closer ? "closer" : "intro")}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6, transition: { duration: 0.1 } }}
            transition={snappy}
            className="no-scrollbar max-h-[min(150px,24svh)] min-h-[64px] flex-1 overflow-y-auto rounded-[4px_18px_18px_18px] border border-cream/25 bg-paper/[0.08] px-[13px] py-2.5 text-[13.5px] leading-[1.42]"
          >
            {active ? (
              <>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-gold">{active.label}</span>
                  <button type="button" onClick={spotVoice.toggle} aria-pressed={spotVoice.playing} aria-label={spotVoice.playing ? "Stop" : `Hear about ${active.label}`} className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gold text-ink">
                    {spotVoice.playing ? <Pause size={13} weight="fill" /> : <Play size={13} weight="fill" />}
                  </button>
                </div>
                <p className="mt-1">{active.text}</p>
              </>
            ) : closer ? (
              "Tap a gold point to look closer. Tap it again to step back."
            ) : (
              "See the fine lines down the face? Some Ifẹ̀ heads have them and some don’t. Tap Look closer and I’ll show you."
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex shrink-0 gap-2.5 px-[18px] pb-[max(env(safe-area-inset-bottom),20px)] pt-3">
        <motion.button
          type="button"
          whileTap={{ scale: 0.98, y: 1 }}
          transition={snappy}
          onClick={() => {
            sfx.whoosh();
            drag.set(0);
            setCloser((c) => !c);
          }}
          aria-pressed={closer}
          className="flex h-[54px] flex-1 items-center justify-center gap-2 rounded-full bg-gold text-[15.5px] font-bold text-ink"
        >
          {closer ? <MagnifyingGlassMinus size={20} weight="light" /> : <MagnifyingGlassPlus size={20} weight="light" />}
          {closer ? "Step back" : "Look closer"}
        </motion.button>
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          transition={snappy}
          onClick={story.toggle}
          aria-pressed={story.playing}
          aria-label={story.playing ? "Stop the story" : "Listen to the story"}
          className="relative flex h-[54px] min-w-[54px] items-center justify-center gap-2 rounded-full border-[1.5px] border-cream/50 px-4 text-cream"
        >
          {story.playing ? <Pause size={16} weight="fill" /> : <Play size={16} weight="fill" />}
          {story.playing && <Waveform bars={8} height={16} playing />}
        </motion.button>
      </div>
      {story.blocked && (
        <p role="status" className="absolute inset-x-[18px] bottom-[96px] rounded-2xl bg-ink/90 px-4 py-3 text-center text-[13px]">
          Turn on guide voices in Me to hear the story.
        </p>
      )}
    </div>
  );
}
