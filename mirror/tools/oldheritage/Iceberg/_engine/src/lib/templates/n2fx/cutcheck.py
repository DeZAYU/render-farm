# CUT-POINT CHECKER (render side; the timeline side is cutlint.ts). Scans a rendered video and FAILS (exit 1) on the owner's v2 faults:
# "a one-frame glitch, a sudden zoom-in, feels cut carelessly".
#   python cutcheck.py <video.mp4> [--allow a-b,a-b] [--json out.json] [--fps 30]
#     --allow  designed windows in seconds (glitch / whip / zoomHit transitions, and graphic devices with designed blur such as the
#              iceberg chart's blurred deep names): exempt from ODD, STUB, JUMP, TEAR and ZOOMJERK. FLASH is never exempt.
#              FLASH is never exempt (a designed flash ramps over >= 7 f and passes on its own).
# Decodes 192x108 grey frames and flags:
#   FLASH     a single frame whose mean luma jumps >= 18/255 away from BOTH neighbours while the neighbours agree (<= 7)
#   ODD       a single frame that differs strongly from both neighbours while the neighbours match each other (stray frame)
#   STUB      a shot shorter than 3 frames (two hard cuts within 2 frames)
#   JUMP      a position/zoom jump inside a shot: one inter-frame change far above both neighbours that is not a real cut
#   MICROJUMP a "cut" whose two frames are the same picture shifted/scaled (aligned residual < 35 % of the raw change): an accidental jump
#   TEAR      a horizontal band inside the picture that does not belong to it, at the same height (SOFT: >= 15 consecutive frames; SHIFT: >= 4): either a SOFT BAND (a
#             full-width strip >= 2.6x less detailed than the picture next to it that ENDS inside the frame: a blur band / mis-composited
#             layer; soft regions that run to the frame edge, like a dashboard or sky, are natural and ignored) or a SHIFTED BAND (a full-width row boundary across which the rows are offset sideways >= 4 px)
#   ZOOMJERK  inside a shot, the mean zoom speed of 3 frames jumps by > 3 %/frame vs the 3 before, all in one direction: an un-eased
#             (sudden) zoom start or stop. Handheld shake alternates sign and is ignored.
import subprocess, sys, json, numpy as np
from scipy import ndimage

def frames(src, W=192, H=108):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", src, "-vf", f"scale={W}:{H},format=gray", "-f", "rawvideo", "-"], capture_output=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(-1, H, W).astype(np.float32)

_win = None
def _pc(a, b):
    """phase correlation peak (shift-invariant similarity) and shift between two frames"""
    global _win
    if _win is None or _win.shape != a.shape: _win = np.outer(np.hanning(a.shape[0]), np.hanning(a.shape[1]))
    A, B = np.fft.fft2((a - a.mean()) * _win), np.fft.fft2((b - b.mean()) * _win)
    R = A * np.conj(B); R /= np.abs(R) + 1e-6
    r = np.abs(np.fft.ifft2(R)); k = np.unravel_index(np.argmax(r), r.shape)
    return float(r[k]), k

SC = np.exp(np.linspace(np.log(0.9), np.log(1.1), 41))
def zoom_between(a, b):
    """scale s with b ~= a zoomed by s (about the centre, any translation); returns (log s, confidence)"""
    H, W = a.shape; best = (-1, 0.0)
    for s in SC:
        m = ndimage.affine_transform(a, np.diag([1 / s, 1 / s]), offset=[(H / 2) * (1 - 1 / s), (W / 2) * (1 - 1 / s)], order=1, mode="nearest")
        p, _ = _pc(m, b)
        if p > best[0]: best = (p, float(np.log(s)))
    return best[1], best[0]

def aligned_residual(a, b):
    """residual after the best zoom + shift alignment of a onto b (mean abs diff)"""
    ls, _ = zoom_between(a, b); s = float(np.exp(ls)); H, W = a.shape
    m = ndimage.affine_transform(a, np.diag([1 / s, 1 / s]), offset=[(H / 2) * (1 - 1 / s), (W / 2) * (1 - 1 / s)], order=1, mode="nearest")
    _, (dy, dx) = _pc(b, m)
    dy = dy - H if dy > H / 2 else dy; dx = dx - W if dx > W / 2 else dx
    m2 = ndimage.shift(m, (dy, dx), order=1, mode="nearest")
    c = (slice(8, H - 8), slice(12, W - 12))
    return float(np.abs(m2[c] - b[c]).mean())

