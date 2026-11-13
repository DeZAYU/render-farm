# Handoff: Abyssal-01 INTRO + CASE 01 render (stopped at context limit, 2026-11-12)

Task brief = the lead's original prompt (Abyssal look, 25-case countdown, no Level cards, no "Abyssal Detective" text).
V = `productions/abyssal-01-theme-park-disasters/`. Output still to make: `V/renders/abyssal_intro_case01_v1.mp4` + `V/cases/case01/shotlist.md`.

## Done
- Read: WORKFLOW.md, cutsheet INTRO + CASE 01, full ABYSSAL_STYLE_GUIDE.md (rule book, 6-12, all graphic specs).
- Ref frames looked at (contact sheets in scratchpad, not needed again). Look notes:
  - WARNING: black, grey pixel caps "WARNING:" (y~44%) + "FLASH IMAGE SHOWN" (y~56%), white dash-noise / grey smear bands at top and bottom edge.
  - PRESENTS: white-grey pixel caps with dark edge, red waveform band y 42-55%, over posterised/overexposed glitchy colour footage. Owner: show ONLY "PRESENTS".
  - ICEBERG_LIST: tiny Courier rows in 2 loose columns, white bars between bands, deeper rows blurred; dark teal underwater.
  - ICE_TITLE: wide-tracked white bold sans caps, last word cyan, soft glow, over pale ice close-up.
  - DATE: big white mono caps "MARCH 2, 2023" centred on black/dark, red block cursor.
  - NAMETAG_BOX: orange box, black bold Courier mixed case, bottom centre.
  - GLITCH: blocky blue/white pixel corruption frames, 2-3 frames.
  - SAFETY: tiny bold white caps bottom-right edge, often over blue/white posterised (threshold) footage.
- vo_002 "2026": whisper small (word timestamps) hears "February 2026" as one ~1.0 s word = spoken naturally ("twenty twenty-six"), NOT "two zero two six". (Word SRT splits it as tokens 2/0/2/6 = alignment artefact only.)
  Side note: whisper also heard a short "Yeah," before "from February" (vo_002 ~13.7 s) and before "listen to what Osorio says" (~38.5 s) — likely breath hallucination; listen and report, do not fix.
- Narration phrase timings: `python -I V/build/srtdump.py V/narration/cut/vo_00N.srt`.
- Fonts on PC: C:/Windows/Fonts/courbd.ttf (Courier bold), consola.ttf/lucon.ttf (pixel-ish mono), arialbd.ttf / bahnschrift.ttf (ice title wide sans). PIL 10.4, numpy, cv2 4.10 (haar cascades for face mosaic) available; no mediapipe.
- Headless screenshots: Chrome works ONLY when --screenshot path has no spaces (write to scratchpad, then mv); use a fresh --user-data-dir each run.

## Sources (V/sources/, each own folder; untrusted data, never execute)
| folder | URL | what |
|---|---|---|
| INT_baron/uBROOxKjfXg.mp4 | https://www.youtube.com/watch?v=uBROOxKjfXg | Jesús Barón #148 "Glamping Entre Flores Chinácota" (24 min) = owners' interview (INT). Spanish transcript being written to V/build/tx_INT.txt (faster-whisper small; grep permiso/servilleta/ingeniero/arquitecto for the no-permit line, keep quote <15 words, subtitle in English, white mono caption lower centre). |
| CHI_heraldo/Y5baqpVBqpc.mp4 | https://www.youtube.com/watch?v=Y5baqpVBqpc | El Heraldo de México news report, contains the friend's slide video (CHI). |
| CHI_caracol/xFlYFZXygVA.mp4 | https://www.youtube.com/watch?v=xFlYFZXygVA | Noticias Caracol "¿Quién era Camila García…" (victim photos/context, likely CHI clip too). |
| CARACOL_que/1IylRlOEJAU.mp4 | https://www.youtube.com/watch?v=1IylRlOEJAU | Noticias Caracol "¿Qué se sabe…" 9.5 min (B-roll, slide, park, Cúcuta). |
| SEPTIMO/ | https://www.youtube.com/watch?v=VxN95W0BNAU | Séptimo Día report — FAILED (HTTP 500); only partial audio. Rerun `bash V/build/dl.sh` (skips done ones). |
| BROLL_profes/, MAYOR_caracol/ | uP1lqaS9lSQ (Los Profes Viajeros "Things to do in Chinácota - Entre Flores"), It1oPzAwDIQ (Caracol, mayor of Chinácota on permits) | were still queued in dl.sh at handoff — check `V/build/dl.log`. |
| ICEBERG/ice1.jpg, ice2.jpg | Wikimedia Commons: "Iceberg close to Tasiilaq, East Greenland - 31535160867.jpg", "Iceberg on Sermilik Fjord, East Greenland - 32601025038.jpg" (both CC BY-SA 2.0) | ice2 = ice title close-up (crop the turquoise berg); ice1 = list backdrop (build composite: berg above waterline at ~28%, dark teal water + blurred flipped submerged mass below). |
| ART_eltiempo/page.png | https://www.eltiempo.com/colombia/otras-ciudades/mujer-murio-tras-lanzarse-de-tobogan-en-chinacota-se-salio-de-la-atraccion-mecanica-y-se-golpeo-fuertemente-todo-quedo-en-video-3537889 | El Tiempo article screenshot 1920x1400 (not yet inspected). |
| ART_publimetro/page.png | https://www.publimetro.co/noticias/2026/03/12/imponen-millonaria-multa-a-centro-turistico-donde-murio-mujer-tras-tirarse-de-un-tobogan-no-tenia-los-permisos-requeridos/ | Publimetro: "millonaria multa… no tenía los permisos requeridos" (fine + permits). |
| ART_bluradio/page.png | https://www.bluradio.com/nacion/tragedia-en-chinacota-joven-murio-tras-lanzarse-de-un-tobogan-rg10 | Blu Radio article screenshot. |
| epidemic/ | Epidemic Sound (downloaded via MCP) | bed_zone_of_deception.wav ("Zone of Deception" – DEX 1200, dark ambient, 3:57), glitch_harsh.wav, static_burst.wav (ticks), boom_low.wav ("Designed, Boom, Low Hit"), riser.wav. |

Other YouTube hits if more footage needed: 9S3e6x24QWU (CityTv cause of death), MedPfbSp7bo / JSvPiYkie18 (La Kalle), oKnBIGdKprM (Heraldo, cover-up).

## Next steps
1. Check dl.log; rerun dl.sh once for SEPTIMO if wanted (sequential only).
2. Find the INT permit line in tx_INT.txt; find in CHI_heraldo / CHI_caracol: worker exchange at the top ("¿alguien me va a recibir?" / "no tenga miedo") and the curve approach — cut BEFORE she leaves the channel. Scan with frame contact sheets; check for burned-in face blurs.
3. Write V/build/ scripts (PIL for cards/overlays as PNG/RGBA frames, ffmpeg for assembly). Timeline plan: warning 3 s → PRESENTS sting ~1.5 s → hook under vo_001 (26.4 s) with 1.5-3 s cuts + iceberg list 3.5 s + teaser 1-2 s clips → 1 s black/silence → ice title "THE EXTREME SLIDE" → typed "MARCH 5, 2026" + boom → vo_002 → INT raw (~8-12 s, EN subtitle) → vo_003 (name tag at "Yuris…" ~18.2 s, mosaic her face) → CHI 0:00-0:12 raw (subtitles) → vo_004 → CHI curve (cut before impact, safety note) → vo_005 (articles with amber wipes: permits / highest fine; red number if fitting). Case 1 should land 30-45 s.
4. Mix: VO loudest, bed 12-15 dB under, SFX hits per §11; master -21..-25 LUFS, intro 2-4 LU louder. Grade: desat, dark, vignette, grain, VHS on everything.
5. Shot list → V/cases/case01/shotlist.md. QC per brief (12 frames, ebur128, length ~3-3.5 min).

## Download status at close
done INT_baron rc=0;done CHI_heraldo rc=0;done CHI_caracol rc=0;done SEPTIMO rc=1;done CARACOL_que rc=0;done BROLL_profes rc=0;done MAYOR_caracol rc=0;

