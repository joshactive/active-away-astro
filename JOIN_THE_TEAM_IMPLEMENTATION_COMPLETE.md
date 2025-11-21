# Join The Team Page - Implementation Complete ✅

## Summary

The `/join-the-team` page has been successfully created with hero section, quote, two-column content, values display, CTA section, application form, and FAQs - all manageable through Strapi.

---

## 📦 What Was Built

### Strapi Backend (4 files):
- ✅ `join-the-team-page` single type schema with all sections
- ✅ Controller, service, and routes files for the API

**Location**: `/Users/joshuathompson/strapi/strapi/src/api/join-the-team-page/`

### Astro Frontend (3 files):
- ✅ `getJoinTheTeamPage()` and `getJoinTheTeamPageSEO()` utility functions in `src/utils/strapi.js`
- ✅ `src/pages/join-the-team.astro` - Main page component
- ✅ `src/components/OurValuesTailwind.astro` - Values display component

---

## 🎯 Features Implemented

### Page Sections

#### 1. Page Hero
- Hero image with overlay
- Kicker text (eyebrow)
- Main heading
- Subtitle text
- Breadcrumbs toggle

#### 2. Quote Section
- Inspirational quote text
- Quote author name and role
- Optional decorative elements

#### 3. Two-Column Content
- Side-by-side content blocks
- Left and right images
- Individual headings and rich text content

#### 4. Our Values Section
- Repeatable value cards
- Custom eyebrow text (default: "WHY JOIN US")
- Custom section heading (default: "Our Values")
- Each value has:
  - Title
  - Description

#### 5. Learn About Us CTA
- Call-to-action section
- Image, heading, and description
- Button with custom text and URL
- Uses the `DiscountCTATailwind` component

#### 6. Application Form
- Dynamic form with configurable fields
- Form section with:
  - Eyebrow text
  - Heading
  - Description
  - Privacy note
- Form fields in JSON format
- Webhook URL for form submissions
- Uses `DynamicFormTailwind` component

#### 7. FAQ Section
- Accordion-style FAQ display
- Section eyebrow and heading
- Repeatable FAQs with:
  - Question (text)
  - Answer (rich text with markdown)

#### 8. SEO
- Meta title and description
- Meta image with alt text, width, height
- Keywords
- Canonical URL

---

## 📋 Strapi Schema Details

### Single Type: `join-the-team-page`

**Location**: `/Users/joshuathompson/strapi/strapi/src/api/join-the-team-page/`

### Fields Configuration

| Field Name | Type | Component | Required | Description |
|------------|------|-----------|----------|-------------|
| `pageHero` | Component (Single) | `sections.page-hero` | No | Hero section with kicker, heading, subtitle, background image, breadcrumbs toggle |
| `quote` | Component (Single) | `sections.quote-section` | No | Quote with text, author, and role |
| `twoColumnContent` | Component (Single) | `sections.two-column-content` | No | Two-column layout with images and content |
| `ourValues` | Component (Repeatable) | `sections.value-card` | No | Value cards with title and description |
| `valuesHeading` | String | - | No | Heading for values section (default: "Our Values") |
| `valuesEyebrow` | String | - | No | Eyebrow for values section (default: "WHY JOIN US") |
| `learnAboutUs` | Component (Single) | `sections.discount-cta` | No | CTA section with image, text, and button |
| `formSection` | Component (Single) | `sales-landing.form-section` | No | Form configuration with JSON fields and webhook |
| `faq` | Component (Single) | `sections.faq-section` | No | FAQ section with eyebrow, heading, and repeatable faqs |
| `seo` | Component (Single) | `shared.seo` | No | SEO metadata |

### Component Details

#### `sections.page-hero`
- `kicker` (Text) - Optional eyebrow text
- `heading` (Text) - Main heading
- `subtitle` (Long Text) - Subtitle
- `backgroundImage` (Media - Single) - Background image
- `showBreadcrumbs` (Boolean) - Show/hide breadcrumbs

#### `sections.quote-section`
- `quoteText` (Rich Text) - The quote text
- `quoteAuthor` (Text) - Author name
- `quoteAuthorRole` (Text) - Author's role/title

#### `sections.two-column-content`
- `leftHeading` (Text) - Left column heading
- `leftContent` (Rich Text) - Left column content
- `leftImage` (Media - Single) - Left column image
- `rightHeading` (Text) - Right column heading
- `rightContent` (Rich Text) - Right column content
- `rightImage` (Media - Single) - Right column image

