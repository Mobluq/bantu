import type { GuideId } from "./data";
import type { EmblemName } from "./emblems";

/**
 * The museum layer: one exhibition, its galleries, objects and tours.
 *
 * Each object describes a well-documented TYPE of Nigerian object, not a specific museum's piece.
 * A partner museum swaps in its own accession number, photograph and provenance; until then the
 * provenance field says so plainly. Dates are the ranges most scholars give and are marked "c.".
 */

export const EXHIBITION = {
  title: "Roads of Nigeria",
  subtitle: "Gods, makers and kingdoms",
  /** Shown on labels and the kiosk. A partner museum replaces this. */
  venue: "Demo exhibition",
  intro:
    "Six rooms, from the clay heads of Nok to the water spirits of the Delta. Every object here has a number on its label: type it in, or scan the code, and a guide tells you about it.",
};

export type GalleryId = "g1" | "g2" | "g3" | "g4" | "g5" | "g6";

export type Gallery = {
  id: GalleryId;
  n: number;
  name: string;
  theme: string;
  intro: string;
  guide: GuideId;
  tone: { bg: string; fg: string };
  /** Room position on the floor plan, in a 3×2 grid. */
  cell: [number, number];
};

export const GALLERIES: Gallery[] = [
  {
    id: "g1", n: 1, name: "Before the kingdoms", theme: "Nok and Igbo-Ukwu", guide: "keeper", cell: [0, 0],
    tone: { bg: "var(--color-clay)", fg: "var(--color-ink)" },
    intro: "Clay heads fired more than two thousand years ago, and bronzes cast in a village a thousand years ago with skill that still surprises metalworkers.",
  },
  {
    id: "g2", n: 2, name: "Metal and memory", theme: "Ifẹ̀ and Benin", guide: "ogun", cell: [1, 0],
    tone: { bg: "var(--color-ink)", fg: "var(--color-gold)" },
    intro: "Two royal cities, two traditions of casting. Portraits of rulers, and brass plaques that recorded a court’s history.",
  },
  {
    id: "g3", n: 3, name: "Crossroads and rivers", theme: "Yorùbá òrìṣà and making", guide: "esu", cell: [2, 0],
    tone: { bg: "var(--color-brick)", fg: "var(--color-cream)" },
    intro: "Objects made for the òrìṣà and for the people who serve them: a divination tray, a thunder wand, twin figures, and a drum that talks.",
  },
  {
    id: "g4", n: 4, name: "Earth and the right hand", theme: "Igbo and the Cross River", guide: "ala", cell: [0, 1],
    tone: { bg: "var(--color-indigo)", fg: "var(--color-cream)" },
    intro: "Ala the earth keeps the rules; Ikenga stands for what a person achieves with their own hands. Pots that sing, cloth that women weave, signs that carry secrets.",
  },
  {
    id: "g5", n: 5, name: "Walls, wells and horsemen", theme: "The Hausa north", guide: "bayajidda", cell: [1, 1],
    tone: { bg: "var(--color-ochre)", fg: "var(--color-ink)" },
    intro: "City walls, indigo dye pits and the horsemen of the Durbar. The story starts at a well in Daura.",
  },
  {
    id: "g6", n: 6, name: "Water and the Delta", theme: "Ịjọ, Edo and the water spirits", guide: "woyengi", cell: [2, 1],
    tone: { bg: "var(--color-forest)", fg: "var(--color-gold)" },
    intro: "In the creeks of the Niger Delta, spirits live in the water. Masks are worn facing the sky so they can see them.",
  },
];

export type MuseumObject = {
  id: string;
  /** The number printed on the wall label and typed into the keypad. */
  code: string;
  gallery: GalleryId;
  title: string;
  /** The object's name in a Nigerian language, where there is a common one. */
  local?: string;
  culture: string;
  place: string;
  date: string;
  material: string;
  emblem: EmblemName;
  tone: { bg: string; fg: string };
  /** Wall-label text, about 50 words. */
  label: string;
  /** The audio guide, read aloud by the room's guide. */
  story: string;
  /** For younger visitors. */
  kids: string;
  lookFor: string[];
  ask: string[];
  guide: GuideId;
  /** Almanac entry to read next, if any. */
  entry?: string;
  /** A sound the object can make in the app. */
  sound?: "drum" | "udu";
  /** Opens the 3D turntable. */
  turntable?: boolean;
};

const PROVENANCE_DEFAULT =
  "This entry describes a type of object. The museum showing it adds its own object’s accession number, how and when it was acquired, and any history of removal or return.";

export const provenanceFor = (_o: MuseumObject) => PROVENANCE_DEFAULT;

const CLAY = { bg: "var(--color-clay)", fg: "var(--color-ink)" };
const INK = { bg: "var(--color-ink)", fg: "var(--color-gold)" };
const BRICK = { bg: "var(--color-brick)", fg: "var(--color-cream)" };
const INDIGO = { bg: "var(--color-indigo)", fg: "var(--color-cream)" };
const OCHRE = { bg: "var(--color-ochre)", fg: "var(--color-ink)" };
const FOREST = { bg: "var(--color-forest)", fg: "var(--color-gold)" };
const GOLD = { bg: "var(--color-gold)", fg: "var(--color-ink)" };

