# v2 final pass: asm2.mp4 frames + captions + loch stamp + comment overlays (cards / real YouTube page) -> x264 + mix2.wav
# Overlays: eased (cubic in-out) fade+scale enter/exit 18 f, parent->reply shape morph 15 f, reply crossfade,
# footage dims/blurs behind, slow 3D drift + push, recentred each frame, one fitted scale per event inside the safe margin.
import sys, os, re, math, json, subprocess, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from PIL import Image, ImageDraw, ImageFilter
from common import *
import edl2 as edl
from seg2 import ease, TEX

OUT = "C:/Users/ayush/Videos/CLAUDE/STYLE guide/renders/CAMPING-8_3-6min_farrell_v2.mp4"
YT = edl.SC + "/yt_capture2/full.png"
MX, MY = 96, 64            # safe margin
EIN = EOUT = 18 / FPS      # enter / exit
MORPH = 15 / FPS
HLF = 14                   # highlight wipe frames
LOG = {}

def avatar(name, d=96):
    im = Image.open(f"{PROPS}/avatars/{name}.jpg").convert("RGB").resize((d, d))
    im = desat(im, 0.2)
    m = Image.new("L", (d, d), 0); ImageDraw.Draw(m).ellipse((0, 0, d - 1, d - 1), fill=255)
    im.putalpha(m); return im

def tokens(t):
    t = clean(t); out = []; hl = -1; n = 0; prev_sp = True
    for part in re.split(r"(\[|\])", t):
        if part == "[": hl = n; continue
        if part == "]": hl = -1; n += 1; continue
        if not part: continue
        ws = part.split(" ")
        for j, w in enumerate(ws):
            if w: out.append((w, hl, j == 0 and bool(out) and not prev_sp))
        prev_sp = part.endswith(" ")
    return out

def rounded(w, h, fill, outline=(46, 46, 46, 255), r=26):
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    ImageDraw.Draw(im).rounded_rectangle((0, 0, w - 1, h - 1), r, fill=fill, outline=outline, width=2)
    return im

# ---------------- comment card (thread) ----------------
class Card:
    def __init__(self, ev):
        self.ev = ev; keys = ev["keys"]
        CW, pad, TS, LH = 1400, 52, 44, 60
        self.layers = []; boxes = {}; self.ends = []; y = pad
        for ci, k in enumerate(keys):
            c = edl.CARDS[k]; ind = 110 if ci > 0 else 0
            L = Image.new("RGBA", (CW, 1400), (0, 0, 0, 0)); d = ImageDraw.Draw(L)
            av = avatar(c["av"], 96 if ci == 0 else 80); L.alpha_composite(av, (pad + ind, y))
            x0 = pad + ind + av.size[0] + 30
            draw_mixed(d, (x0, y + 4), clean(c["author"]), 30, (120, 120, 120))
            y += 50; x = x0; maxw = CW - pad - x0; sp = font(TS).getlength(" ")
            for w, hl, glue in tokens(c["t"]):
                wl = font(TS).getlength(w)
                if glue: x -= sp
                if x + wl > x0 + maxw and not glue: x = x0; y += LH
                d.text((x, y), w, font=font(TS), fill=(255, 255, 255))
                if hl >= 0: boxes.setdefault((ci, hl), []).append([x - 8, y - 9, x + wl + 8, y + TS + 3])
                x += wl + sp
            y += LH + 4
            d.text((x0, y), "Translated from Japanese", font=font(24), fill=(125, 125, 125))
            y += 40; self.ends.append(y + pad); y += 34
            self.layers.append(L)
        self.CW = CW; HF = self.ends[-1]
        self.layers = [np.asarray(L.crop((0, 0, CW, HF)), np.float32) for L in self.layers]
        for k, rs in boxes.items():
            lines = {}
            for r in rs:
                L_ = lines.setdefault(r[1], [r[0], r[1], r[2], r[3]]); L_[0] = min(L_[0], r[0]); L_[2] = max(L_[2], r[2])
            boxes[k] = sorted(lines.values(), key=lambda r: r[1])
        self.boxes = boxes
        self.base = add_tex(rounded(CW, HF, (16, 16, 16, 238)), TEX * 0.8)
        self.HF = HF

    def height(self, T):
        ev = self.ev
        if len(self.ends) == 1: return self.ends[0], 1.0
        m = ease((T - ev["morph"]) / MORPH)
        return self.ends[0] + (self.ends[1] - self.ends[0]) * m, m

    def sheet(self, T):
        hf, m = self.height(T); h = int(round(hf)); CW = self.CW
        sh = Image.new("RGBA", (CW, h), (0, 0, 0, 0))
        sh.paste(self.base.crop((0, 0, CW, h - 40)), (0, 0)); sh.paste(self.base.crop((0, self.HF - 40, CW, self.HF)), (0, h - 40))
        d = ImageDraw.Draw(sh)
        for (ci, hi, t) in self.ev.get("hl", []):
            if T < t: continue
            rs = self.boxes[(ci, hi)]; tot = sum(r[2] - r[0] for r in rs); k = ease((T - t) * FPS / HLF) * tot
            for r in rs:
                wv = min(k, r[2] - r[0]); k -= wv
                if wv > 0.5 and r[3] < h: d.rectangle((r[0], r[1], r[0] + wv, r[3]), fill=RED + (255,))
        if len(self.layers) == 1:
            lay = [(self.layers[0], 1.0, 1.0)]
        else:
            ra = ease((T - self.ev["morph"] - 0.2) / 0.4)
            lay = [(self.layers[0], 1 - 0.42 * m, 1.0), (self.layers[1], 1.0, ra)]
        for arr, f, al in lay:
            if al <= 0.001: continue
            a = arr[:h] * np.array([f, f, f, al], np.float32)
            sh.alpha_composite(Image.fromarray(a.astype(np.uint8)))
        return sh

