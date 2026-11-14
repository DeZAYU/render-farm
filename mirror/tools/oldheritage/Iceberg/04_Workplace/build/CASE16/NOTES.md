# WP16 · Twenty Four on Shift · Blue Rhino, Tavares, Florida (29 Jul 2013)
Code: _engine/src/cases/WP16.tsx · out: build/CASE16/out/WP16.mp4 (+ _phone)

## Edit (106.2 s = VO 87.2 + 19.0)
Title 0-4 | VO part 1 (take 0-13.89) | RAW 17.89-31.89 (across the street, src 34.0-48.0, own sound via rawclean: no music found) |
VO part 2 (take 13.89-end) @31.89, ends 105.1, hold to 106.2. One raw only. The 11th Hour clip's audio is never used (cut sheet: mute).
Music: Epidemic Music 1 at -16 dB from 25 s, out under the raw. SFX: impact_3 (soft) per stamp, boom_5 when the Blender vapour lights.

## Devices
- Blender yard (maps/shed.py): vapour.mp4 (200 f, haze spreading along the floor between caged cylinders, label PROPANE VAPOUR) and
  spark.mp4 (250 f, forklift drives in, spark at frame 194 on "spark", flame front through the vapour, label FORKLIFT).
- CitationStamps: OSHA settlement words typed, nine SERIOUS stamps on the count, $52,000 and 60 days boxed when spoken.

## Sources
- https://www.youtube.com/watch?v=dSFJ76NXv3Y (Jeffrey Hegarty), https://youtu.be/xuU8jhoLTj0 (The 11th Hour).
- Settlement wording: OSHA release 8 Dec 2015 as quoted by OHS Online https://ohsonline.com/articles/2015/12/09/blue-rhino-settles-florida-fire-case.aspx
  ("affirms nine serious and six other-than-serious citations", "penalties totaling $52,000", "abatement of all hazards within 60 days").

## Open
- The staffing-agency citation (Nov 2014) has no document on screen (no source fetched); footage only under that line.

## Finish (second builder, 4 Nov)
- shed.py: argv now ignores blender_run.sh's trailing `--cycles-device CPU` (the first full run crashed on it); haze density 4.5 -> 12 and
  height 0.55 -> 0.75 m (was invisible); fire emission gain x10 and fire light 9k -> 40k (flame front was not reading).
- Rendered maps/vapour.mp4 (200 f) + spark.mp4 (250 f) via render_bl.sh; dev/WP16_blLabels.ts generated from the labels json.
- Rendered out/WP16.mp4 (106.3 s). cutcheck: 8 JUMP flags, all exactly on planned shot boundaries (hard cuts between dark night clips), no fix needed.