export const OBJECTS: MuseumObject[] = [
  /* ── Gallery 1 ── */
  {
    id: "nok-head", code: "101", gallery: "g1", guide: "keeper", emblem: "keeper", tone: CLAY,
    title: "Nok terracotta head", culture: "Nok culture", place: "Central Nigeria", date: "c. 900 BCE – 200 CE", material: "Fired clay",
    label: "Hollow heads and figures modelled by hand and fired at high heat. The eyes have pierced pupils and the hair is dressed in careful buns and braids. They are among the oldest known figurative sculptures in Africa south of the Sahara.",
    story: "This head was made from clay, shaped by hand and fired, more than two thousand years ago, in what is now central Nigeria. Archaeologists call the people who made it the Nok culture, after the village where the first piece was found in the 1940s. Look at the eyes: triangles, with the pupils pierced right through. Look at the hair, built up in buns and rows. Many Nok pieces have been dug up illegally and sold, and that destroys the evidence of how and where they were used. So every piece with a documented history is precious.",
    kids: "This head is made of clay and is more than 2,000 years old. That is older than almost everything else in this museum! Can you find the holes in the eyes?",
    lookFor: ["The pierced pupils of the eyes", "The hairstyle, built up in buns and braids"],
    ask: ["Who were the Nok people?", "Why is illegal digging such a problem?"],
  },
  {
    id: "igbo-ukwu", code: "102", gallery: "g1", guide: "ala", emblem: "ala", tone: OCHRE,
    title: "Igbo-Ukwu roped pot", culture: "Igbo-Ukwu", place: "Igbo-Ukwu, Anambra State", date: "c. 9th–10th century CE", material: "Leaded bronze, lost-wax casting",
    label: "A pot wrapped in a net of cast rope, so fine it looks real. Bronzes like this were first found in 1938 by a man digging a water cistern, and later excavated by archaeologists. Their detail shows a casting tradition of great skill a thousand years ago.",
    story: "In 1938 a man named Isaiah Anozie was digging a cistern for water in his compound at Igbo-Ukwu when he struck bronze. Archaeologists later excavated the site and found hundreds of objects, made more than a thousand years ago. This pot sits inside a net of rope, and the rope is metal too, cast in one piece by the lost-wax method: the shape is modelled in wax, covered in clay, the wax melted out and the metal poured in. Look at the knots. Metalworkers today still study how they were done.",
    kids: "The rope around this pot is not real rope. It is metal! Someone made it more than 1,000 years ago. Count the knots you can see.",
    lookFor: ["The knots of the cast rope", "Tiny raised dots and spirals on the surface"],
    ask: ["What is lost-wax casting?", "Who found the Igbo-Ukwu bronzes?"],
    entry: "ala",
  },
  /* ── Gallery 2 ── */
  {
    id: "ife-head", code: "201", gallery: "g2", guide: "ogun", emblem: "ife", tone: CLAY, turntable: true,
    title: "Ifẹ̀ head", culture: "Yorùbá, Ilé-Ifẹ̀", place: "Ilé-Ifẹ̀, Ọ̀ṣun State", date: "c. 12th–15th century", material: "Copper alloy, lost-wax casting",
    label: "A calm, lifelike face cast in metal, from the city Yorùbá tradition calls the place where the world began. Some Ifẹ̀ heads have fine lines down the face and small holes along the hairline. Scholars still debate what both were for.",
    story: "This is a head from Ilé-Ifẹ̀, cast between the twelfth and fifteenth centuries. When heads like this reached Europe, some writers refused to believe Africans had made them. They were wrong: the faces are calm and lifelike, and they were made here, in Ifẹ̀. Thirteen were found together in 1938, in the city itself. Look at the fine lines running down the face. Some say they show scarification, some a beaded veil. Nobody knows for certain. Tap Turn it in 3D, and look closer.",
    kids: "This face was made from metal about 700 years ago. Can you count the lines running down the face? People still argue about what they mean!",
    lookFor: ["Fine vertical lines on the face", "Small holes along the hairline or around the mouth"],
    ask: ["What do the lines on the face mean?", "Why is Ilé-Ifẹ̀ important?"],
  },
  {
    id: "benin-plaque", code: "202", gallery: "g2", guide: "ogun", emblem: "benin", tone: OCHRE,
    title: "Benin palace plaque", culture: "Edo, Kingdom of Benin", place: "Benin City, Edo State", date: "c. 16th–17th century", material: "Brass",
    label: "Rectangular brass plaques once covered the wooden pillars of the Oba’s palace, showing the court: the Oba, chiefs, warriors, musicians and Portuguese traders. In 1897 a British force attacked Benin City and took thousands of objects. Their return is being decided today.",
    story: "Picture a palace hall whose pillars are covered in brass, hundreds of plaques, each showing a moment of the court. Here are warriors with their weapons, chiefs in their regalia, and sometimes Portuguese traders with long hair and hats. The Guild of Bronze Casters made them, and it still works in Benin City today. In 1897 a British military expedition attacked the city and took thousands of objects to Europe. Many museums have since returned pieces, and the conversation about where they belong continues.",
    kids: "These pictures are made of metal and once covered the pillars of a king’s palace. Can you find someone holding a weapon? Can you find someone who came from far away?",
    lookFor: ["Figures shown at different sizes: the most important are biggest", "Small rosettes in the background"],
    ask: ["What happened in 1897?", "Who are the Benin bronze casters today?"],
    entry: "olokun",
  },
  {
    id: "idia-mask", code: "203", gallery: "g2", guide: "ogun", emblem: "benin", tone: { bg: "var(--color-paper)", fg: "var(--color-ink)" },
    title: "Queen Mother Idia pendant", local: "Iyoba", culture: "Edo, Kingdom of Benin", place: "Benin City, Edo State", date: "c. 16th century", material: "Ivory",
    label: "A small ivory face of Idia, mother of Oba Esigie, remembered for her counsel and her role in war. Masks like this were worn by the Oba at the hip in ceremonies. Its image became the emblem of FESTAC ’77, the festival of Black and African arts held in Lagos.",
    story: "Idia was the mother of Oba Esigie, who ruled Benin in the early sixteenth century. She is remembered as a counsellor and a leader in war, and Esigie created the title of Iyoba, Queen Mother, for her. Small ivory faces of Idia were worn by the Oba at the hip during ceremonies. Four and a half centuries later, her face became the emblem of FESTAC ’77, the great festival of Black and African arts held in Lagos in 1977.",
    kids: "This little face shows a real queen mother called Idia. She gave advice to her son, the king. Her face was later used as the symbol of a huge festival in Lagos.",
    lookFor: ["The crown of small heads at the top", "Two lines of scarification on the forehead"],
    ask: ["Who was Queen Mother Idia?", "What was FESTAC ’77?"],
  },
  {
    id: "opon-ifa", code: "204", gallery: "g2", guide: "esu", emblem: "orunmila", tone: INK,
    title: "Ifá divination tray", local: "Ọpọ́n Ifá", culture: "Yorùbá", place: "South-west Nigeria", date: "Made over many centuries; carved pieces often 19th–20th century", material: "Carved wood",
    label: "A diviner (babaláwo) spreads powder on the tray and marks signs in it while consulting Ifá, a body of verses that UNESCO lists as intangible heritage. A face at the top edge is usually read as Èṣù, the messenger, who watches every reading.",
    story: "A babaláwo, a father of secrets, spreads white powder on this tray and taps out signs with his fingers. Each sign points to verses of Ifá, a huge body of poetry learned by heart over many years. The verses are stories, advice and history. Look at the border: there is almost always a face at the top. Many read it as Èṣù, the messenger, who carries the message between people and the òrìṣà. Without him, they say, no message arrives.",
    kids: "This tray was used to ask questions about the future. Find the face at the top. It belongs to Èṣù, the messenger. What else is carved around the edge?",
    lookFor: ["The face at the top of the border", "Animals and people carved around the rim"],
    ask: ["What is Ifá?", "Why is Èṣù on the tray?"],
    entry: "orunmila",
  },
  /* ── Gallery 3 ── */
  {
    id: "ose-sango", code: "301", gallery: "g3", guide: "esu", emblem: "sango", tone: BRICK,
    title: "Ṣàngó dance wand", local: "Oṣé Ṣàngó", culture: "Yorùbá", place: "Ọ̀yọ́ and the south-west", date: "Often 19th–20th century", material: "Carved wood, sometimes beads",
    label: "A wand topped with a double axe, the thunderstone of Ṣàngó, carried by his devotees when they dance. Many show a kneeling woman balancing the axe on her head, an image of devotion and of the power she carries.",
    story: "Ṣàngó is remembered as a king of Ọ̀yọ́ and honoured as the òrìṣà of thunder and lightning. His sign is the double axe, and Yorùbá tradition links it to the stone axe heads people find after lightning strikes. Devotees carry wands like this when they dance for him, and the wand moves with the drums. Look at the figure: often a woman kneels, holding the axe on her head. She is calm, and the power above her is great.",
    kids: "This wand belongs to Ṣàngó, who throws thunder and lightning. Find the shape like a double axe. Can you show the shape with your hands?",
    lookFor: ["The double axe shape on top", "A kneeling figure holding it"],
    ask: ["Who is Ṣàngó?", "What are thunderstones?"],
    entry: "sango",
  },
  {
    id: "osun-fan", code: "302", gallery: "g3", guide: "osun", emblem: "osun", tone: GOLD,
    title: "Ọ̀ṣun brass fan", local: "Abẹ̀bẹ̀", culture: "Yorùbá", place: "Òṣogbo and the south-west", date: "20th century and earlier", material: "Brass",
    label: "A round brass fan carried for Ọ̀ṣun, òrìṣà of sweet water, love and healing. Brass, yellow and gold are her colours. Each August at Òṣogbo, her sacred grove becomes the centre of a festival that draws visitors from around the world.",
    story: "Ọ̀ṣun is the river that runs through Òṣogbo, and the òrìṣà of sweet water, love, fertility and healing. Her metal is brass, which shines like the river in the sun, and her colours are yellow and gold. A fan like this, the abẹ̀bẹ̀, is carried in her honour. Her grove at Òṣogbo is a UNESCO World Heritage Site, and every August the festival ends with a young woman, the Arugba, carrying a calabash of offerings to the river.",
    kids: "This shiny fan is for Ọ̀ṣun, who lives in a river. Her favourite colours are yellow and gold. What patterns can you see on the fan?",
    lookFor: ["Patterns punched into the brass", "Small figures or birds on the fan"],
    ask: ["What happens at the Ọ̀ṣun festival?", "Why is brass Ọ̀ṣun’s metal?"],
    entry: "osun",
  },
  {
    id: "ibeji", code: "303", gallery: "g3", guide: "osun", emblem: "keeper", tone: CLAY,
    title: "Twin figures", local: "Ère ìbejì", culture: "Yorùbá", place: "South-west Nigeria", date: "Mostly 19th–20th century", material: "Carved wood, often with beads and camwood",
    label: "Yorùbá country has one of the highest rates of twin births in the world. When a twin died, families often had a small figure carved, then washed, dressed and fed it like the living child. The worn faces show years of care.",
    story: "Yorùbá country has one of the highest rates of twin births anywhere in the world, and twins are special: the first born is Táíwò, the one who tastes the world, and the second is Kẹ́hìndé, the one who comes after. When a twin died, a family might commission a small carved figure and care for it as they cared for the living twin: washing it, dressing it, rubbing it with camwood. Look at the faces. Many are worn smooth by years of love.",
    kids: "When a twin died, families carved a little figure and looked after it, washing and dressing it. Look at the face. Can you tell it was loved for a long time?",
    lookFor: ["Faces worn smooth by handling", "Beads or traces of red camwood"],
    ask: ["What do the names Táíwò and Kẹ́hìndé mean?", "Why are twins special in Yorùbá culture?"],
  },
  {
    id: "gelede", code: "304", gallery: "g3", guide: "esu", emblem: "eyo", tone: BRICK,
    title: "Gẹ̀lẹ̀dẹ́ mask", culture: "Yorùbá (western)", place: "Western Yorùbá towns, and Benin Republic", date: "Often 20th century", material: "Carved and painted wood",
    label: "Gẹ̀lẹ̀dẹ́ masquerades honour ‘our mothers’, the power of women and elders. Masks sit on top of the head like a hat, with scenes carved above the face. UNESCO recognised the Gẹ̀lẹ̀dẹ́ oral heritage of Nigeria, Benin and Togo in 2001.",
    story: "Gẹ̀lẹ̀dẹ́ is a masquerade that honours àwọn ìyá wa, our mothers: the women and female elders whose power can protect a community or, if neglected, harm it. Dancers, usually men, wear masks on top of their heads like hats, with a calm face below and a carved scene above. The scenes can be funny, wise or sharp: a market, a snake, a motorbike. Songs at the performance comment on the town’s news. UNESCO recognised Gẹ̀lẹ̀dẹ́ in 2001.",
    kids: "This mask is worn on top of the head like a hat. Dancers wear it to honour mothers. What is carved on top? Make up a story about it.",
    lookFor: ["The scene carved above the face", "The calm face with heavy eyelids"],
    ask: ["Who are ‘our mothers’?", "What do Gẹ̀lẹ̀dẹ́ songs say?"],
  },
  {
    id: "ogo-elegba", code: "305", gallery: "g3", guide: "esu", emblem: "esu", tone: BRICK,
    title: "Èṣù dance staff", local: "Ọ̀gọ́ Ẹlẹ́gbára", culture: "Yorùbá", place: "South-west Nigeria", date: "Often 19th–20th century", material: "Carved wood, cowrie shells, leather",
    label: "A staff for Èṣù, messenger and trickster, whose long hairstyle sweeps back from the head. Cowries, once used as money, hang from it: a reminder that Èṣù is at home in the marketplace, where luck and trade meet.",
    story: "Èṣù is the messenger between people and the òrìṣà, the keeper of crossroads and of chance. He is a trickster, not the devil: early Bible translations used his name for Satan, and the label stuck. His figures have a long hairstyle that sweeps back, sometimes ending in a blade or a hook. The cowrie shells were once money in West Africa, and they remind us that Èṣù loves the marketplace, where everyone is looking for luck.",
    kids: "This belongs to Èṣù, the messenger and trickster. Find the long hair sweeping back. Count the cowrie shells. They used to be money!",
    lookFor: ["The long swept-back hairstyle", "Strings of cowrie shells"],
    ask: ["Are you the devil?", "Why cowrie shells?"],
    entry: "esu",
  },
  {
    id: "adire", code: "306", gallery: "g3", guide: "osun", emblem: "osun", tone: INDIGO,
    title: "Adire cloth", local: "Àdìrẹ", culture: "Yorùbá", place: "Abẹ́òkúta and Ìbàdàn", date: "20th century, a living craft", material: "Cotton, indigo dye",
    label: "Indigo cloth patterned by resisting the dye: tying, stitching, or painting a starch paste on before dyeing (adire ẹlẹ́kọ). Abẹ́òkúta has long been its centre, and women dyers made it famous across West Africa.",
    story: "Adire means tie and dye. Before the cloth goes into the indigo, the dyer protects parts of it: by tying, by stitching tight, or by painting a paste of cassava starch through a stencil or by hand. That is adire ẹlẹ́kọ. Where the dye cannot reach, the pattern appears in pale blue. Abẹ́òkúta has long been the centre of adire, and it was women dyers who built the trade. Adire is still made and worn today.",
    kids: "This blue cloth was dyed with a plant called indigo. The pale patterns are where the dye could not reach. Find a pattern that repeats!",
    lookFor: ["Pale patterns where the dye was resisted", "Repeating squares and motifs"],
    ask: ["How is indigo made?", "What does adire ẹlẹ́kọ mean?"],
  },
  {
    id: "dundun", code: "307", gallery: "g3", guide: "esu", emblem: "esu", tone: INK, sound: "drum",
    title: "Talking drum", local: "Dùndún", culture: "Yorùbá", place: "South-west Nigeria", date: "A living instrument", material: "Wood, goatskin, leather cords",
    label: "An hourglass drum whose pitch rises when the player squeezes the cords under the arm. Because Yorùbá is a tonal language, a skilled drummer can ‘speak’: praise names, proverbs and greetings that listeners understand.",
    story: "Yorùbá is a tonal language: the same syllables mean different things at high, middle or low pitch. The dùndún, the talking drum, can copy those pitches. The drummer holds it under the arm and squeezes the cords: tighter, and the pitch rises; looser, and it falls. A master can drum praise names, proverbs and greetings, and people who know the language can hear the words. Tap Hear the drum to hear two low beats: the tones of the word ọ̀nà, the road.",
    kids: "This drum can talk! Squeeze the strings and the sound goes higher. Tap Hear the drum. Can you copy the beat by clapping?",
    lookFor: ["The hourglass shape", "The leather cords that change the pitch"],
    ask: ["How can a drum talk?", "What is a tonal language?"],
  },
  /* ── Gallery 4 ── */
  {
    id: "ikenga", code: "401", gallery: "g4", guide: "ala", emblem: "ikenga", tone: INDIGO, entry: "ikenga",
    title: "Ikenga", culture: "Igbo", place: "South-east Nigeria", date: "Often 19th–20th century", material: "Carved wood",
    label: "A horned figure that stands for a person’s right hand: their strength, effort and success. A man’s ikenga was consecrated as he made his way in life. The horns, like a ram’s, speak of determination.",
    story: "In Igbo thought, the right hand is the hand that works, that fights, that builds. Ikenga is the shrine of that hand: of a person’s own effort and success. A man would have his ikenga carved and consecrated as he made his way in the world, and offer to it before a big undertaking. Look at the horns: like a ram’s, they mean pushing forward, never backing down. Some ikenga are simple, some are covered in carved detail.",
    kids: "This figure stands for hard work and success. Find the horns, like a ram’s. Rams push forward. What are you working hard at?",
    lookFor: ["The ram’s horns", "A knife or tusk in the hands"],
    ask: ["Why the right hand?", "Who could own an ikenga?"],
  },
  {
    id: "mbari", code: "402", gallery: "g4", guide: "ala", emblem: "ala", tone: OCHRE, entry: "ala",
    title: "Mbari house", culture: "Igbo (Owerri area)", place: "Around Owerri, Imo State", date: "A practice, best documented in the 20th century", material: "Shown here in photographs and models; built of clay",
    label: "Open-sided houses of painted clay sculpture, built for Ala the earth or other deities when a community needed to make things right. Builders were secluded while they worked. When finished, an mbari was left to return to the earth.",
    story: "When a town needed to restore its balance with Ala, the earth, it might build an mbari: an open house filled with life-size painted clay figures. Ala sits with a child; around her are people, animals, spirits, even scenes of the colonial era. The builders lived apart while they worked, sometimes for many months. And when it was done, nobody preserved it. The mbari was meant to melt back into the earth it honoured. The making was the offering.",
    kids: "People built a whole house of clay sculptures for Ala, the earth, and then let it melt back into the ground. Why do you think they did that?",
    lookFor: ["Ala, seated with a child", "Everyday scenes among the sacred ones"],
    ask: ["What is an mbari house?", "Why let it fall apart?"],
  },
  {
    id: "udu", code: "403", gallery: "g4", guide: "ala", emblem: "ala", tone: CLAY, sound: "udu",
    title: "Udu pot drum", local: "Udu", culture: "Igbo", place: "South-east Nigeria", date: "A living instrument", material: "Fired clay",
    label: "A clay pot with a second hole in its side. Strike the hole with an open palm and it makes a deep, liquid bass. Udu are made by women potters, and the instrument has found players around the world.",
    story: "Udu means vessel, and also peace. It looks like a water pot, but with a second opening in its side. Strike that opening with a flat palm and the air inside makes a deep, round, watery note; tap the body and it rings. Women potters made udu by hand, shaping the clay in coils and firing it. Today the udu is played in orchestras and on records far from Nigeria, but it began here.",
    kids: "This pot is a drum! Hit the hole on the side and it goes boom, like water. Tap Hear the udu.",
    lookFor: ["The second hole in the side", "Patterns pressed into the clay"],
    ask: ["Who makes udu?", "How does a pot make a drum sound?"],
  },
  {
    id: "akwete", code: "404", gallery: "g4", guide: "ala", emblem: "ala", tone: INDIGO,
    title: "Akwete cloth", local: "Akwete", culture: "Igbo (Ndoki)", place: "Akwete, Abia State", date: "A living craft", material: "Cotton, sometimes silk or rayon; handwoven",
    label: "Woven by women on wide upright looms in Akwete, a town famous for complex patterns built up thread by thread. Motifs have names, and weavers pass them down through families.",
    story: "In the town of Akwete, women weave on a wide upright loom, wide enough to make a whole wrapper in one piece. The patterns are built up thread by thread, floating extra threads across the cloth. Motifs have names, and some were once reserved for particular families or occasions. Akwete cloth is still woven and worn today, at weddings and celebrations across the south-east.",
    kids: "Women wove this cloth by hand, one thread at a time. Can you find a shape that looks like an animal or a star?",
    lookFor: ["Raised patterns floating on the surface", "Repeating bands of motifs"],
    ask: ["How is Akwete woven?", "What do the patterns mean?"],
  },
  {
    id: "nsibidi", code: "405", gallery: "g4", guide: "keeper", emblem: "keeper", tone: INK,
    title: "Nsibidi signs", local: "Nsìbịdị", culture: "Ejagham, Efik and neighbours", place: "Cross River region", date: "Old; recorded from the early 20th century", material: "Shown on cloth, carvings and walls",
    label: "A system of signs used in the Cross River region, by the Ekpe (leopard) society and others. Some signs were public, like love or a meeting; others were known only to members. Artists today still draw on nsibidi.",
    story: "Long before Latin letters came to the Cross River, people there used nsibidi: signs drawn on walls, cloth, calabashes, even skin. Some meant ordinary things, love, a quarrel, a meeting, and anyone could read them. Others belonged to the Ekpe society, the leopard society that kept order and law, and only members knew them. Nsibidi is not an alphabet; each sign carries an idea. Artists and designers still use these signs today.",
    kids: "These signs are a kind of writing without letters. Each one is an idea. Make up your own sign for ‘friend’!",
    lookFor: ["Signs that repeat", "Shapes that look like people or objects"],
    ask: ["Is nsibidi an alphabet?", "What is the Ekpe society?"],
  },
  /* ── Gallery 5 ── */
  {
    id: "kusugu", code: "501", gallery: "g5", guide: "bayajidda", emblem: "bayajidda", tone: OCHRE, entry: "bayajidda",
    title: "The Kusugu well", culture: "Hausa", place: "Daura, Katsina State", date: "The legend; the well can still be visited", material: "Shown here in photographs",
    label: "In the founding legend of the Hausa states, the stranger Bayajidda killed a snake that guarded this well and let the people of Daura drink. He married the queen, and their descendants founded seven Hausa states.",
    story: "A stranger came to Daura thirsty. The people told him a great snake lived in the well, Kusugu, and they could only draw water on Fridays. He drew water anyway, and when the snake rose, he cut off its head. The queen of Daura married him, and in the legend their son and grandsons founded the seven Hausa states, the Hausa Bakwai. Many versions of the story exist. The well is still there in Daura.",
    kids: "In this story, a stranger saves a town from a snake in its well and marries the queen. Their family starts seven kingdoms! Can you name a brave thing you have done?",
    lookFor: ["The well head", "Visitors still coming to see it"],
    ask: ["Tell me about the well", "What are the seven states?"],
  },
  {
    id: "durbar", code: "502", gallery: "g5", guide: "bayajidda", emblem: "amina", tone: BRICK,
    title: "Durbar horse regalia", culture: "Hausa and Nupe", place: "Kano, Katsina, Zaria, Bida", date: "A living tradition", material: "Shown here: quilted cloth, leather and metal",
    label: "At Sallah festivals, horsemen in bright robes and turbans ride in procession and charge toward the emir to salute him. Horses wear quilted cloth, embroidered leather and metal ornaments.",
    story: "Twice a year, at the end of Ramadan and at the Big Sallah, cities across the north hold the Durbar. Hundreds of horsemen in bright robes and turbans ride through the streets. Groups gallop at full speed toward the emir, then stop at the last moment and raise their swords in salute. The horses wear quilted cloth, embroidered leather and metal. The Durbar grew from older military parades, when horsemen showed their loyalty and readiness.",
    kids: "At the Durbar, horses wear fancy clothes too! Riders gallop fast and stop just in front of the emir. Find the brightest colour on the regalia.",
    lookFor: ["Quilted and embroidered panels", "Metal ornaments on the bridle"],
    ask: ["When is the Durbar?", "Why do riders charge at the emir?"],
  },
  {
    id: "dye-pits", code: "503", gallery: "g5", guide: "bayajidda", emblem: "bayajidda", tone: INDIGO,
    title: "Kano dye pits", local: "Kofar Mata", culture: "Hausa", place: "Kano", date: "Centuries old and still worked", material: "Shown here: indigo-dyed cloth and photographs",
    label: "Deep pits in the ground, lined and filled with indigo, where dyers have coloured cloth for centuries. The Kofar Mata pits in Kano are among the oldest still in use, and their deep blue cloth travelled across the Sahara.",
    story: "Near the Kofar Mata gate in Kano, dyers work at deep pits sunk into the ground and filled with indigo, ash and water. The cloth goes down blue-green and comes up, in the air, deep blue. Kano cloth travelled along trade routes across the Sahara, and the deepest, shiniest blues were prized. Dyers still work at the pits today, and the skills pass from father to son.",
    kids: "Cloth goes into a hole in the ground full of dye and comes out blue! Can you find something blue near you?",
    lookFor: ["Different depths of blue", "The shine of cloth beaten after dyeing"],
    ask: ["How old are the Kano dye pits?", "Why did cloth travel across the Sahara?"],
  },
  {
    id: "calabash", code: "504", gallery: "g5", guide: "bayajidda", emblem: "gizo", tone: CLAY,
    title: "Decorated calabash", local: "Ƙwarya", culture: "Hausa and Fulani", place: "Northern Nigeria", date: "A living craft", material: "Gourd, carved and pyro-engraved",
    label: "A gourd, dried and hollowed, then carved, scratched or burned with patterns. Calabashes hold milk, grain and water, and decorated ones are treasured, displayed in homes and given at marriages.",
    story: "A calabash grows on a vine. When it dries, it becomes a bowl, light and strong. Carvers decorate them by scratching, cutting or burning patterns into the skin: circles, stars, interlaced lines. Calabashes carry milk, grain and water, and the finest decorated ones are displayed in a woman’s room and given at her marriage. Each region has its own style, so a calabash can tell you where it came from.",
    kids: "This bowl grew on a plant! Then someone carved patterns into it. Find a circle. Find a star. Which pattern would you carve?",
    lookFor: ["Burned dark lines", "Patterns that repeat around the bowl"],
    ask: ["How is a calabash decorated?", "Why are calabashes given at weddings?"],
  },
  {
    id: "amina-walls", code: "505", gallery: "g5", guide: "bayajidda", emblem: "amina", tone: OCHRE, entry: "amina",
    title: "The walls of Zaria", local: "Ganuwar Amina", culture: "Hausa, Zazzau", place: "Zaria, Kaduna State", date: "Attributed by tradition to the 16th century", material: "Shown here in photographs; earth walls",
    label: "Earthen city walls that tradition credits to Queen Amina of Zazzau, a warrior ruler said to have built a wall around each camp she made. Parts of the old walls of Zaria can still be seen.",
    story: "Queen Amina of Zazzau, in the most common accounts of the sixteenth century, was a warrior who led armies and widened her kingdom. Tradition says she had an earthen wall built around each camp she made, and the walls of Zaria are still called Ganuwar Amina, Amina’s walls. Historians debate the details of her life, but her memory is very much alive: schools, statues and stories carry her name.",
    kids: "Queen Amina was a warrior queen! People say she built walls around her camps. If you built a wall around your town, what would it be made of?",
    lookFor: ["Thick earth walls", "Old gates in the city wall"],
    ask: ["Who was Queen Amina?", "Why build walls of earth?"],
  },
  /* ── Gallery 6 ── */
  {
    id: "water-mask", code: "601", gallery: "g6", guide: "woyengi", emblem: "woyengi", tone: FOREST,
    title: "Water spirit headdress", culture: "Ịjọ (Kalabari and neighbours)", place: "Niger Delta", date: "Often 20th century", material: "Carved and painted wood",
    label: "In the Delta, spirits are said to live in the water. Some masquerade headdresses are worn flat on top of the head, facing the sky, so that the water spirits can see them, the way a fish sees from below.",
    story: "In the creeks of the Niger Delta, the Ịjọ say that spirits live in the water, as people live on land. Masquerades honour them. Look at how this headdress sits: not in front of the face, but flat on top of the head, facing up. The spirits are below the surface, looking up, so the mask faces the sky for them to see. Some headdresses show a fish, a crocodile or a person with a shark’s fin. The dancers seem to swim.",
    kids: "This mask is worn on top of the head, looking up, so that spirits in the water can see it. Pretend you are a fish looking up. What do you see?",
    lookFor: ["How the mask lies flat to face upward", "Water animals in the carving"],
    ask: ["How did you make people?", "Why do the masks face the sky?"],
    entry: "woyengi",
  },
  {
    id: "mami-wata", code: "602", gallery: "g6", guide: "woyengi", emblem: "olokun", tone: FOREST, entry: "mami-wata",
    title: "Mami Wata figure", culture: "Across West and Central Africa", place: "Coastal Nigeria and beyond", date: "Mostly 20th century", material: "Carved and painted wood",
    label: "A water spirit, often shown as a woman with long hair, sometimes with a snake around her shoulders. Mami Wata brings wealth and danger. Her image was shaped partly by a 19th-century print of a snake charmer that travelled widely.",
    story: "Mami Wata, mother water, is honoured along coasts and rivers across West and Central Africa. She is beautiful and wealthy, and she can bring fortune or trouble. Often she has long flowing hair, and a snake wrapped around her shoulders. Part of that image comes from an unexpected place: a nineteenth-century European print of a snake charmer, which travelled widely and was adopted and reimagined by artists and devotees. Ideas travel, and change as they go.",
    kids: "Mami Wata is a water spirit who lives in rivers and the sea. Find the snake! Do you know any other stories about mermaids?",
    lookFor: ["A snake around the shoulders", "Long flowing hair"],
    ask: ["Who is Mami Wata?", "Where did her image come from?"],
  },
  {
    id: "olokun", code: "603", gallery: "g6", guide: "woyengi", emblem: "olokun", tone: { bg: "var(--color-paper)", fg: "var(--color-ink)" }, entry: "olokun",
    title: "Olókun shrine figures", culture: "Edo", place: "Benin City and around", date: "A living tradition", material: "Shown here: clay sculpture, kept white with chalk",
    label: "In Edo belief, Olókun rules the waters and the wealth and children they bring. His shrines are kept white with chalk, and are filled with clay figures of his court, made by women devotees.",
    story: "In Edo tradition, Olókun is the son of the creator, Osanobua, and rules the waters: the sea, the rivers and the wealth and fertility they bring. His shrines are white, kept clean with chalk, the colour of purity. Inside, clay figures show his court: chiefs, wives, attendants, as if under the water there is a palace like the Oba’s. Many are made by women, who are often Olókun’s devotees.",
    kids: "Olókun is the king of the water in Edo stories. His shrines are painted white. Under the sea, he has a palace with a whole court!",
    lookFor: ["White chalk on everything", "Figures arranged like a royal court"],
    ask: ["Who is Olókun?", "Why white?"],
  },
];

