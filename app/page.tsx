import { ArrowUpRight, Check } from "@phosphor-icons/react/dist/ssr";
import { OnaApp } from "@/components/ona/OnaApp";
import { Emblem } from "@/components/ona/primitives";
import { Bezel, Eyebrow } from "@/components/site/Bezel";
import { IslandNav } from "@/components/site/IslandNav";
import { MapShowcase } from "@/components/site/MapShowcase";
import { Reveal } from "@/components/site/Reveal";
import { Loader } from "@/components/site/Loader";
import { MapGlyph } from "@/components/site/MapGlyph";
import { ScrollFill } from "@/components/site/ScrollFill";
import { Chapters } from "@/components/site/Chapters";
import { Stats } from "@/components/site/Stats";
import { SectionIndex } from "@/components/site/SectionIndex";
import { Cowrie } from "@/components/ona/primitives";
import { GUIDES } from "@/lib/ona/data";
import { ENTRIES, FESTIVALS } from "@/lib/ona/almanac";
import { LESSONS, ROADS } from "@/lib/ona/roads";

const EASE = "ease-[cubic-bezier(0.32,0.72,0,1)]";

function PillLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className={`group inline-flex items-center gap-3 rounded-full bg-ink py-1.5 pl-6 pr-1.5 text-[15px] font-semibold text-cream transition-transform duration-500 ${EASE} active:scale-[0.98]`}
    >
      {children}
      <span
        className={`flex size-9 items-center justify-center rounded-full bg-gold text-ink transition-transform duration-500 ${EASE} group-hover:-translate-y-[1px] group-hover:translate-x-1 group-hover:scale-105`}
      >
        <ArrowUpRight size={17} weight="light" />
      </span>
    </a>
  );
}

const BENTO: Record<string, string> = {
  esu: "min-h-[360px] lg:col-span-7 lg:row-span-2",
  osun: "lg:col-span-5",
  ala: "lg:col-span-5",
  ogun: "lg:col-span-3",
  bayajidda: "lg:col-span-3",
  woyengi: "lg:col-span-3",
  keeper: "lg:col-span-3",
};

// Bento reading order: hero card spans two rows, two cards stack beside it, four share the last row.
const BENTO_ORDER = ["esu", "osun", "ala", "ogun", "bayajidda", "woyengi", "keeper"] as const;

const GUARDRAILS = [
  ["Advisors sign every entry", "Each region’s content is reviewed by a named scholar or practitioner from that tradition before it ships. Their name sits on the page."],
  ["Sacred stays sacred", "Rites closed to outsiders, such as parts of Egúngún and Orò, are described only as far as their communities share them in public."],
  ["Gods are optional", "The Keeper teaches the same facts with no deity guides. Families choose; nothing is locked behind belief."],
  ["Sources on every page", "Almanac entries list their sources. Contested stories say they are contested, and name the versions."],
];

