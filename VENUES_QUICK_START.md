# 🚀 Venues Page - Quick Start Guide

Complete the venues page setup in **5 minutes** with this quick guide.

## ✅ What's Already Done

- ✅ Venues page created (`/src/pages/venues.astro`)
- ✅ Strapi integration ready
- ✅ Filters, sorting, infinite scroll implemented
- ✅ Responsive design (mobile + desktop)
- ✅ Import scripts created

## 🎯 Setup Steps (Choose One Method)

### Method 1: Automated Setup (Recommended) ⚡

```bash
# 1. Navigate to Strapi directory
cd /Users/joshuathompson/strapi/strapi

# 2. Run the import script
node import-venues-page.js

# 3. Restart Strapi
npm run develop
```

That's it! The script creates everything automatically.

### Method 2: Manual Setup 📝

Follow the detailed guide: `VENUES_PAGE_STRAPI_SETUP.md`

## 📋 After Running Import

### Step 1: Add Content in Strapi (2 minutes)

1. Open Strapi Admin: http://localhost:1337/admin
2. Go to **Content Manager** → **Venues Page**
3. Fill in the fields:
   - **Upload hero background image** (1920x1080px)
   - Hero Title: `Explore All Venues` (pre-filled)
   - Hero Subtitle: `Discover our complete collection...` (pre-filled)
   - Page Title: `All Venues - Active Away` (pre-filled)
   - Meta Description: (pre-filled)
4. Click **Save** → **Publish**

### Step 2: Set Permissions (1 minute)

1. **Settings** → **Roles** → **Public**
2. Find **Venues-page**
3. Check **☑ find**
4. Click **Save**

### Step 3: Test It Works (30 seconds)

```bash
# Test the API
curl http://localhost:1337/api/venues-page?populate=*

# Should return JSON with your content
```

### Step 4: View in Frontend (30 seconds)

```bash
# Build Astro site
cd /Users/joshuathompson/active-away-astro
npm run build
npm run preview

# Visit: http://localhost:4321/venues
```

## 📁 Files Created

In `/Users/joshuathompson/strapi/strapi/`:
- ✅ `schema-venues-page.json` - Content type schema
- ✅ `data-venues-page.json` - Sample data
- ✅ `import-venues-page.js` - Import script
- ✅ `README-VENUES-IMPORT.md` - Detailed instructions

## 🎨 What You Get

### Desktop View
```
┌─────────────────────────────────────────────────┐
│  Hero Image with Title & Subtitle              │
└─────────────────────────────────────────────────┘
┌──────────────┬──────────────────────────────────┐
│  Filters     │  Sort By: [Dropdown]             │
│  ─────────   │  ────────────────────────────── │
│  □ Type      │  ┌──────────────────────────┐   │
│  □ Country   │  │ [Image] | Title          │   │
│  £ Price     │  │         | Country         │   │
│  📅 Dates    │  │         | Type   £Price   │   │
│              │  └──────────────────────────┘   │
│  Clear All   │  ┌──────────────────────────┐   │
│              │  │ [Image] | Title          │   │
└──────────────┴──────────────────────────────────┘
```

### Features
- ✅ Filter by: Type, Country, Price, Dates
- ✅ Sort by: Price, Name, Newest, Recommended
- ✅ Infinite scroll (auto-loads more)
- ✅ 63 venues across 8 holiday types
- ✅ SEO optimized
- ✅ Mobile responsive

## 🎯 Quick Commands Reference

```bash
# Strapi
cd /Users/joshuathompson/strapi/strapi
npm run develop                    # Start Strapi
node import-venues-page.js         # Run import

# Astro
cd /Users/joshuathompson/active-away-astro
npm run dev                        # Development
npm run build                      # Production build
npm run preview                    # Preview build

# Test API
curl http://localhost:1337/api/venues-page?populate=*
```

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| `VENUES_QUICK_START.md` | **This file** - Quick setup |
| `VENUES_PAGE_STRAPI_SETUP.md` | Detailed Strapi setup |
| `VENUES_PAGE_COMPLETE_GUIDE.md` | Full feature documentation |
| `README-VENUES-IMPORT.md` | Import script details |

## 🎬 Recommended Hero Images

Upload one of these types:
- Tennis courts at sunset
- Resort pool with courts
- Players in action
- Aerial resort view

**Specs:**
- Size: 1920x1080px minimum
- Format: JPEG or WebP
- Size: < 500KB (optimize before upload)

## 🔧 Troubleshooting

**Q: Script fails?**  
A: Make sure you're in `/Users/joshuathompson/strapi/strapi`

**Q: Can't see content type?**  
A: Restart Strapi (`npm run develop`)

**Q: Getting 403 error?**  
A: Set public permissions (Step 2 above)

**Q: Hero image not showing?**  
A: Make sure to upload image and use `?populate=*`

## ✨ Next Steps

Once setup is complete:

1. **Add More Venues** - Create entries in the 8 collection types
2. **Customize Content** - Change hero text anytime in Strapi
3. **Upload Better Image** - Replace placeholder with real photo
4. **Test Filters** - Try filtering by type, country, price
5. **Deploy** - Push to production when ready

## 🎉 That's It!

Your venues page is now:
- ✅ Fully functional
- ✅ Connected to Strapi
- ✅ Ready for production
- ✅ Easy to update (no code changes needed)

---

**Need Help?**  
Check the detailed guides in the Documentation section above.

**Total Setup Time:** ~5 minutes  
**Last Updated:** October 29, 2025

