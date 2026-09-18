# Kuria Muchoki & Co. Advocates

Production-oriented static HTML/CSS/JavaScript website for Kuria Muchoki & Co. Advocates, with a small Vercel Function for secure enquiry delivery.

## Local preview

The static pages do not require npm:

```bash
python3 serve.py
```

Open `http://localhost:8001`.

> The `/api/contact` Vercel Function does not run in the local Python preview server. In local static preview the form automatically falls back to the visitor's email application if API delivery is unavailable.

## Production form setup

The enquiry form posts to `/api/contact`. The function uses Resend's HTTPS API and falls back to `mailto:` in the browser if server delivery is unavailable.

Set these Vercel Environment Variables before launch:

- `RESEND_API_KEY` — Resend API key
- `CONTACT_FROM_EMAIL` — verified sender, e.g. `Kuria Muchoki Website <enquiries@yourdomain.co.ke>`
- `CONTACT_TO_EMAIL` — destination inbox. If omitted, the current practice Gmail address is used.

A verified sending domain is strongly recommended for reliable delivery.

## Production structure

- `index.html` — homepage
- `about.html` — firm overview
- `services.html` — practice areas
- `team.html` — professional information
- `why-us.html` — service approach
- `insights.html` — legal guides
- `contact.html` — contact details and secure enquiry form
- `privacy.html` — privacy notice
- `legal-notice.html` — website disclaimer and engagement notice
- `403.html`, `404.html`, `500.html`, `503.html`, `504.html` — branded error pages
- `api/contact.mjs` — secure enquiry delivery endpoint
- `api/health.mjs` — lightweight uptime endpoint
- `.well-known/security.txt` — security contact information
- `assets/css/site.css` — consolidated responsive design system
- `assets/js/site.js` — navigation, accessibility, form delivery and contact rail
- `sitemap.xml`, `robots.txt` — crawl/indexing controls
- `site.webmanifest`, `favicon.ico`, `assets/icons/` — install/search/browser identity
- `vercel.json` — Vercel routes, function settings, caching and security headers

`practice-areas.html` and `managing-partner.html` remain only for compatibility and permanently redirect to `/services` and `/team` on Vercel.

## Before public launch

1. Attach the firm's final custom domain to Vercel.
2. Replace `kuria-muchoki-advocates.vercel.app` in canonical, sitemap, structured-data and `security.txt` URLs with the final custom domain.
3. Configure the three form environment variables above and submit a real test enquiry.
4. Add the final domain to Google Search Console and submit `/sitemap.xml`.
5. Create/verify the firm's Google Business Profile and keep name, address and telephone consistent with the website.
6. Test the final deployment on mobile, desktop, WhatsApp, telephone, contact form, map and all navigation links.
