# Audio mix for the sample, all in numpy at 48 kHz stereo. Writes W/mix_pre.wav, then two-pass loudnorm -> W/mix.wav
import subprocess, json, re, sys, numpy as np
from scipy.signal import lfilter
from common import *
import edl

SR = 48000
N = int(round(180.0 * SR))
SOUND = R + "/sound"; NARR = R + "/narration/cut"
VHS_SRC = "C:/Users/ayush/Videos/CLAUDE/STYLE guide/styleguide/farrell/media/d09b1d18c9524a34.mp4"

def load(path, ss=0.0, dur=None):
    cmd = ["ffmpeg", "-v", "error", "-ss", f"{ss:.4f}"] + (["-t", f"{dur:.4f}"] if dur else []) + \
          ["-i", path, "-vn", "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"]
    b = subprocess.run(cmd, capture_output=True, check=True).stdout
    return np.frombuffer(b, np.float32).reshape(-1, 2).copy()

def lufs(x):
    """BS.1770-4 integrated loudness (48 kHz)"""
    y = lfilter([1.53512485958697, -2.69169618940638, 1.19839281085285], [1, -1.69065929318241, 0.73248077421585], x, axis=0)
    y = lfilter([1, -2, 1], [1, -1.99004745483398, 0.99007225036621], y, axis=0)
    blk, hop = int(0.4 * SR), int(0.1 * SR)
    if len(y) < blk: return -99.0
    p = np.array([(y[i:i + blk] ** 2).mean(axis=0).sum() for i in range(0, len(y) - blk + 1, hop)])
    l = -0.691 + 10 * np.log10(p + 1e-12)
    p = p[l > -70]
    if not len(p): return -99.0
    rel = -0.691 + 10 * np.log10(p.mean()) - 10
    p = p[(-0.691 + 10 * np.log10(p)) > rel]
    return float(-0.691 + 10 * np.log10(p.mean()))

def gain_db(x, db): return x * (10 ** (db / 20))
def peak_db(x): return 20 * np.log10(np.abs(x).max() + 1e-12)
def at(s): return int(round(s * SR))

def ramp(n, up=True):
    t = np.linspace(0, 1, n, dtype=np.float32)
    r = np.sin(t * np.pi / 2) ** 2
    return (r if up else r[::-1])[:, None]

def place(buf, x, s):
    i = at(s); j = min(N, i + len(x))
    if j > i: buf[i:j] += x[: j - i]

vo = np.zeros((N, 2), np.float32); raw = np.zeros((N, 2), np.float32)
bed = np.zeros((N, 2), np.float32); sfx = np.zeros((N, 2), np.float32)
TARGET = -18.0  # dialogue / narration pre-master; master pass lands -17
rep = {}

# narration
for name, t in edl.VO:
    x = load(f"{NARR}/{name}.wav")
    g = TARGET - lufs(x); x = gain_db(x, g)
    if peak_db(x) > -3: x = gain_db(x, -3 - peak_db(x))
    place(vo, x, t); rep[name] = round(lufs(x), 1)

# raw audio (rule 8: pre-roll, fade in 3.22 / out 2.74, scaled under 5.96 s)
for s in edl.SHOTS:
    if s["kind"] != "raw": continue
    a0, a1 = s["aud"]; src = C1 if s["src"] == "C1" else C2
    x = load(src, s["ss"] + (a0 - s["a"]), a1 - a0)
    L = len(x) / SR
    k = 1.0 if L >= 5.96 else (L / 5.96) * 0.98
    fi, fo = 3.22 * k, 2.74 * k
    if a0 <= 0.001: fi = 0.25  # sample head: the raw is already running at the sample's first frame
    if s["id"] == "33": fo = 1.0  # sample tail: fade to 180.0
    g = TARGET - lufs(x); x = gain_db(x, g)
    if peak_db(x) > -3: x = gain_db(x, -3 - peak_db(x))
    ni, no = int(fi * SR), int(fo * SR)
    x[:ni] *= ramp(ni, True); x[-no:] *= ramp(no, False)
    place(raw, x, a0); rep["raw" + s["id"]] = (round(L, 2), round(fi, 2), round(fo, 2))

