"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Confetti } from "@phosphor-icons/react";
import { useEffect } from "react";
import { objectById, tourById } from "@/lib/ona/museum";
import { sfx } from "@/lib/ona/sound";
import { KeyCap, Mono, PrimaryButton, spring } from "../primitives";
import { FloorPlan, ObjectRow } from "../museum/parts";

type Props = {
  id: string;
  progress: number;
  seen: string[];
  onBack: () => void;
  onStart: (at: number) => void;
  onEnd: () => void;
};

export function TourScreen({ id, progress, seen, onBack, onStart, onEnd }: Props) {
  const t = tourById(id)!;
  const finished = progress >= t.stops.length;
  const started = progress >= 0 && !finished;
  useEffect(() => {
    if (finished) sfx.complete();
  }, [finished]);

  return (
    <div className="flex h-full flex-col bg-cream text-ink">
      <div className="no-scrollbar flex-1 overflow-y-auto">
        <header className="ht-light relative overflow-hidden px-5 pb-6 pt-safe" style={{ background: t.tone.bg, color: t.tone.fg }}>
          <button type="button" onClick={onBack} aria-label="Back" className="-ml-3.5 flex size-11 items-center justify-center">
            <ArrowLeft size={22} weight="light" />
          </button>
          <Mono className="mt-2 block text-[10px] opacity-80">
            Guided tour · {t.minutes} min · {t.stops.length} stops · {t.audience}
          </Mono>
          <h1 className="t-display mt-1 text-[min(58px,15cqw,6.7cqh)] leading-[0.88]">{t.name}</h1>
          <p className="mt-2 max-w-[40ch] text-[14.5px] leading-[1.45] opacity-90">{t.intro}</p>
        </header>

        {finished && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={spring} className="mx-5 mt-5 flex items-center gap-3 rounded-[20px] bg-forest p-4 text-gold">
            <Confetti size={34} weight="fill" />
            <div>
              <div className="t-display text-[26px] leading-none">Tour complete</div>
              <p className="mt-1 text-[13.5px] text-cream/85">You saw all {t.stops.length} stops. Ask a guide about anything that caught your eye.</p>
            </div>
          </motion.div>
        )}

        <div className="mx-5 mt-5 rounded-[20px] bg-paper p-3 ring-1 ring-ink/10">
          <FloorPlan route={t.stops} seen={seen} current={started ? progress : undefined} />
        </div>

        <section className="px-5 pt-5" aria-labelledby="stops-h">
          <h2 id="stops-h" className="t-display text-[min(30px,8cqw)]">
            Stops
          </h2>
          <div className="mt-2">
            {t.stops.map((s, i) => (
              <ObjectRow key={s} o={objectById(s)!} index={i + 1} seen={seen.includes(s)} onOpen={() => onStart(i)} />
            ))}
          </div>
        </section>
        <div className="h-6" />
      </div>
      <div className="border-t border-ink/15 bg-paper px-4 pb-[max(env(safe-area-inset-bottom),16px)] pt-3">
        <PrimaryButton onClick={() => (finished ? onEnd() : onStart(started ? progress : 0))}>
          {finished ? "Back to the museum" : started ? `Continue at stop ${progress + 1}` : "Start the tour"}
          <KeyCap>
            <ArrowRight size={18} weight="light" />
          </KeyCap>
        </PrimaryButton>
      </div>
    </div>
  );
}
