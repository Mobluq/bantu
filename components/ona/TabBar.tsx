"use client";

import { motion } from "framer-motion";
import { Bank, BookOpen, MapTrifold, SunHorizon, UserCircle } from "@phosphor-icons/react";
import type { Screen } from "./state";
import { snappy } from "./primitives";
import { sfx } from "@/lib/ona/sound";

const TABS = [
  { id: "map", label: "Map", Icon: MapTrifold },
  { id: "learn", label: "Learn", Icon: BookOpen },
  { id: "museum", label: "Museum", Icon: Bank },
  { id: "almanac", label: "Almanac", Icon: SunHorizon },
  { id: "me", label: "Me", Icon: UserCircle },
] as const satisfies readonly { id: Screen; label: string; Icon: unknown }[];

/** A floating island: dark pill on light screens, light glass on the night map. The active tab is a sliding pill. */
export function TabBar({ active, onGo, dark = false }: { active: Screen; onGo: (s: Screen) => void; dark?: boolean }) {
  return (
    <nav aria-label="Main" className="relative z-10 shrink-0 px-3 pb-[max(env(safe-area-inset-bottom),10px)] pt-2">
      <div className={`rounded-full p-[4px] ${dark ? "bg-cream/10 ring-1 ring-cream/15" : "bg-ink/[0.06] ring-1 ring-ink/10"}`}>
        <div
          className={`flex rounded-full p-[4px] ${
            dark ? "bg-night-2 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.08)]" : "bg-ink shadow-[inset_0_1px_0_rgb(255_255_255_/_0.12),0_18px_36px_-20px_rgb(30_20_12_/_0.6)]"
          }`}
        >
          {TABS.map(({ id, label, Icon }) => {
            const on = id === active;
            return (
              <motion.button
                key={id}
                type="button"
                onClick={() => {
                  if (!on) sfx.tap();
                  onGo(id);
                }}
                whileTap={{ scale: 0.94 }}
                transition={snappy}
                aria-current={on ? "page" : undefined}
                className={`relative flex min-h-[50px] min-w-0 flex-1 flex-col items-center justify-center gap-[3px] rounded-full transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                  on ? "text-ink" : "text-cream/70"
                }`}
              >
                {on && <motion.span layoutId={dark ? "tab-pill-night" : "tab-pill"} transition={snappy} className="absolute inset-0 rounded-full bg-gold" />}
                <Icon size={21} weight={on ? "fill" : "light"} className="relative" />
                <span className={`relative max-w-full truncate px-1 text-[10px] leading-none ${on ? "font-bold" : "font-medium"}`}>{label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
