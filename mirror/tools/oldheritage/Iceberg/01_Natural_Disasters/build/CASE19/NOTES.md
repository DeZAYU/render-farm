# ND19 — The third floor in Kitahama (Shiogama, Miyagi, 11 Mar 2011) — last case
Code: `_engine/src/cases/ND19.tsx`. Output: `out/ND19.mp4` (+ `_phone`). ~90.6 s.

## Edit
Title card → date label / place label on TSUNE's phone footage → ThirdFloor → RAW 1 (0:13.4–0:25.6, water racing past the yellow
building) → IslandShield → RAW 2 (0:39.5–0:49.5, water running between the houses) → cars below him → wide from the third floor →
RAW 3 (the phone turns landscape: cars and debris carried, 1:18.6–1:30.8) → 0.5x replay of the rush → TollSquares → calm water
afterwards → Ōfunato (case 1's own footage, labelled) → Matsushima islands aerial → ease to black.
Raws at the cut sheet's three cues, in order; trimmed of dead air only. Raw audio = `media/shg_v_clean.wav` / `shg_h_clean.wav`
(rawclean.py: no music detected). No injured people/bodies on screen; nothing blurred.
Source file is a vertical phone clip pillarboxed in 640x480 until 77.5 s → cropped to 360x480 (`shgv`), shown centred over its
blurred copy (Shot_FX fill) or in ThirdFloor's white frame; the landscape tail is `shgh`.

## Devices (new; see REGISTRY)
- ThirdFloor: plain elevation, his window red, sightline, water rising; his clip framed beside it. No text but the place label.
- IslandShield: EOX Sentinel-2 2016 of Matsushima Bay (mosaic seam evened, open sea smoothed outside a coastal band); islands are the
  256 closed OSM coastline rings in view (Overpass, © OpenStreetMap contributors, ODbL) — matches "more than two hundred"; a surge
  band from the SE is dimmed by exp(−island area upstream), i.e. schematic shadowing. Script: bay19osm.py (scratch).
- TollSquares: square AREA ∝ dead + missing, no numbers on screen. Figures used (approximate, from memory of FDMA / Miyagi
  Prefecture totals; owner may want to verify): Ishinomaki 3,971; Higashimatsushima 1,133; Natori 954; Sendai 930; Tagajō 219;
  Iwanuma 186; Shichigahama 79; Shiogama 42 (the VO's figure, incl. related deaths). The visual point (Shiogama tiny) holds for any
  reasonable source.

## Sources
Footage: https://youtu.be/3--BgieXAuI (TSUNE, own upload). Ōfunato: case 1 footage https://youtu.be/jbvBsgoEAe0 (13:50–13:55 window).
No extra angles (research pass found none; the police-station clips are on an archive channel).
Imagery: EOX Sentinel-2 cloudless 2016 (CC BY 4.0, credit in description); OSM coastline (ODbL, credit in description).

## Cutcheck
0 flags outside the designed transition windows (see render log).

## Render (2 Nov)
- Cutcheck: 0 flags.
