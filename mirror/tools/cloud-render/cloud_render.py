"""Split render (owner rule 2026-11-13): a small share of the segments renders on the laptop,
the rest on GitHub Actions (up to 500 machines, PUBLIC repo DeZAYU/render-farm), then the laptop joins them (pic + final).

Usage (from anywhere):
  python -I -X utf8 cloud_render.py <build dir> <builder module> <trace json> [--shards 500] [--local-frac auto] [--local-jobs 4] [--skip-done]
                                    [--repo DeZAYU/render-farm] [--account kumai007] [--no-join] [--dry]
  <trace json> comes from trace.py (input files + seconds per segment). Re-run trace.py when the builder changes inputs.

Inputs go to the PUBLIC repo's release (anyone can download them) "store" as <sha1>.bin (content-addressed: unchanged files are never re-uploaded).
Never prints the token."""
import os, sys, json, time, hashlib, shutil, subprocess, argparse, tempfile, glob

ap = argparse.ArgumentParser()
ap.add_argument('build'); ap.add_argument('builder'); ap.add_argument('trace')
ap.add_argument('--shards', type=int, default=500); ap.add_argument('--local-frac', type=float, default=0)   # owner 2026-11-13: all on GitHub (500 machines, DeZAYU Enterprise), laptop = backup; -1 = auto split
ap.add_argument('--steal', action='store_true')          # laptop also takes cloud parts while the cloud runs (off: laptop is backup only)
ap.add_argument('--cloud-overhead', type=float, default=240); ap.add_argument('--laptop-speedup', type=float, default=2.5)   # s to start+download a cloud run; 4 laptop jobs ~2.5x one
ap.add_argument('--repo', default='DeZAYU/render-farm'); ap.add_argument('--account', default='kumai007')   # old private repo: AYUAH-KUMAI/video-render
ap.add_argument('--no-join', action='store_true'); ap.add_argument('--dry', action='store_true')
ap.add_argument('--local-jobs', type=int, default=4); ap.add_argument('--only', nargs='*', default=None); ap.add_argument('--skip-done', action='store_true')
A = ap.parse_args()
BD = os.path.abspath(A.build); TR = json.load(open(A.trace, encoding='utf-8'))
V = os.path.abspath(TR['V']); SEGD = os.path.abspath(TR['seg_dir'])
if not os.path.isfile(os.path.join(BD, A.builder + '.py')):          # 2026-11-14 guard: a relative 'build' from the wrong cwd sent a bad path to 46 machines
    alt = os.path.abspath(os.path.join(V, A.build))
    if os.path.isfile(os.path.join(alt, A.builder + '.py')): print('build dir fixed to', alt); BD = alt
    else: sys.exit(f'STOP: {A.builder}.py not found in {BD} or {alt}; nothing was uploaded')
N = lambda p: os.path.normcase(os.path.abspath(p))
under = lambda p: N(p).startswith(N(V) + os.sep)
rel = lambda p: os.path.relpath(p, V).replace('\\', '/')
env = dict(os.environ, GH_TOKEN=subprocess.run(['gh', 'auth', 'token', '--user', A.account, '--hostname', 'github.com'],
                                               capture_output=True, text=True, check=True).stdout.strip())
gh = lambda *a, **k: subprocess.run(['gh', *a], env=env, check=True, **k)
log = lambda *a: print(time.strftime('%H:%M:%S'), *a, flush=True)


def sha(p, _c={}):
    k = (p, os.path.getmtime(p), os.path.getsize(p))
    if k not in _c:
        h = hashlib.sha1()
        with open(p, 'rb') as f:
            for b in iter(lambda: f.read(1 << 20), b''): h.update(b)
        _c[k] = h.hexdigest()
    return _c[k]


# ---------- 1. inputs ----------
seg = TR['segments']; names = [n for n in seg if (A.only is None or n in A.only) and not (A.skip_done and os.path.exists(os.path.join(SEGD, n + '.mp4')))]
if not names: sys.exit('nothing to render (all segments exist)')
outside = sorted({p for s in seg.values() for p in s['reads'] + TR['boot']
                  if not under(p) and not N(p).startswith(N(os.environ.get('WINDIR', 'C:/Windows'))) and '\\python' not in N(p)})
if outside: log('WARNING: inputs outside the video folder (not shipped):', *outside[:10])
inseg = [p for s in seg.values() for p in s['reads'] if N(p).startswith(N(SEGD) + os.sep)]
if inseg: log('WARNING: segments read other segment files:', *inseg[:5])
code = sorted(set(glob.glob(os.path.join(BD, '*.py')) + glob.glob(os.path.join(BD, '*', '*.py')) + glob.glob(os.path.join(V, '*', '*.py'))))   # + helper modules in subfolders (imports are not traced)
small = [p for s in seg.values() for p in s['reads'] if under(p) and os.path.isfile(p) and not N(p).startswith(N(SEGD) + os.sep)
         and os.path.getsize(p) < 2_000_000]                                 # the trace may credit a cached small file (json, font) to one segment only
