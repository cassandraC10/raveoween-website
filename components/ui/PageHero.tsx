import Link from 'next/link';

export function PageHero({ eyebrow, title, sub, lead, children, backHref = '/', backLabel = 'Home' }: { eyebrow?: string; title: string; sub?: string; lead?: string; children?: React.ReactNode; backHref?: string; backLabel?: string }) {
  return (
    <header className="px-pad pb-12 pt-36 md:pt-44">
      <Link href={backHref} className="page-back"><span aria-hidden="true">←</span> Back to {backLabel}</Link>
      {eyebrow && <p className="eyebrow mb-4 mt-5">{eyebrow}</p>}
      <h1 className="h1">{title}{sub && <span> / {sub}</span>}</h1>
      {lead && <p className="lead mt-6">{lead}</p>}
      {children}
    </header>
  );
}
