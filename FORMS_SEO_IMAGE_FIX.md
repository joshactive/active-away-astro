# Forms SEO Image Fix - Complete

## Issue
The SEO images (meta/og tags) were not being displayed on forms single pages (e.g., `/forms/clinic-feedback/`) because the `populate=*` parameter in the API call doesn't properly populate nested image data.

## Solution
Implemented a separate API call to fetch SEO data with metaImage, following the same pattern used in pickleball holiday single pages.

## Changes Made

### 1. New Function in `src/utils/strapi.js`
Added `getFormSEO(slug)` function that:
- Makes a separate API call with `populate=seo.metaImage`
- Properly extracts the metaImage data using `getStrapiImageData()`
- Returns structured SEO data including metaImage URL and alt text
- Logs success/failure for debugging

```javascript
export async function getFormSEO(slug) {
  // Fetches SEO data with metaImage for a specific form
  // Returns: { metaTitle, metaDescription, metaImage, metaImageAlt, keywords, canonicalURL }
}
```

### 2. Updated Forms Single Page `src/pages/forms/[slug].astro`

#### Imported the new function:
```javascript
import { getForms, getFormBySlug, getFormSEO } from '../../utils/strapi.js';
```

#### Added separate API call after fetching form data:
```javascript
// SEPARATE API CALL: Fetch SEO data with metaImage
try {
  const seoData = await getFormSEO(slug);
  if (seoData) {
    formData.seo = seoData;
    console.log(`📄 [${slug}] SEO data merged: ${seoData.metaTitle || 'No title'}, metaImage: ${seoData.metaImage ? 'Yes' : 'No'}`);
  }
} catch (error) {
  console.error(`[${slug}] Error fetching SEO data:`, error.message);
}
```

## How It Works

1. **First API Call**: `getFormBySlug()` fetches all form data with `populate=*`
2. **Second API Call**: `getFormSEO()` specifically fetches SEO data with `populate=seo.metaImage`
3. **Merge**: SEO data (including metaImage) is merged into `formData.seo`
4. **Pass to Layout**: The BaseLayout component receives the complete SEO data including the image

## Pattern Reference
This implementation follows the same pattern used in:
- `src/pages/pickleball-holiday/[slug].astro` (lines 61-70)
- `src/utils/strapi.js` - `getPickleballHolidaySEO()` (lines 4232-4274)

## Testing
To verify the fix works:

1. Build the site: `npm run build`
2. Start dev server: `npm run dev`
3. Visit a form page: `http://localhost:4321/forms/clinic-feedback/`
4. Check the page source for meta tags:
   ```html
   <meta property="og:image" content="..." />
   <meta name="twitter:image" content="..." />
   ```
5. Console logs should show:
   ```
   📄 SEO data fetched for form clinic-feedback: { hasMetaImage: true, metaTitle: '...' }
   📄 [clinic-feedback] SEO data merged: ..., metaImage: Yes
   ```

## Notes
- The separate API call is necessary because Strapi's `populate=*` doesn't deeply populate nested image relationships
- Using `populate=seo.metaImage` ensures the image data is properly included
- This fix applies to all form single pages automatically
- No changes needed in Strapi CMS - SEO images work as configured

