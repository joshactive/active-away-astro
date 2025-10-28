# Navigation Menu - Strapi Setup Guide

This guide explains how to manage your website's navigation menu through Strapi CMS.

## 📋 Content Type Structure

### Create Content Type: `Navigation Menu` (Single Type)

In Strapi Admin Panel, create a new **Single Type** called `Navigation Menu` with the following fields:

---

### 1. **Menu Items** (Component - Repeatable)

Component name: `Navigation.MenuItem`

Fields:
- **label** (Text) - The display text (e.g., "Home", "Dates", "About Us")
- **href** (Text) - The link URL (e.g., "#home", "/about")
- **isActive** (Boolean) - Set to true for the currently active page (default: false)
- **hasMegaMenu** (Boolean) - Set to true if this item should show a mega menu dropdown (default: false)
- **megaMenuId** (Text) - ID of the mega menu to show (e.g., "dates", "rackets"). Required if hasMegaMenu is true.

---

### 2. **Dates Mega Menu Items** (Component - Repeatable)

Component name: `Navigation.MegaMenuItem`

Fields:
- **title** (Text) - Card title (e.g., "Tennis Holidays")
- **description** (Text) - Short description
- **href** (Text) - Link URL
- **image** (Media - Single Image) - Card image (recommended: 400x300px)
- **gradient** (Text) - Tailwind gradient classes (e.g., "from-purple-500 to-purple-600")

---

### 3. **Dates Mega Menu Settings** (Text Fields)

- **megaMenuTitle** (Text) - Bottom text above CTA button for Dates menu
- **megaMenuCTA** (Text) - CTA button text for Dates menu
- **megaMenuCTAUrl** (Text) - CTA button link for Dates menu

---

### 4. **Rackets Mega Menu Items** (Component - Repeatable)

Component name: `Navigation.MegaMenuItem`

Fields:
- **title** (Text) - Card title (e.g., "Tennis")
- **description** (Text) - Short description
- **href** (Text) - Link URL
- **image** (Media - Single Image) - Card image (recommended: 400x300px)
- **gradient** (Text) - Tailwind gradient classes (e.g., "from-orange-500 to-orange-600")

---

### 5. **Rackets Mega Menu Settings** (Text Fields)

- **racketsMegaMenuTitle** (Text) - Bottom text above CTA button for Rackets menu
- **racketsMegaMenuCTA** (Text) - CTA button text for Rackets menu
- **racketsMegaMenuCTAUrl** (Text) - CTA button link for Rackets menu

---

### 6. **About Us Mega Menu Items** (Component - Repeatable)

Component name: `Navigation.MegaMenuItem`

Fields:
- **title** (Text) - Card title (e.g., "Our Story")
- **description** (Text) - Short description
- **href** (Text) - Link URL
- **image** (Media - Single Image) - Card image (recommended: 400x300px)
- **gradient** (Text) - Tailwind gradient classes (e.g., "from-blue-500 to-indigo-600")

---

### 7. **About Us Mega Menu Settings** (Text Fields)

- **aboutMegaMenuTitle** (Text) - Bottom text above CTA button for About Us menu
- **aboutMegaMenuCTA** (Text) - CTA button text for About Us menu
- **aboutMegaMenuCTAUrl** (Text) - CTA button link for About Us menu

---

## 🎨 Example Configuration

### Main Menu Items:

| Label | Href | isActive | hasMegaMenu | megaMenuId |
|-------|------|----------|-------------|------------|
| Home | #home | true | false | (empty) |
| Dates | #dates | false | true | dates |
| Rackets | #rackets | false | true | rackets |
| About Us | #about | false | true | about |
| Destinations | #destinations | false | false | (empty) |
| Blog | #blogs | false | false | (empty) |

### Dates Mega Menu Items:

**Item 1:**
- Title: `Tennis Holidays`
- Description: `Premium tennis coaching holidays`
- Href: `#tennis-dates`
- Image: Upload your tennis holiday image
- Gradient: `from-purple-500 to-purple-600`

**Item 2:**
- Title: `Padel Holidays`
- Description: `Exciting padel experiences abroad`
- Href: `#padel-dates`
- Image: Upload your padel holiday image
- Gradient: `from-blue-500 to-blue-600`

**Item 3:**
- Title: `Pickleball Holidays`
- Description: `Fun pickleball getaways`
- Href: `#pickleball-dates`
- Image: Upload your pickleball holiday image
- Gradient: `from-green-500 to-green-600`

### Dates Mega Menu Settings:

- **megaMenuTitle**: `Explore all our amazing holiday dates`
- **megaMenuCTA**: `Browse All Dates`
- **megaMenuCTAUrl**: `#all-dates`

### Rackets Mega Menu Items:

