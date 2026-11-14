# ad_incidents_iceberg: STYLE (Abyssal Detective 2, "Most Disturbing Incidents Caught on Camera Iceberg", 47:46)
Source: 1920x1080, 60 fps, AV1/opus. Measured by scene detect (0.25 @ 15 fps, 320 px), ebur128, 143 samples (every 20 s, `work/sheet_*.png`), 2 fps/10 fps tiles of intro and level cards. Timecodes are m:ss unless noted; card timings are +-0.5 s (2 fps tiles) except the WARNING sequence (10 fps).

## What this reference owns (summary)
1. Caught-on-camera look: footage is ~78% of runtime, never clean. Dark vignette, crushed blacks (p1 luma ~5/255), warm/teal grade, compression-style pixel dither and RGB glitch hits on beats.
2. Vertical phone clips are NEVER shown stretched: centred 9:16 (~32% frame width) or cropped ~53% width, with the same clip blurred + horizontally motion-smeared + darkened filling both sides.
3. Small/square/4:3 clips = floating inset rectangle with soft drop shadow over a blurred, stretched, tinted copy of itself.
4. Spotlight device: scene darkened to near black, one soft circular lit area on the subject (window climber, hiker, climber). Used 8+ times, highlights WHERE to look.
5. Article proof = white web-page screenshot, full frame, tiny text in a centre column, ONE key sentence marked with yellow marker (#ffe600-ish) + wobbly black outline, red marker for a named culprit. ~9% of runtime.
6. Censorship = tracked block mosaic (cell ~3-5% of frame width) on bodies/faces/blood, plus Gaussian blur on faces of officers; full-frame heavy mosaic when the whole scene is gore. No bleeps measured (could not isolate; clip audio is not bleeped as far as the loudness curve shows).
7. Host in the middle of the story: bald man, moustache, blue henley, in front of a detective-board wall (pinned papers, red strings, framed B&W interrogation photos, red tint). ~12% of runtime, in 20-30 s blocks, sits between levels and between big cases.
8. Level card (iceberg format): black 1.5 s, typewriter "Level N" over the berg, push-in to the berg tip, glitchy title in cyan-glow caps, ~5-6 s block, then first clip with small location tag.
9. Sound: constant bed, no digital silence (-48 dB, 0.3 s: zero hits), integrated -22.3 LUFS, LRA 3.1 LU, TP -3.3 dBFS. Loudness hits ~10/min (SFX or VO onsets).
10. Pacing: median shot 6.1 s overall, but intro 2.1 s; fast teaser, slow levels (5.7-10 cuts/min).

## 1. Cuts (scene detect 0.25, merged within 0.2 s; 474 raw, 372 merged; misses cuts inside insets and soft dissolves)
| Section | time | cuts | cuts/min | median gap | mean gap |
|---|---|---|---|---|---|
| Intro | 0:00-0:32 | 13 | 24.4 | 2.1 s | 2.3 s |
| Level 1 | 0:32-5:45 | 54 | 10.4 | 4.6 s | 5.8 s |
| Level 2 | 5:45-12:54 | 42 | 5.9 | 9.0 s | 10.3 s |
| Level 3 | 12:54-20:39 | 66 | 8.5 | 5.8 s | 7.1 s |
| Level 4 | 20:39-30:11 | 76 | 8.0 | 5.9 s | 7.6 s |
| Level 5 | 30:11-38:21 | 64 | 7.8 | 6.6 s | 7.7 s |
| Level 6 | 38:21-42:46 | 25 | 5.7 | 7.1 s | 10.9 s |
| Level 7 | 42:46-47:46 | 32 | 6.4 | 8.1 s | 9.5 s |
Overall median 6.1 s, p10 0.6 s (glitch flicker), p90 16.8 s, max 43 s (host or long single clip). Raw file is `work/cuts_merged.txt`.
Note: clips often HOLD 8-20 s with slow push-in + glitch hits rather than being cut; many "cuts" are glitch frames, not shots.

## 2. Intro (0:00-0:32) at 10 fps
- 0.0-0.2 black. 0.2 "WARNING:" pops in (small, ~2.3% h) with RGB fringe + glow. 0.6 "DISTURBING CONTENT" appears hard (no typing), ~5.5% h cap, ~72% frame width, centred y~50%. Text: pixel/mono wide sans caps, white #e8f0ff with cyan/red chroma fringe, soft bloom. Faint hand/arm silhouette texture in the dark bg.
- 0.6-3.6 hold with micro-jitter (skew frames every ~1.2 s). Audio: M jumps -53 -> -19 LUFS at 1.0 s: bed/drone starts with the text).
- 3.6-4.2 blue datamosh slices + horizontal tear; 4.1 ONE white flash frame (100 ms); 4.2 text turns RED #ff0a0a with heavy red glow and scanlines; 4.5-5.0 tear/RGB split bar; 5.0-6.5 red hold with 3 skew jitters; 6.5 smear-out (red stretched slices) -> hard cut to footage at 6.7.
- 6.7-10 elephant clip: vertical clip, pillarboxed, sides = same clip heavily horizontal-blurred and saturated; mosaic on victim.
- ~11.5-15.5 case-list "iceberg tips": 7 horizontal white rules dividing the frame into 8 bands, each band has 1-3 typewriter case names (white serif/typewriter, several blurred/ghosted), over a blue-teal berg. ~4 s hold, slight jitter.
- 15.5-25: rapid teaser montage, each 1.5-3 s: bodycam + vignette, wall-climber (blue-tinted dither), blue night road mosaic pane, kitchen-fire clip with a 0.7 s full RED monotone flash, truck-bridge clip then a 0.5 s black-white threshold look, glitch burst (3.5 s: 21-24 s).
- 25-30 host block (no lower third) -> 30-31.5 black (bed dips ~8 LU) -> Level 1 card at 31.5.

