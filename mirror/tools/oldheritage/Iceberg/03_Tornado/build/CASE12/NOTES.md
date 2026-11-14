# TOR12 · Two F5s from one storm · Hesston and Goessel, Kansas (13 Mar 1990)

Code: `_engine/src/cases/TOR12.tsx` · devices `_engine/src/dev/TOR12_*.tsx` · out `build/CASE12/out/TOR12.mp4` (+ `_phone`). 

## Structure (v2, owner rule 5b)
TitleCard → 8 raws exactly at the cut sheet's ▶ RAW cue positions, in order, each trimmed to the moment (6.6–15.5 s):
1 VHS 0:36 "we better head for the barn 'cause that one's on the ground too" · 2 VHS 1:45 the wedge with the new lowering · 3 VHS 4:59 the
rope drawn into the Goessel wedge (the cue's 2:30 is SCRUB; the merge is at 4:59) · 4 NWS1 0:07 the tornado beyond the buildings (upload has
added music: rawclean --force removed it, real wind SFX under it) · 5 NWS2 0:14 the filmer: "This is a tornado in Hesston ... the college area"
· 6 VHS 6:45 "That sucker's huge!" · 7 VHS 7:05 "It's unbelievable ... right over Paul Bartels" · 8 VHS 8:52 "Come on, quick! ... sounds like a jet".
Raw sound = `media/rN_clean.wav` from `_tools/rawclean.py` (music found only in NWS1). No injured people / bodies on screen.
VO = one take ("Twelve." dropped), split only at the raws at measured silences (0.79 / 14.36 / 32.44 / 41.32 / 59.82 / 63.02 / 86.13 / 94.05).
Music: Music 4 (−21.5 dB ≈ the channel bed level, measured −11.9 LUFS), only under the VO, a fresh offset each stretch.
Timeline computed by `dev/TOR12_layout.ts` (also used by TOR13/14). Duration 227.9 s.

## Devices (new for this case)
- **CamDate** – the NWS camcorder's own burned-in "03 13 90" stamp is the date: white box draws round it, camera glides in, out again for HESSTON, KANSAS.
- **TwinTrack** – USGS NAIP mosaic as a tilted 2.5-D plane; SPC track of the Hesston tornado (Pretty Prairie → Hesston, 48 mi) drawn on
  the spoken line, and later the Goessel track (red) to Hillsboro. Track ends from the SPC database (1990 #80 and #97), through Haven/Burrton per NWS.
- **OrbitTrace** – freeze on the VHS frame (295 s) where the thin Hesston rope stands beside the new tornado; brackets name both; a dashed orbit is drawn round the big one.
- **MergeFrames** – the four photographs of the merge (Nancy Franzen, via NWS Wichita page / Grazulis) in white frames on a receding 3-D row.
- **Cycloid** – scour loops drawn on a real Goessel field (NAIP): a moving core with three orbiting suction whirls leaving loop-the-loop marks.
- **DebrisCarry** – top-down NAIP of eastern Kansas, dashed flight lines from Hesston to Manhattan (85 mi) and near Blaine (115 mi), landing rings.
Plus channel grammar: TitleCard, RedLabel, Inset (NWS video grab of a wiped-out lot).

## Sources
- Footage: VHS repost https://youtu.be/PslT4_HwPiM (vortexva; "2011vortexva" mark removed with delogo, x470 y428 w154 h28);
  NWS Wichita https://youtu.be/LU4Nd4s-iiA (has ADDED MUSIC: raw 4 plays the rawclean --force output + real wind) and https://youtu.be/bCoGLAugcV0 (filmer's own audio, raw 5).
- NWS Wichita event page https://www.weather.gov/ict/hesston (facts, merge photos, video grab vidgrab4, book photos bookpic_6/8/10;
  photographer credits on the book photos were cropped off: Mike Webb, Herb Schroeder Jr., Duane Graham).
- SPC tornado database 1950–2023 (track ends). USGS NAIP Plus ImageServer (three exports). No downloads of new video.

## Checks
Stills checked at 28 points (title, all devices, labels, raws, outcome). v1 cutcheck had 1 JUMP (two VHS windows back to back) → blur-dips on
every same-camera join in v2. Final cutcheck: see below.

## Notes for the owner
- The 1990 VHS is a repost; the original filmer is not identified (research note). The NWS clips are official uploads.
- The book photos on the NWS page are third-party photographers' work hosted by NWS; used small (3 stills, credits cropped). Swap if unwanted.
- "Burrton" line shows the Hesston tornado over Hesston rooftops (no Burrton footage exists); the "army barracks" line shows a farmhouse under the Goessel wedge, not that house.

## 3 Nov raw audit (owner: raws only at incident moments)
- Raws 8 -> 3: RAW 1 4.0-17.8 (13.8 s, main), RAW 2 32.22-42.22 (10.0 s), RAW 8 122.76-129.36 (6.6 s). Removed RAW 3-7 (each followed
  explanation: forecasters' career line, Hesston damage ratings, Fujita scale, Goessel, strongest-documented); their VO parts merged
  into one part (take 14.36-94.05). Blur-dip added on the vhs->vhs join at "The tornado that swallowed it". Duration ~166.9 s.
