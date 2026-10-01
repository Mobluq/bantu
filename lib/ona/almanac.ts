import type { EmblemName } from "./emblems";

/**
 * Almanac entries. Drafts for advisor review: each entry ships only with a named reviewer.
 * Contested or variant stories say so in the text.
 */

export type Category = "Òrìṣà" | "Igbo deity" | "Founder" | "Trickster" | "Water spirit" | "Creator";

export type Entry = {
  id: string;
  number: string;
  name: string;
  full: string;
  people: string;
  category: Category;
  emblem: EmblemName;
  tone: { bg: string; fg: string };
  rows: [string, string][];
  abroad?: [string, string][];
  story?: { title: string; body: string; moral?: string };
  note?: { title: string; body: string };
  related: string[];
};

const BRICK = { bg: "var(--color-brick)", fg: "var(--color-cream)" };
const FOREST = { bg: "var(--color-forest)", fg: "var(--color-gold)" };
const INK = { bg: "var(--color-ink)", fg: "var(--color-gold)" };
const INDIGO = { bg: "var(--color-indigo)", fg: "var(--color-cream)" };
const OCHRE = { bg: "var(--color-ochre)", fg: "var(--color-ink)" };
const CLAY = { bg: "var(--color-clay)", fg: "var(--color-ink)" };
const NIGHT = { bg: "var(--color-night)", fg: "var(--color-gold)" };

