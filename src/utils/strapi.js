// Strapi API utility functions
// Support both Astro (import.meta.env) and Node.js (process.env) environments
import { getCloudflareImageUrl } from './cloudflareImages.js';
const STRAPI_URL = (typeof import.meta !== 'undefined' && import.meta.env?.STRAPI_URL) 
  || process.env.STRAPI_URL 
  || 'http://localhost:1337';
const STRAPI_TOKEN = (typeof import.meta !== 'undefined' && import.meta.env?.STRAPI_API_TOKEN) 
  || process.env.STRAPI_API_TOKEN 
  || '';

const EVENT_PLACEHOLDER_URL = getCloudflareImageUrl('45b69090-1c22-46cd-7f98-086ba71efc00', {
  width: 402,
  height: 268,
  fit: 'cover',
  format: 'auto',
  quality: 85
});

const GENERIC_PLACEHOLDER_URL = getCloudflareImageUrl('placeholder', {
  width: 455,
  height: 256,
  fit: 'cover',
  format: 'auto',
  quality: 85
});

/**
 * Fetch data from Strapi API
 * @param {string} endpoint - API endpoint (e.g., '/locations', '/events')
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} Response data
 */
export async function fetchAPI(endpoint, options = {}) {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Add authorization header if token is available.
  if (STRAPI_TOKEN) {
    defaultOptions.headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`;
  }

  try {
    const response = await fetch(
      `${STRAPI_URL}/api${endpoint}`,
      { ...defaultOptions, ...options }
    );

    if (!response.ok) {
      throw new Error(`Strapi API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching from Strapi: ${endpoint}`, error);
    throw error;
  }
}

/**
 * Get image URL from Strapi and transform to activeaway.com domain
 * @param {Object} imageData - Strapi image data object
 * @returns {string} Full image URL
 */
export function getStrapiImageUrl(imageData) {
  if (!imageData || !imageData.data) return null;
  
  const { url } = imageData.data.attributes;
  
  // Transform imagedelivery.net URLs to activeaway.com
  if (url.includes('imagedelivery.net')) {
    return url.replace(
      'https://imagedelivery.net/-aT8Z2F9gGvZ9fdofZcCaQ/',
      'https://activeaway.com/cdn-cgi/imagedelivery/-aT8Z2F9gGvZ9fdofZcCaQ/'
    );
  }
  
  // If URL is absolute, return it as is
  if (url.startsWith('http')) {
    return url;
  }
  
  // Otherwise, prepend Strapi URL
  return `${STRAPI_URL}${url}`;
}

/**
 * Get complete image data from Strapi field (URL, dimensions, alt text)
 * Handles both Strapi v4 (data.attributes) and v5 (direct object) formats
 * @param {Object} imageData - Strapi image data object
 * @returns {Object} Object with url, alt, width, height, name
 */
export function getStrapiImageData(imageData) {
  if (!imageData) {
    return { url: null, alt: '', width: undefined, height: undefined, name: '' };
  }
  
  // Strapi v5: Direct object
  if (imageData.url) {
    let url = imageData.url;
    
    // Transform imagedelivery.net URLs to activeaway.com
    if (url.includes('imagedelivery.net')) {
      url = url.replace(
        'https://imagedelivery.net/-aT8Z2F9gGvZ9fdofZcCaQ/',
        'https://activeaway.com/cdn-cgi/imagedelivery/-aT8Z2F9gGvZ9fdofZcCaQ/'
      );
    }
    
    return {
      url,
      alt: imageData.alternativeText || imageData.caption || imageData.name || '',
      width: imageData.width,
      height: imageData.height,
      name: imageData.name,
      mime: imageData.mime,
      size: imageData.size,
      formats: imageData.formats
    };
  }
  
  // Strapi v4: data.attributes structure
  if (imageData.data && imageData.data.attributes) {
    const attrs = imageData.data.attributes;
    const url = getStrapiImageUrl(imageData);
    
    return {
      url,
      alt: attrs.alternativeText || attrs.caption || attrs.name || '',
      width: attrs.width,
      height: attrs.height,
      name: attrs.name,
      mime: attrs.mime,
      size: attrs.size,
      formats: attrs.formats
    };
  }
  
  // No valid structure found
  return { url: null, alt: '', width: undefined, height: undefined, name: '' };
}

/**
 * Get multiple image URLs from Strapi
 * @param {Object} imagesData - Strapi images data object
 * @returns {Array<string>} Array of full image URLs
 */
export function getStrapiImageUrls(imagesData) {
  if (!imagesData || !imagesData.data) return [];
  
  return imagesData.data.map(img => {
    const { url } = img.attributes;
    
    // Transform imagedelivery.net URLs
    if (url.includes('imagedelivery.net')) {
      return url.replace(
        'https://imagedelivery.net/-aT8Z2F9gGvZ9fdofZcCaQ/',
        'https://activeaway.com/cdn-cgi/imagedelivery/-aT8Z2F9gGvZ9fdofZcCaQ/'
      );
    }
    
    return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
  });
}

/**
 * Get multiple image data objects from Strapi
 * @param {Object} imagesData - Strapi images data object
 * @returns {Array<Object>} Array of image data objects
 */
export function getStrapiImagesData(imagesData) {
  if (!imagesData || !imagesData.data) return [];
  
  return imagesData.data.map(img => {
    let url = img.attributes.url;
    
    // Transform imagedelivery.net URLs
    if (url.includes('imagedelivery.net')) {
      url = url.replace(
        'https://imagedelivery.net/-aT8Z2F9gGvZ9fdofZcCaQ/',
        'https://activeaway.com/cdn-cgi/imagedelivery/-aT8Z2F9gGvZ9fdofZcCaQ/'
      );
    } else if (!url.startsWith('http')) {
      url = `${STRAPI_URL}${url}`;
    }
    
    return {
      url,
      alt: img.attributes.alternativeText || img.attributes.caption || img.attributes.name || '',
      width: img.attributes.width,
      height: img.attributes.height,
      name: img.attributes.name,
      mime: img.attributes.mime
    };
  });
}

/**
 * Extract Cloudflare Image ID from URL
 * Works with both imagedelivery.net and activeaway.com URLs
 * Returns null if not a Cloudflare Images URL
 * @param {string} url - Potential Cloudflare Image URL
 * @returns {string|null} Image ID or null
 */
export function extractCloudflareImageId(url) {
  if (!url || typeof url !== 'string') return null;
  
  // Only process URLs that contain our Cloudflare account hash
  if (!url.includes('-aT8Z2F9gGvZ9fdofZcCaQ')) {
    return null;
  }
  
  // Match pattern: /imagedelivery/-aT8Z2F9gGvZ9fdofZcCaQ/[IMAGE_ID]/...
  // The image ID should be a UUID-like string followed by / or end of string
  const match = url.match(/imagedelivery\/-aT8Z2F9gGvZ9fdofZcCaQ\/([a-f0-9-]+)(?:\/|$)/i);
  return match ? match[1] : null;
}

/**
 * Generate Cloudflare Image URL with specific size variant
 * @param {string} imageIdOrUrl - Cloudflare Image ID or full URL
 * @param {string} size - Size variant (e.g., 'public', '800x600', 'thumbnail')
 * @returns {string} Cloudflare Image URL with size
 */
export function getCloudflareImageVariant(imageIdOrUrl, size = 'public') {
  let imageId = imageIdOrUrl;
  
  // If it's a full URL, extract the ID
  if (imageIdOrUrl.includes('imagedelivery')) {
    imageId = extractCloudflareImageId(imageIdOrUrl);
  }
  
  if (!imageId) return imageIdOrUrl;
  
  const baseUrl = 'https://activeaway.com/cdn-cgi/imagedelivery/-aT8Z2F9gGvZ9fdofZcCaQ';
  return `${baseUrl}/${imageId}/${size}`;
}

// ============================================
// Content Type Specific Fetch Functions
// ============================================

/**
 * Fetch all locations
 * @returns {Promise<Array>} Array of location data
 */
export async function getLocations() {
  try {
    const data = await fetchAPI('/locations?populate=*');
    return data.data || [];
  } catch (error) {
    console.error('Error fetching locations:', error);
    return [];
  }
}

/**
 * Fetch a single location by slug
 * @param {string} slug - Location slug
 * @returns {Promise<Object>} Location data
 */
export async function getLocationBySlug(slug) {
  try {
    const data = await fetchAPI(`/locations?filters[slug][$eq]=${slug}&populate=*`);
    return data.data?.[0] || null;
  } catch (error) {
    console.error('Error fetching location:', error);
    return null;
  }
}

/**
 * Fetch all events
 * @returns {Promise<Array>} Array of event data
 */
export async function getEvents() {
  try {
    const data = await fetchAPI('/events?populate=*&sort=date:asc');
    return data.data || [];
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

/**
 * Fetch upcoming/future events (where dateFrom >= today)
 * @returns {Promise<Array>} Array of formatted future event data
 */
export async function getFutureEvents() {
  try {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const data = await fetchAPI(`/events?filters[dateFrom][$gte]=${today}&populate=*&sort=dateFrom:asc&pagination[pageSize]=15`);
    
    if (!data || !data.data || data.data.length === 0) {
      return [];
    }
    
    // Map the data to the format expected by the frontend
    const events = data.data.map((item, index) => {
      const event = item.attributes || item;
      
      // Format dates as "Sat 01 - Sun 02 November 2025"
      let formattedDate = '';
      if (event.dateFrom && event.dateUntil) {
        const fromDate = new Date(event.dateFrom);
        const untilDate = new Date(event.dateUntil);
        
        const dayFrom = fromDate.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit' });
        const dayUntil = untilDate.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit' });
        const monthYear = untilDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
        
        formattedDate = `${dayFrom} - ${dayUntil} ${monthYear}`;
      }
      
      // Get featured image
      const featuredImage = event.featuredImage ? getStrapiImageData(event.featuredImage) : null;
      
      // Format price similar to locations
      const priceText = event.price ? `from £${event.price}` : null;
      const priceAmount = event.price ? `£${event.price}` : null;
      
      return {
        id: item.id || index + 1,
        title: event.title || 'Untitled Event',
        location: event.countryEvents || 'TBC',
        type: event.product || 'Event',
        date: formattedDate,
        price: priceText,
        amount: priceAmount,
        image: featuredImage?.url || EVENT_PLACEHOLDER_URL, // Fallback image with responsive transform
        imageAlt: featuredImage?.alt || event.title || 'Event image',
        imageSrcSet: featuredImage?.url ? `${featuredImage.url}?width=320 320w, ${featuredImage.url}?width=640 640w, ${featuredImage.url}?width=1024 1024w` : null
      };
    }); // Show all events, even without images (using fallback)
    
    return events;
    
  } catch (error) {
    console.error('❌ Error fetching future events:', error);
    return [];
  }
}

/**
 * Fetch upcoming events (legacy - kept for backwards compatibility)
 * @returns {Promise<Array>} Array of upcoming event data
 */
export async function getUpcomingEvents() {
  return getFutureEvents();
}

/**
 * Fetch all products (for "What Do We Offer" section)
 * @returns {Promise<Array>} Array of formatted product data
 */
export async function getProducts() {
  try {
    const data = await fetchAPI('/products?populate=*&sort=ordering:asc');
    
    if (!data || !data.data || data.data.length === 0) {
      return [];
    }
    
    // Map the data to the format expected by the frontend
    const products = data.data.map((item, index) => {
      const product = item.attributes || item;
      
      // Get product image
      const productImage = product.productImage ? getStrapiImageData(product.productImage) : null;
      
      return {
        id: item.id || index + 1,
        title: product.productTitle || 'Untitled Product',
        description: product.productDescription || '',
        image: productImage?.url || null,
        imageAlt: productImage?.alt || product.productTitle || 'Product image',
        url: product.productUrl || '#',
        ordering: product.ordering || 0
      };
    });
    
    return products;
    
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    return [];
  }
}

/**
 * Fetch all blog posts
 * @returns {Promise<Array>} Array of blog post data
 */
export async function getBlogPosts() {
  try {
    const data = await fetchAPI('/blog-posts?populate=*&sort=publishedAt:desc');
    return data.data || [];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

/**
 * Fetch a single blog post by slug
 * @param {string} slug - Blog post slug
 * @returns {Promise<Object>} Blog post data
 */
export async function getBlogPostBySlug(slug) {
  try {
    const data = await fetchAPI(`/blog-posts?filters[slug][$eq]=${slug}&populate=*`);
    return data.data?.[0] || null;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

/**
 * Fetch all partners
 * @returns {Promise<Array>} Array of partner data
 */
export async function getPartners() {
  try {
    const data = await fetchAPI('/partners?populate=*');
    return data.data || [];
  } catch (error) {
    console.error('Error fetching partners:', error);
    return [];
  }
}

/**
 * Fetch all testimonials/reviews
 * @returns {Promise<Array>} Array of testimonial data
 */
export async function getTestimonials() {
  try {
    const data = await fetchAPI('/testimonials?populate=*&sort=createdAt:desc');
    return data.data || [];
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
}

/**
 * Fetch global site settings
 * @returns {Promise<Object>} Site settings data
 */
export async function getSiteSettings() {
  try {
    const data = await fetchAPI('/site-setting?populate=*');
    return data.data || null;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return null;
  }
}

/**
 * Fetch gallery images
 * @returns {Promise<Array>} Array of gallery image data
 */
export async function getGalleryImages() {
  try {
    const data = await fetchAPI('/gallery-images?populate=*&sort=order:asc');
    return data.data || [];
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return [];
  }
}

/**
 * Fetch hero section data
 * @returns {Promise<Object>} Hero section data
 */
export async function getHeroSection() {
  try {
    const data = await fetchAPI('/hero-section?populate=*');
    return data.data || null;
  } catch (error) {
    console.error('Error fetching hero section:', error);
    return null;
  }
}

/**
 * Fetch Home page data (single type)
 * @returns {Promise<Object>} Home page data
 */
export async function getHomePage() {
  try {
    // Use populate=* for Strapi v5 compatibility
    const data = await fetchAPI('/home?populate=*');
    
    // Debug: Log full data structure
    console.log('📦 Strapi Home - Raw data:', data);
    console.log('📦 Strapi Home - Has data:', !!data.data);
    console.log('📦 All fields:', data.data ? Object.keys(data.data) : 'none');
    console.log('📦 Has header_image field:', !!data.data?.header_image);
    console.log('📦 Has headerImage field:', !!data.data?.headerImage);
    if (data.data?.header_image) {
      console.log('📸 header_image (snake_case) URL:', data.data.header_image.url);
    }
    if (data.data?.headerImage) {
      console.log('📸 headerImage (camelCase) URL:', data.data.headerImage.url);
    }
    
    return data.data || null;
  } catch (error) {
    console.error('Error fetching home page:', error);
    return null;
  }
}

/**
 * Get featured locations for homepage carousel
 * Fetches from Featured Locations collection - displays whatever exists
 * @returns {Promise<Array>} Array of normalized location objects
 */
export async function getFeaturedLocations() {
    try {
      // Fetch all active featured locations, sorted by order
      // Populate each holiday type with ALL its fields and relations (including headerImage)
      const response = await fetchAPI(
        '/featured-locations?' +
        'filters[active]=true&' +
        'sort=order:asc&' +
        'populate[tennis_holiday][populate]=headerImage&' +
        'populate[pickleball_holiday][populate]=headerImage&' +
        'populate[junior_tennis_camp][populate]=headerImage&' +
        'populate[padel_tennis_holiday][populate]=headerImage&' +
        'populate[play_and_watch][populate]=headerImage&' +
        'populate[ski_holiday][populate]=headerImage&' +
        'populate[tennis_clinic][populate]=headerImage'
      );
    
    if (!response?.data) {
      console.log('📍 No featured locations found');
      return [];
    }

    // Map and normalize the data - display all Featured Locations
    const locations = response.data.map((item, index) => {
      // Get the actual holiday based on holiday_type
      const holidayType = item.holiday_type;
      const holiday = item[holidayType.replace(/-/g, '_')];
      
      console.log(`\n🔍 Featured Location #${item.id} (order: ${item.order})`);
      console.log(`   Holiday Type: ${holidayType}`);
      console.log(`   Relation Connected: ${!!holiday ? '✅ YES' : '❌ NO'}`);
      
      if (!holiday) {
        console.error(`\n❌ PROBLEM: The ${holidayType} relation is NOT set in Strapi!`);
        console.error(`   → Fix: Go to Strapi → Featured Locations → Entry #${item.id}`);
        console.error(`   → Click the "${holidayType}" dropdown and select a holiday\n`);
        return {
          id: item.id,
          title: `⚠️ MISSING: ${holidayType} not connected`,
          location: 'Fix in Strapi Admin',
          type: holidayType,
          price: null,
          amount: null,
          image: GENERIC_PLACEHOLDER_URL,
          imageAlt: 'Missing relation',
          slug: '',
          holidayType: holidayType,
          active: index === 1
        };
      }

      // Check for missing fields and log them
      const missingFields = [];
      if (!holiday.title) missingFields.push('title');
      if (!holiday.country) missingFields.push('country');
      if (!holiday.priceFrom) missingFields.push('priceFrom');
      if (!holiday.headerImage) missingFields.push('headerImage');
      
      if (missingFields.length > 0) {
        console.warn(`   ⚠️ Missing fields: ${missingFields.join(', ')}`);
        console.warn(`   → Fix: Edit the ${holidayType} entry in Strapi and fill these fields\n`);
      } else {
        console.log(`   ✅ All required fields present`);
        console.log(`   Title: "${holiday.title}"`);
        console.log(`   Country: ${holiday.country}`);
        console.log(`   Price: £${holiday.priceFrom}\n`);
      }

      // Get headerImage - use fallback if missing
      const imageField = holiday.headerImage;
      const imageData = imageField 
        ? getStrapiImageData(imageField)
        : { url: GENERIC_PLACEHOLDER_URL, alt: holiday.title };

      // Build location string - use country directly
      const location = holiday.country || '';

      // Build price text - only show if singleOccupancyFrom exists (fallback to singleOccupancyShort)
      const singleOccupancyPrice = holiday.singleOccupancyFrom || holiday.singleOccupancyShort;
      const priceText = singleOccupancyPrice 
                       ? `Single Occupancy from £${singleOccupancyPrice}` 
                       : null;

      // Build holiday type display text
      const typeDisplay = holiday.productType || 
                         holidayType.split('-').map(word => 
                           word.charAt(0).toUpperCase() + word.slice(1)
                         ).join(' ');

      // Normalize data structure for carousel
      return {
        id: holiday.id,
        title: holiday.title || 'Untitled Holiday',
        location: location,
        type: typeDisplay,
        price: priceText,
        amount: holiday.priceFrom || singleOccupancyPrice
               ? `from £${holiday.priceFrom || singleOccupancyPrice}pp` 
               : null,
        image: imageData.url,
        imageAlt: imageData.alt || holiday.title,
        imageSrcSet: imageData.formats ? generateSrcSetFromFormats(imageData.formats) : undefined,
        slug: holiday.slug || '',
        holidayType: holidayType,
        active: index === 1 // Middle card active by default for carousel
      };
    });

    console.log('📍 Featured Locations loaded:', locations.length);
    return locations;
    
  } catch (error) {
    console.error('❌ Error fetching featured locations:', error);
    return [];
  }
}

