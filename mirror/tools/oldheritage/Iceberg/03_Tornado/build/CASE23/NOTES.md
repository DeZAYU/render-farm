# TOR23 — An hour under a tornado emergency · Elkhorn, Nebraska (26 Apr 2024)

Code: `_engine/src/cases/TOR23.tsx` · devices `_engine/src/dev/TOR23_*.tsx` · out `out/TOR23.mp4`, `TOR23_phone.mp4` (208.4 s)

## Edit
- TitleCard on ADAMS' wedge (src 452) → VO one take (the count is the sentence's subject: "Twenty-three started near…", kept) →
  six raws at the cut-sheet cues, dead air trimmed: R1 src 28–40 (touchdown, "Oh, it's on the ground there… there's one behind it"),
  R2 150–162 ("and it's on the ground"), R3 SLOAN 53–65 (grey wedge behind the trees, sirens), R4 205–226 ("there goes the debris…
  see the debris flying"; stops before the power-flash sparks at 233), R5 336–350 ("it's growing"), R6 the home's own lawn camera
  598–626 as the tornado arrives (climax, uncut), then a 0.5× optical-flow replay of 604.5–609 under "In Elkhorn it levelled a home…".
  Whose house it is is never said (cut sheet).
- Raw audio = `media/ad_a_clean.wav`, `ad_b_clean.wav`, `ad_c_clean.wav`, `sl_clean.wav` (rawclean: no music detected).
- Security-camera OSD clock framed out (ad_c shots pushed to ≥ 1.07 about 68 % height).
- Music: Music 5 at −13 dB, out under every raw.

## Devices (new, this case)
- LifeStrip (`TOR23_LifeStrip.tsx`): the tornado's whole life 3:30–4:31 PM as one strip under its footage (framed, leaning back in 3-D);
  it fills white, then the red tornado-emergency band sweeps 3:38 → 4:30 (IEM VTEC: emergency first in the warning-17 statement at
  3:38, re-issued with warning 22 at 3:41, which ran to 4:30), ticks at 3:38 / 3:41.
- TownChips (`TOR23_TownChips.tsx`): a 0–32.5 mi rail; as the VO names Waterloo, Elkhorn, Bennington, Blair and the Missouri, a NAIP
  chip of each place (DAT centre line drawn red through it) swings in and settles above the rail at its own mile; "HARRISON COUNTY,
  IOWA" at the end. (A flat map-ride version was dropped: TOR25's RibbonPath is the same idea two cases away.)
- PageMacro (`TOR23_PageMacro.tsx`): NWS Omaha PNS of 29 Jul 2024 ("…Tornado Upgraded to EF-4…", "estimated peak wind speed of
  170 mph") read flat at macro scale, sharp reading band, red rule drawn under the words.
- Slow replay of the impact (0.5×, minterpolate).

## Sources
- ADAMS https://youtu.be/CfDpN8jG0Oo (patio + the home's security cameras) · SLOAN https://youtu.be/R7nLejJKNtI (his title says May;
  no month on screen).
- NWS DAT FeatureServer (EF4, 32.49 mi, 1,900 yd, 20:30Z) · IEM VTEC OAX TO.W 17/22 statements · IEM PNSOAX 202407292048 ·
  USGS NAIP ImageServer.

## Issues / owner should know
- No public aerial of the Larimore homes was found (the NWS cites private high-res overhead photography); those lines run on the home
  cameras' damage footage, never labelled as Larimore.
- R6 lens is hit by debris (a dark blob crosses the lawn camera at ~155 s): it is the real moment, kept.

## 3 Nov raw audit (supersedes the edit above where they differ)
- Raws 6 -> 3: R1 12 s (23.2-35.2), R3 Sloan 12 s (51.25-63.25), R6 25 s (main, 83.15-108.15, src 601-626: the calm first 3 s
  trimmed). Removed R2 (after the tornado-emergency explanation), R4 (after Arbor Day / width), R5 (after the 61-minute track line).
  Duration 208.4 -> 158.4 s. PageMacro rule extended to cover "of 170 mph".
- R6's camera has no sound (ad_c.mp4 is digital silence). Its sound is built from real recorded SFX (`sfx_n2/real/`, `R6FX` in the
  code) timed to the picture: rain bed + wind gusts rising from calm, debris hits at src ~64-65 / 70-75, the lens hit (~82.9) and the big
  piece after it (~84). No music under it, no whooshes/synth.
