# DC11 — The Bentley and the Bat (UK country lane, date unconfirmed, earliest copy 20 Mar 2022)

Code `_engine/src/cases/DC11.tsx`, devices `_engine/src/dev/DC11_GlassVeil.tsx`, `DC11_PhotoTurn.tsx`. Master `out/DC11.mp4` + `_phone.mp4`.
Duration 103.2 s (title 4 s, VO 51.8 s, raws 45.9 s, end hold ~1.4 s).

## Timeline (VO = one take CASE11.mp3, split only at the two raws, both at sentence ends)
| T (s) | what |
| --- | --- |
| 0–4 | TitleCard "THE BENTLEY AND THE BAT" (src 27, plate blurred) |
| 4–30.25 | VO A: empty lane (0.5×, "UNITED KINGDOM"), the overtake, brake lights, 0.5× replay into the brake lights, the van passes, the empty lane until the Bentley swings back past — runs straight into the raw (src 16.02 → 22.23, no cut) |
| 30.25–66.42 | **RAW 1 (main, 36.2 s, one dead-air trim)** src 22.23–47.0 (stops across the lane, gets out, walks back, the van driver's taunts, the boot) + src 49.6–61.0 (side camera: shouting at the window, back to the boot with the bat). Trimmed 47.0–49.6 (camera switch blur). Climax raw kept long: it IS the incident |
| 66.42–89.45 | VO B + C: 0.5× replay of the bat; held frame tilting up into the summer tree ("EARLIEST COPY · MARCH 20, 2022"); GlassVeil; bat back in the boot; pacing by the car |
| 89.45–99.15 | **RAW 2 (9.7 s)** src 76.3–86.0: back at the window, phone out, photographing the van driver |
| 99.15–103.2 | "I'd love to know who he planned to show it to." PhotoTurn |

## Blur / audio (handle-with-care)
- Blur pass before grading (`shots/blur11.py`, faces from `shots/faces.swift` = Apple Vision at 5 fps → `shots/faces11.txt`): filmer's handle
  "u/will10000" top-left for the whole clip, the plate (yellow-plate detection every frame, held 1 s when lost), the driver's face (all
  detections incl. the window close-ups 49.8–59 and 76–87, interpolated). Contact sheet of 20–87 s checked: handle, plate, face covered.
- The repost carries music over its whole track (rawclean.py: music in 77 of 88 s, residual still audible). Raw audio = Demucs vocals stem only
  (`shots/vocals.py` → media/main_voc.wav), every swear muted (6 windows, re-checked with whisper: none left) → media/main_safe.wav;
  the van's idle = real SFX car_engine_2 at −30 dB under the raws. The Bentley driver's own words are not audible in the source.
- Never named; "threatened"/"waved" wording is the VO's. Plate never shown or said.

## Devices (REGISTRY.md)
- GlassVeil: window close-up held (src 53.0), fog spreads from his blurred face over the glass ("never publicly identified").
- PhotoTurn: phone-at-window frame (src 85.5) held, one soft shutter blink (real shutter SFX), becomes a print tipping back in 3-D.
- Brand: TitleCard, RedLabel ×2, glitch + blur-dips. No Inset, no Blender.

## Sources
- Dashcam: Protelo, "Bentley Driver Brake Checks Driver in Road Rage Incident", https://www.youtube.com/watch?v=xcErKyvHhMg (0:00–1:27 used,
  1:28+ appended photo skipped). Filmer: Reddit u/will10000 (handle blurred, not credited on screen).
- Facts: research/outline.md §11. Music: Epidemic "Music 4" −22 dB (≈ Music 5 at −13), ducked under raws.

## Notes
- No real page exists to show (no news/police record; the earliest copy is a YouTube upload): the date is a RedLabel on the footage.
- Read tool was unavailable late in the build (hook timeouts): stills after the blur check were verified numerically, not by eye; see the
  contact sheet in the first check above.

## Render / checks
- Cutcheck: 0 flags (41 cuts; designed transitions + the source's own camera switches inside the raws, allowed). First render flagged the
  0.5× bat replay (25 fps source stutter + a source cut at 60.4): replaced by a motion-interpolated 0.45× file `graded/batslow.mp4`
  (src 59.15–60.4, cutcheck clean), re-rendered.
- The window close-up (T 58–66) is where four swears were muted; the master got a slightly louder engine idle there and under RAW 2
  (ffmpeg post-mix from out/DC11_raw.mp4 + loudnorm −16; the same beds are now in the code, so a re-render matches).
