# Handoff: VAN CAMPING ENCOUNTERS - CASE 5 "THREE KNOCKS" (section case5) (2026-11-11)
Brief: docs/ai-state/van_case_brief.md N=5 (items 8-10!). Example done: van_case2_handoff.md + W/*_c2.py. Hands-off; record choices here.
R = C:/Users/ayush/Videos/CLAUDE/STYLE guide, V = R/productions/van-camping-encounters, W = V/05_render/work, WW winter work READ ONLY.
Safety: stay inside R; never edit WW / common.py / source mp4s; touch only *_c5* in W (+ gfx_c5/, seg_c5/, capwrap_van.py). GPU shared: Pool(2), retry NVENC errors (run_c5.sh does 5 tries); never two final_c5 at once.
Rulecheck: `cd W; PYTHONPATH=.;../../../../tools/farrell-build python ../../../../tools/farrell-build/rulecheck.py edl_c5 final_c5.py > rulecheck_c5.txt`

## Scope (cut sheet V/00_input/cut_sheet.md lines 933-1131; IN MEDIAS RES)
Section starts with RAW-C5-01 (case4 ends hard cut after VO-C4-06 bridge; case4 handoff confirms "case5 opens with RAW-C5-01 in its own section").
RAW-C5-01 10:12-10:57 whispered phone clip ("Someone just came knocking on my door in the middle of the national forest" .. "So not cool"; only her live clip, not reflective narration; MUSIC OUT; captions)
-> CARD-C5 "CASE 5"/"THREE KNOCKS" (decided: card after the opener, like winter case5; dip in/out) -> VO-C5-01 22.72 s (VISUAL time-rewind fx then daytime camp views src 04:15-05:27; TITLE-C5-01 stamp "EXPLORING GEMS  -  COLORADO  -  SUMMER 2025"; channel page 3D @ExploringGems; place line "public land in Colorado" -> MAP Colorado (rule 29; port map code from case3/4: fetch_gfx_c3 OSM tiles + gfx_c3 map_base/labels + seg_c3 render_map map1), label "COLORADO")
-> RAW-C5-02 08:51-09:24 ("I had just found one of the most stunning camp spots" .. "Just me and Gem, completely alone"; her VO track)
-> VO-C5-02 7.32 s (logging trucks, src 03:16-03:42 picture only)
-> RAW-C5-03 09:24-10:12 (start "But by the weekend, more people started showing up" .. "Loud and obnoxious, yes, but harmless, at least at first"; TRIM "But that moment would end up leading to the scariest night...")
-> VO-C5-03 4.63 s (freeze of her stepping aside on the road if filmed, else empty road; src 09:24-09:48 VERIFY)
-> RAW-C5-04 10:12-11:40 ("Gem and I ate dinner, locked up the van" .. "but they never came back, thankfully"; MUSIC OUT knock clip; highlight motion lights on dash + glow up the hill if visible (red box, verify on still))
-> VO-C5-04 10.18 s (driving deeper into forest, morning, src 11:40-12:03)
-> RAW-C5-05 12:03-12:31 ("All right, here we go. Slept there last night" .. "most of them were leaving"; source already bleeps "scared the [ ] out of me" -> keep as source, caption "[ __ ]")
-> VO-C5-05 21.90 s (COMMENT pinned creator over Gem in the van)
-> VO-C5-06 17.54 s (COMMENT viewer theory)
-> RAW-C5-06 12:54-13:42 ("I can't help but feel frustrated knowing that if I were a man" .. "more precautions in regards to visibility"; let "I still move differently to this day" breathe)
-> VO-C5-07 14.40 s (BRIDGE; BYTHECURB 09:21-10:00 dark lane, picture only)
-> RAW-C6-01 teaser BYTHECURB 03:54-05:18 ~6 s of shouting, END before "so I've got some nut shouting outside"; caption "[shouting - unclear]" only (do not subtitle guessed words); hard cut END (FADE_OUT 0.001).
Rule 37: captions on ALL speech in every raw (sheet "SUBTITLES No" overridden), none over creator burned-in subs. Rule 38: wrap via capwrap_van (edl_c1.py lines 70-85 + gfx_c1.caption are the pattern). Rule 39 n/a (Colorado named -> map).

## Sources
EXPLORINGG.mp4 (6QXxDySGL3s, 866.1 s, 1920x1080 23.976 fps; upload 2025-11-13, channel "Exploring Gems" @ExploringGems UCnriEa2RU0tyCxPawXUx9lQ). BYTHECURB.mp4 (742.2 s, 50 fps). Case4 note: EXPLORINGG 584-612 = bright day van on ridge (used by case4 bridge 584.0-594.5 - avoid reuse).
VO lens: 01 22.72, 02 7.32, 03 4.63, 04 10.18, 05 21.90, 06 17.54, 07 14.40.
Comments (V/sources/comments/EXPLORINGG.info.json, both FOUND):
- pinned = UgyPKvjv3N-QuHvpFyV4AaABAg @ExploringGems 43 likes, pinned, "11 months ago (edited)". Long -> cut (rule 6) to: "No, Gem actually did not bark at the time that this happened, and it wouldn't have mattered because the knockers saw us both in broad daylight. ... Also, there was Not an emergency... The knock wasn't them 'trying to warn me', it was them having some fun at my nervous system's expense." HL = "The knock wasn't them 'trying to warn me', it was them having some fun at my nervous system's expense."
- theory = UgyMidDY-d7kqWpdkpd4AaABAg @usmcmsgt7051 1 like, "10 months ago" (sheet said dated 27/12/2025; info.json timestamp = 2026-01-11 -> use info.json). Cut to first 3 sentences ("I hate to say it but I think when you wave to those people they took it like an invitation. And then if they're drinking at night, they might remember hey that female was nice to us. Let's knock on her vain and see if she wants to join us." - keep "vain" as written). HL = "I think when you wave to those people they took it like an invitation."
Card style = c2 recreated YT-dark cards (gfx_c2 comment_block; creator pill for @ExploringGems + "Pinned by @ExploringGems" line if easy).

## Done (agent 1)
- Step 1: W/*_c2.py copied to *_c5.py (sed _c2->_c5, case2_v1->case5_v1): asr build_sb cap edl fetch_gfx final gfx mix raw_parts scan seg sheet test_gfx; run_c5.sh. ALL still contain Case 2 data (JENS/OVERLANDNO, ringtail, jeff/reply, pip) -> rewrite. W override already present in final/mix/seg (inherited from c2) - verify.
- capwrap_van.py already existed in W (used by edl_c1/gfx_c1) - not changed.

## NEXT
1. asr_c5.py windows on EXPLORINGG: A 525-570 (RAW-C5-02), B 560-620 (RAW-C5-03), C 605-705 (RAW-C5-01 + RAW-C5-04), D 715-760 (RAW-C5-05), E 765-830 (RAW-C5-06); BYTHECURB F 230-320 (teaser; only to locate the first shout + "nut shouting"). Run in background.
2. scan_c5 (TAG env) cuts for EXPLORINGG 190-330, 520-830; BYTHECURB 230-320, 555-605. sheet_c5 stills -> picture map (camp day 255-327, trucks 196-222, road/wave 564-590, dash lights / hill glow in RAW-C5-04, morning drive 700-723, Gem in van for VO-C5-05, BYTHECURB lane 561-600). Check where her live dark phone clip vs reflective narration is inside 612-700 (RAW-C5-01 = live clip only). Check creator burned-in subs.
3. Rewrite raw_parts/build_sb/edl/gfx/cap(channel only, @ExploringGems)/fetch_gfx(OSM Colorado tiles)/seg(map kind from seg_c3; rewind fx exists in final via fx="rewind")/final(PANEL pinned/theory, OUT case5_v1, FADE_OUT 0.001)/mix/test_gfx. Then rulecheck OK, test sheet looked at, bash run_c5.sh (bg) -> V/05_render/case5_v1.mp4, QC per brief step 6.

## Agent 1 progress 2 (asr/scan/picture map)
- asr_c5.py edited (windows C 605-705, A 525-570, B 560-620, D 715-760, E 765-830 EXPLORINGG; F 230-320 BYTHECURB; cpu_threads 2) and STARTED in background (log W/asr_c5.log, ends with "ASR_EXIT n"; resumes per key if killed: just rerun `python asr_c5.py`).
- scan_c5.py (TAG arg, per-tag fps) done: cuts_c5_EXPLORINGG.txt (56 cuts), cuts_c5_BYTHECURB.txt (1 cut 285.9). sheet_c5.py default TAG EXPLORINGG.
- Picture map (qc/c5_src1..4.jpg LOOKED AT):
  EXPLORINGG: 196 van interior; 202-232 grassland seen through van window grille, dust trail / vehicles far away on road (logging trucks? 202 shows dust on the road = best for VO-C5-02); 232 "ENTERING PUBLIC LANDS" sign (good for VO-C5-01 / map line); 238-250 interior laptop/coffee; 256 Gem asleep in van seat (= "Gem in the van" for VO-C5-05); 262 cab; 268-292 big green hills/sky (daytime camp views, VO-C5-01); 280 solar panel; 292-322 dirt road + Gem walking; 328-334 logging slash/forest road.
  560 van on open ridge; 566-620 van camp ridge day, she sets up table/chair, Gem (602-614 creator subs "checking for foxtails..."); 620 her in chair. 626-660 BLACK/dark = live night phone clip: 626 burned sub "someone just came knocking on my door in the middle of the national forest. so." (sheet RAW-C5-01 10:12 = real ~10:25) ; 632 creator text "HEART RACING", 644 "listening" (creator overlays); 662 forest drive day ("these guys" overlay); 668-674 two lights in darkness (fire/lights up the hill? -> red box candidate for "glow up the hill"); 680 sky; 686-724 morning camp, Gem on blanket, sun; 706 van door/chairs; 730-772 driving forest road day (VO-C5-04 "driving deeper into the forest" = 730-772, not 700-723); 778 forest; 784-832 roof/solar install (not case).
  CREATOR BURNED-IN SUBS present on most of EXPLORINGG (small white text bottom centre, e.g. 208-220, 256, 274, 328, 602-608, 626). Rule 37/7: keep theirs, add NO captions where burned in -> check each raw window on stills; likely all raws are already subbed -> our captions only for [ __ ] / lines without subs.
  BYTHECURB: PORTRAIT video (pillarboxed 9:16). 232-274 dark window glass with writing in condensation (dark, night) ; 280-316 dark/odd angles, 316 his face; 556-601 = man selfie INSIDE van (NOT a dark lane) -> VO-C5-07 bridge picture: use dark window 232-274 (cut 285.9 later) as "dark lane" substitute (deviation; record). Teaser RAW-C6-01 from ASR F (first loud shout .. before "nut shouting").
- Map: Colorado (state pin, no exact spot; she says BLM/national forest). Not built yet.

## NEXT (agent 2)
1. When asr_c5.json has A-F: find exact word edges for all raws (sheet times are ~+13 s off at RAW-C5-01: live clip starts ~625). RAW-C5-01 = live clip only (dark 625-660?), check where reflective narration starts.
2. Then follow the NEXT list above (rewrite *_c5 scripts from c2 pattern; map from c3/c4; comments pinned/theory; captions rule 37/38 via capwrap_van; rulecheck; test sheet; run_c5.sh bg; QC).
- ASR key C done (others running). RAW-C5-01 live clip = src ~623.5 ("Someone just came") .. "So not cool" 635.34-636.42 (a 2nd "So not cool" 647.18-648.22 = her reflective VO repeat -> end on the FIRST at ~636.5; the live clip is the dark picture 625-660). RAW-C5-04 = "Gem and I ate dinner" (ASR "Gemini ate") ~610.5 .. "they never came back, thankfully" ~701 (cut before "so I drifted off" ~701.0); it contains the live clip 623.5-648 again (cut sheet: return to the peak and let it play). Her narration 648.28-701: "motion sensor lights ... sitting right there on my dash" 657.3-666.3 (stills: none of a dash seen yet; 662 = forest drive overlay "these guys" -> check 657-666 for the dash lights), "faint glow up the hill ... a fire" 667.3-676 (stills 668-674 = two lights in the dark -> red box candidate, verify on still). RAW-C5-03 end "Loud and obnoxious, yes, but harmless, at least at first." ends ~609.5 (sheet trim "But that moment would end up leading to the scariest night" must be found in key B, ~600-605).
- RAW-C5-01 DECIDED: src 624.30-636.60 (12.3 s; "Someone" 624.42 .. "So not cool." 636.42; src cut 622.64 before -> pre-roll ok; 3 knocks line 619.96-622.82 is her narration -> excluded). Creator burned sub on it (626) -> no our captions.
- ASR A,B done. Approx raw edges (refine on word edges in asr_c5.json, avoid src cuts in cuts_c5_EXPLORINGG.txt):
  RAW-C5-02 src 530.04-560.6 ("I had just found" .. "just me and Gem completely alone"; src cut 530.01 = picture in-point, start 530.05, pre-roll limited).
  RAW-C5-03 two parts: "but by the weekend more people started showing up" (~571.6) .. "and didn't think much of it." (~591.4) + JUMP over "But that moment would end up leading to the scariest night I've ever had on the road." (~591.5-~597) + "That evening, as the sun started to set" (~597-604) .. "at least at first." (~610.5). Includes "three blacked out trucks", "I stepped aside with Gem, gave a polite wave" 585.7-589.8 (VO-C5-03 freeze = a frame of this road/wave moment if filmed; picture check 580-592).
  RAW-C5-04 src ~610.6 ("Gem and I ate dinner") .. ~701.0 ("never came back, thankfully").
- ASR D,E done. RAW-C5-05 src ~727.9 ("Alright, here we go") .. 756.8 ("most of them were leaving"; stop before "so we're just driving deeper"). PROFANITY: "shit" 735.62-735.74 is AUDIBLE in ASR (sheet thought source bleeped it) -> rule 30: mute src ~735.58-735.80 + "[ __ ]" caption (verify by listening/RMS). Creator subs burned? check still ~740.
  RAW-C5-06 src ~776.5 ("I can't help but feel frustrated") .. ~820.2 ("in regards to visibility."); "I still move differently to this day" 802.64-804.9 (let it breathe: no cut near it). Picture 776-832 = roof/solar install (her own b-roll; fine, it is the source clip).
  VO-C5-04 drive picture: 742-772 overlaps RAW-C5-05 picture -> use 759.5-772.5 (driving forest; cuts 772.59) as one 10.2+ s shot or split 730-742 / 760-772 (record choice).
- ASR F done (ASR_EXIT 0; asr_c5.json keys A-F COMPLETE, do not rerun). BYTHECURB 260-289 ASR text is garbage ("we've got a ..." = unintelligible shouting/noise) -> teaser caption only "[shouting - unclear]". "So I've got some Nutter shouting outside" starts 304.88 -> teaser = ~6 s of the loudest shouting ending before ~304.5 (pick by RMS over 230-304, e.g. ffmpeg astats per 0.5 s); picture = dark window (portrait, pillarboxed). VO-C5-07 bridge picture: dark window 232-274 (avoid cut 285.9).

## STATUS at agent 1 stop (context budget): phase 0 (inputs, asr, scan, picture map, raw edges) DONE. NOTHING rewritten/rendered yet: all *_c5.py except asr/scan/sheet still hold Case 2 content. Next agent: start at "NEXT" step 2/3 above (raw_parts_c5 -> build_sb_c5 -> edl_c5 -> gfx/cap/fetch/seg/final/mix -> rulecheck -> run_c5.sh -> QC).

## Agent 2 (2026-11-11)
- Base switched: *_c5.py (raw_parts build_sb edl gfx fetch_gfx seg final mix cap test_gfx + run_c5.sh) = copies of the *_c4 versions (map + capwrap already in), then edited for case 5; comment panels ported from c2 (gfx thread/comment_block, edl CARDS/EVENTS, final PANEL).
- Burned-in creator text (qc/c5_raw1.jpg looked at): none on her narration (530-600, 610-622, 676-701, 727-757, 776-820). Creator text at 601-609.6 (foxtails label), 622.6-650.1 (dark live clip subs + HEART RACING/listening), 658.5-664.7 ("these guys") -> no added captions there.
- No road/wave footage exists (576-590 = she + Gem at van on ridge) -> VO-C5-03 freeze src 586.0 (deviation).
- Glow up the hill: src 664.73-676.49 dark shot, two lights (orange+blue) move: ~(845-890, 346-445) full-res during 668.3-673.6 -> red box (760,260)-(980,540) via TREE in that window (verify on render still).
- Teaser RAW-C6-01 = BYTHECURB 273.0-279.2 (loudest shouting, RMS -22..-29 dB; dark portrait picture), caption "[shouting - unclear]". VO-C5-07 bridge = BYTHECURB 244.0-258.8 (window with writing, night).
- Raw edges (ASR): C5-02 530.05-560.60; C5-03 [571.16-591.08]+[600.10-610.30] (skips "But that moment ... road." 591.10-594.86); C5-04 610.35-700.20; C5-05 727.85-756.85 (mute shit 735.58-735.82); C5-06 776.45-820.00 (cut 820.01; "visibility." ends 820.18 -> end 820.00, last syllable clipped acceptable? no: end 820.25 with CUT out).
- DONE: raw_parts_c5 (7 raws, edges in comments), build_sb_c5 (20 shots, 346.19 s; ASR keys own ranges OWN + overlap dedupe, FIX Jem/Gemini->Gem, CAPFIX "Gem and I ate"; teaser fixcaps "[shouting - unclear]"; mute shit src 735.56-735.80 = tl 220.03), edl_c5 (CARDS pinned/theory from info.json, EVENTS, HL, CM_LIKES 43/1, CM_TIME, stamp on VO-C5-01 a, TREE red box tl 169.72-175.02), fetch_gfx_c5 (z6 Colorado tiles fetched), gfx_c5/cap_c5/mix_c5/final_c5 edited (PANEL pinned/theory; mix block VO-C5-NONE). RULECHECK OK.
- Choice: VO-C5-01 = map 5.0 (dip from card) | ch 5.8 X | a sign 231.72-235.80 straight cut + stamp | c hills 278.6-286.92 straight cut + rewind fx (rulecheck solo >= 3 s forbade dissolves on the short sign shot; Gem-asleep shot dropped there, used as freeze in VO-C5-05 b).
- Pinned card: no "Pinned by" line (not built; creator name pill only).
- Agent 2: gfx_c5 RAN (panels + map looked at, qc/c5_gfx1.jpg OK; seg channel box 606,278,877,328 from cap_log). run_c5.sh launched in background (log W/run_c5.log, ends CHAIN_DONE).
## STATUS at agent 2 stop (~150k context)
- All *_c5 scripts rewritten for case 5; rulecheck OK; gfx done. run_c5.sh started in background at stop (may be killed when agent 2 ends; segs cached per shot via segcache).
## NEXT (agent 3)
1. Check W/run_c5.log (last lines "CHAIN_DONE" / "exit N"). If not done or killed: `cd W; bash run_c5.sh > run_c5.log 2>&1` (run_in_background; waits for any seg_c5.py, retries NVENC 5x). Never two final_c5.py at once; max 2 parallel encodes (Pool 2).
2. Untested in render: map z6 Colorado (label "COLORADO" under pin), channel page box, rewind fx over the straight cut into VO-C5-01 c (tl ~29.9), freezes VO-C5-03 a (586.0) / VO-C5-05 b (256.0), TREE red box tl 169.72-175.02 (must sit on the two lights; tree box follows raw push), pinned/theory panels centred (rule 14).
3. QC V/05_render/case5_v1.mp4: ~346.19 s, 1920x1080 30000/1001, -17 +-0.5 LUFS, TP <= -1, mute tl 220.03-220.27 silent + "[ __ ]" caption, captions on raws except creator-text ranges, "[shouting - unclear]" on teaser, 3x2 still sheet looked at (+ stills at 3, 20, 30, 172, 260, 285).
- [x] run_c5.sh finished after agent 2's report: exit 0, CHAIN_DONE, V/05_render/case5_v1.mp4 written (10375 frames = ~346.2 s), mix I -17.00 LUFS TP -2.58. Next agent: start NEXT step 2-3 (QC stills, red box, panels, mute check, decode check).

## Visual QC (agent vqc, stills work/qc/vqc_c5_*.jpg, 960 wide)
- PASS. Red box on the two lights tl 170.5-174.8 (bracket draws in at 169.9); pinned/theory panels + freezes centred (x 480/960, y 270/540); map Colorado + channel page + card OK; captions white on black, <=2 lines, none in intro (RAW-C5-01 only creator subs/text); no LOCATION UNDISCLOSED card; mute 220.03-220.27 RMS -52 dB (< -40), caption [ __ ] there.
- Minor (not blocking): stamp at 28 s overlaps the creator's sign inset; channel page content ~80 px right of centre (3D tilt).