export type Tour = {
  id: string;
  name: string;
  minutes: number;
  audience: string;
  intro: string;
  stops: string[];
  tone: { bg: string; fg: string };
  /** Use the kids' text by default. */
  family?: boolean;
};

export const TOURS: Tour[] = [
  {
    id: "highlights", name: "Highlights", minutes: 25, audience: "First visit",
    intro: "Eight objects, one from every room, from the oldest clay to the Delta's water spirits.",
    stops: ["nok-head", "igbo-ukwu", "ife-head", "benin-plaque", "ose-sango", "ikenga", "amina-walls", "water-mask"],
    tone: INK,
  },
  {
    id: "family", name: "Family trail", minutes: 20, audience: "Ages 5–11", family: true,
    intro: "Find, count, clap and pretend. Six stops with something to do at each.",
    stops: ["igbo-ukwu", "ibeji", "dundun", "udu", "calabash", "water-mask"],
    tone: GOLD,
  },
  {
    id: "gods", name: "Gods and spirits", minutes: 30, audience: "Myths and belief",
    intro: "Messengers, thunder, rivers, the earth and the sea: the òrìṣà, Igbo deities and water spirits behind the objects.",
    stops: ["ogo-elegba", "opon-ifa", "ose-sango", "osun-fan", "gelede", "ikenga", "mbari", "olokun"],
    tone: BRICK,
  },
];

