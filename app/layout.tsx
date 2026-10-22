import type { Metadata, Viewport } from 'next';
import '@fontsource/pirata-one/400.css';
import '@fontsource/special-elite/400.css';
import './globals.css';
import { SoundProvider } from '@/components/sound/SoundProvider';
import { Atmosphere } from '@/components/layout/Atmosphere';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { Footer } from '@/components/layout/Footer';
import { site } from '@/data/site';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: 'Raveoween | A Gathering Of The Alter Egos', template: '%s | Raveoween' },
  description: site.description,
  openGraph: { title: 'Raveoween', description: site.description, images: [{ url: site.ogImage, width: 1200, height: 1200 }], type: 'website', siteName: 'Raveoween' },
  twitter: { card: 'summary_large_image', images: [site.ogImage] },
};
export const viewport: Viewport = { themeColor: '#030303', viewportFit: 'cover' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <noscript><style>{'.intro{display:none!important}'}</style></noscript>
      </head>
      <body>
        <a href="#main" className="skip">Skip to content</a>
        <SoundProvider>
          <Atmosphere />
          <SiteHeader />
          <main id="main">{children}</main>
          <Footer />
        </SoundProvider>
      </body>
    </html>
  );
}
