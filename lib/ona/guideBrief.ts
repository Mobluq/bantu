import { ENTRIES } from "./almanac";
import { guideById, type GuideId } from "./data";
import { LESSONS, ROADS } from "./roads";

/** Everything a guide may draw on: its own almanac entry plus its road's lesson facts. */
export function guideFacts(id: GuideId): string {
  const g = guideById(id);
  const entry = ENTRIES.find((e) => e.id === id);
  const road = ROADS.find((r) => r.guide === id);
  const lines: string[] = [`Guide: ${g.name} (${g.people}). Domain: ${g.domain}. Home: ${g.home}.`];
  if (entry) {
    lines.push(`Almanac entry ${entry.number}, ${entry.full}.`);
    for (const [k, v] of entry.rows) lines.push(`${k}: ${v}`);
    for (const [k, v] of entry.abroad ?? []) lines.push(`Abroad, ${k}: ${v}`);
    if (entry.story) lines.push(`Story "${entry.story.title}": ${entry.story.body}`);
    if (entry.note) lines.push(`${entry.note.title} ${entry.note.body}`);
  }
  if (road) {
    for (const l of LESSONS.filter((x) => x.road === road.id)) {
      for (const st of l.steps) {
        if (st.kind === "fact") lines.push(`${st.title}: ${st.body}${st.examples ? " " + st.examples.map((e) => `${e.term} = ${e.meaning}`).join("; ") : ""}`);
        if (st.kind === "choose") lines.push(st.right);
      }
    }
  }
  return lines.join("\n");
}

/** Offline answer: the almanac row whose label or text best matches the question. */
export function offlineAnswer(id: GuideId, question: string): string {
  const fold = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const g = guideById(id);
  const entry = ENTRIES.find((e) => e.id === id);
  const q = fold(question);
  const words = q.split(/[^a-z0-9]+/).filter((w) => w.length > 3);
  const rows: [string, string][] = [...(entry?.rows ?? []), ...(entry?.abroad ?? []).map(([k, v]) => [`Abroad, ${k}`, v] as [string, string])];
  let best: [string, string] | null = null;
  let score = 0;
  for (const r of rows) {
    const t = fold(r.join(" "));
    const s = words.filter((w) => t.includes(w)).length;
    if (s > score) {
      score = s;
      best = r;
    }
  }
  if (best) return `${best[0]}: ${best[1]}.`;
  if (entry?.story && /story|tale|why|how/.test(q)) return `${entry.story.title}. ${entry.story.body}`;
  return `I am ${g.name}, of ${g.domain}. Ask me about my domain, my colours, where I am honoured, or my story.`;
}
