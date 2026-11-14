# TP09 — Upside down on the Stargate (German-American Volksfest, Berlin, 8 Aug 2009)
Code: _engine/src/cases/TP09.tsx · out: out/TP09.mp4 (+ _phone) · ~56 s

## Footage
- joonudsch (13 subs) https://www.youtube.com/watch?v=Y10YRJfm0Ig, 640x480 20 fps -> upscaled 1440x1080 30 fps (media/sg.mp4), graded.
  Source cut at 31.1 s avoided. Raws trimmed: 5.1-17 s and 40.1-50 s (cut sheet had 0:03-0:30 and 0:41-1:00).
- The Local article (https://www.thelocal.de/20090809/21133) is now paywalled: the body does not render in a capture, so no page.
  Its first paragraph also mentions an unrelated child death — would have needed cropping anyway.

## Devices
- FreezeBracket (dev/TP09_FreezeBracket.tsx): freeze on a rider hanging head-down, brackets close, the detail lifts forward.
- MinuteBlocks (dev/TP09_MinuteBlocks.tsx): 20 white minute blocks (before rescuers arrived), later +25 red (restart and lower).
Music 5 (offset 40 s) at -14 dB, ducked under raws.

## Update (owner rule 5b)
- Raw audio from rawclean.py --force (media/sg_clean.wav; fair music around 0:32-0:34 detected). No blur needed.

## Update 3 Nov (cutcheck)
- The 20 fps source upscaled to 30 fps gave a 2-1 duplicate cadence (194 STUB flags). graded/sg_smooth.mp4 = mpdecimate + framerate
  blend to 30 fps (cutcheck on the clip: 7 -> source motion only); last shot moved 56.5 -> 55.2 off a source stub.
- One camera only (no other small-channel upload found earlier), so rule 3 (vary clips) cannot be met beyond the two devices.

## Update 3 Nov 2026 (TP audit)
- Raws unchanged (11.9 s, 9.9 s). FreezeBracket (10.4-13.5, also used by TOR11/TP04) -> ArmStop (new, dev/TP09_ArmStop.tsx): the head-down rider
  still pushed in, beside it a white-framed white-line side view of the Stargate; the arm swings over the top, jolts and stops, riders head-down, red ring,
  RedLabel STOPPED UPSIDE DOWN. Shutter SFX dropped.
- Render 3 Nov: cutcheck 0 flags, 56.1 s.
