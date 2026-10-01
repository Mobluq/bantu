/**
 * The guides' offline mind: answers questions from everything the app knows
 * (almanac entries, stories, festivals, places, lesson words, moonlight tales),
 * in each guide's voice. Used whenever live chat is unavailable, so asking never fails.
 * It never invents facts: every sentence it says comes from the app's own content.
 */

import { ENTRIES, FESTIVALS, MONTHS, type Entry } from "./almanac";
import { GUIDES, PLACES, TALES, guideById, type GuideId } from "./data";
import { LESSONS, ROADS, type RoadId } from "./roads";

export const fold = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[’']/g, "");

type Doc = {
  id: string;
  /** Entry id or road id this fact belongs to, so a guide prefers its own. */
  owner: string;
  kind: "row" | "abroad" | "story" | "note" | "festival" | "place" | "word" | "fact" | "tale";
  /** Spoken form of the fact. */
  say: (self: boolean) => string;
  keys: string;
  title: string;
};

const STOP = new Set(
  "the a an and or of to in on at is are was were be been do does did you your yours me my mine i we us our it its this that these those what who whom which why how when where can could would should will tell about please there their them they he she his her with for from as by any some more most very just also into than then so if not no yes have has had get got know want like say said".split(" "),
);

const SYN: Record<string, string[]> = {
  color: ["colour", "colours"],
  colors: ["colour", "colours"],
  colour: ["colours"],
  wife: ["marries", "partner", "married", "wives"],
  husband: ["marries", "partner", "married"],
  married: ["marries", "partner"],
  eat: ["food", "receives", "offering", "kola", "yam"],
  food: ["receives", "offering", "kola", "yam", "eat"],
  offering: ["receives", "offerings"],
  offer: ["receives", "offering"],
  live: ["home", "shrine", "river", "grove"],
  home: ["shrine", "grove", "river", "town"],
  where: ["home", "shrine", "grove", "river", "place", "town"],
  symbol: ["symbols", "objects", "emblem", "sign"],
  symbols: ["symbol", "objects"],
  festival: ["festival", "feast", "celebrate", "celebration"],
  celebrate: ["festival", "feast"],
  america: ["brazil", "cuba", "haiti", "atlantic", "abroad", "diaspora"],
  diaspora: ["brazil", "cuba", "haiti", "atlantic", "abroad"],
  abroad: ["brazil", "cuba", "haiti", "atlantic"],
  devil: ["satan", "evil", "bible"],
  satan: ["devil", "evil", "bible"],
  thunder: ["lightning", "sango", "amadioha"],
  water: ["river", "sea", "ocean"],
  sea: ["ocean", "water", "olokun", "yemoja"],
  greet: ["greeting", "greetings", "morning", "elder"],
  greeting: ["greet", "morning", "elder"],
  hello: ["greet", "greeting"],
  thanks: ["thank", "thank you"],
  thank: ["thanks"],
  rules: ["taboo", "taboos", "law", "laws"],
  taboo: ["taboos", "rules", "forbidden"],
  days: ["day", "week", "market"],
  market: ["eke", "orie", "afo", "nkwo", "days"],
  iron: ["smith", "metal", "ogun"],
  king: ["oba", "emir", "ooni", "obi", "ruler", "kingdom"],
  queen: ["amina", "zazzau"],
  create: ["creation", "creator", "made"],
  made: ["creation", "create"],
  story: ["tale", "story"],
  tale: ["story", "tale"],
};

function tokens(s: string): string[] {
  return fold(s)
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 2 && !STOP.has(w))
    .map((w) => (w.length > 4 && w.endsWith("s") ? w.slice(0, -1) : w));
}

const roadOfGuide = (g: GuideId): RoadId | undefined => ROADS.find((r) => r.guide === g)?.id;

/* ───────── Build the knowledge base once ───────── */