export const ENTRIES: Entry[] = [
  {
    id: "esu", number: "001", name: "Èṣù", full: "Èṣù-Ẹlẹ́gbára, messenger of the crossroads", people: "Yorùbá", category: "Òrìṣà",
    emblem: "esu", tone: BRICK,
    rows: [
      ["Domain", "Crossroads, messages, chance, the marketplace"],
      ["Colours", "Red and black"],
      ["Receives", "A share of every offering, carried to the other òrìṣà"],
    ],
    abroad: [
      ["Brazil", "Exu, in Candomblé"],
      ["Cuba", "Eleguá, in Santería (Lucumí)"],
      ["Haiti", "Papa Legba, in Vodou, from the Fon Legba"],
    ],
    story: {
      title: "The cap of two colours",
      body: "Èṣù walked the path between two friends’ farms wearing a cap of a different colour on each side. Each friend swore the stranger’s cap was the colour he had seen, and the friendship broke over it.",
      moral: "Look from both sides of the road before you argue about what you saw.",
    },
    note: { title: "Not the devil.", body: "Early Yorùbá Bible translations used “Èṣù” for Satan, and the label stuck. In Yorùbá thought he is the messenger and trickster, neither good nor evil." },
    related: ["orunmila", "osun", "ijapa"],
  },
  {
    id: "osun", number: "002", name: "Ọ̀ṣun", full: "Ọ̀ṣun, of sweet water", people: "Yorùbá", category: "Òrìṣà",
    emblem: "osun", tone: FOREST,
    rows: [
      ["Domain", "Rivers, sweet water, love, fertility, healing"],
      ["Colours", "Yellow and gold"],
      ["Symbols", "Brass, honey, the fan (abẹ̀bẹ̀), the mirror"],
      ["Home", "The Ọ̀ṣun-Òṣogbo Sacred Grove, UNESCO site since 2005"],
    ],
    abroad: [
      ["Brazil", "Oxum, in Candomblé"],
      ["Cuba", "Ochún, linked with the Virgen de la Caridad del Cobre"],
    ],
    story: {
      title: "The one they left out",
      body: "When the òrìṣà first came to earth, the male deities met without Ọ̀ṣun. Nothing they did would work until they went back and gave her a place. Versions differ between tellers.",
      moral: "Work that shuts people out does not prosper.",
    },
    related: ["yemoja", "sango", "esu"],
  },
  {
    id: "ogun", number: "003", name: "Ògún", full: "Ògún, who cleared the first path", people: "Yorùbá", category: "Òrìṣà",
    emblem: "ogun", tone: INK,
    rows: [
      ["Domain", "Iron, tools, hunting, war, roads, technology"],
      ["Followers", "Smiths, hunters, drivers, mechanics"],
      ["Home", "Ìrè-Èkìtì"],
    ],
    abroad: [
      ["Brazil", "Ogum, in Candomblé"],
      ["Cuba", "Ogún, in Santería (Lucumí)"],
    ],
    story: {
      title: "The cutlass in the forest",
      body: "When the òrìṣà came down to earth, a forest blocked their way. Only Ògún had iron. He cut the path the others walked, which is why every road, and everyone who travels it, owes him.",
    },
    related: ["sango", "orunmila", "esu"],
  },
  {
    id: "orunmila", number: "004", name: "Ọ̀rúnmìlà", full: "Ọ̀rúnmìlà, witness of destiny", people: "Yorùbá", category: "Òrìṣà",
    emblem: "orunmila", tone: OCHRE,
    rows: [
      ["Domain", "Wisdom, divination, destiny"],
      ["Practice", "Ifá divination, read by babaláwo priests"],
      ["Corpus", "256 odù, each holding many verses"],
      ["Recognition", "Ifá was proclaimed a UNESCO Masterpiece of Oral and Intangible Heritage in 2005"],
    ],
    story: {
      title: "The witness",
      body: "Ọ̀rúnmìlà is called Ẹlẹ́rìí ìpín, “witness of destiny”: he was present when each person chose their lot before birth, so his oracle can say what that choice was.",
    },
    related: ["esu", "obatala", "ogun"],
  },
  {
    id: "sango", number: "005", name: "Ṣàngó", full: "Ṣàngó, of thunder", people: "Yorùbá", category: "Òrìṣà",
    emblem: "sango", tone: { bg: "var(--color-brick)", fg: "var(--color-paper)" },
    rows: [
      ["Domain", "Thunder, lightning, justice, kingship"],
      ["Colours", "Red and white"],
      ["Symbol", "The double-headed axe (oṣé)"],
      ["History", "Remembered as the third Aláàfin (king) of Ọ̀yọ́, deified after his death"],
    ],
    abroad: [
      ["Brazil", "Xangô, in Candomblé"],
      ["Cuba", "Changó, in Santería (Lucumí)"],
    ],
    related: ["osun", "ogun", "yemoja"],
  },
  {
    id: "yemoja", number: "006", name: "Yemọja", full: "Yemọja, mother whose children are fish", people: "Yorùbá", category: "Water spirit",
    emblem: "olokun", tone: INDIGO,
    rows: [
      ["Domain", "Motherhood, waters, protection of children"],
      ["River", "The Ògùn River, in south-west Nigeria"],
      ["Name", "From “yèyé ọmọ ẹja”, mother whose children are fish"],
    ],
    abroad: [
      ["Brazil", "Iemanjá, honoured at the sea on 2 February in Salvador"],
      ["Cuba", "Yemayá, of the ocean"],
    ],
    note: { title: "A river at home, an ocean abroad.", body: "In Nigeria Yemọja belongs to a river. Carried across the Atlantic, she became the sea itself." },
    related: ["osun", "olokun", "mami-wata"],
  },
  {
    id: "obatala", number: "007", name: "Ọbàtálá", full: "Ọbàtálá, king of the white cloth", people: "Yorùbá", category: "Òrìṣà",
    emblem: "woyengi", tone: { bg: "var(--color-paper)", fg: "var(--color-ink)" },
    rows: [
      ["Domain", "Creation of human bodies, purity, patience"],
      ["Colour", "White"],
      ["Taboo", "Palm wine, in many traditions"],
    ],
    story: {
      title: "The palm wine",
      body: "Ọbàtálá was given the task of shaping human bodies. In one widely told version he drank palm wine as he worked and shaped some people differently, so he became their protector and gave up the wine. In the Ifẹ̀ creation story, versions differ on who spread the first land: Ọbàtálá or Odùduwà.",
    },
    related: ["orunmila", "ogun", "chukwu"],
  },
  {
    id: "ala", number: "008", name: "Ala", full: "Ala, the earth that keeps the rules", people: "Igbo", category: "Igbo deity",
    emblem: "ala", tone: INDIGO,
    rows: [
      ["Domain", "Earth, morality, fertility, the harvest, the dead"],
      ["Taboos", "Offences against the land are nsọ ala"],
      ["Art", "Mbari houses of painted clay sculpture, built in her honour around Owerri"],
      ["Sign", "The crescent moon; in some communities the python is sacred"],
    ],
    story: {
      title: "Built to return",
      body: "An mbari house took months to build and was filled with sculptures of everyday life, gods and strangers alike. Once finished, it was left to weather back into the earth it was made for.",
    },
    related: ["amadioha", "chukwu", "ikenga"],
  },
  {
    id: "amadioha", number: "009", name: "Amadioha", full: "Amadioha, the thunder of justice", people: "Igbo", category: "Igbo deity",
    emblem: "sango", tone: BRICK,
    rows: [
      ["Domain", "Thunder, lightning, justice"],
      ["Called on", "To expose and punish wrongdoers"],
      ["Animal", "The white ram, in many communities"],
    ],
    related: ["ala", "chukwu", "sango"],
  },
  {
    id: "chukwu", number: "010", name: "Chukwu", full: "Chukwu, the great spirit", people: "Igbo", category: "Creator",
    emblem: "keeper", tone: { bg: "var(--color-paper)", fg: "var(--color-ink)" },
    rows: [
      ["Role", "The supreme being and creator, also called Chineke"],
      ["Approached", "Through lesser deities, spirits and ancestors"],
      ["Oracle", "Ibini Ukpabi at Arochukwu, destroyed in the Anglo-Aro war of 1901–02"],
    ],
    related: ["ala", "amadioha", "ikenga"],
  },
  {
    id: "ikenga", number: "011", name: "Ikenga", full: "Ikenga, the strength of the right hand", people: "Igbo", category: "Igbo deity",
    emblem: "ikenga", tone: OCHRE,
    rows: [
      ["Domain", "Personal achievement, effort, success"],
      ["Form", "A carved wooden figure with ram’s horns"],
      ["Owner", "Kept by an individual, often a man of standing"],
    ],
    story: {
      title: "Horns forward",
      body: "The ram charges head first, so its horns stand for will and drive. A person’s ikenga is their own shrine to the work of their right hand.",
    },
    related: ["ala", "chukwu", "amadioha"],
  },
  {
    id: "bayajidda", number: "012", name: "Bayajidda", full: "Bayajidda, the stranger at the well", people: "Hausa", category: "Founder",
    emblem: "bayajidda", tone: OCHRE,
    rows: [
      ["Story", "Kills the snake guarding Daura’s Kusugu well"],
      ["Marries", "Queen Daurama of Daura"],
      ["Legacy", "Founder of the Hausa Bakwai, the seven Hausa states, in legend"],
    ],
    story: {
      title: "Water on any day",
      body: "The well snake let Daura draw water only on Fridays. Bayajidda killed it with his sword and kept its head as proof. The queen married him, and their line founded the Hausa states.",
      moral: "Historians read it as a memory of change in Daura, not a record.",
    },
    related: ["amina", "gizo", "tsoede"],
  },
  {
    id: "amina", number: "013", name: "Amina", full: "Queen Amina of Zazzau", people: "Hausa", category: "Founder",
    emblem: "amina", tone: INK,
    rows: [
      ["Era", "16th century, in the most common accounts"],
      ["Kingdom", "Zazzau, today’s Zaria"],
      ["Known for", "Military campaigns and the earthen city walls called ganuwar Amina"],
    ],
    note: { title: "Legend and record.", body: "Her dates and deeds come mainly from later chronicles and oral history, and historians still debate them." },
    related: ["bayajidda", "tsoede"],
  },
  {
    id: "tsoede", number: "014", name: "Tsoede", full: "Tsoede, founder of the Nupe kingdom", people: "Nupe", category: "Founder",
    emblem: "tsoede", tone: CLAY,
    rows: [
      ["Also", "Edegi"],
      ["Story", "Son of the Attah of Igala and a Nupe mother; escaped up the Niger from Idah in a bronze canoe"],
      ["Objects", "The Tsoede bronzes, kept at Tada and Jebba"],
    ],
    related: ["bayajidda", "amina"],
  },
  {
    id: "woyengi", number: "015", name: "Woyengi", full: "Woyengi, mother of creation", people: "Ịjọ", category: "Creator",
    emblem: "woyengi", tone: CLAY,
    rows: [
      ["Story", "Came down with a chair, a table and the Creation Stone"],
      ["Creation", "Shaped people from earth and breathed life into them"],
      ["Destiny", "Let each person choose their life and gift before birth"],
    ],
    story: {
      title: "Choose your life",
      body: "Woyengi asked every person she made to choose the life they would lead. Whatever they chose, she granted, and it could not be undone. That is why Ịjọ stories say your fate is your own choosing.",
    },
    related: ["orunmila", "olokun", "mami-wata"],
  },
  {
    id: "olokun", number: "016", name: "Olókun", full: "Olókun, of the deep water", people: "Edo and Yorùbá", category: "Water spirit",
    emblem: "olokun", tone: NIGHT,
    rows: [
      ["Domain", "The sea, wealth, children, beauty"],
      ["Benin", "Son of the creator Osanobua in Edo tradition; shrines kept white with chalk"],
      ["Yorùbá", "An òrìṣà of the deep ocean"],
    ],
    related: ["yemoja", "mami-wata", "woyengi"],
  },
  {
    id: "mami-wata", number: "017", name: "Mami Wata", full: "Mami Wata, the water spirit", people: "Across West and Central Africa", category: "Water spirit",
    emblem: "olokun", tone: FOREST,
    rows: [
      ["Domain", "Wealth, beauty, healing, danger"],
      ["Image", "Often shown as a woman with a fish tail, or charming snakes"],
      ["Source", "Her familiar image draws on a 19th-century European poster of a snake charmer, as art historians have traced"],
    ],
    related: ["yemoja", "olokun"],
  },
  {
    id: "ijapa", number: "018", name: "Ìjàpá", full: "Ìjàpá, the tortoise", people: "Yorùbá", category: "Trickster",
    emblem: "ijapa", tone: { bg: "var(--color-gold)", fg: "var(--color-night)" },
    rows: [
      ["Told in", "Àlọ́, moonlight folktales"],
      ["Cousins", "Mbe the tortoise in Igbo tales; Gizo the spider in Hausa tales"],
      ["Lesson", "Greed and cleverness, usually punished in the end"],
    ],
    story: {
      title: "Why the shell is cracked",
      body: "The birds lend Tortoise feathers for a feast in the sky. He eats more than his share, the birds take their feathers back, and he falls home. His shell still shows the cracks.",
    },
    related: ["gizo", "esu"],
  },
  {
    id: "gizo", number: "019", name: "Gizo", full: "Gizo, the spider", people: "Hausa", category: "Trickster",
    emblem: "gizo", tone: OCHRE,
    rows: [
      ["Told in", "Tatsuniya, Hausa folktales"],
      ["Partner", "His wife Koki, a regular in his stories"],
      ["Cousins", "Ananse the spider of the Akan; Ìjàpá the Yorùbá tortoise"],
    ],
    related: ["ijapa", "bayajidda"],
  },
];