# ---------------- real YouTube page (dark theme capture) ----------------
class Page:
    WW, WH, TOP0, TOP1 = 1000, 460, 1040, 1311
    HLBOX = (58, 1527, 420, 1557)
    def __init__(self, ev):
        self.ev = ev
        pg = Image.open(YT).convert("RGB").crop((0, 0, self.WW, 4020))
        self.page = pg
        self.tex = TEX[200:200 + self.WH, 300:300 + self.WW] * 0.55
        m = Image.new("L", (self.WW, self.WH), 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, self.WW - 1, self.WH - 1), 18, fill=255)
        self.mask = m
        self.frame = rounded(self.WW, self.WH, (0, 0, 0, 0), (60, 60, 60, 255), 18)
        st = rounded(self.WW, 170, (12, 12, 12, 242), r=18); d = ImageDraw.Draw(st)
        lines = ["With it this bright inside, I feel like", "they'd be completely visible from outside..."]
        for i, l in enumerate(lines): d.text((34, 24 + i * 44), l, font=font(32), fill=(255, 255, 255))
        d.text((34, 122), "Translated from Japanese", font=font(22), fill=(125, 125, 125))
        self.strip = add_tex(st, TEX * 0.6)
        self.size = (self.WW, self.WH + 20 + 170)

    def sheet(self, T):
        ev = self.ev; s0, s1 = ev["scroll"]
        top = self.TOP0 + (self.TOP1 - self.TOP0) * ease((T - s0) / (s1 - s0))
        win = self.page.transform((self.WW, self.WH), Image.AFFINE, (1, 0, 0, 0, 1, top), Image.BICUBIC)
        a = np.asarray(win, np.float32)
        if T >= ev["hl"]:
            k = ease((T - ev["hl"]) * FPS / HLF); x0, y0, x1, y1 = self.HLBOX
            y0 = int(round(y0 - top)); y1 = int(round(y1 - top)); xe = int(x0 + (x1 - x0) * k)
            if xe > x0 and 0 <= y0 < y1 <= self.WH:
                reg = a[y0:y1, x0:xe]
                a[y0:y1, x0:xe] = 255 - (255 - reg) * (255 - np.array(RED, np.float32)) / 255   # screen: white text stays white
        a = a + self.tex[..., None]
        win = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).convert("RGBA"); win.putalpha(self.mask)
        win.alpha_composite(self.frame)
        sh = Image.new("RGBA", self.size, (0, 0, 0, 0)); sh.alpha_composite(win, (0, 0))
        e = ease((T - ev["tr"]) / (18 / FPS))
        if e > 0.001:
            st = np.asarray(self.strip, np.float32) * np.array([1, 1, 1, e], np.float32)
            sh.alpha_composite(Image.fromarray(st.astype(np.uint8)), (0, int(round(self.WH + 20 + 16 * (1 - e)))))
        return sh