function entryDocs(e: Entry): Doc[] {
  const out: Doc[] = [];
  const name = e.name;
  e.rows.forEach(([k, v], i) =>
    out.push({
      id: `${e.id}:row:${i}`,
      owner: e.id,
      kind: "row",
      title: k,
      keys: fold(`${name} ${e.full} ${e.people} ${k} ${v}`),
      say: (self) => (self ? `My ${k.toLowerCase()}: ${v}.` : `${name}’s ${k.toLowerCase()}: ${v}.`),
    }),
  );
  (e.abroad ?? []).forEach(([k, v], i) =>
    out.push({
      id: `${e.id}:abroad:${i}`,
      owner: e.id,
      kind: "abroad",
      title: k,
      keys: fold(`${name} atlantic abroad diaspora ${k} ${v}`),
      say: (self) => (/^(Brazil|Cuba|Haiti|Trinidad|USA|United States)/.test(k) ? `${self ? "Across the Atlantic I am known too. " : ""}In ${k}: ${v}.` : `${k}: ${v}.`),
    }),
  );
  if (e.story) {
    const st = e.story;
    out.push({
      id: `${e.id}:story`,
      owner: e.id,
      kind: "story",
      title: st.title,
      keys: fold(`${name} story tale ${st.title} ${st.body} ${st.moral ?? ""}`),
      say: () => `${st.title}. ${st.body}${st.moral ? ` ${st.moral}` : ""}`,
    });
  }
  if (e.note) {
    const n = e.note;
    out.push({
      id: `${e.id}:note`,
      owner: e.id,
      kind: "note",
      title: n.title,
      keys: fold(`${name} ${n.title} ${n.body}`),
      say: () => `${n.title} ${n.body}`,
    });
  }
  return out;
}

function buildDocs(): Doc[] {
  const docs: Doc[] = ENTRIES.flatMap(entryDocs);
  for (const f of FESTIVALS) {
    docs.push({
      id: `fest:${f.id}`,
      owner: f.people,
      kind: "festival",
      title: f.name,
      keys: fold(`festival feast celebrate when date month ${f.name} ${f.place} ${f.people} ${f.when} ${f.text} ${f.months.map((m) => MONTHS[m - 1]).join(" ")}`),
      say: () => `${f.name}, in ${f.place}: ${f.when}. ${f.text}${f.expected ? ` ${f.expected.map((e) => e.note).join("; ")}.` : ""}`,
    });
  }
  for (const p of PLACES) {
    if (!p.blurb) continue;
    docs.push({
      id: `place:${p.id}`,
      owner: p.culture,
      kind: "place",
      title: p.name,
      keys: fold(`place town city where ${p.name} ${p.state} ${p.people} ${p.title} ${p.blurb}`),
      say: () => `${p.name}, ${p.state}: ${p.title}. ${p.blurb}`,
    });
  }
  for (const l of LESSONS) {
    l.steps.forEach((st, i) => {
      if (st.kind === "fact") {
        docs.push({
          id: `${l.id}:fact:${i}`,
          owner: l.road,
          kind: "fact",
          title: st.title,
          keys: fold(`${st.title} ${st.body} ${(st.examples ?? []).map((e) => `${e.term} ${e.meaning}`).join(" ")} ${l.topic}`),
          say: () => `${st.title}${/[.!?]$/.test(st.title) ? "" : "."} ${st.body}${st.examples?.length ? ` ${st.examples.map((e) => `${e.term} means ${e.meaning}`).join("; ")}.` : ""}`,
        });
        for (const ex of st.examples ?? []) addWord(docs, l.road, ex.term, ex.meaning);
      }
      if (st.kind === "choose") {
        docs.push({ id: `${l.id}:why:${i}`, owner: l.road, kind: "fact", title: st.prompt, keys: fold(`${st.prompt} ${st.right} ${l.topic}`), say: () => st.right });
      }
      if (st.kind === "match") for (const [t, m] of st.pairs) addWord(docs, l.road, t, m);
      if (st.kind === "order") addWord(docs, l.road, st.words.join(" "), st.meaning);
    });
  }
  for (const [culture, t] of Object.entries(TALES)) {
    if (!t) continue;
    docs.push({
      id: `tale:${culture}`,
      owner: culture,
      kind: "tale",
      title: t.title,
      keys: fold(`tale story moonlight alo ${t.title} ${t.told} ${t.text}`),
      say: () => `${t.title}, ${t.told}. ${t.text}`,
    });
  }
  return docs;
}

function addWord(docs: Doc[], road: RoadId, term: string, meaning: string) {
  const id = `word:${road}:${fold(term)}`;
  if (docs.some((d) => d.id === id)) return;
  const lang = ROADS.find((r) => r.id === road)!.language;
  docs.push({
    id,
    owner: road,
    kind: "word",
    title: term,
    keys: fold(`say word mean language ${lang} ${term} ${meaning}`),
    say: () => `In ${lang}, “${term}” means ${meaning.replace(/^[“"]|[”"]$/g, "")}.`,
  });
}