**Item 1:**
- Title: `Tennis`
- Description: `Professional tennis equipment & coaching`
- Href: `#tennis-rackets`
- Image: Upload your tennis image
- Gradient: `from-orange-500 to-orange-600`

**Item 2:**
- Title: `Padel`
- Description: `High-quality padel rackets & gear`
- Href: `#padel-rackets`
- Image: Upload your padel image
- Gradient: `from-cyan-500 to-cyan-600`

**Item 3:**
- Title: `Pickleball`
- Description: `Premium pickleball paddles & accessories`
- Href: `#pickleball-rackets`
- Image: Upload your pickleball image
- Gradient: `from-lime-500 to-lime-600`

### Rackets Mega Menu Settings:

- **racketsMegaMenuTitle**: `Explore our racket sports collection`
- **racketsMegaMenuCTA**: `Browse All Rackets`
- **racketsMegaMenuCTAUrl**: `#all-rackets`

### About Us Mega Menu Items:

**Item 1:**
- Title: `Our Story`
- Description: `Learn about our journey and mission`
- Href: `#our-story`
- Image: Upload your company story image
- Gradient: `from-blue-500 to-indigo-600`

**Item 2:**
- Title: `Meet the Team`
- Description: `Get to know our passionate experts`
- Href: `#team`
- Image: Upload your team image
- Gradient: `from-teal-500 to-teal-600`

**Item 3:**
- Title: `Contact Us`
- Description: `Get in touch with our team`
- Href: `#contact`
- Image: Upload your contact image
- Gradient: `from-pink-500 to-rose-600`

### About Us Mega Menu Settings:

- **aboutMegaMenuTitle**: `Learn more about Active Away`
- **aboutMegaMenuCTA**: `Get in Touch`
- **aboutMegaMenuCTAUrl**: `#contact`

---

## 🎨 Gradient Options

Here are some suggested Tailwind gradient classes:

- `from-purple-500 to-purple-600` - Purple
- `from-blue-500 to-blue-600` - Blue
- `from-green-500 to-green-600` - Green
- `from-red-500 to-red-600` - Red
- `from-yellow-500 to-yellow-600` - Yellow
- `from-pink-500 to-pink-600` - Pink
- `from-indigo-500 to-indigo-600` - Indigo
- `from-teal-500 to-teal-600` - Teal
- `from-orange-500 to-orange-600` - Orange

---

## 🔄 How It Works

1. **Fallback System**: If Strapi data isn't available, the site uses hardcoded defaults
2. **Desktop Navigation**: Shows as a glassmorphic pill with 6 items
3. **Mobile Navigation**: Full-screen overlay menu
4. **Mega Menus**: Multiple mega menus supported (Dates, Rackets, About Us). Only appear on desktop for items with `hasMegaMenu: true`
5. **Active State**: Highlighted with white background and shadow
6. **Dynamic Menus**: Each menu item with `hasMegaMenu: true` must have a corresponding `megaMenuId`

---

## 📝 API Endpoint

The component fetches data from:
```
/api/navigation-menu?populate[menuItems][populate]=*&populate[datesMegaMenuItems][populate]=image&populate[racketsMegaMenuItems][populate]=image&populate[aboutMegaMenuItems][populate]=image
```

---

## 🚀 Publishing

1. Create all fields in Strapi
2. Add your menu items (with `megaMenuId` for items with mega menus)
3. Add items to `datesMegaMenuItems`, `racketsMegaMenuItems`, and `aboutMegaMenuItems`
4. Upload images for all mega menu items
5. Configure settings for all mega menus
6. **Click "Publish"** to make changes live
7. Your navigation menu will update automatically!

---

## 💡 Tips

- Keep menu item labels short (1-2 words) for best display
- Use high-quality images (400x300px minimum) for mega menu cards
- You can have multiple items with `hasMegaMenu: true` (e.g., Dates, Rackets, About Us)
- Each mega menu item must have a unique `megaMenuId` that matches the field name (dates, rackets, about)
- Set `isActive: true` only for the current page's menu item
- The navigation width is optimized for 6 menu items
- Images will scale with hover effect for better UX
- Use different gradient colors for different mega menu types to create visual distinction

---

## 🐛 Troubleshooting

**Menu not updating?**
- Check that content is published in Strapi
- Verify API endpoint is accessible
- Check browser console for errors
- Fallback data will display if Strapi fetch fails

**Images not showing in mega menu?**
- Ensure images are uploaded to Strapi
- Check image permissions are set to public
- Verify image field is named `image` (lowercase)

**Mega menu not appearing?**
- Confirm `hasMegaMenu: true` is set for the menu item
- Check that mega menu items are added
- Hover over the menu item (not available on mobile)

---

## 📖 Related Files

- **Component**: `src/components/HeroTailwind.astro`
- **Utility**: `src/utils/strapi.js` (getNavigationMenu function)
- **Styling**: Tailwind CSS with glassmorphism effects

