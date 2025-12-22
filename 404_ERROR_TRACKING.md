# 404 Error Tracking Guide

## Overview

Your website now has comprehensive 404 error tracking set up through multiple channels. This will help you identify broken links, missing pages, and user navigation issues.

---

## 🎯 Tracking Methods

### 1. **Cloudflare Analytics** (Built-in, Free)

Cloudflare Pages automatically tracks all HTTP status codes including 404s.

**How to Access:**
1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **Pages** → Your project (active-away-astro)
3. Click **Analytics** tab
4. View **Status Codes** section

**What You'll See:**
- Total 404 errors
- Time-based graphs
- Geographic distribution
- Device types (mobile/desktop)

**Pros:**
- ✅ Automatic (no setup required)
- ✅ Real-time data
- ✅ No performance impact
- ✅ Free

**Cons:**
- ❌ Doesn't show which specific URLs caused 404s
- ❌ Limited filtering options

---

### 2. **Google Analytics 4** (Custom Events)

Your 404 page now sends custom events to Google Analytics.

**Events Sent:**
1. **Exception Event** - Standard GA4 exception tracking
   - `description`: "404 Error: /the-missing-page"
   - `fatal`: false
   - `page_path`: The requested URL
   - `page_referrer`: Where the user came from

2. **Custom Event** - "page_not_found"
   - `page_path`: The requested URL
   - `referrer`: Where the user came from