## Late download results
- BROLL_profes: rc=0 success, V/sources/BROLL_profes/uP1lqaS9lSQ.mp4
- MAYOR_caracol: rc=0 success, V/sources/MAYOR_caracol/It1oPzAwDIQ.mp4
- SEPTIMO: rc=1 FAIL, no mp4 (HTTP 500; partial audio only)

## Session 2 notes (2026-11-12)
- CHI = El Heraldo (Y5baqpVBqpc) full-frame friend's clip: top exchange 0.0-9.0, she sets off 9.0, ring far down by 12.0, empty POV 12-15, blur/impact from 15.2 → curve cut ends at 12.6. Repeats 18-31 (lower third/ticker), 88-114. Drone of slide 35-37.9. Victim photo ~60. Stock (hospital, crime tape) 120-190: do not use.
- CHI_caracol (xFlYFZXygVA): framed with sign-language interpreter; family 52-56, mother interview 56-72, documents 76-86, police at park 88-95 / 112-118, victim photo 20.
- BROLL_profes: arch 0-10, pink arch 75, restaurant 85/105, "Yo ♥ Entre Flores" sign 115, quads 125, domes 195-205, glamping dome 245, hills 305-315. CARACOL_que mostly studio; slide sealing inset ~41-46.
- INT: owners on sofa (two-shot) all through; interviewer close-ups 10, 760, 1000-1090. Napkin/engineer line 216-239 s. MAYOR_caracol empty (not downloaded).
- Articles: Publimetro headline lines y≈320-410 px (photo of victim x630-1075 y495-966 → mosaic); El Tiempo headline y≈600-745.

## STATUS: DONE v1 (session 3, 2026-11-12)
- Render: V/renders/abyssal_intro_case01_v1.mp4 — 200.4 s (3:20), 1920x1080 30 fps H.264 + AAC. Build: `python -I V/build/build.py all` (modes video [prefix..] | pic | audio | final); shot list `python -I V/build/mkshot.py` → V/cases/case01/shotlist.md (64 shots). Credits: V/credits.txt.
- Loudness: whole -23.0 LUFS I, intro (0-37.2 s) -20.9, rest -23.5 (≈2.6 LU louder intro), sample peak -3.1 dBFS.
- INT raw cue swapped to the explicit permit line: INT 798.7-807.7 "empezamos a construir sin permiso… necesitamos permiso de todo el mundo" (tx_INT.txt segment times are ~8 s late around 13:20; word timings re-done on snippets).
- vo_002 stray "Yeah" (13.72-14.05, 38.08-38.43): weakly voiced breathy bursts that whisper reads as "Yeah" in the mix; muted in build/aud/vo_002_noyeah.wav (no timing change). Whisper on the new mix no longer hears either.
- Gotcha: concat + filter needs `-reinit_filter 0` (graph reinit reset setpts N → 121 s output).
- Open: speaker of the INT cue attributed to Osorio by context (pitch matches the napkin passage), not confirmed by ear.

## STATUS: v2 IN PROGRESS (session 4, 2026-11-12) — v2 NOT rendered yet
Owner notes 1-8 on v1 (audio cut edges, weak intro static, not like refs, faces not fully blurred, glitch SFX too loud, VHS look, crossfades/dips not glitches, glitch/posterise too saturated). Full brief = lead's v2 prompt.

### Done this session
- Rule book: backup `styleguide/abyssal/abyssal.json.bak-20261112`; added 8 owner rule-book entries via model.apply_ops+save (rev 14, md regenerated): Clean audio cuts, Loud intro static, Match the refs by eye, Faces fully covered, Quiet glitch hits, VHS over everything, Crossfades and dips, Dark low-saturation glitch. Edited b-101aa627 "Hard cuts" -> "Soft transitions" (owner overrides). 8 learnings appended (status "rulebook").
- Epidemic SFX (WAV, each own folder): `V/sources/epidemic_v2/{tv_static_buzz (122 s TV buzz noise), tape_moving (8.9 s tape warble), tv_choppy (1.0 s), tv_pops (1.3 s crunchy pops), static_bursts (16.9 s short bursts), faulty_stream (1.7 s)}/<name>.wav`.
- Refs: full channel videos already local at `productions/_abyssal-ref/src/*.mp4` (480p) — NO download needed. Intros of 2TATIg7YdaQ and 7UjUZw3VluA studied (0-50 s @0.5 s sheets; tool: scratchpad sheet.py pattern = ffmpeg fps + PIL tile 10 cols 192 px).

### Ref findings (measured unless est.)
- Warning card holds ~7 s in both refs (guide says ~4.4); v1 = 3.0 s -> make 4.5-6 s. Text small grey pixel caps; "FLASH IMAGE SHOWN" ~58% width.
- Intro audio: dense broadband static/tape noise continuously under the warning card with tonal whines (spectrogram). Loudness: warning 0.3-6.8 s = -14.7 / -15.9 LUFS; Presents 7-10 s = -20.4 / -20.9; body narration 40-100 s = -25.1 / -23.6. => static bed ~9 LU over body voice. v1 had near silence there (only one tick).
- Glitch hits in body (30 ms RMS peak): refs 0 to +3 dB above voice p90 30 ms RMS (2TAT 38.2 s -15.4 vs p90 -16.9; 7UjU 15.5 s -12.1 vs p90 -15.1). v1 hits +9..+11 dB over voice p90 (v1 10.1 s -9.1 vs p90 -19.9) = too loud. Target: hit peak <= voice p90 +2 dB.
- 2TAT Presents = "Abyssal Detective Present" over near-B&W posterised footage (white/black + small colour specks) -> keep ours low-sat (only "PRESENTS"). Iceberg list dark teal + white bars. Hook shots 1.5-4 s; glitch frames only at a few points; dip to black before Level 1.
- Script for measuring: scratchpad mom.py (ebur128 M series + 30 ms RMS peaks).

### v1 problems seen in its 0-50 s sheet (beyond owner notes)
- BROLL_profes shots carry BURNED-IN Spanish subtitles at y~78-85% (v1 8-9 s, 16-17.5, 37-41.5, 46-47.5): crop them out (crop top ~76% height, same aspect) or pick other in-points.
- Heraldo friend clip has a player pause icon / HERALDO logo top-right: crop slightly.
- PRESENTS bg is saturated red/blue/yellow posterise; glitch_frame palette has magenta/green/blue -> desaturate/darken.
- Top-of-slide shots (v1 26-28 s, TOP_MOSAIC (0,0,40%W,58%H)): victim's face appears lower-left (~x 15-30%, y 65-85%) and is only partly mosaicked -> re-locate per frame (sample every 0.5 s) and cover.

### Plan for v2 (not started in code)
1. `cp build.py build_v2.py` (keep v1); output name `_v2`, seg dir `seg_v2`, picture_v2.mp4, mix_v2.wav.
2. Faces: for every victim shot (her 0.0, 3.0, 88, 89, 102, 58.6 photo; car 18.4 photo; Publimetro + El Tiempo article photos; memorial her 42 / 192 check) make contact sheets every 0.5 s, define keyframed boxes (interpolated per frame, padded 30%+ beyond hair) and apply mosaic in numpy (replace ffmpeg static box). Drop 'poster' look -> mosaic + dark grade.
3. Transitions: Python assembler streams segments (render each segment with +0.5 s tail handle), crossfade 8-12 frames at most cuts, dip-to-black at seams, glitch only: warning->presents, presents->hook, list out, i00 curve shock, ice title out. Ensure every shot >= 2x crossfade length.
4. VHS pass (numpy/cv2 per frame): chroma blur ~10 px horizontal + 3 px shift, scanlines, grain, small per-band horizontal jitter, rolling tracking/noise band near bottom every few s, slight luma soften. Then grade check SATAVG 3-11 / YAVG 52-73 (signalstats).
5. Audio: whisper (faster-whisper, word timestamps) on each raw cue with 1 s margins (INT 798.7-807.7; her 0.0-9.0; her 9.0-10.95) and on VO edges; set in/out at word bounds +-40 ms, afade 20 ms; ensure no reporter VO (Heraldo report VO starts at 11.0). Intro: tv_static_buzz + tape_moving bed under warning+presents at ~-15 LUFS short-term, pops on text garbles; then glitch hits re-levelled to <= voice p90 +2 dB (measure after mix with mom.py). Master -23 LUFS, intro 2-4 LU louder, peak < -1 dBFS.
6. QC per brief, then update this file to "STATUS: v2".