/**
 * Helper: Generate srcset from Strapi image formats
 * @param {Object} formats - Strapi image formats object (small, medium, large)
 * @returns {string|undefined} srcset string or undefined
 */
function generateSrcSetFromFormats(formats) {
  if (!formats) return undefined;
  
  const srcsetParts = [];
  
  if (formats.small?.url) {
    srcsetParts.push(`${formats.small.url} ${formats.small.width}w`);
  }
  if (formats.medium?.url) {
    srcsetParts.push(`${formats.medium.url} ${formats.medium.width}w`);
  }
  if (formats.large?.url) {
    srcsetParts.push(`${formats.large.url} ${formats.large.width}w`);
  }
  
  return srcsetParts.length > 0 ? srcsetParts.join(', ') : undefined;
}

/**
 * Get comprehensive home page data from Strapi
 * Includes all sections: hero, about, jamie murray, partners, specialists, community, stories, accordions
 * @returns {Promise<Object>} Home page data
 */
export async function getHomeData() {
  try {
    // Strapi v5 populate syntax - use * to populate all media fields
    const response = await fetchAPI('/home?populate=*');

    if (!response?.data) {
      console.log('📍 No home data found');
      return null;
    }

    const data = response.data;
    console.log('🏠 Home data fetched successfully');

    // Return structured data
    return {
      hero: {
        heading: data.main_heading,
        subHeading: data.main_sub_heading,
        headerImage: data.headerImage ? getStrapiImageData(data.headerImage) : null,
        testimonialImages: [
          data.testimonialImage1 ? getStrapiImageData(data.testimonialImage1) : null,
          data.testimonialImage2 ? getStrapiImageData(data.testimonialImage2) : null,
          data.testimonialImage3 ? getStrapiImageData(data.testimonialImage3) : null,
          data.testimonialImage4 ? getStrapiImageData(data.testimonialImage4) : null,
        ].filter(Boolean)
      },
      about: {
        kicker: data.aboutKicker,
        title: data.aboutTitle,
        description: data.aboutDescription,
        content: data.aboutContent,
        stats: [
          data.aboutStat1,
          data.aboutStat2,
          data.aboutStat3,
          data.aboutStat4
        ].filter(Boolean),
        images: {
          image1: data.aboutImage1 ? getStrapiImageData(data.aboutImage1) : null,
          image2: data.aboutImage2 ? getStrapiImageData(data.aboutImage2) : null
        }
      },
      jamieMurray: {
        title: data.jamieMurrayTitle,
        description: data.jamieMurrayDescription,
        buttonText: data.jamieMurrayButtonText,
        videoUrl: data.jamieMurrayVideoUrl,
        image: data.jamieMurrayImage ? getStrapiImageData(data.jamieMurrayImage) : null
      },
      partners: [
        { name: data.partner1Name, logo: data.partner1Logo ? getStrapiImageData(data.partner1Logo) : null },
        { name: data.partner2Name, logo: data.partner2Logo ? getStrapiImageData(data.partner2Logo) : null },
        { name: data.partner3Name, logo: data.partner3Logo ? getStrapiImageData(data.partner3Logo) : null },
        { name: data.partner4Name, logo: data.partner4Logo ? getStrapiImageData(data.partner4Logo) : null },
        { name: data.partner5Name, logo: data.partner5Logo ? getStrapiImageData(data.partner5Logo) : null },
      ].filter(p => p.name && p.logo),
      whatDoWeOffer: {
        title: data.whatDoWeOfferTitle,
        description: data.whatDoWeOfferDescription
      },
      racketSpecialist: {
        title: data.racketSpecialistTitle,
        description: data.racketSpecialistDescription,
        bulletPoints: [
          data.racketSpecialistBullet1,
          data.racketSpecialistBullet2,
          data.racketSpecialistBullet3,
          data.racketSpecialistBullet4,
          data.racketSpecialistBullet5,
          data.racketSpecialistBullet6,
          data.racketSpecialistBullet7,
          data.racketSpecialistBullet8
        ].filter(Boolean),
        buttonText: data.racketSpecialistButtonText,
        quote: data.racketSpecialistQuote,
        quoteAuthor: data.racketSpecialistQuoteAuthor,
        images: {
          bg: data.racketSpecialistBgImage ? getStrapiImageData(data.racketSpecialistBgImage) : null
        }
      },
      thrivingCommunity: {
        title: data.thrivingCommunityTitle,
        description: data.thrivingCommunityDescription,
        bulletPoints: [
          data.thrivingCommunityBullet1,
          data.thrivingCommunityBullet2,
          data.thrivingCommunityBullet3,
          data.thrivingCommunityBullet4,
          data.thrivingCommunityBullet5,
          data.thrivingCommunityBullet6,
          data.thrivingCommunityBullet7,
          data.thrivingCommunityBullet8
        ].filter(Boolean),
        buttonText: data.thrivingCommunityButtonText,
        images: {
          bg: data.thrivingCommunityBgImage ? getStrapiImageData(data.thrivingCommunityBgImage) : null,
          image1: data.thrivingCommunityImage1 ? getStrapiImageData(data.thrivingCommunityImage1) : null,
          image2: data.thrivingCommunityImage2 ? getStrapiImageData(data.thrivingCommunityImage2) : null
        }
      },
      stories: {
        title: data.storiesTitle,
        subtitle: data.storiesSubtitle,
        googleIcon: data.storiesGoogleIcon ? getStrapiImageData(data.storiesGoogleIcon) : null,
        testimonials: [
          {
            name: data.story1Name,
            date: data.story1Date,
            rating: data.story1Rating,
            text: data.story1Text,
            avatar: data.story1Avatar ? getStrapiImageData(data.story1Avatar) : null
          },
          {
            name: data.story2Name,
            date: data.story2Date,
            rating: data.story2Rating,
            text: data.story2Text,
            avatar: data.story2Avatar ? getStrapiImageData(data.story2Avatar) : null
          },
          {
            name: data.story3Name,
            date: data.story3Date,
            rating: data.story3Rating,
            text: data.story3Text,
            avatar: data.story3Avatar ? getStrapiImageData(data.story3Avatar) : null
          },
          {
            name: data.story4Name,
            date: data.story4Date,
            rating: data.story4Rating,
            text: data.story4Text,
            avatar: data.story4Avatar ? getStrapiImageData(data.story4Avatar) : null
          },
          {
            name: data.story5Name,
            date: data.story5Date,
            rating: data.story5Rating,
            text: data.story5Text,
            avatar: data.story5Avatar ? getStrapiImageData(data.story5Avatar) : null
          },
          {
            name: data.story6Name,
            date: data.story6Date,
            rating: data.story6Rating,
            text: data.story6Text,
            avatar: data.story6Avatar ? getStrapiImageData(data.story6Avatar) : null
          },
          {
            name: data.story7Name,
            date: data.story7Date,
            rating: data.story7Rating,
            text: data.story7Text,
            avatar: data.story7Avatar ? getStrapiImageData(data.story7Avatar) : null
          }
        ].filter(t => t.name && t.text)
      },
      accordions: {
        title: data.accordionTitle,
        items: [
          { title: data.accordion1Title, content: data.accordion1Content },
          { title: data.accordion2Title, content: data.accordion2Content },
          { title: data.accordion3Title, content: data.accordion3Content },
          { title: data.accordion4Title, content: data.accordion4Content },
          { title: data.accordion5Title, content: data.accordion5Content },
          { title: data.accordion6Title, content: data.accordion6Content },
          { title: data.accordion7Title, content: data.accordion7Content },
          { title: data.accordion8Title, content: data.accordion8Content },
          { title: data.accordion9Title, content: data.accordion9Content },
          { title: data.accordion10Title, content: data.accordion10Content },
          { title: data.accordion11Title, content: data.accordion11Content },
          { title: data.accordion12Title, content: data.accordion12Content },
        ].filter(a => a.title && a.content).map((a, index) => ({
          id: index + 1,
          title: a.title,
          content: a.content,
          isOpen: index === 0 || index === 6 // First in each column
        }))
      }
    };

  } catch (error) {
    console.error('Error fetching home data:', error);
    return null;
  }
}