def tears(src, W=384, H=216, B=8):
    """per-frame band seams (see TEAR). Returns {frame: (y, kind, value)}"""
    fr = frames(src, W, H); out = {}
    nb = H // B
    for i, f in enumerate(fr):
        hf = np.abs(np.diff(f, axis=1))  # fine horizontal detail
        lo = ndimage.uniform_filter(f, 9)
        r = []
        for b in range(nb):
            sl = slice(b * B, (b + 1) * B)
            r.append((hf[sl].mean(), lo[sl].std(axis=1).mean() + lo[sl].std(axis=0).mean()))
        # SOFT band = a soft run (detail/structure ratio >= 2.6x below a sharp neighbour band) that ends INSIDE the picture: a strip laid
        # across the frame. A soft region that runs to the frame edge (dashboard, sky, tent roof, out-of-focus foreground) is natural.
        q = [h / s if s > 10 and h > 0.4 else None for (h, s) in r]
        for b in range(1, nb - 1):
            for d in (-1, 1):  # d = direction from the sharp neighbour into the soft run
                sharp, soft = q[b - d] if 0 <= b - d < nb else None, q[b]
                if sharp is None or soft is None or sharp < 2.6 * soft: continue
                e = b
                while 0 <= e + d < nb and q[e + d] is not None and q[e + d] * 2.6 <= sharp: e += d
                if 0 < e < nb - 1 and abs(e - b) + 1 <= 0.6 * nb: out.setdefault(i, []).append((b * B, "SOFT", round(float(sharp / soft), 1)))
        # sideways offset across a row boundary (full width): best shift of row y+1 vs row y
        for y in range(4, H - 5):
            a, c = f[y, 16:-16], f[y + 1]
            d0 = np.abs(a - c[16:-16]).mean()
            if d0 < 12: continue
            best = min(range(-10, 11), key=lambda dx: np.abs(a - c[16 + dx:W - 16 + dx]).mean())
            if abs(best) >= 4 and np.abs(a - c[16 + best:W - 16 + best]).mean() < 0.45 * d0: out.setdefault(i, []).append((y, "SHIFT", best))
    # persistence: the same seam height (+-1 band) in >= PERSIST consecutive frames. A composited band is a layer: it holds for the whole
    # shot (the Morbi blur band: 35+ f); natural soft regions pass the ratio test only in short runs (measured 4-9 f on the v3 render).
    PERSIST = 15
    res = {}
    for i in out:
        for (y, k, v) in out[i]:
            need = PERSIST if k == "SOFT" else 4
            run = 0
            for j in range(i, i + need):
                if any(abs(yy - y) <= B and kk == k for (yy, kk, _) in out.get(j, [])): run += 1
                else: break
            if run >= need and i not in res: res[i] = (y, k, v)
    return res

