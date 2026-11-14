# TP04 — New Year's Eve on the Bomber Maxxx (Rennes, 31 Dec 2018)

Code: `_engine/src/cases/TP04.tsx` · out: `build/CASE04/out/TP04.mp4` (+ `_phone.mp4`) · ~3:21 (201.4 s)

## Edit
- TitleCard on the case's own frame (main.mp4 31 s) → footage-led shots on the VO words → 4 raws → outcome said and shown
  (the eight brought down, last at 6 AM, nine hours; no injuries over the ladder-basket shot).
- VO: one take (`vor/CASE04.mp3`, no count word in this take), split only at the raws (5 parts).
- Raws at all seven ▶ RAW cues of the cut sheet, in place and order, trimmed to the moment (owner rule 5b):
  R1 B2 e2 1–9 (a rescuer climbing the arm; crowd cheering), R2 BM main 9.5–16.5, R3 BM main 48.6–56.6 (screams from below,
  after the fight/tear-gas lines), R4 BM main 76–82, R5 B1 e1 22–36 (the two figures go down, straight out of the freeze),
  R6 B1 e1 80–93.5 (into the basket, applause), R7 B3 e3 4.4–13.4 (continues the "Another descent" shot, same take).
  Raw sound = rawclean.py output only (`media/main_clean.wav` --force, `e1_clean.wav`, `e3_clean.wav`, `e2_clean.wav` --force),
  per-raw gain to ~−24 LUFS, faded in/out, never under the VO. No injuries/bodies on screen: nothing to blur.
- Music: Epidemic ambient Music 4 (−21.5 dB ≈ 10 LU under VO), ducked to half under the quiet raws, second pass from 20 s.
- SFX: glitch (title, into LadderGap), whooshes into the Blender shots, wind under R1/R3, shutter on the freeze.

## Devices (new for this case; registry lines added)
1. **Blender ride model** (`assets/bomber.py` → `maps/bomberA.mp4` 6 s, `bomberB.mp4` 4.5 s): night model of the ride — the
   52 m arm swings its gondola up and over and stops at the top; orbit round the stuck tip under "a new part had broken and
   jammed the ride". Simplified geometry (A-frame tower, arm, ring gondola with 8 seats), not a replica.
2. **LadderGap**: true-scale elevation over darkened footage — 16 storeys rise beside the 50 m arm, the 30 m ladder leans on
   the block's wall (wall + window lit on their words), then slides to the arm; the 20 m gap is bracketed red.
3. **FreezeBracket**: e1 freezes on "the two small figures", white corner brackets close on them and push in; the raw then
   continues from that moment.
4. **DescentLedger**: eight marks come down the arm via the 30 m platform; the last lands with "6:00 AM"; 9-hour bracket.
   (Replaced a clock-face device after TP07 registered a NightClock: no neighbouring repeats.)
- Cutcheck v1 flagged 3 JUMPs on hard cuts (model→phone clip, model→main, e1→main): blur-dips added there.
- Plus channel grammar: RedLabels RENNES, FRANCE / DECEMBER 31, 2018 / BOMBER MAXXX / GRIMP / JANUARY 1, 2019.

## Sources
- main K58U85he5Gc, e1 3cMwyVxvt2E, e2 xbKgNzYwOII (SDIS 35 release: has added music → picture only), e3 sYKeQwkxEcc
  (from `footage/23_Rennes…`). No source cuts in any of them (srccuts).
- **Download**: TN-kxBRLYd0 (JEJEBREIZH, personal channel, 4.7k subs) → `footage/23_…/more/dl_TN-kxBRLYd0.mp4`: a fairgoer's
  vertical phone clip from the ground — the crowd and the stuck arm above the other rides (picture only, 360p, shown
  as a fill-frame vertical). Used for the crowd / "down below" lines.
- All footage graded with `grade_case.py --house`.

## Known limits
- Footage is all from two vantage points (a building across the esplanade + one phone on the ground); no daytime aftermath,
  no shot of the owner (Alexandre Thinel) — his lines play over the ride (Blender orbit + the gondola), no name label over
  a non-person picture.
- Load on the machine was extreme (load avg 200–300); stills/renders needed a longer delayRender timeout, so I rendered with
  a copy of render_case.sh that only adds `--timeout=240000` and concurrency 4 (same slots, cutcheck, mastering).

## 3 Nov 2026 audit
- Raws 7 -> 4 (cutOut, `apply_cutout.py`): kept R1 e2 8 s (rescuer climbing), R3 main 8 s (held at top, tear-gas reaction),
  R5 e1 14 s (two figures go down), R6 e1 13.5 s (into the basket). Removed R2 (61.25-68.25, lit gondola, near-dup of R3, on the
  rider background), R4 (98.55-104.55, after the LadderGap explanation), R7 (147.1-156.1, another descent, near-dup); VO runs on.
  Half blur-dips added at 61.25 / 147.1 so every join is a full dip. ALLOW now in output seconds.
- FreezeBracket replaced by **RopeZoom** (`dev/TP04_RopeZoom.tsx`): live clip (no freeze, runs straight into R5 at e1 22.0), white
  box on the two figures, a x3 live magnified panel lifts out with connectors, rope traced red from the gondola, tags RESCUER /
  PASSENGER 2 OF 8 on the words. Shutter SFX removed. No document moments; no Insets. Render 179.5 s (was 201.4), cutcheck 0 flags.