/**
 * Fetch blog posts from Strapi
 * @param {number} limit - Number of blog posts to fetch
 * @returns {Promise<Array>} Array of blog posts
 */
export async function getBlogs(limit = 8) {
  try {
    // Fetch more than needed to account for filtering
    const fetchLimit = limit * 2; // Fetch double to ensure we get enough with images
    const data = await fetchAPI(`/blogs?populate=headerImage&sort=CreationDate:desc&pagination[limit]=${fetchLimit}&filters[publishedAt][$notNull]=true`);
    
    if (!data || !data.data || data.data.length === 0) {
      return [];
    }

    const blogs = data.data
      .map((item, index) => {
        const blog = item.attributes || item;
        
        // Get header image
        const headerImage = blog.headerImage ? getStrapiImageData(blog.headerImage) : null;

        // Skip blogs without header image
        if (!headerImage || !headerImage.url) {
          return null;
        }

        // Format date - handle both camelCase and snake_case
        const creationDate = blog.CreationDate || blog.creation_date;
        let formattedDate = '';
        if (creationDate) {
          const date = new Date(creationDate);
          formattedDate = date.toLocaleDateString('en-GB', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          });
        }

        return {
          id: item.id || index + 1,
          title: blog.title || 'Untitled Post',
          description: blog.blogExcerpt || blog.blog_excerpt || '',
          author: blog.authorFullName || blog.author_full_name || 'Active Away',
          date: formattedDate,
          creationDate: creationDate, // Keep raw date for sorting
          image: headerImage.url,
          imageAlt: headerImage.alt || blog.title || 'Blog post image',
          slug: blog.slug || `post-${item.id}`
        };
      })
      .filter(blog => blog !== null) // Remove blogs without images
      .slice(0, limit); // Limit to requested amount

    return blogs;

  } catch (error) {
    console.error('❌ Error fetching blogs:', error);
    return [];
  }
}

