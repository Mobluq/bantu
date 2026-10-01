"use client";

/**
 * ọ̀nà sound engine.
 * - Effects are synthesised with the Web Audio API (no audio files to load).
 * - Guides speak through the device's speech synthesis, tuned per guide.
 * Browsers only allow audio after a user gesture, so every entry point is a tap.
 */

import type { GuideId } from "./data";

type Prefs = { sfx: boolean; voice: boolean; ambience: boolean };
const PREFS_KEY = "ona.sound.v1";
const DEFAULTS: Prefs = { sfx: true, voice: true, ambience: true };

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let prefs: Prefs = DEFAULTS;
const listeners = new Set<() => void>();

function loadPrefs() {
  try {
    const raw = window.localStorage.getItem(PREFS_KEY);
    if (raw) prefs = { ...DEFAULTS, ...(JSON.parse(raw) as Partial<Prefs>) };
  } catch {
    /* defaults */
  }
}
if (typeof window !== "undefined") loadPrefs();

export function getPrefs(): Prefs {
  return prefs;
}
export function setPref<K extends keyof Prefs>(k: K, v: Prefs[K]) {
  prefs = { ...prefs, [k]: v };
  try {
    window.localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
    /* not persisted */
  }
  if (k === "voice" && !v) stopSpeaking();
  if (k === "ambience" && !v) ambience.stop();
  listeners.forEach((f) => f());
}
export function subscribe(f: () => void) {
  listeners.add(f);
  return () => listeners.delete(f);
}

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.55;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function env(g: GainNode, t: number, peak: number, attack: number, decay: number) {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = "sine", peak = 0.3, glideTo?: number) {
  const a = audio();
  if (!a || !master) return;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, a.currentTime + start);
  if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, a.currentTime + start + dur);
  env(g, a.currentTime + start, peak, 0.008, dur);
  o.connect(g).connect(master);
  o.start(a.currentTime + start);
  o.stop(a.currentTime + start + dur + 0.05);
}

