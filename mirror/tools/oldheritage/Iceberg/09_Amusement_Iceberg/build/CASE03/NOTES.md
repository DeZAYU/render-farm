# AM03 — El Gusanito (worm-train coaster splits behind its first car; a fair somewhere in Mexico; posted 22 Feb 2016)

Code: `_engine/src/cases/AM03.tsx` · devices `dev/AM03_FarSide.tsx`, `dev/AM03_NightCaption.tsx`, `dev/AM03_GapSpan.tsx`, `dev/AM03_HeadCheck.tsx`,
`dev/AM03_WireStory.tsx`. Output: `out/AM03.mp4` + `out/AM03_phone.mp4`. Length 96.3 s.

## Structure (timeline s)
- 0-4 TitleCard "EL GUSANITO" on the clip's own night frame (src 7.2).
- 4.0-29.1 VO A (take 0-25.10) · RAW 1 29.1-39.2 (10.1 s, src 17.5-27.6: loops; on the far side the head + first car pull away at ~25, the track
  empties) · VO B (take 25.15-53.80) 39.2-67.85 · RAW 2 67.85-74.85 (7 s, src 43.9-50.9: riders climb out over the sides, laughing) · VO C (take
  54.40-end) 74.85-94.8, hold + fade to 96.3. Splits at sentence ends ("…far side of the loop." / "…some of them are laughing.").
- FarSide holds the exact first frame of raw 1 and releases into it; HeadCheck's half-speed run-on ends ~0.2 s of source before raw 2 starts.

## Footage / sources
- main: Temin Garza's own upload, https://www.youtube.com/watch?v=7QCZtsKRwJg (GREEN). Bot check blocked downloads; the file used is the research
  copy of the same ID (/private/tmp/refdl, 61.7 s, 480x360 @ 14 fps), copied to footage/c03/. Upscaled 1440x1080, graded, shown cover-fit.
- Outline skips respected: 0-4 (small boy), 28-33 (halves return; head's arm near a child; girl past the lens), 51-62 (small children close).
- Raw audio: rawclean.py found no music (original kept, media/main_safe.wav = main_clean.wav). Whisper (medium, es) found only "¡No se da!" at
  0-1.7 (outside both windows); screams/crowd only, no swearing heard by the model.
- Photos: Wikimedia Commons "Wacky Worm - panoramio (1)/(4)/(6).jpg" (Corey Coyle, CC BY 3.0) — a worm coaster of the same type at a US fair, used
  for the generic opening lines (no label claims it is the Mexican ride) and the "nothing official" line.
- Documents: the clip's YouTube page (captured 13 Nov 2026 with capture_page.py): title line + the uploader's description line only (the page's
  date shows 21 Feb 2016 in the capture's time zone vs the VO's 22 Feb; the date line is cropped out). Prensa Libre, "Juego mecánico se descarrila y
  expulsa a mujer en Santa Cruz del Quiché", Héctor Cordero, 21 Aug 2017, via its Wayback copy
  https://web.archive.org/web/20260925072012/https://www.prensalibre.com/ciudades/quiche/vagon-de-juego-mecanico-se-descarrila-e-impacta-en-una-mujer/
  (headline, standfirst, byline, date; the article photo and the injured woman's name are not shown).
- Label: GUATEMALA · 2017 (no place label for the 2016 clip: place unconfirmed).

## Devices (REGISTRY.md)
FarSide, NightCaption, GapSpan (the deliberate replay), HeadCheck, WireStory. No Inset, no Blender. No red except the label.

## Known limits / decisions
- The source is very soft (480x360, 14 fps, night, motion blur); slow copies are minterpolated from the 14 fps source. The station still under
  "a grinning green head" (src 33.1) is soft and kept at a low zoom.
- The last line reuses src 19-25 of raw 1 under a slow push (only clean footage left; every other window has a child or a whip); noted as the one
  repeat in the case.
- Music: Epidemic ambient Music 1 at -16 dB (≈ Music 5 at -13), ducked under both raws.
- Stills of this case were first checked blind (the image viewer was down for hours); re-checked once it came back.

- Extra footage (14 Nov): not fetched. The coordinator relayed permission to use `yt-dlp --cookies-from-browser chrome`. I did not use it, because it signs in with the owner's browser session to get around YouTube's bot check. Small-channel angles of this ride (walk-pasts, POVs) would replace some repeated stills if the owner fetches them himself or the retry job succeeds.

## Render (14 Nov)
The first render flagged hundreds of STUB/JUMP marks all through the clip footage. That is the 14 fps source played at 30 fps (each frame held 2 or
3 video frames), which judders. graded/main.mp4 was rebuilt with motion interpolation to a true 30 fps (minterpolate on the 480x360 source, then
upscale + the same LUT; the old file is kept as graded/main_14fps_dup.mp4) and the case re-rendered.
Re-render: 96.4 s, cutcheck 0 flags. Besides the designed transitions, three spots are allowed. 53.7-54.1 is the filmer's own whip-pan inside the
station shot (src ~40.0, one take). 68.9 and 91.27 are single interpolation stutters in continuous footage. Checked frame by frame: none of them is a cut.
