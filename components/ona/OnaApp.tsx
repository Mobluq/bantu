"use client";

import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { initialState, reducer, type SavedState, type Screen } from "./state";
import { Splash } from "./screens/Splash";
import { Onboarding } from "./screens/Onboarding";
import { GuidePicker } from "./screens/GuidePicker";
import { HomeMap } from "./screens/HomeMap";
import { Lesson } from "./screens/Lesson";
import { Stamps } from "./screens/Stamps";
import { Artifact } from "./screens/Artifact";
import { Almanac } from "./screens/Almanac";
import { Entry } from "./screens/Entry";
import { Chat } from "./screens/Chat";
import { Learn } from "./screens/Learn";
import { roadById } from "@/lib/ona/roads";
import { Me } from "./screens/Me";
import { Museum } from "./screens/Museum";
import { ObjectPage } from "./screens/ObjectPage";
import { Vertical } from "./screens/Vertical";
import { TourScreen } from "./screens/TourScreen";
import { Attract } from "./museum/Attract";
import { spring } from "./primitives";
import { stopSpeaking, unlockAudio } from "@/lib/ona/sound";

const JUMP: { id: Screen; label: string }[] = [
  { id: "splash", label: "Splash" },
  { id: "onboarding", label: "Onboarding" },
  { id: "guides", label: "Guides" },
  { id: "map", label: "Map" },
  { id: "learn", label: "Learn" },
  { id: "chat", label: "Guide chat" },
  { id: "museum", label: "Museum" },
  { id: "stamps", label: "Stamps" },
  { id: "artifact", label: "3D object" },
  { id: "almanac", label: "Almanac" },
  { id: "me", label: "Notebook" },
];

const STORAGE_KEY = "ona.progress.v2";

type Props = {
  bare?: boolean;
  jumpNav?: boolean;
  /** Open straight onto a museum object (a QR code on a wall label). */
  startObject?: string;
  /** Gallery kiosk: no saved progress, starts in the museum, resets after inactivity. */
  kiosk?: boolean;
};

const KIOSK_IDLE_MS = 90_000;

