# TP10 — Sixty-two on The Wheel (ICON Park, Orlando, 31 Dec 2022)

Code: `_engine/src/cases/TP10.tsx` · out: `build/CASE10/out/TP10.mp4` (+ `_phone`) · 151.2 s.

## Footage
- [IW] Orange County Fire Rescue release, https://www.youtube.com/watch?v=iE3erUjymgs (footage/17_ICON_Park…/main). SILENT
  (−91 dB), drone colour + a 4:3 thermal camera joined by slow dissolves (avoided: 46-47.7, 72-73.5, 76-78, 103-104.5, 119-120.5,
  131-136.5, 149-150.5, 156-162, 189-190, 213-214.5, 222-223.5).
- A burned-in caption strip (OCFR credit, only its top visible) sits in the bottom ~15 px: cropped off in `media/iw.mp4`
  (crop 1880x1058 -> 1920x1080). Thermal windows use `media/iwt.mp4` (the 4:3 picture cropped to fill).

## Decisions
- The cut sheet's six 30 s raws are silent drone/thermal; kept as six 6.5-8 s breathing windows (where firefighters visibly work
  the steel / a gondola is worked down) with real wind + metal SFX, not 180 s of silence. Music (Music 4, −21.5 dB) runs through them.
- No count word in the take (it starts on "The Wheel"), so the take starts at 0.0; split only at the six raws.
- "Sparks above one gondola": nothing filmed; shown on a gondola roof in the drone footage (no fake sparks).
- "Reopened in February 2023": the wheel by day (Commons photo, Feb 2022) with the date label = the reopening date, not the photo date.

## Devices (new, dev/)
- HeightSheet (`dev/TP10_HeightSheet.tsx`): the Wheel (CC0 photo, 400 ft rule) beside the NPS/HAER measured elevation of the
  Statue of Liberty (public domain), same ft/px on one ground line; dashed torch line runs across to the wheel. The HAER sheet
  gives ground-to-flame 290'1" (the drawing's own datum), the wheel is 400 ft.
- Blender hand-turn (`assets/wheel_handturn.py` -> `graded/handturn.mp4`): 30 gondolas, 20 lit (the 62 riders' 20 gondolas),
  stepped one spacing at a time; each lit gondola goes dark when it reaches the platform.
- WheelClock (`dev/TP10_WheelClock.tsx`): the wheel's rim as a 12-hour dial, arc 6:20 -> 10:43 PM.

## Sources
- The Wheel (CC0): https://commons.wikimedia.org/wiki/File:La_grande_roue_d%27Orlando_(Floride)_en_f%C3%A9vrier_2022.JPG ,
  https://commons.wikimedia.org/wiki/File:Orlando_Eye_-_f%C3%A9vrier_2022.JPG
- The Wheel at night (CC BY-SA 4.0, credit the Commons author): https://commons.wikimedia.org/wiki/File:The_Wheel_at_ICON_Park_(purple).jpg
- HAER NY-138 sheet 15, Statue of Liberty elevations (public domain, NPS):
  https://commons.wikimedia.org/wiki/File:North_Elevation,_East_Elevation,_South_Elevation,_West_Elevation_-_Statue_of_Liberty,_Liberty_Island,_Manhattan,_New_York,_New_York_County,_NY_HAER_NY,31-NEYO,89-_(sheet_15_of_36).png
- No downloads of new video.

## Open
- The ICON Park "Intamin" line uses an Inset of the night photo with a manufacturer label (the structure Intamin built).

## Raw audio (guide 5b)
- The OCFR release has no audio track content (−91 dB), so there is no raw sound to clean; raws carry real wind/metal SFX only.
  Raws sit at the cut sheet's six cue positions, in order. Nothing to blur. No re-render needed for 5b.

- 3 Nov 2026 RAW AUDIT (owner: raws only at incident moments, never in explanation, no near-dups): removed holds 3, 4 (after the Blender explanation / gentlest-ride commentary) and 6 (near-dup, lone line): 6 -> 3 holds (silent source). Code: cutOut() at the end of cases/TP10.tsx (lib/core/cutOut.tsx drops the VO-silent raw windows; VO runs on as one take). Re-rendered; cutcheck flags all on designed transitions.

- 3 Nov 2026 RAW AUDIT (owner: raws only at incident moments): removed holds 3, 4 (after the Blender explanation / gentlest-ride commentary) and 6 (near-dup, lone line): 6 -> 3 holds (silent source). cutOut() at the end of cases/TP10.tsx; blur-dip halves at 84.7/91.2 make the raw-4 join one dip. 130.3 s, cutcheck 0 flags outside designed dips.