export const objectById = (id: string) => OBJECTS.find((o) => o.id === id);
export const objectByCode = (code: string) => OBJECTS.find((o) => o.code === code.trim());
export const galleryById = (id: GalleryId) => GALLERIES.find((g) => g.id === id)!;
export const objectsIn = (g: GalleryId) => OBJECTS.filter((o) => o.gallery === g);
export const tourById = (id: string) => TOURS.find((t) => t.id === id);

/* ───────── Verticals: how the collection is browsed by subject ───────── */

export type VerticalId = "history" | "archaeology" | "royal" | "belief" | "craft" | "music" | "culture";

export type Vertical = { id: VerticalId; name: string; line: string; tone: { bg: string; fg: string }; emblem: EmblemName };

export const VERTICALS: Vertical[] = [
  { id: "history", name: "History", line: "Three thousand years, from Nok to now", tone: INK, emblem: "keeper" },
  { id: "archaeology", name: "Archaeology", line: "What the ground has kept", tone: CLAY, emblem: "ife" },
  { id: "royal", name: "Royal arts", line: "Ifẹ̀, Benin and the courts", tone: OCHRE, emblem: "benin" },
  { id: "belief", name: "Belief & spirit", line: "Òrìṣà, the earth and the water", tone: BRICK, emblem: "esu" },
  { id: "craft", name: "Craft & cloth", line: "Indigo, looms and gourds", tone: INDIGO, emblem: "osun" },
  { id: "music", name: "Music & performance", line: "Drums that talk, masks that dance", tone: FOREST, emblem: "eyo" },
  { id: "culture", name: "Living culture", line: "Festivals, languages and tales today", tone: GOLD, emblem: "ijapa" },
];

