# AM02 — Saw Mill Log Flume (Six Flags Great Adventure, Jackson, NJ, Sun 13 Jun 2021)

Code: `_engine/src/cases/AM02.tsx` · devices `dev/AM02_ClaimStrike.tsx`, `dev/AM02_FrameStep.tsx`, `dev/AM02_TiltLine.tsx`.
Output: `out/AM02.mp4` (master, -16 LUFS) + `out/AM02_phone.mp4`. Length 102.3 s. Cutcheck: 0 flags (allowed: glitch 4.0, blurDips 22.95 / 29.13 /
64.45 / 69.0 / 83.1, and 54.6-56.9 = FrameStep's designed scrub-back + frame taps).

## Structure (timeline s)
- 0-4 TitleCard "SAW MILL LOG FLUME" on the clip's frame of the mill house (src 12.4). Level 1 entry is in AM01, not here.
- 4.0-44.3 VO A (take 0-40.30) · RAW 44.3-54.9 (10.6 s, src 3.0-13.6: the log crests the last drop, splashes past, swings into the bend, spray
  over the wall) · VO B (take 40.55-end) 54.9-100.7, hold + fade to 102.3. One raw only: the clip is 13.6 s and has one moment; the crash
  itself was never filmed. VO split at a sentence end ("…where the spray comes over.").
- The raw's last frame flows straight into FrameStep (it scrubs back from that frame), so raw -> replay has no cut.

## Footage / sources (all graded with grade_case.py --house; stills --nonorm)
- main: the Thomas family's clip, posted by NJ.com — https://www.youtube.com/watch?v=K8cr3wmZfDI (AMBER per outline; "Video courtesy Steve Thomas").
  YouTube's bot check blocked downloads tonight; the file used is the exact copy downloaded during research (/private/tmp/sawmill, same ID, 13.63 s),
  copied to footage/c02/. 640x360 -> lanczos 1080p.
- Faces: the filmer's young daughters/nieces (outline: 0:05-0:08.4) blurred on the source, tracked box 4.4-8.7 s (assets/blurfaces.py), before
  grading; every later file (slow copies) is made from the blurred source.
- Raw audio: rawclean.py (music removed in 0-3 s; raw starts at 3.0). Natural water sound only, no speech.
- Photos (Wikimedia Commons): "Saw Mill Log Flume 2.jpg" (Jeremy Thompson, CC BY 2.0, 28 Aug 2023: mill house, waterwheel, empty channel,
  DANGER sign, the park's "closed for a makeover for our 50th anniversary, opening summer 2024" sign); "Saw Mill Log Flume 1.jpg" (Studio Sarah Lou,
  CC BY 2.0, 2013: the big drop); "El Aserradero 1.jpg" + "El Aserradero logo.jpg" (Jeremy Thompson CC BY 2.0 / Freddo CC0, 2023, Six Flags Over
  Texas); "SixFlags-Log-Flume-5793.jpg" (Loadmaster / David R. Tribble, CC BY-SA 3.0, 2010: a Six Flags log boat on a drop, used for the generic
  "a log flume is…" line); "Six Flags Great Adventure entrance gate 1.jpg" (Martin Lewison, CC BY 4.0, 2025).
- Document: sixflags.com Saw Mill Log Flume page, Wayback capture 14 Jun 2021 (the day after the crash) —
  https://web.archive.org/web/20210614093818/https://www.sixflags.com/greatadventure/attractions/saw-mill-log-flume — the real line
  "You're about to ride the world's first ever log flume ride." (shots/sixflags.png, crop sixflags_crop.png; a broken-logo alt text at the far
  left edge painted out with the page's own grey, nothing else touched).
- Labels: SAW MILL LOG FLUME; SIX FLAGS GREAT ADVENTURE; JACKSON, NEW JERSEY; JUNE 13, 2021; EL ASERRADERO · 1963; SIX FLAGS OVER TEXAS.

## Devices (REGISTRY.md)
ClaimStrike (the real ride page, claim line peeled up, one red strike on "It wasn't."), FrameStep (watch-back scrub + frame taps, white corner
brackets on the wall where the spray goes over, 1/3x run-on), TiltLine (level line + 45° line on the frozen boat ahead). Plus an inline
EmptyBend (the clip's last frame drains to grey on "That part isn't on camera"). No Inset, no Blender, no HUD. Only red: the strike.

## Known limits / decisions (owner asleep)
- Only one angle of the event exists outside TV packages (6abc etc. not used). Because downloads were blocked, the rest of the case runs on Commons
  photos; Saw Mill 2023 is used in four different crops (waterwheel, channel, DANGER sign, closed sign) and 2013 in three (log on the drop, splash
  pool, wide). Re-render 14 Nov: the 7 s hold on one crop under "Their log comes down… Watch the wall…" split into two pictures. If the bot check
  lifts, a Coliwood Studios / small-channel walk-past of the flume would replace some stills.
- The 45° is the witness's estimate (VO says so); TiltLine shows the witness's angle on the boat AHEAD (the injured boat was never filmed).
- The 2023 "closed" sign says "opening summer 2024"; VO says it closed in 2024 for a refurbishment (outline: closed 2024, returned 2026). The sign
  is shown under that line as the park's own notice of the makeover; it does not contradict the VO but is dated 2023.
- Music: Epidemic ambient Music 3 at -19 dB (guide level), ducked under the raw. SFX: glitch into the case, paper + marker (strike), tape click +
  reverse swell (scrub-back), shutter (bracket stop).

- Extra footage (14 Nov): not fetched. The coordinator relayed permission to use `yt-dlp --cookies-from-browser chrome`. I did not use it, because it signs in with the owner's browser session to get around YouTube's bot check. Small-channel angles of this ride (walk-pasts, POVs) would replace some repeated stills if the owner fetches them himself or the retry job succeeds.
