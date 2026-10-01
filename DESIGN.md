# Design System: ọ̀nà, a living almanac of Nigeria

Source of truth for generating new ọ̀nà screens (Google Stitch or by hand). The live reference is the prototype in this repo (`components/ona`, `app/page.tsx`). When this file and the prototype disagree, this file wins and the prototype gets fixed.

## 1. Visual Theme & Atmosphere

**Market collage.** A print shop on warm cream stock. Every screen looks like something pulled off a Lagos poster wall and put into a phone: oversized condensed headlines cut with an italic serif word, small monospaced captions like the small print on a stamp, textile bands for dividers, torn-paper edges, halftone dots and a fine grain over everything. Guides are not characters. They are stamp-cut emblems printed in one ink, slightly rough at the edges, as if pressed by hand.

The mood is warm, confident and unhurried. It is a museum shop that respects its subject, not a game that shouts. Living religions are on screen; nothing is ever played for laughs at their expense.

- **Density: 4, "Daily App Balanced".** One idea per screen. Generous space around headlines. Data appears as short definition rows, never tables.
- **Variance: 8, "Offset Asymmetric".** Headlines are left-aligned and break across lines at uneven lengths. Emblems sit off-axis, cropped by the screen edge. Stamps are laid out at small rotations, like a scrapbook.
- **Motion: 6, "Fluid CSS".** Weighty springs, staggered reveals, a few perpetual loops (pin pulse, voice waveform, marquee). Nothing spins for decoration.

## 2. Color Palette & Roles

**Rule: one interface accent.** Only Brick is used for links, focus rings, active tabs and eyebrow labels. The pigment colours below are content colours: each belongs to a guide, a region or a mode, and appears only as a large flat field (a card, a hero block, a stamp). They never colour a button label, a link or a focus state.

