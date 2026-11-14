# TOR25 — Ninety minutes with the Chapman wedge · Dickinson County, Kansas (25 May 2016, upper-end EF4)
Render: `out/TOR25.mp4` (~190.4 s, −16 LUFS) + `TOR25_phone.mp4`. Title card shortened to "THE CHAPMAN WEDGE" (the full cut-sheet
title wrapped badly at the TitleCard's fixed 100 px). Cutcheck: see the final report line; allowed windows = designed transitions ±0.3 s
plus 75.4-75.8 (a 2-frame focus glitch inside ALLY's own footage, raw 3).

## Edit
Six raws at the cut sheet's six cue positions and order, trimmed to the moment (dead air out): MAYNARD 117-128 ("Touchdown."),
212-224.3 ("That's a huge wedge"), ALLY 255-271.6 ("Like, seriously, what is going on?"), 313-325.5 ("Car. Car. Get down the road,
guys."), 444-457.8 ("getting really close, really quick" — ends before the crew swears at 459), MAYNARD 522-535 (I-70, debris at the
base). Under the VO: footage on every line (the funnel forming, the wedge, I-70 trucks, the brown haze after the crossing, open country
for the outcome). VO one take, split only for the raws. Music 1 under VO sections only (−16 dB), out under every raw.
Each source's windows are concatenated into one file (`assets/cat.py`) and graded with ONE LUT; code maps source seconds → file.
Raw sound: `media/may_clean.wav`, `ally_clean.wav` (rawclean.py; music detected only at may 71-73 s = MAY 145.3-146.6/211.8-212.5).
No injured people / bodies / nudity in the raws: no blur needed.

## Devices (new)
- `dev/TOR25_RibbonPath.tsx`: the 25-mile track as a ribbon on flat NAIP (~16 m/px), width to scale (900 yd ≈ 52 px at the widest)
  and following the survey's segment ratings (thin where it weakened near Abilene, widest at the EF4 farmstead SW of Chapman); the
  camera rides the head, pulls out to the whole strip, drops onto Chapman and the farmstead (red square). Track traced from the NWS
  Topeka track map, georeferenced on Solomon/Abilene/Chapman/Enterprise; widths are representative of the ratings, not measured.
- `dev/TOR25_PrintBrackets.tsx`: the NWS EF4 damage photo as a tilted print that settles flat; corner brackets close on the brick that
  was not swept away (the reason the rating held), then the camera travels to the rubble (the rescued woman's line).

## Sources
- MAYNARD https://youtu.be/Zz635RHnCEc, ALLY https://youtu.be/FJvFlhqD_3A (windows in the code header).
- NWS Topeka event page https://www.weather.gov/top/LongTrackTornadoHitsNorthCentralKS (track map, "EF4 Tornado Damage SW of
  Chapman" photo). Wikipedia "2016 Abilene–Chapman tornado" for the segment ratings. USGS NAIP exportImage (bbox in code).
- Downloads: none. YouTube search for small-channel aftermath clips hit a bot check (not bypassed); the Brandon Clement railroad photo
  on the NWS page carries a licensing-company credit: not used.

## For the owner
- The cut sheet / VO says "the wind turbines in its path look like fence posts" (ALLY 4:10). In the footage those are utility/light
  poles in the foreground, not turbines; I showed the wide frame (slowed 0.54x, the clean 241.2-243.5 s) with no graphic asserting
  their size. Consider re-voicing the line ("the power poles in front of it look like fence posts").
- ALLY 238.5-241.1 has a truck crossing and a zoom, MAYNARD 302.1 a car crossing the lens: windows split around them.

## 3 Nov raw audit (supersedes the edit above where they differ)
- Raws 6 -> 4: R1 11 s (27.36-38.36), R2 12.3 s (41.4-53.7), R3 16.6 s (main, 63.5-80.1), R6 13 s (108.5-121.5). Removed R4
  (after "long-track violent tornado", near-duplicate ALLY wedge) and R5 (after the ribbon explanation). VO pauses ~0.45 s at the
  old split points. Duration 190.4 -> 163.4 s. No n2page / Inset in this case.