**How to View in GA4:**
1. Go to [Google Analytics](https://analytics.google.com)
2. Navigate to **Reports** → **Engagement** → **Events**
3. Look for events named:
   - `page_not_found`
   - `exception`

**Create a Custom Report:**
1. Go to **Explore** → **Blank**
2. Add dimensions: `event_name`, `page_path`, `page_referrer`
3. Filter: `event_name` = "page_not_found"
4. Save as "404 Errors Report"

**Pros:**
- ✅ Shows exact URLs that 404'd
- ✅ Shows referrer (where users came from)
- ✅ Can segment by device, location, etc.
- ✅ Can create alerts

**Cons:**
- ❌ Requires Google Analytics to be installed
- ❌ Subject to ad blockers (some data loss)

---

### 3. **Google Tag Manager** (DataLayer Events)

If you're using GTM, 404 events are pushed to the dataLayer.

**DataLayer Event:**
```javascript
{
  event: '404_error',
  page_path: '/missing-page',
  referrer: 'https://example.com',
  error_type: 'page_not_found'
}
```

**How to Use:**
1. Create a **Custom Event Trigger** in GTM
   - Event name: `404_error`
   
2. Create a **Tag** to send to GA4:
   - Tag type: GA4 Event
   - Event name: `page_not_found`
   - Event parameters: `{{page_path}}`, `{{referrer}}`

3. Or send to a webhook/logging service

**Pros:**
- ✅ Flexible (can send to multiple destinations)
- ✅ Can add custom logic
- ✅ Can trigger remarketing tags

---

### 4. **Browser Console Logging** (Development)

For debugging, 404s are logged to the browser console:

```javascript
🚫 404 Error: {
  path: '/missing-page',
  referrer: 'https://activeaway.com/',
  timestamp: '2025-12-02T14:30:00.000Z'
}
```

**How to View:**
1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Look for 🚫 emoji

**Pros:**
- ✅ Real-time debugging
- ✅ See exact timestamp

**Cons:**
- ❌ Only visible to you, not tracked centrally
- ❌ Should be removed in production (optional)

**To Remove Console Logging:**
Edit `src/pages/404.astro` and remove or comment out:
```javascript
console.log('🚫 404 Error:', {...});
```

---

## 📊 Recommended Setup

### **For Most Users (Easiest)**
1. Use **Cloudflare Analytics** for overview
2. Use **Google Analytics 4** for detailed tracking

### **For Power Users**
1. **Cloudflare Analytics** - Overall metrics
2. **Google Analytics 4** - User journey & referrers
3. **Google Tag Manager** - Custom workflows
4. Optional: Send to **Sentry** or **LogRocket** for error monitoring

---

## 🔔 Setting Up Alerts

### **Google Analytics 4 Alerts**

1. Go to **Admin** → **Data display** → **Custom alerts**
2. Click **Create custom alert**
3. Configure:
   - **Alert name:** High 404 Errors
   - **Alert type:** Custom
   - **Conditions:** Event count > 10 (last hour)
   - **Filters:** event_name = "page_not_found"
   - **Emails:** Your email

**Benefit:** Get notified when there's a sudden spike in 404 errors (e.g., broken link on a popular page)

---

## 📈 What to Look For

### **Common Patterns:**

1. **Old Blog Posts**
   - URLs that existed on old site but not new one
   - **Fix:** Set up redirects in Strapi

2. **Typos in Links**
   - `/tennnis-holiday` instead of `/tennis-holiday`
   - **Fix:** Find and fix the source link

3. **Deleted Content**
   - Products/events removed from Strapi
   - **Fix:** 301 redirect to similar page

4. **External Links**
   - Other sites linking to wrong URLs
   - **Fix:** Contact them or create redirect

5. **Social Media Posts**
   - Old URLs shared on social media
   - **Fix:** Update bios/pinned posts with current links

---

## 🛠️ How to Fix 404 Errors

### **Method 1: Strapi Redirects**

You have a redirect system in your middleware. Add redirects in Strapi:

1. Go to Strapi → **Redirects** (if you have this content type)
2. Add redirect:
   - **Source Path:** `/old-page`
   - **Destination Path:** `/new-page`
   - **Status Code:** 301 (permanent) or 302 (temporary)

### **Method 2: Cloudflare Page Rules**

For high-traffic redirects:

1. Go to Cloudflare Dashboard → **Rules** → **Page Rules**
2. Create rule:
   - URL: `activeaway.com/old-page`
   - Setting: Forwarding URL (301)
   - Destination: `https://activeaway.com/new-page`

---

## 📋 Monthly 404 Audit Checklist

- [ ] Review top 10 most common 404 URLs
- [ ] Check if any are fixable with redirects
- [ ] Look for patterns (typos, old structure)
- [ ] Check referrers - are external sites linking incorrectly?
- [ ] Fix broken internal links
- [ ] Update sitemaps if URLs changed
- [ ] Test fixes in incognito mode

---

## 🎯 Advanced: Custom 404 Logging Service

If you need centralized logging, you can send 404s to a webhook:

### **Option A: Send to Slack**

Add to `src/pages/404.astro`:
```javascript
// Send to Slack webhook
fetch('https://hooks.slack.com/services/YOUR/WEBHOOK/URL', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: `🚫 404 Error: ${requestedPath} (from ${referrer})`
  })
});
```

### **Option B: Send to Google Sheets**

Use a Make.com or Zapier webhook to log to a spreadsheet.

### **Option C: Send to Database**

Create API endpoint to log to PostgreSQL:
```javascript
fetch('/api/log-404', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    path: requestedPath,
    referrer: referrer,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString()
  })
});
```

---

## 🚨 Important Notes

1. **Privacy:** 404 tracking doesn't collect personal data, but referrers may contain sensitive info. Ensure compliance with GDPR/privacy policies.

2. **Ad Blockers:** Google Analytics tracking may be blocked by ~25-40% of users. Cloudflare Analytics is more reliable as it's server-side.

3. **Bot Traffic:** Some 404s are from bots scanning for vulnerabilities. Filter these out in your analysis.

4. **False Positives:** `/favicon.ico`, `/robots.txt`, etc. returning 404 is sometimes normal if you don't have those files.

---

## 📊 Sample GA4 Custom Report

Create this in GA4 Explore:

**Dimensions:**
- Event name
- Page path
- Page referrer
- Country
- Device category

**Metrics:**
- Event count
- Users
- Sessions

**Filters:**
- Event name = "page_not_found"
- Date range = Last 30 days

**Sort by:** Event count (descending)

This shows you the most common 404 errors and where users are coming from.

---

## ✅ Verification Checklist

After deployment, verify tracking works:

- [ ] Visit a non-existent page (e.g., `/test-404-page`)
- [ ] Check browser console for 🚫 log
- [ ] Check Cloudflare Analytics (may take a few minutes)
- [ ] Check Google Analytics Real-Time events
- [ ] Check GTM Preview mode (if using GTM)
- [ ] Verify 404 page displays correctly
- [ ] Test on mobile and desktop

---

## 📖 Related Resources

- [Cloudflare Analytics Docs](https://developers.cloudflare.com/analytics/)
- [GA4 Custom Events](https://developers.google.com/analytics/devguides/collection/ga4/events)
- [Google Tag Manager DataLayer](https://developers.google.com/tag-manager/devguide)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404)

---

## Summary

✅ **Tracking is now active!**
- Cloudflare Analytics tracks all 404s automatically
- Google Analytics receives custom events with URL details
- GTM dataLayer events available for custom workflows
- Console logging for development debugging

**Next Steps:**
1. Deploy to production
2. Test a 404 page
3. Set up GA4 custom report (see above)
4. Create alerts for spike detection
5. Review monthly and fix common issues

Your 404 tracking is production-ready! 🎉













