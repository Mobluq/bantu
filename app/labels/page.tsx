import type { Metadata } from "next";
import QRCode from "qrcode";
import { EXHIBITION, GALLERIES, OBJECTS, galleryById } from "@/lib/ona/museum";
import { Emblem } from "@/components/ona/primitives";
import { PrintButton } from "./PrintButton";

export const metadata: Metadata = {
  title: "ọ̀nà · Wall labels",
  description: "Printable wall labels with QR codes for every object in the ọ̀nà exhibition.",
};

/** Where printed codes point. Set NEXT_PUBLIC_SITE_URL for a museum's own domain. */
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bantu-12vq.vercel.app";

export default async function Labels() {
  const codes = await Promise.all(
    OBJECTS.map((o) =>
      QRCode.toString(`${SITE}/visit/${o.code}`, { type: "svg", margin: 0, errorCorrectionLevel: "M", color: { dark: "#1e140c", light: "#00000000" } }),
    ),
  );
  return (
    <main className="min-h-[100dvh] bg-cream px-4 py-10 text-ink print:bg-white print:p-0">
      <div className="mx-auto max-w-[1100px]">
        <header className="flex flex-wrap items-end justify-between gap-4 print:hidden">
          <div>
            <p className="t-mono text-[11px] text-brick">For museum staff</p>
            <h1 className="t-display text-[clamp(40px,8vw,72px)] leading-[0.9]">Wall labels</h1>
            <p className="mt-2 max-w-[60ch] text-[15px] leading-[1.5] text-muted">
              One label per object, {OBJECTS.length} in all, grouped by room. Each QR code opens the object in the ọ̀nà app at {SITE.replace(/^https?:\/\//, "")}/visit/…, and the big number works with the in-app keypad for visitors without a camera. Print on A4, then cut along the borders.
            </p>
          </div>
          <PrintButton />
        </header>

        {GALLERIES.map((g) => (
          <section key={g.id} className="mt-10 break-inside-avoid print:mt-0 print:break-before-page">
            <h2 className="t-display text-[32px] leading-none print:text-[22pt]">
              Room {g.n} · {g.name}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 print:grid-cols-2 print:gap-3">
              {OBJECTS.map((o, idx) => ({ o, idx }))
                .filter(({ o }) => o.gallery === g.id)
                .map(({ o, idx }) => (
                  <article key={o.id} className="flex break-inside-avoid gap-4 rounded-[14px] border-[1.5px] border-ink bg-paper p-4 print:rounded-none print:bg-white">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="t-display-wide text-[46px] leading-[0.8] tabular-nums">{o.code}</div>
                        <span className="flex size-[46px] shrink-0 items-center justify-center rounded-[10px]" style={{ background: o.tone.bg }}>
                          <Emblem name={o.emblem} size={34} color={o.tone.fg} bg={o.tone.bg} rough={0} speckle={false} />
                        </span>
                      </div>
                      <h3 className="mt-2 text-[18px] font-extrabold leading-tight">{o.title}</h3>
                      {o.local && <p className="t-serif text-[16px] text-brick">{o.local}</p>}
                      <p className="t-mono mt-1 text-[9.5px] leading-[1.6] text-muted">
                        {o.culture} · {o.place}
                        <br />
                        {o.date} · {o.material}
                      </p>
                      <p className="mt-2 text-[12.5px] leading-[1.45]">{o.label}</p>
                    </div>
                    <div className="flex w-[108px] shrink-0 flex-col items-center justify-between gap-2">
                      <div className="size-[108px]" role="img" aria-label={`QR code for object ${o.code}`} dangerouslySetInnerHTML={{ __html: codes[idx] }} />
                      <p className="text-center text-[10px] font-semibold leading-tight">
                        Scan, or type <span className="font-extrabold">{o.code}</span> in the ọ̀nà app
                      </p>
                    </div>
                  </article>
                ))}
            </div>
          </section>
        ))}

        <footer className="mt-12 text-[12px] text-muted print:hidden">
          {EXHIBITION.title} · {EXHIBITION.venue} · Room {galleryById("g1").n}–{GALLERIES.length}
        </footer>
      </div>
    </main>
  );
}
