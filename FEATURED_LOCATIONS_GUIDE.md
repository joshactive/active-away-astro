# Featured Locations Guide

## Overview

The homepage locations carousel displays dynamic content from Strapi's **Featured Locations** collection. This allows you to mix and match different holiday types (Tennis, Pickleball, Junior Camps, etc.) in any order you want.

---

## How It Works

1. **Featured Locations** collection references any holiday type
2. Each featured location has an `order` field for sorting
3. System fetches only **active** entries
4. Automatically pulls the correct image and details from each holiday
5. Normalizes data for consistent display

---

## Managing Featured Locations in Strapi

### Step 1: Navigate to Featured Locations

1. Log in to your Strapi admin: `https://strapi-production-b96d.up.railway.app/admin`
2. Click **Content Manager** → **Featured Locations**

### Step 2: Create a New Featured Location

Click **"Create new entry"** and fill in:

**Required Fields:**

- **order** (Number): Controls display order
  - Example: `1` for first card, `2` for second, etc.
  - Lower numbers appear first

- **active** (Boolean): Show/hide from homepage
  - ✅ Enable to display
  - ❌ Disable to hide

- **holiday_type** (Dropdown): Select the type
  - Options:
    - `tennis-holiday`
    - `pickleball-holiday`
    - `junior-tennis-camp`
    - `padel-tennis-holiday`
    - `play-and-watch`
    - `ski-holiday`

- **Relation Field** (Based on holiday_type):
  - If you selected `tennis-holiday`, fill in **tennis_holiday**
  - If you selected `pickleball-holiday`, fill in **pickleball_holiday**
  - And so on...
  - Select the actual holiday entry to feature

### Step 3: Save and Publish

1. Click **Save**
2. Click **Publish**
3. Your carousel will update automatically on next build/deploy

---

## Example Setup

Here's a sample configuration for 5 featured locations:

| Order | Active | Holiday Type | Holiday Reference |
|-------|--------|--------------|-------------------|
| 1 | ✅ | tennis-holiday | "Adult Tennis - Sani Beach" |
| 2 | ✅ | pickleball-holiday | "Pickleball Paradise - Spain" |
| 3 | ✅ | junior-tennis-camp | "Junior Camp - Portugal" |
| 4 | ✅ | tennis-holiday | "Pro Tennis - Croatia" |
| 5 | ❌ | ski-holiday | "Ski & Tennis - Alps" |

**Result:** First 4 entries show in carousel (5th is disabled)

---

## Required Fields in Holiday Collections

For featured locations to work properly, each holiday collection must have:

### All Holiday Types Need:
- ✅ `title` - Display name
- ✅ `slug` - URL-friendly identifier
- ✅ `shortLocationName` or `country` - Location display
- ✅ `priceFrom` - Starting price (number)
- ✅ `displayOnFrontEnd` - Must be published

### Images (varies by type):
- **Tennis Holiday**: `mainHeaderImage` or `featuredImageLg`
- **Other Types**: `featuredImage` or `headerImage`

### Optional but Recommended:
- `productType` - Holiday type description
- `excerpt` - Short description
- `singleOccupancyRange` - Price text override

---

## Field Mapping

The system automatically maps fields from each holiday type:

```javascript
{
  title: holiday.title,
  location: holiday.shortLocationName || holiday.country,
  type: holiday.productType || "Tennis Holiday",
  price: holiday.singleOccupancyRange || `from £${holiday.priceFrom}`,
  amount: `£${holiday.priceFrom}`,
  image: holiday.mainHeaderImage || holiday.featuredImage
}
```

---

## Troubleshooting

### No locations showing on homepage

**Check:**
1. Are Featured Locations **published**? (not just saved)
2. Is `active` set to `true`?
3. Is the referenced holiday also **published**?
4. Does the holiday have `displayOnFrontEnd: true`?

### Wrong image showing

