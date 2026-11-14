# TOR05 — Tuscaloosa, Alabama, 27 April 2011 ("A mile and a half wide")
Code: `_engine/src/cases/TOR05.tsx` · devices `dev/TOR05_OutbreakZoom.tsx`, `TOR05_WarnDial.tsx`, `TOR05_ScaleRead.tsx` · out `out/TOR05.mp4`, `out/TOR05_phone.mp4`

## Edit
- TitleCard on the bama wedge → VO from 0:00 of the take (no count word in this take), split only at the 7 raws, in cut-sheet order
  (BAMA 0:16, 1:36, 3:00, STORE 1:58, 2:14, BAMA 5:00, 6:36), each trimmed to 14–16 s of the strongest stretch.
  Cut-sheet window BAMA 6:00–6:30 is full of source cuts (6:01–6:27), so the raw uses 6:36–6:50 (same "moving on past the city" stretch).
- Raw sound = `media/bama_clean.wav` / `store_clean.wav` (rawclean.py removed music in bama 310–321 s and store 28–38 s; neither inside
  a store raw except bama 5:10–5:14, which is now voices/impacts only).
- Swearing: store raws use 1:58–2:30, where whisper hears only "whoa / oh my gosh / look at that guy" (the swearing is at 0:37–1:44, not used).
- Sam's phone clip is vertical: shown on its own blurred copy (house fill treatment), never stretched.
- Music: Music 5 from 0:40 at −13.5 dB, out under every raw, back on each VO block.

## Devices (new for this case)
- **OutbreakZoom** — NWS Birmingham / Alabama EMA statewide map of every 27 April track: whole state → track 44's start (GREENE COUNTY, 4:43 PM);
  later along to Birmingham and up to the Cullman EF4 (CULLMAN COUNTY). A light pool follows the camera; nothing is drawn on the map.
- **WarnDial** — 3:09 PM first warning → 5:10 PM arrival as a white clock face over the dimmed storm; red hand sweeps the two hours.
- **ScaleRead** — held frame (bama 1:16): white bracket on the hotel in front, pulled out to the width of the wedge on "you judge it by the buildings".
- NOAA NGS post-storm imagery (29 Apr 2011, tiles C447500/C450000 e3675000n): Bryant-Denny Stadium boxed (UNIVERSITY OF ALABAMA), the swath
  through Forest Lake (the lake itself is visible, boxed, FOREST LAKE), a plain push along the swath for "takes neighbourhoods at once".

## Sources
- Footage: [BAMA] T0FHTG9VETY (Bamawxcom, "Unedited Raw Version"), [STORE] kTgSaq2nRiU (Sam Mujahed).
- NWS Birmingham: https://www.weather.gov/bmx/event_04272011 (statewide map), https://www.weather.gov/bmx/event_04272011tuscbirm (aerials, survey
  photos; "NWS BMX" text and EXIF overlays cropped off).
- NOAA NGS: https://geodesy.noaa.gov/storm_archive/storms/apr11_tornado/
- Commons (public domain): "Alberta City, Tuscaloosa, AL EF4 damage" (NOAA/NWS), HUD photos by Jeff Blakley, 8 May 2011 ("Damage, from
  Tuscaloosa-Birmingham, Alabama tornado … DPLA").

## Open points
- No verified photo/location for the county EMA office, Pleasant Grove, Concord, the Alberta City school or Chastain Manor: those lines use NWS /
  HUD damage photos of the same tornado with no place label (nothing is labelled as a place it isn't).
- YouTube hit a bot check this session (not bypassed), so no extra aftermath video was downloaded.

## Final render (2 Nov, 23:43)
- Fixed cutcheck flags: raw 3 now from bama 185.6 (the old window crossed the source's zoom cut at 184.9); "a mile and a half wide" shot from
  63.6 (ended on a flash); interstate shot from 218.6 (old 228.0 sat 0.1 s after a source cut and had a car crossing the lens).
- Master `out/TOR05.mp4` + `_phone`: cutcheck 0 flags.

## 3 Nov raw audit (owner: raws only at incident moments, no near-duplicates)
- 7 -> 3 raws: wedge over the city 21.7-35.7 (14 s), debris south/east side 66.42-80.42 (14 s), ONE store raw 86.22-111.22 (25 s, main)
  after the Sam Mujahed line: src 122-132 (approach, tight full-frame crop) -> blur-dip -> src 134.5-149.5 (sign flies, debris,
  whiteout; on its blurred copy). Audio = store_clean.wav at matching offsets, 0.1 s overlap at the join.
- "The safest place is far from the windows" now follows the store raw (store from 60, full-frame push, not `fill`).
- Removed: old raw 2 (after ScaleRead, near-dup wedge), raw 6 (near-dup wedge), raw 7 (after the Birmingham/Cullman lines).
- `fill` now only 2x (Sam intro, store raw part 2). OutbreakZoom keys re-timed -9 f to stay on "Cullman". Duration 239.4 -> 190.15 s.