/**
 * Fetch Home SEO data from Strapi (separate call for SEO fields)
 * @returns {Promise<Object|null>} SEO data including meta image
 */
export async function getHomeSEO() {
  try {
    const response = await fetch('https://strapi-production-b96d.up.railway.app/api/home?populate=seo.metaImage');
    
    if (!response.ok) {
      console.warn('⚠️ Could not fetch home SEO data:', response.status);
      return null;
    }

    const data = await response.json();
    
    if (!data || !data.data) {
      console.log('📄 No home SEO data found');
      return null;
    }

    const homeData = data.data;
    const seoData = homeData.seo;
    
    if (!seoData) {
      console.log('📄 No SEO component found in home data');
      return null;
    }

    console.log('✅ Home SEO data fetched successfully');

    // Extract meta image data with Cloudflare Images optimization
    let metaImageUrl = null;
    let metaImageAlt = null;
    let metaImageWidth = 1200;
    let metaImageHeight = 630;
    
    if (seoData.metaImage) {
      const imageData = getStrapiImageData(seoData.metaImage);
      
      if (imageData?.url) {
        // Use Cloudflare Images with explicit dimensions for Open Graph
        const baseUrl = imageData.url.split('?')[0]; // Remove any existing query params
        metaImageUrl = `${baseUrl}?width=${metaImageWidth}&height=${metaImageHeight}&fit=cover&format=auto&quality=85`;
        metaImageAlt = imageData.alt || 'Active Away - Tennis, Padel & Pickleball Holidays';
        
        console.log('📸 Meta image URL (optimized):', metaImageUrl);
      }
    }

    return {
      metaTitle: seoData.metaTitle || null,
      metaDescription: seoData.metaDescription || null,
      metaImage: metaImageUrl,
      metaImageAlt: metaImageAlt,
      metaImageWidth: metaImageUrl ? metaImageWidth : null,
      metaImageHeight: metaImageUrl ? metaImageHeight : null,
      keywords: seoData.keywords || null,
      metaRobots: seoData.metaRobots || null,
      metaViewport: seoData.metaViewport || null,
      canonicalURL: seoData.canonicalURL || null,
      structuredData: seoData.structuredData || null
    };

  } catch (error) {
    console.error('❌ Error fetching home SEO data:', error);
    return null;
  }
}

