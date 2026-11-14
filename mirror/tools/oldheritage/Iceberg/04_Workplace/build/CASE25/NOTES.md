# WP25 — Clorados III (Pajaritos complex, Coatzacoalcos, Veracruz, 20 Apr 2016)
Code: _engine/src/cases/WP25.tsx · out: build/CASE25/out/WP25.mp4 (+ _phone)
## Sources
- PJ main: Angel Carretero Rios, https://www.youtube.com/watch?v=VjrztXtnWKc: two plant CCTV cameras (cam 1 0-45.03 s, cam 2 after).
  Burned-in "Xidomega" tag removed with delogo (x265 y196 68x20 at 400x226) on both cameras, 4 px border cropped, upscaled, graded.
  Silent (rawclean: no music) -> raw SFX: wind_gust_1, boom_4 + sub_drop_2 at the flash (cam 1 src 38.35), fire_big_cc0, boom_5 (cam 2 src 55.8).
- Downloaded: JK = josue kortez (7 subs) https://www.youtube.com/watch?v=bQjXgASdfBs (vertical phone video walking out among the plant
  under the smoke; used silent, shown at full height over its blurred copy). Rejected: cHL3vGWPxjI (big "#tonyizaguirre" + VivaVideo
  text burned across the picture), gIMKaPQplYw (phone re-film of the same CCTV).
- Blender imagery: Sentinel-2 cloudless 2016 by EOX IT Services GmbH (https://s2maps.eu, CC BY 4.0, contains modified Copernicus
  Sentinel data 2016), fetched with maps/fetch_s2.py; complex footprint = OpenStreetMap (ODbL) via Nominatim -> maps/complex.json.
## Edit
VO starts at take 11.80 ("Clorados"; level-five call 0-11.55 is built separately in LEVEL5). Title 0-4 · VO part 1 (take 11.80-41.32)
· RAW 33.8-46.6 cam 1 (src 32.0-44.8) + blur-dip + 46.6-51.6 cam 2 (src 54.6-59.6) · VO part 2 (take 41.30-end, case = take + 10.3).
Length 87.2 s (VO 63.7 + 23.5; second raw allowed, VO < 70 s).
## Devices
CloudGhost (dev/WP25_CloudGhost.tsx); Blender coast (maps/coast.py -> maps/coast.mp4, labels -> dev/WP25_blLabels.ts).
## Render / check
Allow windows: 3.7-4.3,8.42-9.02,17.07-17.67,33.5-53.9 (raw + replay),81.55-82.15 -> cutcheck 0 flags. Music 1 from 40 s at -16 dB.
## Unresolved
Delogo leaves a faint smear bottom-centre of both CCTV views. Length 87.3 s is ~5 s over the VO+19 budget (two raws: VO < 70 s).
