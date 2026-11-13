# VAN CAMPING ENCOUNTERS — full video plan (2026-11-10)

R = `C:\Users\ayush\Videos\CLAUDE\STYLE guide`, V = `R\productions\van-camping-encounters`, W = `V\05_render\work`.

## Owner orders (chat 2026-11-10)
- Start rendering only AFTER Winter Camping Encounters is finished. Prep (voice, gap cut, downloads, comments, ASR) may run before.
- "Complete this whole video, no question asked, according to your learnings." No storyboard approval stop; no owner decisions asked. Record each choice in the case handoff.
- Voice: Algrow Stealth "gx horror" (`default-pd4i7bs8z6-qjsqmqbjlxg__gx_horror`), expressiveness 2 (`--temperature 2`), speed 1 (`--speaking-rate 1`).
- Length: no limit, must be ABOVE 35 min. Keep raw clips at the cut sheet's lengths; if the sum is short, use the long end of each raw range.
- A watcher keeps a log of disk and progress: `V\watch.log` (script `V\watch_van.sh`).

## Inputs
Cut sheet `V\00_input\cut_sheet.md` (= Downloads/message (5).txt), VO `V\00_input\vo_only.md` (= message (4).txt), parsed to `V\blocks.json`, `V\job.json`, `V\vo_lines.csv` (102 lines), `V\cutsheet_lines.md`. Narration raw `V\narration\raw`, cut `V\narration\cut`. Sources `V\sources\<TAG>.mp4`, comments `V\sources\comments`.
Parser fix: `tools/case-build/blocksheet.py` now treats a RAW-Cn block inside another case's section as a teaser (Case 9 ends with RAW-C10-01 hard cut).

## Build = same as winter (copy its recipe)
Read `R\docs\ai-state\full_video_plan.md` (sections, encode, change rule, owner rules 1-10) and the case handoffs there; they apply here unchanged, except: 12 cases (sections case1..case12), full file `V\05_render\VAN_CAMPING_ENCOUNTERS_full.mp4`, cold-open carousel shows 12 cards. Copy winter Case 2 scripts from `R\productions\winter-camping-encounters\05_render\work` (`*_c2.py`, and the newest `*_c5.py` for freeze/split/slow kinds) into W, rename `_cN`. Read-only on winter files.
Learnings to apply from the start (winter mistakes): website/page 3D shots centred; cursing = mute raw only + `[ __ ]` caption; no raw bed under narration; map or LOCATION UNDISCLOSED card on every place line; channel page 3D every case; thread comments cut to the key sentence; keep creator burned-in subs; verify any red-box position on a still; check brightened frames before writing "you can see".
Cut sheet audio rule: music ducks under raw dialogue, MUSIC OUT where a block says so, no jumpscare SFX.

## Status 2026-11-10 23:28
PREP DONE: narration raw+cut 102/102 (cut total 24.3 min), sources 12/12 in V\sources, comments 12/12 in V\sources\comments (info.json with comments). Waiting for winter to finish (`V\wait_winter.sh` background). NEXT: per-case builds case1..case12 (copy winter recipe), then audio pass, then full build.

## Status 2026-11-11 06:55
Winter sessions died overnight with case5 un-encoded (segments/asm/mix were done). This session runs: final_c5.py -> music_pass.py 5 -> full_build.py -> qc_audio_pass.py (logs in winter W). Watcher restarted.
## Orchestration (this session = orchestrator, keeps context small)
- One background agent per van case, brief = `docs/ai-state/van_case_brief.md` with N filled in. Max 3 cases at once (GPU 4 GB). Each agent writes `docs/ai-state/van_caseN_handoff.md` and outputs `V\05_render\caseN_v1.mp4`.
- Order: case1 first (it holds cold open + 12-card carousel + title), cases 2,3 in parallel with it; then 4-12 as slots free.
- After all 12: van audio pass (copy winter `music_pass.py`, `qc_audio_pass.py`; ES tracks from C:\Users\ayush\Music\EpidemicSound library, different tracks from winter where possible), then `full_build.py` (12 sections) -> VAN_CAMPING_ENCOUNTERS_full.mp4, check duration > 35 min.
- 07:xx final_c5 failed: ZeroDivisionError in Ev.env lin() on a zero-length xin/xout window. Fixed (zero window = step) in winter W final_c5.py; chain rerun (task in this session). Watcher stopped on owner order.

