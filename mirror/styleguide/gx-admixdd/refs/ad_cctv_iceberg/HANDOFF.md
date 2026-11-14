# HANDOFF ad_cctv_iceberg (gap-fill for coordinator request)
Done: STYLE.md main + Appendix A (A1 cut-coincident SFX stats, 20 timecodes, bed/VO; A2 fonts by role; A3 title/level timing and page easing at 10 fps). DEVICE_BANK_part.md, gate/ (34 PNG).
Helpers in work/: sheet.sh (start dur fps cols rows name), win.py (frames(ss,dur,w,h,fps) -> numpy), sfx.py, bands.npz (t, LF, MID, HF, ALL at 11.6 ms), ebur.npy (t,M,S at 0.1 s), cuts.npy, stats.csv, a22.wav.
Still open (do in fresh agent):
1. Duck depth: need host/footage/page classification. work/frames.py (2 fps 160x90 npy) FAILED once (exit 1, likely memory: 5500x43KB=237MB; fix by writing in chunks or 1 fps). Then compare M (ebur.npy) median in black beats (bed only), host segments (VO+bed), footage segments (clip sound). Expect flat; confirm.
2. 4 more entry opens, frame-stepped (30 fps sheets of 1 s windows, 6x5): suggested at 16:36 (FUN NIGHT TO PRISON title 1000), 20:00 (ONE DEADLY SWITCH, 1200), 22:30 host->page (1350), 39:35 (WHEN THE SKY BURNED, 2375). Log: static burst frames, page entry, marker wipe time per line, dissolve frames, first footage frame.
3. 30 fps easing: level-card slide (32.2-33.3), title shard assemble (33.4-34.2), page push (measure text line y vs time), 3 examples each.
4. Real SFX separation needs a spectrogram view (sound-ear skill) around black beats and level cards; only cut-coincident stats exist.
Windows gotchas: background ffmpeg jobs must be separate run_in_background tasks; ffmpeg metadata=print file fails (use numpy).
