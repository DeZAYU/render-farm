# WP24 — Eleven days (Indian Oil terminal, Sitapura, Jaipur, 29 Oct 2009)
Code: _engine/src/cases/WP24.tsx · out: build/CASE24/out/WP24.mp4 (+ _phone)
## Sources
- IOC main: vinitkumardharad, https://www.youtube.com/watch?v=T2Ok6Rmt518 (8 subs), 424x320 night handheld, upscaled lanczos, graded --house.
  Its audio carries music (rawclean: music in 155 of 236 s) -> muted per the cut sheet; raw sound = real SFX (boom_4, sub_drop_2,
  boom_2, wind_gust_1, media/sfx/fire_big_cc0.wav = freesound 158476 CC0, copied from CASE22).
- Downloaded (footage/24_*/more/): KK = Kamal Khatri (5 subs) https://www.youtube.com/watch?v=Qsl7iyfWHCY (the tank rows burning from
  far off, 320x240); Buncefield CCTV evidence released by the UK Health and Safety Executive ("Solutions from HSE", UK Crown copyright,
  Open Government Licence): bf_nQuCdXen3b0 (g15 garden camera, the vapour cloud over the lawn 5:48-6:17, with the camera's own
  time stamp) and bf_eIp1TMiI_nQ (c5, the blast). Used silent.
- PR = Caribbean Petroleum (CASE08's graded we.mp4, Werius IhGPLhO3G-c), window 58-74 s copied to graded/pr.mp4.
## Edit
Title 0-4 · VO part 1 (take 0-27.48) · RAW 31.7-43.3 (IOC src 63.2-74.8: the fireball rolling up over the wall) · replay 0.5x under
the toll · VO part 2 (take 27.45-end, case = take + 15.85). Length 111.7 s (VO 94.5 + 17.2).
## Devices
StampPunch (dev/WP24_StampPunch.tsx), FenceSplit (dev/WP24_FenceSplit.tsx); Blender leak (maps/leak.py -> maps/leak.mp4,
labels -> dev/WP24_blLabels.ts): a generic terminal at dusk, not a survey of the real one.
## Render / check
IOC, KK, BFG, BFC rebuilt with minterpolate blend to 30 fps (25/15 fps sources made JUMP flags); PR re-timed 15->30 blend.
Allow windows: 3.7-4.3,19.58-20.18,31.4-49.5 (raw + 0.5x replay),60.34-60.94,70.4-72.9 (BFC real blast shake),76.93-77.53,101.63-102.23,105.19-105.79
-> cutcheck 0 flags (26 cuts). Music 3 from 140 s at -18 dB, ducked under the raw.
## Unresolved
All Jaipur footage is 320-424 px phone video (soft when full frame); KK is blown-out. Blender terminal is generic (sandy-lit tanks).