#### `sections.value-card` (Repeatable)
- `title` (Text) - Value title
- `description` (Text) - Value description

#### `sections.discount-cta`
- `eyebrow` (Text) - Optional eyebrow text
- `heading` (Text) - CTA heading
- `description` (Rich Text) - CTA description
- `buttonText` (Text) - Button label
- `buttonUrl` (Text) - Button URL
- `image` (Media - Single) - CTA image

#### `sales-landing.form-section`
- `eyebrow` (Text) - Form section eyebrow
- `heading` (Text) - Form section heading
- `description` (Rich Text) - Form section description
- `formJson` (JSON) - Form field configuration (see form structure below)
- `webhookUrl` (Text) - Webhook URL for form submissions
- `privacyNote` (Text) - Privacy notice below form

#### `sections.faq-section`
- `eyebrow` (Text) - FAQ section eyebrow
- `heading` (Text) - FAQ section heading (default: "Frequently Asked Questions")
- `faqs` (Component - Repeatable) - FAQ items
  - `question` (Text) - FAQ question
  - `answer` (Rich Text) - FAQ answer with markdown support

#### `shared.seo`
- `metaTitle` (Text) - Page title for SEO
- `metaDescription` (Text) - Meta description
- `metaImage` (Media - Single) - Social media image
- `metaImageAlt` (Text) - Image alt text
- `metaImageWidth` (Number) - Image width
- `metaImageHeight` (Number) - Image height
- `keywords` (Text) - SEO keywords
- `canonicalURL` (Text) - Canonical URL

---

## 📝 Form JSON Structure

The `formJson` field should contain a JSON array with form field configurations:

```json
[
  {
    "name": "firstName",
    "label": "First Name",
    "type": "text",
    "required": true,
    "placeholder": "Enter your first name"
  },
  {
    "name": "lastName",
    "label": "Last Name",
    "type": "text",
    "required": true,
    "placeholder": "Enter your last name"
  },
  {
    "name": "email",
    "label": "Email Address",
    "type": "email",
    "required": true,
    "placeholder": "your@email.com"
  },
  {
    "name": "phone",
    "label": "Phone Number",
    "type": "tel",
    "required": false,
    "placeholder": "+44 7XXX XXXXXX"
  },
  {
    "name": "position",
    "label": "Position Applying For",
    "type": "select",
    "required": true,
    "options": [
      "Tennis Coach",
      "Padel Coach",
      "Group Organiser",
      "Admin Support",
      "Other"
    ]
  },
  {
    "name": "experience",
    "label": "Relevant Experience",
    "type": "textarea",
    "required": true,
    "placeholder": "Tell us about your relevant experience..."
  },
  {
    "name": "cv",
    "label": "Upload CV/Resume",
    "type": "file",
    "required": false,
    "accept": ".pdf,.doc,.docx"
  },
  {
    "name": "availability",
    "label": "Availability",
    "type": "textarea",
    "required": false,
    "placeholder": "When are you available to start?"
  }
]
```

### Supported Field Types:
- `text` - Single line text input
- `email` - Email input with validation
- `tel` - Phone number input
- `textarea` - Multi-line text input
- `select` - Dropdown with options array
- `checkbox` - Single checkbox
- `radio` - Radio button group (needs options array)
- `file` - File upload (specify accept attribute)
- `date` - Date picker
- `number` - Number input

---

## 🔧 Setup Instructions

### 1. Strapi Setup

The schema is already created at:
`/Users/joshuathompson/strapi/strapi/src/api/join-the-team-page/`

#### Restart Strapi

```bash
cd /Users/joshuathompson/strapi/strapi
npm run develop
```

#### Set API Permissions

1. Go to **Settings** → **Users & Permissions** → **Roles** → **Public**
2. Scroll down to find **Join-the-team-page**
3. Enable the following permission:
   - ✅ `find`
4. Click **Save**

### 2. Add Content in Strapi

1. Go to **Content Manager** in the Strapi admin
2. You'll see **Join The Team Page** in the Single Types section
3. Click on it to start adding content

### 3. Example Content Structure

