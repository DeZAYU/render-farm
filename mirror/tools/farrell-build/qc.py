# QC: black / freeze / silence / loudness + midpoint frame sheet (one tile per shot)
import subprocess, re, sys
from PIL import Image, ImageDraw
from common import *
import edl
O = "C:/Users/ayush/Videos/CLAUDE/STYLE guide/renders/CAMPING-8_3-6min_farrell.mp4"

def ff(args):
    return subprocess.run(["ffmpeg", "-hide_banner", "-nostats"] + args, capture_output=True, text=True).stderr

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
I = re.search(r"I:\s+(-?[\d.]+) LUFS", s).group(1); TP = re.search(r"Peak:\s+(-?[\d.]+) dBFS", s).group(1)
LRA = re.search(r"LRA:\s+(-?[\d.]+) LU", s).group(1)
print("LOUD I", I, "TP", TP, "LRA", LRA)

# frame sheet: midpoint of each shot, 6 columns of 320x180
tiles = []
for sh in edl.SHOTS:
    t = (sh["a"] + min(sh["b"], 180.0)) / 2
    b = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t:.3f}", "-i", O, "-frames:v", "1", "-vf", "scale=320:180",
                        "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True).stdout
    im = Image.frombytes("RGB", (320, 180), b); d = ImageDraw.Draw(im)
    d.rectangle((0, 0, 120, 18), fill=(0, 0, 0)); d.text((4, 3), f"{sh['id']} {sh['kind']} {t:.1f}", fill=(255, 255, 0))
    tiles.append(im)
cols = 6; rows = (len(tiles) + cols - 1) // cols
sheet = Image.new("RGB", (cols * 320, rows * 180))
for i, im in enumerate(tiles): sheet.paste(im, ((i % cols) * 320, (i // cols) * 180))
sheet.save(W + "/framesheet.png"); print("sheet", W + "/framesheet.png")
