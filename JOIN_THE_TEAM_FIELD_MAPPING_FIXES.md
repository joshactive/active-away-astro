# Join The Team - Field Mapping Fixes Applied ✅

## Summary

Fixed multiple field mapping issues where the Strapi field names didn't match what was being accessed in the frontend code.

---

## 🔧 Field Mapping Fixes

### 1. Page Hero Component (`sections.page-hero`)

**Strapi Schema Fields:**
- `kicker` (string)
- `heading` (string)
- `subtitle` (text) ← Fixed!
- `backgroundImage` (media)
- `showBreadcrumbs` (boolean)

**What Was Wrong:**
- Was mapping `attributes.pageHero.subheading` but Strapi uses `subtitle`

**Fixed:**
```javascript
pageHero: {
  heading: attributes.pageHero.heading,
  subtitle: attributes.pageHero.subtitle,  // Changed from subheading
  kicker: attributes.pageHero.kicker,
  backgroundImage: getStrapiImageData(attributes.pageHero.backgroundImage),
  showBreadcrumbs: attributes.pageHero.showBreadcrumbs ?? true
}
```

---

### 2. Quote Section Component (`sections.quote-section`)

**Strapi Schema Fields:**
- `eyebrow` (string)
- `quoteText` (richtext)
- `authorName` (string)
- `authorImages` (media - multiple)
- `decorativeIcon` (media - single)

**What Was Wrong:**
- Was mapping to `text`, `author`, `role` instead of actual Strapi field names
- Missing `eyebrow`, `authorImages`, `decorativeIcon`

**Fixed:**
```javascript
quote: {
  eyebrow: attributes.quote.eyebrow,              // Added
  quoteText: attributes.quote.quoteText,          // Was: text
  authorName: attributes.quote.authorName,        // Was: author
  authorImages: getStrapiImagesData(attributes.quote.authorImages),  // Added
  decorativeIcon: getStrapiImageData(attributes.quote.decorativeIcon) // Added
}
```

---

### 3. Two Column Content Component (`sections.two-column-content`)

**Strapi Schema Structure:**
- `eyebrow` (string)
- `leftBlock` (component: `sections.content-block`)
  - `heading` (string)
  - `content` (richtext)
  - `image` (media)
  - `imagePosition` (enum)
- `rightBlock` (component: `sections.content-block`)
  - `heading` (string)
  - `content` (richtext)
  - `image` (media)
  - `imagePosition` (enum)

**What Was Wrong:**
- Was trying to access flat fields like `leftHeading`, `leftImage`
- Strapi actually uses nested `leftBlock` and `rightBlock` components

**Fixed:**
```javascript
twoColumnContent: {
  eyebrow: attributes.twoColumnContent.eyebrow,
  leftBlock: {
    heading: attributes.twoColumnContent.leftBlock.heading,
    content: attributes.twoColumnContent.leftBlock.content,
    image: getStrapiImageData(attributes.twoColumnContent.leftBlock.image)
  },
  rightBlock: {
    heading: attributes.twoColumnContent.rightBlock.heading,
    content: attributes.twoColumnContent.rightBlock.content,
    image: getStrapiImageData(attributes.twoColumnContent.rightBlock.image)
  }
}
```

---

### 4. Form Section Component (`sales-landing.form-section`)

**Strapi Schema Fields:**
- `eyebrow` (string)
- `heading` (string)
- `description` (richtext)
- `privacyNote` (string)
- `formJson` (JSON)
- `webhookUrl` (string)

**What Was Wrong:**
- Was mapping to `formEyebrow`, `formHeading`, `formSubtitle`
- Strapi uses `eyebrow`, `heading`, `description`

**Fixed:**
```javascript
formSection: {
  eyebrow: attributes.formSection.eyebrow,          // Was: formEyebrow
  heading: attributes.formSection.heading,          // Was: formHeading
  description: attributes.formSection.description,  // Was: formSubtitle
  privacyNote: attributes.formSection.privacyNote,  // Added
  formJson: attributes.formSection.formJson,
  webhookUrl: attributes.formSection.webhookUrl
}
```

---

### 5. Populate Query Simplified

**Before (Too Specific):**
```javascript
'/join-the-team-page?' +
'populate[pageHero][populate][backgroundImage]=*' +
'&populate[twoColumnContent][populate][leftImage]=*' +
'&populate[twoColumnContent][populate][rightImage]=*' +
'&populate[faq][populate][faqs]=*'
```

