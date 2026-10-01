"use client";

import { ArrowCounterClockwise, ArrowRight, Moon, MusicNotes, SpeakerHigh, Stamp, X } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { guideById, type GuideId } from "@/lib/ona/data";
import { roadById } from "@/lib/ona/roads";
import { setPref, sfx, speechAvailable } from "@/lib/ona/sound";
import { TabBar } from "../TabBar";
import { SpeakButton, useSoundPrefs } from "../Speak";
import { Cowrie, Emblem, Mono, snappy } from "../primitives";
import { MAX_LIVES, type SavedWord, type Screen } from "../state";

function Toggle({ label, hint, on, onChange, Icon }: { label: string; hint: string; on: boolean; onChange: (v: boolean) => void; Icon: typeof SpeakerHigh }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => {
        onChange(!on);
        if (!on) sfx.tap();
      }}
      className="flex w-full items-center gap-3 py-3 text-left"
    >
      <Icon size={22} weight={on ? "fill" : "light"} className={on ? "text-brick" : "text-muted"} />
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-bold">{label}</span>
        <span className="block text-[12.5px] leading-[1.35] text-muted">{hint}</span>
      </span>
      <span className={`relative h-[30px] w-[50px] shrink-0 rounded-full transition-colors ${on ? "bg-forest" : "bg-ink/20"}`}>
        <motion.span layout transition={snappy} className={`absolute top-[3px] size-6 rounded-full bg-paper shadow ${on ? "right-[3px]" : "left-[3px]"}`} />
      </span>
    </button>
  );
}

