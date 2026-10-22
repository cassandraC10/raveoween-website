import raw from '@/data/editions.json';
import { dims } from '@/data/dims';

export type Edition = {
  id: string; number: number; roman: string; title: string; subtitle?: string; tagline?: string;
  dateISO: string | null; dateLabel: string; time: string | null; startsAt?: string; location?: string;
  lineup: string[]; dateSource?: string; flyer: string | null; altFlyers?: { file: string; label: string }[];
  eventSlug?: string; review: string[];
};
export type Flyer = { src: string; thumb: string; w: number; h: number; tw: number; th: number };

export const editions = raw as Edition[];

export function flyerOf(file: string | null): Flyer | null {
  if (!file || !dims[file]) return null;
  const [w, h] = dims[file]; const [tw, th] = dims[`${file}-thumb`];
  return { src: `/flyers/${file}.webp`, thumb: `/flyers/${file}-thumb.webp`, w, h, tw, th };
}

export const displayTitle = (e: Edition) => (e.subtitle && e.title === 'Raveoween' ? `Raveoween ${e.subtitle}` : e.title);
export const flyerAlt = (e: Edition) => `Edition ${e.roman} flyer: ${displayTitle(e)}${e.dateISO ? `, ${e.dateLabel}` : ''}.`;

/** Lagos is UTC+1 all year. An edition is past once its whole Lagos day (or start time + 12h) has gone. */
export function isUpcoming(e: Edition, now = Date.now()): boolean {
  if (e.startsAt) return now < new Date(e.startsAt).getTime() + 12 * 3600 * 1000;
  if (!e.dateISO) return false;
  return now < new Date(`${e.dateISO}T23:59:59+01:00`).getTime();
}
export const bySlug = (slug: string) => editions.find((e) => e.eventSlug === slug);
