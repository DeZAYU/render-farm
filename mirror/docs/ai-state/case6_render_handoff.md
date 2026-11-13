# Handoff: Winter Camping Encounters - CASE 6 RENDER (2026-11-10)
Task: section case6 -> V/05_render/case6_v1.mp4 (+ case6_v1_notes.md), then `python W/full_build.py`. Owner pre-approved (no storyboard wait, ask nothing).
Rules: docs/ai-state/full_video_plan.md (encode: h264_nvenc -preset p5 -tune hq -rc vbr -b:v 0 -cq 15, NO -profile:v; AAC 320k 48k; -17 LUFS, TP<=-1) + FARRELL_STYLE_GUIDE rule book 1-36 (36: every muted curse -> "[ __ ]" caption even in raw clips with no captions).
Touch only *_c6* in W (+ gfx_c6/, seg_c6/). Pools 2-3 workers. Do not kill others' processes.
Cut sheet: Downloads/message (3).txt lines 1054-1244 (Case 6 "THE OFFERING TREE"). Source EXPLORINGW.mp4 = Exploring with Bear (@EXPLORINGWITHBEAR) PSVSIETMyAI, 1920x1080 30 fps, 2570 s. RAW-C7-01 teaser = ARNOLDOUTD.mp4 (W4hXGZzr7bA) 12:56-13:58, 30 fps.
Section start: Case 5 ends with RAW-C6-01 teaser (EXPLORINGW 1219.48-1224.3, hard cut) -> Case 6 starts at CARD-C6 (dip from black). Case 6 ENDS with VO-C6-07 + RAW-C7-01 teaser (hard cut end, like Case 5).
No comments file for this video (cut sheet: none) -> no comment cards. No date/location -> "LOCATION UNDISCLOSED" map card (rule 5) + channel page 3D (rule 3).

## Decisions
- Base scripts: seg_c5.py (= seg_c2 v2 + freeze/split/slow; freeze used for the 2-s fallen-tree hold and VO-C6-06 still), mix_c5.py (mute-only profanity, mute_pts report, hard-cut last shot), build_sb_c5.py/raw_parts_c5.py pattern (ASR word edges, prof(), caps()). final/gfx/edl from c2 v2 (tested) adapted; c5 versions were still being edited by the Case 5 agent.
- Order: CARD-C6 (D) | VO-C6-01 ch (channel page) | VO-C6-01 map (UNDISCLOSED) | VO-C6-01 a footage 111-154 area + STAMP "EXPLORING WITH BEAR - WINTER SOLO CAMP" (TITLE-C6-01 as stamp label) | RAW-C6-02 | VO-C6-02 (08:07-12:00 walk/tracks) | RAW-C6-03 | VO-C6-03 (16:33-18:45 wind/tent) | RAW-C6-04 (~70 s of 20:00-23:17) | VO-C6-04 (24:28-28:20) | RAW-C6-05 (~50 s of 27:09-31:00) | VO-C6-05 (32:14-33:20) | RAW-C6-06 (2-3 min of 33:20-39:11) | RAW-C6-07 (40:29-41:52) | VO-C6-06 (fallen tree freeze if visible + ARTICLE-C6-01 page) | VO-C6-07 (ARNOLDOUTD 04:58-05:48) | RAW-C7-01 (~4 s, hard cut).

## Status
- [~] ASR: W/asr_c6.py running (log W/asr_c6.log, ends "exit N") -> W/asr_c6.json keys B1 (105-160), B2 (560-620), B4 (1195-1400), B5 (1620-1870), B6 (1990-2360), B7 (2420-2520) on EXPLORINGW; C7T (770-845) ARNOLDOUTD.
- [ ] raw_parts_c6.py / build_sb_c6.py -> sb_c6.json; edl_c6.py; rulecheck; gfx_c6 (channel capture @EXPLORINGWITHBEAR, undisclosed card, article page capture/card, captions); seg_c6; mix_c6; final_c6 -> case6_v1.mp4; QC; full_build.

