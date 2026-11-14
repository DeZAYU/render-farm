# TP20 — The alarm nobody answered (Grand Pier, Weston-super-Mare, 28 Jul 2008)
Code: `_engine/src/cases/TP20.tsx` (DUR 167.1 s; earlier cuts kept as C:/Users/ayush/Videos/CLAUDE/STYLE guide/tools/oldheritage/scratch/TP20/TP20_v1.tsx, _v2.tsx). Out: `build/CASE20/out/TP20.mp4` (+ `_phone`). Music: Music 3 (−19 dB, two passes, dipped under raws).

## Edit
Title (on the beach camera's own frame) → hill camera (date, place) → CallChain → RAW 1 → the pavilion before (inside the day before, July 2008,
May 2008) → RAW 2 → firefighters / Robert Tinker / Tilburg flashback → RAW 3 → "Five hours…" (the day before: "maybe a call saves it") → RAW 4 →
1920s postcard → BurnThrough (1933 pavilion photo burns into the 2008 footage) → RAW 5 → "And through the seafront railings" runs into RAW 6 →
aftermath stills → rebuild → new pavilion footage (Dec 2010 / Apr 2011). VO = one take (no count word in this take), split only at the six raws.

## Devices
- **CallChain** `dev/TP20_CallChain.tsx`: white-framed cards on one wire over the pier the evening before (blurred, dark): PIER ALARM 1:35 AM →
  MONITORING CO. → KEY-HOLDER (rings three times, goes hollow/dashed, NO ANSWER) → the camera rides an empty dashed wire (time to scale) to the
  FIRE SERVICE card, 6:46 AM, as the background becomes the fire; pull-back, red bracket "5 HR 11 MIN".
- **BurnThrough** `dev/TP20_BurnThrough.tsx`: the 2005 photo of Leonard Guy's 1933 pavilion (labels LEONARD GUY / REOPENED 1933) burns through from
  the building (ragged hole, glowing rim, char) onto Alex Brent's 2008 beach footage of the same pavilion burning ("watching it happen for the second time").
- Inset (brand) for the 144p raws (WT, WR), the portrait fire photo and the postcard; RedLabels: JULY 28, 2008 / GRAND PIER, WESTON-SUPER-MARE /
  INSIDE, MAY 2008 / ROBERT TINKER, PIER WORKER / TILBURG, 2014 / JULY 27, 2008 / GRAND PIER, c. 1920 / KERRY & MICHELLE MICHAEL / OCTOBER 2010 /
  KERRY MICHAEL, OWNER / PIER OF THE YEAR, 2011.

## Re-cut 2 (owner rule 3 Nov, on TP19: one story, no lone phrase between raws)
v2 left "And through the seafront railings." (1.9 s) alone between RAW 5 and RAW 6. RAW 5 (WB 6:33, a second wide smoke-column shot) is dropped, so
the VO runs as one stretch from "Five hours." to "…seafront railings." (31 s) and that line leads straight into the railing raw (R6, 122.6–130.3).
VO stretches between raws now: 26.0 / 9.6 / 17.0 / 31.0 / 35.4 s; no split mid-sentence. Each device once; the case ends on the last VO line +1.4 s.
Raws: R1 9.2 s · R2 16.6 s (main incident) · R3 9.2 s · R6 9.7 s.

## Re-cut 1 (owner rule 2 Nov, on TP17: fewer, longer raws)
Five raws now (was six, 5–9 s each): R1 WS 15.8–25.0 (9.2 s) · **R2 = main incident raw, WB 20.45–37.05 (16.6 s, played through: side-on
flames → the camera zooms into the burning pavilion)** · R3 WT 9.6–18.8 (9.2 s, 10 fps frame-blended) · R5 WB 391.2–401.2 (10 s) · R6 WR 7.7–19.4
(9.7 s of raw sound after the VO lead-in). Cut-sheet RAW 4 (WB 4:03, "wider shot of the smoke column over the beach") dropped: it duplicated RAW 5
and was the 5.4 s chop; the VO now runs straight from "so is everybody else" to the 1930 postcard. No raw under 9 s. Device time could not be
trimmed without cutting VO (every device sits under its own spoken line), so the case grew 8.5 s.

