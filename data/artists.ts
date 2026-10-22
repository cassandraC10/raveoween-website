/** Artists with supplied artwork (Edition XIX billing, as already published on raveoween.com). */
export type FeaturedArtist = { slug: string; name: string; image: string; w: number; h: number; alt: string };

export const featuredArtists: FeaturedArtist[] = [
  { slug: 'funsyde', name: 'Funsyde', image: '/brand/funsyde.webp', w: 392, h: 532, alt: 'Funsyde. Raveoween flyer with a ghost-faced mask.' },
  { slug: 'lollypop', name: 'Lollypop', image: '/brand/lollypop.webp', w: 398, h: 516, alt: 'Lollypop. Raveoween flyer with a pale-faced nun.' },
  { slug: 'del-noi', name: 'Del Noi', image: '/brand/del-noi.webp', w: 1638, h: 2048, alt: 'Del Noi. Raveoween 2nd Anniversary flyer.' },
  { slug: 'knd', name: 'K.N.D', image: '/brand/knd-raveoween.jpeg', w: 1638, h: 2048, alt: 'K.N.D. Raveoween 2nd Anniversary flyer.' },
  { slug: 'momentum', name: 'Momentum', image: '/brand/momentum-raveoween.jpeg', w: 1638, h: 2048, alt: 'Momentum. Raveoween 2nd Anniversary flyer.' },
  { slug: 'banz', name: 'BANZ', image: '/brand/banz-raveoween.jpeg', w: 1024, h: 1280, alt: 'BANZ. Raveoween 2nd Anniversary flyer.' },
];