# ---------------- placement ----------------
class Event:
    def __init__(self, ev):
        self.ev = ev; self.obj = Card(ev) if ev["kind"] == "card" else Page(ev)
        self.t0, self.t1 = ev["t0"], ev["t1"]
        # one scale per event: largest that keeps every frame's quad inside the safe margin
        worst = 0.0
        for f in range(fr(self.t0), fr(self.t1) + 1):
            q = self.quad(f / FPS, 1.0)
            xs = [p[0] for p in q]; ys = [p[1] for p in q]
            worst = max(worst, (max(xs) - min(xs)) / (SW - 2 * MX), (max(ys) - min(ys)) / (SH - 2 * MY))
        self.S = min(1.15 if ev["kind"] == "card" else 1.6, 0.97 / worst)
        ext = [9e9, 9e9, -9e9, -9e9]
        for f in range(fr(self.t0), fr(self.t1) + 1):
            q = self.quad(f / FPS, self.S)
            ext = [min(ext[0], min(p[0] for p in q)), min(ext[1], min(p[1] for p in q)),
                   max(ext[2], max(p[0] for p in q)), max(ext[3], max(p[1] for p in q))]
        LOG[f"{ev['kind']}:{ev.get('keys', ['toru'])[-1]}@{self.t0}"] = dict(scale=round(self.S, 3), bbox=[round(v) for v in ext])

    def env(self, T):
        ei = ease((T - self.t0) / EIN); eo = ease((self.t1 - T) / EOUT)
        return min(ei, eo), (0.94 + 0.06 * ei) * (0.96 + 0.04 * eo)

    def size(self, T):
        if isinstance(self.obj, Card): return self.obj.CW, self.obj.height(T)[0]
        return self.obj.size

    def quad(self, T, S):
        ev = self.ev; u = ease((T - self.t0) / (self.t1 - self.t0))
        _, se = self.env(T)
        sw, sh = self.size(T)
        sc = S * se * (1 + 0.012 * (T - self.t0))
        yaw = ev["yaw"][0] + (ev["yaw"][1] - ev["yaw"][0]) * u
        pit = ev["pitch"][0] + (ev["pitch"][1] - ev["pitch"][0]) * u
        q = project(sw, sh, (sw / 2, sh / 2), (960, 540), sc, yaw, pit)
        xs = [p[0] for p in q]; ys = [p[1] for p in q]
        dx = 960 - (min(xs) + max(xs)) / 2; dy = 540 - (min(ys) + max(ys)) / 2
        return [(x + dx, y + dy) for x, y in q]

    def active(self, T): return self.t0 <= T <= self.t1

    def render(self, T):
        a, _ = self.env(T)
        sheet = self.obj.sheet(T)
        q = self.quad(T, self.S)
        sw, sh = sheet.size
        c = persp_coeffs(q, [(0, 0), (sw, 0), (sw, sh), (0, sh)])
        img = sheet.transform((SW, SH), Image.PERSPECTIVE, c, Image.BICUBIC)
        return np.asarray(img, np.float32), a

EVENTS = [Event(e) for e in edl.EVENTS]

def composite(frame, layers):
    """frame float HxWx3; layers [(rgba float, a)]: dim + blur the footage behind, soft shadow, then the sheet"""
    k = max(a for _, a in layers)
    if k > 0.001:
        small = Image.fromarray(frame.astype(np.uint8)).resize((480, 270), Image.BILINEAR).filter(ImageFilter.GaussianBlur(1.6))
        bl = np.asarray(small.resize((SW, SH), Image.BILINEAR), np.float32)
        frame = (frame * (1 - 0.5 * k) + bl * 0.5 * k) * (1 - 0.45 * k)
    for rgba, a in layers:
        al = rgba[..., 3:4] / 255 * a
        sa = Image.fromarray((al[..., 0] * 255).astype(np.uint8)).resize((480, 270), Image.BILINEAR).filter(ImageFilter.GaussianBlur(5))
        sh = np.asarray(sa.resize((SW, SH), Image.BILINEAR), np.float32)[..., None] / 255
        sh = np.roll(sh, 16, axis=0)
        frame = frame * (1 - 0.6 * sh)
        frame = frame * (1 - al) + rgba[..., :3] * al
    return frame

