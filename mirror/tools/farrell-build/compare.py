"""side-by-side PNGs + stats: compare.py ORIG OUT OUTDIR [frames]"""
import sys, numpy as np, cv2, subprocess
W, H = 1920, 1080
o, b, d = sys.argv[1:4]
ks = [int(x) for x in (sys.argv[4] if len(sys.argv) > 4 else '10,40,70,100,130').split(',')]
def grab(p, k):
    r = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-vf', f'select=eq(n\,{k}),scale=in_color_matrix=bt709:in_range=tv',
                        '-frames:v', '1', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-'], capture_output=True).stdout
    return np.frombuffer(r, np.uint8).reshape(H, W, 3)
rows, zooms = [], []
for k in ks:
    A, B = grab(o, k), grab(b, k)
    t = (A.max(2) > 170)  # bright text core
    print(k, 'mean|diff| all %.2f  textcore %.2f (n=%d)' % (np.abs(A.astype(int) - B).mean(),
          np.abs(A.astype(int) - B)[t].mean() if t.any() else -1, t.sum()))
    sb = np.hstack([A, B]); cv2.putText(sb, f'f{k} orig | blur', (20, 60), 0, 1.5, (0, 255, 255), 3)
    rows.append(cv2.resize(sb, (1920, 540)))
    z = np.hstack([A[440:640, 620:1300], B[440:640, 620:1300]])
    zooms.append(z)
cv2.imwrite(d + '/compare_sbs.png', np.vstack(rows))
cv2.imwrite(d + '/compare_zoom.png', np.vstack(zooms))
