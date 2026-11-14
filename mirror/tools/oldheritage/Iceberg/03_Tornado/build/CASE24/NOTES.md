# TOR24 — On the air at Memories 107.9 · Washington, Indiana (17 Nov 2013, EF2)
Render: `out/TOR24.mp4` (72.4 s, −16 LUFS) + `TOR24_phone.mp4`. Cutcheck: 0 flags. Allowed windows: designed transitions
(3.7-4.3 glitch, 9.8-10.4 / 13.45-14.05 / 47.3-47.9 / 62.15-62.75 blur-dips, 64.85-65.45 whip) and two handheld whips INSIDE the raws
(20.0-20.5 = source 17.5, 36.9-37.4 = source 35.6: the DJ's phone swinging, real camera motion, not an edit).

## Edit
TitleCard (station window, rain) → TwinTowns → window/date → the station's tower ("on the air") → RAW 1 (11.0-20.5, the wall of rain)
→ TrackGlide touchdown → RAW 2 (26.0-46.1, tower, dumpster rolling, white-out) → the phone drops at 46.2: its roar (46.1-52.1)
continues under a 0.5x replay of the white-out (43.0-46.1) → TrackGlide crossing 3:20→3:23 → blown-out station window → the dark
room (0.8x) → NAIP 4th & Sycamore → the same lot after (outcome). VO one take, split only for the two raws; the count word sits
inside "Twenty-four is the one in Indiana", so nothing was cut. Music: Music 4 (−22/−23 dB), out before the roar.
Raw sound: the phone mic is ~−55 dBFS until the roar; gain envelope baked into `media/raw1.wav`, `raw2.wav` (`assets/bake.py`)
because a per-frame volume curve overflowed Remotion's ffmpeg expression.

## Devices (new, `_engine/src/dev/`)
- `TOR24_TwinTowns.tsx`: "Remember the second Washington?" — Washington IL (case 6 footage) and Washington IN as two white-framed
  panels angled in 3-D with red place labels; the Indiana panel swings flat and becomes the frame (push-through hand-off).
- `TOR24_TrackGlide.tsx`: the NWS track on a NAIP aerial tilted back in 3-D, pins standing up as billboards; touchdown + 2.8 mi
  measure, then the crossing with the head's clock 3:20→3:23 PM (survey start/end).
- brand `Aerial` on NAIP at 4th St & Sycamore St (OSM geometry).

## Sources
- Footage: WAMW studio phone video https://youtu.be/Bu74LnznLfs (only clip; windows listed in the code header). TwinTowns left panel:
  https://youtu.be/pVanmvVNHcc 62.0-65.6.
- NWS Indianapolis survey https://www.weather.gov/ind/nov172013daviesstor (EF2, 120 mph, 2.8 mi, 125 yd, 3:20-3:23 PM EST,
  38.6420/-87.2224 → 38.6546/-87.1730, house off foundation at Fourth & Sycamore, 0 injuries). Damage photos downloaded to assets/ (unused).
- USGS NAIP ImageServer exportImage (two extents, see code), graded `--house --nonorm`. OSM/Nominatim for SW 4th St / Sycamore St.
- No downloads of other video.

## Issues / for the owner
- The studio hall with glass on the floor (source 98-103) swung too hard (cutcheck JUMPs); replaced by the steady blown-out window
  on the station's outside wall (363.5-367.2).
- The station's exact address is not stated anywhere official I could find, so no aerial of the station itself.

## Owner rule 5b (raw audio / blur)
Raw sound now comes from `media/win_clean.wav` (rawclean.py on the 0-53 s window), then baked into raw1/raw2.wav. No injured
people, bodies or nudity in the raws: no blur needed.
