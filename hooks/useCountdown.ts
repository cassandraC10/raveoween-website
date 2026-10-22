'use client';
import { useEffect, useState } from 'react';

export type Countdown = { days: string; hours: string; minutes: string; seconds: string; done: boolean; ready: boolean };
const pad = (n: number) => String(Math.max(0, n)).padStart(2, '0');
const BLANK: Countdown = { days: '00', hours: '00', minutes: '00', seconds: '00', done: false, ready: false };

function compute(target: number): Countdown {
  const ms = target - Date.now();
  if (ms <= 0) return { days: '00', hours: '00', minutes: '00', seconds: '00', done: true, ready: true };
  const s = Math.floor(ms / 1000);
  return { days: pad(Math.floor(s / 86400)), hours: pad(Math.floor((s % 86400) / 3600)), minutes: pad(Math.floor((s % 3600) / 60)), seconds: pad(s % 60), done: false, ready: true };
}

/** Zero-padded strings + tabular numerals = stable width. First render is "00" so SSR/hydration always match. */
export function useCountdown(targetISO: string): Countdown {
  const [state, setState] = useState<Countdown>(BLANK);
  useEffect(() => {
    const target = new Date(targetISO).getTime();
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const next = compute(target);
      setState(next);
      if (!next.done) timer = setTimeout(tick, 1000 - (Date.now() % 1000));
    };
    tick();
    return () => clearTimeout(timer);
  }, [targetISO]);
  return state;
}
