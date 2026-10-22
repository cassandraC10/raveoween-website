'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: 'button' | 'block' | 'inline';
  note?: boolean;
};

/**
 * Ticket links require a deliberate 21+ and house-rules confirmation before
 * the visitor can continue to EventCove. The event platform handles checkout.
 */
export function TicketLink({ href, children, variant = 'button', note = false }: Props) {
  const [open, setOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const trigger = variant === 'block' ? (
    <button type="button" onClick={() => { setConfirmed(false); setOpen(true); }} className="ticket">
      <span className="ticket-text">{children}</span>
    </button>
  ) : variant === 'inline' ? (
    <button type="button" onClick={() => { setConfirmed(false); setOpen(true); }} className="link-arrow">
      {children}
    </button>
  ) : (
    <button type="button" onClick={() => { setConfirmed(false); setOpen(true); }} className="btn-enter">
      {children}
    </button>
  );

  return (
    <>
      {variant === 'block' ? <div>{trigger}{note && <p className="mt-5 px-pad text-center text-ash">Tickets are sold on EventCove. The link opens in a new tab.</p>}</div> : trigger}
      {open && (
        <div className="ticket-gate-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
          <section className="ticket-gate" role="dialog" aria-modal="true" aria-labelledby="ticket-gate-title" aria-describedby="ticket-gate-copy">
            <button type="button" className="ticket-gate-close" aria-label="Close confirmation" onClick={() => setOpen(false)}>×</button>
            <p className="eyebrow">Before you enter</p>
            <h2 id="ticket-gate-title" className="ticket-gate-title">Be sure to read our house rules.</h2>
            <p id="ticket-gate-copy" className="ticket-gate-copy">Don&apos;t buy a ticket if this isn&apos;t your cup of tea.</p>
            <p className="ticket-gate-rules"><Link href="/house-rules" target="_blank" rel="noopener noreferrer">Read the full house rules</Link> before continuing.</p>
            <label className="ticket-gate-check">
              <input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} />
              <span>I confirm that I am 21 or older and have read the house rules.</span>
            </label>
            <a
              href={confirmed ? href : undefined}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!confirmed}
              className={`ticket-gate-continue ${confirmed ? 'is-ready' : ''}`}
              onClick={(event) => { if (!confirmed) event.preventDefault(); else setOpen(false); }}
            >
              Get ticket on EventCove
            </a>
            <p className="ticket-gate-footnote">You must confirm both requirements before continuing to EventCove.</p>
          </section>
        </div>
      )}
    </>
  );
}
