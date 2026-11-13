# Handoff: captions + loc-card replace, cases 3/4/5 (2026-11-11)
Task: owner changes 1-3 (caption every raw w/ speech; caption box <=1050 px, wrap <=3 lines; replace LOCATION UNDISCLOSED cards with a travel/arrival clip same length). Out: case3_v4, case4_v4, case5_v3 (video new, audio copied from v3/v3/v2).
## Plan
- Captions drawn in final_cN.py (gfx_cN.caption). Add pixel wrap (text <=1014 px at 40px = 44 chars, max 3 lines, else split event).
- final_cN.py OUT -> W/_vid_cN.mp4 (do NOT overwrite older versions), then mux.
- Case 3: map shot = VO-C3-01 b (3.4 s, seg kind map) + LABELS loc. Case 4: card subline in gfx_c4.
## Status
- [ ] c3  - [ ] c4  - [ ] c5
- W/capwrap.py (new): wrap <=1014 px text, <=3 lines, split events. final_c3/final_c4 patched (OUT -> W/_vid_cN.mp4, capwrap.events).
- C3: build_sb_c3 VO-C3-01 b = CHANDLERSH 38.8-42.2 (Chandler points out cabin, pans to cabin); RAW-C3-02 auto captions; caption merge 42->84 chars; edl_c3 GFX map + loc LABEL removed. rulecheck OK. Render chain bg: seg_c3 -> asm -> final_c3 (log W/run_c3_v4.log). Next: mux with case3_v3 audio -> case3_v4.mp4.
- C4: VO-C4-01 b = RUBENMOCKE 41.5-46.0 (candles placed around camp; whole source is night, no lake/travel shot exists). mk_raw_c4 42->84 chars / 6.5 s (backups raw_c4_v3.json.bak, sb_c4_v3.json.bak; parts unchanged). edl_c4 GFX undisclosed removed. rulecheck OK. 52 caption events. Not rendered yet.
- C5: build_sb_c5 RAW-C5-02 + RAW-C5-03 captions on (backup sb_c5_v2.json.bak); CREATOR_SUBS += (42.45,44.5) "I'm pretty sure it's like this hill...", (183.5,193.0) "bro there's nobody there / that creeped me out / I'm leaving" (checked on band stills); ASR_FIX creamy->creepy, bank->bang. final_c5 patched. rulecheck OK, 26 caption events. Video-only change: just final_c5 (no seg/asm). Map VERMONT kept.
- seg_c3 also re-rendered CARD-C3, VO-C3-01c, VO-C3-07b (graphic keys changed by input mtimes; same output).
c3 v4 muxed 422.489 (= v3). c4 render started (W/run_c4_v4.log).
## STOP (context ~150k, 2026-11-11 08:15) - state for next agent
- C3 DONE: 05_render/case3_v4.mp4 422.489 s (= v3, Main, audio copied from v3). QC sheet 05_render/case3_v4_qc.jpg viewed: no map/loc card, cell 1 = arrival clip, captions <=3 lines, box max 1048 px. 93 caption events (RAW-C3-02 newly captioned; RAW-C3-08 has no speech in ASR -> none).
- C4 RUNNING (started 08:12 with & from a bash call; check it is alive): `seg_c4.py && seg_c4.py asm && final_c4.py` > W/run_c4_v4.log (9 segs to render). If dead, rerun with run_in_background. When "done" appears: `bash <scratchpad>/mux.sh` equivalent:
  cd 05_render; ffmpeg -i work/_vid_c4.mp4 -i case4_v3.mp4 -map 0:v -map 1:a -c copy -movflags +faststart case4_v4.mp4; ffprobe durations (expect 345.91 +-0.05).
- C5 TODO: `python final_c5.py` (W, run_in_background; no seg/asm needed - only captions changed), then mux work/_vid_c5.mp4 + case5_v2.mp4 audio -> case5_v3.mp4 (expect 330.71).
- QC sheets: python W/qcsheet_c345.py N "VO-C4-01 b" ../case4_v4.mp4 ../case4_v4_qc.jpg (run in W; script copy logic: replaced-shot mid + longest captions, tile 3x4). C5: block "-". Box width check: all events max 1048 px (c3/c4/c5 computed).
- Run full_build.py only if the lead asks (not in my brief).
