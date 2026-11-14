# ND05 — The night the ravines came through Aldaia (Valencia, 29 Oct 2024)

Code: `_engine/src/cases/ND05.tsx` · devices `_engine/src/dev/ND05_*.tsx` (+ `ND05_ravines.ts` data) · output `out/ND05.mp4` (+ `_phone`).
VO: CASE05 take continuous, split only at the 8 raws (measured silences; the srt runs ~0.3 s late around 75 s, split placed in the real gap).
Music: Music 4 (-21.5 dB), dipped to silence under every raw (each raw is the street's own roar), back after. Raw sound = `media/ald_clean.wav` (rawclean: no music found).

## Raws (cue order, dead air trimmed; source seconds of ALD)
9.55 street at night · 20.5 cars lifted and carried · 49.0 torrent under the lights · 70.0 the garage filling (loud) · 90.8 street as a river ·
130.1 white car carried · 160.1 cars jammed, tail lights · 190.0 street still running.

## Devices (new, registered)
- RavineTrace (3 views): Barranco de la Saleta and Barranco del Poyo drawn from OpenStreetMap geometry on Spain's PNOA orthophoto;
  Aldaia pin / pulled back to Turís (the record rain gauge) / down the Poyo to Paiporta.
- CarLift: NWS "about 30 cm of moving water floats most cars" — side view to scale, 30 CM bracket, tyres leave the road, car carried off.
- EveningClock: Poyo over its banks ~18:30 -> ES-Alert 20:11 on one clock face, swept sector in red.
- GaugeStaff: the Poyo gauge's last reading — water to 15.2x the top warning level (2,282 m³/s), then the staff is carried away.
- Inset (brand) portrait of Carlos Mazón; RedLabels for date, name (Antonio Fernández, Aldaia), places.

## Sources
- Footage: https://youtu.be/5T_CYK_g62M (Antonio Fernández).
- PNOA orthophoto © IGN/CNIG, CC BY 4.0 (tms-pnoa-ma.idee.es). Courses: © OpenStreetMap contributors (ODbL), via Overpass.
- Photo: "Carlos Mazón 2025 (cropped).jpg", José Jordan / European Union 2025, EC Audiovisual Service, CC BY 4.0 (Wikimedia Commons).

## Notes
- All shot windows checked against cutcheck rules on the source (no content flags); garage/raw windows moved to the cut sheet's cue times.
- The man wading at ALD 82 is unhurt and only seen from above at night; no blur needed.
- One Wikimedia download request was sent with a User-Agent that included the account email by mistake; not repeated.
- 3 Nov: cutcheck on the 22:23 master flagged a JUMP at 137.7 s (a source cut at ALD 182.77 inside the EveningClock's blurred background); background moved to ALD 189.0 (cut-free 10.5 s, shown only blurred/dark under the clock) and re-rendered.
