# DC01 — The Excavator Arrest (Hardwick, Vermont, 14 June 2022)

Review case for video 05 "20 Most Disturbing Dashcam Moments Ever Caught on Camera". Code `_engine/src/cases/DC01.tsx`,
master `out/DC01.mp4` + `out/DC01_phone.mp4`. Duration 169.1 s (title 4 s, VO 127.6 s, raws 36.9 s, end hold 0.85 s).

## Timeline (VO = one take, split only at the two raws, both at sentence ends)
| T (s) | what |
| --- | --- |
| 0–4 | TitleCard "THE EXCAVATOR ARREST" on the graded dashcam frame (src 30) |
| 4–57.62 | VO part A (take 0–53.62): DriveUp aerial, Hardwick photo, 6 dashcam crops (src 15–56, no arm/bucket in frame), ArmKeep |
| 57.62–71.12 | **RAW 1** src 0.0–13.5 (13.5 s): the arm rises behind the cruiser, the bucket comes over its roof and starts to swing. Source sound is digital silence here (VSP release) → low engine bed (sfx_n2/real/car_engine_4) |
| 71.12–76.13 | VO part B (take 53.62–58.63): "Police later said Wayne moved the bucket recklessly near the troopers and their cruisers." over the bucket above the cruiser (src 30) |
| 76.13–99.48 | **RAW 2 (main)** src 64.0–87.35 (23.35 s): bucket swinging → sweeps down over the people on the ground → a trooper stands and aims at the cab → police radio "all available units…". Real sound (rawclean.py: no music) + engine bed at the sweep |
| 99.48–169.1 | VO part C (take 58.63–end): 0.5× replay of the sweep, arrests/citation crops, VSP release (full frame), ChargeSheet, cab crop, troopers, DropShaft, courthouse, tilt bucket → son, wide, teasers c07 + c08 (silent) |

Note: VO part B between the raws is one full sentence of 5.0 s (+0.5 s pauses); it points straight at the main raw, so it was kept
rather than merging the raws (RAW 1 must start on "keep your eye on the long orange arm… once it starts to swing").

## Devices (REGISTRY.md)
- DriveUp — NAIP aerial, driveway drawn from Scott Road to the house, box on the house (VCGI E911 address point for 178 Scott Rd).
- ArmKeep — held first frame: travel from the struggle to "TALLMAN" painted on the excavator stick ("WAYNE TALLMAN, 52"), pull back,
  everything except the arm drains grey on "keep your eye on the long orange arm", colour returns and RAW 1 starts on that frame.
- PressClip — the real CBS News page (24 Jun 2022, capture_page.py) cut into two torn clippings: CBS NEWS logo + headline/byline/date,
  and the commander's "no scenario at the academy" paragraph, which slides in nearer on his words; one soft light band, no red.
- PressProof — the real WCAX page (14 Sep 2022) as a tilted printed sheet: masthead + headline, travel down, the plea paragraph peels
  up, the sheet darkens and everything after "Tallman has pleaded guilty to three felony charges in connection with the excavator
  attack." fades back. (The page's dated weather-alert bar, its publish line and the paragraph naming the son "Brian" are left out.)
- DropShaft — frozen bottom of the sweep (src 76.4): colour shaft + dashed plumb line from bucket lip to the pile.
- Brand: TitleCard, RedLabel (JUNE 14, 2022 / SCOTT ROAD, HARDWICK / HARDWICK, VERMONT / BRANDON TALLMAN, 24 / AMY TALLMAN /
  WAYNE TALLMAN, 52 / VERMONT STATE POLICE · JUNE 23, 2022 / CALEDONIA SUPERIOR COURT / teaser places), glitch + blur-dip.
  No Inset used. No Blender (not needed; Mac shared).

## Sources
- Dashcam: Vermont State Police release (23 Jun 2022) via BklynBadBoy911, https://www.youtube.com/watch?v=gqSNMka5eqI — used 0:00–1:27.35;
  1:28+ (booking/family photos inset, end card) not used. VSP's own mosaic redactions are in the picture. Troopers not named.
- Aerial: USGS NAIP ImageServer (public domain), centred on the VCGI E911 address point (VCGI ESITE layer).
- Hardwick, N Main St: Wikimedia Commons "File:N main st.JPG" (public domain).
- Caledonia County Courthouse, St. Johnsbury: Wikimedia Commons "File:Caledonia County Courthouse 5.JPG", AlexiusHoratius,
  CC BY-SA 3.0 → **credit in the description**.
- Teasers: c07 Pinellas County Sheriff dashcam (rG3pJNFW8H0, src 14.4–19.2), c08 Ball PD dashcam (vBrnBmUmVzI, src 96–101.5, cropped
  to the top 16:9 so the officer-name stamp is out of frame). Silent, under the VO.
- Facts: research/outline.md §1 (WCAX 15 Jun 2022, CBS 24 Jun 2022, VTDigger 12 Sep 2022). Wayne: convicted of aggravated assault
  (attempted murder count dropped) — never "tried to kill".
- Music: Epidemic "Music 5" −13 dB, ducked under raws. SFX: glitch/whoosh (sfx_n2), marker_1 on the strike, car_engine_2/4 beds.

## Files
media/main.mp4 (src 0–87.4), main_orig.wav, main_clean.wav (rawclean: no music found), c07.mp4 (src 7.5–21.5), c08.mp4 (src 90–110,
crop top 480x270); graded/*; graded/arm_in.png + arm_out.png (shots/armmask.py); shots/ghosts.py = an abandoned stroboscope try.

## Checks
- Stills checked: 2, 9.5, 11.3, 21, 30, 39, 47, 53.5, 64, 88, 101, 125, 129.3, 130.4, 143, 147, 155, 160.5, 166 (every device, label, raw,
  outcome, teasers). 1 fps contact sheet of the master looked at.
- First render: cutcheck 7 JUMP flags, all hard reframes of the one dashcam (19.5, 24.4, 32.5, 36.6, 42.1, 105.8, 131.0) → short
  blur-dips (10 f) added there; re-rendered.
- Known limit: one camera for the whole event (no personal-channel angle exists; only TV/agency copies), so 15–57 s is seven
  reframes of the same dashcam in a row, separated by blur-dips and varied scale; aerial, town photo, courthouse and the devices break
  up the rest.
- Section levels in the master (RMS): VO −19.5…−20.6 dB, RAW 1 −22.4, RAW 2 −24.6 (radio −18.6).

## v2 (13 Nov, owner on v1 at 2:09: court card "too much", red highlight "sloppy"; wants real source screenshots)
- ChargeSheet (re-typed charges, red strike + red rules) removed; dev file and registry line deleted.
- 108.23–115.77 the release line: PressClip on the CBS page (was full-frame dashcam + RedLabel).
- 115.77–131.03 now: dashcam wide (attempted-murder line) → PressProof on WCAX (plea) → push into the bucket ("the weapon was the excavator").
- VTDigger (12 Sep 2022, the best plea source) answers headless Chrome with a bot check, Caledonian Record with "Too Many Requests":
  not worked around. WCAX's wording ("four years probation and 90 days") differs slightly from the VO's "two to four years, all
  suspended except 90 days" (VTDigger); only WCAX's first sentence (three felony charges) is kept at full strength.
- No public photo of the property/excavator outside TV/agency stills was found worth adding; the NAIP aerial stays.
- Raws unchanged: RAW 1 13.5 s, RAW 2 (main) 23.35 s.
- Page captures: shots/cbs.png(.json), shots/wcax_plea.png(.json); pieces built by shots/clips.py → graded/cbs_head.png, cbs_quote.png, wcax_sheet.png.
