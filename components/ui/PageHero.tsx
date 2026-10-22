export function PageHero({ eyebrow, title, sub, lead, children }: { eyebrow?: string; title: string; sub?: string; lead?: string; children?: React.ReactNode }) {
  return (
    <header className="px-pad pb-12 pt-36 md:pt-44">
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <h1 className="h1">{title}{sub && <span> / {sub}</span>}</h1>
      {lead && <p className="lead mt-6">{lead}</p>}
      {children}
    </header>
  );
}
