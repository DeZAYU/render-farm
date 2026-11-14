# ND18 — The wave around Koh Ngai (Trang, Thailand, 26 Dec 2004)
Code: `_engine/src/cases/ND18.tsx`. Output: `out/ND18.mp4` (+ `_phone`). ~106.6 s.

## Edit
Title card (own frame) → VO-A over Julian's calm beach (date label) → RuptureDive → group on the beach → RAW 1 (0:00–0:05.5,
Julian: "reporting from a paradise island, not far from Sumatra") → WaveWrap → RAW 2 (0:31–0:55.6, the surge: chairs, the open sea;
24.6 s uncut) → Drawdown (Mai Khao) → Mai Khao aerial → "There's a boat..." on the same shot that runs into RAW 3 (boat in the surge,
to 1:19.9) → the group walking off (0.5x) → OceanReach → 0.5x replay of the surge round the tree → calm end frame 0.5x.
Raws sit at the cut sheet's three ▶ RAW cues, in order; trimmed only of dead air (raw 1 cue was 28 s of chat, kept the 5.5 s line).
Raw audio = `media/kng_clean.wav` (rawclean.py: no music detected). Nothing needed blurring (no injuries/bodies/nudity).

## Devices (new, this case only; see REGISTRY)
- RuptureDive: NASA Blue Marble bathymetry (GIBS) → EOX Sentinel-2 cloudless 2016 mid layer → Sentinel-2 z14; epicentre 3.32N 95.85E,
  rupture polyline along the Sunda trench to ~13.6N (approximate trace), bracket "1,300 KM" (commonly cited rupture length).
- WaveWrap: crests = isochrones of a shortest-water-path field from the west edge with land as obstacle (uniform speed; schematic,
  shows the geometry of the wave wrapping to the sheltered east beach). Script: fields18.py / kngT2.py (scratch, data in assets/).
- Drawdown: white-line section of the drawdown before a tsunami (what Tilly Smith recognised); no numbers.
- OceanReach: travel time from NOAA ETOPO1 (ERDDAP etopo180, 0.1°) with speed sqrt(g·depth), Dijkstra from the rupture. Check values:
  Phuket ~1.7 h, Sri Lanka ~2.8 h, Somalia ~7.6 h (published: ~2 h / ~2 h / ~7 h). Hours run faster than real time; no clock shown.
- Brand Aerial on Sentinel-2 for Mai Khao beach.

## Sources
Footage: https://youtu.be/ZngzR7Qd2O0 (Julian Hadden, own upload). No extra angles exist (research pass + my search: only reposts /
"2004 Indian Ocean Tsunami Archives" repost channel — not used under the downloads policy).
Imagery: NASA GIBS BlueMarble_ShadedRelief_Bathymetry (public domain); EOX Sentinel-2 cloudless 2016 (CC BY 4.0 — credit
"Sentinel-2 cloudless - https://s2maps.eu by EOX IT Services GmbH (Contains modified Copernicus Sentinel data 2016)" in the description);
NOAA ETOPO1 (public domain).

## Decisions / issues
- The house grade's normalisation crushed this sunny, back-lit clip to silhouettes; graded with `--house --nonorm` (look only).
- Phuket schoolgirl lines have no footage anywhere usable (no personal-channel Mai Khao clip), so device + aerial.
- Cutcheck: 0 flags outside the allowed windows. Allowed = designed transitions + in-camera whip pans inside raw 2 (45.2–54.4,
  61.2–65.9) and raw 3 (78.6–81.8): the filmer swinging the camera while grabbing chairs; no edit cuts there.
- VO keeps "Germany had days of warning." (the script's link from case 17); there is no count word in this take.