let noiseBuf: AudioBuffer | null = null;
function noise(start: number, dur: number, filterFreq: number, peak = 0.25, type: BiquadFilterType = "lowpass") {
  const a = audio();
  if (!a || !master) return;
  if (!noiseBuf) {
    noiseBuf = a.createBuffer(1, a.sampleRate * 1, a.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const src = a.createBufferSource();
  src.buffer = noiseBuf;
  const f = a.createBiquadFilter();
  f.type = type;
  f.frequency.value = filterFreq;
  const g = a.createGain();
  env(g, a.currentTime + start, peak, 0.004, dur);
  src.connect(f).connect(g).connect(master);
  src.start(a.currentTime + start);
  src.stop(a.currentTime + start + dur + 0.05);
}

/** A talking-drum (gángan) hit: a membrane tone whose pitch falls as the strings are released. */
function drumHit(start: number, pitch: number, fall = 0.7) {
  tone(pitch, start, 0.32, "sine", 0.55, pitch * fall);
  tone(pitch * 2.02, start, 0.12, "triangle", 0.12, pitch * 2 * fall);
  noise(start, 0.05, 1800, 0.18, "bandpass");
}

/** Resume audio on the first gesture so ambience queued before a tap can play. */
export function unlockAudio() {
  audio();
}

export const sfx = {
  tap() {
    if (!prefs.sfx) return;
    tone(1250, 0, 0.03, "square", 0.04);
  },
  correct() {
    if (!prefs.sfx) return;
    tone(1046.5, 0, 0.18, "sine", 0.22);
    tone(1318.5, 0.09, 0.32, "sine", 0.22);
  },
  wrong() {
    if (!prefs.sfx) return;
    tone(220, 0, 0.22, "triangle", 0.25, 150);
  },
  cowrie() {
    if (!prefs.sfx) return;
    [0, 0.06, 0.13].forEach((t, i) => noise(t, 0.05, 5200 - i * 600, 0.12, "highpass"));
  },
  stamp() {
    if (!prefs.sfx) return;
    tone(92, 0, 0.3, "sine", 0.7, 48);
    noise(0, 0.14, 700, 0.45);
  },
  /** Low-low on the drum, the tones of "ọ̀nà". */
  ona() {
    if (!prefs.sfx) return;
    drumHit(0, 150, 0.8);
    drumHit(0.22, 135, 0.75);
  },
  /** Lesson complete: a rising drum phrase and a chime. */
  complete() {
    if (!prefs.sfx) return;
    drumHit(0, 140);
    drumHit(0.16, 165);
    drumHit(0.32, 196, 0.85);
    tone(1568, 0.5, 0.5, "sine", 0.16);
  },
  whoosh() {
    if (!prefs.sfx) return;
    noise(0, 0.25, 900, 0.1, "bandpass");
  },
};

/** Night ambience: crickets over a soft wind, looping until stopped. */
export const ambience = (() => {
  let nodes: { stop: () => void } | null = null;
  return {
    start() {
      if (!prefs.ambience || nodes) return;
      const a = audio();
      if (!a || !master) return;
      const out = a.createGain();
      out.gain.value = 0.0001;
      out.gain.exponentialRampToValueAtTime(0.5, a.currentTime + 1.5);
      out.connect(master);
      // wind
      if (!noiseBuf) noise(0, 0.001, 100, 0.0001);
      const wind = a.createBufferSource();
      wind.buffer = noiseBuf;
      wind.loop = true;
      const wf = a.createBiquadFilter();
      wf.type = "lowpass";
      wf.frequency.value = 380;
      const wg = a.createGain();
      wg.gain.value = 0.05;
      wind.connect(wf).connect(wg).connect(out);
      wind.start();
      // crickets: a high carrier gated by a fast pulse, swelling in bursts
      const carrier = a.createOscillator();
      carrier.frequency.value = 4400;
      const gate = a.createGain();
      gate.gain.value = 0;
      const lfo = a.createOscillator();
      lfo.type = "square";
      lfo.frequency.value = 28;
      const lfoGain = a.createGain();
      lfoGain.gain.value = 0.025;
      lfo.connect(lfoGain).connect(gate.gain);
      const swell = a.createOscillator();
      swell.frequency.value = 0.55;
      const swellGain = a.createGain();
      swellGain.gain.value = 0.02;
      swell.connect(swellGain).connect(gate.gain);
      carrier.connect(gate).connect(out);
      carrier.start();
      lfo.start();
      swell.start();
      nodes = {
        stop() {
          const t = a.currentTime;
          out.gain.cancelScheduledValues(t);
          out.gain.setValueAtTime(out.gain.value, t);
          out.gain.exponentialRampToValueAtTime(0.0001, t + 0.8);
          [wind, carrier, lfo, swell].forEach((n) => n.stop(t + 0.9));
        },
      };
    },
    stop() {
      nodes?.stop();
      nodes = null;
    },
  };
})();

/* ───────────── Guide voices (speech synthesis) ───────────── */

const VOICE_STYLE: Partial<Record<GuideId, { pitch: number; rate: number }>> = {
  esu: { pitch: 1.12, rate: 1.04 },
  osun: { pitch: 1.18, rate: 0.94 },
  ogun: { pitch: 0.8, rate: 0.92 },
  ala: { pitch: 0.92, rate: 0.9 },
  bayajidda: { pitch: 0.85, rate: 0.92 },
  woyengi: { pitch: 1.05, rate: 0.9 },
  keeper: { pitch: 1, rate: 1 },
};

let current: SpeechSynthesisUtterance | null = null;

export function speechAvailable() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function pickVoice(): SpeechSynthesisVoice | null {
  const vs = window.speechSynthesis.getVoices();
  if (!vs.length) return null;
  const by = (re: RegExp) => vs.find((v) => re.test(v.lang));
  // Prefer a Nigerian English voice where the device has one, then British, then any English.
  return by(/^en[-_]NG/i) ?? by(/^en[-_]GB/i) ?? by(/^en/i) ?? vs[0];
}

export function stopSpeaking() {
  if (!speechAvailable()) return;
  window.speechSynthesis.cancel();
  current = null;
}

/** Speak `text` in a guide's voice. Resolves when finished or interrupted. Returns false when voice is off or unavailable. */
export function speak(text: string, guide: GuideId = "keeper", hooks: { onStart?: () => void; onEnd?: () => void } = {}): boolean {
  if (!speechAvailable() || !prefs.voice) return false;
  stopSpeaking();
  const u = new SpeechSynthesisUtterance(text.normalize("NFC"));
  const v = pickVoice();
  if (v) {
    u.voice = v;
    u.lang = v.lang;
  }
  const st = VOICE_STYLE[guide] ?? VOICE_STYLE.keeper!;
  u.pitch = st.pitch;
  u.rate = st.rate;
  u.onstart = () => hooks.onStart?.();
  const done = () => {
    if (current === u) current = null;
    hooks.onEnd?.();
  };
  u.onend = done;
  u.onerror = done;
  current = u;
  window.speechSynthesis.speak(u);
  // Some engines never fire onstart; report playing immediately.
  hooks.onStart?.();
  return true;
}
