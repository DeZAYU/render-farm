# TP17 — Four hundred steps down The Big One (Blackpool Pleasure Beach, 23 Apr 2023)
Code: `_engine/src/cases/TP17.tsx` (DUR ≈ 139.1 s). Music: Epidemic Music 4 (−23 dB ≈ 10 LU under the −25 LUFS take), dipped under every raw,
second pass from 46 s picks up inside raw 4 (the file is 120 s). SFX real only: metal clanks (train stop on the diagram, chain stop,
pawl catch, 11 Apr stop), one wind gust ("sudden high winds"), glitches on the two designed glitch transitions. No whooshes.

## Devices
- **HillStops** `dev/TP17_HillStops.tsx` (ONE evolving pass, under "April 2021 … three walk-downs … same hill", 9 s; owner rule
  3 Nov: each device once): the lift hill to scale (214 ft rise, ~30°, crest + first drop) with the stair line beside it draws on; the
  stops drop in date order (APRIL 2021 near the top, APRIL 11, 2023 just short of the crest, then a train glides up and stops a little
  over halfway: APRIL 23, 2023); on "three walk-downs" white dots step down the stairs from all three; the hill line glows on "same hill".
  Earlier passes (23 Apr stop + 214 FT bracket, 11 Apr stop) were replaced by footage. Lift angle and the 2021 position are approximate.
- **ChainDog** `dev/TP17_ChainDog.tsx`: the real lift chain in its trough (lift clip, white frame) + a white-line section of a car on the
  incline: chain dog on the moving chain, chain stops, the car eases back and the anti-rollback pawl drops into a rack tooth (turns red).
  Labels LIFT CHAIN / ANTI-ROLLBACK with leader lines. (No Blender shot was needed.)
- RedLabels: BLACKPOOL PLEASURE BEACH, APRIL 23, 2023.

## Raws — re-cut 2 Nov after owner rule ("raw is too less in between… they don't wanna watch just 3 seconds")
Six short inserts (2.9–5 s) became three long ones at cut-sheet cues 1, 3 and 6; the VO pauses for each.
- R1 (cue 1) 7.5 s: 805.5–813 the camera finds the halted train high on the lift and holds on the riders (cue 2:48 itself is one long
  whip-pan the cut checker reads as dozens of cuts; 13:25 is the same train, calm).
- R2 MAIN (cue 3, after "and then they all walked") 18.5 s: 378.6–385.4 people walking down the walkway beside the track (close) ->
  blur-dip -> 756.3–768.0 the whole lift reframed, the line of people coming down.
- R3 (cue 6, after "staring at my shoes") 8.2 s: 304.0–312.2 the lift high up, people on the walkway (reframed ×1.4).
Cues 2, 4, 5 dropped as inserts (their content is inside R2/R3). All windows are calm stretches of the handheld source
(fast pans over the lattice trip cutcheck as STUB "cuts"; the first render had 261 such flags).
Sound: `media/main_clean.wav` = the whole clip through
`rawclean.py` (music detected and stripped at 1–169 s = channel intro, 344–347, 403–409, 450–454, 562–572, 678–683, 802–855 = end montage
music). The filmer talks through most of it (AST: "Speech"); not transcribed (no whisper model installed) — worth a listen for language.
No injuries/bodies/nudity in any window: no blur needed. No watermarks in the windows used.

## Sources
- main [BO]: kyle the ringer, https://www.youtube.com/watch?v=ZewEn77w8FI (used 4:56–13:40; the channel intro before 2:45.5 and the outro
  never used; 13:28–13:40 is in his end montage (music stripped by rawclean for R1, the rest muted under VO).
  `media/main.mp4` = 11 source windows concatenated (one grade/LUT for the source); `m()` in the code maps source s -> file s.
- downloaded: Jonathan Timperon "Long Chain Journeys: Pepsi Max Big One Lift Hill" (70 subs) https://www.youtube.com/watch?v=DH2K9wHS038
  -> `footage/11_.../more/lift_DH2K9wHS038.mp4` (2019; the train, chain, stairs and the hill from its base; its 0–3 s sign avoided).
- skipped: Drone Footage Videos (13.9k, a different stoppage on 10 Jun 2023), A Walk on the Wild Side (86k), CoasterForce/Coaster Studios
  (big coaster channels).

## Unsolved / notes
- Source footage is handheld and pans a lot; several main windows start on the train and drift to structure (cuts chosen between srccuts hits).
- Stills had to be rendered with `--timeout=240000` (machine load ~80); render_case.sh used as-is for the master.

## Audit 3 Nov (owner rule on TP19)
VO splits only at sentence ends, stretches between raws 25 s / 25 s / 32 s / 15 s; ends on the last VO line + 1 s hold; no device repeats;
longest run of the same wide angle = 3 shots. Extra calm wide window 598–608 s graded with the same LUT (`graded/mainx.mp4`).

## Re-cut 3 Nov (tail stretch 1:48–2:18 read samey)
New source: anwarthinks "THE BIG ONE STUCK BLACKPOOL PLEASURE BEACH" (3.1k subs, uploaded 26 Apr 2021) https://www.youtube.com/watch?v=pdCa9ek8zjQ
-> `footage/11_.../more/apr2021_pdCa9ek8zjQ.mp4`. It is the APRIL 2021 walk-down, filmed by a rider (TikTok repost inside his video; the
TikTok logo/text at 36–40 s avoided; his talking-head intro unused). Used only under the general lines, never as 23 Apr footage:
"open steel steps" = a rider's feet on the perforated steps (src 51.4–52.4, 1/3 speed, motion-interpolated: `graded/slow_a.mp4`),
"a very long view of Blackpool" = pier, Tower and sea from the lift (src 69.9–71.1, 0.5×: `slow_c.mp4`), "pick this one" = the view down
the lift hill from the top (src 79.55–81.5, 0.5×: `slow_d.mp4`). The handheld phone footage is too shaky at real speed for cutcheck;
slowed with minterpolate it is smooth. g1 now pulls back instead of pushing in. The stretch is now: feet / Blackpool view / walkway close /
R3 wide / wide pull-back / walkway close / view down the lift / stairs (lift clip) / wide hold.
Skipped: Mr RabX 0qVS4DWqWN8 (11 Apr 2023 footage, but a story-agency repost: "rabeistories" contact, same story ran in Daily Record).
