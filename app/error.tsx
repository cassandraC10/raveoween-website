'use client';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="grid min-h-[80svh] place-content-center gap-6 px-pad pt-32 text-center" role="alert">
      <p className="eyebrow">Something broke</p>
      <h1 className="h1">The lights flickered</h1>
      <p className="muted">That didn&apos;t load. Try again.</p>
      <div><button type="button" className="btn-enter" onClick={reset}>Try again</button></div>
    </section>
  );
}
