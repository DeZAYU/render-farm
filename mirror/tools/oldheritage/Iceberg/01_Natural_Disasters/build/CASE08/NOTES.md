# ND08 — The avalanche hits Everest Base Camp (25 Apr 2015)

Code: `_engine/src/cases/ND08.tsx` · out: `out/ND08.mp4` (+ `_phone`) · 57 s

## Structure
TitleCard ("THE AVALANCHE AT BASE CAMP", the clip's own tents) → VO 1 over two devices → RAW 1 (ebc 0.3–6.8: the cloud pouring off the
mountain, its own sound) → "The yellow tents are the camp." over ebc 14.25–16.0, which runs straight on (no cut) into RAW 2 (ebc 16.0–34.0:
the cloud reaching the tents, the camera ducking; own sound) → the outcome on Pumori in clear weather, slow push onto the face.
No slow motion anywhere (cut sheet). ebc 7–12 (a finger over the lens) and the inside-the-tent frames after the 34.1 s source cut are never used.

## Devices (new)
- ND08_QuakeReach: NASA Blue Marble shaded relief (GIBS): opens on Everest ("didn't start on Everest"), camera swings 222 km west to the
  USGS Gorkha epicentre (label GORKHA, 11:56 AM; date APRIL 25, 2015), true-scale shaking fronts (ellipses corrected for the
  equirectangular plate) roll east until one reaches Everest and its pin flares. Motion blur during the swing (cutcheck had flagged
  the fast pan as stub cuts in the first render; swing slowed + blurred).
- ND08_PeakFall: real night photo of EBC tents under Pumori, two parallax depth layers, fall line traced from the face toward the tents,
  PUMORI then EVEREST BASE CAMP named.

## Sources
- Clip: https://youtu.be/ChiQt5HU5oQ (Raquel Sharp repost; filmer "a climber at base camp", not named on screen). 640x352 only.
- Photos (Wikimedia Commons): "Lit Tents of Seven Summit Treks seen at Everest Basecamp, background Pumori mountain" (Iamthanes,
  CC BY-SA 4.0, 2018); "Everest Base Camp view" (Shivaexcursion16, CC BY-SA 4.0, 2017). Credit them in the description.
- NASA GIBS BlueMarble_ShadedRelief_Bathymetry (public domain); epicentre 28.231 N 84.731 E (USGS).
- Raw audio cleaned with rawclean.py (no music detected; original kept).

## Could not solve
- No other angle or aftermath footage: YouTube's bot check blocked yt-dlp (not bypassed); the known Kobusch clip is ViralHog-licensed.
  So the outcome line sits on a real photo of Pumori, not on aftermath footage. Sentinel-2 imagery of the Khumbu was tried for a fall-line
  map but snow saturates it; dropped.
