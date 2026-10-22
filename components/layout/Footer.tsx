import Link from 'next/link';
import { site } from '@/data/site';

export function Footer() {
  return (
    <footer className="border-t border-blood px-pad py-14">
      <div className="grid gap-10 md:grid-cols-3">
        <div>
          <p className="font-display text-4xl text-red">Raveoween</p>
          <p className="mt-2 max-w-[30ch] text-ash">{site.xBio.split(' | ')[0]}. A Gathering Of The Alter Egos.</p>
        </div>
        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
            {site.nav.map((n) => <li key={n.href}><Link href={n.href} className="link-arrow">{n.label}</Link></li>)}
          </ul>
        </nav>
        <div>
          <ul className="space-y-2">
            {site.socials.map((s) => <li key={s.label}><a className="link-arrow" href={s.url} target="_blank" rel="noopener noreferrer">{s.label} <span className="muted">{s.handle}</span></a></li>)}
          </ul>
          <p className="mt-6 text-sm text-hot">No photos or videos. No live-streaming. No recording.</p>
        </div>
      </div>
    </footer>
  );
}