export function OnaApp({ bare = false, jumpNav = true, startObject, kiosk = false }: Props) {
  const [s, dispatch] = useReducer(reducer, initialState, (st) => (kiosk ? { ...st, onboarded: true, screen: "museum" as Screen } : st));
  const [attract, setAttract] = useState(kiosk);
  const hydrated = useRef(false);

  // Restore progress once on the client. Storage can be blocked (private mode), so every access is guarded.
  useEffect(() => {
    if (kiosk) {
      hydrated.current = false;
      return;
    }
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<SavedState>;
        dispatch({ type: "hydrate", saved });
        // A returning traveller arriving after dark lands on the Àlọ́ (moonlight) map.
        const h = new Date().getHours();
        if (saved.onboarded && (h >= 19 || h < 6)) dispatch({ type: "setNight", night: true });
      }
    } catch {
      /* start fresh */
    }
    if (startObject) {
      dispatch({ type: "go", screen: "museum" });
      dispatch({ type: "openObject", id: startObject });
    }
    hydrated.current = true;
  }, [kiosk, startObject]);

  // Kiosk: after a quiet spell, clear the visit and return to the attract screen for the next visitor.
  useEffect(() => {
    if (!kiosk) return;
    let t = 0;
    const arm = () => {
      window.clearTimeout(t);
      t = window.setTimeout(() => {
        stopSpeaking();
        dispatch({ type: "kioskReset" });
        setAttract(true);
      }, KIOSK_IDLE_MS);
    };
    const events = ["pointerdown", "keydown", "wheel", "touchmove"] as const;
    events.forEach((e) => window.addEventListener(e, arm, { passive: true }));
    arm();
    return () => {
      window.clearTimeout(t);
      events.forEach((e) => window.removeEventListener(e, arm));
    };
  }, [kiosk]);

  useEffect(() => {
    if (!hydrated.current) return;
    const saved: SavedState = {
      interests: s.interests,
      guide: s.guide,
      lives: s.lives,
      cowries: s.cowries,
      streak: s.streak,
      stamps: s.stamps,
      statuses: s.statuses,
      onboarded: s.onboarded,
      selectedPlace: s.selectedPlace,
      completed: s.completed,
      road: s.road,
      saved: s.saved,
      lastDay: s.lastDay,
      lifeAt: s.lifeAt,
      seen: s.seen,
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch {
      /* progress just won't persist */
    }
  }, [s.interests, s.guide, s.lives, s.cowries, s.streak, s.stamps, s.statuses, s.onboarded, s.selectedPlace, s.completed, s.road, s.saved, s.lastDay, s.lifeAt, s.seen]);

  // Cowries (lives) regenerate over time; check on mount and every 30s.
  useEffect(() => {
    const t = () => dispatch({ type: "tick", now: Date.now() });
    t();
    const id = window.setInterval(t, 30_000);
    return () => window.clearInterval(id);
  }, []);

  // Offline support for weak museum Wi-Fi (production builds only).
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => undefined);
  }, []);

  // Browsers start audio suspended until a gesture.
  useEffect(() => {
    const unlock = () => unlockAudio();
    window.addEventListener("pointerdown", unlock, { once: true });
    return () => window.removeEventListener("pointerdown", unlock);
  }, []);

  // A guide stops talking when you leave the screen.
  useEffect(() => stopSpeaking, [s.screen]);

  const go = useCallback((screen: Screen) => dispatch({ type: "go", screen }), []);
  const leaveSplash = useCallback(() => dispatch({ type: "go", screen: "onboarding" }), []);
  const clearFlash = useCallback(() => dispatch({ type: "clearStampFlash" }), []);

  let view: React.ReactNode;
  switch (s.screen) {
    case "splash":
      view = <Splash onDone={leaveSplash} />;
      break;
    case "onboarding":
      view = (
        <Onboarding
          interests={s.interests}
          onToggle={(interest) => dispatch({ type: "toggleInterest", interest })}
          onNext={() => go("guides")}
          onSecular={() => {
            dispatch({ type: "pickGuide", guide: "keeper" });
            go("guides");
          }}
        />
      );
      break;
    case "guides":
      view = <GuidePicker guide={s.guide} onPick={(guide) => dispatch({ type: "pickGuide", guide })} onBack={() => go("onboarding")} onNext={() => go("map")} />;
      break;
    case "map":
      view = (
        <HomeMap
          night={s.night}
          setNight={(night) => dispatch({ type: "setNight", night })}
          statuses={s.statuses}
          selected={s.selectedPlace}
          onSelect={(id) => dispatch({ type: "selectPlace", id })}
          cowries={s.cowries}
          streak={s.streak}
          stamped={s.stamps.length}
          completed={s.completed}
          onOpenLesson={(id) => dispatch({ type: "openLesson", id })}
          myGuide={s.guide}
          onAsk={(guide) => dispatch({ type: "openChat", guide, from: "map" })}
          onGo={go}
        />
      );
      break;
    case "learn":
      view = (
        <Learn
          road={s.road}
          completed={s.completed}
          stamps={s.stamps}
          onRoad={(road) => dispatch({ type: "setRoad", road })}
          onOpen={(id) => dispatch({ type: "openLesson", id })}
          onAsk={() => dispatch({ type: "openChat", guide: roadById(s.road).guide, from: "learn" })}
          onGo={go}
        />
      );
      break;
    case "lesson":
      view = (
        <Lesson
          key={s.lessonId ?? "none"}
          lessonId={s.lessonId}
          lives={s.lives}
          lifeAt={s.lifeAt}
          completed={s.completed}
          saved={s.saved}
          onToggleSave={(word) => dispatch({ type: "toggleSave", word })}
          onAnswer={(correct) => dispatch({ type: "answer", correct })}
          onPractice={(id) => dispatch({ type: "openLesson", id })}
          onClose={() => go("learn")}
          onFinish={(id, earned) => dispatch({ type: "finishLesson", id, earned })}
        />
      );
      break;
    case "stamps":
      view = <Stamps onCalendar={() => dispatch({ type: "openAlmanac", tab: "calendar" })} stamps={s.stamps} justStamped={s.justStamped} onClearFlash={clearFlash} onOpenEntry={(id) => dispatch({ type: "openEntry", id })} onGo={go} />;
      break;
    case "artifact":
      view = <Artifact onBack={() => go(s.artifactFrom === "artifact" ? "museum" : s.artifactFrom)} />;
      break;
    case "almanac":
      view = <Almanac key={s.almanacTab} initialTab={s.almanacTab} onOpen={(id) => dispatch({ type: "openEntry", id })} onGo={go} />;
      break;
    case "entry":
      view = (
        <Entry
          id={s.entryId}
          onOpen={(id) => dispatch({ type: "openEntry", id })}
          onAsk={(guide) => dispatch({ type: "openChat", guide, from: "entry" })}
          onBack={() => go(s.entryFrom === "entry" ? "almanac" : s.entryFrom)}
          onGo={go}
        />
      );
      break;
    case "chat":
      view = <Chat key={`${s.chatGuide}-${s.chatAbout ?? ""}`} guide={s.chatGuide} about={s.chatAbout} initial={s.chatAsk} onAsked={() => dispatch({ type: "chatAsked" })} onBack={() => go(s.chatFrom)} />;
      break;
    case "museum":
      view = (
        <Museum
          seen={s.seen}
          tour={s.tour}
          onObject={(id) => dispatch({ type: "openObject", id })}
          onVertical={(id) => dispatch({ type: "openVertical", id })}
          onTour={(id) => dispatch({ type: "openTour", id })}
          onGo={go}
        />
      );
      break;
    case "object":
      view = (
        <ObjectPage
          key={s.objectId}
          id={s.objectId}
          tour={s.tour}
          onBack={() => go(s.objectFrom === "object" ? "museum" : s.objectFrom)}
          onObject={(id) => dispatch({ type: "openObject", id })}
          onVertical={(id) => dispatch({ type: "openVertical", id })}
          onAsk={(guide, q) => dispatch({ type: "openChat", guide, from: "object", ask: q || undefined, about: s.objectId })}
          onEntry={(id) => dispatch({ type: "openEntry", id })}
          onTurntable={() => dispatch({ type: "openArtifact", from: "object" })}
          onTourStep={(delta) => dispatch({ type: "tourStep", delta })}
          onEndTour={() => dispatch({ type: "endTour" })}
        />
      );
      break;
    case "vertical":
      view = (
        <Vertical
          key={s.verticalId}
          id={s.verticalId}
          seen={s.seen}
          onBack={() => go("museum")}
          onObject={(id) => dispatch({ type: "openObject", id })}
          onVertical={(id) => dispatch({ type: "openVertical", id })}
          onCalendar={() => dispatch({ type: "openAlmanac", tab: "calendar" })}
          onNightMap={() => {
            dispatch({ type: "setNight", night: true });
            go("map");
          }}
          onGo={go}
        />
      );
      break;
    case "tour":
      view = s.tour ? (
        <TourScreen
          key={s.tour.id}
          id={s.tour.id}
          progress={s.tour.i}
          seen={s.seen}
          onBack={() => go("museum")}
          onStart={(at) => dispatch({ type: "startTour", id: s.tour!.id, at })}
          onEnd={() => dispatch({ type: "endTour" })}
        />
      ) : null;
      break;
    case "me":
      view = (
        <Me
          guide={s.guide}
          cowries={s.cowries}
          streak={s.streak}
          stamps={s.stamps.length}
          lessons={s.completed.length}
          lives={s.lives}
          saved={s.saved}
          onRemoveWord={(word) => dispatch({ type: "toggleSave", word })}
          onAsk={() => dispatch({ type: "openChat", guide: s.guide, from: "me" })}
          onGo={go}
          onReset={() => {
            try {
              window.localStorage.removeItem(STORAGE_KEY);
            } catch {
              /* nothing stored */
            }
            dispatch({ type: "reset" });
          }}
        />
      );
      break;
  }

  const screen = (
    <>
    {kiosk && <Attract open={attract} onStart={() => setAttract(false)} />}
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={s.screen}
        className="absolute inset-0"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={spring}
      >
        {view}
      </motion.div>
    </AnimatePresence>
    </>
  );

  if (bare) {
    return (
      <MotionConfig reducedMotion="user">
        <div className={`ona-root relative mx-auto h-[100dvh] w-full ${kiosk ? "max-w-[760px]" : "max-w-[480px]"} overflow-hidden bg-cream sm:my-0 sm:shadow-[0_0_0_1px_rgb(30_20_12_/_0.08),0_40px_80px_-30px_rgb(30_20_12_/_0.4)]`}>{screen}</div>
      </MotionConfig>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex w-full items-center gap-6 lg:w-auto">
        <nav aria-label="Jump to screen" className={jumpNav ? "hidden flex-col items-end gap-1.5 lg:flex" : "hidden"}>
          {JUMP.map((j) => (
            <button
              key={j.id}
              type="button"
              onClick={() => go(j.id)}
              aria-current={s.screen === j.id ? "true" : undefined}
              className={`t-mono rounded-full border px-2.5 py-1 text-[10px] transition-colors ${
                s.screen === j.id ? "border-ink bg-ink text-cream" : "border-ink/25 text-ink hover:border-ink"
              }`}
            >
              {j.label}
            </button>
          ))}
        </nav>

        <div className="w-full lg:w-auto lg:rounded-[64px] lg:bg-ink/[0.05] lg:p-2 lg:shadow-[0_60px_120px_-40px_rgb(30_20_12_/_0.35),0_20px_40px_-20px_rgb(30_20_12_/_0.18)] lg:ring-1 lg:ring-ink/10">
        <div className="ona-root relative mx-auto h-[100dvh] w-full max-w-[480px] overflow-hidden bg-cream lg:h-[844px] lg:w-[390px] lg:rounded-[56px] lg:border-[9px] lg:border-ink lg:shadow-[inset_0_1px_1px_rgb(255_255_255_/_0.15)]">
          {screen}
        </div>
        </div>
      </div>
    </MotionConfig>
  );
}
