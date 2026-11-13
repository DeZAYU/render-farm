"""Any task on up to 500 GitHub machines (public repo DeZAYU/render-farm, Enterprise).
Give it a folder (your script + its files) and a list of items. It splits the items equally over the machines,
runs the command once per item on the machines, and downloads every machine's out/ folder back.

  python -I -X utf8 farm.py <folder> --cmd "python my.py {item} {out}" --items a.mp4 b.mp4 ...   (or --items-file list.txt)
                     [--shards 500] [--os ubuntu-latest|windows-latest] [--weights sizes] [--dry]
  {item} = one item (often a file path inside <folder>), {out} = the machine's output folder.
  Results: <folder>/farm_out/<run id>/  (one sub folder per machine).
WARNING: the repo is PUBLIC. Every uploaded file (release "store") can be downloaded by anyone. Never send keys or .env files.
Never prints the token."""
import os, sys, json, time, shlex, hashlib, shutil, subprocess, argparse, tempfile, glob

ap = argparse.ArgumentParser()
ap.add_argument('folder'); ap.add_argument('--cmd', required=True)
ap.add_argument('--items', nargs='*', default=[]); ap.add_argument('--items-file')
ap.add_argument('--shards', type=int, default=500); ap.add_argument('--os', default='ubuntu-latest')
ap.add_argument('--weights', choices=['equal', 'sizes'], default='equal')   # sizes: balance by file size of each item
ap.add_argument('--repo', default='DeZAYU/render-farm'); ap.add_argument('--account', default='kumai007')
ap.add_argument('--dry', action='store_true')
A = ap.parse_args()
F = os.path.abspath(A.folder)
items = A.items + ([l.strip() for l in open(A.items_file, encoding='utf-8') if l.strip()] if A.items_file else [])
if not items: sys.exit('no items')
SKIP = {'.git', 'node_modules', '__pycache__', '.cache', 'farm_out', '.venv', 'venv'}
files = {}
for root, dirs, fs in os.walk(F):
    dirs[:] = [d for d in dirs if d not in SKIP]
    for f in fs:
        if f.startswith('.env') or f.endswith(('.key', '.pem')): sys.exit(f'refused: secret-looking file {os.path.join(root, f)} (public repo)')
        p = os.path.join(root, f); files[os.path.relpath(p, F).replace('\\', '/')] = p
def sha(p):
    h = hashlib.sha1()
    with open(p, 'rb') as f:
        for b in iter(lambda: f.read(1 << 20), b''): h.update(b)
    return h.hexdigest()

# ---------- equal split: same number of items per machine (or same total bytes with --weights sizes) ----------
w = {it: (os.path.getsize(os.path.join(F, it)) if A.weights == 'sizes' and os.path.isfile(os.path.join(F, it)) else 1) for it in items}
k = max(1, min(A.shards, 500, len(items))); shards = [[] for _ in range(k)]; load = [0] * k
for it in sorted(items, key=lambda x: -w[x]):
    j = load.index(min(load)); shards[j].append(it); load[j] += w[it]
log = lambda *a: print(time.strftime('%H:%M:%S'), *a, flush=True)
log(f'{len(items)} items on {k} machines ({min(map(len, shards))}-{max(map(len, shards))} each) | {len(files)} files, '
    f'{sum(map(os.path.getsize, files.values())) / 1e6:.0f} MB | cmd: {A.cmd}')
if A.dry: sys.exit(0)

env = dict(os.environ, GH_TOKEN=subprocess.run(['gh', 'auth', 'token', '--user', A.account, '--hostname', 'github.com'],
                                               capture_output=True, text=True, check=True).stdout.strip())
gh = lambda *a, **k: subprocess.run(['gh', *a], env=env, check=True, **k)
have = {a['name'] for a in json.loads(gh('release', 'view', 'store', '-R', A.repo, '--json', 'assets', capture_output=True, text=True).stdout)['assets']}
H = {r: sha(p) for r, p in files.items()}
up = sorted({h for h in H.values() if h + '.bin' not in have})
rid = time.strftime('%Y%m%d-%H%M%S'); upd = tempfile.mkdtemp(prefix='.farm_up_')
try:
    by = {h: files[r] for r, h in H.items()}
    for h in up: shutil.copyfile(by[h], os.path.join(upd, h + '.bin'))
    for i in range(0, len(up), 20):
        gh('release', 'upload', 'store', '-R', A.repo, *[os.path.join(upd, h + '.bin') for h in up[i:i + 20]], capture_output=True)
        log('uploaded', min(i + 20, len(up)), '/', len(up))
    mp = os.path.join(upd, f'run-{rid}.json')
    json.dump(dict(run=rid, kind='task', files=H, cmd=shlex.split(A.cmd, posix=True), shards=shards), open(mp, 'w', encoding='utf-8'))
    gh('release', 'upload', 'store', '-R', A.repo, mp, '--clobber', capture_output=True)
finally:
    shutil.rmtree(upd, ignore_errors=True)                                # only our own temp folder
gh('workflow', 'run', 'task.yml', '-R', A.repo, '-f', f'run_id={rid}', '-f', f'os={A.os}')
run = None
for _ in range(30):
    time.sleep(4)
    rs = json.loads(gh('run', 'list', '-R', A.repo, '--workflow', 'task.yml', '-L', '10', '--json', 'databaseId,displayTitle', capture_output=True, text=True).stdout)
    run = next((r['databaseId'] for r in rs if rid in r['displayTitle']), None)
    if run: break
if not run: sys.exit('cloud run did not start')
log('cloud run', f'https://github.com/{A.repo}/actions/runs/{run}')
subprocess.run(['gh', 'run', 'watch', str(run), '-R', A.repo, '-i', '30', '--compact'], env=env, stdout=subprocess.DEVNULL)
st = json.loads(gh('run', 'view', str(run), '-R', A.repo, '--json', 'conclusion', capture_output=True, text=True).stdout)['conclusion']
dst = os.path.join(F, 'farm_out', rid); os.makedirs(dst, exist_ok=True)
subprocess.run(['gh', 'run', 'download', str(run), '-R', A.repo, '-D', dst, '-p', 'out-*'], env=env, check=False)
log('cloud', st, '| results in', dst, '|', len(glob.glob(os.path.join(dst, '*', '**', '*'), recursive=True)), 'files')
sys.exit(0 if st == 'success' else 1)
