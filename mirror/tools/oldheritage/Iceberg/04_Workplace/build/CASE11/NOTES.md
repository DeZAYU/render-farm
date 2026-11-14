# WP11 · Nineteen in the Cloud · Chevron Richmond, California (6 Aug 2012)
Code: _engine/src/cases/WP11.tsx · out: build/CASE11/out/WP11.mp4 (+ _phone)

## Edit
Title 0-4 | VO part 1 (take 0-17.35) | RAW 21.35-36.85 (CSB wide camera src 172.0-187.5: the cloud billowing -> first black smoke
~src 181.6 -> the column grows) | VO part 2 (take 17.4-end) | ends 103.4 (VO 82.9 + 20.5). One raw only (VO > 70 s, WP_PLAN).
Silent CCTV -> real SFX: wind_gust_1 (venting roar) -> boom_5 + sub_drop_2 at ignition -> fire_big_cc0 bed.
Music: Epidemic Music 3 at -20 dB from 40 s, out under the raw.

## Devices
- SameCamWipe (dev/WP11_SameCamWipe.tsx): the CSB camera's quiet frame wiped by a white seam to the same view swallowed by the cloud.
- TwinFires (dev/WP11_TwinFires.tsx): Woods Cross 2009 and Richmond 2012 refinery cameras side by side, full height, place · year labels.
- Blender pipe (maps/pipe.mp4, maps/pipe3d.py): intact outside, then a cutaway where the inner wall thins evenly along the length under
  black sulfide scale, the cut faces heating red.

## Sources
- CSB surveillance https://www.youtube.com/watch?v=hewMRcrOI0s (public domain; cropped below the burned-in time / "LOW PRESSURE" text;
  source dissolves at 14.6-15.5, 44.7-45.7 and the zoom/scale-bar section 107.7-125 avoided; CSB animation not used).
- Driver on the 580 https://youtu.be/syyBHIhGpYU (michaelocallahan, 6 subs) and resident's street https://youtu.be/COcdbVWddic
  (Custer, 7 subs; the TV emergency-alert screen 46-62 s never used). Both silent in the edit.
- Woods Cross clip in TwinFires = WP10's graded CSB CAM 006 (copied to graded/se.mp4).
- No clip audio used, so rawclean.py was not needed. Fire SFX fire_big_cc0.wav from CASE09/media/sfx (CC0).

## Render (4 Nov)
out/WP11.mp4 103.5 s, -17.2 LUFS integrated after loudnorm. Cutcheck 0 flags with the designed windows plus 55.0-56.4 (lamp posts
whipping past the driver's window in the 580 clip, source content, not edit cuts). The 580 clip's other windows were too shaky; the
second 580 shot was replaced by the CSB wide camera (src 214). Blender: pipe.mp4 (285 f) via _tools/blender_run.sh.
