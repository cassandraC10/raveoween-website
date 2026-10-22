'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

type SoundApi = { enabled: boolean; enable: (opts?: { howl?: boolean }) => Promise<void>; disable: () => void; toggle: () => void };
const Ctx = createContext<SoundApi | null>(null);
export const useSound = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useSound must be used inside <SoundProvider>');
  return c;
};

/**
 * Sound is opt-in only (never autoplays). Everything is generated or local:
 * a quiet drone, synthesised thunder with a lightning flash, and the supplied wolf-howl.wav.
 * Dispatches `rv:flash` so <Atmosphere /> can light up the screen.
 */
export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const ctx = useRef<AudioContext | null>(null);
  const master = useRef<GainNode | null>(null);
  const drone = useRef<OscillatorNode[]>([]);
  const howlBuf = useRef<AudioBuffer | null>(null);
  const bolt = useRef<ReturnType<typeof setTimeout> | null>(null);

  const thunder = useCallback(() => {
    const c = ctx.current, m = master.current;
    if (!c || !m) return;
    const len = c.sampleRate * 3;
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.2);
    const src = c.createBufferSource(); src.buffer = buf;
    const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 180;
    const g = c.createGain(); g.gain.value = 1.6;
    src.connect(lp).connect(g).connect(m); src.start();
    window.dispatchEvent(new Event('rv:flash'));
  }, []);

  const scheduleBolt = useCallback(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    bolt.current = setTimeout(() => { thunder(); scheduleBolt(); }, 22000 + Math.random() * 26000);
  }, [thunder]);

  const enable = useCallback(async (opts?: { howl?: boolean }) => {
    try {
      if (!ctx.current) {
        const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const c = new AC(); const m = c.createGain(); m.gain.value = 0; m.connect(c.destination);
        const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 220; lp.connect(m);
        drone.current = [55, 55.4, 82.4].map((f, i) => {
          const o = c.createOscillator(); o.type = i === 2 ? 'sine' : 'sawtooth'; o.frequency.value = f;
          const g = c.createGain(); g.gain.value = 0.35; o.connect(g).connect(lp); o.start(); return o;
        });
        ctx.current = c; master.current = m;
      }
      const c = ctx.current, m = master.current!;
      await c.resume();
      m.gain.cancelScheduledValues(c.currentTime);
      m.gain.linearRampToValueAtTime(0.32, c.currentTime + 1.5);
      setEnabled(true);
      scheduleBolt();
      if (opts?.howl) {
        if (!howlBuf.current) {
          const res = await fetch('/audio/wolf-howl.wav');
          howlBuf.current = await c.decodeAudioData(await res.arrayBuffer());
        }
        const src = c.createBufferSource(); src.buffer = howlBuf.current;
        const g = c.createGain(); g.gain.value = 0.55;
        src.connect(g).connect(c.destination); src.start();
      }
    } catch { setEnabled(false); }
  }, [scheduleBolt]);

  const disable = useCallback(() => {
    const c = ctx.current, m = master.current;
    if (bolt.current) clearTimeout(bolt.current);
    if (c && m) { m.gain.cancelScheduledValues(c.currentTime); m.gain.linearRampToValueAtTime(0, c.currentTime + 0.4); setTimeout(() => c.suspend(), 450); }
    setEnabled(false);
  }, []);

  const toggle = useCallback(() => (enabled ? disable() : void enable()), [enabled, enable, disable]);
  useEffect(() => () => { if (bolt.current) clearTimeout(bolt.current); drone.current.forEach((o) => o.stop()); ctx.current?.close(); }, []);

  const value = useMemo(() => ({ enabled, enable, disable, toggle }), [enabled, enable, disable, toggle]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function SoundToggle() {
  const { enabled, toggle } = useSound();
  return (
    <button type="button" className="sound" onClick={toggle} aria-pressed={enabled} aria-label={enabled ? 'Sound on. Press to turn off.' : 'Sound off. Press to turn on.'}>
      <span className="eq" aria-hidden="true"><i /><i /><i /><i /></span>
      <span className="hidden sm:inline">{enabled ? 'Sound on' : 'Sound off'}</span>
    </button>
  );
}
