# Pre-Production Checklist ✅

## Critical Issues Fixed

### ✅ **Build Error Fixed**
- **Issue:** Syntax error in `junior-tennis-camp/[slug].astro` - stray `<HolidayDetail` tag
- **Status:** **FIXED** ✅
- **Result:** Build now completes successfully

### ✅ **Site URL Updated**
- **Changed:** `astro.config.mjs` site URL
- **From:** `https://active-away-astro.pages.dev`
- **To:** `https://activeaway.com`
- **Status:** **UPDATED** ✅

### ✅ **Robots.txt Created**
- **File:** `public/robots.txt`
- **Includes:** All 16 sitemaps
- **Status:** **CREATED** ✅

### ✅ **Placeholder Data Removed**
- **Removed:** `src/data/reviews.json` (placeholder reviews with via.placeholder.com)
- **Note:** Real reviews now come from Google Reviews API and Strapi
- **Status:** **CLEANED UP** ✅

### ✅ **404 Error Tracking Added**
- **Added:** Analytics tracking to 404 page
- **Tracks:** Google Analytics, GTM dataLayer, Cloudflare Analytics
- **Captures:** Requested URL, referrer, timestamp
- **Documentation:** See `404_ERROR_TRACKING.md`
- **Status:** **IMPLEMENTED** ✅

### ✅ **WordPress PDF Migration Complete**
- **Migrated:** 880 PDFs from WordPress to Cloudflare R2
- **Total Size:** 604.65 MB
- **Worker:** Cloudflare Worker proxies requests to preserve URLs
- **SEO Impact:** Zero (URLs unchanged)
- **Documentation:** See `PDF_MIGRATION_COMPLETE.md`
- **Status:** **LIVE** ✅

---

## Environment Variables Required

Before deploying to production, ensure these are set in **Cloudflare Pages** dashboard:

### 🔴 **Critical (Required)**
```bash
STRAPI_URL=https://your-strapi-instance.com
STRAPI_API_TOKEN=your_strapi_token_here
```
**Why:** All content comes from Strapi. Without this, the site won't work.

### 🟡 **Important (Highly Recommended)**
```bash
GOOGLE_PLACES_API_KEY=your_google_api_key
GOOGLE_PLACE_ID=ChIJ6aLvHHgPdkgR1oHhIDyNQtU
DATABASE_URL=postgresql://user:pass@host:port/db?sslmode=require
```
**Why:** 
- Google Reviews for testimonials section
- Instagram integration requires database connection

### 🟢 **Optional (Nice to Have)**
```bash
NEWSLETTER_WEBHOOK_URL=your_webhook_url
TURNSTILE_SECRET_KEY=your_turnstile_secret
PUBLIC_TURNSTILE_SITE_KEY=your_turnstile_site_key
R2_UPLOAD_URL=your_r2_upload_url
UPLOAD_TOKEN=your_upload_token
R2_PUBLIC_BASE_URL=your_r2_base_url
```
**Why:** Forms, spam protection, file uploads

---

## Code Quality Checks

### ✅ **No Linter Errors**
- **Status:** All clean, no errors found

### ⚠️ **Console Logs Present**
- **Found:** 1,345 console.log statements across 99 files
- **Recommendation:** Most are debug logs for development
- **Action:** Consider removing debug logs before production (optional)
- **Files with most logs:**
  - `src/utils/strapi.js` (548 logs)
  - Product detail pages (20+ logs each)
  - Event pages (20+ logs)

### ✅ **No TODO/FIXME Comments**
- **Status:** Only "Debug:" comments found, no blocking TODOs

---

## Content & Data Checks

### ⚠️ **Placeholder Content to Review**

Some files may contain placeholder content. Review these:

1. **Product Images:**
   - Check all products have real images in Strapi
   - No broken image links

2. **Forms:**
   - All webhook URLs configured in Strapi
   - Test form submissions work

3. **Links:**
   - All internal links work
   - No broken external links

---

## Domain & DNS Setup

### 🔴 **Custom Domain Setup**

When ready to switch to `activeaway.com`:

1. **In Cloudflare Pages:**
   - Go to your project → Custom domains
   - Add `activeaway.com` and `www.activeaway.com`
   - Cloudflare will provide DNS records

2. **Update DNS:**
   - Point A record to Cloudflare Pages IP
   - Or use CNAME for subdomain

3. **SSL Certificate:**
   - Cloudflare Pages provides automatic SSL
   - Should be active within minutes

---

## Performance Optimization

### ✅ **Already Implemented**
- Cloudflare Images for optimization
- Responsive images with srcset
- Lazy loading images
- Minified CSS/JS (via Astro build)
- Cloudflare CDN distribution

### 📊 **To Test After Deploy**
- Google PageSpeed Insights score
- Core Web Vitals
- Mobile performance
- Time to First Byte (TTFB)

---

## Security Checks

### ✅ **Security Headers Configured**
- **File:** `public/_headers`
- **Includes:**
  - Strict-Transport-Security (HSTS)
  - Content-Security-Policy (CSP)
  - X-Content-Type-Options
  - X-Frame-Options
  - Referrer-Policy

### ✅ **Environment Variables**
- .env file in .gitignore ✅
- No secrets in code ✅
- All sensitive data uses env vars ✅

---

## SEO Checks

### ✅ **Implemented**
- Sitemap generation (16 sitemaps total)
- robots.txt created
- Meta tags on all pages
- Structured data (Product schema)
- OpenGraph tags
- Canonical URLs

