# TP23 · Cheetah Hunt stalls in the rain · Tampa, Florida (12 Feb 2014)

Code: `_engine/src/cases/TP23.tsx` · devices `_engine/src/dev/TP23_StationCrest.tsx`, `TP23_CountDiff.tsx` · out `out/TP23.mp4` (+ `_phone`).
Length 95.5 s (title 4 s + VO 49 s + three raws 41.6 s).

## Edit (cut sheet order kept)
- Title "STUCK IN THE RAIN" on the release's own frame (bucket beside the train).
- VO part 1 (0-17.09 of the take): train on the incline → wide coaster + RedLabel BUSCH GARDENS, TAMPA → ladder truck + RedLabel
  FEBRUARY 12, 2014 → **StationCrest** on "stalled on a crest not long out of the station" → ladder tower + train, wide.
- RAW 1 (cue 0:12-0:31): source 14.9-26.0 (trimmed 2.9 s head [fade-in settling] and the tail into the dissolve).
- VO "According to CNN … ponchos …": close on the blue ponchos, close on the train on the crest.
- RAW 2 (cue 0:46-1:16): source 49.9-65.0 (C shot only; its last seconds and the dissolve into D held back for VO shots; the
  0:46-0:49 start used as the "three hours" close). Small corner credit "VIDEO: TAMPA FIRE RESCUE" from here to the end.
- VO "two ladder companies" (the truck) / "cherry picker already on site" (close on the boom lift) / slow 0.5× replay of the
  bucket at the train ("an hour to get everyone off").
- RAW 3 (cue 1:16-1:37): source 80.6-95.6. Moved one sentence later than the sheet (after "…get everyone off." instead of after
  "…on site.") per the 3 Nov owner rule: the VO stretch between raws 2 and 3 would otherwise be 5.5 s.
- VO: **CountDiff** (15 vs 16, "miscounted") → truck ("Nobody was hurt") → train over the station-side building ("near the loading
  station") → wide, slowed, to the end (VO last word + 1 s hold).
- Raw lengths 11.1 s / 15.1 s / 15.0 s; VO stretches 17.1 / 6.2 / 10.4 / 15.6 s, all split at sentence ends. Each device once.

## Devices
- **StationCrest**: USGS NAIP (public domain) of the station area, graded `grade_case.py --house --nonorm`. Station building boxed
  (OSM tags it as the Cheetah Hunt station, shared with the Skyride = the old monorail station, matching Wikipedia). White line
  traced out of its south-east corner, south along the launch straight and into the wide left turn over the teal-roofed building,
  10 m ticks + running metre count (0.1256 m/px), ends at ~51 m, brackets the stall stretch, RedLabel "ABOUT 50 M OUT". (A "station" mode exists in the file but is not used: one appearance per device.)
  **How honest the crest point is:** sources say the train had "just left the station" and stopped "at a crest where the track
  begins to bank" (TFR), "on the banked crest between the first and second launches" (Wikipedia), "first embankment, before the
  main launch track" (park). The release's wide shots show the stopped train directly above a teal-roofed building with yellow
  supports and the arched brown wall beside the fire truck; on the aerial that is the start of the left turn over the teal roof.
  The exact stop point on that turn is my reading of the footage, not a published measurement, so the label says "about".
- **CountDiff**: two tallies over darkened slowed footage, park 15 vs fire service 16, the extra stroke red, dashed rule under the
  two fifteens. Names in RedLabels; no numerals (the VO says them).

## Sources
- Footage: Tampa Fire Rescue's own release, https://www.youtube.com/watch?v=Pw_TNLyNuz8 (1080p). Logo/title cards trimmed (all
  shots taken from 10.5-98.3 s). Burned-in "Tampa Fire Rescue" credit removed with delogo (bottom-right 0-31.8 s, bottom-left
  29.4 s on) and re-set as a clean small credit.
- Raw audio: `_tools/rawclean.py` → "no music detected, original kept" (spectrogram confirms: location sound changes at each shot
  change; engine idle, a pulsed pump tone, rain) → `media/main_clean.wav`.
- Aerial: USGS NAIP ImageServer exportImage,
  https://imagery.nationalmap.gov/arcgis/rest/services/USGSNAIPImagery/ImageServer/exportImage?bbox=-9175123.119790304,3253175.229096718,-9174781.740018584,3253368.2002819567&bboxSR=3857&imageSR=3857&size=2400,1357&format=jpg&f=image
  (wide overview `assets/naip_wide.jpg` also from NAIP, not used on screen).
- Track/station location: OpenStreetMap way 656050724 (track, partial) and way 524038850 (station building),
  https://www.openstreetmap.org/way/524038850 ; Wikipedia https://en.wikipedia.org/wiki/Cheetah_Hunt ;
  1st Responder News (TFR account: just left the station, crest where the track begins to bank, ~60 ft, 16 riders, two aerial
  ladder companies + on-site cherry picker, ~1 h) https://www.1strespondernews.com/news/021614100/TFR-Responds-to-Busch-Gardens-Cheetah-Hunt ;
  CNN https://edition.cnn.com/2014/02/12/us/florida-roller-coaster ; Tampa Bay Times (closed next day)
  https://www.tampabay.com/news/publicsafety/cheetah-hunt-roller-coaster-remains-closed/2165433
- Music: `music/Music 5.mp3` from 12 s, −15 dB (VO take measures −26.1 LUFS, Music 5 −20.9 → ≈10 LU under), dipped to 12 % under raws.
- SFX: real rain bed `sfx_n2/real/rain_22.wav` (looped, −17 dB, out under the raws, which carry their own rain); glitch on the two
  designed glitch cuts only.

## Downloads
- Tried `LSUDVM` 6rCAAwhnchc ("15 people trapped…", uploaded the same day): it is a FOX 13 news package with lower thirds → deleted,
  not used. Searched YouTube for other guest angles of the 2014 stall: only news packages/reuploads or other dates. No extra clips.

## Unsolved / owner should know
- The release is the only footage; every VO line is still footage-led but the four source shots are each used several times
  (different moments, reframes; same-camera joins blur-dipped).
- Faint delogo smear where the burned-in credit was (bottom corners), mostly cropped by the pushes.
