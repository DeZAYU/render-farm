# VAN audio pass (music + SFX) handoff — 2026-11-11

R = `C:\Users\ayush\Videos\CLAUDE\STYLE guide`, V = `R\productions\van-camping-encounters`, W = `V\05_render\work`. Winter W is read-only (scripts copied from it).

## Scripts in W
- `music_pass.py N` — takes the NEWEST `V\05_render\caseN_vK.mp4`, writes `caseN_v{K+1}.mp4` (video `-c copy`, audio AAC 320k). Refuses if the newest file is already its own output (`V\audio\cues_cN.json` dst). Cues -> `V\audio\cues_cN.json`, track offsets -> `V\audio\music_used.json`.
- `qc_section_van.py IN OUT` — PASS = I -17 ±0.5, TP ≤ -1, durations equal, video stream bit-identical (md5).
- `full_build.py` — needs sections 1..12 (exits otherwise) -> `V\05_render\VAN_CAMPING_ENCOUNTERS_full.mp4`. NOT run yet.
- `qc_audio_pass.py` — after full_build: `V\audio\cues.md` + full-file loudness/mute QC + graph.
- No helper with winter paths is imported (music_pass imports van `edl_cN.py` only), so no `*_van.py` helpers were needed.

## Decisions
- Music (local ES library copies in `V\audio\music`), none used in winter (winter: Margin, Kerofled, Still in Blues): section N uses `[Fraught, Whos at the Window, Stale][(N-1)%3]`.
- Levels as winter: bed -31 LUFS under VO, -46 under raw dialogue (duck), -26 on cards/graphics.
- Cut sheet: MUSIC OUT blocks (parsed from `V\00_input\cut_sheet.md`: "MUSIC OUT", "music out", "music returns only after") = music silent, 0.4 s fade ending at the block edge. VO-CO-01: music enters under its last sentence (word-ratio estimate). RAW-C5-04 ("MUSIC OUT for the knock clip") muted for the whole block.
- SFX: only one soft whoosh (-32 LUFS) peaking on each CARD-Cn / TITLE-CO; no hits/booms/braams (no jumpscare SFX).

## Status
- Setup done. Fix: dropped `-shortest` from the mux (it cut the audio 26 ms short of the input; first case2 try deleted and redone).
- case2_v3 PASS (-17.01 / TP -2.01, video bit-identical). case1_v3 PASS (-17.0 / -1.71; music enters 24.8 s, out under VO-C1-07).
- case4: first try FAIL TP -0.97 (AAC overshoot) -> music_pass.py now retries with the limiter ceiling 1 dB lower until TP <= -1.05; own case4_v2 deleted and redone.
- case8: first try crashed (all Whos-at-the-Window offsets used) -> fallback to reuse offsets; rerun OK.
- DONE 13:52, all QC PASS (qc_section_van.py: I, TP, durations equal, video stream md5 identical):
  | out | I | TP | dur s |
  |---|---|---|---|
  | case1_v3 | -17.00 | -1.71 | 481.65 |
  | case2_v3 | -17.01 | -2.01 | 292.12 |
  | case4_v2 | -17.02 | -1.80 | 304.77 |
  | case5_v2 | -17.01 | -1.89 | 346.20 |
  | case8_v2 | -17.00 | -1.25 | 224.77 |
  | case10_v2 | -17.04 | -2.03 | 179.20 |
- Logs: W\music_pass_van.log, W\music_pass_van_redo.log. Temp wavs W\mp_cN\ (~300 MB each, safe to delete).
- WARNING for case agents: these music versions now hold the next version number. A picture fix to case1/2/4/5/8/10 must render as a NEW higher version, then rerun music_pass.py on it.

## Remaining sections (3, 6, 7, 9, 11, 12) — run ONLY after that section's final render is done (its newest caseN_vK.mp4 is the final picture+mix)
From Git Bash, `cd "/c/Users/ayush/Videos/CLAUDE/STYLE guide/productions/van-camping-encounters/05_render/work"`, then per case (K = newest version before the pass):
- case3:  `python music_pass.py 3  && python qc_section_van.py ../case3_vK.mp4  ../case3_v$((K+1)).mp4`
- case6:  `python music_pass.py 6  && python qc_section_van.py ../case6_vK.mp4  ../case6_v$((K+1)).mp4`
- case7:  `python music_pass.py 7  && python qc_section_van.py ../case7_vK.mp4  ../case7_v$((K+1)).mp4`
- case9:  `python music_pass.py 9  && python qc_section_van.py ../case9_vK.mp4  ../case9_v$((K+1)).mp4`
- case11: `python music_pass.py 11 && python qc_section_van.py ../case11_vK.mp4 ../case11_v$((K+1)).mp4`
- case12: `python music_pass.py 12 && python qc_section_van.py ../case12_vK.mp4 ../case12_v$((K+1)).mp4`
If a section is re-rendered AFTER its music pass, run `music_pass.py N` again on the new render (the guard refuses a file the pass itself wrote).
Then: `python full_build.py` (needs all 12; check > 35 min) and `python qc_audio_pass.py`.
