import subprocess, numpy as np, sys
from common import *
import edl
def grab(src, t, crop=None):
    vf = (f"crop={crop[0]}:{crop[1]}:{crop[2]}:{crop[3]}," if crop else "") + "scale=320:180,format=gray"
    b = subprocess.run(["ffmpeg","-v","error","-ss",str(t),"-i",src,"-frames:v","1","-vf",vf,"-f","rawvideo","-"],capture_output=True).stdout
    return np.frombuffer(b,np.uint8).reshape(180,320)
out = {}
for s in edl.SHOTS:
    if s["kind"] not in ("raw","src"): continue
    src = C1V if s["src"]=="C1" else C2V; L = s["b"]-s["a"]
    m = [float(np.median(grab(src, s["ss"]+L*k, s.get("crop")))) for k in (0.1,0.5,0.9)]
    out[s["id"]] = m; print(s["id"], s.get("lift",0), [round(x) for x in m])
