/** Decorative belt. Hidden from assistive tech. The track is four identical copies and slides -25%. */
export function Marquee({ items }: { items: string[] }) {
  const run = (
    <span>{items.map((t) => <span key={t} className="contents">{t}<i /></span>)}</span>
  );
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">{run}{run}{run}{run}</div>
    </div>
  );
}