const V: Record<string, VerticalId[]> = {
  "nok-head": ["archaeology", "history"],
  "igbo-ukwu": ["archaeology", "history"],
  "ife-head": ["royal", "archaeology", "history"],
  "benin-plaque": ["royal", "history"],
  "idia-mask": ["royal", "history"],
  "opon-ifa": ["belief"],
  "ose-sango": ["belief", "music"],
  "osun-fan": ["belief", "culture"],
  ibeji: ["belief", "culture"],
  gelede: ["music", "belief", "culture"],
  "ogo-elegba": ["belief"],
  adire: ["craft", "culture"],
  dundun: ["music", "culture"],
  ikenga: ["belief"],
  mbari: ["belief", "craft"],
  udu: ["music", "craft"],
  akwete: ["craft", "culture"],
  nsibidi: ["craft", "history"],
  kusugu: ["history", "belief"],
  durbar: ["music", "culture", "royal"],
  "dye-pits": ["craft", "culture"],
  calabash: ["craft"],
  "amina-walls": ["history", "royal"],
  "water-mask": ["belief", "music"],
  "mami-wata": ["belief"],
  olokun: ["belief", "royal"],
};

export const verticalsOf = (o: MuseumObject): VerticalId[] => V[o.id] ?? [];
export const objectsInVertical = (v: VerticalId) => OBJECTS.filter((o) => verticalsOf(o).includes(v));
export const verticalById = (id: VerticalId) => VERTICALS.find((v) => v.id === id)!;

