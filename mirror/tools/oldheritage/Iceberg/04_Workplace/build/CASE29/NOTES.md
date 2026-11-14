# WP29 — The warehouse at Ruihai (Port of Tianjin, China, 12 Aug 2015)
Code: _engine/src/cases/WP29.tsx · out: build/CASE29/out/WP29.mp4 (+ _phone)
## Sources
- TJ main: Galen Crout (223 subs), https://www.youtube.com/watch?v=HfXmG3GdAig, dashcam in a Binhai street (own stamp 2015/08/12 23:33),
  600x360 24 fps -> minterpolate blend 30 fps, 1920x1152 crop 1080, graded --house. Silent upload; used silent.
- MH extra1: MR. H., https://youtu.be/_hHRAbJCyow, a phone at a window, 202x360 portrait (Tall framing over its blurred copy), app logo
  delogo'd. Its own track: rawclean = "no music detected, original kept" -> media/mh_clean.wav is the raw's sound.
## Edit
Title 0-4 · VO part 1 (take 0-13.12) · RAW 17.3-31.3 (MH src 15.5-29.5: the fire on the skyline, the fireballs, the jolt at 24.6 s)
· VO part 2 (take 13.10-end, case = take + 18.2). Music 5 from 10 s at -18 dB, ducked under the raw.
## Devices
RewindWave (dev/WP29_RewindWave.tsx). Blender (CASE28/maps/port.py via maps/site.py, ring.py): site.mp4 (the yard burning at night,
RUIHAI LOGISTICS WAREHOUSE), ring.mp4 (1 km ring + line to the nearest blocks; 1 KILOMETRE / HOMES). Labels -> dev/WP29_blLabels.ts.
Length 107.5 s (VO 88.0 + 19.5).
## Render / check
Allow windows: 3.7-4.3,12.1-12.7,17.0-17.6,18.7-19.4 (MH first fireball),26.0-26.8 (MH jolt),30.95-31.6,39.8-41.8 (TJ second flash,
live + slow replay),68.47-69.07,76.9-77.5,82.4-83.0,102.3-102.9 -> cutcheck 0 flags (15 cuts). blurDips hide the two TJ -> TJ cuts.
## Unresolved
MH is 202x360 portrait (soft, Tall framing used 6 times); TJ is 600x360; the ring's white line to the homes is faint.
