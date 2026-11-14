# DC20 — The Stolen Humvee (Fort Gordon GA → Aiken County SC, 3 Jul 2015)

Code `_engine/src/cases/DC20.tsx`, master `out/DC20.mp4` + `out/DC20_phone.mp4`. Duration 130.2 s. Cutcheck: 0 flags.
v2 (same night): raw gains lowered (siren raws sat ~9 dB over the VO in v1), re-rendered.

## Timeline (media t = src − 10; source 720x480 letterboxed → 712x400)
| T (s) | what |
| --- | --- |
| 0–4 | TitleCard (highway frame, t 240) |
| 4–36.71 | VO A (take 0–32.71): Barton Field panorama + "FORT GORDON, GEORGIA · JULY 3, 2015", the field + "BARTON FIELD", the Humvee close (t 25), ahead (t 45) + "MICHAEL WARNING, 47", LineCross (Barton Field → I-20 → over the river into SC → mile 11 near Aiken) |
| 36.71–46.71 | **RAW 1** t 0.8–10.8 (10 s): the pursuit under way, siren |
| 46.71–70.51 | VO B (take 32.71–56.51): intersection (t 60), side roads (t 100), cruiser across the grass (t 122), highway (t 160), the shoulder drift slowed (t 212.3), the Humvee before it angles off (t 302) |
| 70.51–101.01 | **RAW 2 (main)** 30.5 s in three windows of the one camera joined by blur-dips: t 307–320 off across the grass, t 352.5–359 it comes to rest nose down in the ditch, t 418–429 the driver climbs out, deputies run in and put him down |
| 101.01–130.2 | VO C (take 56.51–end): the ditch wide (t 385), tight on the Humvee (t 395), highway slowed (t 240), empty ditch (t 404), the Humvee's tail (t 33), DitchTilt (held t 375) |

## Decisions
- The main raw is longer than 25 s (30.5 s) because the climax is three beats (off-road, ditch, arrest) far apart in the source; they are
  one raw with two blur-dip time jumps instead of three short raws (VO between them would be < 6 s).
- Charges / no outcome: WRDW's 2015 article is gone (404), covnews 404, defence-blog answers with a bot check (not worked around), so no
  page is shown; that line runs over the slowed highway pursuit. "Accused/police say" wording kept; no court outcome claimed.
- The walk-out (t 430+, where the outline asks for a face blur) is not used; in t 418–429 the driver is a few pixels at ~60 m, back to camera
  or on the ground — no blur applied. The deputies are public officials on duty.
- The Fort Gordon → I-20 connector on LineCross is DASHED (the roads it took on post are not known); I-20 itself is the real OSM geometry,
  stopping at SC mile 11 (where the deputy picked it up, WRDW via outline).
- Read-tool image previews failed (hook timeout) while building this case: stills were rendered and checked numerically only
  (non-black, DitchTilt roof line measured from the frame's own pixels). Worth one look at 25–37 s (LineCross) and 122–130 s (DitchTilt).

## Sources
- Cruiser cam: 4gCgd_y1fYI (Political Pilot; Aiken County deputies' release), used src 10–503.
- Wikimedia Commons: "Barton-field-panorama.jpg", "Barton-field-track.jpg" (Sakai Jin, CC BY-SA 4.0 → credit in the description).
- Sentinel-2 cloudless 2016 (EOX, CC BY 4.0) z12; I-20 geometry © OpenStreetMap contributors (ODbL) → credit.
- Music: Epidemic "Music 5" −13 dB, two passes, ducked under raws. SFX: glitch (sfx_n2).

## Devices: LineCross, DitchTilt.
