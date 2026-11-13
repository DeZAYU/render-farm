# Handoff: Winter Camping Encounters - CASE 7 RENDER (2026-11-10)
Task: section case7 -> V/05_render/case7_v1.mp4 (+ case7_v1_notes.md), QC, then `python W/full_build.py`. Owner pre-approved: no storyboard wait, ask no questions, decide and record here.
R = C:/Users/ayush/Videos/CLAUDE/STYLE guide, V = R/productions/winter-camping-encounters, W = V/05_render/work.
Read: R/docs/ai-state/full_video_plan.md (encode, rules 1-10, QC), R/styleguide/farrell/FARRELL_STYLE_GUIDE.md lines 9-47 (36 rules), case2/case5 handoffs (method).
Touch only *_c7* in W (+ gfx_c7/, seg_c7/, asr_c7*). Other agents render Cases 1,3,4,5,6 at the same time: Pool 2-3, never kill others' processes.
Rulecheck: `cd W; PYTHONPATH=. python ../../../../tools/farrell-build/rulecheck.py edl_c7 final_c7.py` (must be OK) before render.

## Scope (cut sheet Downloads/message (3).txt lines 1245-1420)
CARD-C7 "CASE 7" / "CHINA HAT ROAD" -> VO-C7-01 (+TITLE-C7-01 stamp "ARNOLD OUTDOORS - NEAR BEND, OREGON - JANUARY 2021", ARTICLE-C7-01 Bend Bulletin, channel page, MAP Bend OR / China Hat Road) -> RAW-C7-02 (04:58-05:48) -> RAW-C7-03 (05:48-06:49, curse "creepy ass") -> VO-C7-02 (ARTICLE-C7-02 red light, COMMENT-C7-01 @Corvannor) -> VO-C7-03 (src 06:49-07:36, 11:13-12:56) -> RAW-C7-04 (12:56-15:44) -> VO-C7-04 -> RAW-C7-05 (15:44-17:56, subs all) -> VO-C7-05 (src 17:56-19:01 campfire) -> RAW-C7-06 (22:39-24:08, no subs except [ __ ] mutes) -> VO-C7-06 (COMMENT-C7-02 tiktok 337 likes, COMMENT-C7-03 "middle of nowhere" 55 likes) -> VO-C7-07 (slow push campfire src 11:13, fade to black, END). No outro CTA in the sheet (nothing skipped).
RAW-C7-01 teaser + VO-C6-07 belong to Case 6 (not here).
Source: V/sources/ARNOLDOUTD.mp4 (W4hXGZzr7bA, @arnoldoutdoors1916). Comments not yet downloaded (yt-dlp -> V/sources/comments/W4hXGZzr7bA.info.json).
Narration: V/narration/cut/VO-C7-01..07.wav (+ .words.json, .srt).

## Method (learned from W scripts, agent 1)
- Copy from Case 5 (newest; has channel page + map + mute-no-bleep): asr_c5 -> asr_c7, raw_parts_c5/build_sb_c5 -> build_sb_c7 (sb_c7.json schema: block/kind/src/parts/len/tin/vo/captions/profanity/overlay), edl_c5 -> edl_c7, gfx_c5 + fetch_gfx_c5 -> gfx_c7 (+ map tiles for Bend OR), seg_c5 -> seg_c7 (Pool(6) -> Pool(3)!), mix_c5 -> mix_c7 (mutes from s["prof"] = list of (src0, src1); mute +-20 ms, no bleep), final_c5 -> final_c7.
- seg_c2/c5 render_page: gfx "channel" uses DL/channel.png (centred, drift=0); articles use DL/article_full.png crops (page3d). Case 7 needs 2 article pages (bendbulletin p=665927; slashgear red-light) -> own crops/boxes in seg_c7.
- Map: render_map uses GO/map_base.png + map_base.json pin + osm_credit.png (built in gfx_c5/fetch_gfx_c5).
- Captions [ __ ] for each mute (rule 36), even in RAW-C7-06 (sheet: no subs).
- Encode exact: h264_nvenc -preset p5 -tune hq -rc vbr -b:v 0 -cq 15, yuv420p, 1920x1080, 30000/1001, NO -profile:v; AAC 320k 48k stereo. -17 LUFS, TP <= -1.

