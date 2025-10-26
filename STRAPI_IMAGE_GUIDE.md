# Strapi + Cloudflare Images Integration Guide

This guide explains how to manage images in your Active Away Astro project using Strapi CMS integrated with Cloudflare Images.

## 🎯 Overview

When you upload an image to Strapi, it's automatically sent to Cloudflare Images and returns a URL like:
```
https://imagedelivery.net/-aT8Z2F9gGvZ9fdofZcCaQ/aa897a5c-e485-4ca2-824d-4dac78e33c00/public
```

Our utilities automatically:
1. ✅ Transform URLs to use `activeaway.com` domain
2. ✅ Extract image dimensions (width/height)
3. ✅ Apply explicit sizes to all images
4. ✅ Handle alt text from Strapi metadata

## 📦 Utilities Available

### `getStrapiImageUrl(imageField)`
Get just the URL, automatically transformed to activeaway.com domain.

```javascript
import { getStrapiImageUrl } from '../utils/strapi.js';

const imageUrl = getStrapiImageUrl(homeData.hero_image);
// Returns: https://activeaway.com/cdn-cgi/imagedelivery/-aT8Z2F9gGvZ9fdofZcCaQ/[id]/public
```

### `getStrapiImageData(imageField)`
Get complete image data including URL, alt text, and dimensions.

```javascript
import { getStrapiImageData } from '../utils/strapi.js';

const imageData = getStrapiImageData(homeData.hero_image);
// Returns:
// {
//   url: 'https://activeaway.com/cdn-cgi/imagedelivery/...',
//   alt: 'Hero background image',
//   width: 1920,
//   height: 1080,
//   name: 'hero-bg.jpg',
//   mime: 'image/jpeg',
//   size: 245678,
//   formats: { ... }
// }
```

### `getStrapiImagesData(imagesField)`
Get multiple images data (for gallery, carousel, etc.)

```javascript
import { getStrapiImagesData } from '../utils/strapi.js';

const galleryImages = getStrapiImagesData(homeData.gallery);
// Returns array of image data objects
```

### `getCloudflareImageVariant(imageUrl, size)`
Get a specific size variant of a Cloudflare image.

```javascript
import { getCloudflareImageVariant } from '../utils/strapi.js';

const thumbnailUrl = getCloudflareImageVariant(imageUrl, '400x300');
const largeUrl = getCloudflareImageVariant(imageUrl, '1200x800');
```

Common sizes:
- `public` - Original size
- `400x300` - Thumbnail
- `800x600` - Medium
- `1200x800` - Large
- `1920x1080` - Full HD

## 🖼️ Using Images in Astro Components

### Method 1: Using the `<StrapiImage>` Component (Recommended)

The easiest way - handles everything automatically:

```astro
---
import { getHomePage } from '../utils/strapi.js';
import StrapiImage from '../components/StrapiImage.astro';

const homeData = await getHomePage();
---

<!-- Simple usage -->
<StrapiImage 
  image={homeData.hero_image} 
  class="w-full h-auto rounded-lg"
  loading="eager"
/>

<!-- With responsive sizes -->
<StrapiImage 
  image={homeData.hero_image} 
  class="w-full h-auto"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  loading="lazy"
/>

<!-- With specific size variant -->
<StrapiImage 
  image={homeData.thumbnail_image} 
  variant="400x300"
  class="rounded-full"
/>
```

### Method 2: Manual Implementation with Full Control

```astro
---
import { getStrapiImageData } from '../utils/strapi.js';

const homeData = await getHomePage();
const heroImage = getStrapiImageData(homeData.hero_image);
---

<img 
  src={heroImage.url} 
  alt={heroImage.alt}
  width={heroImage.width}
  height={heroImage.height}
  class="w-full h-auto"
  loading="eager"
/>
```

### Method 3: Background Images

```astro
---
import { getStrapiImageUrl } from '../utils/strapi.js';

const homeData = await getHomePage();
const bgUrl = getStrapiImageUrl(homeData.background_image);
---

<div 
  class="hero-section"
  style={`background-image: url('${bgUrl}');`}
>
  <!-- Content here -->
</div>
```

## 🎨 Real-World Examples

### Example 1: Hero Section with Image from Strapi

```astro
---
import { getHomePage } from '../utils/strapi.js';
import StrapiImage from '../components/StrapiImage.astro';

const homeData = await getHomePage();
---

<section class="relative h-screen">
  <!-- Background Image -->
  <div class="absolute inset-0">
    <StrapiImage 
      image={homeData.hero_background} 
      class="w-full h-full object-cover"
      loading="eager"
      fetchpriority="high"
    />
  </div>
  
  <!-- Content Overlay -->
  <div class="relative z-10">
    <h1>{homeData.hero_heading}</h1>
    <p>{homeData.hero_subheading}</p>
  </div>
</section>
```

### Example 2: Location Cards with Images

