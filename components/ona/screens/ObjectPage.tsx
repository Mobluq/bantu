"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen, ChatCircleDots, CheckSquare, Cube, Pause, Play, Square, SpeakerHigh, X } from "@phosphor-icons/react";
import { useState } from "react";
import { guideById } from "@/lib/ona/data";
import { entryById } from "@/lib/ona/almanac";
import { galleryById, objectById, objectsIn, provenanceFor, tourById, verticalById, verticalsOf, type VerticalId } from "@/lib/ona/museum";
import { sfx } from "@/lib/ona/sound";
import { useSpeaker } from "../Speak";
import { Emblem, Mono, Waveform, snappy, spring } from "../primitives";

type Props = {
  id: string;
  tour: { id: string; i: number } | null;
  onBack: () => void;
  onObject: (id: string) => void;
  onVertical: (id: VerticalId) => void;
  onAsk: (guide: ReturnType<typeof guideById>["id"], question: string) => void;
  onEntry: (id: string) => void;
  onTurntable: () => void;
  onTourStep: (d: 1 | -1) => void;
  onEndTour: () => void;
};

export function ObjectPage({ id, tour, onBack, onObject, onVertical, onAsk, onEntry, onTurntable, onTourStep, onEndTour }: Props) {
  const o = objectById(id)!;
  const g = guideById(o.guide);
  const room = galleryById(o.gallery);
  const t = tour ? tourById(tour.id) : undefined;
  const onTour = !!(t && tour && t.stops[tour.i] === o.id);
  const [kids, setKids] = useState(!!(onTour && t?.family));
  const [found, setFound] = useState<number[]>([]);
  const [transcript, setTranscript] = useState(false);
  const audio = useSpeaker(kids ? o.kids : o.story, o.guide);
  const entry = o.entry ? entryById(o.entry) : undefined;
  const siblings = objectsIn(o.gallery);
  const at = siblings.findIndex((x) => x.id === o.id);
  const prev = siblings[at - 1];
  const next = siblings[at + 1];
  const dark = o.tone.bg !== "var(--color-paper)" && o.tone.bg !== "var(--color-gold)" && o.tone.bg !== "var(--color-clay)" && o.tone.bg !== "var(--color-ochre)";
  const minutes = Math.max(1, Math.round((kids ? o.kids : o.story).split(" ").length / 150));

  return (
    <div className="relative flex h-full flex-col bg-cream text-ink">
      <div className="no-scrollbar flex-1 overflow-y-auto" key={o.id}>
        {/* Hero: the object as a printed stamp on its colour */}
        <section className={`torn-bottom relative overflow-hidden pb-10 ${dark ? "ht-light" : "ht"}`} style={{ background: o.tone.bg, color: o.tone.fg }}>
          <div className="relative flex items-center justify-between pl-1.5 pr-3.5 pt-12">
            <button type="button" onClick={onBack} aria-label="Back" className="flex size-11 items-center justify-center">
              <ArrowLeft size={22} weight="light" />
            </button>
            <Mono>Room {room.n} · {room.name}</Mono>
          </div>
          <div className="relative flex items-end justify-between gap-2 px-5 pt-2">
            <div className="min-w-0">
              <Mono className="block text-[10px] opacity-80">Label number</Mono>
              <div className="t-display-wide text-[min(64px,16cqw)] leading-[0.85] tabular-nums">{o.code}</div>
            </div>
            <motion.div initial={{ rotate: -14, scale: 0.8, opacity: 0 }} animate={{ rotate: -6, scale: 1, opacity: 1 }} transition={spring} className="-mb-4 -mr-3 shrink-0">
              <Emblem name={o.emblem} size={150} color={o.tone.fg} bg={o.tone.bg} rough={2.4} />
            </motion.div>
          </div>
        </section>

        <div className="px-5 pt-3">
          <h1 className="t-display text-[min(46px,12cqw)] leading-[0.92]">{o.title}</h1>
          {o.local && <p className="t-serif mt-1 text-[22px] text-brick">{o.local}</p>}
          <dl className="mt-4 border-t-2 border-ink">
            {(
              [
                ["Culture", o.culture],
                ["Place", o.place],
                ["Date", o.date],
                ["Material", o.material],
              ] as const
            ).map(([k, v]) => (
              <div key={k} className="grid grid-cols-[86px_minmax(0,1fr)] gap-3 border-b border-ink/15 py-2.5">
                <dt className="t-mono pt-0.5 text-[10px] text-brick">{k}</dt>
                <dd className="text-[14.5px] leading-[1.35]">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Audio guide */}
        <div className="mx-5 mt-5 rounded-[22px] p-3.5" style={{ background: "var(--color-ink)", color: "var(--color-cream)" }}>
          <div className="flex items-center gap-3">
            <motion.button
              type="button"
              onClick={audio.toggle}
              whileTap={{ scale: 0.92 }}
              transition={snappy}
              aria-pressed={audio.playing}
              aria-label={audio.playing ? "Pause the audio guide" : "Play the audio guide"}
              className="flex size-[54px] shrink-0 items-center justify-center rounded-full bg-gold text-ink"
            >
              {audio.playing ? <Pause size={22} weight="fill" /> : <Play size={22} weight="fill" />}
            </motion.button>
            <div className="min-w-0 flex-1">
              <Mono className="block text-[9.5px] text-gold">Audio guide · {minutes} min</Mono>
              <span className="block truncate text-[15px] font-bold">Told by {g.name}</span>
              <Waveform bars={22} height={16} playing={audio.playing} className="mt-1 text-cream/70" />
            </div>
            <Emblem name={g.emblem} size={40} disc color={g.tone.bg} bg={g.tone.fg} rough={1.2} speckle={false} />
          </div>
          {audio.blocked && <p className="mt-2 text-[12.5px] text-cream/75">Turn on guide voices in Me to hear the audio guide. The transcript is below.</p>}
          <button type="button" onClick={() => setTranscript(!transcript)} aria-expanded={transcript} className="mt-2 min-h-9 text-[12.5px] font-semibold text-cream/85 underline underline-offset-[3px]">
            {transcript ? "Hide transcript" : "Read the transcript"}
          </button>
          <AnimatePresence initial={false}>
            {transcript && (
              <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden text-[14px] leading-[1.55] text-cream/90">
                {kids ? o.kids : o.story}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Label, adult or children's */}
        <section className="px-5 pt-6" aria-labelledby="label-h">
          <div className="flex items-center justify-between gap-3">
            <h2 id="label-h" className="t-mono text-[10px] text-brick">
              Wall label
            </h2>
            <div role="radiogroup" aria-label="Label version" className="flex rounded-full p-[3px] ring-1 ring-ink/25">
              {([false, true] as const).map((k) => (
                <button
                  key={String(k)}
                  type="button"
                  role="radio"
                  aria-checked={kids === k}
                  onClick={() => setKids(k)}
                  className={`relative h-[32px] rounded-full px-3 text-[12.5px] font-semibold ${kids === k ? "text-cream" : ""}`}
                >
                  {kids === k && <motion.span layoutId="kids-toggle" transition={snappy} className="absolute inset-0 rounded-full bg-ink" />}
                  <span className="relative">{k ? "For children" : "Standard"}</span>
                </button>
              ))}
            </div>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.p key={String(kids)} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={snappy} className={`mt-3 leading-[1.55] ${kids ? "text-[17px]" : "text-[15.5px]"}`}>
              {kids ? o.kids : o.label}
            </motion.p>
          </AnimatePresence>
        </section>

        {/* Look for: a small checklist */}
        <section className="px-5 pt-6" aria-labelledby="look-h">
          <h2 id="look-h" className="t-display text-[min(28px,7.5cqw)]">
            Look for
          </h2>
          <ul className="mt-2">
            {o.lookFor.map((l, i) => {
              const on = found.includes(i);
              return (
                <li key={l}>
                  <button
                    type="button"
                    onClick={() => {
                      if (!on) sfx.cowrie();
                      setFound(on ? found.filter((x) => x !== i) : [...found, i]);
                    }}
                    aria-pressed={on}
                    className="flex min-h-12 w-full items-center gap-3 border-t border-ink/15 py-2 text-left text-[15px]"
                  >
                    {on ? <CheckSquare size={24} weight="fill" className="shrink-0 text-forest" /> : <Square size={24} weight="light" className="shrink-0" />}
                    <span className={on ? "text-muted line-through" : ""}>{l}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Do something */}
        {(o.turntable || o.sound) && (
          <div className="flex flex-wrap gap-2.5 px-5 pt-5">
            {o.turntable && (
              <motion.button type="button" whileTap={{ scale: 0.97 }} transition={snappy} onClick={onTurntable} className="flex h-12 items-center gap-2 rounded-full bg-gold px-5 text-[15px] font-bold text-ink">
                <Cube size={20} weight="light" /> Turn it in 3D
              </motion.button>
            )}
            {o.sound && (
              <motion.button
                type="button"
                whileTap={{ scale: 0.94 }}
                transition={snappy}
                onClick={() => (o.sound === "udu" ? sfx.udu() : sfx.ona())}
                className="flex h-12 items-center gap-2 rounded-full bg-ink px-5 text-[15px] font-bold text-gold"
              >
                <SpeakerHigh size={20} weight="fill" /> {o.sound === "udu" ? "Hear the udu" : "Hear the drum"}
              </motion.button>
            )}
          </div>
        )}

        {/* Ask the guide */}
        <section className="px-5 pt-7" aria-labelledby="ask-h">
          <h2 id="ask-h" className="t-display text-[min(28px,7.5cqw)]">
            Ask {g.name}
          </h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {o.ask.map((q) => (
              <motion.button
                key={q}
                type="button"
                whileTap={{ scale: 0.96 }}
                transition={snappy}
                onClick={() => onAsk(o.guide, q)}
                className="flex min-h-10 items-center gap-1.5 rounded-full bg-paper px-3.5 text-[13.5px] font-semibold ring-1 ring-ink/25"
              >
                <ChatCircleDots size={16} weight="light" /> {q}
              </motion.button>
            ))}
            <motion.button type="button" whileTap={{ scale: 0.96 }} transition={snappy} onClick={() => onAsk(o.guide, "")} className="min-h-10 rounded-full px-3.5 text-[13.5px] font-semibold underline underline-offset-[3px]">
              Ask your own question
            </motion.button>
          </div>
        </section>

        {/* Subjects and almanac */}
        <section className="px-5 pt-7">
          <Mono className="text-muted">Part of</Mono>
          <div className="mt-2 flex flex-wrap gap-2">
            {verticalsOf(o).map((v) => (
              <button key={v} type="button" onClick={() => onVertical(v)} className="h-9 rounded-full px-3.5 text-[13px] font-semibold" style={{ background: verticalById(v).tone.bg, color: verticalById(v).tone.fg }}>
                {verticalById(v).name}
              </button>
            ))}
          </div>
          {entry && (
            <button type="button" onClick={() => onEntry(entry.id)} className="mt-4 flex w-full items-center gap-3 rounded-[18px] bg-paper p-3 text-left ring-1 ring-ink/15">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-[12px]" style={{ background: entry.tone.bg }}>
                <Emblem name={entry.emblem} size={34} color={entry.tone.fg} bg={entry.tone.bg} rough={1} speckle={false} />
              </span>
              <span className="min-w-0 flex-1">
                <Mono className="block text-[9.5px] text-brick">Almanac Nº {entry.number}</Mono>
                <span className="block truncate text-[15px] font-bold">{entry.full}</span>
              </span>
              <BookOpen size={20} weight="light" />
            </button>
          )}
        </section>

        {/* Provenance */}
        <section className="mx-5 mt-7 rounded-[18px] border-[1.5px] border-dashed border-ink/35 p-4" aria-labelledby="prov-h">
          <h2 id="prov-h" className="t-mono text-[10px] text-brick">
            Provenance
          </h2>
          <p className="mt-1.5 text-[13.5px] leading-[1.5] text-muted">{provenanceFor(o)}</p>
        </section>

        {/* Room navigation */}
        {!onTour && (
          <nav aria-label="More in this room" className="grid grid-cols-2 gap-2.5 px-5 pb-10 pt-7">
            {prev ? (
              <button type="button" onClick={() => onObject(prev.id)} className="flex min-h-[64px] flex-col justify-center rounded-[16px] bg-paper p-3 text-left ring-1 ring-ink/15">
                <Mono className="text-[9.5px] text-muted">← Nº {prev.code}</Mono>
                <span className="line-clamp-2 text-[13.5px] font-bold leading-tight">{prev.title}</span>
              </button>
            ) : (
              <span />
            )}
            {next ? (
              <button type="button" onClick={() => onObject(next.id)} className="flex min-h-[64px] flex-col justify-center rounded-[16px] bg-paper p-3 text-right ring-1 ring-ink/15">
                <Mono className="text-[9.5px] text-muted">Nº {next.code} →</Mono>
                <span className="line-clamp-2 text-[13.5px] font-bold leading-tight">{next.title}</span>
              </button>
            ) : (
              <span />
            )}
          </nav>
        )}
        {onTour && <div className="h-28" />}
      </div>

      {/* Tour bar */}
      {onTour && t && tour && (
        <div className="border-t border-ink/15 bg-paper px-4 pb-[max(env(safe-area-inset-bottom),14px)] pt-3">
          <div className="flex items-center justify-between">
            <Mono className="text-brick">
              {t.name} · stop {tour.i + 1} of {t.stops.length}
            </Mono>
            <button type="button" onClick={onEndTour} aria-label="End the tour" className="flex size-9 items-center justify-center">
              <X size={18} weight="light" />
            </button>
          </div>
          <div className="mt-1.5 flex gap-1" aria-hidden="true">
            {t.stops.map((s, i) => (
              <span key={s} className={`h-[5px] flex-1 rounded-full ${i <= tour.i ? "bg-brick" : "bg-ink/15"}`} />
            ))}
          </div>
          <div className="mt-2.5 flex gap-2">
            <button type="button" onClick={() => onTourStep(-1)} aria-label="Previous stop" className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full ring-1 ring-ink/25">
              <ArrowLeft size={20} weight="light" />
            </button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.98 }}
              transition={snappy}
              onClick={() => {
                sfx.whoosh();
                onTourStep(1);
              }}
              className="flex h-[52px] flex-1 items-center justify-between rounded-full bg-ink pl-5 pr-2 text-[15px] font-bold text-cream"
            >
              <span className="truncate">{tour.i + 1 < t.stops.length ? `Next: Nº ${objectById(t.stops[tour.i + 1])!.code}, ${objectById(t.stops[tour.i + 1])!.title}` : "Finish the tour"}</span>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gold text-ink">
                <ArrowRight size={18} weight="light" />
              </span>
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}
