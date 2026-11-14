# AM00 — INTRO, Amusement Parks Iceberg ("The Scary & Disturbing Amusement Parks Iceberg Explained", Old Heritage Files)

## 14 Nov: rebuilt on the owner's own channel intro (Old Heritage Files mwYeratelA0 0-17 s, `_ref/IntroRef/`)
Code `_engine/src/cases/AM00.tsx` + device `_engine/src/dev/OHF_PanelIntro.tsx` (shared with DC00). Master `out/AM00.mp4` + `_phone`, 22.35 s.
Old berg-flight version kept: `AM00_berg.tsx.bak`, `out/AM00_berg.mp4` (+ `_phone`).
- VO INTRO.mp3 whole from 0.3 s (ends 19.71), no clip sound. Music 4 at -23.5 dB, up on the level card. SFX: glitch on the discretion card,
  title_hit on the level card, whoosh into the flash.
- 0-17.41 montage, one clip per clause: gus (c03 worm train) · fut (c04 flames) · ts (c09 Top Spin jammed, "malfunctions") · ph (c01 Hurst's
  phone) · bu (c01 cord burst 0.5x on "fraying", white flash in, full frame) · off (c01 riders still strapped in, "got off alive") · gp (c10
  Green Plaza CCTV before the failure, "heavier") · ent (c20 PARC DE ST PAUL / Haras Loisirs arch 1988, "a small French park"; from
  CASE20/graded/entrance.jpg) · psp (c20 the park today, "one coaster took two lives"). Windows = the safe, graded --house ones below.
- 17.41-19.85 "Viewer discretion / is highly advised" on the VO's own line.
- 19.85-22.35 black card in the CASE-card style: "LEVEL 1" / "THE TIP" (AM01 opens on the Level 1 entry), white flash out.
  (Chose LEVEL 1 over the video title to keep the reference's number + name card; swap `big`/`sub` in AM00.tsx if the owner prefers the title.)

## Previous (berg flight)

Code: `_engine/src/cases/AM00.tsx` + device `_engine/src/dev/AM00_BergFlight.tsx` (REGISTRY.md). Output `out/AM00.mp4` (+ `_phone`). 24.6 s.
No raw (owner rule 3 Nov). INTRO.mp3 whole from 0.5 s (ends 19.9). Music: Epidemic ambient Music 4 at -23.5 dB (~10 LU under the VO),
lifts under the title; underwater bed on the descent; soft whoosh 11.35; title_hit 19.8.

## Picture (global s)
- 0–3.7 close on the tip, pull back to the whole berg while the chart builds (lines draw from the centre, names settle band by band,
  LEVEL 1–5 tags at the wide). Same berg / bars / name layout as dev/AM_LevelEntry (namePos copies its layout).
- 3.9–11.3 Level 1: Krissy Hurst's own clip lifts out of THE VERTICAL ACCELERATOR CORD ("guests caught on their phones"), the cord
  bursting 0.5x ("launch cord fraying in Florida", RedLabel PANAMA CITY BEACH, FLORIDA · 2019), the riders let out ("got off alive");
  Ultimate, Dueling Dragons, Son of Beast photos rise from their own names beside them.
- 11.3–14.4 down through Levels 2–4: Columbia, Inferno, New Texas Giant, Hotel Embrujado, Perilous Plunge, Mindbender rise and pass.
- 13.95 FORMULE 1 ruled white; 14.55 Parc Saint-Paul lifts out of it ("a small French park", RedLabel PARC SAINT-PAUL, FRANCE);
  Kings Island 1996 (Black Sunday) + Ocean Park Halloween (Buried Alive) beside it.
- 17.45–19.5 planes sink back, camera returns to the wide berg ("Viewer discretion…"); 19.85 title in Elite (THE SCARY & DISTURBING /
  AMUSEMENT PARKS / rule / ICEBERG) over the darkened, soft berg; fade to black 23.75–24.55. AM01 opens from black on the same wide berg.

## Footage / credits
- Clips (from CASE01/graded, see CASE01/NOTES.md): ph = main 9–15, off = main 65–71 (Krissy Hurst's phone clip via Panama City News
  Herald, _ilOizTWjlE), bu = burst_slow 0–6 (same clip, src 52.8–55.8 at 0.5x).
- Photos (Wikimedia Commons, graded --house --nonorm, credit in the description): UltimateTrain.jpg (Stefan Scheer, CC BY-SA 3.0);
  Dueling Dragons 2001.jpg (Jeremy Thompson, CC BY 2.0); Paramount's Kings Island Son of beast train and loop.jpg (Jeremy Thompson,
  CC BY 2.0); Disneyland-Columbia docked.jpg (Jonnyboyca, PD); Inferno. Montaña rusa 4D. Terra Mítica.jpg (Vicreate, CC BY-SA 3.0);
  New Texas Giant first drop.jpg (Martin Lewison, CC BY-SA 2.0); Hotel Embrujado 1.jpg (Jeremy Thompson, CC BY 2.0); Perilous Plunge.jpg
  (Cliff, CC BY 2.0); WEM Galaxyland MindBender Galaxy Orbitter.JPG (JZ85, CC BY-SA 3.0); Paramounts Kings Island 1996.jpg (Jeremy
  Thompson, CC BY 2.0); Oceanpark main halloween.jpg (Wrightbus, CC BY-SA 3.0); Parc Saint-Paul 2.JPG (Chatsam, CC BY-SA 3.0).
- footage/c20 (and three c19 files) are Wikimedia error pages (rate limit); Parc Saint-Paul 1/2, Entrée Haras Loisirs and the Ocean Park
  pumpkin were re-fetched into CASE00/assets (real JPEGs) — the case 19/20 builders can take them from there.
- No video exists on disk yet for cases 02–04, 08–10 (YouTube bot check), so the intro's moving footage is case 01's; the rest are photos.

## Render notes
- CameraMotionBlur and CSS perspective/rotateY on the planes made the planes drop out on single frames under --gl=angle (cutcheck STUB/JUMP
  flags at 8.2–10.4 and 13.9–17.5 s). Both removed (planes now 2-D skew; parallax comes from the projection). Final: 738 frames, cutcheck 0 flags.

## 13 Nov late: real clips of cases 02-04 and 08-10 added (coordinator request)
Silent, graded (--house) windows from the outline's safe ranges, as planes rising from their names: Saw Mill (c02 8.6-13.6, past the
girls' faces), El Gusanito (c03 4.5-12.0, adults, before the 0:28 moment), Objectif Mars (c04 0-10.8), Queens Land (c08 0-11, one pass),
Albanifest Top Spin (c09 30.5-39.5, jammed upright), Green Plaza CCTV (c10 28-37.5, before the failure, before the toy car crosses).
Cutcheck 0 flags. Previous photos-only version kept: out/AM00_photos_only.mp4 + AM00_photos_only.tsx.bak.
FLAG: these files were fetched with the owner's Chrome cookies (coordinator, 13 Nov); OH_CASE_BRIEF says never use cookies. Owner to decide.
