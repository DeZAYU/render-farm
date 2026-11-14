# DC02 — The Khayelitsha Ambush (Khayelitsha, Cape Town, Fri 9 April 2021, 13:12)

Code `_engine/src/cases/DC02.tsx`, master `out/DC02.mp4` + `out/DC02_phone.mp4`. Duration 83.6 s (title 4 s, VO 58.7 s, raw 20.0 s, hold 0.9 s).

## Timeline (VO = one take, split once, at a sentence end)
| T (s) | what |
| --- | --- |
| 0–4 | TitleCard "THE KHAYELITSHA AMBUSH" on the graded dashcam frame (src 26) |
| 4–11.2 | 2018 aerial photo of Khayelitsha + RedLabel KHAYELITSHA, CAPE TOWN |
| 11.2–17.3 | Khayelitsha shacks by the N2 (photo, push) |
| 17.3–23.8 | brand Aerial: Sentinel-2, white box on the camera's own GPS point (18.663 E, 34.016 S) + SITE B, KHAYELITSHA |
| 23.8–28.8 | SpeedStamp: the whole 4:3 frame, push into the stamp's V:36KMH |
| 28.8–34.9 | 0.43x (60 fps interpolated) approach, the bus coming |
| 34.9–42.4 | VergeLight on src 3.03 ("look at the edge of the road") |
| 42.4–62.4 | **RAW (main)** src 3.03–23.03 (20 s): halt beside the bus, two men at the driver's side, the man in red raises his arm, reverse, tight turn |
| 62.4–74.6 | 0.5x replay of the run-up + PaperBands (Swisher Post headline band + "three armed men rushing from both sides … weapons drawn") |
| 74.6–83.6 | 0.8x: the car driving away forward (src 22.9–30), end hold |

Only one raw: the clip is 30 s and its whole incident (stop → escape) is one continuous 20 s window; a second raw would repeat it. The case is
short (1:24) because the VO is 58.7 s and the source 30 s; not padded (brief: "don't pad").

## Decisions (owner asleep)
- Audio: the clip's own track is only hiss (−57 dB, rawclean: no music). The raw runs on a low real engine bed (car_engine_2/4) with tyre
  scrapes (tires_gravel_1) on the reverse and the turn. No clip sound anywhere else.
- 17 fps source: `graded/main60.mp4` (minterpolate to 60 fps, same LUT) is used for the raw and all slow shots; the first render on the
  frame-duplicated 30 fps copy gave cutcheck JUMP flags on the stutter inside the raw.
- Faces: the man in red is masked, the other face is tiny and low-res → no blur added (outline: "blur if needed"). No bystander featured.
- The gun is kept attributed: the page band says "armed men … weapons drawn" (Swisher Post), the VO says "a local news site said".
- The YouTube title line at the end runs over the drive-away footage (no page): the TorchRead-type page device belongs to DC04 nearby.

## Devices (REGISTRY.md)
SpeedStamp, VergeLight, PaperBands (new). Brand: TitleCard, RedLabel, Aerial. No Inset, no Blender.

## Sources
- Dashcam: Anton Koen, "Attempted Carjacking", https://www.youtube.com/watch?v=jpMZLKfWE3w (whole clip, camera stamp only, no logo).
- Page: Swisher Post, "Watch: Khayelitsha driver reverses to safety amid hijacking attempt" (headline as live in Nov 2026; was "escapes
  brazen hijacking attempt"), https://www.swisherpost.com/crime/watch-khayelitsha-hijacking-attempt-site-b-video/ — shots/swisher.png(.json),
  graded/swisher.png = crop.
- Photos (credit in description): "2018 02 28 Luftbild-Khayelitsha.jpg", Kno-Biesdorf, CC BY-SA 4.0; "Khayelitsha at N2 road, Cape Town
  (2015).jpg", Olga Ernst, CC BY-SA 4.0 (Wikimedia Commons).
- Satellite: Sentinel-2 cloudless 2016 by EOX IT Services GmbH (contains modified Copernicus Sentinel data 2016), CC BY 4.0.
- Music: Epidemic "Music 1" −15.5 dB (≈ DC01's Music 5 at −13), ducked to 0.3 under the raw.

## Checks
Stills at 2, 21.5, 27.5, 33, 40, 49.5, 67, 79 (every device, label, raw, outcome). Fixed after the first look: SpeedStamp pushed too far
(text clipped), VergeLight pool aimed at the asphalt (moved to the people on the verge), news bands too small (1240 → 1500 px).
