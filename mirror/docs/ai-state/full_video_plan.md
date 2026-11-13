# WINTER CAMPING ENCOUNTERS — full video plan (2026-11-10)

R = `C:\Users\ayush\Videos\CLAUDE\STYLE guide`, V = `R\productions\winter-camping-encounters`, W = `V\05_render\work`.

## Structure: one file per section, spliced
- Sections: `case1` (cold open + intro carousel + title + Case 1), `case2` … `case7`. Each section renders to `V\05_render\caseN_vK.mp4` (K = version).
- All sections use the SAME encode so they concat with `-c copy`: video `h264_nvenc -preset p5 -tune hq -rc vbr -b:v 0 -cq 15`, yuv420p, 1920x1080, 30000/1001, high profile, GOP default; audio AAC 320k 48 kHz stereo. Each section's loudness is −17 LUFS integrated, true peak ≤ −1.
- Full video: `W\full_build.py` writes a concat list of the newest `caseN_v*.mp4` (one per N, 1..7) and runs `ffmpeg -f concat -c copy` → `V\05_render\WINTER_CAMPING_ENCOUNTERS_full.mp4`. Built by the fix agent (owner of case1/case2).
- Change rule (owner): an owner change re-renders ONLY the changed section — and inside it only the changed segments (segment cache in `W\seg_cN\`), then asm + final for that section, then re-run `full_build.py`. Never re-render the whole video.
- Section boundaries follow the cut sheet. A case's end-of-case teaser of the next case (e.g. RAW-C3-01 at the end of Case 2) stays in the earlier section; the next section starts at its case card right after that teaser. Read the previous section's `sb_cN.json` last shot to confirm.

## Owner rules (rule book, `R\styleguide\farrell\FARRELL_STYLE_GUIDE.md`, 35 rules — read it)
1. Cursing in raw audio: MUTE the raw audio over the word only. NO bleep tone. Caption shows `[ __ ]`.
2. Under narration, raw clip audio is fully muted (no bed). Raw audio is heard only in raw moments with no narration; short edge fades are fine.
3. Every case: the source creator's YouTube channel page as a 3D tilt-and-pan zoom (capture the channel page; reuse the existing page-3D graphic code). All website/page 3D shots are centred and slightly zoomed in (Case 1's website shot leaned right — fix).
4. Captions: one look everywhere — white VCR OSD Mono on a black box. Every raw clip with speech in the cases is captioned (not the intro). One line max ~1050 px; wrap to 2-3 lines. No caption over the creator's burned-in subtitles. (owner 2026-11-11)
5. Every case gets a map on its place line when the source names a place. If the source gives no location, NO "LOCATION UNDISCLOSED" card: show a source clip of the person going to / arriving at the place, same length. (owner 2026-11-11)
6. Long YouTube reply threads: cut to the key sentence so they are readable in their screen time.
7. Keep a creator's own burned-in subtitles. A red highlight outline on a found object is OK.
8. Intro carousel (Case 1 cold open, where the narration says there are 7 encounters): 7 portrait cards, each a looping clip from its case, with "CASE N" + title; continuous sideways slide with easing, never pausing; centre card bigger and bright, side cards smaller and darker; dark background with icy blue fog glow (never red). The last card slides to centre and zooms with easing until it fills the screen and lands exactly on the next clip's frame. Reference contact sheet: see the Pinterest pin in the rule book.
9. No music and no SFX in this pass. Music/SFX come in one audio-only pass after all 7 cases are done.
10. Encode on the GPU (h264_nvenc, RTX A2000 4 GB). CPU does the numpy effects.

## Safety (from R\CLAUDE.md)
Stay inside R (the two sheet files in `C:\Users\ayush\Downloads\message (2).txt` / `(3).txt` are allowed). No Premiere/After Effects. Never print keys or `.env`. Never write to source mp4s (hard links). Do not touch another section's files. Run `python R\tools\farrell-build\rulecheck.py <edl>` before each render.

## Per-case recipe (copy Case 2)
Case 2 scripts in W: `build_sb_c2.py`, `edl_c2.py`, `gfx_c2.py`, `seg_c2.py`, `mix_c2.py`, `final_c2.py`; handoff `R\docs\ai-state\case2_render_handoff.md`. Copy as `_cN`. Inputs: cut sheet `C:\Users\ayush\Downloads\message (3).txt`, `V\cutsheet_lines.md`, `V\blocks.json`, `V\vo_lines.csv`, narration `V\narration\cut`, sources `V\sources` (download missing ones with yt-dlp into `V\sources`, comments with `--write-info-json --skip-download --write-comments` into `V\sources\comments`).
QC each section: duration, 1920x1080 29.97, −17 LUFS ±0.5, TP ≤ −1, captions present, a 3x2 still sheet you look at, and the mute points silent.
Keep `R\docs\ai-state\caseN_render_handoff.md` updated at each milestone (context hook stops agents ~150k). Save context: read files in parts, bound output, long renders with run_in_background.
