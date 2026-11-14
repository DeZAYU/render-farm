# TOR08 — Lužice / Moravská Nová Ves, South Moravia (24 June 2021, IF4) — "Inside a village in South Moravia"
Code: `_engine/src/cases/TOR08.tsx`. Output: `out/TOR08.mp4` (+ `_phone`). Music: Epidemic ambient Music 5 (-13 dB).

## Structure
TitleCard → RAW HOUSE (street, rain building) → VO → RAW HOUSE (storm coming down the street) → VO → RAW HOUSE (debris fills the sky,
15 s, then blur-dip to the swing across the street, 8.5 s; the source's own cut at 128.7 is skipped) → VO → RAW GARDEN (labelled
Moravská Nová Ves) → VO → RAW GARDEN → VO (PhotoTally) → RAW GARDEN → outcome. Raws in cut-sheet order and position.

## Devices (new)
- PhoneWindow (`dev/TOR08_PhoneWindow.tsx`): the vertical Lužice clip whole in a white frame over a bright blurred copy, slight 3-D turn.
- ScarDevelop (`dev/TOR08_ScarDevelop.tsx`): NASA HLS (Sentinel-2) 19 June vs 29 June 2021; the corridor along the track develops into the
  post-storm image Břeclav → Pánov. The real change inside the corridor is lifted slightly (difference > threshold, 55 % white) to read on a phone.
- PhotoTally (`dev/TOR08_PhotoTally.tsx`): Lužice / Moravská Nová Ves / Mikulčice photos, destroyed houses counted as squares (17 / 31 / 62).
- Church clock: the MNV church photo, pushed in from the whole tower to the clock face.

