# Navigation Menu - Strapi Setup Guide

This guide shows you how to configure the entire navigation menu (including all mega menus) through Strapi CMS.

## 📋 Overview

The navigation menu supports **4 different mega menu types**:
1. **Dates** - Two-column text-based menu
2. **Rackets** - 9-image grid layout
3. **About Us** - Image-based cards with descriptions
4. **Destinations** - Tabbed interface with multiple categories

---

## 🎯 Main Menu Items

Configure the top-level navigation items in Strapi under **Navigation Menu → Menu Items**.

Each menu item has:
- `label` - Display text (e.g., "Home", "Dates", "Rackets")
- `href` - Link URL (e.g., "#home", "#dates")
- `isActive` - Whether this is the current page
- `hasMegaMenu` - True if this item has a dropdown
- `megaMenuId` - Links to specific mega menu: `dates`, `rackets`, `about`, or `destinations`

### Example Configuration:
```
Menu Items:
1. Label: Home, Href: #home, hasMegaMenu: false
2. Label: Dates, Href: #dates, hasMegaMenu: true, megaMenuId: dates
3. Label: Rackets, Href: #rackets, hasMegaMenu: true, megaMenuId: rackets
4. Label: About Us, Href: #about, hasMegaMenu: true, megaMenuId: about
5. Label: Destinations, Href: #destinations, hasMegaMenu: true, megaMenuId: destinations
6. Label: Blog, Href: #blogs, hasMegaMenu: false
```

---

## 📅 Dates Mega Menu (Two-Column Text Layout)

The Dates menu is split into **two columns** of text links.

### Fields in Strapi:

#### **Left Column: "Find your next..." (`datesFindYourNext`)**
Add text links for holiday types:
- Component: `navigation.text-link`
- Fields: `name`, `href`

Example items:
- Tennis Holiday
- UK Tennis Clinic
- Padel Holiday
- Pickleball Holiday
- Play & Watch Event
- School Tennis Tour
- Ski Holiday
- View All Destinations

#### **Right Column: "Useful Links" (`datesUsefulLinks`)**
Add text links for utility pages:
- Component: `navigation.text-link`
- Fields: `name`, `href`

Example items:
- Active Away Itineraries
- Airport Transfers
- Book Now
- FAQs
- Flights
- Membership
- Self Rating Guide
- The Booking Process
- View All Dates

### Strapi Setup Steps:
1. Go to **Content Manager → Navigation Menu**
2. Scroll to **Dates Find Your Next**
3. Click **Add Component** and add each link with:
   - `name` - Display text
   - `href` - Link URL
4. Repeat for **Dates Useful Links**

---

## 🎾 Rackets Mega Menu (9-Image Grid)

The Rackets menu displays **9 product categories** in a 3×3 grid with images.

### Fields in Strapi:
- Component: `navigation.mega-menu-item`
- Each item has:
  - `title` - Product name (e.g., "Adult Tennis Holidays")
  - `description` - Not displayed (optional)
  - `href` - Link URL
  - `image` - Upload product image
  - `gradient` - Tailwind gradient classes (e.g., "from-blue-500 to-blue-600")

### Required Items (9 total):
1. Adult Tennis Holidays
2. Family Tennis Holidays
3. Tennis Clinics
4. Padel
5. Pickleball
6. Junior Tennis Camps
7. Play & Watch
8. School Tennis Tours
9. Ski Holidays

### Strapi Setup Steps:
1. Go to **Content Manager → Navigation Menu**
2. Scroll to **Rackets Mega Menu Items**
3. Click **Add Component** for each of the 9 products
4. Fill in:
   - `title` - Product name
   - `href` - Link URL
   - `image` - Upload a high-quality image (recommended: 400×300px)
   - `gradient` - Optional Tailwind gradient (e.g., "from-purple-500 to-purple-600")

---

## ℹ️ About Us Mega Menu (Image Cards)

The About Us menu shows **3-6 image-based cards** with descriptions.

### Fields in Strapi:
- Component: `navigation.mega-menu-item`
- Each item has:
  - `title` - Card title (e.g., "Our Story")
  - `description` - Brief description text
  - `href` - Link URL
  - `image` - Upload card image
  - `gradient` - Tailwind gradient classes

### CTA Section:
- `aboutMegaMenuTitle` - Text above CTA button
- `aboutMegaMenuCTA` - Button text
- `aboutMegaMenuCTAUrl` - Button link

### Strapi Setup Steps:
1. Go to **Content Manager → Navigation Menu**
2. Scroll to **About Mega Menu Items**
3. Click **Add Component** for each card
4. Fill in all fields including image upload
5. Set the CTA fields at the bottom:
   - `aboutMegaMenuTitle`
   - `aboutMegaMenuCTA`
   - `aboutMegaMenuCTAUrl`

---

## 🌍 Destinations Mega Menu (Tabbed Categories)

The Destinations menu uses a **tabbed interface** to organize destinations by category.

### Structure:
- **Left Sidebar** - Holiday type tabs (Tennis Holidays, Padel, etc.)
- **Right Content** - List of individual destinations for selected tab
- **Dynamic Columns** - Automatically adjusts columns based on number of items:
  - 1-8 items: 1 column
  - 9-16 items: 2 columns
  - 17-24 items: 3 columns
  - 25+ items: 4 columns

### Fields in Strapi:

