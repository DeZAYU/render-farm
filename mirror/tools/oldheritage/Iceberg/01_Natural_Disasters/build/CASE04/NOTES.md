# ND04 — The street that washed away (Kesennuma, 11 March 2011)

Code: `_engine/src/cases/ND04.tsx` · devices in `_engine/src/dev/ND04_*.tsx` · output `out/ND04.mp4` (+ `_phone`).
VO: CASE04 take used continuously (it has no count word), split only at the 15 raws, at measured silences.
Music: Music 1 (-15 dB ≈ 10 LU under VO), out for the climax raw, back after. Raw sound = `media/<clip>_clean.wav` (rawclean: music found and removed in 73 s of the KES upload; MOY1/MOY2/CRV clean).

## Raws (cut-sheet cue order kept, dead air trimmed; source seconds)
KES 46.7 (queue below the roof, before) · KES 141.0-166.2 climax uncut (wave up the street, cars lifted) + 0.5x replay under the next line ·
KES 195 · 227.5 · 284 · 350 · MOY1 21.2 · MOY1 143.4 (cars float past) · MOY2 24 (containers) · CRV 20.6 (filmer's shoulder cropped) ·
KES 461.6 (smoke through the fence) · 524 · 594.3 · 686 (night fires) · 764 (night fires).

## Devices (new, registered in dev/REGISTRY.md)
- LockOn: "Pick one of those parked cars" — freeze on the Diamond Plaza lot, picture dims, white corner brackets close on one car.
- SinkLine: land drop of ~1 m before the wave — white shore cross-section over dark footage, 1 M bracket, sea level carried inland.
- CoastGlide: Kamaishi "further up the coast" — 3-D camera over a GSI satellite mosaic from Kesennuma to Kamaishi.
- ReachRing: the Asahi-cho fuel depot boxed on a GSI aerial, a ring grows to 2.5 km (scaled from 3.72 m/px) = how far tanks floated.
- Channel grammar: TitleCard, RedLabel (place/date/building), Aerial (Kesennuma Bay), Inset (Kamaishi evacuation-building sign).

## Sources
- Footage: KES https://youtu.be/xvJnC_Rvbcs (Hirotaka Oyama's camera), MOY1 https://youtu.be/y1xOQCmLegw, MOY2 https://youtu.be/_jWE4y8yVQQ, CRV https://youtu.be/Bc-aZWLvMpo.
- GSI (Geospatial Information Authority of Japan) tiles: `ort` (Kesennuma aerial), `seamlessphoto` (Sanriku coast) — https://maps.gsi.go.jp (credit 国土地理院).
- Photo: "釜石の津波避難ビル" (Kamaishi tsunami evacuation building sign, 2011), Wikimedia Commons, CC BY 2.0.

## Decisions / issues
- The 14-min graded KES file timed out Remotion's frame extraction on the loaded machine: every KES shot is cut into its own clip (`graded/kc/<from*100>.mp4`).
- Owner's zero-flag rule: the pre-wave footage is mostly fast handheld pans (cutcheck STUB on content). All VO shots were moved to measured calm windows
  (`dprof`/`winchk` in the scratchpad). The climax raw keeps its two real camera swings (source 150.8-157.4, 161.5-163.1) in the allow list.
- Night section: dark-to-dark hard cuts read as JUMP; they are blur-dips (designed, allowed).
- No pre-2011 aerial of the depot exists in GSI's free layers, so the "23 tanks" are not individually marked; the device marks the depot and the 2.5 km reach.
- Nothing needed blurring (no bodies visible in the footage).
