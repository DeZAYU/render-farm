# TOR00 — INTRO (25 Most Disturbing Tornado Encounters Ever Caught On Camera)
Render: `out/TOR00.mp4` (30.0 s) + phone. Countdown video: no iceberg graphics.

## Edit
- Cold open (own sound, cleaned by rawclean.py: no music found): Washington IL, the wedge behind the homes, "you ready to run with
  me? be ready to run with me" (pVanmvVNHcc 100.2-104.6; the profanity either side is outside the window) → Elie MB, the cut sheet's
  cold-open line "It's ripping something up now" (u2dIDdA4YU0 52.6-56.6, 192x144 source: shown in fill mode over its blurred copy).
- VO montage, one shot per phrase, hard cuts: the Washington IN lot after ("the next morning", case 24) → Tsukuba funnel at the pole
  (nV87QZ66KP8 64.5) → Fairdale from Clem's window (Rk5Y2biSpog 82.5, reframed so the "© Clarence Schultz" mark is out of frame) →
  Elie through the windshield ("on purpose", xCI1u05KD_s 11.0) → Moore across the street (-iuGipbmneY 4.5) → Moore carport
  (0LVMg6XNOB8 48.5) → the Joplin ER as the lights drop ("before any warning", qas95uWkidg 106.3; real SFX, silent CCTV) → the Chapman
  wedge ("Worst first.") → blur-dip into the title.
- `dev/TOR00_VideoTitle.tsx`: "25 MOST DISTURBING / TORNADO ENCOUNTERS — EVER CAUGHT ON CAMERA" in Elite over the darkened Chapman
  wedge, lines resolve out of a soft blur, a white rule; no glitch, no flash.
- Music 5 (−13 dB, swells into the title). SFX: wind, sub drop + impact on the ER, whoosh + title hit.
- Each window graded with the house grade; after.mp4 is case 24's graded file.

## For the edit (patch)
Concatenate: TOR00 → TOR01 … TOR25 → TOR99. TOR00 ends on the title fading under the blur-dip's tail (hard cut to TOR01's own
TitleCard works). The Frankfort doorbell clip was dropped from the montage (its IR debris flashes frame to frame: cutcheck FLASH/STUB).

## 3 Nov 2026 rebuild (no raw; 3-D device)
VO straight through, no clip sound. Cutcheck allow: 3.65-4.25,15.9-16.5 (designed transitions). Device + sources: see the header of _engine/src/cases/TOR00.tsx; maps NASA GIBS Blue Marble (PD). Card frames: graded/cards/.

## 10 Nov 2026 — new intro VO (owner's line)
VO swapped to vo/raw/INTRO_v2.mp3 (same Obscure Collab settings). Source media was cleared, so the picture was kept from the delivered file: old VO removed with Demucs (music/SFX kept), new VO +9 dB at 3.0 s ("twenty-five" on the fan-out), "Worst first. Let's begin." at 14.95 s (same title beat). Output: ~/Downloads/iceberg 2 videos/Tornado FULL_newintro.mp4 (video stream copied, length identical).

## 10 Nov 2026 — INTRO v5 (new visuals, owner: "clips showing and then at last a 3d zoom out of clips", use the film's own clips)
Code: _engine/src/cases/TOR00v2.tsx (entry src/entries/TOR00v2.tsx, pubs/TOR00v2 -> pubs/TOR00). Clips cut from Tornado FULL.mp4 into
graded/v2/. Montage (dissolves + push-in + RedLabel): Elie 2007, Tuscaloosa 2011, Manchester 2003, Moore 2013, Albany 2017, Elkhorn 2024;
10.9 s Chapman wedge full-frame, 3-D pull-back into a field of 19 case clips, dip to black at 14.6 s; then the old title (film 16.2-20.0).
Audio: Music 5 (from 20 s, -6 dB, swell) x-fades into the old title audio; VO INTRO_v2 at 0.4 s +9 dB. Intro is 18.4 s (was 20.0),
so everything after shifts -1.6 s. Output: ~/Downloads/iceberg 2 videos/Tornado FULL_newintro.mp4 (60:48.7, 720p, synced).