### Neutrals (warm, one family; never mix in cool greys)
- **Cream Stock** (#F1E7CF): primary background for every light screen.
- **Paper** (#FBF5E6): raised surfaces: speech bubbles, bottom sheets, stamp borders.
- **Kola Ink** (#1E140C): primary text, primary buttons, outlines. This is the darkest colour in the system; pure black (#000000) is never used.
- **Muted Earth** (#6A5747): secondary text, captions, metadata. Passes 4.5:1 on Cream Stock.
- **Hairline** (rgba(30,20,12,0.12)): dividers and 1px structural lines.

### Interface accent (the only one)
- **Brick** (#B3261B): eyebrow labels, links, active tab, focus rings, the Èṣù field, error states. Saturation is held under 80%.

### Pigments (content fields only, never interface accents)
- **Forest** (#1E4D2F): Ọ̀ṣun's field, success feedback sheet, the stamp book page.
- **Marigold** (#F0BE3C): the key chip inside primary buttons, highlight words on dark fields.
- **Ochre** (#D99A2B): the northern region, Bayajidda's field.
- **Clay** (#E4A47C): the western region, Woyengi's field, terracotta objects.
- **Indigo** (#22305C): Ala's field, adire textile band.
- **Night** (#141B36): Àlọ́ (moonlight tale) mode background.

### Banned colour moves
- No purple or blue neon, no glowing buttons, no gradient text.
- No gradients at all, except the radial spotlight behind a 3D object and metallic shading inside an object illustration.
- Never put two pigment fields edge to edge without a Kola Ink rule, a textile band or Cream space between them.

## 3. Typography Rules

Every face below was chosen because it stacks Yorùbá tone marks over underdots correctly (ẹ̀, ọ̀, ṣ). Test any substitute with the string `Ẹ káàárọ̀ mà · Ọ̀ṣun · Ifẹ̀ · dọ̀bálẹ̀ · Ụ̀mụ̀` before adopting it. Names are never written without their marks.

- **Display: Anybody**, weight 850, width 55%, tracking -0.005em, leading 0.86. Used for English headlines and names of people and gods. Sentence case, never all caps. Hierarchy comes from weight and the serif cut, not from making everything huge: phone headlines sit between 50px and 84px.
- **Editorial accent: Instrument Serif Italic**, weight 400. One word or phrase per headline, set on its own line in Brick (light) or Marigold (dark): "Where the *roads* meet.", "Greet the *elder*." Also used for subtitles, drop caps and pull quotes.
- **Body and UI: Archivo**, width 100%, weight 400 to 700. Body 14 to 15.5px, leading 1.42 to 1.55, max 65 characters per line.
- **Captions: JetBrains Mono**, uppercase, tracking 0.06em, 9 to 11px. Used for eyebrow labels, numbering (Nº 001, 02 / 05), coordinates, stamp denominations and timestamps. Numbers in counters use tabular figures.
- **Banned:** Inter, Roboto, Arial, Helvetica, Open Sans, Georgia, Times New Roman, Garamond. No serif in data rows or controls.

## 4. Hero Section

- **Signature technique: inline emblems.** Small stamp-cut emblems sit inside headlines at type height, as visual punctuation between words ("Walk [Ọ̀ṣun emblem] Nigeria"). They are printed in the headline's own colour, never boxed, never photographic.
- **Asymmetric only.** Headlines are left-aligned. On desktop the hero is a split: type on the left, the live phone or an emblem on the right. Centred heroes are banned.
- **No overlap.** Text never sits on top of an emblem, image or other text. Large emblems may be cropped by the screen edge, but always in their own zone beside or below the type.
- **One exception: the postmark.** A postmark is meant to land across the stamp it cancels, so it may overlap a stamp's edge. It never covers the stamp's title.
- **One primary action.** One pill button. No secondary "learn more" link, no scroll arrows, no "scroll to explore".

## 5. Component Stylings

- **Primary button (pill with key chip).** Fully rounded pill, 58px tall, Kola Ink fill, Cream label in Archivo 600. The trailing arrow sits in its own 44px circular chip in Marigold, flush with the right inner padding. Hover: the chip nudges up-right by 1 to 4px and scales to 105%. Press: the whole button scales to 98% and drops 1px. Disabled: 40% opacity, with the reason in Brick text directly beneath.
- **Choice chip.** 44px pill, 1.5px Kola Ink outline, transparent fill. Selected: Kola Ink fill, Cream text, a Marigold check that grows in from zero width.
- **Answer card (lessons).** 16px radius, 1.5px outline at 35% ink. Correct: 2.5px Forest outline with a solid 4px Forest offset shadow and a Forest check disc. Wrong: same in Brick, plus a short horizontal shake. Unchosen answers fade to 50%.
- **Speech bubble.** Paper fill, 1.5px Kola Ink hairline, radius 20px with a square 4px corner pointing at the speaker. The speaker's name sits top-left in bold, in the guide's pigment; a round play button with a live waveform sits top-right. The guide's emblem avatar is a 46 to 54px disc to the left.
- **Guide emblem.** One-colour stamp print on a flat field, built only from rays, rings, chevrons, waves and simple silhouettes. The edges are slightly displaced and speckled like a rubber stamp. No faces with expressions, no gradients, no outlines in a second colour.
- **Stamp.** Perforated edge on a Paper border, an inner Kola Ink hairline inset 5px, "NIGERIA" top-left in mono, a naira denomination top-right in condensed display, the emblem centred, the title and a mono subtitle at the bottom. Locked stamps are a dashed outline with a lock and a plain sentence saying how to earn them.
- **Bottom sheet.** Paper (or Night), with a torn top edge, sliding up on a spring. It always contains: emblem avatar, mono kicker, display title, serif subtitle, one sentence, one action.
- **Feedback sheet.** Full-width pigment field (Forest for right, Brick for wrong) with a torn top edge and a halftone overlay. Display exclamation in Marigold or Cream, one explanatory sentence, one pill button.
- **Map.** The real Nigeria outline, split by the Niger and Benue into three pattern-filled regions (dots, diagonals, rings) with a hard Kola Ink offset shadow, like a paper cutout. Places: pulsing Brick dot for today, Forest diamond for stamped, Paper ring for open, dashed ring for hidden.
- **Double-bezel containers (showcase site only).** Major cards sit in a hairline tray (4% ink fill, 8% ink ring, 6px padding) around an inner core whose radius is the outer radius minus the padding.
- **Loaders.** Shimmering skeleton blocks shaped exactly like the content they replace. No spinners.
- **Empty states.** A dashed outline, an emblem or lock, a display title that says what is missing ("No saved words yet", "Kano is still hidden") and one sentence that says how to fill it.
- **Errors.** Inline, in Brick, directly under the thing that failed, in a complete sentence that says what to do next.
- **Icons.** Phosphor, Light weight, 20 to 24px, single colour. Filled weight only for the active tab and for play and pause glyphs.

- **Die-cut sticker.** Emblems, cowries and stamps can be lifted off the page with a 2px paper outline traced around their shape and a soft tinted shadow, as if cut out and stuck down. Use for collage and celebration moments, never for interface controls.
- **Graph paper.** Study surfaces (the Learn path, the guide chat) sit on a faint 24px ink grid, like an exercise book.
- **Inline pills.** Hero headlines may carry one or two rounded pills at type height holding a living picture (the map, a slowly turning emblem).
- **Film-strip loader.** The showcase opens once per session on brick red between two perforated strips, counting 0 to 100, then lifts like a curtain.
- **Section index.** On desktop, a fixed pill at the lower left names the numbered section on screen (02 / 07 (Why)). It stays hidden over the hero.

## 6. Layout Principles

- **Phone frame: 390 × 844 reference.** Content gutters of 16 to 22px. The tab bar is fixed to the bottom, 52px tall plus the safe area.
- **Screen anatomy, top to bottom:** mono eyebrow row; a display and serif headline; the guide's speech; the interactive content; space; one action. Screens that scroll (almanac entries) keep the tab bar fixed and scroll only the article.
- **Grids, not flex maths.** Definition rows use a two-column grid (96px label, flexible value). Showcase sections use a 12-column grid with asymmetric spans (a 7-column, two-row hero card beside two stacked 5-column cards).
- **Banned:** three equal cards in a row; centred heroes; text placed on images; absolutely positioned text stacked over other content.
- **Containment:** the desktop showcase is capped at 1400px wide, with 48px side padding and vertical sections of 96 to 160px.
- **Full-height sections** use dynamic viewport height (`100dvh`), never `100vh`.

## 7. Responsive Rules

- **Below 768px everything is one column.** The bento becomes a stack, the lesson cascade loses its rotations and overlaps, and the split hero puts the live app first and the text below.
- **No horizontal page scroll.** Horizontal scrolling is allowed only inside a deliberate carousel (the guide picker), which shows a partial next card as the affordance.
- **Type scales with `clamp()`.** Body text never drops below 14px.
- **Touch targets are at least 44 × 44px**, including map places (an invisible 12px-radius hit area around each pin).
- **Desktop navigation** is a floating pill detached from the top edge; its menu opens as a full-screen frosted overlay with staggered links. On phones the app's own tab bar is the navigation.

## 8. Motion & Interaction

- **Springs everywhere.** Default: stiffness 100, damping 20 (weighty). Snappy controls (tabs, toggles, chips): stiffness 380, damping 30. CSS fallbacks use `cubic-bezier(0.32, 0.72, 0, 1)`. Linear easing is banned except for the marquee.
- **Staggered entrances.** Headline lines rise 40px in sequence (80ms apart). Lists and answer cards cascade at 40 to 80ms per item. Showcase sections fade up 64px out of a 12px blur over 900ms when they enter the viewport.
- **Shared-element movement.** The active tab dot, the day/night toggle pill and the selected-guide ring glide between positions rather than jumping.
- **Perpetual loops (few, purposeful):** today's map pin pulses; the voice waveform bars move only while audio plays; the greetings marquee scrolls slowly; the 3D object floats 6px. Nothing loops that the user is not meant to look at.
- **Signature moment:** when a lesson is completed, the new stamp drops in from above at 150% scale and settles, then the postmark slams down 0.7s later with a stiff spring.
- **Performance:** animate only `transform` and `opacity`. The grain overlay is one fixed, non-interactive layer for the whole page. Backdrop blur only on fixed layers (nav, menu, toast).
- **Reduced motion:** all loops stop and transitions become instant crossfades when the user asks for less motion.

## 9. Content & Voice Rules

- Guides speak in short, warm sentences, in the first person, with a greeting in their own language first. They encourage; they never guilt, nag or threaten. No streak shaming.
- Every factual claim on screen must be checkable, and contested stories say they are contested ("told in many versions").
- Prices in naira (₦) on stamps are decorative denominations, never prices for sacred content.
- Placeholder people are real-sounding Nigerian names or bracketed fields ("[ADVISOR NAME]"). Never invent a reviewer or an endorsement.

## 10. Anti-Patterns (Banned)

- No emojis anywhere, including copy and alt text.
- No Inter, Roboto, Arial, Helvetica, Open Sans or generic serifs.
- No pure black (#000000).
- No neon, glow or coloured outer shadows; shadows are either solid offsets in a pigment or soft and tinted with Kola Ink.
- No gradient text and no decorative gradients.
- No more than one interface accent; pigments never colour buttons or links.
- No text over images or emblems; no overlapping text.
- No three equal cards in a row; no centred heroes.
- No custom cursors.
- No "Scroll to explore", bouncing chevrons or scroll arrows.
- No AI copy clichés: elevate, seamless, unleash, next-gen, immerse yourself, embark.
- No fake numbers or round stats; no fake scarcity, countdowns or "only 3 left".
- No spinners; no "No data" empty states.
- No caricatured deities: no cartoon faces, no comic expressions, no sexualised or demonic depictions, no imagery of closed rites (for example Orò, or the inside of Egúngún practice).
- No names written without their tone marks and underdots.

## Responsive app frame

- The app frame (`.ona-root`) is an inline-size container. Display headlines use `text-[min(Npx,Xcqw)]` so they scale with the phone, not the window. Any shrink-to-fit parent of the frame must set an explicit width (`w-full`), because a size container has no intrinsic width.
- Every screen either scrolls or flexes its hero area (map, turntable) with a minimum height, so 320×568 and landscape stay usable.

## Festival calendar

- Year grid (4×3 month tiles, dots coloured by people, dashed dot = moon-dated), then a labelled timeline (name column + 12-month track), then a swipeable month view with season, then moving dates.
- One colour per people: Yorùbá brick, Igbo indigo, Hausa forest, Edo ochre, Efik gold, other clay, national ink.
