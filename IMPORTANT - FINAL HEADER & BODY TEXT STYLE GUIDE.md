# IMPORTANT - FINAL HEADER & BODY TEXT STYLE GUIDE

**Active Away - Complete Typography Reference**  
*This is the definitive style guide for all heading and body text across the website.*

---

## 🎯 QUICK REFERENCE - MOST COMMON STYLES

### Standard Section Heading (H2)
```html
<h2 class="text-2xl sm:text-3xl lg:text-4xl font-playfair font-semibold text-gray-900">
```
**Mobile: 24px** | **Tablet: 30px** | **Desktop: 36px**

### Standard Card Heading (H3)
```html
<h3 class="text-xl font-playfair font-semibold text-gray-900 mb-3 group-hover:text-[#ad986c] transition-colors leading-tight">
```
**All Screens: 20px**

### Standard Body Text
```html
<p class="text-base sm:text-lg font-inter text-gray-800 leading-relaxed">
```
**Mobile: 16px** | **Tablet+: 18px**

---

## H1 - HERO HEADINGS

### Hero Main Heading
```html
<h1 class="w-full font-playfair font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight lg:leading-[1.3] text-center text-white m-0 break-words">
```

**Font**: Playfair Display  
**Weight**: Bold  
**Color**: White  
**Alignment**: Center  
**Sizes**:
- Mobile: 30px (text-3xl)
- SM: 36px (text-4xl)
- MD: 48px (text-5xl)
- LG: 60px (text-6xl)
- XL: 72px (text-7xl)

**Usage**: Homepage hero only  
**Example**: "Unforgettable Tennis, Padel & Pickleball Experiences"

---

## H2 - SECTION HEADINGS

### Standard Large Section Heading
```html
<h2 class="text-2xl sm:text-3xl lg:text-4xl font-playfair font-semibold text-gray-900">
```