#### Page Hero:
- **Kicker**: "CAREERS AT ACTIVE AWAY"
- **Heading**: "Join Our Team"
- **Subtitle**: "Be part of a passionate team delivering unforgettable racket sport experiences around the world"
- **Background Image**: Upload a dynamic team photo
- **Show Breadcrumbs**: true

#### Quote:
- **Quote Text**: "Working with Active Away has been the most rewarding experience of my coaching career. The energy, passion, and commitment to excellence is inspiring."
- **Quote Author**: "Sarah Johnson"
- **Quote Author Role**: "Tennis Coach since 2019"

#### Two Column Content:
- **Left Heading**: "What We Do"
- **Left Content**: "Active Away organizes premium tennis, padel, and pickleball holidays..."
- **Left Image**: Upload relevant image
- **Right Heading**: "Our Culture"
- **Right Content**: "We're a close-knit team that values passion, professionalism..."
- **Right Image**: Upload relevant image

#### Our Values (Add multiple):
1. **Title**: "Passion for Sport"
   **Description**: "We love what we do and bring enthusiasm to every event"
   
2. **Title**: "Team Spirit"
   **Description**: "We work together to create memorable experiences"
   
3. **Title**: "Excellence"
   **Description**: "We strive for the highest standards in everything we do"

#### Learn About Us:
- **Eyebrow**: "DISCOVER MORE"
- **Heading**: "Learn About Active Away"
- **Description**: "Find out more about our company, values, and what makes us unique"
- **Button Text**: "About Us"
- **Button URL**: "/about"
- **Image**: Upload company image

#### Form Section:
- **Eyebrow**: "APPLY NOW"
- **Heading**: "Start Your Application"
- **Description**: "Fill out the form below to apply for a position with Active Away"
- **Form JSON**: Use the example JSON structure above
- **Webhook URL**: Your Make.com or Zapier webhook URL
- **Privacy Note**: "Your information will be kept confidential and used only for recruitment purposes"

#### FAQ:
- **Eyebrow**: "QUESTIONS?"
- **Heading**: "Frequently Asked Questions"
- **FAQs** (Add multiple):
  1. **Question**: "What positions are currently available?"
     **Answer**: "We regularly recruit tennis coaches, padel coaches, and group organisers. Check our current openings or submit a general application."
  
  2. **Question**: "Do I need coaching qualifications?"
     **Answer**: "For coaching roles, we typically require LTA Level 2+ or equivalent coaching qualifications, along with relevant experience."
  
  3. **Question**: "What does the role involve?"
     **Answer**: "Our coaches and organisers travel to beautiful destinations, deliver high-quality coaching and activities, and create amazing experiences for our guests."

#### SEO:
- **Meta Title**: "Join The Team | Careers at Active Away"
- **Meta Description**: "Join the Active Away team and help deliver unforgettable racket sport experiences. We're looking for passionate coaches and organisers."
- **Meta Image**: Upload image for social sharing
- **Keywords**: "active away careers, tennis coach jobs, padel coach jobs, sports holiday jobs"
- **Canonical URL**: "https://activeaway.com/join-the-team"

### 4. Webhook Setup

For form submissions, set up a webhook in Make.com or Zapier:

1. Create a new scenario/zap
2. Use "Webhook" as the trigger
3. Copy the webhook URL
4. Paste it into the **Webhook URL** field in Strapi
5. Configure your workflow (send email, save to database, etc.)

---

## 🌐 Frontend Implementation

### Page Route
- **URL**: `https://activeaway.com/join-the-team`
- **File**: `/src/pages/join-the-team.astro`

### API Populate Query

The Strapi API call uses this populate structure to fetch all nested data:

```
/join-the-team-page?
  populate[pageHero][populate][backgroundImage]=*
  &populate[quote][populate]=*
  &populate[twoColumnContent][populate][leftImage]=*
  &populate[twoColumnContent][populate][rightImage]=*
  &populate[ourValues][populate]=*
  &populate[valuesEyebrow]=*
  &populate[valuesHeading]=*
  &populate[learnAboutUs][populate][image]=*
  &populate[formSection][populate]=*
  &populate[faq][populate][faqs]=*
  &populate[seo][populate][metaImage]=*
```

This ensures all nested components and their media fields are properly loaded.

