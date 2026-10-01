import type { GuideId } from "./data";

/**
 * Lesson content. Every step is one screen in the lesson player.
 * Facts here are drafts for advisor review: nothing ships to production without a named reviewer.
 */

export type ChoiceOption = { id: string; text: string; sub?: string; correct: boolean };

export type Step =
  | { kind: "fact"; title: string; body: string; examples?: { term: string; meaning: string }[] }
  | { kind: "choose"; prompt: string; options: ChoiceOption[]; right: string; wrong: string }
  | { kind: "match"; prompt: string; pairs: [string, string][] }
  | { kind: "order"; prompt: string; words: string[]; meaning: string };

export type Lesson = {
  id: string;
  road: RoadId;
  n: number;
  title: [string, string];
  topic: string;
  minutes: number;
  steps: Step[];
};

export type RoadId = "yoruba" | "igbo" | "hausa";

export type Road = {
  id: RoadId;
  name: string;
  people: string;
  language: string;
  guide: GuideId;
  place: string;
  stamp: string;
  blurb: string;
};

export const ROADS: Road[] = [
  {
    id: "yoruba",
    name: "Ọ̀ṣun’s river",
    people: "Yorùbá",
    language: "Yorùbá",
    guide: "osun",
    place: "osogbo",
    stamp: "osogbo",
    blurb: "Greetings, thanks and respect, then the grove at Òṣogbo and the stories of its river.",
  },
  {
    id: "igbo",
    name: "Ala’s land",
    people: "Igbo",
    language: "Igbo",
    guide: "ala",
    place: "nri",
    stamp: "nri",
    blurb: "Welcome and kola, the four market days, the earth goddess, and Nri, the peace town.",
  },
  {
    id: "hausa",
    name: "Bayajidda’s well",
    people: "Hausa",
    language: "Hausa",
    guide: "bayajidda",
    place: "daura",
    stamp: "daura",
    blurb: "Greetings that take their time, the snake in the well at Daura, seven states, and Kano’s indigo.",
  },
];

export const roadById = (id: RoadId) => ROADS.find((r) => r.id === id) ?? ROADS[0];

