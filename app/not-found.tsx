import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="grid min-h-[80svh] place-content-center gap-6 px-pad pt-32 text-center">
      <p className="eyebrow">404</p>
      <h1 className="h1">Lost in the dark</h1>
      <p className="muted">That page doesn&apos;t exist.</p>
      <div><Link href="/" className="btn-enter">Back to Raveoween</Link></div>
    </section>
  );
}
