# Handoff: Winter Camping Encounters - CASE 2 RENDER (2026-11-10)
Owner said render Case 2 now (no storyboard approval needed). Output V/05_render/case2_v1.mp4 + case2_v1_notes.md. V = R/productions/winter-camping-encounters, W = V/05_render/work.
Case 2 = CARD-C2 -> VO-C2-01 .. VO-C2-05 + RAW-C3-01 teaser (Case 1 already ended with VO-C1-10 + RAW-C2-01). No cold open/title. Cut sheet section: Downloads/message (3).txt lines 366-490.
Copy Case 1 approach (case1_render_handoff.md): no music/SFX, raw push cap 15 %, initial-letter avatars, map no path line, bleep 1 kHz + "[ __ ]". GPU encode h264_nvenc. Never touch Case 1 files/processes (final_c1, final_chunk*, final.log, asm.mp4, mix.wav). Outputs: seg_c2/, asm_c2.mp4, mix_c2.wav, final_c2_chunk*, gfx_c2/.

## Done
- ASR: W/asr_c2.py running in background (log W/asr_c2.log) -> W/asr_c2.json keys C2-A (EXPLORINGW2 0-340), C2-B (340-662), C3-01 (CHANDLERSH 1170-1215). EXPLORINGW2 is 59.94 fps.
- Comments: V/sources/comments/NIXxkptstgo.info.json (yt-dlp, upload 2024-11-09, channel Exploring With Owen @ExploringWithOwen, 2200 subs).
  COMMENT-C2-01 = UgxJ9FD3Y-ZBBIVaXGp4AaABAg @pampeake3275 1 like "1 year ago" (root).
  COMMENT-C2-02 = creator replies: ...AAp78XOgu8m (parent UgxZg4kNb3RwJNRsTUl4AaABAg @David-rg9or "where's the protective gear?") "I brought a knife, but I figured I'm literally 300 feet from civilization..." 1 like;
                  ...AAdoXsT554E (parent UgxvfTugg3jLu7it3d14AaABAg @nathanlong7279) "Thank you! Yes if I ever go camping again I'll for sure bring someone with me" 0 likes.
- Map: no location given in source (cut sheet: "No location or month"). Decision: rule 29 conflict -> TBD (see notes).

## Next
1. Read asr_c2.json; pick raw in/outs on word edges (RAW-C2-02 00:41-00:57, RAW-C2-03 05:30-07:38, RAW-C2-04 08:26-10:33, RAW-C3-01 19:39-20:07 ~5 s); B-roll for VO-C2-01 (00:25-00:57), VO-C2-02 (04:18-05:30), VO-C2-04 tent daylight, VO-C2-05 CHANDLERSH 0:00-0:23. Scan source cuts (V/04_storyboard/work/scan.py).
2. Write W/sb_c2.json (same shot schema as 04_storyboard/case1_storyboard.json) + W/edl_c2.py; rulecheck.
- Source cuts: W/cuts_c2.json (EXPLORINGW2 whole, CHANDLERSH 0-40, 1170-1215). Key cuts: E2 24.79 26.59 27.96 30.23 34.7 36.67 39.81 44.11 48.21 54.42 57.72 | 258.53 ... 312.31 319.89 333.4 345.21 351.92-360.19 381.92 393.33 401.03 430.93 460.13 477.21 481.15 493.46 496.76 503.14 503.54 507.24 507.57 518.15 546.21 600.0 604.6 622.26 627.66 635.0. CH 2.1 6.14 9.68 13.58 16.85 23.36 26.83 | 1201.9 1202.2.
- Picture map E2 (sheets): 0-18 room intro; 24-40 packing at home; 42-57 face in woods; 78-90 pitching tent (VO-C1-10 used 55.1-60.1, 79.2-82.8); 96-140 tent interior gear; ~167 gunshot replay (skip); 234 mosquitoes; 258 lantern dusk; 270 beans can; 276-282 can opener; 300 phone; ~312 "4 hours later" card; 336-378 night tent; 384-474 night walk outside, orange tree marking ~450; 480-504 face in hoodie; ~507.6-518.15 creator card "Then... Something terrifying Happened" (avoid); 518-570 dark tent/forest; 576-606 packing; 630+ outro room. No daylight return footage exists.
- CH: 2.1-6.14 red burned title "APPALACHIA MOUNTAINS" (avoid); 9.68-13.58 snowy path; 13.58-16.85 host; 16.85-23.36 night cabin in snow (dark).
- VO durations: C2-01 18.41, C2-02 12.70, C2-03 9.22, C2-04 26.27, C2-05 14.32.
- Plan VO-C2-05: a E2 night forest ~4.8 s, b CHANDLERSH 10.3-23.3 (plays through creator cuts), straight cut into RAW-C3-01.