/**
 * Fetch Pre-Orders from Strapi
 * @param {number} page - Page number
 * @param {number} pageSize - Number of items per page
 * @returns {Promise<Array>} Pre-orders data
 */
export async function getPreOrders(page = 1, pageSize = 25) {
  try {
    const data = await fetchAPI(
      `/pre-orders?pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=createdAt:desc`
    );
    
    if (!data || !data.data) {
      console.log('📦 No pre-orders found');
      return [];
    }

    console.log(`📦 Pre-orders fetched: ${data.data.length} items`);

    return data.data.map(item => {
      // In Strapi v5, fields are at the top level, not under attributes
      const preOrder = item.attributes || item;

      // Generate slug from title if not present
      const slug = preOrder.slug || 
                   preOrder.title?.toLowerCase()
                     .replace(/[^a-z0-9]+/g, '-')
                     .replace(/^-|-$/g, '') || 
                   item.documentId || 
                   item.id;

      return {
        id: item.id,
        documentId: item.documentId || item.id,
        title: preOrder.title || 'Untitled Pre-Order',
        slug: slug,
        excerpt: preOrder.excerpt || '',
        description: preOrder.description || '',
        createdAt: preOrder.createdAt || item.createdAt || new Date().toISOString(),
        publishedAt: preOrder.publishedAt || item.publishedAt || null,
        status: preOrder.status || 'active',
        price: preOrder.price || null,
        currency: preOrder.currency || 'GBP',
        wpurl: preOrder.wpurl || null,
        wpid: preOrder.wpid || null
      };
    });

  } catch (error) {
    console.error('❌ Error fetching pre-orders:', error);
    return [];
  }
}