## Session 5 (2026-11-12): v2 builder written, render running
- `V/build/build_v2.py` (imports build.py, v1 untouched): modes seg | stats | pic | audio | final | all. Segments -> build/seg_v2, picture_v2.mp4, mix_v2.wav (+audio_v2.json levels), timeline_v2.json, stats_v2.json -> renders/abyssal_intro_case01_v2.mp4.
- Changes: warning 6.5 s; Presents bg B&W posterise; glitch palette greys; pro crop (0.12,0,0.76,0.76) kills subtitles; her crop drops logo; static big face mosaics before overlays (TOPBOX x0-70% full height on top-of-slide shots; HERBOX/CARBOX photos; Publimetro both photos); seams: crossfade 10 f default, dips at seams, glitch only intro + shock; per-shot gamma/chroma normalisation + VHS pass (chroma bleed, scanlines, grain, jitter, head-switch, tracking band) in assemble(); numpy audio: raw cues trimmed by whisper words (INT 798.55+8.95, top 0-8.93, curve 9.0+1.9), 15-30 ms fades, static bed 9 LU over body, hits auto +1.5 dB over voice p90.
- Audio measured (mix_v2.wav): whole -23.0 LUFS, peak -1.5, warning -15.5, hook ~2.5 LU over body, bed 13.5 dB under VO, all 9 hits +1.5 dB, boom +2.0.
- QC: `python -I V/build/qc_v2.py fmt|loud|grade|words|faces SHEET.jpg`.
- Next if interrupted: `python -I build_v2.py seg` (done?) then `python -I build_v2.py pic` then `final`; run qc; mkshot for v2 (point at timeline_v2.json); credits add epidemic_v2 SFX.
- State at context limit (session 5): segments done (seg_v2, 64 shots, 203.8 s). First `pic` crashed in vhs() (cv2.add with np.uint8 scalar) -> fixed with np.clip int16 adds (vhs 17 ms/frame). `pic` + `final` re-running in background (log build/pic_v2.log; "Broken pipe" lines are harmless read_frames kills). credits.txt updated (v1 copy build/credits_v1.txt); mkshot.py takes `timeline_v2.json` -> cases/case01/shotlist_v2.md (written, 64 rows).
- NOT yet checked on the v2 render: qc_v2.py fmt / loud / grade / words / faces. If any grade shot is out of range, adjust targets in stats() (Y 60/68, sat 7.0) and rerun `pic` + `final` only. Face boxes are static generous boxes (not per-frame tracked): check the faces sheet every 0.5 s.
- v2 mp4 rendered after handback (picture frames 6114); QC still not run.

## Session 7 (2026-11-12): v3 builder written, render in progress
- `V/build/build_v3.py` (imports build_v2 + build; v1/v2 untouched). Modes seg|stats|pic|audio|final|all; outputs seg_v3/, stats_v3.json, picture_v3.mp4, mix_v3_pre.npy -> mix_v3.wav, timeline_v3.json, audio_v3.json, renders/abyssal_intro_case01_v3.mp4. `final` loops the limiter until AAC true peak <= -1.05 dBTP.
- Timeline: 52 shots, ~206 s. Hook re-timed (NEW dict): 7 shots 3.0-3.6 s + shock burst b_07/b_08 (1.5 s each); blocks d/h/j re-timed so narration shots >= 3.03 s (most >= 3.3). Case card at 34.67 s.
- Graphics: warning card 208 f per INTRO_SPEC 2a (#A2A6A4, blur-in f6/f15, garbles f24,66,96-97,156-157,186); PRESENTS = small overlay on b_00 (f7, 8 f in with 2 garbled frames, 75 hold, 15 out); c01_case = CASE 01 card (a(n) fade, ghost text, hold 36 f) -> 7 f zoom-through 1.28^k diving down, BG crossfade k2-3 -> ice close-up push 2%/s -> ice title scramble 7 f starting 8 f after. Date 3.0 s. Iceberg list: teal tint only (no white rules).
- Seams: crossfade 10 f default, dips at black, glitch only warning->hook (b_00), burst (b_07) and shock (i01_glitch).
- Audio: static = INTRO_SPEC lavfi recipe (pink -10 dB), body +1 LU, -6 dB from hook start, 8 f fade at Presents end, 2 soft ticks; SFX each file once at voice p90 -7 dB (boom -6 on the black); bed 13 dB under; -62 dBFS noise floor; vo_005 'Yeah' breath bursts muted (0.00-0.20, 6.86-7.04, 17.48-17.74 s) -> build/aud/vo_005_v3_nobreath.wav. vo_004 'yes' is script, kept.
- State at context limit (session 7): `python -I -X utf8 build_v3.py seg > seg_v3.log` was running in the background (52 segments; warn3 + case render first). v3 NOT rendered, NOT QC'd. Timeline checked: 206.3 s, case card 34.67 s.
- Next: 1) check seg_v3.log for Traceback (untested code paths: card_warning3, card_case incl. 6.5x text resize ~350 MB, presents_over); fix and rerun only the failed prefix (`seg c01` / `seg a00`). 2) `build_v3.py pic` (background) then `audio` (runs final; limiter loop to TP <= -1.05). 3) Point qc_v2.py OUT at the v3 mp4 (copy to qc_v3.py) and run fmt/loud/grade/words/faces; check static centroid < 900 Hz and 5-8 kHz band, SFX peaks in audio_v3.json (~-7 dB vs voice p90), frame sheet of 0-45 s vs INTRO_SPEC. 4) `python -I mkshot.py timeline_v3.json` (mkshot names output shotlist_v2/shotlist by 'v2' in name -> patch to shotlist_v3.md); credits: no new sources (static is synthetic; same Epidemic files, fewer used). 5) Status "v3 DONE" only after QC passes.
- Known gaps vs refs: iceberg list has teal tint only (no white full-width rules, no glitch in/out by owner rule); b_01 3.0 s and h_03 3.03 s are under 3 s alone (10 f crossfade in); picture-on-noun not re-checked after re-timing; new in-points extended by up to 0.5 s not sheet-checked for source cuts (rule 7/8).

