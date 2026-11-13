import sys, re, math, subprocess, numpy as np
from multiprocessing import Pool
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
from common import *
import edl

TEX = grain_tex(2400, 1600, amt=9, seed=7, dust=70)

def shot_frames(s):
    f0 = fr(s["a"]) - (edl.H if s["tin"] != "cut" else 0)
    f1 = fr(s["b"]) + (edl.H if s["tout"] != "cut" else 0)
    return f0, f1

def tS(f):  # frame index -> sample seconds
    return f / FPS

# ---------- plates ----------
def plate(name, bright):
    src = {"c105": R + "/stills/still_c105.png", "prints": R + "/stills/still_photo.png"}[name]
    im = Image.open(src).convert("RGB").resize((SW, SH))
    im = im.filter(ImageFilter.GaussianBlur(22))
    im = desat(im, 0.18)
    im = level_to(im, bright)
    return add_tex(im, TEX)

def push_img(im, s, dx=0.0, dy=0.0):
    """scale about centre by s (>=1) with drift in px"""
    cx, cy = im.size[0] / 2 + dx, im.size[1] / 2 + dy
    return im.transform((SW, SH), Image.AFFINE, (1 / s, 0, cx - SW / 2 / s, 0, 1 / s, cy - SH / 2 / s), Image.BICUBIC)

EDGE = None
def finish(img, edge=0.74, dof=True):
    global EDGE
    if dof:
        if EDGE is None:
            y, x = np.mgrid[0:SH, 0:SW].astype(np.float32)
            r = np.sqrt(((x - SW / 2) / (SW / 2)) ** 2 + ((y - SH / 2) / (SH / 2)) ** 2) / math.sqrt(2)
            EDGE = np.clip((r - 0.45) / 0.45, 0, 1)[..., None]
        b = img.resize((480, 270), Image.BILINEAR).filter(ImageFilter.GaussianBlur(2.2)).resize((SW, SH), Image.BILINEAR)
        a = np.asarray(img, np.float32) * (1 - EDGE) + np.asarray(b, np.float32) * EDGE
    else:
        a = np.asarray(img, np.float32)
    return vignette(a, edge)

# ---------- comment sheet ----------
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

def build_sheet(keys, dim=(), indent_reply=True):
    CW, pad, AV, TS, LH = 1400, 52, 96, 44, 60
    text_layer = Image.new("RGBA", (CW, 2000), (0, 0, 0, 0))
    d = ImageDraw.Draw(text_layer)
    y = pad; boxes = {}; card_rects = []
    for ci, k in enumerate(keys):
        c = edl.CARDS[k]; ind = 110 if (ci > 0 and indent_reply) else 0
        dm = ci in dim
        col_a, col_t, col_n = ((120, 120, 120), (255, 255, 255), (125, 125, 125)) if not dm else ((60, 60, 60), (105, 105, 105), (55, 55, 55))
        av = avatar(c["av"], AV if ind == 0 else 80)
        if dm:
            av = Image.fromarray((np.asarray(av).astype(np.float32) * [0.45, 0.45, 0.45, 1]).astype(np.uint8))
        y0 = y
        text_layer.alpha_composite(av, (pad + ind, y))
        x0 = pad + ind + av.size[0] + 30
        draw_mixed(d, (x0, y + 4), clean(c["author"]), 30, col_a)
        y += 50
        maxw = CW - pad - x0; x = x0; line_rects = []
        sp = font(TS).getlength(" ")
        for w, hl, glue in tokens(c["t"]):
            wl = font(TS).getlength(w)
            if glue: x -= sp
            if x + wl > x0 + maxw and not glue:
                x = x0; y += LH
            d.text((x, y), w, font=font(TS), fill=col_t)
            if hl >= 0:
                boxes.setdefault((ci, hl), []).append([x - 8, y - 9, x + wl + 8, y + TS + 3])
            x += wl + sp
        y += LH + 4
        d.text((x0, y), "Translated from Japanese", font=font(24), fill=col_n)
        y += 40
        card_rects.append((ci, y0, y))
        y += 34
    H = y + pad - 34
    text_layer = text_layer.crop((0, 0, CW, H))
    # merge word boxes into per-line rects
    for k, rs in boxes.items():
        lines = {}
        for r in rs:
            L = lines.setdefault(r[1], [r[0], r[1], r[2], r[3]]); L[0] = min(L[0], r[0]); L[2] = max(L[2], r[2])
        boxes[k] = list(lines.values())
    base = Image.new("RGBA", (CW, H), (0, 0, 0, 0))
    bd = ImageDraw.Draw(base)
    bd.rounded_rectangle((0, 0, CW - 1, H - 1), 26, fill=(16, 16, 16, 238), outline=(46, 46, 46, 255), width=2)
    base = add_tex(base, TEX * 0.8)  # texture baked into the sheet geometry (moves with it, never boils)
    return base, text_layer, boxes, card_rects

