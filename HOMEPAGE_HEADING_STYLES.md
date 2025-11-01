# Active Away Homepage - Heading Style Guide

This document outlines all heading styles used on the Active Away homepage for consistent implementation across the website.

---

## H1 - Main Hero Heading

### Style Pattern
```html
<h1 class="w-full font-playfair font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight lg:leading-[1.3] text-center text-white m-0 break-words">
```

**Font**: Playfair Display  
**Weight**: Bold (font-bold)  
**Color**: White (text-white)  
**Alignment**: Center  
**Responsive Sizes**:
- Mobile: text-3xl (30px)
- SM: text-4xl (36px)
- MD: text-5xl (48px)
- LG: text-6xl (60px)
- XL: text-7xl (72px)

**Usage**: Hero section main heading  
**Example Text**: "Unforgettable Tennis, Padel & Pickleball Experiences"

---

## H2 - Section Headings (Primary)

### Style Pattern 1: Large Section Headings
```html
<h2 class="text-2xl sm:text-3xl lg:text-4xl font-playfair font-semibold text-gray-900">
```

**Font**: Playfair Display  
**Weight**: Semibold (font-semibold)  
**Color**: Dark Gray (text-gray-900)  
**Alignment**: Left or Center (varies by section)  
**Responsive Sizes**:
- Mobile: text-2xl (24px)
- SM: text-3xl (30px)
- LG: text-4xl (36px)

**Usage**: Main section headings  
**Used In**:
- Explore our Locations
- Our upcoming events
- Our Blog
- About Us
- What We Offer
- Racket Holiday Specialists
- Thriving Community
- Jamie Murray Section

**Examples**:
- "Explore our Locations"
- "Our upcoming events"
- "About Us"
- "What We Offer"
- "Thriving Community"
- "Jamie Murray x Active Away"

### Style Pattern 2: With Bottom Margin
```html
<h2 class="text-2xl sm:text-3xl lg:text-4xl font-playfair font-semibold text-gray-900 lg:text-center mb-6 sm:mb-8 lg:mb-16">
```

**Additional**: 
- Center alignment on large screens (lg:text-center)
- Responsive bottom margin

**Used In**:
- Our Partners
- Tennis Holiday Experts

### Style Pattern 3: Small Bottom Margin
```html
<h2 class="text-2xl sm:text-3xl lg:text-4xl font-playfair font-semibold text-gray-900 mb-1 sm:mb-2">
```

**Additional**: 
- Small bottom margin (mb-1 sm:mb-2)

**Used In**:
- Stories of Hope
- Instagram

---

## H3 - Subsection Headings

### Style Pattern 1: Large Card/Section Heading
```html
<h3 class="text-2xl sm:text-3xl font-playfair font-semibold text-gray-900 mb-4 group-hover:text-[#ad986c] transition-colors">
```

