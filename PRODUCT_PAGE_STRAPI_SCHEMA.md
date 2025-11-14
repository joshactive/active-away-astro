# Product Page Strapi Content Type Schema

## Content Type: `product-page`

### API ID: `product-page`
### Display Name: Product Page
### Description: Dynamic product category pages (Adult Tennis Holidays, Padel Holidays, etc.)

---

## Fields Configuration

### Basic Fields

#### 1. slug (Text)
- **Type**: Text (Short text)
- **Required**: Yes
- **Unique**: Yes
- **Description**: URL slug for the product page (e.g., "adult-only-tennis-holidays")

#### 2. title (Text)
- **Type**: Text (Short text)
- **Required**: Yes
- **Description**: Page title (e.g., "Tennis Holidays for Adults.")

#### 3. category (Enumeration)
- **Type**: Enumeration
- **Values**:
  - `adult-tennis`
  - `padel`
  - `pickleball`
  - `junior-camp`
  - `ski`
  - `play-and-watch`
  - `school-tour`
  - `tennis-clinic`
  - `tennis-academy`
- **Required**: Yes
- **Description**: Product category type

#### 4. displayOnFrontEnd (Boolean)
- **Type**: Boolean
- **Default**: true
- **Description**: Show/hide this page on the frontend

---

## Component Fields

### 5. hero (Component: `sections.product-hero`)

Create a new component `sections.product-hero` with these fields:

- **kicker** (Text) - Short text above heading (e.g., "ADULT ONLY TENNIS HOLIDAYS")
- **heading** (Text) - Main page heading
- **subheading** (Rich Text - Markdown) - Description text below heading
- **backgroundImage** (Single Media) - Hero background image
- **heroImages** (Multiple Media) - Optional carousel images (for future use)

### 6. quote (Component: `sections.quote-section`)

Create a new component `sections.quote-section` with these fields:

- **eyebrow** (Text) - Small text above quote (e.g., "SINCE 2006")
- **quoteText** (Rich Text - Markdown) - The main quote text
- **authorName** (Text) - Quote author (e.g., "JAMIE MURRAY")
- **authorImages** (Multiple Media) - Small circular profile images
- **decorativeIcon** (Single Media) - Optional quote marks icon

### 7. jamieMurray (Component: `sections.jamie-murray-programme`)

Create a new component `sections.jamie-murray-programme` with these fields:

- **title** (Text) - Section heading
- **description** (Rich Text - Markdown) - Programme description
- **buttonText** (Text) - CTA button text (e.g., "Learn More")
- **videoUrl** (Text) - YouTube video URL (optional)
- **image** (Single Media) - Fallback image if no video (optional)
- **achievements** (Repeatable Component `sections.achievement-item`):
  - **text** (Text) - Achievement text (e.g., "7 Grand Slam Wins")
  - **icon** (Text) - Icon identifier or arrow

### 8. twoColumnContent (Component: `sections.two-column-content`)

Create a new component `sections.two-column-content` with these fields:

- **eyebrow** (Text) - Optional text above section
- **leftBlock** (Component: `sections.content-block`)
  - **heading** (Text) - Block heading (e.g., "Hosting")
  - **content** (Rich Text) - Block text content
  - **image** (Single Media) - Block image
  - **imagePosition** (Enumeration: top/bottom) - Where image appears
- **rightBlock** (Component: `sections.content-block`)
  - **heading** (Text) - Block heading (e.g., "Tennis Standards")
  - **content** (Rich Text) - Block text content
  - **image** (Single Media) - Block image
  - **imagePosition** (Enumeration: top/bottom) - Where image appears

### 9. schedule (Component: `sections.schedule-table`)

Create a new component `sections.schedule-table` with these fields:

- **heading** (Text) - Optional section heading
- **scheduleRows** (Repeatable Component `sections.schedule-row`):
  - **day** (Text) - Day name (e.g., "Saturday", "Sunday", "Monday")
  - **morning** (Rich Text - Markdown) - Morning activities
  - **afternoon** (Rich Text - Markdown) - Afternoon activities
  - **evening** (Rich Text - Markdown) - Evening activities

### 10. discount (Component: `sections.discount-cta`)

Create a new component `sections.discount-cta` with these fields:

- **eyebrow** (Text) - Small text above heading (e.g., "DISCOUNT")
- **heading** (Text) - Main CTA heading
- **description** (Rich Text - Markdown) - CTA description
- **buttonText** (Text) - Button text (e.g., "Access Discount")
- **buttonLink** (Text) - Button URL/link
- **backgroundImage** (Single Media) - Background image for the section

### 11. faq (Component: `sections.faq-section`)

Create a new component `sections.faq-section` with these fields:

