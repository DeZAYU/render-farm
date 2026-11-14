# TP24 · Demon stops twice in one day · Gurnee, Illinois (1 Sep 2018)

Code: `_engine/src/cases/TP24.tsx`; device `_engine/src/dev/TP24_SameSpot.tsx`; Blender `assets/blocks.py` (shots in `shots/bl`, encoded to
`graded/blocks_a.mp4` 190 f and `graded/blocks_b.mp4` 125 f; Eevee, 24 samples). Master `out/TP24.mp4`, phone `out/TP24_phone.mp4`.

## Structure (≈134.4 s)
Title (4 s, "THE DEMON STOPS TWICE" on DM's own frame) → VO 21.9 s → RAW DM 0:28–0:42 (14 s) → VO 5.9 s (SameSpot) → RAW DJ 0:10–0:28
(18 s, main: riders climb out onto the stairs) → VO 9.1 s → RAW DJ 1:32–1:42 (10 s) → VO 19.5 s (Blender A/B) → RAW DM 3:10–3:22 (12 s)
→ VO 19 s → 1 s hold. Raws sit only at sentence ends (owner rules 2–3 Nov). The cut sheet's 5 cues became 4: the DJ 3:43 and DM 3:05
cues were merged so "Some riders were still sitting in the cars, waiting their turn." does not stand alone between two raws.

## Devices
- **SameSpot**: frame 1 = JiggidyNDG "Demon After Evacuation" 0:18 (the empty train still parked at the top after the FIRST walk-down,
  the one that made the news); frame 2 = L. Michelle 1:00 (the second stop). Frame 1 is bracketed, then scaled ×2.0 onto frame 2
  (matched on the front car and the crest; the two filmers stood at different spots, so the structure below the crest only roughly
  matches) and onion-skinned inside a soft oval; tag 2 lands on the same spot.
- **Blender block sections**: a simple line model (not the Demon's real layout): four blocks, three trains, signal posts white/red;
  B: the lift sensor turns red at "stops", the lift train stops near the top like the Demon did.
- Channel grammar: TitleCard, RedLabel "SEPTEMBER 1, 2018" and "GURNEE, ILLINOIS".

## Sources
- [DM] L. Michelle (1.27K subs, personal) https://www.youtube.com/watch?v=boUFOGTCdIw — second stop, filmed from below.
- [DJ] JiggidyNDG (6.58K subs, fan vlogger) https://www.youtube.com/watch?v=1ir1XA_PmSs — "Demon's 2nd Evacuation"; description says
  the first evac was the one on the news and L. Michelle filmed this one too.
- Downloaded (more/): [DA] https://www.youtube.com/watch?v=Ih4ECqzZ6Ws (JiggidyNDG, "Demon After Evacuation", 28 s, 720p: after the
  first stop) and [DK] https://www.youtube.com/watch?v=Ktd3VjJNCRs (L. Michelle, "Demon stuck on the lift hill", 8 s, 1080p).
- Research: WISN https://www.wisn.com/article/roller-coaster-stops-on-tracks-at-six-flags-great-america/22893289 ;
  ABC7 https://abc7chicago.com/post/riders-temporarily-stuck-on-six-flags-roller-coaster-/4119963/
- Music: Music 1 (Epidemic), −17 dB (file −18.3 LUFS vs VO −25.8 LUFS), out under every raw. SFX: sfx_n2 glitch_02/03 on the two
  glitch cuts, real metal_clank_4 + sub_drop_1 at the Blender stop, wind_gust_1 under "sitting in the air".

## Audio
Both clips carry park music in almost every second: `rawclean.py --force` on both (media/dm_clean.wav, dj_clean.wav = vocal stem +
drums −10 dB). No injuries/bodies/nudity on screen; no blur needed. No watermarks or burned-in text found.

## Unsolved
- No footage exists of the first stop itself (only its aftermath, DA); the SameSpot alignment is approximate because the two filmers
  stood in different places.

- 3 Nov 2026 RAW AUDIT (owner: raws only at incident moments, never in explanation, no near-dups): removed raw 3 (DJ 1:32, near-dup of the main raw, at the block-section explanation): 4 -> 3 raws. Code: cutOut() at the end of cases/TP24.tsx (lib/core/cutOut.tsx drops the VO-silent raw windows; VO runs on as one take). Re-rendered; cutcheck flags all on designed transitions.
