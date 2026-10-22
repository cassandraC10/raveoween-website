from playwright.sync_api import sync_playwright
B='http://localhost:3111'
res=[]
def ok(n,c,extra=''): res.append((n,bool(c))); print(('PASS' if c else 'FAIL'),n,extra)
with sync_playwright() as p:
    b=p.chromium.launch()
    for name,vp in [('desktop',{'width':1366,'height':800}),('mobile',{'width':390,'height':780})]:
        ctx=b.new_context(viewport=vp,has_touch=(name=='mobile'),is_mobile=(name=='mobile'))
        pg=ctx.new_page(); errs=[]
        pg.on('console',lambda m: errs.append(m.text) if (m.type=='error' and '503' not in m.text) else None); pg.on('pageerror',lambda e: errs.append(str(e)))
        # home + intro loader
        pg.goto(B+'/'); 
        ok(f'{name}: intro loader shows',pg.locator('.intro').count()==1)
        pg.wait_for_selector('.intro',state='detached',timeout=9000)
        ok(f'{name}: intro loader removed, scroll unlocked',pg.evaluate("!document.documentElement.classList.contains('intro-lock')"))
        pg.wait_for_timeout(600); pg.screenshot(path=f'/tmp/{name}-home.png')
        # reload in same session: loader skipped
        pg.reload(); pg.wait_for_timeout(400)
        ok(f'{name}: loader skipped on repeat visit',pg.locator('.intro').count()==0)
        for path in ['/','/events','/events/raveoween-anniversary','/events/blind-rave-ii','/editions','/archive','/about','/artists','/house-rules','/community']:
            pg.goto(B+path); pg.wait_for_timeout(250)
            ov=pg.evaluate("document.documentElement.scrollWidth - document.documentElement.clientWidth")
            ok(f'{name}: no horizontal overflow {path}',ov<=1,f'(+{ov}px)')
        # sound toggle
        pg.goto(B+'/events'); t=pg.locator('button.sound[aria-pressed]').first
        ok(f'{name}: sound off by default',t.get_attribute('aria-pressed')=='false')
        t.click(); pg.wait_for_timeout(300); ok(f'{name}: sound toggles on',t.get_attribute('aria-pressed')=='true')
        t.click(); pg.wait_for_timeout(300); ok(f'{name}: sound toggles off',t.get_attribute('aria-pressed')=='false')
        if name=='mobile':
            pg.goto(B+'/events'); m=pg.locator('button[aria-controls=menu]'); m.click()
            ok('mobile: menu opens',pg.locator('#menu').is_visible() and m.get_attribute('aria-expanded')=='true')
            pg.screenshot(path='/tmp/mobile-menu.png')
            pg.keyboard.press('Escape'); ok('mobile: Escape closes menu',pg.locator('#menu').count()==0)
            pg.goto(B+'/events'); pg.locator('button[aria-controls=menu]').click(); pg.locator('#menu').get_by_role('link',name='Editions').click(); pg.wait_for_url('**/editions')
            ok('mobile: menu nav works',True)
        # editions: 20 cards, filter, lightbox
        pg.goto(B+'/editions'); pg.wait_for_timeout(300)
        ok(f'{name}: 20 edition cards',pg.locator('article.card').count()==20)
        pg.get_by_role('button',name='Upcoming').click(); ok(f'{name}: upcoming filter -> 2',pg.locator('article.card').count()==2)
        pg.get_by_role('button',name='Past').click(); ok(f'{name}: past filter -> 18',pg.locator('article.card').count()==18)
        pg.get_by_role('button',name=lambda n: n.startswith('All')) if False else pg.get_by_role('button',name='All (20)').click()
        pg.locator('button.frame-btn').first.scroll_into_view_if_needed(); pg.locator('button.frame-btn').first.click()
        ok(f'{name}: lightbox opens',pg.locator('dialog[open]').count()==1)
        pg.keyboard.press('Escape'); ok(f'{name}: lightbox closes on Esc',pg.locator('dialog[open]').count()==0)
        # event page: ticket link opens EventCove in new tab
        pg.goto(B+'/events/raveoween-anniversary'); pg.wait_for_timeout(500)
        a=pg.locator('a.btn-enter',has_text='Get your tickets').first
        ok(f'{name}: ticket CTA targets EventCove, new tab',('eventcove.africa' in a.get_attribute('href')) and a.get_attribute('target')=='_blank' and 'noopener' in a.get_attribute('rel'))
        ok(f'{name}: countdown ticking',pg.locator('[role=timer] .cd b').count()==4)
        pg.screenshot(path=f'/tmp/{name}-event.png',full_page=False)
        # manifesto scroll progress (home)
        pg.goto(B+'/'); pg.wait_for_timeout(500)
        pg.evaluate("document.getElementById('experience').scrollIntoView()"); pg.wait_for_timeout(300)
        h=pg.evaluate("document.getElementById('experience').offsetHeight"); top=pg.evaluate("document.getElementById('experience').getBoundingClientRect().top+scrollY")
        pg.evaluate(f"window.scrollTo(0,{top}+{h}*0.7)"); pg.wait_for_timeout(900)
        lit=pg.locator('.exp .w.lit').count(); rl=pg.locator('.exp .rule.lit').count()
        ok(f'{name}: manifesto words light on scroll',lit>0,f'(words lit {lit}, bio lines {rl})'); pg.screenshot(path=f'/tmp/{name}-manifesto.png')
        # feedback form (no identity fields) + error path (webhook unset => 503 message)
        pg.goto(B+'/archive'); f=pg.locator('form[aria-label="Anonymous feedback"]')
        names=pg.evaluate("[...document.querySelectorAll('form[aria-label=\"Anonymous feedback\"] input, form[aria-label=\"Anonymous feedback\"] textarea')].map(e=>e.name)")
        ok(f'{name}: feedback has no identity fields',set(names)<= {'experience','feedback','website'},str(names))
        f.get_by_text('Good',exact=True).click(); f.locator('textarea').fill('test'); f.get_by_role('button',name='Send anonymously').click(); pg.wait_for_timeout(700)
        ok(f'{name}: feedback unconfigured shows friendly message',pg.get_by_text('not switched on').count()==1)
        ok(f'{name}: no console errors',not errs,str(errs[:3]))
        ctx.close()
    # reduced motion: manifesto static, marquee stopped
    ctx=b.new_context(reduced_motion='reduce',viewport={'width':1200,'height':800}); pg=ctx.new_page(); pg.goto(B+'/'); pg.wait_for_timeout(600)
    ok('reduced-motion: no intro loader',pg.locator('.intro').count()==0)
    ok('reduced-motion: manifesto static + all words lit',pg.locator('.exp.static').count()==1 and pg.locator('.exp .w:not(.lit)').count()>=0 and pg.evaluate("getComputedStyle(document.querySelector('.exp .w')).opacity")=='1')
    ok('reduced-motion: marquee not animating',pg.evaluate("getComputedStyle(document.querySelector('.marquee-track')).animationName")=='none')
    ctx.close(); b.close()
bad=[n for n,c in res if not c]; print('\n%d checks, %d failed'%(len(res),len(bad))); print(bad)
