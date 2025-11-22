# Airport Transfers Page - Strapi Setup Guide

This guide explains how to set up the Strapi single type and components for the Airport Transfers page.

## Backend Files Already Created

The following files have been created in your Strapi backend at `/Users/joshuathompson/strapi/strapi/`:

### Single Type
- `src/api/airport-transfers-page/content-types/airport-transfers-page/schema.json`
- `src/api/airport-transfers-page/controllers/airport-transfers-page.js`
- `src/api/airport-transfers-page/services/airport-transfers-page.js`
- `src/api/airport-transfers-page/routes/airport-transfers-page.js`

### Components
- `src/components/content/content-item.json`
- `src/components/content/accordion-item.json`
- `src/components/content/pricing-row.json`

---

## Setup Steps

### Step 1: Restart Strapi

Restart your Strapi server to register the new content type and components:

```bash
cd /Users/joshuathompson/strapi/strapi
npm run develop
```

After restart, you'll see:
- "Airport Transfers Page" in Content Manager (Single Types section)
- Three new components available in the component picker

### Step 2: Set API Permissions

1. Navigate to **Settings** → **Users & Permissions** → **Roles** → **Public**
2. Scroll down to find **Airport-transfers-page**
3. Enable the following permission:
   - ✅ `find`
4. Click **Save**

### Step 3: Add Content

Go to **Content Manager** → **Airport Transfers Page** (in Single Types)

---

## Content Structure

### Page Hero Section

**Component:** `sections.page-hero` (should already exist)

Fill in:
- **Kicker:** `AIRPORT TRANSFERS`
- **Heading:** `Airport Transfers`
- **Subtitle:** `Reliable and comfortable airport transfer services for your tennis holiday`
- **Background Image:** Upload a hero image (recommended 1920x600px)
- **Show Breadcrumbs:** ✅ Check this box

---

### Important Block

Simple fields for the notice block:

- **Important Eyebrow:** `IMPORTANT` (pre-filled as default)
- **Important Content:** (Rich text field - use markdown)

Example content:
```markdown
All airport transfers must be booked at least 48 hours in advance. Please provide your flight details when booking to ensure timely pickup.
```

---

### Table of Contents

- **Show Contents:** ✅ Check this box
- **Contents Items:** Click "Add component" to add items

Add at least 2 items:
1. **Label:** `Key Information`, **Anchor:** `key-information`
2. **Label:** `Pricing`, **Anchor:** `pricing`

*(The anchors must match the section IDs in the page for smooth scrolling)*

---

### Key Information Section

- **Key Info Title:** `Key Information` (pre-filled as default)
- **Key Info Subtitle:** `Everything you need to know about our airport transfer service`
- **Key Info Accordions:** Click "Add component" to add accordion items

#### Example Accordions:

**Accordion 1:**
- **Title:** `How to Book`
- **Content:** (Rich text - markdown)
```markdown
Booking your airport transfer is simple. Contact us at least 48 hours before your arrival with your flight details, and we'll arrange everything for you.
```

**Accordion 2:**
- **Title:** `Vehicle Types`
- **Content:**
```markdown
We offer a range of vehicles:
- Standard sedan (up to 4 passengers)
- Large sedan (up to 4 passengers + extra luggage)
- MPV/Minivan (up to 7 passengers)
- Executive vehicles available on request
```

**Accordion 3:**
- **Title:** `Meet & Greet Service`
- **Content:**
```markdown
All our transfers include complimentary meet and greet service. Your driver will be waiting in the arrivals hall with a name board.
```

**Accordion 4:**
- **Title:** `Luggage Allowance`
- **Content:**
```markdown
Standard allowance is one large suitcase and one carry-on per passenger. Additional luggage can be accommodated with advance notice.
```

**Accordion 5:**
- **Title:** `Cancellation Policy`
- **Content:**
```markdown
Free cancellation up to 24 hours before pickup. Cancellations within 24 hours are subject to a 50% charge.
```

