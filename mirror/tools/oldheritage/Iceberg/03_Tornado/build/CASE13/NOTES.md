# TOR13 · Twin tornadoes over the valley · Pilger, Nebraska (16 Jun 2014)

Code: `_engine/src/cases/TOR13.tsx` (timeline via `dev/TOR12_layout.ts`) · devices `dev/TOR13_*.tsx` · out `build/CASE13/out/TOR13.mp4` (+ `_phone`).

## Structure
TitleCard → VO → 8 raws exactly at the cut sheet's ▶ RAW cue positions, in order, each trimmed to the moment (10–20 s):
1 touchdown (Lucio 0:46) · 2 "look at its direction ... it did turn north ... let's go" (2:13) · 3 "Twins!" (13:46) · 4 twins still side by side (21:06)
· 5 twins, "I know which one to film" (13:01) · 6 both nearing the village (14:33) · 7 twin wedges moving on (14:11) · 8 a tornado later in the chase (17:46).
Raw sound = `media/rN_clean.wav` from `_tools/rawclean.py` (no music detected in any window; original kept). No injured people / bodies on screen.
VO: one take (this take has no count word), split only at the raws at measured silences (22.87 / 28.59 / 32.73 / 40.77 / 54.83 / 70.85 / 77.38 / 88.05).
Music: Music 1 (−15.2 dB ≈ the channel bed level; measured −18.3 LUFS), out under every raw.

## Devices (new for this case)
- **StormFamily** – the supercell from the real radar archive (IEM NEXRAD n0r composites, 5-min frames 19:30–22:45 UTC, reprojected onto a
  graded USGS NAIP mosaic); the six tornado tracks of the family (SPC database: two EF0 + four EF4, EF4s red) appear at their touchdown
  minute with a running CDT clock. Second use on "costliest of the four EF4s": radar off, Pilger track pulses.
- **DepthStill** – NOAA photo of the twins (Ethan Schisler, public domain) cut into depth bands with 2.5-D parallax.
- **StatementRule** – the real NWS Omaha statement (4:23 PM, "2 CONFIRMED TORNADOES ... NORTHEAST OF PILGER"), IEM archive capture, lines ruled in red.
  (Chosen instead of ChipLift because TOR15 uses ChipLift.)
- **SwathEdge** – the path through the village traced on the NWS aerial taken afterwards; interior washed red.
Plus channel grammar: Aerial (IEM plot of the SPC day-1 outlook issued 05:29 UTC = "slight"; the NWS aerial with the spilled grain where
the silos stood; NAIP of Pilger today, village box + label; NAIP silos today), Inset (SPC watch 303 graphic), RedLabel.

## Sources
- Footage: Adam Lucio https://youtu.be/V19DmeniSdE (personal chaser channel; "Adam Lucio" mark delogo'd, and every window is cropped to the
  top-left 1653x930 so the delogo patch never shows). Brent Koops https://youtu.be/R8ltFt51_xc was NOT used: "Not For Broadcast" text and a
  centre "© 2014 Brent Koops" watermark (can't be framed out); its 3 cue positions are filled with Lucio's own twins footage.
- Radar: IEM https://mesonet.agron.iastate.edu/archive/data/2014/06/16/GIS/uscomp/ (n0r). SPC outlook: IEM autoplot 220 (day 1, 05:29 UTC).
  SPC watch 303: https://www.spc.noaa.gov/products/watch/2014/ww0303_radar.gif. NWS statement: https://mesonet.agron.iastate.edu/p.php?pid=201406162123-KOAX-WWUS53-SVSOAX
- Wikimedia Commons (public domain): Pilger, NE twin EF4 tornadoes (NOAA/Ethan Schisler); PilgerEF4Aerial.PNG; PilgerEF4damage2014.jpg (NWS Omaha);
  Extreme EF4 damage done to a home (NWS); 2ndPilger EF4 damage (NWS); Pilger, Nebraska from NE 1/2 (Ammodramus, PD).
- SPC tornado database (tracks), USGS NAIP Plus (region + village).

## Notes for the owner
- "That morning SPC called it a slight risk": the 05:29 UTC (00:29 CDT) day-1 outlook is shown; by 12:57 UTC SPC had raised it to moderate.
- The church line shows the village skyline photographed after the storm (bare silo frames); no photo of the church itself was found.
- "Middle school torn down" shows NWS damage in Pilger (not the school); "federal disaster area" shows chase footage.
- Which of Lucio's tornadoes is which is not stated by the uploader; the shots are matched to the words by what is on screen, no labels claim identity except "NEAR STANTON" on the first tornado.

## 3 Nov raw audit (owner: raws only at incident moments)
- Raws 8 -> 3: RAW 1 27.72-39.72 (12.0 s, touchdown), MAIN RAW 3 50.43-66.93 (16.5 s, "Twins!"), RAW 6 105.9-116.4 (10.5 s, both
  near the town). Removed RAW 2, 4, 5, 7, 8 (stat lines before them / near-dup twins); VO parts merged. Duration ~190.3 s.
- Note: Lucio's single chase clip is nearly the only footage, so the stretch 59.7-125 runs several Lucio shots around RAW 6 (different
  moments, blur-dips between); no other source exists for it.
