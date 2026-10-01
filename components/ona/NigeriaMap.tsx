"use client";

import { memo, useId } from "react";
import { motion } from "framer-motion";
import { BENUE, LABEL_XY, LAKE_CHAD, LAND, MAP_H, MAP_W, MINOR_RIVERS, NIGER, PLACE_XY, REGION_EAST, REGION_NORTH, REGION_WEST } from "@/lib/ona/geo";
import { PLACES, type PlaceStatus } from "@/lib/ona/data";
import { snappy } from "./primitives";

const DAY = {
  fills: ["#E7B04B", "#DB8360", "#86A773"],
  stroke: "var(--color-ink)",
  shadow: "var(--color-ink)",
  river: "var(--color-indigo)",
  label: "var(--color-ink)",
  labelMuted: "var(--color-muted)",
  pattern: "rgb(30 20 12 / 0.28)",
  active: "var(--color-brick)",
  done: "var(--color-forest)",
  halo: "var(--color-paper)",
};
const NIGHT = {
  fills: ["#2B3A6E", "#3A2F5E", "#22424D"],
  stroke: "var(--color-gold)",
  shadow: "#070B1C",
  river: "#7C9BE8",
  label: "var(--color-cream)",
  labelMuted: "rgb(241 231 207 / 0.55)",
  pattern: "rgb(240 190 60 / 0.35)",
  active: "var(--color-gold)",
  done: "var(--color-gold)",
  halo: "var(--color-night)",
};

type Props = {
  night: boolean;
  statuses: Record<string, PlaceStatus>;
  selected: string;
  onSelect: (id: string) => void;
  /** Fill the parent's height (the map is letterboxed inside it). */
  fill?: boolean;
};

