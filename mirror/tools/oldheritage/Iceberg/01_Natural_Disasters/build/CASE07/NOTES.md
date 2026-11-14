# ND07 — Driving out of Paradise (Camp Fire, 8 Nov 2018)

Code: `_engine/src/cases/ND07.tsx` · out: `out/ND07.mp4` (+ `_phone`) · ~6:00 (359 s)

## Structure
TitleCard ("DRIVING OUT OF PARADISE", Grager frame) → 13 VO parts of the one take (split only at raws) → 12 raws, all from the
cut sheet's cues, trimmed to where the sound/picture is the moment:
- Grager car (par, own voices): "There's a structure and it's burning. We are in serious danger." / "This entire town is going up in
  flames. Paradise is on fire." / "we are just down from Neal now … that side looks worse now".
- Dione Burke's brother-in-law (db, the upload is SILENT): 5 raws of 7.5–12 s (fire along the road, houses burning, flames in the trees,
  the fire front behind the power lines, the line of fire + smoke column). Bed under them = Megan Klepps's own cabin sound recorded in
  Paradise the same day (mk 300-360 s, no speech) + a quiet real wind gust; music stays low under these, never under a voice raw.
- Megan Klepps (mk, own sound): fire both sides ten hours in / flames among burned buildings / the fireball (the shot under "Something
  beside the road is about to go up" runs straight into the raw, no cut) / "what was left" (the line is said over the raw's first 1.5 s,
  then its sound comes in).
- Outcome said and shown: dobsonimages drone flight over the burned town (26 Dec 2018), Mykie Mach Vang's drive (Dec 2018: burned
  homes, walkers left on a driveway under "many had trouble moving", a burned-out car), ends on a deer crossing the empty road.

## Devices (new, `_engine/src/dev/`)
- ND07_RoadsOut: NAIP aerial of the ridge in perspective, the 5 roads out (US Census TIGER geometry) drawn from town; 2nd use = jam mode
  on the Skyway (red, car marks queue and stop) under "The Skyway, the main way out, jammed".
- ND07_PlumeRun: NASA Landsat 8 image at 10:45 that morning; origin ringed, white front creeping downwind, embers arcing ahead and
  landing as spot fires in Paradise first ("new fires … before the main fire got there").
- ND07_WireTrace: the power-line raw's last frame held; the wires drawn over in white ("Those power lines … hard to ignore").
- ND07_AlertDots: 52 rings, 7 lit (grand jury: 7,000 of 52,000 alerted), label BUTTE COUNTY GRAND JURY.
- brand Aerial ×2 on NAIP of the Feather River canyon (origin: CAMP CREEK ROAD; then CARIBOU-PALERMO LINE, BUILT 1921) + the full
  Landsat scene pulled back from Paradise to the whole plume under "70,000 acres".

## Sources
- Footage: par https://youtu.be/WaFZOLpg7fI (Romi Dames) · db https://youtu.be/Fo-OYVcKygY (Dione Burke) · mk https://youtu.be/OCCY-oNzXQQ (Megan Klepps)
- Downloaded (small personal channels, ≤1080p, in footage/11_…/more/): https://youtu.be/MqXVlr3Ci6k (dobsonimages, 343 subs, aerial,
  burned-in place captions at a few moments: only clean windows used) · https://youtu.be/UeMFQ8Ryl0Y (Mykie Mach Vang, 331 subs).
- NASA Earth Observatory 144225 "Camp Fire Rages in California" (Landsat 8 OLI, 8 Nov 2018), public domain.
- USGS NAIP (ImageServer exportImage) for Paradise and the Pulga/Feather River canyon; US Census TIGERweb roads (public domain).

## Decisions / caveats
- The box for the origin/tower on the canyon aerial is the Camp Creek Road / Pulga area, not a surveyed tower position (the exact tower
  27/222 coordinates were not available; the DA report PDF is behind a bot check, not bypassed).
- The grand-jury and PG&E plea lines are shown on footage/devices only; no document page could be fetched (403).
- OSM Overpass was unreachable; roads come from TIGER instead.
- yt-dlp later hit YouTube's bot check: no further downloads (cookies never used).
- Master re-rendered 3 Nov 00:05 (out/ND07.mp4, 359 s) after a fix: the 1.3 s music run before the 'what was left' raw made interpolate() throw (runs < 3 s now skipped). Cutcheck: 1 JUMP at 103.8 = hard cut Skyway map -> burned-town footage (different sources, intended); STUBs at 234.3 / 272-277 = Megan Klepps's in-car phone panning past the pillar/mirror, checked on frame sheets: no flash.
