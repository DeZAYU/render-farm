# TOR15 — Cullman–Arab EF4, Alabama, 27 April 2011 ("Downtown on a Wednesday afternoon")

Out: `out/TOR15.mp4` (164.6 s, −16 LUFS), `out/TOR15_phone.mp4`. Cutcheck: 4938 frames, 30 cuts, **0 flags**.
Code: `_engine/src/cases/TOR15.tsx`; devices `dev/TOR15_PathStrip.tsx`, `dev/TOR15_PhotoWall.tsx`.

## Edit
- TitleCard on a darkened YARD frame → 6 raws with their own sound (YARD ×3, CLAY ×3) → long VO paragraph on Cullman downtown.
- VO: one take. "This is fifteen." (take 5.0–6.5) removed (a count word, like "Number one."/"Two." in TOR01/02); split only at raws.
- Raws trimmed to the moment: YARD 55.4–72.6 ("major tornado on the ground … going right to his mom's … Fairview, Alabama"),
  YARD 118.0–133.8 ("no, no, no … don't hit mom's … oh my God"), YARD 160–168 (wind only, music held low), CLAY 94.0–109.6 ("it's hitting
  that house … look at all the crap in the air"), CLAY 189.6–196.0 ("it just hit something over there … it turned real black"),
  CLAY 205.5–210.1 ("it's tearing up Cullman right now").
- **Swearing**: YARD has an f-word at src 90.0–90.8 and "oh s***" at 97.3–98.0; no raw window touches them (that footage is only used muted).
  CLAY 2:48 has one too; not used.
- Raw audio: per guide 5b, YARD and CLAY went through rawclean.py (no music detected in either, originals kept); the raws play
  media/yard_clean.wav and media/clay_clean.wav. No injured people/bodies in the raws: nothing to blur.
- Deliberate slow replay: YARD src 101–103 at 0.5× under "On almost any other day…".
- Music: Music 4, played only under the VO and resumed where it left off (−22.5 dB ≈ 10 LU under VO); out under the raws.

## Devices (new for this case)
- **PathStrip**: the NWS track (start 34.0757,−87.0097 → end 34.4776,−86.3684, 47 mi) unrolled horizontally on USGS imagery, corridor lit,
  mile ruler; opens on ARAB, MARSHALL COUNTY, dollies back to CULLMAN on "the Cullman and Arab tornado".
- **PhotoWall**: 40 of Karen Lee's real Cullman damage photos land on a 3-D wall under "867 homes and 94 businesses".
- Aerial (brand) on the NWS EF-contour survey map (box + RUTH on the EF4 pocket) and on NOAA's downtown Cullman contour (DOWNTOWN CULLMAN).
- Inset: the courthouse photo whose own sign has letters torn off (CULLMAN COUNTY COURTHOUSE); SPC storm-report map of 27 Apr 2011.
- ChipLift page: SPC Watch 235 text (mesonet) — PDS line, MUCH OF ALABAMA, 145 PM CDT WED APR 27 2011.

## Sources
- YARD https://youtu.be/HtXmxXqjY5U (barn13owl) · CLAY https://youtu.be/nBxAd__dFcA (David Clay) · LEE https://youtu.be/YmHcSvCxhEY (garlan gudger,
  Karen Lee's video + photos; first 36 s = the tornado entering Cullman, then 67 aftermath photos, extracted as stills).
- NWS Huntsville event page https://www.weather.gov/hun/4272011_cullman_county (track coords, contour map, survey photos IMG_3086/3091).
- Commons (public domain): Cullman2011EF4.JPG (NWS), CullmanTornadoPathInCullman.png (NOAA). SPC reports map https://www.spc.noaa.gov/climo/reports/110427_rpts.gif.
- Watch text https://mesonet.agron.iastate.edu/wx/afos/p.php?pil=SEL5&e=201104271845 (spc.noaa.gov page answered headless Chrome with a block: not worked around).
- USGS Imagery Only tiles (z12) for the strip. No downloads of new YouTube clips.

## For the owner
- **Script fact issue**: NWS says the track ran SW→NE through Cullman city FIRST (~3:00 pm) and passed north of Fairview AFTER. The VO says
  "near Fairview … then Cullman itself". The VO was not changed; the edit shows the real order on the PathStrip.
- "Christ Lutheran Church collapsed" and "Busy Bee Café" lines use unlabelled Karen Lee photos of downtown Cullman damage; I could not
  confirm which photo shows which building, so no name label is put on them. The two NWS survey photos (slab home, clearing) are from this
  tornado's survey but their exact location (Ruth vs Fairview) is not given; they are unlabelled.
- Footage is 640×480 / 854×480; upscaled with the house grade.

## 3 Nov raw audit (owner: raws only at incident moments, never during explanation)
- Raws 6 -> 4: removed raw 3 (the wind-only YARD raw inside "And it hasn't finished growing.": the line now runs straight on into VO-E)
  and raw 5 (CLAY 189.6, after the Arab/PathStrip explanation; PathStrip -> Ruth map now one VO stretch).
- Raw 6 lengthened 4.6 -> 6.4 s (CLAY 205.5-211.9, ends just before the end of media/clay.mp4 = src 212.0; no source cut).
- Raws now: YARD 55.4 (17.2 s, 17.15-34.35), YARD 118 (15.8 s, 39.15-54.95), CLAY 94 (15.6 s, 60.75-76.35), CLAY 205.5 (6.4 s, 88.35-94.75).
- New device **WatchCrawl** (dev/TOR15_WatchCrawl.tsx) replaces the ChipLift_N2P page: SPC Watch 235 re-typeset as a generic TV warning
  bulletin (URGENT line, TORNADO WATCH 235 slab, PDS line typed, 4 areas with MUCH OF ALABAMA lit red, 1:45 PM CDT underlined, hazard crawl,
  source credited small). No station branding.
- Inset once only: the courthouse is now full-frame (slow push + RedLabel); the SPC reports-map Inset stays (582 px source).
- Duration 152.0 s. Stale out/TOR15_extend.json deleted (the raw_extend splice is obsolete).
