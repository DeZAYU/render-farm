# WP26 — Amuay refinery, Paraguaná Refining Centre, Punto Fijo, Venezuela (25 Aug 2012, ~1:11 a.m.)
- Footage (small personal uploaders): AM Hector Gutierrez https://www.youtube.com/watch?v=2HpsHLjYVoU (640x480, night horizon burning,
  near-silent track), OD Osman Dugarte https://youtu.be/dVK8i75fQNI (192x144, the afternoon roadside: residents, black columns over the
  tanks). No downloads. No watermarks found. No injuries/bodies on screen (nothing to blur).
- VO: CASE26.mp3 from 0 (no count word), split once at the raw (after "...was still orange.").
- RAW: AM src 12.0-27.0 (15 s): the refinery fire at night, the pan to the flare-up. rawclean: no music; the track is near silent, so
  am_raw.wav = am_clean.wav lifted +20 dB through a limiter, plus a real fire bed (fire_big_cc0.wav, CC0, from CASE09) at -15 dB.
  Replayed 0.5x (AM src 18.6) under "The blast flattened a National Guard post ... set storage tanks on fire".
- Blender (maps/amuay3d.py + prep_osm.py, OSM ODbL via Overpass: refinery outline, 152 storage tanks, residential streets, coastline
  -> site/sea.png flood mask): wide = the refinery on the coast by day (label PARAGUANÁ REFINING CENTRE); cloud = night, a pale vapour
  cloud spreads low over the tank rows from a leak by the NE fence, then a flame front runs through it; close = afternoon, from the
  rooftops east of the fence, three tanks burning under black columns a few hundred metres away (labels AMUAY TANK FARM / HOMES).
  Houses are low blocks set along the real OSM streets (OSM maps very few buildings there).
- Device: GasDrift (dev/WP26_GasDrift.tsx) — the night horizon slowed; a pale haze drifts in low along the ground line on "smelled
  gas", thickens on "formed a cloud", flushes orange and burns off on "exploded".
- SFX under VO: boom_4 at the GasDrift ignition, boom_5 (low) at the Blender flame front. Music: Epidemic Music 4 from 30 s, -22 dB,
  ducked under the raw.
- Length 128.8 s (VO 108.95 + 19.85).
