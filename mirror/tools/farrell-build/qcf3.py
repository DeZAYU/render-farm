# test-frame list for final3 events: entry mid, held, morph, highlight, exit mid
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import fr, FPS
import final3 as F
out = []
for e in F.EVENTS:
    f0, f1 = fr(e.t0), fr(e.t1)
    L = [("entry", f0 + 11), ("held", (f0 + f1) // 2), ("exit", f1 - 9)]
    if e.morph: L.append(("morph", fr(e.morph) + 10))
    for ci, bi, t in e.hls: L.append((f"hl{bi}", fr(t) + 16))
    for n, f in L: out.append((e.keys[-1], n, f))
for k, n, f in out: print(k, n, f)
print(",".join(str(f) for _, _, f in out))
