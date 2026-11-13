"""Content store = release "store" of this repo (one asset per file, <sha1>.bin). Few API calls: list once, lazily."""
import os, sys, json, time, shutil, urllib.request, urllib.error
REPO = os.environ['GITHUB_REPOSITORY']; TOK = os.environ['GH_TOKEN']; API = f'https://api.github.com/repos/{REPO}'
class _NoRedir(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *a): return None
_op = urllib.request.build_opener(_NoRedir)
def _get(url, accept='application/vnd.github+json', auth=True):
    """GET with retry: waits out rate limits (403/429) and short API errors"""
    for t in range(12):
        h = {'Accept': accept, 'User-Agent': 'video-render-runner', 'X-GitHub-Api-Version': '2022-11-28'}
        if auth: h['Authorization'] = 'Bearer ' + TOK
        try: return (_op if auth else urllib.request.build_opener()).open(urllib.request.Request(url, headers=h), timeout=120)
        except urllib.error.HTTPError as e:
            if e.code in (301, 302, 303, 307, 308): return e
            rst = e.headers.get('x-ratelimit-reset'); left = e.headers.get('x-ratelimit-remaining')
            w = min(600, max(15, int(rst) - time.time() + 5)) if (left == '0' and rst) else min(120, 10 * (t + 1))
            print(f'  api {e.code} on {url.rsplit("/", 1)[-1][:40]}, retry in {w:.0f} s', file=sys.stderr, flush=True); time.sleep(w)
        except (urllib.error.URLError, TimeoutError, ConnectionError) as e:
            print('  net error', e, file=sys.stderr, flush=True); time.sleep(10 * (t + 1))
    raise SystemExit(f'api failed: {url}')
ASSET = {}
def _list():
    rel = json.load(_get(f'{API}/releases/tags/store'))
    for pg in range(1, 100):
        a = json.load(_get(f'{API}/releases/{rel["id"]}/assets?per_page=100&page={pg}'))
        ASSET.update({x['name']: x['id'] for x in a})
        if len(a) < 100: break
def gh(dl, *names):
    """make sure dl/<name> exists for each name; downloads only what is missing (the fetch job's artifact has the rest)"""
    for n in names:
        d = os.path.join(dl, n)
        if os.path.exists(d): continue
        if not ASSET: _list()
        if n not in ASSET: raise SystemExit(f'not in store: {n}')
        r = _get(f'{API}/releases/assets/{ASSET[n]}', 'application/octet-stream')
        loc = r.headers.get('Location')
        if loc: r = _get(loc, '*/*', auth=False)          # signed storage URL: no token
        with open(d + '.part', 'wb') as f: shutil.copyfileobj(r, f, 1 << 20)
        os.replace(d + '.part', d)
