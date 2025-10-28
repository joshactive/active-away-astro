# 🤝 Partner Section Guide

## 📋 How It Works

### **Data Flow**
```
Strapi (Home Content Type)
    ↓
getHomeData() in strapi.js
    ↓
index.astro (fetches once)
    ↓
OurPartnersTailwind.astro (receives as prop)
```

### **Component Structure**

```42:43:/Users/joshuathompson/active-away-astro/src/components/OurPartnersTailwind.astro
          <div class="partner-logo w-full h-20 sm:h-24 lg:h-28 flex items-center justify-center">
            <img src={partner.logo.url} alt={partner.logo.alt || partner.name} width={partner.logo.width} height={partner.logo.height} class="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300" loading="lazy" />
```

---

## 🎨 Image Guidelines

### **Dimensions & Format**

| Specification | Requirement | Notes |
|--------------|-------------|-------|
| **Aspect Ratio** | 2:1 (horizontal) or 1:1 (square) | Flexible, container adapts |
| **Width** | 400-800px | Optimal for retina displays |
| **Height** | 200-400px | Maximum display: 112px (desktop) |
| **File Format** | PNG or SVG | PNG with transparency preferred |
| **File Size** | < 100KB | For fast loading |
| **Background** | Transparent | Required for grayscale effect |

### **Recommended Sizes**
```
Small logos:  400x200px  (2:1 ratio)
Medium logos: 600x300px  (2:1 ratio)
Large logos:  800x400px  (2:1 ratio)
Square logos: 400x400px  (1:1 ratio)
```

---

## 📐 Display Specifications

### **Container Heights**
- **Mobile** (< 640px): `h-20` (80px)
- **Tablet** (640px - 1024px): `h-24` (96px)
- **Desktop** (≥ 1024px): `h-28` (112px)

### **Grid Layout**
- **Mobile**: 2 columns
- **Tablet**: 3 columns
- **Desktop**: 5 columns

### **Visual Effects**
```css
/* Default state: Grayscale */
filter: grayscale(1);

/* Hover state: Full color */
filter: grayscale(0);

/* Transition: Smooth 300ms */
transition: all 0.3s ease;

/* Hover lift effect */
transform: translateY(-4px);
```

---

## 🎯 Logo Design Requirements

### ✅ **DO:**
1. **Use high contrast logos** - They look better in grayscale
2. **Provide transparent background** - Essential for the effect
3. **Use simple, clean designs** - Better at small sizes
4. **Include padding in the image** - 10-20px margin around logo
5. **Use vector formats (SVG)** - If possible, for crisp scaling
6. **Test in grayscale** - Ensure it's recognizable without color

### ❌ **DON'T:**
1. **Don't use photos or complex images** - Won't work in grayscale
2. **Don't include white backgrounds** - Will show as a box
3. **Don't use thin lines** - Won't be visible at small sizes
4. **Don't rely on color** - Grayscale is default state
5. **Don't upload huge files** - Slows page load

---

## 🔧 Strapi Setup

### **Fields in Home Content Type**

| Field Name | Type | Example |
|------------|------|---------|
| `partner1Name` | Text | "LTA" |
| `partner1Logo` | Media (Single) | logo.png |
| `partner2Name` | Text | "Tennis Foundation" |
| `partner2Logo` | Media (Single) | logo.png |
| ... | ... | ... |
| `partner5Name` | Text | "Active Network" |
| `partner5Logo` | Media (Single) | logo.png |

### **Current Capacity**
- **Maximum partners**: 5
- **To add more**: Update `strapi.js` (lines 609-615) and add fields in Strapi

---

## 📝 Implementation Details

### **Data Structure (from Strapi)**
```609:615:/Users/joshuathompson/active-away-astro/src/utils/strapi.js
      partners: [
        { name: data.partner1Name, logo: data.partner1Logo ? getStrapiImageData(data.partner1Logo) : null },
        { name: data.partner2Name, logo: data.partner2Logo ? getStrapiImageData(data.partner2Logo) : null },
        { name: data.partner3Name, logo: data.partner3Logo ? getStrapiImageData(data.partner3Logo) : null },
        { name: data.partner4Name, logo: data.partner4Logo ? getStrapiImageData(data.partner4Logo) : null },
        { name: data.partner5Name, logo: data.partner5Logo ? getStrapiImageData(data.partner5Logo) : null },
      ].filter(p => p.name && p.logo),
```

### **Logo Object Structure**
```javascript
{
  url: "https://activeaway.com/cdn-cgi/imagedelivery/.../public",
  alt: "Partner name logo",
  width: 600,
  height: 300,
  name: "partner-logo.png",
  mime: "image/png",
  size: 45.32
}
```

