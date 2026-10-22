"""Hero / entry-screen regression suite. Usage (server must be running):  python scripts/e2e-hero.py
BASE_URL defaults to http://localhost:3111. Requires: pip install playwright && playwright install chromium"""
import os, sys
from playwright.sync_api import sync_playwright

B = os.environ.get('BASE_URL', 'http://localhost:3111')
VIEWPORTS = [(1366, 607), (1440, 700), (1920, 940), (1280, 600), (1024, 600), (768, 1024), (414, 896), (390, 700), (375, 667), (360, 640)]
HERO = ['.gate-02', '.wordmark', '.gate-sub', '.face-btn', '.gate .countdown', '.enter', '.enter-note']
results = []

def check(name, cond, extra=''):
    results.append(bool(cond)); print(('PASS ' if cond else 'FAIL ') + name + (f'  {extra}' if extra else ''))

def rect(pg, sel):
    return pg.evaluate("s=>{const e=document.querySelector(s);if(!e)return null;const r=e.getBoundingClientRect();return {t:r.top,b:r.bottom,l:r.left,r:r.right}}", sel)

with sync_playwright() as p:
    br = p.chromium.launch()

    # 1. Fit + visibility at every viewport (after the loader and the staged entrance)
    for w, h in VIEWPORTS:
        ctx = br.new_context(viewport={'width': w, 'height': h}, has_touch=w < 800, is_mobile=w < 800)
        pg = ctx.new_page(); pg.goto(B); pg.wait_for_timeout(7500)
        boxes = {s: rect(pg, s) for s in HERO}
        missing = [s for s, v in boxes.items() if not v]
        check(f'{w}x{h}: all hero elements exist', not missing, str(missing))
        if not missing:
            bottom = max(boxes['.enter']['b'], boxes['.enter-note']['b'])
            check(f'{w}x{h}: hero fits first screen', bottom <= h, f'(bottom {bottom:.0f}px of {h}px)')
            check(f'{w}x{h}: wordmark clear of top edge', boxes['.wordmark']['t'] >= 0)
            check(f'{w}x{h}: no horizontal overflow', pg.evaluate('document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1'))
            hidden = pg.evaluate("s=>s.filter(x=>+getComputedStyle(document.querySelector(x)).opacity<0.99)", HERO)
            check(f'{w}x{h}: entrance finished, nothing left hidden', not hidden, str(hidden))
        ctx.close()

    # 2. Production look + behaviour (desktop)
    ctx = br.new_context(viewport={'width': 1366, 'height': 607}); pg = ctx.new_page(); pg.goto(B); pg.wait_for_timeout(7500)
    check('"2nd Anniversary" is production red', pg.evaluate("getComputedStyle(document.querySelector('.gate-sub')).color") == 'rgb(184, 15, 15)')
    check('wordmark capped by viewport height (<= 74vh)', rect(pg, '.wordmark')['r'] - rect(pg, '.wordmark')['l'] <= 607 * 0.74 + 1)
    check('countdown has 4 units', pg.locator('.gate .cd').count() == 4)
    check('event link kept', pg.locator('.enter-note a').get_attribute('href') == '/events/raveoween-anniversary')
    nav = [t.strip().lower() for t in pg.locator('header nav[aria-label="Primary"] a').all_inner_texts()]
    check('Stage 2 nav retained', nav == ['events', 'editions', 'artists', 'house rules', 'archive', 'about', 'community'], str(nav))
    pg.get_by_role('button', name='Wake the grin').click(); pg.wait_for_timeout(200)
    check('grin scare class toggles', pg.locator('.face-btn.scare').count() == 1)
    pg.get_by_role('button', name='Enter without sound').click(); pg.wait_for_timeout(1500)
    check('"Enter without sound" scrolls to the experience', pg.evaluate("document.getElementById('experience').getBoundingClientRect().top") < 300)
    check('sound stays off', pg.locator('button.sound[aria-pressed]').first.get_attribute('aria-pressed') == 'false')
    pg.goto(B); pg.wait_for_timeout(2500)
    pg.get_by_role('button', name='Enter Raveoween').click(); pg.wait_for_timeout(1500)
    check('"Enter Raveoween" turns sound on', pg.locator('button.sound[aria-pressed]').first.get_attribute('aria-pressed') == 'true')
    ctx.close()

    # 3. Header never overlaps / overflows between 1024 and 1920px
    for w in (1024, 1100, 1280, 1366, 1920):
        ctx = br.new_context(viewport={'width': w, 'height': 700}); pg = ctx.new_page(); pg.goto(B); pg.wait_for_timeout(800)
        ok = pg.evaluate("""()=>{const bar=document.querySelector('header.bar');const kids=[...bar.children].filter(e=>e.getBoundingClientRect().width>0);
          const rs=kids.map(e=>e.getBoundingClientRect());for(let i=1;i<rs.length;i++){if(rs[i].left<rs[i-1].right-1)return false}
          return rs[rs.length-1].right<=document.documentElement.clientWidth+1}""")
        check(f'header {w}px: no overlap or overflow', ok); ctx.close()

    # 4. Reduced motion: loader skipped, hero fully visible immediately
    ctx = br.new_context(viewport={'width': 1366, 'height': 607}, reduced_motion='reduce'); pg = ctx.new_page(); pg.goto(B); pg.wait_for_timeout(700)
    hidden = pg.evaluate("s=>s.filter(x=>+getComputedStyle(document.querySelector(x)).opacity<0.99)", HERO)
    check('reduced motion: hero visible immediately', not hidden, str(hidden))
    ctx.close(); br.close()

bad = results.count(False)
print(f'\n{len(results)} checks, {bad} failed'); sys.exit(1 if bad else 0)