/**
 * Fetch Pre-Orders Page data from Strapi
 * @returns {Promise<Object>} Pre-orders page data
 */
export async function getPreOrdersPage() {
  try {
    const data = await fetchAPI('/pre-orders-page?populate=*');
    
    if (!data || !data.data) {
      console.log('📦 No pre-orders page data found');
      return null;
    }

    const pageData = data.data.attributes || data.data;
    console.log('📦 Pre-orders page data fetched successfully');

    return {
      hero: {
        title: pageData.heroTitle || 'Pre-Orders',
        subtitle: pageData.heroSubtitle || 'Be the first to secure your spot for our upcoming events, tours, and special experiences. Limited availability.',
        kicker: pageData.heroKicker || 'EXCLUSIVE OPPORTUNITIES',
        backgroundImage: pageData.heroBackgroundImage ? getStrapiImageData(pageData.heroBackgroundImage) : null
      },
      meta: {
        title: pageData.metaTitle || 'Pre-Orders - Active Away',
        description: pageData.metaDescription || 'Explore our exclusive pre-order opportunities. Be the first to secure your spot for upcoming events, tours, and special experiences.'
      }
    };

  } catch (error) {
    console.error('Error fetching pre-orders page data:', error);
    return null;
  }
}

/**
 * Fetch Venues Page data from Strapi
 * @returns {Promise<Object>} Venues page data
 */
export async function getVenuesPage() {
  try {
    const data = await fetchAPI('/venues-page?populate=*');
    
    if (!data || !data.data) {
      console.log('📍 No venues page data found');
      return null;
    }

    const pageData = data.data.attributes || data.data;
    console.log('🏨 Venues page data fetched successfully');

    return {
      hero: {
        title: pageData.heroTitle || 'Explore All Venues',
        subtitle: pageData.heroSubtitle || 'Discover our complete collection of tennis, padel, pickleball, and ski holidays across the world.',
        kicker: pageData.heroKicker || 'ALL DESTINATIONS',
        backgroundImage: pageData.heroBackgroundImage ? getStrapiImageData(pageData.heroBackgroundImage) : null
      },
      meta: {
        title: pageData.pageTitle || 'All Venues - Active Away',
        description: pageData.metaDescription || 'Explore all our tennis, padel, pickleball, and ski holiday destinations.'
      },
      featured: {
        title: pageData.featuredSectionTitle || null,
        description: pageData.featuredSectionDescription || null
      }
    };

  } catch (error) {
    console.error('Error fetching venues page data:', error);
    return null;
  }
}

/**
 * Fetch navigation menu data from Strapi
 * @returns {Promise<Object>} Navigation menu data
 */
