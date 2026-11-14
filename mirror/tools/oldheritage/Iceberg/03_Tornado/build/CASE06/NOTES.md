# TOR06 — Washington, Illinois (17 Nov 2013, EF4) — "Look at it flying"
Code: `_engine/src/cases/TOR06.tsx`. Output: `out/TOR06.mp4` (+ `_phone`). Music: Epidemic ambient Music 1 (-16 dB).

## Structure
TitleCard (Lancaster frame) → RAW VIGO → VO → RAW VIGO → VO → RAW SMOCK ("tornado warning!") → VO → RAW SMOCK → VO → RAW LANC
(the "look at it flying" moment, bleeped) → FreezeLift → RAW LANC (wedge behind the homes) → VO → RAW WELLS → outcome.
Seven raws in cut-sheet order and position, trimmed to the strongest 9-21 s. VO = one take ("Sixth." removed), split only for raws.

## Devices (new for this case)
- OutlookFlip (`dev/TOR06_OutlookFlip.tsx`): SPC Day 1 categorical outlook 17 Nov 2013 (High risk) hinges away to the SPC Day 4-8
  outlook issued Thu 14 Nov 2013 — "flagged the risk as early as the Thursday before".
- FreezeLift (`dev/TOR06_FreezeLift.tsx`): Lancaster frame at 9.6 s frozen, brackets on the debris in the funnel, lifted out, 0.5x.
- ClockedRun (`dev/TOR06_ClockedRun.tsx`): NCEI segment end-points/times (10:59 Marquette Hgts → 11:12 Pekin Jct → 11:33 Metamora →
  11:41 Dana → 11:47 Long Point) on NASA HLS (Sentinel-2, 2 Oct 2023, autumn fields), clock riding the head of the line.

## Sources
- VIGO https://youtu.be/rJDQ3HgV_Zc · SMOCK https://youtu.be/fn6zP9cTyT8 · LANC https://youtu.be/pVanmvVNHcc · WELLS https://youtu.be/HFrgSVoJi1U
- Downloaded (small personal channels): Josh Lillie low aerial https://youtu.be/N0cWWLQsYso (kite), CJ Conger drive https://youtu.be/NuNAPpEg8ng
  (also jDOZ1Hh56AU, oU5DVwIFtHM saved in footage/20_.../more, unused).
- SPC: spc.noaa.gov archive day1otlk_20131117_1300, day48prob_20131114_1200 (public domain). NCEI Storm Events 2013 (track/times).
- NASA GIBS HLS_S30 2023-10-02 (public domain); dark data-seam pixels median-filled.

## Audio
Raw sound = `media/*_clean.wav` from rawclean.py (only VIGO had 3 s of music removed at 20-22 s, outside the used windows).
Profanity bleeped (1 kHz, raw ducked to 0): LANC 8.88-9.30, 10.85-11.27, 96.35-97.90. Wells window chosen to avoid his swearing.

## Not solved / owner should know
- "Bears game at Soldier Field" line: fan clips exist (Greg Pyne J-RDRB6Am1Q, verticalted qoGkjk7rkDk) but YouTube bot-checked every
  download; the line plays over the same storm line (VIGO cloud deck) instead.
- AutoZone sign visible in SMOCK (real street scene), left as is. No injured people/bodies in any window; no blur needed.

## Final render (3 Nov, 03:31)
- Fixed cutcheck/black flags: stairs line = held graded frame `graded/wells_stairs.jpg` (the clip whips away after 1.5 s); drive windows
  112.0 / 104.4 / 120.3 (avoid the car pillar swinging in); wells aftermath from 117.6 (ends before the clip goes black); vigo "Bears game"
  shot reframed to the cloud deck (was 2/3 black ground).
- TP20 rules met: main raw 20.7 s, other raws 8.7-14 s, VO split only between sentences, each device once, ends on the last line.
- Master `out/TOR06.mp4` + `_phone`: cutcheck 0 flags.

## 3 Nov raw audit (owner: raws only at incident moments, no near-dups)
- 7 -> 5 raws. Removed RAW 2 "vigo freight train" (after the forecast explanation) and RAW 4 "smock noise" (near-dup after the
  warning-update line); the VO take runs on across both joins (natural take pauses).
- Raws now: 4.0-16.0 vigo (12.0 s), 43.97-57.97 smock warning (14.0), 79.68-100.38 lanc "look at it flying" (MAIN 20.7),
  104.58-118.08 lanc wedge (13.5), 124.38-133.08 wells (8.7). Duration 195.6 s (was 216.4). Devices unchanged (no n2page used).
- Code backup before the audit: `_engine/_bak_rawaudit/TOR06.tsx`.
