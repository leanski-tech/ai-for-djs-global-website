# AI For DJs Global Migration Notes

Read-only rescue copy captured from `https://aifordjsglobal.com/`.

## Safety Rules

- Do not delete, unpublish, or modify the current Replit app while this is being verified.
- Do not change DNS until Hermes confirms the Vercel preview works.
- Do not deploy from this package until the external dependencies below are confirmed.

## Captured

- 16 static HTML pages/routes.
- React/Vite JavaScript and CSS bundle under `assets/`.
- Root image assets under `images/`.
- Video assets under `videos/`.

## External Dependencies To Keep Alive

- Google Fonts: `fonts.googleapis.com`, `fonts.gstatic.com`
- Gumroad product link: `https://leanski.gumroad.com/l/ojfvqt`
- Bonfire merch link: `https://www.bonfire.com/ai-for-djs-crewneck-1`
- DJ Leanskee cross-link: `https://leanskee.com/`

## Verification Notes

- The live bundle references `/assets/Djiing_@_Motown_Mondays_SF_1779866091022-DRYnCaBV.jpeg`, but the public host returns an HTML fallback for that URL instead of an image. All other discovered root images and videos were fetched directly.
- `vercel.json` includes a fallback rewrite so client-side routes can resolve to `index.html`.
