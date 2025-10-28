# Strapi Home Page Implementation Guide

## ✅ Completed

1. **Strapi Schema Updated** - Added all fields to `/strapi/strapi/src/api/home/content-types/home/schema.json`
2. **Schema Deployed** - Pushed to Railway and deployed
3. **Query Function Added** - `getHomeData()` function added to `src/utils/strapi.js`

## 📋 What's Left

Update 8 frontend components to use the new Strapi data instead of hardcoded values.

## 🔧 How to Use

### 1. Import the function in your component:

```astro
---
import { getHomeData } from '../utils/strapi.js';

const homeData = await getHomeData();
---
```

### 2. Access data by section:

```javascript
// Hero section
homeData.hero.heading
homeData.hero.subHeading
homeData.hero.headerImage.url
homeData.hero.testimonialImages[0].url

// About section
homeData.about.kicker
homeData.about.title
homeData.about.description
homeData.about.content
homeData.about.stats[0]
homeData.about.images.image1.url
homeData.about.images.image2.url

// Jamie Murray section
homeData.jamieMurray.title
homeData.jamieMurray.description
homeData.jamieMurray.buttonText
homeData.jamieMurray.videoUrl
homeData.jamieMurray.image.url

// Partners (array)
homeData.partners[0].name
homeData.partners[0].logo.url

// Racket Specialist
homeData.racketSpecialist.title
homeData.racketSpecialist.description
homeData.racketSpecialist.bulletPoints[0]
homeData.racketSpecialist.buttonText
homeData.racketSpecialist.images.bg.url
homeData.racketSpecialist.images.overlay.url
homeData.racketSpecialist.images.mask.url

// Thriving Community
homeData.thrivingCommunity.title
homeData.thrivingCommunity.description
homeData.thrivingCommunity.bulletPoints[0]
homeData.thrivingCommunity.buttonText
homeData.thrivingCommunity.images.bg.url
homeData.thrivingCommunity.images.image1.url
homeData.thrivingCommunity.images.image2.url

// Stories
homeData.stories.title
homeData.stories.subtitle
homeData.stories.googleIcon.url
homeData.stories.testimonials[0].name
homeData.stories.testimonials[0].date
homeData.stories.testimonials[0].rating
homeData.stories.testimonials[0].text
homeData.stories.testimonials[0].avatar.url

// Accordions
homeData.accordions.title
homeData.accordions.items[0].id
homeData.accordions.items[0].title
homeData.accordions.items[0].content
homeData.accordions.items[0].isOpen
```

## 📝 Component Update Instructions

### Component 1: HeroTailwind.astro

**Location:** `src/components/HeroTailwind.astro`

**Changes needed:**
1. Import `getHomeData` instead of individual image functions
2. Replace `man1Url`, `man2Url`, `man3Url`, `man4Url` with `homeData.hero.testimonialImages`
3. Use `homeData.hero.headerImage` for background
4. Use `homeData.hero.heading` and `homeData.hero.subHeading`

**Example:**
```astro
---
import { getHomeData } from '../utils/strapi.js';

const homeData = await getHomeData();

// Fallback to Cloudflare if Strapi data not available
const man1Url = homeData?.hero?.testimonialImages?.[0]?.url || getImageByName('man-1', { size: 'public' });
const man2Url = homeData?.hero?.testimonialImages?.[1]?.url || getImageByName('man-2', { size: 'public' });
const man3Url = homeData?.hero?.testimonialImages?.[2]?.url || getImageByName('man-3', { size: 'public' });
const man4Url = homeData?.hero?.testimonialImages?.[3]?.url || getImageByName('man-4', { size: 'public' });
---
```

### Component 2: AboutUsTailwind.astro

**Location:** `src/components/AboutUsTailwind.astro`

**Changes needed:**
1. Import `getHomeData`
2. Replace hardcoded `aboutData` object with Strapi data
3. Keep the `yearsOfExperience` calculation (not from Strapi)

**Example:**
```astro
---
import { getHomeData } from '../utils/strapi.js';

const homeData = await getHomeData();
const yearsOfExperience = new Date().getFullYear() - 2006;

// Use Strapi data with fallbacks
const aboutData = {
  kicker: homeData?.about?.kicker || "ABOUT US",
  title: homeData?.about?.title || "Why did we start Active Away?",
  description: homeData?.about?.description || "",
  content: homeData?.about?.content || "",
  stats: homeData?.about?.stats || [],
  experience: {
    years: `${yearsOfExperience}+`,
    label: "Years of Experience"
  },
  images: {
    top: homeData?.about?.images?.image2?.url || getImageByName('about-us-2', { size: 'public' }),
    bottom: homeData?.about?.images?.image1?.url || getImageByName('about-us-1', { size: 'public' })
  }
};
---
```