## 3. Level / case anatomy (iceberg-specific, brief)
Level 1 (31.5-35): black 1.5 s -> "Level 1" typewriter slab (white, ~14% h cap, mixed case, centred y~51%, slight emboss/shadow) over berg (dark water top 50%) hold ~1.5 s -> push-in (scale 1.0 -> ~2.5 over ~0.5 s) to the berg tip, "THE BROKEN CHAIN" appears via glitch (frame at 33.0 half-formed), white caps wide sans with cyan glow, ~4.5% h, y~44%, hold ~2.5 s -> cut to first clip.
Level 2 (346-352.5): host -> black ~1.5 s -> "Level 2" (3 frames: normal, normal, punch-scaled x1.5 with berg dissolving) -> berg tip with "NO WAY DOWN" -> glitch-out (full RGB noise frame at 352) -> clip.
First clip of a level: pillarboxed vertical clip with location tag "SULAK CANYON (DAGESTAN)": mono caps 2-line, ~1.8% h, white, bottom-left x 2.5-25%, y ~95%, fades in with glitch ~1 s after clip start. Same device at L2 (dark spotlight clip).
Level order: host block precedes each level card (seen 0:25, 5:44). Between cases inside a level there is no card; cases switch with a host aside or a page screenshot.

## 4. Device kinds and counts (143 samples = 20-s grid, so counts are approximate)
| kind | samples | share | notes |
|---|---|---|---|
| raw footage (all kinds) | ~117 | ~78% (incl. glitch, mosaic, inset) | |
| host on detective board | 15-18 | ~12% | |
| white article page | ~13 | ~9% | |
| level cards | 7 x ~6 s = 42 s | ~1.5% | |
Footage sub-types visible in samples: pillarboxed vertical with blur-fill (~25%), full-frame 16:9 with vignette (~45%), spotlight circle (~7%), inset with shadow (~8%), datamosh/threshold/red-mono (~8%), stacked two phone clips (1), portrait photo inset on blurred background of itself (3), name-tag portrait (3), emblem/establishing still (1).
Devices repeat across all levels (no level-specific variation), except Level 1 teaser list and level cards.

