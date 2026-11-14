# TOR11 — A Sunday lunchtime in Ibaraki · Tsukuba, Japan (6 May 2012)

Out: `out/TOR11.mp4` (163 s, −16 LUFS), `out/TOR11_phone.mp4`. Code: `_engine/src/cases/TOR11.tsx`.

## Edit
- VO opening: the take says "Eleven takes us to Japan, where tornadoes…". Dropping only "Eleven" leaves a broken "takes us to Japan",
  so the case starts on "where tornadoes are usually small and over quickly" over the satellite view of Japan with the red JAPAN label.
  If the owner prefers the full first sentence, change VO[0] start from 1.55 to 0.0 and shift the timeline by 1.55 s.
- 6 raws as in the cut sheet, trimmed to 9–12 s each (the part where the picture/sound is the moment); the clips' own sound (wind,
  the filmers' voices) only inside raws, each normalised to ~−22 LUFS, faded before the VO. Music: Epidemic ambient Music 4 at −22 dB,
  under the VO only.
- Deliberate replays: freeze + brackets on the debris skirt (JUNKO2 at 0:09, seen in RAW 1) and a 0.5× replay of the funnel over the
  golfer (GOLF 1:29) under "It weakens right over him".

## Devices (new for this case)
- **SatDive** (`dev/TOR11_SatDive.tsx`): NASA Aqua MODIS true colour of 6 May 2012 (~13:30 JST pass, ~40 min after the tornado) from
  NASA GIBS: Japan, then Kanto with the storm's anvil over Ibaraki; pins JOSO / TOKYO / TSUKUBA as spoken.
- **JmaSheets** (`dev/TOR11_JmaSheets.tsx`): JMA's 7 May 2012 press release ("Fujita scale F2") boxed on a desk, the 8 June report slides
  on top ("F3" boxed); later the report's 17 km damage map and its Hojo damage aerial (GSI photo, 7 May 2012) lift off the page.
- **FreezeBracket** (`dev/TOR11_FreezeBracket.tsx`).

## Sources
- Footage: https://youtu.be/lEatd8alZA8 (JUNKO2), https://youtu.be/nV87QZ66KP8 (JUNKO), https://youtu.be/_LBvm4L2YQs (GOLF).
  Audio checked by spectrogram: wind + speech, no added music found.
- JMA: https://www.jma.go.jp/jma/press/1205/07a/toppu120507.pdf , https://www.data.jma.go.jp/obd/stats/data/bosai/tornado/special/2012/tyousa-houkoku.pdf
- NASA GIBS WMS, layer MODIS_Aqua_CorrectedReflectance_TrueColor, TIME=2012-05-06.
- Commons photos (CC0, On-chan): Hojo damage 01/02, apartment; (CC BY-SA 3.0, JGSDF): 2012 Ibaraki tornado outbreak + EA-MT disaster
  relief photos — `assets/commons/SOURCES.txt`. CC BY-SA needs attribution in the video description: "Japan Ground Self-Defense Force, CC BY-SA 3.0".

## Could not solve / owner should know
- No free photo of the BRI's overturned house with its mat foundation; the JMA Hojo damage figure + GSDF wreckage photos are used.
- "One boy lost his life" plays over the damaged apartment block photo (no person shown).

## Render (2 Nov, 23:05)
`out/TOR11.mp4` 163.1 s, −16 LUFS, + phone copy. Cutcheck: 30 cuts, 0 flags. The first render flagged the four golf-camera joins
(92.7 / 94.2 / 103.2 / 104.75: same camera, other moment) → blur-dips added; 76.3–76.9 allowed: the filmer swings the phone inside RAW 3
(JUNKO src 55.6, a real camera move, not an edit).

## 3 Nov raw audit (owner: raws only at incident moments) — supersedes the timings above
- Raws 6 -> 3: RAW 1 27.85-36.85 (9.0 s, JUNKO2 0:02-0:11), RAW 5 73.75-83.75 (10.0 s, GOLF 1:24-1:34), MAIN RAW 6 87.25-98.25
  (11.0 s, GOLF 2:53-3:04). Removed RAW 2 (near-dup of RAW 1), RAW 3 (after the path-width line), RAW 4 ("That hut was built for rain.
  It's coming his way." now runs straight into RAW 5). "It's coming his way." plays over JUNKO 0:58 (silent) so the golf camera never runs 5 shots.
- FreezeBracket removed. New device **LightTable** (`dev/TOR11_LightTable.tsx`, 36.85-40.62): the 0:09 frame (`graded/junko2_f9.jpg`)
  as a print on a light table, a loupe slides onto the debris skirt, red tag SOIL + DEBRIS.
- Duration 163.0 -> 132.0 s.