export const LESSONS: Lesson[] = [
  // ───────────────────────── Yorùbá: Ọ̀ṣun’s river ─────────────────────────
  {
    id: "yo-1",
    road: "yoruba",
    n: 1,
    title: ["Three", "tones."],
    topic: "Sound",
    minutes: 3,
    steps: [
      {
        kind: "fact",
        title: "The marks are the music",
        body: "Yorùbá is a tonal language with three tones: high (á), mid (a) and low (à). The same letters with different tones are different words.",
        examples: [
          { term: "ọkọ", meaning: "husband" },
          { term: "ọkọ́", meaning: "hoe" },
          { term: "ọkọ̀", meaning: "vehicle, boat" },
        ],
      },
      {
        kind: "choose",
        prompt: "You need a ride across the river. Which word do you want?",
        options: [
          { id: "a", text: "ọkọ̀", sub: "low tone on the last syllable", correct: true },
          { id: "b", text: "ọkọ́", sub: "high tone on the last syllable", correct: false },
          { id: "c", text: "ọkọ", sub: "mid tones", correct: false },
        ],
        right: "Ọkọ̀ is a vehicle or a boat. Ask for ọkọ́ and you will be handed a hoe.",
        wrong: "Listen to the last syllable. The low tone, ọkọ̀, is the vehicle.",
      },
      {
        kind: "match",
        prompt: "Match each greeting to its time of day.",
        pairs: [
          ["Ẹ káàárọ̀", "Morning"],
          ["Ẹ káàsán", "Afternoon"],
          ["Ẹ kú alẹ́", "Evening"],
        ],
      },
      {
        kind: "order",
        prompt: "Build the welcome Èṣù gave you at the crossroads.",
        words: ["Ẹ", "kú", "àbọ̀"],
        meaning: "Welcome (said to someone arriving)",
      },
    ],
  },
  {
    id: "yo-2",
    road: "yoruba",
    n: 2,
    title: ["Greet the", "elder."],
    topic: "Manners",
    minutes: 4,
    steps: [
      {
        kind: "choose",
        prompt: "It is morning in Òṣogbo. Your friend’s grandmother opens the door. What do you say?",
        options: [
          { id: "a", text: "Ẹ káàárọ̀ mà", sub: "“Good morning, ma”, then kneel or bow", correct: true },
          { id: "b", text: "Báwo ni?", sub: "“How’s it going?”, with a wave", correct: false },
          { id: "c", text: "Ẹ kú alẹ́", sub: "“Good evening”, standing", correct: false },
        ],
        right: "“Ẹ” is the respectful “you”, and an elder always gets it. The body finishes the greeting.",
        wrong: "Báwo ni is for friends your own age, and alẹ́ is evening. Reach for the respectful “Ẹ”.",
      },
      {
        kind: "fact",
        title: "The body finishes the greeting",
        body: "Traditionally, girls and women kneel (kúnlẹ̀) to greet an elder, and boys and men prostrate (dọ̀bálẹ̀). Many families now accept a deep bow, but the gesture still matters.",
      },
      {
        kind: "choose",
        prompt: "Now your friend, the same age as you, walks in. What do you say?",
        options: [
          { id: "a", text: "Káàárọ̀", sub: "the greeting without “Ẹ”", correct: true },
          { id: "b", text: "Ẹ káàárọ̀ mà", sub: "the full respectful form", correct: false },
        ],
        right: "Between equals the respectful “Ẹ” drops away. Using it with a friend sounds oddly formal.",
        wrong: "That form is for elders. Between friends, plain Káàárọ̀ is right.",
      },
    ],
  },
  {
    id: "yo-3",
    road: "yoruba",
    n: 3,
    title: ["Thank you,", "properly."],
    topic: "Manners",
    minutes: 3,
    steps: [
      {
        kind: "fact",
        title: "Two kinds of thanks",
        body: "Thanks follows the same rule as greetings: “Ẹ” for an elder or someone you respect, “O” for a friend or someone younger.",
        examples: [
          { term: "Ẹ ṣé", meaning: "thank you (respectful)" },
          { term: "O ṣé", meaning: "thank you (to a friend)" },
          { term: "O dàbọ̀", meaning: "goodbye" },
        ],
      },
      {
        kind: "match",
        prompt: "Match each phrase to when you would use it.",
        pairs: [
          ["Ẹ ṣé", "An aunt hands you food"],
          ["O ṣé", "A classmate lends you a pen"],
          ["O dàbọ̀", "You are leaving"],
        ],
      },
      {
        kind: "choose",
        prompt: "The market woman adds an extra orange to your bag for free. You say:",
        options: [
          { id: "a", text: "Ẹ ṣé mà", sub: "respectful thanks", correct: true },
          { id: "b", text: "O ṣé", sub: "casual thanks", correct: false },
        ],
        right: "She is your elder and gave you something extra: respectful thanks, with “mà” for a woman.",
        wrong: "She is your elder. Use the respectful “Ẹ ṣé”.",
      },
    ],
  },
  {
    id: "yo-4",
    road: "yoruba",
    n: 4,
    title: ["The", "grove."],
    topic: "Place",
    minutes: 4,
    steps: [
      {
        kind: "fact",
        title: "A forest beside the river",
        body: "The Ọ̀ṣun-Òṣogbo Sacred Grove is one of the last stretches of primary high forest in southern Nigeria, on the edge of Òṣogbo. UNESCO listed it as a World Heritage Site in 2005.",
      },
      {
        kind: "fact",
        title: "Artists who saved it",
        body: "From the 1950s the Austrian-born artist Susanne Wenger, known as Adunni Olorisha, worked with local artists of the New Sacred Art movement to restore the shrines and fill the grove with new sculpture.",
      },
      {
        kind: "choose",
        prompt: "At the August festival, who carries the sacred calabash from the palace to the river?",
        options: [
          { id: "a", text: "The Arugba", sub: "a young maiden chosen for the role", correct: true },
          { id: "b", text: "The Ataója", sub: "the king of Òṣogbo", correct: false },
          { id: "c", text: "The oldest priestess", sub: "", correct: false },
        ],
        right: "The Arugba, a young maiden, carries the calabash of offerings, and the crowd follows her to the river.",
        wrong: "The Ataója is the king and takes part, but the calabash is carried by the Arugba, a young maiden.",
      },
      {
        kind: "choose",
        prompt: "In what year did UNESCO list the grove?",
        options: [
          { id: "a", text: "2005", correct: true },
          { id: "b", text: "1960", correct: false },
          { id: "c", text: "1999", correct: false },
        ],
        right: "2005. 1999 was Sukur, Nigeria’s first World Heritage Site.",
        wrong: "It was 2005. Nigeria’s first site, Sukur, was listed in 1999.",
      },
    ],
  },
  {
    id: "yo-5",
    road: "yoruba",
    n: 5,
    title: ["The one they", "left out."],
    topic: "Story",
    minutes: 4,
    steps: [
      {
        kind: "fact",
        title: "Sweet water",
        body: "Ọ̀ṣun is the òrìṣà of the river that carries her name, of sweet water, love, fertility and healing. Her colours are yellow and gold; brass, honey and the fan (abẹ̀bẹ̀) belong to her.",
      },
      {
        kind: "fact",
        title: "A story from the Ifá verses",
        body: "When the òrìṣà first came to earth, the male deities met without Ọ̀ṣun. Nothing they did would work: the rain stopped and the land failed. Only when they went back and gave her a place did things flourish. Versions differ from one telling to the next.",
      },
      {
        kind: "choose",
        prompt: "In the story, why did the other òrìṣà fail?",
        options: [
          { id: "a", text: "They left Ọ̀ṣun out", correct: true },
          { id: "b", text: "Èṣù hid the rain", correct: false },
          { id: "c", text: "They forgot the river’s name", correct: false },
        ],
        right: "They left her out. The lesson many tellers draw: work that shuts out women does not prosper.",
        wrong: "It was because they left Ọ̀ṣun out of their councils.",
      },
      {
        kind: "match",
        prompt: "Match what belongs to Ọ̀ṣun.",
        pairs: [
          ["Colour", "Yellow and gold"],
          ["Metal", "Brass"],
          ["Held in hand", "A fan (abẹ̀bẹ̀)"],
        ],
      },
    ],
  },

  // ───────────────────────── Igbo: Ala’s land ─────────────────────────
  {
    id: "ig-1",
    road: "igbo",
    n: 1,
    title: ["Nnọọ,", "welcome."],
    topic: "Greetings",
    minutes: 3,
    steps: [
      {
        kind: "fact",
        title: "Igbo is tonal too",
        body: "Igbo uses high and low tones, usually unmarked in everyday writing. The dots under ị, ọ and ụ are not tones: they mark different vowels.",
        examples: [
          { term: "Nnọọ", meaning: "welcome" },
          { term: "Ụtụtụ ọma", meaning: "good morning" },
          { term: "Kedụ?", meaning: "how are you?" },
          { term: "Ọ dị mma", meaning: "I’m fine (it is good)" },
        ],
      },
      {
        kind: "match",
        prompt: "Match each Igbo phrase to its meaning.",
        pairs: [
          ["Nnọọ", "Welcome"],
          ["Daalụ", "Thank you"],
          ["Ka ọ dị", "Goodbye"],
        ],
      },
      {
        kind: "choose",
        prompt: "Someone asks “Kedụ?” What is the easy answer?",
        options: [
          { id: "a", text: "Ọ dị mma", sub: "it is good", correct: true },
          { id: "b", text: "Nnọọ", sub: "welcome", correct: false },
          { id: "c", text: "Ka ọ dị", sub: "goodbye", correct: false },
        ],
        right: "Ọ dị mma: “it is good”. Add “daalụ” and you have thanked them for asking.",
        wrong: "Kedụ asks how you are. Answer Ọ dị mma, “it is good”.",
      },
    ],
  },
  {
    id: "ig-2",
    road: "igbo",
    n: 2,
    title: ["Kola comes", "first."],
    topic: "Hospitality",
    minutes: 4,
    steps: [
      {
        kind: "fact",
        title: "He who brings kola brings life",
        body: "In many Igbo homes a guest is first offered kola nut (ọjị). It is blessed with prayers before it is broken and shared, usually by the eldest man present, though customs vary from town to town.",
        examples: [{ term: "Onye wetara ọjị wetara ndụ", meaning: "he who brings kola brings life" }],
      },
      {
        kind: "choose",
        prompt: "You arrive at a family compound and kola is brought out. What happens next?",
        options: [
          { id: "a", text: "It is blessed, then broken and shared", correct: true },
          { id: "b", text: "The youngest person eats it first", correct: false },
          { id: "c", text: "It is kept unopened for the next guest", correct: false },
        ],
        right: "The kola is blessed with prayers, then broken and shared. Who breaks it follows local custom.",
        wrong: "Kola is blessed first, then broken and shared, usually by the eldest present.",
      },
      {
        kind: "choose",
        prompt: "What does ọjị mean?",
        options: [
          { id: "a", text: "Kola nut", correct: true },
          { id: "b", text: "Palm wine", correct: false },
          { id: "c", text: "Yam", correct: false },
        ],
        right: "Ọjị is kola nut. Palm wine is mmanya nkwụ, and yam is ji.",
        wrong: "Ọjị is kola nut. Yam is ji.",
      },
    ],
  },
  {
    id: "ig-3",
    road: "igbo",
    n: 3,
    title: ["Four", "market days."],
    topic: "Time",
    minutes: 3,
    steps: [
      {
        kind: "fact",
        title: "A four-day week",
        body: "The traditional Igbo week (izu) has four market days: Eke, Orie, Afọ and Nkwọ. Many markets are named after the day they meet, so a town may have an Eke market and an Nkwọ market.",
      },
      {
        kind: "order",
        prompt: "Put the four market days in order, starting with Eke.",
        words: ["Eke", "Orie", "Afọ", "Nkwọ"],
        meaning: "The four days of the Igbo week (izu)",
      },
      {
        kind: "choose",
        prompt: "How many days are in an izu?",
        options: [
          { id: "a", text: "Four", correct: true },
          { id: "b", text: "Seven", correct: false },
          { id: "c", text: "Five", correct: false },
        ],
        right: "Four: Eke, Orie, Afọ, Nkwọ. Some reckonings count larger cycles of izu too.",
        wrong: "Four days: Eke, Orie, Afọ, Nkwọ.",
      },
    ],
  },
  {
    id: "ig-4",
    road: "igbo",
    n: 4,
    title: ["The", "earth keeps the rules."],
    topic: "Belief",
    minutes: 4,
    steps: [
      {
        kind: "fact",
        title: "Ala",
        body: "Ala is the earth goddess of Igbo tradition: the ground of morality, fertility and the harvest. Offences against the community are offences against her, called nsọ ala, “taboos of the land”.",
      },
      {
        kind: "fact",
        title: "Houses for the goddess",
        body: "In the Owerri area, communities built mbari houses in Ala’s honour: open buildings filled with painted clay sculptures of everyday life, made over months as an offering and then left to return to the earth.",
      },
      {
        kind: "choose",
        prompt: "What is an mbari house?",
        options: [
          { id: "a", text: "A house of sculptures offered to Ala", correct: true },
          { id: "b", text: "A chief’s palace", correct: false },
          { id: "c", text: "A market hall", correct: false },
        ],
        right: "An offering to Ala: built with care, filled with sculpture, then allowed to decay back into the earth.",
        wrong: "It is a house of sculptures built as an offering to Ala.",
      },
    ],
  },
  {
    id: "ig-5",
    road: "igbo",
    n: 5,
    title: ["Nri, the", "peace town."],
    topic: "History",
    minutes: 4,
    steps: [
      {
        kind: "fact",
        title: "Priests, not soldiers",
        body: "Nri, in today’s Anambra State, held ritual authority across much of Igboland for centuries. Its priest-king, the Eze Nri, ruled through religion rather than armies, and Nri priests travelled to cleanse abominations and make peace.",
      },
      {
        kind: "fact",
        title: "Bronzes from the 9th century",
        body: "The bronzes found at nearby Igbo-Ukwu, dated to around the 9th and 10th centuries, are linked by many scholars to Nri culture. They are among the oldest known bronzes in West Africa.",
      },
      {
        kind: "choose",
        prompt: "How did the Eze Nri hold authority?",
        options: [
          { id: "a", text: "Through ritual and religion", correct: true },
          { id: "b", text: "Through a standing army", correct: false },
          { id: "c", text: "Through trade monopolies", correct: false },
        ],
        right: "Through ritual. Nri’s influence spread by priests and peace-making, not conquest.",
        wrong: "Nri ruled through ritual and religion, not armies.",
      },
    ],
  },

  // ───────────────────────── Hausa: Bayajidda’s well ─────────────────────────
  {
    id: "ha-1",
    road: "hausa",
    n: 1,
    title: ["Sannu,", "hello."],
    topic: "Greetings",
    minutes: 3,
    steps: [
      {
        kind: "fact",
        title: "Hooked letters",
        body: "Hausa is written in Latin letters (boko) and, for centuries, in Arabic script (ajami). Its alphabet has hooked letters for sounds English lacks: ɓ, ɗ and ƙ.",
        examples: [
          { term: "Sannu", meaning: "hello" },
          { term: "Ina kwana?", meaning: "good morning (how did you sleep?)" },
          { term: "Lafiya lau", meaning: "very well" },
          { term: "Na gode", meaning: "thank you" },
        ],
      },
      {
        kind: "match",
        prompt: "Match each Hausa phrase to its meaning.",
        pairs: [
          ["Sannu", "Hello"],
          ["Na gode", "Thank you"],
          ["Sai anjima", "See you later"],
        ],
      },
      {
        kind: "choose",
        prompt: "In the morning someone asks “Ina kwana?” What do you answer?",
        options: [
          { id: "a", text: "Lafiya lau", sub: "very well", correct: true },
          { id: "b", text: "Sai anjima", sub: "see you later", correct: false },
        ],
        right: "Lafiya lau. They asked how you slept; you slept in health.",
        wrong: "Ina kwana asks how you slept. Lafiya lau, “very well”, is the answer.",
      },
    ],
  },
  {
    id: "ha-2",
    road: "hausa",
    n: 2,
    title: ["Greetings take", "time."],
    topic: "Manners",
    minutes: 3,
    steps: [
      {
        kind: "fact",
        title: "Ask after everything",
        body: "A Hausa greeting is an exchange, not a word. You ask after the household, the work, the tiredness of the day, and each question gets its own answer. Rushing it can seem rude.",
        examples: [
          { term: "Ina gida?", meaning: "how is the household?" },
          { term: "Ina aiki?", meaning: "how is work?" },
          { term: "Aiki da godiya", meaning: "work, with thanks" },
        ],
      },
      {
        kind: "order",
        prompt: "Someone asks “Ina aiki?”. Build the polite answer.",
        words: ["Aiki", "da", "godiya"],
        meaning: "Work, with thanks (to God)",
      },
      {
        kind: "choose",
        prompt: "Why do Hausa greetings run long?",
        options: [
          { id: "a", text: "Asking after household and work shows care", correct: true },
          { id: "b", text: "Each phrase must be said three times", correct: false },
        ],
        right: "Each question shows you care about the whole of someone’s life, not just their face.",
        wrong: "The length is care: asking after the household, the work and the day.",
      },
    ],
  },
  {
    id: "ha-3",
    road: "hausa",
    n: 3,
    title: ["The snake in", "the well."],
    topic: "Story",
    minutes: 4,
    steps: [
      {
        kind: "fact",
        title: "A stranger at Daura",
        body: "In the Bayajidda legend, a prince from the east arrives at Daura and asks for water. The town’s well, Kusugu, is guarded by a great snake that lets people draw water only on Fridays. Bayajidda kills it.",
      },
      {
        kind: "fact",
        title: "A queen and a marriage",
        body: "Daura was ruled by a queen, Daurama. She marries Bayajidda, and their descendants found the Hausa states. The story is a founding legend; historians read it as memory, not record.",
      },
      {
        kind: "choose",
        prompt: "What was the name of the well?",
        options: [
          { id: "a", text: "Kusugu", correct: true },
          { id: "b", text: "Kurmi", correct: false },
          { id: "c", text: "Kofar Mata", correct: false },
        ],
        right: "Kusugu. Visitors to Daura can still see the well today.",
        wrong: "The well is Kusugu. Kurmi is Kano’s old market; Kofar Mata is its dye-pit gate.",
      },
      {
        kind: "choose",
        prompt: "Who ruled Daura when Bayajidda arrived?",
        options: [
          { id: "a", text: "Queen Daurama", correct: true },
          { id: "b", text: "Queen Amina", correct: false },
        ],
        right: "Daurama. Amina is a later warrior queen of Zazzau (Zaria).",
        wrong: "It was Daurama. Amina ruled Zazzau, much later.",
      },
    ],
  },
  {
    id: "ha-4",
    road: "hausa",
    n: 4,
    title: ["Seven", "states."],
    topic: "History",
    minutes: 3,
    steps: [
      {
        kind: "fact",
        title: "Hausa Bakwai",
        body: "Tradition counts seven original Hausa states, the Hausa Bakwai, founded by Bayajidda’s descendants: Daura, Kano, Katsina, Zazzau (Zaria), Gobir, Rano and Biram.",
      },
      {
        kind: "choose",
        prompt: "Which of these is NOT one of the Hausa Bakwai?",
        options: [
          { id: "a", text: "Ọ̀yọ́", sub: "a Yorùbá kingdom", correct: true },
          { id: "b", text: "Katsina", correct: false },
          { id: "c", text: "Gobir", correct: false },
        ],
        right: "Ọ̀yọ́ was a Yorùbá empire to the south-west. Katsina and Gobir are both among the seven.",
        wrong: "Katsina and Gobir are both Hausa states. Ọ̀yọ́ was a Yorùbá empire.",
      },
      {
        kind: "match",
        prompt: "Match the old state to its city today.",
        pairs: [
          ["Zazzau", "Zaria"],
          ["Kano", "Kano"],
          ["Biram", "Hadejia area"],
        ],
      },
    ],
  },
  {
    id: "ha-5",
    road: "hausa",
    n: 5,
    title: ["Kano’s", "indigo."],
    topic: "Craft",
    minutes: 4,
    steps: [
      {
        kind: "fact",
        title: "Pits of blue",
        body: "At Kofar Mata in Kano, dyers still work in deep pits of indigo, a craft that has been practised there for centuries. Cloth is dipped again and again until it turns a deep, shining blue.",
      },
      {
        kind: "fact",
        title: "Horses at Sallah",
        body: "At the Sallah festivals that close Ramadan and mark Eid al-Adha, emirates such as Kano, Katsina and Zaria hold the Durbar: horsemen in bright robes ride in procession to salute the emir.",
      },
      {
        kind: "choose",
        prompt: "What dye fills the pits at Kofar Mata?",
        options: [
          { id: "a", text: "Indigo", correct: true },
          { id: "b", text: "Camwood red", correct: false },
          { id: "c", text: "Kola brown", correct: false },
        ],
        right: "Indigo. The same blue runs through Yorùbá adire cloth to the south.",
        wrong: "It is indigo, the deep blue that also colours adire cloth.",
      },
      {
        kind: "choose",
        prompt: "When does the Durbar ride out?",
        options: [
          { id: "a", text: "At the Sallah festivals", sub: "Eid al-Fitr and Eid al-Adha", correct: true },
          { id: "b", text: "At the new yam harvest", correct: false },
        ],
        right: "At Sallah. Because the Islamic calendar is lunar, the date moves about eleven days earlier each year.",
        wrong: "The Durbar rides at Sallah. The new yam festival belongs to Igboland.",
      },
    ],
  },
];

export const lessonsForRoad = (road: RoadId) => LESSONS.filter((l) => l.road === road).sort((a, b) => a.n - b.n);
export const lessonById = (id: string) => LESSONS.find((l) => l.id === id);
