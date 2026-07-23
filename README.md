# CSNoel Healthcare Staffing — Marketing Website

## What This Is

This repository is the source code backup for the public marketing website of **CSNoel Healthcare Staffing**, a healthcare staffing company connecting nursing homes, hospitals, and rehabilitation centers with nursing, physician, and allied health talent.

The site was originally designed and generated with the help of Claude (Anthropic), then deployed live and connected to the company's custom domain. This repository exists so the current code has a permanent, version-controlled home outside of the Netlify dashboard and Claude conversation history — making it easy for a future developer, or a future AI agent, to pick up the project and keep building.

## Live Site

- **Production URL:** https://csnoelhealthcarestaffing.com
- **Underlying Netlify URL:** https://admirable-haupia-a7193b.netlify.app
- **Netlify project name:** `admirable-haupia-a7193b`

Note: an older/earlier Netlify project (`bespoke-lollipop-8ecacb.netlify.app`) also exists on the same Netlify account and contains an outdated version of the site (old phone number, simpler layout). It is **not** connected to the custom domain and is not the source of truth — only `admirable-haupia-a7193b` is live.

## Tech Stack

- Plain static **HTML5** with all **CSS embedded in a single `<style>` block** in `index.html` (no build step, no framework, no JavaScript dependencies).
- Google Fonts (`Poppins` and `Open Sans`) loaded via a `<link>` tag.
- No backend, no database, no CMS — it is a single static page.
- Hosted on **Netlify** (originally deployed via Netlify Drop, i.e. a manual drag-and-drop deployment rather than a connected Git repo).

## Repository Contents

- `index.html` — the entire homepage: markup, styles, and content in one file. This is a byte-for-byte backup of what is currently live at the production URL.
- `README.md` — this file.

## Domain & DNS Configuration

The domain `csnoelhealthcarestaffing.com` is registered/managed through **Squarespace Domains** (account.squarespace.com), while email for the domain runs through **Google Workspace** (MX/SPF/DKIM records). The following DNS records point the domain at Netlify while leaving email untouched:

| Type  | Name | Value                                    | Purpose                          |
|-------|------|-------------------------------------------|-----------------------------------|
| A     | @    | 75.2.60.5                                 | Points apex domain to Netlify     |
| CNAME | www  | admirable-haupia-a7193b.netlify.app       | Points www subdomain to Netlify   |
| MX    | @    | smtp.google.com                           | Google Workspace email (unchanged)|
| TXT   | @    | SPF record                                | Google Workspace email (unchanged)|
| TXT   | google._domainkey | DKIM record                      | Google Workspace email (unchanged)|

Netlify auto-provisions an SSL certificate once DNS propagates (can take up to ~24 hours after the records were added).

## How To Update The Site

Because this was deployed via Netlify Drop (not a Git-connected site), the live Netlify deployment and this GitHub repository are **not automatically synced**. To update the live site today, a new build must be dragged and dropped into the Netlify dashboard for the `admirable-haupia-a7193b` project (Netlify UI → Deploys → drag folder/zip onto the deploy area).

**Recommended next step for whoever continues this project (human or AI agent):** connect this GitHub repository to the Netlify project directly (Netlify UI → Site configuration → Build & deploy → Link repository). Once linked, pushing changes to the `main` branch here will automatically redeploy the live site, removing the need for manual drag-and-drop deploys.

## Notes For Future Developers / Agentic AI

- Always treat **https://admirable-haupia-a7193b.netlify.app** (or the live production domain) as the current source of truth before editing — confirm the phone number in the footer/CTA reads **(469) 476-1237** to make sure you're looking at the current version and not an outdated cached copy.
- Do not modify the Google Workspace–related DNS records (MX, SPF, DKIM) in Squarespace; they are required for the company's email (info@csnoelhealthcarestaffing.com) to keep working.
- There is a second, older Netlify project on the same account (`bespoke-lollipop-8ecacb`) that is not in use — it can likely be deleted after confirming with the site owner, to avoid future confusion.
- Contact for the business: info@csnoelhealthcarestaffing.com / +1 (469) 476-1237.