def check(src, allow=(), fps=30, verbose=True):
    fr = frames(src); n = len(fr)
    L = fr.mean((1, 2)); D = np.r_[0, np.abs(np.diff(fr, axis=0)).mean((1, 2))]  # D[i] = change i-1 -> i
    ok = lambda i: any(a * fps - 1 <= i <= b * fps + 1 for a, b in allow)
    flags = []
    cuts = [i for i in range(1, n) if D[i] > 30]
    for i in range(1, n - 1):
        l0, l1, l2 = L[i - 1], L[i], L[i + 1]
        if abs(l1 - l0) >= 18 and abs(l1 - l2) >= 18 and np.sign(l1 - l0) == np.sign(l1 - l2) and abs(l0 - l2) <= 7: flags.append((i, "FLASH", round(float(l1 - l0), 1)))
        if ok(i): continue
        d02 = np.abs(fr[i + 1] - fr[i - 1]).mean()
        if D[i] > 28 and D[i + 1] > 28 and d02 < 0.35 * min(D[i], D[i + 1]): flags.append((i, "ODD", round(float(D[i]), 1)))
    # a camera move (whip / fast tilt) gives several big changes in a row that rise and fall smoothly: that is motion, not cuts
    motion = lambda i: all(D[j] > 20 for j in range(max(1, i - 1), min(n - 1, i + 2))) and max(abs(D[j] - D[j - 1]) for j in range(max(2, i - 1), min(n, i + 2))) < 9
    for a, b in zip(cuts, cuts[1:]):
        if b - a < 3 and not ok(a) and not (motion(a) and motion(b)): flags.append((a, "STUB", b - a))
    soft_cuts = []
    # spikes: one change far above both neighbours
    for i in range(2, n - 1):
        if ok(i): continue
        if D[i] > 8 and D[i] > 3.5 * max(D[i - 1], D[i + 1], 1.5):
            res = aligned_residual(fr[i - 1], fr[i])
            if res < 0.35 * D[i]: flags.append((i, "MICROJUMP" if D[i] > 30 else "JUMP", round(float(D[i]), 1)))  # the SAME picture displaced
            else: soft_cuts.append(i)  # a real low-contrast cut (e.g. a cut-in on the same grey scene): a cut for the zoom rule too
            # (a spike whose frames don't align is a real cut to a different picture, e.g. a cut-in >= x1.22 or another window: allowed)
    # zoom speed inside shots
    cutset = set(cuts) | set(soft_cuts)
    v = np.full(n, np.nan); conf = np.zeros(n)
    for i in range(1, n):
        if i in cutset or D[i] < 0.6: v[i] = 0.0 if D[i] < 0.6 else np.nan; continue
        v[i], conf[i] = zoom_between(fr[i - 1], fr[i])
    # a zoom that STARTS or STOPS suddenly: the mean zoom speed of the 3 frames after i differs from the 3 before by > 3 %/frame and the
    # 3 after all move the same way (handheld shake / foreground parallax alternates sign and is not a zoom)
    for i in range(3, n - 3):
        w0, w1 = v[i - 3:i], v[i:i + 3]
        if ok(i) or np.isnan(w0).any() or np.isnan(w1).any(): continue
        if any(c in cutset for c in range(i - 3, i + 4)): continue
        j = w1.mean() - w0.mean()
        same = (np.sign(w1) == np.sign(w1[0])).all() and abs(w1[0]) > 0.005
        if abs(j) > 0.03 and same and conf[i:i + 3].min() > 0.45:  # conf < .45 = parallax / interpolation noise (measured: real zooms .55-.97)
            if not flags or flags[-1][1] != "ZOOMJERK" or i - flags[-1][0] > 3: flags.append((i, "ZOOMJERK", round(float(j) * 100, 1)))
    tr = tears(src); last = -99
    for i in sorted(tr):
        if ok(i): continue
        if i - last > 6: flags.append((i, "TEAR", f"{tr[i][1]} band at y {tr[i][0] / 216:.2f} ({tr[i][2]})"))
        last = i
    flags.sort(key=lambda x: x[0])
    if verbose:
        print(f"{src}: {n} frames, {len(cuts)} cuts, {len(flags)} flags")
        for i, k, val in flags: print(f"  {k:9s} f{i} ({i / fps:.2f} s) {val}")
    return {"frames": n, "cuts": [c / fps for c in cuts], "flags": [{"f": i, "t": round(i / fps, 3), "kind": k, "v": val} for i, k, val in flags],
            "zoom_speed_pct": [None if np.isnan(x) else round(float(x) * 100, 2) for x in v]}

if __name__ == "__main__":
    src = sys.argv[1]; allow = []
    if "--allow" in sys.argv:
        for w in sys.argv[sys.argv.index("--allow") + 1].split(","):
            if w: a, b = w.split("-"); allow.append((float(a), float(b)))
    fps = float(sys.argv[sys.argv.index("--fps") + 1]) if "--fps" in sys.argv else 30
    r = check(src, allow, fps)
    if "--json" in sys.argv: json.dump(r, open(sys.argv[sys.argv.index("--json") + 1], "w"), indent=1)
    sys.exit(1 if r["flags"] else 0)