export function Me({
  guide,
  cowries,
  streak,
  stamps,
  lessons,
  lives,
  saved,
  onRemoveWord,
  onAsk,
  onGo,
  onReset,
}: {
  guide: GuideId;
  cowries: number;
  streak: number;
  stamps: number;
  lessons: number;
  lives: number;
  saved: SavedWord[];
  onRemoveWord: (w: SavedWord) => void;
  onAsk: () => void;
  onGo: (s: Screen) => void;
  onReset: () => void;
}) {
  const g = guideById(guide);
  const prefs = useSoundPrefs();
  const [confirm, setConfirm] = useState(false);
  const stats = [
    { k: "Day streak", v: streak },
    { k: "Cowries", v: cowries },
    { k: "Stamps", v: stamps },
    { k: "Lessons", v: lessons },
  ];
  return (
    <div className="flex h-full flex-col bg-cream text-ink">
      <div className="no-scrollbar flex-1 overflow-y-auto px-5 pb-10 pt-14">
        <div className="flex flex-wrap justify-between gap-x-3 gap-y-1">
          <Mono>Traveller’s notebook</Mono>
          <Mono className="text-brick">Walking with {g.name}</Mono>
        </div>
        <h1 className="mt-3 leading-[0.86]">
          <span className="t-display block text-[min(64px,17cqw)]">Your</span>
          <span className="t-serif block text-[min(62px,16.5cqw)] text-brick">notebook</span>
        </h1>
        <dl className="mt-6 grid grid-cols-2 border-y-2 border-ink">
          {stats.map((s, i) => (
            <div key={s.k} className={`py-3.5 ${i % 2 ? "border-l border-ink/20 pl-3.5" : ""} ${i > 1 ? "border-t border-ink/20" : ""}`}>
              <dt className="t-mono text-[9.5px] text-muted">{s.k}</dt>
              <dd className="t-display-wide mt-1 text-[38px] tabular-nums">{s.v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-3 flex items-center gap-1.5" aria-label={`${lives} of ${MAX_LIVES} lesson cowries`}>
          {Array.from({ length: MAX_LIVES }, (_, i) => (
            <span key={i} className={i < lives ? "" : "opacity-25"}>
              <Cowrie size={18} />
            </span>
          ))}
          <Mono className="ml-1.5 text-[9.5px] text-muted">{lives < MAX_LIVES ? "One returns every 15 min" : "Cowries full"}</Mono>
        </div>

        <button type="button" onClick={() => onGo("stamps")} className="mt-6 flex w-full items-center gap-3 rounded-[20px] bg-forest p-4 text-left text-gold">
          <Stamp size={28} weight="fill" />
          <span className="min-w-0 flex-1">
            <span className="t-display block text-[26px] leading-none">Stamp book</span>
            <span className="mt-1 block text-[13px] text-cream/85">{stamps} stamps from the roads you have walked</span>
          </span>
          <ArrowRight size={20} weight="light" />
        </button>

        <section aria-labelledby="saved-h" className="mt-9">
          <div className="flex items-baseline justify-between">
            <h2 id="saved-h" className="t-display text-[32px]">
              Saved words
            </h2>
            <Mono className="text-muted">{saved.length}</Mono>
          </div>
          {saved.length === 0 ? (
            <div className="mt-3 flex flex-col items-start gap-4 rounded-[20px] border-[1.5px] border-dashed border-ink/35 p-5">
              <Emblem name="keeper" size={64} rough={1.8} />
              <p className="max-w-[32ch] text-[14px] leading-[1.45] text-muted">
                Tap the bookmark beside any word in a lesson and it lands here, ready to hear again.
              </p>
              <button type="button" onClick={() => onGo("learn")} className="flex items-center gap-2 text-[13px] font-semibold underline underline-offset-[3px]">
                <Cowrie size={18} /> Find words in a lesson
              </button>
            </div>
          ) : (
            <ul className="mt-2 border-t-2 border-ink">
              <AnimatePresence initial={false}>
                {saved.map((w) => (
                  <motion.li
                    key={w.term}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={snappy}
                    className="overflow-hidden border-b border-ink/15"
                  >
                    <div className="flex items-center gap-3 py-3">
                      <SpeakButton text={w.term} guide={roadById(w.road).guide} label={`“${w.term}”`} size={34} />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[18px] font-extrabold">{w.term}</div>
                        <div className="text-[13px] leading-[1.35] text-muted">{w.meaning}</div>
                      </div>
                      <Mono className="hidden text-[9px] text-muted min-[360px]:block">{roadById(w.road).people}</Mono>
                      <button type="button" onClick={() => onRemoveWord(w)} aria-label={`Remove ${w.term}`} className="flex size-10 shrink-0 items-center justify-center text-muted">
                        <X size={18} weight="light" />
                      </button>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </section>

        <section aria-labelledby="sound-h" className="mt-9">
          <h2 id="sound-h" className="t-display text-[32px]">
            Sound
          </h2>
          <div className="mt-2 divide-y divide-ink/15 border-y-2 border-ink">
            <Toggle Icon={MusicNotes} label="Drums and effects" hint="Talking drum, cowries, stamps" on={prefs.sfx} onChange={(v) => setPref("sfx", v)} />
            <Toggle
              Icon={SpeakerHigh}
              label="Guide voices"
              hint={speechAvailable() ? "Guides read lessons and tales aloud" : "This device has no speech voice"}
              on={prefs.voice}
              onChange={(v) => setPref("voice", v)}
            />
            <Toggle Icon={Moon} label="Night ambience" hint="Crickets and wind on the Àlọ́ map" on={prefs.ambience} onChange={(v) => setPref("ambience", v)} />
          </div>
        </section>

        <motion.button
          type="button"
          onClick={onAsk}
          whileTap={{ scale: 0.98 }}
          transition={snappy}
          className="mt-8 flex w-full items-center gap-3 rounded-[20px] p-3 text-left"
          style={{ background: g.tone.bg, color: g.tone.fg }}
        >
          <Emblem name={g.emblem} size={44} color={g.tone.fg} bg={g.tone.bg} rough={1.4} speckle={false} />
          <span className="flex-1 text-[15px] font-bold">Talk to {g.name}</span>
        </motion.button>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {confirm ? (
            <>
              <span className="text-[13px] font-semibold">Erase all progress?</span>
              <button type="button" onClick={onReset} className="rounded-full bg-brick px-3.5 py-2 text-[13px] font-bold text-cream">
                Erase
              </button>
              <button type="button" onClick={() => setConfirm(false)} className="rounded-full px-3.5 py-2 text-[13px] font-semibold ring-1 ring-ink/25">
                Keep
              </button>
            </>
          ) : (
            <button type="button" onClick={() => setConfirm(true)} className="flex min-h-10 items-center gap-2 text-[13px] font-semibold underline underline-offset-[3px]">
              <ArrowCounterClockwise size={16} weight="light" />
              Restart the prototype
            </button>
          )}
        </div>
      </div>
      <TabBar active="me" onGo={onGo} />
    </div>
  );
}
