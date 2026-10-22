import { editions, isUpcoming } from '@/lib/editions';
import { pageMeta } from '@/lib/meta';
import { PageHero } from '@/components/ui/PageHero';
import { EditionsBrowser } from '@/components/editions/EditionsBrowser';

export const revalidate = 3600;
export const metadata = pageMeta('Editions', 'The Raveoween catalogue: all twenty editions, numbered I to XX in Roman numerals, with flyers and dates.', '/editions');

export default function EditionsPage() {
  const items = editions.map((e) => ({ e, upcoming: isUpcoming(e) }));
  return (
    <>
      <PageHero eyebrow="I – XX" title="Editions" lead="Twenty editions, numbered from I to XX. Select a flyer to enlarge it. Upcoming editions link to their event page." />
      <section className="px-pad pb-24" aria-label="Edition catalogue"><EditionsBrowser items={items} /></section>
    </>
  );
}