### 📋 **To Verify After Deploy**
- Submit sitemaps to Google Search Console
- Submit sitemaps to Bing Webmaster Tools
- Verify robots.txt accessible at `/robots.txt`
- Check sitemap accessible at `/sitemap.xml`

---

## Analytics & Tracking

### ✅ **Already Integrated**
Based on Content Security Policy, you have:
- Google Analytics
- Google Tag Manager
- Facebook Pixel
- YouTube embeds allowed
- **404 Error Tracking** (NEW!)
  - Google Analytics custom events
  - GTM dataLayer events
  - Cloudflare Analytics (automatic)

### 📋 **To Verify**
- Analytics tracking codes are active
- Conversion tracking works
- Events fire correctly
- **404 tracking works** (visit a non-existent page and check GA4)

### 📊 **404 Error Monitoring**
See `404_ERROR_TRACKING.md` for complete guide on:
- Viewing 404 errors in Cloudflare Analytics
- Creating custom reports in Google Analytics 4
- Setting up alerts for 404 spikes
- Monthly audit checklist

---

## Forms Testing

### 🧪 **Test These Before Launch**

All forms have real-time validation implemented. Test:

1. **Newsletter Signup** (Footer)
   - Validates email format
   - Submit button disabled until filled
   - Success message appears
   - Webhook receives data

2. **Dynamic Forms** (All Strapi forms)
   - All required fields validated
   - Conditional fields show/hide
   - File uploads work (if enabled)
   - Turnstile spam protection works

3. **Pre-Order Forms**
   - Validates all fields
   - Selections save correctly

4. **WhatsApp Groups Password Form**
   - Password validation works
   - Redirects to correct page

---

## Browser Testing

### 🌐 **Test On:**
- ✅ Chrome (Desktop & Mobile)
- ✅ Safari (Desktop & Mobile)
- ✅ Firefox
- ✅ Edge
- ✅ Mobile devices (iOS & Android)

### 📱 **Responsive Breakpoints:**
- Mobile: < 640px
- Tablet: 640px - 1023px
- Desktop: 1024px+

---

## Third-Party Integrations

### 🔌 **Verify These Work:**
- Strapi CMS content loads
- Cloudflare Images serve correctly
- Google Reviews load
- Instagram posts display
- YouTube embeds work
- Checkfront bookings load (activeaway.checkfront.co.uk)

---

## Deployment Steps

### 1. **Final Code Review**
```bash
# Build locally one more time
npm run build

# Check build output
# Should see: ✓ Completed in XXXms
```

### 2. **Commit Changes**
```bash
git add .
git commit -m "Production ready: Fixed build error, updated site URL, added robots.txt"
git push origin main
```

### 3. **Deploy to Cloudflare Pages**
- Cloudflare will auto-deploy on push to main
- Or manually trigger deployment

### 4. **Set Environment Variables**
- Go to Cloudflare Pages → Settings → Environment Variables
- Add all required variables (see list above)
- **IMPORTANT:** Must redeploy after adding env vars

### 5. **Custom Domain Setup**
- Add `activeaway.com` in Cloudflare Pages
- Update DNS records as instructed
- Wait for SSL certificate (usually instant)

### 6. **Verify Deployment**
- Visit all critical pages
- Test forms
- Check images load
- Verify sitemaps accessible
- Submit sitemaps to Google

---

## Post-Launch Monitoring

### 📊 **First 24 Hours:**
- Monitor Cloudflare Analytics
- Check for 404 errors
- Verify form submissions
- Monitor server errors
- Check Google Analytics data

### 🔍 **First Week:**
- Google Search Console for indexing
- Core Web Vitals scores
- User feedback on forms/bookings
- Mobile performance

---

## Known Issues / Limitations

### 📝 **Console Logs**
- Many debug console.log statements still present
- Not critical, but can be cleaned up for production
- Helpful for debugging issues post-launch

### 🖼️ **Placeholder Images**
- Fallback placeholder images referenced in some product schemas
- Ensure all products in Strapi have real images

---

## Emergency Rollback Plan

If something goes wrong:

1. **Cloudflare Pages:**
   - Go to Deployments tab
   - Find last working deployment
   - Click "Rollback to this deployment"

2. **Git:**
   ```bash
   git log  # Find last working commit
   git revert <commit-hash>
   git push origin main
   ```

3. **DNS:**
   - If domain issues, can point back to old site immediately
   - DNS changes take 5-60 minutes to propagate

---

## Final Checklist

Before clicking "Deploy to Production":

- [ ] Build completes successfully locally
- [ ] All environment variables documented
- [ ] robots.txt includes all sitemaps
- [ ] Site URL updated to activeaway.com
- [ ] No critical console errors in browser
- [ ] Test forms work on staging
- [ ] Images load correctly
- [ ] Mobile responsive on all pages
- [ ] Security headers verified
- [ ] Analytics codes ready
- [ ] Backup plan in place
- [ ] Team notified of deployment time

---

## Summary

### 🎉 **You're Ready to Deploy!**

**Critical fixes applied:**
1. ✅ Build error fixed
2. ✅ Site URL updated to production domain
3. ✅ robots.txt created with all 16 sitemaps
4. ✅ Placeholder data removed
5. ✅ No linter errors
6. ✅ Build succeeds

**Next steps:**
1. Set environment variables in Cloudflare Pages
2. Push to main branch (auto-deploys)
3. Set up custom domain
4. Test everything on production
5. Submit sitemaps to Google

**Estimated deployment time:** 15-30 minutes  
**DNS propagation time:** 5-60 minutes  
**SSL activation time:** Instant to 5 minutes

Good luck with your launch! 🚀

