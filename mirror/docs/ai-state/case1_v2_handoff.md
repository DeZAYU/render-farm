# Handoff: case1 v2 (carousel + fixes) - 2026-11-10
Tasks (from fix agent): (a) carousel replaces VO-CO-01b..d (16.6-30.7 s), TITLE-CO-01 tin cut; (b) mix: mute curse words (10 ms ramps, no bleep), raw/amb fully muted under VO; (c) page3d centred + slightly zoomed; (d) channel page rule 33; (e) captions all white.
Backups: work/gfx_c1.v1.py.bak (+ others *.v1.py.bak as made).
## Progress
- [x] (e) gfx_c1.caption: all white.
- [x] (a) work/carousel_c1.py (kind "carousel", seg_c1.render_carousel); EDL shot CAROUSEL-CO 16.6-30.7 (replaces VO-CO-01b..d), cards in edl_c1.CAROUSEL (src, loop start); TITLE-CO-01 tin cut. Preview: python qc/carousel_preview.py 8 -> qc/carousel_prev.jpg (looked OK).
- [x] (b) mix_c1: word mutes (10 ms ramps), gate under VO; QC numbers in mix_report.json (qc_raw_under_vo_dbfs, qc_mute_rms_dbfs)
- [x] (c)(d) seg_c1.page3d screen point fixed (960,540), anchors = page centre x, scale up ~8-10 %; channel tilt (-9->5 yaw) + pan y 300->420
- [x] rulecheck OK; final_c1 OUT -> case1_v2.mp4 (BOM removed from final_c1.py)
- [~] running: seg (5 stale shots) -> asm -> mix in background; logs work/seg_v2.log, work/mix_v2.log. Then: python final_c1.py > final_v2.log (background), QC.  [ ] render (section steps: seg, seg asm, mix, final; NOT full_build)  [ ] QC  [ ] notes V/05_render/case1_v2_notes.md
Notes: RAW-C1-03 (122.28 s) and RAW-C1-07 (304.24 s) have profanity mutes but no caption line (no source caption there).
- [x] segs (5 + article re-crop 440..1150 so text column centred, sidebar out) + asm 16086 frames; mix done (I -17.01, TP -2.05; mutes -240 dBFS; raw under VO -240 dBFS).
- [~] final_c1.py running in background -> V/05_render/case1_v2.mp4, log work/final_v2.log ('EXIT 0' when done). NEXT: QC (ebur128, ffprobe, fadescan, 3x2 sheet, carousel sheet qc/carousel_sheet.jpg from the final), notes.
- [x] final done: V/05_render/case1_v2.mp4 536.75 s; I -17.0, TP -2.1; carousel sheet checked. Notes V/05_render/case1_v2_notes.md.
- OPEN: fadescan.py crashes (empty argmax) on case1_v2 - debug in tools/farrell-build/fadescan.py (likely cut tin on carousel/title); still_sheet_v2.jpg not viewed. full_build not run (parent does it).

## v3 (owner yes, 2026-11-10, fix agent)
- edl_c1.py: muted curse word with no source caption gets "[ __ ]" caption timed to the mute: RAW-C1-03 122.28-123.118, RAW-C1-07 304.24-305.078.
- carousel_c1.py: slots k=-3..-1 drawn as wrapped cards (cases 5,6,7) so the left side is filled from frame 0; slide unchanged. Preview qc/carousel_prev.jpg (frames 0,10,20,30) checked: left filled.
- final_c1.py OUT -> case1_v3.mp4; chunk count from env FINAL_JOBS (default 6; run with 3 to spare CPU).
- Running: `FINAL_JOBS=3 python section.py 1` (log work/section_c1v3.log ends 'exit N'): only CAROUSEL-CO segment re-renders, then asm, mix, final, full_build.
- After: QC frames at 122.5 and 304.5 s (caption), carousel 16.6-17.6 s sheet, duration 536.75, ebur128 I/TP.

### v3 QC results (2026-11-10)
- Re-rendered 4 segments (VO-C1-01b, RAW-C1-03, RAW-C1-07, CAROUSEL-CO); 45 came from the cache. Log: 05_render/work/section_c1v3.log.
- case1_v3.mp4: 536.75 s (same as v2). ebur128 I -17.0 LUFS, true peak -2.1 dBFS (mix -17.01 / -2.05, LRA 13.0).
- Caption stills at 122.6 s and 304.5 s: the "[ __ ]" white-on-black box is centred low, same look as the other captions. OK.
- Carousel 16.6-17.6 s at 4 fps: the left side is filled with wrapped cards from frame 0 and the slide stays continuous. OK.
- Full build: case1_v3 + case2_v2 + case3_v2 + case4_v1 = 1573.32 s (diff +0.021), audio copied, exit 0.
