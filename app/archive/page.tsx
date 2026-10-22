import Link from 'next/link';
import { editions, flyerOf, flyerAlt, displayTitle, isUpcoming } from '@/lib/editions';
import { site } from '@/data/site';
import { pageMeta } from '@/lib/meta';
import { PageHero } from '@/components/ui/PageHero';
import { Reveal } from '@/components/ui/Reveal';
import { FlyerButton } from '@/components/ui/FlyerButton';
import { NoPhotoNotice } from '@/components/rules/NoPhotoNotice';
import { FeedbackForm } from '@/components/feedback/FeedbackForm';

export const revalidate = 3600;
export const metadata = pageMeta('Archive', 'The Raveoween archive: official flyers from past editions. No attendee photos or video, on purpose.', '/archive');

export default function ArchivePage() {
  const past = editions.filter((e) => e.flyer && !isUpcoming(e));
  const years = [...new Set(past.map((e) => e.dateISO!.slice(0, 4)))];
  return (
    <>
      <PageHero eyebrow="Memory, minus the screens" title="Archive" lead="The archive is empty. On purpose." />
      <section className="px-pad pb-20">
        <div className="grid max-w-5xl gap-8">
          <p className="lead">Raveoween is felt, not filmed. That is why there are no attendee photos, videos or live-stream clips here, and there never will be an upload gallery. What we keep are the flyers: the official artwork for each edition, supplied and approved by Raveoween.</p>
          <NoPhotoNotice withSign />
        </div>
      </section>

      {years.map((y) => (
        <section key={y} className="px-pad pb-24" aria-labelledby={`y-${y}`}>
          <Reveal><h2 id={`y-${y}`} className="h2">{y}</h2></Reveal>
          <ul className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
            {past.filter((e) => e.dateISO!.startsWith(y)).flatMap((e) => {
              const out = [{ key: e.id, file: e.flyer!, cap: `${e.roman} · ${displayTitle(e)}`, alt: flyerAlt(e), sub: `${e.roman} · ${e.dateLabel}` }];
              e.altFlyers?.forEach((a) => out.push({ key: a.file, file: a.file, cap: `${e.roman} · ${a.label}`, alt: `${a.label}, Edition ${e.roman}`, sub: `${e.roman} · alternate` }));
              return out;
            }).map((it) => { const f = flyerOf(it.file)!; return (
              <Reveal as="li" key={it.key}><FlyerButton flyer={f} alt={it.alt} caption={it.cap} /><p className="mt-2 text-sm text-ash">{it.sub}</p></Reveal>
            ); })}
          </ul>
        </section>
      ))}
      <p className="px-pad pb-24 text-ash">Dates, billing and details for each edition live in the <Link href="/editions" className="link-arrow">editions catalogue</Link>.</p>

      <section className="border-t border-blood px-pad py-24" aria-labelledby="fb-h">
        <p className="eyebrow">Still, we listen.</p>
        <h2 id="fb-h" className="h2 mt-2" style={{ fontSize: 'clamp(2.4rem, 7vw, 5rem)' }}>Tell us how it felt.</h2>
        <p className="lead mb-8 mt-4">Leave feedback without adding your name or email. The form asks only about the experience.</p>
        <FeedbackForm />
        <ul className="mt-12 flex flex-wrap gap-x-10 gap-y-3">
          {site.highlights.map((l) => <li key={l.url}><a className="link-arrow" href={l.url} target="_blank" rel="noopener noreferrer">{l.label}</a></li>)}
        </ul>
      </section>
    </>
  );
}
