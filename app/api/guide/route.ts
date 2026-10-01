import Anthropic from "@anthropic-ai/sdk";
import { GUIDES, guideById, type GuideId } from "@/lib/ona/data";
import { guideFacts } from "@/lib/ona/guideBrief";

export const runtime = "nodejs";

type Turn = { role: "user" | "assistant"; content: string };

const MAX_TURNS = 16;
const MAX_CHARS = 600;

function systemPrompt(id: GuideId): string {
  const g = guideById(id);
  const secular = id === "keeper";
  return [
    secular
      ? "You are the Keeper, the plain-spoken archivist of ọ̀nà, an app that teaches Nigerian cultures. You speak without religious framing."
      : `You are the voice of ${g.name}, a guide in ọ̀nà, an app that teaches Nigerian cultures. ${g.name} is a figure of a living ${g.people} tradition, so you speak with warmth and dignity, in the first person, as a teaching character, never claiming to be the actual deity or giving spiritual commands.`,
    "Audience: learners, often diaspora families and children. Keep answers under 90 words, plain and warm. You may open with a short greeting in the guide's language.",
    "Ground every factual claim in the FACTS below. If a question goes beyond them, say you are not sure and that the app's advisors are still writing that part. Never invent dates, names, rituals or quotations.",
    "Where stories have several versions, say so. Do not describe closed or secret rites (for example Orò or the inside of Egúngún practice). Do not mock any faith, including Christianity and Islam.",
    "Never write a Yorùbá, Igbo or Hausa word without its tone marks and underdots where it has them.",
    `FACTS:\n${guideFacts(id)}`,
  ].join("\n\n");
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "no_key" }, { status: 503 });
  }

  let body: { guide?: string; messages?: Turn[] };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad_json" }, { status: 400 });
  }
  const guide = GUIDES.find((g) => g.id === body.guide)?.id;
  const turns = (body.messages ?? []).slice(-MAX_TURNS);
  const valid =
    guide &&
    turns.length > 0 &&
    turns.at(-1)?.role === "user" &&
    turns.every((t) => (t.role === "user" || t.role === "assistant") && typeof t.content === "string" && t.content.length <= MAX_CHARS);
  if (!valid) return Response.json({ error: "bad_request" }, { status: 400 });

  const client = new Anthropic();
  try {
    const response = await client.beta.messages.create({
      model: "claude-opus-5-5",
      max_tokens: 2000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low" },
      system: [{ type: "text", text: systemPrompt(guide), cache_control: { type: "ephemeral" } }],
      messages: turns.map((t) => ({ role: t.role, content: t.content })),
    });
    if (response.stop_reason === "refusal") {
      return Response.json({ reply: "That is a question I will leave to the elders. Ask me about my stories, my places or my words instead." });
    }
    const reply = response.content
      .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();
    return Response.json({ reply: reply || "Ask me again, a little differently." });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) return Response.json({ error: "busy" }, { status: 429 });
    if (error instanceof Anthropic.AuthenticationError) return Response.json({ error: "no_key" }, { status: 503 });
    if (error instanceof Anthropic.APIError) return Response.json({ error: "upstream" }, { status: 502 });
    return Response.json({ error: "unknown" }, { status: 500 });
  }
}
