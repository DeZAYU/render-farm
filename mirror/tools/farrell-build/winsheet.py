import sys, subprocess, numpy as np
from PIL import Image, ImageDraw
f, out = sys.argv[1], sys.argv[2]; wins = [float(x) for x in sys.argv[3:]]
FPS = 30000/1001; W, Hh = 192, 108; N = 11
sheet = Image.new("RGB", (W*N, (Hh+14)*len(wins)), "black"); dr = ImageDraw.Draw(sheet)
for r, t in enumerate(wins):
    raw = subprocess.run(["ffmpeg","-v","error","-ss",f"{t-2/FPS:.3f}","-i",f,"-frames:v","44","-vf",f"scale={W}:{Hh}","-f","rawvideo","-pix_fmt","rgb24","-"],capture_output=True).stdout
    a = np.frombuffer(raw,np.uint8).reshape(-1,Hh,W,3)
    for c in range(N):
        k = min(c*4, len(a)-1); sheet.paste(Image.fromarray(a[k]), (c*W, r*(Hh+14)+14))
    dr.text((2, r*(Hh+14)), f"{t:.2f}s  every 4th frame", fill="yellow")
sheet.save(out)
