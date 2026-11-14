# DC05 — The Figure at Bukit Tunku (Kuala Lumpur, 5 May 2017)

Code `_engine/src/cases/DC05.tsx`, master `out/DC05.mp4` + `out/DC05_phone.mp4`. Duration 104.5 s (title 4 s, VO 60.8 s, raws 38.8 s).
Cutcheck: 0 flags (6 cuts, all inside the designed glitch/blur-dip windows). Master −16.5 LUFS integrated.

## Timeline (VO = one take CASE05.mp3, split only at the two raws, both at sentence ends)
| T (s) | what |
| --- | --- |
| 0–4 | TitleCard "THE FIGURE AT BUKIT TUNKU" on the graded dashcam frame src 9.0 |
| 4–33.3 | VO A (take 0–29.3): HillPull (KL satellite, Lake Gardens / Kenny Hills), 4 night-road reframes from the drive back (src 45–76), the chevron bend live (src 4.6), CentreLine (held src 9.0) |
| 33.3–62.7 | **RAW 1 (main)** src 9.0–38.4 (29.4 s): live from the held frame, tight and lifted on the shape, ease out as the car stops and turns; "that's a bit scary… very scary", "my traction control just came on", "what the [muted] was that, dude, some dude is sitting there in the middle…" |
| 62.7–89.25 | VO B (take 29.3–55.85): Headlamp (Higgypop page: driver's claim → the robber theory), 0.5x lifted replay of the shape (no police report / doubted), three drive-away reframes |
| 89.25–98.65 | **RAW 2** src 79.8–89.2 (9.4 s): stopped under a lamp, "check system… maybe it's like a reverse too fast. Yeah, maybe." |
| 98.65–104.5 | VO C (last line) over the night road easing out |

Main raw is 29.4 s (longer than the usual 25 s): it keeps the turn-around and the first spoken reaction in one uncut take; the
quiet 8 s of driving back between the warning and the reaction is what the reaction is about, so it stays.

## Devices (REGISTRY.md)
- HillPull — Sentinel-2 KL mosaic (z15, 13×13 tiles) with RedLabel "BUKIT TUNKU, KUALA LUMPUR"; Lake Gardens (3.1430 N 101.6840 E),
  Kenny Hills / Bukit Tunku (3.1645 N 101.6805 E) points on the spoken names.
- CentreLine — held frame src 9.0, spotlight up the centre line to the shape (0.604, 0.597); raw continues from that frame/camera.
- Headlamp — real Higgypop page (28 May 2017) captured with capture_page.py; header + article column re-assembled into one sheet
  (sidebar with unrelated images and the embedded NowYouKnow video — red circles — left out); beam on "But Aswan is convinced…"
  then on "There are a couple of theories…".
- Brand: TitleCard, RedLabel (BUKIT TUNKU, KUALA LUMPUR / MAY 5, 2017 · 9:30 PM), glitch + blur-dips. No Inset, no Blender.

## Sources
- Dashcam: early repost by Hafeedz, https://www.youtube.com/watch?v=v9pPRdfhcXc (filmer Aswan Yap). Used src 0–97. Camera stamp
  "AAAAAA 2017/05/05 21:30" in frame (the camera's own). Swearing: src 30.85–31.35 muted (only one inside the raws; 0:59 and 2:57 not used).
- rawclean.py flagged "music" in 70 of 100 s (car-interior noise / possibly the car stereo); its output keeps the voices; used.
- Satellite: EOX "Sentinel-2 cloudless – https://s2maps.eu by EOX IT Services GmbH (Contains modified Copernicus Sentinel data 2016)",
  CC BY 4.0 → **credit in the description**.
- Page: https://www.higgypop.com/news/malaysian-driver-catches-ghost-in-road-on-dashcam (captured 13 Nov 2026).
- Music: Epidemic "Music 3" −19 dB (≈ −33 LUFS bed), ducked under the raws. SFX: glitch_01/02, sub_pulse_01, real/reverse_swell_1.

## Notes / decisions (owner asleep)
- Wording limits kept: "shape", "figure", "something"; no ghost claim in picture; no police involvement shown.
- The friend's "maybe the person was suicidal" (1:13) is not used (outside both raw windows).
- The age 25 (Higgypop) is visible in the page text but not in the beam's key paragraph; VO doesn't use it.
- Footage: nothing was blocked for this case (no cookie fetch needed); no second small-channel angle of this event exists.
- Contact sheet of the master viewed (14 Nov): reads correctly; no re-render needed.
