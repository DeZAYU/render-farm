# Handoff: Winter Camping Encounters - CASE 4 RENDER (2026-11-10)
Task (owner via lead agent): build + render section case4 -> V/05_render/case4_v1.mp4 + case4_v1_notes.md. Follow docs/ai-state/full_video_plan.md exactly (rules 1-10: MUTE cursing no bleep, raw muted under VO, channel page 3D, VCR captions on black box, map or "LOCATION UNDISCLOSED" card, short reply threads, no music/SFX, nvenc).
Copy Case 2 scripts as _c4 in W (V = R/productions/winter-camping-encounters, W = V/05_render/work). Touch only _c4 files + case4_* outputs (other agents work on other cases in W).
Cache-friendly: one file per segment in W/seg_c4/<id>.mp4, re-rendered only when its EDL entry changes (store a hash of the shot dict next to it, e.g. seg_c4/<id>.json, skip if equal).
Final report <=10 lines: path, duration, size, QC numbers, deviations, open questions.

## Section boundary (cut sheet Downloads/message (3).txt lines 736-880)
- Case 3 section ends with RAW-C4-01 teaser (line 723, Ruben 02:10-03:08 ~4 s over black/fire). Case 4 starts at CARD-C4 ("CASE 4" / "RED EYES ON THE LAKE").
- Blocks: CARD-C4, VO-C4-01 (+TITLE-C4-01 anchor stamp "CAMPING ENCOUNTER: RED EYES ON THE LAKE - 2010"), RAW-C4-02 (00:41-01:36), RAW-C4-03 (01:36-end ~04:05+, MUSIC OUT, subs all), VO-C4-02 (channel page 3D, @twobucks2003, 3 videos), VO-C4-03 (COMMENT-C4-01 422 likes, COMMENT-C4-02 100 likes "2:30 ... red chemlight"), REPLAY-C4-01 (02:28-02:32 normal, freeze 02:30, crop+brighten, box figure, label "what some viewers read as a person", tag "BRIGHTENED"), VO-C4-04 (freeze + ARTICLE-C4-01 tapetum lucidum card), VO-C4-05 (COMMENT-C4-03 @ThatGamerNeptune 2024 + ARTICLE-C4-02 WCMU card), CTA-01 (NO narration wav exists -> skipped, note), VO-C4-06 (Case 5 source EXPLORINGW3 00:20 snowy field two barns).
- RAW-C5-01 is under the Case 5 heading (in medias res opener) -> NOT in case4. Case 4 ends after VO-C4-06 with dip to black.
- No location in source ("location unknown") -> rule 5: "LOCATION UNDISCLOSED" map-style card on the place line (VO-C4-01 "beside a lake").

## Inputs found
- Sources: RUBENMOCKE.mp4 (BXrIo3IlWq8, 1280x720 30 fps, 275.76 s), EXPLORINGW3.mp4 (YhFw6VMpo0M, 1920x1080 59.94, 462 s).
- Narration: V/narration/cut/VO-C4-01..06 .wav/.srt/.words.json (no CTA wav).
- Comments: NOT yet downloaded -> yt-dlp --write-info-json --skip-download --write-comments BXrIo3IlWq8 into V/sources/comments.
- Channel page: capture https://www.youtube.com/@twobucks2003/videos with cap.py approach (Edge playwright, reject consent) -> W/gfx_c4/dl/channel.png; render via seg page3d (centred, slightly zoomed).
- Case 2 scripts read: build_sb_c2 (shot list) -> edl_c2 -> gfx_c2 (PIL comments/labels/card) -> seg_c2 (page3d, map, footage, asm via xfade) -> mix_c2 (bleep code -> change to mute) -> final_c2 (events, labels, captions, texture).

