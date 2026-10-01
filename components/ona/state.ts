import type { GuideId, PlaceStatus } from "@/lib/ona/data";
import { PLACES } from "@/lib/ona/data";

export type Screen = "splash" | "onboarding" | "guides" | "map" | "lesson" | "artifact" | "stamps" | "almanac" | "me";

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
};

/** The slice of state worth keeping between visits. */
export type SavedState = Pick<OnaState, "interests" | "guide" | "lives" | "cowries" | "streak" | "stamps" | "statuses" | "onboarded" | "selectedPlace">;

export const initialState: OnaState = {
  screen: "splash",
  interests: ["Myths & gods", "Food & markets"],
  guide: "osun",
  night: false,
  selectedPlace: "osogbo",
  lives: 4,
  cowries: 240,
  streak: 7,
  stamps: ["ife", "lagos", "benin"],
  justStamped: null,
  statuses: Object.fromEntries(PLACES.map((p) => [p.id, p.status])),
  onboarded: false,
};

export type Action =
  | { type: "go"; screen: Screen }
  | { type: "toggleInterest"; interest: string }
  | { type: "pickGuide"; guide: GuideId }
  | { type: "setNight"; night: boolean }
  | { type: "selectPlace"; id: string }
  | { type: "answer"; correct: boolean }
  | { type: "completeLesson" }
  | { type: "clearStampFlash" }
  | { type: "hydrate"; saved: Partial<SavedState> }
  | { type: "reset" };

export function reducer(state: OnaState, action: Action): OnaState {
  switch (action.type) {
    case "go":
      return { ...state, screen: action.screen, onboarded: state.onboarded || action.screen === "map" };
    case "hydrate":
      return { ...state, ...action.saved, screen: action.saved.onboarded ? "map" : state.screen };
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
    case "answer":
      return action.correct
        ? { ...state, cowries: state.cowries + 10 }
        : { ...state, lives: Math.max(0, state.lives - 1) };
    case "completeLesson":
      if (state.stamps.includes("osogbo")) return { ...state, screen: "stamps" };
      return {
        ...state,
        screen: "stamps",
        stamps: ["osogbo", ...state.stamps],
        justStamped: "osogbo",
        streak: state.streak + 1,
        statuses: { ...state.statuses, osogbo: "done", nri: "active" },
        selectedPlace: "nri",
      };
    case "clearStampFlash":
      return { ...state, justStamped: null };
    case "reset":
      return { ...initialState, screen: "splash" };
    default:
      return state;
  }
}
