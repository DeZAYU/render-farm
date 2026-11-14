# WP17 · Twenty One Tons of Acid · CITGO Corpus Christi, Texas (19 Jul 2009)
Code: _engine/src/cases/WP17.tsx · out: build/CASE17/out/WP17.mp4 (+ _phone)

## Edit
Title 0-4 | VO part 1 (take 0-25.45) | RAW 29.45-41.45 (CSB camera A src 73.2-85.2: the vapour cloud filling the unit -> ignition at
src 75.83 -> the unit burning) | VO part 2 (take 25.55-67.8) | doorway beat: "Look at the doorway." then ~4.7 s with the VO paused while the
fireball fills the doorway on camera B (DoorWatch) | VO part 3 (take 67.85-end @88.6) | ends 114.4 (VO 92.9 + 21.5).
One main raw (VO > 70 s, WP_PLAN); the doorway beat is the cut sheet's own "Look at the doorway" moment, kept short and silent-CCTV + SFX.
Silent CCTV -> real SFX: wind_gust_1 (venting roar) -> boom_5 + sub_drop_2 at ignition -> fire_big_cc0; boom_4 (distant) at the doorway.
Music: Epidemic Music 5 at -13 dB from 60 s, out under the raw and the doorway beat.

## Devices
- JetTrace (dev/WP17_JetTrace.tsx): camera A at 0.6x as the connection breaks; frame dims except a pool of light following the white jet
  down from the pipe rack, a white line drawn along its path, RedLabel HYDROFLUORIC ACID · HF.
- DoorWatch (dev/WP17_DoorWatch.tsx): camera B frozen, the hall sinks into shadow, white brackets close on the doorway; the picture runs
  on, the fireball fills the doorway, the shadow lifts and the frame eases in.
- Blender water (maps/water.mp4, water.json, site3d.py + routes block): NAIP + OSM Corpus Christi refinery row, the refinery block
  red-washed, a pale-blue line drawn from the ship channel into the plant (the salt-water feed), labels CITGO REFINERY / SHIP CHANNEL.
- Blender drift (maps/drift.mp4, drift.json, site3d.py + plume block): layered translucent haze drifting from the plant north over the
  ship channel onto Nueces Bay, label NUECES BAY (pinned).
- Replay: the ignition again at 0.5x, pushed, under "The fire kept burning for several days".

## Sources
- CSB surveillance cameras A and B, repost https://www.youtube.com/watch?v=BuuxgBEHI7c (Risk Prom; CSB-released, public domain,
  credited on screen); CSB logo delogo'd; the "Surveillance Camera A/B" title cards never used. No clip audio used -> rawclean not needed.
- Map: USGS NAIP (public domain), AWS Terrarium DEM, OSM buildings (ODbL). The exact alkylation-unit location is not public; the red block
  marks the refinery's process area next to Hillcrest, not the unit. The drift direction to Nueces Bay is the VO's "nearby bay" (the bay
  north of the plant); the plume's shape/size is illustrative.
- Fire SFX fire_big_cc0.wav (CC0, from CASE09/media/sfx).

## Check (4 Nov, second builder)
Master 114.5 s (budget VO 92.9 + 19 = 111.9; +2.6 s is the designed silent doorway beat). Cutcheck: 29 JUMP, 0 FLASH/ODD/STUB; every
JUMP is inside CSB camera footage at the camera's own ~2 fps frame updates during the fire (the graded source ca.mp4/cb.mp4 flags the
same steps on its own) -> footage, not edit faults. Contact sheet: reads clean, no repeated layout. No changes made.
