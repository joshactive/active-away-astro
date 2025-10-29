# Venues Page - Complete Implementation Guide

## Overview

The `/venues` page is a fully-functional, filterable listing of all holiday destinations from Strapi with:
- ✅ Dynamic content from Strapi CMS
- ✅ Left sidebar with collapsible filters
- ✅ Sort by dropdown
- ✅ Infinite scroll
- ✅ Horizontal card layout (desktop) / vertical (mobile)
- ✅ Hero header with background image
- ✅ Real-time filtering without page reload
- ✅ SEO-friendly with URL parameters

## Quick Start

### 1. Set Up Strapi Content Type (One Time)

Follow the detailed guide in `VENUES_PAGE_STRAPI_SETUP.md`:

```bash
# Quick checklist:
1. Create "venues-page" single type in Strapi
2. Add fields: heroBackgroundImage, heroTitle, heroSubtitle, etc.
3. Save and wait for Strapi to restart
4. Add content and publish
5. Set public permissions (enable "find")
```

### 2. Add Content in Strapi

1. Go to `http://localhost:1337/admin`
2. Content Manager → Venues Page
3. Fill in all fields:
   - Upload hero background image
   - Set hero title: "Explore All Venues"
   - Set hero subtitle: "Discover our complete collection..."
   - Set kicker: "ALL DESTINATIONS"
   - Set page title & meta description
4. Click **Save** then **Publish**

### 3. Verify It Works

```bash
# Build and preview
npm run build
npm run preview

# Visit the page
# http://localhost:4321/venues
```

## Features Implemented

### Content Management (Strapi)
- **Single Type:** `venues-page`
- **Dynamic Content:** Hero section, SEO meta tags
- **Fallback Values:** Page works even if Strapi is unavailable
- **Image Optimization:** Cloudflare Images integration

### User Interface

#### Desktop Layout
- **Left Sidebar:** Fixed width (320px) with sticky positioning
- **Main Content:** Flexible width with horizontal venue cards
- **Filters:** Collapsible sections with chevron indicators
- **Sort:** Dropdown with 6 sorting options

#### Mobile Layout
- **Stacked Layout:** Filters on top, content below
- **Collapsible Filters:** Toggle to show/hide
- **Vertical Cards:** Full-width venue cards
- **Touch-Friendly:** All interactive elements sized for mobile

### Filters

1. **Holiday Type** (Multi-select)
   - Junior Tennis Camp
   - Padel Tennis Holiday
   - Pickleball Holiday
   - Play & Watch
   - School Tennis Tour
   - Ski Holiday
   - Tennis Clinic
   - Tennis Holiday

2. **Country** (Multi-select)
   - Dynamically populated from available venues

3. **Price Range**
   - Min/Max inputs with £ symbol
   - Auto-populated range from available venues

4. **Available Dates**
   - Date from/to inputs
   - Filters venues by availability

### Sorting Options

- **Recommended** (default)
- **Price: Low to High**
- **Price: High to Low**
- **Name: A to Z**
- **Name: Z to A**
- **Newest First**

### Performance Features

- **Prerendering:** Page built at compile time (SSG)
- **Lazy Loading:** Images load as needed
- **Infinite Scroll:** Loads more venues automatically
- **Client-Side Filtering:** Instant results, no API calls
- **URL Parameters:** Shareable filter states
- **Responsive Images:** Optimized for all screen sizes

## File Structure

```
src/
├── pages/
│   └── venues.astro           # Main venues listing page
├── utils/
│   └── strapi.js              # API functions (getVenuesPage, getAllVenues)
└── components/
    └── ui/icons/              # Reused icons (MapPin, Tag, Hotel)

Documentation/
├── VENUES_PAGE_STRAPI_SETUP.md       # Strapi setup guide
└── VENUES_PAGE_COMPLETE_GUIDE.md     # This file
```

## API Endpoints Used

### Strapi Endpoints

```javascript
// Venues page content
GET /api/venues-page?populate=*

// All venue collections (8 types)
GET /api/junior-tennis-camps?populate=headerImage&sort=createdAt:desc
GET /api/padel-tennis-holidays?populate=headerImage&sort=createdAt:desc
GET /api/pickleball-holidays?populate=headerImage&sort=createdAt:desc
GET /api/play-and-watches?populate=headerImage&sort=createdAt:desc
GET /api/school-tennis-tours?populate=headerImage&sort=createdAt:desc
GET /api/ski-holidays?populate=headerImage&sort=createdAt:desc
GET /api/tennis-clinics?populate=headerImage&sort=createdAt:desc
GET /api/tennis-holidays?populate=headerImage&sort=createdAt:desc
```

## Code Examples

### Fetching Venues Page Content

