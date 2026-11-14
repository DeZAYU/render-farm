# DC14 — The Firework at the Red Light (Nashville, Tennessee, 4 July 2021)

Code `_engine/src/cases/DC14.tsx`, master `out/DC14.mp4` + `out/DC14_phone.mp4`. Duration 104.2 s (title 4 s, VO 84.4 s, raw 14.95 s, hold 0.9 s).

## Timeline (VO = one take, split once, at a sentence end)
| T (s) | what |
| --- | --- |
| 0–4 | TitleCard "THE FIREWORK AT THE RED LIGHT" on the graded dashcam frame (src 12) |
| 4–31.46 | VO A: opening drive 0.5x (NASHVILLE, TENNESSEE · JULY 4, 2021), convertible ahead, one continuous move from the hood to the real "17TH AVE N" street sign in the frame (label 17TH AVENUE NORTH & CHURCH STREET) and back out; held frame on "pay attention to the white sedan…" |
| 31.46–46.41 | **RAW 1 (main)** src 18.8–33.75 (14.95 s): the sedan rolls up, sits beside him, the firework leaves its back window (27.4), it pulls away, the flash and the burst over the car, smoke. Real sound (street, the burst, "Oh"); burst pulled down 14 dB so it lands a little above the voice |
| 46.41–104.2 | VO B: SparkHold on the throw, 0.5x first flash, the burst blooming, the two in the cabin, the open cabin, Kirby's photo of the burned top (Inset), PageLamp on the FOX 5 page (headline → police paragraph / Infiniti G37 / random act), the sedan leaving 0.26x, the sedan arriving 0.4x, the burst frozen at its height |

Only one raw: the whole clip is 33.75 s and the incident is one continuous 15 s moment; the build-up before it (waiting at the light) has nothing happening. Under the VO after the raw the case reuses moments from the raw as slow, reframed replays (no other footage of this event exists outside TV copies).

## Devices (REGISTRY.md)
- SparkHold — 0.4x replay, freeze on the spark at the sedan's back window, grey except a small oval of colour, then runs on.
- PageLamp — the real FOX 5 page as a sheet under one lamp; the light slides from the headline to the police paragraph. No red.
- Brand: TitleCard, RedLabel ×2, Inset (once, Kirby's photo), glitch + blur-dip.

## Sources
- Dashcam: the family's own upload (Kathy Kirby, 2 subs), https://www.youtube.com/watch?v=QYBBLyx34VI — whole clip. Camera's wrong clock stamp
  (TOGUARD 09/01/2019) delogo'd; the convertible's plate (6–33.8 s) and the sedan's plate (parked 21–28.6 s) blurred before grading.
- Page: FOX 5 New York / FOX TV Stations, "VIDEO: Driver burned after lit firework tossed into convertible" (6 Jul 2021),
  https://www.fox5ny.com/news/video-driver-burned-after-lit-firework-tossed-into-convertible (capture_page.py: shots/fox.png; pieces by shots/sheets.py:
  masthead, headline/byline, police paragraph; the dead video box and the weather bar left out).
- Photo of the burned top: Colin Kirby's own photo as published on that page ("Credit: Colin Kirby"), cropped from the capture → graded/burn.jpg.
- Facts: research/outline.md §14. Nobody named as a suspect; "no arrest has ever been announced" (no arrest found, Nov 2026).
- Music: Epidemic "Music 3" −20 dB, ducked under the raw. SFX: glitch ×3, paper, tape click on the freeze, a far boom under the opening.
- rawclean.py: music removed at 2–14 s (car radio / street), outside the raw window.

## Checks / decisions
- The Nashville intersection aerial was dropped: NAIP around the geocoded corner didn't match the low-rise street on the dashcam, and a box on an
  unverified spot would be wrong. The real street sign in the dashcam frame shows the place instead.
- Stills checked after a blind first pass (the image viewer was down for part of the night): SparkHold oval was too large (looked undrained) → made
  small; PageLamp page ran off the right edge → re-framed.
- Cutcheck: 2 flags in the first render at 57.3/57.7 = the real burst bloom in the 0.5x replay (allowed window), 0 flags otherwise.
- Final render 14 Nov 09:06: cutcheck 0 flags (burst bloom window allowed). Master loudness by section: VO A −17.5, raw −13.6, VO B −17.2 LUFS
  (first render had the burst ~18 dB over the voice and part B 4 dB low after mastering → burst pulled down 14 dB, street sound +3 dB).
