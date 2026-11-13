# asm3 QC: per-frame 96x54 gray mean abs diff; spikes > 40 vs planned hard cuts / blend windows; strips (every 3rd frame) across transitions.
# python qc3scan.py [video]   (default W/asm3.mp4)
import sys, os, subprocess, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from PIL import Image, ImageDraw
from common import *
import edl3 as edl

V = sys.argv[1] if len(sys.argv) > 1 else W + "/asm3.mp4"
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", V, "-vf", "scale=96:54,format=gray", "-f", "rawvideo", "-"], capture_output=True).stdout
a = np.frombuffer(raw, np.uint8).reshape(-1, 54, 96).astype(np.float32)
d = np.abs(np.diff(a, axis=0)).mean((1, 2))   # d[i] = change into frame i+1
print("frames", len(a))
blends, cuts = [], []
for s in edl.SHOTS[1:]:
    g0 = fr(s["a"]) - s["hh"]
    (cuts if s["tin"] == "cut" else blends).append((g0, s["id"]))
bad = 0
for i in np.where(d > 40)[0]:
    f = int(i) + 1
    tag = "body"
    for g0, sid in cuts:
        if f == g0: tag = f"planned hard cut into {sid}"
    for g0, sid in blends:
        if g0 < f < g0 + 2 * edl.H: tag = f"INSIDE BLEND into {sid}"; bad += 1
    print(f"spike f{f} {f / FPS:7.2f}s {d[i]:5.1f}  {tag}")
print("spikes inside blends:", bad)

def strip(trans, out, cols=8, tw=240, th=135):
    rows = []
    for sid in trans:
        s = next(x for x in edl.SHOTS if x["id"] == sid); g0 = fr(s["a"]) - s["hh"]
        fs = list(range(g0 - 6, g0 + 2 * edl.H + 6, 3))
        t0 = fs[0] / FPS
        b = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{max(0, t0 - 1):.4f}", "-i", V, "-ss", f"{min(1, t0):.4f}",
                            "-frames:v", str(fs[-1] - fs[0] + 1), "-vf", f"scale={tw}:{th}", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
                           capture_output=True).stdout
        k = len(b) // (tw * th * 3)
        for j, f in enumerate(fs):
            o = f - fs[0]
            if o >= k: break
            im = Image.frombytes("RGB", (tw, th), b[o * tw * th * 3:(o + 1) * tw * th * 3])
            inb = g0 <= f < g0 + 2 * edl.H
            ImageDraw.Draw(im).text((3, 2), f"{sid} f{f} {f / FPS:.2f}{' B' if inb else ''}", fill=(255, 255, 0) if inb else (0, 255, 255))
            rows.append(im)
        while len(rows) % cols: rows.append(Image.new("RGB", (tw, th)))
    S = Image.new("RGB", (cols * tw, len(rows) // cols * th))
    for j, im in enumerate(rows): S.paste(im, ((j % cols) * tw, (j // cols) * th))
    S.save(out); print("strip", out)

if "--nostrip" not in sys.argv:
    strip(["04a", "04b"], W + "/look3/strip3_03_04a_04b.png")
    strip(["04c", "04d", "12"], W + "/look3/strip3_04c_04d_12.png")
    strip(["14", "30"], W + "/look3/strip3_14_30.png")
