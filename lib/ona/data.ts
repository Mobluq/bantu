import type { EmblemName } from "./emblems";

export type GuideId =
  | "esu"
  | "osun"
  | "ogun"
  | "ala"
  | "orunmila"
  | "olokun"
  | "tsoede"
  | "bayajidda"
  | "woyengi"
  | "gizo"
  | "keeper";

export type Guide = {
  id: GuideId;
  name: string;
  people: string;
  domain: string;
  home: string;
  emblem: EmblemName;
  /** Card colour, emblem colour */
  tone: { bg: string; fg: string };
  greeting: string;
};

export const GUIDES: Guide[] = [
  {
    id: "esu",
    name: "Èṣù",
    people: "Yorùbá",
    domain: "crossroads, messages, chance",
    home: "Every crossroads",
    emblem: "esu",
    tone: { bg: "var(--color-brick)", fg: "var(--color-cream)" },
    greeting: "Ẹ kú àbọ̀, traveller. Every road in Nigeria passes my crossroads. What pulls you first?",
  },
  {
    id: "osun",
    name: "Ọ̀ṣun",
    people: "Yorùbá",
    domain: "sweet water, love, healing",
    home: "Òṣogbo grove",
    emblem: "osun",
    tone: { bg: "var(--color-forest)", fg: "var(--color-gold)" },
    greeting: "Come to my grove. I will teach you how Òṣogbo greets its elders.",
  },
  {
    id: "ogun",
    name: "Ògún",
    people: "Yorùbá",
    domain: "iron, roads, the work of hands",
    home: "Ìrè, Èkìtì",
    emblem: "ogun",
    tone: { bg: "var(--color-ink)", fg: "var(--color-gold)" },
    greeting: "I cut the first path through the forest. Walk it with me and learn the smiths.",
  },
  {
    id: "ala",
    name: "Ala",
    people: "Igbo",
    domain: "earth, morality, the harvest",
    home: "Every Igbo town",
    emblem: "ala",
    tone: { bg: "var(--color-indigo)", fg: "var(--color-cream)" },
    greeting: "The land keeps the rules. I will show you the ones Igbo towns still live by.",
  },
  {
    id: "bayajidda",
    name: "Bayajidda",
    people: "Hausa",
    domain: "the founding of the Hausa states",
    home: "Daura",
    emblem: "bayajidda",
    tone: { bg: "var(--color-ochre)", fg: "var(--color-ink)" },
    greeting: "I came to Daura thirsty and found a snake in the well. Hear how seven states began.",
  },
  {
    id: "woyengi",
    name: "Woyengi",
    people: "Ịjọ",
    domain: "creation, the choice of a life",
    home: "The Niger Delta",
    emblem: "woyengi",
    tone: { bg: "var(--color-clay)", fg: "var(--color-ink)" },
    greeting: "Before you were born you chose your life at my stool. Come and see the creeks.",
  },
  {
    id: "keeper",
    name: "The Keeper",
    people: "No deities",
    domain: "a plain-spoken archivist",
    home: "The almanac",
    emblem: "keeper",
    tone: { bg: "var(--color-paper)", fg: "var(--color-ink)" },
    greeting: "I keep the almanac. Same facts, no gods. Shall we start?",
  },
];

export const guideById = (id: GuideId) => GUIDES.find((g) => g.id === id) ?? GUIDES[0];

export type PlaceStatus = "done" | "active" | "open" | "hidden";
export type Culture = "yoruba" | "igbo" | "hausa" | "edo" | "efik" | "nupe" | "ijo" | "plateau" | "sukur";

export type Place = {
  id: string;
  name: string;
  people: string;
  culture: Culture;
  state: string;
  status: PlaceStatus;
  guide: GuideId;
  title: string;
  blurb: string;
  label: { dx: number; dy: number; anchor: "start" | "middle" | "end" };
};

