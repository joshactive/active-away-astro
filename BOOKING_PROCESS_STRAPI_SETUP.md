# Booking Process Page - Strapi Setup Guide

This guide explains how to set up the Strapi single type for the Booking Process page.

## Step 1: Create the Single Type in Strapi

1. **Go to Strapi Admin Panel**
   - Navigate to your Strapi admin (e.g., `http://localhost:1337/admin`)
   - Login with your admin credentials

2. **Create Single Type**
   - Click on "Content-Type Builder" in the left sidebar
   - Click "+ Create new single type"
   - Name: `booking-process-page`
   - Display Name: `Booking Process Page`
   - Description: `Single page for booking process information`
   - Click "Continue"

## Step 2: Add Component - Page Hero

First, check if you already have the `sections.page-hero` component. If not, create it:

1. **Create Component (if needed)**
   - In Content-Type Builder, click "Create new component"
   - Category: `sections`
   - Name: `page-hero`
   - Display Name: `Page Hero`

2. **Add fields to page-hero component:**
   - `kicker` - Text (Short text) - Optional
   - `heading` - Text (Short text) - Required
   - `subtitle` - Text (Long text) - Optional
   - `backgroundImage` - Media (Single) - Optional
   - `showBreadcrumbs` - Boolean - Default: true

## Step 3: Add Fields to Booking Process Page

Now add the following fields to the `booking-process-page` single type:

### 1. Page Hero Component

- **Field name:** `pageHero`
- **Type:** Component (Single)
- **Component:** `sections.page-hero`
- **Required:** No
- Click "Finish"

### 2. Intro Title

- **Field name:** `introTitle`
- **Type:** Text (Short text)
- **Default value:** `How to Book`
- **Required:** No
- Click "Finish"

### 3. Intro Subtitle

- **Field name:** `introSubtitle`
- **Type:** Text (Long text)
- **Default value:** `Everything you need to know about booking your holiday with Active Away`
- **Required:** No
- Click "Finish"

### 4. Video Guide Title

- **Field name:** `videoGuideTitle`
- **Type:** Text (Short text)
- **Default value:** `Video Guide`
- **Required:** No
- Click "Finish"

### 5. Video Guide URL

- **Field name:** `videoGuideUrl`
- **Type:** Text (Short text)
- **Required:** No
- **Description:** YouTube or Vimeo embed URL
- Click "Finish"

### 6. General Info Title

- **Field name:** `generalInfoTitle`
- **Type:** Text (Short text)
- **Default value:** `General Info`
- **Required:** No
- Click "Finish"

### 7. General Info Content

- **Field name:** `generalInfoContent`
- **Type:** Rich Text (Markdown)
- **Required:** No
- Click "Finish"

### 8. Accommodation Included Title

- **Field name:** `accommodationIncludedTitle`
- **Type:** Text (Short text)
- **Default value:** `Accommodation Included`
- **Required:** No
- Click "Finish"

### 9. Accommodation Included Content

- **Field name:** `accommodationIncludedContent`
- **Type:** Rich Text (Markdown)
- **Required:** No
- Click "Finish"

### 10. Accommodation Excluded Title

- **Field name:** `accommodationExcludedTitle`
- **Type:** Text (Short text)
- **Default value:** `Accommodation Excluded`
- **Required:** No
- Click "Finish"

### 11. Accommodation Excluded Content

- **Field name:** `accommodationExcludedContent`
- **Type:** Rich Text (Markdown)
- **Required:** No
- Click "Finish"

### 12. Making Changes Title

- **Field name:** `makingChangesTitle`
- **Type:** Text (Short text)
- **Default value:** `Making Changes`
- **Required:** No
- Click "Finish"

### 13. Making Changes Content

- **Field name:** `makingChangesContent`
- **Type:** Rich Text (Markdown)
- **Required:** No
- Click "Finish"

### 14. SEO Component

- **Field name:** `seo`
- **Type:** Component (Single)
- **Component:** `shared.seo` (if you have this shared component)
- **Required:** No
- Click "Finish"

## Step 4: Save and Restart Strapi

1. Click "Save" in the Content-Type Builder
2. Strapi will automatically restart

## Step 5: Set API Permissions

1. Go to **Settings** → **Users & Permissions** → **Roles** → **Public**
2. Scroll to **Booking-process-page**
3. Enable:
   - ✅ `find`
4. Click "Save"

## Step 6: Add Content

1. Go to **Content Manager**
2. Click on **Booking Process Page** (Single Type)
3. Fill in the content:

### Example Content:

**Page Hero:**
- Kicker: `BOOKING INFORMATION`
- Heading: `The Booking Process`
- Subtitle: `A complete guide to booking your tennis holiday with Active Away`
- Background Image: Upload a suitable hero image
- Show Breadcrumbs: ✅ true

**Intro Section:**
- Intro Title: `How to Book`
- Intro Subtitle: `Follow these simple steps to secure your perfect tennis holiday`

**Tab Content:**
- Video Guide URL: `https://www.youtube.com/embed/...` (your video URL)
- General Info Content: (Add your markdown content)
- Accommodation Included Content: (Add your markdown content)
- Accommodation Excluded Content: (Add your markdown content)
- Making Changes Content: (Add your markdown content)

**SEO:**
- Meta Title: `The Booking Process | Active Away`
- Meta Description: `Learn how to book your tennis holiday with Active Away. Find information about accommodation, payments, and making changes to your booking.`
- Canonical URL: `https://activeaway.com/booking-process`

4. Click "Save" and "Publish"

## Step 7: Test

Visit `http://localhost:4321/booking-process` (or your Astro dev URL) to see your page live!

---

## Troubleshooting

**Issue:** Page shows 404
- Check that the single type is published in Strapi
- Verify API permissions are set correctly
- Check Strapi logs for any errors

**Issue:** Images not showing
- Ensure images are uploaded in Strapi
- Check that `populate` parameters include image fields in the API call

**Issue:** Tabs not working
- Check browser console for JavaScript errors
- Ensure all tab content has been added in Strapi

