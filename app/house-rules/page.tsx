import Image from 'next/image';
import Link from 'next/link';
import { pageMeta } from '@/lib/meta';
import { dims } from '@/data/dims';
import { PageHero } from '@/components/ui/PageHero';
import { NoPhotoNotice } from '@/components/rules/NoPhotoNotice';
import { HouseRulesList } from '@/components/rules/HouseRulesList';

export const metadata = pageMeta('House rules', 'Raveoween house rules: respect the space, no photos or videos, no harassment or hate, consent, be conscious, let the people dance.', '/house-rules', '/house-rules/cover.webp');

export default function HouseRulesPage() {
  const [w, h] = dims['rules-cover'];
  return (
    <>
      <PageHero eyebrow="Please read" title="House rules" lead="Raveoween is not for everyone. Don't buy a ticket if this isn't your cup of tea." />
      <section className="grid items-center gap-10 px-pad pb-20 md:grid-cols-[1fr_minmax(0,360px)]">
        <NoPhotoNotice withSign />
        <div className="frame mx-auto w-full max-w-[360px]"><Image src="/house-rules/cover.webp" alt="Raveoween house rules" width={w} height={h} priority /></div>
      </section>
      <section className="px-pad pb-24" aria-label="The six house rules"><HouseRulesList /></section>
      <section className="border-t border-blood px-pad py-16">
        <p className="lead">Read them all? Then you know the room. <Link href="/events" className="link-arrow">See upcoming events <span aria-hidden="true">→</span></Link></p>
      </section>
    </>
  );
}
