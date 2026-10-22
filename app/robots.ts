import type { MetadataRoute } from 'next';
import { site } from '@/data/site';

export default function robots(): MetadataRoute.Robots {
  // The staging deployment should not compete with raveoween.com in search. Flip to allow at cutover.
  const staging = site.url.includes('netlify.app');
  return { rules: staging ? { userAgent: '*', disallow: '/' } : { userAgent: '*', allow: '/' }, sitemap: `${site.url}/sitemap.xml` };
}