always = sorted({rel(p) for p in code + small + [x for x in TR['boot'] if under(x)]})
reads = {n: sorted({rel(p) for p in seg[n]['reads'] if under(p) and os.path.isfile(p)}) for n in names}

# ---------- 2. split: laptop gets the share with the most bytes to upload, cloud the rest (LPT by seconds) ----------
have = {a['name'] for a in json.loads(gh('release', 'view', 'store', '-R', A.repo, '--json', 'assets', capture_output=True, text=True).stdout)['assets']}
files = {r: sha(os.path.join(V, r)) for r in sorted(set(always) | {x for v in reads.values() for x in v})}
newb = lambda n: sum(os.path.getsize(os.path.join(V, r)) for r in reads[n] if files[r] + '.bin' not in have)
tot = sum(seg[n]['sec'] for n in names); budget = max(tot * A.local_frac, max(seg[n]['sec'] for n in names) * 0.5)
def split(budget):
    local, lsec = [], 0.0
    for n in sorted(names, key=lambda n: (-newb(n), -seg[n]['sec'])):
        if budget <= 0: break
        if lsec + seg[n]['sec'] > budget and local: continue
        if lsec >= budget: break
        local.append(n); lsec += seg[n]['sec']
    cloud = [n for n in names if n not in local]
    k = max(1, min(A.shards, 500, len(cloud))); shards = [[] for _ in range(k)]; load = [0.0] * k
    for n in sorted(cloud, key=lambda n: -seg[n]['sec']):
        i = load.index(min(load)); shards[i].append(n); load[i] += seg[n]['sec']
    return local, lsec, cloud, k, shards, load
if A.local_frac >= 0: best = split(0 if A.local_frac == 0 or A.local_jobs == 0 else max(tot * A.local_frac, max(seg[n]['sec'] for n in names) * 0.5))
else:                                                                        # auto: pick the laptop share where both sides end together
    cost = lambda r: max(r[1] / A.laptop_speedup, (A.cloud_overhead + max(r[5])) if r[2] else 0)
    best = min((split(tot * f / 100) for f in range(0, 101, 2)), key=cost)
local, lsec, cloud, k, shards, load = best
log(f'est. laptop {lsec / A.laptop_speedup / 60:.1f} min | cloud {(A.cloud_overhead + max(load)) / 60 if cloud else 0:.1f} min')
need = sorted({files[r] for r in always} | {files[r] for n in cloud for r in reads[n]})
up = [h for h in need if h + '.bin' not in have]
upb = sum(os.path.getsize(os.path.join(V, r)) for r, h in files.items() if h in set(up))
log(f'segments {len(names)} ({tot:.0f} s traced) | laptop {len(local)} ({lsec:.0f} s): {" ".join(local)}')
log(f'cloud {len(cloud)} on {k} machines, longest shard {max(load):.0f} s | upload {len(up)} files {upb / 1e6:.0f} MB')
if A.dry: sys.exit(0)

# ---------- 3. upload missing inputs + manifest ----------
rid = time.strftime('%Y%m%d-%H%M%S')
upd = tempfile.mkdtemp(prefix='.cloud_up_', dir=V)                      # same drive: hard links, no copies
try:
    by = {h: r for r, h in files.items()}
    for h in up:
        try: os.link(os.path.join(V, by[h]), os.path.join(upd, h + '.bin'))
        except OSError: shutil.copyfile(os.path.join(V, by[h]), os.path.join(upd, h + '.bin'))
    for i in range(0, len(up), 20):
        try: gh('release', 'upload', 'store', '-R', A.repo, *[os.path.join(upd, h + '.bin') for h in up[i:i + 20]], capture_output=True, text=True)
        except subprocess.CalledProcessError as e: log('upload failed:', (e.stderr or '')[-400:]); raise
        log('uploaded', min(i + 20, len(up)), '/', len(up))
    man = dict(run=rid, files={r: h for r, h in files.items() if h in set(need)}, always=always,
               reads={n: reads[n] for n in cloud}, shards=shards, build_dir=rel(BD), builder=A.builder, seg_dir=rel(SEGD))
    mp = os.path.join(upd, f'run-{rid}.json'); json.dump(man, open(mp, 'w', encoding='utf-8'))
    gh('release', 'upload', 'store', '-R', A.repo, mp, '--clobber', capture_output=True)
finally:
    shutil.rmtree(upd, ignore_errors=True)                                # only our own temp folder

