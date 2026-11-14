# TP02 — the Sekaten night market Ferris wheel, Yogyakarta (11 Nov 2018)
Code: `_engine/src/cases/TP02.tsx` · out: `out/TP02.mp4` (102.6 s, −16 LUFS), `TP02_phone.mp4`.

## Edit
TitleCard → COLD OPEN raw (white wheel turning with cabins tipped) → VO (place/date, market history on archive photos) → raw (purple wheel,
riders on the frame) → Evi Wahyuni / newer model / HalfCage / PlumbLine → raw (riders gripping) → "nothing anyone could do" → raw (people
climbing out at the base) → outcome → next-day date freeze → archive print → 0.5x replay of the tipped cabins. 4 raws in the cut sheet's
places/order, trimmed to 8–12 s each. Music 1 at −16 dB, out under raws.

## Devices (new, `_engine/src/dev/`)
- TP02_YearPlates: archive photos of Sekaten as lit plates in 3-D depth; the camera flies through one into the next.
- TP02_HalfCage: freeze of a cabin at the base: solid white box on the barred part, dashed box on the open part (a rider climbing out of it).
- TP02_PlumbLine: level cabin with a plumb line whose bob swings and settles; tipped cabin (zoomed) with the dashed vertical, its own axis and the arc.
- LitPrint (in TP02.tsx): a Sekaten 2011 print tilted in 3-D under a moving light pool.

## Sources
- Footage: https://www.youtube.com/watch?v=wYbnnmYtbSE (vidmar project, a repost; filmer not identified). Vertical clip inside a square with a
  blurred side-fill → centre cropped (404×720 at x158), upscaled to 608×1080, shown on its own blurred copy. Selfie/black 22.4–25.5 s never used.
- Photos (Wikimedia Commons): "Sekaten Yogyakarta 2011 1.JPG" and "… 2.JPG" (CC BY 3.0), "Sekaten BW.jpg" (CC BY 2.0, cropped to remove the
  photographer's signature). Labelled "SEKATEN, 2011" on screen.
- Facts: Republika, https://news.republika.co.id/berita/pi2j8b328/bianglala-sekaten-mulai-dibongkar

## Decisions / issues
- Raw audio = `media/tp02_bg_clean.wav` (rawclean: music detected in 101 of 101 s — the repost's track carries music; voices kept).
- Downloads: yt-dlp hit YouTube's bot check on every small-channel candidate (Para Jagoan Neon, Waipuna, ZamZam SMPID, Luky Hermansyah,
  Kaizen Team). Not worked around → no extra angles.
- The Republika page could not be captured cleanly (headless Chrome failed to load the site; the saved HTML rendered unstyled) → no page device.
- "By the next day the cabins were coming off": no footage exists → the last frame is held, desaturated, with the date label "MONDAY, NOVEMBER 12".
- Nothing needed blurring.

- 3 Nov 2026 RAW AUDIT (owner: raws only at incident moments, never in explanation, no near-dups): removed RAW 2 (sat in the background/design explanation) and RAW 4 (5.8 s, lone line before it): 4 -> 2 raws (cold open 8.1 s, main 10.5 s). Replaces the raw_extend splice. Code: cutOut() at the end of cases/TP02.tsx (lib/core/cutOut.tsx drops the VO-silent raw windows; VO runs on as one take). Re-rendered; cutcheck flags all on designed transitions.
