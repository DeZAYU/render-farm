# TOR07 — Radium Springs, Albany, Georgia (22 Jan 2017, EF3) — "Eight minutes in the hall bathroom"
Code: `_engine/src/cases/TOR07.tsx`. Output: `out/TOR07.mp4` (+ `_phone`). Music: Epidemic ambient Music 4 (-22 dB).

## Structure
TitleCard → VO (intro, MinuteStrip) → RAW (wind rising) → VO → RAW (white-out) → VO → RAW (roar) → VO "still in the hall bathroom" →
RAW (the pine snaps, 15 s) → slow replay + CountyCrossings → RAW → VO → RAW → outcome. Six raws in cut-sheet order.
The cut sheet's raw timecodes (8:20-14:32) did not match the clip's content; windows were chosen by picture + measured loudness:
the roar builds from 480 s, white-out 548-556, the pine snaps 566-570, debris 579-590, broken trunks after 590.
One source only, so windows are separated by reframes and blur-dips; the clip's opening (the hallway, 0-48 s) is used for the bathroom lines.

## Devices (new)
- MinuteStrip (`dev/TOR07_MinuteStrip.tsx`): one real frame per minute (-8:00 … 0:00 before the white-out) as prints receding in 3-D.
- CountyCrossings (`dev/TOR07_CountyCrossings.tsx`): NWS swath map travelled NE; white bar + label at the Worth / Turner / Wilcox lines.
- SiteHop (`dev/TOR07_SiteHop.tsx`): NAIP aerial, Procter & Gamble plant then Marine Corps Logistics Base (OSM positions).

## Sources
- WINDOW https://youtu.be/cWArodUunWU (the only clip; no music detected by rawclean).
- Wikimedia Commons: NWS swath map, NWS Ashburn EF3 home, NWS church (Zion Church Road per NCEI), NASA/NOAA GOES image — all public domain.
  "Baker Co Funnel 01-22-17 1512.jpg" by Spotter31768, CC BY-SA 4.0 (needs credit in the description).
- USGS NAIP (east Albany), NCEI Storm Events 2017 narrative (counties, MCLB, P&G, church), OSM/Nominatim positions.

## Not solved
- Aftermath videos (Christopher Hinson drone MFXDNcZ5tEY, Albert Hall aerial QynQvvr4_ns, Michael Fincher ldw558V0J2U) were blocked by
  YouTube's bot check; Harris Road / MCLB lines therefore use the NWS swath and NAIP instead of footage. Live Storms Media avoided (agency).
- Harris Road's exact position unknown: its shot is the swath map at Albany (box, label "ALBANY"), not a named road.

## Final render (3 Nov, 00:22)
- Added a blur-dip at 33.44 (win -> calm, same camera: was a JUMP). Master `out/TOR07.mp4` + `_phone`: cutcheck 0 flags.

## 3 Nov raw audit (owner: raws only at incident moments, no near-dups)
- 6 -> 2 raws. Kept RAW 1 (wind rising, 18.6-28.6, 10.0 s) and the pine-snap raw, now ONE main raw 52.07-77.07 (25.0 s, window source
  563-588: the snap, then the debris against the glass; no source cut inside). Removed the white-out, roar, debris and back-side raws
  (each sat after an explanation line). VO take runs on across the joins. Duration 141.3 s (was 177.3).
- Inset used once now (Zion church); the Ashburn photo is a full-frame pull-out with a RedLabel. Glitch kept on the GOES -> Ashburn cut.
- Code backup: `_engine/_bak_rawaudit/TOR07.tsx`.
