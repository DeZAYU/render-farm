# DC07 — The Plane on Keene Road (unincorporated Clearwater, Florida, 19 Nov 2017)

Code `_engine/src/cases/DC07.tsx`, master `out/DC07.mp4` + `out/DC07_phone.mp4`. Duration 131.6 s (title 4 s, VO 98.9 s, raws 27.8 s).

## Timeline (VO = one take CASE07.mp3, split only at the two raws, both at sentence ends)
| T (s) | what |
| --- | --- |
| 0–4 | TitleCard "THE PLANE ON KEENE ROAD" on cruiser 2's frame (src 53.5) |
| 4–61.01 | VO A (take 0–57.01): cruiser 2 side street + date label, cruiser 2 on Keene Road + road label, Rockwell 112A photo (type label), FlightArc (Zephyrhills → home, descent), cruiser 1 empty sky 0.5x (engine quits), second 112A photo (won't restart), PilotsEye (runway ahead → box on Keene Road), cruiser 1 held at src 11.0 easing to the top of frame |
| 61.01–78.31 | **RAW 1 (main)** c1 src 11.0–28.3 (17.3 s): the plane appears over the traffic (12.25), grows down the road toward the camera, banks and drops out of sight (18.8), traffic stops. Silent source → cruiser engine bed, wind gust as it glides over, distant impact as it goes into the trees |
| 78.31–91.98 | VO B: 0.5x replay tracking the plane (measured track: 0.55,0.30 → 0.70,0.08), freeze on the bank (src 18.5) |
| 91.98–102.48 | **RAW 2** c2 src 41.5–52.0 (10.5 s): cruiser 2 drives up, the wreck in the trees at the left roadside (engine bed) |
| 102.48–131.6 | VO C: cruiser 2 passing, stopped traffic, ReportDesk (NTSB: sump line → debris photo → probable cause, red rule under "could not be determined") |

## Devices (REGISTRY.md)
- FlightArc — EOX s2cloudless 2016 z11 mosaic (Tampa Bay), Zephyrhills Municipal Airport (Nominatim) → Clearwater Air Park.
- PilotsEye — USGS NAIP Plus (public domain) centred 27.9815 N −82.7612 W, turned so the field lies ahead; box on N Keene Rd
  (x of the road from OSM/Nominatim, lat of the 1800-block estimated ≈ 27.985: the exact touchdown point is not published).
- ReportDesk — NTSB ANC18LA010 PDF (pages 3, 4 and 1 rendered at 200 dpi with PyMuPDF): "did not sump the fuel system for
  contaminants", Figure 1 (debris tapped from the fuel inlet strainer), probable cause.
- Brand: TitleCard, RedLabel (NOVEMBER 19, 2017 · CLEARWATER / NORTH KEENE ROAD / ROCKWELL COMMANDER 112A / PILOT MARC BENEDICT /
  ZEPHYRHILLS / CLEARWATER AIR PARK), glitch + blur-dips. No Inset, no Blender.

## Sources
- Dashcam: Pinellas County Sheriff's Office, https://www.youtube.com/watch?v=rG3pJNFW8H0 (official release; title card skipped). Silent.
- NTSB final report ANC18LA010: https://data.ntsb.gov/carol-repgen/api/Aviation/ReportMain/GenerateNewestReport/96356/pdf (public domain).
- Photos (same aircraft TYPE, not N1401J — labelled with the type only): Wikimedia Commons "Rockwell Commander 112A (N1423J, cn 423)
  (4-13-2024).jpg" by ZLEA, CC BY-SA 4.0; "Rockwell Commander 112 N1316J FDK MD1.jpg" by Acroterion, CC BY-SA 4.0 → **credit both in the description**.
- Satellite: EOX Sentinel-2 cloudless 2016, CC BY 4.0 → **credit in the description**. Aerial: USGS NAIP (public domain).
- Music: Epidemic "Music 4" −21.5 dB (file measures −11.9 LUFS → ≈ −33 LUFS bed), only half-ducked under the silent raws.
  SFX: glitch_01/02/03, real/wind_gust_1, impact_3, car_engine_2/4, paper/page.

## Notes / decisions (owner asleep)
- Passenger not named; the pilot's home address in the Sheriff's release is not used anywhere.
- No blame on the pilot: the sump line is shown because the VO says it, then the debris photo and the NTSB's "could not be determined".
- The release has no sound at all, so both raws are picture + real SFX (as the CCTV rule says). RAW 2 is kept because the wreck in
  the trees is the outcome shown plainly; it is ambient only.
- c1 has a cut in the source at 28.43 (release splice): RAW 1 ends at 28.3.
- Image viewing in this session became unavailable after ~22:00 (the Read tool's hook timed out), so DC07's late stills were checked
  numerically (frame coverage/brightness per region) instead of by eye; the plane track for the replay was measured from the frames.
  Worth a look by eye: FlightArc framing (27–38 s), PilotsEye box position on Keene Road (52–55 s), ReportDesk stops (109–131 s).
- Footage: nothing was blocked for this case (no cookie fetch needed); no second small-channel angle of this event exists.

## Checks / v1.1 (14 Nov 08:42)
- ReportDesk page brightness now crossfades with the glide (the 06:07 master had STUB flags at 114.0/124.8). Re-rendered: one faint STUB pair
  remains at 124.77-124.80 (strength 1.0, the last page change); with 124.5-125.1 allowed as a designed page change cutcheck shows 0 flags. -17.7 LUFS.
- Contact sheet of the master viewed: devices, raws, labels and outcome read correctly.
