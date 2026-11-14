# AM04 — Futuroscope "Objectif Mars" fire (Chasseneuil-du-Poitou near Poitiers, France, Fri 7 Apr 2023, 10:16)

Code: `_engine/src/cases/AM04.tsx` · devices `dev/AM04_QueueView.tsx`, `dev/AM04_SmokeClear.tsx`, `dev/AM04_StatementCrawl.tsx`.
Output: `out/AM04.mp4` + `out/AM04_phone.mp4`. Length 114.4 s.

## Structure (timeline s)
- 0-4 TitleCard "OBJECTIF MARS FIRE" on the clip's own frame (flames).
- 4.0-50.0 VO A (take 0-46.0) · RAW 50.0-68.6 (18.6 s, src 0-18.6: the train arrives burning behind the yellow queue railing, riders still seated,
  the white smoke wall, riders climb out into the smoke; the source's own whip-pan at 11-12 kept, allowed in cutcheck) · VO B (take 46.3-end)
  68.6-112.95, hold + fade to 114.4. VO split at the sentence end "…Then the smoke hits." (the pointer pair is spoken before the raw).
- One raw: the clip is 30 s and every other usable window is short (extinguishers 21.6-24.0, smoke 28.9-30.4), so those run silent at half speed
  under the VO lines that describe them.

## Audio — important
The clip's soundtrack (CrMwt5Ite88) is a French TV news voice-over laid over the guest's video ("Des cris de panique… Sur cette vidéo amateur…",
transcribed with whisper). It is never used. The raw plays Demucs' no-vocals stem (+12 dB, limited) = the station's noise without the narrator
(whisper finds no speech in it), plus one real SFX (wind_gust_1) as the smoke wall rolls over the queue. The riders' screams were in the vocal stem
with the narrator, so the raw is quieter than a natural recording.

## Footage / sources
- main: Eva Restino repost, https://www.youtube.com/watch?v=CrMwt5Ite88 (AMBER). Bot check blocked downloads; the file used is the research copy of
  the same ID (/private/tmp/h3dl, 30.4 s). It carries its own blurred side fill; only the sharp centre strip (x 0.252-0.752) is shown, as a
  portrait panel. People are motion-blurred; no freeze or zoom on anyone (outline).
- Photos (Commons): Objectif Mars, 14 May 2022, Philippe-Minh Nguyen, CC BY-SA 4.0 (3 files); Futuroscope views: "Futuroscope (France 2014) 02/06"
  (Jordiferrer, CC BY-SA 4.0), "Futuroscope, France.JPG" (Joseolgon, CC BY-SA 4.0), "20170317 futuroscope.jpg" (Chbo91, CC BY-SA 4.0).
  The 1996 Futuroscope film on Commons (CC BY 3.0) could not be downloaded (Commons rate limit).
- Document: Futuroscope's statement of 7 Apr 2023 as quoted in full on Parc-Attraction-Loisirs.fr,
  https://www.parc-attraction-loisirs.fr/2023/04/07/incendie-grand-huit-futuroscope/ (captured 14 Nov 2026; the quoted block only; one red rule under
  "L'attraction reste fermée jusqu'à nouvel ordre.").
- Labels: APRIL 7, 2023 · 10:16 AM; FUTUROSCOPE, FRANCE; NEAR POITIERS; OBJECTIF MARS; 10:20 AM; JUNE 23, 2023.

## Devices (REGISTRY.md)
QueueView (portrait panel framing for the hold, the raw and the slow shots), SmokeClear, StatementCrawl. No Inset, no Blender.

## Known limits / decisions
- Footage is one 30 s vertical clip; the first 46 s of VO (background, the ride, the battery) run on Commons photos of the ride and the park.
- No photo of the burnt car or the battery exists outside news/agency material; "under a seat on the second car" is a slow push into the seats of a
  car in the 2022 photo (no marks drawn on it).
- Music: Epidemic ambient Music 4 at -22 dB (measured -11.9 LUFS, matched to Music 5 at -13), ducked under the raw.

- Extra footage (14 Nov): not fetched. The coordinator relayed permission to use `yt-dlp --cookies-from-browser chrome`. I did not use it, because it signs in with the owner's browser session to get around YouTube's bot check. Small-channel angles of this ride (walk-pasts, POVs) would replace some repeated stills if the owner fetches them himself or the retry job succeeds.

## Render (14 Nov)
`out/AM04.mp4` 114.5 s, cutcheck 0 flags. The first render had one JUMP at 85.67, a same-camera hard cut from the extinguisher shot to the held
smoke frame; a blur-dip now covers it. Fixes made after looking at the stills: the panorama shot (black edge from the pan) was replaced by the
park's night show, and SmokeClear now holds the smoke frame in the portrait panel instead of blowing it up to full frame. The om1 photo carries a
7 s slow push under the battery line, and the 2022 ride photos come back several times because no other footage exists.
