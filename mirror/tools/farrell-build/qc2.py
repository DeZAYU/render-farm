# v2 QC: specs, black / freeze / silence / loudness, shot sheet, overlay sheet, every-frame strips of a morph and an exit, treated medians
import subprocess, re, sys, os, json, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from PIL import Image, ImageDraw
from common import *
import edl2 as edl
O = "C:/Users/ayush/Videos/CLAUDE/STYLE guide/renders/CAMPING-8_3-6min_farrell_v2.mp4"

def ff(args):
    return subprocess.run(["ffmpeg", "-hide_banner", "-nostats"] + args, capture_output=True, text=True).stderr
def grab(t, w=320, h=180):
    b = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t:.4f}", "-i", O, "-frames:v", "1", "-vf", f"scale={w}:{h}",
                        "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True).stdout
    return Image.frombytes("RGB", (w, h), b)
def frames(t0, n, w=384, h=216):
    b = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t0:.4f}", "-i", O, "-frames:v", str(n), "-vf", f"scale={w}:{h}",
                        "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True).stdout
    return [Image.frombytes("RGB", (w, h), b[i * w * h * 3:(i + 1) * w * h * 3]) for i in range(len(b) // (w * h * 3))]
def sheet(tiles, labels, cols, path):
    w, h = tiles[0].size; rows = (len(tiles) + cols - 1) // cols
    S = Image.new("RGB", (cols * w, rows * h))
    for i, (im, lb) in enumerate(zip(tiles, labels)):
        d = ImageDraw.Draw(im); d.rectangle((0, 0, 8 * len(lb) + 6, 14), fill=(0, 0, 0)); d.text((3, 2), lb, fill=(255, 255, 0))
        S.paste(im, ((i % cols) * w, (i // cols) * h))
    S.save(path); print("sheet", path)

if "sheets" not in sys.argv:
    print(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "stream=codec_name,width,height,pix_fmt,r_frame_rate,nb_frames,sample_rate,duration",
                          "-of", "compact", O], capture_output=True, text=True).stdout.strip())
    e = ff(["-i", O, "-vf", "blackdetect=d=0.005:pic_th=0.98", "-an", "-f", "null", "-"])
    print("BLACK", [(round(float(a), 2), round(float(b), 2)) for a, b in re.findall(r"black_start:([\d.]+) black_end:([\d.]+)", e)])
    e = ff(["-i", O, "-vf", "freezedetect=n=0.001:d=2", "-an", "-f", "null", "-"])
    st = re.findall(r"freeze_start: ([\d.]+)", e); en = re.findall(r"freeze_end: ([\d.]+)", e)
    print("FREEZE", list(zip([round(float(x), 2) for x in st], [round(float(x), 2) for x in en])))
    e = ff(["-i", O, "-af", "silencedetect=n=-60dB:d=1", "-vn", "-f", "null", "-"])
    print("SILENCE-60", re.findall(r"silence_start: ([\d.]+)", e))
    e = ff(["-i", O, "-af", "silencedetect=n=-50dB:d=1.2", "-vn", "-f", "null", "-"])
    print("SILENCE-50/1.2", re.findall(r"silence_start: ([\d.]+)", e))
    e = ff(["-i", O, "-af", "ebur128=peak=true", "-vn", "-f", "null", "-"])
    s = e[e.rindex("Summary:"):]
    print("LOUD I", re.search(r"I:\s+(-?[\d.]+) LUFS", s).group(1), "TP", re.search(r"Peak:\s+(-?[\d.]+) dBFS", s).group(1),
          "LRA", re.search(r"LRA:\s+(-?[\d.]+) LU", s).group(1))
    # treated medians (rule 6) at shot midpoints
    for sh in edl.SHOTS:
        if sh["kind"] in ("photo", "map", "page", "card4"):
            t = (sh["a"] + sh["b"]) / 2; a = np.asarray(grab(t, 480, 270), np.float32).mean(2)
            print("MEDIAN", sh["id"], sh["kind"], round(float(np.median(a)), 1))

# shot sheet: midpoint of each shot
tl = []; lb = []
for sh in edl.SHOTS:
    t = (sh["a"] + min(sh["b"], 180.0)) / 2; tl.append(grab(t)); lb.append(f"{sh['id']} {sh['kind']} {t:.1f}")
sheet(tl, lb, 6, W + "/framesheet2.png")
# overlay sheet: each event at in+0.3, middle, last frame before t1
tl = []; lb = []
for e in edl.EVENTS:
    for t in (e["t0"] + 0.3, (e["t0"] + e["t1"]) / 2, e["t1"] - 1 / FPS):
        tl.append(grab(t, 480, 270)); lb.append(f"{e.get('keys', ['page'])[-1]} {t:.2f}")
sheet(tl, lb, 3, W + "/overlays2.png")
# every frame: parent->reply morph (53.04) and the exit of the same thread (t1 59.95)
fs = frames(fr(53.04 - 0.1) / FPS, 24); sheet(fs, [f"m{i}" for i in range(len(fs))], 6, W + "/strip_morph.png")
fs = frames(fr(59.95 - 0.75) / FPS, 24); sheet(fs, [f"x{i}" for i in range(len(fs))], 6, W + "/strip_exit.png")
