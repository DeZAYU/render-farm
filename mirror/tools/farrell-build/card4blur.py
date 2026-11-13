"""Blur the footage behind a HyperFrames title card, keep the text pixel-exact.

The card was rendered as  card = aT + (1-a)F  where (a, T) is the transparent
text+vignette overlay rendered from the same composition (ctxt-cN.mov) and F is
the footage.  We recover F, fill it under the text (TELEA inpaint), blur it with a
confidence-weighted Gaussian, and recomposite:  out = aT + (1-a)*blur(F).
Where a == 1 (solid text) the output equals the original text.

usage: card4blur.py CARD.mp4 OVERLAY.mov OUT.mp4 [--sigma 20] [--identity]
"""
import argparse, subprocess, numpy as np, cv2

W, H = 1920, 1080
M709 = "scale=in_color_matrix=bt709:in_range=tv"


def reader(path, fmt, ch, dt):
    p = subprocess.Popen(["ffmpeg", "-v", "error", "-i", path, "-vf", M709, "-f", "rawvideo",
                          "-pix_fmt", fmt, "-"], stdout=subprocess.PIPE)
    n = W * H * ch * np.dtype(dt).itemsize
    while True:
        b = p.stdout.read(n)
        if len(b) < n:
            break
        yield np.frombuffer(b, dt).reshape(H, W, ch)
    p.wait()


def process(orig, ov, sigma):
    f = orig.astype(np.float32)
    g = ov.astype(np.float32) / 65535.0
    a = g[..., 3:4]
    aT = g[..., :3] * 255.0 * a  # straight alpha -> premultiplied
    k = 1.0 - a
    Fr = (f - aT) / np.maximum(k, 1e-3)
    # text alpha: remove the smooth vignette part of a
    a1 = a[..., 0]
    small = cv2.resize(a1, (W // 8, H // 8), interpolation=cv2.INTER_AREA)
    vig = cv2.erode(small, np.ones((17, 17), np.uint8))           # drop thin text/glow
    vig = cv2.GaussianBlur(cv2.dilate(vig, np.ones((17, 17), np.uint8)), (0, 0), 6)
    vig = np.minimum(cv2.resize(vig, (W, H), interpolation=cv2.INTER_CUBIC), a1)
    # inpaint only where the footage is too covered to recover (text cores), not the dark corners
    text = (k[..., 0] < 0.25) & (vig < 0.8)
    mask = cv2.dilate(text.astype(np.uint8), cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7)))
    Fc = np.clip(Fr, 0, 255).astype(np.uint8)
    ys, xs = np.nonzero(mask)
    if len(xs):
        pad = 12
        y0, y1 = max(ys.min() - pad, 0), min(ys.max() + pad + 1, H)
        x0, x1 = max(xs.min() - pad, 0), min(xs.max() + pad + 1, W)
        Fc[y0:y1, x0:x1] = cv2.inpaint(Fc[y0:y1, x0:x1], mask[y0:y1, x0:x1], 5, cv2.INPAINT_TELEA)
    # confidence: unreliable where footage barely shows (dark corners); inpainted px ok
    w = np.clip((k[..., 0] - 0.04) / 0.10, 0, 1)
    w = np.maximum(w, mask.astype(np.float32))[..., None]
    Fc = Fc.astype(np.float32)
    if sigma > 0:
        num = cv2.GaussianBlur(Fc * w, (0, 0), sigma, borderType=cv2.BORDER_REFLECT)
        den = cv2.GaussianBlur(w, (0, 0), sigma, borderType=cv2.BORDER_REFLECT)[..., None]
        Fb = num / np.maximum(den, 1e-4)
    else:
        Fb = Fr
    out = aT + k * Fb
    return np.clip(out + 0.5, 0, 255).astype(np.uint8), Fc, mask


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("card"); ap.add_argument("overlay"); ap.add_argument("out")
    ap.add_argument("--sigma", type=float, default=20.0)
    ap.add_argument("--identity", action="store_true", help="no blur (round-trip test)")
    args = ap.parse_args()
    enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24",
                            "-s", f"{W}x{H}", "-r", "30000/1001", "-i", "-",
                            "-vf", "scale=out_color_matrix=bt709:out_range=tv,format=yuv420p",
                            "-c:v", "libx264", "-preset", "slow", "-crf", "12", "-profile:v", "high",
                            "-color_range", "tv", "-colorspace", "bt709", "-color_primaries", "bt709",
                            "-color_trc", "bt709", "-movflags", "+faststart", args.out],
                           stdin=subprocess.PIPE)
    n = 0
    for o, g in zip(reader(args.card, "rgb24", 3, np.uint8), reader(args.overlay, "rgba64le", 4, np.uint16)):
        out = o if args.identity else process(o, g, args.sigma)[0]
        enc.stdin.write(out.tobytes()); n += 1
    enc.stdin.close(); enc.wait()
    print("frames", n, "exit", enc.returncode)


if __name__ == "__main__":
    main()
