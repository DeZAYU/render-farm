# list source cuts in a range: python scan3.py C1|C2 t0 t1 ; and optional tile sheet: ... tile step out.png
import sys, os, subprocess, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *
from PIL import Image, ImageDraw
src = {"C1": C1V, "C2": C2V}[sys.argv[1]]; t0, t1 = float(sys.argv[2]), float(sys.argv[3])
raw = subprocess.run(["ffmpeg","-v","error","-ss",f"{t0:.3f}","-t",f"{t1-t0:.3f}","-i",src,"-vf","scale=96:54,format=gray","-f","rawvideo","-"],capture_output=True).stdout
a = np.frombuffer(raw,np.uint8).reshape(-1,54,96).astype(np.float32)
d = np.abs(np.diff(a,axis=0)).mean((1,2)); med=np.median(d)+0.5
print("cuts:", [(round(t0+(i+1)/FPS,2), round(float(d[i]))) for i in range(len(d)) if d[i] > max(20, 5*med)])
if len(sys.argv) > 5:
    step = float(sys.argv[5]); ts = np.arange(t0, t1, step); tiles = []
    for t in ts:
        b = subprocess.run(["ffmpeg","-v","error","-ss",f"{t:.3f}","-i",src,"-frames:v","1","-vf","scale=256:144","-f","rawvideo","-pix_fmt","rgb24","-"],capture_output=True).stdout
        im = Image.frombytes("RGB",(256,144),b); ImageDraw.Draw(im).text((3,2),f"{t:.1f}",fill=(255,255,0)); tiles.append(im)
    cols = 8; S = Image.new("RGB",(cols*256, ((len(tiles)+cols-1)//cols)*144))
    for i,im in enumerate(tiles): S.paste(im,((i%cols)*256,(i//cols)*144))
    S.save(sys.argv[6])