## 5. Text roles
| role | look | size | position | enter/exit | colours |
|---|---|---|---|---|---|
| Warning | pixel mono caps, glow, RGB fringe | cap 5.5% h | centre | hard on / datamosh out | #e8f0ff then #ff0a0a |
| Level N | bold typewriter slab, mixed case | cap ~14% h | centre y 51% | pops in, punch-scale out | #f2f2f2 |
| Level title | wide sans caps medium, cyan glow | 4.5% h | y 44% | glitch-in, glitch-out | #ffffff / #7fe0ff glow |
| Location tag | mono caps 2 lines | 1.8% h | bottom-left | glitch fade in | #e6e6e6 |
| Name tag (witness / victim) | black bold typewriter on rectangular orange label (slight torn edge) | tag ~7% h, text ~4% h | bottom, centred under inset, y 86-96% | pops in with drop shadow | box #e68600, text #111 |
| Name tag (perp / main person) | typewriter caps red, glow, no box, over portrait | text ~7% h | y 82-93%, x 18-82% | pops in | #fa0809 |
| Article highlight | yellow marker over sentence, wobbly black outline | page text 1.8-2.2% h | centre column 35-65% w | marker draws on | #ffe600 / #000 ; red #ff2222 for culprit name |
| On-clip count/number | red bold sans "17" with glow, at clip (3:10) | ~6% h | lower third of clip | pops | #ff1a1a |
| Sound-glitch word "AU" 10:50 | white pixel sans block letters, 6% h, left-middle | | | | #fff |
Hold times: name tags ~3-4 s; location tags ~4-5 s; highlight pages 5-25 s (sample sequence).

## 6. Transitions
Glitch (RGB slice + datamosh), per min ~3-4 (leading the level cards and teasers); hard cuts the rest; black dip 1.5 s before each level card; one-frame white flash (4.1 s); red monotone flash 0.5-0.7 s; push-in dissolve into berg. Lengths 3-8 frames at 60 fps for glitches; dissolves not detected between clips.

## 7. Footage vs designed, framing
- ~78% footage, ~12% host, ~9% pages, ~1.5% cards/graphics. Maps: none sampled.
- 9:16 phone clip: native width 32% of frame OR cropped to 53% of frame width; sides = blurred/motion-smeared/darkened duplicate; sides sometimes wobble/slide ~2-3% w.
- 16:9 CCTV/dashcam clips fill the frame, with strong vignette (corner/centre luminance ~0.87 mean over footage), lifted warm mids, crushed blacks.
- Stills of people: portrait inset (~38% w x 55% h) with soft drop shadow, background = same photo blurred+blue tint, name tag at bottom.
- Pages: full-frame, no browser chrome in most; crop shows headline cut at the right edge (8:50) - looks like real screenshot.
- Freezes/replays: not measured (no frame-exact review beyond tiles).

## 8. Audio
Integrated -22.3 LUFS, LRA 3.1 LU, TP -3.3 dBFS. Momentary: p5 -34.7, p25 -24.9, p50 -22.8, p75 -21.3, p95 -19.5. Same in every level (p50 -22.5..-23.0; p10 -28..-31; p90 -20), so the mix is uniformly steady. Intro louder: p50 -20.4, p90 -16.8.
No silence >=0.3 s under -48 dB; gaps (<-33 LU M for >=0.5 s) 63 = 1.3/min; deep gaps (<-38) = 10 in the whole film (one is the end fade 2860-2865). So VO gaps are short (0.5-1 s) and the bed never drops out; estimated bed ~8-10 LU under VO (gap M -31..-34 vs VO -22; estimate).
Loudness onsets +9 LU in 0.4 s: 10.2/min = VO sentence starts + SFX hits (glitches, hits). Level card: bed dips ~8-10 LU in the second before the card (M -34 at 31 s), then a hit.
Raws (clip sound) and duck: clip audio is mixed at about VO level; no separate stems, not measured. SFX map not extracted (no sound-ear pass run: time).

