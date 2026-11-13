# footage segments, caption/credit/stamp PNGs, assembly (xfade/concat), final pass (flash, VHS, overlays) + mux
import sys, os, subprocess, numpy as np
from multiprocessing import Pool
from PIL import Image, ImageDraw, ImageFilter
from common import *
import edl
from gfx import shot_frames

SEG = W + "/seg"; OV = W + "/ov"; os.makedirs(OV, exist_ok=True)
OUT = "C:/Users/ayush/Videos/CLAUDE/STYLE guide/renders/CAMPING-8_3-6min_farrell.mp4"
LIFT = {"01": 1.15, "06": 1.2}  # night raws: gamma lift until they read (guide: night footage lifted until it reads)

def seg_footage(s):
    f0, f1 = shot_frames(s); n = f1 - f0
    ss = s["ss"] - (fr(s["a"]) - f0) / FPS
    src = C1V if s["src"] == "C1" else C2V
    vf = []
    if s.get("crop"): c = s["crop"]; vf.append(f"crop={c[0]}:{c[1]}:{c[2]}:{c[3]}")
    vf += ["scale=1920:1080:flags=lanczos", "setsar=1"]
    if s["id"] in LIFT: vf.append(f"eq=gamma={LIFT[s['id']]}")
    vf += ["fps=30000/1001", "format=yuv420p"]
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{ss:.4f}", "-i", src, "-vf", ",".join(vf), "-frames:v", str(n),
                    "-an", "-c:v", "libx264", "-preset", "fast", "-crf", "12", f"{SEG}/{s['id']}.mp4"], check=True)
    return s["id"]

def box_png(path, lines, size, pad=(16, 10), lh=1.25):
    f = font(size)
    wmax = max(mixed_len(l, size) for l in lines)
    w = int(wmax + 2 * pad[0]); h = int(len(lines) * size * lh + 2 * pad[1])
    im = Image.new("RGBA", (w, h), (0, 0, 0, 255)); d = ImageDraw.Draw(im)
    for i, l in enumerate(lines):
        x = (w - mixed_len(l, size)) / 2
        draw_mixed(d, (x, pad[1] + i * size * lh + size * 0.08), l, size, (255, 255, 255, 255))
    im.save(path); return w, h

