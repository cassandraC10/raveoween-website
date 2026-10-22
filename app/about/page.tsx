import Link from 'next/link';
import { editions, isUpcoming } from '@/lib/editions';
import { site } from '@/data/site';
import { pageMeta } from '@/lib/meta';
import { PageHero } from '@/components/ui/PageHero';
import { Reveal } from '@/components/ui/Reveal';

export const revalidate = 3600;
export const metadata = pageMeta('About', 'Raveoween is an underground electronic music event: a gathering of the alter egos, a truly inclusive space, no photos or videos.', '/about');

export default function AboutPage() {
  const past = editions.filter((e) => !isUpcoming(e)).length;
  const next = editions.filter((e) => isUpcoming(e)).length;
  const milestones = editions.filter((e) => ['R1', 'R9', 'R19'].includes(e.id));
  return (
    <>
      <PageHero eyebrow="Brand story" title="About" sub="Raveoween" />
      <section className="grid gap-16 px-pad pb-24 md:grid-cols-2">
        <Reveal>
          <p className="font-display text-[clamp(2.2rem,6vw,4rem)] leading-none text-red">Underground Electronic Music Event</p>
          <p className="mt-4 font-display text-[clamp(1.8rem,4.5vw,3rem)] leading-none">A Gathering Of The Alter Egos</p>
        </Reveal>
        <Reveal><ul className="space-y-3 text-lg">{site.igBio.map((l) => <li key={l} className="border-l-2 border-red pl-4">{l}</li>)}</ul></Reveal>
      </section>

      <section className="border-y border-blood px-pad py-20" aria-labelledby="alter-h">
        <Reveal className="max-w-3xl space-y-5">
          <h2 id="alter-h" className="h2" style={{ fontSize: 'clamp(2.4rem,7vw,4.6rem)' }}>The Alter Ego</h2>
          <p className="lead">Raveoween is a celebration of freedom and expression for the alter ego, not just a night out. The first flyer said it plainly: bring your alter ego to the rave.</p>
          <p className="lead">House music was born from marginalized communities who created these movements as sanctuaries of acceptance. That is the standard here: unity, freedom, expression, and zero tolerance for hate, harassment or exclusion.</p>
        </Reveal>
      </section>

      <section className="px-pad py-20" aria-labelledby="felt-h">
        <Reveal className="max-w-3xl space-y-5">
          <h2 id="felt-h" className="h2" style={{ fontSize: 'clamp(2.4rem,7vw,4.6rem)' }}>Felt, not filmed</h2>
          <p className="lead">This space is meant to be felt, not filmed. There are no photos, videos, live-streams or recordings at Raveoween. Cameras are stickered upon entry.</p>
          <p className="muted">That is also why this website shows flyers and official artwork, not event footage.</p>
          <Link href="/house-rules" className="link-arrow">Read the house rules <span aria-hidden="true">→</span></Link>
        </Reveal>
      </section>

      <section className="border-t border-blood px-pad py-20" aria-labelledby="line-h">
        <h2 id="line-h" className="h2">Timeline</h2>
        <dl className="facts mt-10 max-w-3xl">
          {milestones.map((m) => <div key={m.id}><dt>{m.roman}</dt><dd className="small">{m.subtitle ?? 'First edition'} · {m.dateLabel}</dd></div>)}
          <div><dt>Series so far</dt><dd className="small">{past} past · {next} upcoming · {editions.length} total</dd></div>
        </dl>
        <div className="mt-10 flex flex-wrap gap-8"><Link href="/editions" className="link-arrow">All editions <span aria-hidden="true">→</span></Link><Link href="/events" className="link-arrow">What&apos;s next <span aria-hidden="true">→</span></Link><Link href="/community" className="link-arrow">Community <span aria-hidden="true">→</span></Link></div>
      </section>
    </>
  );
}
