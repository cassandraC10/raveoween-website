import type { MetadataRoute } from 'next';
import { site } from '@/data/site';
import { editions } from '@/lib/editions';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/events', '/editions', '/archive', '/about', '/artists', '/house-rules', '/community'];
  const events = editions.filter((e) => e.eventSlug).map((e) => `/events/${e.eventSlug}`);
  return [...pages, ...events].map((p) => ({ url: `${site.url}${p}`, changeFrequency: 'weekly', priority: p === '' ? 1 : 0.7 }));
}
