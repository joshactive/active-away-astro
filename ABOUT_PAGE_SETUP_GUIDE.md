# About Us Page - Setup Guide

## ✅ Implementation Complete!

The About Us page has been fully implemented with all components and Strapi schemas.

---

## 📦 What Was Created

### Strapi Components (10 new):
1. ✅ `sections/page-hero.json` - Standard page hero with background
2. ✅ `sections/about-hero.json` - About section with images
3. ✅ `sections/stat-item.json` - Single stat
4. ✅ `sections/stats-grid.json` - Stats grid
5. ✅ `sections/flexible-content-block.json` - Flexible content
6. ✅ `sections/benefit-item.json` - Single benefit
7. ✅ `sections/benefits-grid.json` - Benefits grid
8. ✅ `sections/dragons-den.json` - Dragons' Den section
9. ✅ `sections/timeline-event.json` - Timeline event
10. ✅ `sections/history-timeline.json` - History timeline

### Strapi Content Types (2 new):
1. ✅ `about-page` (single-type)
2. ✅ `person` (collection-type)

### Astro Components (8 new):
1. ✅ `PageHeroTailwind.astro`
2. ✅ `AboutHeroTailwind.astro`
3. ✅ `StatsGridTailwind.astro`
4. ✅ `FlexibleContentBlockTailwind.astro`
5. ✅ `BenefitsGridTailwind.astro`
6. ✅ `DragonsDenTailwind.astro`
7. ✅ `PeopleGridTailwind.astro`
8. ✅ `HistoryTimelineTailwind.astro`

### Page:
- ✅ `/src/pages/about-us.astro`

---

## 📋 Page Structure

The About Us page at `/about-us` includes these sections:

1. **Page Hero** - Full-width background image with breadcrumbs and heading
2. **About Hero** - "Meet Active Away" with left/right images
3. **Stats Grid** - 4 stat counters (7,000+, 1,400+, etc.)
4. **Content Blocks** (repeatable) - Flexible content sections
5. **What We Offer** - Reused from homepage
6. **Benefits Grid** - "Why Choose Active Away"
7. **Dragons' Den** - Featured section
8. **People Grid** - "Meet Our Team"
9. **History Timeline** - Company history
10. **Instagram** - Reused from homepage

---

## 🚀 Next Steps

### 1. Restart Strapi

```bash
cd /Users/joshuathompson/strapi/strapi
npm run develop
```

### 2. Set API Permissions

**Settings** → **Users & Permissions** → **Roles** → **Public**:

Enable for **About-page**:
- ✅ `find`

Enable for **Person**:
- ✅ `find`
- ✅ `findOne`

### 3. Create About Page Content

**Content Manager** → **About Page**

#### Page Hero Section:
- **Kicker**: `ABOUT US`
- **Heading**: `About Active Away`
- **Subtitle**: Your subtitle text
- **Background Image**: Upload hero image
- **Show Breadcrumbs**: ✅ true

#### Hero Section (Meet Active Away):
- **Eyebrow**: `WHO WE ARE`
- **Heading**: `Meet Active Away`
- **Description**: Your intro text
- **Left Image**: Upload main image
- **Right Image**: Upload secondary image

#### Stats Section:
Add 4 stats:
- **Number**: `7,000+`, **Label**: `Happy Customers`
- **Number**: `1,400+`, **Label**: `Tennis Holidays Hosted`
- **Number**: `20+`, **Label**: `Years Experience`
- **Number**: `8,000+`, **Label**: `Racket Enthusiasts`

#### Content Blocks (Add Multiple):
For each block:
- **Heading**: Section title
- **Content**: Your text (supports markdown)
- **Image**: Upload image
- **Image Position**: left/right/top/bottom
- **Background Color**: white/grey

#### What We Offer:
- **Show What We Offer**: ✅ true (uses homepage component)

#### Benefits Grid:
- **Heading**: `Why Choose Active Away`
- **Benefits**: Add 3 items with icons, headings, descriptions

#### Dragons' Den:
- **Heading**: `Dragons' Den`
- **Content**: Your Dragons' Den story
- **Image** or **Video URL**: Media
- **Button Text**: `Watch Now`
- **Button Link**: YouTube or page link
- **Background Color**: navy/white/grey

#### History Timeline:
- **Heading**: `Our History`
- **Events**: Add timeline events with year, heading, description

#### Instagram:
- **Show Instagram**: ✅ true (uses homepage component)

### 4. Add Team Members

**Content Manager** → **Person** → Create entries

For each team member:
- **Name**: Full name
- **Role**: Job title
- **Bio**: Short biography (markdown supported)
- **Image**: Profile photo
- **Order**: Number (0, 1, 2, etc. for sorting)
- **Display on About Page**: ✅ true
- **LinkedIn**: URL (optional)
- **Email**: Email address (optional)

### 5. Build & Test

```bash
cd /Users/joshuathompson/active-away-astro
npm run build
npm run preview
```

Visit: **http://localhost:4321/about-us**

---

## ✨ Features

### Page Hero
- Full-width background image
- Breadcrumb navigation
- Kicker, heading, subtitle
- Gradient overlay
- Centered content

### Flexible Content Blocks
- 4 layout options (image left/right/top/bottom)
- White or grey backgrounds
- Can add unlimited blocks
- Perfect for multiple sections

### People Grid
- Responsive grid (1/2/3/4 columns)
- Profile photos
- Names, roles, bios
- LinkedIn and email links
- Sortable by order
- Hover effects

### All Other Sections
- Follow same design system
- Responsive layouts
- Consistent typography
- Same color palette
- Markdown support where needed

---

## 📸 Breadcrumbs

The breadcrumbs show: **Home** → **About Us**

They automatically appear at the top of the page hero and can be toggled off in Strapi with the `showBreadcrumbs` field.

---

## 🎯 Success!

Your About Us page is complete and follows the exact same design standards as your product pages. After restarting Strapi and adding content, it will automatically appear at `/about-us`!

