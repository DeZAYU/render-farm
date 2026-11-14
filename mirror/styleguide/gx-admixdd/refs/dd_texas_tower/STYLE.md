# dd_texas_tower: Disturbing Dose, "96 Minutes of Terror: The Texas Tower Sniper Rampage (1966)"
20:45 (1245.4 s). Source decoded as 1920x1080, 59.94 fps AV1 + Opus. Analysed 2026-11-14. Style only; never copy its footage.
Method: scene detect (0.3 at 30 fps, then 0.12 at 10 fps), blackdetect, ebur128, band envelopes (numpy), 10 s contact sheets (125), 30 fps stepping of 2.4-4.8 s and 0-50 s at 2 fps, ORB scale tracking, pixel stats. 39 stills in `gate/`.

## What this reference owns (summary)
1. Story from almost no motion footage: ~85% archive photos/old film/docs, drawn on with a few DESIGNED layers (about 8-12% of runtime): corkboard with red string, portrait name cards, map with red dots, red-tag callouts, typed/handwritten pages with red redaction bars.
2. One accent colour: signal red (#c60f10 / #b60b0f / #a90c0e / #bd0c0d) only on tags, strings, highlights, map dots. Everything else is B&W (median saturation 1.1%).
3. One type voice: a Trajan/Cinzel-like humanist small-caps serif (white, soft shadow) for dates, quotes, name tags, subtitles. Red-box caps tag for callouts. Never anything else.
4. Cuts are slow: median shot 4.6 s (events/min 8.1 incl. cuts inside archive film); photos held 8-15 s on a 0.4%/s push.
5. Fade THROUGH black is the main transition: 48 black dips (2.3/min, median 0.8 s, range 0.1-2.2 s). Cross-dissolve/double exposure rare (23 multi-frame events, 1.1/min, mostly 0.2 s).
6. Heavy vignette (corner/centre luma 0.53), film grain, soft mono grade; colour archive stays colour (13/120 frames sat>15).
7. Audio: one deep male VO wall to wall (VO gaps median 0.6 s, none >=2 s), music/drone bed 15-20 dB under, sub hits clustered in action (up to 22/min at 14:00-15:00), no raw clip sound under VO; integrated -16.5 LUFS, LRA 2.9, TP +0.5 dBFS.
8. Tiny source credit bottom-left on every visual ("Photo: AP Images", "Film: The Deadly Tower (1975)"), about 1% frame height, grey.
9. Censorship: coarse pixel mosaic over the body (16:50), no bleep.
10. Chapter rhythm: cuts/min lowest on intimate sections (3.1 at night-before) and highest at climax and ending (13.2 final confrontation, 19.5 in missed-warnings montage).

## 1. Cuts
Whole video: 168 cut events by 0.12 scene threshold = 8.1/min; mean shot 7.4 s, median 4.6 s, p10 1.5 s, p90 20.1 s. (At 0.3 threshold: 137 cuts, 6.6/min, median 5.4 s; dissolves and Ken Burns holds are missed.) Some cuts are inside the archive film itself.
By section (cuts / per min / median shot):
| s | section | cuts | /min | median s |
|---|---|---|---|---|
| 0-43 | cold open + title (corkboard) | 9 | 12.6 | 2.8 |
| 43-104 | childhood | 5 | 4.9 | 9.6 |
| 104-197 | first warning signs | 12 | 7.7 | 7.0 |
| 197-259 | life spiral | 6 | 5.8 | 8.7 |
| 259-313 | psychiatrist | 6 | 6.7 | 5.1 |
| 313-406 | why tower vulnerable (aerials) | 17 | 11.0 | 3.4 |
| 406-483 | night before (letter pages) | 4 | 3.1 | 11.8 |
| 483-539 | murders mother/wife | 9 | 9.6 | 2.9 |
| 539-592 | preparing | 5 | 5.7 | 6.8 |
| 592-693 | enters tower | 8 | 4.8 | 6.7 |
| 693-796 | shooting begins | 12 | 7.0 | 4.9 |
| 796-865 | chaos | 14 | 12.2 | 3.2 |
| 865-942 | attempts to stop | 8 | 6.2 | 5.2 |
| 942-1005 | officers climb | 11 | 10.5 | 4.2 |
| 1005-1064 | final confrontation | 13 | 13.2 | 2.5 |
| 1064-1167 | autopsy / tumor | 7 | 4.1 | 7.3 |
| 1167-1210 | missed warnings | 14 | 19.5 | 1.6 |
| 1210-1245 | policing change / outro | 8 | 13.6 | 3.4 |
First 90 s 8.7/min; 90-600 s 7.1/min; 600-1245 s 8.8/min. Pace: slow in personal/doc sections, fast in action and the final montage.

## 2. Intro (0-45 s) frame-stepped
- 0.00 s: starts mid-action on archive film (blurred, grain, vignette), no fade-in from black (first 0.1 s black). Source credit appears at 0.5 s bottom-left.
- 0.2-2.5 s DATE LINE "August 1, 1966": small-caps serif, centred lower third (y about 80% of frame height, cap height about 3.5%), white with soft drop shadow. Fades in over about 0.6 s (0.2-0.8 s), holds about 1.7 s, fades out 2.4-2.8 s (about 0.35 s). Sits on VO date line.
- 2.95 s hard cut to aerial of tower (tilt-shift look, B&W, slow push).
- 3.2-3.4 s thin red leader line draws from the tower top to the right (about 0.2 s).
- 3.35-3.55 s "SNIPER" red tag (#c60f10 box, white serif caps, about 2.7% height) wipes in left to right (about 0.2 s, 6 frames).
- 3.60-3.75 s mugshot card (white-bordered B&W portrait, about 17% frame width x 22% height) wipes up from its bottom edge (about 0.15-0.25 s). Whole group then drifts with the aerial push (about 0.5%/s) and holds to the cut at about 8.9 s (hold 5.3 s).
- 6.8-7.1 s bottom-centre location caption "UNIVERSITY OF TEXAS TOWER" (white serif caps with black outline, about 2% height) fades in (0.3 s), holds to the cut (about 2 s).
- 9.1-14.4 s two archive shots (tower clock close push; running students), then fade to black 14.4-15.7 (black 14.9-15.7, 0.8 s).
- 15.2-17.2 s "Over the next 96 minutes": serif small caps, wipe-reveal by word (left to right, "96 minutes" lands about 0.5 s after "over the next"), over the clock facade; holds about 1.4 s.
- 17.3-22.0 s crowd archive; 19.0-21.5 s "DEADLIEST / MASS SHOOTING" stacked two lines (line 1 about 4% cap height, line 2 about 2.8%), left-aligned, wipe reveal per line (about 0.35 s each), hold about 1.2 s, fade out with the shot 21.7-22.3; black 22.3-23.1.
- 23.1-29.8 s TITLE DEVICE: corkboard (dark grey cork, vignette) with portrait, wedding photo, Rx slip, green "Daily record of C.J. Whitman" book note, newspaper clipping with tape, rifle photo, red-pin on portrait forehead. Red tag "THE SNIPER" with small white "DISASTER THEORY" sub-tag (above-left) sits under the portrait, tilted 3-4 degrees. Red string draws between pins 24.5-28.9 s (about 4.5 s, lines grow pin to pin, ease-out), camera drifts and pushes (25 s to 29.5 s about 18%/s toward portrait), then whip push into brother photo 29.6-30.5 s, motion-blur, resolves into a black vignette extreme close-up of the face (30.8-35 s, slow push 8%/s, AP grain). Hard cut at 35.3 s.
- 35.3-45 s family photos; black dip 45.0-45.4; 45.4-51 s VO-free beat (see audio).
- There is no channel logo/title card; the "title" is the corkboard (about 6.7 s) with the tag acting as the title.

## 3. Rest of video: device kinds and counts (from 10 s sampling + 30 fps checks)
| device | count (approx) | notes / timecodes |
|---|---|---|
| Name card (portrait in rounded card on dark cork-grey, name small-caps white, role in smaller caps grey beneath) | 11+ | 0:50 Whitman, 4:20 Heatly, 10:30 two victims side by side, 11:50 Roy Schmidt, 12:20 Karen Griffith, 13:00 Paul Sonntag (red-box variant) |
| In-photo lower-left name tag (serif, name over role, no card) | 8+ | 7:20 "Margaret Whitman / Charles Whitman's Mother", 10:00 Edna Townsley, 15:20 Allen Crum |
| Place tag on photo ("Apt. / Margaret", "906 W. / Kathy Whitman") | 3 | 7:40, 8:10 |
| Date/time caption (serif small caps, lower third) | 8+ | "July of 1959" 1:25, "July 31, 1966" 6:28 on typewriter, "1:24 PM" 16:50 |
| Pull quote in serif caps (2 lines) | 5+ | 2:00 "A man could hold off an army…", 15:40 "We had to turn up the last turn of the stairs." (2 lines), 16:00 "At any second." |
| Single-word kinetic caption | 2+ | 19:40 "Killed" fading with a drone |
| Typed document, red highlight/redaction bar | 7+ | 4:30 (red bar + black ID label), 6:40-6:50 letter, 8:20, 12:30 police report (red tab), 19:30 newspaper (red highlight bar) |
| Handwritten note full-frame, slow pan down | 3 | 7:50-8:10 |
| Red-box callout label with leader line | 3 | 0:03 SNIPER, 18:00 "TUMOR" on brain photo, 13:00 "THE DRAG" |
| Designed map (flat beige map, red dots for victims, red label box + photo card) | 2 | 12:50 map with dots, 13:00 zoom to "The Drag" tag + portrait with red outline |
| Archival aerial map photo with figure icons (annotated by source) | 1 | 11:30 |
| Prop shots (green daily record book, typewriter keys, folding photo frame, guns on table) | 5 | 2:50, 6:30, 7:00-7:10, 8:50-9:10 |
| Double exposure / slow cross-dissolve | 2+ | 19:20 tower over the Dr. Heatly interview |
| Fade through black | 48 | see section 5 |
| Pixel mosaic censor | 1+ | 16:50 |
| Colour-tinted raw footage (blue/green LUT) | 4 | 14:50-16:30 stair/deck corridor shots tinted violet/green |
Later sections repeat devices (name cards, tags, documents) and vary shot type; the second half uses more archive film (The Deadly Tower 1975 re-enactment, Texas Archive) and fewer designed layers; the last 3 min is almost all archive with no designed devices.
Footage vs designed: about 88-90% archive photos/film/scans, about 10-12% designed layers (corkboard, name cards, maps, tags, text); about 4% pure black.

## 4. Text
- Face: humanist Roman-capital serif (Trajan/Cinzel-like; actually small-caps lowercase set as real small caps with old-style figures: "1:24 PM", "August 1, 1966" show true small caps), weight regular to semibold. Not condensed. Caps for quotes/tags, initial caps + small caps for names/dates.
- Colours: white (#f2f2f2 median, 243 sampled) with soft dark shadow/halo; role line grey-white about #b8b8b8; red tag #c60f10 (tag box with serif caps white text), highlights on documents #b60b0f-#c60f10 at about 90% opacity (bar over text).
- Sizes (% frame height, cap height estimates): name line 2.9-3.2%, role line 1.5%; date/quote 3-3.5%; DEADLIEST 4%; red tag caps 2.7%; location caption 2%; source credit about 1%.
- Positions: name cards: portrait centred, name under it left-aligned to card (about y 66-72%); photo name tags lower-left at x 17-50%, y 70-73%; dates centred at y 80%; quotes lower-left or lower-centre in 2 lines at y 76-90%; location caption centred y about 95%.
- Entrance: wipe/reveal left to right per line (0.2-0.35 s), or fade (0.35-0.6 s) for dates. Exit: fade 0.3-0.4 s or ride out with the shot's dip to black. Hold: dates 1.7-2 s; tags 3-5 s; quotes 3-4 s; name cards 4-9 s (whole card shot).
- Document text is the real scan; highlight is a flat red bar drawn on after about 0.5 s (wipe left to right, 0.4 s); redaction bar black with white ID label.
- Source credit: 5-6 px high grey text bottom-left, constant on all archive.

## 5. Transitions
- Fade through black: 48 over 20.75 min (2.3/min); median 0.8 s (about 24 frames at 30), range 0.1-2.2 s; the long ones (1.5-2.2 s) close sections (229.7, 390.7, 511.3, 661.1). Dips also fall at the chapter boundaries.
- Hard cut: the rest of cuts (about 120).
- Cross-dissolve / double exposure: 23 multi-frame events (1.1/min), median 0.2-0.5 s; one long double exposure at 19:20.
- Wipe-up on mugshot, wipe-right on tags, whip push into photo at 0:29.6 (motion blur, 0.9 s).
- No glitch, no spin, no whip pans otherwise.

## 6. Footage framing, maps, pages
- Archive photos fill the 16:9 frame by cropping/pushing (no blurred-background pillarbox seen); 4:3 portraits go in the rounded name card on dark texture, centred; faces cropped in extreme closeup with vignette (0:30, 4:40).
- Ken Burns: slow push about 0.8%/s scale (ORB-measured 0.8% per s on the 7:20 family photo) plus about 0.5% frame drift; vs fast 8%/s push on the face close-up 30.8-34 s.
- Maps: real archive aerial (B&W, tilt-shift) plus designed flat map with red victim dots and place labels; an annotated aerial with numbered figures (11:30). Map is used as geography proof for "where were victims" (12:50-13:10 about 20 s total).
- Documents: full-frame scans with their own texture, slow downward pan, red highlight and a black ID label; 6:40-6:50 shows two highlights wiping on in sequence; letter pages 7:50-8:30 handwriting full frame 10-20 s.
- Freeze/replay: no freezes seen; the same photo reused (Whitman face at 0:30, 1:40, 3:00, 4:40, 7:30, 20 s apart) with different crops.

## 7. Case anatomy (single story)
- Opens mid-footage with date line (no black, no logo); the date + location + "Sniper" tag lay out who/where/when in 9 s.
- 15-25 s: stakes lines ("Over the next 96 minutes", "Deadliest mass shooting"), then dip to black.
- 23-30 s: corkboard title (the real title), then 35 s into childhood.
- Chapters (from info.json): 18 chapters, 5 to 105 s long; each opens on a dip to black or a hard cut, with a date caption or a name card within the first 10 s.
- First VO word after a dip: about 0.3-0.6 s after picture returns (VO gaps typically 0.6 s).
- Raws (clip sound): none heard under the VO (VO plus score all the way). The only music-only beat: 45.4-51.0 s (5.6 s) after the dip, bed lifts 8 dB to -28.5 dBFS RMS.
- End: last 35 s fast archive montage (13.6 cuts/min) with VO fading, tail -29 dB in the last second; no end card/outro device seen in the last 5 s (fades with archive).

## 8. Audio
- Integrated -16.5 LUFS, LRA 2.9 LU (very flat), true peak +0.5 dBFS (hot), per-minute momentary mean -17 to -19 LUFS.
- VO: low male, f0 about 100-200 Hz, speech band 300-3400. VO window RMS -17.7 dB; gaps (lowest 8% of windows) -37.7 dB; so bed sits at least 15-20 LU under VO. Music-only lift 45.5-50.5 s -28.5 dB (about 10 dB above gap level).
- VO gaps >=0.4 s: 53 (2.6/min), median 0.6 s, p90 1.2 s, max 1.65 s; no gap >=2 s: dense wall of VO.
- Under-VO bed: sustained sub drone 25-80 Hz plus a slow harmonic pad (150-700 Hz visible at 45-51 s); no beat. Opening 0-3 s has a loud sub boom/riser (RMS -15 dB, loudest 3 s of the video) over the first shot.
- Sub hits (>=9 dB above 3 s median in 25-80 Hz): 125 in total (6.0/min), by minute 0:8, 1:3, 2:9, 3:4, 4:7, 5:2, 6:7, 7:2, 8:0, 9:0, 10:8, 11:17, 12:8, 13:13, 14:22, 15:10, 16:0, 17:5, 18-20:0. They mark chapter transitions, date lines (e.g. 10.4, 12.5, 15.8 s) and the shooting from 10:00 (601 s) onward.
- High-band transients (3.4-7.5 kHz, 10 dB over bed): mostly VO sibilants, not usable as SFX count.
- Silent beats: black dips are not silent (bed and VO continue); only 4.1% of windows below -40 dB RMS.
- Duck under raws: no raws present.
- Level changes after dips: VO continues through; bed does not drop.

## 9. Grade
- From 120 sampled frames: median saturation 1.1% (mean 5.5%, p90 17.5%); 13 of 120 samples sat>15 (colour archive at 0:30 tint, 1:30 colour photo, 2:50 green book, 8:30-8:40 pink-toned colour, 9:30, 16:50, 17:00, 17:30, 17:50, 18:00, 19:00, 19:30).
- Luma: black point median 7/255 (0.5 percentile), white point 210/255 (99.5 percentile), mean luma 92: crushed shadows, no clipped whites.
- Vignette: corner/centre luma ratio 0.53 (strong, applied to everything including documents, which show soft edge falloff).
- Grain: visible on closeups, AP photos halftone; film gate flicker on archive film.
- Look layers: B&W sepia-neutral with slight cool tint in the corridor shots (14:50-16:30 violet/green cast), black wipe/vignette overlay; red the only accent.

## 10. Censorship
- 16:50 body in archive photo covered by coarse pixel mosaic (about 24-30 px blocks, soft, not blur) from lower-right; the "1:24 PM" date caption sits above it. No bleep heard in the audio around it (no bleep spectral line in 16:40-17:00).

## Failures / limits
- ORB scale tracking gave unreliable results on 4 of 8 pairs (few inliers); only the 7:20 push (0.8%/s) and the 31-34 s push (8%/s) are trusted.
- 30 fps stepping was done for 2.4-4.8 s only; other devices measured at 2 fps/10 s sampling, so entry times are +/-0.25 s.
- Text sizes from pixel bbox failed (photo content), so sizes are visual estimates from 480 px sheets (+/-0.5%).
- Audio SFX are inferred from band envelopes, not heard; whoosh/riser vs hit not separated.
- Source decoded at 1080p, not 4K as briefed.
