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