def overlays():
    ovs = []  # (png, x, y, t0, t1, fade)
    k = 0
    for s in edl.SHOTS:
        if s["kind"] != "raw": continue
        for (a, b, t) in s.get("caps", []):
            p = f"{OV}/cap{k:02d}.png"; k += 1
            w, h = box_png(p, clean(t).split("\n"), 40)
            ovs.append((p, (SW - w) // 2, 1000 - h, a, min(b, s["b"]), 0))
        if s.get("credit"):
            p = f"{OV}/cr{s['id']}.png"; w, h = box_png(p, [s["credit"]], 26, pad=(12, 7))
            ovs.append((p, 48, 1040 - h, s["a"], s["b"] - (edl.H / FPS if s["tout"] != "cut" else 0), 0))
    for s in edl.SHOTS:
        if s.get("stamp"):
            big, small = s["stamp"]; im = Image.new("RGBA", (SW, 300), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
            fb, fs = font(96), font(36)
            wb, ws = fb.getlength(big), fs.getlength(small)
            sh = Image.new("RGBA", im.size, (0, 0, 0, 0)); ds = ImageDraw.Draw(sh)
            for dd, fill in ((ds, (0, 0, 0, 170)), (d, None)):
                dd.text(((SW - wb) / 2, 60), big, font=fb, fill=fill or (0xED, 0xED, 0xED, 255))
                dd.text(((SW - ws) / 2, 180), small, font=fs, fill=fill or (0xBD, 0xBD, 0xBD, 255))
            sh = sh.filter(ImageFilter.GaussianBlur(10))
            out = Image.alpha_composite(sh, im); p = f"{OV}/stamp.png"; out.save(p)
            ovs.append((p, 0, 1080 - 300 - 70, s["a"] + 0.10, s["b"] - 0.10, 8))
    return ovs

def assemble():
    segs = [s for s in edl.SHOTS]
    inputs = []; fc = []
    for i, s in enumerate(segs):
        inputs += ["-i", f"{SEG}/{s['id']}.mp4"]
        fc.append(f"[{i}:v]setpts=PTS-STARTPTS,settb=1001/30000,setsar=1,format=yuv420p[s{i}]")
    cur = "s0"; f0, f1 = shot_frames(segs[0]); L = f1 - f0
    for i in range(1, len(segs)):
        s = segs[i]; g0, g1 = shot_frames(s); n = g1 - g0; o = f"c{i}"
        if s["tin"] == "cut":
            fc.append(f"[{cur}][s{i}]concat=n=2:v=1:a=0,settb=1001/30000[{o}]"); L += n
        else:
            tr = "fade" if s["tin"] == "dis" else "fadeblack"
            off = (L - 2 * edl.H) / FPS
            fc.append(f"[{cur}][s{i}]xfade=transition={tr}:duration={2 * edl.H / FPS:.6f}:offset={off:.6f}[{o}]")
            L += n - 2 * edl.H
        cur = o
    print("expected frames", L, "target", fr(180.0))
    r = subprocess.run(["ffmpeg", "-v", "error", "-y"] + inputs + ["-filter_complex", ";".join(fc), "-map", f"[{cur}]",
                    "-c:v", "libx264", "-preset", "fast", "-crf", "12", "-pix_fmt", "yuv420p", "-r", "30000/1001", W + "/asm.mp4"],
                   capture_output=True, text=True)
    assert r.returncode == 0, r.stderr[-1500:]

def final():
    ovs = overlays()
    inputs = ["-i", W + "/asm.mp4", "-i", W + "/mix.wav"]
    fc = []; cur = "0:v"; k = 2
    # overlays (captions/credits hard; stamp fades)
    for (p, x, y, t0, t1, fade) in ovs:
        inputs += ["-loop", "1", "-framerate", "30000/1001", "-i", p]
        if fade:
            d = fade / FPS
            fc.append(f"[{k}:v]format=rgba,trim=duration={t1 + 0.1:.3f},fade=in:st={t0:.3f}:d={d:.3f}:alpha=1,"
                      f"fade=out:st={t1 - d:.3f}:d={d:.3f}:alpha=1[o{k}]")
        else:
            fc.append(f"[{k}:v]format=rgba,trim=duration={t1 + 0.1:.3f}[o{k}]")
        fc.append(f"[{cur}][o{k}]overlay={x}:{y}:eof_action=pass:enable='between(t,{t0:.3f},{t1 - 0.5 / FPS:.3f})'[v{k}]")
        cur = f"v{k}"; k += 1
    # white flash: 0.1 s ramp before the cut, ~0.2 s full white, 0.4 s fade out
    F = edl.FLASH
    fc.append(f"color=c=white:s=1920x1080:r=30000/1001:d=0.7,format=rgba,fade=in:st=0:d=0.1:alpha=1,"
              f"fade=out:st=0.3:d=0.4:alpha=1,setpts=PTS+{F - 0.1:.4f}/TB[fl]")
    fc.append(f"[{cur}][fl]overlay=0:0:eof_action=pass[vf]"); cur = "vf"
    # VHS device across the cut into the CASE card: noise, RGB shift, tracking lines
    a, b = edl.VHS - 0.40, edl.VHS + 0.60
    en = f"enable='between(t,{a:.3f},{b:.3f})'"
    fc.append(f"[{cur}]noise=alls=38:allf=t+u:{en},rgbashift=rh=9:bh=-9:gv=2:{en},"
              f"drawbox=x=0:y='mod(t*1300,1080)':w=iw:h=18:color=white@0.30:t=fill:{en},"
              f"drawbox=x=0:y='mod(t*700+400,1080)':w=iw:h=6:color=white@0.45:t=fill:{en},"
              f"drawbox=x=0:y='mod(t*2100+150,1080)':w=iw:h=40:color=black@0.35:t=fill:{en},format=yuv420p[vout]")
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    subprocess.run(["ffmpeg", "-v", "error", "-y"] + inputs + ["-filter_complex", ";".join(fc), "-map", "[vout]", "-map", "1:a",
                    "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-r", "30000/1001",
                    "-c:a", "aac", "-b:a", "320k", "-ar", "48000", "-t", "180.013", "-movflags", "+faststart", OUT], check=True)

if __name__ == "__main__":
    step = sys.argv[1]
    if step == "seg":
        js = [s for s in edl.SHOTS if s["kind"] in ("raw", "src")]
        with Pool(4) as p:
            for r in p.imap_unordered(seg_footage, js): print("seg", r, flush=True)
    elif step == "asm": assemble()
    elif step == "final": final()
