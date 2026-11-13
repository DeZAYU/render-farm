# Audio pass (music + SFX) handoff - WINTER CAMPING ENCOUNTERS (2026-11-11)
Task: audio-only new version per section (video -c:v copy), mix + ES music bed + sparse SFX, -17 LUFS / TP<=-1, AAC 320k 48k. Then full_build.py + QC.
## Decisions
- Source: ES files already in the es-bridge library (C:\Users\ayush\Music\EpidemicSound), copied into V\audio\music|sfx (no new quota).
- Music (dark drone, steady, low centroid): A = ES2_Margin (396 s, centroid 370 Hz) for C1/C4/C7; B = ES2_Kerofled (271 s, 351 Hz) for C2/C5; C = ES2_Still in Blues (300 s, 378 Hz) for C3/C6. Adjacent cases never share a track. Cues = different sections of the case's track, 6 s equal-power crossfades, new cue at each case card + key moments (min 75 s apart, max 7); (track,start) never reused (V\audio\music_used.json).
- Bed levels (pre-master LUFS): under VO -31 (rule book bed -31; ~15 dB under VO), under raw clips -46 (raw clear, never dead), elsewhere (cards/gfx) -26. 0.5 s smoothing. Section fade-in 1.5 s, fade-out 2.5 s.
- SFX: unique file per placement; whoosh+low hit on each case card, whoosh on channel-page graphic, low hits on flash/freeze reveals, VHS SFX on rewind fx, wind texture on C1 cold-open card and C6 intro.
- Script: W\music_pass.py N -> caseN_v{K+1}.mp4; per-section cue json V\audio\cues_cN.json -> V\audio\cues.md.
## Status
- [x] script written (C2 test ok: -17.01 I, TP -1.86). Batch C1,2,3,4,6,7 running -> W/mp_run.log. C5 poller waits for case5_v1.mp4 (then: python music_pass.py 5). Then full_build.py, then python qc_audio_pass.py (writes audioes.md + QC + full_audio_loudness.png).
- [x] C1 v4, C2 v3, C3 v3, C7 v2 done (I -17.0, TP -1.85..-2.12, music 15.5-18.5 dB under VO). C4 v3 redone (3 cues, spacing 55 s). C6 v3 redo running (first try I -16.72 TP -0.85: linear loudnorm fell back on LRA 21 -> master now = static gain + alimiter 0.80, iterated to -17.0).
- Mute points: original-mix stem at room tone/silence at every mute (raw voice absent); C1 41.74 s is under the VHS rewind SFX (-31.6 dB), others <= -42.8 dB.
- [x] C6 v3 redone: I -16.98, TP -1.56, 5 cues. Waiting on case5_v1.mp4 (poller). Next: scan edl_c5 for card/channel/reveal times, set SFX 5 list in music_pass.py if needed, run 5, full_build.py, qc_audio_pass.py.
