# Handoff: case1/case2 fix agent (v2) - 2026-11-10
Read first: full_video_plan.md, case1_render_handoff.md, case2_render_handoff.md. W = V/05_render/work.

## Job 1 DONE - section/segment cache + full splice
- W/segcache.py: key = sha1(shot EDL entry + renderer fn sources + (path, mtime, size) of inputs: source mp4; gfx/out + gfx/dl (gfx_c2/...) for non-footage kinds; plus s["inputs"] list if a shot sets it). Key in <seg dir>/<id>.key; asm key in asm(.._c2).mp4.key.
- seg_c1.py / seg_c2.py: `python seg_cN.py [ids] [--force]` renders only stale shots; `python seg_cN.py asm [--force]` re-assembles only if a key changed. v1 keys seeded (51/51, 17/17 cached; asm up to date).
- W/section.py N [ids] [--force]: seg (cached) -> asm (if changed) -> mix_cN -> final_cN -> full_build. One command per change.
- W/full_build.py: newest caseN_vK.mp4 per N -> concat -c copy -> V/05_render/WINTER_CAMPING_ENCOUNTERS_full.mp4. Checks params; video mismatch = FAIL; audio mismatch -> audio re-encode only.
- Tested on v1: case1_v1 536.75 + case2_v1 268.14 -> full 804.91 s (diff +0.021), audio copy OK.
- Encode finding: nvenc default profile is **Main** (plan says high). Both sections Main, so they match. Other sections must keep the same flags (no -profile:v) or all re-render.

## Decisions for v2
- Carousel (case1): replaces VO-CO-01b..d (16.6-30.7 s, 14.1 s) under "That's the whole problem. These are seven nights..." ("These" at 18.08 s). Cards CASE 1..7 slide; the last card is CASE 1 again (wrap), whose clip = the TITLE-CO-01 background footage; it zooms to full frame and lands exactly on TITLE-CO-01 frame 0 (title tin -> cut). Blue fog glow, never red.
- Work split: sub-agent A = case1 v2 (carousel + fixes), sub-agent B = case2 v2. I (fix agent) run full_build at the end.

## Status
- [x] job 1  [x] A case1_v2 rendered (case1_v2_handoff.md; carousel sheet work/qc/carousel_sheet.jpg viewed OK; still_sheet_v2 viewed OK)
- [~] B case2_v2: segments+asm+mix done (case2_v2_handoff.md); final_c2 crashed when agent stopped (WinError 87) -> re-run by fix agent in background (log work/final_c2.log ends 'exit N'). Then: `cd W; python qc_c2.py ..\case2_v2.mp4 5.5 10 130 239.5 245 263` + fadescan edl_c2.
- [~] fadescan edl_c1 on case1_v2 re-running (sub-agent saw argmax-empty crash). Then full_build.py.
- Open: RAW-C1-03 (122.28 s) / RAW-C1-07 (304.24 s) muted with no "[ __ ]" caption (no source caption line); carousel first card enters from right (left half empty during crossfade in); case2 map subline "NO LOCATION GIVEN BY THE SOURCE".

## Fix agent close (2026-11-10)
- case2_v2.mp4 rendered (final re-run, exit 0): 268.14 s, 8036 f, I -17.00 TP -2.11; sheet V/05_render/case2_v2_sheet.jpg viewed OK (channel page, LOCATION UNDISCLOSED card, white captions, trimmed threads).
- fadescan: c1v2 (work/qc/fadescan_c1v2.txt) BAD only at flash fx (09a->09b, intended) and RAW-C1-08->VO-C1-07a (smooth camera-pan bell, identical in v1, not a cut). c2v2 (work/qc/fadescan_c2v2.txt) BAD at VO-C2-04b->04c = comment panel swap inside the dissolve. Earlier argmax crash did not reproduce (file was still being written).
- full_build on v2: case1_v2 536.75 + case2_v2 268.14 -> WINTER_CAMPING_ENCOUNTERS_full.mp4 804.91 s, audio copy. DONE.