```astro
---
import { getLocations } from '../utils/strapi.js';
import StrapiImage from '../components/StrapiImage.astro';

const locations = await getLocations();
---

<div class="grid grid-cols-3 gap-6">
  {locations.map((location) => (
    <div class="card">
      <StrapiImage 
        image={location.featured_image} 
        class="w-full h-48 object-cover rounded-t-lg"
        variant="800x600"
        loading="lazy"
      />
      <div class="p-4">
        <h3>{location.title}</h3>
        <p>{location.description}</p>
      </div>
    </div>
  ))}
</div>
```

### Example 3: Gallery with Multiple Images

```astro
---
import { getStrapiImagesData } from '../utils/strapi.js';
import StrapiImage from '../components/StrapiImage.astro';

const galleryData = await fetchAPI('/gallery?populate=*');
const galleryImages = getStrapiImagesData(galleryData.data.images);
---

<div class="grid grid-cols-4 gap-4">
  {galleryImages.map((image) => (
    <a href={image.url} class="block">
      <img
        src={getCloudflareImageVariant(image.url, '400x400')}
        alt={image.alt}
        width={400}
        height={400}
        class="w-full h-auto rounded-lg hover:scale-105 transition-transform"
        loading="lazy"
      />
    </a>
  ))}
</div>
```

### Example 4: Responsive Hero with Srcset

```astro
---
import { getStrapiImageData, getCloudflareImageVariant, extractCloudflareImageId } from '../utils/strapi.js';

const homeData = await getHomePage();
const heroImage = getStrapiImageData(homeData.hero_image);
const imageId = extractCloudflareImageId(heroImage.url);

// Generate responsive srcset
const srcset = [
  `${getCloudflareImageVariant(imageId, '640x360')} 640w`,
  `${getCloudflareImageVariant(imageId, '1024x576')} 1024w`,
  `${getCloudflareImageVariant(imageId, '1920x1080')} 1920w`
].join(', ');
---

<img 
  src={heroImage.url}
  srcset={srcset}
  sizes="100vw"
  alt={heroImage.alt}
  width={heroImage.width}
  height={heroImage.height}
  class="w-full h-auto"
  loading="eager"
/>
```

## 🔧 Setting Up Image Fields in Strapi

### Single Image Field
```json
{
  "hero_image": {
    "type": "media",
    "multiple": false,
    "required": true,
    "allowedTypes": ["images"]
  }
}
```

### Multiple Images Field (Gallery)
```json
{
  "gallery": {
    "type": "media",
    "multiple": true,
    "required": false,
    "allowedTypes": ["images"]
  }
}
```

### Adding Alt Text in Strapi
1. Upload your image
2. Click on the image in the Media Library
3. Fill in the **Alternative text** field
4. Click **Finish**

The alt text will automatically be used by `<StrapiImage>` and `getStrapiImageData()`.

## 📊 Image Optimization Best Practices

### 1. Use Appropriate Size Variants
```javascript
// Don't load full-size images for thumbnails
<StrapiImage image={data.thumbnail} variant="400x300" />

// Use larger sizes for hero sections
<StrapiImage image={data.hero} variant="1920x1080" />
```

### 2. Lazy Load Non-Critical Images
```astro
<!-- Hero image: eager loading -->
<StrapiImage image={hero} loading="eager" fetchpriority="high" />

<!-- Below-the-fold images: lazy loading -->
<StrapiImage image={gallery} loading="lazy" />
```

### 3. Always Provide Alt Text
Make sure to fill in alt text in Strapi's Media Library for accessibility.

### 4. Use Explicit Dimensions
The `<StrapiImage>` component and `getStrapiImageData()` automatically include width/height to prevent layout shift.

## 🚀 Migration Guide

### Migrating Existing Components to Use Strapi Images

**Before:**
```astro
---
import { getImageByName } from '../utils/cloudflareImages.js';
const heroUrl = getImageByName('hero-bg', { size: 'public' });
---

<img src={heroUrl} alt="Hero background" class="w-full" />
```

**After:**
```astro
---
import { getHomePage } from '../utils/strapi.js';
import StrapiImage from '../components/StrapiImage.astro';

const homeData = await getHomePage();
---

<StrapiImage 
  image={homeData.hero_image} 
  class="w-full"
/>
```

## 🐛 Troubleshooting

### Images Not Loading?
1. Check the console for errors
2. Verify the Strapi URL and API token in `.env`
3. Ensure images are published in Strapi
4. Check that `populate=*` is included in your API call

### Images Loading from imagedelivery.net Instead of activeaway.com?
The transformation happens automatically in `getStrapiImageUrl()`. Make sure you're using this function.

### Missing Alt Text?
Add alt text in Strapi's Media Library under "Alternative text".

### Images Too Large?
Use the `variant` prop to load smaller sizes:
```astro
<StrapiImage image={data.thumbnail} variant="400x300" />
```

## 📚 Additional Resources

- [Cloudflare Images Documentation](https://developers.cloudflare.com/images/)
- [Strapi Media Documentation](https://docs.strapi.io/user-docs/latest/content-manager/managing-relational-fields.html#media-fields)
- [Astro Image Documentation](https://docs.astro.build/en/guides/images/)

---

**Questions?** Check the main `STRAPI_INTEGRATION.md` for general Strapi setup.

