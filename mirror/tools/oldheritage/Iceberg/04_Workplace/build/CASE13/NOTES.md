# WP13 — The man inside (NuStar Selby terminal, Crockett, California, 15 Oct 2019)
Code: _engine/src/cases/WP13.tsx. Length 127.3 s (VO from 7.75 s = after the level-three call, which WPL3 carries; VO part 107.2 s).
Music: Epidemic Music 1 at -15.5 dB (offset 3 s), ducked under the raw.
## Raw (one, per WP_PLAN: VO > 70 s)
- Main 15.0 s: NU (Timothy Clark, https://www.youtube.com/watch?v=-u4BeyqyP8o) src 71-86, filmed sideways -> rotated to portrait, full
  height over its blurred copy: the flare-up fireball (~76) and a tank roof thrown (~79-81). Placed after "...not the first explosion."
- Raw audio: rawclean.py (music detector stripped 12 of 24 s; voices/impacts kept). Slow 0.42x replay of the fireball after it (silent).
## Devices
Blender terminal site (maps/site3d.py + shot.json; prep_site.py adds OSM storage tanks + Cummings Skyway), SearchLight
(dev/WP13_SearchLight.tsx), Blender roof mechanism (maps/roof3d.py: strap spark -> first tank -> roof lands on the second).
## Sources
- Footage: NU (above), JAG (Joven Agapito, https://youtu.be/PtcLYfDRFKs, roadside view, 15-580 used).
- Terminal location: OSM storage tanks (ODbL) north of I-80 at ~38.046,-122.245 (24-tank Selby terminal, per AP/Insurance Journal);
  NAIP (public domain), AWS Terrarium DEM.
- Cause: Contra Costa County Fire Protection District report, 25 May 2021 (static discharge / poor grounding; roof landed on the
  neighbouring tank) via KTVU https://www.ktvu.com/news/findings-show-2019-tank-fire-explosion-in-crockett-was-disaster-waiting-to-happen
  and biofuelsdigest / safteng.net summaries.
## Open
- The VO's "no permits or construction plans", "venting safety valve removed, no record of replacement" and "may have tampered with
  evidence" lines were NOT found in the press summaries checked (they may be in the 525-page report itself). Nothing on screen
  asserts them (plain footage under those lines). Worth a check against the report before publishing.
- Which two tanks burned is not marked anywhere (unknown from public sources); the Blender site outlines the whole terminal.
- Cutcheck: 0 flags (final render 4 Nov). Master -16.9 LUFS. Out: build/CASE13/out/WP13.mp4 + WP13_phone.mp4.
