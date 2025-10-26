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

## 🖼️ Cloudflare Images Integration

All images are dynamically loaded from Cloudflare Images for optimal performance. See `CLOUDFLARE_INTEGRATION.md` for detailed setup instructions.

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
- tailwindcss: ^3.4.18
- lucide-react: ^0.548.0