export const PLACES: Place[] = [
  {
    id: "osogbo", name: "Òṣogbo", people: "Yorùbá", culture: "yoruba", state: "Ọ̀ṣun State", status: "active", guide: "osun",
    title: "Ọ̀ṣun’s river", blurb: "“Come to my grove. Today you learn how Òṣogbo greets its elders.”",
    label: { dx: -11, dy: 4, anchor: "end" },
  },
  {
    id: "ife", name: "Ilé-Ifẹ̀", people: "Yorùbá", culture: "yoruba", state: "Ọ̀ṣun State", status: "done", guide: "orunmila",
    title: "Where the world was spread", blurb: "In the Yorùbá telling, the first dry land was spread over the water here.",
    label: { dx: 9, dy: 12, anchor: "start" },
  },
  {
    id: "lagos", name: "Lagos", people: "Yorùbá", culture: "yoruba", state: "Lagos State", status: "done", guide: "esu",
    title: "Eyo day", blurb: "White-robed Eyo masquerades fill Lagos Island, broad hats low, palm-rib staffs in hand.",
    label: { dx: 2, dy: 15, anchor: "start" },
  },
  {
    id: "benin", name: "Benin City", people: "Edo", culture: "edo", state: "Edo State", status: "done", guide: "olokun",
    title: "Bronze and coral", blurb: "The brass casters’ guild, Igun Eronmwon, still works on Igun Street.",
    label: { dx: 0, dy: 15, anchor: "middle" },
  },
  {
    id: "nri", name: "Nri", people: "Igbo", culture: "igbo", state: "Anambra State", status: "open", guide: "ala",
    title: "The peace town", blurb: "Nri priests once travelled far to cleanse abominations and settle disputes.",
    label: { dx: 8, dy: 4, anchor: "start" },
  },
  {
    id: "calabar", name: "Calabar", people: "Efik", culture: "efik", state: "Cross River State", status: "open", guide: "keeper",
    title: "Nsibidi signs", blurb: "The Cross River region keeps nsibidi, an old system of signs.",
    label: { dx: 0, dy: -8, anchor: "middle" },
  },
  {
    id: "bida", name: "Bida", people: "Nupe", culture: "nupe", state: "Niger State", status: "open", guide: "tsoede",
    title: "Tsoede’s canoe", blurb: "Nupe tradition says Tsoede escaped down the Niger from Idah in a bronze canoe.",
    label: { dx: -8, dy: 4, anchor: "end" },
  },
  {
    id: "jos", name: "Jos", people: "Plateau peoples", culture: "plateau", state: "Plateau State", status: "hidden", guide: "keeper",
    title: "Nok terracottas", blurb: "",
    label: { dx: 8, dy: 4, anchor: "start" },
  },
  {
    id: "kano", name: "Kano", people: "Hausa", culture: "hausa", state: "Kano State", status: "hidden", guide: "gizo",
    title: "The dye pits of Kofar Mata", blurb: "",
    label: { dx: 8, dy: 4, anchor: "start" },
  },
  {
    id: "daura", name: "Daura", people: "Hausa", culture: "hausa", state: "Katsina State", status: "hidden", guide: "bayajidda",
    title: "The snake in the well", blurb: "",
    label: { dx: 8, dy: 4, anchor: "start" },
  },
  {
    id: "sukur", name: "Sukur", people: "Sukur", culture: "sukur", state: "Adamawa State", status: "hidden", guide: "keeper",
    title: "Stone paths of Sukur", blurb: "",
    label: { dx: -8, dy: 4, anchor: "end" },
  },
  {
    id: "nembe", name: "Nembe", people: "Ịjọ", culture: "ijo", state: "Bayelsa State", status: "hidden", guide: "woyengi",
    title: "Woyengi’s stool", blurb: "",
    label: { dx: -8, dy: 4, anchor: "end" },
  },
  {
    id: "argungu", name: "Argungu", people: "Hausa", culture: "hausa", state: "Kebbi State", status: "hidden", guide: "keeper",
    title: "The fishing festival", blurb: "",
    label: { dx: 8, dy: 4, anchor: "start" },
  },
];

export const TOTAL_PLACES = 36;

export type Tale = { teller: EmblemName; title: string; told: string; text: string; minutes: number };

/** Àlọ́: moonlight tales, keyed by culture. Missing cultures render an empty state. */
export const TALES: Partial<Record<Culture, Tale>> = {
  yoruba: {
    teller: "ijapa",
    title: "Ìjàpá’s sky feast",
    told: "told across Yorùbá and Igbo country",
    text: "The birds lend Tortoise their feathers for a feast in the sky. He eats more than his share and falls home. That is why his shell is cracked.",
    minutes: 6,
  },
  igbo: {
    teller: "ijapa",
    title: "Mbe takes a new name",
    told: "an Igbo telling",
    text: "Tortoise names himself ‘All of you’ before the feast, so every dish served ‘for all of you’ is his. The angry birds take back their feathers.",
    minutes: 5,
  },
  hausa: {
    teller: "gizo",
    title: "Gizo’s clever trouble",
    told: "a Hausa tatsuniya",
    text: "Gizo the spider schemes his way to a meal he did not earn, and his wife Koki is left to sort out the mess.",
    minutes: 5,
  },
};

