# Tennis Holiday Single Page - Implementation Guide

## Overview

The tennis holiday single page (`/tennis-holiday/[slug]`) features an editorial-style layout inspired by modern travel magazines with dynamic image placements, engaging visual breaks, and comprehensive content sections.

## Page URL Structure

```
https://activeaway.com/tennis-holiday/[slug]
Example: https://activeaway.com/tennis-holiday/adult-tennis-holiday-5-sani-beach-hotel
```

## Page Sections

### 1. Hero Section
- **Centered design** matching pre-orders page
- Full-width background image with gradient overlay
- Kicker (venue name), main title, subtitle
- Responsive heights: 400px (mobile) → 600px (desktop)

### 2. Breadcrumb Navigation
- Home > Tennis Holidays > [Title]
- Gold hover states

### 3. Overview Section (12-column grid)
- **Left (8 cols):** Rich text content + image gallery
  - Large featured image (400-500px height)
  - Two-column image grid below
- **Right (4 cols):** Sticky key information card
  - Price, country, duration, airport
  - "Book Now" CTA button

### 4. Why We Love It
- 4-column grid (responsive: 1→2→4)
- Icon circles with gold background
- Hover effects on cards

### 5. Full-Width Image Break
- Visual breathing room between sections
- Gradient overlay for depth
- Full bleed on mobile, rounded on desktop

### 6. Itinerary Section
- Accordion format with numbered badges
- Smooth expand/collapse animations
- Download itinerary links (if available)

### 7. The Venue (Tabbed Interface)
- Tabs: Setting, Board Basis, Restaurants, Bars, Tennis Courts, Top Tips
- 4 rating badges (Our Rating, Guest, Courts, Dining)
- Rich text content for each tab
- First tab active by default

### 8. Resort Gallery (Asymmetric Layout)
- Video embed (if available)
- **Layout:**
  - 1 large image (8 cols) + 2 stacked images (4 cols)
  - 3-column grid below
- Hover zoom effects (scale 1.05, 700ms transition)
- Rounded corners with shadows

### 9. Resort Information (Side-by-Side)
- **Left:** Large facility image
- **Right:** Stacked cards
  - What's Included (green)
  - What's Not Included (red)
  - Facilities (blue)

### 10. Accommodation/Rooms
- 2-column grid
- Each room:
  - Large image with title overlay
  - Yellow highlight card with details
  - Amenities grid
  - Price display

### 11. FAQs
- Accordion format
- Smooth animations
- Link to additional FAQs (if provided)

### 12. Available Dates
- Dark navy background section
- Full-width with gradient
- Centered CTA button
- Email mailto link

### 13. Similar Holidays
- 3-column grid
- Enhanced cards with hover effects
- "View Details" arrow link

## Design Features

### Color Palette
```css
Primary Gold: #ad986c
Dark Gold (hover): #8d7a56
Navy: #0D1C4E
Success (included): green-50/200/600
Error (not included): red-50/200/600
Info (facilities): blue-50/200/600
Rooms highlight: yellow-50/400
```

### Typography
```css
Headings: 'Playfair Display', serif
Body: 'Inter', sans-serif
Section titles: text-3xl sm:text-4xl
Card titles: text-xl sm:text-2xl
Body text: text-sm to text-base
```

### Spacing System
```css
Between major sections: space-y-16 (64px)
Within sections: space-y-8 (32px)
Card padding: p-6 (24px)
Grid gaps: gap-8 (32px) or gap-4 (16px)
```

### Interactive Elements
- **Accordions:** Smooth chevron rotation + content slide
- **Tabs:** Border-bottom active state + smooth transitions
- **Image Hovers:** Scale 1.05-1.1, duration 500-700ms
- **Card Hovers:** Shadow lift + border color change
- **CTAs:** Slight translate-y on hover

## Image Gallery Structure

The page uses a varied, editorial-style image layout:

