'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { site } from '@/data/site';
import { SoundToggle } from '@/components/sound/SoundProvider';

export function SiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open);
    if (!open) return;
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); btn.current?.focus(); } };
    addEventListener('keydown', esc);
    return () => removeEventListener('keydown', esc);
  }, [open]);

  const cur = (href: string) => (path === href || path.startsWith(href + '/') ? 'page' : undefined);

  return (
    <>
      <header className="bar">
        <Link href="/" aria-label="Raveoween home" className="block w-[clamp(120px,17vw,190px)]" onClick={() => setOpen(false)}>
          <Image src="/brand/raveoween-original-logo.png" alt="Raveoween" width={400} height={140} priority className="w-full h-auto" />
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
          {site.nav.map((n) => <Link key={n.href} href={n.href} className="bar-link" aria-current={cur(n.href)}>{n.label}</Link>)}
        </nav>
        <div className="flex items-center gap-3">
          <SoundToggle />
          <button ref={btn} type="button" className="mobile-menu-btn lg:hidden" aria-expanded={open} aria-controls="menu" onClick={() => setOpen((o) => !o)}>
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </header>
      {open && (
        <nav id="menu" aria-label="Mobile" className="menu-panel lg:hidden">
          <Link href="/" aria-current={path === '/' ? 'page' : undefined}>Home</Link>
          {site.nav.map((n) => <Link key={n.href} href={n.href} aria-current={cur(n.href)}>{n.label}</Link>)}
        </nav>
      )}
    </>
  );
}
