# WP28 — The container yard (Shahid Rajaee port, Bandar Abbas, Iran, 26 Apr 2025)
Code: _engine/src/cases/WP28.tsx · out: build/CASE28/out/WP28.mp4 (+ _phone)
## Sources
- SR main: ویدیوباز, https://www.youtube.com/watch?v=Za72r1DOjEA (small personal uploader), 638x360, the wide port camera (plume, fireball,
  dust wave). Upload is silent (-70 LUFS) -> raw sound = real SFX (fire_big_cc0 = freesound 158476 CC0, boom_4, sub_drop_2, boom_2,
  impact_3, wind_gust_1). Upscaled lanczos to 1080p, graded --house.
- YS extra1: اغذیه یاسین سمنان (9 subs), https://youtu.be/orcuioWLY8g, the yard CCTV filmed off a monitor (grid lines + "Camera 01" kept),
  forklift at 17.5-21 s, blast and feed loss at 100.8 s. Silent upload; used silent.
- MH (CASE29's graded clip, MR. H., https://youtu.be/_hHRAbJCyow) for the closing Tianjin line.
- rawclean: SR and YS tracks are silent (nothing to clean); the raw uses SFX only.
## Edit
Title 0-4 · VO part 1 (take 0-13.80) · RAW 18.0-32.5 (SR src 19.5-34.0: plume -> fireball 29.75 -> dust swallowing the yard) · VO part 2
(take 13.78-end, case = take + 18.72). Music 4 from 10 s at -18 dB, ducked under the raw.
## Devices
ForkliftSpot (dev/WP28_ForkliftSpot.tsx), BlastSync (dev/WP28_BlastSync.tsx). Blender (maps/port.py, shared with CASE29): yard.mp4
(wharf stacks + orange plume, label THE BURNING CONTAINERS), hangar.mp4 (Beirut Hangar 12, white bags, glow at the far door; labels
HANGAR 12 · PORT OF BEIRUT / AMMONIUM NITRATE). Labels -> dev/WP28_blLabels.ts (maps/lab2ts.py).
Length 103.4 s (VO 83.4 + 20.0).
## Render / check
Allow windows: 3.7-4.3,17.7-18.3,27.6-33.0 (raw fireball + dust),36.12-36.72,43.97-44.57,51.13-51.73,70.9-72.0 (YS feed whites out and
dies, real),88.09-88.69,98.66-99.26 -> cutcheck 0 flags (17 cuts). blurDip at 51.43 hides the YS -> YS jump into ForkliftSpot.
## Unresolved
Blender is generic and stylised (flat-shaded stacks, cone-like plume); YS is used 6 times (only two clips exist); SR is 360p upscaled.