## 9. Grade (143 samples, 160x90)
| class | mean sat (HSV) | p1 luma | p99 luma | mean luma |
|---|---|---|---|---|
| footage | 0.30 | 5 | 198 | 69 |
| host | 0.32 | 8 | 143 | 53 (corner/centre 0.47 = heavy vignette) |
| page | 0.04 | 85 | 254 | 230 |
Look layers: dark vignette; grain/dust specks (visible in warning); compression-style dither on bright areas; chroma fringe on text; occasional full-colour tint (blue on night/CCTV, red mono for danger beats, orange for hotel/interior).

## 10. Censorship
- Block mosaic, tracked to the subject, cell ~3-5% of frame width, colours = averaged source (not black). Examples 0:10, 24:50, 30:50, 31:10 (heavy full-frame), 37:10 (face), 39:10 (pillarbox block), 41:10, 44:10.
- Gaussian blur on face: 8:10, 40:10.
- Backgrounds/blood areas left as visible stains (no black boxes).
- Description: "uncensored content on Patreon".
- No bleep / audio masking measured.

## Not done / notes
- No per-device frame-exact stepping beyond the WARNING (10 fps) and level cards (2 fps); push % per second was not measured.
- No SFX map; no transcript; first-VO delay after level card not measured.
- Scene detect fails to see cuts inside insets, so cut counts are lower bounds in clip-heavy sections.
- Gate stills: file names are `tMMSS_*`; several of my planned names were shifted (check the png).

## Gap fill 2026-11-14
Method: audio decoded 22.05 kHz mono, STFT 2048/hop 20 ms; video frames at 30 fps (640 px, ORB + RANSAC similarity transform every 3rd frame = 0.1 s steps) so scale is measured, not eyeballed. Whisper small.en int8 on 28 s windows only. Control = 600 random non-cut moments for audio stats. Stills `gate/` (15 new, names `tMMSS_*`).

### G1. Push rates (scale change, %/s), 30 fps, shot start +0.6 s, 7 s windows
| # | kind | time | rate | curve (cumulative % per second) | read |
|---|---|---|---|---|---|
| 1 | footage (vignette CCTV) | 45:10 | +1.46 %/s | 0 1.4 3.0 4.5 6.1 7.7 9.1 | LINEAR slow push-in, total +10% in 7 s, no easing |
| 2 | footage | 19:10 | -1.10 %/s | 0 -0.9 -1.9 -2.9 -4.0 -5.1 -6.2 | LINEAR pull-out (reverse push) |
| 3 | footage | 20:50 | +6.6 %/s first 2 s then ~0 | 0 3.3 13.9 15.2 18.1 17.3 17.5 | punch-in ease-out (+14% in 2 s) then hold; also 47:10 +1.23 %/s linear |
| 4 | photo inset | 23:30 | +0.40 %/s | 0 0.4 0.8 1.2 1.6 2.1 | very slow linear drift, +2.2% in 5.5 s (16:50 +0.51 %/s, 11:50 +0.31 %/s) |
| 5 | photo | 25:30 | +4.7 %/s first 1 s, then +0.27 %/s | 0 4.7 7.0 7.1 7.3 7.6 7.9 | ease-out pop (~+7% in 1.5 s) then near-still |
| 6 | page (article) | 12:30 | +5.2 %/s first 1.5 s then 0.0 | 0 5.2 9.8 9.8 9.8 9.7 9.7 | page "lands" with ease-out punch-in (+10%) then locked; 1:50 same (+10% in 2 s then +0.35 %/s drift) |
| 7 | page | 42:30 | +0.30 %/s | 0 0.3 0.6 0.9 1.3 1.5 1.8 | pure linear drift (+2% in 7 s) |
Ranges: slow-drift push = 0.3-0.5 %/s (photos, pages), 1.1-1.5 %/s (CCTV footage), pop/punch = 5-7 %/s for 1.5-2 s ending at +8-14% then hold or drift. 12 of 18 footage shots show |rate| < 0.5 %/s (basically static). Footage that is pushed out (-1.1 to -1.8 %/s) occurs about 1 in 6. 3 footage windows (31:10 -3.6, 26:50 -1.8, 39:50 -0.9) are camera moves inside the clip, not edits. Rebuild rule: default 1.2 %/s linear on footage, 0.4 %/s on photos/pages, plus a 1.5 s ease-out punch (+8-10%) on page/photo landings. Stills: t4512, t1904, t2351, t2523, t1226, t4232.