export type LessonOption = { id: string; yo: string; gloss: string; correct: boolean; why: string };

export const LESSON = {
  number: 2,
  of: 5,
  topic: "Manners",
  language: "Yorùbá",
  title: ["Greet the", "elder."] as const,
  prompt: "It is morning in Òṣogbo. Your friend’s grandmother opens the door. What do you say?",
  options: [
    {
      id: "a", yo: "Ẹ káàárọ̀ mà", gloss: "“Good morning, ma”, then kneel or bow", correct: true,
      why: "“Ẹ” is the respectful “you”, and an elder always gets it. The body finishes the greeting: girls kneel (kúnlẹ̀), boys prostrate (dọ̀bálẹ̀).",
    },
    {
      id: "b", yo: "Báwo ni?", gloss: "“How’s it going?”, with a wave", correct: false,
      why: "Báwo ni is for friends your own age. To an elder it sounds careless. Reach for the respectful “Ẹ”.",
    },
    {
      id: "c", yo: "Ẹ kú alẹ́", gloss: "“Good evening”, standing", correct: false,
      why: "Respectful, but it is morning. Alẹ́ is evening; àárọ̀ is morning.",
    },
  ] satisfies LessonOption[],
};

export type StampDef = {
  id: string;
  title: string;
  sub: string;
  value: string;
  emblem: EmblemName;
  bg: string;
  fg: string;
  opens: "almanac" | "artifact" | null;
};

export const STAMPS: StampDef[] = [
  { id: "osogbo", title: "Ọ̀ṣun-Òṣogbo Grove", sub: "UNESCO site · 2005", value: "₦15", emblem: "osun", bg: "var(--color-gold)", fg: "var(--color-brick)", opens: "almanac" },
  { id: "ife", title: "The Ifẹ̀ head", sub: "Ilé-Ifẹ̀ · copper alloy", value: "₦20", emblem: "ife", bg: "var(--color-clay)", fg: "var(--color-ink)", opens: "artifact" },
  { id: "lagos", title: "Eyo masquerade", sub: "Lagos Island", value: "₦10", emblem: "eyo", bg: "var(--color-paper)", fg: "var(--color-ink)", opens: null },
  { id: "benin", title: "Benin bronzes", sub: "Benin City · Edo", value: "₦25", emblem: "benin", bg: "var(--color-ochre)", fg: "var(--color-ink)", opens: null },
];

export const GREETINGS = ["Ẹ kú àbọ̀", "Nnọọ", "Barka da zuwa", "Welcome", "Ẹ kú àbọ̀", "Nnọọ", "Sannu da zuwa"];

export const INTERESTS = ["Myths & gods", "Language", "Food & markets", "Festivals", "Music", "Crafts"];

export const ALMANAC_ESU = {
  number: "001",
  name: "Èṣù",
  full: "Èṣù-Ẹlẹ́gbára, messenger of the crossroads",
  nigeria: [
    ["People", "Yorùbá, south-west Nigeria"],
    ["Domain", "Crossroads, messages, chance, the marketplace"],
    ["Colours", "Red and black"],
    ["Receives", "A share of every offering, carried to the other òrìṣà"],
  ] as [string, string][],
  atlantic: [
    ["Brazil", "Exu, in Candomblé"],
    ["Cuba", "Eleguá, in Santería (Lucumí)"],
    ["Haiti", "Papa Legba, in Vodou, from the Fon Legba"],
    ["Carried by", "People enslaved from Yorùbá and Fon lands. The names changed; the crossroads stayed."],
  ] as [string, string][],
  story: {
    title: "The cap of two colours",
    body: "ṣù walked the path between two friends’ farms wearing a cap of a different colour on each side. Each friend swore the stranger’s cap was the colour he had seen, and the friendship broke over it.",
    moral: "Look from both sides of the road before you argue about what you saw.",
  },
  note: "Early Yorùbá Bible translations used “Èṣù” for Satan, and the label stuck. In Yorùbá thought he is the messenger and trickster, neither good nor evil.",
  related: ["Ọ̀rúnmìlà", "Ifá divination", "Market days", "Legba"],
};
