# TP01 — The Steel Max slingshot, Feria de Abril, Seville (24 Apr 2026)
Code: `_engine/src/cases/TP01.tsx` · out: `out/TP01.mp4` (143.0 s, −16 LUFS), `TP01_phone.mp4` · cutcheck: see final report line below.

## Edit
TitleCard → VO A (fair, slingshot explained) → RAW 1 (launch + the snap at sx 64.6, 15.6 s) → 0.5x replay of the snap under "One cable broke"
→ Blender swing → people running → RAW 2 (capsule against the mast) → lowering (phone clip) → StepStrip → close-ups → RAW 4/5 (riders against the
mast, crowd sound) → outcome (crews, police) → TwoSystems → crowd. VO one take (no count word), split only at the 4 raws. Music 4 at −22 dB, out under raws.

## Devices (new, `_engine/src/dev/`)
- TP01_CableTrace: masts then the two cables drawn white on the filmer's own frame (sx 38 s) as they are named.
- Blender slingshot model (`assets/slingshot.py`, 360 f Eevee): even launch on two cables; then the right cable lets go and the capsule swings on
  the left one into the left mast (pendulum sim, hit timed with impact SFX). Used 2 × ~5 s.
- TP01_StepStrip: five frames of the vertical phone clip (3/30/62/96/114 s) on a tilted strip, each lands with a clank, a white line steps down through the capsule.
- TP01_CableHold: freeze of the close-up, four white brackets close on where the last cable meets the capsule.
- TP01_TwoSystems: 3-D board, coaster wheel assembly (public domain) → camera trucks to the slingshot frame, its two cables traced.

## Sources
- sx = https://www.youtube.com/watch?v=BlRSPQvw-NA (María Sánchez Izquierdo, personal) — live sound used in raws.
- sm = https://www.youtube.com/watch?v=lMdhTJ8_QEA (STAYARMY12 livestream, vertical). Its audio is a constant-level added track → always muted.
  It starts AFTER the snap, so the cut sheet's "[SM] 0:48–1:12 snap" cue does not exist in this file: the snap raw comes from sx (63–66 s) instead.
- Coaster wheels: https://commons.wikimedia.org/wiki/File:Roller_coaster_wheels.jpg (public domain).

## Decisions / issues
- 5 raws in the cut sheet's places and order, dead air trimmed: 15.6 s (snap, sx) + 7 s (sx) + 9.8 s (the lowering, sm 90.4–100.4) + 12 s + 9 s (sx close-ups).
- Raw audio = rawclean'd tracks (owner rule 5b): `media/tp01_sx_clean.wav` (music removed in 148 of 186 s) and `media/tp01_sm85_clean.wav`
  (sm's whole track is music → --force, voices only). Nothing needed blurring (no injuries/bodies on screen).
- No downloads for this case. sx 72–80 s has near-silent audio (filmer's mic), avoided for raws.
- Remotion stills/renders time out under heavy machine load (load avg >200): rendered with `--timeout=240000` via a copy of render_case.sh
  (`C:/Users/ayush/Videos/CLAUDE/STYLE guide/tools/oldheritage/scratch/tptools/render_case_t.sh`); shared tools untouched. Asset names are prefixed `tp01_` (the remotion asset cache is keyed by URL, so
  `case/graded/sx.mp4` in two cases can collide).