CAMS = {
    "wide":   dict(scale=0.92, yaw=(-15, -11), pitch=(7, 5), push=0.030, at="center"),
    "closeA": dict(scale=1.15, yaw=(11, 8), pitch=(-4, -3), push=0.025, at="hl"),
    "closeB": dict(scale=1.15, yaw=(-12, -9), pitch=(5, 3.5), push=0.025, at="hl"),
}

def render_card(s, out):
    base, txt, boxes, crects = build_sheet(s["cards"], s.get("dim", []))
    sw, sh = base.size
    bg = plate(s["bg"], 118)
    cam = CAMS[s["cam"]]
    hl = s.get("hl")
    if cam["at"] == "hl" and hl:
        rs = boxes[(hl[0], hl[1])]
        anchor = ((min(r[0] for r in rs) + max(r[2] for r in rs)) / 2, (min(r[1] for r in rs) + max(r[3] for r in rs)) / 2)
        anchor = (min(max(anchor[0], sw / 2 - 150), sw / 2 + 30), anchor[1])
    else:
        anchor = (sw / 2, sh / 2)
    land = s.get("land", {})
    pre = {}
    for ci in land:
        b2, t2, _, _ = build_sheet(s["cards"][:ci], s.get("dim", [])); b2.alpha_composite(t2); pre[ci] = b2
    f0, f1 = shot_frames(s); n = f1 - f0
    enc = Enc(out)
    for i in range(n):
        t = i / FPS; T = tS(f0 + i); u = i / max(1, n - 1)
        sheet = base.copy()
        if hl and T >= hl[2]:
            k = (T - hl[2]) * FPS / 14.0; k = min(1.0, max(0.0, k))
            dd = ImageDraw.Draw(sheet)
            for r in boxes[(hl[0], hl[1])]:
                cx = (r[0] + r[2]) / 2; hw = (r[2] - r[0]) / 2 * k
                if hw > 1: dd.rectangle((cx - hw, r[1], cx + hw, r[3]), fill=RED + (255,))
        sheet.alpha_composite(txt)
        for ci, a_ in land.items():  # reply lands (hard cut) on its spoken word
            if T < a_:
                sheet = pre[ci]
        sc = cam["scale"] * (1 + cam["push"] * t)
        yaw = cam["yaw"][0] + (cam["yaw"][1] - cam["yaw"][0]) * u
        pit = cam["pitch"][0] + (cam["pitch"][1] - cam["pitch"][0]) * u
        quad = project(sheet.size[0], sheet.size[1], anchor, (960 + 14 * u, 540 - 6 * u), sc, yaw, pit)
        frame = push_img(bg, 1.04 + 0.02 * t, 10 * u, 0).convert("RGBA")
        frame.alpha_composite(warp(sheet, quad))
        enc.put(finish(frame.convert("RGB")))
    enc.close()

def render_photo(s, out):
    if s["img"] == "photo":
        im = Image.open(R + "/stills/still_photo.png").convert("RGB"); im = level_to(desat(im, 0.2), 84); edge, push = 0.74, 0.040
    else:
        im = Image.open(R + "/stills/still_c105.png").convert("RGB"); im = desat(im, 0.3)
        im = level_to(im, 84); edge, push = 0.78, 0.035
    im = add_tex(im.resize((SW, SH)), TEX)
    f0, f1 = shot_frames(s); n = f1 - f0; enc = Enc(out)
    for i in range(n):
        t = i / FPS; u = i / max(1, n - 1)
        enc.put(finish(push_img(im, 1.02 + push * t, -18 * u, 6 * u), edge))
    enc.close()

