# ọ̀nà for museums

ọ̀nà ships with a demo exhibition, **Roads of Nigeria**. Its rooms and subjects follow the way Nigeria's national museums present their collections, led by the National Museum, Lagos (Onikan). ọ̀nà is independent of that museum and of the National Commission for Museums and Monuments; a museum that adopts it replaces the demo content with its own.

## What visitors get

| Feature | Where | Notes |
| --- | --- | --- |
| Label-number keypad | Museum tab → *Enter a label number* | Three-digit codes, room number first (101–603). |
| QR codes on labels | `/visit/<code>`, e.g. `/visit/201` | Opens straight onto the object. No install, no sign-in, no onboarding. |
| Audio guide | Every object page | Read aloud by the room's guide using the device's speech voice, with a transcript. |
| Children's labels | *For children* toggle on every object | Ages 5–11. The Family trail turns it on automatically. |
| Guided tours | Museum tab → *Guided tours* | Highlights (8 stops), Family trail (6), Gods and spirits (8), drawn on the floor plan. |
| Subjects (verticals) | Museum tab → *Explore by subject* | History (timeline), Archaeology, Royal arts, Belief & spirit, Craft & cloth, Music & performance, Living culture. |
| Ask the guide | Object page → *Ask …* | The guide knows which object the visitor is in front of. Live answers need `ANTHROPIC_API_KEY` or AI Gateway billing; otherwise it answers from the exhibition texts. |
| Visit progress | Museum tab | Objects seen are remembered on the visitor's own phone only. |

## What staff get

- **Printable wall labels**: `/labels`. One card per object with the number, tombstone, label text and a QR code. Print on A4 and cut. Set `NEXT_PUBLIC_SITE_URL` to your own domain before printing so the codes point at it.
- **Kiosk mode**: `/kiosk` for gallery tablets. Attract screen, nothing saved, resets after 90 seconds without a touch. Use the tablet's guided-access or single-app mode to pin the browser to this page.
- **Offline**: a service worker caches the app after the first visit, so it keeps working on weak gallery Wi-Fi.

## Replacing the demo exhibition

All exhibition content lives in `lib/ona/museum.ts`:

- `EXHIBITION`: title, subtitle, `venue` (shown on the kiosk and labels: put your museum's name here once you are the one deploying it).
- `GALLERIES`: rooms, their place on the 3×2 floor plan (`cell`), colour and guide.
- `OBJECTS`: one entry per object. Keep `code` unique and three digits. Fields: title, local name, culture, place, date, material, wall label (about 50 words), audio-guide story, children's text, *Look for* prompts and suggested questions.
- `provenanceFor(object)`: currently a placeholder explaining that each entry describes a type of object. Replace it with each object's accession number, acquisition history and any history of removal or return. This matters: several object types here (Benin brass, Nok terracotta) have well-known histories of looting and illegal excavation.
- `TOURS`, `VERTICALS`, `HISTORY`: tours, subject groupings and the timeline.

Every factual statement in the demo is written to the most widely accepted scholarly view, with ranges marked *c.* and contested points described as contested. Have your curators review any text before it goes on a wall.