/* ───────── History: a timeline that links to the objects ───────── */

export type HistoryEvent = { when: string; title: string; text: string; object?: string; era: string };

export const HISTORY: HistoryEvent[] = [
  { era: "Ancient", when: "c. 900 BCE – 200 CE", title: "The Nok culture", text: "Farmers and ironworkers in central Nigeria make terracotta sculpture, some of the oldest in Africa south of the Sahara.", object: "nok-head" },
  { era: "Ancient", when: "9th–10th century", title: "Bronzes at Igbo-Ukwu", text: "Casters in the south-east make leaded bronzes of astonishing detail, found again in 1938.", object: "igbo-ukwu" },
  { era: "Kingdoms", when: "c. 12th–15th century", title: "Ilé-Ifẹ̀ at its height", text: "The sacred city of the Yorùbá produces lifelike heads in copper alloy and terracotta.", object: "ife-head" },
  { era: "Kingdoms", when: "15th–16th century", title: "Benin under Ewuare and Esigie", text: "The Kingdom of Benin expands; Oba Esigie creates the title of Iyoba for his mother, Idia.", object: "idia-mask" },
  { era: "Kingdoms", when: "1472", title: "Portuguese ships reach Benin", text: "Trade with Europe begins on the coast. Portuguese figures appear on Benin’s brass plaques.", object: "benin-plaque" },
  { era: "Kingdoms", when: "16th century", title: "Hausa cities flourish", text: "Kano, Katsina and Zazzau grow rich on trade across the Sahara. Tradition remembers Queen Amina of Zazzau.", object: "amina-walls" },
  { era: "Kingdoms", when: "16th–19th century", title: "The transatlantic slave trade", text: "Millions of people are taken from the Bights of Benin and Biafra. Their faith travels with them: the òrìṣà are honoured in Brazil, Cuba and beyond.", object: "ogo-elegba" },
  { era: "Kingdoms", when: "1804–1809", title: "The Sokoto Caliphate", text: "Usman dan Fodio’s movement unites much of the north under a caliphate centred on Sokoto." },
  { era: "Colonial", when: "1861", title: "Britain annexes Lagos", text: "Lagos becomes a British colony, the start of British rule over what became Nigeria." },
  { era: "Colonial", when: "1897", title: "The attack on Benin City", text: "A British force takes the city and removes thousands of objects. The Oba is exiled.", object: "benin-plaque" },
  { era: "Colonial", when: "1914", title: "Amalgamation", text: "The Northern and Southern Protectorates are joined into one colony called Nigeria." },
  { era: "Colonial", when: "1957", title: "The National Museum opens in Lagos", text: "Nigeria’s national museum opens at Onikan, Lagos, built around collections gathered by Kenneth Murray and Nigerian colleagues." },
  { era: "Independence", when: "1 October 1960", title: "Independence", text: "Nigeria becomes independent. It becomes a republic in 1963." },
  { era: "Independence", when: "1967–1970", title: "The Civil War", text: "The war over Biafra’s secession costs a great many lives, many from famine. Its memory still shapes the country." },
  { era: "Independence", when: "1976", title: "Murtala Mohammed is killed", text: "The head of state is assassinated in Lagos. The car he was killed in is kept at the National Museum, Lagos." },
  { era: "Independence", when: "1977", title: "FESTAC ’77", text: "Lagos hosts the festival of Black and African arts. Its emblem is the face of Queen Mother Idia.", object: "idia-mask" },
  { era: "Independence", when: "1991", title: "Abuja becomes the capital", text: "The seat of government moves from Lagos to Abuja, at the centre of the country." },
  { era: "Independence", when: "1999", title: "Return to civilian rule", text: "Elections bring in the Fourth Republic." },
  { era: "Today", when: "2005", title: "The Ọ̀ṣun grove is listed", text: "UNESCO inscribes the Ọ̀ṣun-Òṣogbo Sacred Grove as a World Heritage Site.", object: "osun-fan" },
  { era: "Today", when: "2022 onward", title: "Benin objects come home", text: "Museums abroad begin returning objects taken in 1897; the question of where they belong continues.", object: "benin-plaque" },
];

/** The museum whose structure this exhibition follows. The app is independent of it. */
export const REFERENCE = {
  name: "National Museum, Lagos",
  where: "Onikan, Lagos Island",
  note:
    "This exhibition follows the way Nigeria’s national museums present their collections, led by the National Museum at Onikan, Lagos, opened in 1957 and run by the National Commission for Museums and Monuments. ọ̀nà is an independent project and is not affiliated with either.",
};
