import Image from 'next/image';
import Link from 'next/link';
import { editions, isUpcoming, flyerOf, displayTitle, flyerAlt } from '@/lib/editions';
import { eventExtras } from '@/data/events';
import { site } from '@/data/site';
import { IntroLoader } from '@/components/home/IntroLoader';
import { HomeHero } from '@/components/home/HomeHero';
import { Manifesto } from '@/components/home/Manifesto';
import { Marquee } from '@/components/ui/Marquee';
import { Reveal } from '@/components/ui/Reveal';
import { TicketLink } from '@/components/ui/TicketLink';
import { NoPhotoNotice } from '@/components/rules/NoPhotoNotice';

export const revalidate = 3600; // upcoming/past status refreshes hourly

export default function Home() {
  const upcoming = editions.filter((e) => e.eventSlug && isUpcoming(e));
  const lead = upcoming[0];
  const withFlyers = editions.filter((e) => e.flyer);

  return (
    <>
      <IntroLoader />
      <HomeHero
        startsAt={lead?.startsAt ?? '2026-10-31T21:00:00+01:00'}
        eventLabel={lead ? `${displayTitle(lead)}, ${lead.dateLabel}` : 'the next gathering'}
        eventHref={lead ? `/events/${lead.eventSlug}` : '/events'}
      />
      <Marquee items={['Raveoween', '2nd Anniversary', 'Oct 31', '9PM', 'No Photos/Videos']} />
      <Manifesto />

      <section className="px-pad py-24 md:py-36" aria-labelledby="next-h">
        <Reveal><h2 id="next-h" className="h2">Next<span> / gatherings</span></h2></Reveal>
        <ul className="mt-12 grid gap-12 md:grid-cols-2">
          {upcoming.map((e) => {
            const f = flyerOf(e.flyer); const x = eventExtras[e.eventSlug!];
            return (
              <Reveal as="li" key={e.id} className="grid gap-6 sm:grid-cols-[220px_1fr] md:grid-cols-1 lg:grid-cols-[240px_1fr]">
                {f && <Link href={`/events/${e.eventSlug}`} className="frame-btn" aria-label={`${displayTitle(e)} event page`}><span className="frame block"><Image src={f.thumb} alt={flyerAlt(e)} width={f.tw} height={f.th} loading="lazy" /></span></Link>}
                <div className="flex flex-col gap-3">
                  <p className="eyebrow">Edition {e.roman}</p>
                  <h3 className="font-display text-5xl leading-none">{displayTitle(e)}</h3>
                  <p className="font-display text-3xl text-hot">{e.dateLabel} · {e.time}</p>
                  <p className="text-ash">{x.blurb[0]}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-5">
                    <TicketLink href={x.ticketUrl}>Tickets</TicketLink>
                    <Link href={`/events/${e.eventSlug}`} className="link-arrow">Event page <span aria-hidden="true">→</span></Link>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </section>

      <Marquee items={['A Gathering Of The Alter Egos', 'Be Whoever Or Whatever You Wanna Be', 'Just Keep It Positive And Pure']} />

      <section className="py-24 md:py-36" aria-labelledby="ed-h">
        <div className="px-pad"><Reveal><h2 id="ed-h" className="h2">Twenty<span> / editions</span></h2>
          <p className="lead mt-5">From Edition I to Edition XX. Every flyer, in order.</p></Reveal></div>
        <div className="mt-10 overflow-x-auto px-pad pb-4" tabIndex={0} role="region" aria-label="Edition flyers, scroll horizontally">
          <ul className="flex w-max gap-4">
            {withFlyers.map((e) => { const f = flyerOf(e.flyer)!; return (
              <li key={e.id} className="w-40 shrink-0 sm:w-52">
                <Link href={`/editions#ed-${e.id}`} className="frame-btn"><span className="frame block"><Image src={f.thumb} alt={flyerAlt(e)} width={f.tw} height={f.th} loading="lazy" /></span><span className="mt-2 block text-sm text-ash">{e.id}</span></Link>
              </li>); })}
          </ul>
        </div>
        <p className="mt-8 px-pad"><Link href="/editions" className="link-arrow">Browse the catalogue <span aria-hidden="true">→</span></Link></p>
      </section>

      <section className="px-pad pb-24" aria-labelledby="rules-h">
        <Reveal>
          <p className="eyebrow">Before you enter</p>
          <h2 id="rules-h" className="h2 mt-2">House rules</h2>
          <p className="lead mt-5">Raveoween is not for everyone.</p>
          <div className="mt-8 max-w-4xl"><NoPhotoNotice /></div>
          <p className="mt-8"><Link href="/house-rules" className="link-arrow">Read all six rules <span aria-hidden="true">→</span></Link></p>
        </Reveal>
      </section>

      <section className="border-y border-blood px-pad py-20" aria-labelledby="comm-h">
        <Reveal className="grid gap-8 md:grid-cols-2 md:items-center">
          <div><p className="eyebrow">Beyond the night</p><h2 id="comm-h" className="h2 mt-2">Community</h2></div>
          <div><p className="lead">A private community for eligible members is being built. Read how it will work, who can join and what to expect.</p>
            <p className="mt-6"><Link href="/community" className="link-arrow">About the community <span aria-hidden="true">→</span></Link></p></div>
        </Reveal>
      </section>

      {lead && <div className="pt-24"><TicketLink href={eventExtras[lead.eventSlug!].ticketUrl} variant="block" note>Get tickets</TicketLink></div>}
      <ul className="flex flex-wrap justify-center gap-x-12 gap-y-4 px-pad py-16">
        {site.socials.map((s) => <li key={s.label}><a className="link-arrow font-display text-4xl" href={s.url} target="_blank" rel="noopener noreferrer">{s.label} <span className="font-type text-base text-ash">{s.handle}</span></a></li>)}
      </ul>
    </>
  );
}
