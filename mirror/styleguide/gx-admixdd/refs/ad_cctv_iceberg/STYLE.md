# ad_cctv_iceberg: STYLE (Abyssal Detective 2, "Most Disturbing CCTV Incidents [Vol. 3] Iceberg", 45:52, 1920x1080, 29.97 fps)

Method note: all numbers measured by ffmpeg/numpy at 1 fps / scene>0.3 / 20 s contact sheets plus 15-30 fps sheets at the intro, Level 1 title and one entry open (8:36). Dissolves are NOT counted by scene>0.3 (only hard cuts). CPU was overloaded for most of the run, so only 3 frame-step windows were done (0:00-0:12, 0:31-0:43, 8:36-8:48 + 0:59-1:09, 2:36-2:48). Fonts are described by eye, not identified.

## What this reference owns (summary)
1. Format = HOST-ON-CAMERA + evidence: a bald, moustached host in a dark study (warm lamp upper right) speaks to camera ~18% of the video; CCTV/news footage ~61%; news-page screenshots ~16%; iceberg title cards ~5% (138 samples every 20 s).
2. CCTV is shown nearly raw (upscaled 16:9, slight vignette, no zoom-ins, no slow-mo). The "enhance" is done only in the COLD OPEN as 3 abused versions of the footage: blue/black blob, thresholded white blow-out, false-colour posterised crowd.
3. People/faces/gore are CENSORED with a feathered black ellipse that tracks the subject (soft edge ~15-25% of the blob width), not mosaic and not bleeps. Same blob in 1.5 min of Level 1 footage (2:36-2:43) while a bright dot moves inside it.
4. Evidence device = news-page screenshot: surrounding text gently blurred, key sentence stays sharp, ORANGE marker highlight (#F25705) drawn on line by line, 0.9-1 s per line, slow push-in 1.0 -> ~1.1x, held 6-8 s. Redaction on pages = pixel-mosaic red block (#A83839-ish) over names/photos.
5. Entry anatomy (8:36): host line -> 0.4 s static/glitch burst -> page w/ highlight (7.5 s) -> 0.4 s cross-dissolve with page ghost over footage -> footage ~3 s -> black beat (~1 s).
6. 16 titled entries "levels of an iceberg": black 1 s -> "Level N" typewriter text on iceberg (skull-berg) -> push through berg -> case title cyan-white caps, last word cyan (#6CFCFC), particle-assemble in (~8 frames) -> content.
7. Text on footage is almost absent: only the camera's own burned-in date/OSD and one added date stamp ("MARCH 17, 2024", pixel/mono caps, white, ~7% of frame height, centred, 1 hold ~3 s). Every other word is the host's VO or a page.
8. Transitions: hard cut dominant (247 hard cuts after merging <0.5 s; 5.4/min), black dip between entries (32 black beats, every ~85 s), static noise burst, datamosh/glitch smear (18:20, 24:40), cross-dissolve, "blow-out" white flash.
9. Audio: master -23.4 LUFS integrated, LRA 5.3 LU, TP -4.7 dBFS, no true silence anywhere (bed always on, M never below -60); VO/host median M -24 LUFS, gaps -33 LUFS = ~9-12 LU of bed-to-VO difference; raws never over -15 LUFS M.
10. Look: mean sat 25.7%, y1 15 / y99 200 (never crushed to 0 or 255 except in the glitch bursts), ymean 83; the study and berg are cool-teal/amber, footage is left natural.

## 1. Cuts (hard cuts only, scene>0.3, merged within 0.5 s)
Total raw 423 events, 247 after merge. Median shot 7.3 s, mean 11.1 s, 7.7% of shots <1.5 s.
| Section | time | cuts | cuts/min | median shot | longest |
|---|---|---|---|---|---|
| Intro/cold open | 0:00-0:31 | 5 | 9.7 | 5.4 s | 7.6 s |
| Level 1 | 0:31-4:55 | 28 | 6.4 | 6.7 s | 28.2 s |
| Level 2 | 4:55-10:08 | 27 | 5.2 | 6.7 s | 43.2 s |
| Level 3 | 10:08-16:46 | 40 | 6.0 | 6.2 s | 29.0 s |
| Level 4 | 16:46-26:39 | 55 | 5.6 | 7.6 s | 69.0 s |
| Level 5 | 26:39-31:13 | 17 | 3.7 | 11.3 s | 46.4 s |
| Level 6 | 31:13-34:53 | 17 | 4.6 | 5.1 s | 68.1 s |
| Level 7 | 34:53-45:52 | 58 | 5.3 | 8.3 s | 76.9 s |
Long "shots" are host monologue or a held CCTV clip (static camera), edited with dissolves/jump punch-ins that scene>0.3 misses. Pace is slow and constant: ~5.4 cuts/min, no acceleration towards the end.

## 2. Intro / cold open (0:00-0:31)
| time | device | numbers |
|---|---|---|
| 0:00-0:06.9 | "WARNING: FLASH IMAGE SHOWN" on black | pixel/dot-matrix caps, 2 lines centred (y ~ 40%/55%), ~7% frame height line 2, grey #97A3A0 at ~55% opacity, VHS tracking lines + noise at lower edge; hold 6.9 s; no VO sound known (bed only) |
| 6.9-11.4 | recap list of the 16 entry titles | 7 stacked horizontal rule strips (white 1-2 px lines), tiny sentence-case serif (~1.7% height) in 2-3 columns per strip, over faded berg photo; 4.5 s static, slight drift. Reads as an "iceberg menu" |
| 11.4-14.9 | CCTV clip 1: van door scene, hard-processed | blue-cyan solarised blob + a feathered BLACK ellipse (censor) moving with the person; 3.5 s |
| 14.9-17.1 | control room (Iranian monitor wall), bsod screens, red screen | clean footage, no zoom; 2.2 s |
| 17.1-23.4 | night street / club clips | two "enhanced" looks: (a) thresholded white blow-out with yellow edge, y99 255; (b) near-black crush with clipped highlights + colour noise; 6.3 s as 3 cuts of ~1.8 s |
| 23.4-27.2 | crowd clip, false-colour posterise | cyan/red/yellow on black, heavy chroma noise, 3.8 s |
| 27.2-30.7 | host straight to camera | HARD cut in, medium shot, lamp upper-right (warm #FFC26B glow), 3.5 s, VO starts on the cut |
| 30.7-31.7 | black | 1.0 s silent picture |
| 31.7-32.5 | "Level 1" card | typewriter slab text (white, ~21% frame height, wide, left of centre) on a skull-iceberg photo, sea cut line at ~28% from top |
| 32.5-33.2 | push through the berg | zoom into the berg crop; "Level 1" smears with motion blur (frames 3-6 of 15 fps sheet) and slides down out of frame; 0.9 s, ease-in (fast end) |
| 33.5-34.3 | case title builds | particle shards (cyan ~#6CFCFC) assemble into text over ~8 frames: shards at 33.5, half-letters 33.7, full 33.8 |
| 33.8-~38 | "MAYOR'S DEADLY MORNING" | bold wide caps, 2 lines centred, ~5.5% frame height per line, ~40-85% width depending on card, WHITE with last word CYAN #6CFCFC, soft glow; berg photo behind keeps slow push (~+4%/s) |
| 36-41 | footage: black SUV + street | CCTV 16:9, 6 s hold with static camera, then 0.4 s static noise burst (white/blue snow, 41.9-42.2) into host |

First VO word delay after entry card: footage starts ~2.5 s after the title lands (title ~4 s).

## 3. Entries (levels) and case anatomy
- 16 titled entries from the recap menu (Mayor's Deadly Morning, Nature's shelter, A grim coincidence, Boiling man, A routine bath went wrong, What came after the wedding, Burned by the plan, Race to the grave, Fun night to prison, One Deadly Switch, Gift turned deadly, Snow turns red, Tracks of no return, The doomed shift, When the sky burned, Inside the secret hell) across 7 "levels" (card at 0:31, 4:55, 10:08, 16:46, 26:39, 31:13, 34:53). Title cards seen at 0:34, 8:40 (DANCE FLOOR DISASTER), 16:40 (FUN NIGHT TO PRISON), 20:00 (ONE DEADLY SWITCH), 39:40 (WHEN THE SKY BURNED). Average entry ~2.7 min.
- Typical entry (measured at 8:36-8:47, 516+): host (line 1) -> 0.4 s static/glitch burst (RGB-split noise sheet, the page already faintly visible through it) -> news page (blur 100% on side text, ~6 px gaussian estimate; only the key paragraph sharp) with orange marker animating on over 7 s -> 0.4 s dissolve (page ghost 20% over footage) -> footage 3+ s -> black.
- How it ends: host wraps up on camera, then 1 s black, then the next level card (black frames at 31, 140, 149, 218, 294, 369, 445, 527, 608, 691, 756, 849, 930, 1006 ... = entry ends). Last entry (43:40) re-uses the thresholded false-colour crowd flash from the cold open as a bookend, then host outro 45:15-45:35, then black with "THANKS FOR WATCHING" (white mono/pixel caps, small ~3% height, top-centre-right at y ~ 2%) for the last ~12 s.
- Footage vs designed (138 samples @20 s): CCTV/clips 84 = 61%, host 25 = 18%, pages 22 = 16%, title cards 7 = 5%. (Rough, by eye on sheets.)

## 4. Text roles
| role | where | size (frame-height %) | look | colour | entrance | hold |
|---|---|---|---|---|---|---|
| warning | black cold open | 7% | pixel/dot-matrix caps, VHS scan lines | #97A3A0 | on from f0 | 6.9 s |
| menu list | cold open | ~1.7% | tiny serif sentence case in strip rows | white on teal berg | static | 4.5 s |
| "Level N" | level card | ~21% | wide slab typewriter, mixed case | white (#EDEDED) w/ drop shadow | none, then motion-blur slide out | 0.8 s |
| case title | after berg push | 5.5% per line | bold wide sans caps, 2 lines | white + last word #6CFCFC glow | particle assemble 8 f | ~4 s |
| date stamp | on footage (15:40) | ~7% | monospaced/pixel caps | white, black shadow | hard on | ~3 s |
| page headline | news page | in-page | in-page (serif/sans), orange box | #F25705 | marker wipe | 6-8 s |
| outro | black | ~3% | pixel/mono caps | white | hard | 12 s |
No quotes, names or place tags are added as designed graphics. The host's talk carries them.

## 5. Transitions (per min and length)
- Hard cut: 5.4/min (host <-> footage, footage <-> footage).
- Black beat: 32 total ~ 0.7/min, ~1.0 s (30 frames) between entries.
- Static noise burst: ~0.4 s (12 f) host -> page entry; also 41.9-42.2, 6.0 s into d_l1 sheet.
- Datamosh / bit-smear: 18:20, 24:40, ~0.4-1 s (blocky horizontal data tearing, white/blue).
- Cross-dissolve: page -> footage, footage -> footage; ~0.4 s (12 f).
- Blow-out flash: footage -> explosion 2:44 hard cut (explosion is white at y99 255), no dissolve.
- Iceberg push-through: level card -> case title, 0.9 s.

## 6. CCTV framing and enhancement
- Raw footage is shown 16:9 filling the frame; 4:3 clips: left in 4:3 with black side bars (seen at 42:20 with black bars + "The Guardian" watermark) or blown up with vignette. Vertical clips: pillarboxed, black on both sides, no blurred fill (42:20).
- Vignette: soft dark edges (corner luma ~55% of centre) on most night footage (1:00 on).
- Zoom: no digital push-ins seen on footage; a few jump punch-ins to a crop of the same clip (1:04). Zoom-in on the subject through the censor blob only.
- Look-here/spotlight: RED CIRCLE (~3 px stroke, #A83839-#C83030, ring ~14% of frame height diameter, static not animated) at 6:20 (restaurant) and 7:40 (street pot scene). No arrows, no darken-outside.
- Replays/freezes/split views: none detected in sampled frames. Same clip recaps only as the cold-open abuse.
- Raw sound: the clip's own audio is not obviously used (bed + VO dominant), see 8.
- Censorship: feathered BLACK ELLIPSE over person/face/blood, tracks motion, can be 18-25% frame width; pages: pixel mosaic block in red (#A83839) over names (2:40, 13:40) and gaussian blur of other text. Photos on pages blurred too (34:00). No bleeps found.

## 7. Grade (per section means from 1 fps sampling)
| section | y1 | y99 | ymean | sat% | black <8 ymean |
|---|---|---|---|---|---|
| intro | 1 | 193 | 43 | 40.1 | 22.6% |
| L1 | 14 | 195 | 82 | 29.2 | 1.9% |
| L2 | 17 | 209 | 90 | 25.7 | 1.0% |
| L3 | 10 | 214 | 79 | 24.7 | 1.3% |
| L4 | 18 | 187 | 79 | 23.3 | 1.7% |
| L5 | 8 | 172 | 65 | 30.1 | 0.7% |
| L6 | 17 | 204 | 97 | 21.1 | 1.4% |
| L7 | 19 | 212 | 92 | 26.1 | 1.1% |
| all | 15 | 200 | 83 | 25.7 | 1.5% |
Footage = ungraded; pages white (y99 ~245); host room teal-black with amber lamp. Grain only on host and VHS cold open; no look layer on the clips except vignette; intro is the over-saturated part (40% sat, hard blow-outs).

## 8. Audio (ebur128, 0.1 s momentary)
- Integrated -23.4 LUFS, LRA 5.3 LU (5.9 at 36 min), TP -4.7 dBFS.
- Median M -24.2, p10 -33.6, p90 -20.9. Level 3 (10:08-16:46) runs 4 LU lower (M median -27.7) vs -23.5 elsewhere: quieter mix there.
- Never silent: 0.0% of 0.1 s windows < -60 (except 0.5-1.3% in 0-1 min, 20-21 min). A bed/room tone is always under.
- Gaps (M < -30): 4.6/min of >=0.8 s, median 1.0 s; only 40 gaps >= 1.5 s (0.9/min); 5 gaps ~2.9-3.0 s at 0:29, 4:53, 12:35, 14:08, 15:29 (= the entry-end black beats before a level card). VO is dense; gaps are breaths ~0.6 s (7.9/min at -33).
- Bed vs VO estimate: ~9-12 LU between VO and bed (M -24 vs -33).
- Raws: M never exceeds -15 LUFS, so explosions/crowd noise are NOT louder than the VO. SFX hits, if any, sit inside the -15..-20 band. Not isolated further (no stem). Not measured: SFX/min (no spectrogram), duck depth under raws.
- Silence beats: the 1.0 s black before each level card has bed only.

## 9. Tries/failures
- ffmpeg metadata=print file path failed 3x (empty stats.txt) -> replaced with python 160x90 numpy sampling.
- Background ffmpeg jobs launched in one shell were killed (3 tries) -> re-ran as separate background tasks.
- Frame-level step (30 fps) only done at 0:00-0:12, 0:31-0:43, 0:59-1:09, 2:36-2:48, 8:36-8:48. Remaining entries sampled at 20 s only.
- Not done: SFX per min, per-device exact easing, font identification, per-entry device counts.

---
# APPENDIX A (coordinator gap-fill, partial; context ran out, see HANDOFF.md)

## A1. SFX / onset analysis (22.05 kHz mono, STFT 1024/256; bands LF 30-120 Hz, MID 0.3-3 kHz, HF 5-10.5 kHz)
Caveat: VO is continuous, so a raw band-onset detector fires on speech (LF 12.6/min, HF 42/min, useless). Method used instead: level jump of the 0.4 s after each of the 247 hard cuts vs the 0.9 s before. Cannot separate designed SFX from the incoming clip's own sound (no stems).
- Cuts with an LF or HF rise >6 dB: 149/247 = 60%. By type: HF noise/whoosh/static 69, LF thud/boom 29, mid swell 22, broadband hit/glitch 15, none (bed only) 112.
- Cut-coincident hits per min: intro 1.9, L1 3.6, L2 3.5, L3 3.5, L4 3.8, L5 2.2, L6 2.2, L7 1.9 (mean ~2.9/min). More hits in Levels 1-4, fewer in 5-7.
- 20 example timecodes (strongest, class, LF/HF dB): 2:29.5 thud LF+21; 2:33.7 thud LF+20; 2:43.7 broadband hit HF+27 (explosion cut); 6:09.9 HF static +23; 6:21.5 HF +21; 11:34.8 thud +22; 11:50.7 broadband +22/+21; 11:56.9 broadband HF+19; 13:13.7 thud +25; 13:18.1 thud +25; 14:04.0 thud +22; 15:59.4 HF +22; 16:17.5 HF +24 (mid +10); 20:08.7 broadband +74 (from digital silence, first sound after black); 20:11.3 thud +33; 21:51.4 HF +25 (mid +21); 24:55.1 HF +21; 31:51.2 HF +25; 34:58.2 HF +24; 37:19.0 HF +23 (mid +16).
- Device sound (band levels, 0.2 s steps): black beat before a level card (30.4-31.6) = LF drone 18-20 dB, MID ~1 dB = only a low drone, no voice (bed alone). "Level N" push-through (32.0-33.0): MID burst +30 dB over ~1.0 s (whoosh/ice swish), HF -1..+2, LF falls 15 -> 4. Title build (33.4-33.8): MID impact 28-32 dB then VO resumes. Static burst entry (516.2-516.6): LF+18 spike, MID 25-30, HF +10 (short noise hit ~0.3 s). Datamosh 18:20: HF +7 one 0.2 s step, mid on/off stutter (glitch stutter ~1 s). Warning card 0-6.9: low LF only; MID 15-26 = some voice/tone.
- Bed vs VO: M in the black beat (bed only) vs host speech: bed LF 10-20 dB band level vs speech MID 18-26 (about 10-12 LU lower in M, see section 8). Duck depth under clip sound: NOT measured (frame-class job failed); M median stays -23 to -24 through footage and host alike, so clip sound is not louder than VO and the bed is not audibly ducked (flat level).
- VO gap lengths (M < -30): >=0.8 s 4.6/min median 1.0 s; >=1.5 s 0.87/min median 1.9 s; max 3.0 s (entry-end black beats).

## A2. Font identification by role (closest family, by eye on 1080p crops; gate/t0032_fonts_crop_sheet.png)
| role | closest family | weight/case | tracking | size % frame height |
|---|---|---|---|---|
| "Level N" | distressed typewriter slab (Special Elite / Courier Prime Bold with ink-spread edges) | bold, Title case "Level", numeral 1 | wide (+10% with a visible word gap) | cap height ~14%, x-height ~9% (text block 394-591 px of 1080 = 18%) |
| case title | heavy rounded-corner geometric grotesk, slightly roughened edge (Rubik Black / Fredoka Bold + rough filter) | black, ALL CAPS, 2 lines | +2% | ~5.5% per line, line gap ~1.1x; last word cyan #6CFCFC, rest white |
| warning card | pixel/dot-matrix 5x7 caps (VT323 / Press Start-like) | regular, ALL CAPS | +8% | line 2 ~7% |
| menu list | transitional serif (Merriweather-like) tiny, sentence case | regular | normal | ~1.7% |
| date stamp | monospaced/pixel caps | regular, caps | +5% | ~7% |
| outro "THANKS FOR WATCHING" | mono/pixel caps (VT323-like) | regular | +5% | ~3% |
| in-page text | whatever the news site uses (Merriweather/Roboto, black on white) | n/a | n/a | page body ~1.5-2% |

## A3. Easing / timing (measured from 10 fps presence curves, 2 examples each + earlier 15 fps sheets)
- Level card -> title (4 instances: 295, 608, 1006, 1599): "Level N" white block present 0.9-1.0 s (3.3% white pixels), black 1.0 s before, then case title (white 7.6-9.3% + cyan 0.14-0.71%) holds 3.0 s (L2 297.0-299.7 = 2.7 s; L3 611.0-614.0 = 3.0 s; L4 1008.3-1011.4 = 3.1 s; L5 1601.3-1604.3 = 3.0 s) then hard cut. Title entry: shards at frame 0, half-built by f+4, full by f+8 (0.27 s), ease-out (fast first 4 frames). Level text exit: motion-blur slide down + zoom, accelerating (ease-in), 0.9 s.
- Page entry (8:36.4): static burst 12 f, page enters at full opacity (no fade); orange marker wipes line by line (5.4 s total for 3 lines in the 8:36 example, ~1.8 s per line, linear L->R per line, small overlap); push 1.0 -> ~1.1x over 7.5 s (linear-ish); exit = 12 f dissolve.
- Not measured numerically: per-frame zoom easing of berg push, page push curve at 30 fps (only visual).

## A4. Extra entry opens (frame-step)
Only the 8:36 entry (already in section 3) was stepped. Four more were NOT stepped (see HANDOFF.md). Title-card timings from A3 (295, 608, 1006, 1599) are the only extra entry data.

---
# Gap fill 2 (frame-step 30 fps, 29.97 source; whisper small.en int8 on short windows; ebur128 M 0.4 s from work/ebur.npy)
Timecodes are seconds from video start. Sheets are in gate/ (names t<sec>_E#_*). Scripts in work/ (cls.py, duck2.py, title30.py, lvl30.py, orange2.py, push.py, dis.py, wh.py).

## G1. Four more entry opens (frame-stepped), plus the VO delay
**E1, 1207.6-1209.2 (entry "ONE DEADLY SWITCH", sheets t12076/t12086).** Last host frame ghosts over the Korean-captioned clip for 4 f, then HARD to black at 1207.73 (no fade). Black holds 30 f = 1.00 s (bed only). Berg photo appears at full opacity on frame 1208.73 (hard cut from black). This entry has NO "Level N" card (card only starts a level; sub-entries go black -> berg -> title). Title shards appear 1208.93 (6 f after berg), half-built by +3 f, full white by +6 f (1209.13); glow ramps over ~12 f. Title at 30 fps: white-pixel curve onset f11, 50% at f14, 90% at f18 (7 f from onset to 90%). Berg keeps a slow push behind it. VO: last word before the black ("prison.", ends 1207.22) then NO VO for the next 11.8 s at least (whisper finds nothing 1207.2-1219; the Korean raw clip plays alone with its own audio and burned-in Korean captions). First-VO delay after title lands: > 10 s (title -> raws).
**E2, 1334.3-1335.3 (footage-to-footage datamosh, sheet t13343).** Hard cut detected at 1334.667 is a 0.37 s burst: 11 frames of RGB-split horizontal tearing (frame 11 dark with clipped colour strips, frames 12-20 white/blue blown-out tear lines with the OLD shot ghosted in the dark half), then next shot clean at 1335.03. No fade in or out. Same device marks "tape cut" between two CCTV clips. Page entry nearby (1342.0-1348.5) is a DARK-MODE blurred page with one small amber marker (area 0.4-0.6% of frame vs 1.4-13% on white pages), VO runs straight over it (no gap): "She was immediately rushed to the hospital in critical..." starts 1341.0, page ends in the gap 1348.22-1349.08, host appears 1349.05, first host word 1349.08 = 0.03 s after the cut. Next shot: host -> threshold flash white/black at 1356.76 (1 f hard).
**E3, 2375.6-2381.2 (footage -> dark Google page -> footage, sheets t23756/t23799).** Footage -> page is a 14-18 f (0.45-0.6 s) dissolve starting 2375.8: the page appears as a ghost grid (about 20% at f6) and is solid by 2376.27. The dissolve sits in a VO gap (2375.4-2376.14 = 0.74 s); first VO word on the page "Since" 2376.14 = 0.34 s after the dissolve starts. Page holds 2376.3-2380.4 (4.1 s), no push (scale 1.000, static dark page), then page -> footage dissolve 15 f (0.5 s) from 2380.37 to 2380.83 (ease-in alpha: -4%/f first 8 f, -9%/f last 6 f); this dissolve also sits in a VO gap (2379.88-2380.46); footage brightens afterwards over 0.4 s. VO is otherwise continuous over footage and page.
**E4, 998.2-1003.0 (page -> host, host -> footage, sheets t9982/t10017).** Page at full opacity (3 marker lines, 4th line done). Page -> host is NOT a dissolve: hard cut at 998.57 into an 8 f datamosh: 3 f green block-smear with the page's black marker lines still visible, 3 f black with grey horizontal strip remnants, 2 f solarised white/cyan host (inverted look), then clean host at 998.83. Whole device 0.27 s, entirely inside the VO gap 998.22-999.30 (1.08 s). First host word "Luckily," 999.30 = 0.47 s after host is clean. Host holds 3.3 s (998.83-1002.17), then HARD cut at 1002.17 into a 10 f (0.33 s) static burst: 3 f RGB-split tearing of the host, 3 f sparse coloured shards on black, 4 f threshold-white/black silhouette of the next clip, then footage clean at 1002.50. Footage shows without a title or caption. VO "Vanjot ..." keeps running (999.66-1003.98).
**Level-1 card VO check (31.0-41.7).** Black 30.73, "Level N" card 31.73 (hard, full opacity), "Level" spoken 32.2 (0.47 s after the card), "1." ends 32.8, title shards 33.43 (VO "Mayor's" 33.98 = 0.55 s later), title read "Mayor's Deadly Morning." ends 35.24, VO pause 1.1 s, body VO "A..." 36.34 = about the moment the title goes to footage. So the title is spoken over, then a 1.1 s breath, then the story.
**Entry-open pattern (8:36, plus E1-E4):** every device change is 0-14 f; hard cuts + 8-12 f glitch bursts for host/footage/page changes, 14-18 f dissolves only footage <-> dark page. The change always sits inside or at the edge of a VO gap (0.6-1.1 s): VO stops about 0.1-0.3 s before the device change, restarts 0-0.5 s after the new picture is clean. Exception: raws entries (E1), where the clip carries its own sound for 10+ s.

## G2. Duck depth (ebur128 momentary M, 0.4 s, plus band medians from bands.npz; footage/host/page classified by 1 fps thumbnails: host = correlation to the host frame, page = bright, black = luma<6)
Per-class M median: host 255 stable s -24.0; footage 1594 s -23.9; page 431 s -24.0 (p10 -30.6/-32.4, p90 -21.0). Flat, so picture type does not change loudness.
Isolation with whisper (22 footage windows of 10 s + 5 entry windows; small.en misses some words so VO-free gaps are lower-bound clean):
| state | n | M median | notes |
|---|---|---|---|
| bed alone (black beats, middle 0.6 s) | 29 beats | -33.1 (p10 -36.7, p90 -32.0) | LF band median 8.6 dB, MID 2.8 |
| VO speaking over footage (runs >=1.5 s, gaps <0.3 s) | 24 runs, 830 samples | -23.4 (p10 -27.8, p90 -20.3) | LF 8.1, MID 16.9 |
| footage, VO-free gaps >=0.8 s | 9 gaps, 58 samples | -36.2 median; 5 quiet gaps -34.0 to -38.1; 3 louder gaps -27.0, -27.6, -28.8 (clip sound audible) | LF 3.8, MID 8.3 |
Findings: (1) VO sits about 10 LU over the bed (-23.4 vs -33.1) and about 13 LU over a quiet footage gap. (2) Bed is NOT ducked under VO: the LF band (where the bed lives) is 8.1 dB under VO vs 8.6 dB bed alone (within 0.5 dB; the VO itself adds a little LF, so true duck is 0-2 dB at most). (3) Under clip sound the bed drops about 3 LU lower than the bed alone: quiet footage gaps -36.2 vs black-beat -33.1 (the "bed alone" level in the black beat is the loudest bed state, a deliberate drone swell). (4) Raw clip sound, when audible, reaches only -27 to -29 M: 4-6 LU above the bed and 4-5 LU BELOW the VO; it never beats the VO. So the mix rule: VO -23.4, clip raws -27/-29 (where used), bed -33 at its loudest (black beat swell) and -36 under footage; duck is a static 3 LU, not a pumping duck. Caveats: 9 gaps only; whisper cannot hear Korean/other-language raws, so E1-type raws windows are not in the gap set; host speaking windows did not finish (host M comes from classification only).

## G3. 30 fps easing examples (all measured, frame by frame)
**Title card (white-pixel % in the band y 37-63% of the frame, 30 fps, onset = first frame above base):**
- Ex1 L1 "MAYOR'S DEADLY MORNING" 33.3+: onset f4 (33.43); 0.1, 0.2, 0.7, 1.7, 3.2, 4.9, 6.7, 8.8, 10.8, 12.1, 12.8, 13.0 (plateau 13.8). 90% at f13 = 9 frames (0.30 s) after onset; near-linear ramp (1.1-2.1 per f) with ease-out in the last 3 f. Cyan share ramps 0.18 -> 1.5% over 12 f.
- Ex2 "ONE DEADLY SWITCH" 1208.6+: onset f11; 0.2, 0.8, 1.9, 3.5, 4.7, 5.1, 5.5, 5.8, 5.9, 6.2 (plateau 6.2). 90% at f18 = 7 f (0.23 s); per-frame step 0.6, 1.1, 1.6, 1.2, 0.4, 0.4, 0.3 = ease-in-out, fastest in frames 3-4, then a long soft settle.
- Ex3 L4 title 1008.0+: onset f7; 0.1, 0.2, 0.7, 1.5, 2.8, 3.9, 6.0, 8.4, 10.2, 11.3, 11.9, 12.2, 12.4 (plateau 12.8). 90% at f17-18 = 10 f (0.33 s); S-curve, peak step 2.4 per f at frames 7-8 after onset. Rule: title build 7-10 f, ease-in-out (slow first 3 f, fast mid, soft last 4 f).
**Level card ("Level N", pure-white pixel centroid and area, 30 fps):** appears full opacity in one frame (area jumps 0 -> 3.0-3.2%; 3.0% L1, 3.2% L2, 3.1% L3), then drifts UP 1.5% of frame height (centroid y 47.9 -> 46.4% L1, 47.2 -> 46.5 L2, 48.5 -> 46.4 L3) over 21 f with ease-out (steps 0.2 -> 0.0 per f), holds 21-22 f at the top, exit = 3 f drop down (46.4 -> 46.5 -> 46.8 -> 47.4%, accelerating) into a smeared, blurred slide that is thresholded away by f+4. Card total 0.73 s hold plus 4 f exit. L1 card 31.73-32.47, L2 295.30-295.87, L3 608.93-609.73.
**Page marker wipes (orange area % per 0.1 s, orange = #F25705-ish, measured 30 fps):**
- Ex1, 3-line page 1195.0+: line 1 starts 1195.1: 0.26, 0.76, 1.63, 2.36, 2.88, 3.2, 3.5, 3.7, 3.8, 4.0, 4.1 (90% of line in 0.4 s then a soft 1.2 s tail to 4.35); line 2 starts 1196.7 (4.5, 4.8, 5.5, 6.4, 7.1, 7.6, 7.9, 8.2, 8.4, 8.6 then tail to 8.9 by 1198.0); line 3 starts 1198.3 (9.2, 9.5, 10.1, 11.0, 11.6, 12.0, 12.3, 12.6 tail to 13.4 by 1200). Start-to-start 1.6 s. So each line is an ease-out wipe: 0.4 s to 90%, 1.0-1.3 s to done.
- Ex2, 2-line page 1189.0+: line 1 starts 1189.25: 0.06, 0.16, 0.36, 0.59, 0.77, 0.89, 0.98 ... 1.38 (90% at 0.65 s, full at 2.0 s); line 2 starts 1192.2: 1.45, 1.57, 1.80, 1.95, 2.03 ... 2.31. Start-to-start 2.95 s (slower, on a longer VO sentence). Ease-out the same.
- Ex3, 4-line page 977.4-991: lines start 983.0 (area 0.16 -> 1.75 in 1.6 s, 90% at 0.8 s), 989.4 (1.34 -> 2.98 in 0.6 s) and 990.6 (3.5 -> 6.1 in 0.8 s); the first 5.5 s of the page (977.5-982.8) has a faint pre-highlight of 0.3% (yellow underline). Lines are timed to VO words, spacing is 1.3-6.4 s, never fixed.
**Page push (scale vs time by affine match, every 0.5-1 s):** LINEAR, no easing. 3-line white page 1195.3-1201.3: 1.000 -> 1.024 in 6.0 s = +0.4%/s (steps 0.002 per 0.5 s exactly). No-marker white page 1182.6-1188.6: 1.000 -> 1.016 in 6 s = +0.27%/s. 4-line page 984-986: +0.5%/s (then the page scrolls). Dark-mode pages (2376-2380, 1343-1348): scale 1.000, static. This replaces the earlier by-eye "1.0 to 1.1 over 7.5 s": real push is only +1.6 to +2.4% over 6 s, almost invisible.
**Dissolve / page exit (alpha of outgoing layer per frame):**
- Ex1 2380.0+ page -> footage: 1.0 x11, then 0.96, 0.92, 0.88, 0.84, 0.79, 0.75, 0.70, 0.65, 0.58, 0.50, 0.41, 0.32, 0.23, 0.14, 0.04: 15 f, ease-in (slow start, faster finish).
- Ex2 2375.6+ footage -> page: alpha 1.0, 0.88, 0.77, 0.77, 0.63, 0.56, 0.46, 0.40, 0.33, 0.28, 0.25, 0.21, 0.19, 0.15, 0.12, 0.09, 0.06, 0.03, 0.0: about 18 f, ease-out (fast start, long tail); contaminated by moving footage, so +/- 0.1.
- Ex3 1201.2 page -> footage (3-line page): NO dissolve, hard cut at 1201.63 (1 f). The "12 f dissolve" is not universal: white pages exit by hard cut (or a datamosh burst to host, E4), dark pages exit by dissolve.
**Glitch/static bursts (counted):** E2 11 f, E4 page->host 8 f, E4 host->footage 10 f, 8:36 12 f (earlier) = 8-12 f, median 10.5 f = 0.35 s.

## G4. Tries/failures and open items
- Frame-classification (frames.py 160x90 at 2 fps) failed again in the earlier run; replaced by a streaming 64x36 1 fps script (cls.py, 2739 s, no memory issue). Black beats are 1 s so only 29 of 33 black seconds gave clean M.
- Dark-page push at 1342.0 returned the search floor (0.98): blurred text has no features; reported as static from the 2376 page only. 984-998 page also unreliable after the scroll.
- Whisper small.en: 22 footage windows (10 s) + 5 entry windows done; the host windows were stopped for the time box. Foreign-language raws are invisible to small.en.
- Not done: spectrogram view of SFX separation (no time), per-entry device counts across all 247 cuts.
