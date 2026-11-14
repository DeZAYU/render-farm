# TOR04 — Mayfield, Kentucky, 10 December 2021 ("The bank and the candle factory")
Code: `_engine/src/cases/TOR04.tsx` · devices `dev/TOR04_LobbyWall.tsx`, `TOR04_TrackFold.tsx`, `TOR04_BulletinRoll.tsx`, `TOR04_PeelReveal.tsx`
Out: `out/TOR04.mp4`, `out/TOR04_phone.mp4`

## Edit
- Opens on the bank raw (front-door camera: calm → lights drop → doors burst), then TitleCard-free VO ("Four." cut). Raws in cut-sheet order:
  BANK 0:19–0:41, BANK 0:42–1:05 (as the LobbyWall), LOT ×4 — each trimmed to its strongest 6–14 s.
- **Bank footage source changed**: Wikimedia Commons "First National Bank Mayfield CCTV.webm" (public domain, 1272×718) instead of the YouTube
  upload (426×240). Both are the bank's own CCTV; the YouTube copy carries added music, so no clip audio is used at all.
- Both cameras are silent → every raw is scored with real recordings (wind, rain, glass/impact, metal, sub drop on the lights) timed to the
  picture. rawclean.py not needed: no clip track is played anywhere in this case.
- Music: Music 4 at −22.5 dB, out under raw 1 / the wall / raw 5, ducked under the quieter lot raws.

## Devices (new for this case)
- **LobbyWall**: lobby east (burst), lobby west (goes dark, fills), front door at half speed — one 3-D security wall.
- **TrackFold**: the last bank frame folds down like a lid onto the NWS Paducah EF4 track map; camera holds on Woodland Mills, then travels to
  Rough River Dam and pulls back to the whole 165 miles (the NWS survey points carry the eye; no drawn trace).
- **BulletinRoll**: the real 9:26 PM CST Tornado Warning (IEM archive capture, TORPAH 202112110326) on a lit 3-D sheet; issuance time
  selected, "TORNADO EMERGENCY FOR Mayfield" marked white → red.
- **PeelReveal**: NWS Paducah before/after aerial of the candle factory site; the before sheet peels away in 3-D, white box on the factory.

## Sources
- Lot camera: JA9pj-qVNCw (mike hodges repost of Mayfield Electric & Water's own CCTV).
- NWS Paducah event page https://www.weather.gov/pah/December-10th-11th-2021-Tornado (EF4 path map, before/after GIFs, drone + survey photos).
- IEM: https://mesonet.agron.iastate.edu/p.php?pid=202112110326-KPAH-WFUS53-TORPAH
- Commons: "1906 Broadway Looking West, Mayfield, Kentucky" (PD); Paul Sableman "Mayfield, KY" 28561466198 / 28561465278 (CC BY 2.0 — credit
  Paul Sableman); State Farm "2021 December Tornado - (Downtown) Mayfield, KY" 51751574516 / 51752447515 / 51751809538 (CC BY 2.0 — credit State Farm).

## Open points
- YouTube downloads hit a bot check this session (not bypassed), so no extra aftermath video; the aftermath lines run on NWS / Commons stills.
- No free photo of the rebuilt FNB main office was found: that line shows downtown Mayfield in the week after (labelled "DOWNTOWN MAYFIELD").
- The NWS before/after aerials are Esri/Maxar basemap captures published by NWS (attribution strip cropped).
- No page for the 2022 KY OSH citation was found on ky.gov; those lines run on NWS / Commons damage stills.

## Final render (2 Nov, 23:45)
- Raw 6 (lot) now from 95.4 so it ends before the source cut at 105.6 (was a JUMP). Master `out/TOR04.mp4` + `_phone`: cutcheck 0 flags.

## 3 Nov raw audit (owner: raws only at incident moments, no near-duplicates)
- 6 -> 3 raws: bank front door 4.0-15.6 (11.6 s), LobbyWall 34.3-42.3 (8.0 s), ONE lot-camera raw 59.9-82.9 (23.0 s, main) right
  after "Across town, the lights were still on.": calm (src 0.3-8) -> blur-dip -> wind/rain building (src 47-57) -> blur-dip -> debris
  as the lot disappears (src 58-66); scored with the same real wind/rain/impact recordings.
- Removed the lot raws that sat after the track stats / the factory / the lawsuit lines; the take runs on across them.
- The lot shot under the "three hours / 2,600 yards" line now uses src 86 (after the debris) so the lot never runs backwards.
- Music out under all three raws, back under the VO. Duration 171.4 -> 152.35 s.
