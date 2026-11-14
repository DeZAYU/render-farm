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

## Gap fill 2026-11-14 (maps, pages, 5 graphics, text sizes, SFX)
Method: 30 fps extraction (960x540 and 1920x1080), ORB similarity tracking (scale/rotation/pan between frames), red-pixel counts and bar-width per frame, connected-component pixel rows for text, faster-whisper small.en word stamps on 12-30 s windows, 50 ms band envelopes. 23 new stills `gate/g2_*.png`. NOTE: the older stills `t1250_map_red_dots`, `t1300_tag_the_drag`, `t1130_map_figures_barker`, `t0500_aerial_bw_map`, `t1930_newspaper_highlight` are mis-timed (they show footage, not the map/page). True timecodes below; use the g2 stills.
Owner rule applied: only maps, a few motion graphics and page highlights matter for our channel.

### G1. Maps (there are exactly 2 in 20:45; 0:30 of 1245 s = 2.4% of runtime)
**Map A, annotated archive aerial, 11:31.93-11:40.37 (8.4 s). VO "But what's certain is that most of the people Whitman hit fell within the first 20 minutes" (691.94-699.7).**
- Source look: not drawn by the editor. A newspaper-style hard-threshold aerial (pure black/white blobs, halftone grain) with printed labels ("ACADEMIC CENTER", "BARKER HISTORY CENTER" white box) and numbered white circles + black figure silhouettes (source annotation). Vignetted, soft edges. Credit "Source: Wikipedia".
- Enters: HARD CUT at 691.93 from the tower-clock push shot (no dip, no wipe). The audio gets a hit on the cut (sub +19 dB, high band +21 dB over bed).
- Camera: constant slow PULL-OUT 1.0%/s (scale 1.000 to 0.938 over 8.4 s), no pan (tx 4-5 px, ty 2-3 px at 960 w), rotation 0. No ease (linear), no pins/routes drawn on; the "draw-on" is the text only.
- Text layer: "First 20 Minutes" (serif small caps, white, soft shadow) wipes in left to right 696.9-697.45 (16 frames, "First 20" first then "Minutes"), holds full 697.5-698.6 (1.1 s), fades out 698.6-699.3 (about 0.7 s). Placed centre at y 43-53% H. Starts 0.45 s after the VO says "20 minutes" begins (696.2); full by "before" (697.6).
- Exit: hard cut at 700.37 to a tower-clock shot ("Many mistook the shots..." starts 700.4).
**Map B, designed vector map + callout, 12:50.87-13:10.43 (19.6 s). VO 764-793: "...the news spread over the radio. On the drag, the busy commercial street along the western edge of campus, an 18-year-old named Paul Sontag and his girlfriend were killed. Sontag's grandfather, a local reporter, is said to have been reading the rising casualty list on air when he reached his grandson's name."**
- Source look: flat vector street map (Encyclopaedia Britannica graphic, credit "Source: (Map) Encyclopedia Britannica, Inc.; (Clip) Texas Archive", later "Source: Murderpedia"). Colours: paper beige #d8d2bf (centre #c3bdaa), buildings taupe #b3ad9d, labels dark grey sans (bold), red victim dots #ab0f16 (solid), hollow/pale dots #e2a7a8. Vignette corner/centre luma 0.54 (0.42 once the callout is up). Not satellite, not 3-D; the map is dressed with the same B&W vignette.
- Enters: HARD CUT at 770.87 (frame 86 at 30 fps) from the police-megaphone archive shot. Dots and labels are ALREADY on the map in frame 1 (nothing draws on). Cut sits on VO "On the drag" (770.76), +0.1 s.
- Camera stage 1 (770.87-773.70, 2.8 s): PULL-OUT from scale 1.00 to 0.70 with strong ease-out: -29%/s at start, -20.6, -16.7, -13.5, -11.5, -8.0, -4.4, then 0 at 773.7. Rotation 0, pan about 0 (zoom about centre). This reveals "The Drag" red tag + Guadalupe Street dots at the left edge while the VO says "the busy commercial street".
- Camera stage 2 (773.7-776.1, 2.4 s): reverses to a gentle PUSH-IN 0.70 to 0.81, up to +9%/s at 774.7 (ease-in-out, a "breath"). Stage 3 (776.1-789.1): push continues, +3.1%/s decaying to +0.7%/s (scale x1.18 over 13 s, ease-out). No rotation (max 0.1 deg).
- Callout stages (all in 776.0-776.7, VO "an 18" 775.84): (a) red vertical tag "The Drag" (#bb0b0c, white sans rotated 90 deg) is on the street from stage 1 on; (b) leader line (red, 3 px at 1080p = 0.3% H) draws from the tag to the right, 776.07-776.2 (about 4 frames); (c) label "THE DRAG" (red box #bb0b0c, white serif caps, cap height 59 px at 1080p = 5.5% H, box 7.2% H high) wipes L to R 776.17-776.33 (about 5 frames, "THE" then "DRAG"); (d) portrait box (B&W halftone photo, red outline 6-8 px = 0.6-0.7% H, #bb0b0c) wipes L to R 776.27-776.43 (4-5 frames: 30 px strip, half face, full), 0.2 s after the label; (e) the map behind goes soft + dark immediately (depth-of-field blur plus dim, corner/centre luma 0.54 to 0.42) between 776.4 and 778.0, so the portrait pops; (f) name "PAUL SONNTAG / STUDENT, VICTIM" (white small caps, soft shadow, lower-left of the card, initial cap 64 px = 5.9% H, small cap 43-46 px = 4.0-4.3% H) wipes in about 778.0-778.5 (the VO says "Paul Suntag" at 777.34-777.78, so the name lands about 0.7 s AFTER the VO name, not on it).
- Hold: callout group holds 776.4-790.4 (14 s) on the slow push, nothing else moves. Exit: HARD CUT at 790.43 (frame 673) to the next archive shot, on VO "Local radio" (790.38).
- Dots/route: no routes. The only "route" is the leader line. No animation on dots (static). Dot size about 1.3% H solid red.
- Frame-stepped: 3 windows at 30 fps (770.8-776.1 camera, 776.0-776.7 callout, 776-790 hold). Stills `g2_t1251_mapB_entry_zoomed_in`, `g2_t1253_mapB_pullout_end`, `g2_t1256_mapB_drag_label_wipe`, `g2_t1305_mapB_portrait_name_hold`, `g2_t1132_mapA_aerial_figures`, `g2_t1138_mapA_first20min_text`.
- Other aerials (13:39-14:21, flyover with biplane, campus from tower) are plain archive footage, not maps.

### G2. Pages (4 documents with highlight)
| page | time | what | in | highlight draw | hold | out |
|---|---|---|---|---|---|---|
| P1 | 4:30.6-4:43.9 | typed psychiatrist report, black ID label bottom right | fade from black about 0.8 s (4:30.5-4:31.3) | bar 1 on "thinking about going up on the tower with a deer rifle" 272.2-276.6; bar 2 "shooting people" lower-left from about 276.8 | 11.9 s at full | fade to black 283.2-284.0 (0.8 s), black to 284.5? then photo at 285.0 |
| P2 | 6:41.4-7:03.5 | typed suicide letter, 4 pages scrolling up | cross-dissolve from typewriter shot 401.0-401.4 (0.4 s) | 5+ bars in a ladder 402.6, 406.2, 410.5, 418.0, 419.3, 421.4... | 19.9 s | slow fade to black 421.3-about 424.5 (3 s, chapter close) |
| P3 | 12:33.5-12:40.3 | police report "synopsis of offense" | fade from black 753.5-754.4 (0.9 s) | one bar on the call-taker/time phrase 754.0-759.4 | 5.9 s | HARD CUT 760.33 |
| P4 | 19:32.9-19:41.6 | newspaper column (Heatly interview) | HARD CUT 1172.83 from tower photo | bar 1173.3-1176.0 then wraps to a second line 1178.4+ (3 lines by 1181.4) | 8.8 s | HARD CUT 1181.6 |
- Entry: all pages enter FLAT and full frame (no tilt, no 3-D, no paper-on-desk). No depth of field on the page (a soft vignette only: page paper #f8f8f8-#ffffff at centre, falls to dark grey at corners; newspaper paper #d7d7d7).
- Highlight look: flat red bar the height of one text line (43-46 px at 1080p = 4.0-4.3% H when the page is pushed in), drawn as a MULTIPLY on the paper (type stays readable through it): colour on screen #c6090b (P2), #d20607 (P3), #bc0a0b (P4), #fe0000 (P1 before vignette). Opacity effectively 100% over white. Bar starts at the left edge of the target phrase (1-3 px thick start, grows rightwards), no outline, no rounding, no gloss.
- Highlight speed (at 960 px wide measurement): P1 about 175 px/s (0.18 frame widths/s, 0.2 s per 35 px), runs 3.4 s for 540 px (56% W), linear, decelerating over the last 0.7 s; P2 about 165 px/s (13 px at 402.63, 60 px at 402.93, 331 px at 405.33), P3 about 150-160 px/s (26 px at 754.27, 701 px at 759.37), P4 about 130-150 px/s (2 px at 1173.30, 344 px at 1176.6). So 0.14-0.19 W/s, about 3 words/s over the highlighted phrase (P1: 11 words in 3.4 s).
- Sync to VO (faster-whisper): P1 bar starts 272.2 = VO "Whitman" 272.2 (the sentence head), 1.4 s BEFORE "thinking" (273.62) and ends 276.6 near "rifle"/"shooting" (276.18/276.84): the bar leads the words at the start and meets them at the end (it is not word-by-word). P2 bar 1 starts 402.6 = 0.2 s after "He" (402.38); the page letters are not the VO words (VO paraphrases). P3 starts 754.0, 0.7 s after "The police call" (753.28), as "came" (754.08) is spoken. P4 starts 1173.3 = 0.15 s after "The doctor" (1173.14), grows through "was never charged" (1174-1174.6) and finishes before "partly" (1175.34). Rule: bar start within -1.4/+0.7 s of the first spoken word of the phrase; draw time 2.7-5 s, slower than speech.
- Push/pan during hold (ORB): P1 +1.3-1.7%/s for 6 s (1.00 to 1.09) then 0, drift about 0.3 deg/s to 2 deg (tracker noise possible); P2 pull-back -0.4%/s (1.00 to 0.92 over 20 s) with the page scrolling up about 3%H/s; P3 push +1.0-1.4%/s with pan up (about 5%H/s, +-2); P4 push +2.5%/s with drift up about 2%H/s.
- Stills: `g2_t0435_page1_highlight_mid`, `g2_t0443_page1_two_highlights`, `g2_t0645_page2_letter_hl1`, `g2_t0700_page2_letter_hl_late`, `g2_t1237_page3_police_hl`, `g2_t1936_page4_news_hl`.

### G3. The 5 strongest motion graphics (stages, frames at 30 fps)
1. **Map B callout cascade** (see G1): hard cut in, 2.8 s pull-out ease-out, leader 4 f, label wipe 5 f, portrait wipe 4-5 f, map blur+dim 1.6 s, name wipe 0.5 s, hold 14 s. The best device in the video.
2. **TUMOR callout on an archive photo, 18:00-18:05 (1080.0-1085).** (a) target dot (red, 11 px = 1% H, #bb0b0c) already sits on the scan at 1080.0; (b) leader line draws from the dot up-left 1080.4-1080.93 (about 16 f, ease-in-out; line 3 px = 0.3% H); (c) red label box (#bb0b0c, 165 px x 42 px = 15% W x 3.9% H, white serif caps cap height 31 px = 2.9% H) wipes L to R 1080.93-1081.3 (about 10 f); (d) whole group is parented to the photo and rides its drift (about 0.5 px/frame), hold to the cut (about 4 s+). VO sits on the scan; the tag lands after the VO names the tumor.
3. **Corkboard title, 23.1-31 s**: red "THE SNIPER" tag wipes in 23.9-24.2 (about 9 f); strings add about 900 red px/s linearly 25.1-29.0 (pin to pin, no strong ease); camera push into the portrait, then WHIP into the next photo 29.3-30.5 (red count spikes 14142 at 29.6 from motion blur, gone by 31.1); sub +18 dB under the whip (29.4).
4. **Name card (Roy Dell Henry Schmidt), 11:52.5-12:00**: 0.4 s fade from black on a dark cork-grey texture (card mean luma 8 to 85 over 712.7-713.3), portrait in a rounded-corner card (bevelled shadow) centred, name small caps (initial cap 39 px = 3.6% H, small cap 20 px = 1.9% H) and role line (about 2.3% H) fade in with it (text px peaks 713.3, then eases down as the slow push soaks it), hold about 5.5 s, fade to black 718.4-720.0 (about 1.5 s). Repeated 11+ times (Karen Griffith 12:24-12:33 same).
5. **In-photo lower-left name tag with a victim photo (Claire Wilson 11:06-11:12, Tom Eckman 11:21-11:24)**: serif name above grey role line, lower-left at x 36-52%, y 70-76% H, over the photo (no card), fades in 0.3-0.5 s, holds 3-6 s on the photo push; name initial cap 34-49 px (3.1-4.5% H), small cap 33 px (3.0%). Also the red "SNIPER" tag, the "First 20 Minutes" wipe (G1) and the quote lines are the same family.
- Easing: wipes are linear 5-10 frames; leader lines ease-in-out; camera moves ease-out; no overshoot or bounce anywhere.

### G4. Text sizes by pixel rows (1080p frames; cap = initial capital height, sc = small-cap height)
| role | measured | %H |
|---|---|---|
| name card name (Roy) | cap 39 px, sc 20 px | 3.6 / 1.9 |
| name card role line | rows 918-941, about 25 px incl. cap | about 2.3 |
| Paul Sonntag name (map card) | cap 64 px, sc 43-46 px (shown at 1.15x push) | 5.9 / 4.0-4.3 |
| in-photo tag Claire Wilson | cap 34-49 px, sc 33 px | 3.1-4.5 / 3.0 |
| "First 20 Minutes" stakes caption | cap 92-93 px, sc 61-64 px | 8.5 / 5.6-5.9 |
| time caption "6:45 PM" | digits 52-56 px, sc 30-34 px | 5.0 / 2.9 |
| subtitle "Whitman murdered his wife and his mother" (19:43) | cap 33-34 px, sc 20 px | 3.1 / 1.9 |
| red label THE DRAG (map) | cap 59 px in a 78 px box | 5.5 / 7.2 |
| red label TUMOR | cap 31 px in a 42 px box | 2.9 / 3.9 |
| source credit (bottom-left grey) | cap 10 px, x-height 7 px, rows 1056-1067, x 8-145 | 0.9 / 0.65 |
| page highlight bar | 43-46 px high | 4.0-4.3 |
| leader line / red outline | 3 px / 6-8 px | 0.3 / 0.6-0.7 |
Sizes drift +-15% with the push. The older estimates in section 4 (name 2.9-3.2%, role 1.5%) read the small caps as full caps: use initial cap 3.6%, small cap 1.9%. Stakes captions on a map or aerial are 1.5-2x larger than name tags.

### G5. SFX under maps, pages, graphics (band envelopes, not heard)
Band levels in 50 ms frames, peak within -0.3/+0.4 s of the event vs the median of the surrounding 6 s. Level is relative; VO band sits at about -18 to -21 dB in these units, so a "+" value near that means the sound is as loud as the VO in that band.
- Map B cut-in 770.87: weak (sub +6, nothing else): no hit, the cut is soft. Map B label wipe 776.2: sub +23 dB (peak -19, at VO level), low +8, VO band +7, high +13 = a sub THUD under the callout, about 0.1 s after the leader starts. Map B exit cut 790.43: sub +16.
- Map A cut-in 691.93: sub +19, low +8, high +21 = impact with a bright tick. Text wipe 696.9: high +25, low +5, sub +11 (soft swish/tick; may include VO "minutes").
- Pages: P1 bar start 272.2: sub -1, low +8, voice +15, high +27 (VO sibilants, "Whitman admitted"; no designed hit). P2 402.6: sub +2, high +16. P3 754.0: sub +16 (a hit about the start of the highlight), high +25. P4 1172.9 hard cut + bar: sub +1, high +12 (no hit). So pages mostly get NO designed SFX; only the police report gets a hit.
- TUMOR leader 1080.4 and label 1080.93: high +24/+25, sub +7-8 = a bright tick/click at the label wipe and leader start, no low hit.
- Corkboard tag 23.9: sub +10, high +25, low +9; whip 29.4: sub +18, high +18 = whoosh with thump.
- Summary: SFX are sparse and soft: sub thud (+16 to +23) on map callout, police report, cuts into map A, corkboard whip; bright tick (+24 high) on text/tag wipes. Page highlights are silent. Nothing is louder than the VO band; whooshes are not at the spectral level of a stock whoosh library (no sustained 0.5 s mid-high sweep seen).
- Limits: sibilants in the VO confound the high band; no SFX heard; band values are relative (50 ms Hann frames, 22.05 kHz mono mix).

### Remaining gaps (honest)
- Tom Eckman tag not measured (text not found in box); P2 bar timings beyond the first two are from the red-pixel count only; P1-P4 rotation drift (about 2 deg) may be tracker noise; no pixel-measured DOF on pages (none visible); P2 exit length (3 s) is from luma, not frame-checked; map B stage 2 push values are tracker-derived (about 900-1300 inliers).
- Time spent about 45 min, over the 35 min box.
