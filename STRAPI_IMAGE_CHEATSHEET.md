# Strapi Image Management - Quick Reference

## 🎯 Quick Start

### 1️⃣ Simple Image (Recommended)
```astro
---
import StrapiImage from '../components/StrapiImage.astro';
const data = await getHomePage();
---

<StrapiImage image={data.hero_image} class="w-full" />
```

### 2️⃣ Get URL Only
```javascript
import { getStrapiImageUrl } from '../utils/strapi.js';
const url = getStrapiImageUrl(data.hero_image);
```

### 3️⃣ Get Full Image Data
```javascript
import { getStrapiImageData } from '../utils/strapi.js';
const { url, alt, width, height } = getStrapiImageData(data.hero_image);
```

## 📋 Common Use Cases

### Hero Background
```astro
<StrapiImage 
  image={data.hero_bg} 
  class="absolute inset-0 w-full h-full object-cover"
  loading="eager"
  fetchpriority="high"
/>
```

### Gallery Grid
```astro
{images.map((img) => (
  <StrapiImage 
    image={img} 
    variant="400x400"
    class="rounded-lg"
    loading="lazy"
  />
))}
```

### Thumbnail
```astro
<StrapiImage 
  image={data.thumb} 
  variant="200x200"
  class="w-20 h-20 rounded-full"
/>
```

### Background Image (CSS)
```astro
---
const bgUrl = getStrapiImageUrl(data.background);
---
<div style={`background-image: url('${bgUrl}');`}>
```

## 🎨 Size Variants

| Variant | Use Case |
|---------|----------|
| `public` | Original size (default) |
| `200x200` | Small thumbnail |
| `400x300` | Card thumbnail |
| `800x600` | Medium preview |
| `1200x800` | Large image |
| `1920x1080` | Full HD hero |

## ⚡ Props for `<StrapiImage>`

```astro
<StrapiImage 
  image={strapiField}        // Required
  variant="800x600"          // Optional: size variant
  class="rounded-lg"         // Optional: CSS classes
  loading="lazy"             // Optional: eager | lazy
  fetchpriority="high"       // Optional: high | low | auto
  sizes="100vw"              // Optional: responsive sizes
/>
```

## 🔧 Multiple Images

```javascript
import { getStrapiImagesData } from '../utils/strapi.js';

const images = getStrapiImagesData(data.gallery);
// Returns array: [{ url, alt, width, height }, ...]
```

## 🚀 Performance Tips

✅ **DO:**
- Use `loading="eager"` for above-the-fold images
- Use `loading="lazy"` for below-the-fold images
- Use appropriate `variant` sizes
- Always include alt text in Strapi

❌ **DON'T:**
- Load full-size images for thumbnails
- Forget to add alt text in Strapi
- Use inline styles for complex layouts

## 🎯 URL Transformation

**Strapi gives you:**
```
https://imagedelivery.net/-aT8Z2F9gGvZ9fdofZcCaQ/abc123/public
```

**We transform to:**
```
https://activeaway.com/cdn-cgi/imagedelivery/-aT8Z2F9gGvZ9fdofZcCaQ/abc123/public
```

**Automatic!** No manual work needed. ✨

## 📝 Strapi Content Type Example

```json
{
  "hero_image": {
    "type": "media",
    "multiple": false,
    "required": true,
    "allowedTypes": ["images"]
  },
  "gallery": {
    "type": "media",
    "multiple": true,
    "required": false,
    "allowedTypes": ["images"]
  }
}
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Image not loading | Check Strapi published status |
| Wrong domain | Using `getStrapiImageUrl()` transforms automatically |
| No alt text | Add in Strapi Media Library |
| Image too large | Use `variant` prop to specify size |

---

**Need more details?** See `STRAPI_IMAGE_GUIDE.md`

