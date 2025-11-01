# Tennis Holiday Page - Complete Style Guide

This document outlines all heading and body text styles used on the Tennis Holiday detail pages for consistent implementation.

---

## H1 - Hero Heading

### Style Pattern
```html
<h1 class="text-4xl sm:text-5xl lg:text-7xl font-playfair font-bold text-white mb-6 sm:mb-8 leading-tight max-w-4xl">
```

**Font**: Playfair Display  
**Weight**: Bold (font-bold)  
**Color**: White (text-white)  
**Alignment**: Center  
**Max Width**: max-w-4xl (896px)  
**Responsive Sizes**:
- Mobile: text-4xl (36px)
- SM: text-5xl (48px)
- LG: text-7xl (72px)

**Section**: Hero Header  
**Example**: "5* Sani Beach"

---

## H2 - Section Headings

### Style Pattern 1: Standard Section Heading (Left/Center)
```html
<h2 class="text-2xl sm:text-3xl lg:text-4xl font-playfair font-semibold text-gray-900">
```

**Font**: Playfair Display  
**Weight**: Semibold (font-semibold)  
**Color**: Dark Gray (text-gray-900)  
**Responsive Sizes**:
- Mobile: text-2xl (24px)
- SM: text-3xl (30px)
- LG: text-4xl (36px)

**Used In**:
- The Tennis (Carousel section)
- Resort Information
- ROOMS (side heading)

### Style Pattern 2: Section Heading with Center + Margin
```html
<h2 class="text-2xl sm:text-3xl lg:text-4xl font-playfair font-semibold text-gray-900 mb-8 sm:mb-12 text-center">
```

**Additional**:
- Center aligned (text-center)
- Bottom margin: mb-8 sm:mb-12

**Used In**:
- Itinerary
- Dates & Prices
- FAQs
- Resort Information

### Style Pattern 3: Gallery Heading (Larger)
```html
<h2 class="text-3xl sm:text-4xl font-playfair font-semibold text-gray-900 text-center">
```

**Responsive Sizes**:
- Mobile: text-3xl (30px)
- SM: text-4xl (36px)

**Section**: Gallery

### Style Pattern 4: ROOMS Heading (Left-aligned)
```html
<h2 class="text-2xl sm:text-3xl lg:text-4xl font-playfair font-semibold text-gray-900 mb-4">
```

**Additional**: 
- Smaller bottom margin (mb-4)

**Section**: Rooms (sidebar heading)

---

## H3 - Subsection Headings

### Style Pattern 1: Large Subsection (What's Included/Not Included)
```html
<h3 class="text-2xl sm:text-3xl lg:text-4xl font-playfair font-semibold text-gray-900 mb-6">
```

**Font**: Playfair Display  
**Weight**: Semibold (font-semibold)  
**Color**: Dark Gray (text-gray-900)  
**Responsive Sizes**:
- Mobile: text-2xl (24px)
- SM: text-3xl (30px)
- LG: text-4xl (36px)

**Used In**:
- What's Included
- What's Not Included
- Why We Love [Venue]

### Style Pattern 2: Card Headings (Tennis Carousel)
```html
<h3 class="text-2xl sm:text-3xl font-playfair font-semibold text-gray-900 mb-3 sm:mb-4 leading-tight">
```

**Font**: Playfair Display  
**Weight**: Semibold (font-semibold)  
**Color**: Dark Gray (text-gray-900)  
**Responsive Sizes**:
- Mobile: text-2xl (24px)
- SM: text-3xl (30px)

**Used In**:
- The Jamie Murray Tennis Programme
- A Tennis Holiday in Action
- The Active Away Experience

**Examples**:
- "The Jamie Murray Tennis Programme"
- "A Tennis Holiday in Action"
- "The Active Away Experience"

### Style Pattern 3: Room Card Titles
```html
<h3 class="text-xl font-playfair font-semibold text-gray-900 mb-2 leading-tight uppercase">
```

**Font**: Playfair Display  
**Weight**: Semibold (font-semibold)  
**Color**: Dark Gray (text-gray-900)  
**Size**: text-xl (20px)  
**Style**: UPPERCASE

**Section**: Room cards  
**Example**: "DOUBLE/TWIN ROOM GARDEN VIEW"

### Style Pattern 4: Event Card Date Headings
```html
<h3 class="text-base sm:text-lg font-playfair font-semibold text-gray-900 mb-4">
```

