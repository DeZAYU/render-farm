# WP18 · Christmas Eve · Exxon Baton Rouge, Louisiana (24 Dec 1989)
Code: _engine/src/cases/WP18.tsx · out: build/CASE18/out/WP18.mp4 (+ _phone)

## Edit
The level-4 call ("Level four. From here, people don't come home.", take 0-3.05) is NOT in this case (built in WPL4); the VO starts at
take 3.18 ("Christmas"). Title 0-4 | VO part 1 (take 3.18-33.25) | RAW 34.07-49.07 (camcorder in the rail yard: the black column with the
fire flaring up behind the boxcars, src 144.3-159.3, flares at ~146 / 149 / 156.6) | VO part 2 (take 33.3-end, last word ends 106.99) | ends 124.0
(VO after the call 104.2 + 19.8). One raw (VO > 70 s). Silent camcorder -> real SFX: fire_big_cc0 bed, wind_gust_1 low, impact_3 / boom_2 on the flares.
Music: Epidemic Music 3 at -20 dB from 95 s, out under the raw.

## Devices
- FrostCreep (dev/WP18_FrostCreep.tsx): under the 8-degree line, frost grows in from the frame edges over the lake shot, picture cools.
- Blender Capitol + refinery (maps/capitol.mp4, capitol.json): NAIP + OSM Baton Rouge, winter look; Exxon Baton Rouge Refinery footprint
  (OSM way 1175113009) red-washed, glide down toward the State Capitol, Capitol outlined; RedLabels EXXON REFINERY / STATE CAPITOL.
- Blender freezing water line (assets/valve.py -> assets/valve.mp4): gate valve on supports, cut-open run where ice grows in from the wall
  and frost creeps over the steel (generic mechanism for "water in lines and valves can freeze"; not a claim about the exact failed part).
- Replay: the biggest flare from the raw again at 0.5x, pushed, under "Two workers never made it home".

## Sources
- Camcorder footage https://www.youtube.com/watch?v=4eE4v2Xh6jw (ShelleyVideo, small personal uploader, SOURCES.csv OK); VHS edge noise
  cropped; no watermark. Its audio is near-silent tape hiss (max -27 dB), not used -> rawclean not needed.
- Map: USGS NAIP (public domain), AWS Terrarium DEM, OSM buildings + refinery outline (ODbL). The 1989 tank-farm location inside the site is
  not marked (unknown).
- Fire SFX fire_big_cc0.wav (CC0).

## Finish (4 Nov, second builder)
- blender_run.sh appends `--cycles-device CPU` after the script args: site3d.py and valve.py now strip it (it had crashed both renders).
- capitol.json: 200 frames (the shot is 194), start camera lowered/steepened so the map edge is never in frame.
- valve.py: the water core now shrinks with the ice (it had hidden the ice completely), softer water specular, less-black steel and a
  softer frost edge (was a black/white dalmatian pattern), slightly brighter world.
- FrostCreep: branches whose start time was > 1 crashed interpolate (render failed); clamped. Strokes thinned/softened (read as drawn twigs).
- Master 124.0 s (budget 104.2 + 19 = 123.2). Cutcheck: STUB 34.4 s and a STUB run 115.9-116.2 s are the camcorder's own whip pans
  (checked frame by frame, no edit cut); JUMP 49.07 s = the designed blurDip from the raw into the 0.5x replay. Contact sheet reads clean.
