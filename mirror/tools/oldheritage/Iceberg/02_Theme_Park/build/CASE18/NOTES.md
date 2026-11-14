# TP18 — Ninety-five per cent of Hastings Pier (Hastings, 5 Oct 2010)
Code: `_engine/src/cases/TP18.tsx` (DUR 213.65 s). Music: Music 5 (−14 dB, two passes: offsets 3 s and 40 s, ducked under every raw).
VO: CASE18 take (no count word), split only at the 7 raws (parts in the code header).

## Devices
- **PierBurn** `dev/TP18_PierBurn.tsx`: Commons elevated aerial (dimmed grey); deck outline traced, 9 bands parallel to the promenade wash red from the pier head back, land-end strip untouched (white line). On "about ninety-five per cent".
- **BirchPrints** `dev/TP18_BirchPrints.tsx`: Hastings (pre-fire) and the West Pier ruin as prints in 3-D; glide to Brighton, West Pier print takes the frame, "2003".
- **AshToDeck** `dev/TP18_AshToDeck.tsx`: burnt deck Nov 2010 re-boarded plank by plank into the Sept 2016 deck ("nearly all ash six years earlier").
- RedLabels: HASTINGS, ENGLAND / EUGENIUS BIRCH / OCTOBER 5, 2010 / 3:30 AM / MAY 2011 / 2013 / APRIL 27, 2016 / STIRLING PRIZE 2017 / NOVEMBER 2017 / ABID GULZAR. Inset (brand) on the cleared deck.

## Raws (all 7 cue positions, in order; re-cut to the owner rule on TP17: long raws)
R1 main incident HP main 19.5–35.5 (16 s, the pier burning end to end, VO paused) · R2 HF ladder cam src 19.0–25.3 + 26.3–31.0 (two windows across the source cut, blur-dip; ~9.4 s sound, starts under "straight down the deck")
· R3 HG 14.6–21.3 (6.7 s, wet sand; window limited by source cuts) · R4 HG 52.9–60.1 engines → flames, + second angle HG 65.2–68.1 under the pier (7.15 s sound)
· R5 HP main 212–222.8 (8.85 s sound) · R6 HA 61–69 (8 s) · R7 HP main 419.5–429.9 (10.4 s).
Main media re-cut: concat now [18-37][138-147][210-224][298-308][418-430][558-564].
Sound: every clip through `rawclean.py` (no music detected in any) → `media/*_clean.wav`; beds cut + loudness-matched → `media/r1..r7.wav`.
HF and HA are silent and HG near-silent (−44 LUFS): R2/R3/R6 use the HP shore camera's own fire sound from other minutes of the same night (main 300, 500, 360); R4 = HG's own engines + HP 520. Whisper: no speech in any raw.
Not blurred: no injured people/bodies in any window.

## Sources
- [HP] main https://www.youtube.com/watch?v=rndPc0pBZAc (320x240, upscaled lanczos + light denoise) · [HF] https://www.youtube.com/watch?v=QYKkSKMJLP8 (ESFRS ladder cam, CAM 1 stamp kept)
· [HG] https://www.youtube.com/watch?v=aUaAdkvPDTg · [HA] https://www.youtube.com/watch?v=PLbaHmwZKtw
- Downloaded (`footage/12_.../more/`, small personal channels): zeroh studio (100 subs) "Hastings Pier Fire 5am till 7am" https://www.youtube.com/watch?v=bpHTotz8hug (used 96–101 dawn banner, 180–184.5 daylight shell);
  john edwards (733 subs) rebuild drone https://www.youtube.com/watch?v=KSXRPmavN3I (5.8–9.2 Nov 2014, 16.0–20 Sept 2016; burned-in titles avoided);
  Joe's Drones (10 subs) spring 2016 https://www.youtube.com/watch?v=-qRRCEw5GgM (16–20.3, 92–97.4; titles avoided).
- Stills (Wikimedia Commons, graded --house --nonorm): list with URLs/licences/authors in `assets/commons/SOURCES.tsv`
  (geograph CC BY-SA 2.0: Colin Smith, Patrick Roper, N Chadwick, Oast House Archive, william, Robin Webster; Phil Sellens CC BY 2.0;
  Jarlhelm CC BY-SA 3.0; Geoprofi Lars / Giogo CC BY-SA 4.0; Poliphilo CC0; Scribwik CC BY 4.0 (aerial); Mary Carson CC BY-SA 2.5 (West Pier)). Credits needed in the description.

## Issues
- The 2011–2013 money / purchase lines have no footage: covered by dated Commons photos (banner June 2011, cleared deck Jan 2011, Oct 2010 panorama, Mar 2013, Feb 2012).
- "Administration Nov 2017" is shown on Sept 2016 drone footage; the March 2022 fog still is mood under "less lovely". Gulzar line on Aug 2018 photo.
- PierBurn uses today's (rebuilt) pier as the plan of the deck; no free true-overhead aerial of the 2010 pier was found.

## Render (3 Nov)
Master `out/TP18.mp4` (213.7 s, −16.8 LUFS integrated), phone `out/TP18_phone.mp4`. Cutcheck: 40 cuts, 0 flags outside the allowed windows.
The first pass flagged one JUMP at 60.07 s. That is the designed blur-dip between the two ladder angles; its allow window had not been shifted for the re-cut. With the window corrected, cutcheck shows 0 flags. Allowed windows: designed transitions ±0.3 s, the ladder-cam raw 62.6–73.65 (white flare) and the handheld phone raw 134.1–142.1.

## Audit against OWNER RULE (3 Nov, on TP19)
- (1) "Next to those flames, a fire engine looks tiny." stood alone (2.9 s) between R3 and R4. That VO stretch is now merged into the one before it (take 44.5–56.95 plays continuously), and R4 (engines → flames → under the pier) and R3 (wet sand) now play back to back as one 13.7 s HG raw block (bed `media/r34.wav`). Every other stretch between raws is ≥ 6.5 s and split at sentence ends.
- (2) Each device appears once. The case ends on the last VO line plus a 1.5 s hold with a fade.
- (3) Longest single-source run is 3 HG shots (HG itself is a multi-angle compilation).
- Loudness: the master is re-mastered with two-pass loudnorm to −16 LUFS.
Re-rendered 3 Nov 03:10 after TP19: cutcheck shows 41 cuts and 0 flags. The master was re-mastered with two-pass loudnorm to −16.1 LUFS (phone copy −16.2). Length is 213.7 s.

- 3 Nov 2026 RAW AUDIT (owner: raws only at incident moments, never in explanation, no near-dups): removed RAW 6 (phone across the water, after the funding lines): 6 -> 5 raws. Code: cutOut() at the end of cases/TP18.tsx (lib/core/cutOut.tsx drops the VO-silent raw windows; VO runs on as one take). Re-rendered; cutcheck flags all on designed transitions.