## PHASE A progress (agent, 23:05)
- scan_c6.py -> cuts_c6.json (EXPLORINGW 101 cuts in ranges 100-190/480-725/985-1130/1195-1405/1460-1870/1925-2360/2420-2520; ARNOLDOUTD 3 in 290-352/770-845) + contact sheets c6_sh_{v1,v2,v3,v4,v5,r6,r7,v7,c7t}.jpg (6 cells/row, cell i = t0+i*step; see SHEETS in scan_c6.py).
- gfx_c6 DONE (sub-agent): gfx_c6/out title/card_small/card_big/stamp/und_base/und_text/channel.png+json (name_box [614,282,313,43] xywh)/article_hl.png+json (real page capture, sentence box [390,454,878.3,505.7], two-line yellow marker). dl/channel.png, article.png. `python gfx_c6.py caps` (needs sb_c6.json) -> gfx_c6/out/caps. Preview c6_gfx_preview.jpg checked.
- Sheet notes (EXPLORINGW src s): 101.5-105 wide tent; 105-153 host selfie; 153.9-166.5 firepit/benches wide NO face (VO-C6-01 a); 635-664 POV walk woods (cuts 634.75/663.98), 698-709 walk, 717 log; 1024.1-1032.3 tree-tops sky (wind), 1032-1044 truck/snowy trees; 1060-1104 tent setup/inside; 1104.2-1121.8 dinner from tent, 1122-1130 eating in tent dark; 1465-1650 selfie in tent (dark); 1660.1-1674.1 flashlight sweep of camp/firepit ("LISTEN" creator text ~1673); 1925.3-1964.8 tent exterior by flashlight (one take); 1981.5-1988.5 inside tent blue wall; 2000-2360 inside tent/dark/face, 2300-2350 tent fabric; no fallen tree seen at 10-s samples (check at ASR "tree thrown").
- ARNOLDOUTD 296.8-317.7 dark, 317.69-336.61 snowy road at night from car (VO-C6-07 pick 318.5-329.0). RAW-C6-07 2425-2515 = him in truck, dark blue (fine).
- ASR speed: asr_c6.py (CPU medium.en) ~20 min for B1+B2 on the busy machine. CUDA fails (no cublas64_12.dll). Added asr_c6g.py = same model on CPU working from the END (C7T, B7, B6, B5) -> asr_c6g.json (log asr_c6g.log "exit N"); build_sb merges asr_c6.json + asr_c6g.json (first file wins per key).
- final_c6.py stub fixed: PANEL = {}, tree() returns early when edl.TREE is None, chunk names final_c6_chunk* (were final_c2_chunk* = would overwrite Case 2 chunks!). edl_c6.py rewritten (EVENTS=[], TREE=None, GFX ch/undisclosed/article, LABELS stamp only).
- Picks so far: RAW-C6-02 114.0-150.78 ("Now for this camping adventure".."Cold winter camping."); RAW-C6-03 583.98-606.56 ("Oh! Big wolf tracks".."last time."). Raws: straight cut IN, dip OUT (Case 5 pattern). No tracks shown clearly -> no track highlight.

