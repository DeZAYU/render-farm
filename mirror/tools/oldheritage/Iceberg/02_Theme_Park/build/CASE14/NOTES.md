# TP14 — Twenty-two hanging over the Carmen fiestas (Barakaldo, 11 Jul 2015)
Code: `_engine/src/cases/TP14.tsx` (DUR 107.9 s). Music: Music 1 (−15 dB; lifted a touch in the raws).

## Devices
- **DownRiver** `dev/TP14_DownRiver.tsx`: IGN PNOA orthophoto (CC BY 4.0, scne.es; WMS www.ign.es/wms-inspire/pnoa-ma): BARAKALDO named,
  white line down the estuary from Bilbao, dive onto the Bilbao Exhibition Centre, box + label.
- **LadderReach** `dev/TP14_LadderReach.tsx` + Blender `assets/flyer_blender.py` → `graded/ladder.mp4`: tower swing (seats ~42 m), an aerial
  ladder platform lifts its basket to them; a height ruler tracked to the 3-D camera (`dev/TP14_ruler.ts`, exported from Blender), 40–50 M band.
  Played in two parts (rate 0.5 for the height line, 0.706 for the platform lines).
- RedLabel JULY 11, 2015. Title shortened to "TWENTY-TWO OVER THE FIESTAS" (the full one overflowed the frame).

## Raws (all 6 cut-sheet cues, in order) — and why they are silent
R1 ex2 crown 10–14 · R2 continues "Then the brigade arrived" on ex1 20.5 (ladder rising over the crowd) · R3 continues the baskets shot (main 2–10.4)
· R4 main 36–40.5 · R5 main 62–66 · R6 continues "came and went" (main 90–96.5). Each 4–5 s.
No clip has usable sound: websmaster II / websmaster (ex1, ex2) are silent (−56 dB); Javier JOU's main is fair music — `rawclean.py --force`
left its sung vocals (whisper: "NON-ENGLISH SINGING"), so it is not used. The raws are short picture holds with music + real wind/metal SFX.
If the owner wants them shorter or out, the VO splits are in one table in the code.

## Sources
- main https://www.youtube.com/watch?v=uy7kYAvFmO8 (two aerial ladders and baskets at the seats)
- ex1 https://www.youtube.com/watch?v=2TQllh9i-AQ, ex2 https://www.youtube.com/watch?v=fxgD3euKqDA (same tower swing; checked: crown, arms, the fire ladder in frame)
- More personal clips exist (NosTubeYo8, TomaVideo, sara balost, LUISCALABOR) but YouTube's bot check blocked them; not bypassed.

## Checks
- No source cuts in any clip. ex1 42–43 exposure jump avoided.

- 3 Nov 2026 RAW AUDIT (owner: raws only at incident moments, never in explanation, no near-dups): removed holds 4 and 5 (inside the travelling-fiesta explanation): 6 -> 4 holds (silent source). Code: cutOut() at the end of cases/TP14.tsx (lib/core/cutOut.tsx drops the VO-silent raw windows; VO runs on as one take). Re-rendered; cutcheck flags all on designed transitions.
