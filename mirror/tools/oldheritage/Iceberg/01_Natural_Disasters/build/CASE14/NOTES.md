# ND14 — The room that wouldn't stop moving (Mandalay, 28 Mar 2025) (cut sheet CASE 14)

Code: `_engine/src/cases/ND14.tsx` · out: `build/CASE14/out/ND14.mp4` (+ `_phone`) · ≈ 2:20 · VO `vor/CASE14.mp3` (opens on "Ten to one…", no count word), split only at the 4 raws.

## Footage (decisions)
- `main_K46en5mHEAM` (IMOU home camera, 25 fps; IMOU logo + date stamp kept as the cut sheet allows). In this file the shaking starts ≈ 27 s, the cabinet goes over ≈ 40 s, the camera is knocked to the ceiling 53–59 s and re-seated at 69 s — the cut sheet's timecodes (cabinet "by 1:07") do not match this copy, so raws were re-cut to the real events:
  R1 13.0–28.6 (still room → rumble → first jolt), R2 30.2–41.8 (swinging, woman crouches, cabinet falls), R3 44.0–68.4 (swinging, camera knocked), R4 69.4–80.0 (re-seated view: cabinet face-down).
- The camera's sound is quiet (≈ −45 dB before the quake): pre-gained +12 dB with a limiter (`media/room_a.m4a`), raws only.
- Slow replays (0.5×) of the cabinet falling and of the woman crouched, under "doesn't stop quickly" / "for the family in this room".
- **GP Energy Myanmar CCTV of the Sagaing Fault slipping near Thazi** (Commons, public domain) for "two blocks of crust sliding sideways" — the real thing on camera.
- YouTube "2025 Sagaing Earthquake Archive" clips (Sky Villa collapse etc.) not used: archive/re-upload channel, and YouTube then answered with a bot check (not bypassed). Sky Villa therefore has no footage → StoreyStack device.

## Devices (new, `_engine/src/dev/`)
- **FaultBlock**: NASA Blue Marble, fault traced N–S past Mandalay → the map tilts into two crust blocks sliding right-laterally.
- **RuptureClock**: Blue Marble, rupture runs north and south from the USGS epicentre at one speed with a 0→85 SEC counter (~470 km drawn); second use (other mode, far apart): dashed epicentre → Bangkok line.
- **StoreyStack**: this 3rd-floor home vs the 12-storey Sky Villa, whose floors pancake (numbers are the VO's).
- ChipLift page: USGS event page (M 7.7 chip; 10.0 km depth).
- Channel grammar: TitleCard, Aerial (Mandalay box on Blue Marble), Inset (USGS ShakeMap), RedLabels.

## Sources
- Footage: https://youtu.be/K46en5mHEAM · Commons File:Rupture near Thazi.webm (PD, GP Energy Myanmar)
- USGS: https://earthquake.usgs.gov/earthquakes/eventpage/us7000pn9s/executive · Commons ShakeMap (PD, USGS)
- Commons: File:Collapsed Ava Bridge (2).jpg (CC BY-SA 4.0, Ninjastrikers); File:Military and first responders work near the collapsed State Audit Office building in Bangkok…jpg (PD, USAF); File:Catastrophic earthquake in Myanmar (Copernicus 2025-03-31).png (© EU, Copernicus EMS, attribution; logos/legend cropped off) — used for the death-toll line (Pha Duu, nearly every house graded destroyed).
- NASA GIBS Blue Marble (wide + near Mandalay).
- Music: Epidemic ambient Music 1 (−15 dB ≈ −33 LUFS), VO blocks only.

## Cutcheck / known
- Allowed: designed transitions + the three shaking raws (the camera's own violent motion is the moment).
- Fixed after the first render: 1-frame stub at a block join; hard cut page → map now a whip.
- Death-toll line shows a Copernicus damage map of a village (Pha Duu), not Mandalay itself — best real material available; labelled with the village name.
