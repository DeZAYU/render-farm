# DC15 — The Mudslide on Olive Mill Road (Montecito, California, 9 January 2018)

Code `_engine/src/cases/DC15.tsx`, master `out/DC15.mp4` + `out/DC15_phone.mp4`. Duration 160.5 s (title 4 s, VO 102.6 s, raws 53.0 s, hold 0.9 s).
Title card reads "MUDSLIDE ON OLIVE MILL ROAD" (script: "THE MUDSLIDE ON OLIVE MILL ROAD"): the full title runs edge to edge at the brand
TitleCard's fixed size and can't be wrapped from the case file; "THE" dropped rather than editing brand.tsx.

## Timeline (VO = one take, split at the three raws, all at sentence ends)
| T (s) | what |
| --- | --- |
| 0–4 | TitleCard on the graded first frame (sign on the wet road) |
| 4–40.01 | VO A: their dashcam (JANUARY 9, 2018), NorthLine on NAIP (OLIVE MILL ROAD, MONTECITO), ThenNow Landsat Nov 2017 → Jan 2018 (the burn scar), rain in the lights, label WILL CLOTWORTHY · MIKE FABILLA on their camera, DarkAhead on the first frame |
| 40.01–60.81 | **RAW 1 (main)** src 1.2–22.0 (20.8 s): the flow comes out of the dark, hits, the car turns, trees sweep past, branches on the glass, carried in the dark. Source silent → rain bed, wind, sub drop/impacts/metal timed to the picture |
| 60.81–82.62 | VO B: 0.5x replay of the turn, DVIDS boulders in a front yard, the carried section (lifted), dark windscreen |
| 82.62–101.82 | **RAW 2** src 111.8–131.0 (19.2 s): the radio call that got through ("very active mudslide coming down Olive Mill towards the 101 … it overtook our vehicle as we were heading north … barely escape … down by the freeway now …") |
| 101.82–120.35 | VO C: the stationary cruiser, driving out with lights on ×2, an officer in rain gear in the road |
| 120.35–133.35 | **RAW 3** src 63.5–76.5 (13 s): lights and siren, "Get out of here! Get out of here! Get out of here! Go! Go!" (pulled down 12 dB, the source is very loud) |
| 133.35–160.5 | VO D: officer in the water, DVIDS: street under mud, boulders + buried truck, closed road; ColumnDrop on KSBY ("slow down, slo down…"), 0.5x replay of the road ahead ending as the flow arrives on "hit them" |

Raw placement: RAW 2 follows "…floating down Olive Mill Road." (the call that finally got through), RAW 3 follows "One of them got out and
shouted at people to get inside." The shout in the source (0:70) comes before the radio call (1:52) — the raws keep the VO's order, not the clip's.
The swearing at 3:18–3:23 is outside every window (not used).

## Devices (REGISTRY.md)
- NorthLine — NAIP plane in 3-D, white line drawn up Olive Mill Road from the 101 (OSM geometry via Nominatim).
- DarkAhead — held first frame, pool of light on the dark stretch beyond the sign, raw runs from that frame.
- ColumnDrop — the KSBY page as one dropping column, quote line left lit. No colour.
- Brand: TitleCard, RedLabel ×3, ThenNow (NASA Landsat pair), glitch + blur-dip. No Inset.

## Sources
- Dashcam: CHP release (25 Jan 2018) via edhat, https://www.youtube.com/watch?v=JNl2wUIynvY — used 0–185 s. The picture is pillarboxed: graded/main169.mp4
  is the graded picture cropped to 16:9 (x 262–1654, y 148–931 of 1920x1080) so there are no side bars; keys were mapped onto it in code (T()).
- Page: KSBY "CHP officers remember night of mudslide" (10 Jan 2019), https://ksby.com/news/2019/01/09/chp-officers-remember-night-of-mudslide
  (shots/ksby.png; logo, headline, posted line, the two Fabilla paragraphs; ads/share/video left out).
- NASA Earth Observatory "Deadly Debris Flows in Montecito" (image 91573, Landsat 8 OLI, 23 Nov 2017 / 10 Jan 2018, public domain), large versions cropped
  to the coast range above Montecito/Carpinteria → graded/eo_then.jpg, eo_now.jpg.
- USGS NAIP (public domain), centred on Olive Mill Road → graded/naip.jpg (assets/naip2.jpg).
- DVIDS (US government, public domain): 4086279 and 4086280 (USACE, boulders in Montecito, 18 Jan 2018), 4073956 (Cal Guard, mud-covered Montecito road,
  11 Jan 2018), 4071736 (Air National Guard, mud on a closed street, 10 Jan 2018). 4071736 is not confirmed to be US 101; it sits under "The 101 stayed
  shut under mud" without a label.
- Facts: research/outline.md §15. 23 deaths kept as the wider disaster ("Nobody died in this shot" is in the VO).
- Music: Epidemic "Music 1" −15.5 dB, ducked under the raws. SFX: sfx_n2/real rain/wind/impacts/metal, glitch, paper.

## Checks
- The light bar flashes from src 61 on (srccuts lists ~every 0.3–0.7 s); raws 2 and 3 are allowed windows for cutcheck; VO shots from that part are
  cropped right of the light-bar glare where possible.
- Stills checked after a blind first pass: pillarbox bars were visible on most dashcam shots → cropped source; aerial plane edge showed → re-fetched
  NAIP centred on the road; title edge-to-edge → shortened.
- Final render 14 Nov 09:52: cutcheck 0 flags. The remaining source events were checked on frames and allowed: the CHP tape's own horizontal tearing
  at the hit (61.4, 159.1–159.5 in the replays) and light-bar flashes (109.7, 114.9). Duration 160.6 s.
- Raw levels: first render had the radio raw 5 dB over the voice → radio −1 dB, shout −14 dB; master sections VO ≈ −16…−18, R2 −16.2, R3 −14.1 LUFS.