### **Fallback Behavior**
If Strapi data is unavailable, the component uses hardcoded Cloudflare images as placeholders.

---

## 🎨 Design Best Practices

### **Logo Preparation Checklist**
- [ ] Logo is in PNG format with transparency
- [ ] Image is 2x resolution (800x400px for 400x200px display)
- [ ] File size is under 100KB
- [ ] Logo has internal padding (10-20px)
- [ ] Logo looks good in grayscale
- [ ] Logo is recognizable at small sizes
- [ ] Background is fully transparent
- [ ] High contrast elements

### **Testing Your Logo**
1. **Upload to Strapi** and save
2. **View on mobile** (smallest size first)
3. **Check grayscale appearance** (default state)
4. **Test hover effect** (should show color)
5. **Verify on different backgrounds** (gray-50 card)

---

## 🚀 Adding More Partners

### **Option 1: Quick Add (Current System)**
1. Go to Strapi → Content Manager → Home
2. Add partner name and logo to available slots (1-5)
3. Save and publish

### **Option 2: Expand Beyond 5 Partners**

#### Update Strapi:
```
Add fields:
- partner6Name (Text)
- partner6Logo (Media - Single)
- partner7Name (Text)
- partner7Logo (Media - Single)
etc.
```

#### Update Code (`src/utils/strapi.js`):
```javascript
partners: [
  { name: data.partner1Name, logo: data.partner1Logo ? getStrapiImageData(data.partner1Logo) : null },
  { name: data.partner2Name, logo: data.partner2Logo ? getStrapiImageData(data.partner2Logo) : null },
  { name: data.partner3Name, logo: data.partner3Logo ? getStrapiImageData(data.partner3Logo) : null },
  { name: data.partner4Name, logo: data.partner4Logo ? getStrapiImageData(data.partner4Logo) : null },
  { name: data.partner5Name, logo: data.partner5Logo ? getStrapiImageData(data.partner5Logo) : null },
  { name: data.partner6Name, logo: data.partner6Logo ? getStrapiImageData(data.partner6Logo) : null },
  { name: data.partner7Name, logo: data.partner7Logo ? getStrapiImageData(data.partner7Logo) : null },
].filter(p => p.name && p.logo),
```

#### Update Grid (optional for more than 5):
For 6-8 partners, consider changing the grid:
```astro
<!-- From: -->
<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-12">

<!-- To: -->
<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-12">
```

---

## 🎯 Example Workflow

### **Adding a New Partner Logo**

1. **Prepare the logo:**
   - Export as PNG with transparency
   - Resize to 800x400px (2x resolution)
   - Optimize file size (use TinyPNG or similar)
   - Verify grayscale appearance

2. **Upload to Strapi:**
   - Go to: Strapi → Content Manager → Home (Single Type)
   - Find available partner slot (e.g., `partner1Name`, `partner1Logo`)
   - Fill in partner name: "Tennis Foundation"
   - Upload logo image
   - Add alt text: "Tennis Foundation logo"
   - Save and Publish

3. **Verify on frontend:**
   - Check mobile view (80px height)
   - Check desktop view (112px height)
   - Hover to see color appear
   - Verify alt text in dev tools

---

## 🔍 Troubleshooting

### **Logo appears with white box:**
- **Cause**: Background not transparent
- **Fix**: Re-export with transparency enabled

### **Logo is too small/too big:**
- **Cause**: Image dimensions don't match container ratio
- **Fix**: Use 2:1 aspect ratio (800x400px)

### **Logo is blurry:**
- **Cause**: Image resolution too low
- **Fix**: Use 2x resolution (800x400px for 400x200px display)

### **Grayscale looks bad:**
- **Cause**: Logo relies on color for distinction
- **Fix**: Use high-contrast, simple design

### **File is too large:**
- **Cause**: Unoptimized image
- **Fix**: Use TinyPNG or similar compression tool

### **Logo not showing:**
- **Cause**: Missing name or logo in Strapi
- **Fix**: Both `partnerXName` AND `partnerXLogo` must be filled

---

## 📊 Performance Notes

- **Lazy loading**: All logos use `loading="lazy"`
- **Image optimization**: Cloudflare Images automatically optimizes
- **File size target**: < 100KB per logo
- **Total section weight**: < 500KB for all 5 logos

---

**Last Updated:** October 27, 2025  
**Current Partners:** 5 slots available  
**Grid Layout:** 2-3-5 columns (mobile-tablet-desktop)