/** Illustrated Nigeria: three river-cut regions, real Natural Earth outline, tappable places. */
export const NigeriaMap = memo(function NigeriaMap({ night, statuses, selected, onSelect, fill = false }: Props) {
  const c = night ? NIGHT : DAY;
  const uid = useId().replace(/:/g, "");
  const k = `${uid}${night ? "n" : "d"}`;
  return (
    <svg
      viewBox={`-4 -4 ${MAP_W + 10} ${MAP_H + 12}`}
      className={`block w-full overflow-visible ${fill ? "h-full" : "h-auto"}`}
      role="group"
      aria-label="Map of Nigeria, split by the Niger and Benue rivers"
    >
      <defs>
        <clipPath id={`clip-${k}`}>
          <path d={LAND} />
        </clipPath>
        <pattern id={`dots-${k}`} width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1.1" fill={c.pattern} />
        </pattern>
        <pattern id={`lines-${k}`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <line x1="0" y1="0" x2="0" y2="7" stroke={c.pattern} strokeWidth="1.6" />
        </pattern>
        <pattern id={`circ-${k}`} width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="6" cy="6" r="3.2" fill="none" stroke={c.pattern} strokeWidth="1.3" />
        </pattern>
      </defs>

      <path d={LAND} fill={c.shadow} transform="translate(4 5)" />
      <g clipPath={`url(#clip-${k})`}>
        <path d={REGION_NORTH} fill={c.fills[0]} />
        <path d={REGION_NORTH} fill={`url(#dots-${k})`} />
        <path d={REGION_WEST} fill={c.fills[1]} />
        <path d={REGION_WEST} fill={`url(#lines-${k})`} />
        <path d={REGION_EAST} fill={c.fills[2]} />
        <path d={REGION_EAST} fill={`url(#circ-${k})`} />
      </g>
      <path d={LAND} fill="none" stroke={c.stroke} strokeWidth="2" strokeLinejoin="round" />
      <path d={LAKE_CHAD} fill={c.river} stroke={c.stroke} strokeWidth="1" />
      <path d={MINOR_RIVERS} fill="none" stroke={c.river} strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
      <motion.path
        d={NIGER}
        fill="none"
        stroke={c.river}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.path
        d={BENUE}
        fill="none"
        stroke={c.river}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      />

      {(["north", "west", "east"] as const).map((r) => (
        <text key={r} x={LABEL_XY[r][0]} y={LABEL_XY[r][1]} fontFamily="var(--font-jetbrains)" fontSize="8" letterSpacing="2.5" fill={c.labelMuted}>
          {r.toUpperCase()}
        </text>
      ))}
      <text
        x={LABEL_XY.nigerLabel[0]}
        y={LABEL_XY.nigerLabel[1]}
        fontFamily="var(--font-instrument)"
        fontStyle="italic"
        fontSize="11"
        fill={c.river}
        transform={`rotate(-38 ${LABEL_XY.nigerLabel[0]} ${LABEL_XY.nigerLabel[1]})`}
      >
        Niger
      </text>
      <text
        x={LABEL_XY.benueLabel[0]}
        y={LABEL_XY.benueLabel[1]}
        fontFamily="var(--font-instrument)"
        fontStyle="italic"
        fontSize="11"
        fill={c.river}
        transform={`rotate(-24 ${LABEL_XY.benueLabel[0]} ${LABEL_XY.benueLabel[1]})`}
      >
        Benue
      </text>

      {PLACES.map((p) => {
        const [x, y] = PLACE_XY[p.id];
        const status = statuses[p.id] ?? p.status;
        const isSel = selected === p.id;
        const labelFill = status === "hidden" ? c.labelMuted : status === "active" ? c.active : c.label;
        return (
          <g
            key={p.id}
            role="button"
            tabIndex={0}
            aria-label={`${p.name}, ${status === "done" ? "stamped" : status === "active" ? "today’s road" : status === "open" ? "open" : "still hidden"}`}
            aria-pressed={isSel}
            onClick={() => onSelect(p.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(p.id);
              }
            }}
            className="cursor-pointer outline-none [&:focus-visible>circle:first-child]:stroke-[3]"
          >
            {/* generous invisible hit area */}
            <circle cx={x} cy={y} r={p.id === "ife" || p.id === "osogbo" ? 7 : 12} fill="transparent" stroke={isSel ? c.label : "transparent"} strokeWidth="1.2" strokeDasharray="2 2" />
            {status === "active" && (
              <>
                <circle cx={x} cy={y} r="7" fill={c.active} opacity="0.5" className="animate-pin" />
                <circle cx={x} cy={y} r="7" fill={c.active} stroke={c.halo} strokeWidth="2" />
                <circle cx={x} cy={y} r="2.4" fill={c.halo} />
              </>
            )}
            {status === "done" && (
              <rect x={x - 4.5} y={y - 4.5} width="9" height="9" fill={c.done} stroke={c.halo} strokeWidth="1.5" transform={`rotate(45 ${x} ${y})`} />
            )}
            {status === "open" && <circle cx={x} cy={y} r="4.5" fill="var(--color-paper)" stroke={night ? c.active : c.label} strokeWidth="1.8" />}
            {status === "hidden" && <circle cx={x} cy={y} r="3.6" fill="none" stroke={c.labelMuted} strokeWidth="1.3" strokeDasharray="1.6 1.6" />}
            <motion.text
              x={x + p.label.dx}
              y={y + p.label.dy}
              textAnchor={p.label.anchor}
              fontFamily="var(--font-archivo)"
              fontWeight={status === "active" || isSel ? 750 : status === "hidden" ? 500 : 620}
              fontSize={status === "active" ? 11.5 : 9.5}
              fill={labelFill}
              stroke={status === "active" ? c.halo : "none"}
              strokeWidth={status === "active" ? 3 : 0}
              paintOrder="stroke"
              animate={{ opacity: 1 }}
              transition={snappy}
            >
              {p.name}
            </motion.text>
          </g>
        );
      })}
    </svg>
  );
});
