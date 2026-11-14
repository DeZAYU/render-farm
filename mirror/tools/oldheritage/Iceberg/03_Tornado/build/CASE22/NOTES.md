# TOR22 — The deputy who drove toward it · Elbert County, Colorado (18 May 2025)

Code: `_engine/src/cases/TOR22.tsx` · devices `_engine/src/dev/TOR22_*.tsx` · out `out/TOR22.mp4`, `TOR22_phone.mp4` (155.4 s)

## Edit
- TitleCard on the dashcam (src 26 s) → R0 opens the case (cut sheet: "open the case on this") → VO one take with "Twenty-two."
  removed (take starts 0.85 s, in the pause) → raws at the cut-sheet cues: R1 after "roofs come off houses", R2 after
  "uncharacteristically strong", R3 after "homes it's just crossed", R4 after "into the damage path", R5 after "135".
- Raws (dashcam src): R0 21.4–37.6 (radio: location + "heading northeast" — starts AFTER he says his name at 17.5–21.1, never used),
  R1 40.3–51.0 ("…watch some roofs come off houses and stuff"), R2 75.5–85.6 ("…reports of houses being ripped off"),
  R3 112.6–121.0 (continuous with the VO shot before it), R4 168–179.5 (his call: "I called it in … that's a tornado"),
  R5 219.3–228 ("like 50 meters … enough to pick up a lot of trees").
- Raw audio = `media/dc_a_clean.wav`, `dc_b_clean.wav` (rawclean removed music-like sound in 3 s of each file).
- DCSO badge (bottom-left, 0–121 s) and the Axon OSD (top-right) delogo'd before the grade.
- Music: Music 1 at −15.5 dB (≈ −33.8 LUFS), only under the VO blocks.

## Devices (new, this case)
- PlainsRelief (`TOR22_PlainsRelief.tsx`): USGS NAIP × 3DEP hillshade of the Front Range edge (mountains / Denver / plains) in 3-D.
  Used twice with different jobs: Elbert County outline + Denver/Elizabeth ("open grassland southeast of Denver"); the four NWS DAT
  tracks of the afternoon drawn in time order (EF2 red, EF1 white) with Denver/Bennett ("one of four tornadoes").
- EFLadder (`TOR22_EFLadder.tsx`): the EF scale as six white-framed bands beside the dashcam in a white frame, EF2 lit red, dashed tick at
  the survey's 125 mph peak (NWS Boulder PNS).
- ChipLift_N2P page: NWS Boulder survey statement (22 May 2025) — "EF2, in and near the Elkhorn neighborhood" and "an
  uncharacteristically strong landspout" lit.
- Grammar: RedLabel (date, Bennett, Elizabeth, Elbert County), Inset (the dirt column), glitch/blurDip/whip/zoomHit.

## Sources
- Main: Douglas County Sheriff's Office release https://youtu.be/zTOUHdvhESs (dashcam, radio, end photos).
- Downloads (`footage/06_*/more/`, small personal channels): danmeso https://youtu.be/kaH5z-dftqs (Bennett; black strip on the left
  framed out), CajunSnowMan https://youtu.be/2Jj8B5JyoDM (Bennett, used for "between 1:40 and 1:46"),
  1000CalorieSnackPack https://youtu.be/ChDbgnd7_6c (genesis over the prairie; used for the general landspout lines only).
- NWS DAT FeatureServer (ElkhornRanch, ManillaRd, West Bennett, NE Bennett tracks) · IEM PNSBOU 202505221330 (survey statement) ·
  USGS NAIP + 3DEP ImageServers · Census county outlines (CASE01 assets).

## Issues / owner should know
- The deputy's face is visible briefly in the sheriff's own scene footage (src 274); he is never named.
- The prairie/genesis clip is from the same afternoon near Bennett, not the Elkhorn Ranch tornado: it sits only under the general
  lines ("plains east of the mountains", "usually weak"), never labelled as this tornado.
- A second page treatment (SelectStrip, blue selection) was tried for "1:40 and 1:46" and dropped (off-palette); footage instead.

## Render (3 Nov, 01:42)
`out/TOR22.mp4` 155.5 s, −16 LUFS, + phone copy. Cutcheck: 16 cuts, 0 flags. Blur-dips added on dashcam-to-dashcam joins (23.3, 26.95,
29.75, 51.91, 53.35, 140.7: same camera, other moment); 80.0–80.6 allowed (the wiper sweeps across the dashcam, a real event).

## 3 Nov raw audit + new document device (supersedes the edit above where they differ)
- Raws 6 -> 3: R0 16.2 s (main, 4.0-20.2), R1 10.7 s (33.69-44.39), R4 11.5 s (73.67-85.17). Removed R2 (after the landspout/EF2
  explanation), R3 (so "He's driving toward the homes it's just crossed. And now into the damage path." runs straight into R4) and
  R5 (after the EF2 wind range). VO runs on (source-contiguous joins). Duration 155.4 -> 128.4 s. Music back under the old raw spots.
- ChipLift_N2P (template) replaced by TeletypeSheet (`dev/TOR22_TeletypeSheet.tsx`): the real PNSBOU text (IEM) re-typeset in
  Courier on a tilted continuous-form printout; lines print, EF2 boxed red, red rule under "UNCHARACTERISTICALLY STRONG LANDSPOUT",
  credit "NWS DENVER/BOULDER · PUBLIC INFORMATION STATEMENT · 22 MAY 2025". SelectStrip import (unused) removed.
