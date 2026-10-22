import Link from 'next/link';
import { displayTitle, flyerAlt, flyerOf, type Edition } from '@/lib/editions';
import { FlyerButton } from '@/components/ui/FlyerButton';

export function EditionCard({ e, upcoming }: { e: Edition; upcoming: boolean }) {
  const fl = flyerOf(e.flyer);
  const title = displayTitle(e);
  return (
    <article className="card flex h-full flex-col" aria-labelledby={`ed-${e.id}`}>
      {fl ? (
        <FlyerButton flyer={fl} alt={flyerAlt(e)} caption={`${e.roman} · ${title}`} />
      ) : (
        <div className="frame grid aspect-4/5 place-items-center p-6 text-center text-ash">
          <p>Flyer not yet supplied<br /><span className="text-sm">{e.roman}</span></p>
        </div>
      )}
      <div className="mt-4 flex flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="eyebrow">{e.roman}</span>
          <span className={`tag ${upcoming ? 'up' : ''}`}>{upcoming ? 'Upcoming' : 'Past'}</span>
        </div>
        <h3 id={`ed-${e.id}`} className="font-display text-[clamp(1.7rem,3vw,2.2rem)] leading-none">{title}</h3>
        <p className="text-ash">
          {e.dateISO ? <time dateTime={e.dateISO}>{e.dateLabel}</time> : e.dateLabel}
          {e.time && <> · {e.time}</>}
          {e.location && <> · {e.location}</>}
        </p>
        {e.tagline && <p className="text-sm italic text-bone/80">“{e.tagline}”</p>}
        {e.lineup.length > 0 && (
          <ul className="flex flex-wrap gap-1.5" aria-label="Billed on the flyer">{e.lineup.map((n) => <li key={n}><span className="chip">{n}</span></li>)}</ul>
        )}
        {e.altFlyers?.map((a) => {
          const f = flyerOf(a.file);
          return f ? <div key={a.file} className="mt-2 w-24"><FlyerButton flyer={f} alt={`${a.label}, Edition ${e.roman}`} caption={`${e.roman} · ${a.label}`} /></div> : null;
        })}
        {e.eventSlug && <Link href={`/events/${e.eventSlug}`} className="link-arrow mt-auto self-start pt-2">Event page <span aria-hidden="true">→</span></Link>}
      </div>
    </article>
  );
}
