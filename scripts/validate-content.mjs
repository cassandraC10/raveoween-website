// Content integrity check: node scripts/validate-content.mjs  (npm run check:content)
import { readFileSync, existsSync } from 'node:fs';
const editions = JSON.parse(readFileSync(new URL('../data/editions.json', import.meta.url), 'utf8'));
let errors = 0; const warn = [];
const fail = (m) => { console.error('FAIL', m); errors++; };

if (editions.length !== 20) fail(`expected 20 editions, found ${editions.length}`);
editions.forEach((e, i) => {
  if (e.number !== i + 1 || e.id !== `R${i + 1}`) fail(`${e.id}: numbering out of order (position ${i + 1})`);
  if (e.flyer) for (const f of [e.flyer, `${e.flyer}-thumb`, ...(e.altFlyers ?? []).map((a) => a.file)])
    if (!existsSync(new URL(`../public/flyers/${f}.webp`, import.meta.url))) fail(`${e.id}: missing /public/flyers/${f}.webp`);
  if (!e.flyer) warn.push(`${e.id}: no flyer supplied`);
  if (!e.dateISO) warn.push(`${e.id}: date unknown`);
  e.review?.forEach((r) => warn.push(`${e.id}: ${r}`));
});
const withSlug = editions.filter((e) => e.eventSlug).map((e) => e.id);
if (withSlug.join() !== 'R19,R20') fail(`event pages expected for R19,R20 only, found ${withSlug}`);
const r19 = editions[18], r20 = editions[19];
if (r19.dateISO !== '2026-10-31') fail('R19 date must be 2026-10-31');
if (r20.dateISO !== '2026-12-05') fail('R20 date must be 2026-12-05');
const r2 = editions[1], r10 = editions[9];
if (r2.dateISO !== '2025-01-18' || r2.flyer !== 'r2') fail('R2 must be the 18 January 2025 flyer');
if (r10.dateISO !== '2025-12-05' || r10.roman !== 'X' || r10.flyer !== 'r10') fail('R10 must be the 5 December 2025 disco-ball flyer');
if (r10.dateISO === r20.dateISO) fail('R10 and R20 must remain distinct editions on different years');
if (editions.some((e) => !e.flyer)) fail('all 20 editions must have a flyer');
console.log(`Editions: ${editions.length}, flyers present: ${editions.filter((e) => e.flyer).length}`);
console.log(`\nREVIEW FLAGS (${warn.length}):`); warn.forEach((w) => console.log(' -', w));
process.exit(errors ? 1 : 0);
