# ND13 — Driving through the Gatlinburg firestorm (cut sheet CASE 13)

Code: `_engine/src/cases/ND13.tsx` · out: `build/CASE13/out/ND13.mp4` (+ `_phone`) · ≈ 5:03 · VO `vor/CASE13.mp3` (no count word to drop: the take opens on the hand-off line "Hail comes and goes…"), split only at the 9 raws.

## Footage (decisions)
- `main__T9Qt1b3sVU` (Robert Mahorney, "driving through hell") is a **re-filmed copy of a screen with a drum-beat music track laid over it** (spectrogram: steady beat, constant −13 dB, silence after 2:42). Its sound is unusable and its picture is soft/tilted. Used **picture only, under the VO**, for its first 45 s (the roadside flames that no other upload has), zoomed 1.3× to hide the tilted black corners.
- `extra1_c_9h6Vi0ed0` ("John Smith", 3 subs) is the **same drive from the same car** (same dash GPS), cleaner and with its **real sound**, but only 400×230 on YouTube (no higher format exists). Upscaled lanczos + light unsharp to 1080p (`media/js.mp4`). All six "GAT"/"JS" raws come from it so every raw has its own sound; no moment is used twice between the two uploads.
- `extra2_c4Joyn2liys` (Angel Craig, Part 4, 1080p) — the three AC raws + the tail-light / town / burning-building shots. Family voices kept at −5 dB in raw 7, as the cut sheet asks.
- Raws trimmed from the cut sheet's ~30 s to 11–21 s each (dead driving removed); total raw ≈ 140 s of 5:03.
- Downloads tried: Chris Conte "aerial tour" = NewsChannel 5 package with anchor/reporter → deleted, not used. BackRoomKnox Chimney Tops hike (714 subs) = 360p with burned-in text → deleted, not used. YouTube later answered with a bot check; not bypassed.

## Devices (new, `_engine/src/dev/`)
- **RidgeStack**: NPS photos (Commons, PD) of the Chimney Tops 2 fire + CC0 photo of the twin peaks hung as framed planes in 3-D; camera flies through (lines "in plain view on a mountain for five days / Chimney Tops / stayed small").
- **EmberRun**: USGS NAIP × 3DEP hillshade relief in perspective; flight Chimney Tops → Gatlinburg, white line + drifting embers over the ridges, "6 MILES" (9.9 km measured).
- **GustGauge**: mph ruler: NWS forecast band 25–40 + gusts 60 (IEM NPWMRX, Mon 28 Nov) → red bar to the chief's 87 mph.
- **BulletinPair**: the two real EVIMRX bulletins (IEM archive) 9:03 PM / 11:47 PM as lit sheets in 3-D, issue-time lines marked red.
- Channel grammar: TitleCard, RedLabel (date, names, places), Inset (Dolly Parton), slow replay of the ember streaks (0.5×).

## Sources
- Footage: https://youtu.be/_T9Qt1b3sVU · https://youtu.be/c_9h6Vi0ed0 · https://youtu.be/c4Joyn2liys
- NPS / Commons: File:Chimney Tops 2 Fire.jpg (PD), File:East of Chimney Tops2 Fire 2016 12 03-14.38.22.002-CST.jpg (PD, NWCG), File:Chimney Tops viewed from Chimney Tops overlook, May 2017.jpg (CC0), File:Building burned down by wildfires, Gatlinburg, Tennessee, November 2016.jpg (CC BY 2.0, Tennessee National Guard / Maj. Randy Harris), File:Dolly Parton at 'Blue Smoke World Tour' in Knoxville.jpg (CC BY 2.0, Kristopher Harris)
- USGS NAIP + 3DEP hillshade (imagery.nationalmap.gov / elevation.nationalmap.gov)
- IEM: https://mesonet.agron.iastate.edu/wx/afos/p.php?pil=EVIMRX&e=201611290203 and …&e=201611290447; NPWMRX 28 Nov 2016 (forecast 20–40 mph, gusts up to 60 on the higher elevations; the VO's "25 to 40" is the script's figure)
- Music: Epidemic ambient Music 4 (−21.5 dB, ≈ −33 LUFS ≈ 8 LU under the VO), only under VO blocks.

## Cutcheck / known
- Allowed: designed glitch/blur-dip/whip windows; inside raws: AC ember shower + emergency lights (256–277 s), JS fire glare after the camera passes a dark object (47.2 s), JS mirror swing (126.3 s). These are the footage's own events.
- Fixed after the first render: RidgeStack background now cross-fades between planes; blur-dips added on two same-camera joins; 1-frame stubs at block joins (rounding) removed.
- Upscaled JS material is soft by nature (source is 400×230); it is the only copy of the drive with real sound.
