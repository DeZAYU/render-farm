# burned-in text detector: white low-saturation pixel count in the bottom band per frame (source seconds)
import sys, subprocess, numpy as np
from common import *
def run(ss, dur, y0, y1):
    w, h = 480, 270
    b = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{ss}", "-t", f"{dur}", "-i", C1V, "-vf", f"scale={w}:{h}", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True).stdout
    a = np.frombuffer(b, np.uint8).reshape(-1, h, w, 3)[:, int(y0 * h):int(y1 * h)].astype(np.int16)
    m = (a.min(-1) > 215) & ((a.max(-1) - a.min(-1)) < 25)
    return m.reshape(len(a), -1).sum(1)
if __name__ == "__main__":
    ss, dur, y0, y1 = map(float, sys.argv[1:5])
    c = run(ss, dur, y0, y1); prev = None
    for i, v in enumerate(c):
        if prev is None or abs(int(v) - int(prev)) > 15: print(f"{ss + i / FPS:.3f}:{v}", end=" ")
        prev = v
    print()