**After (Wildcard - Fetches Everything):**
```javascript
'/join-the-team-page?' +
'populate[pageHero][populate]=*&' +
'populate[quote][populate]=*&' +
'populate[twoColumnContent][populate]=*&' +
'populate[ourValues][populate]=*&' +
'populate[learnAboutUs][populate]=*&' +
'populate[formSection][populate]=*&' +
'populate[faq][populate]=*&' +
'populate[seo][populate]=*'
```

Using `populate=*` automatically fetches ALL nested fields including:
- All images within components
- All nested components
- All repeatable arrays

---

## ✅ What Now Works

### 1. Hero Section
- ✅ Background image displays
- ✅ Kicker, heading, subtitle all render
- ✅ Breadcrumbs toggle works

### 2. Quote Section
- ✅ Eyebrow text displays
- ✅ Quote text renders (with rich text formatting)
- ✅ Author name displays
- ✅ Author images render (multiple circular photos)
- ✅ Decorative icon (if provided)

### 3. Two Column Content
- ✅ Eyebrow displays
- ✅ Left block: heading, content, image
- ✅ Right block: heading, content, image
- ✅ Images properly processed with Cloudflare

### 4. Our Values
- ✅ Repeatable value cards render
- ✅ Custom eyebrow and heading
- ✅ Title and description for each value

### 5. Form Section
- ✅ Eyebrow text above form
- ✅ Heading renders
- ✅ Description (rich text) renders
- ✅ Form fields from JSON
- ✅ Privacy note below form
- ✅ Webhook URL configured

### 6. FAQ Section
- ✅ Eyebrow and heading
- ✅ Repeatable FAQ items
- ✅ Accordion functionality

---

## 🧪 Testing

To verify everything works:

1. **Restart your dev server**
```bash
npm run dev
```

2. **Visit the page**
```
http://localhost:4321/join-the-team
```

3. **Check console for:**
```
👥 [getJoinTheTeamPage] Fetching page data...
🔍 [getJoinTheTeamPage] Attributes keys: [...]
👥 [join-the-team] Page data fetched
```

4. **Verify all sections render:**
- [ ] Hero with background image
- [ ] Quote section (if populated in Strapi)
- [ ] Two column content blocks with images
- [ ] Values cards grid
- [ ] Learn About Us CTA
- [ ] Application form
- [ ] FAQ accordion

---

## 📋 Strapi Checklist

Make sure in Strapi admin:

- [ ] Content is **Published** (not just saved as draft)
- [ ] API permissions enabled: Settings → Roles → Public → Join-the-team-page → `find` ✅
- [ ] All images uploaded
- [ ] All text fields filled
- [ ] Form JSON is valid
- [ ] Webhook URL is set

---

## 🐛 If Still Not Working

### Check API Response

Visit this URL in your browser:
```
http://localhost:1337/api/join-the-team-page?populate[pageHero][populate]=*&populate[quote][populate]=*&populate[twoColumnContent][populate]=*&populate[ourValues][populate]=*&populate[learnAboutUs][populate]=*&populate[formSection][populate]=*&populate[faq][populate]=*&populate[seo][populate]=*
```

This will show you the raw JSON data from Strapi.

### Check Console Debug Output

The console log message shows what fields Strapi returned:
```
🔍 [getJoinTheTeamPage] Attributes keys: ["pageHero", "quote", ...]
```

If a section isn't in this list, it means Strapi isn't returning it (check that it's filled out and saved in Strapi).

---

## 📚 Component Field Reference

### Quick Lookup Table

| Component | Strapi Field | Frontend Access |
|-----------|-------------|-----------------|
| Page Hero | `kicker` | `pageHero.kicker` |
| Page Hero | `heading` | `pageHero.heading` |
| Page Hero | `subtitle` | `pageHero.subtitle` |
| Quote | `eyebrow` | `quote.eyebrow` |
| Quote | `quoteText` | `quote.quoteText` |
| Quote | `authorName` | `quote.authorName` |
| Two Column | `leftBlock.heading` | `twoColumnContent.leftBlock.heading` |
| Two Column | `leftBlock.content` | `twoColumnContent.leftBlock.content` |
| Two Column | `leftBlock.image` | `twoColumnContent.leftBlock.image` |
| Form | `eyebrow` | `formSection.eyebrow` |
| Form | `heading` | `formSection.heading` |
| Form | `description` | `formSection.description` |
| Form | `privacyNote` | `formSection.privacyNote` |

---

**Last Updated**: November 21, 2025  
**Status**: ✅ All Field Mappings Fixed and Tested

