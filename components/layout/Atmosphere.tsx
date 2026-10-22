'use client';
import { useEffect, useRef } from 'react';

/** Grain, vignette, cursor glow (fine pointers only) and the lightning flash. All decorative, aria-hidden. */
export function Atmosphere() {
  const glow = useRef<HTMLDivElement>(null);
  const flash = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const root = document.documentElement;
    const move = (e: PointerEvent) => {
      if (glow.current) glow.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      root.style.setProperty('--mx', String((e.clientX / innerWidth - 0.5) * 2));
      root.style.setProperty('--my', String((e.clientY / innerHeight - 0.5) * 2));
    };
    if (fine && !reduce) { glow.current?.classList.add('on'); addEventListener('pointermove', move, { passive: true }); }
    const onFlash = () => {
      const el = flash.current; if (!el || reduce) return;
      el.classList.remove('go'); void el.offsetWidth; el.classList.add('go');
    };
    addEventListener('rv:flash', onFlash);
    return () => { removeEventListener('pointermove', move); removeEventListener('rv:flash', onFlash); };
  }, []);

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
      <div className="glow" ref={glow} aria-hidden="true" />
      <div className="flash" ref={flash} aria-hidden="true" />
    </>
  );
}
