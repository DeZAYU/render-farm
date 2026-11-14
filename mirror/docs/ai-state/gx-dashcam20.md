# Handoff: "20 Most Disturbing Dashcam Moments" — channel GX-ADmixDD (NEW, pilot)

## Owner brief (2026-11-14)
- Deliver INTRO + CASE 1 preview only, then wait for OK. Ask questions when needed (owner invited it).
- Voice: Algrow "new" = `default-pd4i7bs8z6-qjsqmqbjlxg__new-9fcmr`, model 2.0, expressiveness (temperature) 2, speed 1.
- Refs (style only, never footage): Abyssal Detective 2 icebergs 2HsgVPz1fE8, MzrGqZUkXQc, QV693c_Qsj8; Disturbing Dose 1MRO0jCGvl0 (Texas Tower), l6mSfWFmcOo (20 Dashcam Vol 2). Mix: EQUAL.
- Look rule (owner chose): copy GRAMMAR only (pacing, raws, device kinds, motion, sound feel). NEW fonts, colours, title + case-number system (master SOP §2.4: 404 CoC is DD-based, algrow-2 is the Abyssal iceberg look).
- Channel name GX-ADmixDD; save as 4th style: `styleguide/gx-admixdd/`. Render 1080p30.
- Rules order: master SOP v2.0 (`docs/workflow/CAUGHT_ON_CAMERA_MASTER_SOP.md`) > `docs/workflow/SOP.md` > K > GENERIC_RULES.

## Paths
- V = `productions/gx-dashcam20/` (inputs/VO.md, inputs/CUTSHEET.md, vo_lines.csv, vo/raw/*.wav+words.json, sources/, research/CASE_PLAN.md, qa/, build/)
- Channel = `styleguide/gx-admixdd/` (refs/<name>/src.mp4, refs/ANALYST_BRIEF.md, engine/ = Remotion 4.0.532 installed)

## Status
- DONE: questions; SOP read; CASE_PLAN.md; VO takes i00 (39.9 s) + c01_01..08 (total ~370 s) made and word-checked OK; engine npm install OK.
- RUNNING: background download chain: sources GC.mp4, OTF.mp4, then refs dd_dashcam_v2, dd_texas_tower, ad_dashcam_iceberg, ad_incidents_iceberg, ad_cctv_iceberg.
- NEXT: download intro sources TKR WoLMrLw8teg, SPX dHm_5SLhnQ0, OTC uQS65DOJgcw (+ licence scan info.json); 3 then 2 reference-analyst agents (sonnet) with ANALYST_BRIEF.md; CHANNEL_PROFILE.md + DEVICE_BANK.md + qa/VARIETY_SHEET.md; build intro + case 1 in engine; music from Epidemic (candidates: Silent Witness 8b594c10…, Code of Violence 8b36c332…, Cloak b177ade2…, Turning Stones be75463d…; avoid Lennon Hutton = used elsewhere); QA §12; send preview ≤30 MB.
- 3 analyst agents running (dd_dashcam_v2, dd_texas_tower, ad_incidents_iceberg); detached download `build/dl2.sh` (log build/dl2.log) gets TKR, SPX, OTC, ad_dashcam_iceberg, ad_cctv_iceberg. Then 2 more analysts.
- GC.mp4 = 1280x720 25 fps (normalize to 30 via framerate). Split screen: road lens LEFT half, cabin lens RIGHT half; police caption band at bottom (~y 600-720 of 720) → crop it. Timeline in THIS file (differs from cut sheet): 0-5.7 title card (skip); 5.7-116.3 dashcam drive; 116.3 crash into house (cut before 117); 116.3-132 another car's cam (street, "after taking another car"); 132-157.4 parked-car cam bungalow street, police arrive ~2:25, ram ~2:30-2:36; 157.4-172.5 interior car cam stamped 2019/04/19 9:35 (= R6); 172.5+ bodycam/handheld + taser: NEVER use. Source cuts: 5.72, 116.28, 131.96, 157.36, 164.04, 172.48.
- Licence: GC Laddarchie repost of Notts Police release (AMBER, no agency hits); OTF filmer's own upload (GREEN, has "for licensing contact" line = filmer, not agency).
- All downloads DONE (sources GC, OTF, TKR, SPX, OTC; 5 refs). Analysts: ad_incidents_iceberg DONE (refs/ad_incidents_iceberg/STYLE.md, DEVICE_BANK_part.md, gate/); ad_dashcam_iceberg started; dd_dashcam_v2 + dd_texas_tower running; ad_cctv_iceberg still to launch (max 3 at once). GC transcription → research/GC_transcript.txt (running).
- Owner-facing flags for report: cut-sheet intro cold-open raw dropped (SOP bans raw in intro); case 1 has 6 raw cues (R6 silent picture).
