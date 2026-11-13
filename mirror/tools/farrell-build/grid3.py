# grid3.py out.png cols w f1.png f2.png ... : labelled contact sheet
import sys
from PIL import Image, ImageDraw
out, cols, w = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]); fs = sys.argv[4:]
h = w * 9 // 16; rows = (len(fs) + cols - 1) // cols
S = Image.new("RGB", (cols * w, rows * h), (40, 0, 40))
for i, p in enumerate(fs):
    lab = p
    if "=" in p: lab, p = p.split("=", 1)
    im = Image.open(p).convert("RGB").resize((w, h), Image.LANCZOS)
    d = ImageDraw.Draw(im); d.rectangle((0, 0, 9 * len(lab) + 8, 16), fill=(0, 0, 0)); d.text((4, 2), lab, fill=(255, 255, 0))
    S.paste(im, ((i % cols) * w, (i // cols) * h))
S.save(out); print(out, S.size)