## Agent 1 stop (context hook) - state for the next agent
- [x] ASR done: W/asr_c2.json (word timings, absolute source s). No profanity found in any Case 2 window (no bleeps needed; note it).
- [x] Shot list: W/build_sb_c2.py -> W/sb_c2.json (17 shots, 268.14 s; same schema as case1_storyboard.json: block/kind/src/parts/len/tin/vo/captions/profanity/overlay/start). Edit build_sb_c2.py and rerun to change. All in/outs chosen on word edges and >=0.6 s from source cuts where a dip/crossfade needs handles; straight cuts are placed on the creator's own cuts.
- [x] W/gfx_c2/comments.json (5 comments, same format as gfx/comments.json): pampeake (UgxJ9FD3Y-ZBBIVaXGp4AaABAg, COMMENT-C2-01), david parent (UgxZg4kNb3RwJNRsTUl4AaABAg) + owen_r1 (...AAp78XOgu8m), nathan parent (UgxvfTugg3jLu7it3d14AaABAg) + owen_r2 (...AAdoXsT554E).
- Key decisions: RAW-C3-01 real time is 1170.3-1177.1 (cut sheet 19:39 is ~9 s late; thermal camera shot, continuous). RAW-C2-04 ends 627.04 (not 627.86 'very fast': creator cut at 627.66 inside dip handle; words fall in the 2.74 s audio fade anyway). RAW-C2-04 keeps the full 56 s silence after "Hello?"; jump cut 590.7->608.9 drops "I legit forgot I was recording... am I still recording". RAW-C2-03 = 6 parts (dead air jump-cut). VO-C2-03 'black' = dip to black into RAW-C2-04. No daylight return footage exists: VO-C2-04 b uses daylight tent 139.2-150.3 for "daylight". MAP: no location in source -> map skipped (rule 29 conflict, owner decides). No channel page (cut sheet asks none).
- Subs only: RAW-C2-04 "Hello?" + "I'm not sleeping here" (cut sheet); RAW-C3-01 4 lines. RAW-C2-02/-03 no subs.

## NEXT (exact)
1. W/edl_c2.py = copy of edl_c1.py with: SB = W/sb_c2.json; SRC adds CHANDLERSH; GFX = {}; LEN_FIX = {}; CM from gfx_c2/comments.json; CARDS keys pam2/david/owen_r1/nathan/owen_r2;
   EVENTS (c = S("VO-C2-04 c"), b = S("VO-C2-04 b")): [dict(keys=["pam2"], t0=b.a+3.0, t1=win(c)[1], xout=win(c), ent="up"),
   dict(keys=["david","owen_r1"], t0=win(c)[0], xin=win(c), t1=VOa+22.9, ent="pan"),  (VOa = S("VO-C2-04 a")["a"]; "Next time" at VO+23.3)
   dict(keys=["nathan","owen_r2"], t0=VOa+22.55, t1=win("VO-C2-05 a")[1], xout=win("VO-C2-05 a"), ent="up")]  (check rulecheck; parents truncated like Case 1 spirit: maxlines).
   HL = {"pam2": "Even a squirrel can sound loud in the middle of the night", "owen_r1": "I figured I'm literally 300 feet from civilization", "owen_r2": "if I ever go camping again I'll for sure bring someone with me"}.
   LABELS = [(solo(S("VO-C2-01 a"))[0]+0.1, solo(...)[1]-0.1, "EXPLORING WITH OWEN  -  FIRST SOLO CAMP  -  2024", "stamp")].
   Tree highlight on RAW-C2-03: src 452.6-455.6 orange marking, box approx (700,150)-(1220,700) frame px (verify on a still), eased red highlight in final pass (new; or note as not done).
   CARD-C2: "CASE 2" / "THREE HUNDRED FEET". Case starts with fade from black (no cold open/title).
2. rulecheck: cd R/tools/farrell-build; PYTHONPATH=W python rulecheck.py edl_c2 W/final_c2.py -> must be OK.
3. gfx_c2.py (from gfx_c1.py, out W/gfx_c2/out), seg_c2.py (-> W/seg_c2/, asm -> W/asm_c2.mp4), mix_c2.py (-> W/mix_c2.wav; no bleeps), final_c2.py (chunks final_c2_chunk*, torch CUDA port try + 5-frame +-2 check, h264_nvenc p5 hq vbr cq) -> V/05_render/case2_v1.mp4. Do not touch Case 1 files.
4. QC (duration ~268.1 s, 1920x1080 29.97, -17 LUFS / TP<=-1, captions, 8 stills) + V/05_render/case2_v1_notes.md.

## Agent 2 progress
- [x] W/edl_c2.py (pam2 enters win(b)[1]+3.0 for rule 25; CM_TIME per comment; TREE = src 453.7-456.3 box (690,140,1240,720) follows push). rulecheck OK (W/rulecheck_c2.txt; 2 reading-time warnings for the reply threads, allowed).
- [x] W/gfx_c2.py -> gfx_c2/out (david parent cut to 3 lines + Read more; nathan parent fits 2 lines). W/mix_c2.py -> mix_c2.wav: I -17.01, TP -2.11, 0 bleeps.
- [x] W/final_c2.py (copy of final_c1 + tree() red outline). Torch port skipped (numpy kept).
- [x] seg_c2 17/17 ok, asm_c2.mp4 8036 frames (= END). Test frames checked (card, tree box, 3 comment panels, RAW-C3-01 caption).
- [x] DONE: V/05_render/case2_v1.mp4 268.14 s, 549 MB, -17.02 LUFS / TP -2.16, 8036 frames. Notes: V/05_render/case2_v1_notes.md (4 open questions). Next: owner review.
