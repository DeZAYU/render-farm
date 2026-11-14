# TP15 — The chain swing that wouldn't come down (Öcher Bend, Aachen, 27 Apr 2022)
Code: `_engine/src/cases/TP15.tsx` (DUR 84.6 s). Music: Music 3 (−19 dB, dipped under raws).

## Devices
- **SwingDiagram** `dev/TP15_SwingDiagram.tsx`: white-line 2.5-D chain swing over the darkened clip: crown climbs while spinning, seats fly out
  (the "how it works" line), then a second pass stopped dead with the ground-to-seat 25 M bracket.
- **Aerial** (brand) on the NRW orthophoto (DOP, dl-de/zero-2-0, wms.nrw.de/geobasis/wms_nw_dop): the Bendplatz boxed.
- **Inset** (brand) on the basket ("blankets") and on one open seat.
- The phone clip is 352×640 vertical: shown whole in a white-framed panel over a bright blurred copy (in-case `Vert`), not upscaled to fill.
  TP12 has a vertical panel device (VertStage, turned panel + landscape magnifier); this one is the plain presentation of a vertical clip.
- Title shortened to "THE CHAIN SWING THAT STUCK" (the cut-sheet title wrapped to two lines).

## Raws (all 4 cut-sheet cues, in order)
R1 stopped swing (main 66–71) · R2 basket at the seats (main 20–26.25) · R3 basket working (main 48–53) · R4 seats over the crowd (main 100–105.7).
Sound: the clip's crowd through `rawclean.py --force` → `media/main_clean.wav` (fair music detected throughout; voices kept, whisper: "Crowd talking").

## Sources
- main: Quoyle23 https://www.youtube.com/watch?v=ZxoA_doy8K4 (upload title says 2020; the event is 27 Apr 2022)
- downloaded: Freizeitpark.explorer09 "Öcher Bend 2022" https://www.youtube.com/watch?v=eq9mUMUQTTg (8 subs, the same spring Bend a week
  earlier; used 35–62 s and 253.8–263.6 s; its title text at 0–3 s avoided). News agencies (nrwaktuelltv, BILD, BuzzClips) skipped.

## 3 Nov 2026 audit (raw lengths in code, raws only at incident moments)
- Timeline recoded by hand (replaces the raw_extend.py splice): RAW 1 stopped swing 5.0 -> 8.0 s (main 66-74), RAW 2 basket at the
  seats 6.25 -> 14.0 s, the main raw (main 20-34). Removed old R3 (basket working, commentary stretch) and R4 (after the open-seat line);
  VO B1 -> B2 -> C now one take. Second Inset (one seat) replaced by a slow push on the phone panel: one Inset left (blankets). 84.95 s.