let DOCS: Doc[] | null = null;
const docs = () => (DOCS ??= buildDocs());

/* ───────── Voice ───────── */

const VOICE: Partial<Record<GuideId, { open: string[]; thanks: string; hello: string; bye: string; unsure: string }>> = {
  esu: {
    open: ["Ha! A question from the crossroads.", "Listen closely, traveller.", "Every road has two sides. Here is one."],
    thanks: "Ẹ ṣé, traveller. Bring me another question; I carry messages both ways.",
    hello: "Ẹ kú àbọ̀! You stand at my crossroads. Ask me anything.",
    bye: "Ó dàbọ̀. Every road comes back through my crossroads.",
    unsure: "Even the messenger does not carry every message.",
  },
  osun: {
    open: ["Sit by the river with me.", "Gently, my child.", "Sweet water answers slowly."],
    thanks: "Ẹ ṣé. The river is glad you came.",
    hello: "Ẹ kú àbọ̀ to my grove. What would you like to know?",
    bye: "Ó dàbọ̀. Come back to the river soon.",
    unsure: "The river has not carried that story to me yet.",
  },
  ogun: {
    open: ["Straight to it, like a cutlass through bush.", "Hear it plainly.", "A smith wastes no strokes."],
    thanks: "Ẹ ṣé. Now, back to work.",
    hello: "Ẹ kú àbọ̀. Ask, and I will cut you a path to the answer.",
    bye: "Ó dàbọ̀. Keep your tools sharp.",
    unsure: "That path I have not cut yet.",
  },
  ala: {
    open: ["The land remembers.", "Listen, as the elders do.", "Kola first, then the answer."],
    thanks: "Daalụ. The land is pleased with good manners.",
    hello: "Nnọọ. Sit, and ask what you came to ask.",
    bye: "Ka ọ dị. Walk gently on the land.",
    unsure: "The land has not yet told me that.",
  },
  bayajidda: {
    open: ["Sit, traveller, and drink.", "From Daura, I tell you this.", "Listen, as they listened at the well."],
    thanks: "Na gode. You are welcome at the well.",
    hello: "Sannu! Barka da zuwa. What would you like to know?",
    bye: "Sai an jima. The well will be here.",
    unsure: "That story did not reach the well at Daura.",
  },
  woyengi: {
    open: ["Before you were born, you heard this.", "Listen, as the creeks listen.", "At the Creation Stone, I tell you this."],
    thanks: "You chose well to ask.",
    hello: "Welcome to the creeks. Ask, and I will answer what I know.",
    bye: "Go well. The water will carry you back.",
    unsure: "That was not among the lives I gave out.",
  },
  keeper: {
    open: ["From the almanac:", "Here is what the record says.", "The almanac has this."],
    thanks: "You’re welcome. Ask the almanac anything else.",
    hello: "Hello. I keep the almanac: gods, founders, festivals, words. Ask away.",
    bye: "Goodbye. The almanac stays open.",
    unsure: "The almanac has no entry on that yet.",
  },
};

const pick = <T,>(arr: T[], seed: string) => arr[[...seed].reduce((a, c) => a + c.charCodeAt(0), 0) % arr.length];

/* ───────── Answering ───────── */

export type MindReply = { text: string; used: string[]; suggestions: string[] };

function suggestionsFor(id: GuideId): string[] {
  const own = ENTRIES.find((e) => e.id === id);
  const road = roadOfGuide(id);
  const lang = road ? ROADS.find((r) => r.id === road)!.language : null;
  const s: string[] = [];
  if (own?.story) s.push("Tell me your story");
  if (own) s.push("What are your colours?");
  if (lang) s.push(`How do I say thank you in ${lang}?`);
  s.push("What festivals are this month?");
  if (!own) s.push("Who is Ṣàngó?", "Tell me a moonlight tale");
  return s.slice(0, 3);
}

/** Entries named in the question (by name, with or without tone marks). */
function namedEntries(q: string): Entry[] {
  return ENTRIES.filter((e) => {
    const n = fold(e.name);
    return new RegExp(`(^|[^a-z])${n.replace(/[-\s]+/g, "[-\\s]*")}([^a-z]|$)`).test(q);
  });
}

