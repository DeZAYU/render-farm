# TP25 · Two hundred on the Sky Glider · West Allis, Wisconsin (last case)

Code: `_engine/src/cases/TP25.tsx` · devices `_engine/src/dev/TP25_CableRun.tsx`, `_engine/src/dev/TP25_SpreadOut.tsx`
Output: `build/CASE25/out/TP25.mp4` (master, −16 LUFS), `TP25_phone.mp4`. Duration 148.0 s.

## Edit
- TitleCard "TWO HUNDRED ON THE SKY GLIDER" on a darkened ST frame (bucket at the chairs) → glitch.
- RedLabels: WEST ALLIS, WISCONSIN / AUGUST 5, 2010 on the opening midway shot; SKY GLIDER on the chairs by the wheel.
- VO = CASE25.mp3 as one take (no count word to drop), split only in its own pauses for the six raws.
- Raws in cut-sheet order, at sentence ends only (owner rules 2–3 Nov: fewer, longer raws; no lone lines between raws):
  R1 SK 20–34 (14 s, bucket reaching the chairs), R2 SK 58–68 (10 s), R3 SK 93.5–107.5 (14 s),
  R4 = cues ST 0:10–0:40 + SB 0:00–0:17 merged into one 23.7 s raw from two angles (ST 13–25 bucket with riders by the station,
  crowd; SB 0.8–12.5 bucket among the coloured chairs by the lit wheel). The SK 2:10–2:40 cue is dropped (mostly silent, and
  keeping it would have stranded "The bucket kept working its way down the line" alone between raws); its picture (SK 146) now
  runs under that line. VO stretches between raws: 22.5 / 10 / 14 / 11.8 s. Raw audio = `media/{sk,st,sb}_clean.wav`
  (rawclean.py --force: fair music removed), each window gained to ≈ VO level, fades in/out, never under the VO.
- SK (480x360, 4:3) is shown whole at 1440x1080 over a brightened blurred copy of itself (no dark bars).
- Ending: SK 166–171 (the bucket at the chairs, held) under the last line; VO ends ≈145.9, ~2 s hold, fade to black over the last 1.2 s.
- Music: `Music 4.mp3` from 0:45 at −22 dB (file ≈ −12 LUFS vs VO −24.5 → ≈10 LU under), looped once (second pass from 0:20)
  with the crossfade hidden under raw 3; ducked to ~12 % under every raw. SFX (real): fire-engine idle under the engine shot,
  metal clank + sub drop when the drive dies in CableRun, a soft wind gust under SpreadOut; glitch on the two designed glitches.

## Devices
- **CableRun** (40.45–50.45, runs on under "…hanging right over the crowd"; "Every chair … runs off one cable and one drive. When the motor goes, every chair stops…"):
  freeze of ST 1:00 (the wide shot of the line); white line traced along the cable through the chairs to a white-line bull
  wheel + motor (DRIVE label); ticks run along the cable while it turns; the wheel stops and dims, every chair gets a bracket.
- **SpreadOut** (65.56–74.55, "A coaster keeps its riders together… every chair is its own rescue"): one coaster train with its
  riders in one bracket → shrinks to the corner; a cable recedes into depth with 100 two-seat chairs (200 riders); a bucket truck
  visits the near chairs one at a time (riders leave), brackets ripple out along the whole line.
- No aerial: the fairground place adds nothing the footage does not show.

## Sources
- [SK] main: https://www.youtube.com/watch?v=Ijwhu8zBqpk (fairgoer's phone, posted the same night; 480x360). Source cuts 223.57 / 232.7 / 235.67.
- [ST] https://www.youtube.com/watch?v=_cAzqSObyuY (720p; cut at 11.27, windows start ≥ 13).
- [SB] https://www.youtube.com/watch?v=BXZ0ziG3TnQ (720p; no cuts).
- No extra downloads (the three clips cover every beat). No stills. Nothing needed blurring (no injuries).

## Unsolved / notes
- No footage exists of the ride "up and running again" two days later; that line runs over the long line of chairs (ST 55.5).
- SK is very dark/soft; used for the bucket raws and atmosphere only; ST/SB carry the clear shots.
- Cutcheck: 0 flags (final render, allow = designed glitch/zoomHit/blur-dip windows + end fade). Windows chosen to avoid the phone's own jerks (SK 34.3, 108.4, 186.7+, 206.6–207.2, wheel glare pan SK 3–5);
  windows were pre-checked by running cutcheck on each source window. SK and ST both show the same bucket, so their joins use blur-dips.

- 3 Nov 2026 RAW AUDIT (owner: raws only at incident moments, never in explanation, no near-dups): removed RAW 2 and RAW 3 (inside the one-cable / every-chair explanation, near-dups of RAW 1): 5 -> 3 raws. Code: cutOut() at the end of cases/TP25.tsx (lib/core/cutOut.tsx drops the VO-silent raw windows; VO runs on as one take). Re-rendered; cutcheck flags all on designed transitions.
