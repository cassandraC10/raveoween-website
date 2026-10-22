'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Countdown } from '@/components/ui/Countdown';
import { useSound } from '@/components/sound/SoundProvider';
import { dims } from '@/data/dims';

/**
 * Brand gate. Markup and sizing follow raveoween.com's `.gate` section: a height-capped flex column
 * (wordmark, "2nd Anniversary", grin, countdown, doors) that always fits the first screen.
 * Two non-blocking doors (with sound / without); scrolling is never locked.
 */
export function HomeHero({ startsAt, eventLabel, eventHref }: { startsAt: string; eventLabel: string; eventHref: string }) {
  const { enable } = useSound();
  const [glitch, setGlitch] = useState(false);
  const [scare, setScare] = useState(false);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let t: ReturnType<typeof setTimeout>;
    const loop = () => { t = setTimeout(() => { setGlitch(true); setTimeout(() => setGlitch(false), 450); loop(); }, 4000 + Math.random() * 5000); };
    loop();
    return () => clearTimeout(t);
  }, []);

  const go = (withSound: boolean) => {
    if (withSound) void enable({ howl: true });
    const el = document.getElementById('experience');
    el?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    el?.focus({ preventScroll: true });
  };
  const wake = () => { setScare(true); window.dispatchEvent(new Event('rv:flash')); setTimeout(() => setScare(false), 700); };

  return (
    <section className="gate" aria-labelledby="home-title">
      <div className="gate-02" aria-hidden="true">02</div>
      <h1 id="home-title" className="sr">Raveoween. A Gathering Of The Alter Egos.</h1>
      <div className={`wordmark ${glitch ? 'glitching' : ''}`}>
        <Image src="/brand/title.webp" alt="" width={dims['title.webp'][0]} height={dims['title.webp'][1]} priority />
      </div>
      <p className="gate-sub">2nd Anniversary</p>
      <button type="button" className={`face-btn ${scare ? 'scare' : ''}`} onClick={wake} aria-label="Wake the grin">
        <Image className="face" src="/brand/face.webp" alt="" width={dims['face.webp'][0]} height={dims['face.webp'][1]} priority />
      </button>
      <Countdown target={startsAt} label={`Countdown to ${eventLabel}`} />
      <div className="enter">
        <button type="button" className="btn-enter" onClick={() => go(true)}>Enter Raveoween</button>
        <button type="button" className="btn-quiet" onClick={() => go(false)}>Enter without sound</button>
        <p className="enter-note">
          Oct 31 &nbsp;/&nbsp; 9PM &nbsp;/&nbsp; <a className="underline" href={eventHref}>Event details</a>
        </p>
      </div>
    </section>
  );
}
