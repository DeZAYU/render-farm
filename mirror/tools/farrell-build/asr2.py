import sys
from common import *
import subprocess
from faster_whisper import WhisperModel
m = WhisperModel("large-v3", device="cpu", compute_type="int8", cpu_threads=8)
for src, t0, dur, lang, off in [(C2, 83.0, 6.0, "en", 176.0)]:
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(t0), "-t", str(dur), "-i", src, "-ac", "1", "-ar", "16000", W + "/asr/x.wav"], check=True)
    segs, _ = m.transcribe(W + "/asr/x.wav", language=lang, word_timestamps=True, beam_size=5)
    for sg in segs:
        print(lang, " ".join(f"{w.word.strip()}[{w.start + off:.2f}-{w.end + off:.2f}]" for w in sg.words))
