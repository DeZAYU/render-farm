# TP08 — The Martillo locks at its peak (Feria de Almería, 28-29 Aug 2026)
Code: _engine/src/cases/TP08.tsx · out: out/TP08.mp4 (+ _phone) · ~143 s

## Footage
- Gustavo Herrera's own vertical phone livestream (~2K subs) https://www.youtube.com/watch?v=d3eX_B9V4m0 (72 min, 428x854).
  Windows a1 120-180, a2 640-800, a3 1300-1700, a4 3470-3800, a5 3880-4330 s (media/a*.mp4, audio kept for raws); one LUT (luts/al.cube).
  Avoided: the live-reaction heart icons around 2:48-2:56. Vertical shots use Shot_FX fill (picture centred on its own blurred copy).
- No extra angles downloaded: yt-dlp metadata hit a YouTube bot check (not bypassed), no other small-channel uploads looked for.
- Decision: the cut sheet's COLD-OPEN raw (2:15, "mute the stream audio") was not used as a silent raw; the case opens on the title card
  then VO over the stopped arm. Raws are 4 short windows (8-9 s) of the stream's own sound where baskets work at the gondola
  (the filmer talks in Spanish in places; not transcribed — no multilingual model on this machine. Worth a quick listen).

## Devices
- HammerSwing (dev/TP08_HammerSwing.tsx): white-line hammer ride turning over the top about one pivot, stopping near the peak; later
  "pivot" mode lights the load path into the single pivot.
- FairPins (dev/TP08_FairPins.tsx): NASA GIBS Blue Marble shaded relief of Iberia (public domain; graded --nonorm), pins on Seville,
  Almería (red), Barakaldo as named.
- Inset zooms on the gondola / seats; RedLabels for place, date, "THE MARTILLO", "1:20 AM".
Sources for facts: esdiario.com and donporque.com (dossier). Music 4 at -22 dB (file is hot, -11.9 LUFS), ducked under raws.

## Update (owner rule 5b)
- Raw audio from rawclean.py (media/raw_k1..k6_clean.wav); fair music was detected and stripped in most windows; k4 and k6 re-run with --force.
- Raws now at every cut-sheet cue in order: cold open (2:15, muted per the sheet, music bed only), after "pieces fell", after "eight of them"
  (new, a3 240), after "restraint", after "mechanism", after "last checked it" (new, a3 330), after "two in the morning". Duration ~164 s.
  (This replaces the earlier decision to skip the cold open.) No blur needed.

## Update 3 Nov (owner rules on TP17/TP19 + cutcheck)
- Main raw (R3, basket at the gondola) built long in code: 14.3 s (a4 162-176.3, sound media/raw_k4b_clean.wav via rawclean --force).
  Everything after it +5 s; DUR 168.8. This supersedes the raw_extend.py pass on the old master (its backup moved to out/_stale/).
- HammerSwing now appears once: the "one central pivot" line is a push into the real hub (a4 100).
- Cutcheck JUMPs fixed: livestream stutters avoided (a2 130->80.5, a5 128->140, a5 340->350), blur-dips at 129.84 / 137.64.

- 3 Nov 2026 RAW AUDIT (owner: raws only at incident moments, never in explanation, no near-dups): removed k2 (near-dup, after the first-reports line), k3 (near-dup of main k4b) and k5 (inside the travelling-fairs explanation): 7 -> 4 raws. Code: cutOut() at the end of cases/TP08.tsx (lib/core/cutOut.tsx drops the VO-silent raw windows; VO runs on as one take). Re-rendered; cutcheck flags all on designed transitions.
