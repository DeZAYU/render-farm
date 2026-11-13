# CAMPING-8 3-6 min Farrell sample — handoff (2026-11-09)
Objective: re-edit CAMPING-8 master 3:00-6:00 with ffmpeg (no Premiere), style guide only, no questions to the user.
- v1: renders/CAMPING-8_3-6min_farrell.mp4 (sent; the owner reviewed it with 14 notes).
- Notes saved: styleguide/farrell/farrell.json rev 27 (8 new rule-book rules + edits; backup history/rev00026-20261109-180346.json), memory _topic-farrell-edit-feedback.md, CLAUDE.md feedback-loop line.
- v2 DONE + sent 2026-11-09 (renders/CAMPING-8_3-6min_farrell_v2.mp4; -16.9 LUFS; no freezes; scripts edl2/seg2/audio2/final2/qc2; build scripts in scratchpad farrell_sample/src): renders/CAMPING-8_3-6min_farrell_v2.mp4.
  Fixes: cut sheet (PROJECT/RL-EDIT/camping8/cutsheet.md 167-362), footage first, real YouTube comment page scroll, eased morphing cards, no stills, raccoon/tanuki photos (Wikimedia), captions timed to speech, no credit, crossfade/dip only, card4-c2.mp4 title card with dips.
Next: wait for owner review of v2; save each new note to farrell.json same day. Tanuki photo is CC BY-SA 4.0 (Alpsdake), needs credit in the video description.
- 2026-11-09 owner review 2 of v2 saved (farrell.json rev 28: no ultra-short shots, clean crossfades, blur behind comments/title cards, nothing still too long, comments = real screenshots cropped + slide-up). v3 build running (scripts *3 in scratchpad farrell_sample/src; checker cutscan.py). Output: renders/CAMPING-8_3-6min_farrell_v3.mp4.
- 2026-11-09: v3 done: renders/CAMPING-8_3-6min_farrell_v3.mp4 (5395 fr, -16.9 LUFS, blacks only at dips, 0 freezes). Real JP screenshots + EN strip, slide-up/3D pan, blurred bg, no short shots, clean fades. Build: scratchpad farrell_sample/src/final3.py, HANDOFF3.md. Known: ~0.2 s at 53.35-53.45 mid-morph strip blank and reply line clipped.
- 2026-11-09 v4 (review 3): build files in scratchpad farrell_sample/src: edl4.py, seg4.py, final4.py, solo.py, segscan.py, srcscan.py, fadescan.py, winsheet.py. Narration shots all >= 3.0 s solo; 0:24 comment (ken_r1) removed; dips use an even eased custom xfade (ffmpeg fadeblack dropped too fast); srcscan.py picked cut-free ss for 02d/22/26/29, 04d slowed to 0.7; Loch stamp only on the solo part of shot 29; morph reply/strip use soft edges (no blank strip). Rule book rev 30. Output renders/CAMPING-8_3-6min_farrell_v4.mp4.
  v4 note: xfade custom expr must not use st()/ld() (slice threads share registers -> stray bright rows in dips); seg4.py dip expr is inline.
- 2026-11-09 owner goal after v4: research this editing style and keep improving (no questions). Answers: STOP when weekly usage (get_usage "Weekly · all models") reaches 35% total (was 28% at start); one render at the end only (v5), rounds improve style guide + tools; downloading reference videos of this style is allowed (own new folder in project).

## v5 (2026-11-09, research round 1)
- Research: Netflix caption 5/6-7 s, reading ~15-20 cps, picture change every 3-7 s. Owner rules beat reference pacing.
- New `rulecheck.py` (now in `tools/farrell-build/`, README there). edl5 = edl4 shots + fixed comment times (toru, sculptor, ken_sept, gajumaru) + captions (6 short ones extended/merged, raw 14 cut to its speech).
- final5.py reuses asm4.mp4. Output `renders/CAMPING-8_3-6min_farrell_v5.mp4`. Rule book rev 31.

## v6 (2026-11-10, owner review 4 on v5 at 0:49)
- Note: comment left, plain footage flashed, next comment came suddenly; comment faded out, footage played a moment, raw crossfaded in. Rule: overlay + its footage = one shot.
- edl6.py: toru fades in with the 04a crossfade (xin) and hands off to the thread at 50.70 (blur held); threads sculptor/ken_r4 and gajumaru/ken_june shown extended from frame 1; thread fades out with the crossfade into 12 / 24 (xout); matsui -> ken_sept -> gajumaru are direct handoffs.
- final6.py: env4 (xin/xout linear with the fade, hold_in/hold_out keep the blur); rulecheck.py: plain-footage 0 or >= 3 s, real entry lengths (up 22 f, pan 24 f), thread must be extended. edl6 OK, edl5 14 FAIL.
- Render: renders/CAMPING-8_3-6min_farrell_v6.mp4. Test frames: scratchpad farrell_sample/me7/sheet.png.
