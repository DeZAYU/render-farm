# WP01 — The tank that folded (Switz City, Indiana, 31 Jul 2017)
- Footage: one clip only, https://www.youtube.com/watch?v=fmrxFcTTv-c (cptnwiz, 147 subs, the filmer's family farm; 202x360 portrait).
  Searched for other angles: only Daily Mail / WTHI (TV) exist -> not used. Upscaled to 608x1080 (lanczos), graded --house --nonorm
  (the normalised grade crushed the sunny day to storm-dark).
- VO: CASE01.mp3 from 3.22 s; "Level one. Nobody on these sites was lost." (0-3.29) is the LEVEL call and is left for the level card.
- Raws: R1 src 54.0-67.6 (13.6 s, "it's buckling the frame of the superstructure"), R2 src 100.7-125.7 (25.0 s, drop -> flash -> filmer
  runs -> cloud). Cut-sheet RAW 2 (more pouring) and RAW 4 (cloud after the explanation line) dropped per the 3 Nov incident-only rule.
  Audio = rawclean.py (no music detected). Expletives at ~35.6 s and ~71 s of the source sit outside both raws. No injuries: nothing to blur.
- Devices (new, registered): PourClock, LoadPath, DustFlash, ClaimReplay, FallFlash. No Inset, no shared page template.
- Document: the uploader's YouTube description re-set in ClaimReplay. Music: Music 3 from 30 s at -20 dB, ducked under raws.

## v2 (4 Nov, owner: PourClock 'did not stand towards niche'; WP_PLAN budget VO + ~19 s)
- Removed PourClock, LoadPath, DustFlash, FallFlash. New: LegPunch (freeze + x2 punch on the bent frame), LoadTrace (lines on the real frozen frame). Kept ClaimReplay.
- Raws: R1 src 58.5-67.2 (8.7 s, 'it's buckling the frame'), R2 src 103.0-116.25 (13.25 s, drop + flash; cut before the camera swings to the ground). Length 80.3 s.

## v3 (4 Nov, every case gets a Blender shot) — voice, raws, timing and length unchanged (80.3 s)
- LoadTrace (27.45-34.96, "A tank like this sits up on legs ... on that steel structure") replaced by Blender `loadout`
  (maps/loadout3d.py + wpbl_common.py, render_bl.sh): sunny farmyard, the load-out tank on four braced legs; a grain truck rolls in
  between the legs and stops under the gate on "drive underneath", corn pours on "load from above", the near wall ghosts away on
  "All the weight of the grain" to show the corn over the legs, which bow slightly as the tank settles. blurDip in and out.
- Cutcheck 0 flags with the designed blurDip windows allowed (the one JUMP was the existing 18.75 blurDip into raw 1).
