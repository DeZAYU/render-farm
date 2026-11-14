# TP05 — Lifted off the tower by helicopter (Freizeitland Geiselwind, 3 Sept 2019)

Code: `_engine/src/cases/TP05.tsx` · out: `build/CASE05/out/TP05.mp4` (+ `_phone.mp4`) · ~2:09 (129.4 s)

## Edit
- TitleCard on the platform frame → footage-led VO shots → 3 raws → outcome (most down by 7, last 8:15, 11 of 21 children;
  defect / TÜV; Boomerang drill; the next day's queue; "stopped the ride with everyone sixty metres up" over the tower).
- VO: one take, split at the raws only (4 parts: 0–30.85 / 30.95–42.75 / 42.9–54.75 / 54.95–end).
- Raws at the cut sheet's four ▶ RAW cues in order (rule 5b): R1 70.0–84.0 (helicopter over the tower lifts a rescuer + visitor),
  R2 95.6–105.6 (under the platform, a rescuer and visitor on the line), R3 89.6–94.6 (after "I'd have refused too": the
  helicopter and a rider over the tower), R4 133.0–142.35 (helicopter holds over the tower). Sound = `media/gw_clean.wav`
  (rawclean.py: no music detected, original rotor sound kept), −13 dB (it is loud), music out under each raw. Nothing to blur.
- Every window sits between the source's own cuts (5.12 10.0 29.6 34.0 46.8 51.8 56.8 66.2 94.84 110.24 115.52 122.6 132.28 142.6).
- Grade: `--house --nonorm` (the normalising pass took the bright sky clip to gamma 1.6 and crushed it; the look alone matches).
- Music: Epidemic ambient Music 1 (−15 dB), out under the raws.

## Devices (new; registry lines added)
1. **LevelLines**: whole-frame level lines on the real footage — a white level locks on the tower top (95 M); later a red
   level locks on the stuck platform and the 60 m below washes dark. (First built as a ticked staff; changed because TP07
   registered a height staff.)
2. **HeliTriptych**: three different helicopter moments in three white-framed panels, half speed, sliding in on the three
   names (no panel is labelled: the clip doesn't show which aircraft is which).
3. **RescueBar**: 4:30–8:30 PM bar, fill to 7 PM, red tick at 8:15 PM; 21 blocks, 11 turn red on "children".
4. **Bavarian DOP20 orthophoto** (geoservices.bayern.de, open data CC BY 4.0, graded `--nonorm`): Boomerang coaster boxed
   (position from OSM); the park road traced toward the A3 for "cars queued almost back to the autobahn".

## Sources
- IjumeHUPx0c (Berthold Diem, the filmer's own video). No downloads: YouTube answered with a bot check later in the night,
  so no extra angles were fetched.
- Note: the Top of the World tower is not identifiable on today's orthophoto (not in OSM either; may have been removed), so
  the aerial marks only the Boomerang and the road; the "few metres away" distance is not measured.

- 3 Nov 2026 RAW AUDIT (owner: raws only at incident moments, never in explanation, no near-dups): removed RAW 3 (5 s) and RAW 4, near-duplicates of RAW 1: 4 -> 2 raws (14 s main, 10 s). Replaces the raw_extend splice. Code: cutOut() at the end of cases/TP05.tsx (lib/core/cutOut.tsx drops the VO-silent raw windows; VO runs on as one take). Re-rendered; cutcheck flags all on designed transitions.
