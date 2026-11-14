# TOR19 · Canada's only F5 · Elie, Manitoba (22 Jun 2007)

## 3 Nov raw audit (owner: raws only at incident moments) — supersedes the edit below
Raws 5 -> 2: H1 (24.6-32.9, 8.3 s, Hughes' windshield) and ONE main raw 50.7-68.0 (17.3 s, Roque src 30.5-47.8 contiguous, one source
segment, `rwR1_clean_lv.wav` 0-17.3) after "From the highway it was hanging right over the houses." H2 + H3 removed (5 s, after explanation
lines; their wind/rain SFX gone). VO = three take pieces joined in the take's own pauses. Roque `fill` framing now only on the main raw and
"after a closer look" (94.3 s); Elie Street (68.0) and "Two others" (80.1) are full-frame crops. 116.95 s. `_extend` splice obsolete (deleted).
Cutcheck: 22 cuts, 0 flags (allowed: designed transitions +-0.35 s and the Roque 15 fps shots). Rendered 3 Nov 05:22.
Out: `out/TOR19.mp4` (127.1 s, −16 LUFS) + `out/TOR19_phone.mp4`. Cutcheck: 0 flags (allowed = designed transition windows + the Roque shots,
whose 15 fps handheld jerks register as JUMP although they are not cuts).

## Edit (raws at the cut sheet's five ▶ RAW cues, in order)
TitleCard → VO para 1 (footage + RedLabels JUNE 22, 2007 / CHRIS HUGHES / ELIE, MANITOBA, Hobson's photo) → RAW H1 (8.3 s, Hughes' car:
"Oh, it's already down") → VO → RAW H2 (5.2 s, debris at the base) → VO with LoopTrace A / semis / LoopTrace B → RAW H3 (5.5 s, the
tornado still down ahead of the car) → "From the highway…" (TwoViews) → RAW R1 (8 s, Elie resident: "I think it's still in the field")
→ VO (Elie Street, path size) → RAW R2 (8.3 s, "sounds like a freight train … can you hear that?") → VO to the end. H2/H3 are picture
only with real wind/rain SFX (Hughes' track is the car radio). Music 1 (−15 dB).
Raw audio: every raw through `_tools/rawclean.py` (guide 5b): H1 → `media/rwH1_clean.wav` (music detected 0–9 s: voices kept only);
R1/R2 → `media/rwR1_clean.wav` (no music; levelled +13 dB → `rwR1_clean_lv.wav`). No blur needed (no injured people/bodies in any raw).

## Devices (new)
- `TOR19_LoopTrace` — the path on Sentinel-2 cloudless with a follow-cam riding the line head: touchdown north of the Trans-Canada, across
  the highway, loop round the flour mill, swing into SW Elie (traced length 6.1 km = the 6 km survey length). Used in two parts around
  a footage cut.
- `TOR19_TwoViews` — highway camera and town camera side by side on a shallow 3-D angle ("from the highway it was hanging over the houses").
- `TOR19_ScaleRails` — US vs Canada rails, old F-scale vs Enhanced (US 1 Feb 2007, Canada 1 Apr 2013), Elie's date on the Canada rail.

## Sources
- Chris Hughes, https://youtu.be/xCI1u05KD_s — its soundtrack after 0:18 is the car radio (DJ + adverts, brand names): only 0:00–0:09 of
  its own sound is used; elsewhere it plays silent under VO or with real SFX. Black frames at 25.93 / 50.42 avoided.
- Elie resident, https://youtu.be/u2dIDdA4YU0 (192×144). Its "It's ripping something up now" (0:55) is left for the video's INTRO cold
  open (cut sheet) so the line is not heard twice; the raw uses 0:30.5–0:47.8 instead.
- Justin Hobson photos, Wikimedia Commons: "F5 tornado Elie Manitoba 2007.jpg" (CC BY-SA 3.0), "F5 tornado funnel cloud Elie Manitoba
  2007.jpg" (CC BY 2.5) — credit in the description.
- Sentinel-2 cloudless 2016 by EOX IT Services GmbH (contains modified Copernicus Sentinel data 2016), CC BY 4.0 — credit in the description.
- Path geometry re-traced from "Updated tornado track of Elie, Manitoba 2007 F5.png" (Wikiwillz, CC BY-SA 4.0).

## Decisions / notes
- "Nineteen is the only F5 Canada has ever officially had." is one sentence, so the count word could not be dropped without breaking it;
  the take plays from 0.0.
- Roque footage is very low resolution; shown with `fill` (contained over its blurred copy) rather than blown up to cover.
- No extra downloads (yt-dlp bot check, not bypassed).
