# Raveoween 2nd Anniversary — Stage 1

Static vanilla HTML/CSS/JS landing page for the Raveoween 2nd Anniversary.

## Deployment
- Production branch: `main` → `https://raveoween.com`
- Staging branch: `staging` → `https://staging--raveoween.netlify.app`
- Local development: `http://localhost:5500`

## Current updates
- Uses the supplied original Raveoween logo in the fixed top-left bar.
- Loader copy now reads “Welcome to the deep end” throughout the sequence.
- Removed the spider artwork.
- Entering Raveoween now lands on the Halloween video instead of skipping it.
- Halloween video uses `object-fit: contain` so the full portrait video remains visible.
- Added a clear scroll cue through the experience.
- Added the requested Raveoween Instagram bio copy to the Alter Egos section.
- Removed the repeated ticket CTA from the house-rules panel and made “Get your ticket” link directly to EventCove.
- Added the carpool CTA as the next major action.
- Added Del Noi to the Artists / DJs section using the supplied artwork.
- Added a no-name/no-email feedback form to the archive section using Netlify Forms.
- Added a supplied-style wolf howl as a local audio asset.

## Feedback form
The feedback form uses Netlify Forms. Enable **Forms → Form detection** in Netlify, then deploy the branch. Submissions appear in the site's Forms area.

## Latest staging corrections
- Halloween teaser uses the video artwork as the single source for the anniversary/date message to avoid duplicated text.
- Experience section has a stronger persistent scroll cue.
- Ticket flow is: Before you enter → house rules warning → Get your tickets → Need a ride? Join the carpool.
- Replaced the previous wolf audio asset with a cleaner howl sound.


Audio source note: the wolf howl uses the public-domain Wolf Howl Sound from Orange Free Sounds (https://www.orangefreesounds.com/wolf-howl-sound/). The page states the sound may be used commercially without prior permission.


## Link preview / icon
- Browser favicon and social preview use the Raveoween logo in `assets/img/logo.png`.
- The larger `assets/img/raveoween-preview.png` is used for WhatsApp/X/other link previews.
- Preview services may cache an older image; re-sharing after the new deployment may be required.