# ---------------- captions + stamp ----------------
def box_png(lines, size, pad=(16, 10), lh=1.25):
    wmax = max(mixed_len(l, size) for l in lines)
    w = int(wmax + 2 * pad[0]); h = int(len(lines) * size * lh + 2 * pad[1])
    im = Image.new("RGBA", (w, h), (0, 0, 0, 255)); d = ImageDraw.Draw(im)
    for i, l in enumerate(lines):
        draw_mixed(d, ((w - mixed_len(l, size)) / 2, pad[1] + i * size * lh + size * 0.08), l, size, (255, 255, 255, 255))
    return im

CAPS = []
for s in edl.SHOTS:
    for (a, b, t) in s.get("caps", []):
        im = box_png(clean(t).split("\n"), 40); w, h = im.size
        CAPS.append((fr(a), fr(b), np.asarray(im, np.float32), (SW - w) // 2, 1000 - h))

def stamp_png(big, small):
    im = Image.new("RGBA", (SW, 300), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    fb, fs = font(96), font(36); wb, ws = fb.getlength(big), fs.getlength(small)
    sh = Image.new("RGBA", im.size, (0, 0, 0, 0)); ds = ImageDraw.Draw(sh)
    for dd, fill in ((ds, (0, 0, 0, 170)), (d, None)):
        dd.text(((SW - wb) / 2, 60), big, font=fb, fill=fill or (0xED, 0xED, 0xED, 255))
        dd.text(((SW - ws) / 2, 180), small, font=fs, fill=fill or (0xBD, 0xBD, 0xBD, 255))
    return np.asarray(Image.alpha_composite(sh.filter(ImageFilter.GaussianBlur(10)), im), np.float32)
STAMPS = [(s["a"] + 0.10, s["b"] - 0.10, stamp_png(*s["stamp"])) for s in edl.SHOTS if s.get("stamp")]

def paste(frame, rgba, x, y, a=1.0):
    h, w = rgba.shape[:2]
    al = rgba[..., 3:4] / 255 * a
    reg = frame[y:y + h, x:x + w]
    frame[y:y + h, x:x + w] = reg * (1 - al) + rgba[..., :3] * al

def main(lo=0, hi=None, dump=None):
    print(json.dumps(LOG), flush=True)
    dec = subprocess.Popen(["ffmpeg", "-v", "error", "-i", W + "/asm2.mp4", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
    N = fr(180.013) if hi is None else hi
    if dump:
        os.makedirs(dump, exist_ok=True); enc = None
    else:
        enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{SW}x{SH}", "-r", "30000/1001",
                                "-i", "-", "-i", W + "/mix2.wav", "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-preset", "slow",
                                "-crf", "18", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "320k", "-ar", "48000", "-t", "180.013",
                                "-movflags", "+faststart", OUT], stdin=subprocess.PIPE)
    for f in range(N):
        b = dec.stdout.read(SW * SH * 3)
        if len(b) < SW * SH * 3: print("short at", f); break
        if f < lo: continue
        T = f / FPS
        evs = [e for e in EVENTS if e.active(T)]
        caps = [c for c in CAPS if c[0] <= f < c[1]]
        sts = [(st, ease((T - a) / 0.3) * ease((b_ - T) / 0.3)) for a, b_, st in STAMPS if a <= T <= b_]
        if evs or caps or sts:
            fa = np.frombuffer(b, np.uint8).reshape(SH, SW, 3).astype(np.float32)
            if evs: fa = composite(fa, [e.render(T) for e in evs])
            for st, al in sts: paste(fa, st, 0, SH - 300 - 70, al)
            for c in caps: paste(fa, c[2], c[3], c[4])
            b = np.clip(fa + 0.5, 0, 255).astype(np.uint8).tobytes()
        if dump:
            Image.frombytes("RGB", (SW, SH), b).save(f"{dump}/{f:05d}.png")
        else:
            enc.stdin.write(b)
        if f % 600 == 0: print("frame", f, flush=True)
    dec.stdout.close(); dec.kill()
    if enc: enc.stdin.close(); assert enc.wait() == 0

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "dump":   # python final2.py dump f0 f1 dir
        main(int(sys.argv[2]), int(sys.argv[3]), sys.argv[4])
    else:
        main()