## PHASE A STOPPED at context limit (23:15) - next agent continues PHASE A from here
Running: asr_c6.py (pid 29816, forward B4,B5,...) and asr_c6g.py (pid 20128, from the end C7T,B7,B6,B5). Wait: `until grep -q exit W/asr_c6g.log; do sleep 10; done` (and asr_c6.log has B4). Then you may stop neither; just use keys from either file.
Planned B-roll (src s, EXPLORINGW unless noted; cuts from cuts_c6.json, every dis/dip edge keeps 0.6 s + 3 fr clean):
- CARD-C6 title (fade from black at section start, dip out) on e.g. 154.7-157.7 footage | VO-C6-01 ch page 5.5 s (dip) | map undisclosed 6.5 s (dis) | VO-C6-01 a 154.7-166.2 STAMP (dis in, cut out). Sum 23.45 >= wav 23.26.
- RAW-C6-02 114.0-150.78 (cut in, dip out) | VO-C6-02 a 635.4-643.0 + b 698.5-706.5 (wav 14.49) | RAW-C6-03 583.98-606.56 | VO-C6-03 a 1024.9-1031.6 treetops/wind + b 1122.6-1128.0 eating in tent dark (wav 9.7).
- RAW-C6-04 (B4: ~70 s, word edges; knock/eyes/wood/truck/whistle; multi-part ok) | VO-C6-04 1661.0-1669.6 flashlight sweep (wav 7.61; drop if RAW-C6-05 uses it; "LISTEN" creator text ~1673 stays out) | RAW-C6-05 (B5 ~50 s) | VO-C6-05 a 1936.5-1942.0 tent at night + b 1982.2-1987.8 inside tent wall, cut out (wav 7.24).
- RAW-C6-06 (B6, 2-3 min ending "we just got to go"; find "tree thrown" in ASR, extract frames 1 fps there; if tree visible -> freeze 2 s after it + use as VO-C6-06 a still) | RAW-C6-07 (B7 2429-2512 "All right, so I'm down the road".."two tents that are destroyed then").
- VO-C6-06 (34.11 s): a tree still/freeze 6.0 (fallback 1942.6-1948.6 night tent) | b 1037.5-1043.3 snowy trees (check truck not in frame) | c article page 12.5 (gfx_c6/out/article_hl.png; seg_c6.render_page needs an "article" branch) | d 2300-2350 tent fabric at night or 1946-1956, ~10 s -> total >= 34.3.
- VO-C6-07 ARNOLDOUTD 318.5-329.0 snowy road at night (wav 9.58) | RAW-C7-01 (C7T ~4 s "you hear that yeah is that a gunshot".."gunshot or a vehicle", hard cut, FADE_OUT 0.001).
Then: raw_parts_c6.py (rewrite: words from merged asr_c6.json+asr_c6g.json, P dict per block), build_sb_c6.py (rewrite from Case 5 copy: E/B = EXPLORINGW/ARNOLDOUTD, no CREATOR_SUBS, ASR_FIX from cut-sheet quotes, prof() mutes + "[ __ ]" captions on every raw incl. SUBTITLES:No ones, caps only for RAW-C6-04/05/06/07 and RAW-C7-01), run edl_c6, rulecheck -> W/rulecheck_c6.txt, then `python gfx_c6.py caps`.

## Agent 3 (23:20) - orchestrating; work split into sub-agents (context budget)
- ASR at 23:14: asr_c6.json has B1,B2 only; asr_c6g.json empty (C7T running). Added 3rd worker W/asr_c6s.py (small.en, faster) for B6,B5,B4 -> asr_c6s.json (log asr_c6s.log, ends "exit N"). Merge order in build_sb/raw_parts: asr_c6.json, asr_c6g.json, asr_c6s.json (first wins per key; medium preferred). Do not wait for medium if small has the key.
- raw_parts_c6.py / build_sb_c6.py in W are still unedited Case 5 copies (C5 keys, CREATOR_SUBS of Case 5) - must be rewritten per "PHASE A STOPPED" plan above.

