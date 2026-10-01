"use client";

import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { useCallback, useReducer } from "react";
import { initialState, reducer, type Screen } from "./state";
import { Splash } from "./screens/Splash";
import { Onboarding } from "./screens/Onboarding";
import { GuidePicker } from "./screens/GuidePicker";
import { HomeMap } from "./screens/HomeMap";
import { Lesson } from "./screens/Lesson";
import { Stamps } from "./screens/Stamps";
import { Artifact } from "./screens/Artifact";
import { Almanac } from "./screens/Almanac";
import { Me } from "./screens/Me";
import { spring } from "./primitives";

const JUMP: { id: Screen; label: string }[] = [
  { id: "splash", label: "Splash" },
  { id: "onboarding", label: "Onboarding" },
  { id: "guides", label: "Guides" },
  { id: "map", label: "Map" },
  { id: "lesson", label: "Lesson" },
  { id: "stamps", label: "Stamps" },
  { id: "artifact", label: "3D object" },
  { id: "almanac", label: "Almanac" },
  { id: "me", label: "Notebook" },
];

export function OnaApp() {
  const [s, dispatch] = useReducer(reducer, initialState);
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
          onGo={go}
        />
      );
      break;
    case "lesson":
      view = (
        <Lesson
          lives={s.lives}
          onAnswer={(correct) => dispatch({ type: "answer", correct })}
          onClose={() => go("map")}
          onComplete={() => dispatch({ type: "completeLesson" })}
        />
      );
      break;
    case "stamps":
      view = <Stamps stamps={s.stamps} justStamped={s.justStamped} onClearFlash={clearFlash} onGo={go} />;
      break;
    case "artifact":
      view = <Artifact onBack={() => go("stamps")} />;
      break;
    case "almanac":
      view = <Almanac onGo={go} />;
      break;
    case "me":
      view = <Me guide={s.guide} cowries={s.cowries} streak={s.streak} stamps={s.stamps.length} onGo={go} onReset={() => dispatch({ type: "reset" })} />;
      break;
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex w-full items-center gap-6 lg:w-auto">
        <nav aria-label="Jump to screen" className="hidden flex-col items-end gap-1.5 lg:flex">
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
        <div className="relative h-[100dvh] w-full overflow-hidden bg-cream lg:h-[844px] lg:w-[390px] lg:rounded-[56px] lg:border-[9px] lg:border-ink lg:shadow-[inset_0_1px_1px_rgb(255_255_255_/_0.15)]">
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
        </div>
        </div>
      </div>
    </MotionConfig>
  );
}
