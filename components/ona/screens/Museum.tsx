"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Hash, Info } from "@phosphor-icons/react";
import { useState } from "react";
import { EXHIBITION, GALLERIES, OBJECTS, REFERENCE, TOURS, VERTICALS, galleryById, objectsIn, objectsInVertical, type GalleryId, type VerticalId } from "@/lib/ona/museum";
import { HISTORY } from "@/lib/ona/museum";
import { TabBar } from "../TabBar";
import { Emblem, KeyCap, Mono, snappy, spring } from "../primitives";
import { FloorPlan, Keypad, ObjectRow } from "../museum/parts";
import type { Screen } from "../state";

type Props = {
  seen: string[];
  tour: { id: string; i: number } | null;
  onObject: (id: string) => void;
  onVertical: (id: VerticalId) => void;
  onTour: (id: string) => void;
  onGo: (s: Screen) => void;
};

export function Museum({ seen, tour, onObject, onVertical, onTour, onGo }: Props) {
  const [pad, setPad] = useState(false);
  const [room, setRoom] = useState<GalleryId | null>("g1");
  const [about, setAbout] = useState(false);
  const pct = Math.round((seen.length / OBJECTS.length) * 100);
  const activeTour = tour && TOURS.find((t) => t.id === tour.id);

  return (
    <div className="relative flex h-full flex-col bg-cream text-ink">
      <div className="no-scrollbar flex-1 overflow-y-auto">
        <header className="ht-light relative overflow-hidden bg-ink px-5 pb-6 pt-14 text-cream">
          <div className="flex flex-wrap justify-between gap-x-3 gap-y-1 text-gold">
            <Mono>{EXHIBITION.venue}</Mono>
            <Mono>{OBJECTS.length} objects · {GALLERIES.length} rooms</Mono>
          </div>
          <h1 className="mt-3 leading-[0.84]">
            <span className="t-display block text-[min(66px,17cqw)]">Roads of</span>
            <span className="t-serif block text-[min(66px,17cqw)] text-gold">Nigeria</span>
          </h1>
          <p className="mt-3 max-w-[40ch] text-[14px] leading-[1.45] text-cream/80">{EXHIBITION.intro}</p>

          <motion.button
            type="button"
            onClick={() => setPad(true)}
            whileTap={{ scale: 0.98 }}
            transition={snappy}
            className="mt-5 flex h-[60px] w-full items-center justify-between rounded-full bg-gold pl-6 pr-[7px] text-[16.5px] font-bold text-ink"
          >
            <span className="flex items-center gap-2">
              <Hash size={20} weight="bold" /> Enter a label number
            </span>
            <KeyCap>
              <ArrowRight size={18} weight="light" />
            </KeyCap>
          </motion.button>

          <div className="mt-4" aria-label={`${seen.length} of ${OBJECTS.length} objects seen`}>
            <div className="flex justify-between">
              <Mono className="text-[9.5px] text-cream/70">Your visit</Mono>
              <Mono className="text-[9.5px] tabular-nums text-gold">
                {seen.length} / {OBJECTS.length} seen
              </Mono>
            </div>
            <div className="mt-1.5 h-[6px] overflow-hidden rounded-full bg-cream/15">
              <motion.div className="h-full rounded-full bg-gold" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={spring} />
            </div>
          </div>
        </header>

        {activeTour && tour && tour.i >= 0 && tour.i < activeTour.stops.length && (
          <button type="button" onClick={() => onTour(activeTour.id)} className="mx-5 mt-4 flex w-[calc(100%-40px)] items-center gap-3 rounded-[18px] p-3 text-left" style={{ background: activeTour.tone.bg, color: activeTour.tone.fg }}>
            <span className="t-display-wide text-[30px] tabular-nums">{tour.i + 1}</span>
            <span className="min-w-0 flex-1">
              <Mono className="block text-[9.5px] opacity-80">Tour in progress</Mono>
              <span className="block truncate text-[15px] font-bold">{activeTour.name}: stop {tour.i + 1} of {activeTour.stops.length}</span>
            </span>
            <ArrowRight size={20} weight="light" />
          </button>
        )}

        {/* Verticals */}
        <section aria-labelledby="v-h" className="px-5 pt-7">
          <div className="flex items-baseline justify-between">
            <h2 id="v-h" className="t-display text-[min(34px,9cqw)]">
              Explore by subject
            </h2>
            <Mono className="text-muted">{VERTICALS.length}</Mono>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            {VERTICALS.map((v, i) => {
              const n = v.id === "history" ? HISTORY.length : objectsInVertical(v.id).length;
              return (
                <motion.button
                  key={v.id}
                  type="button"
                  onClick={() => onVertical(v.id)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...spring, delay: 0.03 * i }}
                  whileTap={{ scale: 0.97 }}
                  className={`relative flex min-h-[132px] flex-col justify-between overflow-hidden rounded-[20px] p-3.5 text-left ${i === 0 ? "col-span-2 min-h-[120px]" : ""}`}
                  style={{ background: v.tone.bg, color: v.tone.fg }}
                >
                  <span className="pointer-events-none absolute -right-5 -top-5 opacity-90">
                    <Emblem name={v.emblem} size={i === 0 ? 120 : 86} color={v.tone.fg} bg={v.tone.bg} rough={1.6} speckle={false} />
                  </span>
                  <Mono className="relative text-[9.5px] opacity-80">
                    {n} {v.id === "history" ? "dates" : "objects"}
                  </Mono>
                  <span className="relative">
                    <span className="t-display block text-[min(26px,7cqw)] leading-[0.92]">{v.name}</span>
                    <span className="mt-1 block text-[12.5px] leading-[1.3] opacity-85">{v.line}</span>
                  </span>
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* Tours */}
        <section aria-labelledby="t-h" className="pt-8">
          <h2 id="t-h" className="t-display px-5 text-[min(34px,9cqw)]">
            Guided tours
          </h2>
          <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto px-5 pb-1">
            {TOURS.map((t) => (
              <motion.button
                key={t.id}
                type="button"
                whileTap={{ scale: 0.97 }}
                transition={snappy}
                onClick={() => onTour(t.id)}
                className="flex w-[220px] shrink-0 flex-col justify-between rounded-[20px] p-4 text-left"
                style={{ background: t.tone.bg, color: t.tone.fg, minHeight: 176 }}
              >
                <Mono className="text-[9.5px] opacity-80">
                  {t.minutes} min · {t.stops.length} stops
                </Mono>
                <span>
                  <span className="t-display block text-[28px] leading-[0.9]">{t.name}</span>
                  <span className="mt-1 block text-[12.5px] font-semibold opacity-90">{t.audience}</span>
                  <span className="mt-1.5 line-clamp-3 block text-[12.5px] leading-[1.35] opacity-85">{t.intro}</span>
                </span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Rooms */}
        <section aria-labelledby="r-h" className="px-5 pt-8">
          <div className="flex items-baseline justify-between">
            <h2 id="r-h" className="t-display text-[min(34px,9cqw)]">
              Rooms
            </h2>
            <Mono className="text-muted">Tap a room</Mono>
          </div>
          <div className="mt-3 rounded-[20px] bg-paper p-3 ring-1 ring-ink/10">
            <FloorPlan active={room} onRoom={(g) => setRoom(room === g ? null : g)} />
          </div>
          <AnimatePresence mode="wait" initial={false}>
            {room && (
              <motion.div key={room} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.1 } }} transition={snappy} className="mt-4">
                <Mono className="text-brick">
                  Room {galleryById(room).n} · {galleryById(room).theme}
                </Mono>
                <h3 className="t-display mt-1 text-[min(30px,8cqw)] leading-[0.95]">{galleryById(room).name}</h3>
                <p className="mt-1.5 text-[14px] leading-[1.45] text-muted">{galleryById(room).intro}</p>
                <div className="mt-2">
                  {objectsIn(room).map((o) => (
                    <ObjectRow key={o.id} o={o} seen={seen.includes(o.id)} onOpen={() => onObject(o.id)} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <section className="px-5 pb-10 pt-8">
          <button type="button" onClick={() => setAbout(!about)} aria-expanded={about} className="flex min-h-11 items-center gap-2 text-[14px] font-semibold underline underline-offset-[3px]">
            <Info size={18} weight="light" /> About this exhibition
          </button>
          {about && (
            <div className="mt-2 rounded-[18px] border-[1.5px] border-dashed border-ink/30 p-4 text-[13.5px] leading-[1.5]">
              <p>{REFERENCE.note}</p>
              <p className="mt-2 text-muted">
                Each entry describes a type of object. A museum installing ọ̀nà adds its own objects’ photographs, accession numbers and provenance.
              </p>
            </div>
          )}
        </section>
      </div>
      <TabBar active="museum" onGo={onGo} />
      <Keypad
        open={pad}
        onClose={() => setPad(false)}
        onFound={(id) => {
          setPad(false);
          onObject(id);
        }}
      />
    </div>
  );
}
