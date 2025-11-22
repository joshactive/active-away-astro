# Search Results Page - Strapi Setup Guide

## Overview
This guide will help you create the `search-results-page` single type in Strapi with hero section and SEO fields.

---

## Step 1: Create Single Type

1. Go to **Content-Type Builder** in Strapi
2. Click **Create new single type**
3. Name: `search-results-page`
4. Display name: `Search Results Page`
5. Click **Continue**

---

## Step 2: Add Fields

### Page Hero (Component)

1. Click **Add another field**
2. Select **Component**
3. Name: `pageHero`
4. Display name: `Page Hero`
5. Select **Use an existing component**: `page.page-hero` (or create new if doesn't exist)
6. Type: **Single component**
7. **Required**: ✅ Yes
8. Click **Finish**

**If creating new `page.page-hero` component**, add these fields:
- `kicker` - Text (Short text) - e.g., "BOOKING"
- `heading` - Text (Short text) - Required - e.g., "Your Event Search"
- `subtitle` - Text (Long text) - e.g., "Please complete your booking below"
- `backgroundImage` - Media (Single image)
- `showBreadcrumbs` - Boolean - Default: true

### SEO (Component)

1. Click **Add another field**
2. Select **Component**
3. Name: `seo`
4. Display name: `SEO`
5. Select **Use an existing component**: `shared.seo`
6. Type: **Single component**
7. Click **Finish**

**If creating new `shared.seo` component**, add these fields:
- `metaTitle` - Text (Short text) - e.g., "Event Booking - Active Away"
- `metaDescription` - Text (Long text) - e.g., "Complete your event booking"
- `metaImage` - Media (Single image)
- `metaImageAlt` - Text (Short text)
- `keywords` - Text (Short text)
- `canonicalURL` - Text (Short text)

---

## Step 3: Save and Restart

1. Click **Save** (top right)
2. Restart Strapi server:
   ```bash
   cd /Users/joshuathompson/strapi/strapi
   npm run develop
   ```

---

## Step 4: Set Permissions

1. Go to **Settings** → **Users & Permissions Plugin** → **Roles**
2. Click **Public**
3. Scroll to **Search-results-page**
4. Enable:
   - ✅ `find`
5. Click **Save**

---

## Step 5: Add Content

1. Go to **Content Manager**
2. Click **Search Results Page** (Single Type)
3. Fill in the fields:

### Page Hero
- **Kicker**: `BOOKING`
- **Heading**: `Your Event Search`
- **Subtitle**: `Please complete your booking below`
- **Background Image**: Upload a tennis/sports image (optional)
- **Show Breadcrumbs**: ✅ true

### SEO
- **Meta Title**: `Event Booking - Active Away`
- **Meta Description**: `Complete your event booking with Active Away. Select your dates and secure your spot today.`
- **Keywords**: `tennis booking, event booking, active away booking`
- **Canonical URL**: `https://activeaway.com/search-results`

4. Click **Save** and **Publish**

---

## Step 6: Verify API Response

Test the API endpoint:
```
https://your-strapi-url.com/api/search-results-page?populate[pageHero][populate]=*&populate[seo][populate]=*
```

---

## Example Content

```json
{
  "pageHero": {
    "kicker": "BOOKING",
    "heading": "Your Event Search",
    "subtitle": "Please complete your booking below",
    "backgroundImage": {
      "url": "https://example.com/hero-image.jpg",
      "alternativeText": "Tennis event booking"
    },
    "showBreadcrumbs": true
  },
  "seo": {
    "metaTitle": "Event Booking - Active Away",
    "metaDescription": "Complete your event booking with Active Away. Select your dates and secure your spot today.",
    "keywords": "tennis booking, event booking, active away",
    "canonicalURL": "https://activeaway.com/search-results"
  }
}
```

---

## Notes

- The page uses SSR (Server-Side Rendering) so it dynamically processes URL parameters
- The hero and SEO content comes from Strapi but the booking widget uses URL parameters
- Set `robots: noindex, nofollow` in the page to prevent search engines from indexing booking URLs with parameters

