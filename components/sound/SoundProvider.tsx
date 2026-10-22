'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

type SoundApi = { enabled: boolean; enable: (opts?: { howl?: boolean }) => Promise<void>; disable: () => void; toggle: () => void };
const Ctx = createContext<SoundApi | null>(null);
export const useSound = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useSound must be used inside <SoundProvider>');
  return c;
};

const WOLF_SOURCE = 'https://www.orangefreesounds.com/wp-content/uploads/2014/10/Wolf-howl-sound.mp3';

/** Sound behavior follows the production gate: low ambience, a thunder hit on entry, then the wolf howl. */
export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const ctx = useRef<AudioContext | null>(null);
  const master = useRef<GainNode | null>(null);
  const droneNodes = useRef<AudioNode[]>([]);
  const wolf = useRef<HTMLAudioElement | null>(null);
  const howlTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lightningTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const ensureAudio = useCallback(() => {
    if (ctx.current) return ctx.current;
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const audio = new AC();
    const gain = audio.createGain();
    gain.gain.value = 1;
    gain.connect(audio.destination);
    ctx.current = audio;
    master.current = gain;
    return audio;
  }, []);

  const startDrone = useCallback(() => {
    const audio = ensureAudio();
    if (droneNodes.current.length) return;
    const t = audio.currentTime;
    const out = audio.createGain();
    out.gain.setValueAtTime(0, t);
    out.gain.linearRampToValueAtTime(0.5, t + 3);
    out.connect(master.current!);
    const lp = audio.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 160;
    lp.Q.value = 6;
    lp.connect(out);
    const nodes: AudioNode[] = [out, lp];
    [[55, 'sawtooth', 0.09], [55.6, 'sawtooth', 0.09], [82.4, 'triangle', 0.05]].forEach(([freq, type, volume]) => {
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.type = type as OscillatorType;
      osc.frequency.value = Number(freq);
      gain.gain.value = Number(volume);
      osc.connect(gain).connect(lp);
      osc.start();
      nodes.push(osc, gain);
    });
    droneNodes.current = nodes;
  }, [ensureAudio]);

  const playThunder = useCallback(() => {
    const audio = ensureAudio();
    const t = audio.currentTime;
    const len = Math.ceil(audio.sampleRate * 2);
    const buffer = audio.createBuffer(1, len, audio.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const source = audio.createBufferSource();
    source.buffer = buffer;
    const filter = audio.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1800, t);
    filter.frequency.exponentialRampToValueAtTime(90, t + 3.5);
    const gain = audio.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(0.7, t + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.21, t + 0.7);
    gain.gain.linearRampToValueAtTime(0.42, t + 1.1);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 4.2);
    source.connect(filter).connect(gain).connect(master.current!);
    source.start(t);
    source.stop(t + 4.5);
    window.dispatchEvent(new Event('rv:flash'));
  }, [ensureAudio]);

  const playWolf = useCallback(() => {
    if (!wolf.current) {
      const audio = new Audio(WOLF_SOURCE);
      audio.preload = 'auto';
      audio.volume = 0.55;
      wolf.current = audio;
    }
    wolf.current.currentTime = 0;
    void wolf.current.play().catch(() => {
      // Sound remains optional; a blocked or unavailable external sound must not break the site.
    });
  }, []);

  const scheduleLightning = useCallback(() => {
    if (lightningTimer.current) clearTimeout(lightningTimer.current);
    if (!enabled || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    lightningTimer.current = setTimeout(() => {
      if (document.hidden || !enabled) {
        scheduleLightning();
        return;
      }
      playThunder();
      if (Math.random() > 0.45) setTimeout(() => { if (enabled) playWolf(); }, 900 + Math.random() * 900);
      scheduleLightning();
    }, 22000 + Math.random() * 26000);
  }, [enabled, playThunder, playWolf]);

  const enable = useCallback(async (opts?: { howl?: boolean }) => {
    try {
      const audio = ensureAudio();
      await audio.resume();
      startDrone();
      setEnabled(true);
      if (opts?.howl) {
        playThunder();
        if (howlTimer.current) clearTimeout(howlTimer.current);
        howlTimer.current = setTimeout(playWolf, 1500);
      }
    } catch {
      setEnabled(false);
    }
  }, [ensureAudio, playWolf, playThunder, startDrone]);

  const disable = useCallback(() => {
    if (howlTimer.current) clearTimeout(howlTimer.current);
    if (lightningTimer.current) clearTimeout(lightningTimer.current);
    if (wolf.current) wolf.current.pause();
    const audio = ctx.current;
    if (audio) void audio.suspend();
    droneNodes.current.forEach((node) => {
      if (node instanceof OscillatorNode) {
        try { node.stop(); } catch { /* already stopped */ }
      }
    });
    droneNodes.current = [];
    setEnabled(false);
  }, []);

  const toggle = useCallback(() => (enabled ? disable() : void enable()), [enabled, enable, disable]);

  useEffect(() => {
    scheduleLightning();
  }, [scheduleLightning]);

  useEffect(() => () => {
    if (howlTimer.current) clearTimeout(howlTimer.current);
    if (lightningTimer.current) clearTimeout(lightningTimer.current);
    droneNodes.current.forEach((node) => {
      if (node instanceof OscillatorNode) {
        try { node.stop(); } catch { /* already stopped */ }
      }
    });
    void ctx.current?.close();
  }, []);

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
