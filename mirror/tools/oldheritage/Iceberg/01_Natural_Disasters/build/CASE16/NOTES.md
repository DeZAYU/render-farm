# ND16 — Irma's surge at the glass doors, Marathon (case 16)

Code: `_engine/src/cases/ND16.tsx` · devices `_engine/src/dev/ND16_*.tsx` · output `out/ND16.mp4`, `out/ND16_phone.mp4` (≈222 s)

## Structure
TitleCard (own footage) → VO with six raws at the cut sheet's ▶ RAW cue positions and order (cues 1–5 and 9), dead air trimmed.
The VO is the continuous CASE16 take (no count word), split only at those cues (layout helper `dev/ND16_Timeline.ts`).
Raw sound = `media/rN_clean.wav` from `_tools/rawclean.py` (no music detected in any window; original kept). Clip sound only inside raws.
- cue 1 (38.2–46.2) IRM 0:14–0:22 surge slams the doors · cue 2 (61.8–70.6) IRM 1:35–1:44 water across the floor, "a foot of mud…"
- cue 3 (81.1–88.6) IRM 2:05–2:12 the pavers piled against the glass · cue 4 (94.6–103.0) IRL 0:59.6–1:08 "Hurricane Irma, we love you, please don't kill us"
- cue 5 (114.3–122.5) IRL 3:16–3:24 surge and whiteout through the doors · cue 9 (174.3–184.3) IRB 4:04.5–4:14.5 "The windows are shaking"
Cues 6–8 (IRB boat / towels / surge past the balcony) are used as footage under their VO lines instead of separate raws (no sound
moment in them, and the boat/towel pictures are what those lines describe). Profanity (IRM 2:14–2:19, IRL 2:54, IRB 2:54/3:00) is outside all raws.
No injured people / bodies / nudity in any raw: no blur needed.

## Devices (new, this case only)
- KeysTrack: Irma's HURDAT2 best track (06z 23.7N 81.3W → 12z 24.5N 81.5W → 13z landfall 24.7N 81.5W → 18z 25.6N 81.7W) on a tilted NAIP mosaic
  of the Middle/Lower Keys; landfall dot + CUDJOE KEY, date label on "Sunday the 10th"; second pass: red east-side wash, Marathon boxed.
- PressureSection: line section over the dark door footage — pane fails, wind in, interior pressure (red) pushes out, roof lifts.
- ScanReveal: Big Pine Key, USGS NAIP (before) → NOAA NGS emergency imagery 13 Sep 2017 (after), pixel-aligned (phase-correlation offset 0,0).
- DoorGauge: 5 ft / 8 ft on the pawn shop's own doors. Calibration: sill (y 627) to door handle (y 412) taken as ~3 ft (standard sliding-door
  handle height) → 71.5 px/ft. It measures from the inside sill, so it is an illustration of the survey depth, not a survey of this shop.
- BridgeTrace: Overseas Highway traced west from Marathon over the Seven Mile Bridge to Bahia Honda; bridges light red as the line crosses them.
Also: NASA MODIS (Aqua, 6 Sep 2017) push into Irma's eye for "185 mph … longer than any storm on record".

## Sources
- Footage: [IRM] https://youtu.be/n7BzBCee4iU · [IRL] https://youtu.be/jZSDVtxvlug · [IRB] https://youtu.be/1ugXgsBzEeU
- Downloads (footage/12_…/more/): Eric Isaacs, Summerland Key drone, https://youtu.be/4ANn3Qi9Nbo (15 subs; burned-in "ERIC ISAACS" watermark
  cropped out: crop 1706x960 from the top, scaled to 1080p; title/end text cards not used) · Miklos Angyal, aftermath photo video,
  https://youtu.be/oEz44LHpFZg (5k subs; stills cropped out of the pillarbox) · Technomadia Boot Key Harbor drone https://youtu.be/RveNQw2wP1Q
  (downloaded 0–8 min, NOT used: calm, post-storm, faces).
- NOAA NGS Irma imagery 20170913a: https://stormscdn.ngs.noaa.gov/20170913a-rgb/{z}/{x}/{y} (from storms.ngs.noaa.gov WMTS capabilities).
- USGS NAIP ImageServer exportImage (Keys mosaic, Big Pine Key, Marathon–Bahia Honda); black no-data water filled by normalised blur of the sea.
- NASA GIBS MODIS_Aqua_CorrectedReflectance_TrueColor 2017-09-06. NHC HURDAT2 (hurdat2-1851-2023-051124.txt), Irma AL112017.
- All stills graded `grade_case.py --house --nonorm`; footage `--house`.

## Known limits
- Two cameras ([IRM], [IRL]) are in the same shop; IRB is a nearby condo balcony. "a boat was torn right off its lift" is shown with IRB's boat
  in the fog (the lift itself is not identifiable), then a sunk boat at its dock (Angyal photo, Summerland Key).
- Towels: IRB shows towels packed under a window sill, the VO says "door" (cut sheet's own pick).
- Merkel-style outcome footage n/a; the outcome is shown with aftermath photos/drone (Big Pine, Summerland, US-1).
- Music: Epidemic ambient Music 4 at −21 dB (file −11 LUFS), out under every raw.

## cutcheck allow (3 Nov)
`--allow 23.3-23.7,45.6-45.9,61.6-62.0,80.7-83.0,86.3-86.7,93.2-97.9,112.9-113.1,161.1-161.5`: 23.5 = designed whip cut into the MODIS shot; 80.7-83 = PressureSection's designed door-fail glitch + shake; the rest handheld shake / pan / whiteout flicker inside source clips (raws and last IRM shot), no cuts. Checked on 10-frame strips. Pavers raw (cue 3) dropped: VO stretch before the next raw was 5.3 s.
