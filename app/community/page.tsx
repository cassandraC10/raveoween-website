import Link from 'next/link';
import { communityEnabled } from '@/lib/community';
import { site } from '@/data/site';
import { pageMeta } from '@/lib/meta';
import { PageHero } from '@/components/ui/PageHero';
import { Reveal } from '@/components/ui/Reveal';

export const metadata = pageMeta('Community', 'The Raveoween community: who can join, how applications will work, and what to expect. Members must be 21+.', '/community');

const steps = [
  ['Read the house rules', 'Every member agrees to them. They are the same rules as at the events.'],
  ['Apply', 'Share a few details. A vouch from a verified member can help, if you have one.'],
  ['Verify you are 21+', 'Age verification through a third-party provider is mandatory and cannot be waived.'],
  ['Review', 'Applications are reviewed by people, not automatically approved.'],
  ['See your status', 'Your application status appears in your dashboard.'],
];

export default function CommunityPage() {
  return (
    <>
      <PageHero eyebrow="Beyond the night" title="Community" lead="A private community for eligible Raveoween members. This page explains how it will work before anyone applies." />

      <section className="px-pad pb-20">
        <div className="notice max-w-3xl" role="status">
          <div>
            <b>{communityEnabled ? 'Applications are open' : 'Applications are not open yet'}</b>
            <p className="mt-1">{communityEnabled ? 'Start your application below.' : <>Nothing to fill in yet. Follow <a className="underline" href={site.socials[0].url} target="_blank" rel="noopener noreferrer">Instagram</a> or <a className="underline" href={site.socials[1].url} target="_blank" rel="noopener noreferrer">X</a> for the announcement.</>}</p>
          </div>
        </div>
        <div className="mt-8">
          {communityEnabled
            ? <Link href="/community/apply" className="btn-enter">Start application</Link>
            : <button type="button" className="btn-enter cursor-not-allowed opacity-40" disabled aria-disabled="true">Apply (opening later)</button>}
        </div>
      </section>

      <section className="grid gap-14 border-y border-blood px-pad py-20 md:grid-cols-2" aria-labelledby="elig-h">
        <Reveal>
          <h2 id="elig-h" className="h2" style={{ fontSize: 'clamp(2.4rem,7vw,4.6rem)' }}>Who can join</h2>
          <ul className="mt-6 space-y-4 text-lg">
            <li><b className="font-normal text-hot">21+ only.</b> This is mandatory and cannot be overridden by anyone.</li>
            <li>You agree to the <Link href="/house-rules" className="link-arrow">house rules</Link>, including no photos, video, live-streaming or recording.</li>
            <li>A vouch is helpful, not required, and never a guarantee. Applicants without one may still apply and may wait longer.</li>
          </ul>
        </Reveal>
        <Reveal>
          <h2 className="h2" style={{ fontSize: 'clamp(2.4rem,7vw,4.6rem)' }}>What to expect</h2>
          <ul className="mt-6 space-y-4 text-lg">
            <li>A member dashboard, a profile and official announcements.</li>
            <li>No open social feed or direct messages at launch.</li>
            <li>No attendee photo uploads, ever.</li>
          </ul>
          <p className="mt-4 text-sm text-ash">Planned scope. Details may change before launch.</p>
        </Reveal>
      </section>

      <section className="px-pad py-20" aria-labelledby="steps-h">
        <h2 id="steps-h" className="h2">How it will work</h2>
        <ol className="mt-10 grid max-w-3xl gap-6">
          {steps.map(([t, d], i) => (
            <Reveal as="li" key={t} className="grid grid-cols-[3.5rem_1fr] items-baseline gap-4 border-t border-blood pt-5">
              <span className="font-display text-4xl text-red">{String(i + 1).padStart(2, '0')}</span>
              <div><p className="font-display text-3xl">{t}</p><p className="text-ash">{d}</p></div>
            </Reveal>
          ))}
        </ol>
      </section>
    </>
  );
}
