# TOR16 — Andover, Kansas, 29 April 2022 ("The school and the YMCA")

Out: `out/TOR16.mp4` (171.3 s, −16 LUFS), `out/TOR16_phone.mp4`. Cutcheck: see bottom.
Code: `_engine/src/cases/TOR16.tsx`; devices `dev/TOR16_TapeInsert.tsx`, `dev/TOR16_SurveyMap.tsx`.

## Edit
- TitleCard on a darkened City Hall frame → RAW 0 (City Hall West cam, funnel far out, as the cut sheet opens) → VO.
- VO: one take, "Sixteen." removed (take 0.9), split only at the 7 raws.
- **Both sources are silent** (City Hall cam and the USD 385 school cameras have empty audio tracks, −inf dB), so there is no raw audio to
  clean (rawclean not applicable). Every raw is built from real recordings in `sfx_n2/real` (wind, rain, impacts, metal) timed to the
  picture; music (Music 1) is held at 40 % under the raws instead of cut, so the silent windows don't drop out.
- Raws (silent, trimmed to the moment): City 187.5–193.5, 520–528, 570–582; School 7.5–15.5 (lawn boards), 109.3–117.3 (walkway, after
  the debris-flash glitches 99.6–108.6), 131.5–140.0 (the funnel passes the tree camera), 169.0–181.0 (the cafeteria window goes, tables thrown).
- **Order change**: the cafeteria raw plays after "The school lost its roof and windows." (one sentence earlier than the cut sheet) so the
  side-swipe map runs on straight into the YMCA line. All raws keep their cut-sheet order.
- No people appear in any footage; nothing to blur.

## Devices
- **TapeInsert**: the Andover Police Department's own 1991 F5 tape (public domain, Commons) with its VCR clock, in a white frame over the
  2022 City Hall camera; label APRIL 26, 1991. (NWS DAT notes the 2022 path crossed the 1991 path near City Hall.)
- **SurveyMap** (×2): NWS Damage Assessment Toolkit event "WichitaAndoverTornado" — 86 rated survey points (EF3 in red) and the
  surveyed line on USGS imagery, a registered NAIP close-up inside it. 1: the whole path, diving to PRAIRIE CREEK ELEMENTARY.
  2: close — the line passes the school's edge (EF2 survey point) and runs through the YMCA (EF3) = "side-swiped instead of head-on".
- Aerial (brand): McConnell AFB; the school and the YMCA from above today.

## Sources
- School cameras https://youtu.be/T2Qu7cgwJmw (USD 385, official); City Hall West https://youtu.be/EDwVxPA3aGk (City of Andover, official).
- Commons PD: 1991_Andover_Tornado_Police_Dashcam_footage.webm (Andover PD); Andover,_Kansas_EF3_damage_April_2022.jpg (NWS Wichita);
  EF3_damage_to_a_pet_shop_in_Andover,_Kansas.jpg (NOAA).
- NWS DAT FeatureServer (layers 0/1), USGS NAIP exportImage, USGS Imagery Only tiles.
- Not used: 2022_Andover_Tornado.jpg (CC BY 3.0, JR Hehnly — a chaser/photographer). yt-dlp asked for a bot check: no new downloads.

## For the owner
- **Width conflict**: the VO says "never wider than 250 yards"; NWS DAT gives max width 440 yd (comment: average 300–400 yd). No width is
  shown on screen. Consider re-voicing.
- No YMCA footage/photo with a free licence was found; the YMCA is shown on the survey map and from above today; "car lifted 1,000 ft"
  plays over the City Hall camera with debris in the air (not the car itself).
- Governor / 150 airmen lines: no free imagery found (governor page not located, DVIDS blocked); covered with after-storm CCTV.

## Render fixes (2 Nov, 23:00)
First render: cutcheck 32 flags: the school CCTV records ~8 fps (each picture held 3–4 frames), read as JUMPs in RAW 4–6, and the
playground shot crossed the source cut at 217.47 by one frame (STUB). Fixes: `graded/school.mp4` re-timed with mpdecimate + ffmpeg
`framerate` blending to a smooth 30 fps (original in `graded/_orig/`; timings unchanged, verified side by side), playground window
now src 214.16 (ends 217.43). Re-rendered.
Re-render 23:13: `out/TOR16.mp4` 171.4 s, −16 LUFS, + phone copy. Cutcheck: 22 cuts, 0 flags.

## 3 Nov raw audit (owner: raws only at incident moments, never during explanation)
- Raws 7 -> 4: removed raw 2 (city cam after the LP-supercell explanation, near-dup) and raws 4 + 5 (school walkway / tree cams).
- Raws now: city 187.5 (6.0 s, 4.0-10.0), city 520 (8.0 s, 27.1-35.1), school lawn 7.5 (8.0 s, 52.7-60.7), cafeteria 169 (12.0 s main, 69.2-81.2).
- VO-B+C run on (35.1-52.7); the "EF3, peak winds" line now opens the SurveyMap (9.2 s, keys shifted) so the City Hall camera never runs 5 shots.
- VO-D/E/F (60.7-69.2) run on over silent school cameras: cafeteria glass, tree cam (funnel passing, src 131.5), courtyard.
- Duration 142.8 s. Raw SFX of removed raws dropped.
- Fixed an old hole: the cafeteria-glass shot ran past the end of school.mp4 (229.23) = 0.5 s black; now glass 2.0 s + walkway camera (src 110).
