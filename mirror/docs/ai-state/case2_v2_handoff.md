# Handoff: Case 2 v2 (2026-11-10). W = V/05_render/work. v1 script backups: W/*_c2_v1.py.bak, sb_c2_v1.json.bak.
## Done
- [x] channel page captured: W/cap_c2.py -> gfx_c2/dl/channel.png (signed out, no consent dialog shown), name box 614,282 334x43.
- [x] build_sb_c2.py: old VO-C2-01 a (12.5 s) -> "VO-C2-01 ch" channel page 4.2 (dip in) + "VO-C2-01 map" LOCATION UNDISCLOSED 4.8 (crossfade, lands on "camping alone in the woods") + "VO-C2-01 a" footage 31.2-34.7 3.5 (cut, stamp). Total 268.14 unchanged.
- [x] edl_c2.py: GFX ch/map, TRIM (rule 6) of david/owen_r1/nathan/owen_r2 + new HL. rulecheck OK, no warnings.
- [x] gfx_c2.py: captions white only (no amber); und_base.png (procedural dark topo) + und_text.png.
- [x] seg_c2.py: render_page channel centred (anchor 1000,420, sc 1.12, yaw -5..5, drift 0); render_undisclosed (slow push, text fade).
## Next
- [x] seg_c2 4 stale re-rendered + asm (8036 frames). mix_c2 v2: I -17.00 TP -2.11, raw+amb fully muted under VO (VO widened 0.25 s), amb only on card, profanity = mute (0 found in asr_c2.json). final_c2 OUT = case2_v2.mp4, rendering (final_c2.log). rulecheck OK no warnings.
- [ ] QC: python W/qc_c2.py V/05_render/case2_v2.mp4 5.5 10 130 239.5 245 263 ; fadescan ; notes case2_v2_notes.md
