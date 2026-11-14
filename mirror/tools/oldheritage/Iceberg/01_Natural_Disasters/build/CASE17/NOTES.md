# ND17 — The Erft tears through the old town, Bad Münstereifel (case 17)

Code: `_engine/src/cases/ND17.tsx` · devices `_engine/src/dev/ND17_*.tsx` (+ generated data `ND17_data.ts`) · output `out/ND17.mp4`, `out/ND17_phone.mp4` (≈255 s)

## Structure
TitleCard (own footage) → VO with all ten raws at the cut sheet's ▶ RAW cue positions and order, dead air trimmed (layout helper
`dev/ND16_Timeline.ts`). VO = the continuous CASE17 take, split only at the cues. Raw sound = `media/*_clean.wav` from
`_tools/rawclean.py` (no music detected in any window; original river roar kept). Clip sound only inside raws.
- cue 1 BAD 0:26–0:35 the Erft between the houses · cue 2 BAD 2:03–2:13 torrent at the red house corner · cue 3 BAD 2:30.5–2:39.5 streets
- cue 4 BAD 4:30–4:39.5 water rising, a bin carried off · cue 5 BAD 5:30–5:39 debris rushing down
- cue 6 CLIMAX BAD 7:50.3–8:11.6 uncut: the white van carried off (the cue says 6:26–6:56; the van at 7:50 is the strongest "cars carried off"
  moment, still inside the cue's 6:26–8:05 range) → 0.5× reframed replay (from the graded clip) under "The part of this flood that's hardest to accept…"
- cue 7 BAD 7:32–7:41 the red car pushed by the torrent · cue 8 BAD 8:25–8:34 the torrent still running (8:30–9:00 runs into title cards at 8:48)
- cue 9 PH 0:01–0:09 the neighbour's phone · cue 10 BAD 10:47–10:55 the wrecked shop (16 July)
No injured people / bodies / nudity in any raw: no blur needed (the van's plate is already pixelated in the source).

## Devices (new, this case only)
- WallRiver: NRW DOP orthophoto (top-down, slowly turning): the OSM medieval city wall drawn round the old town, then the Erft drawn
  red straight through it. Labels: BAD MÜNSTEREIFEL, THE ERFT.
- Inset (brand): the Erft at the Markt bridge on 26 June 2021, three weeks before the flood ("you'd hardly notice it"), then BAD's
  footage of the same channel with the JULY 14, 2021 label.
- RidgeLines: 33 real terrain sections across the Erft valley (AWS/Mapzen terrarium DEM), rain running down every slope to the same
  narrow floor, floor lit red, the town's section marked.
- FrameTrace: the same June 2021 photo shows the bookshop's own house (Buchhandlung am Markt, Josef Mütter); its timber frame (a pixel
  mask cut from the photo) sweeps white on "wooden frame", the infill panels tint red on "clay, brick or plaster".
- ReliefMap: shaded relief from the DEM; (1) Landkreis Ahrweiler outlined and filled red across the state border; (2) the Rhine traced
  thick white, then the Ahr and the Erft in red ("small rivers in narrow valleys").

## Sources
- Footage: [BAD] https://youtu.be/D9LA0PSaARc (Josef Mütter; small yellow time stamps kept per cut sheet; title, "Der Tag danach",
  "Unser Laden" and thank-you cards avoided) · [PH] https://youtu.be/7mZDH_P_1q4 (filmer not identified).
- Photo: "Erft, Markt, Bad Münstereifel-1813.jpg", Wikimedia Commons, CC BY-SA 4.0, taken 26 June 2021 (credit the author in the description).
- NRW DOP: https://www.wms.nrw.de/geobasis/wms_nw_dop (layer nw_dop_rgb), Geobasis NRW, dl-de/zero-2-0.
- OSM (© OpenStreetMap contributors, ODbL) via Overpass: historic=citywalls, waterway Erft/Ahr/Rhein, admin_level 6 Kreis Euskirchen /
  Landkreis Ahrweiler — used only as traced geometry.
- DEM: AWS Terrain Tiles (terrarium, z11) — rendered to relief.jpg and the ridge sections.
- All stills graded `grade_case.py --house --nonorm`; footage `--house` (BAD transcoded 60→30 fps first).

## Known limits / decisions
- No footage of Merkel's visit (20 July) exists in the clips; that line runs over BAD's own aftermath street with the JULY 20, 2021 label
  (date only, no claim she is in frame). A news clip would break the no-news-footage rule.
- "ES-Alert / phones" and "EFAS alerts" lines are covered with the town's own footage (no fake phone UI, per channel rules).
- The state border is shown as the Ahrweiler district outline (its north-west edge is the NRW/RLP border here); not labelled separately.
- Music: Epidemic ambient Music 1 at −14 dB (file −18 LUFS), different bed from ND16 (Music 4), out under every raw.
