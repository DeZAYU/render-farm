# TOR20 · The town that was erased · Manchester, South Dakota (24 Jun 2003)

## 3 Nov raw audit (owner: raws only at incident moments) — supersedes the edit below
Raws 6 -> 4: RAW 1 (4.0-19.8, 15.8 s), RAW 3 (44.0-51.5, 7.5 s), RAW 5 (57.92-69.32, 11.4 s), RAW 6 (81.62-95.72, 14.1 s). Removed RAW 2
"debris falling" (after the F4 width/track stats, near-dup HILL) and RAW 4 (after the 260 mph survey line); the VO between RAW 3 and RAW 5
is now the survey line + "It's about to reach Manchester." Inset only once (El Reno); the Manchester probe is a full-frame push + RedLabel.
Music 5 offsets re-spread so the last bed no longer runs past the file's end. 153.12 s.
Cutcheck: 20 cuts, 0 flags (designed transitions +-0.35 s). Rendered 3 Nov 05:40.
Out: `out/TOR20.mp4` (178.4 s, −16 LUFS) + `out/TOR20_phone.mp4`. Cutcheck: see bottom.

## Edit (cut sheet order, raws trimmed to the moment)
TitleCard on the HILL wedge → RAW 1 (15.8 s, HILL: "significant tornado damage … violent F4 F5 … hope I didn't destroy anybody's house")
→ VO 1 (date / county labels, OutbreakClock, chasers, F4, POL1) → RAW 2 (14.3 s, HILL: "look at the motion in the base … big chunks of
debris falling") → "The next thing in its path was a town." over the 1991 USGS aerial (Aerial box + label) → RAW 3 (7.5 s, POL1 wind)
→ "survey … 260 mph" over the NWS survey aerial → RAW 4 (11 s, POL1: "We don't have time!") → "It's about to reach Manchester." →
RAW 5 (11.4 s, POL3 over the parked cars) → outcome (NWS foundation photo, all six survived) → RAW 6 (14.1 s, HILL rope dying: "I wonder
if anybody got hurt or killed") → Samaras block: probe photos, PressureTrace, GhostFade, NAIP town site today, El Reno car (NWS),
closing on an empty Manchester foundation. VO = one take (no count word in this take), split only at the raws. Music 5 (−13 dB), only
under VO stretches.

Raw audio: all six raws through `_tools/rawclean.py` (guide 5b) → `media/rw1..6_clean.wav` (no music detected in any; rw3 levelled
+6 dB). Raws sit at the cut sheet's six ▶ RAW cues in order. No blur needed (no injured people/bodies; El Reno car shown without anyone).

## Devices (new)
- `TOR20_OutbreakClock` — all 66 SD tornado rows in the SPC database for 2003-06-24 drop on NASA Blue Marble at their own start time
  (4:15–9:50 PM CST) while an hour rail runs; Kingsbury County + the Manchester F4 track light up at the end.
- `TOR20_PressureTrace` — probe 3's barometric reading, digitised from the public-domain chart (courtesy Tim Samaras), drawn in real
  order; "82 SECONDS" bracket (probe down → dip at ~84 s) and "100 MILLIBARS" bracket (950 → 850 mb); then a height rail (ground → about
  1 km up; 100 mb ≈ 900–1000 m in the standard atmosphere).
- `TOR20_GhostFade` — 1991 USGS aerial, brackets close on each building, the 2004 USGS aerial (registered on the street grid) dissolves
  in under them.
- Brand: TitleCard, RedLabel, Aerial (1991 town, NAIP town site today), Inset (Manchester probe, El Reno).

## Sources
- HILL https://youtu.be/uqNkAeU39gY ("www.stormchase.net" watermark delogo'd), POL1 https://youtu.be/43nv6terLrY, POL3 https://youtu.be/BKb7eSNqjWs.
- SPC actual tornadoes 1950–2024 CSV: https://www.spc.noaa.gov/wcm/data/1950-2024_actual_tornadoes.csv ; TIGERweb state/county outlines;
  NASA GIBS BlueMarble_ShadedRelief.
- Wikimedia Commons: "Manchester SD USGS aerial 1991.jpg" + "Manchester SDUSGS aerial - 2004.jpg" (PD, USGS; the burned-in placemark
  text/icon cropped/patched), "2003 Manchester tornado damage.jpg" + "NOAA NWS June 2003 damage survey.jpg" (PD, NWS),
  "TWISTEX HITPR Probe.jpg" (CC BY 3.0, Laubacht — credit in description), "Turtle Probe, measured Manchester Tornado barometric
  pressure, 2003 - Museum of Science and Industry (Chicago)" (CC0, Daderot), "Manchester pressure deficit.gif" (PD), "2013 El Reno tornado
  Samaras Car.jpg" (PD, NWS Norman).
- USGS NAIP (town site today, geocoded via OpenStreetMap Nominatim 44.369, −97.721).

## Decisions / notes
- The VO says 67 tornadoes; the SPC database holds 66 SD rows for the day (the 67 count comes from the outbreak summaries). The map shows
  the 66 database rows; no number is written on screen.
- POL1/POL3 are 15 fps; converted to 30 fps (frame repeat). POL3's later part shows a private person's face (0:90–1:40): not used.
- The intro's cold-open line is in case 19's source, not here; no lines are shared with other cases.
- No extra downloads (YouTube bot check on yt-dlp; not bypassed).

## Clip repair (2 Nov, 21:40)
The first render (cutcheck 52 flags) showed the HILL tape's own dropouts (1–2 dark noisy frames every ~0.4–0.9 s, in the source upload too)
and the POL1/POL3 15 fps frame-repeat cadence (read as JUMPs). Fixed in `graded/` (originals kept in `graded/_orig/`): dropout frames
replaced by the mean of their neighbours, then ffmpeg `deflicker=size=9:mode=pm`; POL1/POL3 repeated frames replaced by a 50 % blend of
the neighbours, then the same deflicker. Script: a streaming numpy pass (dips / dups), rescan = 0 luma spikes. Re-rendered.
Re-render 22:38: `out/TOR20.mp4` 178.5 s, −16 LUFS, + phone copy. Cutcheck: 20 cuts, 0 flags.