def render_page(s, out):
    pg = Image.open(P + "/graphics/hyperframes/assets/camping8/channels/c2_ch.png").convert("RGB").crop((760, 0, 3560, 1700))
    k = 0.7; pg = pg.resize((int(2800 * k), int(1700 * k)), Image.LANCZOS)
    pg = desat(pg, 0.2); pg = add_tex(pg, TEX * 0.7).convert("RGBA")
    sw, sh = pg.size
    box = [int(v * k) for v in (1228 - 760 - 14, 566, 1848 - 760 + 14, 650)]
    base = np.asarray(pg, np.float32)
    bg = level_to(pg.convert("RGB").resize((SW, SH)).filter(ImageFilter.GaussianBlur(24)), 95); bg = add_tex(bg, TEX * 0.6)
    f0, f1 = shot_frames(s); n = f1 - f0; enc = Enc(out)
    for i in range(n):
        t = i / FPS; T = tS(f0 + i); u = i / max(1, n - 1)
        sheet = pg
        if T >= s["hl_at"]:
            kk = min(1.0, (T - s["hl_at"]) * FPS / 14.0)
            cx = (box[0] + box[2]) / 2; hw = (box[2] - box[0]) / 2 * kk
            a = base.copy(); x0, x1 = int(cx - hw), int(cx + hw)
            if x1 > x0:
                reg = a[box[1]:box[3], x0:x1, :3]
                a[box[1]:box[3], x0:x1, :3] = 255 - (255 - reg) * (255 - np.array(RED, np.float32)) / 255  # screen
            sheet = Image.fromarray(a.astype(np.uint8))
        sc = 1.08 * (1 + 0.05 * t)
        quad = project(sw, sh, (sw * 0.36, sh * 0.40), (900 - 20 * u, 520), sc, -16 + 4 * u, 9 - 2 * u)
        frame = bg.convert("RGBA"); frame.alpha_composite(warp(sheet, quad))
        enc.put(finish(frame.convert("RGB"), 0.72))
    enc.close()

def render_case(s, out):
    lay = Image.new("RGBA", (SW, SH), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    for txt, sz, col, y in [("CASE 2", 130, (237, 237, 237), 430), ("LOCH LOMOND, SCOTLAND", 49, (189, 189, 189), 600)]:
        w = font(sz).getlength(txt); d.text(((SW - w) / 2, y), txt, font=font(sz), fill=col)
    lay = add_tex(lay, TEX * 0.9)
    bg = add_tex(Image.new("RGB", (SW, SH), (6, 6, 6)), TEX * 0.35)
    f0, f1 = shot_frames(s); n = f1 - f0; enc = Enc(out)
    for i in range(n):
        t = i / FPS
        a = 0.0 if t < 0.4 else min(1, (t - 0.4) / 0.5) if t < 2.7 else max(0, 1 - (t - 2.7) / 0.5)
        fr_ = bg.copy().convert("RGBA")
        L = push_img(lay, 1.0 + 0.023 * t)
        if a > 0:
            al = L.getchannel("A").point(lambda v: int(v * a)); L.putalpha(al); fr_.alpha_composite(L)
        enc.put(finish(fr_.convert("RGB"), 0.75, dof=False))
    enc.close()

def render_map(s, out):
    f0, f1 = shot_frames(s); n = f1 - f0
    src = P + "/graphics/hyperframes/out/camping8/v2/sat-lomond.mp4"
    raw = subprocess.run(["ffmpeg", "-v", "error", "-ss", str(s["ss"]), "-i", src, "-vf", "fps=30000/1001", "-frames:v", str(n),
                          "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True).stdout
    k = len(raw) // (SW * SH * 3); enc = Enc(out)
    for i in range(n):
        j = min(i, k - 1); t = i / FPS
        im = Image.frombytes("RGB", (SW, SH), raw[j * SW * SH * 3:(j + 1) * SW * SH * 3])
        im = Image.fromarray(np.clip(255 * (np.asarray(im, np.float32) / 255) ** 0.62, 0, 255).astype(np.uint8))
        im = add_tex(im, TEX * 0.6)
        enc.put(finish(push_img(im, 1.0 + 0.03 * t), 0.74, dof=False))
    enc.close()

R_ = {"card": render_card, "photo": render_photo, "page": render_page, "case": render_case, "map": render_map}

def job(s):
    out = f"{W}/seg/{s['id']}.mp4"
    try:
        R_[s["kind"]](s, out)
    except StopIteration:
        pass
    return s["id"]

if __name__ == "__main__":
    import os; os.makedirs(W + "/seg", exist_ok=True)
    ids = sys.argv[1:]
    js = [s for s in edl.SHOTS if s["kind"] in R_ and (not ids or s["id"] in ids)]
    with Pool(4) as p:
        for r in p.imap_unordered(job, js): print("done", r, flush=True)
