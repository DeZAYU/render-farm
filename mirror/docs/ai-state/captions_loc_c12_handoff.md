# Handoff: captions + location card, Case 1 & 2 (2026-11-11)
Task: (1) caption every raw clip with speech in the case body (Case 1: none in cold open/intro/carousel); none over burned subs.
(2) caption box <= ~1050 px, wrap to max 3 lines, bottom y=1000 grows up. (3) Case 2 LOCATION UNDISCLOSED card -> source clip, same length.
Output: caseN_v{K+1}.mp4 = new video + audio stream copied from case1_v4 / case2_v3 (`-map 0:v -map 1:a -c copy`, NO music_pass). W = V/05_render/work.
Status: DONE. 05_render/case1_v5.mp4 536.736 s, 05_render/case2_v4.mp4 268.1345 s (Main, audio copied from case1_v4/case2_v3). QC sheet 05_render/captions_c12_sheet.jpg checked. Nit: C1 caption ~250 s begins 'A.m. ...' (ASR split of '2 a.m.' across events).

## Findings
- Captions are drawn only in final_cN.py (overlay pass, lines ~92-96: `for s in edl.SHOTS: for (a,b,t) in s["caps"]: im = gfx_cN.caption(t)` ... `CAPS.append((fr(a), fr(b), im, (SW-w)//2, 1000-h))`). So caption changes = final pass only.
- Do NOT change s["caps"] in edl_cN or gfx_c1.py (shot dict + gfx_c1.py mtime are in segment cache keys -> mass re-render; CAROUSEL-CO lists gfx_c1.py as input).
- ASR: Case 1 = V/04_storyboard/work/asr.json, Case 2 = W/asr_c2.json.
- Burned subs (Case 2, bottom-band scan of case2_v3 at 10 fps + stills): display 28.6-30.15 "Over in that direction", 74.8-77.95 "I might just walk around and / look at the area", 84.5-86.05 "Look at this guys". Case 1: none.
- Case 1 map VO-C1-01c is a real map (keep). Only Case 2 has the card: block "VO-C2-01 map" 7.2-12.0 (4.8 s), tin crossfade from channel page, cut out to "VO-C2-01 a".
- Replacement clip chosen from EXPLORINGW2 stills (source cuts at 62.36, 69.8, 79.18, 82.82 respected): parts (67.0, 68.25) arriving at the flat spot, gear on the ground + (79.25, 82.8) Owen spreading/setting up the tent = 4.8 s. Head handle 66.4 is inside continuous shot 62.36-69.8 (OK for the crossfade). VO there: "...camping alone in the woods. The only other time he'd slept in a tent..."

## Done
- [x] W/capfit.py (new): build(edl, n) -> [(a, b, text, shot_id)] from ASR words; caption(txt) = same look, wrapped <= 1050 px box, <= 3 lines. Self-test `python capfit.py N` lists all captions + flags. Current result: Case 1 = 78 captions (from RAW-C1-01 on, incl. RAW-C2-01 teaser; cold open none), Case 2 = 30 captions, 0 flagged (all 5/6-7 s, <= 3 lines, <= 1048 px). Profanity muted spans -> "[ __ ]". Words under narration / burned subs skipped. Drop: RAW-C1-06 "happiness you" (ASR noise).

## Next (in order)
1. final_c1.py + final_c2.py: replace the CAPS loop with
   `import capfit` / `for (a, b, t, _sid) in capfit.build(edl, N): im = np.asarray(capfit.caption(t), np.float32); h, w = im.shape[:2]; CAPS.append((fr(a), fr(b), im, (SW - w) // 2, 1000 - h))`
   and set OUT -> `W/case1_v5_vid.mp4` / `W/case2_v4_vid.mp4` (keep video-only basis out of 05_render so full_build is not confused). Back up first (*.v4.py.bak).
2. build_sb_c2.py: replace the "VO-C2-01 map" line with
   `sh("VO-C2-01 arr", "footage", E, [(67.0, 68.25), (79.25, 82.8)], X, "VO-C2-01", overlay="arrival + tent setup (rule 5: no LOCATION UNDISCLOSED card)")`; run it (total must stay 268.14). edl_c2.py GFX: drop the "VO-C2-01 map" entry. Back up sb_c2.json / build_sb_c2.py / edl_c2.py first.
3. `python ../../../../tools/farrell-build/rulecheck.py edl_c2.py` (and edl_c1.py) -> no FAIL.
4. Case 2: `python seg_c2.py` (only VO-C2-01arr should render) then `python seg_c2.py asm`; then `FINAL_JOBS=3 python final_c2.py` (background). Case 1: no segment change -> only `python final_c1.py` (background). Do NOT run mix/music_pass/full_build via section.py.
5. Mux: `ffmpeg -i W/case1_v5_vid.mp4 -i ../case1_v4.mp4 -map 0:v -map 1:a -c copy -movflags +faststart ../case1_v5.mp4`; same for case2_v4 from case2_v3. ffprobe durations must be 536.75 / 268.14 (+-0.05).
6. QC sheet (ffmpeg tile) at caption moments (e.g. C1: 34.5 (no cap), 70, 160, 250, 320, 365, 466, 534; C2: 10 (new clip), 26, 29.5 (burned only), 62, 76 (burned only), 112, 205, 263) -> 05_render/qc_captions_c12.jpg; view it.
7. Report: files + durations, clip (EXPLORINGW2 67.0-68.25 + 79.25-82.8), caption counts (78 / 30), skipped spots (cold open/carousel; burned subs 3 spans; words under VO; "happiness you"; words in fades start at solo window).
