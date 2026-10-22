'use client';
import { useCountdown } from '@/hooks/useCountdown';

export function Countdown({ target, label, doneText = 'The night is here.' }: { target: string; label: string; doneText?: string }) {
  const c = useCountdown(target);
  if (c.done) return <p className="countdown-done" role="status">{doneText}</p>;
  const parts = [['days', c.days], ['hours', c.hours], ['minutes', c.minutes], ['seconds', c.seconds]] as const;
  return (
    <div className="countdown" role="timer" aria-label={label}>
      {parts.map(([l, v]) => <div className="cd" key={l}><b key={l === 'seconds' ? v : l} className={l === 'seconds' ? 'tick' : undefined}>{v}</b><span>{l}</span></div>)}
    </div>
  );
}
