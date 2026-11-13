# Handoff: Winter Camping Encounters — COLD OPEN + CASE 1 storyboard (2026-11-10)

Task: storyboard only (no render). Deliverables still to write: `V/04_storyboard/case1_storyboard.json`, `V/04_storyboard/case1_storyboard.html` (self-contained, base64 stills <5 MB, `<title>Case 1 Storyboard</title>`, CSS vars + dark mode guards, cards <700px), stills in `V/04_storyboard/frames/` (480 px JPG q5, in-point +0.5 s). V = `productions/winter-camping-encounters/`. Stay inside this folder; never write source mp4s.

## Done
- Read: cut sheet (COLD OPEN lines 13-72, CASE 1 lines 74-364, NOTES 1440+), rule book 1-28, user-lessons (all), WORKFLOW step 5, style guide §8/§9/§11.
- Work kit copied to `V/04_storyboard/work/`: `asr_win.py` (faster-whisper medium.en CPU; CUDA fails: cublas64_12.dll missing), `scan.py` (srcscan method; `python scan.py sheet KEY TAG t0 t1 step`; `import scan; scan.cuts(tag,a,b)`), `showasr.py KEY..`, `bleep.py` (tonal test NOT discriminative, do not use), `cuts.json`, `notes.md` (picture notes per window), `sheets/*.jpg` contact sheets, `light*.jpg`.
- ASR output: `C:\Users\ayush\AppData\Local\Temp\claude\6305dcf529249e4d\4adbd3df-b063-4dc3-ac2c-2165d3b72d44\scratchpad\asr.json` (absolute source seconds, word timings). Done: CO-01, CO-02, C1-09, C1-01, C1-02. Still running in background: C1-03, C1-04, C1-05, C1-07, C1-08, C2-01. If missing, rerun `python V/04_storyboard/work/asr_win.py` (resumes; edit OUT path) — copy asr.json into work/.

## Narration durations (s, ffprobe)
CO-01 18.36 · C1-01 22.16 · C1-02 10.40 · C1-03 20.34 · C1-04 12.75 · C1-05 16.91 · C1-06 9.32 · C1-07 15.88 · C1-08 15.76 · C1-09 29.01 · C1-10 12.96. Word timings in `narration/cut/*.words.json`. Note C1-09 words read "18 91" / "1 8 93" — verify the take says "eighteen ninety-three".

## Decisions so far (source seconds)
- RAW-CO-01 ARNOLDOUTD 989.8–994.3 (4.5 s): "They're right [bleep] there, dude. They're like driving around shooting." Dark camp, fire. No source cut (only cut 969.6). Pre-roll 988.8 clean.
- RAW-CO-02 EXPLORINGW 2115.5–2119.3 (3.8 s): "There's somebody walking out there." Very dark blue tent. Source cut at 2126.4 → "Hello?" (2131.2) is past a creator cut, so END ON not reachable cleanly; ends before impact.
- RAW-CO-03 PARANORMAL 5079.5–5083.2 (3.7 s): "Somebody just hit the car." Source cut 5071.94 falls inside "What the f— was that?" (5070.4–5072.0), so START ON line cannot be used cleanly; flag to owner.
- VO-CO-01 (18.4 s): sheet asks one tent push (07:36, tent wide 456–466, footage is DAYTIME, not dusk). Rule 22 needs a change every 4–5 s → plan: drive-in snow road (A sheet ~88–92 or 133–140) for "woods empty out"; tent wide 456–466 for "seven nights in snow"; night snow walk (G sheet, 4400–4440 avoid burned-in text at 1:12:56) for "found out… they didn't". Title 2 s after, dip to black. Cold open ≈ 4.5+3.8+3.7+18.4 ≈ 30.4 s + title 2 s.
- RAW-C1-09: PARANORMAL 5063.9 (3 s "construction" singing for contrast) → 5103.5 ("Something just hit the car" 5101.4–5102.5), jump-cut dead air, then 5128.7–5141.1 ("…That's how people die in horror movies" ends 5140.62). Plays through creator cuts 5071.94, 5093.06 (their edit, no transition there).
- REPLAY-C1-01 VERIFY = NO: frames 1:01:53–1:02:05 brightened show only him, sled, falling snow; bright spot at 1:02:10 is his own handheld flashlight. Drop the replay (sheet says so).
- RAW-C1-08 picture: kneeling by sled at night (3714–3823); cuts 3736.07, 3738.67, 3743.68, 3788.96, 3816.22.
- VO-C1-04 device close-up: phone app "Spirit Talker" held to camera at ~2326–2332 (38:46–38:52; continuous shot 2302.5→2345+). Also 36:52 close shot (2197.5–2213.2 shot).
- VO-C1-05: no phone weather screen exists in 30:06–31:38 (he only talks) → hand over to RAW-C1-07 on "checks the weather". "Snow on tent wall" = night tent-wall shot 38:04–38:11.5 (cut 2291.57) / 38:16.2–38:22.5 (cuts 2296.17, 2302.51) — also the RAW-C1-06 "highlight the tent wall".
- VO-C1-01: drive-in windscreen 88–92/133–140 (cuts 83.05, 92.19, 98.33, 100.47, 106.51, 115.45, 141.61); face cam 106.5–115.4 for "Lomar" (+ channel page/avatar card); Nova Scotia/Halifax place picture needed (real photo, VCR location title).
- VO-C1-02: sled tracks in deep snow 4:34–4:42 (cut 282.57–293.41) on "first tracks"; trail walk 324–476 continuous; tent wide 456–466 on "The tent is where he left it".
- VO-C1-03: steam/him 910–927; steak 16:06 (958–972); whiskey 16:20 (972.6–980.4); stove fire close 1055.8–1069.8. "≈ 1°F" label on "minus seventeen".
- RAW-C1-04 tracks: 18:54–19:06 tent + trail behind him; tracks wide 19:18–19:30 (cut 1178.86).
- VO-C1-06: packing 3529.4–3557.4 boxes/snowshoes (58:49–59:17); sled pull 3557.4–3576.4. No walking-out shot found yet 59:20–1:01:54.
- VO-C1-07: night walk headlamp tracks 4380–4460 (burned-in text near 1:12:56 = 4376, avoid first ~10 s); at car 1:17:42–1:20:44; windscreen drive 4938.8–4988 (1:22:28–1:23:05).
- VO-C1-10 OWEN (EXPLORINGW2): forest static 57.71–60.91 (3.2 s), green tent 79.16–82.8; teaser RAW-C2-01 window 582–633 (cuts 599.99, 604.6, 622.25, 627.66).
- Transcribed RAW-C1-01/06/05/07/03/04/08 + C2-01 in/outs still TO DO from asr.json (cut-sheet START/END ON lines).