- **eyebrow** (Text) - Small text above heading (e.g., "OTHER INFORMATION")
- **heading** (Text) - Section heading (e.g., "Adult Tennis Holidays in 2025")
- **faqs** (Repeatable Component `sections.faq-item`):
  - **question** (Text) - FAQ question
  - **answer** (Rich Text - Markdown) - FAQ answer

### 12. destinations (Component: `sections.destinations-config`)

Create a new component `sections.destinations-config` with these fields:

- **showDestinations** (Boolean) - Enable/disable destinations section
- **heading** (Text) - Optional custom heading (defaults to "Explore our Locations")
- **eyebrow** (Text) - Optional custom eyebrow text (defaults to "DESTINATIONS")
- **featuredLocationSlugs** (JSON or Text - Multiple) - Optional: specific location slugs to feature (leave empty to show all featured locations)

### 12. seo (Component: `shared.seo`)

Use existing SEO component with these fields:

- **metaTitle** (Text)
- **metaDescription** (Text)
- **metaImage** (Single Media)
- **metaImageAlt** (Text)
- **metaImageWidth** (Number)
- **metaImageHeight** (Number)
- **keywords** (Text)
- **canonicalURL** (Text)

---

## Component Creation Order

1. Create `sections.schedule-row` (nested component)
2. Create `sections.faq-item` (nested component)
3. Create `sections.achievement-item` (nested component)
4. Create `sections.product-hero` (uses backgroundImage and heroImages)
5. Create `sections.quote-section` (uses authorImages and decorativeIcon)
6. Create `sections.jamie-murray-programme` (uses achievements repeatable)
7. Create `sections.schedule-table` (uses scheduleRows repeatable)
8. Create `sections.discount-cta` (uses backgroundImage)
9. Create `sections.faq-section` (uses faqs repeatable)
10. Create `sections.destinations-config` (simple config)

---

## Example Data Structure (JSON)

```json
{
  "slug": "adult-only-tennis-holidays",
  "title": "Tennis Holidays for Adults.",
  "category": "adult-tennis",
  "displayOnFrontEnd": true,
  "hero": {
    "kicker": "ADULT ONLY TENNIS HOLIDAYS",
    "heading": "Tennis Holidays for Adults",
    "subheading": "Unique Racket Experiences that unite like-minded individuals, through impeccable service delivered by truly knowledgeable hosts in excellent locations.",
    "backgroundImage": { "url": "..." },
    "heroImages": []
  },
  "quote": {
    "eyebrow": "SINCE 2006",
    "quoteText": "\"I'm delighted to design the Tennis Programme on all Active Away Adult Tennis Holidays.\"",
    "authorName": "JAMIE MURRAY",
    "authorImages": [
      { "url": "..." },
      { "url": "..." },
      { "url": "..." }
    ],
    "decorativeIcon": { "url": "..." }
  },
  "jamieMurray": {
    "title": "THE JAMIE MURRAY TENNIS PROGRAMME",
    "description": "Designed to make adults more skilled and self assured doubles players...",
    "buttonText": "Learn More",
    "videoUrl": "",
    "image": { "url": "..." },
    "achievements": [
      { "text": "7 Grand Slam Wins", "icon": "arrow" },
      { "text": "Davis Cup Champion", "icon": "arrow" }
    ]
  },
  "schedule": {
    "heading": "",
    "scheduleRows": [
      {
        "day": "Sunday",
        "morning": "09:30 - 09:45 - Welcome Meeting...",
        "afternoon": "13:00 - Lunch...",
        "evening": "20:00 - Meet - in the Sentida Bar"
      }
    ]
  },
  "discount": {
    "eyebrow": "DISCOUNT",
    "heading": "Access an Instant Adult Tennis Holiday Discount",
    "description": "Sign up today and receive an exclusive discount code...",
    "buttonText": "Access Discount",
    "buttonLink": "/newsletter",
    "backgroundImage": { "url": "..." }
  },
  "faq": {
    "eyebrow": "OTHER INFORMATION",
    "heading": "Adult Tennis Holidays in 2025",
    "faqs": [
      {
        "question": "What is a hosted Adult Tennis Holiday?",
        "answer": "A hosted Adult Tennis Holiday is..."
      }
    ]
  },
  "destinations": {
    "showDestinations": true,
    "heading": "Explore our Locations",
    "eyebrow": "DESTINATIONS",
    "featuredLocationSlugs": []
  },
  "seo": {
    "metaTitle": "Adult Tennis Holidays | Active Away",
    "metaDescription": "...",
    "canonicalURL": "https://activeaway.com/adult-only-tennis-holidays"
  }
}
```

---

## Notes

- All Rich Text fields should support Markdown
- Media fields should support standard Strapi image formats
- Repeatable components allow for flexible content management
- The destinations section reuses the existing `LocationsTailwind` component
- Testimonials section reuses the existing `StoriesOfHopeTailwind` component (no config needed)
- Partners section reuses the existing `OurPartnersTailwind` component (no config needed)

