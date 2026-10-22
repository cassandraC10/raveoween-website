'use client';
import { useState, type FormEvent } from 'react';

const OPTIONS = ['Incredible', 'Good', 'Mixed', 'Not good'] as const;
type Status = 'idle' | 'sending' | 'sent' | 'error' | 'unavailable';

/** PRIVACY: exactly two real fields (experience, feedback). Never add name, email, phone or handle fields. */
export function FeedbackForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [exp, setExp] = useState('');

  async function submit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const fd = new FormData(ev.currentTarget);
    setStatus('sending');
    try {
      const res = await fetch('/api/feedback', { method: 'POST', credentials: 'omit', referrerPolicy: 'no-referrer', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ experience: exp, feedback: fd.get('feedback'), website: fd.get('website') }) });
      setStatus(res.ok ? 'sent' : res.status === 503 ? 'unavailable' : 'error');
    } catch { setStatus('error'); }
  }

  if (status === 'sent') return <p role="status" className="border border-red p-6 font-display text-3xl">Received. Nobody knows it was you.</p>;
  return (
    <form onSubmit={submit} className="grid max-w-xl gap-5 border border-blood p-6" autoComplete="off" aria-label="Anonymous feedback">
      <fieldset>
        <legend className="mb-2 text-sm uppercase tracking-widest text-ash">How was your experience?</legend>
        <div className="flex flex-wrap gap-2">
          {OPTIONS.map((o) => (
            <label key={o} className={`tag min-h-10 cursor-pointer px-4 py-2 ${exp === o ? 'up' : ''}`}>
              <input type="radio" name="experience" value={o} className="sr" required checked={exp === o} onChange={() => setExp(o)} />{o}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="grid gap-2 text-sm uppercase tracking-widest text-ash">What should we keep, change or improve?
        <textarea name="feedback" rows={5} required maxLength={2000} className="input normal-case tracking-normal" placeholder="Tell us honestly." />
      </label>
      <div aria-hidden="true" className="absolute left-[-9999px]"><input name="website" tabIndex={-1} autoComplete="off" /></div>
      <button type="submit" disabled={!exp || status === 'sending'} className="btn-enter justify-self-start disabled:opacity-40">{status === 'sending' ? 'Sending…' : 'Send anonymously'}</button>
      {status === 'error' && <p role="alert" className="text-hot">That didn&apos;t go through. Please try again.</p>}
      {status === 'unavailable' && <p role="alert" className="text-hot">Feedback is not switched on for this deployment yet.</p>}
    </form>
  );
}
