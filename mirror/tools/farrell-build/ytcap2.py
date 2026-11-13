# headless capture of the real YouTube comments (no login; consent -> Reject all)
import sys, json, time
from playwright.sync_api import sync_playwright
OUT = sys.argv[1]
URL = "https://www.youtube.com/watch?v=eYQzVLad-5w"
log = []
with sync_playwright() as p:
    b = p.chromium.launch(headless=True, executable_path=r"C:/Users/ayush/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe")
    ctx = b.new_context(viewport={"width": 1920, "height": 1080}, locale="en-US", device_scale_factor=1)
    ctx.add_cookies([{"name": "PREF", "value": "f6=400&hl=en", "domain": ".youtube.com", "path": "/"}])
    pg = ctx.new_page()
    pg.goto(URL, wait_until="domcontentloaded", timeout=60000)
    time.sleep(4)
    log.append(("url", pg.url))
    for sel in ['button:has-text("Reject all")', 'button[aria-label*="Reject all"]', 'tp-yt-paper-button:has-text("Reject all")']:
        try:
            el = pg.locator(sel).first
            if el.count() and el.is_visible():
                el.click(); log.append(("consent", sel)); time.sleep(4); break
        except Exception as e:
            log.append(("err", str(e)[:120]))
    log.append(("url2", pg.url))
    try: pg.evaluate("document.querySelector('video') && document.querySelector('video').pause()")
    except Exception: pass
    for i in range(12):
        pg.mouse.wheel(0, 700); time.sleep(1.2)
        n = pg.locator("ytd-comment-thread-renderer").count()
        if n >= 20: break
    time.sleep(2)
    try: pg.evaluate("document.querySelector('video') && document.querySelector('video').pause()")
    except Exception: pass
    th = pg.locator("ytd-comment-thread-renderer")
    n = th.count(); log.append(("threads", n))
    info = []
    for i in range(min(n, 25)):
        t = th.nth(i)
        try:
            a = t.locator("#author-text").first.inner_text().strip()
            c = t.locator("#content-text").first.inner_text().strip()[:80]
            l = t.locator("#vote-count-middle").first.inner_text().strip()
            bb = t.bounding_box()
            info.append(dict(i=i, author=a, likes=l, text=c, y=bb["y"] + pg.evaluate("window.scrollY") if bb else None))
        except Exception as e:
            info.append(dict(i=i, err=str(e)[:80]))
    log.append(("info", info))
    pg.mouse.move(1910, 1070); pg.evaluate("window.scrollTo(0,0)"); time.sleep(1.5)
    pg.screenshot(path=OUT + "/top.png")
    pg.screenshot(path=OUT + "/full.png", full_page=True)
    json.dump(log, open(OUT + "/log.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    b.close()
print(json.dumps(log, ensure_ascii=False)[:3000])