```javascript
import { getVenuesPage } from '../utils/strapi.js';

const pageContent = await getVenuesPage();

// Access content
const heroTitle = pageContent?.hero?.title;
const heroImage = pageContent?.hero?.backgroundImage?.url;
const pageTitle = pageContent?.meta?.title;
```

### Fetching All Venues

```javascript
import { getAllVenues } from '../utils/strapi.js';

const venuesData = await getAllVenues({ pageSize: 18 });

// Access data
const { venues, metadata } = venuesData;
console.log(`Loaded ${venues.length} venues`);
console.log(`Available countries:`, metadata.countries);
```

## Customization

### Change Number of Venues Per Page

```javascript
// In venues.astro
const venuesData = await getAllVenues({ pageSize: 24 }); // Change from 18 to 24
```

### Add New Filter Options

1. Update Strapi content types to include new field
2. Modify `normalizeVenueData()` in `strapi.js`
3. Add filter UI in `venues.astro`
4. Update filtering logic in `applyFilters()`

### Change Hero Image Overlay

```astro
<!-- Adjust opacity in venues.astro -->
<div class="absolute inset-0 bg-gradient-to-r from-[#0D1C4E]/90 to-[#0D1C4E]/70 z-10"></div>
<!-- Change /90 and /70 to adjust darkness -->
```

### Modify Card Layout

```astro
<!-- In venues.astro, find the venue card -->
<div class="flex flex-col lg:flex-row lg:h-[280px]">
  <!-- Change lg:h-[280px] to desired height -->
  <div class="lg:w-[45%]"><!-- Image --></div>
  <!-- Change lg:w-[45%] to adjust image width -->
</div>
```

## Troubleshooting

### Issue: Venues page shows default content

**Cause:** Strapi single type not created or not published

**Solution:**
1. Create `venues-page` single type in Strapi
2. Add and publish content
3. Check permissions (Public → venues-page → find)

### Issue: No venues showing

**Cause:** Venue collections empty in Strapi

**Solution:**
1. Add entries to one or more of the 8 collection types
2. Ensure entries are published
3. Check console for API errors

### Issue: Filters not working

**Cause:** JavaScript error or missing data attributes

**Solution:**
1. Check browser console for errors
2. Verify venue cards have `data-*` attributes
3. Clear browser cache and reload

### Issue: Images not loading

**Cause:** Cloudflare Images configuration or wrong URLs

**Solution:**
1. Check image URLs in Strapi
2. Verify Cloudflare Images account is configured
3. Check `getStrapiImageAttrs()` function

### Issue: Sort not persisting

**Cause:** Client-side state management

**Solution:**
- Sorting is client-side only (by design)
- Add to URL params if persistence needed
- Check `applySorting()` function

## SEO Considerations

### Meta Tags
- Title and description pulled from Strapi
- Defaults provided if Strapi unavailable
- Update in Strapi admin for easy changes

### URL Structure
```
/venues                          # All venues
/venues?types=tennis-holiday     # Filtered by type
/venues?countries=Spain,Greece   # Filtered by country
/venues?minPrice=500&maxPrice=2000   # Filtered by price
```

### Performance
- Prerendered at build time (fast initial load)
- Lazy loaded images (better Core Web Vitals)
- Optimized assets (Cloudflare CDN)

## Future Enhancements

### Potential Additions
- [ ] Venue detail pages
- [ ] Map view toggle
- [ ] Favorites/wishlist functionality
- [ ] Compare venues side-by-side
- [ ] Email alerts for new venues
- [ ] Reviews and ratings
- [ ] Availability calendar
- [ ] Booking integration

### Performance Optimizations
- [ ] Virtual scrolling for 100+ venues
- [ ] Progressive image loading
- [ ] Service worker for offline
- [ ] Prefetch next page on hover

## Support & Maintenance

### Regular Tasks
1. **Update Content:** Edit via Strapi admin (no code changes)
2. **Add Venues:** Create entries in Strapi collections
3. **Change Images:** Upload new images in Strapi
4. **Monitor Performance:** Check build times and page load speed

### When to Rebuild
- After Strapi content changes (automatic on deploy)
- After code changes to venues.astro
- After Strapi schema changes

### Backup Recommendations
- Regular Strapi database backups
- Version control for code (Git)
- Document customizations

## Resources

- [Strapi Documentation](https://docs.strapi.io/)
- [Astro Documentation](https://docs.astro.build/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Cloudflare Images](https://developers.cloudflare.com/images/)

## Contact & Questions

For issues or questions about the venues page:
1. Check this guide first
2. Review `VENUES_PAGE_STRAPI_SETUP.md` for Strapi setup
3. Check browser console for errors
4. Verify Strapi API is accessible

---

**Last Updated:** October 29, 2025  
**Version:** 1.0  
**Status:** ✅ Production Ready