## Sources
- HOUSE https://youtu.be/WFRXZ_a28Gk · GARDEN https://youtu.be/oeqdd3-REZc
- NASA GIBS HLS_S30 2021-06-19 / 2021-06-29 (public domain). Village positions: OSM Nominatim.
- Wikimedia Commons photos — CC BY-SA 4.0, credit required in the video description:
  - zoo: Bažantnice (Hodonín) after tornado strike 2021-07-10 1791.jpg — Martin Strachoň, CC BY-SA 4.0 (https://upload.wikimedia.org/wikipedia/commons/b/b5/Ba%C5%BEantnice_%28Hodon%C3%ADn%29_after_tornado_strike_2021-07-10_1791.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original)
  - roofs: Hrušky after 2021 South Moravia tornado strike (01).jpg — Tadeáš Bednarz, CC BY-SA 4.0 (https://upload.wikimedia.org/wikipedia/commons/7/73/Hru%C5%A1ky_after_2021_South_Moravia_tornado_strike_%2801%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original)
  - donations: Hrušky after 2021 South Moravia tornado strike (03).jpg — Tadeáš Bednarz, CC BY-SA 4.0 (https://upload.wikimedia.org/wikipedia/commons/c/ca/Hru%C5%A1ky_after_2021_South_Moravia_tornado_strike_%2803%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original)
  - army: Hrušky after 2021 South Moravia tornado strike (08).jpg — Tadeáš Bednarz, CC BY-SA 4.0 (https://upload.wikimedia.org/wikipedia/commons/c/c2/Hru%C5%A1ky_after_2021_South_Moravia_tornado_strike_%2808%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original)
  - hrusky_church: Hrušky after 2021 South Moravia tornado strike (16).jpg — Tadeáš Bednarz, CC BY-SA 4.0 (https://upload.wikimedia.org/wikipedia/commons/3/3a/Hru%C5%A1ky_after_2021_South_Moravia_tornado_strike_%2816%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original)
  - luzice_roofs: Lužice after 2021 South Moravia tornado strike (07).jpg — Tadeáš Bednarz, CC BY-SA 4.0 (https://upload.wikimedia.org/wikipedia/commons/c/cc/Lu%C5%BEice_after_2021_South_Moravia_tornado_strike_%2807%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original)
  - luzice_street: Lužice after 2021 South Moravia tornado strike (22).jpg — Tadeáš Bednarz, CC BY-SA 4.0 (https://upload.wikimedia.org/wikipedia/commons/a/ad/Lu%C5%BEice_after_2021_South_Moravia_tornado_strike_%2822%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original)
  - car: Mikulčice after tornado strike 2021-07-10 2060.jpg — Martin Strachoň, CC BY-SA 4.0 (https://upload.wikimedia.org/wikipedia/commons/6/6b/Mikul%C4%8Dice_after_tornado_strike_2021-07-10_2060.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original)
  - walls: Mikulčice after tornado strike 2021-07-10 2089.jpg — Martin Strachoň, CC BY-SA 4.0 (https://upload.wikimedia.org/wikipedia/commons/b/b4/Mikul%C4%8Dice_after_tornado_strike_2021-07-10_2089.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original)
  - tarp: Mikulčice after tornado strike 2021-07-10 2113.jpg — Martin Strachoň, CC BY-SA 4.0 (https://upload.wikimedia.org/wikipedia/commons/b/b1/Mikul%C4%8Dice_after_tornado_strike_2021-07-10_2113.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original)
  - rescue: Moravská Nová Ves after 2021 South Moravia tornado strike (05).jpg — Tadeáš Bednarz, CC BY-SA 4.0 (https://upload.wikimedia.org/wikipedia/commons/b/b1/Moravsk%C3%A1_Nov%C3%A1_Ves_after_2021_South_Moravia_tornado_strike_%2805%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original)
  - mnv_street: Moravská Nová Ves after 2021 South Moravia tornado strike (07).jpg — Tadeáš Bednarz, CC BY-SA 4.0 (https://upload.wikimedia.org/wikipedia/commons/4/43/Moravsk%C3%A1_Nov%C3%A1_Ves_after_2021_South_Moravia_tornado_strike_%2807%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original)
  - mnv_clock: Moravská Nová Ves after 2021 South Moravia tornado strike (38).jpg — Tadeáš Bednarz, CC BY-SA 4.0 (https://upload.wikimedia.org/wikipedia/commons/e/e0/Moravsk%C3%A1_Nov%C3%A1_Ves_after_2021_South_Moravia_tornado_strike_%2838%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original)
  - solar: Pánov (Hodonín) after 2021 South Moravia tornado strike (04).jpg — Tadeáš Bednarz, CC BY-SA 4.0 (https://upload.wikimedia.org/wikipedia/commons/0/00/P%C3%A1nov_%28Hodon%C3%ADn%29_after_2021_South_Moravia_tornado_strike_%2804%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original)
  - crane: Mikulčice after tornado strike 2021-07-10 2097.jpg — Martin Strachoň, CC BY-SA 4.0 (https://upload.wikimedia.org/wikipedia/commons/e/e3/Mikul%C4%8Dice_after_tornado_strike_2021-07-10_2097.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original)
  - mnv_rubble: Moravská Nová Ves after 2021 South Moravia tornado strike (02).jpg — Tadeáš Bednarz, CC BY-SA 4.0 (https://upload.wikimedia.org/wikipedia/commons/7/7e/Moravsk%C3%A1_Nov%C3%A1_Ves_after_2021_South_Moravia_tornado_strike_%2802%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original)
  - mik_house: Mikulčice after tornado strike 2021-07-10 2105.jpg — Martin Strachoň, CC BY-SA 4.0 (https://upload.wikimedia.org/wikipedia/commons/6/66/Mikul%C4%8Dice_after_tornado_strike_2021-07-10_2105.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original)

## Audio / blur
Raw sound = rawclean.py output (HOUSE: music removed at 143-145 and 156-159 s, outside the used raw windows; GARDEN none).
Czech speech in the raws not transcribed (no Czech model available); nothing flagged by ear-independent checks. No injured people or bodies shown.

## Not solved
- YouTube bot check blocked further downloads; aftermath is from Commons photographs (two photographers), not video.
- "D2 motorway closed" line plays over the garden after the storm (no motorway footage/photo found).

## Final render (2 Nov, 21:57)
- House raw 3 now runs from source 130.3 (≥ 0.7 s after the source cut at 129.53) and ends at 87.55, before the phone goes black (was a STUB).
- "Six people were lost" shot moved from house.mp4 168 s (the phone was covered: black) to 172 s (debris swirling on the window glass).
- Master `out/TOR08.mp4` + `_phone`: cutcheck 0 flags.

## 3 Nov raw audit (owner: raws only at incident moments, no near-dups; fill framing overused)
- Removed the garden raws "trees bending" and "the wind tearing" (after the car-thrown / masonry-walls explanation, near-dups of the
  garden raw). Raws now: 4.0-14.0 house street (10.0), 31.6-43.6 house approaching (12.0), 64.4-87.55 house climax + opposite
  (MAIN 23.15, one run), 100.4-112.4 garden (12.0). Duration 191.1 s (was 214.6).
- Fill variety: 5 house shots are now full-frame crops of the vertical clip (`look: "crop"`), one is the new PhoneEcho (same clip twice
  in depth, `dev/TOR08_PhoneWindow.tsx`), the raws and the rest keep PhoneWindow. No 5-in-a-row of one framing.
- Code backup: `_engine/_bak_rawaudit/TOR08.tsx`.