export async function getNavigationMenu() {
  try {
    const data = await fetchAPI('/navigation-menu?populate[menuItems][populate]=*&populate[datesFindYourNext][populate]=*&populate[datesUsefulLinks][populate]=*&populate[racketsMegaMenuItems][populate]=image&populate[aboutMegaMenuItems][populate]=image&populate[destinationsCategories][populate]=destinations');
    
    if (!data || !data.data) {
      return null;
    }

    const navData = data.data.attributes || data.data;
    
    // Parse main menu items
    const menuItems = navData.menuItems?.map(item => ({
      id: item.id,
      label: item.label || item.text,
      href: item.href || item.url,
      isActive: item.isActive || false,
      hasMegaMenu: item.hasMegaMenu || false,
      megaMenuId: item.megaMenuId || null
    })) || [];

    // Parse Dates menu data (two separate arrays)
    const datesMenuData = {
      findYourNext: navData.datesFindYourNext?.map(item => ({
        id: item.id,
        name: item.name,
        href: item.href
      })) || [],
      usefulLinks: navData.datesUsefulLinks?.map(item => ({
        id: item.id,
        name: item.name,
        href: item.href
      })) || []
    };

    // Parse mega menu items for Rackets dropdown
    const racketsMegaMenuItems = navData.racketsMegaMenuItems?.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      href: item.href || item.url,
      image: item.image ? getStrapiImageData(item.image) : null,
      gradient: item.gradient || 'from-orange-500 to-orange-600',
      menuType: 'rackets'
    })) || [];

    // Parse mega menu items for About Us dropdown
    const aboutMegaMenuItems = navData.aboutMegaMenuItems?.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      href: item.href || item.url,
      image: item.image ? getStrapiImageData(item.image) : null,
      gradient: item.gradient || 'from-blue-500 to-indigo-600',
      menuType: 'about'
    })) || [];

    // Parse destinations categories for Destinations dropdown
    const destinationsCategories = navData.destinationsCategories?.map(category => ({
      id: category.id,
      label: category.label,
      destinations: category.destinations?.map(destination => ({
        id: destination.id,
        name: destination.name,
        href: destination.href,
        country: destination.country || null
      })) || []
    })) || [];

    return {
      menuItems,
      datesMenuData,
      racketsMegaMenuItems,
      aboutMegaMenuItems,
      destinationsCategories,
      aboutMegaMenuTitle: navData.aboutMegaMenuTitle || 'Learn more about Active Away',
      aboutMegaMenuCTA: navData.aboutMegaMenuCTA || 'Get in Touch',
      aboutMegaMenuCTAUrl: navData.aboutMegaMenuCTAUrl || '#contact',
      destinationsMegaMenuTitle: navData.destinationsMegaMenuTitle || 'Find your perfect destination',
      destinationsMegaMenuCTA: navData.destinationsMegaMenuCTA || 'View All Destinations',
      destinationsMegaMenuCTAUrl: navData.destinationsMegaMenuCTAUrl || '#all-destinations'
    };

  } catch (error) {
    console.error('❌ Error fetching navigation menu:', error);
    return null;
  }
}

// ============================================
// Venue Collection Type Fetch Functions
// ============================================

/**
 * Normalize venue data from any collection type
 * @param {Object} item - Raw Strapi item
 * @param {string} holidayType - Type of holiday
 * @returns {Object} Normalized venue object
 */
function normalizeVenueData(item, holidayType) {
  const venue = item.attributes || item;
  
  // Get header image
  const headerImage = venue.headerImage ? getStrapiImageData(venue.headerImage) : null;
  
  // Get price - try different field names
  const price = venue.priceFrom || venue.singleOccupancyFrom || venue.singleOccupancyShort || null;
  
  return {
    id: `${holidayType}-${item.id}`,
    strapiId: item.id,
    title: venue.title || 'Untitled Venue',
    country: venue.country || '',
    holidayType: holidayType,
    productType: venue.productType || holidayType.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' '),
    price: price,
    priceText: price ? `from £${price}pp` : null,
    dateFrom: venue.dateFrom || null,
    dateUntil: venue.dateUntil || null,
    image: headerImage?.url || GENERIC_PLACEHOLDER_URL,
    imageAlt: headerImage?.alt || venue.title || 'Venue image',
    slug: venue.slug || '',
    createdAt: venue.createdAt || item.createdAt || new Date().toISOString(),
    // Additional useful fields
    description: venue.description || venue.blogExcerpt || '',
    location: venue.location || venue.country || ''
  };
}

/**
 * Fetch Junior Tennis Camps
 * @param {number} page - Page number (1-indexed)
 * @param {number} pageSize - Items per page
 * @returns {Promise<Array>} Array of normalized venue data
 */
export async function getJuniorTennisCamps(page = 1, pageSize = 25) {
  try {
    const data = await fetchAPI(`/junior-tennis-camps?populate=headerImage&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`);
    
    if (!data || !data.data || data.data.length === 0) {
      return [];
    }
    
    return data.data.map(item => normalizeVenueData(item, 'junior-tennis-camp'));
  } catch (error) {
    console.error('❌ Error fetching junior tennis camps:', error);
    return [];
  }
}

/**
 * Fetch Padel Tennis Holidays
 * @param {number} page - Page number (1-indexed)
 * @param {number} pageSize - Items per page
 * @returns {Promise<Array>} Array of normalized venue data
 */
export async function getPadelTennisHolidays(page = 1, pageSize = 25) {
  try {
    const data = await fetchAPI(`/padel-tennis-holidays?populate=headerImage&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`);
    
    if (!data || !data.data || data.data.length === 0) {
      return [];
    }
    
    return data.data.map(item => normalizeVenueData(item, 'padel-tennis-holiday'));
  } catch (error) {
    console.error('❌ Error fetching padel tennis holidays:', error);
    return [];
  }
}

/**
 * Fetch Pickleball Holidays
 * @param {number} page - Page number (1-indexed)
 * @param {number} pageSize - Items per page
 * @returns {Promise<Array>} Array of normalized venue data
 */
export async function getPickleballHolidays(page = 1, pageSize = 25) {
  try {
    const data = await fetchAPI(`/pickleball-holidays?populate=headerImage&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`);
    
    if (!data || !data.data || data.data.length === 0) {
      return [];
    }
    
    return data.data.map(item => normalizeVenueData(item, 'pickleball-holiday'));
  } catch (error) {
    console.error('❌ Error fetching pickleball holidays:', error);
    return [];
  }
}

