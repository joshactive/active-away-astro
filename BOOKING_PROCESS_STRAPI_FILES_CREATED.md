# Booking Process Page - Strapi Backend Setup Complete ✅

## Summary

The Strapi backend files for the booking-process-page single type have been successfully created.

---

## 📦 Files Created

All files have been created in the Strapi backend at:
`/Users/joshuathompson/strapi/strapi/src/api/booking-process-page/`

### 1. Schema File
**Path:** `content-types/booking-process-page/schema.json`

Defines the single type with the following fields:
- `pageHero` (Component - sections.page-hero)
  - kicker, heading, subtitle, backgroundImage, showBreadcrumbs
- `introTitle` (String, default: "How to Book")
- `introSubtitle` (Text)
- `videoGuideTitle` (String, default: "Video Guide")
- `videoGuideUrl` (String)
- `generalInfoTitle` (String, default: "General Info")
- `generalInfoContent` (Rich Text)
- `accommodationIncludedTitle` (String, default: "Accommodation Included")
- `accommodationIncludedContent` (Rich Text)
- `accommodationExcludedTitle` (String, default: "Accommodation Excluded")
- `accommodationExcludedContent` (Rich Text)
- `makingChangesTitle` (String, default: "Making Changes")
- `makingChangesContent` (Rich Text)
- `seo` (Component - shared.seo)

### 2. Controller File
**Path:** `controllers/booking-process-page.js`

Standard Strapi controller for the single type.

### 3. Service File
**Path:** `services/booking-process-page.js`

Standard Strapi service for the single type.

### 4. Routes File
**Path:** `routes/booking-process-page.js`

Standard Strapi router for the single type.

---

## 🚀 Next Steps

### 1. Restart Strapi

The new content type will be registered when Strapi restarts:

```bash
cd /Users/joshuathompson/strapi/strapi
npm run develop
```

### 2. Set API Permissions

After Strapi restarts:

1. Go to **Settings** → **Users & Permissions** → **Roles** → **Public**
2. Scroll down to find **Booking-process-page**
3. Enable the following permission:
   - ✅ `find`
4. Click **Save**

### 3. Add Content

1. Go to **Content Manager** in the Strapi admin
2. You'll see **Booking Process Page** in the Single Types section
3. Click on it to start adding content

### Example Content to Add:

**Page Hero:**
- Kicker: `BOOKING INFORMATION`
- Heading: `The Booking Process`
- Subtitle: `A complete guide to booking your tennis holiday with Active Away`
- Background Image: Upload a hero image
- Show Breadcrumbs: ✅ true

**Intro:**
- Intro Title: `How to Book` (default)
- Intro Subtitle: `Follow these simple steps to secure your perfect tennis holiday`

**Video Guide Tab:**
- Title: `Video Guide` (default)
- URL: Your YouTube embed URL (e.g., `https://www.youtube.com/embed/YOUR_VIDEO_ID`)

**General Info Tab:**
- Title: `General Info` (default)
- Content: Add markdown content explaining the general booking process

**Accommodation Included Tab:**
- Title: `Accommodation Included` (default)
- Content: Add markdown content about bookings that include accommodation

**Accommodation Excluded Tab:**
- Title: `Accommodation Excluded` (default)
- Content: Add markdown content about bookings without accommodation

**Making Changes Tab:**
- Title: `Making Changes` (default)
- Content: Add markdown content about how to modify bookings

**SEO:**
- Meta Title: `The Booking Process | Active Away`
- Meta Description: `Learn how to book your tennis holiday with Active Away. Find information about accommodation, payments, and making changes to your booking.`
- Canonical URL: `https://activeaway.com/booking-process`

### 4. Publish the Content

After adding content, click **Save** and then **Publish** to make it available to the frontend.

### 5. Test the Frontend

Visit the Astro page at:
`http://localhost:4321/booking-process` (or your Astro dev URL)

---

## ✅ Verification Checklist

After restarting Strapi, verify:
- [ ] Strapi starts without errors
- [ ] "Booking Process Page" appears in Content Manager under Single Types
- [ ] All fields are visible and editable
- [ ] API permissions are set (Public → Booking-process-page → find)
- [ ] Content can be saved and published
- [ ] API endpoint returns data: `http://localhost:1337/api/booking-process-page?populate=*`
- [ ] Frontend page displays correctly at `/booking-process`

---

## 🔧 Troubleshooting

**Issue: Strapi won't start**
- Check for syntax errors in the JSON schema
- Look at terminal output for error messages
- Ensure all required components exist (sections.page-hero, shared.seo)

**Issue: Content type doesn't appear**
- Make sure all 4 files were created
- Restart Strapi completely (stop and start again)
- Check file permissions

**Issue: Frontend shows no data**
- Verify API permissions are enabled
- Ensure content is published (not just saved)
- Check the API response at: `http://localhost:1337/api/booking-process-page?populate=*`
- Check browser console for errors

---

## 📋 API Endpoint

Once configured, the API will be available at:

```
GET /api/booking-process-page?populate=*
```

Example populate query (used by frontend):
```
/api/booking-process-page?populate[pageHero][populate]=*&populate[seo][populate]=*
```

---

## ✨ Complete!

The Strapi backend is now ready. After restarting Strapi and setting permissions, you can add content and it will automatically appear on the `/booking-process` page in your Astro frontend.

