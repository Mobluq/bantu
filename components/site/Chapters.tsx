"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Emblem } from "@/components/ona/primitives";
import { STAMPS, guideById } from "@/lib/ona/data";
import { ROADS, lessonsForRoad } from "@/lib/ona/roads";

function ChapterCard({ i }: { i: number }) {
  const r = ROADS[i];
  const g = guideById(r.guide);
  const s = STAMPS.find((x) => x.id === r.stamp)!;
  const lessons = lessonsForRoad(r.id);
  const [first, ...rest] = r.name.split(" ");
  const light = g.tone.bg === "var(--color-ochre)" || g.tone.bg === "var(--color-clay)";
  return (
    <article
      className={`relative flex h-full w-full shrink-0 flex-col justify-between overflow-hidden rounded-[32px] p-8 lg:w-[min(1080px,82vw)] lg:p-12 ${light ? "ht" : "ht-light graph-light"}`}
      style={{ background: g.tone.bg, color: light ? "var(--color-ink)" : "var(--color-cream)" }}
    >
      <div className="flex items-start justify-between gap-6">
        <span className="t-mono text-[11px]">
          Chapter {String(i + 1).padStart(2, "0")} / {String(ROADS.length).padStart(2, "0")} · {r.people}
        </span>
        <span className="t-mono text-[11px] opacity-80">5 lessons · ~18 min</span>
      </div>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-end">
        <div>
          <h3 className="leading-[0.84]">
            <span className="t-display block text-[clamp(64px,8vw,132px)]">{first}</span>
            <span className="t-serif block text-[clamp(60px,7.6vw,124px)]" style={{ color: g.tone.fg }}>
              {rest.join(" ")}
            </span>
          </h3>
          <p className="mt-6 max-w-[40ch] text-[16px] leading-relaxed opacity-90">{r.blurb}</p>
        </div>
        <ol className="flex flex-col">
          {lessons.map((l) => (
            <li key={l.id} className="flex items-baseline gap-4 border-t border-current/25 py-3">
              <span className="t-mono w-6 text-[11px] opacity-70">{String(l.n).padStart(2, "0")}</span>
              <span className="flex-1 text-[17px] font-semibold">{l.title.join(" ")}</span>
              <span className="t-mono text-[10px] opacity-70">{l.topic}</span>
            </li>
          ))}
          <li className="flex items-center gap-4 border-y border-current/25 py-3">
            <span className="t-mono w-6 text-[11px] opacity-70">→</span>
            <span className="flex-1 text-[17px] font-semibold">The gift: {s.title} stamp</span>
          </li>
        </ol>
      </div>
      <div className="sticker pointer-events-none absolute right-8 top-16 hidden rotate-[8deg] lg:block">
        <Emblem name={g.emblem} size={150} disc color={g.tone.fg} bg={g.tone.bg} rough={2} />
      </div>
    </article>
  );
}

/** The three roads as chapters: a horizontal journey on desktop, a stack on phones. */
export function Chapters() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0.05, 0.95], ["0%", `-${(ROADS.length - 1) * 100 / ROADS.length}%`]);
  return (
    <>
      <div ref={ref} className="relative hidden lg:block" style={{ height: `${ROADS.length * 100}vh` }}>
        <div className="sticky top-0 flex h-[100dvh] items-center overflow-hidden">
          <motion.div style={{ x }} className="flex h-[min(78dvh,720px)] gap-8 pl-12" >
            {ROADS.map((_, i) => (
              <ChapterCard key={i} i={i} />
            ))}
          </motion.div>
        </div>
      </div>
      <div className="flex flex-col gap-6 px-4 lg:hidden">
        {ROADS.map((_, i) => (
          <div key={i} className="min-h-[640px]">
            <ChapterCard i={i} />
          </div>
        ))}
      </div>
    </>
  );
}
