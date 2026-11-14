# TP13 — Star City burns after closing (Pasay, 2 Oct 2019)
Code: `_engine/src/cases/TP13.tsx` (DUR 187.0 s). Music: Music 4 (−22 dB, two passes, dipped under raws).

## Devices
- **FireClock (day strip)** `dev/TP13_FireClock.tsx`: 24 hour cells over the morning-after drone; burns from 12:22 AM to 4:32 AM / 2:02 PM, 13 HR 40 MIN bracket.
  (First built as a 24-h dial; changed to a strip because TP10 uses a clock dial — 3 positions away.)
- **Survivors** `dev/TP13_Survivors.tsx`: morning-after freeze, park dimmed except the Star Flyer and Giant Star Wheel, brackets + names.
- **Blender ballast** `assets/ballast_blender.py` → `graded/ballast.mp4`: a fluorescent batten opened up, ballast glowing hotter while the tube fails (6 s, played at 0.775×).
- RedLabels: OCTOBER 2, 2019 / STAR CITY, PASAY / FEBRUARY 24, 2022.

## Raws (all 7 cut-sheet cues, in order)
R1 drone glow (continues the "From above" shot) · R2 drone over the trucks (continues the trucks shot) · R3 rooftop firefighter (extra1 6.0–18.65)
· R4 line of flames (extra1 59.6–70.6) · R5 ground-level flames (main 291) · R6 ride buildings burning (main 301) · R7 hoses (extra1 36.6–46.1).
Sound: extra1's own track through `rawclean.py` → `media/ex1_clean.wav` (+6 dB limited: `ex1_clean_amp.wav`). AeroMark's main video carries only added
music (whisper: "(upbeat music)" throughout), so its four raws use the same fire's real roar from the rooftop phone (extra1 96–108 s, no speech) at −6/−8 dB.
Owner may prefer them silent: change the RAWS gains for R1/R2/R5/R6.

## Sources
- main: AeroMark drone + ground camera https://www.youtube.com/watch?v=dFrOofsdNVk (audio = added music, never used)
- extra1: rooftop phone https://www.youtube.com/watch?v=31gtrbuPEnI (0–126 s used; walks indoors after)
- downloaded (`footage/20_.../more/`): AeroMark aftermath drone part 2 https://www.youtube.com/watch?v=4zlv5RaJQNI (5.9k subs, used 130–350 s);
  Travel Buddy reopening quick view https://www.youtube.com/watch?v=DeBFShyTbug (1.6k subs, used 28–56 s; vlogger faces avoided);
  SNEAK PEAK TV BqLJZNagPHA downloaded but NOT used (burned-in "ACTUAL FOOTAGE" captions).

## Checks / issues
- Cutcheck v1 had JUMPs on dark night-to-night hard cuts and a STUB in the reopening vlog (coaster train) → blur-dips added, window moved to file 15.0 s.
- Allowed window 59.3–59.7: a handheld jolt inside the rooftop raw (source motion, not a cut).
- Loss figures (₱1 bn vs ₱15 m) deliberately left as footage, no number card.

## Why v1 was flagged, and the 3 Nov fix
- v1 (TP13_v1_flagged.mp4): cutcheck JUMPs on dark night-to-night hard cuts + a STUB in the reopening vlog (fixed in code 2 Nov), and
  the Blender ballast's strobing tube = FLASH/ODD flags (148-152 s). Now graded/ballast_soft.mp4 (tmix 7-frame weighted): 0 flags.
- Owner rule 3 Nov (no lone VO line between raws): A3+B merged (6.8 s), R3+R4 now one 23.65 s rooftop raw (blur-dip between windows);
  C2+C3 merged (6.75 s), R6+R7 back to back (14 s). Same total length (187 s).
- Morning-after run broken: "Investigators found gasoline" now on the night drone (main 126), blur-dips both sides.

## 3 Nov 2026 audit (raw lengths in code, raws only at incident moments)
- RAW 1 (drone glow) 5.0 -> 8.0 s and RAW 2 (trucks + fire) 5.04 -> 8.0 s IN CODE (X() timeline shift, same drone shots run on:
  main 14-25.3 / 100-112.6, no source cut; sound ex1 96-104 / 101-109). Replaces the raw_extend.py splice.
- Removed (cutOut): RAW 5 (open flames, after the 'burns well' explanation) and RAW 6+7 (near-dup of the rooftop hose raw).
  3 raw moments now: 8 s, 8 s, 23.65 s main rooftop block. Joins: dip / whip halves meet at the cut. 174.0 s.
