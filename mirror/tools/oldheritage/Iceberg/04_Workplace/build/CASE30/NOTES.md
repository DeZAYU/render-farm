# WP30 — Córrego do Feijão mine, Brumadinho, Minas Gerais, Brazil (Fri 25 Jan 2019, 12:28) — last case, leads into WP99
- Footage (small personal uploaders, per footage/SOURCES.csv, both OK):
  DF Charles P. https://youtu.be/DPAFiH0Znl0 (1280x720, 33.6 s): a hillside filmer's view of Dam I, the face starting to move, the dust
  and the brown surge over the loading plant. VA Dudinha Rodrigues https://www.youtube.com/watch?v=na2n3E3EqzA (640x360 25 fps, 217 s): a
  repost of Vale's own CCTV over the conveyor; two cameras looped several times (unique material: cam A 101.0-153.7, cam B 153.7-188.0;
  srccuts confirmed). WP99 uses cam A 146-153.5, so WP30 stays below 146. CCTV date/time stamp kept (it is the camera's own). No
  injuries/bodies on screen (nothing to blur). No downloads of extra footage.
- Both clips have SILENT audio tracks (rawclean: "no music detected"; -91 dB). The raw's sound is a real-recording bed media/raw_bed.wav:
  freesound CC0 "Land Slide, Filtered" by CHallSmith (https://freesound.org/people/CHallSmith/sounds/870820/) + "Cathedral Mountain rock
  slide" field recording by betchkal (https://freesound.org/people/betchkal/sounds/500638/, CC0, +14 dB, LP 3.2 kHz) + sfx_n2 wind_gust_1.
  The CHallSmith rumble also sits low (-24/-26 dB) under the Blender flow and the MinuteEarlier wipe.
- VO: CASE30.mp3 from 0 ("Córrego ..."), split once at 25.30 (silence 25.07-25.46, after "began to move.").
- RAW: DF src 10.0-25.0 (15 s) at 29.3-44.3: the face moving, the dust, the surge. The same take runs straight in and out (DF 5.74-10.0 under
  "the dam face began to move", DF 25.0 on under "twelve million cubic metres"), so there is no cut at either edge. Replayed 0.5x (DF 19.5)
  under "And this is what puts it at the very bottom".
- Blender (CASE30/maps): prep.py = EOX Sentinel-2 cloudless 2018 (before, histogram-matched) + 2019 (after) (CC BY 4.0, "Sentinel-2
  cloudless - https://s2maps.eu by EOX IT Services GmbH (Contains modified Copernicus Sentinel data 2018/2019)"), AWS Terrarium DEM, OSM
  "Barragem I" outline (ODbL); the scar mask = 2019 brown where 2018 was green, kept where connected to Dam I, arrival = path distance.
  valley3d.py approach (221 f): flight from the SW over the valley to Dam I (white outline, DAM I). valley3d.py flow (255 f): from the SE,
  the real 2019 scar spreads down the valley from the dam with a warm front (DAM I / OFFICES · CAFETERIA; the label point is approximate,
  ~1 km below the dam on the scar). upstream3d.py (375 f): an upstream tailings dam cut open, starter dyke + four raises built on the
  tailings, then a dark wet front rises through the tailings and the raises sag (UPSTREAM DAM / TAILINGS · MINE WASTE).
- Device: MinuteEarlier (dev/WP30_MinuteEarlier.tsx): CCTV cam A's empty yard (101.3) frozen, the same camera's buried yard (138.6 on)
  washes in from the left along a soft lobed front.
- Labels: CÓRREGO DO FEIJÃO MINE · BRUMADINHO, BRAZIL / JANUARY 25, 2019 / DAM I / VALE · BRAZILIAN MINING COMPANY / OFFICES · CAFETERIA /
  UPSTREAM DAM / TAILINGS · MINE WASTE / TÜV SÜD · THE DAM'S INSPECTOR / FABIO SCHVARTSMAN · FORMER VALE PRESIDENT.
- Music: Epidemic Music 3 from 60 s, -20 dB, ducked under the raw; picture and music fade out over the last 0.5 s into the outro.
- Length 144.8 s (VO 124.93 + 19.87).
