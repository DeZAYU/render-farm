# DC17 — The Bridge to Mactan (Mactan–Mandaue bridge, Cebu, 30 Sep 2025, M6.9)

Code `_engine/src/cases/DC17.tsx` (runner `dev/DC17_kit.tsx`), master `out/DC17.mp4` + `out/DC17_phone.mp4`. Duration 132.0 s.
Cutcheck: 0 flags (allow = designed glitch/blur-dip windows + the PostWatch→raw handoff at 32.28).

## Timeline (VO one take, split only at the raws, both at sentence ends)
| T (s) | what |
| --- | --- |
| 0–4 | TitleCard on the stopped-bridge frame (src 60) |
| 4–32.28 | VO A (take 0–28.28): TwinSpans, deck photo, dashcam lamp posts (src 45), riders (src 113), wide + date label (src 75), red truss photo + bridge label, PostWatch on frame 0 |
| 32.28–56.28 | **RAW 1** src 0–24 (24 s): the deck rolls, riders drop bikes and grab the rail |
| 56.28–71.90 | VO B (take 28.28–43.90): SwayTrace (src 26–30), NorthLine (Mactan → Bogo epicentre), riders holding the rail (src 33) |
| 71.90–83.90 | **RAW 2** src 98–110 (12 s): the shaking passes, riders stand, traffic crawls on |
| 83.90–132.0 | VO C (take 43.90–end): deck/rail (src 50, 85, 94), channel photo, old bridge photo, Bogo from the air (label), Bogo City Hall, collapsed homes (PIA), LampScan on the GMA page |

## Decisions (owner asleep)
- The clip starts already shaking: there is no calm pre-quake crossing. The opening lines ("a car is crossing... lamp posts sliding past...
  motorbikes along the railing") use the Commons deck photo and the stopped dashcam (outside the raw windows), not the raw itself.
- Footage under the VO avoids both raw windows (src 26–95, 113–117); src 0 is shown once held (PostWatch) and the raw runs on from it.
- rawclean.py: music over the whole repost (the original audio was ~-11 dB of music); the cleaned track keeps the voices only, raw gain +5 dB.
- Death toll: Manila Bulletin answered headless Chrome with a bot check (not worked around); GMA News (17 Oct 2025) page used instead;
  its Reuters photo (grieving mother between coffins) is cut out of the sheet: only headline block + "559 people were also injured" paragraph.
- USGS shakemap on Commons hit Wikimedia rate limits (429) — replaced by NorthLine on Sentinel-2 (Mactan → epicentre, 11.22 N 124.03 E).
- No victims shown when widening to northern Cebu (handle-with-care).

## Sources
- Dashcam: zyNKSEQFGpg (Teonel Amahit, repost "not mine"), used 0–24 (raw), 26–117 under VO/raw 2. Riders' faces are small/dark; nothing needed blurring.
- Sentinel-2 cloudless 2016 (EOX, CC BY 4.0): Mactan Channel z15, Cebu z10 → **credit "Sentinel-2 cloudless – s2maps.eu by EOX IT Services GmbH (Contains modified Copernicus Sentinel data 2016)"**.
- Wikimedia Commons: "Mactan-Mandaue Bridge (01) (2023-12-03).jpg" (PaulGorduiz106, CC BY-SA 4.0 → credit), "Mactan-Mandaue Bridge (Cebu; 09-04-2022).jpg" (Patrickroque01, PD),
  "Mactan-Mandaue Bridge, Mactan Channel (Lapu-Lapu City, Cebu; 09-04-2022).jpg" (PD), "Mandaue-Mactan Bridge I.jpg" (PD),
  "2025-10-02 – PBBM at Ground Zero ... (03).jpg" (Presidential Communications Office, PD; cropped off its corner check mark),
  "Bogo City Hall damaged by the earthquake, October 2025.jpg" (Dept. of Tourism, PD; cropped off its logo),
  "Village for survivors of Typhoon Haiyan affected by the 2025 earthquake.jpg" (PIA Cebu, PD).
- Page: https://www.gmanetwork.com/news/topstories/regions/962753/cebu-earthquake-death-toll-rises-to-79-ndrrmc/story (shots/gma.png).
- Music: Epidemic "Music 3" −19 dB, two passes, ducked under raws. SFX: glitch (sfx_n2), paper_2.

## Devices (REGISTRY.md): TwinSpans, PostWatch, SwayTrace (lamp tracked per frame, data in dev/DC17_lamp.ts), NorthLine, LampScan.