# ---------- 4. start the cloud, render the laptop share at the same time ----------
gh('workflow', 'run', 'render.yml', '-R', A.repo, '-f', f'run_id={rid}', '-f', f'shards={k}')
run = None
for _ in range(30):
    time.sleep(4)
    rs = json.loads(gh('run', 'list', '-R', A.repo, '--workflow', 'render.yml', '-L', '10', '--json', 'databaseId,displayTitle',
                       capture_output=True, text=True).stdout)
    run = next((r['databaseId'] for r in rs if rid in r['displayTitle']), None)
    if run: break
if not run: sys.exit('cloud run did not start')
log('cloud run', f'https://github.com/{A.repo}/actions/runs/{run}')
# laptop: A.local_jobs parts at a time; when its own list is empty it also takes cloud parts (longest last), until the cloud ends
queue = list(local) + (sorted(cloud, key=lambda n: seg[n]['sec']) if A.steal else []); procs = {}; ldone, lfail = set(), set(); st = None; tchk = 0
def launch(n):
    procs[n] = subprocess.Popen([sys.executable, '-I', '-X', 'utf8', A.builder + '.py', 'seg', n], cwd=BD,
                                stdout=subprocess.DEVNULL, stderr=open(os.path.join(SEGD, n + '.err'), 'w'))
t_start = time.time(); vfail = 0
while True:
    for n, pr in list(procs.items()):
        if pr.poll() is not None:
            (ldone if pr.returncode == 0 else lfail).add(n); del procs[n]; log('laptop done' if pr.returncode == 0 else 'laptop FAILED', n)
    if time.time() - tchk > 30:
        tchk = time.time()
        try: st = json.loads(gh('run', 'view', str(run), '-R', A.repo, '--json', 'status,conclusion', capture_output=True, text=True).stdout); vfail = 0
        except (subprocess.CalledProcessError, ValueError): vfail += 1
        if vfail >= 20 or time.time() - t_start > 150 * 60: log('cloud run not answering: laptop takes over'); st = {'status': 'completed', 'conclusion': 'timeout'}
    cloud_over = bool(st and st['status'] == 'completed')
    while len(procs) < A.local_jobs and queue and (queue[0] in local or not cloud_over):
        n = queue.pop(0)
        if n not in ldone: launch(n)
    if cloud_over and not procs and all(n not in local for n in queue): break
    if not procs and all(n in ldone for n in names):                         # laptop did everything: stop the cloud, do not wait
        subprocess.run(['gh', 'run', 'cancel', str(run), '-R', A.repo], env=env, capture_output=True); st = st or {}; st.setdefault('conclusion', 'cancelled'); break
    time.sleep(3)
lrc = 1 if any(n in lfail for n in local) else 0
log('laptop share exit', lrc, '| cloud', st.get('conclusion'), '| laptop also did', len(ldone - set(local)), 'cloud parts')

# ---------- 5. download + check + join ----------
dl = tempfile.mkdtemp(prefix='.cloud_dl_', dir=V)
os.makedirs(SEGD, exist_ok=True)
try:
    subprocess.run(['gh', 'run', 'download', str(run), '-R', A.repo, '-D', dl, '-p', 'seg-*'], env=env, check=False)
    got = {os.path.basename(p)[:-4]: p for p in glob.glob(os.path.join(dl, 'seg-*', '*.mp4'))}
    for n, p in got.items():
        if n not in ldone: shutil.copyfile(p, os.path.join(SEGD, n + '.mp4'))
finally:
    shutil.rmtree(dl, ignore_errors=True)
miss = [n for n in names if n not in got and n not in ldone]
if miss:                                                                   # cloud short: the laptop renders the rest, A.local_jobs at a time
    log('laptop renders', len(miss), 'missing parts:', *miss); q = list(miss); procs.clear()
    while q or procs:
        while len(procs) < A.local_jobs and q: launch(q.pop(0))
        for n, pr in list(procs.items()):
            if pr.poll() is not None:
                (ldone if pr.returncode == 0 else lfail).add(n); del procs[n]; log('laptop done' if pr.returncode == 0 else 'laptop FAILED', n)
        time.sleep(3)
    miss = [n for n in miss if n not in ldone]
if miss:
    sys.exit(f'FAILED: missing segments {miss}; cloud {st['conclusion']}, laptop exit {lrc}. Re-render them: '
             f'python -I -X utf8 {A.builder}.py seg {" ".join(miss)}')
log('all', len(names), 'segments in', SEGD)
if not A.no_join:
    for m in ('pic', 'final'):
        subprocess.run([sys.executable, '-I', '-X', 'utf8', A.builder + '.py', m], cwd=BD, check=True)
    log('joined')
