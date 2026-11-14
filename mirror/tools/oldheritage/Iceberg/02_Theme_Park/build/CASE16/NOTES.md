# TP16 — The Starflyer breaks down (South Bank, London, Sun 31 Jul 2016)
Code: `_engine/src/cases/TP16.tsx` (DUR 141.4 s; v1 six raws: C:/Users/ayush/Videos/CLAUDE/STYLE guide/tools/oldheritage/scratch/TP16_v1.tsx). Music: Music 5 (file −20.9 LUFS → −14.5 dB ≈ 10 LU under the −25 LUFS take),
dipped under the raws; the file is 126 s, so a second pass (from 20 s) cross-fades in at 119.5–123 s.
VO: one take, no count word in it; split only at the three raws (parts A, BC, DEF, G; table at the top of the code).

## Devices (all new, none used by TP13–TP25)
- **CapsuleTurn** `dev/TP16_CapsuleTurn.tsx`: the stopped ring from above, 2.5-D, white line over the darkened clip. Ten capsules round
  the star crown, the aerial-platform basket fixed at the front. `gap`: the basket faces an empty slot (red dashed) — "wouldn't line up".
  `turn`: the brake off, the ring nudged round in hand-pulls until a capsule sits at the basket. `cycle`: each capsule held, riders
  (white dots, 19 in all) cross into the basket, basket goes down, next capsule pulled round; red tally 0 → 10 lands on "ten times".
  The split of riders per capsule (2 each, one with 1) is schematic — not known.
- **SeatPair** `dev/TP16_SeatPair.tsx`: Aachen's open chain-swing seat (TP15's graded clip, copied to graded/aachen.mp4) beside a
  closed Starflyer cage (2012 on-ride POV); cage outline drawn on "closed capsules", the open seat steps back on "the capsule wins",
  evens out on "not by much".
- **SkySlices** `dev/TP16_SkySlices.tsx`: last line; the frame cut into 7 vertical slices of the rescue clip in time order (day → dusk →
  night), white rail BEFORE 6 PM → 9:45 PM fills red, "NEARLY FOUR HOURS". Chosen instead of a clock face (TP03/TP07/TP10 use dials).
- Brand: TitleCard, RedLabel (date, place, LFB, Clive Robinson, the London Eye). No Aerial/Inset (TP15 used both).

## Raws (v3, 3 Nov: owner rules on TP17 + TP19; sound = rawclean.py output, never the clip's track)
Three raws, at cut-sheet cues 1, 3, 6 only — each at a paragraph end; cues 2, 4, 5 dropped so no VO stretch between raws is a lone line
(v2 left "It was daylight when this started. That didn't last." alone between two raws: fixed by dropping cue 4).
R1 main 8–16 (8 s) · **R3 = main incident raw** 220.5–235.5 (15 s, VO paused) · R6 621–629.5 (8.5 s).
VO stretches between raws: A 24 s · BC 34 s · DEF 22 s · G 24 s. Each device appears once: CapsuleTurn is now a single pass (the
ten-capsule cycle, under "Each capsule was turned by hand … ten times, with a crowd watching from the river"); its earlier gap/turn
passes were replaced by footage (ground-angle ladder truck main 258, basket at the capsules main 585). Angle runs broken with the
ground-level shots and the 2016 running clip (sures 42 for "swinging capsule", sures 60 for "no one was hurt"). DUR 141.4 s; the case
ends on the last VO line (SkySlices) + ~1.1 s hold. v2 kept at C:/Users/ayush/Videos/CLAUDE/STYLE guide/tools/oldheritage/scratch/TP16_v2.tsx.
`media/main_clean.wav` = `rawclean.py` on the whole clip (music detected in 49 s; windows avoid those dips: 142–145, 216–219, 236–239, 618–620, 634–637).

## Sources
- main [SF]: Evangelina Tobinski, "The London Southbank Rescue!" https://www.youtube.com/watch?v=8Jmo9dZeSDA (568×320, one take,
  no source cuts; upscaled to 1280×720 lanczos + light unsharp before the grade).
- Downloaded (small personal channels, `footage/19_London.../more/`):
  - Suresh (9 subs), "Star Flyer ride London, South Bank near London Eye", 7 Aug 2016 https://www.youtube.com/watch?v=wZStrTrnl1Q
    (the same Starflyer running, daytime; used 4–7.9 s and 28–30.5 s; 60 fps → 30).
  - TheBaebunsen (1 sub), "Star Flyer - London Southbank", 2012 https://www.youtube.com/watch?v=aqVTuoPLV78 (on-ride POV; media/pov =
    source 20–46 s; used file 6–9.4 and 11–20.2; source cuts at file 3.93 / 20.6 avoided; frames with the filmer's face avoided).
  - ilesmarktransport vndHr1iCrIU (2011, a different ride, added title cards/music) — downloaded, NOT used.
- No watermarks/burned text found in the used windows. No injuries/bodies: nothing blurred.

## Unsolved / notes
- The main clip is low-res (320p) and covers only ~13 min of the ~4 h; night shots (fire engines 720–745 s) are the clip's end.
- "since 2012" is shown with the 2012 on-ride POV; "tall tower that swings them round" uses the 7 Aug 2016 running clip (a week later).
- The main clip has a one-frame exposure flash at source 734.56 s (cutcheck FLASH on render 1); the "relieved / very calm" shot was
  moved to 735.3–739.9 s. v1 master measured −17.1 LUFS after the script's one-pass loudnorm; the re-cut master is re-normalised from TP16_raw.mp4 with a
  two-pass linear loudnorm (I −16, TP −1.5) and the phone copy remade from it: master −16.2 LUFS, peak −1.3 dBFS; phone −16.3.
- v3 render (3 Nov): 141.5 s, cutcheck 0 flags outside the allowed transition windows; 1 fps contact sheet checked (no angle run ≥ 5).
