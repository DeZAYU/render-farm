# ytcap3: element screenshots of specific YouTube comments (no login; consent -> Reject all).
# usage: python ytcap3.py explore OUTDIR        -> OUTDIR/explore.json (all threads + target replies)
#        python ytcap3.py capture OUTDIR PLAN   -> OUTDIR/<key>.png + manifest.json (PLAN = json list of targets)
# PLAN item: {key, parent_author, author ("@kenyama" or same as parent), match (substring of ORIGINAL text),
#             hl: [phrase in displayed text, ...], parent_key (optional: save parent as that name)}
import sys, json, time, re
from playwright.sync_api import sync_playwright

MODE, OUT = sys.argv[1], sys.argv[2]
URL = "https://www.youtube.com/watch?v=eYQzVLad-5w"
EXE = r"C:/Users/ayush/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe"
TARGET_AUTHORS = ["@トオル鷹山", "@nishuiii", "@user-sculptor88", "@松井佑太-y1t", "@vow5206", "@我寿丸"]
HIDE_CSS = """
#masthead-container, ytd-masthead, tp-yt-iron-overlay-backdrop, ytd-consent-bump-v2-lightbox,
ytd-popup-container, #chat, ytd-miniplayer { display: none !important; }
"""

def pause(pg):
    try: pg.evaluate("document.querySelectorAll('video').forEach(v=>{v.pause(); v.muted=true})")
    except Exception: pass

def norm(s): return re.sub(r"\s+", "", s or "")

JS_THREADS = """() => [...document.querySelectorAll('ytd-comment-thread-renderer')].map((t,i)=>{
  const c = t.querySelector('#comment') || t;
  const q = s => { const e = c.querySelector(s); return e ? e.innerText.trim() : '' };
  const rb = t.querySelector('ytd-comment-replies-renderer #more-replies, ytd-comment-replies-renderer button');
  return {i, author: q('#author-text'), text: q('#content-text'), likes: q('#vote-count-middle'),
          time: q('#published-time-text'), replies: rb ? rb.innerText.trim() : ''};
})"""

def open_page(p, dsf):
    b = p.chromium.launch(headless=True, executable_path=EXE)
    ctx = b.new_context(viewport={"width": 1920, "height": 1080}, locale="en-US", device_scale_factor=dsf,
                        color_scheme="dark")
    ctx.add_cookies([{"name": "PREF", "value": "f6=400&hl=en&gl=US", "domain": ".youtube.com", "path": "/"}])
    pg = ctx.new_page()
    pg.goto(URL, wait_until="domcontentloaded", timeout=60000)
    time.sleep(4)
    for sel in ['button:has-text("Reject all")', 'button[aria-label*="Reject all"]']:
        try:
            el = pg.locator(sel).first
            if el.count() and el.is_visible():
                el.click(); time.sleep(4); break
        except Exception: pass
    pause(pg)
    return b, pg

def load_all(pg, want=TARGET_AUTHORS, max_iter=200):
    last, still = -1, 0
    for it in range(max_iter):
        pg.mouse.move(700, 600); pg.mouse.wheel(0, 1600)   # real wheel events trigger the comment continuation
        time.sleep(1.6); pause(pg)
        th = pg.evaluate(JS_THREADS)
        auth = {t["author"] for t in th}
        if all(a in auth for a in want): break
        if len(th) == last:
            still += 1
            if still >= (10 if th else 30): break
            if not th and still % 5 == 0:   # comments not rendered yet: jump back near the player and retry
                pg.evaluate("window.scrollTo(0, 600)"); time.sleep(2)
        else: still = 0
        last = len(th)
        if it % 5 == 0: print("load", it, len(th), flush=True)
    return pg.evaluate(JS_THREADS)

def thread_of(pg, author):
    th = pg.locator("ytd-comment-thread-renderer")
    for i in range(th.count()):
        t = th.nth(i)
        a = t.locator("#comment #author-text").first
        if a.count() and a.inner_text().strip() == author:
            return t
    return None

def expand(pg, t):
    btn = t.locator("ytd-comment-replies-renderer button:visible", has_text=re.compile(r"repl", re.I)).first
    if btn.count():
        try:
            btn.scroll_into_view_if_needed(timeout=5000); btn.click(timeout=5000); time.sleep(3)
        except Exception as ex: print("expand fail", str(ex)[:100])
    for _ in range(8):   # "Show more replies"
        more = t.locator("ytd-comment-replies-renderer button:visible", has_text=re.compile(r"more repl", re.I)).first
        if more.count():
            try: more.click(timeout=5000); time.sleep(2.5)
            except Exception: break
        else: break

def replies(t):
    r = t.locator("#replies ytd-comment-view-model, #replies ytd-comment-renderer")
    out = []
    for i in range(r.count()):
        e = r.nth(i)
        out.append(dict(i=i, author=e.locator("#author-text").first.inner_text().strip(),
                        text=e.locator("#content-text").first.inner_text().strip(),
                        likes=e.locator("#vote-count-middle").first.inner_text().strip(),
                        time=e.locator("#published-time-text").first.inner_text().strip()))
    return out, r

