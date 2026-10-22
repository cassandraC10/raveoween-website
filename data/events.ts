import { editions, type Edition } from '@/lib/editions';

/** Rich, page-level content for events that have a dedicated /events/[slug] page. Keyed by eventSlug. */
export type EventExtras = {
  ticketUrl: string;
  ticketLabel: string;
  carpoolUrl?: string;
  /** Lines shown under the title. Only wording already published on raveoween.com or the flyer. */
  blurb: string[];
  locationStatus: string;
  extraFlyer?: { src: string; w: number; h: number; alt: string };
  video?: { src: string; label: string };
  related?: { label: string; href: string }[];
};

export const eventExtras: Record<string, EventExtras> = {
  'raveoween-anniversary': {
    ticketUrl: 'https://www.eventcove.africa/events/raveoweenanniversary',
    ticketLabel: 'Get your tickets',
    carpoolUrl: 'https://forms.gle/FagbsCa4zGRa94hB8',
    blurb: ['A Gathering Of The Alter Egos.', 'Raveoween is not for everyone. Read the house rules before you buy a ticket. Don\u2019t buy a ticket if this isn\u2019t your cup of tea.'],
    locationStatus: 'Full details on the EventCove listing',
    extraFlyer: { src: '/brand/r-spider.webp', w: 1638, h: 2048, alt: 'Raveoween 2nd Anniversary spider artwork. October 31, 9PM.' },
    video: { src: '/video/halloween-is-coming.mp4', label: 'Halloween is coming' },
    related: [{ label: 'Next gathering: Blind Rave II', href: '/events/blind-rave-ii' }],
  },
  'blind-rave-ii': {
    ticketUrl: 'https://www.eventcove.africa/events/blindrave2',
    ticketLabel: 'Event details & tickets',
    blurb: ['No line up. No set times.', 'The underground of the underground.', 'Only for those who really believe.'],
    locationStatus: 'Full details on the EventCove listing',
    related: [{ label: 'The anniversary: Edition XIX', href: '/events/raveoween-anniversary' }],
  },
};

export const eventEditions: Edition[] = editions.filter((e) => e.eventSlug);
export const getEventBySlug = (slug: string) => editions.find((e) => e.eventSlug === slug);