**Font**: Playfair Display  
**Weight**: Semibold (font-semibold)  
**Color**: Dark Gray (text-gray-900)  
**Responsive Sizes**:
- Mobile: text-base (16px)
- SM: text-lg (18px)

**Section**: Dates & Prices cards  
**Example**: "Sat 16 May - Sat 23 May 2026"

### Style Pattern 5: Itinerary Day Headings
```html
<h3 class="text-base sm:text-lg font-playfair font-semibold text-gray-900">
```

**Font**: Playfair Display  
**Weight**: Semibold (font-semibold)  
**Color**: Dark Gray (text-gray-900)  
**Responsive Sizes**:
- Mobile: text-base (16px)
- SM: text-lg (18px)

**Section**: Itinerary accordion headers  
**Example**: "Day 1", "Day 2", etc.

### Style Pattern 6: FAQ Questions
```html
<h3 class="text-base sm:text-lg font-playfair font-semibold text-gray-900 pr-4 flex-1">
```

**Font**: Playfair Display  
**Weight**: Semibold (font-semibold)  
**Color**: Dark Gray (text-gray-900)  
**Responsive Sizes**:
- Mobile: text-base (16px)
- SM: text-lg (18px)

**Section**: FAQs accordion headers  
**Example**: FAQ questions

### Style Pattern 7: Fallback Room Heading
```html
<h3 class="text-xl font-playfair font-semibold text-gray-900 mb-2">
```

**Font**: Playfair Display  
**Weight**: Semibold (font-semibold)  
**Color**: Dark Gray (text-gray-900)  
**Size**: text-xl (20px)

**Section**: Room Options fallback

---

## Body Text Styles

### Style Pattern 1: Hero Subtitle
```html
<p class="text-lg sm:text-xl lg:text-2xl font-inter text-gray-100 max-w-3xl leading-relaxed">
```

**Font**: Inter  
**Color**: Light Gray (text-gray-100)  
**Max Width**: max-w-3xl (768px)  
**Responsive Sizes**:
- Mobile: text-lg (18px)
- SM: text-xl (20px)
- LG: text-2xl (24px)

**Section**: Hero subtitle  
**Example**: "From First Serve to Final Sunset - Discover the Magic of Sani Beach!"

### Style Pattern 2: Primary Body Text
```html
<p class="text-base sm:text-lg font-inter text-gray-800 leading-relaxed">
```

**Font**: Inter  
**Color**: Medium Dark Gray (text-gray-800)  
**Responsive Sizes**:
- Mobile: text-base (16px)
- SM: text-lg (18px)

**Used In**:
- Main content area (prose)
- Tennis carousel cards
- Why We Love reasons
- What's Included/Not Included items
- Room descriptions
- Rooms subheading
- CTA descriptions

**Most Common Body Text Style** ✅

### Style Pattern 3: Secondary Body Text (Lighter)
```html
<p class="text-base sm:text-lg text-gray-600 font-inter leading-relaxed">
```

**Font**: Inter  
**Color**: Light Gray (text-gray-600)  
**Responsive Sizes**:
- Mobile: text-base (16px)
- SM: text-lg (18px)

**Used In**:
- Tennis carousel disclaimer text
- Secondary information

### Style Pattern 4: Key Information Labels
```html
<p class="text-sm font-medium text-gray-900 font-inter">
```

**Font**: Inter  
**Weight**: Medium (font-medium)  
**Color**: Dark Gray (text-gray-900)  
**Size**: text-sm (14px)

**Section**: Sidebar key information (labels)  
**Examples**:
- "Our Rating"
- "Tennis Courts"
- "Board Basis"
- "Pricing"

### Style Pattern 5: Key Information Values
```html
<p class="text-sm text-gray-600 font-inter">
```

**Font**: Inter  
**Color**: Medium Gray (text-gray-600)  
**Size**: text-sm (14px)

**Section**: Sidebar key information (values)  
**Examples**:
- "5/5 Stars"
- "Red Clay Courts"
- "Full Board + €100 Resort Credit"

### Style Pattern 6: Rating Bar Labels
```html
<p class="text-sm font-medium text-gray-700 font-inter">
```

**Font**: Inter  
**Weight**: Medium (font-medium)  
**Color**: Gray (text-gray-700)  
**Size**: text-sm (14px)

