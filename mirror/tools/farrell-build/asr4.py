import sys
sys.stdout.reconfigure(encoding="utf-8")
from common import *
import subprocess
from faster_whisper import WhisperModel
m = WhisperModel("large-v3", device="cpu", compute_type="int8", cpu_threads=8)
J = [(333.967, 26.807, 30.0, 33.0), (333.967, 26.807, 39.4, 44.0), (426.6929, 60.774, 80.6, 81.4)]
for ss, a, s0, s1 in J:
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{ss + s0 - a:.4f}", "-t", f"{s1 - s0:.3f}", "-i", C1, "-ac", "1", "-ar", "16000", W + "/asr/x.wav"], check=True)
    segs, _ = m.transcribe(W + "/asr/x.wav", language="ja", word_timestamps=True, beam_size=5, vad_filter=False)
    print(s0, s1, " | ".join(" ".join(f"{w.word.strip()}[{w.start + s0:.2f}-{w.end + s0:.2f}]" for w in sg.words) for sg in segs), flush=True)
