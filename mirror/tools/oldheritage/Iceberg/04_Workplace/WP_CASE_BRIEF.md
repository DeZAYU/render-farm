# Brief for every Workplace case builder (owner APPROVED WP01 v2 on 4 Nov: "it looks good tbh")
Read first, briefly: C:/Users/ayush/Videos/CLAUDE/STYLE guide/tools/oldheritage/Iceberg/_kit/CASE_BUILD_GUIDE.md (binding, esp. the OWNER RULE sections at the end),
04_Workplace/WP_PLAN.md (length budget: case ≈ its VO + 19 s; one main raw 10–16 s at the incident), _kit/RULES/owner_memory/*.md
(esp. feedback-iceberg-niche-devices.md), C:/Users/ayush/Videos/CLAUDE/STYLE guide/tools/oldheritage/Iceberg/CLAUDE.md. Look at the approved WP01 code
(_engine/src/cases/WP01.tsx) for the look: footage big all the way, devices that work ON the footage (LegPunch freeze+punch-in,
LoadTrace lines on the frozen frame, ClaimReplay), no time bars/gauges/dashboards, no repeated layout.
- Blender (owner: "blender everything we talked earlier"): AT LEAST ONE and up to 3 Blender shots per case (required; report them) where they add something footage can't
  (the place, the mechanism, the aftermath) — see how earlier cases used _tools/blender_map.py / render_maps.sh and build/CASEnn/maps.
  Smooth, lit, eased camera; no floating/janky moves.
- Setup `_tools/newcase.sh WP NN`; script `04_Workplace/script/04 - Workplace Iceberg cut sheet.md` (## CASE NN); VO
  `vo/raw/CASENN.mp3` + .srt; footage via `footage/INDEX.csv` (folder numbers ≠ script numbers; match by title), only clips marked OK
  in `footage/SOURCES.csv` (+ the decision at the end of SOURCES_REPLACE.md). rawclean every raw's audio. Blur injuries/bodies.
- LEVEL CALLS: if your case's VO starts with a level call ("Level two. …" — cases 07, 13, 18, 25), start the VO AFTER it; the level
  pieces are built separately.
- New devices: built for this case, registered in `_engine/src/dev/REGISTRY.md`, never reused from another case/video.
- Render with `_tools/render_case.sh WPNN` via run_in_background and wait for the notification (never sleep-poll). Check the cutcheck
  and one contact sheet yourself; fix before finishing. Don't touch other cases/videos, brand.tsx, or WP01.
- Return ≤ 120 words per case: length, raw lengths, devices, Blender shots, output path, anything unresolved.
- RAM (owner 4 Nov, angry: "leave enough RAM so my Mac doesn't lag"): run Blender ONLY via `_tools/blender_run.sh <args>` (one
  Blender at a time machine-wide, 4 threads); never call Blender directly, never run two renders/stills batches at once yourself;
  stills one at a time. render_case.sh now uses one shared slot.
