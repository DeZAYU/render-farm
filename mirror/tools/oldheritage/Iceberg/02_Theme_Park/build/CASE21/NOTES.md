# TP21 · Fire at the top of the Dino Eye · Bangkok, Thailand

Code: `_engine/src/cases/TP21.tsx` · devices `_engine/src/dev/TP21_RoundCut.tsx`, `_engine/src/dev/TP21_EmptyWheel.tsx`
Output: `build/CASE21/out/TP21.mp4` (master, −16 LUFS) + `TP21_phone.mp4`. Duration 88.5 s.

## Edit (re-cut 3 Nov to the owner's raw/VO rules)
TitleCard (4 s, still of the [DB] close shot) → VO P1 (place, date, the fire; 16.6 s) → RAW A (main, 18 s) → VO P2 (skyline, storm,
power cuts, ride shut; 11.3 s) → RAW B (12 s, with the [DB] round cutaway for 7 s inside it) → VO P3 (crews, rain, outcome: EmptyWheel,
short circuit, stays shut, last line; 25.9 s) → 1 s hold. Two raws only, both at paragraph ends; no VO stretch shorter than 11 s;
each device once. RedLabels: SUKHUMVIT SOI 22, BANGKOK · APRIL 30, 2016.

Raws (cut-sheet cues kept in order; the four short cues merged into two long raws to meet the owner's rules):
- RAW A [DP] cue 0:00–0:30 → file 7.9–25.9 (18 s; 0–7.9 is the opening pans, source cuts and their shaky settle)
- RAW B [DP] cues 0:30–1:30 → file 66.2–78.2 (12 s), with [DB] cue 0:19–0:26 → file 23.0–30.0 as the RoundCut inside it
  (file 20–23 is a white motion blur). "Crews…" and "And still the rain came down" now run on as VO, not stranded between raws.

## Devices
- **RoundCut**: the [DB] clip as a white-ringed round inset (ring draws on, disc pops in) in the corner beside the [DP] panel, inside RAW B.
- **EmptyWheel**: white-line wheel over darkened, blurred footage; 18 hollow cabins hang on, a white pass checks each one, only the
  top cabin glows red; on "lucky nobody was on the wheel ... the storm had closed it". The cabin count is illustrative.
- Channel grammar: TitleCard, 2 RedLabels, vertical clips in a white frame over a bright blurred copy (no side bars).
- No Aerial: no free high-res aerial of Sukhumvit Soi 22 (NAIP is US-only), and the place label on street footage already says it.

## Sources
- [DP] main: https://www.youtube.com/watch?v=jYO7d_k3fXs (vertical 202x360 phone clip; the uploader credits a Facebook user, not named on screen)
- [DB] extra1: https://www.youtube.com/watch?v=Ygtvg66YQfA (vertical content in a 640x360 frame with blurred sides + a small logo in the
  right blurred side: cropped to the content, `graded/dbv.mp4` (file 0–37) and `graded/dbc.mp4` (file 37–43.3), so the logo is gone)
- VO: `02_Theme_Park/vo/raw/CASE21.mp3`. Music: Epidemic `music/Music 4.mp3` from 14 s, −21.5 dB (file −11.9 LUFS vs VO −23.7 → ~10 LU under), ducked under the raws.
- SFX (real, sfx_n2/real): rain_22 / rain_9 (Pixabay rain on tent) beds on the storm lines, "rain came down" and the last line; boom_4 low on "thunderstorm",
  boom_2 low on "exploding transformers"; glitch_02/03 only on the two designed glitches.
- Raw audio: `media/main_clean.wav`, `media/extra1_clean.wav` from rawclean.py (no music detected in either: original kept).
- Nothing needed blurring (no people, injured or bodies on screen).

## Downloads
None. Only the two given clips were used.

## Cutcheck
Allowed windows = the glitches/blur-dips ±0.3 s plus one handheld jolt inside RAW A ([DP] file 9.85: checked frame by
frame, a fast tilt of the phone, not an edit). The other jolts (28.9, 43.1, 49.9, 2.6) are kept out of every window.

## Unsolved / owner should know
- Both sources are very low resolution (202x360 and ~252x360): soft at 1000 px panel height.
- [DB] is graded bright by the house normaliser; it is pulled back with a CSS brightness/contrast in the case.
- No footage of the crews or the park itself: "crews ... twenty minutes" sits on a tight push into the burning top.
