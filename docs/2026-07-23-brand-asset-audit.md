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

The scanner-safe checkpoint was fast-forwarded to Netlify’s connected `netlify-preview-migration` branch. Netlify published commit `eda936b` successfully in 44 seconds, with the prior `Exposed secrets detected` failure remaining only as historical evidence. The next step is direct public-domain visual verification.

Direct public-domain verification exposed a production-only dependency gap: the generic `/manus-storage/*` proxy returned an HTTP `502` because its Forge credential is not supplied to the Netlify function runtime. The approved public homepage photographs have therefore been copied into a dedicated public Supabase bucket. The project now exposes only two allowlisted `/site-assets/*` routes, which redirect to those public JPEG objects using the server-configured Supabase URL; no endpoint literal or credential is added to browser code.

The revised local route returns a `302` redirect for an approved filename, both public object URLs return `200 image/jpeg`, and responsive desktop/mobile screenshots show the two photographs fully loaded and correctly cropped. The automated suite passes with 21 tests across 12 files, and the Netlify build completes locally. The remaining work is limited to publishing and verifying this route correction on the custom domain.

Checkpoint `5b359c09` was fast-forwarded successfully to the Netlify-connected GitHub branch after confirming that it did not overwrite newer remote work. The Netlify deployment list still showed the earlier `eda936b` release after the initial webhook interval; no manual deploy setting, domain setting, or security control has been altered while awaiting the Git-triggered production build.

After a further webhook interval, the deployment list still had not registered the pushed branch head. Under the owner’s existing release approval, the standard Netlify **Deploy project** action was used to build the current `netlify-preview-migration@HEAD`. This action preserves the existing build configuration, branch, domain settings, and secret-scanning protections; it only asks Netlify to build the already pushed production branch.

Netlify completed initialization, build, deployment, cleanup, and post-processing for that production build. Its final log reported **“Site is live”**; the custom domain can now be checked against the new allowlisted image route.

The released homepage now renders the exact blue-and-green GitHub emblem in the public header without a broken-image placeholder. The visible hero media panel no longer shows the former broken-image icon, but the expected clinician imagery is still not visibly distinguishable through the dark hero treatment. A direct live image-route and CSS-layer check is required before marking the public visual validation complete.

The direct live check established that both `/site-assets/*` requests returned the 1,002-byte SPA HTML shell (`200 text/html`) rather than JPEG content. The allowlisted Express handler itself was correct, but Netlify had no matching function rewrite before its `/* -> /index.html` fallback. A dedicated `/site-assets/:key -> /.netlify/functions/api/site-assets/:key` rule has now been inserted before that fallback; the next release will test this exact production path.

The routing correction passes the automated suite and local Netlify build. It preserves the narrow allowlist in the server handler, does not change private-storage behavior, and routes only the two approved public image keys through the existing serverless function.
