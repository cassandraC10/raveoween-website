import Image from 'next/image';
import Link from 'next/link';
import { editions } from '@/lib/editions';
import { featuredArtists } from '@/data/artists';
import { pageMeta } from '@/lib/meta';
import { PageHero } from '@/components/ui/PageHero';
import { Reveal } from '@/components/ui/Reveal';

export const metadata = pageMeta('Artists & DJs', 'Artists and DJs billed on Raveoween flyers, including the Edition XIX anniversary lineup.', '/artists');

const norm = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');

export default function ArtistsPage() {
  // Names exactly as billed on the official flyers. b2b pairings are split into individual acts.
  const map = new Map<string, { name: string; eds: string[] }>();
  for (const e of editions) for (const line of e.lineup) for (const n of line.split(/\s+b2b\s+/i)) {
    const k = norm(n); const cur = map.get(k) ?? { name: n, eds: [] };
    if (!cur.eds.includes(e.id)) cur.eds.push(e.id);
    map.set(k, cur);
  }
  const feat = new Set(featuredArtists.map((a) => norm(a.name)));
  const others = [...map.entries()].filter(([k]) => !feat.has(k)).map(([, v]) => v).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <PageHero eyebrow="Edition XIX billing" title="Artists" sub="DJs" lead="The anniversary lineup, with the supplied artwork. Names are shown exactly as billed on official flyers." />
      <section className="px-pad pb-24" aria-label="Anniversary lineup">
        <ul className="grid grid-cols-2 gap-6 md:grid-cols-3 md:gap-10">
          {featuredArtists.map((a) => {
            const eds = map.get(norm(a.name))?.eds ?? [];
            return (
              <Reveal as="li" key={a.slug}>
                <figure className="card"><div className="frame"><Image src={a.image} alt={a.alt} width={a.w} height={a.h} loading="lazy" /></div>
                  <figcaption className="mt-3"><span className="font-display text-3xl">{a.name}</span>
                    <span className="mt-1 flex flex-wrap gap-1.5">{eds.map((id) => <Link key={id} href={`/editions#ed-${id}`} className="chip hover:border-hot">{editions.find((e) => e.id === id)?.roman ?? id}</Link>)}</span></figcaption></figure>
              </Reveal>
            );
          })}
        </ul>
      </section>
      <section className="border-t border-blood px-pad py-20" aria-labelledby="past-h">
        <h2 id="past-h" className="h2">Billed<span> / earlier editions</span></h2>
        <ul className="mt-10 grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((a) => (
            <li key={a.name} className="flex flex-wrap items-baseline justify-between gap-2 border-b border-blood pb-3">
              <span className="font-display text-2xl">{a.name}</span>
              <span className="flex gap-1.5">{a.eds.map((id) => <Link key={id} href={`/editions#ed-${id}`} className="chip hover:border-hot">{editions.find((e) => e.id === id)?.roman ?? id}</Link>)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-ash">Artist profiles will be added here only once they are approved.</p>
      </section>
    </>
  );
}
