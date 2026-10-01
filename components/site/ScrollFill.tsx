"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";

function Word({ word, i, n, progress, accent }: { word: string; i: number; n: number; progress: MotionValue<number>; accent: boolean }) {
  const start = i / n;
  const opacity = useTransform(progress, [start, start + 1 / n], [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className={accent ? "t-serif text-brick" : undefined}>
      {word}{" "}
    </motion.span>
  );
}

/** A statement whose words ink in as it scrolls through the viewport. Words in `accents` take the serif cut. */
export function ScrollFill({ text, accents = [] }: { text: string; accents?: string[] }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className="t-display text-[clamp(44px,6.4vw,104px)] leading-[0.92]" aria-label={text}>
      {words.map((w, i) => (
        <Word key={i} word={w} i={i} n={words.length} progress={scrollYProgress} accent={accents.includes(w.replace(/[.,]/g, ""))} />
      ))}
    </p>
  );
}
