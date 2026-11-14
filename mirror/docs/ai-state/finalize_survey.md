# Finalize survey (2026-11-14, read-only). Sizes GiB (du). C: 476G, 422G used, 54G free.

## van-camping-encounters (Farrell) 24G
- Full: 05_render/VAN_CAMPING_ENCOUNTERS_full.mp4 9.44 GB, 4624.53 s (77.1 min), 1920x1080 h264+aac, Nov 11 15:36. HARD-LINKED (link count 2) to ~/Downloads/VAN_CAMPING_ENCOUNTERS_full.mp4 -> deleting one frees nothing.
- State (van_full_plan.md, last status "VAN FULL BUILT" 2026-11-11): all 12 sections QC PASS, I -16.99 TP -1.25. Not marked approved/delivered. Open owner-check list (c4 date/bridge/logo, c5 freeze bridge, c6 recreated card, c7 reply card, c8 2018v2017, c9 comment, c10, c11 map pin, c3 RAW-C3-04 opener uncaptioned, graphics ~0.6 s behind EDL).
- Missing: .srt (captions burned in only), phone preview <=30 MB, chapters/credits text.
- Space: 05_render 18.2G = full 8.8 + sections 9.4 (case1_v3..case12_v3, incl. unused case7_v2_try1 0.66 GB) = JUNK 9.4. sources 4.6 KEEP; narration 0.4 KEEP; audio 0.2 KEEP. Work dir (05_render/work) already gone, so no re-render of one section possible without rebuilding scripts (scripts live only in the winter work dir, also gone).

## winter-camping-encounters (Farrell; case1 also Nocturn restyle) 19G
- Full: 05_render/WINTER_CAMPING_ENCOUNTERS_full.mp4 6.22 GB, 3037.49 s (50.6 min), Nov 11 10:29, hard-linked to ~/Downloads copy. Handoff "WINTER DONE", QC I -16.98 TP -1.56. Not marked approved.
- Side track: Nocturn restyle of Case 1 only: case1_n3.mp4 (536.74 s, 1.12 GB, Nov 12 07:15), "waiting owner review"; n1_v1/n2 older. Cases 2-7 not restyled. Open: C1-08 no red circle, series title card removed pending owner OK.
- Missing: .srt, phone preview, chapters/credits.
- Space: 05_render 13.4G = full 5.8 + sections case1_v5,c2_v4,c3_v4,c4_v4,c5_v3,c6_v4,c7_v3 (5.8) + n1_v1 0.37 + n2 0.37 = JUNK ~6.5; case1_n3 1.04 conditional (junk if restyle dropped/decided). qc jpg folders tiny. sources 4.6 KEEP, audio 0.3 KEEP, narration 0.3 KEEP. work dir already gone.

## renders/ (CAMPING-8 3-6 min Farrell sample) 2.8G
- 6 files, each 180.01 s. v6 (543 MB, Nov 10 06:52) latest, last handoff note: awaiting owner review; not final. v1-v5 = 2.37 GB JUNK (2.2 GiB). KEEP v6. Tanuki photo CC BY-SA credit needed in description.

## tools/oldheritage/Iceberg 6.5G (Old Heritage Files)
- 01-04 (Natural Disasters, Theme Park, Tornado, Workplace): delivered Nov 3-4; media (203 GB) already trashed; only notes/scripts remain (<1 MB each). Finals were ~/Downloads/*_FULL.mp4: none there now.
- 05 Dashcam (DC_FULL 41:41->40:21), 07 Incidents (IN_FULL 45:48->43:55), 09 Amusement (AM_FULL 34:00): "DELIVERED" Nov 14, finals to "OldHeritage_Finals" (path not found inside allowed scope; not in ~/Downloads). No mp4 in the tree (build/ footage/ empty dirs, timestamps Nov 14 15:00 = already cleaned). Open: IN20 climber description/note, AM18 on 'milked' list, AM00 end card says LEVEL 1.
- 06 BD, 08 ZO, 10 FF: not built (footage/vo/script only, 40 MB each).
- Space: _tools/.audvenv 5.1G (python venv, REGENERABLE), _engine/node_modules 0.64G (REGENERABLE), _engine/public 0.53G KEEP, _tools/.venv 85M regenerable, rest KEEP. No junk renders left.

## Abyssal
- No abyssal video project exists. Only productions/_abyssal-ref (3.3G reference: src 2.3 + src2 0.78 re-downloadable mp4s, deconstruct 0.16) and styleguide/abyssal. Memory note refers to a theme-park intro+case1 Abyssal test (Old Heritage 02_Theme_Park; no render present). No "abyssal-01" string anywhere.

## cloud-render
- tools/cloud-render 15M (farm mirror/runner). No farm_out folder, no render outputs.

## Other large
productions/farrell-01-internet-archive/01_reference 3.3G (refs, incl audio/ 374 MB deletable per its STATE.md), _nocturn-ref/src 1.8G, farrell-03 0.4G. docs 6.7M, styleguide 70M.

## Top folders (GiB)
van 05_render 18.2 | winter 05_render 13.4 | Iceberg 6.4 (5.1 venv) | winter sources 4.6 | van sources 4.6 | farrell-01 ref 3.3 | abyssal src 2.3 | renders 2.8 | nocturn-ref src 1.8 | abyssal src2 0.8 | van narration 0.4 | farrell-03 ref 0.4 | winter audio 0.3 | winter narration 0.3 | van audio 0.2

## Totals
Definite JUNK after finals: van 9.4 + winter 6.5 + renders 2.2 = ~18.1 GiB (+1.0 case1_n3 conditional). Regenerable: Iceberg venv+node_modules ~5.8. Optional re-downloadable refs ~4.9 (+0.37 farrell-01 audio).

## Text deliverables (2026-11-14, 06_deliver/)
- Written for both videos: <NAME>.srt (van 1088 cues, winter 807), chapters.txt (van 13 lines, winter 8), credits.txt (van 12 sources, winter 7, no agency found; Owen's 2 winter sources are CC-BY).
- SRT method: Whisper small.en (openai-whisper, GPU) on the final mp4 audio, segment timestamps (no word-level; machine was CPU-contended, word-level was ~2x realtime), text split into <=2x42-char cues by char-proportional timing, starts snapped forward to voice energy onset. Sync vs word-level whisper at 5 spots: winter +0.02/-0.18/-0.20/-0.80/-2.3 s (srt minus word onset; first/last = tiny cues, suspect match), van -0.18/+0.06/-5.1(match error?)/n/a/n/a. Expect captions ~0.2 s early typically, up to ~0.8 s. No burned-in text removed; SRT duplicates burned captions on raw clips, so upload as optional CC track.
- Chapters: time = first narration line of each case minus ~3.3 s (card); cues.md section offsets are stale for van case 5/10/11. Van case 5 uses raw-teaser-first start per speech.
- Winter EXPLORINGW (Exploring with Bear, PSVSIETMyAI) has no info.json: title/channel URL from cut sheet only. Music artists not recorded anywhere (titles only).
