# ElevenHouse auth preview

Standalone Russian and English login and registration experience for ElevenHouse. The source includes the full passwordless phone/email flow, client-side validation, request/verification states, retry/resend handling, and accessible error feedback.

## Build

Requires Node.js 22. Run `npm ci` and `node scripts/build-auth.mjs`. The self-contained page is written to `artifacts/elevenhouse-auth.html`.

## GitHub Pages

Pushing to `main` builds that file and publishes it as the site root with GitHub Actions. The workflow's Pages artifact contains only the standalone HTML page. Enable Pages with GitHub Actions as the repository's deployment source if it is not selected automatically.

The preview has no authentication service connected. Requests use the endpoint contract in `src/auth/authApi.ts`; connect the intended backend and same-origin routing before using this page for real sign-in or account creation. It does not fake successful authentication or send a demo verification code.

The display font Vetrino is by Daniyar Shape: https://www.behance.net/gallery/143094015/VETRINO-FREE-FONT. Manrope is distributed under the SIL Open Font License; its license is included alongside the font files.