## PHASE A DONE (sub-agent, 23:50) - rulecheck OK (W/rulecheck_c6.txt), gfx_c6 caps rendered (89 pngs, gfx_c6/out/caps)
sb_c6.json: 24 shots, total 552.9 s. Files: raw_parts_c6.py/.json, build_sb_c6.py (rewritten), sb_c6.json, rulecheck_c6.txt. edl_c6.py unchanged.
| block | kind | tl | len | src parts |
|---|---|---|---|---|
| CARD-C6 | title | 0.0 | 2.78 | 101.57-104.35 |
| VO-C6-01 ch | graphic | 2.78 | 5.5 | - |
| VO-C6-01 map | graphic | 8.28 | 6.5 | - |
| VO-C6-01 a | footage | 14.78 | 11.5 | 154.7-166.2 |
| RAW-C6-02 | raw | 26.28 | 36.8 | 113.98-150.78 |
| VO-C6-02 a | footage | 63.08 | 7.5 | 635.5-643.0 |
| VO-C6-02 b | footage | 70.58 | 8.0 | 698.5-706.5 |
| RAW-C6-03 | raw | 78.58 | 22.58 | 583.98-606.56 |
| VO-C6-03 a | footage | 101.16 | 6.7 | 1024.9-1031.6 |
| VO-C6-03 b | footage | 107.86 | 5.4 | 1122.6-1128.0 |
| RAW-C6-04 | raw | 113.26 | 68.68 | 1199.92-1228.74; 1249.34-1262.62; 1321.62-1337.18; 1383.16-1394.18 |
| VO-C6-04 a | footage | 181.94 | 8.6 | 1661.0-1669.6 |
| RAW-C6-05 | raw | 190.54 | 49.38 | 1641.8-1648.62; 1673.3-1689.06; 1842.26-1869.06 |
| VO-C6-05 a | footage | 239.92 | 5.5 | 1936.5-1942.0 |
| VO-C6-05 b | footage | 245.42 | 3.6 | 1982.2-1985.8 |
| RAW-C6-06 | raw | 249.02 | 168.59 | 2026.62-2031.0; 2102.06-2118.28; 2125.82-2192.04; 2250.24-2291.62; 2320.86-2361.25 |
| RAW-C6-06 tree | freeze | 417.61 | 2.6 | freeze t=2361.2 |
| RAW-C6-07 | raw | 420.21 | 84.16 | 2429.56-2513.72 |
| VO-C6-06 a | freeze | 504.37 | 6.0 | freeze t=2361.2 |
| VO-C6-06 b | footage | 510.37 | 3.61 | 1044.03-1047.64 |
| VO-C6-06 article | graphic | 513.98 | 12.5 | - |
| VO-C6-06 d | footage | 526.48 | 12.2 | 1943.0-1955.2 |
| VO-C6-07 a | footage | 538.68 | 10.5 | 318.5-329.0 |
| RAW-C7-01 | raw | 549.18 | 3.72 | 812.02-815.74 |
Mutes (src s, rule 30/36, caption [ __ ]): RAW-C6-04 1331.08-1331.56 'shit.'; RAW-C6-06 2168.97-2169.22 'Damn'; RAW-C6-06 2169.94-2170.34 'Damn'; RAW-C6-07 2473.64-2473.94 'dick,'; RAW-C7-01 813.36-813.62 'fuck'
Captions: 90 in sb (89 after edl merge); full captions RAW-C6-04/05/06/07, RAW-C7-01; RAW-C6-02/03 (SUBTITLES:No) have no curses -> none.
- Fallen tree: NOT in frame at the "tree thrown" line (2320.9-2330.8, camera inside the tent: fabric/dark, frames 2319-2333 checked). Visible when he steps out of the door: a thin fallen sapling + branches lying on the snow at ~2359.6-2361.6 (sharpest 2361.2). Decision: RAW-C6-06 runs on 5.7 s past "we just got to go" to 2361.25, then "RAW-C6-06 tree" freeze t=2361.2 2.6 s (2.0 s hold + 0.6 s dip; rulecheck needs total >= 2.5; silent), and VO-C6-06 a = same freeze 6.0 s.
- Decisions: CARD-C6 on 101.57-104.35 (tent interior; 154.7 footage stays for VO-C6-01 a). VO-C6-06 b moved 1037.5-1043.3 -> 1044.03-1047.64 (truck in frame before 1041). VO-C6-06 d = night tent 1943.0-1955.2 (2336-2348 is inside RAW-C6-06). VO-C6-05 b shortened to 3.6 s. VO-C6-02 a starts 635.5 (634.75 cut inside the dip handle). Freeze shots need seg_c6 "freeze" (copy seg_c5). No eye highlight in RAW-C6-04 (not verifiable). Long ASR segments split into captions <= 6.3 s / 60 chars; short adjacent captions merged.
- ASR fixes (cut-sheet wording): "here at all that"->"hearing all that", "I'm orange"->"I'm armed", "heist too"->"eyes, too", "mock"->"knock", "Was that a grout?"->"Was that a whistle?" (both medium+small hear "grout"; cut sheet END ON "That was a whistle" -> owner check), "Oh, it was so bad."->"Holy smokes, man.". 'dick' 2473.68 (B7, "that dick, probably my coffee pot") heard by medium AND small -> muted (may be "ding"; owner check). C7T 'fuck' ~0-s word -> mute span 813.36-813.62 from small.en recheck.
- Open: B7 caption keeps ASR "juices are gone" (both models; unclear words, owner check). B6 is small.en (medium never reached it). PHASE B next: seg_c6 (freeze + article page branch), mix_c6, final_c6 -> case6_v1.mp4, QC, full_build.
- Caution: asr_c6.py/asr_c6g.py (medium) may still add B5/B6 later; merge order then prefers medium on rerun of raw_parts_c6.py/build_sb_c6.py -> word edges/fixes shift (fix strings were matched to small.en text). Rerun + rulecheck if you rebuild.

