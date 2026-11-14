# IN06 — The Hole at Gage's Falls (Belson Creek / Gages Gulf, Ripley NY, 14 Mar 2015)

Code `_engine/src/cases/IN06.tsx`, master `out/IN06.mp4` + `out/IN06_phone.mp4`. 126.6 s (title 4 s, VO 78 s, raws 43.2 s, end card hold).

## Timeline (VO one take, split only at the three raws, all at sentence ends)
| T (s) | what |
| --- | --- |
| 0–4 | brand TitleCard "THE HOLE AT GAGE'S FALLS" on the graded approach frame (src 19.5) |
| 4–38.12 | VO A: approach (TED ENGELHARDT label), GorgeRelief (BELSON CREEK · RIPLEY, NEW YORK), gorge, MARCH 14, 2015, walls; the approach shot runs on into RAW 1 |
| 38.12–50.66 | **RAW 1** src 12.96–25.5: the lip, the drop, the boil |
| 50.66–68.33 | VO B over the hole footage (src 25.8–47.6, silent) |
| 68.33–86.53 | **RAW 2 (main)** src 51.8–70.0: out of the boat, the empty red boat in the hole, rolled, moaning |
| 86.53–95.58 | VO C: underwater, flushed down the gorge; the hands line runs on into RAW 3 |
| 95.58–108.08 | **RAW 3** src 101.5–114.0: bare hands clawing the gorge wall |
| 108.08–126.6 | VO D: hands, 0.5x replay of the empty boat, RecordLift, his own end card under the lesson line |

## Devices (REGISTRY.md)
- GorgeRelief — NAIP x 3DEP lidar hillshade, tipping into 3-D with a raking light, creek traced from OSM.
- RecordLift — the real AW accident record (#83729), field grid as a sheet in 3-D, the injury cell lifts, red rule under "Hypothermia".
- Brand: TitleCard (style A), RedLabel ×3, glitch + blur-dips (one camera throughout).

## Sources
- Footage: Ted Engelhardt's own upload https://www.youtube.com/watch?v=QL9LqjDRZio (credit "Ted Engelhardt" on screen via label).
  Music bed (Urbanstep) removed: rawclean.py found music in all 180 s; raws use main_clean.wav (+8 dB).
- AW record: https://www.americanwhitewater.org/accident/mar-14-2015-belson-creek/ (capture_page.py; the outline's ?p=83729 link is dead).
- Aerial: USGS NAIP + USGS 3DEP hillshade (public domain); creek line OSM way 1427625771 (© OpenStreetMap contributors, ODbL) → credit OSM in description.
- Music: Epidemic "Music 3" −19 dB, ducked under raws. SFX: glitch, paper.

## Notes
- Place named Gage's Falls on Belson Creek (not "Flume of Doom", per the outline), though the AW record's location field says Flume of Doom (visible small on the sheet).
- One camera for the whole case: same-camera joins use blur-dips. No Blender (not needed).
