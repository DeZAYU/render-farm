# TP19 — The arcade behind the Wonder Wheel (Coney Island, Wed 5 May 2010) — COLD OPEN
Code: `_engine/src/cases/TP19.tsx` (DUR 156.2 s). Music: Music 1 at −15 dB from 40 s, ducked to 10 % under every raw.
VO: `vor/CASE19.mp3` as one take (no count word: the case opens on the clip), split only at the six raws.

## Edit (v3, owner rule 3 Nov on TP19: VO split only at paragraph ends, each device once, no padding)
Timeline vs the words (take times from vo/raw/CASE19.srt):
- 0.0–4.0 title on the case's own frame; R1 cold-open sound from 3.4
- 4.0–15.0 **R1** main 1.7–12.7 (flames over the roofline, crowd, aerial ladder) — picture runs on under V1
- 15.0–36.57 **V1** "It's about eight in the evening … The summer season hadn't even started." (take 0–21.57)
- 36.57–45.57 **R2** main 41.3–50.3 (firefighters at the shutters, flames behind)
- 45.57–71.56 **V2** "The FDNY dispatch log … It went to two alarms. More than a hundred firefighters responded. By now the hoses were on it." (21.57–47.56; VoidCut at 57.81–65.63)
- 71.56–95.56 **MAIN RAW** ex1 94–100 → blur-dip → ex1 128–146 (flames under the hose streams, then at their strongest; cues CS 1:36 + 2:06 merged)
- 95.56–105.46 **V3** "Those shutters are a big part … keeps firefighters out just as well." (47.56–57.46)
- 105.46–115.46 **R6** ex1 161–171 (dense smoke, hose streams)
- 115.46–154.98 **V4** "They had it under control by 10:40 … in that gap above the ceiling." (57.46–96.98); RoofLift at 142.58–147.69; last line on a 0.5x replay of the main raw's flames; 1.2 s hold → end 156.2
Cut-sheet cues CS 0:06 (smoke by the walkway) and the separate "hoses" cue were dropped/merged: they would have left 1.8–2.6 s VO stubs between raws.
Source runs between raws alternate CI / CS / devices (never more than 2 shots of one clip in a row under VO).
RedLabels: MAY 5, 2010 / W 12TH ST & THE BOWERY / CONEY ISLAND ARCADE; device labels BOARDWALK, DENO'S WONDER WHEEL, ROOF, CEILING,
STEEL SHUTTER, 2008 / 2012. The cats are not pictured (night footage of the walkway under that line).

## Devices
- **BlockBack** `dev/TP19_BlockBack.tsx`: NYS spring-2008 orthophoto in 3-D, arcade footprint boxed red, line from the boardwalk to it, Wonder Wheel boxed.
- **VoidCut** `dev/TP19_VoidCut.tsx` (once): cutaway of the arcade — shutter, ceiling, the burning gap, the shutter cut (flap falls) then the roof
  vent (panel lifts, smoke), timed to "cut through the metal shutters and then the roof itself". (The end reprise was removed: read as a loop.)
- **RoofLift** `dev/TP19_RoofLift.tsx`: 2008 vs 2012 orthophoto of the corner, the arcade's roof lifts off as a plate to the bare 2012 slab ("taken down in spring 2011").
- SFX (real): metal clanks on the flap / roof panel / lifted plate; glitches on the designed cuts only.

## Sources
- [CI] main: https://www.youtube.com/watch?v=h8mwU21rqh8 (filmer's own upload, 640x480 dusk) — audio via rawclean (music found 55–58, 63–65 s; not in raws).
- [CS] ex1: https://www.youtube.com/watch?v=5AaKiz7zNFU (second filmer, 640x480 ~12 fps, night) — audio via rawclean (music 30–34, 133–135 s cleaned).
- NYS ITS orthoimagery 2008 / 2012 (public): https://orthos.its.ny.gov/arcgis/rest/services/wms/{2008,2012}/MapServer/export,
  box centred 40.5743 N, −73.9792 (448 x 252 m), 3200x1800 (`assets/dl/ortho*.jpg`, `ortho_geo.json`). 2010 was not used: "spring 2010" may postdate the fire.
- Arcade footprint: NE corner of W 12th St & the Bowery (building present 2008, bare slab 2012); Wonder Wheel from OSM (40.57404, −73.97915).
- Wonder Wheel photo: "Wonder Wheel off-season 1.jpg", Rhododendrites, CC BY-SA 4.0, https://commons.wikimedia.org/wiki/File:Wonder_Wheel_off-season_1.jpg (credit in the description).
- Facts check: Amusing the Zillion, https://amusingthezillion.com/2010/05/06/suspicious-fire-at-coney-island-arcade-building/ (shutters cut, roof opened, fire between roof and ceiling).
- No extra downloads (no other small-channel angles found worth adding; both kept clips cover every beat).

## Issues / notes
- Both clips are 640x480 and handheld; upscaled lanczos to 1440x1080 and cover-cropped. Steadiest windows picked by a motion/sharpness scan.
- The arcade footprint is identified from the orthophotos (the building at the corner gone by 2012) + the blog's "W 12th St and the Bowery"; not from a plan.
- Raw gains set so raws sit ~5 LU over the (quiet, −26 LUFS) take before mastering.
- ex1 (~12 fps) is frame-blended to 30 fps (`framerate` filter) before the LUT: the stepped 12 fps frames read as ~250 cutcheck JUMPs.
- BlockBack camera move slowed (the dense ortho moving fast read as STUB cuts).

- 3 Nov 2026 RAW AUDIT (owner: raws only at incident moments, never in explanation, no near-dups): removed RAW 6 (after the shutters explanation, near-dup of the main hose raw): 5 -> 4 raws. Code: cutOut() at the end of cases/TP19.tsx (lib/core/cutOut.tsx drops the VO-silent raw windows; VO runs on as one take). Re-rendered; cutcheck flags all on designed transitions.
