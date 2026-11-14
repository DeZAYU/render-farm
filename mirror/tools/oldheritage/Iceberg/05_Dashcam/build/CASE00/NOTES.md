# DC00 — Intro ("20 Most Disturbing Dashcam Moments Ever Caught on Camera")

## 14 Nov: rebuilt on the owner's own channel intro (owner: "for intro just have intro like this one" = Old Heritage Files mwYeratelA0 0-17 s, `_ref/IntroRef/`)
Code `_engine/src/cases/DC00.tsx` + device `_engine/src/dev/OHF_PanelIntro.tsx` (PanelMontage / DiscretionCard / CaseCard, shared with AM00).
Master `out/DC00.mp4` + `out/DC00_phone.mp4`, 19.9 s. Old night-road version kept: `DC00_nightroad.tsx.bak`, `out/DC00_nightroad.mp4` (+ `_phone`).
- VO `vo/raw/INTRO.mp3` whole and continuous from 0.3 s (ends 17.14), no clip sound. Epidemic ambient Music 3 at -19 dB, up ~2.6 dB on the CASE card.
  SFX: soft glitch on the discretion card in/out, title_hit on CASE 01, whoosh into the white flash.
- 0-9.95 montage (centred 4:3 / portrait panels over a blurred, saturated copy; wide shots full frame; VHS dropout dashes + faint scanlines,
  grain; glitch slices on every cut; one white flash into the trees): exc (c01 bucket over the cruiser) · plane (c07, full frame, zoomed 1.12
  from the top so the date stamp is off) · train (c16 hit) · khay (c02 reversing away) · trees (c12 domino forest).
- 9.95-12.25 "Viewer discretion / is highly advised" (Montserrat 600, white on a dark scratched plate, grey -> white) on the VO's own
  "Viewer discretion is advised" line.
- 12.25-17.4 montage under the subscribe line: mud (c15 Montecito, full frame) · mill (c10 Jay, fireball).
- 17.4-19.9 black card: "CASE 01" (D-DIN Condensed Bold 210 px, #F00505, typed CASE -> CASE 01) / "THE EXCAVATOR ARREST / HARDWICK, VERMONT"
  (D-DIN Condensed, typed on), glitch, white flash out (last frames white).
- Clips = the graded windows from `shots/cut.sh` (grade_case.py --house); blur notes kept (no #11 Bentley, no #20 walk-out, no Tulsa interior cam,
  Khayelitsha men far off). Sizes measured on the reference frames (text widths within ~5 %).

## Previous (night-road rig, 13 Nov)

Code `_engine/src/cases/DC00.tsx` + rig `_engine/src/dev/DC00_NightRoad.tsx`; master `out/DC00.mp4` + `out/DC00_phone.mp4`. 21.3 s.
- No raw, no clip sound. VO `vo/raw/INTRO.mp3` whole and continuous from 0.5 s (ends 17.34). Epidemic ambient "Music 3" −19 dB under it,
  swells into the title. SFX: one low boom on the Jay fireball (picture only), whoosh + title hit on the blur-dip.
- Motion (own rig, not TOR00/ND00/TP00): the camera is a car driving a winding night highway; each VO beat eases up to an overhead sign
  gantry whose screen plays the hero case (~70 % of frame, ~1 s hold, RedLabel place · year), then drives on under it round the next
  bend. The other cases play on roadside billboards. Monotone Hermite path (no overshoot), DOF, falloff, CameraMotionBlur 4, grain.
- Heroes in VO order: Hardwick excavator (c01) / Clearwater plane (c07) / Brook Park train (c16) / Khayelitsha (c02, reversing away,
  men not close) / Domino forest (c12) / Montecito mudslide (c15) on "Viewer discretion" / Calais (c03) / Jay mill blast (c10, long push
  under the subscribe line). Billboards: c04 c06 (front cam only, LiveLeak bar cropped) c08 (top crop, no name stamp) c09 (road panel
  only, no faces) c13 c14 c17 c18 c19 c20 (ditch, before the walk-out) c05.
- Title: blur-dip at 17.5 s into the video title in the brand TitleCard look (darkened, slowly pushed c05 Bukit Tunku night road,
  "20 MOST DISTURBING / DASHCAM MOMENTS / EVER CAUGHT ON CAMERA" in Elite with the soft glow), fades out at the end.
- Windows: `shots/cut.sh` (media → graded with grade_case.py --house). c16 starts 32.4 (source cut at 32.06).
- Blur notes respected: no #11 (Bentley) clip, no #20 walk-out, no Tulsa interior cam, no cash-van cab cam.
- Checks: cutcheck 0 FLASH/JUMP after the fix; its 13 STUB flags are the continuous 3-D drive (the tool reads moving gantries as cuts),
  not edits. The render dropped one frame of the trees screen to black (f282, a decode miss under machine load): that frame was
  re-rendered as a still and spliced into DC00_raw, then re-mastered.