```
Overview Section:
├─ Large feature (1 image)
└─ Two-column grid (2 images)

Full Width Break:
└─ Single panoramic (1 image)

Asymmetric Gallery:
├─ Large (8 cols) + Two stacked (4 cols)
└─ Three-column grid (3 images)

Resort Information:
└─ Side image with content

Rooms:
└─ Image with overlay per room
```

**Total images used:** 10-12 from mainGallery

## Placeholder Images

If Strapi images aren't available, fallback to:
```
https://activeaway.com/cdn-cgi/imagedelivery/-aT8Z2F9gGvZ9fdofZcCaQ/45b69090-1c22-46cd-7f98-086ba71efc00/public
```

## Component Data from Strapi

### Itinerary Items
```javascript
{
  title: "Day 1 Title",
  description: "<p>Rich text content</p>"
}
```

### FAQ Items
```javascript
{
  question: "Question text",
  answer: "<p>Answer content</p>"
}
```

### Room Options
```javascript
{
  roomType: "Deluxe Suite",
  description: "<p>Room description</p>",
  priceFrom: 1200,
  maxOccupancy: 2,
  roomImage: { url, alt },
  amenities: [{ text: "Air conditioning" }]
}
```

### Inclusion Items
```javascript
{
  text: "Half board accommodation",
  title: "Half board accommodation"
}
```

## Responsive Breakpoints

```css
Mobile (< 640px):
- Single column layouts
- Stacked images
- Full-width CTAs

Tablet (640-1024px):
- 2-column grids
- Mixed layouts
- Side-by-side content

Desktop (1024px+):
- 3-4 column grids
- Asymmetric layouts
- Sticky sidebar
```

## Next Steps for Strapi

### To Add Room Options:

1. **Restart Strapi** (new room-option component needs to load)
2. **Edit a Tennis Holiday entry**
3. **Add Room Options:**
   - Click "Add component" under Room Options
   - Fill in: Room Type, Description, Price From, Max Occupancy
   - Upload Room Image
   - Add Amenities (uses existing inclusion-item component)
4. **Save and Publish**

### Example Room Entry:

```
Room Type: Deluxe Ocean View Suite
Description: Spacious suite with panoramic sea views...
Price From: 1450
Max Occupancy: 2
Room Image: [Upload room photo]
Amenities:
  - Air conditioning
  - Private balcony
  - King size bed
  - Mini bar
```

## Testing Checklist

- [ ] Restart Strapi
- [ ] Add room options to a test entry
- [ ] Restart Astro dev server
- [ ] Visit `/tennis-holiday/your-slug`
- [ ] Check all sections display correctly
- [ ] Test accordion interactions (itinerary, FAQs)
- [ ] Test tab switching (venue tabs)
- [ ] Verify images load with fallbacks
- [ ] Test "Book Now" email link
- [ ] Check responsive design on mobile
- [ ] Verify similar holidays link correctly

## Key Differences from Old Site

### Visual Improvements:
- **Editorial layout** with varied image sizes
- **Full-width image breaks** for visual rhythm
- **Side-by-side content** instead of stacked
- **Larger, more impactful** headings
- **Enhanced hover states** and transitions
- **Better spacing** between sections

### UX Improvements:
- **Sticky sidebar** for easy booking access
- **Smooth animations** on all interactions
- **Clear visual hierarchy** with consistent typography
- **Color-coded sections** for quick scanning
- **Mobile-optimized** layouts

### Brand Consistency:
- Matches new design system (gold/navy)
- Consistent with pre-orders and venues pages
- Modern, premium feel
- Professional yet approachable

## Customization

All content is managed through Strapi - no hardcoding needed. Simply update fields in the Tennis Holiday entry and the page updates automatically.

**Key editable fields:**
- Hero: mainHeader, headingText, venue, headerImage
- Content: belowHeadingText (rich text)
- Pricing: singleOccupancyFrom, singleOccupancyRange
- Sections: itinerary, faqs, roomOptions, whatsIncluded, etc.
- SEO: seo component (metaTitle, metaDescription, etc.)

---

**Status:** ✅ Ready to test
**Created:** October 30, 2025

