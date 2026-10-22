import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { bySlug, displayTitle, flyerOf, editions } from '@/lib/editions';
import { eventExtras } from '@/data/events';
import { pageMeta } from '@/lib/meta';
import { EventTemplate } from '@/components/events/EventTemplate';


export function generateStaticParams() {
  return editions.filter((e) => e.eventSlug && eventExtras[e.eventSlug]).map((e) => ({ slug: e.eventSlug! }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const e = bySlug(slug);
  if (!e) return {};
  const f = flyerOf(e.flyer);
  return pageMeta(`${displayTitle(e)} · Edition ${e.roman}`, `${displayTitle(e)}, Edition ${e.roman}. ${e.dateLabel}, ${e.time}. Tickets on EventCove. No photos or videos.`, `/events/${slug}`, f?.src);
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = bySlug(slug);
  if (!e || !eventExtras[slug]) notFound();
  return <EventTemplate e={e} />;
}