export default function Page() {
  return (
    <>
      <Loader />
      <IslandNav />
      <SectionIndex />
      <main id="top">
        {/* 01 — Hero: inline-image headline over a visible column grid; collage around the live phone */}
        <section id="prototype" className="relative scroll-mt-8 overflow-hidden lg:min-h-[100dvh]">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 mx-auto hidden max-w-[1400px] grid-cols-12 px-12 lg:grid">
            {Array.from({ length: 12 }, (_, i) => (
              <span key={i} className="border-l border-ink/[0.07] last:border-r" />
            ))}
          </div>
          <div className="relative mx-auto grid max-w-[1400px] lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-10 lg:px-12 lg:pb-16 lg:pt-28">
            <div className="order-2 flex flex-col justify-center px-4 py-20 lg:order-1 lg:px-0 lg:py-0">
              <Reveal>
                <div className="flex items-center justify-between gap-4">
                  <Eyebrow>(01) Interactive prototype · v0.3</Eyebrow>
                  <span className="t-mono hidden text-[10.5px] text-muted xl:inline">[ 9.08°N · 8.68°E ]</span>
                </div>
                <h1 className="mt-8 text-[clamp(60px,7.4vw,118px)]">
                  <span className="flex items-center gap-[0.18em]">
                    <span className="t-display">Walk</span>
                    <span className="inline-flex h-[0.8em] w-[1.9em] items-center justify-center overflow-hidden rounded-full bg-paper ring-1 ring-ink/15">
                      <MapGlyph className="h-[0.7em] w-auto" />
                    </span>
                  </span>
                  <span className="t-serif -mt-[0.06em] block leading-[0.95] text-brick">Nigeria</span>
                  <span className="flex items-center gap-[0.18em]">
                    <span className="t-display">with its</span>
                    <span className="inline-flex h-[0.8em] w-[1.5em] items-center justify-center overflow-hidden rounded-full bg-brick">
                      <span className="block animate-[spin_24s_linear_infinite]">
                        <Emblem name="esu" size={84} color="var(--color-cream)" bg="var(--color-brick)" rough={1.6} speckle={false} />
                      </span>
                    </span>
                  </span>
                  <span className="t-display block">gods.</span>
                </h1>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="mt-8 max-w-[52ch] text-[17px] leading-relaxed text-muted">
                  ọ̀nà is a map-first almanac of Nigeria’s peoples. Three roads are open: Yorùbá, Igbo and Hausa, five lessons each. Pick a guide,
                  walk a road, ask the guide anything, and earn the stamp at the end.
                </p>
                <div className="mt-10 flex flex-wrap items-center gap-3">
                  <PillLink href="/app">Open the app full screen</PillLink>
                </div>
                <p className="mt-4 max-w-[46ch] text-[13.5px] leading-relaxed text-muted">
                  On iPhone, open it in Safari, tap Share, then Add to Home Screen. On Android, Chrome offers Install app.
                </p>
              </Reveal>
            </div>
            <div className="relative order-1 flex w-full items-center justify-center lg:order-2 lg:w-auto">
              {/* collage: torn paper, tape, stickers (desktop only, never over the phone screen) */}
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
                <div className="torn-bottom ht-light absolute -right-16 top-14 h-[68%] w-[72%] rotate-[4deg] bg-brick" />
                <div className="sticker absolute -left-40 top-[20%] z-10 -rotate-[8deg]">
                  <div className="stamp-edge w-[132px] bg-paper">
                    <div className="flex h-[160px] flex-col items-center justify-between bg-gold p-2.5 text-brick outline outline-[1.5px] -outline-offset-[5px] outline-ink">
                      <span className="t-mono self-start text-[8px] tracking-[0.18em]">Nigeria</span>
                      <Emblem name="osun" size={76} color="var(--color-brick)" bg="var(--color-gold)" rough={1.6} />
                      <span className="self-start text-[10px] font-extrabold">Ọ̀ṣun-Òṣogbo Grove</span>
                    </div>
                  </div>
                </div>
                <div className="sticker absolute -left-20 bottom-[18%] z-10 -rotate-[14deg]">
                  <Cowrie size={72} />
                </div>
                <div className="sticker absolute -right-10 bottom-[6%] z-10 rotate-[12deg]">
                  <Emblem name="ijapa" size={110} disc color="var(--color-night)" bg="var(--color-gold)" rough={1.6} />
                </div>
              </div>
              <div className="relative w-full lg:w-auto">
                <OnaApp jumpNav={false} />
                <div aria-hidden="true" className="band-kente pointer-events-none absolute -left-8 -top-1 z-10 hidden h-6 w-32 -rotate-[28deg] opacity-95 shadow-[0_4px_8px_rgb(30_20_12_/_0.25)] lg:block" />
              </div>
            </div>
          </div>
        </section>

        {/* 02 — Statement: words ink in on scroll; real counts beneath */}
        <section id="statement" className="mx-auto max-w-[1400px] scroll-mt-24 px-4 py-24 lg:px-12 lg:py-40">
          <Reveal>
            <Eyebrow>(02) Why</Eyebrow>
          </Reveal>
          <div className="mt-8 max-w-[1180px]">
            <ScrollFill
              text="Nigeria holds hundreds of peoples, more than five hundred languages, and gods older than its borders. ọ̀nà lets them teach you in their own voices, one road at a time."
              accents={["gods", "voices"]}
            />
          </div>
          <div className="mt-20">
            <Stats
              items={[
                { n: ROADS.length, label: "roads open: Yorùbá, Igbo, Hausa", tag: "2.01" },
                { n: LESSONS.length, label: "lessons, five per road", tag: "2.02" },
                { n: ENTRIES.length, label: "almanac entries", tag: "2.03" },
                { n: FESTIVALS.length, label: "festivals in the calendar", tag: "2.04" },
                { n: 36, label: "states on the map", tag: "2.05" },
              ]}
            />
          </div>
        </section>

        {/* 03 — Chapters: the roads as a horizontal journey */}
        <section id="chapters" className="scroll-mt-0 pb-24 lg:pb-0">
          <div className="mx-auto max-w-[1400px] px-4 pb-10 lg:px-12">
            <Reveal className="grid gap-8 lg:grid-cols-2 lg:items-end">
              <div>
                <Eyebrow>(03) Chapters</Eyebrow>
                <h2 className="mt-6">
                  <span className="t-display block text-[clamp(56px,6vw,104px)]">Three roads,</span>
                  <span className="t-serif block text-[clamp(54px,5.8vw,100px)] leading-[0.95] text-brick">a gift at each end.</span>
                </h2>
              </div>
              <p className="max-w-[46ch] text-[17px] leading-relaxed text-muted lg:justify-self-end">
                Each road is five short lessons: sound and greetings first, then manners, place and story. Finish all five and the road’s stamp
                lands in your passport.
              </p>
            </Reveal>
          </div>
          <Chapters />
        </section>

        {/* 02 — Guides: asymmetrical bento */}
        <section id="guides" className="mx-auto max-w-[1400px] scroll-mt-24 px-4 py-24 lg:px-12 lg:pb-24 lg:pt-40">
          <Reveal className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
            <div>
              <Eyebrow>(04) The guides</Eyebrow>
              <h2 className="mt-6">
                <span className="t-display block text-[clamp(56px,6vw,104px)]">Each people,</span>
                <span className="t-serif block text-[clamp(54px,5.8vw,100px)] leading-[0.95] text-brick">its own voice.</span>
              </h2>
            </div>
            <p className="max-w-[46ch] text-[17px] leading-relaxed text-muted lg:justify-self-end">
              Òrìṣà for Yorùbá roads, Ala for Igbo towns, Bayajidda for the Hausa states, Woyengi for the creeks. Each is drawn as a stamp-cut
              emblem from one family of strokes, so the cast reads as a single print run.
            </p>
          </Reveal>

          <div className="mt-16 grid grid-cols-1 gap-6 lg:auto-rows-[260px] lg:grid-cols-12 lg:gap-5">
            {BENTO_ORDER.map((id, i) => {
              const g = GUIDES.find((x) => x.id === id)!;
              const big = g.id === "esu";
              const light = g.id === "keeper";
              return (
                <Reveal key={g.id} delay={0.06 * i} className={`${BENTO[g.id]} min-h-[260px]`}>
                  <Bezel
                    className="h-full"
                    radius={32}
                    pad={6}
                    coreClassName={`group flex h-full flex-col justify-between p-7 ${light ? "" : "ht-light"}`}
                    coreStyle={{ background: g.tone.bg, color: g.tone.fg }}
                  >
                    <div
                      className={`pointer-events-none absolute transition-transform duration-1000 ${EASE} group-hover:rotate-[8deg] group-hover:scale-105 ${
                        big ? "-right-16 -top-10" : "-right-8 -top-6"
                      }`}
                    >
                      {big ? (
                        <>
                          <span className="hidden lg:block">
                            <Emblem name={g.emblem} size={420} color={g.tone.fg} bg={g.tone.bg} rough={3} />
                          </span>
                          <span className="block opacity-90 lg:hidden">
                            <Emblem name={g.emblem} size={190} color={g.tone.fg} bg={g.tone.bg} rough={2.2} />
                          </span>
                        </>
                      ) : (
                        <Emblem name={g.emblem} size={170} color={g.tone.fg} bg={g.tone.bg} rough={2} />
                      )}
                    </div>
                    <span className="t-mono relative text-[10px] opacity-80">
                      {String(i + 1).padStart(2, "0")} · {g.people}
                    </span>
                    <div className="relative">
                      <div className={`t-display ${big ? "text-[clamp(72px,8vw,128px)]" : "text-[48px]"}`}>{g.name}</div>
                      <div className={`t-serif mt-1 ${big ? "text-[28px]" : "text-[19px]"}`}>{g.domain}</div>
                      {big && <p className="mt-5 max-w-[40ch] text-[15px] leading-relaxed opacity-90">“{g.greeting}”</p>}
                    </div>
                  </Bezel>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* 03 — Map: editorial split */}
        <section id="map" className="mx-auto grid max-w-[1400px] scroll-mt-24 gap-12 px-4 py-24 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-20 lg:px-12 lg:py-40">
          <Reveal>
            <Eyebrow>(05) The map</Eyebrow>
            <h2 className="mt-6">
              <span className="t-display block text-[clamp(56px,5.6vw,96px)]">Two rivers,</span>
              <span className="t-serif block text-[clamp(54px,5.4vw,92px)] leading-[0.95] text-brick">three countries.</span>
            </h2>
            <p className="mt-8 max-w-[44ch] text-[17px] leading-relaxed text-muted">
              Borders and rivers are drawn from Natural Earth data, not guessed. The Niger and the Benue meet at Lokoja and cut the land into
              the north, the west and the east, the same way the roads of the app are released.
            </p>
            <dl className="mt-10 grid max-w-[440px] grid-cols-2 gap-x-8">
              {[
                ["Day", "Places, lessons and stamps."],
                ["Àlọ́ night", "Moonlight tales replace lessons after dark."],
                ["Stamped", "Roads you have finished."],
                ["Still hidden", "Regions waiting for their release."],
              ].map(([k, v]) => (
                <div key={k} className="border-t border-ink/15 py-4">
                  <dt className="t-mono text-[10.5px] text-brick">{k}</dt>
                  <dd className="mt-1.5 text-[14.5px] leading-[1.5]">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal delay={0.1}>
            <MapShowcase />
          </Reveal>
        </section>

        {/* 04 — Lessons: z-axis cascade */}
        <section id="lessons" className="mx-auto max-w-[1400px] scroll-mt-24 px-4 py-24 lg:px-12 lg:py-40">
          <Reveal className="max-w-[760px]">
            <Eyebrow>(06) A lesson in three beats</Eyebrow>
            <h2 className="mt-6">
              <span className="t-display text-[clamp(56px,6vw,104px)]">Hear, choose, </span>
              <span className="t-serif text-[clamp(54px,5.8vw,100px)] text-brick">stamp.</span>
            </h2>
          </Reveal>

          <ol className="mt-16 flex flex-col gap-6 md:mt-24 md:flex-row md:items-start md:gap-0">
            <Reveal as="li" className="md:z-[1] md:w-[38%] md:-rotate-2">
              <Bezel radius={32} pad={6} coreClassName="bg-paper p-8">
                <span className="t-mono text-[10.5px] text-brick">01 · Hear the guide</span>
                <div className="mt-6 flex items-start gap-3">
                  <Emblem name="osun" size={52} disc color="var(--color-gold)" bg="var(--color-forest)" rough={1.5} speckle={false} />
                  <p className="flex-1 rounded-[4px_20px_20px_20px] bg-cream px-4 py-3 text-[15px] leading-[1.45] ring-1 ring-ink/10">
                    It is morning in Òṣogbo. Your friend’s grandmother opens the door. What do you say?
                  </p>
                </div>
                <p className="mt-6 text-[14.5px] leading-relaxed text-muted">Every prompt is voiced by a native speaker, in the guide’s own language first.</p>
              </Bezel>
            </Reveal>
            <Reveal as="li" delay={0.1} className="md:z-[2] md:-ml-6 md:mt-24 md:w-[35%] md:rotate-[3deg]">
              <Bezel radius={32} pad={6} coreClassName="bg-cream p-8">
                <span className="t-mono text-[10.5px] text-brick">02 · Choose</span>
                <div className="mt-6 flex items-center gap-3.5 rounded-2xl bg-paper px-4 py-3.5 shadow-[0_18px_30px_-20px_rgb(30_77_47_/_0.6)] ring-2 ring-forest">
                  <span className="flex size-9 items-center justify-center rounded-full bg-forest text-gold">
                    <Check size={18} weight="light" />
                  </span>
                  <span>
                    <span className="block text-[18px] font-bold">Ẹ káàárọ̀ mà</span>
                    <span className="block text-[13px] text-muted">“Good morning, ma”, then kneel or bow</span>
                  </span>
                </div>
                <p className="mt-6 text-[14.5px] leading-relaxed text-muted">Wrong answers explain themselves and cost a cowrie. Nothing is a trick question.</p>
              </Bezel>
            </Reveal>
            <Reveal as="li" delay={0.2} className="md:z-[3] md:ml-4 md:mt-4 md:w-[31%] md:-rotate-[1.5deg]">
              <Bezel radius={32} pad={6} coreClassName="ht-light bg-forest p-8 text-cream">
                <span className="t-mono text-[10.5px] text-gold">03 · Earn the stamp</span>
                <div className="mt-6 flex justify-center">
                  <div className="stamp-edge w-[150px] rotate-[-4deg] bg-paper">
                    <div className="flex h-[180px] flex-col items-center justify-between bg-gold p-3 text-brick outline outline-[1.5px] -outline-offset-[5px] outline-ink">
                      <span className="t-mono self-start text-[8.5px] tracking-[0.18em]">Nigeria</span>
                      <Emblem name="osun" size={92} color="var(--color-brick)" bg="var(--color-gold)" rough={1.8} />
                      <span className="self-start text-[11.5px] font-extrabold">Ọ̀ṣun-Òṣogbo Grove</span>
                    </div>
                  </div>
                </div>
                <p className="mt-6 text-[14.5px] leading-relaxed text-cream/80">Finished roads become perforated stamps that open almanac entries and 3D objects.</p>
              </Bezel>
            </Reveal>
          </ol>
        </section>

        {/* 05 — Guardrails: dark editorial list */}
        <section id="guardrails" className="scroll-mt-24 bg-ink text-cream">
          <div className="mx-auto max-w-[1400px] px-4 py-24 lg:px-12 lg:py-40">
            <Reveal className="grid gap-8 lg:grid-cols-2 lg:items-end">
              <div>
                <Eyebrow tone="dark">(07) Cultural guardrails</Eyebrow>
                <h2 className="mt-6">
                  <span className="t-display block text-[clamp(56px,6vw,104px)]">Living faiths,</span>
                  <span className="t-serif block text-[clamp(54px,5.8vw,100px)] leading-[0.95] text-gold">handled with care.</span>
                </h2>
              </div>
              <p className="max-w-[46ch] text-[17px] leading-relaxed text-cream/70 lg:justify-self-end">
                These are practised religions and living communities, not fantasy lore. The rules below ship with version one.
              </p>
            </Reveal>
            <ol className="mt-20 grid gap-x-16 lg:grid-cols-2">
              {GUARDRAILS.map(([t, d], i) => (
                <Reveal as="li" key={t} delay={0.06 * i} className="grid grid-cols-[72px_1fr] gap-4 border-t border-cream/15 py-10">
                  <span className="t-serif text-[56px] leading-[0.8] text-gold">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="t-display text-[38px]">{t}</h3>
                    <p className="mt-3 max-w-[48ch] text-[15.5px] leading-relaxed text-cream/70">{d}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        <footer className="overflow-hidden bg-brick text-cream ht-light">
          <div className="mx-auto max-w-[1400px] px-4 pb-10 pt-24 lg:px-12 lg:pt-32">
            <Reveal className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
              <span className="t-display-wide block text-[clamp(140px,22vw,340px)] leading-[0.78]">ọ̀nà</span>
              <div className="flex flex-col items-start gap-6 pb-6">
                <Emblem name="esu" size={120} color="var(--color-cream)" bg="var(--color-brick)" rough={2.4} />
                <PillLink href="#prototype">Back to the prototype</PillLink>
              </div>
            </Reveal>
            <div className="mt-16 flex flex-col justify-between gap-3 border-t border-cream/20 pt-6 sm:flex-row">
              <span className="t-mono text-[10.5px] text-cream/70">A living almanac of Nigeria · prototype v0.3</span>
              <span className="t-mono text-[10.5px] text-cream/70">Map data: Natural Earth (public domain)</span>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