### Component 3: Section4Tailwind.astro

**Location:** `src/components/Section4Tailwind.astro`

**Changes needed:**
1. Import `getHomeData`
2. Use `homeData.jamieMurray.image.url` for the image

**Example:**
```astro
---
import { getHomeData } from '../utils/strapi.js';
import { getImageByName } from '../utils/cloudflareImages.js';

const homeData = await getHomeData();
const section4Image = homeData?.jamieMurray?.image?.url || getImageByName('section-4-bg', { size: 'public' });
---
```

### Component 4: JamieMurrayTailwind.astro

**Location:** `src/components/JamieMurrayTailwind.astro`

**Changes needed:**
1. Import `getHomeData`
2. Replace hardcoded text with Strapi data

**Example:**
```astro
---
import { getHomeData } from '../utils/strapi.js';

const homeData = await getHomeData();

const jamieMurrayData = {
  title: homeData?.jamieMurray?.title || "JAMIE MURRAY",
  description: homeData?.jamieMurray?.description || "",
  buttonText: homeData?.jamieMurray?.buttonText || "Learn More",
  videoUrl: homeData?.jamieMurray?.videoUrl || ""
};
---

<section class="w-full bg-white py-12 sm:py-16 lg:py-24">
  <div class="container mx-auto px-4 sm:px-10">
    <div class="w-full">
      <h3 class="text-xl sm:text-2xl lg:text-3xl font-inter font-semibold text-gray-900 mb-4 sm:mb-6">
        {jamieMurrayData.title}
      </h3>
      
      <p class="text-lg sm:text-xl lg:text-2xl font-inter font-light text-gray-600 leading-relaxed mb-6 sm:mb-8 w-full">
        {jamieMurrayData.description}
      </p>
      
      <button class="flex items-center gap-2 bg-gold hover:bg-gold-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-inter font-semibold text-base sm:text-lg transition-all duration-300 hover:-translate-y-0.5">
        <span>{jamieMurrayData.buttonText}</span>
        <svg class="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none">
          <path d="M7 17L17 7M17 7H7M17 7V17" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </div>
</section>
```

### Component 5: OurPartnersTailwind.astro

**Location:** `src/components/OurPartnersTailwind.astro`

**Changes needed:**
1. Import `getHomeData`
2. Use `homeData.partners` array

**Example:**
```astro
---
import { getHomeData } from '../utils/strapi.js';
import { getImageByName } from '../utils/cloudflareImages.js';

const homeData = await getHomeData();

// Fallback to Cloudflare images if Strapi not available
const partners = homeData?.partners?.length > 0 
  ? homeData.partners.map((p, i) => ({
      id: i + 1,
      name: p.name,
      logo: p.logo.url
    }))
  : [
      { id: 1, name: "Grapho", logo: getImageByName('partner-1', { size: 'public' }) },
      { id: 2, name: "Iconic", logo: getImageByName('partner-2', { size: 'public' }) },
      { id: 3, name: "Vectra", logo: getImageByName('partner-3', { size: 'public' }) },
      { id: 4, name: "Visualy", logo: getImageByName('partner-4', { size: 'public' }) },
      { id: 5, name: "Dexign Studio", logo: getImageByName('partner-5', { size: 'public' }) }
    ];
---
```

### Component 6: RacketHolidaySpecialistsTailwind.astro

**Location:** `src/components/RacketHolidaySpecialistsTailwind.astro`

**Changes needed:**
1. Import `getHomeData`
2. Use `homeData.racketSpecialist` data

**Example:**
```astro
---
import { getHomeData } from '../utils/strapi.js';
import { getImageByName } from '../utils/cloudflareImages.js';

const homeData = await getHomeData();

const racketSpecialistBg = homeData?.racketSpecialist?.images?.bg?.url || getImageByName('racket-specialist-bg', { size: 'public' });
const racketSpecialistOverlay = homeData?.racketSpecialist?.images?.overlay?.url || getImageByName('racket-specialist-overlay', { size: 'public' });
const racketSpecialistMask = homeData?.racketSpecialist?.images?.mask?.url || getImageByName('racket-specialist-mask', { size: 'public' });

const specialistData = {
  title: homeData?.racketSpecialist?.title || "Racket Holiday Specialists",
  description: homeData?.racketSpecialist?.description || "",
  bulletPoints: homeData?.racketSpecialist?.bulletPoints || Array(8).fill("Lorem Ipsum"),
  buttonText: homeData?.racketSpecialist?.buttonText || "Learn More"
};
---

<!-- Then in the HTML, map over bulletPoints -->
<div class="space-y-3 sm:space-y-4">
  {specialistData.bulletPoints.slice(0, 4).map((point) => (
    <div class="flex items-center gap-3">
      <div class="w-2 h-2 bg-gold rounded-full flex-shrink-0"></div>
      <span class="text-sm sm:text-base font-inter text-gray-700">{point}</span>
    </div>
  ))}
</div>
```

