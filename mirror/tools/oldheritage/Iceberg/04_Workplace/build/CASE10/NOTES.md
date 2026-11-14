# WP10 · The White Cloud · Silver Eagle refinery, Woods Cross, Utah (4 Nov 2009)
Code: _engine/src/cases/WP10.tsx · out: build/CASE10/out/WP10.mp4 (+ _phone)

## Edit
Title 0-4 | VO part 1 (take 0-28.4) | RAW 32.4-46.2 (CSB CAM 006 src 19.2-33.0: last quiet seconds -> fireball at src 24.39 -> blast
shakes the camera -> fire) | VO part 2 (take 28.6-end) | ends 87.2 (VO 68.5 + 18.7). One raw only (WP_PLAN budget).
Silent CCTV -> real SFX: wind_gust_1 (low, gas venting) -> boom_4 + impact_2 + sub_drop_1 at the flash -> fire_big_cc0 bed.
Music: Epidemic Music 5 at -13 dB from 18 s, out under the raw.

## Devices
- BlastHold (dev/WP10_BlastHold.tsx): half-speed replay, holds at the fireball's peak with closing white brackets.
- WallShave (dev/WP10_WallShave.tsx): frozen fire frame, the CSB finding typed sharp, a to-scale slice of the wall 0.719 in -> 0.039 in.
- Blender place (maps/place.mp4): NAIP + OSM buildings, the refinery strip red-washed between the rail lines, homes right across the tracks.
- Blender blast wave (maps/blast.mp4): rings expanding from the unit, house outlines lighting red as the front passes (site3d.py + blast block).

## Sources
- CSB surveillance video https://www.youtube.com/watch?v=yDmuaR6rkgU (U.S. federal work, public domain; never the CSB animation; cropped
  to 640x360 at y=26 to drop letterbox and "CSB / CAM 006" burn-in).
- Neighbour's video of the 12 Jan 2009 fire https://www.youtube.com/watch?v=C0ZR-NfCw7U (fwcprodutions, 49 subs; downloaded to
  footage/15_*/more/), used silent under the January line.
- CSB photo inside the refinery (Jan 2009): https://www.csb.gov/assets/1/17/SilverEagleCSBInvestigators-cleared1.JPG
- Facts (0.719 -> 0.039 in, 100+ homes, one off its foundation): CSB release 10 Apr 2014
  https://www.csb.gov/-csb-releases-analysis-showing-cause-of-rupture-and-hydrogen-blast-in-2009-silver-eagle-refinery-accident-in-woods-cross-utah-pipe-walls-thinned-due-to-corrosion-that-went-uninspected-for-years-/
- Map: USGS NAIP, AWS Terrarium DEM, OSM buildings/rail (ODbL). Fire SFX fire_big_cc0.wav copied from CASE09/media/sfx (CC0).
- No clip audio is used (all sources silent or used silent), so rawclean.py was not needed.

## Open
- The CSB names the unit the "Mobil distillate dewaxing unit" (a hydrotreating unit); the VO says hydrotreater. No label names it.
- Which homes were damaged is not mapped; the Blender wave outlines houses generically, no count shown.

## Render (4 Nov)
out/WP10.mp4 87.3 s, -17.4 LUFS integrated after loudnorm. Cutcheck: 3 JUMPs at 47.20/47.47/47.93 s = the CCTV's own fireball frames
inside the BlastHold replay (low-fps camera, each new frame a big step; same frames as the raw's flash at 37.6 s). Allow 47.0-48.1 -> 0 flags.
Blender: place.mp4 (172 f) + blast.mp4 (201 f) via _tools/blender_run.sh.