### G2. SFX map (cut-coincident level jumps; the VO is continuous so only jumps at cuts are usable)
Per cut: peak level in [c-0.02, c+0.25] minus peak in [c-0.8, c-0.1], per band (LF 20-150 Hz, MID 0.15-2.5 k, HF 3-10 k) and total, 20 ms frames. Calibrated against 600 control moments (p97 of control: LF +9.2, HF +13.3, total +3.9 dB). Classes (spectral, NOT listened; labels are inferred):
- LF thud: LF jump >= 9.2 dB and >= HF jump -2 (bass hit, little HF) = 30 cuts.
- glitch / HF burst: HF jump >= 13.3 and HF > LF +4 (HF band jumps from an empty floor, +70 dB; digital burst) = 37 cuts. These sit on the glitch transitions.
- mid/broad hit: total >= +3.9 dB, mid-led (impact/whoosh/clip-audio start; whoosh and clip audio can not be told apart here) = 76 cuts.
- riser into cut: HF slope >= 9.5 dB/s over the 1.5 s before the cut = only 3 cuts (0:23.1, 14:54.8, 22:09.6). Risers are rare; the film mostly uses hits, not build-ups.
- Level step only (sustained level change after the cut, no transient) = 36 cuts; 190 cuts have no cut-coincident audio event.
Counts: 146 classified SFX/hit events over 47.8 min = 3.05/min at cuts (3.8/min incl. level steps). By section: Intro 7.5/min (13 cuts, 4 events: riser 0:23.1 into the teaser glitch), L1 2.3, L2 2.7, L3 4.0, L4 2.7, L5 3.2, L6 2.5, L7 3.4. 39% of cuts carry a hit; so ~1 SFX per 2.6 cuts. LF thuds cluster on level opens (33:01.9, 42:44.7), big impact moments and L6 (7 of 11 events). Glitch bursts cluster at L2-L5.
Not countable: SFX not on cuts (title glitches, mosaics) are buried in VO; whole-film loudness onsets 26/min (ALL +9 dB) are mostly VO words, so they are not reported as SFX.
Twenty example timecodes (m:ss.xx | type | LF/MID/HF/total jump in dB):
| time | type | jumps |
|---|---|---|
| 0:23.07 | riser into cut (HF +16 dB/s) | LF+6 ALL+6 |
| 7:40.93 | glitch / HF burst | HF+72 MID+26 |
| 7:43.20 | mid/broad hit | MID+16 ALL+14 |
| 8:04.07 | LF thud | LF+19 HF-24 |
| 9:19.27 | glitch / HF burst | HF+70 MID+26 |
| 12:57.87 | mid/broad hit | MID+25 ALL+16 |
| 14:32.67 | glitch / HF burst | HF+71 MID+21 |
| 14:54.80 | riser into cut | HF +11 dB/s |
| 16:21.47 | glitch / HF burst | HF+71 |
| 22:06.00 | glitch / HF burst | HF+70 |
| 22:09.60 | riser into cut | HF +10 dB/s |
| 22:52.07 | mid/broad hit | MID+18 ALL+17 |
| 28:42.20 | glitch / HF burst | HF+83 MID+17 |
| 33:01.93 | LF thud (Level-1-area title, L1 clip) | LF+16 HF-9 |
| 34:08.07 | mid/broad hit | MID+16 ALL+15 |
| 35:44.20 | LF thud | LF+17 MID+23 ALL+22 |
| 39:12.60 | LF thud | LF+19 MID+15 |
| 42:44.73 | LF thud (2 s before Level 7 card) | LF+19 HF-25 |
| 43:54.53 | mid/broad hit | MID+17 ALL+16 |
| 46:01.20 | LF thud | LF+23 |
Entry opens (checked): at the card open the total level jumps +9..13 dB in L1, L2, L3, L5 (MID/HF-led, LF -13..+3 = no bass thud; L7 +0 dB), i.e. the "Level N" VO word and/or a soft hit, not a thud. During the 0.3 s push-in the level DROPS 16-21 dB (L3 -21, L5 -16, L7 -17: sound ducks out under the push), then the glitch-out +8..11 dB and the first clip +8..16 dB (clip audio enters with the cut). Pattern: quiet bed -> word on open -> sound dip during the push -> glitch/clip burst.

