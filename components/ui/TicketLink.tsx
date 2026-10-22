type Props = { href: string; children: React.ReactNode; variant?: 'button' | 'block'; note?: boolean };

/** All 2026 ticket checkout goes through EventCove. Opens in a new tab and says so for assistive tech. */
export function TicketLink({ href, children, variant = 'button', note = false }: Props) {
  const rel = 'noopener noreferrer';
  if (variant === 'block') {
    return (
      <div>
        <a href={href} target="_blank" rel={rel} className="ticket"><span className="ticket-text">{children}</span><span className="sr"> (opens EventCove in a new tab)</span></a>
        {note && <p className="mt-5 px-pad text-center text-ash">Tickets are sold on EventCove. The link opens in a new tab.</p>}
      </div>
    );
  }
  return <a href={href} target="_blank" rel={rel} className="btn-enter">{children}<span className="sr"> (opens EventCove in a new tab)</span></a>;
}