## Session 8 (2026-11-12): v3 rendered + QC'd, NOT done (source cuts inside shots)
- Render: `renders/abyssal_intro_case01_v3.mp4`, 206.33 s, h264 1920x1080 30p + AAC 48k (~1.05 GB). Seg log clean (52/52).
- Fixes in `build_v3.py` (backup `build_v3.py.bak`): (1) ice title had no contrast on white ice ("T" and "SLIDE" lost) -> dark soft halo (dilate 9 px, blur 14, 0.62) + glow x0.5 in `card_case`; (2) b_00 drone (her 35.0) held 3.6 s over a source cut at 37.1 (cut to memorial flowers at +2.1 s) -> `b00_src()` makes `build/aud/her_b00_slow.mp4` (her 34.95-37.07, setpts x1.96 + minterpolate mci); b_00 args src='her_b00', ss=0. Re-rendered seg c01 + b_00, pic, final.
- `qc_v3.py` (copy of qc_v2): regions re-mapped (no a01_presents/c01_icetitle in v3; body = c02_date..k00_black; presents = b_00..+3.5 s); faces map v2 names via `old`. `mkshot.py` (backup .bak) names output by v3/v2 -> `cases/case01/shotlist_v3.md` written (52 rows; row 2 PRESENTS overlay added by hand).
- QC numbers: whole -23.0 LUFS, TP -1.4 dBTP (limit 0.84); hook -21.0, body -23.5 -> +2.5 LU PASS; warning -22.5 (+1.0 LU over body) PASS; presents -20.2. Static 0.3-6.7 s (mix_v3.wav): centroid 323 Hz PASS, bands vs 40-80 Hz: 80-160 +1, 160-315 -4, 315-630 -9, 630-1.25k -15, 1.25-2.5k -21, 2.5-5k -30, 5-8k -38, 8-12k -50; env SD 1.38 dB. SFX (audio_v3.json): voice p90 -23.48; hits -7 (boom -6, riser -12.95) PASS.
- Grade flags (signalstats): by design a00_warning, b_02 iceberg teal, c01_case (ice white/cyan, Y 121), i00_chi_curve (posterised shock, Y 36), j_00 article; low-sat sources (SAT<2, can't add colour): f_04, j_04, j_09; b_08 Y 44.6 (shock burst).
- Words at 54 cuts: 19 flagged, all whisper misreads of script (fares/Columbus/kukuta/X-ray/entree floor/response...) or hallucinations on static/black ("Thanks for watching" 6.93/34.67/149.8, "Thank you very much" 43.20 on date card). No stray words.
- Faces sheet (85 tiles, v3 names via old): all victim faces mosaiced incl. j_07 article photos; d_05->d_06 crossfade at 77.0 shows interview people (man in NY cap, blonde woman) from a source cut in d_06 (her 29.0).
- Short alone (dur minus half crossfades): b_01 2.67, c02_date 2.67, h_03 2.70, f_04 2.77, b_03 2.87, j_03/j_06 2.93, b_04/d_09/h_02 2.97; burst b_07 1.50/b_08 1.53 (allowed). Not changed.
- FAIL / next: source cuts INSIDE shots (scene>0.1 on seg_v3, scratchpad cuts.py logic): b_03(pro 2.0 @1.8) b_08(her 36.0 @1.1, burst) d_02(pro 115 @1.17) d_04(her 35.0 @2.1) d_06(her 29.0 @2.4-3.0) f_06(car 18.4 @3.07) h_02(her 35.0 @2.1) j_02(her 76 @2.07-2.7) j_05(car 113 @3.97) j_06(her 30 @1.4-2.0) j_09(car 77 @3.27). Fix: move ss so shot+0.5 handle sits inside one source shot, or reuse `b00_src()` (d_04, h_02 = same drone); then `seg <names>`, `pic`, `final`, rerun qc_v3 fmt/loud/faces + cut scan. Status: v3 NOT DONE.

## Session 9 (2026-11-12): fix plan for source cuts + short shots worked out, NOT applied (context limit)
- Nothing in `build_v3.py` changed yet; render untouched (still back it up to `renders/abyssal_intro_case01_v3a.mp4` before `final`).
- Tools (scratchpad, recreate if gone): `scenes.py <src> <t0> <t1> [thr]` = ffmpeg `scale=320,select=gt(scene,thr),metadata=print` -> source times; `sheet.py out.jpg cols src:t ...` = labelled 320x180 contact sheet.
- Source shot map (scene>0.25 + eyes): her 17.88-31.36 friend video (27.0 close-up at top, 27.9+ ring heading down rainbow straight); 34.90-37.10 drone (all used by b_00); 69.74-72.94 visitor in white shirt on ring from behind; 73.0-74.75 high view slide+ring+cars; 75.4-76.28 ball pit; 76.28-78.05 slide+ring+cars; 166.47-169.14 high view of straight w/ ring (cyan streak overlay until ~166.85; cut 169.14); 155.96-162.06 domes at night. pro 0.03-3.80 road drive; 3.80-7.00 flower arches; 109.43-116.17 "Yo <3 Entre Flores" wall (pan; 115.60 is motion, not cut). car 16.07-21.47 Yuris photo 2; 21.47-45.07 friend video in Caracol frame (30-34 ring going down); 75.63-80.27 document p1, 80.27-84.10 p2; 84.10-92.93 authorities at entrance; 108.57-116.97 police at slide. No slide drone anywhere in pro/que/car.
- Timing plan (frames @30, alone = frames-10 must be >=90 i.e. len >=100 f): b: b_00 108,b_01 100,b_02 101,b_03 100,b_04 100,b_05 101,b_06 101 (starts f 0,108,208,309,409,509,610,711; b_07 711, b_08 756 unchanged). d: d_04 100 (-5) d_05 130 (+5), d_08 134 (-1) d_09 100 (+1) (d_09 start 1010/30). h: all four 100 f (starts 0,100,200,300). j: j_02 115 (-2) j_03 100 (+2), j_05 156 (-2) j_06 100 (+2). f: f_03 116 (-7) f_04 100 (+7). c01_case dur 156 f (card still renders 166 -> extra 10 f become the crossfade tail) and c02_date 100 f. Block totals unchanged -> audio (mix_v3_pre.npy) stays in sync; only `seg`, `pic`, `final` needed.
- Source plan: b_03 pro 3.85-6.95 slowed x1.242 (arches); b_08 her ss 34.95; d_02 pro ss 112.15; d_04 her 166.88-169.12 slowed x1.667 (0.6x); d_06 her 70.0-72.85 slowed x1.345 (visitor riding); h_02 her 27.9-31.3 slowed x1.13 (ring down the straight); j_02 pro 0.15-3.75 slowed x1.2 (road drive = "drove for Cucuta"; credit pro); j_05 car ss 108.7; f_03 car ss 112.5 (less overlap w/ j_05); f_06 car ss 16.3 (check mosaic box still on face); j_06 car ss 30.0 (friend video; credit car); j_09 car 75.65-80.25 slowed x1.18. Slow sources: generalise `b00_src()` (setpts + minterpolate) into a table, src key '<name>s', ss 0; update `label`/credit args when src changes.
- Then verify every ff shot's [ss, ss+len+0.5] with scenes.py thr 0.1, `seg` changed names, `pic`, `final`, qc_v3 fmt/loud/grade/faces, cut scan on render, shortest-shot list, `mkshot.py timeline_v3.json`. Status: superseded by Session 10 (v3 DONE).

## Session 10 (2026-11-12): Session 9 plan applied, render running
- Backups: `renders/abyssal_intro_case01_v3a.mp4` (old v3), `build/build_v3.py.bak2`.
- `build_v3.py`: new tables FRAMES (frame lengths, block totals asserted unchanged), SLOW (name -> src,t0,t1,stretch; `slow_src()` writes `build/aud/<name>s_*.mp4`, copies CROP for car), REPL (src/ss/credit/label per shot).
- Changes vs plan: d_02 ss 112.3 (pro scene 0.13 at 112.20), j_02 pro 0.25-3.75 x1.22.
- Repeats: b_08 now her 73.06-74.05 x1.6 (high view, rider, teal, zoom 0.12) - no longer b_00's drone. j_06 now car 32.5-34.9 x1.6 (friend video, ring far down; after h_02's moment). No unused friend-video moment exists; j_06 still overlaps h_03's content moment (her 12.3), que walking shot (que 45.6-47.75) too short at >=0.6x.
- Not touched, noted: d_07 her 13.0 and h_03 her 12.3 overlap (same friend-video moment).
- Run: seg changed names -> pic -> final, log `build/s10_run.log`. Next: qc_v3 fmt/loud/grade/faces, cut scan, shortest shot, mkshot.
- Render done (206.33 s, 1080p30, 6190 f). QC: fmt OK; whole -21.4 LUFS, body -23.5, hook-body 2.5 LU PASS, true peak -1.4 dBTP PASS; render cut scan (thr 0.15): 1 cut inside shots = c01_case zoom-through (intended); shortest alone 90 f (b_01/b_03/b_04/c02_date), bursts b_07 45 f, b_08 46 f; faces sheet: f_05/f_06 Yuris fully mosaiced. Grade outliers as before (cards, night friend video i00, j_06 Y 43 dark night clip).
- Status: **v3 DONE** (open: d_07/h_03 share a friend-video moment; j_06 content overlaps h_03 moment; no unused friend-video moment exists).

## Session 11 (2026-11-12): v4 storyboard (no render)
- Out: `productions/abyssal-01-theme-park-disasters/cases/case01/storyboard_v4/storyboard_v4.json` (54 rows, total 199.77 s) + `stills/NN.jpg` (45; GRAPHIC rows none). Applied `_abyssal-ref/INTRO_SPEC2.md`.
- v4 timing: warning 0-4.5 (hard cut); intro = v3 - 2.333; black 31.34-32.54; CASE 01 card 32.54-36.64; case = v3 - 6.563.
- v3 audit: 10 wrong, 15 weak, 28 match. Scene-checked all source windows (thr 0.12); remaining flags are only at the first frame or past src_out.
- FETCH before build: Huaying (Sichuan) waterfall/cliff swing headlines x3 (montage rows 7-9). Optional: Europa-Park, Wolmido Disco Pang Pang, Hopi Hari headlines.
- Next: build_v4 from the json (rows 3-9, 12-13 are short by design; row 29 2.95 s).

