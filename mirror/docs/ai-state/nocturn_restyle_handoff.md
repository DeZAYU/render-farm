# Nocturn restyle of Winter + Van — handoff (2026-11-11)

Owner: Winter and Van full videos "not up to the mark". Re-edit both in the Nocturn channel style (youtube.com/@Nocturn_real):
more motion graphics, SFX and music all through, Nocturn grade. Intro motion graphic must be different on every video.

## Done
- Deleted 40 old caseN_vK.mp4 test renders (kept newest per case + both full videos). C: 43 GB free.
- Nocturn refs: `productions/_nocturn-ref/src/` (4 videos 720p + en srt), study sheets + numbers in `_nocturn-ref/study/`.
  Measured: footage YAVG 72-88, SATAVG 7.5-11, warm/red tint, lifted blacks; master -11.5..-17.5 LUFS (most ~-13); no dry gaps.
  Ours (Winter full): YAVG 61, SAT 5.6, cool/blue.
- Grade APPROVED by owner: `_nocturn-ref/grade/nocturn_grade.txt` (ffmpeg chain). Footage only, never captions/cards/pages.
  Gives Winter c1 YAVG 79, SAT 9.
- Rule book rev 46: 6 new rule-book entries (Nocturn wins clashes; timing/caption rules stay).
- Storyboard for 3-min Winter test (0:00-3:10): artifact https://claude.ai/artifact/Co3NmjDpoi6qK5JPsREKu3,
  file `productions/winter-camping-encounters/04_storyboard/nocturn_c1_src.html` (+ embedded copy nocturn_c1_storyboard.html).
  Intro "Camera Wall" (7 CRT monitors, CAM 0N, fly into screen 1) replaces the carousel (Winter only; Van needs another idea).

## Status (2026-11-11)
- Storyboard approved by owner 2026-11-11. Test render done: `productions/winter-camping-encounters/05_render/case1_n1.mp4` (0:00-3:10, 189.99 s), sheet `case1_n1_sheet.jpg`.
- Build (05_render/work): edl_c1n.py, seg_c1n.py, gfx_c1n.py (do not run render_all), wall_c1n.py -> c1n/wall.mp4, mix_c1n.py -> c1n/mix_n1.wav, final_c1n.py (run with PYTHONPATH=.; C1N_TMP=temp chunk dir). Base picture = existing work/asm.mp4, grade mixed per frame on footage only.
- QC: -14.0 LUFS, TP -2.1, LRA 6.8; 0 silences (-45 dB/0.7 s); footage YAVG/SAT 70-105 s 85.6/9.0, 130-150 78.8/7.2, 155-185 82.0/11.2; night cold open 40.8/8.0 and spirit-box dim 59.5/6.1 (dark by design).
- Date card = JANUARY 2026 / NOVA SCOTIA, CANADA (upload_date 20260128 + cut sheet). Stamps show no time of day (not verifiable).
- Open: series title card removed (date card took TITLE-CO-01 slot) - owner to confirm. C1-07/08/09 (after 3:10) not built. Waiting: owner review of case1_n1.mp4.

## Status v2 (2026-11-12, owner notes rule book rev 50)
- `05_render/case1_n2.mp4` (189.99 s, h264 1080p 29.97 + aac 48k), sheet `case1_n2_sheet.jpg`; v1 kept as `case1_n1_v1.mp4`. Script backups `*_c1n_v1.py`.
- Audio `mix_c1n.py` -> `c1n/mix_n2.wav` + `mix_n2_report.json`: no wind; cold open drone -28; music -30 under VO (measured -14.8 dB vs VO), -24 free, drone -34; SFX = local bed -3 (big) / -10 (light) / -14 (26.2 glitch LP 3.5 kHz, 44.4 VHS trimmed 1.5 s); synth -8 dB. Every SFX below music (max -1.1 dB short-term).
- QC: -14.0 LUFS, TP -1.9, LRA 7.6; 0 silences (-45 dB/0.7 s).
- Tent freeze: red outline removed; feathered quad mask (dilate 41, blur 40), rest -> 70 % brightness / 35 % sat over 0.4 s.
- Map: new `map_c1n.py` -> `c1n/map_n2.mp4` (dark desat OSM z7, 3D tilt 10->44 deg + log push, haze, vignette, red pin + ground rings, label HALIFAX, NOVA SCOTIA, OSM credit); final_c1n swaps it as asm + k*(new-old) (xfade k verified); top-left label0 dropped.
- Waiting: owner review of case1_n2.mp4.

## Next (after OK), Winter section 1 only
- Base: `productions/winter-camping-encounters/05_render/work/` *_c1.py (edl/seg/gfx/mix/final), copy to *_c1n.py; out `case1_n1.mp4` (first 3:10 only for the test).
- Grade in seg stage; new gfx per storyboard; audio: bed under VO -21 (10 dB under), under raw ~-34, MUSIC OUT -> low drone; SFX on every gfx/punch-in/card/scare; master -14 LUFS, TP -1.
- Unverified: date of Case 1 footage for the VHS date card (check source upload date).
- rulecheck before render; QC frames + loudness.

## Status v3 (2026-11-12, n3 = full Case 1)
- `05_render/case1_n3.mp4` 8:56.7 (536.74 s), 0:00-3:10 same as n2. Mix `work/c1n/mix_n3.wav`: I -14.0, TP -1.8, LRA 9.6, silence none, music under VO -14.8 dB, max SFX-vs-music -1.1 dB.
- Added after 3:10: "1:00 AM" time card (297-299), VCR stamps on every RAW-C1 start, C1-08 freeze+zoom (345.85) with vignette, C1-09 hard punch+shake+red flash (424.70), solid red bars on article pages (pages_c1n.py), comments+flash ported, 16 SFX.
- Open: C1-08 has no red circle (no light visible in clip); RAW-C2-01 teaser keeps caption and gets no stamp.
- Backups of n2 scripts: `*_c1n_v2.py`. Progress note: `work/c1n/N3_HANDOFF.md`.