**Font**: Playfair Display  
**Weight**: Semibold  
**Color**: Dark Gray (#111827)  
**Sizes**:
- Mobile: 24px (text-2xl)
- SM: 30px (text-3xl)
- LG: 36px (text-4xl)

**Used In**:
- Explore our Locations
- Our upcoming events
- Our Blog
- About Us
- What We Offer
- Racket Holiday Specialists
- Thriving Community
- Jamie Murray Section

### With Center Alignment + Full Margin
```html
<h2 class="text-2xl sm:text-3xl lg:text-4xl font-playfair font-semibold text-gray-900 lg:text-center mb-6 sm:mb-8 lg:mb-16">
```

**Additional**: 
- Centered on desktop: `lg:text-center`
- Responsive margin: `mb-6 sm:mb-8 lg:mb-16`

**Used In**:
- Our Partners
- Tennis Holiday Experts

### With Small Bottom Margin
```html
<h2 class="text-2xl sm:text-3xl lg:text-4xl font-playfair font-semibold text-gray-900 mb-1 sm:mb-2">
```

**Additional**: 
- Small margin: `mb-1 sm:mb-2`

**Used In**:
- Stories of Hope
- Instagram

---

## H3 - SUBSECTION HEADINGS

### Large CTA/Feature Cards
```html
<h3 class="text-2xl sm:text-3xl font-playfair font-semibold text-gray-900 mb-4 group-hover:text-[#ad986c] transition-colors">
```

**Font**: Playfair Display  
**Weight**: Semibold  
**Color**: Dark Gray → Gold on hover  
**Sizes**:
- Mobile: 24px (text-2xl)
- SM: 30px (text-3xl)

**Used In**:
- "View All Locations" card
- "View All Events" card
- "View All Posts" card

### Standard Content Cards (MOST COMMON)
```html
<h3 class="text-xl font-playfair font-semibold text-gray-900 mb-3 group-hover:text-[#ad986c] transition-colors leading-tight">
```

**Font**: Playfair Display  
**Weight**: Semibold  
**Color**: Dark Gray → Gold on hover  
**Size**: 20px (text-xl) - All screens

**Used In**:
- Location cards
- Event cards
- Blog post cards
- Product/Offer cards

**Examples**:
- Location titles
- Event titles
- Blog titles
- "Tennis Holidays", "Padel Holidays", etc.

### Navigation/Menu Headings
```html
<h3 class="text-lg font-playfair font-semibold text-gray-900 mb-4">
```

**Font**: Playfair Display  
**Weight**: Semibold  
**Size**: 18px (text-lg)

**Used In**: Mega menu category headings  
**Examples**: "Find your next...", "Useful Links"

### Footer Headings
```html
<h3 class="text-base font-inter font-semibold text-white mb-3 sm:mb-4">
```

**Font**: Inter (NOT Playfair)  
**Weight**: Semibold  
**Color**: White  
**Size**: 16px (text-base) - All screens

**Used In**: All footer column headings  
**Examples**: "Contact", "Quick Links", "Booking information", "Booking Protection", "Newsletter"

### Accordion Headers
```html
<h3 class="text-base lg:text-lg font-inter font-medium text-gray-900 pr-4">
```

**Font**: Inter (NOT Playfair)  
**Weight**: Medium (NOT Semibold)  
**Color**: Dark Gray  
**Sizes**:
- Mobile: 16px (text-base)
- LG: 18px (text-lg)

**Used In**: Tennis Holiday Experts accordion questions

---

## H4 - MINOR HEADINGS

### Testimonial/Review Names
```html
<h4 class="text-base font-inter font-semibold text-gray-900">
```

**Font**: Inter  
**Weight**: Semibold  
**Size**: 16px (text-base) - All screens

**Used In**: Google review names, testimonial names

### Mobile Menu Category Headers
```html
<h4 class="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2 px-2">
```

**Font**: Inter  
**Weight**: Bold  
**Size**: 14px (text-sm)  
**Style**: UPPERCASE with wide tracking

**Used In**: Mobile menu categories  
**Examples**: "FIND YOUR NEXT...", "USEFUL LINKS"

### Mega Menu Section Headers
```html
<h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-3">
```

**Font**: Inter  
**Weight**: Semibold  
**Color**: Medium Gray (#6B7280)  
**Size**: 14px (text-sm)  
**Style**: UPPERCASE

**Used In**: Desktop mega menu categories  
**Example**: "HOLIDAY TYPES"

---

## H5 - MENU ITEM HEADINGS

### Large Mega Menu Items (Desktop)
```html
<h3 class="font-semibold text-lg">
```

**Weight**: Semibold  
**Size**: 18px (text-lg)

### Small Mega Menu Items (Mobile)
```html
<h3 class="font-semibold text-sm leading-tight">
```

**Weight**: Semibold  
**Size**: 14px (text-sm)

### Mobile Nested Menu Items
```html
<h5 class="font-semibold text-xs leading-tight">
```

**Weight**: Semibold  
**Size**: 12px (text-xs)

### About Menu Items
```html
<h5 class="font-semibold text-sm text-gray-900 mb-1">
```

**Weight**: Semibold  
**Size**: 14px (text-sm)

---

## BODY TEXT STYLES

### Primary Body Text (STANDARD)
```html
<p class="text-base sm:text-lg font-inter text-gray-800 leading-relaxed">
```

**Font**: Inter  
**Color**: Dark Gray (#1F2937)  
**Sizes**:
- Mobile: 16px (text-base)
- SM+: 18px (text-lg)

**Used In**:
- Jamie Murray description
- What We Offer description
- About Us content
- Location CTA text
- Event CTA text
- Why We Love reasons
- Product card descriptions

**THIS IS YOUR STANDARD BODY TEXT SIZE** ✅

### Lead/Emphasized Text
```html
<p class="text-lg sm:text-xl font-inter font-semibold text-gray-900 leading-relaxed">
```

**Font**: Inter  
**Weight**: Semibold  
**Color**: Dark Gray  
**Sizes**:
- Mobile: 18px (text-lg)
- SM+: 20px (text-xl)

**Used In**: About Us first paragraph (emphasis)

### Small Body Text
```html
<p class="text-base font-inter text-gray-800 leading-relaxed">
```

**Font**: Inter  
**Size**: 16px (text-base) - All screens

**Used In**:
- Product card descriptions
- Accordion content (Tennis Holiday Experts)

### Card Metadata/Small Text
```html
<p class="text-sm text-gray-600 font-inter">
```

**Font**: Inter  
**Color**: Medium Gray (#4B5563)  
**Size**: 14px (text-sm) - All screens

**Used In**:
- Location card "From" label
- Event card "From" label
- Review dates
- Footer links and text

### Extra Small Text
```html
<p class="text-xs text-gray-500 font-inter">
```

**Font**: Inter  
**Color**: Light Gray (#6B7280)  
**Size**: 12px (text-xs)

**Used In**:
- "Based on 2 sharing" text
- Small disclaimers

---

## SPECIAL TEXT ELEMENTS

### Hero Subtitle/Tagline
```html
<p class="text-base sm:text-lg lg:text-xl font-inter text-white leading-relaxed">
```

**Font**: Inter  
**Color**: White  
**Sizes**:
- Mobile: 16px (text-base)
- SM: 18px (text-lg)
- LG: 20px (text-xl)

**Usage**: Hero section subtitle

### Price Display (Large)
```html
<p class="text-3xl font-bold text-[#ad986c] font-playfair">
  £1499<span class="text-lg">pp</span>
</p>
```

**Font**: Playfair Display  
**Weight**: Bold  
**Color**: Gold (#ad986c)  
**Sizes**: 30px main, 18px for "pp"

**Usage**: Event/Location card pricing

### Price Label
```html
<p class="text-sm text-gray-600 font-inter mb-1">From</p>
```

**Font**: Inter  
**Size**: 14px (text-sm)  
**Usage**: Label above price

### Status Badges
```html
<div class="... text-xs font-inter font-semibold">
```

**Font**: Inter  
**Weight**: Semibold  
**Size**: 12px (text-xs)

**Variants**:
- AVAILABLE: `bg-[#ad986c]/10 text-[#ad986c]`
- EARLY BIRD: `bg-green-50 text-green-700`
- LAST SPACES: `bg-amber-50 text-amber-700`
- POPULAR: `bg-blue-50 text-blue-700`

### Breadcrumb Navigation
```html
<!-- Links -->
<a class="text-gray-600 hover:text-[#ad986c] transition-colors">
<!-- Current page -->
<span class="text-gray-900 font-medium">
```

**Font**: Inter  
**Size**: 14px (text-sm)  
**Colors**: Gray-600 for links, Gray-900 for current

### Mobile Menu Items
```html
<!-- Top-level -->
<span class="text-lg font-semibold text-gray-900">
<!-- Sub-items -->
<a class="text-sm text-gray-700">
```

**Top-level**: 18px (text-lg)  
**Sub-items**: 14px (text-sm)

### Search Dropdowns (Mobile)
```html
<select class="... text-sm ...">
```

**Size**: 14px (text-sm)  
**Usage**: Product/Location/Month selectors

### Button Text
```html
<!-- Primary Buttons -->
<button class="text-base font-inter font-semibold">

<!-- Secondary/Small Buttons -->
<button class="text-sm font-inter font-medium">
```

**Primary**: 16px (text-base)  
**Secondary**: 14px (text-sm)

---

## COMPONENT-BY-COMPONENT BREAKDOWN

### 1. Hero Section
- **H1**: `text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-playfair font-bold text-white`
- **Subtitle**: `text-base sm:text-lg lg:text-xl font-inter text-white`
- **Search dropdowns**: `text-sm font-inter` (14px)
- **Search button**: `text-base font-inter font-semibold` (16px)

### 2. Locations Section
- **H2**: `text-2xl sm:text-3xl lg:text-4xl font-playfair font-semibold text-gray-900`
- **Subheading**: `text-base sm:text-lg lg:text-xl font-inter text-gray-800`
- **Card H3**: `text-xl font-playfair font-semibold text-gray-900`
- **Card description**: `text-base font-inter text-gray-800`
- **Price**: `text-3xl font-bold text-[#ad986c] font-playfair`
- **Price label**: `text-sm text-gray-600 font-inter`
- **Small print**: `text-xs text-gray-500 font-inter`
- **CTA H3**: `text-2xl sm:text-3xl font-playfair font-semibold`
- **CTA text**: `text-base sm:text-lg font-inter text-gray-800`

### 3. About Us (19+ Years)
- **H2**: `text-2xl sm:text-3xl lg:text-4xl font-playfair font-semibold text-gray-900`
- **Kicker**: `text-xs sm:text-sm font-inter font-semibold text-gold uppercase`
- **Lead paragraph**: `text-lg sm:text-xl font-inter font-semibold text-gray-900`
- **Body text**: `text-base sm:text-lg font-inter text-gray-800`

### 4. Jamie Murray Section
- **H2**: `text-2xl sm:text-3xl lg:text-4xl font-playfair font-semibold text-gray-900`
- **Body text**: `text-base sm:text-lg font-inter text-gray-800`
- **Button text**: `text-base font-inter font-semibold`

### 5. Events Section
- **H2**: `text-2xl sm:text-3xl lg:text-4xl font-playfair font-semibold text-gray-900`
- **Card H3**: `text-xl font-playfair font-semibold text-gray-900`
- **Badge**: `text-xs font-inter font-semibold`
- **Price**: `text-3xl font-bold text-[#ad986c] font-playfair`
- **Price label**: `text-sm text-gray-600 font-inter`
- **Small print**: `text-xs text-gray-500 font-inter`
- **CTA H3**: `text-2xl sm:text-3xl font-playfair font-semibold`
- **CTA text**: `text-base sm:text-lg font-inter text-gray-800`

### 6. Our Partners
- **H2**: `text-2xl sm:text-3xl lg:text-4xl font-playfair font-semibold text-gray-900 lg:text-center`

### 7. Racket Holiday Specialists
- **H2**: `text-2xl sm:text-3xl lg:text-4xl font-playfair font-semibold text-gray-900`
- **Card H3**: `text-xl font-playfair font-semibold text-gray-900`

### 8. Thriving Community
- **H2**: `text-2xl sm:text-3xl lg:text-4xl font-playfair font-semibold text-gray-900`
- **Body text**: `text-base sm:text-lg font-inter text-gray-800`

### 9. What We Offer
- **H2**: `text-2xl sm:text-3xl lg:text-4xl font-playfair font-semibold text-gray-900`
- **Description**: `text-base sm:text-lg font-inter text-gray-800`
- **Card H3**: `text-xl font-playfair font-semibold text-gray-900`
- **Card body**: `text-base font-inter text-gray-800` (16px all screens)
- **Button**: `text-sm sm:text-base font-inter font-medium`

### 10. Stories of Hope (Google Reviews)
- **H2**: `text-2xl sm:text-3xl lg:text-4xl font-playfair font-semibold text-gray-900`
- **Review name (H4)**: `text-base font-inter font-semibold text-gray-900` (16px)
- **Review date**: `text-sm font-inter text-gray-600` (14px)
- **Review text**: `text-sm font-inter text-gray-800` (14px)
- **Read more button**: `text-sm font-inter font-semibold text-[#ad986c]` (14px)

### 11. Our Blog
- **H2**: `text-2xl sm:text-3xl lg:text-4xl font-playfair font-semibold text-gray-900`
- **Card H3**: `text-xl font-playfair font-semibold text-gray-900`
- **Card description**: `text-base font-inter text-gray-800`
- **CTA H3**: `text-2xl sm:text-3xl font-playfair font-semibold`
- **CTA text**: `text-base sm:text-lg font-inter text-gray-800`

### 12. Instagram
- **H2**: `text-2xl sm:text-3xl lg:text-4xl font-playfair font-semibold text-gray-900`

### 13. Tennis Holiday Experts (Accordions)
- **H2**: `text-2xl sm:text-3xl lg:text-4xl font-playfair font-semibold text-gray-900 lg:text-center`
- **Accordion H3**: `text-base lg:text-lg font-inter font-medium text-gray-900` (16px→18px)
- **Accordion body**: `text-base font-inter text-gray-800` (16px all screens)

### 14. Footer
- **H3 Headings**: `text-base font-inter font-semibold text-white` (16px)
- **Contact info**: `text-sm font-inter text-gray-300` (14px)
- **Links**: `text-sm font-inter text-gray-300` (14px)
- **Newsletter inputs**: `text-sm` (14px)
- **Newsletter button**: `text-sm font-inter font-medium` (14px)
- **Copyright**: `text-sm font-inter text-gray-400` (14px)

---

## NAVIGATION & UI ELEMENTS

### Desktop Navigation (Top Bar)
- **Links**: `text-sm font-inter font-medium`
- **Size**: 14px

### Mobile Menu
- **Top-level items**: `text-lg font-semibold` (18px)
- **Category headers**: `text-sm font-bold uppercase` (14px)
- **Sub-links**: `text-sm text-gray-700` (14px)
- **Racket cards**: `text-xs font-semibold` (12px)
- **About items**: `text-sm font-semibold` (14px)
- **About descriptions**: `text-xs text-gray-600` (12px)
- **Action buttons**: `text-base font-semibold` (16px)
- **"Show more"**: `text-sm font-medium` (14px)

### Mega Menus (Desktop)
- **Category headers**: `text-sm font-semibold uppercase` (14px)
- **Large items**: `text-lg font-semibold` (18px)
- **Small items**: `text-sm font-semibold` (14px)
- **Descriptions**: `text-xs text-gray-600` (12px)

---

## FONT FAMILY RULES

### Use Playfair Display (Serif) For:
✅ All H1 headings  
✅ All H2 section headings  
✅ All H3 card/content headings (except footer & accordions)  
✅ Navigation menu category headings  
✅ Price amounts  

### Use Inter (Sans-serif) For:
✅ All body text  
✅ All UI text (buttons, labels, badges)  
✅ Footer headings  
✅ Accordion headers  
✅ Testimonial/review names  
✅ Navigation links  
✅ Form inputs  
✅ Mobile menu items  

---

## COLOR PALETTE

| Element | Color Class | Hex | Usage |
|---------|------------|-----|-------|
| Primary Headings | `text-gray-900` | #111827 | All headings |
| Primary Body | `text-gray-800` | #1F2937 | Main content |
| Secondary Text | `text-gray-600` | #4B5563 | Labels, metadata |
| Tertiary Text | `text-gray-500` | #6B7280 | Small print |
| Light Text | `text-gray-300` | #D1D5DB | Footer text |
| Hero White | `text-white` | #FFFFFF | Hero text |
| Gold Primary | `text-[#ad986c]` | #ad986c | Prices, accents, hover |
| Gold Dark | `text-[#8d7a56]` | #8d7a56 | Gold hover state |
| Success | `text-green-600` | #16A34A | Checkmarks |
| Warning | `text-amber-700` | #B45309 | Status badges |

---

## RESPONSIVE SIZE PATTERNS

### Desktop-First Approach
All sections use **mobile-first** responsive design:
- Base (mobile): Smallest size
- SM (640px): Medium size
- LG (1024px): Largest size

### Common Patterns:

**Section Headings**: `text-2xl sm:text-3xl lg:text-4xl` (24px → 30px → 36px)  
**Body Text**: `text-base sm:text-lg` (16px → 18px)  
**Card Headings**: `text-xl` (20px - no change)  
**Small Text**: `text-sm` (14px - no change)  
**Tiny Text**: `text-xs` (12px - no change)

---

## SPACING GUIDELINES

### Section Padding
```html
<section class="py-8 sm:py-16 lg:py-24">
```
**Standard**: 32px mobile → 64px tablet → 96px desktop

### Heading Margins

**Large sections**: `mb-6 sm:mb-8 lg:mb-16`  
**Standard sections**: `mb-4 sm:mb-6`  
**Compact sections**: `mb-1 sm:mb-2`  
**Card titles**: `mb-3` or `mb-2 sm:mb-4`

---

## IMPLEMENTATION CHECKLIST

### When Creating a New Section:

1. **Section Heading (H2)**:
   - Use: `text-2xl sm:text-3xl lg:text-4xl font-playfair font-semibold text-gray-900`
   - Add `text-center` if centered
   - Add `mb-6 sm:mb-8 lg:mb-16` for large spacing

2. **Body Text**:
   - Use: `text-base sm:text-lg font-inter text-gray-800 leading-relaxed`
   - This gives you 16px mobile → 18px tablet+

3. **Card Headings (H3)**:
   - Use: `text-xl font-playfair font-semibold text-gray-900 mb-3 group-hover:text-[#ad986c] transition-colors leading-tight`
   - This is consistent across ALL cards

4. **Small Text/Labels**:
   - Use: `text-sm font-inter text-gray-600`
   - This gives you 14px for metadata

5. **Buttons**:
   - Primary: `text-base font-inter font-semibold`
   - Secondary: `text-sm font-inter font-medium`

---

## ACCESSIBILITY NOTES

### Minimum Sizes:
- ✅ Body text: 16px minimum (text-base)
- ✅ Headings: 16px minimum
- ✅ UI elements: 14px minimum
- ⚠️  Small print: 12px (use sparingly)

### Contrast:
- ✅ Dark text on white: Excellent (Gray-900, Gray-800)
- ✅ White text on dark: Excellent
- ✅ Gold on white: Good (verified)

---

## CONSISTENCY RULES (CRITICAL)

### 1. Section Headings
**ALWAYS USE**: `text-2xl sm:text-3xl lg:text-4xl font-playfair font-semibold text-gray-900`

### 2. Body Text
**ALWAYS USE**: `text-base sm:text-lg font-inter text-gray-800 leading-relaxed`

### 3. Card Headings
**ALWAYS USE**: `text-xl font-playfair font-semibold text-gray-900`

### 4. Footer
**Headings**: `text-base font-inter font-semibold text-white` (16px)  
**Links**: `text-sm font-inter text-gray-300` (14px)

### 5. Accordions
**Headers**: `text-base lg:text-lg font-inter font-medium text-gray-900` (16px→18px)  
**Body**: `text-base font-inter text-gray-800` (16px)

### 6. Reviews/Testimonials
**Name**: `text-base font-inter font-semibold text-gray-900` (16px)  
**Text**: `text-sm font-inter text-gray-800` (14px)

### 7. Buttons
**Primary CTA**: `text-base font-inter font-semibold` (16px)  
**Secondary**: `text-sm font-inter font-medium` (14px)

---

## FINAL MASTER REFERENCE TABLE

| Element | Font | Weight | Mobile Size | Desktop Size | Color |
|---------|------|--------|-------------|--------------|-------|
| **HEADINGS** |
| Hero H1 | Playfair | Bold | 30px | 72px | White |
| Section H2 | Playfair | Semibold | 24px | 36px | Gray-900 |
| Card H3 | Playfair | Semibold | 20px | 20px | Gray-900 |
| CTA Card H3 | Playfair | Semibold | 24px | 30px | Gray-900 |
| Footer H3 | Inter | Semibold | 16px | 16px | White |
| Accordion H3 | Inter | Medium | 16px | 18px | Gray-900 |
| Review Name H4 | Inter | Semibold | 16px | 16px | Gray-900 |
| **BODY TEXT** |
| Primary Body | Inter | Regular | 16px | 18px | Gray-800 |
| Lead Text | Inter | Semibold | 18px | 20px | Gray-900 |
| Accordion Body | Inter | Regular | 16px | 16px | Gray-800 |
| Card Description | Inter | Regular | 16px | 16px | Gray-800 |
| Review Text | Inter | Regular | 14px | 14px | Gray-800 |
| **UI ELEMENTS** |
| Footer Links | Inter | Regular | 14px | 14px | Gray-300 |
| Labels/Metadata | Inter | Regular | 14px | 14px | Gray-600 |
| Badges | Inter | Semibold | 12px | 12px | Various |
| Small Print | Inter | Regular | 12px | 12px | Gray-500 |
| Primary Button | Inter | Semibold | 16px | 16px | White |
| Secondary Button | Inter | Medium | 14px | 14px | White |
| Menu Items | Inter | Semibold | 18px | 18px | Gray-900 |
| Sub-menu Links | Inter | Regular | 14px | 14px | Gray-700 |
| Search Inputs | Inter | Regular | 14px | 14px | White |

---

## DO'S AND DON'TS

### ✅ DO:
- Use Playfair for all editorial/marketing headings
- Use Inter for all body text and UI elements
- Maintain 16px minimum for body text
- Use consistent spacing patterns
- Add hover states to interactive elements
- Use responsive text sizing (mobile → desktop)

### ❌ DON'T:
- Mix fonts within the same element type
- Use text smaller than 12px
- Skip responsive sizing for headings
- Use Playfair for body text or UI elements
- Use bold weight for body text (use semibold for emphasis)
- Use different card heading sizes

---

## QUICK COPY-PASTE TEMPLATES

### New Section Template
```html
<section class="w-full bg-white py-8 sm:py-16 lg:py-24">
  <div class="container mx-auto max-w-[1400px] px-4 sm:px-10">
    <h2 class="text-2xl sm:text-3xl lg:text-4xl font-playfair font-semibold text-gray-900 mb-6 sm:mb-8 lg:mb-16">
      Section Title
    </h2>
    <p class="text-base sm:text-lg font-inter text-gray-800 leading-relaxed">
      Body text goes here.
    </p>
  </div>
</section>
```

### Card Template
```html
<div class="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
  <div class="p-6">
    <h3 class="text-xl font-playfair font-semibold text-gray-900 mb-3 group-hover:text-[#ad986c] transition-colors leading-tight">
      Card Title
    </h3>
    <p class="text-base font-inter text-gray-800 leading-relaxed mb-4">
      Card description text.
    </p>
    <a href="#" class="text-base font-inter font-semibold text-[#ad986c] hover:text-[#8d7a56]">
      Learn More →
    </a>
  </div>
</div>
```

### Accordion Template
```html
<div class="accordion">
  <button class="accordion-header">
    <h3 class="text-base lg:text-lg font-inter font-medium text-gray-900 pr-4">
      Question or Title
    </h3>
  </button>
  <div class="accordion-content">
    <div class="text-base font-inter text-gray-800 leading-relaxed">
      Answer or content goes here.
    </div>
  </div>
</div>
```

---

## VERSION HISTORY

**Last Updated**: Current Implementation  
**Reviewed**: All homepage components audited  
**Status**: FINAL - Use this as the single source of truth

---

*This is the authoritative typography guide for Active Away. All new sections, components, and pages should reference this document.*

