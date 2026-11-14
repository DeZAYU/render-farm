# ad_dashcam_iceberg: STYLE (Abyssal Detective 2, "Most Disturbing Disasters Caught on Dashcam Iceberg")

Source: 55:31, 1920x1080, 60 fps, AV1, opus. Chapters: INTRO 0:00, L1 0:33, L2 5:27, L3 11:21, L4 18:37, L5 25:06, L6 34:33, L7 44:26.
Analysis done with: ffmpeg scene detect (0.3, 320 px), 20 s samples (t = 20k-10 s), contact sheets, ebur128, 16 kHz RMS. 41 stills in `gate/`.

## What this reference owns (summary)
1. A dashcam-countdown told as an iceberg: 7 levels, ~30 cases. Each case = berg card (cyan glitch-typed title on a slow-pushing berg still), a 0.2 s RGB datamosh burst, then dashcam footage. Iceberg-only: levels, berg, typewriter "Level N" (one line, skip for us).
2. Footage is never left plain: key moment is re-presented as a threshold/posterise high-contrast replay, a B&W desaturate freeze, a red-duotone tint, a cyan/blue solarize spotlight ellipse, a 3-panel split lens, and a slow push. Same clip is shown 2-4 times in different looks.
3. Text on footage is tiny and typed: place label bottom-left (VHS caps, 2 lines, "TULLAMARINE FREEWAY / (AUSTRALIA)"), date typewritten letter by letter with a red cursor block, then blur-fades out. Name tag = orange label (#FB9404, dark serif-slab text) at bottom centre.
4. Real news pages as evidence: white page, black serif, yellow marker sweeps across the key line (animated highlight), ~10-20 s hold. Annotated satellite map with white callout boxes. Victim/offender photos in B&W or red VHS edge.
5. Censorship = pixel mosaic (big square blocks, ~12-16 px blocks at 1080p) over bodies/faces, moving with subject; no bleeps found (no tonal 0.7-3.5 kHz event in the track).
6. On-camera host (bald man, moustache, lilac shirt, study set, TV with logo) cuts in every ~3-5 min as a 20-60 s talking-head break; subscribe-button animation once (~18:30).
7. Audio: very quiet master, -25.2 LUFS integrated (LRA 6.1 LU, TP -0.5 dBFS). VO over a bed; dead air only 4 gaps <0.6 s in 55 min (VO is wall-to-wall, no silent beats except end).
8. Edit rhythm is slow: median shot ~6.6 s (events), most shots 10-50 s long (dissolves, not cuts); fast bursts only at glitch transitions and case ends.
9. Grade: footage mean saturation ~0.30 (HSV, 0-1), black point ~4, white point ~242, strong vignette (corner/centre luma 0.68 median), teal-shifted shadows, warm skin/orange accents.
10. Outro = host on camera (3320 s) then end.

## 1. Cuts (scene detect 0.3; limits stated)
- 575 raw hits; collapse hits <=0.5 s apart into events: 240 events = 4.3/min. 76 events are glitch bursts (3+ hits inside 0.5 s = datamosh/RGB transition), 41 pairs, 123 true single cuts.
- Shot length (events): median 6.6 s, mean 13.8 s, p10 0.6 s, p90 39.7 s. NOTE: dissolves and long graded footage are under-detected, so real picture changes are ~2x the events.
- Per section (events, median gap between events): INTRO 6 (3.5 s); L1 25 (9.3 s); L2 24 (9.3 s); L3 23 (10.2 s); L4 31 (2.9 s, glitch heavy); L5 28 (9.8 s); L6 44 (7.7 s); L7 59 (3.9 s). Later levels are faster and more glitchy.
- Fast cluster examples (hits/min): 0:00 25/min intro, 1130-1200 s 38 and 32/min (L4 start, glitch-shuffle at 1183-1192 s, 6 bursts in 9 s), 3150-3290 s 65/min (finale stack at 3266-3272 s).

## 2. Intro (0:00-0:33), measured by 5 fps / 1 fps sheets
| t (s) | device | notes |
|---|---|---|
| 0.0-1.0 | red mono "WARNING:" on black, then white mono caps "THIS VIDEO CONTAINS STORIES THAT SOME VIEWERS MAY FIND DISTURBING" with pixelated red berg behind, VHS scan jitter | 2 lines centred, ~4% frame height, mono pixel font |
| 2.2-2.6 | glitch burst (4 cut hits 2.2-2.6) + magenta/blue RGB slab; text corrupts | 0.4 s |
| 3.0-4.0 | "VIEWERS DISCRETION IS ADVISED", "DISCRETION" in red | hits at 4.0-4.2 (white-out flash into dashcam) |
| 4.2-4.6 | overexposed cyan-white flash frame, hard to footage | 0.3 s |
| 5-8 | "ABYSSAL DETECTIVE PRESENTS" 2-line chrome/white pixel type on moving dashcam (smoke on horizon), de-focus fade-out | ~3 s |
| 8-12 | dashcam with yellow bonnet (pipe truck ahead), slow push | 3 s+ |
| 12-14.5 | case index: all case names in mono, stacked in horizontal bands over the berg, white rule lines between bands, scrolls slowly | ~3 s, hits 14.5 |
| 14.5-30 | dashcam cold-open montage: bridge/motorbike, night ghost-car, aerial crash, taxi on fire, over-saturated threshold replay, 3 s black before title | long shot 14.5-29.7 (15 s) |
| 29.7-34 | black ~3 s (silent runs at 31.4 s and 32.1 s, 0.5 and 0.6 s) | audio dips -47 dB at 30.7 s for 2.0 s |
| 34-38 | "Level 1" typewriter (mono, white, ~7% height) on the berg waterline, blur-dissolve (dive) into the berg face | iceberg-only |
| 38-42 | "A MOUNTAIN OF PAIN" cyan glow type on berg, ~3 s hold | the first case card |

## 3. Case anatomy (measured on case 1 "Distracted" 454.6-457.6 s and several cards)
1. Fade up from black (about 0.5 s) to a berg crop, push-in of ~3-4 %/s.
2. Title scrambles in (glitch-decode letters ~0.5 s from 455.4 s), then sits clean ~1.8 s. Look: all caps, wide tracking, cyan (#4FE8E8-ish) with outer glow, ~3.5% of frame height, positioned centre-left on the berg at ~45% height (varies card to card).
3. Datamosh burst: 2 frames of RGB-smear/white slabs (0.2 s) with 4-5 scene hits.
4. First shot = the dashcam/cabin clip, no VO restart delay needed: VO runs through the card (VO wall-to-wall; card has VO under it).
5. First 2-3 s: place label bottom-left (e.g. WEST SUSSEX / (ENGLAND) at ~468 s), then date typewriter ~470 s.
6. Middle: 20-50 s of dashcam, interleaved with news pages (yellow highlight), portraits, bodycam/aerial, mosaic cut-ins.
7. Case close: usually victim portrait + news page, then host or straight into next berg card. Card titles seen: A Mountain of Pain (38 s), Hangman (130 s), Airborne (310 s), Distracted (456 s), Highway Fireball (1510 s), No Support (1790 s), Running Out of Road (1190 s); ~30 cases overall (index at 12-14 s lists them).

## 4. Text roles (sampled pixels from full-res stills)
| role | position | size | look | entry/exit | hold |
|---|---|---|---|---|---|
| case title | on berg, mid | ~3.5% H | caps, wide track, cyan + glow, sans | glitch-decode in, 0.2 s glitch out | ~2 s |
| place label | bottom-left, x 3%, y 82-90% | ~3.5% H, 2 lines | VHS pixel caps, off-white (#E8E8E8), soft shadow | cut-in with VHS scan jitter, cut out | ~2-3 s |
| date | centre, y ~50% | ~6-7% H (cap height); text bbox ~63% width | white mono/pixel caps; last typed char in red box #A51F20 | typewritten per letter (about 0.1 s/letter), cursor = red block; exit blur-fade 0.5 s | ~3 s |
| name tag | bottom centre, y ~88% | ~5% H, box 30% W | orange #FB9404 label, black slab-serif, tape-like edges | pops in, fades with portrait | ~3 s |
| warning | centre | ~4% H | red then white mono | scan jitter | 3-4 s |
| news page | full frame | body text ~2.5% H, serif black on white | yellow (#FFF000-ish) marker sweeping left to right across the key clause | page appears via flash; highlight animates ~1 s per line | 10-20 s |
| map callouts | on aerial map | ~3% H | white boxes, black sans, arrow leaders, N compass | pop/draw | 4-6 s |
| host sub CTA | lower right of host | small pill | like/dislike/subscribe pill with cursor click | ~3 s | once at ~1110 s |

## 5. Transitions
- Glitch/datamosh burst: 76 events in 55 min = 1.4/min, 0.2 s (about 12 frames at 60 fps); marks card to footage and some case ends.
- Dissolves/fades: most picture changes (not detected as cuts); 0.5 s fade from black for berg cards.
- Hard cuts inside montages (123 single events = 2.2/min detected).
- White flash/over-exposure into footage (4.2 s in intro; cinematic whiteout).
- Black gaps: ~6 black samples out of 167 (3.6%): at 30, 830, 850, 1310, 1330, 2330 s.

## 6. Footage vs designed (20 s samples, n=147 usable of 167)
- footage (dashcam, CCTV, news, bodycam, aerial): 123/147 = 84%. Host: 10 = 7% (at 90, 270, 730, 1110, 1850, 1970, 2150, 2290, 2490, 2730 s). Pages: 4 = 3%. Berg cards: 5 (+ many short, under-sampled) ~3-5%. Black 4%. Estimated designed share (text, cards, pages, host, maps): ~20%.
- Dashcam framing: 16:9 footage full-bleed with a vignette; 4:3/vertical clips shown pillar-boxed inside the vignette or as a 3-panel split lens (centre panel = the clip, side panels = blurred/dark stretched edges), e.g. 1150 s.
- Replays: key moment replayed 2-4 times: normal, posterised threshold (white/black/red high-contrast), cyan solarize spot ellipse on the vehicle (290 s), B&W desaturate of the cabin frame, red duotone (610 s), pixel mosaic at the moment of impact.
- Freezes: B&W desaturate on the cabin cam (frame 10 of the "Distracted" sheet, ~466 s) with VO line; used as emphasis for the driver.
- Zoom: continuous slow push-in 3-4 %/s on every card and on many clips; no punch zoom found.
- Maps: satellite aerial with white callout boxes and arrow leaders (2170 s), plus a news-site-style page.
- Pages: black serif on white, yellow highlighter sweep.

## 7. Audio
- Integrated -25.2 LUFS, LRA 6.1 LU, true peak -0.5 dBFS. Quiet master by design (not -14); 5th-95th percentile of 100 ms RMS per level: about -45 to -18 dBFS. Medians -30.5 (L1) to -32.7 (L4).
- Bed vs VO: p10 (bed + gaps) about -43 dB, median (VO on bed) -31 dB, p90 (VO peaks) -25 dB. Estimate: VO sits about 10-12 dB above the bed. (estimate from the 100 ms RMS distribution, not separated stems.)
- Silent beats: only four runs below -55 dB over 0.3 s: 31.4 (0.5 s), 32.1 (0.6 s), 729.5 (0.4 s), 3296.8 (0.6 s). Quiet (< -40 dB) runs >= 1 s: 29 in 55 min (about 0.5/min), the longest 2.5 s at 3327.6 (the end), 2.0 s at 30.7 (before Level 1). VO gap lengths are therefore 0.3-1.2 s breaths.
- Loud transients (rise >= 14 dB inside 0.5 s): about 25/min, but this counts VO syllables and raws; per level 23.7-31.4/min. No separate SFX stem was isolated. Visual cues suggest hit/whoosh on the glitch burst and the case cards. Not measured: raw clip-sound length under the dashcam shots (clip audio is mixed low under VO).
- Bleeps: none (spectral tone search 0.7-3.5 kHz, 50 ms frames: 0 sustained events).
- Raws: dashcam raws seem low or absent (the track has no crash-level peaks above -17 dBFS in the percentile data; p99 -17 to -20 dBFS).

## 8. Grade (20 s samples, 59 footage frames)
- HSV saturation mean 0.30 (median 0.30; per-frame 0.05-0.73), 1st percentile luma median 4, 99th percentile luma median 242, mean luma 74.5.
- Vignette: corner / centre luma median 0.68 (strong dark corners), look is cool teal shadows + warm highlights, lifted-grain texture on host shots.
- Look layers: VHS scan jitter on date/place cards, 2 px colour fringe on titles, red edge bleed on portraits (the "red VHS edge" frame at ~470 s), heavy grain on night clips.

## 9. Censorship
- Mosaic: square pixel blocks ~12-16 px at 1080p (about 1.2% of frame height), full contrast, tracked on bodies/face (750 s, 1590 s). Soft Gaussian blur on bystander faces in some CCTV clips. No black bars. No bleep. Dead bodies get mosaic; the rest uncensored.

## Known gaps / limits
- No frame-by-frame at 30 fps on case 2 and later: only case 1 card at 10 fps and intro at 5 fps. Entry frames above are from those, not per-frame at 60 fps.
- SFX stem not isolated; counts of whooshes are not reliable.
- Level/case list timecodes of berg cards beyond the 7 above not logged (20 s sampling misses 2.7 s cards).
- A first attempt got cut off by an app restart; scene log re-run with -v info (first run used -v error and wrote nothing, noted so nobody repeats it).
- Intermediate files in `work/` (contact sheets, scene.log, ebur.log, cuts.npy, 20 s sA samples, scripts). The 16 kHz raw and the tiny4 raw were deleted.

---
# APPENDIX (round 2, partial): case cards, SFX, VO gaps. HANDOFF for the next agent at the bottom.

## A. Case-card timecodes (berg title, cyan type; verified by eye on `work/cc_sheet0.jpg`, `cc_sheet1.jpg`)
Method: 4 fps 160x90 features (`work/feat4.csv`: t, luma, sat, cyan-pixel share, teal share, host-diff) -> runs with teal>0.1 and cyan>0.002 -> candidates with a cut within 1.2 s after (`work/cardruns.npy`) -> contact sheet check.
Card (mid-time of clean title, then burst/cut after it): 
38 A MOUNTAIN OF PAIN (L1, 35.0-42.2 incl. Level 1 type) | 129.4 HANGMAN (burst 130.3) | 227.4 OUT OF NOWHERE (228.5) | 329.1 AIRBORNE (330.1) | 456.5 DISTRACTED (457.4) | 684.2 CAVED IN (685.0, L3 starts 681) | 832.8 WEATHER WARNING (834.0) | 965.2 THE SINKHOLE (966.2) | 1120.4 CASCADING CARS (1121.8, L4 starts 1117) | 1188-1192 RUNNING OUT OF ROAD (glitch shuffle, 6 bursts in 9 s) and again 1251.0 (1252.2) | 1380.1 RUNAWAY MONSTER (1381.5) | 1508.6 HIGHWAY FIREBALL (1510.3, L5 starts 1506) | 1660.8 THE PILEUP (1661.6) | 1790.6 NO SUPPORT (1791.8) | 1926.1 CHAIN REACTION (1927.2).
Spacing: 15 verified cards in 33-1930 s = one card every ~126 s on average (range 98-193 s); card hold 1.5-2.8 s clean, cut/burst 0.1-1.2 s after the title ends. Index at 12-14.5 s promises ~16 named stops (A Mountain of Pain, Two-Ply Water, Selfish Choice, Highway Fireball, Concrete Rain, Fried Chicken, Chain Reaction, Overdrive, Final Rescue ...; the index text is not the real card list).
NOT FOUND (gap): cards from 1930 s to 3330 s (L6 2073, L7 2666 starts and cases between). The cyan-text detector found only footage there; no berg card seen in 20 s samples after 1930 s either. Either cards change look (not cyan/teal) or are rarer. 21 non-cut candidates 2069-3287 s were all footage (see cc_sheet1).
Chapter-start stings: side-channel (stereo-wide) hits at 33.2, 324.3, 679.0, 1118.1, 1506.5 s = Level 1-5 starts, +-0.1 s of chapter times 33/327/681/1117/1506.

## B. SFX and raws (measured, with limits)
- Stereo: music/ambience/SFX are wide, VO is centre (mid -27.1 dB, side -40.1 dB, L/R correlation 0.90 on 400-520 s). Side channel therefore approximates "everything but VO".
- Side-channel onsets (rise >= 12 dB over median of previous 1 s, floor -48 dB, 0.5 s refractory): 126 total = 2.3/min; per section/min: INTRO 10.9, L1 1.4, L2 1.9, L3 1.8, L4 1.7, L5 3.9, L6 1.2, L7 2.6. Median side level -47.5 dB (p5 -58, p95 -37.9).
- Low-frequency (30-110 Hz) hits (rise >= 12 dB): 309 = 5.6/min (L1 19, L2 13, L3 75, L4 52, L5 26, L6 84, L7 36); only 20% of single cuts, 13% of glitch bursts and 3% of random times are near one (so most are inside footage: crash thumps / raws, not edit SFX).
- Glitch bursts (76) have NO low-frequency or stereo SFX hit (0%). Their audio is a short (~0.1 s) mono broadband tick (seen on spectrogram at 457.4 s) that band-onset detection cannot separate from VO fricatives (11-15.5 kHz clicks near cuts 75% vs 73% random = not separable). Level-start stings are the only reliable edit SFX.
- Example timecodes, side-channel hits: 3.1, 11.5, 23.8, 26.7, 33.2, 47.0, 70.4, 153.5, 324.3, 381.0, 464.4, 563.6, 679.0, 734.9, 972.0, 1118.1, 1506.5, 1514.4, 1799.9, 1875.2 (20 examples). Low-freq hits: 11.1, 19.9, 26.7, 32.8, 37.8, 43.7, 59.2, 124.5, 191.8, 464.4, 505.9, 606.0, 693.1, 704.7, 721.9, 753.6, 829.8, 870.9, 878.9, 882.8.
- Card audio (spectrogram 450-464 s): hard bed change at the cut into the card (bed with HF hiss <=3 kHz before, quiet mid-band bed after), VO pauses ~1.8 s (453.7-455.5), a faint tonal line ~1.5 kHz under the card 455.2-457.4 s, VO resumes 455.6 s, burst tick at 457.4 s.
- Raw clip-sound length under VO: NOT MEASURED (no stem separation available: demucs not installed). Level of clip audio is low: whole-track p99 is -17 to -20 dBFS and there are no crash peaks above that.

## C. VO gaps (faster-whisper VAD, threshold 0.5, min silence 250 ms)
- 369 speech segments, speech share 93.9% of runtime (music-tinted VAD may over-count). Gaps between segments: n=368, median 0.30 s, p10 0.17 s, p90 0.94 s, max 13.5 s (at 3284 s, the outro). Gaps >= 2 s: 13; >= 5 s: 1; >= 10 s: 1. So VO is practically continuous: breaths of 0.2-0.9 s, only 13 pauses >= 2 s in 55 min.

## HANDOFF (what is still open; round 2 was cut short by context size)
Done: card timecodes 1-1930 s; SFX per minute (side + sub-band) and examples; VO gaps.
Open (not done): (1) frame-step of 2 early + 2 later cases (card entry/hold/exit, first footage, replay/freeze/spotlight easing) - only case 1 (454.6-457.6 s at 10 fps) was stepped; (2) card timecodes after 1930 s; (3) raw clip-sound lengths and fades under VO (needs stems or per-window ASR/energy study); (4) faster-whisper word timing for device entries on 3 cases. faster-whisper 1.0.3 is installed and small.en is cached (`~/.cache/huggingface/hub/models--Systran--faster-whisper-small.en`); transformers/torchaudio/demucs are not installed.
Helpers in `work/`: feat.py (4 fps features), feat4.csv, cardruns.npy, cuts.npy (scene hits), speech.npy (VAD segments), sidehits.npy, subhits.npy, side20ms.npy, vad.py, sfx.py, sfx2.py, side.py. Big raw audio files were deleted.
Suggested next step: whisper only on 3 windows (e.g. 120-140, 320-340, 1500-1520 s) with word_timestamps=True and the entry times of: place label, date, name tag, card title; then 10 fps sheets (ffmpeg -ss T -t 3 -vf fps=10,tile) for cases at 129.4, 227.4, 1508.6, 1790.6.

---
# Gap fill 2 (round 3): frame-steps at 30 fps, cards after 1930 s, clip-sound study, VO word timing
Tools: ffmpeg 30 fps 320x180 extracts per window (`work/g2/fs.py`, `w.py`, `reg.py`, `summ.py`, `sheet.py`), feat4.csv teal run detector with looser thresholds, faster-whisper small.en int8 (`work/g2/asr.py`, `words.json`). New stills in `gate/` (16 added: t0126, t0128, t0130, t0144, t0145, t0149, t0211, t0283, t2076-t3134 cards).

## G1. Case cards after 1930 s: FOUND (8 more, all the same title-card look)
Why the first search missed them: it required cyan text share and a cut within 1.2 s. Cards have a berg still with 85-97% teal pixels, saturation 35-41, luma 37-48 (dark). Detector that works: teal share > 0.5 and sat > 20 for >= 0.75 s, then eye check of one frame per run (`work/g2/cardsheet.jpg`).
| t start-end (s) | title | note |
|---|---|---|
| 2074.5-2077.0 | VOLATILE | first card of L6, comes right after the typewriter "Level 6" (2070-2073) |
| 2242.8-2245.5 | CONCRETE RAIN | |
| 2376.8-2378.8 (+burst 2379.0) | FRIED CHICKEN | |
| 2514.0-2516.8 | SUPER TYPHOON | |
| 2667.8-2670.5 | OVERDRIVE | right after "Level 7" (2665) |
| 2824.3-2826.5 | DOUBLE WAVES | |
| 2977.0-2979.3 | HIGH GEAR | |
| 3133.5-3135.5 | FINAL RESCUE | last case card |
- All 23 cards now known (15 earlier + 8): 38 ... 3134 s. Gaps after 1930 s: 148, 168, 134, 137, 154, 156, 153, 157 s, mean 151 s (L6/L7 cases are longer than L1-5, which were 126 s). 3290 s = closing berg (shark + piranhas + rock, rain) with the Patreon notice, not a case card.
- Card look: a different berg still per level family: L1/L2 cards = pale snowy peak (Hangman, Out of Nowhere); L6/L7 cards = a dark skull-shaped berg with teeth, same still in every L6/L7 card but re-framed (zoom/offset differs per card). Title: cyan #39E5F0-ish, wide extended sans caps with glow, centred a little below mid-height, 28-35% frame width, 2-3 words max. (Verified: gate/t2076..t3134.)
- Also seen in L6/L7 sampling: red-block month text "MAR/MARCH" (2230 s) and "JUNE" (2835 s) typed with red cursor block, "SEPTEMBER 5, 2013" (2985 s) VHS date, place label "TANJUNG MALIM (MALAYSIA)", "PINETOWN (SOUTH AFRICA)", name tags (Amirul Zulkifle, Gregory Govender, Jung Baodong, Mike Moye) = same system as L1-5; no new device kinds found after 1930 s except the closing berg and the L8 Patreon end card ("Level 8 of every episode is now on patreon.com/AbyssalDetective", 3290-3320 s) and "THANKS FOR WATCHING" (3330 s, white mono caps on black).
