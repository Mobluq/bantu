"use client";

import { Pause, SpeakerHigh, SpeakerSlash } from "@phosphor-icons/react";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import type { GuideId } from "@/lib/ona/data";
import { getPrefs, speak, speechAvailable, stopSpeaking, subscribe } from "@/lib/ona/sound";
import { Waveform } from "./primitives";

/** Reactive sound preferences. */
export function useSoundPrefs() {
  return useSyncExternalStore(subscribe, getPrefs, getPrefs);
}

/** One speaker per control: toggles speech for `text` and reports whether it is playing. */
export function useSpeaker(text: string, guide: GuideId) {
  const [playing, setPlaying] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const prefs = useSoundPrefs();
  useEffect(() => () => { if (playing) stopSpeaking(); }, [playing]);
  useEffect(() => {
    if (!blocked) return;
    const t = window.setTimeout(() => setBlocked(false), 2600);
    return () => window.clearTimeout(t);
  }, [blocked]);
  const toggle = useCallback(() => {
    if (playing) {
      stopSpeaking();
      setPlaying(false);
      return;
    }
    const ok = speak(text, guide, { onStart: () => setPlaying(true), onEnd: () => setPlaying(false) });
    if (!ok) setBlocked(true);
  }, [playing, text, guide]);
  return { playing, toggle, blocked, available: speechAvailable() && prefs.voice };
}

/** Round speak button with optional waveform, used wherever a guide talks. */
export function SpeakButton({
  text,
  guide,
  label,
  wave = 0,
  className = "",
  tone = "ink",
  size = 28,
}: {
  text: string;
  guide: GuideId;
  label: string;
  wave?: number;
  className?: string;
  tone?: "ink" | "gold" | "forest" | "cream";
  size?: number;
}) {
  const { playing, toggle, blocked, available } = useSpeaker(text, guide);
  const bg = { ink: "bg-ink text-gold", gold: "bg-gold text-ink", forest: "bg-forest text-gold", cream: "bg-cream text-ink" }[tone];
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={playing}
      aria-label={playing ? `Stop ${label}` : `Play ${label}`}
      className={`relative flex min-h-[32px] min-w-[32px] items-center gap-2 ${className}`}
    >
      {wave > 0 && <Waveform bars={wave} height={16} playing={playing} />}
      <span className={`flex items-center justify-center rounded-full ${bg}`} style={{ width: size, height: size }}>
        {playing ? <Pause size={size * 0.43} weight="fill" /> : available ? <SpeakerHigh size={size * 0.5} weight="fill" /> : <SpeakerSlash size={size * 0.5} weight="fill" />}
      </span>
      {blocked && (
        <span role="status" className="absolute right-0 top-full z-20 mt-1 whitespace-nowrap rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-cream">
          {speechAvailable() ? "Voices are off in Me" : "No voice on this device"}
        </span>
      )}
    </button>
  );
}
