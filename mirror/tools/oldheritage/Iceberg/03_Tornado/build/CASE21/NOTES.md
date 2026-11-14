# TOR21 — The courthouse tower · Marshalltown, Iowa (19 Jul 2018)

## 3 Nov raw audit (owner: raws only at incident moments) — supersedes the edit below
Raws 5 -> 3: R1 (23.4-33.4, 10 s), R2 (45.5-57.5, 12 s), R4 main (71.25-87.25 sound, 16 s; the same take runs on under "It's heading out
over the rest of town now." to 89.52). Removed R3 (after the EF3 survey stats, near-dup "over the town") and R5 (trees thrashing, only a
2.3 s line from R4); "heading out" now runs straight into the clock-tower line. Music 4 back under the Lennox and aftermath VO. 136.92 s.
Cutcheck: 37 cuts, 0 flags (designed transitions +-0.35 s + the 4:37 bulletin slide-in 40.4-41.0). Rendered 3 Nov 05:47.

Code: `_engine/src/cases/TOR21.tsx` · devices `_engine/src/dev/TOR21_*.tsx` · out `out/TOR21.mp4`, `TOR21_phone.mp4` (161.8 s)

## Edit
- TitleCard on Wegner's wedge (src 128 s) → VO one take, split only at the 5 cut-sheet raws (after "twenty-five past four",
  "issues", "downtown", "the lot", "rest of town now").
- Raws: R1 src 106.5–116.5 and R2 122–134 are SILENT in the upload (his audio is muted 65–180 s) → real rain/wind beds
  (`sfx_n2/real`), clipped to the raw windows. R3 src 187.6–199.5, R4 340–358.3 (the cone over the street / brick building, continues
  muted under "It's heading out over the rest of town now."), R5 375–388 (trees thrashing, "holy moly"). R5 originally started at
  369.5 but that included the camera flipping onto the dashboard (cutcheck STUBs) — trimmed out; R3 start moved past a camera jolt.
- Raw sound = `media/weg_d_clean.wav`, `weg_e_clean.wav` (rawclean: no music detected, original kept).
- Music: Music 4 at −21.5 dB (≈ −33.5 LUFS under a −26 VO), out under the sound raws.

## Devices (new, this case)
- OutlookPage (`TOR21_OutlookTracks.tsx`): SPC Day-1 tornado outlook 12:59Z (2 % over eastern Iowa) as a lit plate tilted in 3-D,
  white bracket on the 2 %; for "twenty-two tornadoes / number twenty-one is Marshalltown" the card turns over to the SPC storm
  reports map of 19 Jul with the Iowa cluster bracketed. (A satellite + 22-track version, `DayTracks`, was built but dropped because
  TOR20's OutbreakClock is the same idea one case away.)
- BulletinSheet (`TOR21_Bulletins.tsx`): the real NWS DMX bulletins (IEM text archive) as sheets in 3-D: 3:54 PM warning
  ("SOURCE...Radar indicated rotation."), then the 4:37 PM warning stacked on it ("...TORNADO EMERGENCY FOR MARSHALLTOWN...",
  "TORNADO DAMAGE THREAT...CATASTROPHIC").
- SurveySwath (`TOR21_SurveySwath.tsx`): NWS DAT survey line + EF0/EF2/EF3 polygons (event 19Jul2018_Tor18) on NAIP lying in 3-D.
- Grammar: RedLabel (date, place, Lennox, courthouse), Inset (NWS courthouse photo), Aerial ×2 (NAIP native-res crops: rebuilt Lennox
  plant "JULY 2023", courthouse square "NOVEMBER 2022").

## Sources
- Main: Jason L. Wegner https://youtu.be/NBm8If2Ri4M (burned-in captions at 9–16, 62.5–68.5, 99–105.5, 393–394, 403–404.5 avoided).
- Downloads (`footage/14_*/more/`, personal channels): Tim Kilbride drone 7-20-2018 https://youtu.be/3bEpNSMw6Rg ·
  Sam Rockwell drone https://youtu.be/ihP23VvNR6A · Mid Iowa Rotor Wing "Lennox Destruction" https://youtu.be/cKAKblhNJcs (corner logo
  framed out: scale ≥ 1.32 about 30 %/30 %) · Wegner "Court House Top Toppled" https://youtu.be/bN3CgZbAhD8 (phone filming a monitor;
  not used).
- SPC outlook https://www.spc.noaa.gov/products/outlook/archive/2018/day1probotlk_20180719_1300_torn.gif · SPC reports
  https://www.spc.noaa.gov/climo/reports/180719_rpts.gif · IEM bulletins pid 201807192054-KDMX-WFUS53-TORDMX and
  201807192137-KDMX-WFUS53-TORDMX · NWS DAT FeatureServer (layers 1/2) · NCEI Storm Events 2018 (track facts, 22 tornadoes =
  24 county segments − 2 county splits incl. 1 in MN) · USGS NAIP ImageServer · NWS DMX courthouse photo (Wikimedia Commons, PD)
  https://commons.wikimedia.org/wiki/File:Marshall_County_Courthouse_Damage.jpg

## Issues / owner should know
- No free post-2022 photo of the restored courthouse exists; "rededicated in November 2022" is shown on the latest NAIP aerial.
- "Set it beside the house in Kentucky" uses this case's own quiet-afternoon footage (material never carries across cases).
- The Wikimedia download request carried a contact address in its User-Agent (the account e-mail) — harmless, noted for honesty.
- Some stills timed out under heavy machine load (load avg ~200); the full render is the check.

## Render (2 Nov, 20:23)
`out/TOR21.mp4` 161.9 s, −16 LUFS, + phone copy. Cutcheck: 43 cuts, 0 flags (designed windows ±0.35 s around each glitch/blurDip/whip, plus 40.40–41.00: the 4:37 PM bulletin sheet's own slide-in from below, which cutcheck reads as a 1-frame STUB).
