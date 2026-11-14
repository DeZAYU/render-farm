# TOR09 — The 1999 F5 · Southwest Oklahoma City (3 May 1999, tornado A9)

Out: `out/TOR09.mp4` (203 s, −16 LUFS), `out/TOR09_phone.mp4`. Code: `_engine/src/cases/TOR09.tsx`.
Cutcheck: see the render log result in the report (allowed windows = every designed glitch/blur-dip/whip/zoomHit ±0.3 s, the carousel
slide change at 80.8 s, and raws R5/R6/R7 whole: the source's last 90 s is a violent hand-held drive with wipers, debris hits and power
flashes, which cutcheck reads as STUB/FLASH; that chaos IS the moment).

## Edit
"Ninth is" dropped: the case opens on "the tornado Moore had already lived through". VO split only at the 7 raws.
The source tape is **silent** (uploader muted it; his version with sound is not used, per cut sheet), so the 7 raws are cut to 8–10 s each
(not the sheet's ~30 s — 210 s of silent tape would be dead air) and carry real rain / wind recordings, plus small debris hits on the
windshield pass. Music: Epidemic ambient Music 5 at −13 dB throughout (no clip sound to duck for).

## Devices (new for this case)
- **FujitaGauge** (`dev/TOR09_FujitaGauge.tsx`): the original F0–F5 bands (mph as printed on the NWS Norman 1999 map legend) over the
  footage; needle to DOW 301 mph, then 321 mph, past the F5 cap; then the empty dashed F6 band (319–379) "nothing rated F6".
- **SlideProjector** (`dev/TOR09_SlideProjector.tsx`): the NWS Norman forecaster's own 1999 NWA talk on overpasses (real slides 5, 7, 8)
  projected in a dark room, carousel change, push into the three marked overpasses / the bridge underside / the Shields Blvd span.
  The slide-5 caption with a flaggable word was blurred.
- **MileMeasure + PathTowns** (`dev/TOR09_PathMap.tsx`): NWS KML damage outline of A9 on USGS NAIP; the widest part measured
  between two section roads (1 mile apart; NWS max width 1760 yd); later the 38-mile outline revealed town by town.
- PageLight_N2P on the NWS tornado table row (1726–1848, 38 mi; then 36 dead, 583 hurt).
- Stills: NWS Norman damage photos (ground + aerial), DOW photos (Commons, public domain), FEMA 8068 Moore shelter May 2003 (PD).

## Sources
- Footage: https://youtu.be/VmWLoy62EMo
- https://www.weather.gov/oun/events-19990503 (table, KML, damage photos, A9 photo by NWS forecaster Erin Maxwell — credit line cropped off)
- https://www.weather.gov/oun/safety-overpass (slides)
- Commons: File:Doppler_on_Wheels_1_(DOW_1)_During_Project_VORTEX_1995.jpg, File:Tornado_with_DOW.jpg,
  File:FEMA_-_8068_-_Photograph_by_Bob_McMillan_taken_on_05-17-2003_in_Oklahoma.jpg (all public domain)
- NAIP: USGS NAIP ImageServer.

## Could not solve / owner should know
- FEMA 342 report PDF (federal building assessment) is behind a bot check → slab/damage photos instead of the report page.
- No Texas Tech / overturned-slab photo with visible anchor bolts in a free source; NWS slab photos are used.
- No other clips downloaded: YouTube's bot check blocked yt-dlp (not bypassed).

## 3 Nov raw audit (owner: raws only at incident moments, no near-dups; no template page devices)
- 7 -> 3 raws. Kept RAW 1 (11.55-20.55, 9.0 s), RAW 3 (47.05-55.05, 8.0 s, after the overpass line) and RAW 5 as the MAIN raw
  96.75-121.75 (25.0 s, tape 309-334: the road, the tornado crossing, then the debris across the windshield; no source cut inside,
  real rain/wind/impact recordings re-timed with lengths so they end at the raw). Removed RAW 2, 4, 6, 7. Duration 183.0 s (was 203).
- PageLight_N2P replaced by PenTable (`dev/TOR09_PenTable.tsx`): the NWS table re-typeset sharp as a printed sheet, a red pen loops
  A9's 1726-1848, writes "85 MIN", double-underlines 38 mi; source credited small. Used once. The toll line (36 / 583) is now
  silent tape (src 379.5) with a RedLabel "36 LIVES LOST, 583 HURT" instead of a second table run.
- Code backup: `_engine/_bak_rawaudit/TOR09.tsx`.
