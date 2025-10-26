# Strapi Integration Guide

This guide explains how to connect your Astro site with your Strapi CMS located at `/Users/joshuathompson/strapi/strapi`.

## 📚 Documentation

- **📖 [Image Management Guide](./STRAPI_IMAGE_GUIDE.md)** - Complete guide for managing images with Strapi + Cloudflare
- **⚡ [Image Cheat Sheet](./STRAPI_IMAGE_CHEATSHEET.md)** - Quick reference for common image tasks
- **🔧 This Document** - General Strapi setup and API usage

## 🚀 Quick Setup

### 1. Environment Variables

Create a `.env` file in your Astro project root:

```bash
# .env
STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your-api-token-here
```

**To get your API token:**
1. Start your Strapi server: `cd /Users/joshuathompson/strapi/strapi && npm run develop`
2. Go to `http://localhost:1337/admin`
3. Navigate to **Settings** → **API Tokens**
4. Click **Create new API Token**
5. Name it "Astro Frontend"
6. Set Token type to "Read-only"
7. Set Token duration to "Unlimited"
8. Click **Save** and copy the token

### 2. Content Types in Strapi

You'll need to create the following content types in your Strapi admin panel:

#### **Location** (Collection Type)
- `name` (Text, Required)
- `slug` (UID, based on name)
- `description` (Rich Text)
- `image` (Media - Single)
- `featured` (Boolean, Default: false)
- `price` (Text)
- `tags` (Text, repeatable)

#### **Event** (Collection Type)
- `title` (Text, Required)
- `slug` (UID, based on title)
- `description` (Rich Text)
- `date` (Date, Required)
- `endDate` (Date)
- `price` (Text)
- `image` (Media - Single)
- `location` (Relation to Location)
- `featured` (Boolean, Default: false)

#### **Blog Post** (Collection Type)
- `title` (Text, Required)
- `slug` (UID, based on title)
- `content` (Rich Text, Required)
- `excerpt` (Text)
- `author` (Text)
- `publishedAt` (DateTime)
- `featuredImage` (Media - Single)
- `category` (Enumeration: Tennis, Padel, Pickleball, Travel, Tips)

#### **Partner** (Collection Type)
- `name` (Text, Required)
- `logo` (Media - Single, Required)
- `website` (Text)
- `order` (Number)

#### **Testimonial** (Collection Type)
- `name` (Text, Required)
- `review` (Rich Text, Required)
- `rating` (Number, Min: 1, Max: 5)
- `avatar` (Media - Single)
- `location` (Text)
- `date` (Date)

#### **Gallery Image** (Collection Type)
- `title` (Text)
- `image` (Media - Single, Required)
- `order` (Number)
- `description` (Text)

#### **Hero Section** (Single Type)
- `headline` (Text, Required)
- `subheadline` (Text)
- `backgroundImage` (Media - Single)
- `ctaButton` (Component)
  - `text` (Text)
  - `link` (Text)

#### **Site Settings** (Single Type)
- `siteName` (Text)
- `logo` (Media - Single)
- `socialMedia` (Component - Repeatable)
  - `platform` (Enumeration: Facebook, Instagram, LinkedIn, Twitter)
  - `url` (Text)

### 3. Enable Public Access

For each content type:
1. Go to **Settings** → **Roles** → **Public**
2. Enable **find** and **findOne** permissions
3. Click **Save**

## 📝 Usage Examples

### Example 1: Fetch Locations in a Component

```astro
---
// src/components/LocationsFromStrapi.astro
import { getLocations, getStrapiImageUrl } from '../utils/strapi.js';

const locations = await getLocations();
---

<section class="w-full bg-white py-12 sm:py-16 lg:py-24 px-3 sm:px-10">
  <div class="container mx-auto">
    <h2 class="font-playfair text-4xl font-bold text-center mb-12">Our Locations</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      {locations.map((location) => (
        <div class="rounded-lg overflow-hidden shadow-lg">
          {location.attributes.image && (
            <img 
              src={getStrapiImageUrl(location.attributes.image)} 
              alt={location.attributes.name}
              class="w-full h-64 object-cover"
            />
          )}
          <div class="p-6">
            <h3 class="font-playfair text-2xl font-bold mb-2">
              {location.attributes.name}
            </h3>
            <p class="text-gray-600">
              {location.attributes.description}
            </p>
            {location.attributes.price && (
              <p class="text-gold font-semibold mt-4">
                From {location.attributes.price}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
```

### Example 2: Fetch Events

```astro
---
// src/components/EventsFromStrapi.astro
import { getUpcomingEvents, getStrapiImageUrl } from '../utils/strapi.js';

const events = await getUpcomingEvents();
---

<section class="w-full bg-gray-50 py-12 sm:py-16 lg:py-24 px-3 sm:px-10">
  <div class="container mx-auto">
    <h2 class="font-playfair text-4xl font-bold text-center mb-12">Upcoming Events</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      {events.map((event) => (
        <article class="bg-white rounded-lg overflow-hidden shadow-lg">
          {event.attributes.image && (
            <img 
              src={getStrapiImageUrl(event.attributes.image)} 
              alt={event.attributes.title}
              class="w-full h-48 object-cover"
            />
          )}
          <div class="p-6">
            <time class="text-gold text-sm font-semibold">
              {new Date(event.attributes.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </time>
            <h3 class="font-playfair text-xl font-bold mt-2 mb-3">
              {event.attributes.title}
            </h3>
            <p class="text-gray-600 text-sm">
              {event.attributes.description}
            </p>
          </div>
        </article>
      ))}
    </div>
  </div>
</section>
```