JS_BOX = """([el, phrases]) => {
  const er = el.getBoundingClientRect();
  const ct = el.querySelector('#content-text');
  // build flat text over text nodes
  const w = document.createTreeWalker(ct, NodeFilter.SHOW_TEXT); const nodes=[]; let full='';
  while (w.nextNode()) { nodes.push([w.currentNode, full.length]); full += w.currentNode.data; }
  const res = [];
  for (const grp of phrases) {   // each group = list of regex alternatives; first match wins
    let k = -1, ph = null;
    for (const alt of grp) { const m = new RegExp(alt, 'i').exec(full); if (m) { k = m.index; ph = m[0]; break; } }
    if (k < 0) { res.push({phrase: grp, found: false}); continue; }
    const pos = off => { for (let j=nodes.length-1;j>=0;j--) if (off>=nodes[j][1]) return [nodes[j][0], off-nodes[j][1]]; };
    const r = document.createRange(); const [n0,o0]=pos(k); const [n1,o1]=pos(k+ph.length-1);
    r.setStart(n0,o0); r.setEnd(n1,o1+1);
    const rects = [...r.getClientRects()].map(q=>({x:q.left-er.left, y:q.top-er.top, w:q.width, h:q.height}));
    res.push({phrase: ph, found: true, rects});
  }
  return res;
}"""

def translate(pg, e):
    """Click YouTube's own 'Translate to English' under this comment; True if text changed."""
    before = e.locator("#content-text").first.inner_text()
    btn = e.locator("#translate-button button, #translate-button, button:has-text('Translate to English'), "
                    "yt-formatted-string:has-text('Translate to English'), span:has-text('Translate to English')").first
    if not btn.count():
        hid = e.locator(".translate-button[hidden]").count()
        return False, ("YouTube's .translate-button exists but is hidden with no label/data (logged-out session); "
                       "Japanese original shown" if hid else "no translate control")
    try:
        btn.scroll_into_view_if_needed(); btn.click(); time.sleep(3)
    except Exception as ex: return False, "click failed " + str(ex)[:80]
    after = e.locator("#content-text").first.inner_text()
    return after != before, "clicked"

def shot(pg, e, path, dsf, phrases):
    pg.mouse.move(5, 5); pause(pg)
    e.scroll_into_view_if_needed(); pg.evaluate("window.scrollBy(0, -200)"); time.sleep(0.8)
    e.screenshot(path=path, animations="disabled")
    boxes = pg.evaluate(JS_BOX, [e.element_handle(), phrases]) if phrases else []
    for bx in boxes:
        for r in bx.get("rects", []):
            for k in r: r[k] = round(r[k] * dsf, 1)
    return boxes

def info(e):
    g = lambda s: (e.locator(s).first.inner_text().strip() if e.locator(s).count() else "")
    return dict(author=g("#author-text"), text=g("#content-text"), likes=g("#vote-count-middle"), time=g("#published-time-text"))

with sync_playwright() as p:
    if MODE == "explore":
        b, pg = open_page(p, 1)
        pg.add_style_tag(content=HIDE_CSS)
        th = load_all(pg)
        res = dict(threads=th, targets={})
        for a in TARGET_AUTHORS:
            t = thread_of(pg, a)
            if not t: res["targets"][a] = None; continue
            expand(pg, t)
            rs, _ = replies(t)
            tb = t.locator("#comment").first
            res["targets"][a] = dict(parent=info(tb), replies=rs,
                                     translate_ctrl=tb.locator("#translate-button").count())
        json.dump(res, open(OUT + "/explore.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        b.close()
    else:
        plan = json.load(open(sys.argv[3], encoding="utf-8"))
        DSF = 2
        b, pg = open_page(p, DSF)
        pg.add_style_tag(content=HIDE_CSS)
        load_all(pg, want=sorted({x["parent_author"] for x in plan}))
        pg.add_style_tag(content=HIDE_CSS)
        man = []
        for x in plan:
            m = dict(key=x["key"], file=x["key"] + ".png", found=False, translated_by_youtube=False)
            t = thread_of(pg, x["parent_author"])
            if not t:
                m["why"] = "parent thread %s not in loaded list" % x["parent_author"]; man.append(m); continue
            if x.get("author", x["parent_author"]) == x["parent_author"] and not x.get("match_reply"):
                e = t.locator("#comment ytd-comment-view-model, #comment").first
            else:
                expand(pg, t)
                rs, r = replies(t)
                idx = [q["i"] for q in rs if q["author"] == x["author"] and norm(x["match"]) in norm(q["text"])]
                if not idx:
                    m["why"] = "reply not found under %s" % x["parent_author"]; man.append(m); continue
                e = r.nth(idx[0])
            m["original_text"] = info(e)["text"]
            ok, note = translate(pg, e)
            m["translated_by_youtube"], m["translate_note"] = ok, note
            m["box"] = shot(pg, e, OUT + "/" + m["file"], DSF, x.get("hl", []))
            m.update(found=True, **{k: v for k, v in info(e).items() if k != "text"})
            m["displayed_text"] = info(e)["text"]
            m["box_note"] = x.get("box_note", "")
            man.append(m)
        json.dump(man, open(OUT + "/manifest.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        b.close()
print("done", MODE)

