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
