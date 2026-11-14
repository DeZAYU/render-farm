# WP14 — The man on the boom (Kingston, Ontario, 17 Dec 2013)
Code: _engine/src/cases/WP14.tsx. Length 122.5 s (VO 102.4 s). Music: Epidemic Music 3 at -19 dB (offset 20 s), ducked under the raw.
## Raw (one, per WP_PLAN: VO > 70 s)
- Main 15.0 s: CD (Carly D'Amico, https://www.youtube.com/watch?v=5iQsTDiHcFA) src 17.5-32.5: the CFB Trenton helicopter over the
  jib's tip, the rescuer lowered on the line to the operator. Placed after "...eighty kilometres west along the lake."
- Raw audio: rawclean.py (no music detected, original kept).
## Devices
Blender crane (maps/crane3d.py: cab above the burning frame, the operator crawls out to the tip), BoomPath (dev/WP14_BoomPath.tsx:
the real frame where the operator is a speck on the jib, his path traced, push in).
## Sources
- Footage (all small personal uploaders): RY ryant67 https://youtu.be/zFxCH4PsZq4, KS Steve Kneilands
  https://www.youtube.com/watch?v=NOUZOgTAYg0, LT Lee Taylor https://youtu.be/HHb8AQlFhdg, LT2 Lee Taylor https://youtu.be/ncwnvzj-Jq8,
  CD Carly D'Amico https://www.youtube.com/watch?v=5iQsTDiHcFA. KS and CD are 568x320 (upscaled; soft).
- Date: Tuesday 17 December 2013 (the VO's "Tuesday afternoon"); names from the cut sheet.
## Open
- No Blue-Marble/NAIP map (Canada): the Blender shot is the crane mechanism instead.
- The Blender crane shot is simple CG (blob flames, sphere smoke); only its first 200 frames (6.7 s) are used, then BoomPath carries
  "crawled out along the boom ... waiting" on the real frame. A better-lit re-render would help if the owner flags it.
- Cutcheck: 0 flags (final render 4 Nov). Master -16.8 LUFS. Out: build/CASE14/out/WP14.mp4 + WP14_phone.mp4.