## Session 12 (2026-11-12): v4 build STARTED, stopped at context limit (no render) — status: v4 NOT DONE
- Done: `build/build_v4.py` = plain copy of build_v3.py (not edited yet; v3 untouched). `sources/headlines/` did not exist yet at stop (rows 7-9 fetch still pending).
- Read so far (no need to re-read): handoff S10/S11, storyboard_v4.json (54 rows), build_v3.py, v2 timeline/render_segments, build.py timeline/card_article/shot_ff/card_iceberg/card_date.
- Design for build_v4.py (do this next, one session, start from the json, not v3 NEW/FRAMES/SLOW tables):
  - Timeline = one shot per storyboard row: dur = t_out - t_in (frames = round(*30)); name `r01..r54`.
  - Kinds: row1 `warn3` (WARN_N=135 = 4.5 s, hard cut out, keep card_warning3); rows 2,10-13,16,18-30,32-40,42,43,45-49,51-54 `ff` from row source/src_in; speed<1 → slow_src-style minterpolate (stretch=1/speed, file `aud/r<NN>s_*.mp4`); speed 1 → shot_ff ss=src_in, zoom 0.04. Add `b1.SRC['may']='sources/MAYOR_caracol/It1oPzAwDIQ.mp4'` (+CROP like car if it has a lower third; check one frame).
  - Row 3: new card "25" big (F_WIDE) over ENTRIES rows (from b1.ENTRIES, add place to row 01 and 25 per overlay text), sharp, linear push 4 %.
  - Rows 4-6, 41, 50: article pages `sources/ART_{eltiempo,bluradio,publimetro}/page.png` (1920x1400). Montage rows 4-6 = sharp headline crop full-frame (no slide-up ease), linear push-in 4 %; v1 crops: eltiempo crop (380,520,1600,900) head (440,590,1500,760); publimetro crop (220,280,1500,990) head (230,300,1480,430), PUB_MOS/PUBBOX mosaic; bluradio crop unknown (find headline band with b1.text_lines). Row 6 amber wipe on the permits line, row 41 fall line, row 50 fine line (reuse card_article wipes).
  - Rows 7-9: `sources/headlines/headlines.json` files + face boxes (mosaic them); fallback = Chinácota article crops (other parts of the 3 pages) and report it.
  - Rows 14 black (1.2 s), 15 new case card: "CASE 01" over "THE EXTREME SLIDE" (wide caps, SLIDE cyan) on dark teal ice1 bg, 18 f fade-in ease-out, hold 3.0 s, 0.5 s dissolve (15 f crossfade into row 16). NO PRESENTS anywhere (drop presents_over + its static tail logic: static bed runs 0..4.5 s + hook fade like v3 but end = row 2 end).
  - Rows 17, 44: map card (new): dark grade, Chinácota pin, Cúcuta, dashed Venezuela border; labels pop at word times; row 44 route line draws + car dot moves.
  - Row 46: statement card over pro 204.1 (no exact quote unless real statement found → paraphrase only).
  - Overlays drawn in assemble (PIL RGBA, cached): place tags (rows 5,7,16,18,31,52), typed date small (row 16 MARCH 5, 2026; row 20 FEBRUARY 2026; row 32 THURSDAY, MARCH 5, 2026), typed tag row 34 "28 - TIBU", row 22 EN "THE EXTREME SLIDE", rows 23/47 EN subtitles; name tags via b1.nt (rows 24,25,26,33,43,49); caps for rows 27 (cap_int) and 36 (cap_top) as v3; mosaics TOPBOX/HERBOX/CARBOX as v3 for rows 11,22,33-38; safety note rows 11,33-40,48.
  - Seams per row from transition_in: montage 13 f crossfade, normal 10 f, 0.5 s = 15 f (rows 16,45,54), row 40 6 f, dips 0.2 s (rows 27,36,41: DP=3/side), hard cuts rows 2,3,12,13, glitch only row 2 in (1-f white flash + glitch hit) and row 13 out. Row 54: 1.5 s fade to black inside the shot. Generalise assemble: seam=(type,frames).
  - Audio: VO anchors = row t_in: vo1 at r02+0.1, vo2 r16+0.15, vo3 r28+0.15, vo4 r37+0.15, vo5 r41+0.2; raws at r27 (int 798.55, 8.95 s), r36 (her 0.0), r40 (her 9.0, 3.6 s? v3 used 1.9 s — check). Same gains/SFX rules as v3; SFX anchors: glitch at r02, tick r03, low hit end r09, boom r14, riser r15, ticks r17/r24/r33, riser r41/r50. Bed starts r02, ducked from r14 to r16.
  - Render: picture_v4.mp4 + mix_v4.wav → renders/abyssal_intro_case01_v4.mp4 (background + Monitor). Then QC as v3 (qc_v3.py fmt/loud/cuts/faces/words) + rows 1-16 frame sheet; shotlist `cases/case01/shotlist_v4.md`.

## Session 13 (2026-11-12): v4 builder coded (superseded: see Session 14, v4 DONE)
- `build/build_v4.py` rewritten (imports helpers from build/build_v2/build_v3/gfx; v1-v3 untouched). One shot per storyboard_v4 row (`r01..r54`, frame-exact from t_in/t_out, total 199.767 s, 54 shots). New graphics/PNGs in `build/gfx_v4/`, segments in `build/seg_v4/`.
- Coded: warning card 135 f + glitch/1-f white flash hard cut into r02; no PRESENTS; r03 "25" card over ENTRIES (01 + 25 with places), 4 % push; r04-r09 sharp full-frame headline crops + 4 % push (r05 CHINACOTA, COLOMBIA tag, r06 amber wipe on permits line + PUB_MOS); r14 black; r15 CASE 01 / THE EXTREME SLIDE (SLIDE cyan) on dark teal ice1, 18 f fade-in, 15 f dissolve into r16; r17/r44 map cards (labels pop, r44 route + dot); r41/r50 card_article wipes; r46 statement panel (paraphrased, marked); typed tags/dates r16/20/22/32/34, tags r18/28/31/52, name tags r24/25/26/33/43/49, EN caps r23/27/36/47; mosaics r11/22/33-38; safety note r11,33-40,48; credits; slowed rows 2/12/20/21/45 (minterpolate, stretch covers the row; assemble freezes last frame if a source runs short, prints `pad`); r40 poster look; seams per transition_in (13 f montage, 10 f, 15 f rows 16/45/54, 6 f r40, dips 3 f/side r27/36/41, glitch out r13); r54 1.5 s fade; VHS pass; static bed 0→r03; VO at r02/r16/r28/r37/r41 (+0.1/0.15/0.2); raws r27/r36/r40; SFX each file once (synthetic ticks/low hit/noise risers for the rest); bed −13 dB, ducked r14→r16.
- Rows 7-9: owner/coordinator headlines.json used: r07 SCMP (tag HUAYING, CHINA, staff face mosaic, padded 45 %), r08 China Daily (left column only, sidebar photo cropped out), r09 City News Service (padded face mosaic). ifeng skipped (small Chinese text). Fallback (Chinácota page crops) stays in code if json missing.
- Open items checked: Blu Radio head region = (328,440,1360,590) page px; mayor clip has a Caracol lower third from 0.78 H → `CROP['may']=(0.12,0,0.76,0.76)`; r40 raw: loud impact/scream starts at her 11.6 → raw audio 9.0-11.5 (2.5 s, 0.25 s fade), picture stays 3.6 s.
- Tested (segments only, frame sheets): r01, r03, r04-r09, r15, r16 — all render, text readable, mosaics cover faces. After the sheet, r07/r09 windows were moved up (headline was at the top edge); re-rendered OK but NOT re-viewed.
- Full build (from `productions/abyssal-01-theme-park-disasters`, background + Monitor, ~1 h+):
  `python -I -X utf8 build/build_v4.py all > build/v4_all.log 2>&1`
  (or in steps: `seg` [r01 r02 ..], `stats`, `pic`, `audio` (audio also runs final), `final`). Output `renders/abyssal_intro_case01_v4.mp4`.
- Left to do: full render; check r07/r09 new windows; r02 slowed source may pad a few frames (watch `pad` lines); name-tag/typed-tag times are fixed offsets (0.4-0.6 s), not word-synced; r31 amber "attraction line" not drawn (no text line located in footage); assemble/audio not yet run once (untested code paths: assemble seams, audio mix, map cards, statement, articles r41/r50); then QC as v3 (qc_v3.py fmt/loud/cuts/faces/words, rows 1-16 sheet) and `cases/case01/shotlist_v4.md`.