## Status 2026-11-11 (winter done)
WINTER DONE: `WINTER_CAMPING_ENCOUNTERS_full.mp4` 3037.49 s, I -16.98 TP -1.56; qc_audio_pass.py fixed (ffmpeg -v verbose so ebur128 framelog prints), chart saved.
VAN: case1, case2, case3 agents launched (background). NEXT: cases 4-12 as slots free (max 3), then audio pass, then full build.

## Status 2026-11-11 later
case2_v1 DONE 292.10 s, -17.0/-3.0 (open: reply panel at 224 s not centred). case1_v1 rendered, QC agent running. case3 rendering. case4 agent launched. Brief items 8-9 added (common.W winter path, NVENC limit).

## Status 2026-11-11 10:15
case3_v1 DONE 456.12 s -17.0/-3.0. Found owner rules 37-39 (captions every raw w/ speech, <=1050 px wrap 3 lines, no LOCATION UNDISCLOSED) from a winter rework session -> brief item 10. case1 QC agent told to apply them. case2_v1 + case3_v1 built BEFORE these rules -> need a caption/loc rework pass (v2) later. case5 agent launched. Winter: sections c1-c6 reworked after the full build; c7_v3 render running (orphan from the idle winter session); then mux c7_v3 audio from v2 and rerun full_build.py.

## Status 2026-11-11 ~11:00
Winter full REBUILT alone (old file was corrupt from two writers): 3037.49 s, decode check clean, I -16.98 TP -1.56 LRA 16.0. qc_audio_v3.log.
case1_v2 DONE 481.65 s -17.0/-2.1, rules 37-39 OK (77 captions). case4 run_c4.sh rendering (agent 2). case5 phase 0 only (ASR, raw edges) -> continuation agent. case6 launched. NEXT: 7-12, then v2 rework of case2+case3, audio pass, full build.

## Status 2026-11-11 evening — VAN FULL BUILT
Sections (newest, all music-passed, QC PASS): c1 v3, c2 v3, c3 v3, c4 v2, c5 v2, c6 v3, c7 v3, c8 v2, c9 v4, c10 v2, c11 v2, c12 v3.
`V\05_render\VAN_CAMPING_ENCOUNTERS_full.mp4` 4624.53 s (77.1 min), concat -c copy, audio copy. qc_audio_van.log: I -16.99 TP -1.25 LRA 13.9; 5 mutes -40..-45 dBFS (stem -52). Decode check: W\decode_full_van.log.
Owner-check list: c4 July/August date, daytime bridge, Reolink logo; c5 freeze/night bridge; c6 recreated diversion card, unintelligible shout not muted, substitute lane/bridge shots; c7 recreated reply card, arrow follows arm, daytime ROADIE bridge; c8 2018 vs 2017, night brightened no label; c9 @nancys2275 comment, no replay box, dark woods for river; c10 +15 MIN card dropped; c11 estimated map pin, sheet comments no handle, VO-10/11 bg shots not stilled; c12 no outro; c3 RAW-C3-04 opening line uncaptioned; graphics ~0.6 s behind EDL (measured c9). Unused: case7_v2_try1.mp4. Disk 12 GB free after build.

## Van learnings added to rule book (2026-11-11)
Rule book: edited 34/36/37, new 40-50 (stamp, crops, opener order, non-English captions, glyph font, comment fallback, visual QC, versions, one writer, open 0.6 s lag, music/limiter). Motion graphics: 9 van shot kinds added. Backup styleguide/history/farrell.bak-2026-11-11-van.json; FARRELL_STYLE_GUIDE.md regenerated.