## Status
- [x] Read plan, Case 2 handoff + all Case 2 scripts.
- [ ] ASR of RUBENMOCKE 0-276 (asr_c4.py) for raw word edges + captions + profanity (mute).
- [ ] comments download, channel capture, article cards.
- [ ] build_sb_c4 -> edl_c4 -> rulecheck -> gfx_c4 -> seg_c4 (cached) -> mix_c4 -> final_c4 -> QC -> notes.
- [x] Channel capture W/gfx_c4/dl/channel.png (cap_c4.py; dark YT, "Ruben Mockery @twobucks2003 1.08K subscribers - 3 videos"; text "3 videos" box ~(856,132,910,150); Red Eyes thumb 426-846 x 320-556, title y 578, "82K 16y ago" ~(426,592,525,610)). Page3d crop (420,70,1730,620).
- [x] Articles (cap_art_c4.py): gfx_c4/dl/art1.png Wikipedia Tapetum lucidum (light theme), phrase "lack a tapetum lucidum" box (569,471,733,488); crop X 420-1440, y 200-900. art2.png WCMU, "In 1987, a myth ... released a song about the Legend of The Dog Man." line at y 1714 (x 540-1130, 2 lines to ~1760); text column x 400-1180 (ad at x>1250, exclude); crop y 1450-2200. ("Eyeshine is a visible effect" phrase not found on page; use "lack a tapetum lucidum").
- ASR running (asr_c4.py -> asr_c4.json key C4), comments yt-dlp -> V/sources/comments/BXrIo3IlWq8.info.json (log W/ytc_c4.log).
- Contact sheet (W/c4_sheet.jpg, 1 frame/6 s): 0-6 campfire bright; 6-36 very dark legs/feet by candles; 36-48 fire bright; 66-84 moon; 90 small red light; 108-120 boys sitting (dim); 126 pale figure walking; 138-144 red dots (eyes); 156 boat w/ flashlight; 162-180 dark; 186-204 flashlight on person in water (red shirt, Tom); 204-216 lake with pole; 216 lens white; 222-276 dark, red eyes dots ~252, 270.
- [x] W/gfx_c4/comments.json: GeorgBrodzky (UgxCJMmUYh41BERNmVd4AaABAg, 422, 7 years ago) C4-01; sturmovik1151 (UgwT0jcVxxpqs9p3pil4AaABAg, 100, 8 years ago) C4-02; ThatGamerNeptune reply (...A6ckM3Re2il, 0, 2 years ago) C4-03 text trimmed to key sentence (rule 6). Video: 82,675 views, upload 2010-05-25, 1080 subs.
- VO durations: C4-01 19.64, -02 15.68, -03 14.38, -04 38.82, -05 34.18, -06 10.63. VO-C4-01 "lake"@9.8; VO-C4-03 "If they"@4.64 "And a few years"@9.25 "Two minutes thirty"@13.07; VO-C4-04 "Here's one fact"@17.35 "Animals"@20.25 "Humans"@26.47 "So"@28.47; VO-C4-05 "Dogman"@3.56 "According"@10.4 "People"@22.3 "One commenter"@24.93 "The video itself"@~31.
- Freeze frame: src 150.1 s (2:30): figure with light in mouth, box in 1920x1080 frame ~(380,30,1330,1050) (head light ~420-800 x 100-280). Needs brighten (eq contrast 2, gamma 1.8).
- Shot plan: CARD-C4 (fire 36.5-39.5) | VO-C4-01 a fire 0.3-8.3 stamp, b LOCATION UNDISCLOSED card 4.5 s, c candles 14-22 | RAW-C4-02 | RAW-C4-03 to end 275.7 | VO-C4-02 channel page3d | VO-C4-03 footage moon 66-81 + C4-01/C4-02 comments | REPLAY-C4-01 raw 146.6-150.1 | VO-C4-04 a freeze 17 s (box, label, BRIGHTENED), b art1 page 12 s, c freeze 10.3 | VO-C4-05 a eyes 248-253.5, b art2 page 19 s, c footage + C4-03 comment 10.5 | VO-C4-06 EXPLORINGW3 15-26.5 | fade out.

## Agent 1 stop (context hook ~150k) - state for the next agent
Written in W (all _c4, untested unless noted):
- asr_c4.py (running in background at stop; -> W/asr_c4.json key "C4", log asr_c4.log). If no json: rerun `python asr_c4.py`.
- cap_c4.py, cap_art_c4.py: DONE (channel.png, art1.png, art2.png, cap logs in gfx_c4/dl).
- gfx_c4/comments.json DONE. gfx_c4.py written (card CASE 4 / RED EYES ON THE LAKE, panels th_geo/th_sturm/th_nep, undisclosed() card, freeze_label, freeze_tag) - not yet run.
- build_sb_c4.py written: reads W/raw_c4.json (NOT yet created) with keys RAW-C4-02, RAW-C4-03, REPLAY-C4-01 -> {parts:[[a,b],...], tin, caps:[[a,b,text],...], prof:[[a,b],...]} in source seconds.
  Make raw_c4.json from asr_c4.json: RAW-C4-02 ~41-96 (cut sheet "Normal - short": jump-cut to keep ~25-35 s, START "this is sleeping quarters, our candles keep our bugs off" END "is that a full moon guys"), tin "dip to black 1.2 s"; RAW-C4-03 from "seriously guys there I seriously saw something" (~96) to end 275.7, tin "straight cut", captions ALL lines; REPLAY-C4-01 parts [[146.6,150.1]] tin cut. Profanity words -> prof (rule 1: MUTE, no bleep, caption "[ __ ]").
