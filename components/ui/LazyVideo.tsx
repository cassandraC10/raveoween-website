'use client';
import { useEffect, useRef, useState } from 'react';

/** Loads the 7MB teaser only when scrolled near. Autoplays muted unless the visitor prefers reduced motion (then shows controls). */
export function LazyVideo({ src, label }: { src: string; label: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    setReduce(matchMedia('(prefers-reduced-motion: reduce)').matches);
    const el = box.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setLoad(true); io.disconnect(); } }, { rootMargin: '300px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={box} className="frame mx-auto aspect-9/16 w-full max-w-[420px]">
      {load ? (
        <video className="h-full w-full object-contain" src={src} muted loop playsInline autoPlay={!reduce} controls={reduce} preload="metadata" aria-label={label} />
      ) : <div className="grid h-full place-items-center text-ash">{label}</div>}
    </div>
  );
}
