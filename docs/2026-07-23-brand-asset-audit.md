# CSNoel Brand Asset Audit

## Initial visual findings

- The current migration header renders a **CSS-drawn navy rounded-square plus sign** beside a text-only CSNoel wordmark. It is not an image asset and does not match the emblem visible on the legacy public site.
- The legacy Netlify site displays a distinct **blue and green cross-style emblem** next to the `CSNoel` wordmark. That legacy treatment is the reference to preserve for the current site and browser icon.
- The current homepage image URLs point to two managed `/manus-storage/` clinician photographs. The next audit step is to verify their request status and desktop/mobile placement, then replace the CSS-drawn mark with a consistent reusable logo asset.

## Authoritative GitHub HTML reference

The original repository is `chosniel8/csnoel-healthcare-staffing-site`. Its header contains an inline 80-by-80 SVG emblem rather than a separate image file or a pre-existing favicon declaration. The required visual structure is a sky-blue medical cross made from rounded vertical and horizontal rectangles; semi-transparent navy overlays provide the inner shading; a green circle appears at coordinate `(58, 18)` with a 7-pixel radius; and a green curved stroke runs from the lower-left to the lower-right. The original brand colors are navy `#0A3A6E`, sky `#2E8FD8`, and green `#3AAA35`.

The current public header must use this exact emblem geometry and color treatment alongside the original `CS<span>Noel</span>` wordmark treatment. The browser icon should reuse the emblem only, preserving the same SVG geometry without the wordmark.

## Replacement image selection

The existing production `/manus-storage/` photo URLs return the HTML application shell rather than image content, so both homepage photographs are currently broken on the Netlify deployment. The selected replacements are a high-resolution Pexels corridor photograph of three clinicians and a high-resolution Pexels portrait of a clinician wearing a stethoscope. The corridor image supports the existing wide hero crop, and the portrait supports the existing tall dark-section crop with its clinician centered below the top third.

## Implementation and verification

The public header and footer now use the exact emblem geometry and blue/green palette from the original GitHub HTML, with the corresponding `CSNoel` wordmark treatment. The generic cross substitute has been removed. The site head now includes an SVG favicon made from the exact same emblem, so browser tabs and saved-site icons align with the public logo.

The durable public asset route now serves only the two approved homepage photographs through short-lived storage redirects rather than allowing the SPA fallback to return HTML in an image request. Automated tests and a Netlify build pass. Direct local requests resolve the hero photo to `image/jpeg`, while desktop and 390-pixel mobile visual checks confirm that the logo, hero photo, portrait, and content hierarchy are visible and correctly cropped.

## Netlify release mapping

Netlify project `csnoel-healthcare-migration-preview` (project ID `4af68c7e-90e9-488a-9e6a-71ca4567cbe7`) is connected to `github.com/chosniel8/csnoel-healthcare-staffing-site`. Its active production branch is `netlify-preview-migration`, and its current published source is `fbbad1c`. The WebDev checkpoint containing the visual correction is `2d183915`; the live release must therefore synchronize these reviewed changes to the connected GitHub production branch and then be checked at the custom domain.

With the owner’s confirmation, checkpoint `2d183915` was fast-forwarded to the connected GitHub production branch. Netlify detected the new commit and began an automatically published production build for `netlify-preview-migration@2d18391`. No manual redeploy or domain/DNS configuration change was used.

The first release build compiled the Vite frontend but failed before publishing with Netlify’s `Exposed secrets detected` indicator and a build-script exit code of `2`. The prior production deployment (`fbbad1c`) remains live while the precise detection/build error is isolated; no public rollback was required.

The build log confirms that failure occurred after the frontend bundle was generated and while Netlify validated deployment configuration, including the `/manus-storage/*` function redirect. The final log only reports a user-error exit code, so the specific secret-scanner finding must be traced from repository contents rather than inferred from the final line.

Netlify identified the exact occurrence as the browser-safe Supabase endpoint copied into `docs/netlify-preview-progress.md`. Although the endpoint is not a credential, the configured `VITE_CSNOEL_SUPABASE_URL` value is classified as a secret by the project’s scanner. The literal has been removed from documentation; the secure Netlify variable remains configured, and no scanner suppression, exception, or security-setting reduction is needed.

The repository no longer contains the configured endpoint literal, and the follow-up local Netlify build and automated suite succeeded (`19` tests across `11` files). The corrective release is ready to be synchronized to the already approved GitHub production branch.
