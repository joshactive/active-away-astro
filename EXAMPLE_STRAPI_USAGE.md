# Practical Example: Adding Strapi Images to Your Components

This document shows real examples of how to integrate Strapi images into your existing Active Away components.

## Example 1: Hero Section with Optional Strapi Background

Here's how to add an **optional** Strapi hero background image to `HeroTailwind.astro`:

```astro
---
import { getImageByName, generateSrcSet } from '../utils/cloudflareImages.js';
import { getHomePage, getStrapiImageData, extractCloudflareImageId } from '../utils/strapi.js';

// Fetch home page data from Strapi (if available)
let homeData = null;
let strapiHeroBg = null;

try {
  homeData = await getHomePage();
  if (homeData?.hero_background_image) {
    strapiHeroBg = getStrapiImageData(homeData.hero_background_image);
  }
} catch (error) {
  console.warn('Could not fetch Strapi data, using defaults');
}

// Fallback to hardcoded images if Strapi data not available
const heroBgUrl = strapiHeroBg?.url || getImageByName('hero-bg', { size: 'public' });

// Generate srcset
let heroBgSrcSet;
if (strapiHeroBg?.url) {
  const imageId = extractCloudflareImageId(strapiHeroBg.url);
  heroBgSrcSet = generateSrcSet(imageId, [
    { size: '480x270', width: 480 },
    { size: '768x432', width: 768 },
    { size: '1200x675', width: 1200 },
    { size: '1920x1080', width: 1920 }
  ]);
} else {
  heroBgSrcSet = generateSrcSet('03bade93-3cf6-49b0-047f-a9eb556aa200', [
    { size: '480x270', width: 480 },
    { size: '768x432', width: 768 },
    { size: '1200x675', width: 1200 },
    { size: '1920x1080', width: 1920 }
  ]);
}

// Use Strapi heading or fallback
const mainHeading = homeData?.main_heading || 'Exceptional Tennis, Padel & Pickleball Holidays';
---

<!-- Hero section with background -->
<div class="relative w-full h-screen">
  <!-- Background Image -->
  <div class="absolute inset-0">
    <img 
      src={heroBgUrl}
      srcset={heroBgSrcSet}
      sizes="100vw"
      alt={strapiHeroBg?.alt || "Hero background"}
      width={strapiHeroBg?.width || 1920}
      height={strapiHeroBg?.height || 1080}
      class="w-full h-full object-cover"
      loading="eager"
    />
  </div>
  
  <!-- Content overlay -->
  <div class="relative z-10">
    <h1>{mainHeading}</h1>
  </div>
</div>
```

## Example 2: Location Cards from Strapi

Create a new component that fetches and displays location cards:

```astro
---
// src/components/LocationsFromStrapi.astro
import { getLocations } from '../utils/strapi.js';
import StrapiImage from '../components/StrapiImage.astro';

const locations = await getLocations();
---

<section class="py-12 sm:py-16 lg:py-24">
  <div class="container mx-auto px-4">
    <h2 class="text-4xl font-playfair font-bold text-center mb-12">
      Our Destinations
    </h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {locations.map((location) => (
        <div class="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
          <!-- Location Image -->
          <StrapiImage 
            image={location.featured_image}
            variant="800x600"
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          
          <!-- Location Details -->
          <div class="p-6">
            <h3 class="text-2xl font-playfair font-bold mb-2">
              {location.title}
            </h3>
            <p class="text-gray-600 mb-4">
              {location.description}
            </p>
            {location.price && (
              <p class="text-gold font-semibold text-lg">
                From {location.price}
              </p>
            )}
            <a 
              href={`/locations/${location.slug}`}
              class="inline-block mt-4 bg-gold text-white px-6 py-2 rounded-full hover:bg-gold-700 transition-colors"
            >
              View Details
            </a>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
```

Then use it in your page:
```astro
---
// src/pages/index.astro
import LocationsFromStrapi from '../components/LocationsFromStrapi.astro';
---

<LocationsFromStrapi />
```

## Example 3: Events Section with Mixed Sources

Combine hardcoded events with Strapi events:

```astro
---
import { getEvents } from '../utils/strapi.js';
import StrapiImage from '../components/StrapiImage.astro';

// Fetch events from Strapi
let strapiEvents = [];
try {
  strapiEvents = await getEvents();
} catch (error) {
  console.warn('Could not fetch events from Strapi');
}

// Hardcoded fallback events
const fallbackEvents = [
  {
    title: "Summer Tennis Camp",
    date: "2025-07-15",
    location: "Algarve, Portugal",
    image: getImageByName('event-1', { size: 'public' }),
    price: "£1,250"
  },
  // ... more fallback events
];

// Use Strapi events if available, otherwise use fallbacks
const events = strapiEvents.length > 0 ? strapiEvents : fallbackEvents;
---

<section class="py-12 sm:py-16 lg:py-24 bg-gray-50">
  <div class="container mx-auto px-4">
    <h2 class="text-4xl font-playfair font-bold text-center mb-12">
      Upcoming Events
    </h2>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      {events.map((event) => (
        <div class="bg-white rounded-lg overflow-hidden shadow-lg">
          {/* Check if it's from Strapi or hardcoded */}
          {event.featured_image ? (
            <StrapiImage 
              image={event.featured_image}
              variant="600x400"
              class="w-full h-48 object-cover"
            />
          ) : (
            <img 
              src={event.image}
              alt={event.title}
              class="w-full h-48 object-cover"
            />
          )}
          
          <div class="p-6">
            <h3 class="text-xl font-bold mb-2">{event.title}</h3>
            <p class="text-gray-600 mb-2">
              {new Date(event.date).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
            <p class="text-gray-600 mb-4">{event.location}</p>
            {event.price && (
              <p class="text-gold font-semibold">{event.price}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
```

