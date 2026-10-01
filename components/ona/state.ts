import type { GuideId, PlaceStatus } from "@/lib/ona/data";
import { PLACES } from "@/lib/ona/data";
import { LESSONS, ROADS, lessonsForRoad, type RoadId } from "@/lib/ona/roads";
import { tourById, type VerticalId } from "@/lib/ona/museum";

export type Screen =
  | "splash"
  | "onboarding"
  | "guides"
  | "map"
  | "learn"
  | "lesson"
  | "artifact"
  | "stamps"
  | "almanac"
  | "entry"
  | "chat"
  | "me"
  | "museum"
  | "object"
  | "vertical"
  | "tour";

export type OnaState = {
  screen: Screen;
  interests: string[];
  guide: GuideId;
  night: boolean;
  selectedPlace: string;
  lives: number;
  cowries: number;
  streak: number;
  stamps: string[];
  justStamped: string | null;
  statuses: Record<string, PlaceStatus>;
  onboarded: boolean;
  completed: string[];
  road: RoadId;
  lessonId: string | null;
  entryId: string;
  chatGuide: GuideId;
  chatFrom: Screen;
  saved: SavedWord[];
  /** Local date (YYYY-MM-DD) of the last finished lesson, for the streak. */
  lastDay: string | null;
  /** When the next cowrie (life) regenerates, ms since epoch; null when lives are full. */
  lifeAt: number | null;
  almanacTab: "entries" | "calendar";
  /** Museum: objects this visitor has opened, the open object, an active tour, the open vertical. */
  seen: string[];
  objectId: string;
  tour: { id: string; i: number } | null;
  verticalId: VerticalId;
  /** A question to send as soon as the chat opens. */
  chatAsk: string | null;
  /** The museum object a chat was opened from, so the guide knows what the visitor is looking at. */
  chatAbout: string | null;
  artifactFrom: Screen;
  objectFrom: Screen;
  entryFrom: Screen;
};

export type SavedWord = { term: string; meaning: string; road: RoadId };

export const MAX_LIVES = 5;
export const LIFE_MS = 15 * 60 * 1000;

export const localDay = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const dayDiff = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / 864e5);

/** The slice of state worth keeping between visits. */
export type SavedState = Pick<
  OnaState,
  "interests" | "guide" | "lives" | "cowries" | "streak" | "stamps" | "statuses" | "onboarded" | "selectedPlace" | "completed" | "road" | "saved" | "lastDay" | "lifeAt" | "seen"
>;

const baseStatuses = (): Record<string, PlaceStatus> => {
  const s = Object.fromEntries(PLACES.map((p) => [p.id, p.status])) as Record<string, PlaceStatus>;
  // Every road with lessons is walkable from day one.
  s.daura = "open";
  return s;
};

export const initialState: OnaState = {
  screen: "splash",
  interests: ["Myths & gods", "Food & markets"],
  guide: "osun",
  night: false,
  selectedPlace: "osogbo",
  lives: MAX_LIVES,
  cowries: 20,
  streak: 0,
  stamps: ["ife", "lagos", "benin"],
  justStamped: null,
  statuses: baseStatuses(),
  onboarded: false,
  completed: [],
  road: "yoruba",
  lessonId: null,
  entryId: "esu",
  chatGuide: "osun",
  chatFrom: "map",
  saved: [],
  lastDay: null,
  lifeAt: null,
  almanacTab: "entries",
  seen: [],
  objectId: "ife-head",
  tour: null,
  verticalId: "history",
  chatAsk: null,
  chatAbout: null,
  artifactFrom: "stamps",
  objectFrom: "museum",
  entryFrom: "almanac",
};

export type Action =
  | { type: "go"; screen: Screen }
  | { type: "toggleInterest"; interest: string }
  | { type: "pickGuide"; guide: GuideId }
  | { type: "setNight"; night: boolean }
  | { type: "selectPlace"; id: string }
  | { type: "setRoad"; road: RoadId }
  | { type: "openLesson"; id: string }
  | { type: "answer"; correct: boolean }
  | { type: "tick"; now: number }
  | { type: "toggleSave"; word: SavedWord }
  | { type: "openAlmanac"; tab: "entries" | "calendar" }
  | { type: "finishLesson"; id: string; earned: number }
  | { type: "openEntry"; id: string }
  | { type: "openChat"; guide: GuideId; from: Screen; ask?: string; about?: string }
  | { type: "openObject"; id: string }
  | { type: "openVertical"; id: VerticalId }
  | { type: "openTour"; id: string }
  | { type: "startTour"; id: string; at?: number }
  | { type: "tourStep"; delta: 1 | -1 }
  | { type: "endTour" }
  | { type: "openArtifact"; from: Screen }
  | { type: "chatAsked" }
  | { type: "clearStampFlash" }
  | { type: "hydrate"; saved: Partial<SavedState> }
  | { type: "reset" }
  | { type: "kioskReset" };

/** The next lesson to take on a road: the first not yet completed. */
export const nextLesson = (road: RoadId, completed: string[]) => lessonsForRoad(road).find((l) => !completed.includes(l.id)) ?? null;

export const roadDone = (road: RoadId, completed: string[]) => lessonsForRoad(road).every((l) => completed.includes(l.id));