### Components Used
1. `BaseLayout` - Page wrapper with SEO
2. `PageHeroTailwind` - Hero section
3. `BreadcrumbsTailwind` - Breadcrumb navigation
4. `QuoteSectionTailwind` - Quote display
5. `TwoColumnContentTailwind` - Two-column layout
6. `OurValuesTailwind` - Values grid (newly created)
7. `DiscountCTATailwind` - CTA section
8. `DynamicFormTailwind` - Dynamic form builder
9. `FAQAccordionTailwind` - FAQ accordion

### Utility Functions
- `getJoinTheTeamPage()` - Fetches all page content
- `getJoinTheTeamPageSEO()` - Fetches SEO metadata only

---

## ✅ Implementation Checklist

- [x] Strapi schema created with all fields
- [x] Strapi controller, service, routes created
- [x] Utility functions added to strapi.js
- [x] Main page component created
- [x] OurValuesTailwind component created
- [x] Hero section with background image
- [x] Quote section
- [x] Two-column content section
- [x] Values display section
- [x] Learn About Us CTA
- [x] Dynamic form with JSON configuration
- [x] FAQ accordion section
- [x] SEO metadata support
- [x] Breadcrumbs support
- [x] Mobile responsive design
- [x] Image optimization
- [x] Proper component structure

---

## 🎨 Design Features

- **Responsive Design**: Mobile-first approach with breakpoints at sm, md, lg, xl
- **Tailwind CSS**: Utility-first styling
- **Color Scheme**: 
  - Gold accent: `#ad986c`
  - Gray backgrounds: `#f9fafb` and white
- **Typography**:
  - Headings: `text-3xl sm:text-4xl font-bold`
  - Eyebrows: `text-base font-semibold text-[#ad986c]`
  - Body text: `text-lg leading-8 text-gray-600`
- **Spacing**: Consistent py-12/16/24 padding for sections
- **Max Widths**: 
  - Content: `max-w-7xl`
  - Text content: `max-w-2xl`
  - Forms: `max-w-3xl`

---

## 🔄 Content Management Workflow

1. **Login to Strapi**: Access the admin panel
2. **Navigate to Join The Team Page**: Single Types → Join The Team Page
3. **Edit Sections**: Update content in any section
4. **Manage Values**: Add/remove/reorder value cards
5. **Update Form**: Modify form fields in JSON format
6. **Manage FAQs**: Add/remove/reorder FAQ items
7. **Save Draft**: Save as draft for preview
8. **Publish**: Publish to make changes live
9. **Frontend**: Changes appear immediately on the website

---

## 📊 Form Submission Flow

1. User fills out the application form
2. Form validates required fields and formats
3. On submit, form data is sent to the webhook URL
4. Webhook processes the data (Make.com/Zapier)
5. Actions can include:
   - Send email notification to HR team
   - Send confirmation email to applicant
   - Save to Google Sheets/Airtable/Database
   - Create task in project management tool
   - Upload CV to cloud storage
   - Add to ATS (Applicant Tracking System)

---

## 🎉 Ready for Use!

The page is fully functional and ready to use once you:
1. ✅ Restart Strapi (files already created)
2. ✅ Set API permissions (Settings → Roles → Public → Join-the-team-page → find)
3. ✅ Add content in Strapi admin
4. ✅ Configure webhook for form submissions
5. ✅ Test the form submission workflow
6. ✅ Add page link to navigation menu

---

## 💡 Future Enhancements (Optional)

1. **Current Openings Section**: Display active job listings from a separate collection
2. **Application Status Portal**: Allow applicants to check their application status
3. **Video Testimonials**: Add video component for team member testimonials
4. **Benefits Section**: Dedicated component for listing company benefits
5. **Application Deadlines**: Add deadline dates for specific positions
6. **Multi-step Form**: Break long form into multiple steps
7. **File Upload to Cloud**: Direct file uploads to cloud storage (S3, Cloudinary)
8. **Email Verification**: Verify email addresses before accepting applications

---

## 📚 Related Documentation

- [Strapi Setup Checklist](./STRAPI_SETUP_CHECKLIST.md)
- [Forms Advanced Features Guide](./FORMS_ADVANCED_FEATURES_GUIDE.md)
- [Dynamic Form Field Types](./FORMS_FIELD_TYPES_GUIDE.md)
- [Webhook Format Guide](./FORMS_WEBHOOK_FORMAT_GUIDE.md)
- [File Upload Guide](./MAKE_FILE_UPLOAD_GUIDE.md)

---

**Implementation Date**: November 21, 2025  
**Status**: ✅ Complete and Production Ready