## Status
- [x] phase 1: ASR, comments, gfx, sb_c7.json, edl_c7.py, rulecheck OK (rulecheck_c7.txt), gfx test sheet qc/c7_gfx_sheet.jpg looked at
- [~] phase 2: seg_c7 (25/25 ok), asm_c7.mp4 (17401 frames = END), mix_c7.wav DONE; final_c7 NOT run
- [ ] phase 3: QC (duration, 1920x1080 29.97, LUFS, captions, 3x2 sheet looked at, mutes silent), notes, full_build.py

## Phase 1 progress (agent 2026-11-10)
- asr_c7.py (windows A 285-415, B 770-1145, C 1350-1455 src s, cpu_threads 4) -> asr_c7.json [running/done: see asr_c7.log].
- scan_c7.py -> cuts_c7.txt (src cuts: 210.36 296.78 430.25 730.3 1355.0 1366.75 1399.7 1400.05 1415.2 1415.7 1447.0 1451.9; night footage is dark, scan may miss soft cuts).
- sheet_c7.py <out.jpg> t... = source contact sheet tool. c7_src1.jpg picture map: 195-225 day drive (215 creator label "Deschutes River"), 235-262 snowy forest road dusk, 300-456 night (mostly black; headlights 324-336, 365-420), 680-720 shelter meal, 740-775 fire in front of shelter (two men), 1080-1140 fire small in dark + lit shelter, 1365-1380 dark tent, 1400-1440 morning snow camp + pop-up.
- Comments downloaded: V/sources/comments/W4hXGZzr7bA.info.json (115 comments, 21,247 views, upload 2021-02-11). Found: @Corvannor UgwtG3MIS2YVC8pHGXt4AaABAg (12 likes, edited); @hooshey UgxXm_2RtlqkwUS3NGR4AaABAg 337 likes "who's here from tiktok..."; @OEF_Vet_0331 UgzZRSYNEfJYQSjIwsV4AaABAg 55 likes "middle of nowhere".
## Decisions
- "a few thousand views" (VO-C7-06): cannot be verified (no view history); supporting evidence: only 3 of 115 comments are older than ~1 year, the rest are 2-10 months old (the 2026 short wave) -> pre-2026 audience was small. Wav fixed, kept; owner may cut the clause.

