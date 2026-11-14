# DC16 — Thirteen Seconds at the Crossing (Brook Park, Ohio, 10 March 2016)

Code `_engine/src/cases/DC16.tsx`, master `out/DC16.mp4` + `out/DC16_phone.mp4`. Duration 105.7 s (title 4 s, VO 77.4 s, raw 23.4 s, hold 0.9 s).

## Timeline (VO = one take, split once, at a sentence end)
| T (s) | what |
| --- | --- |
| 0–4 | TitleCard "THIRTEEN SECONDS / AT THE CROSSING" on the graded dashcam frame (src 12) |
| 4–47.07 | VO A: the cruiser in the rain (BROOK PARK, OHIO), one continuous move into the crossing and its flashing signal (MARCH 10, 2016), the van 0.6x, the gate/lights 0.5x, held frame on the van's front at the rail, Boga at the open door 0.42x, RunHold |
| 47.07–70.47 | **RAW 1 (main)** src 19.6–43.0 (23.4 s): Duncan runs to the van, walks Boga off, the release cuts to its full view (23.9, the clock appears), he turns back, the train hits the van (35.6, stamp 16:15:43) and shoves it away, freight cars. Source is SILENT: rain bed, crossing bell, horn, steps, impact/metal/boom timed to the picture |
| 70.47–105.7 | VO B: StampSplit (13 s by the camera's clock), PageSlide on WHDH ("20 seconds"), the release's own slow-motion replay to the impact, the van shoved down the line, the two men at the roadside 0.66x, freight cars passing |

## Devices (REGISTRY.md)
- RunHold — held frame before he gets out, a lane of colour to the van, then the light and camera slide to the camera's date/time stamp corner.
- StampSplit — officer at the van | the train hitting it, the right frame pushes into its own clock 16:15:43 (nothing typed).
- PageSlide — WHDH page as a card in 3-D; thin red rule under "20 seconds" only.
- Brand: TitleCard, RedLabel ×2, glitch + blur-dip. No Inset.

## Sources
- Dashcam: Brook Park PD release (Facebook, 15 Mar 2016) via Tony Donald (93 subs), https://www.youtube.com/watch?v=NDZwik41ibo — 640x360, upscaled
  (lanczos + light unsharp) to 1080p; used 0–61.3 s (first view, full view, the release's own slow replay). The full repeat after 1:01 not used.
- Page: WHDH 7News / NBC News Channel, "Ohio officer's dash cam captures train crushing van stuck on tracks" (16 Mar 2016),
  https://whdh.com/news/ohio-officers-dash-cam-captures-train-crushing-van-stuck-on-tracks/ (shots/whdh.png; header band with logo/headline/date
  and the four paragraphs; nav, ads and the syndication copyright line left out — built by CASE14/shots/sheets.py).
- SFX downloaded (credit in the description): "Railroad crossing bell" (Wikimedia Commons, Brylon Terry / uploader Fabripaz, CC BY-SA 4.0),
  https://commons.wikimedia.org/wiki/File:Railroad_crossing_bell-Brylon_Terry-1551570865.wav → media/bell.wav;
  "Sound of American Train Horn Nathan Airchime K5LA" (Wikimedia Commons, WeenyBeany, CC BY 4.0),
  https://commons.wikimedia.org/wiki/File:Sound_of_American_Train_Horn_Nathan_Airchime_K5LA.ogg → media/horn.wav. Others from sfx_n2/real (Pixabay).
- Music: Epidemic "Music 4" −22 dB, ducked under the raw.
- Facts: research/outline.md §16. Boga named as reported, no labels on him; "near Route 237" (no street named).

## Notes / limits
- The officer reaching the van (src ~22) is in the release's first, zoomed view where the stamp's seconds are cut off; the first full stamp is
  16:15:31 (src 23.9). StampSplit therefore shows only the impact clock (16:15:43) read off the camera, and the VO's "about 13 seconds" is not
  contradicted on screen.
- No aerial: the exact crossing isn't named in any report (K4's "Eastland Road" unconfirmed), so no place box was drawn.
- Opening first version zoomed into the date stamp and RunHold zoomed into the same corner → the opening zoom removed, date given as a label.
- Cutcheck (render 14 Nov 08:56): 0 flags outside designed transitions once the source's own events are allowed — every other flag was checked on
  frames: the cruiser's windshield wiper sweeping across (4.9, 14.1, 18.0, 18.9, 23.3, 47.3) and the locomotive's impact in the release's replay (90.3).
- Final duration 105.8 s.
