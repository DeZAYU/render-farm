# ND15 — Hurricane Laura's eyewall from a Lake Charles parking garage (cut sheet CASE 15)

Code: `_engine/src/cases/ND15.tsx` · out: `build/CASE15/out/ND15.mp4` (+ `_phone`) · ≈ 5:20 · VO `vor/CASE15.mp3` (opens on "Unsurvivable.", no count word), split only at the 9 raws.

## Footage (decisions)
- One continuous upload (DYyNWwToZqs, 11:25, the chasers' own wind sound; rawclean: no music detected → `media/laura_clean.wav` = original).
- Raws at the cut sheet's 9 cue positions, trimmed to 15–18 s of action each, every window inside the source's own cuts:
  22.4–40.0 · 101.0–118.0 · 196.5–212.0 (power flashes) · 282.5–300.0 · 314.8–331.5 (pavilion losing pieces) · 404.2–420.0 (roof sheets on the road) · 452–468 · 510–525 · 611.5–626.3.
  The last cue (9:37–10:07, "stairwell") is black in this file (586–608 s), so raw 9 uses the next lit stretch: the bottom of the garage with the sheriff's car (the way out).
- One camera all night → every join of two windows of it has a 10-frame blur-dip (designed), glitches between sections.
- No downloads (YouTube bot check; not bypassed). Stills/data from public sources below.

## Devices (new, `_engine/src/dev/`)
- **RadarLast**: the real KLCH WSR-88D loop (NWS Lake Charles, Commons, PD): landfall frames 12:26/12:33/12:40 at "came ashore at Cameron"; later 12:46 → 12:53 → the radar's own "data are temporarily unavailable" frame.
- **StationTrace**: KLCH ASOS 1-minute record (IEM asos1min): gusts from 9 PM rising to 116 kt = 133 mph at 1:42 AM, line ends at 2:05 AM (sensor destroyed, red ×); second use: station pressure bottoming at 2:20 AM (label says "LOWEST, 2:20 AM"; the 1-min station pressure minimum is 954.6 mb, the VO's 956 is the official sea-level figure, so no number is printed).
- **ForceSquares**: 100 vs 140 mph as square areas (ratio 1.96); the 100 square's area laid twice inside the 140 square.
- **InlandRuler**: USGS NAIP mosaic, mile ruler from the Gulf shore due south of downtown to Lake Charles (31 mi measured).
- Page: NHC Intermediate Advisory 27A (IEM archive) on DeskSheet_N2P, "Unsurvivable storm surge…" and "Calcasieu Lake...15-20 ft" pre-marked in channel red (the lib's marker is yellow).
- Channel grammar: TitleCard, RedLabels, Inset (Capital One Tower before), photo pushes.

## Sources
- Footage: https://youtu.be/DYyNWwToZqs
- Commons: Hurricane Laura 2020-08-26 LCH radar loop of landfall.gif (PD, NWS); Hurricane Laura aftermath in Lake Charles Louisiana.jpg (PD, LA National Guard — Capital One Tower windows out); Louisiana National Guard - Hurricane Laura in Lake Charles LA August 2020.jpg (CC BY 2.0); HurricaneLauraAftermathLA-13.jpg (CC BY 2.0, 2C2K Photography); Hurricane Laura Damage in Cameron Parish - September 19, 2020 - 054.jpg (CC BY 2.0, Louisiana Sea Grant); Capital One Tower.jpg (CC BY-SA 3.0, CTtcg); Hurricane Delta (MODIS 2020-10-10).jpg (PD, NASA); 200828-H-DO456-0001.jpg (PD, CBP — tarping a Lake Charles roof)
- IEM: https://mesonet.agron.iastate.edu/wx/afos/p.php?pil=TCPAT3&e=202008261742 ; ASOS 1-min KLCH 2020-08-27 02–10 UTC (`assets/lch_1min.csv`)
- USGS NAIP exportImage (coast to Lake Charles)
- Music: Epidemic ambient Music 3 (−20 dB ≈ −33.8 LUFS), VO blocks only.

## Known
- The Creole water-line sentence is over a Cameron Parish damage photo (Creole is in Cameron Parish; no free photo of the Creole structure itself), labelled "CAMERON PARISH".
- "Many of the others came in the days after… no power" is over the dark garage footage (no free photo of the outage found).
- The night footage is dark and noisy by nature; the house grade keeps night as night.

## Render (2 Nov, 22:16)
- ForceSquares background moved from laura 240 s to 265 s: the 240 s window crossed a source cut at 248.7 s (cutcheck JUMP). graded/laura.mp4 and CASE12 hail.mp4 remuxed with faststart (no re-encode).
- Rendered with a 240 s delayRender timeout: under the machine load the 1 GB source missed the default 28 s on its first frame.
- Cutcheck: 0 flags (allowed: designed transitions + raw 2 at 41.7-49.7 s, a fast handheld pan with flying signs).
