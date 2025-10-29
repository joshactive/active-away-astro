# SEO System - Complete Guide

Comprehensive SEO management system that works across all pages, fully integrated with Strapi CMS.

## ✅ What's Been Implemented

### Enhanced BaseLayout
All pages now render comprehensive SEO meta tags:

- ✅ **Primary Meta Tags** - title, description, keywords, robots
- ✅ **Open Graph** - Facebook, LinkedIn sharing (og:title, og:description, og:image, og:url, og:type)
- ✅ **Twitter Cards** - Twitter sharing with large image cards
- ✅ **Canonical URLs** - Prevent duplicate content
- ✅ **Structured Data** - JSON-LD for rich snippets (schema.org)

### Pages Using Strapi SEO
- ✅ **Homepage** (`/`) - Pulls from Home single type
- ✅ **Venues** (`/venues`) - Pulls from Venues Page single type  
- ✅ **Pre-Orders** (`/pre-orders`) - Pulls from Pre-Orders Page single type

## 📋 SEO Fields Available

### In Strapi (for each page single type)

| Field | Type | Purpose |
|-------|------|---------|
| `metaTitle` | Text | Page title for search engines (max 60 chars) |
| `metaDescription` | Long Text | Page description for search engines (max 160 chars) |
| `metaImage` | Media | Default image for social sharing |
| `keywords` | Text | SEO keywords (comma-separated) |
| `metaRobots` | Text | Indexing instructions (e.g., "index, follow") |
| `canonicalURL` | Text | Canonical URL for this page |
| `ogTitle` | Text | Open Graph title (Facebook, LinkedIn) |
| `ogDescription` | Long Text | Open Graph description |
| `ogImage` | Media | Open Graph image (1200x630px recommended) |
| `ogUrl` | Text | Open Graph URL |
| `ogType` | Text | Open Graph type (default: "website") |
| `structuredData` | JSON | Schema.org structured data |

## 🎯 How It Works

### 1. Data Flows from Strapi

Each page fetches its SEO data from its corresponding Strapi single type:

```javascript
// Homepage example
const homeData = await getHomeData();
// homeData.seo contains all SEO fields
```

### 2. BaseLayout Renders SEO

```astro
<BaseLayout
  title={pageContent?.seo?.metaTitle || 'Default Title'}
  description={pageContent?.seo?.metaDescription || 'Default description'}
  metaImage={pageContent?.seo?.metaImage?.url}
  keywords={pageContent?.seo?.keywords}
  ogTitle={pageContent?.seo?.ogTitle}
  ogImage={pageContent?.seo?.ogImage?.url}
  canonicalURL={pageContent?.seo?.canonicalURL}
  structuredData={pageContent?.seo?.structuredData}
  // ... all other SEO fields
>
```

### 3. Fallback Values

Every field has a sensible fallback if Strapi data is unavailable:

```javascript
const finalTitle = metaTitle || title; // Uses metaTitle, falls back to title
```

## 🚀 How to Add SEO to Any Page

### Step 1: Ensure Page Has Strapi Single Type

The page needs a Strapi single type with SEO fields. Already set up:
- ✅ Home
- ✅ Venues Page
- ✅ Pre-Orders Page

### Step 2: Fetch SEO Data

```javascript
// In your-page.astro
import { getYourPageData } from '../utils/strapi.js';

const pageData = await getYourPageData();
```

### Step 3: Pass SEO to BaseLayout

```astro
<BaseLayout
  title={pageData?.seo?.metaTitle || 'Default Title'}
  description={pageData?.seo?.metaDescription || 'Default description'}
  metaTitle={pageData?.seo?.metaTitle}
  metaDescription={pageData?.seo?.metaDescription}
  metaImage={pageData?.seo?.metaImage?.url}
  keywords={pageData?.seo?.keywords}
  metaRobots={pageData?.seo?.metaRobots}
  canonicalURL={pageData?.seo?.canonicalURL || 'https://activeaway.com/your-page'}
  ogTitle={pageData?.seo?.ogTitle}
  ogDescription={pageData?.seo?.ogDescription}
  ogImage={pageData?.seo?.ogImage?.url}
  ogUrl={pageData?.seo?.ogUrl || 'https://activeaway.com/your-page'}
  ogType={pageData?.seo?.ogType}
  structuredData={pageData?.seo?.structuredData}
>
  <!-- Your page content -->
</BaseLayout>
```

