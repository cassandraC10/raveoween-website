import Image from 'next/image';
import { houseRules } from '@/data/houseRules';
import { dims } from '@/data/dims';
import { Reveal } from '@/components/ui/Reveal';

/** Live text is the source of truth (accessible, searchable). The supplied rule cards sit beside it as artwork. */
export function HouseRulesList() {
  return (
    <ol className="space-y-16 md:space-y-24">
      {houseRules.map((r, i) => {
        const [w, h] = dims[`rules-${r.image}`];
        return (
          <Reveal as="li" key={r.id} className={`grid items-center gap-8 md:grid-cols-2 md:gap-14 ${i % 2 ? 'md:[&>*:first-child]:order-2' : ''}`}>
            <div id={r.id}>
              <p className="eyebrow">Rule {String(i + 1).padStart(2, '0')}</p>
              <h2 className="h2 mt-2" style={{ fontSize: 'clamp(2.4rem, 7vw, 4.6rem)' }}>{r.title}</h2>
              <div className="mt-5 max-w-[52ch] space-y-4">{r.body.map((p, j) => <p key={j}>{p}</p>)}</div>
            </div>
            <div className="frame mx-auto w-full max-w-[420px]">
              <Image src={`/house-rules/${r.image}.webp`} alt="" width={w} height={h} loading="lazy" />
            </div>
          </Reveal>
        );
      })}
    </ol>
  );
}
