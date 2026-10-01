"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Fire, LockSimple, Moon, Pause, Play, Sun } from "@phosphor-icons/react";
import { useEffect } from "react";
import { ambience, sfx, stopSpeaking } from "@/lib/ona/sound";
import { useSoundPrefs, useSpeaker } from "../Speak";
import { PLACES, TALES, TOTAL_PLACES, guideById, type GuideId, type PlaceStatus } from "@/lib/ona/data";
import { NigeriaMap } from "../NigeriaMap";
import { ROADS, lessonsForRoad } from "@/lib/ona/roads";
import { nextLesson } from "../state";
import { TabBar } from "../TabBar";
import { Cowrie, Emblem, KeyCap, Mono, PrimaryButton, Waveform, snappy } from "../primitives";
import type { Screen } from "../state";

type Props = {
  night: boolean;
  setNight: (n: boolean) => void;
  statuses: Record<string, PlaceStatus>;
  selected: string;
  onSelect: (id: string) => void;
  cowries: number;
  streak: number;
  stamped: number;
  completed: string[];
  onOpenLesson: (id: string) => void;
  onGo: (s: Screen) => void;
};

function DayNightToggle({ night, setNight }: { night: boolean; setNight: (n: boolean) => void }) {
  const opts = [
    { n: false, label: "Day", Icon: Sun, aria: "Day map" },
    { n: true, label: "Àlọ́", Icon: Moon, aria: "Night map: moonlight tales" },
  ];
  return (
    <div role="radiogroup" aria-label="Map mode" className={`flex rounded-full border-[1.5px] p-[3px] ${night ? "border-cream/35" : "border-ink"}`}>
      {opts.map(({ n, label, Icon, aria }) => {
        const on = night === n;
        return (
          <button
            key={label}
            type="button"
            role="radio"
            aria-checked={on}
            aria-label={aria}
            onClick={() => {
              if (!on) sfx.whoosh();
              setNight(n);
            }}
            className={`relative flex min-h-[32px] items-center gap-[5px] rounded-full px-[11px] text-[12px] font-semibold ${
              on ? (night ? "text-ink" : "text-cream") : night ? "text-cream" : "text-ink"
            }`}
          >
            {on && <motion.span layoutId="daynight" transition={snappy} className={`absolute inset-0 rounded-full ${night ? "bg-cream" : "bg-ink"}`} />}
            <span className="relative flex items-center gap-[5px]">
              <Icon size={14} weight="light" />
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function HomeMap({ night, setNight, statuses, selected, onSelect, cowries, streak, stamped, completed, onOpenLesson, onGo }: Props) {
  const place = PLACES.find((p) => p.id === selected) ?? PLACES[0];
  const status = statuses[place.id] ?? place.status;
  const guide = guideById(place.guide);
  const tale = TALES[place.culture];
  const road = ROADS.find((r) => r.place === place.id);
  const next = road ? nextLesson(road.id, completed) : null;
  const roadCount = road ? lessonsForRoad(road.id).filter((l) => completed.includes(l.id)).length : 0;

  const prefs = useSoundPrefs();
  useEffect(() => {
    if (night && prefs.ambience) ambience.start();
    else ambience.stop();
  }, [night, prefs.ambience]);
  useEffect(
    () => () => {
      ambience.stop();
      stopSpeaking();
    },
    [],
  );

  const fg = night ? "text-cream" : "text-ink";
  const pill = night ? "border-cream/40 text-cream" : "border-ink bg-paper text-ink";

  return (
    <motion.div
      animate={{ backgroundColor: night ? "#141B36" : "#F1E7CF" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`relative flex h-full flex-col overflow-hidden ${fg}`}
    >
      <AnimatePresence>
        {night && (
          <motion.svg
            key="stars"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="pointer-events-none absolute inset-x-0 top-0 h-[520px] w-full"
          >
            {STARS.map(([x, y, r, o], i) => (
              <circle key={i} cx={`${x}%`} cy={y} r={r} fill="var(--color-cream)" opacity={o} />
            ))}
          </motion.svg>
        )}
      </AnimatePresence>

      <div className="no-scrollbar relative flex min-h-0 flex-1 flex-col overflow-y-auto">
      <header className="relative flex items-center justify-between px-4 pt-[52px]">
        <span className="flex items-center gap-2">
          <Emblem name="esu" size={24} color={night ? "var(--color-gold)" : "var(--color-brick)"} bg="transparent" rough={1.2} speckle={false} />
          <span className="t-display-wide text-[27px] leading-none">ọ̀nà</span>
        </span>
        <div className="flex gap-1.5">
          <span className={`flex items-center gap-[5px] rounded-full border-[1.5px] py-[5px] pl-2 pr-[11px] text-[13px] font-semibold tabular-nums ${pill}`} aria-label={`${streak} day streak`}>
            <Fire size={15} weight="fill" className={night ? "text-gold" : "text-brick"} />
            {streak}
          </span>
          <span className={`flex items-center gap-[5px] rounded-full border-[1.5px] py-[5px] pl-2 pr-[11px] text-[13px] font-semibold tabular-nums ${pill}`} aria-label={`${cowries} cowries`}>
            <Cowrie size={15} fill={night ? "var(--color-gold)" : "var(--color-paper)"} />
            {cowries}
          </span>
        </div>
      </header>

      <div className="relative flex items-end justify-between px-4 pt-4">
        <h1 className="leading-[0.86]">
          <span className="t-display block text-[min(50px,13cqw)]">Your</span>
          <span className={`t-serif block text-[min(50px,13cqw)] leading-[0.95] ${night ? "text-gold" : "text-brick"}`}>Nigeria</span>
        </h1>
        <div className="flex flex-col items-end gap-2.5 pb-1">
          <DayNightToggle night={night} setNight={setNight} />
          <Mono className={`tabular-nums ${night ? "text-cream/70" : ""}`}>
            {String(stamped).padStart(2, "0")} / {TOTAL_PLACES} stamped
          </Mono>
        </div>
      </div>

      <div className="relative min-h-[210px] flex-1">
        <div className="absolute inset-0 px-3 pb-2 pt-3">
          <NigeriaMap fill night={night} statuses={statuses} selected={selected} onSelect={onSelect} />
        </div>
      </div>

      <section className={`torn-top relative shrink-0 px-[18px] pb-4 pt-[22px] ${night ? "bg-night-2" : "bg-paper"}`} aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${place.id}-${night}-${status}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0, transition: snappy }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.12 } }}
          >
            {night ? (
              tale ? (
                <SheetBody
                  emblem={<Emblem name={tale.teller} size={54} disc color="var(--color-night)" bg="var(--color-gold)" rough={1.6} speckle={false} />}
                  kicker={<Mono className="text-gold">Àlọ́ · moonlight tale</Mono>}
                  meta={<Mono className="text-cream/60">{tale.minutes} min</Mono>}
                  title={tale.title}
                  sub={tale.told}
                  night
                  text={tale.text}
                  action={<ListenButton key={place.culture} text={`${tale.title}. ${tale.telling}`} voice={tale.voice} />}
                />
              ) : (
                <EmptySheet
                  night
                  title={`No tale from ${place.name} yet`}
                  text={`Àlọ́ for ${place.people} country arrives with its region’s release. Try a Yorùbá, Igbo or Hausa town tonight.`}
                />
              )
            ) : status === "hidden" ? (
              <EmptySheet
                title={`${place.name} is still hidden`}
                text={`“${place.title}” opens when ${place.people} country arrives. Keep walking the roads you have.`}
              />
            ) : (
              <SheetBody
                emblem={<Emblem name={guide.emblem} size={54} disc color={guide.tone.fg} bg={guide.tone.bg} rough={1.6} speckle={false} />}
                kicker={
                  <Mono className={status === "done" ? "text-forest" : "text-brick"}>
                    {status === "done" ? "Stamped" : road ? `${status === "active" ? "Today’s road" : "Open road"} · ${roadCount} / 5` : "Coming later"}
                  </Mono>
                }
                meta={<Mono>{place.people}</Mono>}
                title={place.title}
                sub={`${place.name}, ${place.state}`}
                text={place.blurb}
                action={
                  road && next && status !== "done" ? (
                    <PrimaryButton onClick={() => onOpenLesson(next.id)}>
                      {roadCount === 0 ? "Start the road" : `Lesson ${next.n}: ${next.title.join(" ")}`}
                      <span className="flex items-center gap-2.5">
                        <Mono className="text-gold">{next.minutes} min</Mono>
                        <KeyCap>
                          <ArrowRight size={18} weight="light" />
                        </KeyCap>
                      </span>
                    </PrimaryButton>
                  ) : status === "done" ? (
                    <PrimaryButton onClick={() => onGo(place.id === "ife" ? "artifact" : "stamps")}>
                      {place.id === "ife" ? "Hold the Ifẹ̀ head" : "See your stamp"}
                      <KeyCap>
                        <ArrowRight size={18} weight="light" />
                      </KeyCap>
                    </PrimaryButton>
                  ) : (
                    <div className="flex h-[58px] items-center gap-3 rounded-[14px] border-[1.5px] border-dashed border-ink/40 px-4 text-[14px] text-muted">
                      <LockSimple size={18} weight="light" />
                      {`${place.people} lessons arrive in a later release`}
                    </div>
                  )
                }
              />
            )}
          </motion.div>
        </AnimatePresence>
      </section>
      </div>

      <TabBar active="map" onGo={onGo} dark={night} />
    </motion.div>
  );
}

function ListenButton({ text, voice }: { text: string; voice: GuideId }) {
  const { playing, toggle, blocked, available } = useSpeaker(text, voice);
  return (
    <div>
      <PrimaryButton tone="night" onClick={toggle} aria-pressed={playing}>
        {playing ? "Stop the tale" : "Listen by moonlight"}
        <span className="flex items-center gap-2.5">
          {playing && <Waveform bars={10} height={16} playing className="text-ink" />}
          <KeyCap tone="night">{playing ? <Pause size={14} weight="fill" /> : <Play size={14} weight="fill" />}</KeyCap>
        </span>
      </PrimaryButton>
      {(blocked || !available) && (
        <p role="status" className="mt-2 text-center text-[12px] text-cream/70">
          {blocked ? "Turn on guide voices in Me to hear the tale." : "Voices are off. Turn them on in Me."}
        </p>
      )}
    </div>
  );
}

function SheetBody({
  emblem,
  kicker,
  meta,
  title,
  sub,
  text,
  action,
  night = false,
}: {
  emblem: React.ReactNode;
  kicker: React.ReactNode;
  meta: React.ReactNode;
  title: string;
  sub: string;
  text: string;
  action: React.ReactNode;
  night?: boolean;
}) {
  return (
    <>
      <div className="flex items-start gap-3">
        <div className="shrink-0">{emblem}</div>
        <div className="min-w-0 flex-1">
          <div className="flex justify-between">
            {kicker}
            {meta}
          </div>
          <div className="t-display mt-[5px] text-[min(34px,9cqw)]">{title}</div>
          <div className={`t-serif mt-0.5 text-[16px] ${night ? "text-cream/70" : "text-muted"}`}>{sub}</div>
        </div>
      </div>
      <p className="mt-3 min-h-[40px] text-[14px] leading-[1.42]">{text}</p>
      <div className="mt-3.5">{action}</div>
    </>
  );
}

function EmptySheet({ title, text, night = false }: { title: string; text: string; night?: boolean }) {
  return (
    <div className="flex min-h-[190px] flex-col justify-center gap-3">
      <div className="flex items-center gap-3">
        <span className={`flex size-[54px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-dashed ${night ? "border-cream/40 text-gold" : "border-ink/40 text-muted"}`}>
          <LockSimple size={22} weight="light" />
        </span>
        <span className="t-display text-[30px]">{title}</span>
      </div>
      <p className={`text-[14px] leading-[1.45] ${night ? "text-cream/80" : "text-muted"}`}>{text}</p>
    </div>
  );
}

// Deterministic star field: [x%, y, r, opacity]
const STARS: [number, number, number, number][] = Array.from({ length: 80 }, (_, i) => {
  const a = Math.sin(i * 12.9898) * 43758.5453;
  const b = Math.sin(i * 78.233) * 12345.6789;
  const fx = a - Math.floor(a);
  const fy = b - Math.floor(b);
  return [Math.round(fx * 1000) / 10, Math.round(fy * 520), [0.6, 0.8, 1, 1.3][i % 4], [0.3, 0.5, 0.8][i % 3]];
});
