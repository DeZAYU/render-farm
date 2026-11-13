from common import *
import subprocess
from faster_whisper import WhisperModel
m = WhisperModel("large-v3", device="cpu", compute_type="int8", cpu_threads=8)
t0 = 509.976 + (88.6 - 89.269)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(t0), "-t", "9.5", "-i", C1, "-ac", "1", "-ar", "16000", "-af", "highpass=f=200,dynaudnorm=f=150:g=15,volume=2", W + "/asr/x14.wav"], check=True)
for vad in (False, True):
    segs, _ = m.transcribe(W + "/asr/x14.wav", language="ja", word_timestamps=True, beam_size=5, vad_filter=vad, condition_on_previous_text=False)
    for sg in segs:
        print(vad, " ".join(f"{w.word.strip()}[{w.start + 88.6:.2f}-{w.end + 88.6:.2f}]" for w in sg.words))
