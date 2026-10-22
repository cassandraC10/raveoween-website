'use client';
import { useEffect, useRef, useState } from 'react';

const KEY = 'rv-intro-seen';

/**
 * The 000 -> 100 "Welcome to the deep end" opener from the original site.
 * Plays once per browser session, never under reduced motion, and is hidden entirely without JS (see <noscript> in layout).
 */
export function IntroLoader() {
  const [state, setState] = useState<'on' | 'flick' | 'off' | 'gone' | 'removed'>('on');
  const countRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    let seen = false;
    try { seen = sessionStorage.getItem(KEY) === '1'; } catch { /* storage blocked: just play */ }
    if (seen || matchMedia('(prefers-reduced-motion: reduce)').matches) { root.classList.add('ready'); setState('removed'); return; }
    try { sessionStorage.setItem(KEY, '1'); } catch { /* ignore */ }
    root.classList.add('intro-lock');

    const t0 = performance.now(); const dur = 2600; let shown = 0; let raf = 0; const timers: ReturnType<typeof setTimeout>[] = [];
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / dur);
      shown += ((1 - Math.pow(1 - t, 3)) * 100 - shown) * 0.2;
      if (t >= 1 && shown > 99.3) shown = 100;
      if (countRef.current) countRef.current.textContent = String(Math.round(shown)).padStart(3, '0');
      if (shown >= 100) {
        setState('flick');
        timers.push(setTimeout(() => setState('off'), 380));
        timers.push(setTimeout(() => { setState('gone'); root.classList.remove('intro-lock'); root.classList.add('ready'); }, 1080));
        timers.push(setTimeout(() => setState('removed'), 1530));
        return;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf); timers.forEach(clearTimeout); root.classList.remove('intro-lock'); };
  }, []);

  if (state === 'removed') return null;
  return (
    <div className={`intro ${state === 'flick' ? 'flick' : ''} ${state === 'off' ? 'off' : ''} ${state === 'gone' ? 'off gone' : ''}`} role="status" aria-live="polite">
      <div className="intro-inner">
        <div className="count" ref={countRef} aria-hidden="true">000</div>
        <p className="msg">Welcome to the deep end</p>
      </div>
      <div className="intro-line" />
    </div>
  );
}