function overview(e: Entry, self: boolean): string {
  const rows = e.rows.slice(0, 3).map(([k, v]) => `${k}: ${v}.`).join(" ");
  if (self) return `I am ${e.full}, of the ${e.people}. ${rows}`;
  const rest = e.full.replace(new RegExp(`^${e.name},?\\s*`), "");
  const lead = rest === e.full ? `${e.name}: ${e.full}` : /^(of|who|the|from)\b/.test(rest) ? `${e.name}, ${rest}` : `${e.name} is ${rest}`;
  return `${lead}, of the ${e.people}. ${rows}`;
}

export function guideAnswer(id: GuideId, question: string, seen: string[] = []): MindReply {
  const g = guideById(id);
  const v = VOICE[id] ?? VOICE.keeper!;
  const q = fold(question).trim();
  const own = ENTRIES.find((e) => e.id === id);
  const road = roadOfGuide(id);
  const ownKeys = new Set([id, road ?? "", own?.people ?? "", g.people].filter(Boolean));
  const opener = pick(v.open, q);
  const reply = (text: string, used: string[] = []): MindReply => ({ text, used, suggestions: suggestionsFor(id) });

  if (!q) return reply(v.hello);

  // Small talk.
  if (/^(hi|hello|hey|good (morning|afternoon|evening)|bawo|kedu|sannu|nnoo|e kaaaro|e kaasan|ekaaro)\b/.test(q) && q.split(" ").length <= 4) return reply(v.hello);
  if (/^(thanks|thank you|thank u|e se|ese|daalu|na gode|nagode)\b/.test(q)) return reply(v.thanks);
  if (/^(bye|goodbye|see you|o daabo|odabo|sai an jima)\b/.test(q)) return reply(v.bye);

  // "Tell me more": the next unseen fact about the last subject.
  if (/^(more|tell me more|go on|continue|and then|what else|anything else)\b/.test(q) && seen.length) {
    const last = docs().find((d) => d.id === seen[seen.length - 1]);
    const next = last && docs().find((d) => d.owner === last.owner && !seen.includes(d.id) && d.kind !== "word");
    if (next) return reply(next.say(next.owner === id), [next.id]);
    return reply(`That is all I hold on it for now. ${v.unsure.replace(/\.$/, "")}, but the advisors are still writing.`);
  }

  // Who are you?
  if (/\b(who|what) (are|r) (you|u)\b|about yourself|introduce yourself|your name/.test(q)) {
    if (own) return reply(`${opener} ${overview(own, true)}`, own.rows.slice(0, 3).map((_, i) => `${own.id}:row:${i}`));
    return reply(`I am ${g.name}: ${g.domain}. My home is ${g.home.toLowerCase()}. ${g.greeting}`);
  }

  // How do I say X? / What does X mean?
  const sayM = q.match(/how (do|would|can) (i|you|we) say (.+?)( in (yoruba|igbo|hausa))?\??$/) ?? q.match(/what(?:s| is) (?:the word for )?(.+?) in (yoruba|igbo|hausa)\??$/);
  if (sayM) {
    const phrase = (sayM.length > 4 ? sayM[3] : sayM[1]).replace(/["“”]/g, "").trim();
    const langWanted = sayM[5] ?? sayM[2];
    const pool = docs().filter((d) => d.kind === "word" && (!langWanted || d.keys.includes(langWanted)) && (langWanted || !road || d.owner === road || true));
    const hits = pool
      .map((d) => ({ d, s: tokens(phrase).filter((t) => d.keys.includes(t)).length }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s || (a.d.owner === road ? -1 : 1));
    if (hits.length) return reply(`${opener} ${hits.slice(0, 2).map((h) => h.d.say(false)).join(" ")} Mind the tone marks: they change the meaning.`, hits.slice(0, 2).map((h) => h.d.id));
    return reply(`${v.unsure} The lessons teach greetings, thanks and respect words so far. Try asking how to say “good morning” or “thank you”.`);
  }
  const meanM = q.match(/what does (.+?) mean\??$/) ?? q.match(/meaning of (.+?)\??$/);
  if (meanM) {
    const term = meanM[1].replace(/["“”]/g, "").trim();
    const w = docs().find((d) => d.kind === "word" && fold(d.title) === term) ?? docs().find((d) => d.kind === "word" && fold(d.title).includes(term));
    if (w) return reply(w.say(false), [w.id]);
    const e = namedEntries(term)[0];
    if (e) return reply(overview(e, e.id === id), [`${e.id}:row:0`]);
  }

  // Festivals by month or "this month".
  if (/festival|feast|celebrat|holiday/.test(q)) {
    const monthIdx = MONTHS.findIndex((m) => q.includes(fold(m)));
    const m = monthIdx >= 0 ? monthIdx + 1 : /this month|now|today|soon/.test(q) ? new Date().getMonth() + 1 : null;
    if (m) {
      const fs = FESTIVALS.filter((f) => f.months.includes(m) || f.expected?.some((e) => e.month === m));
      if (!fs.length) return reply(`${opener} No fixed festival in the almanac falls in ${MONTHS[m - 1]}. Towns keep their own days, so ask locally.`);
      return reply(`${opener} In ${MONTHS[m - 1]}: ${fs.map((f) => `${f.name} (${f.place})`).join("; ")}. Open the festival calendar for each one.`, fs.map((f) => `fest:${f.id}`));
    }
  }

  // Someone else named: answer about them.
  const named = namedEntries(q).filter((e) => e.id !== id || /\b(you|your)\b/.test(q) === false);
  const aboutOther = named.find((e) => e.id !== id);

  // Story requests.
  if (/\b(story|stories|tale|tales|legend|myth)\b/.test(q)) {
    const target = aboutOther ?? own;
    if (target?.story && !seen.includes(`${target.id}:story`)) {
      const d = docs().find((x) => x.id === `${target.id}:story`)!;
      return reply(`${aboutOther ? `Of ${target.name} they tell this.` : opener} ${d.say(false)}${/version/i.test(d.say(false)) ? "" : " It is told in many versions."}`, [d.id]);
    }
    const tale = docs().find((d) => d.kind === "tale" && !seen.includes(d.id) && (d.owner === g.people.toLowerCase() || true));
    if (tale) return reply(`Here is a moonlight tale. ${tale.say(false)} Turn the map to Àlọ́ to hear it told in full.`, [tale.id]);
  }

  // General retrieval.
  const qt = tokens(question);
  const expanded = new Set(qt.flatMap((t) => [t, ...(SYN[t] ?? [])].map((x) => fold(x))));
  const focus = aboutOther?.id;
  // "you/your" questions are about this guide: only its own facts may answer.
  const aboutSelf = !aboutOther && /\b(you|your|yours|yourself)\b/.test(q);
  const scored = docs()
    .filter((d) => !seen.includes(d.id))
    .filter((d) => !aboutSelf || d.owner === id || (d.owner === road && d.kind !== "word"))
    .map((d) => {
      let s = 0;
      for (const t of expanded) if (d.keys.includes(t)) s += qt.includes(t) ? 1 : 0.5;
      if (fold(d.title) && qt.some((t) => fold(d.title).includes(t))) s += 0.75;
      if (focus) s += d.owner === focus ? 2 : -0.5;
      else if (ownKeys.has(d.owner)) s += 0.6;
      if (d.kind === "word" && !/say|word|mean|language|greet|thank/.test(q)) s -= 0.6;
      return { d, s };
    })
    .filter((x) => x.s >= 1)
    .sort((a, b) => b.s - a.s);

  if (aboutOther && (scored.length === 0 || /^(who|what) (is|was|are)\b/.test(q))) {
    return reply(`${opener} ${overview(aboutOther, false)} Open Nº ${aboutOther.number} in the almanac for the rest.`, aboutOther.rows.slice(0, 3).map((_, i) => `${aboutOther.id}:row:${i}`));
  }

  if (scored.length) {
    const top = scored[0];
    const second = scored[1] && scored[1].s >= top.s - 0.5 && scored[1].d.kind === top.d.kind && scored[1].d.owner === top.d.owner ? scored[1] : null;
    const parts = [top, second].filter(Boolean).map((x) => x!.d.say(x!.d.owner === id));
    return reply(`${opener} ${parts.join(" ")}`, [top.d.id, ...(second ? [second.d.id] : [])]);
  }

  // Not in the almanac: say so plainly and offer what I can answer.
  const can = suggestionsFor(id).map((s) => `“${s}”`).join(", ");
  return reply(`${v.unsure} The almanac’s advisors are still writing that part, and I will not guess. You could ask me ${can}.`);
}

/** Guides other than this one whose entry matches the question, for a gentle hand-off. */
export function handOff(id: GuideId, question: string): GuideId | null {
  const e = namedEntries(fold(question)).find((x) => x.id !== id && GUIDES.some((g) => g.id === x.id));
  return (e?.id as GuideId) ?? null;
}