#### **Destination Categories** (`destinationsCategories`):
- Component: `navigation.destination-category`
- Each category has:
  - `label` - Tab name (e.g., "Tennis Holidays")
  - `destinations` - Repeatable list of destinations

#### **Destination Items** (within each category):
- Component: `navigation.destination-item`
- Each destination has:
  - `name` - Destination name (e.g., "Algarve Tennis Week")
  - `href` - Link URL
  - `country` - Optional country name

### CTA Section:
- `destinationsMegaMenuTitle` - Text above CTA button
- `destinationsMegaMenuCTA` - Button text
- `destinationsMegaMenuCTAUrl` - Button link

### Strapi Setup Steps:
1. Go to **Content Manager → Navigation Menu**
2. Scroll to **Destinations Categories**
3. Click **Add Component** to create a new category
4. Set the `label` (e.g., "Tennis Holidays")
5. Click **Add Component** under `destinations` for each destination:
   - `name` - Destination name
   - `href` - Link URL
   - `country` - Optional
6. Repeat for all categories (Tennis Holidays, Tennis Clinics, Padel, etc.)
7. Set the CTA fields:
   - `destinationsMegaMenuTitle`
   - `destinationsMegaMenuCTA`
   - `destinationsMegaMenuCTAUrl`

### Example Structure:
```
Destinations Categories:
1. Label: Tennis Holidays
   Destinations:
   - Algarve Tennis Week (#algarve)
   - Costa Brava Tennis Camp (#costa-brava)
   - [... 18 more items ...]

2. Label: Tennis Clinics
   Destinations:
   - Advanced Clinic Spain (#clinic-spain)
   - Beginners Clinic Portugal (#clinic-portugal)
   - [... more items ...]

3. Label: Junior Tennis Camps
   [... destinations ...]
```

---

## 📁 Component Files in Strapi

All navigation components are located in:
```
/strapi/src/components/navigation/
```

### Components:
1. **menu-item.json** - Main menu items
2. **text-link.json** - Simple text links (Dates menu)
3. **mega-menu-item.json** - Image-based menu items (Rackets, About)
4. **destination-category.json** - Category wrapper for Destinations
5. **destination-item.json** - Individual destination links

---

## 🔄 How Data Flows

1. **Strapi** - You configure menu items in the CMS
2. **API Call** - `getNavigationMenu()` in `src/utils/strapi.js` fetches the data
3. **Astro Component** - `HeroTailwind.astro` uses the data
4. **Fallback** - If Strapi API fails, default data is used

### API Endpoint:
```javascript
/navigation-menu?populate[menuItems][populate]=*
  &populate[datesFindYourNext][populate]=*
  &populate[datesUsefulLinks][populate]=*
  &populate[racketsMegaMenuItems][populate]=image
  &populate[aboutMegaMenuItems][populate]=image
  &populate[destinationsCategories][populate]=destinations
```

---

## ✅ Testing Checklist

After configuring in Strapi:

- [ ] All main menu items appear in navigation bar
- [ ] Dates mega menu shows both columns with all links
- [ ] Rackets mega menu displays all 9 images in 3×3 grid
- [ ] About Us mega menu shows cards with images and descriptions
- [ ] Destinations mega menu tabs switch correctly
- [ ] All links work correctly
- [ ] Images are high quality and load properly
- [ ] CTA buttons appear and link correctly
- [ ] Mobile menu shows correctly (below 1280px width)
- [ ] Hover effects work on all menu items

---

## 🎨 Design Notes

### Breakpoints:
- **Desktop Menu**: Visible at `xl` and above (≥1280px)
- **Mobile Menu**: Visible below `xl` (<1280px)

### Responsive Features:
- Navigation bar uses `clamp()` for fluid sizing
- Max width: 90vw to prevent overflow
- Mega menus auto-adjust to viewport width
- Destinations columns adapt to item count

### Styling:
- Gold accent color on hover
- Glassmorphic navigation bar
- Smooth transitions (200ms-300ms)
- Rounded corners and shadows for depth

---

## 🐛 Troubleshooting

### Menu not appearing?
- Check if Navigation Menu is **Published** in Strapi
- Verify API endpoint is accessible
- Check browser console for errors

### Images not loading?
- Ensure images are uploaded to Strapi
- Check image permissions
- Verify Cloudflare Images configuration

### Mega menu not opening?
- Verify `hasMegaMenu: true` in menu item
- Check `megaMenuId` matches ("dates", "rackets", "about", "destinations")
- Ensure mega menu items are added in Strapi

### Wrong number of columns in Destinations?
- The system automatically calculates columns based on item count
- 1 column: ≤8 items
- 2 columns: 9-16 items
- 3 columns: 17-24 items
- 4 columns: 25+ items

---

## 📝 Quick Start

**To get started quickly:**

1. **Create the Single Type** in Strapi:
   - Content-Types Builder → Create new Single Type → "Navigation Menu"
   - Or use the existing schema in `/strapi/src/api/navigation-menu/content-types/navigation-menu/schema.json`

2. **Add Components**:
   - Copy all component files from `/strapi/src/components/navigation/` to your Strapi instance

3. **Configure in CMS**:
   - Content Manager → Navigation Menu
   - Add your menu items
   - Configure all mega menus
   - **Publish** when done

4. **Verify on Website**:
   - Frontend will automatically fetch and display your navigation
   - If API fails, fallback data displays

---

## 🎉 You're Done!

Your navigation menu is now fully manageable through Strapi CMS. Update it anytime without touching code!

Need help? Check the component files or contact your development team.