/**
 * Fetch Play & Watch Holidays
 * @param {number} page - Page number (1-indexed)
 * @param {number} pageSize - Items per page
 * @returns {Promise<Array>} Array of normalized venue data
 */
export async function getPlayAndWatchHolidays(page = 1, pageSize = 25) {
  try {
    const data = await fetchAPI(`/play-and-watches?populate=headerImage&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`);
    
    if (!data || !data.data || data.data.length === 0) {
      return [];
    }
    
    return data.data.map(item => normalizeVenueData(item, 'play-and-watch'));
  } catch (error) {
    console.error('❌ Error fetching play and watch holidays:', error);
    return [];
  }
}

/**
 * Fetch School Tennis Tours
 * @param {number} page - Page number (1-indexed)
 * @param {number} pageSize - Items per page
 * @returns {Promise<Array>} Array of normalized venue data
 */
export async function getSchoolTennisTours(page = 1, pageSize = 25) {
  try {
    const data = await fetchAPI(`/school-tennis-tours?populate=headerImage&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`);
    
    if (!data || !data.data || data.data.length === 0) {
      return [];
    }
    
    return data.data.map(item => normalizeVenueData(item, 'school-tennis-tour'));
  } catch (error) {
    console.error('❌ Error fetching school tennis tours:', error);
    return [];
  }
}

/**
 * Fetch Ski Holidays
 * @param {number} page - Page number (1-indexed)
 * @param {number} pageSize - Items per page
 * @returns {Promise<Array>} Array of normalized venue data
 */
export async function getSkiHolidays(page = 1, pageSize = 25) {
  try {
    const data = await fetchAPI(`/ski-holidays?populate=headerImage&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`);
    
    if (!data || !data.data || data.data.length === 0) {
      return [];
    }
    
    return data.data.map(item => normalizeVenueData(item, 'ski-holiday'));
  } catch (error) {
    console.error('❌ Error fetching ski holidays:', error);
    return [];
  }
}

/**
 * Fetch Tennis Clinics
 * @param {number} page - Page number (1-indexed)
 * @param {number} pageSize - Items per page
 * @returns {Promise<Array>} Array of normalized venue data
 */
export async function getTennisClinics(page = 1, pageSize = 25) {
  try {
    const data = await fetchAPI(`/tennis-clinics?populate=headerImage&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`);
    
    if (!data || !data.data || data.data.length === 0) {
      return [];
    }
    
    return data.data.map(item => normalizeVenueData(item, 'tennis-clinic'));
  } catch (error) {
    console.error('❌ Error fetching tennis clinics:', error);
    return [];
  }
}

/**
 * Fetch Tennis Holidays
 * @param {number} page - Page number (1-indexed)
 * @param {number} pageSize - Items per page
 * @returns {Promise<Array>} Array of normalized venue data
 */
export async function getTennisHolidays(page = 1, pageSize = 25) {
  try {
    const data = await fetchAPI(`/tennis-holidays?populate=headerImage&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`);
    
    if (!data || !data.data || data.data.length === 0) {
      return [];
    }
    
    return data.data.map(item => normalizeVenueData(item, 'tennis-holiday'));
  } catch (error) {
    console.error('❌ Error fetching tennis holidays:', error);
    return [];
  }
}

/**
 * Fetch all venues from all 8 collection types
 * @param {Object} options - Options object
 * @param {number} options.pageSize - Items per page (default: 18)
 * @returns {Promise<Object>} Object with venues array and metadata
 */
export async function getAllVenues(options = {}) {
  const { pageSize = 18 } = options;
  
  try {
    // Fetch from all 8 collection types in parallel
    const [
      juniorCamps,
      padelHolidays,
      pickleballHolidays,
      playAndWatch,
      schoolTours,
      skiHolidays,
      tennisClinics,
      tennisHolidays
    ] = await Promise.all([
      getJuniorTennisCamps(1, pageSize),
      getPadelTennisHolidays(1, pageSize),
      getPickleballHolidays(1, pageSize),
      getPlayAndWatchHolidays(1, pageSize),
      getSchoolTennisTours(1, pageSize),
      getSkiHolidays(1, pageSize),
      getTennisClinics(1, pageSize),
      getTennisHolidays(1, pageSize)
    ]);
    
    // Combine all venues
    const allVenues = [
      ...juniorCamps,
      ...padelHolidays,
      ...pickleballHolidays,
      ...playAndWatch,
      ...schoolTours,
      ...skiHolidays,
      ...tennisClinics,
      ...tennisHolidays
    ];
    
    // Sort by creation date (newest first)
    allVenues.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Extract unique countries for filters
    const countries = [...new Set(allVenues.map(v => v.country).filter(Boolean))].sort();
    
    // Extract price range
    const prices = allVenues.map(v => v.price).filter(Boolean);
    const priceRange = prices.length > 0 ? {
      min: Math.min(...prices),
      max: Math.max(...prices)
    } : { min: 0, max: 5000 };
    
    console.log(`📍 Fetched ${allVenues.length} total venues from all collection types`);
    
    return {
      venues: allVenues,
      metadata: {
        total: allVenues.length,
        countries,
        priceRange,
        holidayTypes: [
          { value: 'junior-tennis-camp', label: 'Junior Tennis Camp' },
          { value: 'padel-tennis-holiday', label: 'Padel Tennis Holiday' },
          { value: 'pickleball-holiday', label: 'Pickleball Holiday' },
          { value: 'play-and-watch', label: 'Play & Watch' },
          { value: 'school-tennis-tour', label: 'School Tennis Tour' },
          { value: 'ski-holiday', label: 'Ski Holiday' },
          { value: 'tennis-clinic', label: 'Tennis Clinic' },
          { value: 'tennis-holiday', label: 'Tennis Holiday' }
        ]
      }
    };
    
  } catch (error) {
    console.error('❌ Error fetching all venues:', error);
    return {
      venues: [],
      metadata: {
        total: 0,
        countries: [],
        priceRange: { min: 0, max: 5000 },
        holidayTypes: []
      }
    };
  }
}
