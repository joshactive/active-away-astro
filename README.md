# Active Away - Astro Website

Responsive homepage for Active Away built with Astro, Tailwind CSS, and Cloudflare Images.

## 🚀 Features

- **Astro Framework** - Fast, modern static site generator
- **Tailwind CSS** - Utility-first CSS framework
- **Cloudflare Images** - Dynamic image optimization and delivery
- **Responsive Design** - Mobile-first approach with breakpoints for mobile, tablet, and desktop
- **Fully responsive sections for all screen sizes

## 📁 Project Structure

```
├── public/
│   ├── favicon.svg
│   ├── images/                    # Local fallback images
│   └── responsive-check.html     # Responsive testing page
├── src/
│   ├── components/
│   │   ├── *Tailwind.astro      # All component files
│   │   └── ui/                   # UI component directory
│   ├── layouts/
│   │   └── BaseLayout.astro      # Main layout
│   ├── pages/
│   │   └── index.astro           # Home page
│   ├── utils/
│   │   └── cloudflareImages.js   # Cloudflare Images utility
│   └── assets/
└── package.json
```

## 🖼️ Image Management

### Cloudflare Images
All images are dynamically loaded from Cloudflare Images for optimal performance. Images can be managed either through:

1. **Hardcoded mapping** - See `CLOUDFLARE_INTEGRATION.md`
2. **Strapi CMS** - Upload images to Strapi, automatically synced to Cloudflare

### Strapi Integration
This project is integrated with Strapi CMS for content management. Images uploaded to Strapi are automatically stored in Cloudflare Images.

**Documentation:**
- 📖 [Image Management Guide](./STRAPI_IMAGE_GUIDE.md) - Complete guide for Strapi + Cloudflare images
- ⚡ [Image Cheat Sheet](./STRAPI_IMAGE_CHEATSHEET.md) - Quick reference
- 🔧 [Strapi Integration](./STRAPI_INTEGRATION.md) - General Strapi setup
- 💡 [Usage Examples](./EXAMPLE_STRAPI_USAGE.md) - Practical implementation examples

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 Testing

- **Main Site**: http://localhost:4322/
- **Responsive Check**: http://localhost:4322/responsive-check.html

## 📝 Components

All sections are built as Tailwind-based components:
- HeroTailwind.astro
- LocationsTailwind.astro
- AboutUsTailwind.astro
- EventsTailwind.astro
- OurPartnersTailwind.astro
- RacketHolidaySpecialistsTailwind.astro
- ThrivingCommunityTailwind.astro
- WhatDoWeOfferTailwind.astro
- StoriesOfHopeTailwind.astro
- OurBlogTailwind.astro
- GalleryTailwind.astro
- HolidayExpertsTailwind.astro
- FooterTailwind.astro

## 🎨 Styling

- Tailwind CSS for all styling
- Custom breakpoints defined in `tailwind.config.js`
- Responsive padding defaults: 24px (mobile), 40px (tablet)
- Desktop padding: Current responsive values

## 📦 Dependencies

- astro: ^5.15.1
- @astrojs/tailwind: ^6.0.2
- @astrojs/react: Latest
- react: Latest
- react-dom: Latest
- tailwindcss: ^3.4.18
- lucide-react: Latest
- shadcn/ui components (Button, etc.)
- class-variance-authority: Latest
- clsx: Latest
- tailwind-merge: Latest
- @radix-ui/react-slot: Latest

## 🔧 Utilities

### Strapi Utils (`src/utils/strapi.js`)
- `fetchAPI()` - Generic Strapi API fetcher
- `getStrapiImageUrl()` - Get image URL (auto-transforms to activeaway.com)
- `getStrapiImageData()` - Get complete image data (URL, alt, width, height)
- `getStrapiImagesData()` - Get multiple images data
- `getCloudflareImageVariant()` - Generate URL with specific size variant
- `extractCloudflareImageId()` - Extract image ID from URL
- Content-specific fetchers: `getHomePage()`, `getLocations()`, `getEvents()`, etc.

### Cloudflare Images Utils (`src/utils/cloudflareImages.js`)
- `getImageByName()` - Get image URL from hardcoded mapping
- `generateSrcSet()` - Generate responsive srcset

### Components
- `<StrapiImage>` - Automatic image component for Strapi images
- `<Button>` - shadcn/ui styled button with variants
- Lucide icon wrappers for React components

