import Image from 'next/image';
import Link from 'next/link';
import { editions, isUpcoming, flyerOf, displayTitle, flyerAlt } from '@/lib/editions';
import { eventExtras } from '@/data/events';
import { pageMeta } from '@/lib/meta';
import { PageHero } from '@/components/ui/PageHero';
import { TicketLink } from '@/components/ui/TicketLink';
import { Reveal } from '@/components/ui/Reveal';

export const revalidate = 3600;
export const metadata = pageMeta('Events', 'Upcoming Raveoween gatherings: Raveoween Anniversary (31 October 2026) and Blind Rave II (5 December 2026).', '/events');

export default function EventsPage() {
  const upcoming = editions.filter((e) => e.eventSlug && isUpcoming(e));
  return (
    <>
      <PageHero eyebrow="Upcoming" title="Events" lead="Every gathering has one page: date, flyer, house rules and ticket link. Tickets are sold on EventCove." />
      <section className="px-pad pb-24" aria-label="Upcoming events">
        {upcoming.length === 0 ? (
          <div className="notice"><div><b>No gatherings announced right now.</b><p className="mt-1">Follow Instagram or X for the next one, or <Link href="/editions" className="underline">browse past editions</Link>.</p></div></div>
        ) : (
          <ul className="grid gap-16">
            {upcoming.map((e) => {
              const f = flyerOf(e.flyer); const x = eventExtras[e.eventSlug!];
              return (
                <Reveal as="li" key={e.id} className="grid items-center gap-8 md:grid-cols-[minmax(0,380px)_1fr] md:gap-14">
                  {f && <Link href={`/events/${e.eventSlug}`} className="frame-btn" aria-label={`${displayTitle(e)} event page`}><span className="frame block"><Image src={f.src} alt={flyerAlt(e)} width={f.w} height={f.h} priority={e.number === 19} sizes="(min-width:768px) 380px, 92vw" /></span></Link>}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3"><span className="eyebrow">{e.roman}</span><span className="tag up">Upcoming</span></div>
                    <h2 className="h2">{displayTitle(e)}</h2>
                    {e.subtitle && e.title !== 'Raveoween' && <p className="font-display text-3xl">{e.subtitle}</p>}
                    <p className="font-display text-4xl text-hot">{e.dateLabel} · {e.time}</p>
                    {x.blurb.map((l) => <p key={l} className="text-ash">{l}</p>)}
                    <div className="mt-4 flex flex-wrap items-center gap-6">
                      <TicketLink href={x.ticketUrl}>{x.ticketLabel}</TicketLink>
                      <Link href={`/events/${e.eventSlug}`} className="link-arrow">Event page <span aria-hidden="true">→</span></Link>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        )}
        <p className="mt-20 text-ash">Looking for earlier nights? See the <Link href="/editions" className="link-arrow">editions catalogue</Link> or the <Link href="/archive" className="link-arrow">archive</Link>.</p>
      </section>
    </>
  );
}
