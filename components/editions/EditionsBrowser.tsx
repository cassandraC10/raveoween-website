'use client';
import { useMemo, useState } from 'react';
import type { Edition } from '@/lib/editions';
import { EditionCard } from './EditionCard';

type Item = { e: Edition; upcoming: boolean };
type Filter = 'all' | 'upcoming' | 'past';

export function EditionsBrowser({ items }: { items: Item[] }) {
  const [filter, setFilter] = useState<Filter>('all');
  const [newest, setNewest] = useState(false);
  const shown = useMemo(() => {
    const f = items.filter((i) => filter === 'all' || (filter === 'upcoming') === i.upcoming);
    return newest ? [...f].reverse() : f;
  }, [items, filter, newest]);

  const btn = (k: Filter, label: string) => (
    <button type="button" key={k} aria-pressed={filter === k} onClick={() => setFilter(k)} className={`tag min-h-10 px-4 ${filter === k ? 'up' : ''}`}>{label}</button>
  );
  return (
    <>
      <div className="edition-filters mb-10" aria-label="Edition filters">
        <div className="edition-filter-group" role="group" aria-label="Filter editions">
          {btn('all', `All (${items.length})`)}{btn('upcoming', 'Upcoming')}{btn('past', 'Past')}
        </div>
        <button type="button" aria-pressed={newest} onClick={() => setNewest((n) => !n)} className={`tag edition-sort min-h-10 px-4 ${newest ? 'up' : ''}`}>Newest first</button>
      </div>
      <p className="sr" role="status" aria-live="polite">{shown.length} editions shown</p>
      <ul className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {shown.map(({ e, upcoming }) => <li key={e.id}><EditionCard e={e} upcoming={upcoming} /></li>)}
      </ul>
    </>
  );
}