## Session 14 (2026-11-12): v4 rendered + QC'd — STATUS: v4 DONE
- Render: `renders/abyssal_intro_case01_v4.mp4`, 199.767 s (3:19.8), 54 shots. Log `build/v4_all.log`: no errors, no `pad` lines (r02 slow source covers the row).
- Fixes in `build/build_v4.py` (S14 comments): `wt()` puts every place/name/typed date tag on its spoken word (VO words.json shifted onto row starts, 0.1 s lead, clamp 0): r16 0.25, r18 1.72, r20 0.14, r22 0.74, r24 1.88, r25 1.27, r26 2.41, r28 2.87, r31 0.11, r32 0.00, r33 0.64, r34 0.61, r43/49/52 0.00 (word starts at/just before the cut). d16 "MARCH 5, 2026" stays at 1.8 s (date is not spoken in r16). `hl31()` draws the amber highlight on the "atraccion recreativa" line (wipe from "application", tracks the push; checked on frames). r29 +2 f / r30 -2 f (2.95 -> 3.0 s). VO1 offset +0.1 -> -0.1, VO5 +0.2 -> +0.15 (cut-to-phrase was 0.64 / 0.53 s).
- r07/r09 new headline windows checked: headline fully in frame, readable, face mosaics in place.
- QC (`build/qc_v4.py` fmt|loud|cuts|short|sync|words|faces|sheet): 1920x1080 30p h264, AAC 48 kHz stereo; whole -23.0 LUFS, hook -21.0 vs body -23.5 (+2.5 LU), true peak -1.4 dBTP; scene-cut scan (thr 0.2) 9 cuts, 0 inside shots; shots <3 s only montage/burst r03-r09, r12-r13 and black r14; cut-to-phrase max 0.48 s (all 52 narrated rows <= 0.5); faces sheet (130 tiles) all victim faces mosaicked/not visible; rows 1-16 sheet: warning card, sharp montage, one CASE 01 card dissolving into r16, no second title card. Whisper: 55 cuts, 24 flagged, all script words misheard (Columbia, 25, metres...) or hallucinations on music/silence (36.63 CASE card, 143.83 r40 raw tail) — no stray words.
- Shot list: `cases/case01/shotlist_v4.md`.
- Open: nothing blocking; owner review of the render.

## Session 15 (2026-11-12): v5 build (storyboard_v5, 48 rows, 197.767 s) — IN PROGRESS
- `build/build_v5.py` written (imports v4 helpers; v4 files untouched; v4.GFX4 redirected to `build/gfx_v5`). Segs `build/seg_v5/`, render `renders/abyssal_intro_case01_v5.mp4`.
- v5 row = v4 row - 6 from row 10 (overlays/MOS/SAFE renumbered). Seams: hard cut everywhere; dips r21/r30/r35 (3+3 f), r39/r48 (out 4 + in 5 f); r09 black 36 f inside the card row. No crossfade/flash/glitch frames.
- r03 `card_ice` (120 f, mock look, smoothstep push 1.04->1.12, cy .45->.55, impact 8 px + 2 px 7 Hz, Texture class); r09 `card5` (36 f black + fade/wipe/hold/zoom A, f60 hard swap to ice2 close-up, cyan title from c70).
- New sources: coa (coaster, band y .30 h .3164), crw (crowd), swg = `build/aud/r05_swing_mos.mp4` (rider face mosaic, keyframes SWK), her8 crop (0,.17,.8,.8) hides the H bug.
- Audio: VO at r02-0.1/r10/r22/r31/r35 +0.15; raws r21/r30/r34; static bed steady vl-9 LU 0->r09 only; boom at r09+36 f; soft hit r03; bed silent r09->r10.
- Run: `python -I -X utf8 build/build_v5.py all > build/v5_all.log 2>&1` (from V). QC: `build/qc_v5.py`.
- Checked (seg sheet): r03 iceberg = approved g03 look (01 COLOMBIA yellow, deep entries blurred, push/sink); r09 card = black -> CASE 01 wipe -> hold -> f60 swap to ice2 close-up + cyan title (matches g09); r05 swing face mosaic covers the rider's face in all sampled frames, HUAYING, CHINA tag.
- Full render STARTED in background (nohup) at session 15 end: `build/v5_all.log` (~1 h). Context limit hit, so NOT yet verified.
- NEXT (successor): 1) wait for `renders/abyssal_intro_case01_v5.mp4` + `true peak` line in log; check log for `pad`/`WARNING`/Traceback. 2) copy `build/qc_v4.py` -> `build/qc_v5.py`: paths v5 (OUT, timeline_v5.json, storyboard_v5), VOA = build_v5.VOA, hook range r02..r09, body r10.., words raw cut ends ('r21',8.93),('r30',8.93),('r34',2.5), faces rows {5,16,27-32}+her rows; ADD blend check (each cut: frames c-2..c+1, flag if frame ~ alpha mix of neighbours, alpha .15-.85, skip near-black neighbours). 3) run fmt|loud|cuts|short|sync|words|faces|sheet; fix + re-render (`seg rNN` then `pic`, `audio`). 4) source-reuse check: no overlapping src windows per source (storyboard rows).

## Session 16 (2026-11-12): v5 QC + 2 fixes, re-rendered — STATUS: v5 DONE (owner review)
- `build/qc_v5.py` = qc_v4 with v5 paths/anchors + new modes: `blend` (every planned cut: frames c-2..c+1 tested as alpha mix of c-3 / c+2, plus side check; dips: darkest frame luma), `reuse` (src windows per source), `hits` (ebur128 M/S of mix), `grid SHEET STEP T0 T1 [w h]` (contact sheet). Stem check for hits: scratch `stems.py` (monkeypatched audio(), no files written).
- Fixes in `build/build_v5.py` (S16 comments; pre-fix copy `build/build_v5.pre_s16.py`): 1) r04|r05 cut 14.33 -> 14.57 s (r04 90 -> 97 f, int 600-603.23 has no source cut; r05 122 -> 115 f): cut was 0.66 s before "that sent a rider". 2) dips went only to 25 % brightness (min luma 5-13) -> fade factors now j/ki and (n-1-j)/ko, r48 end (n-1-j)/45: seam frames fully black.
- Re-rendered `seg r04 r05` -> `pic` -> `audio` (log `build/v5_s16.log`: 5933 frames, no pad/warn, TP -1.4).
- QC (final render, 197.767 s, 1920x1080 30p h264, AAC 48 kHz): whole -23.0 LUFS, hook -21.2 / body -23.4 (+2.2 LU), true peak -1.4 dBTP; scene cuts (thr .2) 42, 0 off row boundaries; blend 47 cuts, 0 mixed frames; dips r21/r30/r35/r39/r48 min luma 1.6-1.7 (black); shots: r01 75 f, all others >= 90 f (min r04 97 f); cut-to-phrase max 0.48 s (all rows); source reuse 9 sources, 0 overlaps; hits (stems, after master gain): soft hit iceberg M max -35.4 vs narration M p90 -16.5 (19 LU under), sub boom M -27.0 / S -33.4 vs narration M p90 -18.9 / S med -23.4 (8-10 LU under). Whisper 50 cuts, 22 flagged: all misheard script words (25, Chinácota, Cúcuta, Venezuela, Yuris...) except 141.83 "Thank you very much" = hallucination on bed only (-34..-40 dB, same as v4 143.83) — no stray words/ghost audio. Faces sheet (118 tiles): all victim/rider faces mosaicked or not visible.
- Sheets (scratch): v5_sheet.jpg (1 f/3 s), v5_intro.jpg (0-45 s, 1 f/s), v5_faces.jpg, v5_rows01-10.jpg.
- Open: owner review of the render.

