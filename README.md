# Raveoween Community: Stage 2 public website (v1.0)

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS + custom CSS tokens · GSAP/ScrollTrigger.
Deploys to `raveoween-community.netlify.app`. **This project is independent of the production `raveoween.com` site and never modifies it.**

## Routes
`/` · `/events` · `/events/[slug]` (`raveoween-anniversary`, `blind-rave-ii`) · `/editions` · `/archive` · `/about` · `/artists` · `/house-rules` · `/community` · `/api/feedback` · `/sitemap.xml` · `/robots.txt`

## Install and run
Requires Node 20.9+ (22 recommended).
```bash
npm install
cp .env.example .env.local     # optional for local dev; every variable is optional
npm run dev                    # http://localhost:3000
npm run typecheck              # tsc --noEmit
npm run check:content          # validates the 20 editions + prints metadata review flags
npm run build && npm start     # production build, served locally
```

## Environment variables
| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap, Open Graph. Defaults to `https://raveoween-community.netlify.app`. |
| `FEEDBACK_WEBHOOK_URL` | Anonymous feedback relay (Slack/Discord/Zapier). Receives only `{experience, feedback}`. Unset => the form shows "not switched on". |
| `NEXT_PUBLIC_COMMUNITY_ENABLED` | `false` by default. Applications stay closed in this release. |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | Reserved for the community phase. Not read by any public page. The build needs none of them. |

## Netlify deployment (community project only)
1. Use the **separate** Netlify site `raveoween-community`, publishing from the `community` branch. Do not touch the `main`-based production site.
2. Build command `npm run build` (already in `netlify.toml`). Netlify auto-detects Next.js and applies its runtime; leave the publish directory to the runtime default if the UI complains about `.next`.
3. Node 22 is pinned in `netlify.toml`.
4. Set the env vars above in Site configuration > Environment variables. Mark `SUPABASE_SERVICE_ROLE_KEY` secret.
5. Push to `community`; check the deploy preview; run the checklist under "Tests".
6. `robots.txt` **disallows all crawlers while `NEXT_PUBLIC_SITE_URL` contains `netlify.app`**, so staging does not compete with raveoween.com. It flips to allow automatically on a custom domain.

## Where content lives (edit these, not the components)
| File | Content |
|---|---|
| `data/editions.json` | All 20 editions (R1-R20): dates, times, billing, flyer file, review flags. |
| `data/events.ts` | Page-level content for `/events/[slug]`: EventCove link, blurb, carpool, video. |
| `data/houseRules.ts` | The six rules + no-photo policy. |
| `data/artists.ts` | Artists with supplied artwork. |
| `data/site.ts` | Verified bio copy, socials, navigation. |
| `public/flyers/` | `rN.webp` (<=1000px) + `rN-thumb.webp`. `data/dims.ts` holds pixel sizes (regenerate if you replace images). |

**Adding an event page:** add `eventSlug` to the edition in `editions.json`, add a matching entry in `data/events.ts`. One template (`components/events/EventTemplate.tsx`) renders all of them.

## Architecture notes
- **One canonical event route.** `/editions` is a catalogue and `/archive` is a flyer wall; neither duplicates event detail.
- **Status is computed, not typed.** Upcoming/past derives from dates (Lagos, UTC+1). Listing pages revalidate hourly; event pages stop offering tickets from the browser clock once the night is over.
- **Privacy.** Feedback has no identity fields. The API route reads no IP/user agent/cookies and logs nothing (your host's own access logs are outside this).
- **Policy.** No-photo/video/live-stream/recording policy is repeated on home, event pages, house rules, archive and footer. The archive shows only supplied flyers. There is no upload feature.
- **Motion and sound.** Sound is opt-in only. The intro loader plays once per session, never under `prefers-reduced-motion`. The scroll manifesto becomes static text under reduced motion. The 7 MB teaser video loads only when scrolled near.
- **Supabase boundary.** `lib/supabase.ts` (env-gated, returns `null` if unconfigured), `lib/community.ts` (feature flag + status types), `supabase/schema-draft.sql` (from the discovery pack, **not production-ready**: auth mapping, RLS and retention are still open). No public page imports Supabase.

## Not in this release (by design)
Feeds, DMs, member dashboards, age-verification flows, admin tools, application forms, attendee uploads.

## Tests performed
See `RELEASE_NOTES.md`. `scripts/e2e.py` (Playwright, Python) reproduces the browser checks against a running server: `python3 scripts/e2e.py` with the app on port 3111.
