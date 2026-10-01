"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { Emblem } from "@/components/ona/primitives";

const FLUID = [0.32, 0.72, 0, 1] as const;
const LINKS = [
  { href: "#prototype", label: "Prototype", n: "01" },
  { href: "#chapters", label: "Chapters", n: "03" },
  { href: "#guides", label: "The guides", n: "04" },
  { href: "#map", label: "The map", n: "05" },
  { href: "#guardrails", label: "Guardrails", n: "07" },
];

export function IslandNav() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-40 hidden justify-center pt-6 lg:flex">
        <nav
          aria-label="Site"
          className="pointer-events-auto flex w-max items-center gap-2 rounded-full bg-paper/70 p-1.5 pl-4 shadow-[0_20px_40px_-24px_rgb(30_20_12_/_0.35)] ring-1 ring-ink/10 backdrop-blur-xl"
        >
          <a href="#top" className="flex items-center gap-2 pr-3" aria-label="ọ̀nà, back to top">
            <Emblem name="esu" size={22} rough={1} speckle={false} bg="transparent" />
            <span className="t-display-wide text-[22px] leading-none">ọ̀nà</span>
          </a>
          <span className="t-mono hidden px-3 text-[10px] text-muted xl:inline">A living almanac of Nigeria</span>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="relative z-50 flex size-11 items-center justify-center rounded-full bg-ink/[0.06] transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-ink/10"
          >
            <span
              className={`absolute h-[1.5px] w-[18px] bg-ink transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${open ? "rotate-45" : "-translate-y-[4px]"}`}
            />
            <span
              className={`absolute h-[1.5px] w-[18px] bg-ink transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${open ? "-rotate-45" : "translate-y-[4px]"}`}
            />
          </button>
          <a
            href="#prototype"
            className="group flex items-center gap-3 rounded-full bg-ink py-1.5 pl-5 pr-1.5 text-[14px] font-semibold text-cream transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]"
          >
            Try the prototype
            <span className="flex size-8 items-center justify-center rounded-full bg-gold text-ink transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-[1px] group-hover:translate-x-1 group-hover:scale-105">
              <ArrowUpRight size={16} weight="light" />
            </span>
          </a>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4, ease: FLUID, delay: 0.15 } }}
            transition={{ duration: 0.6, ease: FLUID }}
            className="fixed inset-0 z-30 flex items-center bg-cream/80 backdrop-blur-3xl"
          >
            <div className="mx-auto grid w-full max-w-[1400px] grid-cols-[1fr_auto] items-end gap-16 px-12">
              <ul className="flex flex-col">
                {LINKS.map((l, i) => (
                  <li key={l.href} className="overflow-hidden border-t border-ink/10 last:border-b">
                    <motion.a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      initial={{ y: 48, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 24, opacity: 0, transition: { duration: 0.3, ease: FLUID } }}
                      transition={{ duration: 0.8, ease: FLUID, delay: 0.1 + i * 0.05 }}
                      className="group flex items-baseline gap-8 py-4"
                    >
                      <span className="t-mono w-8 text-[11px] text-brick">{l.n}</span>
                      <span className="t-display text-[88px] transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-3">
                        {l.label}
                      </span>
                    </motion.a>
                  </li>
                ))}
              </ul>
              <motion.div
                initial={{ opacity: 0, rotate: -30, scale: 0.9 }}
                animate={{ opacity: 1, rotate: -8, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: FLUID, delay: 0.25 }}
              >
                <Emblem name="esu" size={340} rough={2.6} />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
