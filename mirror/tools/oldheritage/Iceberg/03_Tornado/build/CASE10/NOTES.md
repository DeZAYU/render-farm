# TOR10 — Driving into the debris · Gaylord, Michigan (20 May 2022)

Out: `out/TOR10.mp4` (81.5 s, −16 LUFS), `out/TOR10_phone.mp4`. Code: `_engine/src/cases/TOR10.tsx`. Cutcheck: 24 cuts, **0 flags**.

## Edit
Title (own frame, "DRIVING INTO THE DEBRIS") → RAW A (0:02–0:09, the strip in the rain, real clip sound) → VO1 → RAW B (0:36–0:49,
the tornado and debris cloud ahead) → VO2 over a 0.5× replay of the debris cloud → RAW C (0:49–1:00.6, poles leaning, debris on the
windshield; ends before the source cut to black at 1:00.9) → VO3 (toll + aftermath). "Ten." dropped; VO split only at the raws.
Clip sound only inside raws (−4 dB, faded out before the VO). Music: Epidemic ambient Music 1 at −17 dB under the VO, out for raws.

## Devices (new for this case)
- **PhoneTilt** (`dev/TOR10_PhoneTilt.tsx`): the 240×426 vertical clip kept vertical in a white-framed panel turning in 3-D over its
  blurred copy (RAW A, RAW C). Other phone shots use Shot_FX `fill` (blurred same-clip sides).
- **PlateTilt** (`dev/TOR10_PlateTilt.tsx`): USGS NAIP flown **11 Aug 2022** (12 weeks after; catalog item m_4508459_sw_16_060_20220811)
  as a 3-D plate, camera lowers onto the cleared lots of Nottingham Forest.
- **EmberLens_N2P** page (2 runs): the NWS Gaylord damage-survey statement (PNS, IEM archive): "3:35 PM EDT / 6 S Elmira / Antrim County",
  then "Rating EF3 / 150 mph". Note: the template's highlight is orange (kit template look), not channel red.
- Brand Aerial on the same NAIP: the M-32 strip (GAYLORD, MICHIGAN) and Pine Ridge Square still being rebuilt (AUGUST 2022).
- Neighbour check: TOR09 = FujitaGauge / SlideProjector / PathMap / PageLight; TOR11 = SatDive / JmaSheets / FreezeBracket. No overlap.

## Sources
- Footage: https://youtu.be/HhC4YvoQnko (only clip; 240×426 — soft when enlarged, framed small/vertical on purpose).
- NWS PNS (survey): https://mesonet.agron.iastate.edu/p.php?pid=202205220033-KAPX-NOUS43-PNSAPX
- NWS Gaylord photos, public domain (Wikimedia Commons, author NWS Gaylord): aerial of the path, mobile home community, home shifted off
  foundation, EF3 house, significant home damage, Hobby Lobby (Pine Ridge Square anchor), tree damage — URLs in `assets/commons/SOURCES.txt`.
- NAIP: USGS NAIP ImageServer (public domain).
- Pine Ridge Square = 1401 W Main St; Hobby Lobby is one of its anchors (Gaylord Chamber listing / rejournals sale notice).

## Could not solve / owner should know
- No other angles downloaded: yt-dlp hit YouTube's bot check (not bypassed). The single 240p clip is the only footage.
- "FEMA turned down the request" has no capturable source page (michigan.gov answers with a bot check) → a NWS damage photo plays under it.
- Script says "twenty-two minutes across town"; NWS PNS gives 3:35–3:55 (20 min); the NWS summary graphic says 22 min. VO kept as written.
- Pine Ridge "March 2024" completion is the script's fact; I could not confirm the month in a quick search.

## 3 Nov raw audit (owner: raws only at incident moments) — supersedes the edit/devices above where they differ
- Raws 3 -> 2: RAW A 4.0-11.0 (7.0 s, src 0:02-0:09); MAIN RAW 24.0-48.1 (24.1 s, src 0:36.5-1:00.6, one continuous `gay_clean.wav`,
  ends before the source cut at 60.9). Old RAW B + RAW C merged; "first tornado to hit Gaylord since 1950" now plays after it (48.2) over the 0.5x replay.
  Picture inside the main raw: PhoneTilt (0:36.5-0:49) -> blur-dip -> fill (0:49-1:00.6). Duration 81.4 s unchanged.
- EmberLens_N2P removed. New device **NwsPhone** (`dev/TOR10_NwsPhone.tsx`, 17.0-22.0): the PNS re-typeset sharp on a phone, tap on
  Start Time, row expands to "3:35 PM / 6 miles south of Elmira, Antrim County"; credit small. The EF3 line (52.8) is now the NWS
  photo devast.jpg + RedLabel "EF3 · 150 MPH" (no second document device).
- `fill` shots varied: 13.7 fill, 22.0 fill, raw part 1 PhoneTilt, raw part 2 fill, replay 48.1 full-frame crop.
