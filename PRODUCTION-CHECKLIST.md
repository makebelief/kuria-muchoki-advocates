# Production Launch Checklist

## Completed in code

- Responsive desktop/tablet/mobile layouts and touch targets
- Accessible navigation, skip link, focus states and reduced-motion support
- SEO titles, descriptions, canonical URLs, Open Graph/Twitter metadata and structured data
- XML sitemap and robots.txt
- Favicon, Apple touch icon and web manifest
- Security headers including CSP, HSTS, frame protection and permissions policy
- Static-asset caching
- Branded 403, 404, 500, 503 and 504 pages
- Privacy notice and website legal notice
- Secure Vercel enquiry endpoint with validation, honeypot protection and mailto fallback
- Health endpoint at `/api/health`
- `security.txt` security-contact file
- Clean URL redirects for legacy duplicate pages
- Automated syntax/link/metadata audit passed
- Local 100-concurrent-request load test: 2,000 requests, 0 failures

## Must be completed in Vercel/account settings before final public launch

- Set `RESEND_API_KEY`
- Set `CONTACT_FROM_EMAIL` to a verified sending address/domain
- Optionally set `CONTACT_TO_EMAIL`
- Submit a real form enquiry and confirm receipt/reply-to behavior
- Attach the final custom domain
- Replace the temporary `kuria-muchoki-advocates.vercel.app` canonical/structured-data/sitemap URLs with the final custom domain
- Add the final domain to Google Search Console and submit `/sitemap.xml`
- Verify/complete the Google Business Profile and ensure name/address/telephone match the site
- Review the final production deployment on at least one iPhone/Android device and a desktop browser

## Optional operational upgrades

- Enable Vercel Web Analytics / Speed Insights for real-user Core Web Vitals
- Configure Vercel WAF/rate-limit rules if enquiry spam becomes material
- Add uptime monitoring against `/api/health`
- Set spend/usage alerts in Vercel
