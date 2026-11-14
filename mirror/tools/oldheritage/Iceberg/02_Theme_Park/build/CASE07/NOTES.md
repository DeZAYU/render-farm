# TP07 — Four hours on Joker's Jinx (Six Flags America, 13 Apr 2017)
Code: _engine/src/cases/TP07.tsx · out: out/TP07.mp4 (+ _phone) · ~202 s

## Footage
- Main: Mark Brady / PGFD spokesman channel, "A GoPro View of PGFD Roller Coaster Rescue" https://www.youtube.com/watch?v=Gkju1xv8o1M
  (camera on the ladder-truck bucket, one 26-min take, no source cuts). The left ~29 % of every frame is the bucket edge: every window
  is cropped to 1360x765 of the picture (x 560) and scaled to 1080p (media/jj_*.mp4; windows gd 0-52, cl 118-202, r1 288-382, r2 448-482,
  r3 598-662, r4 808-832, r5 922-1018, gn 1058-1112, gw 1203-1233, c2 1323-1363, lt 1398-1422 s). One LUT for all (luts/jj.cube).
- Downloaded (footage/24_*/more/): The Coaster Craze (666 subs, says "feel free to use this footage ... give attribution"):
  https://www.youtube.com/watch?v=Q-aKySFmOu4 (the train still stuck the next morning) and https://www.youtube.com/watch?v=0XUjqSs_waE
  (2021 off-ride POV: station, launch, structure). Attribution to The Coaster Craze should go in the video description.
- Audio of the bucket cam is mostly the truck engine plus a few crew lines (whisper): raws chosen where crews talk at the cars
  ("do you want to see the ground…", "all right, are you ready?", "make sure we lift that bucket up…"). No names in the kept raws
  (one line at 355 s says "Good job, Jeff" — not used).

## Devices
- HeightStaff (dev/TP07_HeightTilt.tsx): ticked staff + leader on the next-morning photo of the stopped train, "≈100 FT"; "TILTED ≈30°" label.
  A TiltGauge on the bucket camera was built and dropped: from below, the camera cannot show the train's pitch honestly (the drawn
  angle would have read ~8-20°, not 30°).
- LaunchProfile (dev/TP07_LaunchProfile.tsx): chain lift crawl vs launch run; the train fired, slowing and stopping on the climb.
- NightClock (dev/TP07_NightClock.tsx): same ground view at dusk and in the dark cross-fading while a clock sweeps 5:30 -> 9:30 PM.
- ChipLift_N2P page: KTVU article https://www.ktvu.com/news/24-people-rescued-from-stalled-jokers-jinx-roller-coaster-at-six-flags-america
  (2014 strand line + "last inspected on March 3, 2017 … no outstanding violations"); sidebar cropped out.
- Inset zooms: the straps/chains on the wheel assemblies (the chaining), the rope work.

## Sound
VO take continuous, split only at raws (cut points checked in the take's silences). Music 1 at -16 dB, ducked under raws, two passes.
cutcheck: first render flagged a JUMP at 176.0 (dark fixed view -> lit fixed view of the same camera): blur-dip added, re-rendered.

## Update (owner rule 5b)
- All raw audio now from rawclean.py: media/raw_r1..r6_clean.wav (+ r5b), cut 0.5 s before each window (no music detected in the bucket cam).
- Added the missing cut-sheet raw after "never built to sit" (cue 14:58): riders waiting on the tilted track (src 820-829); everything after
  moved +9 s; duration now ~211 s. Raws now follow all 7 cut-sheet cues in order. No blur needed (no injuries / bodies / nudity).

## 3 Nov 2026 audit
- Raws 7 -> 4 (kept: climb 11.8 s, Brady/hysterical + raw ~10.6 s, bucket + raw ~10.7 s, 'are you ready?' 10.4 s). Removed via cutOut: 54.0-64.0, 132.6-141.7, 156.6-165.6 (cut 3 starts 156.6, not 156.4: VO part ends there in silence; LaunchProfile extended to 156.6). VO part 2/3 re-split in the 37.34-37.84 silence. Removed raws stay in the duck list.
- ChipLift_N2P (2 uses) -> ArticlePhone (dev/TP07_ArticlePhone.tsx, real type, red marker sweeps). NightClock -> DuskDeck (dev/TP07_DuskDeck.tsx).
- Inset 3 -> 1 (chains kept); rope work and next morning now full-frame pushes (+ RedLabel THE NEXT MORNING). Duration ~182.9 s.
