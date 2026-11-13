"""Trace one builder's segment render: which input files each segment reads and how long it takes.
Usage: python -I -X utf8 trace.py <build dir> <builder module> <out json>
Writes {segments: {name: {sec, frames, reads: [...]}}}. Output segments go to a temp folder (real seg folder untouched)."""
import os, re, sys, json, time, tempfile
bd, mod, out = sys.argv[1:4]; sys.path.insert(0, bd); os.chdir(bd)
V = os.path.dirname(os.path.abspath(bd)); cur = {'reads': set()}
def norm(p):
    try: return os.path.normcase(os.path.abspath(os.fsdecode(p)))
    except Exception: return None
def hook(ev, a):
    if ev == 'open' and a and isinstance(a[0], (str, bytes, os.PathLike)) and (len(a) < 2 or a[1] is None or 'r' in str(a[1])):
        p = norm(a[0]);  p and cur['reads'].add(p)
    elif ev == 'subprocess.Popen':
        for x in argv(a[1]):
            if os.path.isfile(x): cur['reads'].add(norm(x))
    elif ev == 'cloud.read' and a: cur['reads'].add(norm(a[0]))
def argv(c):
    """Popen args: a list, or (Windows) one command-line string"""
    if isinstance(c, (str, bytes)): return [q or w for q, w in re.findall(r'"([^"]*)"|(\S+)', os.fsdecode(c))]
    return [os.fsdecode(x) for x in (c or []) if isinstance(x, (str, bytes, os.PathLike))]
sys.addaudithook(hook)
from PIL import ImageFont; import cv2
def wrap(o, n):
    f = getattr(o, n)
    def g(x, *a, **k):
        if isinstance(x, (str, os.PathLike)): sys.audit('cloud.read', os.fspath(x))
        return f(x, *a, **k)
    setattr(o, n, g)
wrap(ImageFont, 'truetype'); wrap(cv2, 'imread'); wrap(cv2, 'VideoCapture')
b = __import__(mod); tmp = tempfile.mkdtemp(prefix='trace_seg_')
SEG_REAL = getattr(b, 'SEG8', None); b.SEG8 = tmp
T = b.timeline(); res = {}
keep = lambda S: sorted(p for p in S if p and os.path.isfile(p) and not p.startswith(os.path.normcase(tmp)) and not p.endswith('.pyc'))
boot = keep(cur['reads'])                                            # read at import / timeline()
for s in T:
    cur['reads'] = set(); t0 = time.time()
    b.render_segments(T, [s['name']])
    files = keep(cur['reads'])
    if not os.listdir(tmp) and time.time() - t0 < 0.5: continue          # not rendered by this builder
    res[s['name']] = dict(sec=round(time.time() - t0, 1), frames=s['nf'] + s.get('tail', 0), reads=files)
    for f in os.listdir(tmp): os.remove(os.path.join(tmp, f))
    print(s['name'], res[s['name']]['sec'], len(files), flush=True)
json.dump(dict(V=V, seg_dir=SEG_REAL, boot=boot, segments=res), open(out, 'w', encoding='utf-8'), indent=1)
print('done', len(res))