## Example 4: Gallery with Strapi Images

```astro
---
import { getStrapiImagesData } from '../utils/strapi.js';

// Fetch gallery from Strapi
let galleryData = null;
let galleryImages = [];

try {
  const response = await fetchAPI('/gallery?populate=*');
  if (response.data?.images) {
    galleryImages = getStrapiImagesData(response.data.images);
  }
} catch (error) {
  console.warn('Could not fetch gallery from Strapi');
}
---

<section class="py-12 sm:py-16 lg:py-24">
  <div class="container mx-auto px-4">
    <h2 class="text-4xl font-playfair font-bold text-center mb-12">
      Gallery
    </h2>
    
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {galleryImages.map((image) => (
        <a 
          href={image.url} 
          data-lightbox="gallery"
          class="block overflow-hidden rounded-lg hover:opacity-90 transition-opacity"
        >
          <img
            src={getCloudflareImageVariant(image.url, '400x400')}
            alt={image.alt}
            width={400}
            height={400}
            class="w-full h-64 object-cover"
            loading="lazy"
          />
        </a>
      ))}
    </div>
  </div>
</section>
```

## Example 5: Partner Logos from Strapi

```astro
---
import { getPartners, getStrapiImageData } from '../utils/strapi.js';

let partners = [];
try {
  const partnerData = await getPartners();
  partners = partnerData.map(partner => ({
    name: partner.name,
    logo: getStrapiImageData(partner.logo),
    url: partner.website_url
  }));
} catch (error) {
  console.warn('Could not fetch partners from Strapi');
}
---

<section class="py-12 bg-white">
  <div class="container mx-auto px-4">
    <h2 class="text-center text-2xl font-semibold mb-8">Our Partners</h2>
    
    <div class="flex flex-wrap justify-center items-center gap-8">
      {partners.map((partner) => (
        <a 
          href={partner.url}
          target="_blank"
          rel="noopener noreferrer"
          class="grayscale hover:grayscale-0 transition-all"
        >
          <img
            src={partner.logo.url}
            alt={partner.logo.alt || partner.name}
            width={partner.logo.width}
            height={partner.logo.height}
            class="h-12 w-auto"
            loading="lazy"
          />
        </a>
      ))}
    </div>
  </div>
</section>
```

## Migration Strategy

### Step 1: Keep Existing Hardcoded Images
Don't delete your existing `cloudflareImages.js` setup. Keep it as a fallback.

### Step 2: Add Strapi Fields Gradually
Add one content type at a time:
1. ✅ Home page (hero heading/subheading) - DONE
2. 🔄 Locations
3. 🔄 Events
4. 🔄 Blog posts
5. 🔄 Gallery

### Step 3: Use Try-Catch Blocks
Always wrap Strapi calls in try-catch with fallbacks:

```astro
---
let strapiData = null;
try {
  strapiData = await getFromStrapi();
} catch (error) {
  console.warn('Strapi unavailable, using fallback');
}

const content = strapiData?.field || 'Hardcoded Fallback';
---
```

### Step 4: Test Both Scenarios
1. **With Strapi running** - Content should come from Strapi
2. **Without Strapi** - Site should still work with fallbacks

## 🎯 Key Takeaways

1. **Always provide fallbacks** - Site should work even if Strapi is down
2. **Use `<StrapiImage>` component** - Handles URL transformation and dimensions automatically
3. **Transform URLs** - `getStrapiImageUrl()` converts imagedelivery.net to activeaway.com
4. **Explicit sizes** - Always use width/height attributes (automatic with `<StrapiImage>`)
5. **Lazy load** - Use `loading="lazy"` for below-the-fold images
6. **Alt text** - Fill in Strapi Media Library for accessibility

## 🚀 Next Steps

1. Review the [Image Management Guide](./STRAPI_IMAGE_GUIDE.md) for detailed documentation
2. Check the [Cheat Sheet](./STRAPI_IMAGE_CHEATSHEET.md) for quick syntax reference
3. Start migrating one component at a time
4. Test thoroughly with and without Strapi connection

---

**Questions?** Refer to the main `STRAPI_INTEGRATION.md` guide.