### G3. Bleeps / censor sound
- Searched all 47:46 for narrowband tone: frames where >=60% of energy sits within +-3 bins (16 Hz) of one peak at 400-4000 Hz and >=0.12 s. 87 runs found, all 0.12-0.2 s at 400-700 Hz and -13..-24 dB = sustained vowels of the VO (not tones). Stable runs >=0.24 s with frequency SD < 25 Hz: 60, all at 310-510 Hz and -17..-25 dB = vowels again (voice), plus two at -43/-45 dB (3:14.05 f371 sd0, 6:29.01 f404 sd0 = hum in near-silent bed).
- Specific 1 kHz check (1001 Hz +-8): 36 runs, max 0.16 s, median -35 dB (about 13 dB under the VO, so not a bleep; probably a faint bed/SFX tick). Four runs at -17..-20 dB are 0.04-0.08 s, i.e. a click, not a bleep.
- Result: no censor bleep in this film. Censored visuals (mosaic) are not paired with a tone. Muted swears: speech-band dips (>=14 dB below the 1 s median, 0.12-0.7 s) occur 22/min = ordinary pauses, so a mute can not be isolated by audio alone; not confirmed. Words near mosaic times were not transcribed (timebox). Conclusion for our edit: censorship = visual mosaic only, bed stays continuous; if a swear must be removed, replace with bed, not a beep (the reference has none).

### G4. First-VO delay after each entry open (whisper small.en, word timestamps +-0.1 s)
Entry open = end of the 1.5 s black dip (blackdetect). "Level N" spoken by the VO as the card appears.
| entry | black dip | card opens | last VO word before ends | VO silence around dip | "Level N" starts (delay after open) | title words start (after "Level N" ends) | 
|---|---|---|---|---|---|---|
| L1 | 29.78-31.30 | 31.30 | 29.38 | 2.24 s | 31.62 (+0.32 s) | "The Broken Chain" 32.94 (+0.60) |
| L2 | 344.08-345.63 | 345.63 | 343.70 | 2.40 s | 346.10 (+0.47 s) | "No way down" 347.46 (+0.84); story "Residents..." 349.52 (+3.89 s after open) |
| L3 | 772.55-774.08 | 774.08 | 772.65 | 1.64 s | 774.29 (+0.21 s) | "The Perfect Shot" 775.87 (+0.84) |
| L4 | 1238.07-1239.58 | 1239.58 | 1237.59 | 2.38 s | 1239.97 (+0.39 s) | title/story at 1241.27 (+1.7 s), word times fuzzy |
| L5 | 1810.45-1811.98 | 1811.98 | 1810.13 | 2.20 s | 1812.33 (+0.35 s) | "the approaching vessel" 1813.67 (+0.76) |
| L6 | 2299.05-2300.57 | 2300.57 | 2298.81 | 2.12 s | 2300.93 (+0.36 s) | "Never Stopped On The Night" starts 2301.47 (+0.0, run-on) |
| L7 | 2564.75-2566.27 | 2566.27 | 2564.35 | 2.40 s | 2566.79 (+0.52 s) | "Running Through Bingol" 2568.11 (+0.72) |
Summary: VO stops 0.0-0.5 s before the black starts (mean 0.32 s), is silent about 2.1 s (1.6-2.4) around the dip, says "Level N" 0.21-0.52 s after the card appears (mean 0.37 s, ~11 frames at 30 fps), then reads the title 0.6-0.85 s after "Level N" ends (mean 0.75), and the first story sentence 2.5-4 s later. The VO reads every card aloud ("Level three. The Perfect Shot."), so text and voice agree. Card to first clip = 3.4-4.1 s (G5). The speaker is the same, no change of voice/tone.
The L1 early line "let's begin at the tip of this iceberg." (28.7-29.38) ends right before the dip; L4's "subscribe and let's continue" shows a call-to-action sits in the host aside before Level 4 (1232-1237.6). Whisper note: L4 "End of Row A", L6/L7 title/words may be partly hallucinated; only the "Level N" onsets and the timings of clear words are used.