### Example 3: Fetch Blog Posts

```astro
---
// src/pages/blog/index.astro
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getBlogPosts, getStrapiImageUrl } from '../../utils/strapi.js';

const posts = await getBlogPosts();
---

<BaseLayout title="Blog - Active Away">
  <div class="container mx-auto px-4 py-16">
    <h1 class="font-playfair text-5xl font-bold text-center mb-12">Our Blog</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <article class="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
          <a href={`/blog/${post.attributes.slug}`}>
            {post.attributes.featuredImage && (
              <img 
                src={getStrapiImageUrl(post.attributes.featuredImage)} 
                alt={post.attributes.title}
                class="w-full h-56 object-cover"
              />
            )}
            <div class="p-6">
              <h2 class="font-playfair text-2xl font-bold mb-3 hover:text-gold transition-colors">
                {post.attributes.title}
              </h2>
              {post.attributes.excerpt && (
                <p class="text-gray-600 mb-4">
                  {post.attributes.excerpt}
                </p>
              )}
              <div class="flex justify-between items-center text-sm text-gray-500">
                <span>{post.attributes.author || 'Active Away'}</span>
                <time>
                  {new Date(post.attributes.publishedAt).toLocaleDateString()}
                </time>
              </div>
            </div>
          </a>
        </article>
      ))}
    </div>
  </div>
</BaseLayout>
```

### Example 4: Dynamic Blog Post Pages

```astro
---
// src/pages/blog/[slug].astro
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getBlogPosts, getBlogPostBySlug, getStrapiImageUrl } from '../../utils/strapi.js';

export async function getStaticPaths() {
  const posts = await getBlogPosts();
  
  return posts.map(post => ({
    params: { slug: post.attributes.slug },
    props: { post }
  }));
}

const { post } = Astro.props;
const { title, content, author, publishedAt, featuredImage, excerpt } = post.attributes;
---

<BaseLayout title={`${title} - Active Away Blog`} description={excerpt}>
  <article class="container mx-auto px-4 py-16 max-w-4xl">
    {featuredImage && (
      <img 
        src={getStrapiImageUrl(featuredImage)} 
        alt={title}
        class="w-full h-96 object-cover rounded-lg mb-8"
      />
    )}
    
    <header class="mb-8">
      <h1 class="font-playfair text-5xl font-bold mb-4">{title}</h1>
      <div class="flex items-center gap-4 text-gray-600">
        <span>By {author || 'Active Away'}</span>
        <span>•</span>
        <time>{new Date(publishedAt).toLocaleDateString()}</time>
      </div>
    </header>
    
    <div class="prose prose-lg max-w-none" set:html={content} />
  </article>
</BaseLayout>
```

## 🔄 Migration Strategy

### Phase 1: Test with One Section (Recommended First Step)
1. Create the **Event** content type in Strapi
2. Add 2-3 sample events
3. Update `EventsTailwind.astro` to use `getEvents()` instead of hardcoded data
4. Test locally

### Phase 2: Migrate Additional Sections
- Locations
- Blog Posts
- Partners
- Testimonials

### Phase 3: Advanced Features
- Set up webhooks to trigger Cloudflare Pages rebuilds on content changes
- Add preview functionality
- Implement search functionality

## 🔧 Cloudflare Images with Strapi

You can continue using Cloudflare Images even with Strapi:

**Option 1: Store Cloudflare URLs in Strapi**
- Use Text fields to store Cloudflare image URLs
- Keep using your existing `cloudflareImages.js` utility

**Option 2: Upload to Strapi, Proxy through Cloudflare**
- Upload images to Strapi
- Use Cloudflare Image Resizing to proxy/optimize images
- Configure your Cloudflare worker

## 📚 Additional Resources

- [Strapi Documentation](https://docs.strapi.io)
- [Astro + Strapi Guide](https://docs.astro.build/en/guides/cms/strapi/)
- [Strapi REST API Reference](https://docs.strapi.io/dev-docs/api/rest)

## 🐛 Troubleshooting

### CORS Errors
Add to your Strapi `config/middlewares.js`:

```javascript
module.exports = [
  // ...
  {
    name: 'strapi::cors',
    config: {
      origin: ['http://localhost:4321', 'https://activeaway.com'],
    },
  },
  // ...
];
```

### Images Not Loading
1. Check Strapi is running: `http://localhost:1337/admin`
2. Verify API token is correct in `.env`
3. Ensure image fields are populated in API response

### Build Errors
- Ensure Strapi is accessible during build time
- Consider caching API responses
- Use fallback data for failed requests

