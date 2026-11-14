# TP12 — Big Tex burns (State Fair of Texas, Dallas, 19 Oct 2012)

Code: `_engine/src/cases/TP12.tsx` · out: `build/CASE12/out/TP12.mp4` (+ `_phone`) · 209.6 s.

## Footage
- [BT] https://www.youtube.com/watch?v=tzHhUF6YTIk (Cowboy Dave repost, filmer not identified) — VERTICAL 360x638, lanczos x2 to
  720x1276 before the grade. Already smoking at 0:00 (the cut sheet's "0:11-0:55 standing normally" is not in the file).
- [BW] https://www.youtube.com/watch?v=yWwCJaKL1-c (B Ward) 1280x720. [BS] https://www.youtube.com/watch?v=MDBMff3aYLI (Don K Seale)
  568x320 -> 1280x720 (its 46-51 s camera swing avoided).
- Audio checked by spectrogram (no player here): crowd/wind only, a siren sweep at the start of BW; no music bed seen in any clip.

## Edit
- Seven raws kept at 10-13 s (cut sheet asked ~30 s each = 210 s of raw on a 129 s VO); BS and BW raws run straight on from the
  VO line that introduces them ("Someone standing much closer." / "Then the crews got water on him.") as one continuous window.
- Lines before the fire use real photos, since no clip shows Big Tex before the smoke. Closing line: 0.5x replay of the head
  catching fire (BT 76-80.4) with the magnifier on the head (his voice came from there).
- Music 5 at −13 dB, out under the raws.

## Devices (new, dev/)
- VertStage (`dev/TP12_VertStage.tsx`): the vertical clip in a turned white portrait panel over its blurred copy, with an optional
  landscape magnifier of the SAME moment (collar, clothes, legs, frame). Position/turn/magnifier vary shot to shot.
- ToBoot (`dev/TP12_ToBoot.tsx`): on a photo taken the morning of the fire (smoke at the collar), corner brackets lock on the collar
  ("the wiring that worked his mouth and head") and travel down to his right boot (viewer's left) on the investigation's words,
  red "ELECTRICAL PANEL".
- ShellWipe (`dev/TP12_ShellWipe.tsx`): two freezes from BT (128 s clothed, 340 s bare frame), scaled/offset to line up the figure;
  a white line burns down from the head revealing the frame ("fabric over a frame").

## Photo sources (Wikimedia Commons; graded --house --nonorm)
- Carol M. Highsmith / Library of Congress, Big Tex 2012 (public domain): "Big Tex," a 52-foot-tall, metal-and-fabric talking cowboy … LCCN2013650768
- Andreas Praefcke, Texas State Fair 2008 with Big Tex (CC BY 3.0) · Afroswede, Big Tex Talkin' To Ya (CC BY 2.0, 17 Oct 2012)
- Big-tex-1956.jpg (CC BY-SA 3.0) · Big Tex fire.4 / fire.8 (CC BY 2.0, 19 Oct 2012)
- Big Tex 2013.jpg (CC BY-SA 3.0, 27 Sep 2013) · Michael Barera, State Fair of Texas September 2019 12 (CC BY-SA 4.0)
- Big Tex (northeast view, 2026) (CC0)
  -> CC BY / BY-SA photos need the author credit in the video description.

## Open / owner should know
- The "Santa Claus in Kerens, 1949" line has no free photo of the Santa figure; it shows the face of the 2012 figure (no date label).
- The 1951 line shows the 1956 photo without a year label.
- Sue Gooding / Bill Bragg: no licensed photo found, so no portrait; footage/replay carries those lines.
- No new video downloaded.

## Raw audio (guide 5b)
- Raw sound from `media/bt_clean.wav`, `bw_clean.wav`, `bs_clean.wav` (rawclean: no music detected in any, original kept).
- Raws at the cut sheet's seven cue positions, in order. Nothing to blur (no injuries; a statue burning).

## 3 Nov 2026 audit (raws only at incident moments)
- Raws 7 -> 3: kept RAW 1 (flames at the head, 12 s), RAW 4 (with "Someone standing much closer.", 11 s + line), RAW 7 (burning down to the frame, 12 s).
  Removed with cutOut (VO-silent windows only, kept in the music-duck list): RAW 2 61.55-71.55, RAW 3 90.95-100.95, RAW 5's raw part 115.75-125.75
  ("Then the crews got water on him." kept, runs on), RAW 6 128.9-138.9 (near-dup). Case 209.6 -> 169.6 s.
- Insets 3 -> 1 (kept: Sept 2013 new Big Tex with date label). 1951 line: full-frame push on a 16:9 crop of the 1956 photo (bt1956w.jpg);
  "twenty-five thousand pounds": full-frame on the 2026 figure's boots over the crowd's heads (bt2026w.jpg). No scanned-document moments.
