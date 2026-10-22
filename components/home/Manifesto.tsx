'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { dims } from '@/data/dims';
import { site } from '@/data/site';

const LINES: { text: string; cls: string }[] = [
  { text: 'You are not entering a website,', cls: 'intro-l' },
  { text: 'you are entering Raveoween.', cls: 'intro-l' },
  { text: 'A Gathering Of The Alter Egos.', cls: 'gathering' },
];

/** Scroll-driven manifesto over the grin (GSAP ScrollTrigger). Words and bio lines light up with scroll progress. Static under reduced motion. */
export function Manifesto() {
  const root = useRef<HTMLElement>(null);
  const [staticMode, setStaticMode] = useState(false);

  useEffect(() => {
    const el = root.current; if (!el) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setStaticMode(true); return; }
    let kill = () => {};
    (async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      const words = Array.from(el.querySelectorAll<HTMLElement>('.w'));
      const rules = Array.from(el.querySelectorAll<HTMLElement>('.rule'));
      const st = ScrollTrigger.create({
        trigger: el, start: 'top top', end: 'bottom bottom',
        onUpdate: (self) => {
          const p = self.progress;
          el.style.setProperty('--p', p.toFixed(4));
          words.forEach((w, i) => w.classList.toggle('lit', p > 0.05 + (i / words.length) * 0.5));
          rules.forEach((r, i) => r.classList.toggle('lit', p > 0.64 + i * 0.07));
        },
      });
      kill = () => st.kill();
    })();
    return () => kill();
  }, []);

  return (
    <section id="experience" tabIndex={-1} ref={root} className={`exp ${staticMode ? 'static' : ''}`} aria-label="The experience">
      <div className="exp-stick">
        <Image className="exp-face" src="/brand/face.webp" alt="" width={dims['face.webp'][0]} height={dims['face.webp'][1]} loading="lazy" />
        <div className="exp-copy">
          <p className="mb-0">
            <span className="sr">You are not entering a website, you are entering Raveoween. A Gathering Of The Alter Egos.</span>
            {LINES.map((l) => (
              <span key={l.text} className={`mline ${l.cls}`} aria-hidden="true">
                {l.text.split(' ').map((w, i) => <span className="w" key={i}>{w}</span>)}
              </span>
            ))}
          </p>
          <div className="rules mt-8">
            {site.igBio.map((line, i) => (
              <p key={line} className={`rule ${i === site.igBio.length - 1 ? 'text-hot' : ''}`}>{line}</p>
            ))}
          </div>
        </div>
        <div className="scroll-cue" aria-hidden="true"><span>↓</span> Keep scrolling <span>↓</span></div>
      </div>
    </section>
  );
}
