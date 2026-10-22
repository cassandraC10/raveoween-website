export const site = {
  name: 'Raveoween',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://raveoween-community.netlify.app',
  /** Verified social bio copy. Do not extend with new brand claims. */
  xBio: 'Underground Electronic Music Event | A GATHERING OF THE ALTER EGOS | No Photos Or Videos Allowed',
  igBio: ['Underground Electronic Music Event', 'A TRULY INCLUSIVE SPACE', 'Be Whoever Or Whatever You Wanna Be', 'Just Keep It Positive And Pure', 'No Photos/Videos'],
  description: 'Raveoween: Underground Electronic Music Event. A Gathering Of The Alter Egos. No photos or videos allowed.',
  ogImage: '/brand/raveoween-preview.png',
  socials: [
    { label: 'Instagram', handle: '@raveoweenexperience', url: 'https://www.instagram.com/raveoweenexperience/' },
    { label: 'X', handle: '@raveoweenlagos', url: 'https://x.com/raveoweenlagos' },
  ],
  highlights: [
    { label: 'Instagram highlights', url: 'https://www.instagram.com/raveoweenexperience/' },
    { label: 'What was shared on X', url: 'https://x.com/raveoweenlagos/media' },
  ],
  nav: [
    { href: '/events', label: 'Events' },
    { href: '/editions', label: 'Editions' },
    { href: '/artists', label: 'Artists' },
    { href: '/house-rules', label: 'House rules' },
    { href: '/archive', label: 'Archive' },
    { href: '/about', label: 'About' },
    { href: '/community', label: 'Community' },
  ],
} as const;
