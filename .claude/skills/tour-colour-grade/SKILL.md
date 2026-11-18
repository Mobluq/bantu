---
name: tour-colour-grade
description: Grade Tour Studios video with the house "Wes film" look (warm, pastel, Wes Anderson palette, cinema-camera texture) using ffmpeg. Use whenever a Tour Studios TikTok, reel or showreel is rendered, re-graded or compared, or when footage looks flat, grey or "like a phone". Covers iPhone HDR (HLG) conversion, the 3D LUT, halation, diffusion and grain.
---

# Tour colour grade ("Wes film")

Folu asked on 18 November 2026 for every Tour Studios video to be graded "to better Wes Anderson style" and to "look like it was shot on a cinema grade camera". This skill is that grade. It is built for ffmpeg only, so it runs in any session with no editing app.

## What the look is

- **Palette (Wes Anderson):** warm golden cast, cream whites instead of blue-white, coral and pink reds, mustard yellows that pop, greens pulled to sage or khaki, blues pushed to powder blue, purple LED light turned lavender-pink. Pastel rather than neon: high-chroma colours are softly compressed and lifted.
- **Tone (film print):** blacks lifted to a warm brown (never crushed), gentle mid contrast, soft highlight shoulder so nothing clips hard.
- **Texture (cinema camera):** a red-orange halation glow around bright highlights, light diffusion like a mist filter, phone over-sharpening taken off, fine temporal grain, a faint vignette.

## Files

- `make_lut.py`: builds `tour-wes.cube` (33-point 3D LUT, Rec.709 in and out). The palette moves are hue-selective in OKLab and protect near-neutrals and skin. To change the look, edit the hue bumps and rebuild with `python make_lut.py tour-wes.cube [strength]`. A strength of 0.6 gives a lighter version.
- `look.py`:
  - `is_hlg(path)` tells you whether a file is iPhone HDR.
  - `hlg()` returns the HDR-to-SDR conversion.
  - `look(scale)` returns the LUT, halation, diffusion, de-sharpen, grain and vignette chain.

## How to apply

1. **Convert HDR first, per source.** iPhone clips (`color_transfer=arib-std-b67`, BT.2020, 10-bit) must go through `hlg()` before scaling. Without it they render flat, grey and slightly green; that was the case for every raw cut before 18 November. Finished films and DJI clips are already Rec.709 and skip this step.
   `ffprobe -v error -select_streams v:0 -show_entries stream=color_transfer -of csv=p=0 FILE`
2. **Grade once, at output size,** after the clips are joined and before any graphics: `[v]` + `look(1.0)` + `[graded]`. Use `scale=0.5` for 540-wide tests.
3. **Then overlay the brand layers on the graded picture:** the Tour outro graphic, the spinning logo, the titles and the subtitles. They stay true to brand colour because they sit above the grade.

Example for one HDR clip:

```bash
ffmpeg -i IN.MOV -filter_complex "[0:v]$(python -c 'import look;print(look.hlg())'),scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,$(python -c 'import look;print(look.look(1.0))')[v]" -map "[v]" -map 0:a -c:v libx264 -crf 18 OUT.mp4
```

## Checks before delivering

- Make a before/after strip of 6 to 9 frames from different scenes and look at it. Skin should stay warm and natural, and white shirts should be cream, not lilac.
- Burned-in subtitles in finished films turn slightly cream and softer under the grade. Titles and subtitles drawn by us after the grade stay crisp.
- Grain survives TikTok's re-encode only if it is at least `c0s=6`. Do not go above 9, or faces look dirty.

## Not part of this skill

Framing (symmetry, centred subjects), pacing and sound. The Wes look also depends on centred, symmetrical shots, so choose punch-ins and crops that centre the subject.