## Raws v1 (superseded; audio = rawclean.py output, never the clip's own track)
R1 WS 16.0–24.0 (hill camera; its track is −50 dB room tone, so it carries ex1's beach sound 158–166 s, wind + dog, no speech — TP13 precedent)
· R2 WB 21.0–30.0 · R3 WT 9.7–17.0 ("that's actually going now") · R4 WB 243.6–249.0 ("It's just incredible. In a bad way.")
· R5 WB 391.0–399.5 · R6 WR 7.7–17.7 (the VO line "And through the seafront railings" plays over its first 1.9 s, its sound after).
rawclean: music found only in main 252–256 s and ex1 429–431 s (neither used); ex2/ex3 clean. Nothing to blur (no injured people shown).

## Sources
- [WS] main https://www.youtube.com/watch?v=YYUzhJqpaJ0 · [WB] Alex Brent https://www.youtube.com/watch?v=aAr2ItVqAOA ·
  [WT] https://www.youtube.com/watch?v=e2v0faQhC7Q · [WR] https://www.youtube.com/watch?v=T-FfDfWE43A
- Downloaded (`footage/02_.../more/`, mesmoland, a personal Weston channel, 30.8k subs): inside the pavilion the day before the fire
  https://www.youtube.com/watch?v=LvfSkPTSEm0 (used 16–19, 24–27 s) · The New Grand Pier, Dec 2010 https://www.youtube.com/watch?v=zd76wTofAhU
  (used 33.5–37 front "GRAND PIER 2010", 204–207 go-kart track, 284–287 two floors; its MESMOLAND title card at 0–28 s avoided) ·
  The New Pier (Inside and Out), Apr 2011 https://www.youtube.com/watch?v=IerX-_AOe5E (used 158–162 s, from the beach).
- Tilburg flashback: TP11's own graded TK clip (`build/CASE11/graded/tk_mb.mp4` 33.1–36.5 s; credit "Beeld: Kermis FM" as in TP11).
- Wikimedia Commons (graded `--house --nonorm`):
  - Firefighters, 10:21 28 Jul 2008, CC BY 2.0 https://commons.wikimedia.org/wiki/File:Grand_Pier_Firefighters.jpg
  - Pier in flames, CC BY-SA 2.0 https://commons.wikimedia.org/wiki/File:The_Grand_Pier_in_flames_-_geograph.org.uk_-_1006117.jpg
  - Pavilion 5 Jul 2008, CC BY-SA 4.0 https://commons.wikimedia.org/wiki/File:Weston-super-Mare_Grand_Pier_20080705.jpg
  - Inside the pavilion 31 May 2008, CC BY-SA 2.0 https://commons.wikimedia.org/wiki/File:Inside_the_Pavilion,_Weston-super-Mare_-_geograph.org.uk_-_987602.jpg
  - Pavilion 2005 (BurnThrough), CC BY-SA 3.0 https://commons.wikimedia.org/wiki/File:WSM_Grand_Pier_Pavilion.JPG
  - Postcard c.1920, public domain https://commons.wikimedia.org/wiki/File:Weston-super-Mare_Grand_Pier_with_tram.jpg
  - Burnt tower, Aug 2008, CC BY-SA 2.0 https://commons.wikimedia.org/wiki/File:Remains_of_Weston_Grand_Pier_(2799704181).jpg
  - Smoky remains, CC BY-SA 2.0 https://commons.wikimedia.org/wiki/File:Smoky_remains_of_the_Grand_Pier_-_geograph.org.uk_-_903381.jpg
  - Fire engine 29 Jul 2008, CC BY-SA 4.0 https://commons.wikimedia.org/wiki/File:Weston-super-Mare_Grand_Pier_20080729_fire_engine.jpg
  - Shell from the beach 13 Aug 2008, CC BY 2.0 https://commons.wikimedia.org/wiki/File:Weston_Pier_after_the_fire_2_(2771279036).jpg
  - Reconstruction Mar 2010, CC BY-SA 4.0 https://commons.wikimedia.org/wiki/File:WsM_Grand_Pier_reconstruction_March_2010.jpg
  - New pavilion Jun 2010, CC BY-SA 4.0 https://commons.wikimedia.org/wiki/File:Weston-super-Mare_Grand_Pier_June_2010.jpg
  - Entrance crowds Oct 2010, CC BY-SA 3.0 https://commons.wikimedia.org/wiki/File:Weston-super-Mare_Grand_Pier_entrance_crowds_October_2010.jpg
  - (downloaded, not used: after demolition Nov 2008 https://commons.wikimedia.org/wiki/File:WsM_Grand_Pier_after_demolition.jpg)
  CC BY / BY-SA need attribution in the video description (authors on each file page).

## Grade / tech
- main is 4:3 in a 16:9 pillarbox → cropped 640x480 and lanczos-upscaled; ex1 320x240, ex2/ex3 192x144 upscaled (ex2/ex3 shown framed).
- The normalising grade blew out ex1's hazy beach footage (gain 1.8, gamma 1.6) → all ex1 windows use one `--house --nonorm` LUT (`luts/ex1.cube`).
- One LUT per source: main_a's LUT on all main windows, lv_b's on lv_a + the night deck still, zd_c's on zd_a/zd_b.

## Open points
- Robert Tinker is not on any footage; his name sits on the beach camera's close shot of the burning pavilion.
- "Revamped that April / go-kart track / climbing wall" is shown with the July 2008 exterior and a May 2008 interior photo (a ride under the roof);
  no image of the 2008 go-kart track or climbing wall was found under a free licence.

## Checks
- Render 1 cutcheck: STUB at 38.0–39.5 (LvfS whip, 25 fps), JUMP 73.9–80.2 and 124–133.3 (WT/WR are 10 fps: duplicate-frame steps), JUMP 88.17
  (beach-camera jolt) → LvfS window moved to the calm 18–20.8 s and frame-blended to 30 fps (`framerate`), ex2/ex3 frame-blended, ex1_c moved to 165.5 s.
- Render 2: 5118 frames, 34 cuts, **0 flags** (allowed: ±0.3–0.5 s round every glitch/blur-dip + the burn-through 111.4–113.7). Master −16 LUFS, 170.6 s.
- Render 4 (re-cut 2, 167.2 s): 5013 frames, 33 cuts, 1 flag = JUMP 64.50 s, a handheld jolt inside the main incident raw (same shot, checked
  frame by frame; TP13 precedent) → allowed 64.3–64.7; cutcheck re-run on TP20_raw.mp4 with that window: **0 flags**. 1 fps sheet of the whole case checked:
  no run of one angle beyond a single shot, each device once, ends on the last VO line + 1.4 s hold.

## 3 Nov 2026 audit (rule 3 Inset at most once; rule 4 checked)
Raws, VO timing, CallChain, BurnThrough untouched. Inset was used 4x; kept only on RAW 3 (WT close zoom, 82.4-91.6). Replaced:
flames.jpg -> **SplitPair** (`dev/TP20_SplitPair.tsx`: tall close photo left | beach camera's wide smoke column ex1_e 1.6 s right, white seam);
1920s postcard -> full-frame slow push onto the first pavilion + RedLabel GRAND PIER, c. 1920; RAW 6 railings (192x144) -> **RailView**
(`dev/TP20_RailView.tsx`: 4:3 white panel swinging square in 3-D over a dark ground, defocused railing bars cross on the lead-in line,
RedLabel FROM THE SEAFRONT). Both registered in REGISTRY.md. Rule 4: no document moments in this case. Render 5: 5013 frames, 167.2 s,
cutcheck 1 flag = JUMP 118.87 (handheld jolt inside BurnThrough's ex1_g, same shot, checked frame by frame) -> allowed 118.7-119.0: **0 flags**.
1 fps sheet checked. Pre-edit code: C:/Users/ayush/Videos/CLAUDE/STYLE guide/tools/oldheritage/scratch/TP20/TP20_v3_pre_inset.tsx.