## 📝 Managing SEO in Strapi

### For Homepage
1. Content Manager → **Home**
2. Scroll to SEO section
3. Fill in fields (see screenshot you provided)
4. Save → Publish

### For Venues Page
1. Content Manager → **Venues Page**
2. Add SEO fields (will be added when you set up the single type)
3. Save → Publish

### For Pre-Orders Page
1. Run import script first: `node import-pre-orders-page.js`
2. Content Manager → **Pre-Orders Page**
3. Fill in SEO fields
4. Save → Publish

## 🎨 Best Practices

### Meta Title
- **Length:** 50-60 characters
- **Format:** "Page Title - Brand Name"
- **Example:** "Tennis Holidays | Active Away"

### Meta Description
- **Length:** 150-160 characters
- **Include:** Key benefits, call-to-action
- **Example:** "Discover exceptional tennis holidays across Europe. Expert coaching, premium venues, unforgettable experiences. Book your tennis holiday today."

### Keywords
- **Format:** Comma-separated
- **Example:** "tennis holidays, tennis camps, tennis tours, padel holidays"
- **Note:** Less important for modern SEO, but still useful

### Open Graph Image
- **Size:** 1200 x 630 pixels
- **Format:** JPEG or PNG
- **File Size:** < 1MB
- **Content:** Clear, readable text/logo, high contrast

### Structured Data
Example for Organization schema:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Active Away",
  "url": "https://activeaway.com",
  "logo": "https://activeaway.com/logo.png",
  "description": "Exceptional Tennis, Padel & Pickleball Experiences",
  "sameAs": [
    "https://facebook.com/activeaway",
    "https://instagram.com/activeaway"
  ]
}
```

## 🔍 Testing Your SEO

### 1. Check HTML Source
View page source (Ctrl+U) and look for:
```html
<title>Your Page Title</title>
<meta name="description" content="...">
<meta property="og:title" content="...">
<meta property="og:image" content="...">
```

### 2. Use Testing Tools
- **Facebook:** https://developers.facebook.com/tools/debug/
- **Twitter:** https://cards-dev.twitter.com/validator
- **Google:** https://search.google.com/test/rich-results
- **LinkedIn:** https://www.linkedin.com/post-inspector/

### 3. Test Structured Data
- Google Rich Results Test
- Schema.org Validator

## ✨ Features

### Automatic Fallbacks
If Strapi field is empty, uses sensible defaults:
- metaTitle → falls back to title prop
- ogTitle → falls back to metaTitle
- ogImage → falls back to metaImage
- ogUrl → falls back to canonicalURL → current page URL

### Smart Image Handling
Images are processed through Cloudflare for optimization:
- Automatic format conversion (WebP)
- Responsive sizing
- CDN delivery

### URL Normalization
Canonical URLs and OG URLs are set to prevent duplicate content issues.

## 📊 SEO Checklist

For each page, ensure:
- [ ] metaTitle is unique and descriptive (50-60 chars)
- [ ] metaDescription is compelling (150-160 chars)
- [ ] ogImage is uploaded (1200x630px)
- [ ] canonicalURL is set correctly
- [ ] structuredData is valid JSON-LD
- [ ] keywords are relevant (optional but good to have)
- [ ] metaRobots is set appropriately ("index, follow")

## 🚨 Common Issues

### SEO not showing
- Check Strapi single type exists
- Verify content is published (not draft)
- Check public permissions are enabled
- Rebuild site: `npm run build`

### Images not appearing in social shares
- Verify image is uploaded to Strapi
- Check image size (min 1200x630px)
- Use full URL (not relative path)
- Clear social media cache (Facebook Debugger)

### Structured data errors
- Validate JSON at jsonlint.com
- Test with Google Rich Results
- Check all required fields present

## 🎯 Next Steps

Want to add SEO to more pages?

1. Create Strapi single type (if doesn't exist)
2. Add SEO fields using the schema from existing pages
3. Update the page's data fetching function in `strapi.js`
4. Pass SEO props to BaseLayout

That's it! The system is designed to be copy-paste friendly.

---

**System Status:** ✅ Production Ready  
**Last Updated:** October 29, 2025  
**Pages with SEO:** Homepage, Venues, Pre-Orders (more coming)

