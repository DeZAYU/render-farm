# dd_dashcam_v2 - STYLE (Disturbing Dose, "20 Most Disturbing Dashcam Moments (Vol. 2)", 21:37, 1080p60)

Measured with ffmpeg (scene 0.3 and 0.12 at 320 px, ebur128, PIL on stills) + eyeballed contact sheets (work/sh_*.png, 1 frame per 2 s; work/m_*.png 6-12 fps). Style only, no footage copied.

## Summary: what this reference owns
1. NO intro, NO title card up front: the video starts at 0:00 on case #1 (cold open: fade-in from black over ~2 frames, date text on frame ~2). #1 (35 s) and #2 (66 s) are un-numbered cold-open cases.
2. The channel title is a delayed device: at 88 s a black 4x5 grid of red number tiles "1..20" under "MOST DISTURBING DASHCAM MOMENTS" (creepy drip font, red) then the camera zooms into the grid, tile 3 -> case #3 at 101 s. Then the count goes UP 3 -> 20 (most disturbing last). 18 numbered cases, mean 65 s each (35-145 s).
3. Every case opens the same way: dip to black ~1.3 s, then a big red number (soft glow, red radial vignette) fades in over the fading-in clip, with white "Month D, **Year**" below it (year red), then a second text "Place, **Country/State**". No title cards, no VO-led opening needed.
4. Overlay language is tiny and strict: white semibold sans text with ONE red keyword, red arrow, red circle/ellipse, red highlighter-marker on article text, red-bordered PiP for the 2nd camera, red name tag, red map pin. Everything is red (#EF1015) on white/black.
5. "Evidence" inserts break the dashcam: news article screenshots (red marker + slow zoom), Facebook comment card on blurred B&W bg, cork board with pinned photo/red string/paper notes/evidence-tape card, polaroid portrait with red line to the person, clothespin photo, map zoom label, website screenshot, mugshot card.
6. Pace is SLOW for a countdown: true cuts ~3/min; clips run 15-140 s uncut (case #12 = 145 s of one split-screen). Raw scene detector: 130 hits (0.3) = 6/min, 178 clusters (0.12) = 8.2/min, but most are lightning/whiteouts/glitch/replays, not edits.
7. Audio is one dense loud mix: -17.5 LUFS integrated, LRA 4.9 LU, true peak up to +0.5 dBFS (clips from case #12 on). Never a silent beat (min momentary -37 LUFS once, 0.4 s at 359.0). Narrator speech is continuous (checked on the cork-board inserts with no clip audio). Clip raws carry captions in bottom-white.
8. Grade: mean saturation 34% (range 2-83), black point ~0-10, white ~240-250 (full range), strong dark vignette (edge luma = 0.42 x centre), horizontal scanline/slight VHS overlay, red tint added to dark frames.
9. End: no outro. Last case #20 ends 1288 s with the clip shrinking into a white-bordered photo frame on black, dims to black, then 1294 s the clip returns once with a news chyron (FOX11) and the file ends at 1296.8 s.
10. Not measured (no transcriber allowed, no installs): word-level VO text, VO vs music LU, SFX per minute. Treat the SFX/music notes below as estimates from spectrogram only.

## 1. Case list (chapter times from src.info.json + verified in frames)
| # | start | len s | raw clip type | scene hits(0.12) | opening |
|---|---|---|---|---|---|
| 1 | 0:00 | 35 | night highway tanker explosion + news clip 24.9-33 | 5 | date 0.17 s, place 4 s, arrow 8 s |
| 2 | 0:35 | 66 | Beaumont rocket night drive, web page, then title grid 88-101 | 3 | red-frame "?" transition 33-36; place 38 s |
| 3 | 1:41 | 43 | dumping confrontation, pixelated faces, captions | 2 | big "3" fades from black 102 s |
| 4 | 2:24 | 73 | tornado, truck cab, white-outs; article 198-205 | 52 (whiteouts) | "4" top-right + "September 1, 2021" at 144.4 |
| 5 | 3:37 | 42 | highway crash, PiP interior, FB card 250 s | 2 | "5" at 217.5 |
| 6 | 4:19 | 102 | road rage, 2 camera inset + "audio removed" tag; cork board 344-358 | 22 | no number seen (inset clip) |
| 7 | 6:01 | 43 | Taiwan quake rock fall | 4 | "7" top-right + "April 3, 2024" 360 s |
| 8 | 6:44 | 41 | bridge, PiP cab + portrait + map | 11 | "8" inside PiP + "March 1, 2025?" 404 s |
| 9 | 7:25 | 58 | sleeping driver, PiP | 5 | none seen |
| 10 | 8:23 | 71 | night stroller, ONE shot 71 s | 1 | "10" + "October, 2014" 504 s |
| 11 | 9:34 | 57 | rain, lift on trailer, replays | 14 | "11" 574 s, pin tag 568 |
| 12 | 10:31 | 145 | split-screen front + interior | 4 | date + time "10:56pm" 632 s, "12" |
| 13 | 12:56 | 84 | green car + bat, replays, red glow | 20 | "13" 776 s |
| 14 | 14:20 | 82 | shootout street | 6 | "14" 860 s |
| 15 | 15:42 | 59 | truck stop axe | 2 | "15" 942, "May, 2021", "I-95 North / in Maryland" 946 |
| 16 | 16:41 | 55 | driver POV | 3 | "16" + "April 2, 2015" 1002, portrait 1004 |
| 17 | 17:36 | 66 | Kenya road machete | 2 | "17" 1056 over photo, name tags |
| 18 | 18:42 | 61 | night road, clothespin photo, site 1114-1120 | 5 | "18" 1128 |
| 19 | 19:43 | 40 | stacked cabin+road, red circle | 10 | "19" 1184 |
| 20 | 20:23 | 74 | Tesla pipe, article, mugshot card | 5 | "20" 1224.5 + "2 Freeway Glendale, California" 1226 |
Mean case 64.8 s, median ~60 s. Opening to last cut inside a case: median gap between real cuts ~10-20 s (cases 2-3, 5, 8-9, 11, 14-17).

## 2. Intro 0-101 s (frame-stepped at 12 fps)
- 0.00-0.17 s: fade from black (2 frames). Clip is already a dashcam shot, VHS scanline overlay on.
- Word-by-word date text, centre of frame, y 50% of height: "June" fades in at 0.17 s (3 frames), "20th," at ~0.58 s, red "2023" at ~0.83 s; each word fades ~3 frames; all words visible by 1.0 s. Slight slow push on the text (rises ~2 px/s, no blur). Hold to ~3.5 s; place text "Highway 401, Canada" replaces it at ~3.7 s and holds to ~6.8 s, fades out 6.8-7.2 s. No VO-synced timing measured.
- Text look: white #FCFCFC semibold humanist/Helvetica-like sans, mixed case, slight letter-spacing, soft dark shadow/glow. Digit height 89 px of 1080 = 8.2% of frame height (font ~11-12%). Block 1050 px wide = 55% of width. Red keyword #EF1015 (measured mean 239,17,21).
- 8.0-9.5 s: red arrow (thick, tip down, ~10% frame height) drops/pulses at the tanker, fades 9.5 s. Repeats at 20-21.5 s on the car in the fire (second arrow).
- 24.9 s hard cut to a news-source clip (with source lower third baked in: "Lane restrictions at Hwy 401 ..." + Global News logo) - source chyron is kept, not covered. 27 s red text "For 24 hou..." (red text on clip, 8%); 29.9 hard cut.
- 33.0-36.0 s TRANSITION "red frame": news clip squashes vertically with glitch lines, becomes a grey card with a white "?" (33.5), shrinks into a red-bordered frame (34.1 s, border 1.5% of height, red #8B0000-ish dark red glow), slides left, the next clip slides in inside the frame on rails (34.4), frame expands to the full-screen clip by ~36.3 s. ~3.3 s total. Next place text "Beaumont, California" 38-41.5 s.
- 40-42 s red ellipse drawn at the sky object (track + shrink); 55-60 s white captions "[Child] It's a rocket." bottom centre (4% height, white, no box, thin shadow) = subtitles of the clip's own speech.
- 74-86 s web page screenshot ("UFO? No, SpaceX Rocket!"): page enters with a 2 s slow zoom, red highlighter bar grows left to right over words (colour ~#E8000E with soft blurred edge, 1.0 s), page darkens to blur at the end; 86 s red circle on the rocket in the real clip.
- 88-101 s TITLE GRID (the only title in the video): black bg, 4 rows x 5 cols of dark-red tiles with white numbers 1-20 (tile ~8% of width), "MOST DISTURBING" in red dripping/horror lettering above "DASHCAM MOMENTS" in white condensed grunge caps. Stays ~4 s, then the camera zooms into the grid (scale 1 -> ~5x over ~3 s, tiles 1,2 fill with thumbnails), settles on tile 3, fades to black 99.5-101 s, "3" glows red on black (101.5) and the clip fades in under it.

## 3. How every numbered case opens (measured on case 5, 6 fps)
- Previous clip fades to black over ~0.7 s; ~1.3 s of near-black (216.0-217.3).
- 217.5: red number appears on a dark-red radial glow (circle ~25% of frame height), clip fades in from black under it over ~0.5 s.
- Number: red #F0141E, heavy sans (Montserrat-Black/Arial-Black like), height ~12-14% of frame height at start, soft glow; slight scale-down/settle; holds ~2 s, then fades while moving up/stays; gone by 219.6 s. Position varies per case: centre (#3, #11, #13, #14), left-centre (#5, #17, #18, #20), top-right (#4, #7, #10, #15, #16).
- At the same time the date text appears below it (same style as the intro) and 2-3 s later the place text swaps in. First clip audio is already running (no first-word measurement: no transcript).
- Cases #1 and #2 have no number.

## 4. Device kinds and counts (whole video, from sheets; counts are estimates +-20%)
red arrow ~14; red circle/ellipse ~22 (grows as it tracks the subject, ~1.5-3 s); red-bordered PiP of 2nd camera in 6 cases (#5, #8, #9, 28% x 28% of frame, top right, red 4 px frame); article/web screenshots with red marker 6 (#2, #4, #8?, #18, #20 x2); Facebook comment card 1; cork board sequence 1 (#6, ~14 s); polaroid/photo-card portraits with red line 4 (#8, #11, #16, #20 mugshot); name tags 2 (#17); map zoom 1 (#8, red label "The Second Street Bridge"); location pin tag "[Corpus Christi, Texas]" 1; big red text 3 ("7.4 Magnitude Earthquake", "40 minutes", "For 24 hours"); captions for raw speech ~15 bursts; "audio removed" tag 1; replays/loops with glitch 3 (#11, #13, #1); split-screen 1 (#12 145 s), stacked 2-camera 1 (#19); clothespin photo + rope 1; red-glow brake lights added 1 (#13); end photo frame 1.
Devices repeat the same 5 kinds early (arrow, circle, article, PiP, text) and vary only in cases 6, 8, 12, 17-20.

## 5. Text roles
| role | where | size | look | enter/exit |
|---|---|---|---|---|
| case number | centre/left/top-right | 12-14% H | red #F0141E heavy sans, glow | fade 0.3 s in, hold ~2 s, fade ~0.4 s |
| date | centre (50% H), below number | digits 8.2% H | white sans semibold, red year | word-by-word fade (0.17-0.4 s apart), hold ~3.5 s |
| place | same slot as date after swap | same | white + red country/state; 2 lines when long ("I-95 North / in Maryland") | cross-fade, hold ~3 s, fade 0.4 s |
| quote/caption | bottom centre | ~4% H | white sans regular, no box | cut on, hold per sentence |
| name tag | beside head | 3% H | white text in red filled rect + thin red leader | scale-in 0.3 s |
| source/lower third | baked in the news clip | - | as source | - |
| highlight | over article words | line height | red marker bar #E8000E, blurred edge, multiply look | wipes L->R in ~1 s |
No full-screen title other than the 88 s grid.

## 6. Transitions
Mostly hard cut inside a case. Between cases: dip to black (~0.7 s out + 1.3 s black + 0.5 s in). Special: red-frame "?" (once, 3.3 s), grid zoom (once, ~8 s incl. hold), glitch/pixel-slice flash into evidence cards (~6 times, 4-6 frames each, e.g. 1026 s, 378 s), white flash/overexposure (tornado), photo-frame shrink to black at the very end. Dissolve ~8 frames between the two stacked clips in #17 (1062 s).

## 7. Footage vs designed share
Designed/overlay material (article screenshots, cards, cork board, grid, maps, PiP chrome, name tags) roughly 12-15% of runtime; footage 85-88%. 4:3 / vertical sources are centred on blurred-dark pad or inset; PiP has red 4 px frame. News inserts keep their original lower third.

## 8. Audio
- ebur128 whole file: I = -17.5 LUFS, LRA 4.9 LU, TP +0.5 dBFS (peaks > 0 dB from case #12). Per case median momentary -17.3 to -19.7 LUFS; p10 -21 to -26; p90 -13.5 to -16.4; short-term median -16.3 to -19.2. Case 5 and 6 quietest (-19.6), case 20 loudest (-17.3).
- Only one momentary dip below -35 LUFS (359.0-359.4 s, 0.4 s) = a hard dropout before case #7 -> no silent beats.
- Speech-like band structure is continuous all video, incl. cork board inserts (no clip audio) -> narrator VO present and almost continuous; clip raws are laid under it and get captions; they are not isolated for long (one 15-20 s speech-less stretch not found).
- Not measured: music vs VO LU, SFX per minute (estimated: a hit/whoosh at each device entry; number card has a low impact). Ducking under raws not measured.

## 9. Grade (50 stills)
Mean saturation 34% (cases at night 26-37%, day exteriors 14-35%, red-tinted devices 50-83%). Black point ~0-10 on night, ~15-40 on overcast; white 240-252 -> full range. Vignette: edge luma / centre luma median 0.42 (strong round vignette on every clip). Scanlines visible at 100% crop (every 3-4 px), slight softness, no obvious film grain. Red glow added around brake lights and arrows. Warm-orange/teal natural, no global LUT bias seen except red lift in shadows.

## 10. Censorship
Faces: pixel mosaic square ~8% H, tracked (case 3 at 52-60 s). "audio removed" tiny white tag under the clip in #6. Bleeps not measured (swearing is subtitled with the words kept; no black bars seen).

## 11. How cases end
Hard cut or dip to black into the next number card. No end-of-case card, no recap text. Final case: clip shrinks into a white-border photo frame on black (1288 s) and dims to black over 4 s; returns to the clip with a chyron at 1294 s; ends at 1296.8 s with no subscribe/outro card.

## 12. Failures / limits
- No transcript tool available (whisper not installed; brief forbids installs) -> VO lines not matched to devices.
- Scene detect over-counts on white-outs (case 4: 52 hits).
- No per-frame measurement of devices after case 5 beyond 2 s sheets; number-card timing from case 5 only.

## 13. Handoff
All numbers above are final. Files: STYLE.md, DEVICE_BANK_part.md, gate/ (49 PNG named tMMSS_what.png, mm:ss of src), work/ (sheets, scene12.txt, scene30.txt, ebur.npy, cuts.json; can be deleted). Next step for the channel setup: pick which of the 22 devices in DEVICE_BANK_part.md go in our SOP-compliant look (SOP bans caps cinematic lines, tape/VHS; this ref uses scanlines+red, so only borrow layouts/timings, not the look).

---
# ADDENDUM (gap fill, owner "no gaps")
Tools: faster-whisper small.en (int8) on 0-467 s (of 1297; VO_transcript_0-467s.txt, word times in work/tr_all.json), librosa onset analysis on the full file, ebur128 momentary values, 30 fps pixel stepping. Device times from 2 s sheets are +-0.5 s unless marked "frame-stepped".

## 14. Narration (VO) facts
- A narrator tells the story over the clip in past tense: "On June 20th, 2023, a trucker was traveling eastward along Highway 401 ..." Each case = 1 hook sentence (who/where/when) + 4-8 sentences of escalation + outcome ("Fortunately no one was hurt") + a bridge line into the next case ("But these were only two of the 20 most disturbing dashcam moments ... they only get more messed up from here" 87.7-98.2 s; "However, this wouldn't be the last time Mother Nature caused some disturbing dash cam footage" 211.5-216.3; "just like in our next clip" 33.4-34.7).
- Rate: 1250 words in 467 s = 160 wpm. Sentences 2-6 s; pauses between words >= 0.4 s: 68 in 467 s (8.7/min), median 0.56 s, p90 1.9 s.
- The VO stops for raws: longest VO-free stretches 16.6 s (308.7-325.4, roundabout chase), 9.3 s (235.8-245.1, crash + comment card), 3.1-3.3 s (59.8, 194.1, 326.0), 2.8 s (98.2-101.0, the grid->case 3 dip). Raw speech stretches (clip dialogue, captioned): 56.7-67.6 (11 s), 117-122.7 (5.7 s), 283.8-294.8 (11 s), 228-231 (3 s). So raws = 3-17 s, median ~ 6 s, then VO resumes with "Realizing she ...", "Fortunately, ..." etc.
- Raws are loud: momentary median -16.7 to -20.6 LUFS, i.e. 0-3 LU below the VO (see section 16). There is no ducked raw under VO; VO simply pauses.
- First VO word vs case-number landing (number landing frame-stepped on #3 = 101.2): #3 VO "This" 100.98 (VO leads by 0.2 s); #5 VO "But" 217.00 vs number ~217.5 (leads 0.5 s, during the black); #7 VO "On" 359.44 vs number ~360.0 (leads 0.56 s); #4 "On September 1, 2021" 144.6 vs number 144.4 (follows by ~0.2 s). Rule: VO starts -0.6..+0.2 s (median -0.4 s) around the number, i.e. the narrator is already speaking into the black dip and the number appears on his first 1-2 words. Date text words land with the narrator's date words (see section 15).
- The VO of the previous case ends 0.5-3 s before the next number (e.g. ends 214.5-216.3, black 216.0-217.3, number 217.5).

## 15. Device -> VO word match (delay = device time minus VO word start; negative = device first)
| device | device t (s) | VO word @ t | delay |
|---|---|---|---|
| date "June" fade-in | 0.17 | "June"@0.22 | -0.05 |
| date "20th," | 0.58 | "20th,"@0.40 | +0.18 |
| red "2023" | 0.83 | "2023"@1.12 | -0.29 |
| place text "Highway 401, Canada" | 3.7 | "Highway"@4.24 | -0.5 |
| red arrow on tanker | 8.0 | "suddenly"@8.22 / "veered"@8.56 | -0.2 |
| fireball (nothing drawn) | 10.8 | "slammed"@10.26 | n/a |
| red arrow on escaping car | 20.0 | "car"@20.02 | 0.0 |
| hard cut to news clip | 24.87 | "While"@25.12 (sentence start) | -0.25 |
| red text "For 24 hou(rs)" | 27.0 | "24"@26.82 | +0.2 |
| red-frame "?" transition start | 33.0 | "like"@33.42 / "in our next clip" 33.74-34.7 | -0.4 (the "?" card is on screen exactly during "next clip") |
| place "Beaumont, California" | 38.0 | "Beaumont,"@38.40 | -0.4 |
| red ellipse on sky | 40.0 | "rocket"@40.06 | -0.06 |
| web page enters | 74.0 | "injuries."@74.02 / "As"@74.78 | 0 (on the last word of the previous sentence) |
| red marker on "SpaceX Falcon 9" | 78.0 | "SpaceX"@78.22 | -0.2 |
| red circle on rocket trail | 86.0 | "lit up"@86.20 | -0.2 |
| title grid in | 88.0 | "But"@87.70 | +0.3 |
| grid zoom start | 95.0 | "including a trucker"@94.62-95.14 | +0.3 |
| case 3 number | 101.2 | "This"@100.98 | +0.22 |
Pattern: overlay text/arrows/circles land 0 to 0.5 s BEFORE the word they illustrate (median -0.2 s); case-level graphics land on or just after the first VO word; the title grid and grid zoom sit on the narrator's "20 most disturbing" sentence.
Case 7 date "April 3rd, 2024" is read by the VO at 359.66-360.42 while the text builds at ~360.5 (text trails the VO by ~0.2 s).

## 16. Levels (full-mix momentary LUFS; bed estimated from VO-free gaps, no stem separation)
- VO windows (127 segments 0-467 s): median -18.3 LUFS, p10 -20.6, p90 -16.3.
- Clean bed gaps (no speech, no clip crash): -24.1, -24.3, -24.8, -25.1, -27.1, -32.5 (98.2-101.0, the dip before case 3), -33.6 (357.9-359.4, dip before case 7). Median of clean gaps ~ -25 LUFS; case-boundary dips -32.5..-33.6; one hard floor -37 LUFS at 359.0.
- => VO sits ~ +7 LU (range +6..+10) over the music bed inside a case, and the bed drops a further ~8 LU (about 15 LU under VO) in the black dip between cases. Bed itself is a low drone/pad (energy mostly 60-250 Hz, see work/aud.py output earlier).
- Raws: 117-122.7 -16.7; 283.8-294.8 -19.4; 308.7-325 -20.6; 56.7-67.6 -20.6; 228-231 -17.4 LUFS = 0 to -3 LU relative to VO. Duck depth: VO does not duck under raws, it is removed; the music bed is not audible in raw stretches (raw level >> bed). Quiet raws exist (235.8-245 at -25.1 LUFS = bed level, the comment-card insert, i.e. music only with no VO for 9 s).
- Integrated -17.5 LUFS, true peak +0.5 dBFS: this mix is hot; do not copy the clipping.

## 17. SFX (librosa/scipy onset analysis, whole file)
- Detector: energy 30-8000 Hz, jump >= 9 dB (mean of next 80 ms minus mean of previous 500 ms), 0.5 s min distance -> 448 onsets = 20.7 per minute, of which 353 (79%) whoosh/riser-type (high band dominant), 64 broadband, 31 low "hits". This includes clip impacts (crashes, explosions), so it is an upper bound; per case 10.5-36.6/min (calmest: #4 10.7 incl. storm, #11 10.5, #5 12.9; busiest: #7 34.9, #8 36.6, #14 27.8, #15 27.5, #13 25.7, #6 25.9 = the cases with collisions/rock fall).
- Device-linked SFX: 13 of 16 case-number opens have an onset within -2..+1 s of the number: 11 of them 0.25-1.9 s BEFORE it (median -0.69 s), 2 just after (+0.5, +0.7 s) = rising swell into the black dip, ending on the number (exceptions #4 144.4, #14 860, #19 1184: no onset). Title grid 87.83 and zoom 94.82 each have a whoosh (-0.2 s). Red-frame "?" transition: whoosh at 34.17. Arrows: 3 of 8 matched within 0.4 s.
- 20 example timecodes (s : onset dB jump : kind : what it marks):
  1. 2.58 : 16.9 : riser : end of date text / text swap to place (+1.1 s before place text)
  2. 19.90 : 14.6 : whoosh : second red arrow (car escaping fire)
  3. 34.17 : 11.2 : whoosh : red-frame "?" card shrinks to frame
  4. 61.13 : 18.8 : broadband : clip impact (raw)
  5. 87.83 : 15.0 : whoosh : title grid enters
  6. 94.82 : 12.5 : whoosh : grid zoom starts
  7. 101.10 : 19.5 : riser : swell into case 3 number (number 101.2)
  8. 198.03 : 11.7 : broadband : article screenshot enters
  9. 216.9 : 15.0 : riser : swell into case 5 number (217.5)
  10. 223.97 : 9.0 : whoosh : red arrow in PiP (#5)
  11. 343.73 : 16.9 : broadband : cork board label drops in
  12. 359.65 : 14.7 : riser : swell into case 7 number
  13. 373.61 / 375.76 : 9.7 / 11.5 : broadband : arrows on the reversing car (#7)
  14. 411.97 : 14.2 : whoosh : map/PiP on #8
  15. 439.43 : 23.9 : hit : impact inside the rescue story (clip)
  16. 503.33 : 17.2 : riser : swell into case 10 number (504.0)
  17. 942.04 : 9.6 : hit : case 15 number lands (0.0 s)
  18. 1113.97 : 16.6 : whoosh : website screenshot enters (#18)
  19. 1223.75 : 12.9 : riser : swell into case 20 number
  20. 1228.21 : 12.3 : whoosh : red arrow on the Tesla (#20)
- Silent beats: none; the only dropout is 0.4 s at 359.0 and the dips between cases (-33 LUFS).

## 18. Case-number open frame-step (30 fps, pixel count of saturated red, 320x180)
| case | red enters (t) | fade-in 10->90% | hold >=90% | fade-out 90->10% | number size | notes |
|---|---|---|---|---|---|---|
| #3 | 101.20 | 4 frames (0.13 s) | 40-82 = 1.43 s | 4 frames (0.13 s) | bbox 19.4% H flat (no scale animation) incl. glow; at 47-55% x, 37-57% y | clip luma 0 at 100.0 -> 28 at entry -> 99 at end of hold (clip brightens in during the number); linear/ease-out opacity only |
| #17 | 1056.37 | 5 frames (0.17 s) | 0.70 s | 9 frames (0.30 s) | bbox 19.4% H flat, x 42-59%, y 37-57% | no black dip here (min luma 73, number lands directly over a bright photo) |
| #19 | 1183.77 | 8 frames (0.27 s) | 0.50 s | 16 frames (0.53 s) | 19.4% H flat, same slot as #17 | black minimum luma 11 at 1183.40 (0.37 s before number); stacked-cam clip |
| #5 (earlier, 6 fps) | 217.5 | ~2 frames of glow then ~0.3 s | ~1.5 s | ~0.4 s fade | 12-14% H glyph | 1.3 s black first |
| #10, #13 | pixel count contaminated by red year text/footage; visual: #10 number top-right at 504.0, #13 centre 776.4 (frame-step 776.40, glow, bbox 19% H), hold 2 s | | | | | not used for stats |
Summary: number = saturated red (#F0141E) heavy sans, bbox ~19% of frame height including glow (glyph ~12-14%), no scale push, opacity fades only: in 4-8 frames, hold 0.5-1.4 s (visible with glow ~2 s), out 4-16 frames. Black dip min 0.37 s before the number when there is a dip; the clip fades in under the number over ~0.5 s (luma 28 -> 99 over the hold). Position slots: centre (#3, #13, #14), centre-left (#5, #17, #18, #19, #20: x 42-59%, y 37-57%), top-right (#4, #7, #10, #15, #16).

## 19. Remaining limits
- No stem separation (demucs not run, time): bed level is from VO-free gaps, so bed-under-VO could be lower than estimated.
- VO transcribed to 467 s only (cases 1-9 plus start of 9); remaining 830 s not transcribed.
- Onset counts include clip sounds (impacts); SFX identity (whoosh vs riser) is by band balance, not by listening.
