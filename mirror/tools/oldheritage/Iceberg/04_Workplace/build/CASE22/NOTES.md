# WP22 — The gas cloud at midnight (Rosneft Achinsk refinery, 15 June 2014)
Code: _engine/src/cases/WP22.tsx · out: build/CASE22/out/WP22.mp4 (+ _phone)
## Sources (MChS extra1 dropped per SOURCES_REPLACE.md)
- AA main: Айдар Альтин, https://www.youtube.com/watch?v=hIsxg83qqAM (25 subs): phone filming the plant CCTV monitor; cropped to the
  picture (crop 1068x600+80+48 of 1280x720). Silent room -> real SFX (boom_4, sub_drop_2, fire_big_cc0, wind). rawclean -> media/aa_clean.wav (unused, silent).
- Downloaded (footage/22_*/more/, small personal channels, no anchors/bugs):
  FA = Ещё живой (2 subs) https://www.youtube.com/watch?v=Fa0ulUVQ7Es (first 22 s only; the rest is sideways);
  OK = Новости Глазами Очевидцев (180 subs) https://www.youtube.com/watch?v=E9kSKqJZsNA (night, from far off);
  NZ = NOVAYA PRICHULIMKA (379 subs, local paper's raw handheld walk the morning after) https://www.youtube.com/watch?v=U0ue0uQUAG8.
  Rejected: daksys cQICyy2Xbks (re-upload of a TV documentary) — moved out of the footage folder.
## Edit
Title 0-4 · VO part 1 (take 0-16.2) · RAW 20.6-36.6 (AA src 25-41: unit burning, flare, blast white-out at src 32.5, fire) ·
replay of the flare 0.5x · VO part 2 (take 16.51-end, case = take + 20.09). Length 91.0 s (VO 70.7 + 20.3).
## Devices
RackTrace (dev/WP22_RackTrace.tsx); Blender gfu (maps/gfu.py -> maps/gfu.mp4, labels -> dev/WP22_blLabels.ts). The Blender unit is a
generic gas fractionation unit, not a survey of the real one; the flange is shown as the unverified account describes.
Cutcheck (render 17:08): 0 flags outside the designed windows (the raw's real flare at 25.4 s allowed).
