# Raveoween Stage 2 corrections

Applied in this source package:

1. Refined the mobile Menu button to keep a dark background, thin red border, and strong light text. It remains easy to spot without competing visually with the primary Enter/Tickets actions.
2. Removed “Headphones recommended” from the homepage gate line to reduce clutter.
3. Updated the sound behavior to follow the production site's interaction: low ambient drone, thunder on “Enter Raveoween”, and the production wolf-howl source after a short delay. Sound remains opt-in.
4. Updated visible edition labels to Roman numerals I–XX without the “Edition” prefix across the homepage rail, editions catalogue, archive, upcoming events, event pages, and about timeline. Updated the homepage introduction to “From I to XX.” Internal IDs and anchors remain stable.
5. Added a ticket confirmation dialog to all EventCove ticket links. Visitors must check that they are 21+ and have read the house rules before the EventCove link becomes active. The dialog links to the full house rules.

## Validation

- `node scripts/validate-content.mjs`: ran successfully; reports 20 editions and 19 supplied flyers, with existing content-review flags.
- `npm run typecheck` / `npm run build`: not verified in this packaging environment because the available dependency type packages are incomplete. Re-run locally after applying these final UI refinements before deploying.
