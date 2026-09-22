/* ==========================================================
   RAVEOWEEN 2nd ANNIVERSARY. Vanilla JS, no dependencies.
   Sections in this file:
     0. Config          5. Countdown
     1. Helpers         6. Enter
     2. Loader          7. Scroll (experience, parallax, reveals)
     3. Sound           8. Interactions (glitch, tilt, cursor)
     4. Effects         9. Lightning
   ========================================================== */

(() => {
  'use strict';

  /* ---------- 0. CONFIG ---------- */

  const CONFIG = {
    // Oct 31, 9PM Lagos time (UTC+1). Change the year here if needed.
    eventDate: '2026-10-31T21:00:00+01:00',

    // Drop your files into /assets/audio/ with these names (or edit the paths).
    // Any file that is missing is skipped. Ambience and thunder fall back to
    // a synthesized version so the sound button still does something.
    audio: {
      ambience: { src: 'assets/audio/ambience.mp3', loop: true, volume: 0.45 },
      thunder:  { src: 'assets/audio/thunder.mp3',  loop: false, volume: 0.8 },
      laugh:    { src: 'assets/audio/laugh.mp3',    loop: false, volume: 0.7 },
      wolf:     { src: 'https://www.orangefreesounds.com/wp-content/uploads/2014/10/Wolf-howl-sound.mp3', loop: false, volume: 0.55 }
    },

    // Random lightning while the site is open (ms between flashes)
    lightning: { min: 22000, max: 48000 }
  };

  /* ---------- 1. HELPERS ---------- */

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const rnd = (a, b) => a + Math.random() * (b - a);

  const root = document.documentElement;
  const body = document.body;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FINE = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const LITE = !FINE || innerWidth < 760;   // simpler effects on phones

  if (LITE) root.classList.add('lite');
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  scrollTo(0, 0);

  let entered = false;

  /* ---------- 2. LOADER ---------- */

  function runLoader() {
    const loader = $('#loader');
    const count = $('#count');
    const msg = $('#msg');
    const lines = [
      [0, 'Welcome to the deep end'],
      [30, 'Welcome to the deep end'],
      [62, 'Welcome to the deep end'],
      [92, 'Welcome to the deep end']
    ];
    const minMs = reduce ? 500 : 2800;
    const t0 = performance.now();
    let loaded = false;
    let shown = 0;
    let lastMsg = '';

    const files = ['title.png', 'face.png', 'funsyde.webp', 'lollypop.webp', 'del-noi.webp', 'flyer-anniversary.webp', 'raveoween-original-logo.png'];
    const imgs = files.map(f => new Promise(res => {
      const i = new Image();
      i.onload = i.onerror = res;
      i.src = 'assets/img/' + f;
    }));
    const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
    Promise.all([...imgs, fonts]).then(() => { loaded = true; });
    setTimeout(() => { loaded = true; }, 9000);   // never hang on a slow connection

    (function step(now) {
      const t = clamp((now - t0) / minMs, 0, 1);
      let target = (1 - Math.pow(1 - t, 3)) * 100;
      if (!loaded) target = Math.min(target, 92);

      shown += (target - shown) * 0.2;
      if (loaded && t >= 1 && shown > 99.3) shown = 100;

      count.textContent = String(Math.round(shown)).padStart(3, '0');
      const line = [...lines].reverse().find(l => shown >= l[0])[1];
      if (line !== lastMsg) { msg.textContent = line; lastMsg = line; }

      if (shown >= 100) return finish();
      requestAnimationFrame(step);
    })(t0);

    function finish() {
      loader.classList.add('flick');
      setTimeout(() => loader.classList.add('off'), 380);            // collapse to a line
      setTimeout(() => {
        loader.classList.add('gone');                                // line snaps out
        body.classList.add('ready');                                 // gate sequence starts
        startGlitchLoop();
      }, 380 + 700);
      setTimeout(() => loader.remove(), 380 + 700 + 450);
    }
  }

  /* ---------- 3. SOUND ---------- */

  const Sound = (() => {
    const cfg = CONFIG.audio;
    const els = {};
    let on = false;
    let ctx = null, master = null, drone = null;

    const btn = $('#sound');
    const lbl = $('#soundLbl');

    function ui() {
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.setAttribute('aria-label', on ? 'Sound on. Press to turn sound off.' : 'Sound off. Press to turn sound on.');
      lbl.textContent = on ? 'Sound on' : 'Sound off';
    }

    function load(name) {
      if (els[name]) return els[name];
      const a = new Audio();
      a.preload = 'auto';
      a.loop = !!cfg[name].loop;
      a.dataset.ok = '?';
      a.addEventListener('error', () => { a.dataset.ok = '0'; });
      a.src = cfg[name].src;
      els[name] = a;
      return a;
    }

    function fade(a, to, ms) {
      const from = a.volume, t0 = performance.now();
      (function f(now) {
        const k = clamp((now - t0) / ms, 0, 1);
        a.volume = clamp(from + (to - from) * k, 0, 1);
        if (k < 1) requestAnimationFrame(f);
      })(t0);
    }

    /* --- synthesized fallbacks (used only when a file is missing) --- */

    function ensureCtx() {
      if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return false;
        ctx = new AC();
        master = ctx.createGain();
        master.connect(ctx.destination);
      }
      if (ctx.state === 'suspended') ctx.resume();
      return true;
    }
    function noiseBuf() {
      const len = ctx.sampleRate * 2;
      const b = ctx.createBuffer(1, len, ctx.sampleRate);
      const d = b.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      return b;
    }
    function startDrone() {
      if (!ensureCtx() || drone) return;
      const t = ctx.currentTime;
      const out = ctx.createGain();
      out.gain.setValueAtTime(0, t);
      out.gain.linearRampToValueAtTime(0.5, t + 3);
      out.connect(master);
      const nodes = [];

      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = 160; lp.Q.value = 6;
      lp.connect(out);
      [[55, 'sawtooth', 0.09], [55.6, 'sawtooth', 0.09], [82.4, 'triangle', 0.05]].forEach(([f, type, g]) => {
        const o = ctx.createOscillator(); o.type = type; o.frequency.value = f;
        const gn = ctx.createGain(); gn.gain.value = g;
        o.connect(gn); gn.connect(lp); o.start(); nodes.push(o);
      });
      const lfo = ctx.createOscillator(); lfo.frequency.value = 0.08;
      const lfoG = ctx.createGain(); lfoG.gain.value = 90;
      lfo.connect(lfoG); lfoG.connect(lp.frequency); lfo.start(); nodes.push(lfo);

      const wind = ctx.createBufferSource(); wind.buffer = noiseBuf(); wind.loop = true;
      const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 420; bp.Q.value = 0.8;
      const wg = ctx.createGain(); wg.gain.value = 0.05;
      wind.connect(bp); bp.connect(wg); wg.connect(out); wind.start(); nodes.push(wind);
      const lfo2 = ctx.createOscillator(); lfo2.frequency.value = 0.05;
      const l2g = ctx.createGain(); l2g.gain.value = 0.04;
      lfo2.connect(l2g); l2g.connect(wg.gain); lfo2.start(); nodes.push(lfo2);

      drone = {
        stop() {
          const n = ctx.currentTime;
          out.gain.cancelScheduledValues(n);
          out.gain.setValueAtTime(out.gain.value, n);
          out.gain.linearRampToValueAtTime(0, n + 0.8);
          setTimeout(() => nodes.forEach(x => { try { x.stop(); } catch (e) { /* already stopped */ } }), 900);
        }
      };
    }
    function synthThunder(vol) {
      if (!ensureCtx()) return;
      const t = ctx.currentTime;
      const src = ctx.createBufferSource(); src.buffer = noiseBuf();
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass';
      lp.frequency.setValueAtTime(1800, t);
      lp.frequency.exponentialRampToValueAtTime(90, t + 3.5);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(vol, t + 0.04);
      g.gain.exponentialRampToValueAtTime(vol * 0.3, t + 0.7);
      g.gain.linearRampToValueAtTime(vol * 0.6, t + 1.1);
      g.gain.exponentialRampToValueAtTime(0.001, t + 4.2);
      src.connect(lp); lp.connect(g); g.connect(master);
      src.start(t); src.stop(t + 4.5);
    }
    function fallback(name) {
      if (name === 'thunder') synthThunder(0.7);
      if (name === 'ambience') startDrone();
      // laugh/wolf are local audio files; if either is missing, stay silent.
    }

    /* --- public --- */

    function startAmbience() {
      const a = load('ambience');
      if (a.dataset.ok === '0') return fallback('ambience');
      a.volume = 0;
      a.play().then(() => fade(a, cfg.ambience.volume, 2500)).catch(err => {
        if (err && err.name === 'AbortError') return;
        a.dataset.ok = '0';
        if (on) fallback('ambience');
      });
    }

    function enable() {
      if (on) return;
      on = true; ui();
      // Unlock the one-shots inside this tap/click (needed on iOS Safari)
      ['thunder', 'laugh', 'wolf'].forEach(n => {
        const a = load(n);
        a.muted = true;
        a.play().then(() => { a.pause(); a.currentTime = 0; a.muted = false; })
          .catch(() => { a.muted = false; });
      });
      startAmbience();
    }

    function disable() {
      if (!on) return;
      on = false; ui();
      const a = els.ambience;
      if (a) { fade(a, 0, 500); setTimeout(() => { if (!on) a.pause(); }, 550); }
      if (drone) { drone.stop(); drone = null; }
      ['thunder', 'laugh', 'wolf'].forEach(n => { if (els[n]) els[n].pause(); });
    }

    function play(name) {
      if (!on) return;
      const a = els[name];
      if (!a || a.dataset.ok === '0') return fallback(name);
      a.currentTime = 0;
      a.volume = cfg[name].volume;
      a.play().catch(err => {
        if (err && err.name === 'AbortError') return;
        a.dataset.ok = '0';
        fallback(name);
      });
    }

    // Pause when the tab is hidden, resume when it returns
    document.addEventListener('visibilitychange', () => {
      if (!on) return;
      const a = els.ambience;
      if (document.hidden) {
        if (a) a.pause();
        if (ctx) ctx.suspend();
      } else {
        if (a && a.dataset.ok !== '0') a.play().catch(() => {});
        if (ctx) ctx.resume();
      }
    });

    btn.addEventListener('click', () => (on ? disable() : enable()));
    ui();

    return { enable, disable, play, get on() { return on; } };
  })();

  /* ---------- 4. EFFECTS ---------- */

  const flashEl = $('.flash');
  function flash(strength = 0.3) {
    if (reduce) return;
    flashEl.animate(
      [{ opacity: 0 }, { opacity: strength }, { opacity: 0.04 }, { opacity: strength * 0.6 }, { opacity: 0 }],
      { duration: 650, easing: 'linear' }
    );
  }

  // Tears an element apart with the shared SVG displacement filter.
  // Phones skip the SVG filter and get a cheap CSS jitter instead.
  const fTurb = $('#warp feTurbulence');
  const fDisp = $('#warp feDisplacementMap');
  let warpRaf = 0;
  function warpKick(el, amount = 40, ms = 500, liteEl = el) {
    if (reduce || !el) return;
    if (LITE) {
      liteEl.classList.remove('jitter');
      void liteEl.offsetWidth;
      liteEl.classList.add('jitter');
      liteEl.addEventListener('animationend', () => liteEl.classList.remove('jitter'), { once: true });
      return;
    }
    el.classList.add('warp');
    cancelAnimationFrame(warpRaf);
    const t0 = performance.now();
    (function f(now) {
      const k = clamp((now - t0) / ms, 0, 1);
      fDisp.setAttribute('scale', (amount * (1 - k) * rnd(0.6, 1)).toFixed(1));
      fTurb.setAttribute('baseFrequency', '0.004 ' + rnd(0.05, 0.13).toFixed(3));
      if (k < 1) warpRaf = requestAnimationFrame(f);
      else {
        fDisp.setAttribute('scale', 0);
        $$('.warp').forEach(e => e.classList.remove('warp'));
      }
    })(t0);
  }

  /* ---------- 5. COUNTDOWN ---------- */

  const target = new Date(CONFIG.eventDate).getTime();
  const cd = { d: $('#cd-d'), h: $('#cd-h'), m: $('#cd-m'), s: $('#cd-s') };
  const pad = n => String(n).padStart(2, '0');

  function tickCountdown() {
    const diff = target - Date.now();
    if (diff <= 0) {
      $('#countdown').hidden = true;
      $('#cdDone').hidden = false;
      return false;
    }
    const s = Math.floor(diff / 1000);
    const vals = {
      d: Math.floor(s / 86400),
      h: Math.floor((s % 86400) / 3600),
      m: Math.floor((s % 3600) / 60),
      s: s % 60
    };
    for (const k in vals) {
      const txt = pad(vals[k]);
      if (cd[k].textContent !== txt) {
        cd[k].textContent = txt;
        if (k === 's' && !reduce) {
          cd.s.classList.remove('tick'); void cd.s.offsetWidth; cd.s.classList.add('tick');
        }
      }
    }
    return true;
  }
  tickCountdown();
  const cdTimer = setInterval(() => { if (!tickCountdown()) clearInterval(cdTimer); }, 1000);

  /* ---------- 6. ENTER ---------- */

  function enter(withSound) {
    if (entered) return;
    entered = true;
    if (withSound) Sound.enable();
    flash(0.35);
    if (withSound) Sound.play('thunder');
    if (withSound) setTimeout(() => Sound.play('wolf'), 1500);
    body.classList.add('entered');
    root.classList.remove('locked');
    setTimeout(() => {
      $('#halloween').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    }, 380);
    scheduleLightning();
  }
  $('#enterSound').addEventListener('click', () => enter(true));
  $('#enterSilent').addEventListener('click', () => enter(false));

  /* ---------- 7. SCROLL ---------- */

  const bar = $('#bar');
  const exp = $('#experience');
  const expFace = $('.exp-face');

  // Split the manifesto into words so they can light up one by one
  const words = [];
  $$('.mline').forEach(line => {
    line.dataset.words.split(' ').forEach(w => {
      const s = document.createElement('span');
      s.className = 'w'; s.textContent = w;
      line.appendChild(s); words.push(s);
    });
  });
  const rules = $$('.rule');

  let laughed = false;
  let lastKick = 0;
  const parallaxEls = $$('[data-speed]');
  let lastY = scrollY;
  let ticking = false;

  function onScroll() {
    ticking = false;
    const y = scrollY;
    const vel = y - lastY;
    lastY = y;
    const vh = innerHeight;

    bar.classList.toggle('mark', y > vh * 0.6);

    // Experience: progress 0..1 across the pinned section
    const r = exp.getBoundingClientRect();
    if (r.bottom > -100 && r.top < vh + 100) {
      const p = clamp(-r.top / (r.height - vh), 0, 1);
      exp.style.setProperty('--p', p.toFixed(4));

      words.forEach((w, i) => w.classList.toggle('lit', p > 0.05 + (i / words.length) * 0.5));
      rules.forEach((el, i) => el.classList.toggle('lit', p > 0.64 + i * 0.11));

      if (p > 0.45 && !laughed) { laughed = true; Sound.play('laugh'); flash(0.12); }

      const now = performance.now();
      if (Math.abs(vel) > 70 && p > 0.02 && p < 0.98 && now - lastKick > 1400) {
        lastKick = now;
        warpKick(expFace, 55, 550, $('.exp-copy'));
      }
    }

    // Gentle parallax on posters / flyer
    for (const el of parallaxEls) {
      const pr = el.getBoundingClientRect();
      if (pr.bottom < -300 || pr.top > vh + 300) continue;
      const d = pr.top + pr.height / 2 - vh / 2;
      el.style.setProperty('--py', (-d * parseFloat(el.dataset.speed)).toFixed(1) + 'px');
    }
  }
  addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  addEventListener('resize', onScroll);

  // One-time reveals
  // Posters are clipped while hidden, which makes them invisible to the observer,
  // so their wrapper is observed instead.
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target.classList.contains('poster-wrap') ? $('.poster', e.target) : e.target;
      el.classList.add('in');
      io.unobserve(e.target);
      if (el.classList.contains('poster')) {
        setTimeout(() => warpKick($('img', el), 34, 600), 500);
      }
    });
  }, { threshold: 0.15 });
  $$('.rv').forEach(el => io.observe(el.classList.contains('poster') ? el.parentElement : el));

  // Netlify Forms: keep feedback on the page after an anonymous submission.
  const feedbackForm = document.querySelector('form[name="raveoween-feedback"]');
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', async e => {
      e.preventDefault();
      const button = feedbackForm.querySelector('button[type="submit"]');
      const original = button.textContent;
      button.disabled = true;
      button.textContent = 'Sending...';
      try {
        const data = new FormData(feedbackForm);
        await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(data).toString()
        });
        feedbackForm.innerHTML = '<p class="feedback-thanks">Thank you. Your feedback has been received.</p>';
      } catch (err) {
        button.disabled = false;
        button.textContent = original;
        const existing = feedbackForm.querySelector('.feedback-error');
        if (!existing) {
          const msg = document.createElement('p');
          msg.className = 'feedback-error';
          msg.textContent = 'Something went wrong. Please try again.';
          feedbackForm.appendChild(msg);
        }
      }
    });
  }

  // Thunder when the ticket block first appears
  let ticketSeen = false;
  new IntersectionObserver((entries, obs) => {
    if (entries[0].isIntersecting && !ticketSeen) {
      ticketSeen = true; flash(0.14); Sound.play('thunder'); obs.disconnect();
    }
  }, { threshold: 0.5 }).observe($('#ticketBig'));

  /* ---------- 8. INTERACTIONS ---------- */

  // Title glitch bursts at random intervals
  function startGlitchLoop() {
    if (reduce) return;
    const wm = $('#wordmark');
    (function loop() {
      setTimeout(() => {
        wm.classList.add('glitching');
        setTimeout(() => wm.classList.remove('glitching'), 450);
        loop();
      }, rnd(3500, 7500));
    })();
  }

  // Poke the grin
  const faceBtn = $('#face');
  faceBtn.addEventListener('click', () => {
    warpKick($('.face'), 60, 700);
    faceBtn.classList.add('scare');
    flash(0.1);
    Sound.play('laugh');
    setTimeout(() => faceBtn.classList.remove('scare'), 650);
  });

  // Desktop only: cursor light, hero parallax, poster tilt
  if (FINE && !reduce) {
    const glow = $('.glow');
    const gate = $('#gate');
    let gx = innerWidth / 2, gy = innerHeight / 2, tx = gx, ty = gy;

    addEventListener('pointermove', e => {
      tx = e.clientX; ty = e.clientY;
      if (scrollY < innerHeight) {
        gate.style.setProperty('--mx', ((e.clientX / innerWidth - 0.5) * 2).toFixed(3));
        gate.style.setProperty('--my', ((e.clientY / innerHeight - 0.5) * 2).toFixed(3));
      }
    }, { passive: true });

    (function loop() {
      gx += (tx - gx) * 0.12; gy += (ty - gy) * 0.12;
      glow.style.transform = `translate3d(${gx.toFixed(1)}px, ${gy.toFixed(1)}px, 0)`;
      requestAnimationFrame(loop);
    })();

    $$('.poster').forEach(p => {
      const box = $('.poster-img', p);
      p.addEventListener('pointermove', e => {
        const r = p.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        box.style.setProperty('--rx', (-y * 8).toFixed(2) + 'deg');
        box.style.setProperty('--ry', (x * 10).toFixed(2) + 'deg');
      });
      p.addEventListener('pointerenter', () => warpKick($('img', p), 26, 420));
      p.addEventListener('pointerleave', () => {
        box.style.setProperty('--rx', '0deg'); box.style.setProperty('--ry', '0deg');
      });
    });
  } else {
    // Touch: tap a poster to tear it
    $$('.poster').forEach(p => p.addEventListener('click', () => warpKick($('img', p), 30, 450, $('.poster-img', p))));
  }

  /* ---------- 9. LIGHTNING ---------- */

  function scheduleLightning() {
    if (reduce) return;
    setTimeout(() => {
      if (!document.hidden) {
        flash(0.16);
        setTimeout(() => flash(0.09), 220);
        setTimeout(() => {
          Sound.play('thunder');
          if (Math.random() > 0.45) setTimeout(() => Sound.play('wolf'), rnd(900, 1800));
        }, rnd(500, 1400));
      }
      scheduleLightning();
    }, rnd(CONFIG.lightning.min, CONFIG.lightning.max));
  }

  /* ---------- go ---------- */
  runLoader();
  onScroll();
})();