### Component 7: ThrivingCommunityTailwind.astro

**Location:** `src/components/ThrivingCommunityTailwind.astro`

**Changes needed:**
1. Import `getHomeData`
2. Use `homeData.thrivingCommunity` data

**Example:**
```astro
---
import { getHomeData } from '../utils/strapi.js';
import { getImageByName } from '../utils/cloudflareImages.js';

const homeData = await getHomeData();

const communityData = {
  title: homeData?.thrivingCommunity?.title || "Our Thriving Community",
  description: homeData?.thrivingCommunity?.description || "",
  bulletPoints: homeData?.thrivingCommunity?.bulletPoints || Array(8).fill("Lorem Ipsum"),
  buttonText: homeData?.thrivingCommunity?.buttonText || "Learn More",
  images: {
    top: homeData?.thrivingCommunity?.images?.bg?.url || getImageByName('thriving-community-bg', { size: 'public' }),
    bottomLeft: homeData?.thrivingCommunity?.images?.image2?.url || getImageByName('thriving-community-2', { size: 'public' }),
    bottomRight: homeData?.thrivingCommunity?.images?.image1?.url || getImageByName('thriving-community-1', { size: 'public' })
  }
};
---
```

### Component 8: StoriesOfHopeTailwind.astro

**Location:** `src/components/StoriesOfHopeTailwind.astro`

**Changes needed:**
1. Import `getHomeData`
2. Use `homeData.stories` data

**Example:**
```astro
---
import { getHomeData } from '../utils/strapi.js';
import { getImageByName } from '../utils/cloudflareImages.js';

const homeData = await getHomeData();

const storiesData = {
  title: homeData?.stories?.title || "Stories of Hope",
  subtitle: homeData?.stories?.subtitle || "Real people, real transformation",
  testimonials: homeData?.stories?.testimonials?.length > 0
    ? homeData.stories.testimonials.map((t, i) => ({
        id: i + 1,
        name: t.name,
        date: t.date,
        rating: t.rating,
        text: t.text,
        avatar: t.avatar.url
      }))
    : [], // Fallback array if needed
  googleIcon: homeData?.stories?.googleIcon?.url || getImageByName('google-icon', { size: 'public' })
};
---
```

### Component 9: HolidayExpertsTailwind.astro

**Location:** `src/components/HolidayExpertsTailwind.astro`

**Changes needed:**
1. Import `getHomeData`
2. Use `homeData.accordions` data

**Example:**
```astro
---
import { getHomeData } from '../utils/strapi.js';

const homeData = await getHomeData();

const holidayExpertsData = {
  title: homeData?.accordions?.title || "Tennis Holiday Experts",
  accordions: homeData?.accordions?.items || []
};
---

<!-- Then map over accordions in HTML -->
{holidayExpertsData.accordions.slice(0, 6).map((accordion) => (
  <div class={`accordion bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 ${accordion.isOpen ? 'shadow-lg' : 'shadow-sm hover:shadow-md'}`}>
    <!-- accordion content -->
  </div>
))}
```

## 🎯 Next Steps

1. **Deploy Schema** - Already done ✅
2. **Fill in Strapi** - Go to Strapi admin → Home → Fill in all the new fields
3. **Update Components** - Follow the examples above for each component
4. **Test** - Verify all sections load correctly from Strapi
5. **Remove Cloudflare fallbacks** (optional) - Once Strapi is fully populated

## 📌 Important Notes

- All components have **fallbacks** to Cloudflare images if Strapi data isn't available
- The `yearsOfExperience` calculation stays in the frontend (not from Strapi)
- Images are automatically transformed to use `activeaway.com/cdn-cgi/imagedelivery` URLs
- All data is fetched in a **single API call** via `getHomeData()`
- The function returns `null` if no data is found, so always use optional chaining (`?.`)

## ✅ Benefits

1. ✨ **Single API call** - All homepage data in one request
2. 📝 **Editable in Strapi** - Non-technical users can update content
3. 🎨 **Consistent structure** - Predictable data format
4. 🔄 **Fallback support** - Graceful degradation if Strapi is unavailable
5. 🖼️ **Image optimization** - Automatic Cloudflare transformation