**Accordion 6:**
- **Title:** `Payment Methods`
- **Content:**
```markdown
We accept all major credit cards, PayPal, and bank transfers. Payment is required at the time of booking.
```

*(Add as many as needed - they'll automatically distribute across 2 columns on large screens)*

---

### Pricing Section

- **Pricing Title:** `Pricing` (pre-filled as default)
- **Pricing Subtitle:** `Transparent pricing for all major routes`
- **Pricing Table:** Click "Add component" to add rows

#### Example Pricing Rows:

**Row 1:**
- **Route:** `Malaga Airport to Marbella`
- **Price:** `€120`
- **Notes:** `Up to 4 passengers, approximately 45 minutes`

**Row 2:**
- **Route:** `Faro Airport to Vilamoura`
- **Price:** `€90`
- **Notes:** `Up to 4 passengers, approximately 30 minutes`

**Row 3:**
- **Route:** `Barcelona Airport to City Centre`
- **Price:** `€85`
- **Notes:** `Up to 4 passengers, approximately 25 minutes`

**Row 4:**
- **Route:** `Lisbon Airport to Cascais`
- **Price:** `€95`
- **Notes:** `Up to 4 passengers, approximately 35 minutes`

**Row 5:**
- **Route:** `Seville Airport to City Centre`
- **Price:** `€65`
- **Notes:** `Up to 4 passengers, approximately 20 minutes`

*(Add all your routes - each row will be numbered automatically)*

---

### SEO Section

**Component:** `shared.seo` (should already exist)

Fill in:
- **Meta Title:** `Airport Transfers | Active Away`
- **Meta Description:** `Book reliable airport transfers for your tennis holiday with Active Away. Professional drivers, comfortable vehicles, and meet & greet service included.`
- **Keywords:** `airport transfers, tennis holiday transport, airport pickup, holiday transfers`
- **Canonical URL:** `https://activeaway.com/airport-transfers`
- **Meta Image:** Upload an image (recommended 1200x630px for social sharing)

---

## Step 4: Publish

Once you've added all content:
1. Click **Save** button (top right)
2. Click **Publish** button

The page will now be live at `/airport-transfers`

---

## Troubleshooting

### Content Type Not Appearing

**Issue:** "Airport Transfers Page" doesn't show in Content Manager

**Solution:**
- Ensure Strapi has been restarted after adding the schema files
- Check terminal for any errors during startup
- Verify all 4 files were created in the correct location

### API Permission Issues

**Issue:** Page shows 404 or "Forbidden"

**Solution:**
- Check API permissions are enabled (Settings → Users & Permissions → Public)
- Ensure `find` is checked for Airport-transfers-page
- Clear browser cache and try again

### Components Not Available

**Issue:** Can't add accordion items or pricing rows

**Solution:**
- Verify the 3 component JSON files were created in `/components/content/`
- Restart Strapi to register the components
- Check Strapi logs for component errors

### Accordions Not Working

**Issue:** Accordions don't expand/collapse

**Solution:**
- Check browser console for JavaScript errors
- Ensure content is published (not just saved)
- Verify the Astro page is using the correct data structure

---

## Tips for Content Management

### Writing Good Accordion Content

- Keep titles short and descriptive
- Use markdown formatting for better readability
- Include bullet points for lists
- Add links where relevant using markdown: `[link text](URL)`

### Pricing Table Best Practices

- Be consistent with currency symbols
- Include journey duration in notes
- Specify passenger capacity
- Update prices seasonally if needed

### Table of Contents

- Keep labels short (2-3 words max)
- Anchors should be lowercase with hyphens (no spaces)
- Only include major sections
- Order matches the page flow

---

## Example API Response

Once published, the API endpoint will be:
```
GET https://your-strapi-url.com/api/airport-transfers-page?populate=*
```

You can test it in your browser or with Postman to verify the data structure.

---

## Need Help?

Check the main implementation documentation: `AIRPORT_TRANSFERS_COMPLETE.md`

For Strapi-specific issues, refer to: https://docs.strapi.io/



