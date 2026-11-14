# Reference analyst brief (GX-ADmixDD channel setup, master SOP §3 step 2-3)

You study ONE reference video end to end and write measured numbers. Style only: never copy its footage into edits.
Root: `C:\Users\ayush\Videos\CLAUDE\STYLE guide\styleguide\gx-admixdd\refs\<NAME>\` (src.mp4 is there). Write everything into that folder.
Tools: ffmpeg/ffprobe (on PATH), python (`python -I`, PIL/numpy if present). Read extracted frames with the Read tool to see them.
Do NOT read other folders in `styleguide/` or the 404 Rendrer folder. No downloads, no renders, no installs.

## Measure (numbers, not adjectives)
1. Cuts: ffmpeg scene detect (`select='gt(scene,0.3)',showinfo`) over the WHOLE video. Cuts/min, median shot length, per section (intro, each case/level).
2. Intro (first ~90 s) and the first 2 cases/levels: step frame by frame (30 fps extracts) around every device entry/exit. For each device: kind, timecode, entry frames, hold, exit, motion (push %/s, blur, easing), what VO line it sits on.
3. Rest of video: sample every ~20 s plus every scene cut cluster; log device kinds and counts; check later cases repeat or vary devices.
4. Text: roles (case number, place/date, name tag, quote, subtitle, title), position, size as % of frame height, font look (serif/sans/condensed/weight, caps or not), colours as hex (sample pixels), entrance/exit style, hold time.
5. Transitions: kinds, per minute, lengths in frames.
6. Footage vs designed share (%), how vertical/4:3 clips are framed, maps, pages/documents (how shown, highlight colour), freezes, replays, zooms.
7. Case anatomy: how intro starts (f0), how the title lands, how each case opens (number style/timing, first VO word delay), where raws (clip sound) go and how long (s), how cases end, outro.
8. Audio: integrated LUFS (ebur128); in VO gaps vs VO, estimate music bed vs VO level (LU); duck under raws; SFX per minute and what they mark (whoosh/hit/riser/drone); silent beats; VO gap lengths.
9. Grade: per sampled frame mean saturation, black/white point (signalstats YMIN/YMAX/SATAVG), vignette, grain, any look layer.
10. Censorship: how blur/mosaic/bleeps are drawn and sounded.

## Output (write as you go)
- `STYLE.md`: all numbers above, sectioned, with timecodes. Top: 10-line summary "what this reference owns".
- `gate/`: 30-40 PNG stills (named `tMMSS_what.png`) of the key devices, title, case opens, text, transitions mid-frame.
- `DEVICE_BANK_part.md`: one entry per distinct device: name, timecode(s), measured numbers, what it does for the story, and one "twist" idea so we can rebuild it in a NEW look (different fonts/colours) for our channel.

Timebox 40 min. <= 3 tries per failure, then note it in STYLE.md. Final reply <= 10 lines: the summary + file paths.