## PHASE B progress (sub-agent, 2026-11-10)
- seg_c6.py: render_page rewritten (channel = gfx_c6/out/channel.png + channel.json name box; article = article_hl.png (yellow marker baked) centred on text column, tilt-pan down onto the sentence, dim 0.72); freeze/undisclosed kept from seg_c5; Pool(3).
- mix_c6.py: room tone gated off over mute windows (true silence), mute report with words, final-wav RMS per window.
- DONE: previews checked (freeze moved to src 2360.6, sharper sapling), segments + asm_c6.mp4 (16570 fr), mix_c6.wav (-16.81 LUFS, TP -1.00, 5 mutes silent). Next if stopped: `python final_c6.py` -> QC (scratchpad qc6.py logic: ffprobe vs case2_v2, ebur128, mute RMS, 3x2 sheet qc/c6_sheet.jpg).

## PHASE B DONE (sub-agent, 2026-11-11) - V/05_render/case6_v1.mp4 (552.900 s, -16.7 LUFS, TP -1.4, ffprobe = case2_v2), notes V/05_render/case6_v1_notes.md
- Changes: seg_c6 render_page (channel/article), freeze t 2361.2 -> 2360.6 (sharper fallen sapling); mix_c6 room tone gated in mute windows, limiter 0.70 + TP -1.5 (mp4 TP was -0.9); final_c6 stamp label from gfx_c6/out/stamp.png, Pool(3), `python final_c6.py mux` = audio-only re-mux.
- Open owner questions in the notes ("dick" vs "ding" 2473.64, "juices are gone", "grout"->"whistle", B6 small.en).
- NEXT: owner runs `python W/full_build.py` (not run by the agent).

## CLOSE (orchestrator, 2026-11-11)
- case6_v1.mp4 verified: 552.90 s, h264 Main 1920x1080 30000/1001, I -16.7 LUFS, peak -1.4. full_build.py run: case1_v3+2_v2+3_v2+4_v2+6_v1 = 2126.22 s, audio copy. case5 not rendered yet at build time -> re-run full_build.py after case5 lands.

## v2 (2026-11-11, coordinator decision)
- 2473.64 "dick" = "ding" (coffee pot): unmuted, caption "And then there's that ding, probably my coffee pot." Other 4 mutes kept.
- sb_c6.json PATCHED directly (backup sb_c6_v1.json.bak): re-running raw_parts_c6/build_sb_c6 now would pick up the newer medium.en B6 in asr_c6.json and change picks (raw_parts_c6.py fails on B6 "That's" 2125.8). raw_parts_c6.json/.py: _keep [2473.68,B7] + _fix "that dick, probably"->"that ding, probably".
- gfx caps: only cap_077 changed. rulecheck OK. mix_c6.py re-run (backup mix_c6_v1.wav.bak). final_c6.py: OUT case6_v2.mp4, new mode `python final_c6.py chunks 5` (re-renders chunk 5 only = frames 13809-16571, then muxes). Backup final_c6_v1.py.bak.
- [x] v2 DONE: case6_v2.mp4 552.90 s, I -16.7 LUFS, peak -1.4; 4 mutes -inf RMS (tl 164.84/312.79/313.76/550.54); ding audible + caption checked (work/qc/c6v2_ding.jpg). full_build re-run 2126.22 s (no case5 yet; re-run after case5).
