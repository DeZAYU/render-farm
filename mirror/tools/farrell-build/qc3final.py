# QC of the v3 final: probe, loudness, freeze/black detect, labelled frame sheet + strips (up entry, morph). python qc3final.py
import sys, os, re, subprocess
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from PIL import Image, ImageDraw
from common import fr, FPS, W
import final3 as F
V = F.OUT; L = W + "/look4"
def run(a): return subprocess.run(a, capture_output=True, text=True, errors="replace")
print(run(["ffprobe", "-v", "error", "-show_entries", "stream=codec_name,pix_fmt,r_frame_rate,nb_frames,duration,sample_rate", "-of", "compact", V]).stdout)
e = run(["ffmpeg", "-nostats", "-i", V, "-af", "ebur128=peak=true", "-f", "null", "-"]).stderr
print("ebur128", " | ".join(re.findall(r"(I:\s+[-\d.]+ LUFS|LRA:\s+[-\d.]+ LU|Peak:\s+[-\d.]+ dBFS)", e[e.rfind("Summary"):])))
d = run(["ffmpeg", "-nostats", "-i", V, "-vf", "freezedetect=n=0.003:d=2,blackdetect=d=0.05:pix_th=0.10", "-an", "-f", "null", "-"]).stderr
for l in d.splitlines():
    if "freeze_start" in l or "freeze_duration" in l or "black_start" in l: print(l.split("]")[-1].strip())
def grab(f, w=640):
    b = run(["ffmpeg", "-v", "error", "-ss", f"{f / FPS:.5f}", "-i", V, "-frames:v", "1", "-vf", f"scale={w}:-1", "-f", "image2pipe", "-vcodec", "png", "-"])
    return None
def frames(fs, w):
    out = []
    for f in fs:
        p = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{f / FPS:.5f}", "-i", V, "-frames:v", "1", "-vf", f"scale={w}:{w * 9 // 16}",
                            "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True).stdout
        out.append(Image.frombytes("RGB", (w, w * 9 // 16), p))
    return out
def sheet(items, out, cols, w):
    ims = frames([f for _, f in items], w); h = w * 9 // 16; rows = (len(ims) + cols - 1) // cols
    S = Image.new("RGB", (cols * w, rows * h), (30, 0, 30))
    for i, ((lab, f), im) in enumerate(zip(items, ims)):
        d = ImageDraw.Draw(im); t = f"{lab} f{f} {f / FPS:.2f}s"; d.rectangle((0, 0, 7 * len(t) + 6, 13), fill=(0, 0, 0)); d.text((3, 1), t, fill=(255, 255, 0))
        S.paste(im, ((i % cols) * w, (i // cols) * h))
    S.save(out); print("sheet", out, S.size)
items = []
for e in F.EVENTS: items.append((f"{e.keys[-1]} mid", (fr(e.t0) + fr(e.t1)) // 2))
for e in F.EVENTS:
    for ci, bi, t in e.hls: items.append((f"{e.keys[-1]} hl{bi}", fr(t) + 16))
for lab, t in (("03>04a blend", 43.40), ("13>14 blend", 89.90), ("dip 15", 99.65), ("29>30 blend", 166.35)): items.append((lab, fr(t)))
sheet(items, L + "/v3_framesheet.png", 4, 480)
up = F.EVENTS[0]; mo = F.EVENTS[2]
sheet([("up", f) for f in range(fr(up.t0) - 1, fr(up.t0) + 26, 3)], L + "/v3_strip_up.png", 5, 384)
sheet([("morph", f) for f in range(fr(mo.morph) - 3, fr(mo.morph) + 27, 3)], L + "/v3_strip_morph.png", 5, 384)