export const entryById = (id: string) => ENTRIES.find((e) => e.id === id);
export const CATEGORIES: Category[] = ["Òrìṣà", "Igbo deity", "Founder", "Trickster", "Water spirit", "Creator"];

export type Festival = { id: string; name: string; place: string; people: string; when: string; months: number[]; text: string };

/** Months are typical windows. Several festivals move with the lunar Islamic calendar or are announced locally each year. */
export const FESTIVALS: Festival[] = [
  { id: "argungu", name: "Argungu Fishing Festival", place: "Argungu, Kebbi", people: "Hausa", when: "Feb to Mar, in years it is held", months: [2, 3], text: "Thousands of fishers enter the Matan Fada river at once with hand nets and calabashes." },
  { id: "osun", name: "Ọ̀ṣun-Òṣogbo Festival", place: "Òṣogbo, Ọ̀ṣun State", people: "Yorùbá", when: "August", months: [8], text: "About two weeks of rites ending with the Arugba carrying the votive calabash to the river." },
  { id: "sango", name: "Ṣàngó Festival", place: "Ọ̀yọ́", people: "Yorùbá", when: "August", months: [8], text: "Ọ̀yọ́ honours Ṣàngó, its deified king, with drumming, dance and rites at his shrine." },
  { id: "newyam", name: "New Yam Festival (Iri Ji)", place: "Across Igboland", people: "Igbo", when: "Aug to Oct", months: [8, 9, 10], text: "Thanks for the harvest. The first yams are offered before anyone eats from the new crop." },
  { id: "ofala", name: "Ofala", place: "Onitsha and other Igbo kingdoms", people: "Igbo", when: "Usually October in Onitsha", months: [10], text: "The Obi comes out in full regalia to receive his people and his chiefs." },
  { id: "olojo", name: "Olojo Festival", place: "Ilé-Ifẹ̀", people: "Yorùbá", when: "Usually October", months: [10], text: "The Ọọ̀ni appears wearing the Arè crown; the festival honours Ògún and the first dawn." },
  { id: "igue", name: "Igue Festival", place: "Benin City", people: "Edo", when: "December", months: [12], text: "The Oba’s festival of blessing and renewal at the close of the year." },
  { id: "calabar", name: "Calabar Carnival", place: "Calabar", people: "Efik and visitors", when: "December", months: [12], text: "A month-long street carnival, held since 2004." },
  { id: "durbar", name: "Durbar", place: "Kano, Katsina, Zaria, Bida", people: "Hausa and Nupe", when: "At Sallah (Eid), moves each year", months: [], text: "Horsemen in bright robes ride in procession to salute the emir." },
  { id: "ojude", name: "Ojude Oba", place: "Ìjẹ̀bú-Òde", people: "Yorùbá", when: "Third day after Eid al-Adha, moves each year", months: [], text: "Age-grade groups and horsemen parade in their best to pay homage to the Awùjalẹ̀." },
  { id: "eyo", name: "Eyo", place: "Lagos Island", people: "Yorùbá (Lagos)", when: "No fixed date", months: [], text: "Held on special occasions, often to honour a departed oba or chief. White-robed masquerades fill the island." },
];

export const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
