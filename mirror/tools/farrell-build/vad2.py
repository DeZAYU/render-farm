# hysteresis speech detector: segments start where energy > floor+HI, extended both ways while > floor+LO; gaps < GAP merged
import sys, numpy as np
from vad import env
import asr_ranges as AR
def segs(rid, hi=None, lo=None, gap=0.18):
    t, db = env(rid)
    floor = np.percentile(db, 15); hi = floor + (hi if hi is not None else AR.THR.get(rid, 14)); lo = floor + (lo if lo is not None else 8)
    core = db > hi; ext = db > lo; out = []; i = 0; n = len(db)
    while i < n:
        if core[i]:
            a = i
            while a > 0 and ext[a - 1]: a -= 1
            b = i
            while b < n - 1 and ext[b + 1]: b += 1
            out.append([t[a] - 0.005, t[b] + 0.005]); i = b + 1
        else: i += 1
    m = []
    for s in out:
        if m and s[0] - m[-1][1] < gap: m[-1][1] = s[1]
        else: m.append(s)
    return [s for s in m if s[1] - s[0] >= 0.10]
if __name__ == "__main__":
    for rid in sys.argv[1:]:
        print(rid, " ".join(f"{a:.2f}-{b:.2f}" for a, b in segs(rid)))