**Section**: Rating bars in sidebar  
**Examples**:
- "Guest Rating"
- "Tennis Courts"
- "Dining Experience"

### Style Pattern 7: Rating Values
```html
<p class="text-sm font-bold text-[#ad986c] font-inter">
```

**Font**: Inter  
**Weight**: Bold (font-bold)  
**Color**: Gold (#ad986c)  
**Size**: text-sm (14px)

**Section**: Rating bar scores  
**Examples**: "9/10", "10/10"

### Style Pattern 8: Room Metadata
```html
<div class="flex items-center gap-4 mb-4 text-sm text-gray-600 font-inter">
```

**Font**: Inter  
**Color**: Medium Gray (text-gray-600)  
**Size**: text-sm (14px)

**Section**: Room size and bed config  
**Example**: "25m2 • Double or Twin"

### Style Pattern 9: Event Card Labels
```html
<p class="text-sm text-gray-600 font-inter mb-1">
```

**Font**: Inter  
**Color**: Medium Gray (text-gray-600)  
**Size**: text-sm (14px)

**Section**: Dates & Prices cards (label)  
**Example**: "From"

### Style Pattern 10: Event Card Small Print
```html
<p class="text-xs text-gray-500 font-inter mt-1">
```

**Font**: Inter  
**Color**: Light Gray (text-gray-500)  
**Size**: text-xs (12px)

**Section**: Dates & Prices cards (disclaimer)  
**Example**: "Based on 2 sharing"

### Style Pattern 11: Breadcrumb Navigation
```html
<nav class="flex items-center gap-2 text-sm font-inter min-w-0">
```

**Font**: Inter  
**Size**: text-sm (14px)  
**Colors**: 
- Links: text-gray-600 (hover: text-[#ad986c])
- Current: text-gray-900 font-medium

**Section**: Breadcrumb navigation

### Style Pattern 12: Tab Navigation Buttons
```html
<button class="page-nav-tab px-6 py-3 text-sm font-medium font-inter rounded-full">
```

**Font**: Inter  
**Weight**: Medium (font-medium)  
**Size**: text-sm (14px)

**Section**: Sticky navigation tabs  
**Examples**: "Info", "Itinerary", "Resort Information", "FAQs"

### Style Pattern 13: Facility Tab Buttons
```html
<button class="facility-tab px-6 py-3 text-sm font-medium font-inter">
```

**Font**: Inter  
**Weight**: Medium (font-medium)  
**Size**: text-sm (14px)

**Section**: Resort Information tabs  
**Examples**: "Restaurants & bars", "Board", "Setting", "Tennis Courts"

### Style Pattern 14: Badge/Status Tags
```html
<div class="inline-block bg-[#ad986c]/10 text-[#ad986c] px-3 py-1 rounded-full text-xs font-inter font-semibold">
```

**Font**: Inter  
**Weight**: Semibold (font-semibold)  
**Size**: text-xs (12px)  
**Variants**:
- AVAILABLE: bg-[#ad986c]/10 text-[#ad986c]
- EARLY BIRD: bg-green-50 text-green-700
- LAST SPACES: bg-amber-50 text-amber-700
- POPULAR: bg-blue-50 text-blue-700

**Section**: Event cards status badges

### Style Pattern 15: Hero Kicker Text
```html
<div class="text-xs sm:text-sm font-inter font-semibold text-gold tracking-[0.2em] uppercase mb-4 sm:mb-6 border-t border-b border-gold/50 py-2 px-6">
```

**Font**: Inter  
**Weight**: Semibold (font-semibold)  
**Color**: Gold (text-gold)  
**Responsive Sizes**:
- Mobile: text-xs (12px)
- SM: text-sm (14px)
**Style**: UPPERCASE with extra letter spacing

**Section**: Hero kicker (above H1)  
**Example**: "HALKIDIKI, GREECE"

### Style Pattern 16: View More/Gallery Button
```html
<span class="text-sm font-inter font-semibold text-gray-900">
```

**Font**: Inter  
**Weight**: Semibold (font-semibold)  
**Color**: Dark Gray (text-gray-900)  
**Size**: text-sm (14px)

**Section**: Room gallery "View More" overlay  
**Example**: "View More (3)"

---

## Special Text Elements

### Price Display (Large)
```html
<p class="text-3xl font-bold text-[#ad986c] font-playfair">
  £1499<span class="text-lg">pp</span>
</p>
```

**Font**: Playfair Display  
**Weight**: Bold (font-bold)  
**Color**: Gold (#ad986c)  
**Size**: text-3xl (30px) with smaller "pp" (text-lg)

**Section**: Event cards, pricing displays

### Prose Content (Markdown)
```html
<div class="prose max-w-none font-inter" set:html={marked.parse(content)}>
```

**Font**: Inter  
**Max Width**: max-w-none (full width)  
**Styling**: Uses global prose styles from global.css

**Used In**:
- belowHeadingText (main description)
- Itinerary accordion content
- FAQ answers
- Resort tab content (restaurants, board, setting, etc.)

Global prose defaults:
- Paragraphs: text-base sm:text-lg (16px → 18px)
- Links: text-[#ad986c] with hover underline
- Strong: text-gray-900 font-semibold
- Lists: Disc/decimal with proper spacing

---

## Section-by-Section Breakdown

### 1. Hero Section
- **Kicker**: text-xs sm:text-sm, Inter, Gold, UPPERCASE
- **H1**: text-4xl sm:text-5xl lg:text-7xl, Playfair Bold, White
- **Subtitle**: text-lg sm:text-xl lg:text-2xl, Inter, Gray-100

### 2. Breadcrumb
- **Text**: text-sm, Inter
- **Links**: text-gray-600 → hover:text-[#ad986c]
- **Current**: text-gray-900 font-medium

### 3. Sticky Navigation
- **Tabs**: text-sm font-medium, Inter

### 4. Info Section (Main Content)
- **Body Text**: prose max-w-none font-inter (text-base sm:text-lg)
- **Why We Love H3**: text-2xl sm:text-3xl, Playfair Semibold
- **Why We Love Items**: text-base sm:text-lg, Inter

### 5. Sidebar (Key Information)
- **Labels**: text-sm font-medium, Inter, Gray-900
- **Values**: text-sm, Inter, Gray-600
- **Rating Labels**: text-sm font-medium, Inter, Gray-700
- **Rating Values**: text-sm font-bold, Inter, Gold

### 6. Gallery Section
- **H2**: text-3xl sm:text-4xl, Playfair Semibold, Centered

### 7. The Tennis Carousel
- **Section H2**: text-2xl sm:text-3xl lg:text-4xl, Playfair Semibold, Centered
- **Card H3**: text-2xl sm:text-3xl, Playfair Semibold
- **Card Body**: text-base sm:text-lg, Inter, Gray-800

### 8. Resort Information
- **Section H2**: text-2xl sm:text-3xl lg:text-4xl, Playfair Semibold, Centered
- **Tab Buttons**: text-sm font-medium, Inter
- **Content**: prose max-w-none font-inter

### 9. What's Included/Not Included
- **H3**: text-2xl sm:text-3xl lg:text-4xl, Playfair Semibold
- **List Items**: text-base sm:text-lg, Inter

### 10. Rooms Section
- **H2**: text-2xl sm:text-3xl lg:text-4xl, Playfair Semibold
- **Subheading**: text-base sm:text-lg, Inter
- **Room H3**: text-xl, Playfair Semibold, UPPERCASE
- **Room Metadata**: text-sm, Inter, Gray-600
- **Room Description**: text-base sm:text-lg, Inter

### 11. Itinerary Section
- **Section H2**: text-2xl sm:text-3xl lg:text-4xl, Playfair Semibold, Centered
- **Day Number**: text-base font-bold, Playfair, White (in circle)
- **Day H3**: text-base sm:text-lg, Playfair Semibold
- **Content**: prose max-w-none font-inter

### 12. Dates & Prices Section
- **Section H2**: text-2xl sm:text-3xl lg:text-4xl, Playfair Semibold, Centered
- **Status Badges**: text-xs font-semibold, Inter
- **Event H3**: text-base sm:text-lg, Playfair Semibold
- **Price**: text-3xl font-bold, Playfair, Gold
- **Labels**: text-sm, Inter, Gray-600
- **Small Print**: text-xs, Inter, Gray-500
- **CTA Text**: text-base sm:text-lg, Inter

### 13. FAQs Section
- **Section H2**: text-2xl sm:text-3xl lg:text-4xl, Playfair Semibold, Centered
- **Question H3**: text-base sm:text-lg, Playfair Semibold
- **Answer**: prose max-w-none font-inter

---

## Quick Reference Table

| Element | Font | Weight | Size Pattern | Color | Section |
|---------|------|--------|--------------|-------|---------|
| Hero H1 | Playfair | Bold | 4xl→5xl→7xl | White | Hero |
| Hero Kicker | Inter | Semibold | xs→sm | Gold | Hero |
| Hero Subtitle | Inter | Regular | lg→xl→2xl | Gray-100 | Hero |
| Section H2 | Playfair | Semibold | 2xl→3xl→4xl | Gray-900 | All Sections |
| Gallery H2 | Playfair | Semibold | 3xl→4xl | Gray-900 | Gallery |
| Subsection H3 | Playfair | Semibold | 2xl→3xl→4xl | Gray-900 | What's Included |
| Tennis Card H3 | Playfair | Semibold | 2xl→3xl | Gray-900 | Tennis Carousel |
| Room Card H3 | Playfair | Semibold | xl | Gray-900 | Rooms |
| Event Date H3 | Playfair | Semibold | base→lg | Gray-900 | Dates |
| Itinerary H3 | Playfair | Semibold | base→lg | Gray-900 | Itinerary |
| FAQ H3 | Playfair | Semibold | base→lg | Gray-900 | FAQs |
| Primary Body | Inter | Regular | base→lg | Gray-800 | All |
| Secondary Body | Inter | Regular | base→lg | Gray-600 | All |
| Sidebar Label | Inter | Medium | sm | Gray-900 | Sidebar |
| Sidebar Value | Inter | Regular | sm | Gray-600 | Sidebar |
| Room Meta | Inter | Regular | sm | Gray-600 | Rooms |
| Badge Text | Inter | Semibold | xs | Various | Events |
| Breadcrumb | Inter | Regular/Medium | sm | Gray-600/900 | Navigation |
| Tab Button | Inter | Medium | sm | Gray-900 | Navigation |

---

## Consistency Rules

### 1. **Section Headings (H2)**
- **Always use**: `text-2xl sm:text-3xl lg:text-4xl font-playfair font-semibold text-gray-900`
- Add `text-center` for centered sections
- Add `mb-8 sm:mb-12` for sections with content below

### 2. **Body Text**
- **Primary**: `text-base sm:text-lg font-inter text-gray-800 leading-relaxed`
- **Secondary/Lighter**: Use `text-gray-600` instead of `text-gray-800`

### 3. **Card Titles**
- **Large Cards** (Tennis): `text-2xl sm:text-3xl font-playfair font-semibold`
- **Room Cards**: `text-xl font-playfair font-semibold uppercase`
- **Event Cards**: `text-base sm:text-lg font-playfair font-semibold`

### 4. **Accordion Headers**
- **Itinerary/FAQs**: `text-base sm:text-lg font-playfair font-semibold text-gray-900`

### 5. **Small UI Text**
- **Labels**: `text-sm font-medium text-gray-900`
- **Values**: `text-sm text-gray-600`
- **Badges**: `text-xs font-semibold`

### 6. **Font Selection**
- **Playfair**: All headings (H1-H3), prices, day numbers
- **Inter**: All body text, labels, navigation, badges

### 7. **Prose Content**
- Always wrap markdown content in: `<div class="prose max-w-none font-inter" set:html={marked.parse(content)}>`
- Uses global.css prose styles for consistent typography

---

## Color Reference

| Usage | Class | Hex | Notes |
|-------|-------|-----|-------|
| Primary Headings | `text-gray-900` | #111827 | Almost black |
| Primary Body | `text-gray-800` | #1F2937 | Dark gray |
| Secondary Body | `text-gray-600` | #4B5563 | Medium gray |
| Tertiary Text | `text-gray-500` | #6B7280 | Light gray |
| Hero Text | `text-white` | #FFFFFF | White |
| Hero Subtitle | `text-gray-100` | #F3F4F6 | Light gray on dark |
| Gold Accent | `text-[#ad986c]` | #ad986c | Prices, ratings, CTAs |
| Gold Hover | `hover:bg-[#8d7a56]` | #8d7a56 | Darker gold |
| Success | `text-green-600` | #16A34A | What's Included |
| Error | `text-red-600` | #DC2626 | What's Not Included |

---

*Last Updated: Based on current Tennis Holiday page implementation*

