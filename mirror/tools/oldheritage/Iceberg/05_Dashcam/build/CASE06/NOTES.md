# DC06 — The Phone and the Jeep (Riverside Drive, Tulsa, 15 Aug 2019)

Code `_engine/src/cases/DC06.tsx`, master `out/DC06.mp4` + `out/DC06_phone.mp4`. Duration 118.3 s (title 4 s, VO 74.2 s, raws 39.2 s).
Cutcheck: 0 flags with the designed windows + 59.9–62.4 (the airbag/pink flash inside the 0.5x SyncReplay: the source's own flash,
frame-doubled at half speed, flagged as JUMP 12× without that window). Master −17.3 LUFS integrated (loudnorm target −16).

## Timeline (VO = one take CASE06.mp3, split only at the two raws, both at sentence ends)
| T (s) | what |
| --- | --- |
| 0–4 | TitleCard "THE PHONE AND THE JEEP" on the inside camera (src 4) |
| 4–34.75 | VO A (take 0–30.75): front cam → inside cam, front cam + date label, MedianLine (NAIP), the release layout, tight on the phone, tight on his face |
| 34.75–56.75 | **RAW 1 (main)** src 14.0–36.0 (22 s): the release as published (both panes over a bright soft copy): glances down, the Jeep over the median, the hit, pink flare. Source silent until the hit → low engine bed |
| 56.75–63.05 | VO B: "The Jeep Grand Cherokee came from the northbound lanes…" over SyncReplay (0.5x, inside cam slides in synced) |
| 63.05–80.25 | **RAW 2** src 37.4–54.6 (17.2 s): inside camera alone, dazed officer, the car's Sync system calling 911 |
| 80.25–118.3 | VO C: airbag (inside), the Jeep (front frozen 29.95), release first frame held + "TULSA POLICE RELEASE · OCT 2019", 0.5x head-down, StripSlide (WSET/KTUL page, the neighbour's quote), after-crash inside cam, 0.5x pink road, inside cam easing out |

## Devices (REGISTRY.md)
- MedianLine — USGS NAIP Plus exportImage (public domain), centre 36.0668 N −95.9806 W; southbound (west) carriageway traced to the
  E 66th Pl junction (Nominatim), grass median glow on its words. RedLabel "RIVERSIDE DRIVE, TULSA".
- SyncReplay — front.mp4 + inner.mp4 at 0.5x from src 28.6, split on "crossed the median".
- StripSlide — WSET (KTUL story, Ethan Hutchins, 28 Oct 2019) captured with capture_page.py: masthead, headline/byline, Bonds quote.
- Brand: TitleCard, RedLabel ×3, glitch + blur-dips. No Inset, no Blender.

## Sources
- Dashcam: Tulsa PD release via RealBodyCam, https://www.youtube.com/watch?v=ew1RaSOyy0A. LiveLeak bug (top-left letterbox) cropped
  out: all media are crops of the picture areas (media/front, inner, rel, solo). rawclean.py on the whole audio.
- Aerial: USGS NAIP Plus ImageServer (public domain).
- Page: https://wset.com/news/nation-world/video-tulsa-police-officer-caught-texting-while-driving-before-crash (KTUL/Sinclair
  syndication; the original KTUL URL was not found). Officer Pierce's quote is on Carscoops (captured to shots/carscoops.png, not used).
- Music: Epidemic "Music 1" −15 dB (≈ −33 LUFS bed, measured −18.3 LUFS file), ducked under raws. SFX: glitch_01/02/03, real paper/page, car_engine_2.

## Notes / decisions (owner asleep)
- The officer is unnamed; his face is NOT blurred: on-duty officer in the department's own release, never named, and the VO asks the
  viewer to watch his eyes. Easy to add a soft blur on the inside-camera crops if the owner prefers (outline: "consider a light blur").
- Nothing says texting caused the crash; picture follows the VO's "the camera shows" framing.
- Footage is one 68-s release: pre-raw shots reuse src 0–13 from both panes in different framings (front/inside/release), separated by blur-dips.
- Footage: nothing was blocked for this case (no cookie fetch needed); no second small-channel angle of this event exists.

## v1.1 (14 Nov 08:40)
- Held release frame moved from src 0.0 (black first frame) to 1.5; re-rendered: cutcheck 0 flags (with 59.9-62.4 flash window), -17.3 LUFS.
