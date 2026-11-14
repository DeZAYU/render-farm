# DC13 — The Challenger in Keller (Keller, Texas, I-35W, June 2016, night)

Code `_engine/src/cases/DC13.tsx`, devices `_engine/src/dev/DC13_NightLift.tsx`, `DC13_TitleLift.tsx`. Master `out/DC13.mp4` + `_phone.mp4`.
Duration 97.1 s (title 4 s, VO 72.1 s, raw 20 s, end hold ~1 s).

## Timeline (VO = one take CASE13.mp3, split only at the one raw, at a sentence end)
| T (s) | what |
| --- | --- |
| 0–4 | TitleCard "THE CHALLENGER IN KELLER" (src 2) |
| 4–15.08 | the white car ahead at night ("KELLER, TEXAS · JUNE 2016"), tight on the car ("Dodge Challenger") |
| 15.08–30.37 | NAIP aerial of I-35W at the north Fort Worth / Keller edge: ScarTrace along the interstate ("INTERSTATE 35W"), then Aerial with a white box on the next overpass ("NEAR KELLER, TEXAS"). The filmer never named his exit: no route, no U-turn path and no hospital drawn — the corridor and an overpass only |
| 30.37–43.37 | the turning lane + turn sign + the car; the windscreen wide; "Watch the passenger side" runs straight into the raw (src 28.0 → 30.31) |
| 43.37–63.37 | **RAW (main, 20 s)** src 30.31–50.31: both doors open, a man beside the car, the swerve round them, the dark escape, passing close by the white car's side. Phone's own sound (engine, no music, no speech). Exposure lifted (brightness ramp 1→1.9) once the picture drops into the dark after the swerve |
| 63.37–97.1 | NightLift; the dark floor ("picture goes dark"); TitleLift (real YouTube page); tail lights; floor; 0.6× light streaks; 0.5× the white car's side |

## Devices (REGISTRY.md)
- NightLift: clip slows (0.4×) to a hold at src 35.0 (both doors open), the night lifted only round the man standing beside the car, push in.
  (The man is on the car's left as seen from behind; the VO follows the filmer: "the passenger, the man standing beside the car".)
- TitleLift: the filmer's real page (capture_page.py, 13 Nov 2026: title "Scary encounter! Attempted car jacking?", Bear With Hat, 488k views,
  "Happened in Keller, Texas, I35W") as a lit 3-D card; title strip forward, then the views line. The page's player showed YouTube's
  "confirm you're not a bot" panel: not worked around, only the title/description block below it is used.
- Brand: TitleCard, RedLabel, ScarTrace, Aerial, glitch + blur-dips. No Inset, no Blender.

## Sources
- Phone video: Bear With Hat, https://www.youtube.com/watch?v=P3iVn0CqRLI (the filmer's own upload, GREEN). Used src 0–58.
- Aerial: USGS NAIP ImageServer (public domain), bbox −97.335,32.920,−97.301,32.936 (I-35W near Golden Triangle Blvd).
- Facts: research/outline.md §13 (filmer's description). No plate legible. Men unidentified; no "carjacker"/"kidnapper" wording.
- Music: Epidemic "Music 1" −16 dB (≈ Music 5 at −13), ducked under the raw. SFX: glitch ×3, mouse_click on the title lift.

## Notes
- Only one raw: after the escape the clip is the phone on the floor (near-black); a second raw there would be black screen + rumble.
- 15 s of the VO (the test, the overpass, the U-turn) has no footage anywhere; the aerial shows the real interstate instead of invented paths.
- Read tool was unavailable late in the build (hook timeouts): stills were verified numerically (exposure/contrast), not by eye.

## Render / checks
- Cutcheck: 0 flags (5 cuts). Duration 97.2 s.
