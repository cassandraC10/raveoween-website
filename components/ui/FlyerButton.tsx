'use client';
import Image from 'next/image';
import { useRef } from 'react';
import type { Flyer } from '@/lib/editions';

/** Thumbnail button that opens the full flyer in a native <dialog> (Esc to close, focus returns automatically). */
export function FlyerButton({ flyer, alt, caption, priority = false }: { flyer: Flyer; alt: string; caption: string; priority?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button type="button" className="frame-btn" onClick={() => ref.current?.showModal()} aria-label={`Enlarge flyer: ${caption}`}>
        <span className="frame block"><Image src={flyer.thumb} alt={alt} width={flyer.tw} height={flyer.th} loading={priority ? 'eager' : 'lazy'} sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 100vw" /></span>
      </button>
      <dialog ref={ref} className="lightbox" aria-label={caption} onClick={(e) => { if (e.target === ref.current) ref.current?.close(); }}>
        <Image src={flyer.src} alt={alt} width={flyer.w} height={flyer.h} sizes="(min-width:760px) 760px, 94vw" />
        <div className="flex items-center justify-between gap-4 p-4">
          <p className="text-ash">{caption}</p>
          <button type="button" className="btn-quiet" onClick={() => ref.current?.close()} autoFocus>Close</button>
        </div>
      </dialog>
    </>
  );
}
