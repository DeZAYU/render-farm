"""Fetch job: download this run's manifest + every input once (about 50 API calls per run, not 30 per machine).
The workflow uploads dl/ as artifact "inputs"; the machines download it with actions/download-artifact (no API limit).
A matrix holds at most 256 jobs, so the shard list is cut in two halves (a: 0..249, b: 250..499).
Usage: python -I -X utf8 runner/fetch.py <run_id>   -> prints idxa=[..], idxb=[..], nb=<count of b> for GITHUB_OUTPUT"""
import os, sys, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); import store
HALF = 250
rid = sys.argv[1]; dl = os.path.abspath('dl'); os.makedirs(dl, exist_ok=True)
store.gh(dl, f'run-{rid}.json'); M = json.load(open(os.path.join(dl, f'run-{rid}.json'), encoding='utf-8'))
hs = sorted({h + '.bin' for h in M['files'].values()}); store.gh(dl, *hs)
print('fetched', len(hs), 'files,', round(sum(os.path.getsize(os.path.join(dl, h)) for h in hs) / 1e6), 'MB', file=sys.stderr)
k = len(M['shards'])
if k > 2 * HALF: raise SystemExit(f'{k} shards: max {2 * HALF}')
a, b = list(range(min(k, HALF))), list(range(HALF, k))
print('idxa=' + json.dumps(a)); print('idxb=' + json.dumps(b or [-1])); print(f'nb={len(b)}')
