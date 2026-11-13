# time every raw line: faster-whisper large-v3 word timestamps on the raw source audio, printed in sample seconds S
import sys, json, subprocess
sys.path.insert(0, __file__.rsplit("/", 1)[0] if "/" in __file__ else ".")
from common import *
from faster_whisper import WhisperModel
RAWS = [("01", C1, 316.0692, 0.0, 0.0, 12.092, "ja"), ("06", C1, 333.9670, 26.807, 25.807, 43.99, "ja"),
        ("12", C1, 426.6929, 60.774, 59.774, 85.265, "ja"), ("14", C1, 509.9761, 89.269, 88.60, 97.577, "ja"),
        ("16", C1, 621.1872, 102.649, 102.36, 117.964, "ja"), ("33", C2, 80.0, 173.0, 172.90, 180.0, "en")]
m = WhisperModel("large-v3", device="cpu", compute_type="int8", cpu_threads=8)
out = {}
for rid, src, ss, a, s0, s1, lang in RAWS:
    t0 = ss + (s0 - a) - 0.5; dur = (s1 - s0) + 1.0
    wav = f"{W}/asr/{rid}.wav"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t0:.4f}", "-t", f"{dur:.4f}", "-i", src, "-ac", "1", "-ar", "16000", wav], check=True)
    segs, _ = m.transcribe(wav, language=lang, word_timestamps=True, vad_filter=False, beam_size=5, condition_on_previous_text=False)
    off = s0 - 0.5; L = []
    for sg in segs:
        ws = [(round(w.start + off, 3), round(w.end + off, 3), w.word, round(w.probability, 2)) for w in sg.words]
        L.append(dict(s=round(sg.start + off, 3), e=round(sg.end + off, 3), t=sg.text, w=ws))
        print(rid, f"{sg.start + off:7.2f}-{sg.end + off:7.2f}", sg.text, flush=True)
    out[rid] = L
json.dump(out, open(f"{W}/asr/asr.json", "w", encoding="utf-8"), ensure_ascii=False, indent=0)
