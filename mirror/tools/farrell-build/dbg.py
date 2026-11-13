import sys, numpy as np, cv2, subprocess
sys.path.insert(0, '.')
import card4blur as C
S = sys.argv[1]; ks = [int(x) for x in sys.argv[2].split(',')]
A = 'C:/Users/ayush/Videos/CLAUDE/PROJECT/graphics/hyperframes/out/camping8/v3/'
for i, (o, g) in enumerate(zip(C.reader(A + 'card4-c2.mp4', 'rgb24', 3, np.uint8), C.reader(A + 'ctxt-c2.mov', 'rgba64le', 4, np.uint16))):
    if i in ks:
        out, Fc, mask = C.process(o, g, 20)
        cv2.imwrite(f'{S}/v3/d_Fc{i}.jpg', Fc[..., ::-1].astype(np.uint8))
        cv2.imwrite(f'{S}/v3/d_mask{i}.png', mask * 255)
    if i >= max(ks): break
