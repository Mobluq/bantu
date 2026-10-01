import type { GuideId, PlaceStatus } from "@/lib/ona/data";
import { PLACES } from "@/lib/ona/data";
import { LESSONS, ROADS, lessonsForRoad, type RoadId } from "@/lib/ona/roads";

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
  | "me";

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
};

/** The slice of state worth keeping between visits. */
export type SavedState = Pick<
  OnaState,
  "interests" | "guide" | "lives" | "cowries" | "streak" | "stamps" | "statuses" | "onboarded" | "selectedPlace" | "completed" | "road"
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
  lives: 5,
  cowries: 240,
  streak: 7,
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
  | { type: "refill" }
  | { type: "finishLesson"; id: string; earned: number }
  | { type: "openEntry"; id: string }
  | { type: "openChat"; guide: GuideId; from: Screen }
  | { type: "clearStampFlash" }
  | { type: "hydrate"; saved: Partial<SavedState> }
  | { type: "reset" };

/** The next lesson to take on a road: the first not yet completed. */
export const nextLesson = (road: RoadId, completed: string[]) => lessonsForRoad(road).find((l) => !completed.includes(l.id)) ?? null;

export const roadDone = (road: RoadId, completed: string[]) => lessonsForRoad(road).every((l) => completed.includes(l.id));

export function reducer(state: OnaState, action: Action): OnaState {
  switch (action.type) {
    case "go":
      return { ...state, screen: action.screen, onboarded: state.onboarded || action.screen === "map" };
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
    case "answer":
      return action.correct ? state : { ...state, lives: Math.max(0, state.lives - 1) };
    case "refill":
      return { ...state, lives: 5 };
    case "finishLesson": {
      const lesson = LESSONS.find((l) => l.id === action.id);
      if (!lesson) return state;
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
        cowries: state.cowries + action.earned,
        streak: state.completed.length === 0 ? state.streak + 1 : state.streak,
        stamps: justFinishedRoad ? [road.stamp, ...state.stamps] : state.stamps,
        justStamped: justFinishedRoad ? road.stamp : null,
        statuses,
        selectedPlace: road.place,
        screen: justFinishedRoad ? "stamps" : "learn",
        lessonId: null,
      };
    }
    case "openEntry":
      return { ...state, screen: "entry", entryId: action.id };
    case "openChat":
      return { ...state, screen: "chat", chatGuide: action.guide, chatFrom: action.from };
    case "clearStampFlash":
      return { ...state, justStamped: null };
    case "hydrate":
      return { ...state, ...action.saved, screen: action.saved.onboarded ? "map" : state.screen };
    case "reset":
      return { ...initialState, statuses: baseStatuses(), screen: "splash" };
    default:
      return state;
  }
}
