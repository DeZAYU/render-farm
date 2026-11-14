# TOR18 · The tornado nobody warned about · Frankfort, Kentucky (6 Dec 2021)
Out: `out/TOR18.mp4` (80.8 s, −16 LUFS master) + `out/TOR18_phone.mp4`. Cutcheck: 0 flags (allowed = designed glitch/blur-dip/whip/zoomHit windows, the
debris climax 41.2–58.0 and the post-impact debris footage 63.9–80.8, where the doorbell picture itself is chaotic).

## Edit
TitleCard on the darkened porch → RAW 1 (3 s, porch + rain, own sound) → VO line 1 → RAW 2 (9 s, rain building) → VO line 2 → RAW 3 climax
(16.2 s uncut, the tornado reaching the porch) → 0.5× replay under "EF1, about ninety miles an hour" → VO to the end, closing on the porch
after (same camera that opened the case). VO = one take, "Eighteen." cut (startFrom 1.06 s), split only for the raws. Music 4 (−21.5 dB,
≈10 LU under VO), low under raw 2, out for the climax, back for the aftermath.

Raw audio: all three raws through `_tools/rawclean.py` (guide 5b) → `media/rw1..3_clean.wav` (no music detected, original kept).
No blur needed (no people in the raws).

## Devices (new, in `_engine/src/dev/`)
- `TOR18_StampLoupe` — frozen doorbell frame, white corner brackets close on the camera's own burned-in clock (2021-12-06 04:10:38 AM)
  and the camera pushes into it: "before dawn" comes from the footage itself.
- `TOR18_RadarSweep` — real IEM NEXRAD n0q mosaic 09:10 UTC (= 4:10 AM EST) over NASA Black Marble city lights; the Louisville radar
  beam turns once, painting the squall line; the tornado is a red pulse at Frankfort that appears after the beam passes and is gone
  before it comes back ("quicker than a radar can finish one scan").
- `TOR18_SkipPath` — the NWS damage-survey path drawn to scale (50 yd wide) on USGS NAIP, lifting once and ending on US 127, with the
  Census TIGER Frankfort city-limits boundary dashed in ("just outside the city limits, off Highway 127").
- Brand: TitleCard, RedLabel (FRANKFORT, KENTUCKY), Inset (a roof piece flying).

## Sources
- Footage: UniFi doorbell camera, NWS Louisville release https://youtu.be/ZousteWoWOQ (UniFi logo + clock delogo'd; the clock is only shown
  untouched in the StampLoupe).
- NWS LMK Public Information Statement (survey: EF1, 90 mph, 1.5 mi, 50 yd, 4:10–4:12 AM EST, 38.23/−84.88 → 38.24/−84.86):
  https://mesonet.agron.iastate.edu/cgi-bin/afos/retrieve.py?pil=PNSLMK&sdate=2021-12-06&edate=2021-12-10
- Radar: https://mesonet.agron.iastate.edu/archive/data/2021/12/06/GIS/uscomp/n0q_202112060910.png ; base: NASA GIBS VIIRS_Black_Marble.
- Aerial: USGS NAIP ImageServer; city limits: TIGERweb Incorporated Places (Frankfort city).

## Decisions / notes
- The private house is never marked; only the NWS path (public) is drawn. The PNS endpoints are 2-decimal; the end was snapped to US 127
  (the survey says the path ended on the 6000 block of Owenton Rd = US 127).
- The camera's 78–80 s audio drops out (source); not used inside a raw.
- No extra downloads (YouTube now bot-checks yt-dlp; not bypassed).

## 3 Nov raw audit (owner: raws only at incident moments, never during explanation)
- Raws 3 -> 2: removed raw 1 (the 3 s calm porch cold open). The VO starts at 4.16 right after the title, over the porch camera's frozen
  frame (StampLoupe). Raw audio now named per raw (rw2/rw3_clean.wav).
- Raws now: rain building (9.0 s, 15.1-24.1), the hit (16.2 s main, 38.5-54.7). Duration 77.8 s. Stale out/TOR18_extend.json deleted.
- Cutcheck 0 flags with the same extra allow as before: the climax raw 38.2-55.0 and the post-impact debris footage 60.9-77.8.
