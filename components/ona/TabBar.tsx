"use client";

import { motion } from "framer-motion";
import { BookOpen, MapTrifold, Stamp, SunHorizon, UserCircle } from "@phosphor-icons/react";
import type { Screen } from "./state";
import { snappy } from "./primitives";

const TABS = [
  { id: "map", label: "Map", Icon: MapTrifold },
  { id: "lesson", label: "Learn", Icon: BookOpen },
  { id: "stamps", label: "Stamps", Icon: Stamp },
  { id: "almanac", label: "Almanac", Icon: SunHorizon },
  { id: "me", label: "Me", Icon: UserCircle },
] as const satisfies readonly { id: Screen; label: string; Icon: unknown }[];

export function TabBar({ active, onGo, dark = false }: { active: Screen; onGo: (s: Screen) => void; dark?: boolean }) {
  return (
    <nav
      aria-label="Main"
      className={`relative z-10 flex shrink-0 border-t px-1.5 pb-[max(env(safe-area-inset-bottom),18px)] ${
        dark ? "border-cream/15 bg-night" : "border-ink/15 bg-paper"
      }`}
    >
      {TABS.map(({ id, label, Icon }) => {
        const on = id === active;
        const color = on ? (dark ? "text-gold" : "text-brick") : dark ? "text-cream/80" : "text-muted";
        return (
          <motion.button
            key={id}
            type="button"
            onClick={() => onGo(id)}
            whileTap={{ scale: 0.94 }}
            transition={snappy}
            aria-current={on ? "page" : undefined}
            className={`relative flex min-h-[52px] flex-1 flex-col items-center gap-1 pt-2.5 ${color}`}
          >
            <Icon size={23} weight={on ? "fill" : "bold"} />
            <span className={`text-[11px] ${on ? "font-bold" : "font-medium"}`}>{label}</span>
            {on && (
              <motion.span
                layoutId={dark ? "tab-dot-night" : "tab-dot"}
                transition={snappy}
                className={`absolute bottom-[-8px] size-[5px] rounded-full ${dark ? "bg-gold" : "bg-brick"}`}
              />
            )}
          </motion.button>
        );
      })}
    </nav>
  );
}
