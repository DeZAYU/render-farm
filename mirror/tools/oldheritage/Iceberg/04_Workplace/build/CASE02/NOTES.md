# WP02 — The jib came down (UTS tower crane fire, Broadway, Sydney, Nov 2012)
- Footage (all OK in SOURCES.csv): main https://www.youtube.com/watch?v=UeTmxKO-3dc (stuartcryan, window view; NO SOUND), extra1
  https://youtu.be/JrBm-CHoTkY (long lens, silent), extra2 https://youtu.be/Dji6ySZJ4UE (office window, 640x480 26 fps -> 30, cut at 106.6),
  extra3 https://youtu.be/a2CtDH-47xE (Boban Bajkanovic, portrait 272x480 down on the site + Broadway, sound; cuts 164/168),
  extra4 https://youtu.be/AhNXVojVpC0 (silent window view). No downloads. Graded --house.
- VO: CASE02.mp3 from 0 (no count word), split once at 52.25 (after "...through the heat.").
- Raw: ONE (VO 80 s > 70 s), BO src 115.5-131.0 (15.5 s): jib up -> folds onto the site (~124.7) -> onlookers. The cut sheet's drop raw was on
  the UTS clip, which has no audio track, so the side angle with real sound is the raw and the UTS angle is the slow replay (FoldEcho).
  Audio = rawclean.py (no music found), -6 dB. Other cut-sheet raws are silent shots under the VO (explanation beats).
- Devices (new, registered): LuffTrace, FoldEcho (stabilised on the tracked cab), SiteLight. No Inset, no page template.
- Music: Music 5 from 18 s at -13 dB, ducked under the raw. Length 100.8 s.

## v3 (4 Nov, every case gets a Blender shot) — length unchanged (100.8 s)
- LuffTrace (51.11-56.25, "The jib was held at its angle by a luffing cable ... through the heat") replaced by Blender `luff`
  (maps/luff3d.py): the luffing crane's top over the city on a grey morning, the cab burning under a black column; the rope pair
  from the winch over the A-frame to the jib head lights up on "luffing cable" (LUFFING CABLE label), then the section rising
  through the cab fire glows hot on "through the heat" and starts to sag. blurDip in and out.
- Cutcheck 0 flags with the designed blurDip windows allowed (the one JUMP was the existing 90.34 blurDip).
