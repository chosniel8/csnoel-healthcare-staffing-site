# CSNoel Social-Preview Configuration

The public homepage now has a branded 1,200 × 630 PNG social-sharing card based on the exact CSNoel emblem and the approved clinician-corridor photograph. The card uses the production visual language: navy foundation, blue/green brand accents, the `CSNoel` wordmark, and the homepage message, “Care moves fast. So should your next move.”

The image is stored in the existing public `public-site-assets` bucket and is exposed through the narrowly allowlisted `/site-assets/csnoel-social-share-card.png` route. The public object returns `200 image/png`.

`client/index.html` now provides a production canonical URL, descriptive meta tag, complete Open Graph metadata, image dimensions and alt text, and a `summary_large_image` X card that reference the same HTTPS social-card URL. The new metadata test, public-asset allowlist test, full automated suite, and production build pass locally.

> The final live-domain verification will confirm the deployed HTML exposes the metadata and that the public custom-domain social-card route redirects to the verified image.
