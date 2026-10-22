import Image from 'next/image';
import Link from 'next/link';
import { displayTitle, flyerOf, flyerAlt, isUpcoming, type Edition } from '@/lib/editions';
import { eventExtras } from '@/data/events';
import { featuredArtists } from '@/data/artists';
import { site } from '@/data/site';
import { Countdown } from '@/components/ui/Countdown';
import { TicketLink } from '@/components/ui/TicketLink';
import { LazyVideo } from '@/components/ui/LazyVideo';
import { Reveal } from '@/components/ui/Reveal';
import { UpcomingOnly } from '@/components/events/UpcomingOnly';
import { NoPhotoNotice } from '@/components/rules/NoPhotoNotice';

const norm = (s: string) => s.toLowerCase().replace(/[^a-z]/g, '');

/** One template for every canonical event page. Content comes from data/editions.json + data/events.ts only. */
export function EventTemplate({ e }: { e: Edition }) {
  const x = eventExtras[e.eventSlug!];
  const fl = flyerOf(e.flyer);
  const upcoming = isUpcoming(e);
  const endsAt = new Date(new Date(e.startsAt!).getTime() + 12 * 3600 * 1000).toISOString();
  const passed = <p className="notice"><b>This gathering has passed.</b> <Link href="/editions" className="link-arrow">See all editions</Link></p>;
  const title = displayTitle(e);
  const artists = e.lineup.map((n) => featuredArtists.find((a) => norm(a.name) === norm(n)) ?? n);

  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Event', name: title, startDate: e.startsAt,
    eventStatus: 'https://schema.org/EventScheduled', eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    image: fl ? `${site.url}${fl.src}` : undefined, url: `${site.url}/events/${e.eventSlug}`,
    organizer: { '@type': 'Organization', name: 'Raveoween', url: site.url },
    offers: { '@type': 'Offer', url: x.ticketUrl },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="grid gap-10 px-pad pb-16 pt-36 md:grid-cols-[1.1fr_.9fr] md:items-start md:pt-44">
        <div>
          <p className="eyebrow">{e.roman}</p>
          <h1 className="h1 mt-3">{title}</h1>
          {e.subtitle && <p className="mt-3 font-display text-3xl text-bone">{e.subtitle}</p>}
          <p className="mt-5 font-display text-[clamp(1.8rem,5vw,3rem)] text-hot">{e.dateLabel} · {e.time}</p>
          <div className="mt-8 space-y-2">{x.blurb.map((l) => <p key={l} className="lead">{l}</p>)}</div>

          <div className="mt-10 flex flex-col items-start gap-6">
            {e.startsAt ? <Countdown target={e.startsAt} label={`Countdown to ${e.dateLabel}, ${e.time}`} /> : null}
            <UpcomingOnly endsAt={endsAt} initiallyOver={!upcoming} over={passed}>
              <div className="flex flex-wrap items-center gap-6">
                <TicketLink href={x.ticketUrl}>{x.ticketLabel}</TicketLink>
                {x.carpoolUrl && <a href={x.carpoolUrl} className="link-arrow" target="_blank" rel="noopener noreferrer">Need a ride? Join the carpool <span aria-hidden="true">→</span></a>}
              </div>
            </UpcomingOnly>
          </div>
        </div>
        {fl && (
          <div className="frame mx-auto w-full max-w-[460px]">
            <Image src={fl.src} alt={flyerAlt(e)} width={fl.w} height={fl.h} priority sizes="(min-width:768px) 40vw, 92vw" />
          </div>
        )}
      </header>

      <section className="px-pad pb-20" aria-labelledby="facts-h">
        <h2 id="facts-h" className="sr">Event details</h2>
        <dl className="facts max-w-3xl">
          <div><dt>Edition</dt><dd>{e.roman}</dd></div>
          <div><dt>Date</dt><dd>{e.dateLabel}</dd></div>
          <div><dt>Time</dt><dd>{e.time}</dd></div>
          <div><dt>Location</dt><dd className="small">{x.locationStatus}</dd></div>
          <div><dt>Tickets</dt><dd className="small"><TicketLink href={x.ticketUrl} variant="inline">EventCove</TicketLink></dd></div>
          <div><dt>House rules</dt><dd className="small"><Link href="/house-rules">Read the house rules</Link></dd></div>
          {x.carpoolUrl && <div><dt>Carpool</dt><dd className="small"><a href={x.carpoolUrl} target="_blank" rel="noopener noreferrer">Join the carpool</a></dd></div>}
        </dl>
      </section>

      {artists.length > 0 && (
        <section className="px-pad pb-24" aria-labelledby="lineup-h">
          <Reveal><h2 id="lineup-h" className="h2">Artists<span> / DJs</span></h2></Reveal>
          <ul className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
            {artists.map((a) => typeof a === 'string' ? (
              <li key={a}><span className="chip">{a}</span></li>
            ) : (
              <Reveal as="li" key={a.slug}>
                <figure className="card"><div className="frame"><Image src={a.image} alt={a.alt} width={a.w} height={a.h} loading="lazy" /></div>
                  <figcaption className="mt-3 font-display text-2xl">{a.name}</figcaption></figure>
              </Reveal>
            ))}
          </ul>
          <p className="mt-6"><Link href="/artists" className="link-arrow">All artists <span aria-hidden="true">→</span></Link></p>
        </section>
      )}

      {(x.video || x.extraFlyer) && (
        <section className="grid gap-12 px-pad pb-24 md:grid-cols-2" aria-label="Edition artwork">
          {x.video && <Reveal><LazyVideo src={x.video.src} label={x.video.label} /></Reveal>}
          {x.extraFlyer && <Reveal><div className="frame mx-auto max-w-[420px]"><Image src={x.extraFlyer.src} alt={x.extraFlyer.alt} width={x.extraFlyer.w} height={x.extraFlyer.h} loading="lazy" /></div></Reveal>}
        </section>
      )}

      <section className="px-pad pb-24" aria-labelledby="before-h">
        <Reveal>
          <p className="eyebrow">Before you enter</p>
          <h2 id="before-h" className="h2 mt-2">Read the house rules.</h2>
          <p className="lead mt-5">Raveoween is not for everyone. Don&apos;t buy a ticket if this isn&apos;t your cup of tea.</p>
          <div className="mt-8"><NoPhotoNotice /></div>
          <p className="mt-8"><Link href="/house-rules" className="link-arrow">Full house rules <span aria-hidden="true">→</span></Link></p>
        </Reveal>
      </section>

      <UpcomingOnly endsAt={endsAt} initiallyOver={!upcoming} over={null}><TicketLink href={x.ticketUrl} variant="block" note>Get tickets</TicketLink></UpcomingOnly>

      {x.related && (
        <nav aria-label="Related" className="flex flex-wrap gap-8 px-pad py-16">
          {x.related.map((r) => <Link key={r.href} href={r.href} className="link-arrow">{r.label} <span aria-hidden="true">→</span></Link>)}
          <Link href="/events" className="link-arrow">All events</Link>
        </nav>
      )}
    </>
  );
}