export function reducer(state: OnaState, action: Action): OnaState {
  switch (action.type) {
    case "go":
      return {
        ...state,
        screen: action.screen,
        artifactFrom: action.screen === "artifact" ? state.screen : state.artifactFrom,
        onboarded: state.onboarded || action.screen === "map",
        almanacTab: action.screen === "almanac" ? "entries" : state.almanacTab,
      };
    case "toggleInterest": {
      const has = state.interests.includes(action.interest);
      return { ...state, interests: has ? state.interests.filter((i) => i !== action.interest) : [...state.interests, action.interest] };
    }
    case "pickGuide":
      return { ...state, guide: action.guide };
    case "setNight":
      return { ...state, night: action.night };
    case "selectPlace":
      return { ...state, selectedPlace: action.id };
    case "setRoad":
      return { ...state, road: action.road };
    case "openLesson": {
      const l = LESSONS.find((x) => x.id === action.id);
      return l ? { ...state, screen: "lesson", lessonId: l.id, road: l.road } : state;
    }
    case "answer": {
      if (action.correct) return state;
      const lives = Math.max(0, state.lives - 1);
      return { ...state, lives, lifeAt: state.lifeAt ?? Date.now() + LIFE_MS };
    }
    case "tick": {
      // Regenerate one cowrie per LIFE_MS while below the maximum.
      if (state.lifeAt === null || state.lives >= MAX_LIVES) return state.lifeAt === null ? state : { ...state, lifeAt: null };
      if (action.now < state.lifeAt) return state;
      const gained = 1 + Math.floor((action.now - state.lifeAt) / LIFE_MS);
      const lives = Math.min(MAX_LIVES, state.lives + gained);
      return { ...state, lives, lifeAt: lives >= MAX_LIVES ? null : state.lifeAt + gained * LIFE_MS };
    }
    case "toggleSave": {
      const has = state.saved.some((w) => w.term === action.word.term);
      return { ...state, saved: has ? state.saved.filter((w) => w.term !== action.word.term) : [action.word, ...state.saved] };
    }
    case "openAlmanac":
      return { ...state, screen: "almanac", almanacTab: action.tab };
    case "finishLesson": {
      const lesson = LESSONS.find((l) => l.id === action.id);
      if (!lesson) return state;
      const practice = state.completed.includes(lesson.id);
      const today = localDay();
      const streak = state.lastDay === today ? state.streak : state.lastDay && dayDiff(state.lastDay, today) === 1 ? state.streak + 1 : 1;
      const completed = state.completed.includes(lesson.id) ? state.completed : [...state.completed, lesson.id];
      const road = ROADS.find((r) => r.id === lesson.road)!;
      const justFinishedRoad = roadDone(lesson.road, completed) && !state.stamps.includes(road.stamp);
      const statuses = { ...state.statuses };
      if (justFinishedRoad) {
        statuses[road.place] = "done";
        const nextRoad = ROADS.find((r) => !roadDone(r.id, completed));
        if (nextRoad) statuses[nextRoad.place] = "active";
      } else if (statuses[road.place] !== "done") {
        statuses[road.place] = "active";
      }
      return {
        ...state,
        completed,
        cowries: state.cowries + (practice ? Math.ceil(action.earned / 3) : action.earned),
        // Practising a finished lesson earns a cowrie back.
        lives: practice ? Math.min(MAX_LIVES, state.lives + 1) : state.lives,
        streak,
        lastDay: today,
        stamps: justFinishedRoad ? [road.stamp, ...state.stamps] : state.stamps,
        justStamped: justFinishedRoad ? road.stamp : null,
        statuses,
        selectedPlace: road.place,
        screen: justFinishedRoad ? "stamps" : "learn",
        lessonId: null,
      };
    }
    case "openEntry":
      return { ...state, screen: "entry", entryId: action.id, entryFrom: state.screen === "entry" ? state.entryFrom : state.screen };
    case "openChat":
      return { ...state, screen: "chat", chatGuide: action.guide, chatFrom: action.from, chatAsk: action.ask ?? null, chatAbout: action.about ?? null };
    case "chatAsked":
      return { ...state, chatAsk: null };
    case "openObject":
      return { ...state, screen: "object", objectId: action.id, objectFrom: state.screen === "object" || state.screen === "chat" || state.screen === "entry" || state.screen === "artifact" ? state.objectFrom : state.screen, seen: state.seen.includes(action.id) ? state.seen : [...state.seen, action.id] };
    case "openVertical":
      return { ...state, screen: "vertical", verticalId: action.id };
    case "openTour":
      return { ...state, screen: "tour", tour: state.tour?.id === action.id ? state.tour : { id: action.id, i: -1 } };
    case "startTour": {
      const t = tourById(action.id);
      if (!t) return state;
      const i = action.at ?? 0;
      const id = t.stops[i];
      return { ...state, tour: { id: t.id, i }, screen: "object", objectId: id, seen: state.seen.includes(id) ? state.seen : [...state.seen, id] };
    }
    case "tourStep": {
      const t = state.tour && tourById(state.tour.id);
      if (!t || !state.tour) return state;
      const i = state.tour.i + action.delta;
      if (i >= t.stops.length) return { ...state, screen: "tour", tour: { id: t.id, i: t.stops.length } };
      if (i < 0) return { ...state, screen: "tour" };
      const id = t.stops[i];
      return { ...state, tour: { id: t.id, i }, objectId: id, screen: "object", seen: state.seen.includes(id) ? state.seen : [...state.seen, id] };
    }
    case "endTour":
      return { ...state, tour: null, screen: "museum" };
    case "openArtifact":
      return { ...state, screen: "artifact", artifactFrom: action.from };
    case "clearStampFlash":
      return { ...state, justStamped: null };
    case "hydrate": {
      const next = { ...state, ...action.saved, screen: action.saved.onboarded ? ("map" as Screen) : state.screen };
      // A streak survives only if the last lesson was today or yesterday.
      if (next.lastDay && dayDiff(next.lastDay, localDay()) > 1) next.streak = 0;
      return next;
    }
    case "kioskReset":
      return { ...initialState, statuses: baseStatuses(), onboarded: true, screen: "museum" };
    case "reset":
      return { ...initialState, statuses: baseStatuses(), screen: "splash" };
    default:
      return state;
  }
}
