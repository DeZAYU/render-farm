"""Keep the PUBLIC repo DeZAYU/render-farm up to date with the pipeline and this folder.
Runs every 15 min (Windows task "RenderFarmSync"). Steps:
 1. copy the text/code files of the STYLE guide folder (CLAUDE.md, docs/, styleguide/, tools/) into farm/mirror/
    (no media, no files > 1 MB, no .env, no node_modules/caches/backups);
 2. scan for keys/tokens: if one is found, NOTHING is pushed (see .farm_sync.log);
 3. commit + push farm/ (runner, workflows, mirror) when something changed.
Usage: pythonw -I -X utf8 sync_farm.py [--dry]      Turn off: schtasks /Delete /TN RenderFarmSync /F
Never prints the token."""
import os, re, sys, time, base64, shutil, subprocess
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
FARM = os.path.join(HERE, 'farm'); MIR = os.path.join(FARM, 'mirror'); LOG = os.path.join(HERE, '.farm_sync.log')
REPO, ACCOUNT = 'DeZAYU/render-farm', 'kumai007'
TOP = ['CLAUDE.md', 'docs', 'styleguide', 'tools']
EXT = {'.md', '.json', '.py', '.yml', '.yaml', '.txt', '.cmd', '.bat', '.ps1', '.js', '.mjs', '.ts', '.tsx', '.css', '.html', '.toml', '.cfg', '.ini', '.example'}
SKIPD = {'.git', 'node_modules', '__pycache__', '.cache', '.venv', 'venv', 'farm', 'repo', 'pages', 'out', 'renders', 'farm_out'}
SECRET = re.compile(rb'(gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,}|sk-[A-Za-z0-9_-]{20,}|sk-ant-[A-Za-z0-9_-]{20,}|AKIA[0-9A-Z]{16}'
                    rb'|AIza[0-9A-Za-z_-]{35}|xox[abpr]-[A-Za-z0-9-]{10,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)')


def log(*a):
    try:
        if os.path.exists(LOG) and os.path.getsize(LOG) > 200_000: os.replace(LOG, LOG + '.old')
        with open(LOG, 'a', encoding='utf-8') as f: f.write(time.strftime('%Y-%m-%d %H:%M:%S ') + ' '.join(map(str, a)) + '\n')
    except OSError: pass
    if sys.stdout: print(*a, flush=True)


def wanted():
    out = {}
    for t in TOP:
        s = os.path.join(ROOT, t)
        if os.path.isfile(s): out[t] = s; continue
        for r, ds, fs in os.walk(s):
            ds[:] = [d for d in ds if d not in SKIPD and not d.startswith(('_backup', '.'))]
            for f in fs:
                p = os.path.join(r, f); e = os.path.splitext(f)[1].lower()
                if f.startswith('.env') and not f.endswith('.example'): continue
                if e not in EXT or '.bak' in f or os.path.getsize(p) > 1_000_000: continue
                out[os.path.relpath(p, ROOT).replace('\\', '/')] = p
    return out


def known_secrets():
    """values from local .env files and key env vars: they must never appear in the public repo"""
    vals = [os.environ.get('EPIDEMIC_SOUND_API_KEY', '')]
    for r, ds, fs in os.walk(os.path.join(ROOT, 'tools')):
        ds[:] = [d for d in ds if d not in SKIPD]
        for f in fs:
            if f.startswith('.env') and not f.endswith('.example'):
                for l in open(os.path.join(r, f), encoding='utf-8', errors='ignore'):
                    if '=' in l and not l.lstrip().startswith('#') and re.search(r'KEY|TOKEN|SECRET|PASS|AUTH|COOKIE', l.split('=', 1)[0], re.I):
                        vals.append(l.split('=', 1)[1].strip().strip('"\''))
    return [v.encode() for v in vals if len(v) >= 12]


def main(dry):
    W = wanted(); bad = []; ks = known_secrets()
    for r, p in W.items():
        b = open(p, 'rb').read()
        if SECRET.search(b) or any(k in b for k in ks): bad.append(r)
    if bad: log('BLOCKED: key/token found, nothing pushed. Fix or exclude:', *bad); return 2
    old = {os.path.relpath(os.path.join(r, f), MIR).replace('\\', '/') for r, _, fs in os.walk(MIR) for f in fs} if os.path.isdir(MIR) else set()
    n = 0
    for r, p in W.items():
        d = os.path.join(MIR, r)
        if not os.path.exists(d) or open(d, 'rb').read() != open(p, 'rb').read():
            n += 1
            if not dry: os.makedirs(os.path.dirname(d), exist_ok=True); shutil.copyfile(p, d)
    gone = old - set(W)
    for r in gone:
        if not dry: os.remove(os.path.join(MIR, r))                  # only inside our own mirror folder
    log(f'mirror: {len(W)} files, {n} changed, {len(gone)} removed' + (' (dry)' if dry else ''))
    if dry: return 0
    g = lambda *a, **k: subprocess.run(['git', '-C', FARM, *a], capture_output=True, text=True, **k)
    g('add', '-A')
    if not g('status', '--porcelain').stdout.strip(): log('no change'); return 0
    g('commit', '-q', '-m', 'sync: pipeline + folder ' + time.strftime('%Y-%m-%d %H:%M'))
    tok = subprocess.run(['gh', 'auth', 'token', '--user', ACCOUNT, '--hostname', 'github.com'], capture_output=True, text=True).stdout.strip()
    hdr = 'AUTHORIZATION: basic ' + base64.b64encode(f'x-access-token:{tok}'.encode()).decode()
    env = dict(os.environ, GIT_CONFIG_COUNT='1', GIT_CONFIG_KEY_0='http.https://github.com/.extraheader', GIT_CONFIG_VALUE_0=hdr)
    r = g('push', '-q', 'origin', 'HEAD:main', env=env)
    log('pushed' if r.returncode == 0 else 'PUSH FAILED: ' + r.stderr.replace(tok, '***')[-300:])
    return r.returncode


if __name__ == '__main__':
    sys.exit(main('--dry' in sys.argv))
