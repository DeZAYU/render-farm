# TP06 — Two hours face-down on The Flying Dinosaur (Universal Studios Japan, 1 May 2018)

Code: `_engine/src/cases/TP06.tsx` · out: `build/CASE06/out/TP06.mp4` (+ `_phone.mp4`) · ~1:42 (102.2 s)

## Edit
- TitleCard → VO-led shots on the guest's clip + 4 devices → outcome (two hours, nobody hurt, running again that day).
- VO: one take, split only at the four raw cues.
- Raws at the cut sheet's four ▶ RAW cues (rule 5b), but **picture only, 4 s each**: the clip's only sound is an added music
  track; `rawclean.py --force` (`media/fd_clean.wav`) still leaves the song's vocal/drum stems (whisper hears [Music] throughout),
  so no clip audio is used anywhere — a quiet real wind bed under each hold of the stopped train instead. They are short because
  the picture is a static train: anything longer is dead air. Nothing to blur.
- One camera only → every join is a blur-dip or a strong reframe (cutcheck JUMP on same-camera hard cuts).
- Grade `--house --nonorm` (normalising turned the overcast sky into silhouettes).
- Music: Epidemic ambient Music 3 from 40 s, −19 dB.

## Devices (new; registry lines added)
1. **PoseFlip**: a real photo of the ride running with riders face-down (Commons "The Flying Dinosaur.jpg", Christophe95,
   CC BY-SA 4.0 — credit needed in the description) in a white frame + a white line profile of one seat tipping its rider from
   sitting to face-down, head leading.
2. **HoldBars**: one minute axis; designed hold ~2 min vs ~2 hours (red bar runs across), two mounts.
3. **WalkwayTrace**: freeze, brackets on the stopped train, white line up the maintenance walkway to the top deck.
4. **StopCount**: 2016 → 2018 rule, four red blocks (count only, not dated), the fourth framed white.

## Sources / downloads
- Tried to fetch small-channel off-ride footage (Canobie Coaster L-hXVJ3IzgE, Airtime Thrills bJbs7Puhw3g) for "that's the
  normal position": YouTube returned a bot check; not bypassed. Used the Commons photo instead. Worth adding if the owner
  wants more variety: the case leans on one camera.

## Update 3 Nov (owner rules on TP17/TP19)
- Raws: 4 x 4 s -> 2 x 6 s picture holds (35.3-41.3, 66.65-72.65; wind bed looped). Cues 2 and 3 folded into one VO run (cue 3 left a
  4.9 s lone stretch). Duration 98.2 s. HoldBars now appears once (red ~2 h bar runs on "any longer"); the second mount is a slow push
  on the stopped train. Searched YouTube again for other angles: only TV/agency/re-uploads (Inside Edition, CBS, AP, TomoNews...): none usable.

- 3 Nov 2026 RAW AUDIT (owner: raws only at incident moments, never in explanation, no near-dups): removed the second picture hold (after the earlier-stops history): 2 -> 1 hold. Code: cutOut() at the end of cases/TP06.tsx (lib/core/cutOut.tsx drops the VO-silent raw windows; VO runs on as one take). Re-rendered; cutcheck flags all on designed transitions.
