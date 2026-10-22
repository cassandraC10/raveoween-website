# Raveoween Stage 2 corrections

- Restored the complete 20-edition chronology and supplied flyers for R2 through R10.
- Corrected the sequence from R2 (18 January 2025) through R10 (5 December 2025).
- Kept R10 (5 December 2025, disco-ball flyer) distinct from R20 Blind Rave II (5 December 2026).
- Updated the edition data so the archive, edition cards, event lineup displays, and event references consume the same canonical records.
- Updated the community copy to: “Applicants without one may still apply but may wait longer.”
- Reworked the edition filters for narrow Android screens so the sort control occupies its own full-width row and filter buttons remain usable. The existing all/upcoming/past and newest-first state logic is preserved.
- Added consistent back-navigation links to page heroes and a return link from event detail pages to all events.
- Added content-validation checks for the R2/R10/R20 date and flyer distinction.

## Items requiring owner confirmation

- The supplied R9 anniversary flyer visibly says 1 November while its filename says 8 November 2025. The site currently displays the date printed on the flyer and retains a review flag.
- A second supplied April 18 creative is not displayed because it carries a V label while the canonical edition sequence assigns the April 18 event to IV.

## Validation

`npm run check:content` passes locally in the prepared project and confirms 20 editions with 20 flyers. TypeScript/build validation should be rerun in the existing local development environment after extracting this project, because package installation was not available in the preparation environment.
