# TP03 — the Zipper jams, St. John the Beloved carnival, Wilmington, Delaware (6 Jun 2023)
Code: `_engine/src/cases/TP03.tsx` · out: `out/TP03.mp4` (224.5 s, −16 LUFS), `TP03_phone.mp4`.

## Edit
TitleCard → NAIP aerial of the parish grounds (boxed + label) → date on the scene → Zipper / cages → 7 raws in the cut sheet's places and order
(ZM 18:28, 19:00, ZX 0:03, ZM 22:00, 27:00, 24:09, 28:30), each trimmed to 10–12 s of the strongest part, between the source's own cuts.
Music 5 at −13 dB, two passes, out under raws.

## Devices (new, `_engine/src/dev/`)
- TP03_ZipperBoard: what a Zipper is, on Commons photos of other Zippers: a white line on the boom swings end over end about the hub, then the
  camera pans down to a standing Zipper where each cage's pivot ticks round.
- TP03_InspectionCalendar: real May/June 2023 month grids on a lit sheet; 24 May and 2 June boxed as spoken, 6 June filled red, the 2→6 gap
  bracketed ("4 DAYS").
- TP03_NightClock: clock face over the darkened rescue; hand sweeps 9:30 PM → about 12:30 AM ("within about three hours").
- Brand Aerial (NAIP) + Inset (the two cages; another Zipper labelled "A ZIPPER AT ANOTHER FAIR").

## Sources
- zm = https://www.youtube.com/watch?v=sONvBtlm818 (fmartinjr, 33-min scene video). Its "fmartinjr" watermark is fixed at x520–780, y880–1035 →
  delogo before the grade. Only the 33 windows used were cut (`media/tp03_zmsel.mp4`, map in the code and `media/tp03_zmsel_map.json`).
- zx = https://www.youtube.com/watch?v=TXQw3UOb9ws (looking up into the jammed frame).
- NAIP aerial: USGS NAIP ImageServer, centred on 39.73557, −75.65763 (Nominatim: Saint John the Beloved Parish, 907 Milltown Road).
- Commons: "Zipper at Night - panoramio.jpg" (CC BY 3.0), "Chance Rides Zipper - panoramio.jpg" (CC BY 3.0).

## Decisions / issues
- Raw audio = rawclean'd `media/tp03_zm_clean.wav` and `media/tp03_zx_clean.wav` (never the clips' own tracks).
- Cut sheet raws were 30 s each (210 s): trimmed to 10–12 s each; the scene sound is mostly generators, radio and voices.
- "Three aerial ladders" is shown with the scene's ladder trucks (footage), not a count device: the trucks' identities could not be verified.
- Nothing needed blurring (riders are rescued, no injuries on screen). No downloads for this case.

## Update 3 Nov 2026 (TP audit: raws only at incident moments, no reused devices)
- Raws 7 -> 3: kept RAW 1 (11.8 s, ZM 18:28), RAW 3 (12.0 s, ZX), RAW 7 (10.2 s, ZM 28:30). Removed RAW 2, 4, 5, 6 with lib/core/cutOut
  (windows 63.9-74.0, 107.4-118.0, 148.8-158.6, 174.4-186.0; each shot before extended 0.4 s so the VO joins keep a ~0.5 s breath). 224.5 -> 182.4 s.
- NightClock -> BoomHours (new, dev/TP03_BoomHours.tsx): freeze of the jammed boom (graded/tp03_boomfreeze.jpg = zm 1448.0), time rule up the boom
  9:30 PM -> 12:30 AM, red fill, 3 HOURS bracket, credit Robert Fox. Second Inset (138.5, another Zipper) -> full-frame slow push + RedLabel; Inset only at 44.0.
- Rule 4: InspectionCalendar is a designed month-grid device (sharp type), no scanned page in the case. 118.0 blurDip dropped (it fell on a cut join).
- Render 3 Nov: first pass cutcheck flagged 4 one-frame STUBs (raw starts at 1100.5 / 1737.2 and shots at 1487.6 / 1871.9 touching neighbouring
  selection windows); sources nudged one frame inward, re-rendered: 0 flags, 182.5 s.
