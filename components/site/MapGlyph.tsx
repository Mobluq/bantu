import { LAND, MAP_H, MAP_W, REGION_EAST, REGION_NORTH, REGION_WEST } from "@/lib/ona/geo";

/** Nigeria in three cut-paper regions, sized to sit inside a headline pill. */
export function MapGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox={`-4 -4 ${MAP_W + 10} ${MAP_H + 12}`} className={className} aria-hidden="true">
      <defs>
        <clipPath id="glyph-clip">
          <path d={LAND} />
        </clipPath>
      </defs>
      <path d={LAND} fill="var(--color-ink)" transform="translate(5 6)" />
      <g clipPath="url(#glyph-clip)">
        <path d={REGION_NORTH} fill="#E7B04B" />
        <path d={REGION_WEST} fill="#DB8360" />
        <path d={REGION_EAST} fill="#86A773" />
      </g>
      <path d={LAND} fill="none" stroke="var(--color-ink)" strokeWidth="3" />
    </svg>
  );
}