### G5. Frame-step of 3 more entry opens (30 fps; L3 12:54, L5 30:12, L7 42:46; t0 = black end; frame offsets are from the window start, 1 frame = 33.3 ms)
Identical skeleton to L1/L2: black -> "Level N" fade-in -> hold -> push-in to berg tip -> glitch-in title -> hold -> glitch-out -> clip.
| step | L3 (774.07) | L5 (1811.97) | L7 (2566.27) | easing / note |
|---|---|---|---|---|
| first non-black frame | f8 | f8 | f8 | berg + text appear together; luma 4 -> 58 within ~4 frames (fast fade-in, ~0.13 s); L7 already at luma 20 on its first frame (hard-cut-in) |
| "Level N" full + hold | f12-f43 (1.0 s) | f12-f43 (1.0 s) | f12-f35 (0.8 s) | text static, tiny jitter; mixed-case slab, slight shadow |
| push-in to berg tip | f44-f52 (9 frames = 0.30 s) | f44-f52 (9 fr) | f37-f43 (7 fr = 0.23 s) | frame diff rises 12 -> 21 -> 13 = symmetrical ease-in-out; text scales ~1.5x and fades (f48 = tile with text at 150%), berg scale ~1 -> ~3x to the tip |
| title glitch-in | f56-f62 (6 frames) | f56-f62 | f50-f56 | RGB-slice garbage text for ~4 frames, then clean |
| title hold | f64-f114 (1.7 s) | f64-f122 (2.0 s) | f56-f103 (1.6 s) | static; L7 text drifts slightly; no push on text |
| glitch-out | f115-f121 (7 fr = 0.23 s) | f123-f129 (7 fr) | f104-f110 (7 fr) | blown-out RGB noise frame(s) + black, then footage |
| first clip frame | f121 = 777.83 | f130 = 1816.03 | f110 = 2569.70 | clip enters on a hard cut from the noise frame; footage then pushes slowly (G1) |
| card-open to first clip | 3.76 s | 4.07 s | 3.43 s | L2 earlier measure 345.6-352.5 (6.9 s) is the longer variant |
Title look varies per level (L3 "THE PERFECT SHOT" cyan-white, cap ~3.8% h, ~50% w; L5 "THE APPROACHING VESSEL" blue gradient cap ~3.4% h, ~80% w; L7 "RUNNING THROUGH BINGOL" blue cap ~2.4% h, ~55% w), so title size is fitted to length, not fixed. The berg picture differs: L3 pale ice tip with a cloud sky; L5 berg zoomed over a skull-like underwater shape; L7 darker with white vertical spikes. After the card the first clip is full-frame 16:9 (L3 traffic jam, L5 ferry, L7 CCTV alley) with the vignette; no location tag appeared in the first 3 s for these (L1 had one at +1 s).
Stills: t1254, t1255, t1256 (L3), t3012, t3013, t3014 (L5), t4246, t4247, t4248 (L7). 

### Remaining gaps
- SFX types are inferred from spectra, not heard. Whooshes can not be separated from clip-audio starts.
- Muted swears not confirmed. The 36 faint 1 kHz ticks (-35 dB) are unexplained.
- Push rate sample = 7 footage + photos + pages (n=18 footage windows, 4 photos, 4 pages), cut-free by scene detect only; windows beginning inside soft dissolves may be biased.