**Check:**
1. Tennis holidays need `mainHeaderImage` or `featuredImageLg`
2. Other types need `featuredImage` or `headerImage`
3. Image must be uploaded in the holiday entry
4. Image should be at least 800px wide

### Price showing as "£0"

**Check:**
1. Holiday entry has `priceFrom` field filled
2. Or `singleOccupancyFrom` field filled
3. Value is a number (not text)

### Location showing blank

**Check:**
1. Holiday has `shortLocationName` filled
2. Or both `venueName` and `country` filled
3. Or at least `country` filled

---

## Best Practices

### Image Sizes
- **Recommended**: 1200px × 800px (3:2 aspect ratio)
- **Minimum**: 800px × 600px
- **Format**: JPEG or PNG
- Strapi automatically creates responsive variants

### Order Strategy
- Use increments of 10: `10, 20, 30, 40, 50`
- Makes it easy to insert new items later
- Example: Add between 20 and 30 → use `25`

### Active Management
- Disable instead of delete to preserve history
- Re-enable seasonally without recreating
- Keep 5-7 active entries for variety

### Holiday Mix
- **Good mix**: 3 tennis + 1 pickleball + 1 junior camp
- Showcases variety of offerings
- Avoids repetition

---

## API Performance

**Single Request Architecture:**
- ⚡ 1 API call (not 6!)
- 📦 ~15KB data transfer
- ⏱️ ~350ms build time
- 🚀 75% faster than multi-query approach

**Caching:**
- Results cached at Cloudflare edge
- Automatic invalidation on publish
- Fast global delivery

---

## Deployment

### Automatic Updates

When you publish/unpublish a featured location:

1. **Cloudflare Pages** (if webhook configured):
   - Automatically rebuilds site
   - ~2-3 minutes to live

2. **Manual Rebuild**:
   - Go to Cloudflare Pages dashboard
   - Click "Retry deployment"
   - Or push any commit to trigger rebuild

### Local Development

```bash
# Fetch latest from Strapi
npm run dev

# Site reloads automatically
# Check console for: "📍 Featured Locations loaded: 5"
```

---

## Advanced: Webhook Setup

To automatically rebuild on Strapi changes:

### 1. Get Cloudflare Pages Webhook URL

1. Go to Cloudflare Pages → Your Project → Settings
2. Scroll to **Build Hooks**
3. Create new hook: "Strapi Content Update"
4. Copy the webhook URL

### 2. Add Webhook to Strapi

1. Strapi Admin → Settings → Webhooks
2. Click "Create new webhook"
3. Name: "Deploy to Cloudflare"
4. URL: *Paste webhook URL*
5. Events: Select `entry.publish`, `entry.unpublish`, `entry.update`
6. Headers: (none needed)
7. Save

### 3. Test

1. Publish a featured location in Strapi
2. Check Cloudflare Pages for new deployment
3. Verify changes appear after build completes

---

## Code Reference

### Files Involved

1. **Strapi Schema**:
   ```
   /strapi/src/api/featured-location/content-types/featured-location/schema.json
   ```

2. **Fetch Function**:
   ```
   /active-away-astro/src/utils/strapi.js
   → getFeaturedLocations()
   ```

3. **Component**:
   ```
   /active-away-astro/src/components/LocationsTailwind.astro
   ```

### Fallback Behavior

If Strapi is unavailable or returns no data:
- ✅ Site still works (uses fallback data)
- ⚠️ Console shows: "Using fallback locations data"
- Displays 3 hardcoded tennis holidays

---

## Support

For questions or issues:
1. Check Strapi logs: Railway dashboard → Logs
2. Check Astro build logs: Cloudflare Pages → Deployments
3. Console errors: Browser DevTools → Console

Common console messages:
- ✅ `📍 Featured Locations loaded: 5` - Success
- ⚠️ `⚠️  No featured locations found` - Nothing active
- ⚠️ `⚠️  Using fallback locations data` - Strapi error
- ❌ `❌ Error fetching featured locations` - API error

