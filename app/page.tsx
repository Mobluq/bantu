import { OnaApp } from "@/components/ona/OnaApp";

const NOTES = [
  ["Guides", "Deities and culture heroes from each people walk you through their own country. A secular Keeper tells the same facts."],
  ["Map", "Real borders and rivers. The Niger and Benue cut the country into the three cultural regions the roads follow."],
  ["Àlọ́ night", "After dark the map turns indigo and lessons give way to moonlight tales."],
  ["Stamps", "Each finished road earns a perforated stamp. Some open 3D objects, some open almanac entries."],
];

export default function Page() {
  return (
    <main className="mx-auto grid min-h-[100dvh] max-w-[1400px] lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-12 lg:px-12 lg:py-8">
      <section className="hidden flex-col justify-between py-6 lg:flex">
        <div>
          <p className="t-mono text-[11px] text-brick">Interactive prototype · v0.1</p>
          <h1 className="mt-5">
            <span className="t-display block text-[clamp(80px,8vw,136px)]">Walk</span>
            <span className="t-serif -mt-1 block text-[clamp(76px,7.6vw,128px)] leading-[0.95] text-brick">Nigeria</span>
            <span className="t-display block text-[clamp(80px,8vw,136px)]">with its gods.</span>
          </h1>
          <p className="mt-8 max-w-[52ch] text-[17px] leading-relaxed text-muted">
            ọ̀nà is a map-first almanac of Nigeria’s peoples. Lessons are short, every fact is reviewed, and the guides are the figures of
            each tradition, speaking in their own languages. Tap through the phone: pick a guide, walk Ọ̀ṣun’s road, answer the elder, and earn
            the Òṣogbo stamp.
          </p>
        </div>
        <dl className="mt-10 grid max-w-[640px] grid-cols-2 gap-x-10">
          {NOTES.map(([k, v]) => (
            <div key={k} className="border-t border-ink/20 py-4">
              <dt className="t-mono text-[10.5px] text-brick">{k}</dt>
              <dd className="mt-1.5 text-[14.5px] leading-[1.5]">{v}</dd>
            </div>
          ))}
        </dl>
      </section>
      <div className="flex w-full items-center justify-center lg:w-auto">
        <OnaApp />
      </div>
    </main>
  );
}
