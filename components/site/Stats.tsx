"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function Count({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.4, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, to]);
  return (
    <span ref={ref} className="tabular-nums">
      {n}
    </span>
  );
}

export function Stats({ items }: { items: { n: number; label: string; tag: string }[] }) {
  return (
    <dl className="grid grid-cols-2 border-t-2 border-ink lg:grid-cols-5">
      {items.map((it, i) => (
        <div key={it.label} className={`border-b border-ink/15 py-6 lg:border-b-0 lg:py-8 ${i % 2 ? "border-l pl-5" : ""} lg:border-l lg:pl-6 ${i === 0 ? "lg:border-l-0 lg:pl-0" : ""} border-ink/15`}>
          <dt className="t-mono text-[10.5px] text-brick">[{it.tag}]</dt>
          <dd className="mt-2">
            <span className="t-display-wide block text-[clamp(56px,6vw,96px)] leading-[0.85]">
              <Count to={it.n} />
            </span>
            <span className="mt-2 block text-[14px] text-muted">{it.label}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
