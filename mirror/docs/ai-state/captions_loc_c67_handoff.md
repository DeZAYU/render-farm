# Handoff: captions + location-card fix, Cases 6 & 7 (2026-11-11)
Task (owner): caption every raw clip with speech; caption box <=1050 px wide, wrap <=3 lines (grow upward, same bottom y=1000), split events if >3; replace LOCATION UNDISCLOSED card with same-length travel/arrival clip. Out: V/05_render/case6_v4.mp4 (video new + audio copied from case6_v3), case7_v3.mp4 (audio from case7_v2). No music_pass.
## Findings
- Captions drawn in final_cN.py from edl caps via gfx_cN.caption(t) (y = 1000 - h). Case 7 has NO undisclosed card (real Bend map) -> captions only.
- Uncaptioned raws: RAW-C6-02 (113.98-150.78, ASR asr_c6 B1), RAW-C6-03 (583.98-606.56, B2), RAW-C7-06 (1401-1448.86, asr_c7 C; only 3 [ __ ]). Others covered (tiny gaps: interjections in RAW-C6-06).
- C6 card: "VO-C6-01 map" tl 8.28-14.78 (6.5 s, tin dis in/out).
## Status
- [ ] burned-sub check, replacement clip pick
## Done (agent, step 1)
- Card pick: EXPLORINGW 61.3-67.8 (static cam: truck parked at camp in snowy woods, door opens, he gets out and walks; creator glitch 60.25-61.0 excluded). Alt seen: 56-59 truck driving in (glitch after), 80-82 POV drive, 83-86 him carrying gear.
- No burned creator subs in RAW-C6-02/03 or RAW-C7-06 frames (checked).
- W/cap_wrap.py (rewrap: 44 chars/line @23 px, <=3 lines, split events). Applied in final_c6/final_c7 CAPS loop (NOT in edl, so seg keys of other shots stay fresh).
- W/add_caps_c67.py patched sb_c6.json (RAW-C6-02 11 caps, RAW-C6-03 6, block "VO-C6-01 map"->"VO-C6-01 arr" footage) and sb_c7.json (RAW-C7-06 13 caps, [ __ ] on 3 mutes). Backups sb_c6_v3.json.bak, sb_c7_v2.json.bak, final_c6_v2.py.bak, final_c7_v1.py.bak, edl_c6_v3.py.bak.
- edl_c6 GFX: map entry removed. final OUT -> W/case6_v4_vid.mp4, W/case7_v3_vid.mp4 (then mux audio from v3/v2 -> 05_render/case6_v4.mp4, case7_v3.mp4).
- rulecheck OK both. Stale segs: C6 VO-C6-01arr, RAW-C6-02, RAW-C6-03, RAW-C6-07 (key drift from v2 patch, same picture); C7 RAW-C7-06. END unchanged 552.9 / 580.61.
- [~] Case 6 render running: `seg_c6.py && seg_c6.py asm && final_c6.py` -> W/run_c6_v4.log ("exit N"). Then: ffmpeg -i W/case6_v4_vid.mp4 -i ../case6_v3.mp4 -map 0:v -map 1:a -c copy ../case6_v4.mp4; then same for C7.
- [x] case6_v4.mp4 552.886 s (= v3), h264 Main, audio copied from v3. [~] Case 7 render running -> W/run_c7_v3.log
- [x] case7_v3.mp4 580.613 s (= v2), h264 Main, audio copied from v2. QC sheets W/qc/c6v4_sheet.jpg, W/qc/c7v3_sheet.jpg looked at: captions <=3 lines, <=1048 px, no burned subs under them, no location card left. Captions after wrap: C6 106 events, C7 83. TASK DONE. full_build.py NOT run (coordinator).
