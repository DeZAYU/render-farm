"""Generic task machine: any script, any list of items.
Places every file of the run (from the fetch artifact dl/) into work/, then runs the manifest's command once per item
of this machine's share. {item} = the item, {out} = this machine's out/ folder (uploaded as artifact out-<i>).
Usage: python -I -X utf8 runner/task_shard.py <run_id> <shard index>"""
import os, sys, json, shutil, subprocess
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); import store
rid, i = sys.argv[1], int(sys.argv[2])
dl, work, out = (os.path.abspath(x) for x in ('dl', 'work', 'out'))
for d in (dl, work, out): os.makedirs(d, exist_ok=True)
store.gh(dl, f'run-{rid}.json'); M = json.load(open(os.path.join(dl, f'run-{rid}.json'), encoding='utf-8'))
items = M['shards'][i] if 0 <= i < len(M['shards']) else []
if not items: print('machine', i, 'has no work'); sys.exit(0)
store.gh(dl, *sorted({h + '.bin' for h in M['files'].values()}))
for p, h in M['files'].items():
    d = os.path.join(work, p); os.makedirs(os.path.dirname(d), exist_ok=True); shutil.copyfile(os.path.join(dl, h + '.bin'), d)
if '--place-only' in sys.argv: sys.exit(0)                 # first pass: files only (the workflow then installs work/requirements.txt)
fail = []
for it in items:
    cmd = [x.replace('{item}', it).replace('{out}', out) for x in M['cmd']]
    print('>>', it, flush=True)
    if subprocess.run(cmd, cwd=work).returncode: fail.append(it)
print('ok', len(items) - len(fail), '/', len(items), '| failed:', *fail)
sys.exit(1 if fail else 0)
