# energy speech detector on the raw audio (sample seconds S); speech band 250-3500 Hz, 10 ms hop
import sys, json, numpy as np, subprocess
from common import *
import asr_ranges as AR
def env(rid):
    src, ss, a, s0, s1 = AR.R[rid]
    t0 = ss + (s0 - a) - 0.5; dur = (s1 - s0) + 1.0
    raw = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t0:.4f}", "-t", f"{dur:.4f}", "-i", src, "-ac", "1", "-ar", "16000",
                          "-af", "highpass=f=250,lowpass=f=3500", "-f", "f32le", "-"], capture_output=True).stdout
    x = np.frombuffer(raw, np.float32); hop = 160
    n = len(x) // hop; e = np.sqrt((x[:n * hop].reshape(n, hop) ** 2).mean(1) + 1e-12)
    db = 20 * np.log10(e); t = s0 - 0.5 + (np.arange(n) + 0.5) * 0.01
    return t, db
if __name__ == "__main__":
    for rid in sys.argv[1:]:
        t, db = env(rid)
        floor = np.percentile(db, 15); thr = floor + float(AR.THR.get(rid, 14))
        on = db > thr; segs = []; i = 0
        while i < len(on):
            if on[i]:
                j = i
                while j < len(on) and on[j]: j += 1
                segs.append([t[i] - 0.005, t[j - 1] + 0.005]); i = j
            else: i += 1
        m = []
        for s in segs:
            if m and s[0] - m[-1][1] < 0.25: m[-1][1] = s[1]
            else: m.append(s)
        m = [s for s in m if s[1] - s[0] >= 0.12]
        print(rid, f"floor {floor:.1f} thr {thr:.1f}", " ".join(f"{a:.2f}-{b:.2f}" for a, b in m))
