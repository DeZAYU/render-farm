# supports per-shot hh/th (asymmetric late/early transitions). scan each footage shot's source window (with handles) for source cuts; report shot length + solo time
import sys, os, subprocess, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *
import importlib
edl = importlib.import_module(sys.argv[1] if len(sys.argv) > 1 else "edl2")
H = edl.H
def win(s):
    hh = s.get("hh", H if s["tin"] != "cut" else 0); th = s.get("th", H if s["tout"] != "cut" else 0)
    return hh, th
def cuts(src, t0, dur):
    raw = subprocess.run(["ffmpeg","-v","error","-ss",f"{max(0,t0):.3f}","-t",f"{dur:.3f}","-i",src,"-vf","scale=96:54,format=gray","-f","rawvideo","-"],capture_output=True).stdout
    a = np.frombuffer(raw,np.uint8).reshape(-1,54,96).astype(np.float32)
    d = np.abs(np.diff(a,axis=0)).mean((1,2)); med = np.median(d)+0.5
    return [(i+1, float(d[i])) for i in range(len(d)) if d[i] > max(25, 5*med)], len(a)
for s in edl.SHOTS:
    hh, th = win(s); dur = s["b"] - s["a"]
    # blended window = 2H frames at each non-cut side (always starts at window frame 0 / ends at the last frame);
    # the part of it inside [a, b] is 2H - handle (centred: H, late in / early out: 2H, early in / late out: 0)
    inside = (2*H - hh if s["tin"] != "cut" else 0) + (2*H - th if s["tout"] != "cut" else 0)
    solo = dur - inside/FPS
    flag = "SHORT" if (s["kind"] != "raw" and dur < 2.5) or solo < 2.0 else ""
    line = f'{s["id"]:>4} {s["kind"]:5} {dur:6.2f}s solo {solo:5.2f} {flag}'
    if s["kind"] in ("raw", "src"):
        sp = s.get("slow", 1.0); src = {"C1": C1V, "C2": C2V}[s["src"]]
        t0 = s["ss"] - hh/FPS*sp; n = fr(s["b"]) - fr(s["a"]) + hh + th
        cs, k = cuts(src, t0, n/FPS*sp + 0.05)
        bad = []
        for i, v in cs:
            of = i / sp  # output frame index inside shot window
            if v < 25: continue
            bh = 2 * H if s["tin"] != "cut" else 0; bt = 2 * H if s["tout"] != "cut" else 0
            where = "IN-FADE-IN" if of < bh else ("IN-FADE-OUT" if of >= n - bt else "body")
            bad.append(f"{where}@{of:.0f}f({v:.0f}{'' if v >= 40 else '?'})")
        line += " cuts: " + " ".join(bad)
    print(line, flush=True)