# beds (~-31 LUFS on their active parts, i.e. well over 8 dB under narration)
def bed_part(path, src_ss, s0, s1):
    x = load(path, src_ss, s1 - s0)
    e = np.concatenate([[0], np.cumsum((x ** 2).mean(1), dtype=np.float64)])
    ms = (e[SR:] - e[:-SR]) / SR; ms = np.concatenate([ms, np.full(len(x) - len(ms), ms[-1] if len(ms) else 0)])
    act = x[ms > 10 ** (-60 / 10)]
    g = -31.0 - lufs(act) if len(act) > SR else 0.0
    x = gain_db(x, g)
    return x, round(g, 1)
b1, g1 = bed_part(SOUND + "/c1_bed_amb_v2.wav", 193.4467, 0.0, edl.VHS)
nf = int(0.3 * SR); b1[-nf:] *= ramp(nf, False)
place(bed, b1, 0.0)
b2, g2 = bed_part(SOUND + "/c2v2_bed_amb.wav", 0.0, edl.VHS, 180.0)
b2[:nf] *= ramp(nf, True)
place(bed, b2, edl.VHS); rep["bed_gain"] = (g1, g2)

# room tone: brown noise ~ -55 dBFS RMS under everything
rng = np.random.default_rng(3)
w = rng.normal(0, 1, (N, 2)).astype(np.float32)
br = lfilter([1], [1, -0.995], w, axis=0).astype(np.float32)
br -= lfilter([1], [1, -0.9999], br, axis=0) * 0.0  # keep simple
br = br - br.mean(0)
br *= (10 ** (-55 / 20)) / np.sqrt((br ** 2).mean())
room = br

# VHS SFX: Static & Skew audio 0.3-1.3 s at -23.6 dB RMS, starting 155.33
v = load(VHS_SRC, 0.3, 1.0)
v *= (10 ** (-23.6 / 20)) / np.sqrt((v ** 2).mean())
nf2 = int(0.03 * SR); v[:nf2] *= ramp(nf2); v[-nf2:] *= ramp(nf2, False)
place(sfx, v, edl.VHS - 0.40)

# impact on the white-flash evidence entry (onset aligned to the cut)
h = load(SOUND + "/c1_card_hit.wav")
env = np.abs(h).max(1); on = int(np.argmax(env > env.max() * 0.1))
h = h[on:]
h = gain_db(h, -22.0 - lufs(h[: SR]))
place(sfx, h, edl.FLASH); rep["hit_onset_s"] = round(on / SR, 3)

mix = vo + raw + bed + sfx + room
pre = W + "/mix_pre.wav"
import wave
def write_wav(path, x):
    x16 = np.clip(x, -1, 1)
    with wave.open(path, "wb") as f:
        f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR)
        f.writeframes((x16 * 32767).astype("<i2").tobytes())
# keep float precision through loudnorm: write 32-bit float via ffmpeg
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-", "-c:a", "pcm_f32le", pre],
               input=mix.astype(np.float32).tobytes(), check=True)
def measure(path):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", path, "-af", "loudnorm=I=-17:TP=-1:LRA=11:print_format=json", "-f", "null", "-"],
                       capture_output=True, text=True).stderr
    return json.loads(r[r.rindex("{"): r.rindex("}") + 1])
m = measure(pre); G = -17.0 - float(m["input_i"])
lim = W + "/mix_lim.wav"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", pre, "-af",
                f"volume={G + 0.3:.2f}dB,alimiter=limit=0.78:attack=3:release=60:level=disabled:latency=1",
                "-c:a", "pcm_f32le", lim], check=True)
m2 = measure(lim)
af = (f"loudnorm=I=-17:TP=-1:LRA=20:measured_I={m2['input_i']}:measured_TP={m2['input_tp']}:measured_LRA={m2['input_lra']}"
      f":measured_thresh={m2['input_thresh']}:offset={m2['target_offset']}:linear=true,aresample=48000")
r3 = subprocess.run(["ffmpeg", "-hide_banner", "-y", "-i", lim, "-af", af + ",loudnorm=I=-17:TP=-1:print_format=json".replace(",loudnorm", ",anull,loudnorm") if False else af,
                     "-t", "180.0", "-c:a", "pcm_s24le", W + "/mix.wav"], capture_output=True, text=True)
assert r3.returncode == 0, r3.stderr[-500:]
m3 = measure(W + "/mix.wav")
print(json.dumps(rep)); print("pre", m["input_i"], m["input_tp"], "lim", m2["input_i"], m2["input_tp"], "final", m3["input_i"], m3["input_tp"], m3["input_lra"])
