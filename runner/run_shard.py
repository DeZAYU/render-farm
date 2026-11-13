"""Cloud side of the split render.
Inputs come from the fetch job's artifact (dl/); only files missing there are fetched from the store. Places the always-needed files, then runs the builder's 'seg' step for this shard's segments IN THIS PROCESS.
Any other input file the builder (or an ffmpeg it starts) asks for is fetched on demand from the content store
(release "store": one asset per file, named <sha1>.bin). Results are copied to out/.
Usage: python -I -X utf8 runner/run_shard.py <run_id> <shard index> <work dir>"""
import os, re, sys, json, shutil, subprocess, runpy
rid, i, work = sys.argv[1], int(sys.argv[2]), os.path.abspath(sys.argv[3])
dl = os.path.abspath('dl'); os.makedirs(dl, exist_ok=True); os.makedirs('out', exist_ok=True)
_run = subprocess.run
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); import store
gh = lambda *n: store.gh(dl, *n)
gh(f'run-{rid}.json'); M = json.load(open(os.path.join(dl, f'run-{rid}.json'), encoding='utf-8'))
names = M['shards'][i] if i < len(M['shards']) else []
if not names: print('shard', i, 'has no work'); sys.exit(0)
FILES = {os.path.normcase(os.path.join(work, p)): (p, h) for p, h in M['files'].items()}
got = set(); busy = []
def place(paths):
    if busy: return                                        # our own copies open files too: never re-enter
    busy.append(1)
    try: _place(paths)
    finally: busy.clear()
def _place(paths):
    todo = [(d,) + FILES[d] for d in paths if d in FILES and d not in got and not os.path.exists(d)]
    hs = sorted({h for _, _, h in todo})
    for k in range(0, len(hs), 40): gh(*[h + '.bin' for h in hs[k:k + 40]])
    for d, p, h in todo:
        os.makedirs(os.path.dirname(d), exist_ok=True); shutil.copyfile(os.path.join(dl, h + '.bin'), d); got.add(d)
    if todo: print('  fetched', len(todo), 'files', flush=True)
place([os.path.normcase(os.path.join(work, p)) for p in M['always']])
def norm(x):
    try: return os.path.normcase(os.path.abspath(os.fsdecode(x)))
    except Exception: return None
def hook(ev, a):
    if ev == 'open' and a and isinstance(a[0], (str, bytes, os.PathLike)) and not any(c in str(a[1] or 'r') for c in 'wax+'):
        p = norm(a[0])
        if p in FILES and p not in got: place([p])
    elif ev == 'subprocess.Popen':
        ps = [p for p in map(norm, argv(a[1])) if p in FILES and p not in got]
        if ps: place(ps)
    elif ev == 'cloud.read' and a:
        p = norm(a[0])
        if p in FILES and p not in got: place([p])
def argv(c):
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
# prefetch what the trace saw for these segments (fewer round trips)
place([os.path.normcase(os.path.join(work, p)) for n in names for p in M['reads'].get(n, [])])
bd = os.path.join(work, M['build_dir'])
print('shard', i, names, flush=True)
os.chdir(bd); sys.path.insert(0, bd); sys.argv = [M['builder'] + '.py', 'seg', *names]
runpy.run_path(os.path.join(bd, M['builder'] + '.py'), run_name='__main__')
os.chdir(os.path.dirname(dl))
seg = os.path.join(work, M['seg_dir'])
for n in names: shutil.copyfile(os.path.join(seg, n + '.mp4'), os.path.join('out', n + '.mp4'))
print('ok', len(names))
