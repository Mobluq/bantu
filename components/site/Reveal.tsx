"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const FLUID = [0.32, 0.72, 0, 1] as const;

/** Heavy fade-up on viewport entry (IntersectionObserver via whileInView). */
export function Reveal({ children, delay = 0, className = "", as = "div" }: { children: ReactNode; delay?: number; className?: string; as?: "div" | "li" | "section" }) {
  const M = as === "li" ? motion.li : as === "section" ? motion.section : motion.div;
  return (
    <M
      className={className}
      initial={{ opacity: 0, y: 64, filter: "blur(12px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, ease: FLUID, delay }}
    >
      {children}
    </M>
  );
}
