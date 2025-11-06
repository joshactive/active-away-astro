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
 * Handles both Strapi v4 (data.attributes) and v5 (direct object) formats
 * @param {Object|Array} imagesData - Strapi images data object or array
 * @returns {Array<Object>} Array of image data objects
 */
export function getStrapiImagesData(imagesData) {
  if (!imagesData) return [];
  
  // Strapi v5: Direct array of image objects
  if (Array.isArray(imagesData)) {
    return imagesData.map(img => {
      let url = img.url;
      
      // Transform imagedelivery.net URLs
      if (url && url.includes('imagedelivery.net')) {
        url = url.replace(
          'https://imagedelivery.net/-aT8Z2F9gGvZ9fdofZcCaQ/',
          'https://activeaway.com/cdn-cgi/imagedelivery/-aT8Z2F9gGvZ9fdofZcCaQ/'
        );
      } else if (url && !url.startsWith('http')) {
        url = `${STRAPI_URL}${url}`;
      }
      
      return {
        url,
        alt: img.alternativeText || img.caption || img.name || '',
        width: img.width,
        height: img.height,
        name: img.name,
        mime: img.mime
      };
    });
  }
  
  // Strapi v4: data.data structure
  if (imagesData.data) {
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
  
  return [];
}

/**
 * Normalize Strapi repeatable components / relations into plain arrays
 * Handles Strapi v4 (data/attributes) and v5 (direct objects)
 * @param {any} value - Raw value from Strapi response
 * @returns {Array<Object>} Normalized array
 */
function normalizeComponentArray(value) {
  if (!value) return [];
  
  if (Array.isArray(value)) {
    return value.map(item => item?.attributes ? item.attributes : item);
  }
  
  if (Array.isArray(value.data)) {
    return value.data.map(item => item?.attributes ? item.attributes : item);
  }
  
  return [];
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
 * Fetch events by uniqueValue
 * @param {string} uniqueValue - The unique value to filter events by
 * @returns {Promise<Array>} Array of formatted event data matching the uniqueValue
 */
export async function getEventsByUniqueValue(uniqueValue) {
  try {
    if (!uniqueValue) {
      console.warn('⚠️ No uniqueValue provided to getEventsByUniqueValue');
      return [];
    }

    // Get today's date at midnight to ensure we only get future events
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    
    // Filter by uniqueValue AND dateUntil >= today (event hasn't ended yet)
    const endpoint = `/events?filters[uniqueValue][$eq]=${encodeURIComponent(uniqueValue)}&filters[dateUntil][$gte]=${todayISO}&populate=*&sort=dateFrom:asc&pagination[pageSize]=100`;
    
    console.log(`🔍 Fetching future events for uniqueValue: "${uniqueValue}" (dateUntil >= ${todayISO})`);
    const data = await fetchAPI(endpoint);
    
    if (!data || !data.data || data.data.length === 0) {
      console.log(`ℹ️ No future events found for uniqueValue: "${uniqueValue}"`);
      return [];
    }
    
    console.log(`✅ Found ${data.data.length} future event(s) for uniqueValue: "${uniqueValue}"`);
    
    // Map the data to the format expected by the frontend
    const events = data.data.map((item, index) => {
      const event = item.attributes || item;
      
      // Format dates as "Sat 16 May - Sat 23 May 2026"
      let formattedDate = '';
      if (event.dateFrom && event.dateUntil) {
        const fromDate = new Date(event.dateFrom);
        const untilDate = new Date(event.dateUntil);
        
        const dayFrom = fromDate.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit' });
        const monthFrom = fromDate.toLocaleDateString('en-GB', { month: 'short' });
        const dayUntil = untilDate.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit' });
        const monthUntil = untilDate.toLocaleDateString('en-GB', { month: 'short' });
        const year = untilDate.toLocaleDateString('en-GB', { year: 'numeric' });
        
        if (monthFrom === monthUntil) {
          formattedDate = `${dayFrom} ${monthFrom} - ${dayUntil} ${monthUntil} ${year}`;
        } else {
          formattedDate = `${dayFrom} ${monthFrom} - ${dayUntil} ${monthUntil} ${year}`;
        }
      }
      
      // Determine status badge
      let statusBadge = 'AVAILABLE';
      let statusClass = 'bg-[#ad986c]/10 text-[#ad986c]';
      
      if (event.isSoldOut) {
        statusBadge = 'SOLD OUT';
        statusClass = 'bg-red-50 text-red-700';
      } else if (event.featured) {
        statusBadge = 'FEATURED';
        statusClass = 'bg-green-50 text-green-700';
      }
      
      return {
        id: item.id || index + 1,
        documentId: item.documentId,
        title: event.title || formattedDate,
        dateText: event.dateText || formattedDate,
        dateFrom: event.dateFrom,
        dateUntil: event.dateUntil,
        price: event.price || null,
        singleOccupancyPrice: event.singleOccupancyPriceEvent || null,
        bookingLink: event.bookingLink || '#',
        buttonText: event.buttonText || 'Book Now',
        buttonColour: event.buttonColour || '#ad986c',
        isSoldOut: event.isSoldOut || false,
        statusBadge: statusBadge,
        statusClass: statusClass,
        product: event.product || '',
        uniqueValue: event.uniqueValue || ''
      };
    });
    
    return events;
    
  } catch (error) {
    console.error(`❌ Error fetching events by uniqueValue "${uniqueValue}":`, error);
    return [];
  }
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
 * Fetch SEO data from any Strapi single type page
 * Generic function that works for all pages (home, venues-page, pre-orders-page, etc.)
 * @param {string} endpoint - The endpoint name (e.g., 'home', 'venues-page', 'pre-orders-page')
 * @returns {Promise<Object|null>} SEO data object with all meta tags
 */
export async function getPageSEO(endpoint) {
  try {
    const response = await fetch(`${STRAPI_URL}/api/${endpoint}?populate=seo.metaImage`);
    
    if (!response.ok) {
      console.warn(`⚠️ Could not fetch ${endpoint} SEO data:`, response.status);
      return null;
    }

    const data = await response.json();
    
    if (!data || !data.data) {
      console.log(`📄 No ${endpoint} data found`);
      return null;
    }

    const pageData = data.data;
    const seoData = pageData.seo;
    
    if (!seoData) {
      console.log(`📄 No SEO component found for ${endpoint}`);
      return null;
    }

    console.log(`✅ ${endpoint} SEO data fetched successfully`);

    // Extract meta image data with Cloudflare Images optimization
    let metaImageUrl = null;
    let metaImageAlt = null;
    const metaImageWidth = 1200;
    const metaImageHeight = 630;
    
    if (seoData.metaImage) {
      const imageData = getStrapiImageData(seoData.metaImage);
      
      if (imageData?.url) {
        // Use Cloudflare Images with explicit dimensions for Open Graph
        const baseUrl = imageData.url.split('?')[0]; // Remove any existing query params
        metaImageUrl = `${baseUrl}?width=${metaImageWidth}&height=${metaImageHeight}&fit=cover&format=auto&quality=85`;
        metaImageAlt = imageData.alt || 'Active Away';
        
        console.log(`📸 ${endpoint} meta image URL (optimized):`, metaImageUrl);
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
    console.error(`❌ Error fetching ${endpoint} SEO data:`, error);
    return null;
  }
}

/**
 * Fetch Home SEO data from Strapi (wrapper using generic function)
 * @returns {Promise<Object|null>} SEO data including meta image
 */
export async function getHomeSEO() {
  return await getPageSEO('home');
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
 * Normalize a pre-order record returned by Strapi so we can reuse the parsing logic
 * between different fetching strategies (slug, id, documentId, etc.).
 * @param {Object} item - Raw item from Strapi response
 * @returns {Object|null} Structured pre-order data ready for rendering
 */
function transformPreOrderDetail(item) {
  if (!item) {
    return null;
  }

  const preOrder = item.attributes || item;

  // Parse menu files
  const menuFiles = [];
  if (preOrder.menuFiles) {
    const filesData = preOrder.menuFiles.data || preOrder.menuFiles;
    if (Array.isArray(filesData)) {
      filesData.forEach(file => {
        const fileAttrs = file.attributes || file;
        let fileUrl = fileAttrs.url;
        
        // Transform URL if needed
        if (fileUrl && !fileUrl.startsWith('http')) {
          fileUrl = `${STRAPI_URL}${fileUrl}`;
        }
        
        menuFiles.push({
          id: file.id,
          name: fileAttrs.name,
          url: fileUrl,
          size: fileAttrs.size,
          ext: fileAttrs.ext,
          mime: fileAttrs.mime
        });
      });
    }
  }

  // Parse form fields from JSON
  let formFields = [];
  if (preOrder.formFields) {
    try {
      const parsedFields = typeof preOrder.formFields === 'string' 
        ? JSON.parse(preOrder.formFields) 
        : preOrder.formFields;
      formFields = parsedFields.fields || [];
    } catch (error) {
      console.error('Error parsing form fields:', error);
    }
  }

  // Get SEO data if available
  let seoData = null;
  if (preOrder.seo) {
    const seo = preOrder.seo;
    const metaImageData = seo.metaImage ? getStrapiImageData(seo.metaImage) : null;
    
    seoData = {
      metaTitle: seo.metaTitle || null,
      metaDescription: seo.metaDescription || null,
      metaImage: metaImageData?.url || null,
      metaImageAlt: metaImageData?.alt || null,
      keywords: seo.keywords || null,
      canonicalURL: seo.canonicalURL || null
    };
  }

  return {
    id: item.id,
    documentId: item.documentId || item.id,
    title: preOrder.title || 'Untitled Pre-Order',
    slug: preOrder.slug,
    excerpt: preOrder.excerpt || '',
    description: preOrder.description || '',
    hero: {
      title: preOrder.heroTitle || preOrder.title || 'Pre-Order',
      subtitle: preOrder.heroSubtitle || preOrder.excerpt || '',
      kicker: preOrder.heroKicker || 'EXCLUSIVE OPPORTUNITY',
      backgroundImage: preOrder.heroBackgroundImage ? getStrapiImageData(preOrder.heroBackgroundImage) : null
    },
    menuFiles: menuFiles,
    formFields: formFields,
    formWebhookUrl: preOrder.formWebhookUrl || null,
    seo: seoData,
    createdAt: preOrder.createdAt || item.createdAt,
    publishedAt: preOrder.publishedAt || item.publishedAt
  };
}

/**
 * Attempt to fetch a pre-order using fallback identifiers in priority order.
 * @param {Object} identifiers
 * @param {string} [identifiers.documentId]
 * @param {number|string} [identifiers.id]
 * @returns {Promise<Object|null>}
 */
async function resolvePreOrderFallback(identifiers = {}) {
  const { documentId, id } = identifiers || {};

  if (documentId) {
    console.log(`📦 Attempting fallback lookup by documentId: ${documentId}`);
    const byDocumentId = await getPreOrderByDocumentId(documentId);
    if (byDocumentId) {
      return byDocumentId;
    }
  }

  if (id !== undefined && id !== null) {
    const numericId = typeof id === 'string' ? Number(id) : id;
    if (!Number.isNaN(numericId)) {
      console.log(`📦 Attempting fallback lookup by id filter: ${numericId}`);
      const byId = await getPreOrderById(numericId);
      if (byId) {
        return byId;
      }
    } else {
      console.warn(`⚠️ Provided fallback id is not numeric: ${id}`);
    }
  }

  return null;
}

/**
 * Fetch a single pre-order by slug
 * @param {string} slug - Pre-order slug
 * @param {Object} [fallbackIdentifiers] - Optional Strapi identifiers (documentId and/or id) to use if slug lookup fails
 * @returns {Promise<Object|null>} Pre-order data with all fields
 */
export async function getPreOrderBySlug(slug, fallbackIdentifiers) {
  const identifiers = typeof fallbackIdentifiers === 'object' && fallbackIdentifiers !== null
    ? fallbackIdentifiers
    : { id: fallbackIdentifiers };

  if (!slug) {
    console.warn('No slug provided to getPreOrderBySlug');
    return await resolvePreOrderFallback(identifiers);
  }

  try {
    const data = await fetchAPI(
      `/pre-orders?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`
    );
    
    if (!data || !data.data || data.data.length === 0) {
      console.log(`📦 No pre-order found with slug: ${slug}`);
      return await resolvePreOrderFallback(identifiers);
    }

    const item = data.data[0];
    const transformed = transformPreOrderDetail(item);
    if (transformed) {
      console.log(`📦 Pre-order fetched: ${transformed.title}`);
    }
    return transformed;

  } catch (error) {
    console.error(`❌ Error fetching pre-order by slug (${slug}):`, error);
    return await resolvePreOrderFallback(identifiers);
  }
}

/**
 * Fetch a single pre-order by Strapi documentId
 * @param {string} documentId - Strapi documentId
 * @returns {Promise<Object|null>} Pre-order data with full details
 */
export async function getPreOrderByDocumentId(documentId) {
  if (!documentId) {
    return null;
  }

  try {
    const data = await fetchAPI(
      `/pre-orders?filters[documentId][$eq]=${encodeURIComponent(documentId)}&populate=*`
    );

    if (!data || !data.data || data.data.length === 0) {
      console.log(`📦 No pre-order found with documentId: ${documentId}`);
      return null;
    }

    const item = data.data[0];
    const transformed = transformPreOrderDetail(item);
    if (transformed) {
      console.log(`📦 Pre-order fetched by documentId ${documentId}: ${transformed.title}`);
    }
    return transformed;

  } catch (error) {
    console.error(`❌ Error fetching pre-order by documentId (${documentId}):`, error);
    return null;
  }
}

/**
 * Fetch a single pre-order by Strapi numeric identifier using filters
 * @param {number} identifier - Strapi numeric id
 * @returns {Promise<Object|null>} Pre-order data with full details
 */
export async function getPreOrderById(identifier) {
  if (identifier === undefined || identifier === null) {
    return null;
  }

  try {
    const data = await fetchAPI(
      `/pre-orders?filters[id][$eq]=${identifier}&populate=*`
    );

    if (!data || !data.data || data.data.length === 0) {
      console.log(`📦 No pre-order found with id filter: ${identifier}`);
      return null;
    }

    const item = data.data[0];
    const transformed = transformPreOrderDetail(item);
    if (transformed) {
      console.log(`📦 Pre-order fetched by id ${identifier}: ${transformed.title}`);
    }
    return transformed;

  } catch (error) {
    console.error(`❌ Error fetching pre-order by id (${identifier}):`, error);
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
  const documentId = item.documentId || null;
  
  // Get header image
  const headerImage = venue.headerImage ? getStrapiImageData(venue.headerImage) : null;
  
  // Get price - try different field names
  const price = venue.priceFrom || venue.singleOccupancyFrom || venue.singleOccupancyShort || null;
  
  // Generate a slug if Strapi does not provide one
  const slug = venue.slug ||
    (venue.title
      ? venue.title.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
      : `${holidayType}-${item.id}`);

  return {
    id: `${holidayType}-${item.id}`,
    strapiId: item.id,
    documentId,
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
    slug: slug,
    createdAt: venue.createdAt || item.createdAt || new Date().toISOString(),
    // Additional useful fields
    description: venue.description || venue.blogExcerpt || '',
    location: venue.location || venue.country || '',
    displayOnFrontEnd: venue.displayOnFrontEnd !== undefined ? venue.displayOnFrontEnd : true,
    ordering: venue.ordering || 0,
    featured: venue.featured || false
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
 * Fetch a single tennis holiday by slug with all content
 * @param {string} slug - Tennis holiday slug
 * @returns {Promise<Object|null>} Complete tennis holiday data
 */
function transformTennisHolidayDetail(item) {
  if (!item) {
    return null;
  }

  const holiday = item.attributes || item;

  // Get header image
  const headerImage = holiday.headerImage ? getStrapiImageData(holiday.headerImage) : null;
  
  // Get main gallery images
  const mainGallery = holiday.mainGallery ? getStrapiImagesData(holiday.mainGallery) : [];
  
  // Get tripImages (for What's Included section)
  const tripImages = holiday.tripImages ? getStrapiImagesData(holiday.tripImages) : [];
  
  // Get room options (old structure - keeping for backwards compatibility)
  const roomOptions = [];
  const roomOptionsSource = normalizeComponentArray(holiday.roomOptions);
  roomOptionsSource.forEach(room => {
    const roomImage = room.roomImage ? getStrapiImageData(room.roomImage) : null;
    const amenities = room.amenities || [];
    
    roomOptions.push({
      id: room.id,
      roomType: room.roomType,
      description: room.description,
      priceFrom: room.priceFrom,
      maxOccupancy: room.maxOccupancy,
      image: roomImage?.url || null,
      imageAlt: roomImage?.alt || room.roomType,
      amenities: amenities
    });
  });
  
  // Get rooms (new structure with nested roomGallery)
  const rooms = [];
  const roomsSource = normalizeComponentArray(holiday.rooms);
  roomsSource.forEach(room => {
    const roomGallery = room.roomGallery ? getStrapiImagesData(room.roomGallery) : [];
    
    rooms.push({
      id: room.id,
      roomTitle: room.roomTitle,
      roomSize: room.roomSize,
      roomBedConfig: room.roomBedConfig,
      roomText: room.roomText,
      roomGallery: roomGallery
    });
  });

  // Get SEO data if available
  let seoData = null;
  if (holiday.seo) {
    const seo = holiday.seo;
    const metaImageData = seo.metaImage ? getStrapiImageData(seo.metaImage) : null;
    
    seoData = {
      metaTitle: seo.metaTitle || null,
      metaDescription: seo.metaDescription || null,
      metaImage: metaImageData?.url || null,
      metaImageAlt: metaImageData?.alt || null,
      keywords: seo.keywords || null,
      canonicalURL: seo.canonicalURL || null
    };
  }

  const slug = holiday.slug ||
    (holiday.title
      ? holiday.title.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
      : `tennis-holiday-${item.id}`);

  return {
    id: item.id,
    documentId: item.documentId || item.id,
    wpId: holiday.wpId,
    title: holiday.title,
    slug: slug,
    excerpt: holiday.excerpt || '',
    mainHeader: holiday.mainHeader || holiday.title,
    headingText: holiday.headingText || '',
    belowHeadingText: holiday.belowHeadingText || '',
    
    // Images
    headerImage: headerImage,
    mainGallery: mainGallery,
    tripImages: tripImages,
    featuredImageLg: holiday.featuredImageLg ? getStrapiImageData(holiday.featuredImageLg) : null,
    
    // Location info
    venue: holiday.venue,
    shortLocationName: holiday.shortLocationName,
    country: holiday.country,
    countryLg: holiday.countryLg,
    airport: holiday.airport,
    lengthOfTrip: holiday.lengthOfTrip,
    
    // Pricing
    priceFrom: holiday.priceFrom,
    singleOccupancyFrom: holiday.singleOccupancyFrom,
    singleOccupancyRange: holiday.singleOccupancyRange,
    boardBasisLg: holiday.boardBasisLg,
    
    // Ratings
    internalRating: holiday.internalRating,
    ourRating: holiday.ourRating,
    guestRating: holiday.guestRating,
    tennisCourtRating: holiday.tennisCourtRating,
    diningRating: holiday.diningRating,
    
    // Why we love it
    whyWeLoveVenue1: holiday.whyWeLoveVenue1,
    whyWeLoveVenue2: holiday.whyWeLoveVenue2,
    whyWeLoveVenue3: holiday.whyWeLoveVenue3,
    whyWeLoveVenue4: holiday.whyWeLoveVenue4,
    uniqueValue: holiday.uniqueValue,
    uniqueValueForGrid: holiday.uniqueValueForGrid,
    
    // Venue details (rich text)
    setting: holiday.setting,
    boardBasis: holiday.boardBasis,
    restaurants: holiday.restaurants,
    bars: holiday.bars,
    tennisCourts: holiday.tennisCourts,
    topTips: holiday.topTips,
    gettingThere: holiday.gettingThere,
    whereWeStay: holiday.whereWeStay,
    howWeGetAround: holiday.howWeGetAround,
    
    // Tennis details
    tennisCourtSurface: holiday.tennisCourtSurface,
    airportTransfer: holiday.airportTransfer,
    padelCourtsInfo: holiday.padelCourtsInfo,
    
    // Padel-specific fields
    numberOfPadelCourts: holiday.numberOfPadelCourts,
    padelCourtSurface: holiday.padelCourtSurface,
    distanceFromAirport: holiday.distanceFromAirport,
    singleOccupancy: holiday.singleOccupancy,
    
    // Pickleball-specific fields
    numberOfPickleballCourts: holiday.numberOfPickleballCourts,
    pickleballCourtSurface: holiday.pickleballCourtSurface,
    
    // Additional info
    cafeInformation: holiday.cafeInformation,
    carParkingInformation: holiday.carParkingInformation,
    lunchInfo: holiday.lunchInfo,
    eventInformation: holiday.eventInformation,
    residentialType: holiday.residentialType,
    maximumGroupSize: holiday.maximumGroupSize,
    typicalGroupSize: holiday.typicalGroupSize,
    
    // Components
    itinerary: holiday.itinerary || [],
    faqs: holiday.faqs || [],
    whatsIncluded: holiday.whatsIncluded || [],
    whatsNotIncluded: holiday.whatsNotIncluded || [],
    facilities: holiday.facilities || [],
    keyInformation: holiday.keyInformation || [],
    roomOptions: roomOptions,
    rooms: rooms,
    roomsSubheading: holiday.roomsSubheading || null,
    
    // Booking sections
    bookCourtsInfo: holiday.bookCourtsInfo,
    bookCourtsLink: holiday.bookCourtsLink,
    bookCourtsImage: holiday.bookCourtsImage ? getStrapiImageData(holiday.bookCourtsImage) : null,
    bookLessonsInfo: holiday.bookLessonsInfo,
    bookLessonsLink: holiday.bookLessonsLink,
    bookLessonsImage: holiday.bookLessonsImage ? getStrapiImageData(holiday.bookLessonsImage) : null,
    bookRacketsInfo: holiday.bookRacketsInfo,
    bookRacketsLink: holiday.bookRacketsLink,
    bookRacketsImage: holiday.bookRacketsImage ? getStrapiImageData(holiday.bookRacketsImage) : null,
    bookCardioInfo: holiday.bookCardioInfo,
    bookCardioLink: holiday.bookCardioLink,
    bookCardioImage: holiday.bookCardioImage ? getStrapiImageData(holiday.bookCardioImage) : null,
    
    // Coach/Organiser info
    tennisCoachName: holiday.tennisCoachName,
    tennisCoachWhatsappUrl: holiday.tennisCoachWhatsappUrl,
    tennisCoachImage: holiday.tennisCoachImage ? getStrapiImageData(holiday.tennisCoachImage) : null,
    tennisCoachInfo: holiday.tennisCoachInfo,
    groupOrganiserName: holiday.groupOrganiserName,
    groupOrganiserName2: holiday.groupOrganiserName2,
    groupOrganiserProduct: holiday.groupOrganiserProduct,
    groupOrganiserImage: holiday.groupOrganiserImage ? getStrapiImageData(holiday.groupOrganiserImage) : null,
    groupOrganiserWhatsappUrl: holiday.groupOrganiserWhatsappUrl,
    groupOrganiserOtherUrl: holiday.groupOrganiserOtherUrl,
    
    // Downloads/Links
    itineraryDownloadUrl: holiday.itineraryDownloadUrl,
    itineraryDownloadUrl2: holiday.itineraryDownloadUrl2,
    otherFaqsUrl: holiday.otherFaqsUrl,
    googleMapsSearchTerm: holiday.googleMapsSearchTerm,
    fullScreenVideo: holiday.fullScreenVideo,
    emailAddress: holiday.emailAddress,
    
    // Meta
    productType: holiday.productType,
    displayOnFrontEnd: holiday.displayOnFrontEnd,
    ordering: holiday.ordering,
    featured: holiday.featured,
    seo: seoData,
    createdAt: holiday.createdAt || item.createdAt,
    publishedAt: holiday.publishedAt || item.publishedAt
  };
}

async function fetchSingleTennisHoliday(filterQuery, logContext = 'query') {
  const data = await fetchAPI(`/tennis-holidays?${filterQuery}&populate=*`);

  if (!data || !data.data || data.data.length === 0) {
    console.log(`🎾 No tennis holiday found for ${logContext}`);
    return null;
  }

  const transformed = transformTennisHolidayDetail(data.data[0]);
  if (transformed) {
    console.log(`🎾 Tennis holiday fetched (${logContext}): ${transformed.title}`);
    console.log(`📸 Gallery images: ${transformed.mainGallery?.length || 0}`);
  }
  return transformed;
}

async function resolveTennisHolidayFallback(identifiers = {}) {
  const { documentId, id } = identifiers || {};

  if (documentId) {
    console.log(`🎾 Attempting fallback lookup by documentId: ${documentId}`);
    const byDocumentId = await getTennisHolidayByDocumentId(documentId);
    if (byDocumentId) {
      return byDocumentId;
    }
  }

  if (id !== undefined && id !== null) {
    const numericId = typeof id === 'string' ? Number(id) : id;
    if (!Number.isNaN(numericId)) {
      console.log(`🎾 Attempting fallback lookup by id: ${numericId}`);
      const byId = await getTennisHolidayById(numericId);
      if (byId) {
        return byId;
      }
    } else {
      console.warn(`⚠️ Provided fallback tennis holiday id is not numeric: ${id}`);
    }
  }

  return null;
}

/**
 * SEPARATE API CALL: Fetch nested data for tennis holiday (rooms.roomGallery, tripImages)
 * This is called separately to handle Strapi v5's nested population requirements
 * @param {string} slug - Tennis holiday slug
 * @returns {Promise<Object|null>} Object with rooms and tripImages, or null
 */
export async function getTennisHolidayNestedData(slug) {
  if (!slug) {
    console.warn('No slug provided to getTennisHolidayNestedData');
    return null;
  }

  try {
    // Strapi v5 requires explicit nested population for deep relations
    // Using the exact syntax from the working API test
    const data = await fetchAPI(
      `/tennis-holidays?filters[slug][$eq]=${encodeURIComponent(slug)}&populate[rooms][populate]=*&populate=tripImages`
    );
    
    if (data && data.data && data.data.length > 0) {
      const item = data.data[0];
      const holiday = item.attributes || item;
      
      // Process rooms with nested roomGallery
      const rooms = [];
      const roomsSource = normalizeComponentArray(holiday.rooms);
      roomsSource.forEach(room => {
        const roomGallery = room.roomGallery ? getStrapiImagesData(room.roomGallery) : [];
        
        rooms.push({
          id: room.id,
          roomTitle: room.roomTitle,
          roomSize: room.roomSize,
          roomBedConfig: room.roomBedConfig,
          roomText: room.roomText,
          roomGallery: roomGallery
        });
      });
      
      // Process tripImages
      const tripImages = holiday.tripImages ? getStrapiImagesData(holiday.tripImages) : [];
      
      console.log(`🏨 Nested data fetched for ${slug}: ${rooms.length} rooms, ${tripImages.length} trip images`);
      
      return {
        rooms,
        tripImages
      };
    }
    
    return null;
  } catch (error) {
    console.error(`❌ Error fetching nested data for tennis holiday (${slug}):`, error);
    return null;
  }
}

/**
 * SEPARATE API CALL: Fetch SEO data with metaImage for tennis holiday
 * This is called separately to ensure proper population of nested SEO fields
 * @param {string} slug - Tennis holiday slug
 * @returns {Promise<Object|null>} SEO data object or null
 */
export async function getTennisHolidaySEO(slug) {
  if (!slug) {
    console.warn('No slug provided to getTennisHolidaySEO');
    return null;
  }

  try {
    // Explicitly populate seo.metaImage
    const data = await fetchAPI(
      `/tennis-holidays?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=seo.metaImage`
    );
    
    if (data && data.data && data.data.length > 0) {
      const item = data.data[0];
      const holiday = item.attributes || item;
      
      if (holiday.seo) {
        const seo = holiday.seo;
        const metaImageData = seo.metaImage ? getStrapiImageData(seo.metaImage) : null;
        
        const seoData = {
          metaTitle: seo.metaTitle || null,
          metaDescription: seo.metaDescription || null,
          metaImage: metaImageData?.url || null,
          metaImageAlt: metaImageData?.alt || null,
          keywords: seo.keywords || null,
          canonicalURL: seo.canonicalURL || null
        };
        
        console.log(`📄 SEO data fetched for ${slug}:`, {
          hasMetaImage: !!seoData.metaImage,
          metaTitle: seoData.metaTitle
        });
        
        return seoData;
      }
    }
    
    return null;
  } catch (error) {
    console.error(`❌ Error fetching SEO data for tennis holiday (${slug}):`, error);
    return null;
  }
}

export async function getTennisHolidayBySlug(slug, fallbackIdentifiers) {
  const identifiers = typeof fallbackIdentifiers === 'object' && fallbackIdentifiers !== null
    ? fallbackIdentifiers
    : { id: fallbackIdentifiers };

  if (!slug) {
    console.warn('No slug provided to getTennisHolidayBySlug');
    return await resolveTennisHolidayFallback(identifiers);
  }

  try {
    // Use populate=* to get ALL fields including mainGallery
    const data = await fetchAPI(
      `/tennis-holidays?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`
    );
    
    if (data && data.data && data.data.length > 0) {
      const transformed = transformTennisHolidayDetail(data.data[0]);
      if (transformed) {
        console.log(`🎾 Tennis holiday fetched (slug=${slug}): ${transformed.title}`);
        console.log(`📸 Gallery images found: ${transformed.mainGallery?.length || 0}`);
      }
      return transformed;
    }

  } catch (error) {
    console.error(`❌ Error fetching tennis holiday by slug (${slug}):`, error);
  }

  return await resolveTennisHolidayFallback(identifiers);
}

export async function getTennisHolidayByDocumentId(documentId) {
  if (!documentId) {
    return null;
  }

  try {
    const data = await fetchAPI(`/tennis-holidays?filters[documentId][$eq]=${encodeURIComponent(documentId)}&populate=*`);
    
    if (data && data.data && data.data.length > 0) {
      return transformTennisHolidayDetail(data.data[0]);
    }
    return null;
  } catch (error) {
    console.error(`❌ Error fetching tennis holiday by documentId (${documentId}):`, error);
    return null;
  }
}

export async function getTennisHolidayById(identifier) {
  if (identifier === undefined || identifier === null) {
    return null;
  }

  const numericId = typeof identifier === 'string' ? Number(identifier) : identifier;
  if (Number.isNaN(numericId)) {
    console.warn(`Cannot fetch tennis holiday by id, identifier is not numeric: ${identifier}`);
    return null;
  }

  try {
    const data = await fetchAPI(`/tennis-holidays?filters[id][$eq]=${numericId}&populate=*`);
    
    if (data && data.data && data.data.length > 0) {
      return transformTennisHolidayDetail(data.data[0]);
    }
    return null;
  } catch (error) {
    console.error(`❌ Error fetching tennis holiday by id (${numericId}):`, error);
    return null;
  }
}

/**
 * PADEL HOLIDAY FUNCTIONS
 * These follow the same pattern as tennis holidays but query the padel-tennis-holidays endpoint
 */

/**
 * SEPARATE API CALL: Fetch nested data for padel holiday (rooms.roomGallery, tripImages)
 * @param {string} slug - Padel holiday slug
 * @returns {Promise<Object|null>} Object with rooms and tripImages, or null
 */
export async function getPadelHolidayNestedData(slug) {
  if (!slug) {
    console.warn('No slug provided to getPadelHolidayNestedData');
    return null;
  }

  try {
    const data = await fetchAPI(
      `/padel-tennis-holidays?filters[slug][$eq]=${encodeURIComponent(slug)}&populate[rooms][populate]=*&populate=tripImages`
    );
    
    if (data && data.data && data.data.length > 0) {
      const item = data.data[0];
      const holiday = item.attributes || item;
      
      const rooms = [];
      const roomsSource = normalizeComponentArray(holiday.rooms);
      roomsSource.forEach(room => {
        const roomGallery = room.roomGallery ? getStrapiImagesData(room.roomGallery) : [];
        
        rooms.push({
          id: room.id,
          roomTitle: room.roomTitle,
          roomSize: room.roomSize,
          roomBedConfig: room.roomBedConfig,
          roomText: room.roomText,
          roomGallery: roomGallery
        });
      });
      
      const tripImages = holiday.tripImages ? getStrapiImagesData(holiday.tripImages) : [];
      
      console.log(`🏨 Nested data fetched for padel ${slug}: ${rooms.length} rooms, ${tripImages.length} trip images`);
      
      return {
        rooms,
        tripImages
      };
    }
    
    return null;
  } catch (error) {
    console.error(`❌ Error fetching nested data for padel holiday (${slug}):`, error);
    return null;
  }
}

/**
 * SEPARATE API CALL: Fetch SEO data with metaImage for padel holiday
 * @param {string} slug - Padel holiday slug
 * @returns {Promise<Object|null>} SEO data object or null
 */
export async function getPadelHolidaySEO(slug) {
  if (!slug) {
    console.warn('No slug provided to getPadelHolidaySEO');
    return null;
  }

  try {
    const data = await fetchAPI(
      `/padel-tennis-holidays?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=seo.metaImage`
    );
    
    if (data && data.data && data.data.length > 0) {
      const item = data.data[0];
      const holiday = item.attributes || item;
      
      if (holiday.seo) {
        const seo = holiday.seo;
        const metaImageData = seo.metaImage ? getStrapiImageData(seo.metaImage) : null;
        
        const seoData = {
          metaTitle: seo.metaTitle || null,
          metaDescription: seo.metaDescription || null,
          metaImage: metaImageData?.url || null,
          metaImageAlt: metaImageData?.alt || null,
          keywords: seo.keywords || null,
          canonicalURL: seo.canonicalURL || null
        };
        
        console.log(`📄 SEO data fetched for padel ${slug}:`, {
          hasMetaImage: !!seoData.metaImage,
          metaTitle: seoData.metaTitle
        });
        
        return seoData;
      }
    }
    
    return null;
  } catch (error) {
    console.error(`❌ Error fetching SEO data for padel holiday (${slug}):`, error);
    return null;
  }
}

async function resolvePadelHolidayFallback(identifiers = {}) {
  const { documentId, id } = identifiers || {};

  if (documentId) {
    console.log(`🏸 Attempting fallback lookup by documentId: ${documentId}`);
    const byDocumentId = await getPadelHolidayByDocumentId(documentId);
    if (byDocumentId) {
      return byDocumentId;
    }
  }

  if (id !== undefined && id !== null) {
    const numericId = typeof id === 'string' ? Number(id) : id;
    if (!Number.isNaN(numericId)) {
      console.log(`🏸 Attempting fallback lookup by id: ${numericId}`);
      const byId = await getPadelHolidayById(numericId);
      if (byId) {
        return byId;
      }
    } else {
      console.warn(`⚠️ Provided fallback padel holiday id is not numeric: ${id}`);
    }
  }

  return null;
}

export async function getPadelHolidayBySlug(slug, fallbackIdentifiers) {
  const identifiers = typeof fallbackIdentifiers === 'object' && fallbackIdentifiers !== null
    ? fallbackIdentifiers
    : { id: fallbackIdentifiers };

  if (!slug) {
    console.warn('No slug provided to getPadelHolidayBySlug');
    return await resolvePadelHolidayFallback(identifiers);
  }

  try {
    const data = await fetchAPI(
      `/padel-tennis-holidays?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`
    );
    
    if (data && data.data && data.data.length > 0) {
      const transformed = transformTennisHolidayDetail(data.data[0]);
      if (transformed) {
        console.log(`🏸 Padel holiday fetched (slug=${slug}): ${transformed.title}`);
        console.log(`📸 Gallery images found: ${transformed.mainGallery?.length || 0}`);
      }
      return transformed;
    }

  } catch (error) {
    console.error(`❌ Error fetching padel holiday by slug (${slug}):`, error);
  }

  return await resolvePadelHolidayFallback(identifiers);
}

export async function getPadelHolidayByDocumentId(documentId) {
  if (!documentId) {
    return null;
  }

  try {
    const data = await fetchAPI(`/padel-tennis-holidays?filters[documentId][$eq]=${encodeURIComponent(documentId)}&populate=*`);
    
    if (data && data.data && data.data.length > 0) {
      return transformTennisHolidayDetail(data.data[0]);
    }
    return null;
  } catch (error) {
    console.error(`❌ Error fetching padel holiday by documentId (${documentId}):`, error);
    return null;
  }
}

export async function getPadelHolidayById(identifier) {
  if (identifier === undefined || identifier === null) {
    return null;
  }

  const numericId = typeof identifier === 'string' ? Number(identifier) : identifier;
  if (Number.isNaN(numericId)) {
    console.warn(`Cannot fetch padel holiday by id, identifier is not numeric: ${identifier}`);
    return null;
  }

  try {
    const data = await fetchAPI(`/padel-tennis-holidays?filters[id][$eq]=${numericId}&populate=*`);
    
    if (data && data.data && data.data.length > 0) {
      return transformTennisHolidayDetail(data.data[0]);
    }
    return null;
  } catch (error) {
    console.error(`❌ Error fetching padel holiday by id (${numericId}):`, error);
    return null;
  }
}

/**
 * PICKLEBALL HOLIDAY FUNCTIONS
 * These follow the same pattern as tennis/padel holidays but query the pickleball-holidays endpoint
 */

/**
 * SEPARATE API CALL: Fetch nested data for pickleball holiday (rooms.roomGallery, tripImages)
 * @param {string} slug - Pickleball holiday slug
 * @returns {Promise<Object|null>} Object with rooms and tripImages, or null
 */
export async function getPickleballHolidayNestedData(slug) {
  if (!slug) {
    console.warn('No slug provided to getPickleballHolidayNestedData');
    return null;
  }

  try {
    const data = await fetchAPI(
      `/pickleball-holidays?filters[slug][$eq]=${encodeURIComponent(slug)}&populate[rooms][populate]=*&populate=tripImages`
    );
    
    if (data && data.data && data.data.length > 0) {
      const item = data.data[0];
      const holiday = item.attributes || item;
      
      const rooms = [];
      const roomsSource = normalizeComponentArray(holiday.rooms);
      roomsSource.forEach(room => {
        const roomGallery = room.roomGallery ? getStrapiImagesData(room.roomGallery) : [];
        
        rooms.push({
          id: room.id,
          roomTitle: room.roomTitle,
          roomSize: room.roomSize,
          roomBedConfig: room.roomBedConfig,
          roomText: room.roomText,
          roomGallery: roomGallery
        });
      });
      
      const tripImages = holiday.tripImages ? getStrapiImagesData(holiday.tripImages) : [];
      
      console.log(`🏨 Nested data fetched for pickleball ${slug}: ${rooms.length} rooms, ${tripImages.length} trip images`);
      
      return {
        rooms,
        tripImages
      };
    }
    
    return null;
  } catch (error) {
    console.error(`❌ Error fetching nested data for pickleball holiday (${slug}):`, error);
    return null;
  }
}

/**
 * SEPARATE API CALL: Fetch SEO data with metaImage for pickleball holiday
 * @param {string} slug - Pickleball holiday slug
 * @returns {Promise<Object|null>} SEO data object or null
 */
export async function getPickleballHolidaySEO(slug) {
  if (!slug) {
    console.warn('No slug provided to getPickleballHolidaySEO');
    return null;
  }

  try {
    const data = await fetchAPI(
      `/pickleball-holidays?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=seo.metaImage`
    );
    
    if (data && data.data && data.data.length > 0) {
      const item = data.data[0];
      const holiday = item.attributes || item;
      
      if (holiday.seo) {
        const seo = holiday.seo;
        const metaImageData = seo.metaImage ? getStrapiImageData(seo.metaImage) : null;
        
        const seoData = {
          metaTitle: seo.metaTitle || null,
          metaDescription: seo.metaDescription || null,
          metaImage: metaImageData?.url || null,
          metaImageAlt: metaImageData?.alt || null,
          keywords: seo.keywords || null,
          canonicalURL: seo.canonicalURL || null
        };
        
        console.log(`📄 SEO data fetched for pickleball ${slug}:`, {
          hasMetaImage: !!seoData.metaImage,
          metaTitle: seoData.metaTitle
        });
        
        return seoData;
      }
    }
    
    return null;
  } catch (error) {
    console.error(`❌ Error fetching SEO data for pickleball holiday (${slug}):`, error);
    return null;
  }
}

async function resolvePickleballHolidayFallback(identifiers = {}) {
  const { documentId, id } = identifiers || {};

  if (documentId) {
    console.log(`🏓 Attempting fallback lookup by documentId: ${documentId}`);
    const byDocumentId = await getPickleballHolidayByDocumentId(documentId);
    if (byDocumentId) {
      return byDocumentId;
    }
  }

  if (id !== undefined && id !== null) {
    const numericId = typeof id === 'string' ? Number(id) : id;
    if (!Number.isNaN(numericId)) {
      console.log(`🏓 Attempting fallback lookup by id: ${numericId}`);
      const byId = await getPickleballHolidayById(numericId);
      if (byId) {
        return byId;
      }
    } else {
      console.warn(`⚠️ Provided fallback pickleball holiday id is not numeric: ${id}`);
    }
  }

  return null;
}

export async function getPickleballHolidayBySlug(slug, fallbackIdentifiers) {
  const identifiers = typeof fallbackIdentifiers === 'object' && fallbackIdentifiers !== null
    ? fallbackIdentifiers
    : { id: fallbackIdentifiers };

  if (!slug) {
    console.warn('No slug provided to getPickleballHolidayBySlug');
    return await resolvePickleballHolidayFallback(identifiers);
  }

  try {
    const data = await fetchAPI(
      `/pickleball-holidays?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`
    );
    
    if (data && data.data && data.data.length > 0) {
      const transformed = transformTennisHolidayDetail(data.data[0]);
      if (transformed) {
        console.log(`🏓 Pickleball holiday fetched (slug=${slug}): ${transformed.title}`);
        console.log(`📸 Gallery images found: ${transformed.mainGallery?.length || 0}`);
      }
      return transformed;
    }

  } catch (error) {
    console.error(`❌ Error fetching pickleball holiday by slug (${slug}):`, error);
  }

  return await resolvePickleballHolidayFallback(identifiers);
}

export async function getPickleballHolidayByDocumentId(documentId) {
  if (!documentId) {
    return null;
  }

  try {
    const data = await fetchAPI(`/pickleball-holidays?filters[documentId][$eq]=${encodeURIComponent(documentId)}&populate=*`);
    
    if (data && data.data && data.data.length > 0) {
      return transformTennisHolidayDetail(data.data[0]);
    }
    return null;
  } catch (error) {
    console.error(`❌ Error fetching pickleball holiday by documentId (${documentId}):`, error);
    return null;
  }
}

export async function getPickleballHolidayById(identifier) {
  if (identifier === undefined || identifier === null) {
    return null;
  }

  const numericId = typeof identifier === 'string' ? Number(identifier) : identifier;
  if (Number.isNaN(numericId)) {
    console.warn(`Cannot fetch pickleball holiday by id, identifier is not numeric: ${identifier}`);
    return null;
  }

  try {
    const data = await fetchAPI(`/pickleball-holidays?filters[id][$eq]=${numericId}&populate=*`);
    
    if (data && data.data && data.data.length > 0) {
      return transformTennisHolidayDetail(data.data[0]);
    }
    return null;
  } catch (error) {
    console.error(`❌ Error fetching pickleball holiday by id (${numericId}):`, error);
    return null;
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
