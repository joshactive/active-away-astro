# Sales Landing Pages – Strapi Setup Guide

This guide covers everything needed to power the new sales landing pages (e.g. `/tennis-holiday-discounts`) entirely from Strapi – including structured hero content, review cards, stats counters, media grids, and the embedded discount form.

---

## 1. Create the Collection Type

1. Open **Content-Type Builder**
2. Click **“Create new collection type”**
3. **Display Name:** `Sales Landing Page`
4. **API ID:** `sales-landing-page`
5. Click **Continue**, then add the base fields below before saving.

### Base Fields

| Field | Type | Settings |
|-------|------|----------|
| `title` | Text | Required |
| `slug` | UID (based on `title`) | Required, unique, used for `/[slug]` |
| `pageType` | Enumeration | Values: `product-page`, `static-page`, `landing-page`, `campaign-page` (default `landing-page`) |
| `displayOnFrontEnd` | Boolean | Default `true` |

---

## 2. Add Components & Sections

Create a new components category called **`sales-landing`** to keep things organised. Add the components below (all repeatables can be reordered inside the entry editor).

### 2.1 Hero Area

Component: `sales-landing.hero`

| Field | Type | Notes |
|-------|------|-------|
| `kicker` | Text | e.g. `Tennis` |
| `heading` | Text | Main hero headline |
| `subheading` | Rich Text | Hero paragraph (supports line breaks) |
| `backgroundImage` | Media (Single) | 2400×1350+ recommended |
| `primaryButtonLabel` | Text | CTA text (e.g. `Access Discounts`) |
| `primaryButtonUrl` | Text | Full URL or relative path |
| `secondaryButtonLabel` | Text | Optional |
| `secondaryButtonUrl` | Text | Optional |

### 2.2 Highlight Cards

Component: `sales-landing.highlight-card` (repeatable)

| Field | Type | Notes |
|-------|------|-------|
| `label` | Text | Small eyebrow (e.g. `Get an Instant Discount`) |
| `description` | Rich Text | 1–2 sentences |
| `linkLabel` | Text | Optional |
| `linkUrl` | Text | Optional |

### 2.3 Intro Section

Component: `sales-landing.intro-section`

| Field | Type | Notes |
|-------|------|-------|
| `eyebrow` | Text | e.g. `Our Tennis Holidays` |
| `heading` | Text | |
| `description` | Rich Text | Main copy block |
| `bulletPoints` | Component `sales-landing.bullet` (repeatable) | Single text field per bullet |
| `buttonLabel` | Text | Optional |
| `buttonUrl` | Text | Optional |
| `image` | Media (Single) | Landscape photo |

### 2.4 Reviews Section

Component: `sales-landing.reviews-section`

| Field | Type |
|-------|------|
| `eyebrow` | Text |
| `heading` | Text |
| `subtitle` | Text |
| `description` | Rich Text |
| `backgroundImage` | Media (Single) |
| `ctaLabel` | Text |
| `ctaUrl` | Text |
| `reviews` | Component `sales-landing.review-card` (repeatable up to 4) |

`sales-landing.review-card` fields:

- `quote` (Rich Text)
- `authorName` (Text)
- `authorMeta` (Text)
- `photo` (Media, optional)

### 2.5 Discount Form Section

Component: `sales-landing.form-section`

| Field | Type | Notes |
|-------|------|-------|
| `eyebrow` | Text | e.g. `Access Discounts` |
| `heading` | Text | |
| `description` | Rich Text | Short paragraph |
| `privacyNote` | Text | Appears under form |
| `form` | Relation to **Forms** (one entry) | Select the JSON-powered form |

> The relation lets us re-use the existing dynamic form builder (JSON fields + webhook) anywhere on the site.

### 2.6 Stats Section

Component: `sales-landing.stats-section`

| Field | Type | Notes |
|-------|------|-------|
| `stats` | Component `sales-landing.stat-item` (repeatable) | Matches `/about-us` counter |

`sales-landing.stat-item`:
- `number` (Text, include `+` if desired)
- `label` (Text)

### 2.7 Features / Partners

Component: `sales-landing.features-section`

| Field | Type |
|-------|------|
| `title` | Text |
| `subtitle` | Text |
| `logos` | Component `sales-landing.logo` (repeatable) |

`sales-landing.logo`:
- `logoImage` (Media, single, SVG or transparent PNG)
- `logoLabel` (Text, optional alt)

### 2.8 Gallery Grid

Component: `sales-landing.gallery-section`

| Field | Type |
|-------|------|
| `eyebrow` | Text |
| `heading` | Text |
| `description` | Rich Text |
| `tiles` | Component `sales-landing.gallery-tile` (repeatable, 3–9 items) |
| `ctaLabel` | Text |
| `ctaUrl` | Text |

`sales-landing.gallery-tile`:
- `image` (Media, single)
- `label` (Text)
- `subLabel` (Text)

### 2.9 Terms & Ratings

Component: `sales-landing.terms-section`

| Field | Type | Notes |
|-------|------|-------|
| `heading` | Text |
| `terms` | Component `sales-landing.term-item` (repeatable) | Each term is a single text block |
| `footerNote` | Text | Optional |

`sales-landing.rating-highlight` (repeatable field on the main type):
- `score` (Text, e.g. `5/5`)
- `label` (Text, e.g. `Google Reviews`)
- `description` (Text)

### 2.10 SEO

Reuse the existing **Shared SEO** component (`seo`) so the unified `/[slug]` route can populate `<head>` correctly.

---

## 3. Set Up the “Access Discounts” Form

1. Go to **Content Manager → Forms**
2. Click **Create new entry**
3. Populate:
   - **Title:** `Sales Landing Discount Form`
   - **Slug:** `sales-landing-discount`
   - **Form Layout:** `two-column`
   - **Form Heading:** `Access Discounts`
   - **Form Subtitle:** `Leave your details and we’ll unlock the best offers for you.`
   - **Form Webhook URL:** Paste your Zapier/Make webhook (same as existing forms workflow)
   - **Webhook Format:** `labels`
   - **Form Fields:** click “JSON editor” and paste the contents of `SALES_LANDING_DISCOUNT_FORM_JSON.json`
4. Publish the form.

Finally, inside each Sales Landing Page entry, open the **Form Section** and link this form via the relation selector.

---

## 4. Permissions

1. **Settings → Users & Permissions → Roles → Public**
2. Enable for `sales-landing-page`:
   - `find`
   - `findOne`
3. Save.

---

## 5. Content Checklist

For each landing page:

- Set `displayOnFrontEnd` to **true**
- Choose a unique `slug` (e.g. `tennis-holiday-discounts`)
- Fill the hero, highlights, intro, reviews, stats, features, gallery, terms, ratings & SEO blocks
- Link the discount form relation
- Publish the entry

---

## 6. Testing

After publishing:

```bash
cd /Users/joshuathompson/active-away-astro
npm run dev
# Visit http://localhost:4321/tennis-holiday-discounts
```

Verify:

- Hero + highlight cards load
- Stats animate the way `/about-us` counters do
- Form submits successfully and hits the configured webhook (check Zapier/Make logs)
- The new page appears via the shared `/[slug]` route with SEO tags populated

---

## 7. Resources

- Form JSON: `SALES_LANDING_DISCOUNT_FORM_JSON.json`
- Frontend implementation: `src/components/SalesLandingPageTailwind.astro`
- Dynamic form renderer: `src/components/DynamicFormTailwind.astro`

Once this setup is complete you can create unlimited landing pages, each with bespoke content, imagery, and an embedded webhook-powered form – all without touching the codebase.


