# Join The Team - Troubleshooting & Testing Guide

## 🔧 Recent Fix Applied

The Strapi populate query has been updated to use the correct pattern: `populate[component][populate]=*`

This ensures ALL nested fields are properly fetched, including:
- Images within components
- Nested repeatable components (like faqs inside faq component)
- All component fields

---

## ✅ Testing Steps

### 1. Restart your development server

```bash
cd /Users/joshuathompson/active-away-astro
npm run dev
```

### 2. Check the browser console

Navigate to: `http://localhost:4321/join-the-team`

Look for these console messages:
- ✅ `👥 [join-the-team] Page data fetched`
- ✅ `🔍 [getJoinTheTeamPage] Attributes keys: [...]` - This shows what fields were returned

### 3. Check Strapi API Permissions

Make sure the API endpoint is accessible:

1. Go to Strapi Admin: `http://localhost:1337/admin`
2. Navigate to **Settings** → **Users & Permissions** → **Roles** → **Public**
3. Scroll to **Join-the-team-page**
4. Enable: ✅ `find`
5. Click **Save**

### 4. Verify Strapi Content

In Strapi Admin:
1. Go to **Content Manager**
2. Click **Join The Team Page** (Single Types)
3. Make sure:
   - The entry is **Published** (not just saved as draft)
   - All sections have content
   - Images are uploaded

---

## 🐛 Debug: Test the API Directly

### Test in Browser

Open this URL in your browser:
```
http://localhost:1337/api/join-the-team-page?populate[pageHero][populate]=*&populate[quote][populate]=*&populate[twoColumnContent][populate][leftBlock][populate]=*&populate[twoColumnContent][populate][rightBlock][populate]=*&populate[ourValues][populate]=*&populate[learnAboutUs][populate]=*&populate[formSection][populate]=*&populate[faq][populate]=*&populate[seo][populate]=*
```

You should see JSON data with all your content.

### Test with cURL

```bash
curl "http://localhost:1337/api/join-the-team-page?populate[pageHero][populate]=*&populate[quote][populate]=*&populate[twoColumnContent][populate][leftBlock][populate]=*&populate[twoColumnContent][populate][rightBlock][populate]=*&populate[ourValues][populate]=*&populate[learnAboutUs][populate]=*&populate[formSection][populate]=*&populate[faq][populate]=*&populate[seo][populate]=*" | jq
```

---

## 🔍 Common Issues & Fixes

### Issue 1: Page shows nothing
**Cause**: API permissions not set  
**Fix**: Enable `find` permission for public role

### Issue 2: Images don't load
**Cause**: Images not populated in API call  
**Fix**: Already fixed with `populate=*` pattern

### Issue 3: FAQ section empty
**Cause**: Nested `faqs` not populated  
**Fix**: Already fixed - now uses `populate[faq][populate]=*`

### Issue 4: Form doesn't appear
**Cause**: `formJson` field empty or invalid JSON  
**Fix**: Check Strapi - formJson must be valid JSON array

### Issue 5: "No page data found" in console
**Cause**: Page not published in Strapi  
**Fix**: Open Strapi, edit page, click **Publish**

---

## 📋 Expected Console Output

When page loads successfully, you should see:

```
👥 [getJoinTheTeamPage] Fetching page data...
🔍 [getJoinTheTeamPage] Attributes keys: ["pageHero", "quote", "twoColumnContent", "ourValues", "valuesEyebrow", "valuesHeading", "learnAboutUs", "formSection", "faq", "seo", ...]
👥 [join-the-team] Page data fetched
📄 [join-the-team] SEO data fetched
```

---

## 🎯 What Changed

### Before:
```javascript
'/join-the-team-page?' +
'populate[twoColumnContent][populate]=*' +
// ... other fields
```
**Problem**: `populate=*` doesn't work for nested components (leftBlock/rightBlock)

### After:
```javascript
'/join-the-team-page?' +
'populate[twoColumnContent][populate][leftBlock][populate]=*&' +
'populate[twoColumnContent][populate][rightBlock][populate]=*&' +
// ... other fields
```
**Solution**: Explicitly populate each nested level to ensure images load

---

## 🚀 If Everything Works

You should now see:
1. ✅ Hero section with background image
2. ✅ Quote section (if filled in Strapi)
3. ✅ Two-column content with images
4. ✅ Our Values cards (repeatable)
5. ✅ Learn About Us CTA with image
6. ✅ Application form
7. ✅ FAQ accordion

---

## 📞 Still Having Issues?

If you still see no content after:
1. Restarting dev server
2. Checking API permissions
3. Verifying content is published

Check the browser console for the debug output from line:
```
console.log('🔍 [getJoinTheTeamPage] Attributes keys:', Object.keys(attributes));
```

This will show exactly what fields Strapi is returning.

---

**Last Updated**: November 21, 2025  
**Status**: Fixed - Ready for Testing ✅

