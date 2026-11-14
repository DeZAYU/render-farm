# Abyssal 01 restart (master prompt, strict mode) — handoff

Date: 2026-11-14. Production V = `productions/abyssal-01-theme-park-disasters/`. K wins on clashes.

## Status
- Phase 2 DONE: `productions/_abyssal-ref/REF_BIBLE.md` (bible, rule table, device library D1-D22). Owner approved ("Yes, go on").
- Phase 3 DONE: `V/work/vo/full.json` (86 lines, 7,434 words, all timed; small.en, 5 lines re-timed with large-v3 via `--redo`) + `V/work/cases.json` (intro + 21 cases, VO s, raw slots). Script: `V/work/build_vo_map.py`. VO total 2,486.8 s. No voice words are lost.
- Phase 4 STARTED: `V/work/LICENCE_SCAN.md` (`work/licence_scan.py`). 136 clips: 1 Storyful hit (EUR_news/nssF43DbBfc, moved to `sources/_AVOID_licensed/EUR_news/`, never used before). 3 Korean news clips have licence wording (SBS, KBS: check). 23 files have no metadata (12 Pexels = stock: do not use; 3 article pages; ICEBERG = banned look).
- Phase 4 DONE (except scene-cut lines): `research/cNN_SOURCES.md` + `footage/cNN/CLIPS.md` for all 21 cases (`work/phase4.py`, coords in `research/_geo.json`; C18 coords TO FIND). `STATUS.md` = gaps per case (15 fully covered, 6 need designed beats). Every case has >= 2 legal clips. Scene-cut scan `work/scan_cuts.py` -> `footage/_cuts/` runs in background (log `footage/scan_cuts.log`); when done, rerun `python -I -X utf8 work/phase4.py` to put the cuts into CLIPS.md. Eye checks (text, children, swearing, logos) happen at Section 9 Step 1 of each case.
- Phases 5-6 next: per case `research/cNN_SOURCES.md`, licence scan, `footage/cNN/CLIPS.md`; paper storyboard; build INTRO + CASE 1 only, Section 14 gate, Section 15 report, wait.

## Decisions (owner approved)
- Reuse VO, cut sheet, sources, ref measurements. Footage/designed 45/55. Case median shot 4-5 s, intro faster.
- Glitch >= 6 frames per state. Hook >= 4 cuts in 10 s, VO from frame 0, no hurt person, max 1 graphic.
- Text max 1 per 20-30 s. Master -16 LUFS, <= -1 dBTP. Music 8/9/10 only. No Epidemic.
- Fonts Special Elite + Syncopate only (copied to `V/build/fonts/`). Archivo etc. banned: redraw all cards.
- Not used: iceberg, level cards, PRESENTS, host, Patreon, posterise, stock, warning-wall opener.
- Renders: cloud farm (folder rule) wins over the Mac 4-process rule. Ask before 4K / publish / upload.

## Facts
- Final VO = 86 lines (21 cases; cases 03, 15, 20, 21 dropped: vo_010-013, 058-061, 078-085 unused).
  vo_001-005 clean: `narration/clean/`; vo_006+ clean: `full/work_rest/vo_clean/` (cut + deleaked).
- Old full video timeline: `full/timeline.json` (fps 30, 2896.3 s). Old renders are reference only.
- Agency ban list + quarantine `sources/_AVOID_licensed/`. Downloads one at a time, 20-45 s gaps.