- edl_c4.py written (from edl_c2: GFX map, kinds page/undisc/freeze, RAW-C4-03 no push, EVENTS geo/sturm/nep, HL, LABELS stamp, FREEZE dict). Not yet run.
- seg_c4_extra.py (render_page channel/article1/article2, render_undisc, brighten, render_freeze) + mk_seg_c4.py (generator seg_c2 -> seg_c4 with cache: seg_c4/<id>.key = sha1 of shot dict minus a/b/caps + nframes + REV; "cached" skip; --force). mk_seg_c4.py line 2 has a broken sed edit: fix it to `s = open("seg_c2.py", encoding="utf-8").read().replace(chr(13)+chr(10), chr(10))` then `python mk_seg_c4.py`.
Still TODO (exact):
1. Fix mk_seg_c4.py, run it; make raw_c4.json; `python build_sb_c4.py`; rulecheck: `cd R/tools/farrell-build; PYTHONPATH=W python rulecheck.py edl_c4 W/final_c4.py` (create final_c4 first if needed) -> W/rulecheck_c4.txt.
2. `python gfx_c4.py`; look at gfx_c4/out/undisclosed.png + th_*.png.
3. `python seg_c4.py` (run_in_background), then `python seg_c4.py asm` -> asm_c4.mp4.
4. mix_c4.py = mix_c2.py with edl_c4, *_c4 outputs, and the bleep loop CHANGED to mute only (rule 1: x[i:j] *= env, no sine); raw muted fully under VO (rule 2: duck to -inf, i.e. duck factor 0 instead of -12 dB); amb under VO also 0? (rule 2 says raw clip audio fully muted under narration) -> set duck = 1 - d.
5. final_c4.py = final_c2.py with edl_c4/gfx_c4, PANEL {("geo",):"th_geo",("sturm",):"th_sturm",("nep",):"th_nep"}, remove tree(), outputs final_c4_chunk*, final_list_c4.txt, OUT case4_v1.mp4. Captions: gfx_c4.caption already white VCR on black box (rule 4).
6. QC: duration (~expected END), 1920x1080 29.97, -17 LUFS +-0.5, TP <= -1, captions, 3x2 still sheet, mute points silent. Write V/05_render/case4_v1_notes.md.
Deviations so far: CTA-01 has no narration wav -> skipped. RAW-C5-01 left to Case 5. Location unknown -> LOCATION UNDISCLOSED card. Neptune comment trimmed to key sentence. "Eyeshine is a visible effect" phrase not on page -> highlighted "lack a tapetum lucidum".

## Agent 2 (2026-11-10)
- mk_seg_c4.py rewritten for current seg_c2 (segcache already built in) -> seg_c4.py generated OK.
- mix_c4.py (mute no bleep, duck = 1-d for raw+amb) and final_c4.py (PANEL geo/sturm/nep, tree removed) generated from c2.
- asr_c4.py rerun in background (asr_c4.json missing). Next: raw_c4.json -> build_sb_c4 -> rulecheck -> gfx -> seg -> asm -> mix -> final -> QC.
- Done: asr_c4.json (no profanity found -> no mutes), mk_raw_c4.py -> raw_c4.json (RAW-C4-02 73.8-96.6 continuous, RAW-C4-03 96.6-275.7, REPLAY 146.6-150.1), sb_c4 (16 shots, END 345.9), rulecheck OK (warn: sturm 5.9 s vs reading 10.1 s), gfx_c4 run (card subline "SOMEWHERE BESIDE A LAKE - 2010"), mix_c4 run. EVENTS fixed in edl_c4 (geo xin dip, sturm xout = cut (final_c4 lin handles zero-width), nep xin).
- seg_c4 + asm running in background (log W/seg_c4.log). Next: final_c4.py -> QC -> notes.
- Rendered: seg (16), asm, mix (-17.01 LUFS, TP -2.39), final. Channel shot re-centred (sc 1.12, yaw -7..-3) -> re-rendered only VO-C4-02a. mix_c4 mute bug fixed (np.zeros env); 0 profanity in ASR so 0 mutes; edl_c4 adds "[ __ ]" caption per mute. Notes: V/05_render/case4_v1_notes.md. Remaining: QC final file, full_build.py.
- DONE: case4_v1.mp4 345.91 s, 710 MB, 1920x1080 29.97, -17.01 LUFS, TP -2.29, 0 mute points; full_build.py rerun (full 1573.32 s). Open: freeze figure faint; sturm comment 5.9 s.
- v2 (owner via coordinator): sturm comment cut to key sentence (CARDS override in edl_c4, 94 chars, rulecheck OK, warn 7.3 s reading vs 5.9 s), gfx_c4 re-run, final_c4 OUT -> case4_v2.mp4. Comments are final-pass overlays so no segment re-render; note gfx_c4/out hash changed, so a later seg_c4 run would re-render graphic segments (identical output).
- v2 DONE: case4_v2.mp4 345.91 s, -17.01 LUFS, TP -2.29; full_build rerun (1573.32 s, uses v2).