## Session 17 (2026-11-12): storyboard v6 (no render) — STATUS: owner review
- Built from v6_plan.md (scratchpad). 49 rows (v5's 48 + new r05 pendulum beat + new r08 ambulance beat; v5 r04 int 600 dropped), 212.233 s (3:32.23), 30 fps, every cut = frame-floor of its word in the v6 voice (narration/v6/line_001-005.wav). Inserted VO gaps (json `vo_plan`, split at lowest-energy point): L1 before "to" 0.693 / "These" 2.853 / "We're" 2.600; L2 before "Just" 0.6 / "with" 0.35; L3 before "The" 0.55; L5 before "She" 1.0.
- Shortest non-warning shots 90 f (r05, r08 beats, r27). Every row except r01 >= 90 f (asserted).
- Frame-leak fix (1:35 flash): v5 r24 car 84.3-87.4 crossed a 6-f source dissolve at car 87.10-87.27 -> v6 r25 car 84.15-87.05 at 0.7768x.
- Tail scans (64x36 diff) on lengthened rows: r09 her src_in 156.367 (cut 159.63), r28 her src_in 58.127 (cut 62.43), r42 her speed 0.9726 (cut 140.64), r44 may src_in 249.847 (cut 255.45 — v5 r43 already ran 1 f over it).
- Crops placed from a frame sheet: her (0,.16,.8,.8) hides HERALDO bug; her chyron rows r17/r18/r37 (0.10,0,.62,.62); r42 caption blurred; car (0.125,0,.66,.66) drops blue bars, interpreter, lower third; que (0.07,0,.72,.72); may/pro (.12,0,.76,.76); r14 pro (0,0,.76,.76) keeps the dome; pendulum (0.42,0.12,0.58,0.58) drops the food banner; docs r26/r48 centred from car x .29-.72.
- White X at v5 48 s = a real wooden fence cross in pro 196 (not drawn by build_v5); v6 r14 adds a red draw-on circle on the dome instead. Red circle also planned on r34 big curve (place at render).
- Files: SP plan_v6.py, gfx_mock_v6.py, sb_html_v6.py, v5sync.py, lb_sheet.py; V cases/case01/storyboard_v6/{storyboard_v6.json, stills/ (59), storyboard_v6.html 1.64 MB}.
- v5 cut-vs-word offsets >0.3 s now fixed: r02 (+0.44), r04 (v5 r05 +0.42; now cuts on "cliff", ~1.2 s earlier), r11 (+0.35), r36 (+0.48).
- Open: whisper oddities unchecked by ear — L3 "but"@18.94 (r28 cuts on it; not in the script), L5 "IA"@32.54 and @43.70 (filler/breath?); typewriter_single_keys reused on r11/r15/r27 vs rule 24 (no SFX repeats) — owner to decide; maps are simplified previews (hand-approximated outlines), real build needs Natural Earth/OSM per MAP_SPEC; r35 has no face mosaic box (v5 had none; rider seen from behind) — check at render; r04 swing mosaic file is 4.6 s so slowed to 0.9414x; int raw/other rows have no logo check; nothing checked by ear; no render.
- Still missing: abandoned-park clip; new China swing clip.

## Session 18 (2026-11-12): owner notes on storyboard v6 (no inverted CC, real maps) — STATUS: owner review
- Rule book rev 21 (backup `styleguide/abyssal/abyssal.json.bak-20261112f`, SP `v6_ops.py`, model.apply_ops+save): b-0c2444ba, r-fd548929, r-90af7874, g-b49e40af, photo-card graphic = no inverted/mirrored/posterised looks on clips at all, intro included; NEW b- "Vary the motion graphics" (within one video vary name tags/dates/places/highlights/doc callouts; repeats across videos fine). 1 Learning.
- Row 8 ambulance: normal grade (gfx_mock_v6 invert removed; plan_v6.py + json text updated; r35 text too).
- Maps: SP `map_tiles.py` (EOX s2cloudless_3857 = 2016, CC BY 4.0; z13 outer + z14 core, 1300 tiles in assets/map_src/eox_tiles), Natural Earth 10m border, OSRM route 42.5 km -> "43 KM", Nominatim geocodes (Cúcuta = city node 7.8971/-72.5080, not the municipality). Logged in sources/free_sources.md + credits.txt.
- SP `map_render_v6.py <V> a|b|both [--stills]`: plate graded once (70 % desat, cool navy/teal shadows, mean luma ~52), 2.5D tilt K=0.12 constant, canvas 3x then INTER_AREA, still grain, fog top, vignette. Camera prog = 0.75 smootherstep + 0.25 linear (never stops before the cut), log-space zoom: a 104 -> 88 km, b 88 -> 70 km (b starts on a's end view). Route resampled 6 px + moving average 15, solid red #D8312B + dark outline + glow, head smootherstep 0.35-3.60 s, Cúcuta pin at arrival, KM typed under midpoint. Credit line bottom-left in frame.
- Out: build/maps_v6/map_a_r12.mp4 (133 f), map_b_r39.mp4 (155 f), 1920x1080 30p h264 crf 18; stills f000/mid/last png. Motion check SP `motion_check.py` (results in the report / below).
- Page: SP `script_text.py` maps whisper row spans onto vo_c01.csv words; sb_html_v6.py now shows script text; notes items 2/6 rewritten; sb_fix_v6.py sets rows 3/8/12/35/39 text.
- Open: label timings in map a are approximate (pin 0.1 s, border 1.0 s, Cúcuta 2.45 s), not word-matched; Venezuela label position fixed at -72.33/7.74; whisper oddities from S17 still unchecked by ear; no final render.

## Session 19 (2026-11-12): MG kit applied + map polish — STATUS: owner review
- Owner calls: row 8 stays normal (no invert/posterise); row 21 Osorio tag dropped; row 23 kept L1 (text y 0.80, face ends ~y 470).
- SP `mg_kit_v6.py <V> [--dry] [--bases ..]`: 20 MG_SPEC variants (P1-4 D1-3 C1-2 N1/N2/N4 L1-3 DOC1/DOC3 Q1/Q3 SUB), seq/title-safe/mosaic-gap checks; Montserrat SemiBold added (sources/fonts_dl/montserrat, OFL, logged in free_sources.md). SP `sb_mg_s19.py` wrote overlay_text/picture/change for 25 rows (backup storyboard_v6.pre_s19.json).
- Stills: gNN_mg.jpg for 23 rows + gNN_mg_strip.jpg (2 frames, captioned with variant) for 17 rows. Checks: no repeats in a row, max 40 % (N1 2/5).
- Maps (SP map_render_v6.py, backup .pre_s19.py): halo labels cap 37/28/34 px, accents CHINÁCOTA/CÚCUTA, highlight knee (fewer cloud blotches); map a labels on words (pin 0.10, border 0.78 "Venezuelan", Cúcuta 2.74 s); map b ends with 1.2 s pull-back (78 -> 94 km) both towns + route + 43 KM in title-safe. `--probe` prints label boxes.
- Motion: a centre px/f med 0.47 max 0.85, 0 stops; b med 0.19 max 1.20, 1 near-stop frame at zoom reversal (pan never 0, min 0.037 px/f). Stills g12/g39 replaced (SP map_stills_s19.py); page 3.6 MB.
- Open: r17/r31 subtitles vs full-frame mosaic boxes; r28 N4 small (narrow column); name tags r19/r20 only 3.8 s apart (MG_SPEC rule 3 wants 8 s); r34 arrow target + DOC band/underline positions approximate; nothing checked on full clips by eye; no final render.
## Session 20 (2026-11-13): v6 render (owner: "Approve, render") — STATUS: QC
- Builder `build/build_v6.py [seg|pic|audio|final|all] [rNN ..]`, runner `build/run_v6.sh` (3 seg workers -> pic -> audio+final), log `build/v6_all.log`. QC `build/qc_v6.py` (= qc_v5 retargeted; `sync`/`words` modes still read v5 VO — do not use). Out `renders/abyssal_intro_case01_v6.mp4`, `build/timeline_v6.json` (has `seam` c/d), `build/audio_v6.json`.
- `build/mg_kit_v6.py` = SP copy, V from env `ABY_V` (set before import).
- Footage: ffmpeg crop (vertical stock -> 16:9 band at 0.30) + json crop, minterpolate when speed<1, cover 1920x1080; logo blur mapped source->output; centred eased push 1.00->1.03 (no shake); face mosaic 48 px; grade x(0.92,0.98,1.02)*0.92+14 + per-shot gamma to luma 70-80 (brighter than v5); vignette 0.28 + FIXED grain σ3; MG per frame from keyword word time -0.1 s; credit + safety PNGs. No VHS, no Texture.
- r03 iceberg: all 25 names sharp, push 1.00->1.06, yellow L-R wipe on "01 COLOMBIA" from "rainbow" to "hills". r10: 18 f black, ice1 plate, 2.5/2.0 px slow sway (0.4/0.31 Hz) + push 1.04, CASE 01 / THE EXTREME SLIDE wipes. Maps r12/r39 copied as-is.
- DOC rows r26/r48: page = first source frame cropped by doc_center (SOURCE fractions, page x .29-.72), no cover scaling; MG from f0. r26 amber band moved to the "se ha solicitado ... revisión técnica, administrativa y legal" lines (band 0.13,0.845,0.88,0.905) — page 1 has no literal "application" line.
- Audio: VO with vo_plan gaps -> -24 LUFS; raw r22/r31/r35 at voice -1 LU (beds ducked 6 dB under raw); beds at voice -13 LU (title build loudest 7.3 s at -6 under r10); roomtone airy drone -30 except under r10; static only on r01; SFX vs voice p90 RMS; r15 = soft hit on D3 (not typewriter); r27 typewriter from 1.5 s offset; hook +2.5 dB r02-r10; master -23 LUFS, limiter loop TP<=-1.05.

### Session 20 — fixes + QC (2026-11-13)
- Fixes: r49 CROP_FIX removes source SUBSCRIBE button. DOC rows use doc_still() (no crop cut). boom_sub_clean_title rel -4 → 0.
- r14 C1: c1_track is now a frame-to-frame template tracker (grey, ±70 px search, 7-frame mean). Circle starts on dome 2 (cx .59, cy .69) and follows the pan. Sheet checked: OK.
- Rebuilt pic + audio + final (v6_fix.log). Render: renders/abyssal_intro_case01_v6.mp4, 212.233 s, 6367 f.
- QC: whole -23.0 LUFS TP -1.4, hook -21.1, body -23.4, diff 2.3 LU PASS. Blend: 48 cuts, none blended; dips r22/r31/r36 min 0.0. Soft hit 7.03 s M max -16.8. Sub boom 36.77 s M max -22.6 (was -23.4; low end, K-weighting hides it — check by ear).
- Grids 53–57 s and 207–212 s: circle on dome, end fade clean, no button.
- Open: r17 sub over mosaic; r28 N4 small + frame-0 chyron leftover; r19/r20 tags 3.8 s apart; r34 arrow approximate; r35 no mosaic (rider from behind); r26 band on "solicitado…revisión"; logo blur from one frame; ear checks L5 "IA" 32.54/43.70 s, L3 "but" 18.94 s; boom level.

## Session 21 (2026-11-13): v7 rendered
- Owner approved storyboard v7. Render local only (no GitHub, no kumai007).
- Builder: `productions/abyssal-01-theme-park-disasters/build/build_v7.py` (imports build_v6, rebinds globals; tables keyed by v6 row n). Work dir `build/v7work/`.
- Output: `renders/abyssal_intro_case01_v7.mp4`, 200.6 s, -23.0 LUFS, true peak -1.4 dBTP.
- r31 C1 circle: hand keyframes (TRACK_KF) because the template tracker locked onto the slide.
- Minor: r37 tail padded 1 f, r45 tail padded 4 f (freeze under crossfade).
- Rule book abyssal.json rev 26: source-span check + hand-track circle rule.
- Next: owner review of v7.

## Session 22 (2026-11-13): v8 rendered (intro rebuilt, audio option A)
- Builder: `build/build_v8.py [seg|pic|audio|final|all] [W ICEA RAIN SWING PEND MONT]` (imports build_v7; intro segs in `build/v8work/seg`, title + rows k>=9 reuse `v7work/seg`). Graphics: `build/cards_v8.py` (glitch_out, iceA zoom + list slide, red-border card montage, morph, iceberg B + COLOMBIA highlight).
- Intro: warning 0-2.5 (glitch out) | riders 2.5-6.9 | iceberg zoom 6.9-9.9 (dip) | rainbow her 109.6 9.9-12.9 (xf 15 f) | swing 12.9-17.5 | pendulum 17.5-20.1 | cards 20.1-29.5 (crowd, gate pro 71.0, cafe pro 96.0, police car 90.45; morph 25.7, iceberg 26.8, highlight 28.36; dip) | title 29.5.
- Audio option A: voice -22.8, music -33.1, SFX -36.9 LUFS (stems after master). Beds equal-power crossfades ~1.8 s, music 0 s to end; raw r22/r31/r35 fade 0.3/0.45 s, +0.25 s past row end; new SFX in `sources/epidemic_v8/sfx`. Report `build/v8work/audio_v8.json`.
- Output: `renders/abyssal_intro_case01_v8.mp4`, 200.6 s, 6018 f, -23.1 LUFS, LRA 5.2, TP -1.3. Intro QC sheet checked by eye: OK.
- Next: owner review of v8 (by ear: title boom, card swishes, raw fades).

## Session 23 (2026-11-13): v9 = slower eased MGs + full map animation
- Owner on v8: "map animation got stuck"; "add a lot more easing in all the motion graphics ... way too fast forward". Saved to abyssal.json rev 30 (rule book b-5bea8820, b-41e52d73 + 2 Learnings).
- Map root cause: b7.map_clip read 60 s with gfx.read_frames, which pads with the last frame (1800 f), so the real ~133 f played in ~0.4 s then froze. Fix: build_v8.map_clip reads only the ffprobe duration and resamples evenly (133->127, 155->139). QC v9: 0 still frames in both map shots (v8 had 98 and 107).
- cards_v8: ease = smootherstep; SL 10->22; iceA punch 12->30 f; hl_nf 10->24. build_v8: MORPH_NF 18->30, XF_NF 15->24.
- build_v8 slows the MG kit: K.fade_layer eased (smootherstep); time scale per variant (SLOW dict: draws/fades x0.35, P4 0.6, typing ~0.6, N1 0.65, Q1 0.9); DOC1 band wipe eased. All v7 rows with an MG or a map (REDO) render into v8work/seg; v8 segs kept in v8work/seg_v8; v8 code backups in v8work/*.bak.py.
- Output: renders/abyssal_intro_case01_v9.mp4, 200.6 s, 6018 f, I -23.1 LUFS, LRA 5.2, TP -1.3. Audio = v8 mix (timing unchanged).
- Next: owner review of v9.

## Session 24 (2026-11-13) — v10 delivered
- Built `build/build_v10.py` (all v9 owner notes, rule book rev 31). Render: `renders/abyssal_intro_case01_v10.mp4`, 200.6 s, 6018 f, I -23.1 LUFS, LRA 3.2, TP -1.4, limiter 0.84. Leakscan: only r39 flagged (kinetic text, not a cut).
- Split tool `tools/cloud-render/cloud_render.py`: `--skip-done`, `--local-jobs 4`, laptop steals cloud parts, laptop fallback for missing parts, auto split (laptop and cloud end together), max 18 machines (owner), cancels the cloud when the laptop did everything.
- Cloud runs 43395711423 / 43397285841 / 43401304982 failed: GitHub API 403 rate limit on the `store` release downloads (runner `run_shard.py`, REST downloader). Laptop rendered all 24 parts (~14 min). Open: cut cloud API calls (one archive asset per run instead of ~30 files per shard) before the next cloud render.
- Next: owner review of v10.

## Session 25 (2026-11-13) — v11
- Cloud: fetch job + artifact (no more API 403). Default = all segments on GitHub (max 18), laptop = backup only.
  Checker-agent fixes: store.py retry prints go to stderr; cloud_render waits max 150 min / 20 failed `gh run view`, then laptop takes over; upload errors are printed.
- Rule book rev 33: v10 notes (more easing, title music at CASE ONE card with 2 s fade-in, card leak scan, all-GitHub) + whole-video look + card spans.
- build/build_v11.py (= v10 plus): car card was inside a source dissolve (90.25-90.40) -> now 90.50-92.88 @0.64; every card has frames for its whole slide-out (no freeze); SL 22->30; push-ins 66 f; title music TB0 = first TITLE frame (29.5 s); whole-video look in assemble (sat 0.85, shadow lift, cool tint, scanlines, 1 px RGB edge, glow, vignette corners ~42 %), skipped on ICEA; `mix` mode = audio only.
- Run: `python -I -X utf8 ../../../tools/cloud-render/cloud_render.py . build_v11 v11work/trace_v11.json` (trace = trace_v10 with seg_dir v11work).
- Whole video: owner chose same AI voice, batches of 5 cases. Cut sheet links are placeholders (28 of 29 find.invalid; only KYV has a real t.me link) -> footage must be searched like case 01.
