# DC03 — The Calais Branch Roadblock (outside Calais, France, Tue 6 September 2016, 22:04)

Code `_engine/src/cases/DC03.tsx`, master `out/DC03.mp4` + `out/DC03_phone.mp4`. Duration 94.9 s (title 4 s, VO 68.6 s, raws 21.5 s, hold 0.8 s).

## Timeline (VO = one take, split at the two raws, both at sentence ends)
| T (s) | what |
| --- | --- |
| 0–4 | TitleCard "THE CALAIS BRANCH ROADBLOCK" on the graded frame (src 11: the tangle and the crowd) |
| 4–17.4 | StampFold: first frame held, push into the camera's own stamp (white rule under 2016-09-06), the picture folds back onto Sentinel-2 at its GPS: box on the camera spot + CALAIS, FRANCE, drift, box on the ferry harbour |
| 17.4–22.3 | 0.5x: the empty curve and the concrete barrier (src 0–2.5) |
| 22.3–30.6 | the camp, 2015 (photo) + RedLabel THE JUNGLE, CALAIS · 2015 |
| 30.6–36.0 | 0.45x: the tree top across the lane (src 26.8–29.2) — "branches dragged into the lanes" |
| 36.0–42.1 | brand Aerial: Calais from above, box on the town + CALAIS · SEPTEMBER 5, 2016 (the blockade the day before) |
| 42.1–48.0 | 0.4x: easing toward the barrier top (src 2.6–4.98), runs straight into the raw |
| 48.0–62.5 | **RAW 1 (main)** src 4.98–19.48 (14.5 s): figures on the barrier, the tangle, the lorry stops, the crowd climbs over and fills the road |
| 62.5–74.4 | TwoDates: the real Wikipedia row of the March 2016 attack (date cell → the account, rest sinks), then its date beside this camera's own stamp |
| 74.4–79.4 | 0.5x replay: the crowd round the cab, the windscreen intact |
| 79.4–86.4 | **RAW 2** src 19.48–26.48 (7 s): the crowd thins and scatters, the lorry starts rolling toward the tree top |
| 86.4–94.9 | 0.63x: the empty road on (src 29.2–34.6), end hold |

## Decisions (owner asleep)
- The line "the day before … truckers had joined farmers in blocking the highway" has no footage or free photo; I could not place the A16
  blockade precisely on the satellite, so the Aerial boxes the town of Calais with the date, not a road (no invented location).
- No freeze-frame of any person (handle-with-care): the frozen frames are the empty road (StampFold, the stamp in TwoDates); people appear
  only in moving footage. Wording kept to "a crowd" / "people from the camp"; the injury story is shown as the other truck's real row.
- The Wikipedia row text includes "violently assaulted"; it stays (it is the real record of the other attack; no slur or flaggable word).
- Raw audio: the cab's own sound through rawclean (no music found); RAW 2 at −9 dB (the source peaks around −5 dB RMS there).
- The A16 label from the first draft was removed after checking the satellite: the camera's GPS sits on the N-S port road east of town.
- Resume note (14 Nov): the 60 fps interpolation (graded/main60.mp4) had completed before the overnight restart (2081 frames, decodes to the
  end); only the final render was redone. Footage needed no new download.

## Devices (REGISTRY.md)
StampFold, TwoDates (new). Brand: TitleCard, RedLabel, Aerial. No Inset, no Blender.

## Sources
- Dashcam: Sonal Sehgal repost, "CALAIS: Migrants block Road, ambush and attack Truck Driver for UK passage",
  https://www.youtube.com/watch?v=QMAgSp3Yfj8 (whole clip; camera stamp only; loaded title not used).
- Page: Wikipedia, "List of migrant vehicle incidents in Europe" (3 March 2016 row), capture_page.py → shots/wiki.png, graded/row.png.
- Photo (credit in description): "Calais refugee camp 1.JPG", Michal Bělka, CC BY-SA 4.0 (Wikimedia Commons, June 2015).
- Satellite: Sentinel-2 cloudless 2016 by EOX IT Services GmbH (contains modified Copernicus Sentinel data 2016), CC BY 4.0.
- Music: Epidemic "Music 3" −20 dB, ducked under the raws. SFX: glitches, whoosh on the fold, paper on the page.

## Checks
Stills at 2, 9, 11.3, 16.5, 20, 25, 33, 38, 45, 55, 66, 70, 73, 77, 90. Fixed: S2/S6 overlapped in the source (S2 now 0.5x on src 0–2.5);
TwoDates' split made the row tiny (now the date cell large beside the stamp, rest of the row clipped).
First render: cutcheck 1 JUMP at 35.97 (hard cut dark footage → aerial) → glitch added there; re-render: 0 flags.
