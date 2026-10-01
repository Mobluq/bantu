"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowUp } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { guideById, type GuideId } from "@/lib/ona/data";
import { guideAnswer } from "@/lib/ona/guideMind";
import { Emblem, Mono, snappy, spring } from "../primitives";
import { SpeakButton } from "../Speak";
import { sfx } from "@/lib/ona/sound";

type Msg = { role: "user" | "assistant"; content: string; offline?: boolean; suggestions?: string[] };

const STARTERS: Record<string, string[]> = {
  esu: ["Are you the devil?", "Why the crossroads?", "Tell me the cap story"],
  osun: ["What is your grove?", "Why yellow and gold?", "How do I greet an elder?"],
  ogun: ["Why do drivers honour you?", "Tell me about iron", "Where is your home?"],
  ala: ["What is an mbari house?", "What are the market days?", "Why is kola first?"],
  bayajidda: ["Tell me about the well", "What are the seven states?", "How do I say thank you?"],
  woyengi: ["How did you make people?", "What is the Creation Stone?", "Where do the Ịjọ live?"],
  keeper: ["Who are the òrìṣà?", "What is an almanac entry?", "Which roads can I walk?"],
};

export function Chat({ guide, onBack, initial, onAsked, about }: { guide: GuideId; onBack: () => void; initial?: string | null; onAsked?: () => void; about?: string | null }) {
  const g = guideById(guide);
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "assistant", content: g.greeting }]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [offline, setOffline] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => end.current?.scrollIntoView({ behavior: "smooth", block: "end" }), [msgs, busy]);

  const seen = useRef<string[]>([]);

  /** Answer from the app's own almanac, lessons and festivals. Always available. */
  const answerLocally = async (next: Msg[], q: string) => {
    setBusy(true);
    await new Promise((r) => window.setTimeout(r, 450 + Math.min(900, q.length * 12)));
    const r = guideAnswer(guide, q, seen.current, about ?? undefined);
    seen.current = [...seen.current, ...r.used].slice(-40);
    sfx.cowrie();
    setMsgs([...next, { role: "assistant", content: r.text, offline: true, suggestions: r.suggestions }]);
    setBusy(false);
  };

  const send = async (text: string) => {
    const q = text.trim().slice(0, 600);
    if (!q || busy) return;
    setError(null);
    const next: Msg[] = [...msgs, { role: "user", content: q }];
    setMsgs(next);
    setDraft("");
    sfx.tap();
    if (offline) return answerLocally(next, q);
    setBusy(true);
    try {
      const res = await fetch("/api/guide", {
        method: "POST",
        headers: { "content-type": "application/json" },
        // The opening greeting is UI copy, not a model turn: send only the real exchange.
        body: JSON.stringify({ guide, object: about ?? undefined, messages: next.slice(1).map(({ role, content }) => ({ role, content })) }),
      });
      const data = (await res.json().catch(() => ({}))) as { reply?: string; error?: string };
      if (data.reply) {
        sfx.cowrie();
        setMsgs([...next, { role: "assistant", content: data.reply }]);
        setBusy(false);
        return;
      }
      // No live model (no key, busy, or down): the guide answers from the almanac instead.
      if (data.error === "no_key") setOffline(true);
      setBusy(false);
      return answerLocally(next, q);
    } catch {
      setBusy(false);
      return answerLocally(next, q);
    }
  };

  // A question carried in from an object page is asked as soon as the chat opens.
  const askedInitial = useRef(false);
  useEffect(() => {
    if (!initial || askedInitial.current) return;
    askedInitial.current = true;
    onAsked?.();
    void send(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

  const dark = g.tone.bg !== "var(--color-paper)";

  return (
    <div className="relative flex h-full flex-col bg-cream text-ink">
      <header
        className={`relative flex items-center gap-3 pb-4 pl-1.5 pr-4 pt-safe ${dark ? "ht-light text-cream" : "border-b border-ink/15"}`}
        style={{ background: g.tone.bg }}
      >
        <button type="button" onClick={onBack} aria-label="Back" className="flex size-11 items-center justify-center" style={{ color: dark ? g.tone.fg : "var(--color-ink)" }}>
          <ArrowLeft size={22} weight="light" />
        </button>
        <Emblem name={g.emblem} size={44} disc color={g.tone.bg} bg={g.tone.fg} rough={1.4} speckle={false} />
        <div className="flex-1">
          <div className="t-display text-[30px]" style={{ color: dark ? "var(--color-cream)" : "var(--color-ink)" }}>
            {g.name}
          </div>
          <Mono className="text-[9.5px]" >
            <span style={{ color: dark ? g.tone.fg : "var(--color-muted)" }}>{offline ? "Answering from the almanac" : `${g.people} · ${g.domain}`}</span>
          </Mono>
        </div>
      </header>

      <div className="graph no-scrollbar flex-1 overflow-y-auto px-4 pb-4 pt-4" aria-live="polite">
        <AnimatePresence initial={false}>
          {msgs.map((m, k) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={spring}
              className={`mb-3 flex items-end gap-2 ${m.role === "user" ? "justify-end" : ""}`}
            >
              {m.role === "assistant" && (
                <div className="shrink-0">
                  <Emblem name={g.emblem} size={32} disc color={g.tone.fg} bg={g.tone.bg} rough={1} speckle={false} />
                </div>
              )}
              <div
                className={`max-w-[78%] px-3.5 py-2.5 text-[15px] leading-[1.45] ${
                  m.role === "user" ? "rounded-[20px_20px_4px_20px] bg-ink text-cream" : "rounded-[20px_20px_20px_4px] border-[1.5px] border-ink bg-paper"
                }`}
              >
                {m.content}
                {m.role === "assistant" && (
                  <div className="mt-1.5 flex justify-end">
                    <SpeakButton text={m.content} guide={guide} label={`${g.name}’s reply`} size={26} />
                  </div>
                )}
                {m.offline && <Mono className="mt-1.5 block text-[9px] text-muted">From the almanac</Mono>}
              </div>
            </motion.div>
          ))}
          {busy && (
            <motion.div key="typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mb-3 flex items-end gap-2">
              <Emblem name={g.emblem} size={32} disc color={g.tone.fg} bg={g.tone.bg} rough={1} speckle={false} />
              <div className="flex gap-1 rounded-[20px_20px_20px_4px] border-[1.5px] border-ink bg-paper px-4 py-3.5" role="status" aria-label={`${g.name} is answering`}>
                {[0, 1, 2].map((d) => (
                  <motion.span key={d} className="size-2 rounded-full bg-ink" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: d * 0.15 }} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {!busy && msgs.length > 1 && msgs[msgs.length - 1].suggestions && (
          <div className="mt-1 flex flex-wrap gap-2 pl-10">
            {msgs[msgs.length - 1].suggestions!.filter((x) => !msgs.some((m) => m.role === "user" && m.content === x)).map((x) => (
              <motion.button key={x} type="button" whileTap={{ scale: 0.96 }} transition={snappy} onClick={() => send(x)} className="rounded-full bg-paper px-3 py-1.5 text-[12.5px] font-semibold ring-1 ring-ink/20">
                {x}
              </motion.button>
            ))}
          </div>
        )}
        {msgs.length === 1 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {(STARTERS[guide] ?? STARTERS.keeper).map((s) => (
              <motion.button key={s} type="button" whileTap={{ scale: 0.96 }} transition={snappy} onClick={() => send(s)} className="rounded-full bg-paper px-3.5 py-2 text-[13.5px] font-semibold ring-1 ring-ink/25">
                {s}
              </motion.button>
            ))}
          </div>
        )}
        <div ref={end} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(draft);
        }}
        className="border-t border-ink/15 bg-paper px-3 pb-[max(env(safe-area-inset-bottom),18px)] pt-3"
      >
        {error && (
          <p role="alert" className="mb-2 px-1 text-[13px] font-semibold text-brick">
            {error}
          </p>
        )}
        <label htmlFor="chat-input" className="sr-only">
          Message {g.name}
        </label>
        <div className="flex items-center gap-2 rounded-full bg-cream py-1.5 pl-4 pr-1.5 ring-1 ring-ink/20 focus-within:ring-2 focus-within:ring-brick">
          <input
            id="chat-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={600}
            placeholder={`Ask ${g.name}…`}
            enterKeyHint="send"
            autoComplete="off"
            className="h-10 min-w-0 flex-1 bg-transparent text-[16px] outline-none placeholder:text-muted"
          />
          <motion.button
            type="submit"
            disabled={!draft.trim() || busy}
            whileTap={{ scale: 0.92 }}
            transition={snappy}
            aria-label="Send"
            className="flex size-10 items-center justify-center rounded-full bg-ink text-gold disabled:opacity-35"
          >
            <ArrowUp size={18} weight="bold" />
          </motion.button>
        </div>
      </form>
    </div>
  );
}
