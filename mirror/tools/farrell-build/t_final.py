import sys, os, json, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from PIL import Image
import final2 as F
from common import *
sys.stdout.reconfigure(encoding='utf-8')
print(json.dumps(F.LOG, ensure_ascii=False))
bg = np.full((SH, SW, 3), 90, np.float32)
tiles = []
for T in [24.5, 25.5, 26.79, 47.0, 49.5, 51.3, 53.2, 53.6, 59.0, 59.9, 124.9, 129.8, 136.4, 142.0]:
    evs = [e for e in F.EVENTS if e.active(T)]
    fa = F.composite(bg.copy(), [e.render(T) for e in evs]) if evs else bg.copy()
    tiles.append(Image.fromarray(np.clip(fa, 0, 255).astype(np.uint8)).resize((480, 270)))
sheet = Image.new("RGB", (480 * 4, 270 * 4))
for i, t in enumerate(tiles): sheet.paste(t, ((i % 4) * 480, (i // 4) * 270))
sheet.save("look/final2_test.png")