## Flags so far
- Profanity heard by ASR (probably unbleeped, owner to confirm/bleep): ARNOLDOUTD 990.80 "fucking"; PARANORMAL 5070.12 and 5071.54 "fuck"; PARANORMAL 4990.44 "damn" (mild). Check remaining windows when ASR finishes (C1-03 "Holy [ __ ]" ~7:36+).
- No comments CSV in V/00_input: COMMENT-C1-02/03 likes/dates unknown; screenshots need `ytcap3.py`-style capture (URL lHrU93gxl2c).
- Conflicts to raise: user-lessons "grade raws toward Nocturn" vs rule book "raw footage keeps its own colour"; user-lessons "every case gets a map" vs map only ≥8 s.

## Next steps
1. Wait for/finish ASR; set remaining RAW in/outs on word edges; check edges vs cuts (≥1.2 s from any crossfade edge).
2. Build rows (timeline, transitions, sound incl. intro music+SFX, captions in bottom black box, comments timed to C1-08/C1-09 words, article ARTICLE-C1-01 light 3D Wikipedia-style page), textures (pick 3–5: film grain, VHS noise+tracking, dust & scratches, light leak).
3. Extract stills, write JSON + HTML, self-check vs 28 rules + user-lessons.

## Update
ASR finished for all 11 windows; copy at V/04_storyboard/work/asr.json (show with showasr.py after pointing it at that file).

## Agent 3 progress (2026-11-10)
- DONE style guide: farrell.json rev 41 (rule 15 edited: raw keeps own colour, texture on top only; new rule book 29 maps every case; 30 bleep unbleeped profanity) + Learnings entry; FARRELL_STYLE_GUIDE.md regenerated (now 30 rules, lines 9-40). user-lessons.md lines 14/17/58 marked OVERRIDDEN, line 40 bleep lesson added (backup in agent scratchpad).
- DONE comments matched (info.json): C1-01 @pamrods8844 root UgwP5uSBTjtjVidCK9B4AaABAg 19 likes; C1-02 creator reply ...ASYjD3Tfm1N under @jenniferdove5480 (3 replies), 0 likes; C1-03 creator reply ...ASYiqmFEurn under @Spiritualjournies, 1 like. Dates = "9 months ago" (≈2026-02-10, approximate).
- DONE in/outs decided; all rows live in V/04_storyboard/work/build_sb.py (data + stills + JSON + HTML). Rerun it to rebuild.

## FINAL (Agent 3, 2026-11-10) - storyboard DONE, awaiting owner approval (no render)
- Built by `V/04_storyboard/work/build_sb.py` (rows + caption overrides OVR) + `work/sb_summary.json` (VERIFY, comments, rules not met, questions). Rerun to rebuild.
- Outputs: `V/04_storyboard/case1_storyboard.json`, `case1_storyboard.html` (0.9 MB, 46 stills inline), `frames/*.jpg` (46).
- Cold open 32.7 s; Case 1 503.05 s (8:23); 51 shots; 75 captions; handle/alone/caption-length checks: 0 issues.
- Stills check fixes: VO-C1-01 a = windscreen 134.5 (unlisted creator cut ~133.7), d = face cam 127.0; night walk avoids burned-in text 4385-4409 (CO c 4410.5, C1-07 b 4436.0, title 4444.0); VO-C1-10 b = Owen forest static 55.1; VO-C1-08 = 4896.66 / 16.7 s (cuts 4896.03/4914.01).
- Next: owner approves storyboard -> capture comment/channel/article/Narrows screenshots -> EDL -> rulecheck.py -> CASE 1 render.