- gfx captured (cap_c7.py, all OK, 2026-11-10): gfx_c7/dl/channel.png (name box page px (614,282,880,325)), article1_full.png (Bend Bulletin 1920x8727, light), article2_full.png (SlashGear 1920x17855) + cap_log.json (quote boxes + innerText). Preview c7_capprev.jpg looked at: texts readable; Bulletin paywall modal only in the top 1080 (not in crops).
- Article quote boxes (page px): A1 "Several popular shooting locations ... China Hat Road," line y1935-1964 x470-1088; A1 "well aware of the user conflict along China Hat Road" y3240-3268 x470-866; "150 yards" line y3394. Bulletin text column x 475-~1100, sidebar ad from x~1145 -> crop X 440-1130. A2 SlashGear column x 361-1087: "mainly used to preserve night vision" line y~939-953 (night vision x909-997 at y961 = next line; verify on still); hunting/animals paragraph y2248-2290 ("many animals can't see colors ... fail to recognize red").
- fetch_gfx_c7.py: OSM z10 tiles x165-168 y371-374 cached (pin China Hat Road -121.24/43.93 -> map px ~(548,415)).
- gfx_c7.py written (copy gfx_c5: CASE 7 / CHINA HAT ROAD card, Z=10 map, map_label BEND, OREGON, map_road, panels th_corv/th_tiktok/th_nowhere, creator pill @arnoldoutdoors1916). NOT run yet (needs edl_c7: CARDS corv/tiktok/nowhere, HL, LABELS, CM_LIKES, CM_TIME).
- ASR DONE: asr_c7.json keys A, B, C complete (exit 0). Re-started by the coordinator 2026-11-10 (previous run had died, empty log). asr_c7.py was running (window A first); if asr_c7.json missing/incomplete, re-run `python asr_c7.py` in background (resumes per key A/B/C).
## Planned timeline (decided; VO wav lengths 01 24.82, 02 21.09, 03 23.22, 04 8.93, 05 13.58, 06 20.98, 07 23.24)
Shot lens below are rel. to block start; dis/dip need len >= 4.2 s for 3 s alone (H=18).
- CARD-C7 title 3.0 "fade from black" src 235.0-238.0 (snowy road dusk; no cut 211-296).
- VO-C7-01: ch page 5.0 (dip) | map 7.4 dis (pin China Hat Rd, LABEL loc "BEND, OREGON", holds through "China Hat Road" clause, rule 29) | a footage 4.6 src 240.0-244.6 dis, STAMP "ARNOLD OUTDOORS  -  NEAR BEND, OREGON  -  JANUARY 2021" | art1a 4.4 dis (highlight "Several popular...") | art1b 4.4 dis (highlight "well aware of the user conflict") -> 25.8 >= 24.82.
- RAW-C7-02 dis ~298-348 + RAW-C7-03 cut ~348-409 (word edges from ASR window A; START "still trying to find a spot", END "...we'll find somewhere else"). src cut 296.78: in-handle must stay > 297.4.
- VO-C7-02: art2a 5.2 (night-vision line, hl at ~3.0) | art2b 5.6 dis (animals/hunting paragraph) | b footage 10.8 src 412.5-423.3 night drive (cut 430.25 outside) with COMMENT-C7-01 corv over whole shot (cut text to the 2 highlighted sentences, rule 6).
- VO-C7-03: a src 431.0-437.5 (lit snow, spot two) dis | b src 676.0-684.0 shelter meal | c src 742.0-751.5 fire (cut 730.3 before) -> straight cut into RAW-C7-04 on "at half past eleven, they hear something".
- RAW-C7-04 cut, ~776-944 ("you hear that" .. "they know we're here you know what i mean"), captions.
- VO-C7-04 footage src 752.0-761.6 dis (fire, same night) | RAW-C7-05 dis ~944-1076 (all subs).
- VO-C7-05: a src 1078.0-1085.5 | b src 1112.0-1119.5 (campfire dark; possible undetected pan ~1095-1110, avoided).
- RAW-C7-06 dip ~1359-1446.4 (morning; cuts 1355.0 before, 1447.0 after -> out handle must end < 1446.4 if dip out). No captions except [ __ ] mutes.
- VO-C7-06 dip: a src 1484.0-1497.6 (day forest, cuts 1482.99/1498.28) with COMMENT-C7-02 tiktok whole shot | b src 1469.0-1477.0 (cut 1468.21) COMMENT-C7-03 nowhere whole shot -> 21.6.
- VO-C7-07 dip: a src 744.0-752.0 fire | b src 765.0-772.0 fire | c src 673.0-683.5 slow push (brief: campfire ~673; meal scene with fire), fire raw audio after VO end (sheet "fire crackle then silence"), FADE_OUT dip to black ~2 s. END ~ sum.
## NEXT (phase 1 remainder, then phase 2)
1. ASR done -> raw_parts_c7.py (st/en word edges, keys A/B/C) -> build_sb_c7.py (copy build_sb_c5: CREATOR_SUBS = [] (none seen on night/morning sheets; check bottom strips), PROF list same; RAW-C7-06 caps only "[ __ ]" lines) -> list every mute (src s) here.
2. edl_c7.py from edl_c5: SRC {"ARNOLDOUTD"}, GFX {"VO-C7-01 ch":"channel","VO-C7-01 map":"map","VO-C7-01 art1a":"article1a",... "article2b"}, kind page for article*, _CK corv UgwtG3MIS2YVC8pHGXt4AaABAg / tiktok UgxXm_2RtlqkwUS3NGR4AaABAg / nowhere UgzZRSYNEfJYQSjIwsV4AaABAg, comments.json = dict id->comment from W4hXGZzr7bA.info.json (write gfx_c7/comments.json), CARDS corv text cut to first 2 sentences, HL = sheet phrases, EVENTS 3 (whole-shot windows as c5), LABELS stamp + loc, drop PITCH/TREE (set TREE=None only if final_c7 tolerates; else keep a harmless tuple outside any shot? check final_c2.tree), FADE_OUT ~2.0.
3. gfx_c7.py run; seg_c7.py = seg_c5 s/_c5/_c7/, Pool(3), render_page: channel box (614,282,880,325); article1a/1b crop X 440-1130 from article1_full.png, article2a/2b from article2_full.png crop X 340-1110, boxes above, dim 0.62. final_c7.py = final_c5 names -> _c7, OUT case7_v1.mp4, PANEL corv/tiktok/nowhere, fade from black at start.
4. rulecheck -> rulecheck_c7.txt; test stills contact sheet of gfx (map, pages, panels, card).
5. Phase 2: mix_c7 (mutes from sb prof, +-20 ms no bleep; final shot fire raw audio after VO), seg render, asm, final, QC.
## Agent 3 (2026-11-10) progress
- DONE raw_parts_c7.py -> raw_parts_c7.json; build_sb_c7.py -> sb_c7.json (25 shots, total 580.61 s before fade).
- Decisions: RAW-C7-02 298.20-360.46 | RAW-C7-03 straight cut 361.74-412.44 ("all right so we got to leave".."somewhere else") | RAW-C7-04 812.02-954.48 extended past "you know what I mean" to "no, don't do that" (sheet IMPORTANT DETAIL: keep the decide-not-to-fire exchange) | RAW-C7-05 957.24-1086.97 (ends "11 30 at night", before "fucking assholes") | RAW-C7-06 1401.00-1448.86 (START ON "rude awakening"; ends "doesn't happen again" = sheet 24:08; "emergency situation" lies past the ASR window; src cut 1447.0 falls inside the raw, kept as creator cut).
- Shots moved off the plan to avoid repeats: VO-C7-03 b 700-708 (meal), VO-C7-05 a 1088.6-1094.6 (RAW-C7-05 now runs to 1087), VO-C7-07 a 762.5-770.5, b 720-727, c 673-686 slow push (~4.8 s fire crackle after VO, then fade).
- Mutes (src s -> timeline s, +-0.04 s, min 0.24 s; [ __ ] caption each): 350.82-351.56 shit (81.42) | 364.96-365.28 -ass (94.28) | 813.42-813.66 fuck (188.76) | 822.06-822.38 fucking (197.40) | 990.76-991.16 (372.94) | 1049.04-1049.34 (431.22) | 1062.52-1063.00 (444.70) | 1063.48-1063.98 (445.66) | 1064.34-1064.94 fucks (446.52) | 1065.90-1066.46 fucks (448.08) | 1423.19-1423.43 damn (505.34) | 1424.12-1424.54 fucking (506.27) | 1434.76-1435.14 ass (516.91). RAW-C7-06 captions = only these 3 [ __ ].
- DONE edl_c7.py (from edl_c5; GFX ch/map/article1a/1b/2a/2b; EVENTS corv over VO-C7-02 b, tiktok VO-C7-06 a, nowhere VO-C7-06 b, each fading out in the next shot's transition; HL = sheet phrases; corv cut to the 2 sheet sentences; LABELS stamp + "BEND, OREGON"; TREE off-timeline (no highlight); FADE_OUT 2.0). gfx_c7/comments.json written. END 580.61 s.
- DONE gfx_c7.py run (gfx_c7/out). seg_c7.py (seg_c5 + Pool(3) + render_page for channel box (610,278,884,329) and article1a/1b/2a/2b crops+boxes). final_c7.py (final_c5, K=3 chunks, PANEL th_corv/th_tiktok/th_nowhere, OUT case7_v1.mp4, encode unchanged = plan). mix_c7.py (mix_c5 + VO-C7-07 c fire crackle at -28 LUFS after the VO, ducked to 0 under VO, 2 s fade to silence at END; mutes = sb prof ranges +-20 ms, no bleep).
- rulecheck_c7.txt: "rulecheck: OK".
- test_gfx_c7.py -> qc/c7_gfx_sheet.jpg: map (pin S of Bend), channel (name box red), card, art1a/1b/2a highlights correct, panels corv/tiktok readable. Fix: art2b highlight was "hunt" (cut word) -> now whole line "red light ... invaluable hunting gadget".
- PHASE 2 STARTED (agent 3): `python seg_c7.py > seg_c7.log && python seg_c7.py asm > asm_c7.log && python mix_c7.py > mix_c7.log` (PYTHONPATH=., Pool 3). If killed: re-run the same chain (segcache keeps finished segments). Then `python final_c7.py` (K=3) -> V/05_render/case7_v1.mp4, then QC (phase 3).
- PHASE 2 RESULT (agent 3, 2026-11-11): all 25 segments ok, asm OK (17401 frames), mix_c7.wav: I -16.72 LUFS, TP -0.94 dBTP (spec <= -1: 0.06 dB over; check mix_c7.py limiter/af ceiling before final, e.g. lower the limiter ceiling ~0.2 dB, then re-run `python mix_c7.py`), 13 mutes applied, no bleep.
## NEXT (agent 4)
1. Fix TP in mix_c7.py if the ceiling is the cause; re-run mix_c7.py.
2. `cd W; PYTHONPATH=. python final_c7.py` in background (Pool 3 chunks) -> V/05_render/case7_v1.mp4.
3. Phase 3 QC: duration 580.61, 1920x1080 29.97, -17 LUFS +-0.5, TP <= -1, captions, 3x2 still sheet, the 13 mute points silent (timeline s listed above), fades (fadescan); notes case7_v1_notes.md; then full_build.py (owner of full build: fix agent).
## Coordinator 2026-11-11
- mix_c7.py limiter 0.78 -> 0.70 (TP was -0.94): mix_c7.wav now I -17.01, TP -1.73, LRA 18.9.
- final_c7.py started in background (log W/final_c7.log). Next: QC (ffprobe duration ~580.61 s, 1920x1080 30000/1001, ebur128, 3x2 still sheet, mute points silent via astats on each timeline mute +-20 ms), case7_v1_notes.md, then `python W/full_build.py`.
- DONE 2026-11-11: V/05_render/case7_v1.mp4 580.61 s, 17401 frames, 1920x1080 30000/1001 h264 Main (= other sections), AAC 48k stereo; ebur128 I -17.0 LUFS, peak -1.8. 13 mutes measured -51..-53 dB (room tone level) vs -20..-35 dB around them. Still sheet W/qc/c7_final_sheet.jpg looked at: card, map BEND OREGON pin, "[ __ ]" caption, campfire raw, tiktok comment panel, VO-C7-07 shelter shot OK.
- full_build.py run: full 2706.84 s, but case5 has no render yet -> full video lacks Case 5; re-run full_build.py once case5_v*.mp4 exists.
- Deviation: VO-C7-07 last shot (src 673-683.5) is the lit shelter/meal scene with a person, not a pure campfire push (cut-sheet "slow push on the campfire"); fire shots a/b precede it. Owner may swap.