**Font**: Playfair Display  
**Weight**: Semibold (font-semibold)  
**Color**: Dark Gray (text-gray-900)  
**Hover**: Gold (#ad986c)  
**Responsive Sizes**:
- Mobile: text-2xl (24px)
- SM: text-3xl (30px)

**Usage**: Large call-to-action cards  
**Examples**:
- "View All Locations"
- "View All Events"
- "View All Posts"

### Style Pattern 2: Card Title
```html
<h3 class="text-xl font-playfair font-semibold text-gray-900 mb-3 group-hover:text-[#ad986c] transition-colors leading-tight">
```

**Font**: Playfair Display  
**Weight**: Semibold (font-semibold)  
**Color**: Dark Gray (text-gray-900)  
**Size**: text-xl (20px)  
**Hover**: Gold (#ad986c)

**Usage**: Location cards, Event cards, Blog cards, Product cards  
**Examples**:
- Location titles
- Event titles
- Blog post titles
- Product/offer titles

### Style Pattern 3: Navigation/Menu Headings
```html
<h3 class="text-lg font-playfair font-semibold text-gray-900 mb-4">
```

**Font**: Playfair Display  
**Weight**: Semibold (font-semibold)  
**Color**: Dark Gray (text-gray-900)  
**Size**: text-lg (18px)

**Usage**: Mega menu headings  
**Examples**:
- "Find your next..."
- "Useful Links"

### Style Pattern 4: Footer Headings (White on Dark)
```html
<h3 class="text-base font-inter font-semibold text-white mb-3 sm:mb-4">
```

**Font**: Inter  
**Weight**: Semibold (font-semibold)  
**Color**: White (text-white)  
**Size**: text-base (16px) - All screens

**Usage**: Footer section headings  
**Examples**:
- "Contact"
- "Quick Links"
- "Booking information"
- "Newsletter"

**Footer Links/Text**: `text-sm font-inter text-gray-300` (14px - All screens)

### Style Pattern 5: Accordion Titles
```html
<h3 class="text-base lg:text-lg font-inter font-medium text-gray-900 pr-4">
```

**Font**: Inter  
**Weight**: Medium (font-medium)  
**Color**: Dark Gray (text-gray-900)  
**Responsive Sizes**:
- Mobile: text-base (16px)
- LG: text-lg (18px)

**Usage**: Accordion headers in "Tennis Holiday Experts"  
**Examples**: FAQ/accordion question titles

**Body Text**: `text-base font-inter text-gray-800 leading-relaxed` (16px all screens)

---

## H4 - Small Section Headings

### Style Pattern 1: Mobile Menu Categories
```html
<h4 class="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2 px-2">
```

**Font**: Default (Inter implied)  
**Weight**: Bold (font-bold)  
**Color**: Dark Gray (text-gray-900)  
**Size**: text-sm (14px)  
**Style**: UPPERCASE with wide tracking  

**Usage**: Mobile menu category headings  
**Examples**:
- "FIND YOUR NEXT..."
- "USEFUL LINKS"
- Holiday type categories

### Style Pattern 2: Mega Menu Categories
```html
<h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-3">
```

**Font**: Default (Inter implied)  
**Weight**: Semibold (font-semibold)  
**Color**: Medium Gray (text-gray-500)  
**Size**: text-sm (14px)  
**Style**: UPPERCASE with wide tracking  

**Usage**: Desktop mega menu categories  
**Example**: "HOLIDAY TYPES"

### Style Pattern 3: Testimonial Names
```html
<h4 class="text-sm sm:text-base font-inter font-semibold text-gray-900">
```

**Font**: Inter  
**Weight**: Semibold (font-semibold)  
**Color**: Dark Gray (text-gray-900)  
**Responsive Sizes**:
- Mobile: text-sm (14px)
- SM: text-base (16px)

**Usage**: Testimonial author names  
**Examples**: Customer names in testimonials

---

## H5 - Menu Item Headings

### Style Pattern 1: Mega Menu Item (Desktop)
```html
<h3 class="font-semibold text-lg">{megaItem.title}</h3>
```

**Weight**: Semibold (font-semibold)  
**Size**: text-lg (18px)

**Usage**: Large mega menu items

### Style Pattern 2: Mega Menu Item (Mobile)
```html
<h3 class="font-semibold text-sm leading-tight">{megaItem.title}</h3>
```

**Weight**: Semibold (font-semibold)  
**Size**: text-sm (14px)

**Usage**: Mobile menu items

### Style Pattern 3: Mobile Menu Nested Items
```html
<h5 class="font-semibold text-xs leading-tight">{rItem.title}</h5>
```

**Weight**: Semibold (font-semibold)  
**Size**: text-xs (12px)

**Usage**: Sub-menu items in mobile navigation

### Style Pattern 4: Activity Menu Items
```html
<h5 class="font-semibold text-sm text-gray-900 mb-1">{aItem.title}</h5>
```

**Weight**: Semibold (font-semibold)  
**Color**: Dark Gray (text-gray-900)  
**Size**: text-sm (14px)

**Usage**: Activity menu items with descriptions

---

## Font Family Reference

### Playfair Display (Serif)
**Usage**: Headings, elegant/important text  
**Class**: `font-playfair`  
**Used For**:
- H1 (Hero)
- H2 (Section headings)
- H3 (Most card titles, CTAs)
- Navigation headings

**Characteristics**: Elegant, serif font for emphasis and hierarchy

### Inter (Sans-serif)
**Usage**: Body text, UI elements, some headings  
**Class**: `font-inter`  
**Used For**:
- Jamie Murray section heading
- Footer headings
- Accordion titles
- Testimonial names
- Menu categories
- Most UI text

**Characteristics**: Clean, modern sans-serif for readability

---

## Color Reference

| Color | Class | Hex | Usage |
|-------|-------|-----|-------|
| Dark Gray | `text-gray-900` | #111827 | Primary heading color |
| Medium Gray | `text-gray-500` | #6B7280 | Secondary/category headings |
| White | `text-white` | #FFFFFF | Hero heading, footer headings |
| Gold (Hover) | `text-[#ad986c]` | #ad986c | Hover state for links/CTAs |

---

## Responsive Size Pattern Reference

| Class | Mobile | SM (640px) | MD (768px) | LG (1024px) | XL (1280px) |
|-------|--------|------------|------------|-------------|-------------|
| text-3xl | 30px | - | - | - | - |
| text-4xl | 36px | - | - | - | - |
| text-5xl | 48px | - | - | - | - |
| text-6xl | 60px | - | - | - | - |
| text-7xl | 72px | - | - | - | - |
| text-2xl | 24px | - | - | - | - |
| text-3xl | 30px | - | - | - | - |
| text-4xl | 36px | - | - | - | - |
| text-xl | 20px | - | - | - | - |
| text-lg | 18px | - | - | - | - |
| text-base | 16px | - | - | - | - |
| text-sm | 14px | - | - | - | - |
| text-xs | 12px | - | - | - | - |

---

## Implementation Guidelines

### 1. **Hierarchy**
- H1: Only for page hero/main title
- H2: Major section headings
- H3: Subsection headings, card titles
- H4-H5: Minor headings, menu items, UI labels

### 2. **Font Selection**
- **Playfair**: Use for editorial/marketing content headings
- **Inter**: Use for UI headings, functional elements, footer

### 3. **Consistency Rules**
- All section headings use: `text-2xl sm:text-3xl lg:text-4xl font-playfair font-semibold text-gray-900`
- All card titles use: `text-xl font-playfair font-semibold text-gray-900`
- All CTAs use hover state: `group-hover:text-[#ad986c] transition-colors`
- Footer headings always use Inter white: `font-inter font-semibold text-white`

### 4. **Spacing**
- Large sections: `mb-6 sm:mb-8 lg:mb-16`
- Standard sections: `mb-4 sm:mb-6`
- Compact sections: `mb-1 sm:mb-2`
- Card titles: `mb-3` or `mb-2 sm:mb-4`

---

## Quick Reference Table

| Element | Font | Weight | Size Pattern | Color |
|---------|------|--------|--------------|-------|
| Hero H1 | Playfair | Bold | 3xl→4xl→5xl→6xl→7xl | White |
| Section H2 | Playfair | Semibold | 2xl→3xl→4xl | Gray-900 |
| Card H3 | Playfair | Semibold | xl | Gray-900 |
| Footer H3 | Inter | Semibold | base (16px) | White |
| Accordion H3 | Inter | Medium | base→lg | Gray-900 |
| Category H4 | Inter | Bold | sm | Gray-900/500 |
| Name H4 | Inter | Semibold | sm→base | Gray-900 |

---

*Last Updated: Based on current Active Away homepage implementation*

