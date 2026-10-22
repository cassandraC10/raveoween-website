# Raveoween Stage 2 v1.0: build and test record

## Build
`npm run typecheck` clean. `npm run build` succeeds: 9 required routes + 2 event pages, 0 type errors.
First-load JS 103-117 kB shared. Total assets ~11 MB (flyers converted to webp, 11 MB -> from ~86 MB source).

## Tests performed
**Content (`npm run check:content`, exit 0):** 20 editions, numbered R1-R20 in order; 19 flyers present + 2 alternates (R5b, R6b); R2 flagged; event pages exist for R19/R20 only; dates 2026-10-31 and 2026-12-05.

**HTTP against `next start`:** all 11 public routes + sitemap, robots, icon, flyer, video return 200; unknown `/events/x` and `/nonexistent` return a real 404; server survives repeated 404 probes.

**HTML assertions:** EventCove links correct for both events (`raveoweenanniversary`, `blindrave2`); carpool link on R19; JSON-LD, title and canonical on both event pages; no-photo notice on both; six house-rule anchors; R2 placeholder card; no copy claiming EventCove verifies/enforces 21+.

**Browser (Playwright/Chromium, desktop 1366px, mobile 390px touch, reduced-motion), 60 checks, 0 failed:** no horizontal overflow on any of 10 pages x 2 viewports; intro loader plays once then skips on repeat visit and unlocks scroll; mobile menu opens/closes with Esc and navigates; sound off by default and toggles; 20 edition cards, Upcoming=2, Past=18 filters; lightbox opens and closes on Esc; ticket CTA is EventCove, `_blank`, `noopener`; countdown renders; GSAP manifesto lights words/bio lines on scroll; feedback form has no identity fields and shows a friendly message when no webhook is set; no console errors; reduced motion disables loader, marquee and pinned scroll.

## Bugs found and fixed during testing
- `dynamicParams=false` + ISR crashed `next start` on an unknown event slug. Removed; `notFound()` handles it.
- Root `loading.tsx` caused soft-404s (HTTP 200 on missing pages). Removed; pages are static.
- Event pages could not stop offering tickets after the event without redeploy. Added client-side `UpcomingOnly` check.

## Not tested (be honest)
Real Netlify deployment; real audio output (WebAudio verified only as state toggling); Safari/iOS devices; screen-reader walkthrough; Lighthouse scores; the EventCove links were not opened (external).
