import type { Metadata } from 'next';
import { site } from '@/data/site';

/** Per-page metadata with canonical URL, Open Graph and Twitter card. */
export function pageMeta(title: string, description: string, path: string, image: string = site.ogImage): Metadata {
  const url = `${site.url}${path}`;
  return {
    title, description, alternates: { canonical: path },
    openGraph: { title, description, url, siteName: 'Raveoween', images: [{ url: image }], type: 'website' },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}
