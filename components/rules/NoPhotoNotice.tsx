import Image from 'next/image';
import { noPhotoPolicy } from '@/data/houseRules';
import { dims } from '@/data/dims';

export function NoPhotoNotice({ withSign = false }: { withSign?: boolean }) {
  return (
    <div className="notice" role="note" aria-label="No photography policy">
      <span className="text-4xl" aria-hidden="true">📵</span>
      <div>
        <b>{noPhotoPolicy.headline}</b>
        <p className="mt-1">{noPhotoPolicy.short} {noPhotoPolicy.detail}</p>
      </div>
      {withSign && <Image src="/brand/no-photos.webp" alt="Raveoween policy sign: no photography, no live-streaming, no recording." width={dims['no-photos.webp'][0]} height={dims['no-photos.webp'][1]} className="hidden w-28 shrink-0 border border-blood md:block" />}
    </div>
  );
}
