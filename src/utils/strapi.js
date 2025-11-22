// Strapi API utility functions
// Support Astro (import.meta.env), Node.js (process.env) and Cloudflare runtime environments
import { getCloudflareImageUrl } from './cloudflareImages.js';

const DEFAULT_STRAPI_URL = 'http://localhost:1337';
const DEFAULT_STRAPI_TOKEN = '';

/**
 * Resolve runtime environment from multiple execution contexts (Cloudflare, Node, etc.)
 * @returns {Record<string, any>|undefined}
 */
function getRuntimeEnv() {
  if (typeof globalThis === 'undefined') return undefined;
  return globalThis.__RUNTIME_ENV__
    || globalThis.__env
    || globalThis.__env__
    || globalThis.ENV;
}

/**
 * Safely resolve an environment variable from available sources.
 * @param {string} key
 * @param {string} fallback
 * @returns {string}
 */
function getEnvValue(key, fallback = '') {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env?.[key]) {
      return import.meta.env[key];
    }
  } catch (error) {
    // ignore - import.meta may not exist in some runtimes
  }

  if (typeof process !== 'undefined' && process.env?.[key]) {
    return process.env[key];
  }

  const runtimeEnv = getRuntimeEnv();
  if (runtimeEnv && runtimeEnv[key]) {
    return runtimeEnv[key];
  }

  return fallback;
}

function getStrapiUrl() {
  return getEnvValue('STRAPI_URL', DEFAULT_STRAPI_URL);
}

function getStrapiToken() {
  return getEnvValue('STRAPI_API_TOKEN', DEFAULT_STRAPI_TOKEN);
}

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
  const strapiUrl = getStrapiUrl();
  const strapiToken = getStrapiToken();
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Add authorization header if token is available.
  if (strapiToken) {
    defaultOptions.headers['Authorization'] = `Bearer ${strapiToken}`;
  }

  try {
    const response = await fetch(
      `${strapiUrl}/api${endpoint}`,
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
  return `${getStrapiUrl()}${url}`;
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
 * Get optimized SEO meta image data from Strapi SEO component
 * Applies Cloudflare Images optimization for Open Graph (1200x630)
 * @param {Object} seoMetaImage - Strapi SEO metaImage object
 * @returns {Object} Object with url, alt, width, height for Open Graph
 */
export function getOptimizedSEOImage(seoMetaImage) {
  const metaImageWidth = 1200;
  const metaImageHeight = 630;
  
  if (!seoMetaImage) {
    return { url: null, alt: null, width: null, height: null };
  }
  
  const imageData = getStrapiImageData(seoMetaImage);
  
  if (!imageData?.url) {
    return { url: null, alt: null, width: null, height: null };
  }
  
  // Use Cloudflare Images with explicit dimensions for Open Graph
  const baseUrl = imageData.url.split('?')[0]; // Remove any existing query params
  const optimizedUrl = `${baseUrl}?width=${metaImageWidth}&height=${metaImageHeight}&fit=cover&format=auto&quality=85`;
  
  return {
    url: optimizedUrl,
    alt: imageData.alt || 'Active Away',
    width: metaImageWidth,
    height: metaImageHeight
  };
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
    
    return url.startsWith('http') ? url : `${getStrapiUrl()}${url}`;
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
        url = `${getStrapiUrl()}${url}`;
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
        url = `${getStrapiUrl()}${url}`;
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
      
      // Determine status
      const isSoldOut = event.isSoldOut || event.status?.toLowerCase() === 'sold out';
      const spotsLeft = event.spotsLeft || 0;
      
      let statusBadge = 'Available';
      let statusClass = 'bg-green-100 text-green-800';
      
      if (isSoldOut) {
        statusBadge = 'Sold Out';
        statusClass = 'bg-red-100 text-red-800';
      } else if (spotsLeft > 0 && spotsLeft <= 5) {
        statusBadge = `${spotsLeft} spots left`;
        statusClass = 'bg-orange-100 text-orange-800';
      } else if (spotsLeft > 5) {
        statusBadge = 'Available';
        statusClass = 'bg-green-100 text-green-800';
      }

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
        imageSrcSet: featuredImage?.url ? `${featuredImage.url}?width=320 320w, ${featuredImage.url}?width=640 640w, ${featuredImage.url}?width=1024 1024w` : null,
        bookingLink: event.bookingLink || '#',
        venueLink: event.venueLink || '#',
        buttonText: event.buttonText || 'Book Now',
        buttonColour: event.buttonColour || '#ad986c',
        isSoldOut,
        statusBadge,
        statusClass,
        singleOccupancyPrice: event.singleOccupancyPriceEvent || null
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
 * Fetch events by document IDs (comma-separated)
 * @param {string} documentIds - Comma-separated document IDs (e.g., "abc123,def456,ghi789")
 * @returns {Promise<Array>} Array of formatted event data matching the document IDs
 */
export async function getEventsByDocumentIds(documentIds) {
  try {
    if (!documentIds) {
      console.warn('⚠️ No documentIds provided to getEventsByDocumentIds');
      return [];
    }

    // Split comma-separated IDs and trim whitespace
    const ids = documentIds.split(',').map(id => id.trim()).filter(id => id.length > 0);
    
    if (ids.length === 0) {
      console.warn('⚠️ No valid document IDs after parsing');
      return [];
    }

    console.log(`🔍 Fetching events by document IDs: ${ids.length} ID(s)`);
    
    // Fetch each event by documentId using the correct Strapi v5 filter syntax
    const eventPromises = ids.map(documentId => 
      fetchAPI(`/events?filters[documentId][$eq]=${encodeURIComponent(documentId)}&populate=*`)
    );
    
    const results = await Promise.all(eventPromises);
    const events = [];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset to start of day for accurate comparison
    
    results.forEach((data, index) => {
      if (data && data.data && data.data.length > 0) {
        const item = data.data[0]; // Get first result from array
        const event = item.attributes || item;
        
        // Check if event is in the future based on dateFrom
        if (event.dateFrom) {
          const eventDate = new Date(event.dateFrom);
          eventDate.setHours(0, 0, 0, 0); // Reset to start of day
          
          // Skip past events
          if (eventDate < today) {
            console.log(`⏭️ Skipping past event: ${event.title || event.dateFrom} (${ids[index]})`);
            return;
          }
        }
        
        // Format dates
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
        
        events.push({
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
        });
      } else {
        console.warn(`⚠️ Event not found for document ID: ${ids[index]}`);
      }
    });
    
    console.log(`✅ Found ${events.length} future event(s) by document IDs (${ids.length} total queried)`);
    
    // Sort by dateFrom
    events.sort((a, b) => {
      if (!a.dateFrom) return 1;
      if (!b.dateFrom) return -1;
      return new Date(a.dateFrom) - new Date(b.dateFrom);
    });
    
    return events;
    
  } catch (error) {
    console.error(`❌ Error fetching events by document IDs:`, error);
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
          slug: blog.slug || `post-${item.id}`,
          categorySlug: blog.categorySlug || 'uncategorized' // Add categorySlug for new URL structure
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
 * Fetch blog posts by category
 * @param {string} categorySlug - Category slug to filter by
 * @param {number} limit - Number of blog posts to fetch (0 = no limit)
 * @returns {Promise<Array>} Array of blog posts for the category
 */
export async function getBlogsByCategory(categorySlug, limit = 0) {
  if (!categorySlug) {
    console.warn('⚠️ [getBlogsByCategory] No categorySlug provided');
    return [];
  }

  try {
    console.log(`📝 [getBlogsByCategory] Fetching blogs for category: ${categorySlug}`);
    
    // Build query - if categorySlug is 'uncategorized', we need special handling
    let query = '/blogs?populate=headerImage&sort=CreationDate:desc&filters[publishedAt][$notNull]=true';
    
    if (categorySlug === 'uncategorized') {
      // For uncategorized, we might want to include posts with null categorySlug
      // For now, just filter by the enum value
      query += `&filters[categorySlug][$eq]=${categorySlug}`;
    } else {
      query += `&filters[categorySlug][$eq]=${categorySlug}`;
    }
    
    if (limit > 0) {
      query += `&pagination[limit]=${limit * 2}`; // Fetch more to account for filtering
    } else {
      query += `&pagination[limit]=1000`; // Get all posts for category
    }
    
    const data = await fetchAPI(query);
    
    if (!data || !data.data || data.data.length === 0) {
      console.log(`📝 [getBlogsByCategory] No blogs found for category: ${categorySlug}`);
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

        // Format date
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
          creationDate: creationDate,
          image: headerImage.url,
          imageAlt: headerImage.alt || blog.title || 'Blog post image',
          slug: blog.slug || `post-${item.id}`,
          categorySlug: blog.categorySlug || categorySlug
        };
      })
      .filter(blog => blog !== null); // Remove blogs without images

    // Apply limit if specified
    const finalBlogs = limit > 0 ? blogs.slice(0, limit) : blogs;

    console.log(`✅ [getBlogsByCategory] Fetched ${finalBlogs.length} blogs for ${categorySlug}`);
    return finalBlogs;

  } catch (error) {
    console.error(`❌ [getBlogsByCategory] Error fetching blogs for ${categorySlug}:`, error);
    return [];
  }
}

/**
 * Helper function to format category slug into readable text
 * @param {string} slug - Category slug (e.g., 'tennis-coaching')
 * @returns {string} Formatted category name (e.g., 'Tennis Coaching')
 */
export function formatCategorySlug(slug) {
  if (!slug) return '';
  
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Fetch all blog posts for static path generation
 * @returns {Promise<Array>} Array of blog posts with id, slug, categorySlug, documentId
 */
export async function getAllBlogPosts() {
  try {
    console.log('📝 [getAllBlogPosts] Fetching all blog posts...');
    
    const data = await fetchAPI('/blogs?filters[publishedAt][$notNull]=true&pagination[limit]=1000');
    
    if (!data || !data.data || data.data.length === 0) {
      console.warn('⚠️ [getAllBlogPosts] No blog posts found');
      return [];
    }

    const posts = data.data
      .map((item) => {
        const blog = item.attributes || item;
        
        // Skip posts without slug or categorySlug
        if (!blog.slug) {
          console.warn(`⚠️ [getAllBlogPosts] Skipping blog post ${item.id} - missing slug`);
          return null;
        }
        
        // Default to 'uncategorized' if categorySlug is missing or null
        const categorySlug = blog.categorySlug || 'uncategorized';
        
        if (!blog.categorySlug) {
          console.warn(`⚠️ [getAllBlogPosts] Blog post "${blog.title}" (${item.id}) has no categorySlug, using 'uncategorized'`);
        }
        
        return {
          id: item.id,
          documentId: item.documentId || item.id,
          slug: blog.slug,
          categorySlug: categorySlug
        };
      })
      .filter(post => post !== null); // Remove invalid posts

    console.log(`✅ [getAllBlogPosts] Fetched ${posts.length} blog posts`);
    return posts;
  } catch (error) {
    console.error('❌ [getAllBlogPosts] Error:', error);
    return [];
  }
}

/**
 * Fetch a single blog post by categorySlug and slug
 * @param {string} categorySlug - Category slug (e.g., 'tennis-coaching')
 * @param {string} slug - Blog post slug
 * @param {Object} [fallbackIdentifiers] - Optional Strapi identifiers
 * @returns {Promise<Object|null>} Blog post data
 */
export async function getBlogBySlug(categorySlug, slug, fallbackIdentifiers = {}) {
  if (!categorySlug || !slug) {
    console.warn('⚠️ [getBlogBySlug] Missing categorySlug or slug');
    return null;
  }

  try {
    console.log(`📝 [getBlogBySlug] Fetching blog: ${categorySlug}/${slug}`);
    
    // First try to find by categorySlug and slug
    let data = await fetchAPI(
      `/blogs?filters[categorySlug][$eq]=${categorySlug}&filters[slug][$eq]=${slug}&populate=headerImage`
    );
    
    // If not found and categorySlug is 'uncategorized', also try to find posts with null categorySlug
    if ((!data || !data.data || data.data.length === 0) && categorySlug === 'uncategorized') {
      console.log(`📝 [getBlogBySlug] Trying to find post with null categorySlug...`);
      data = await fetchAPI(
        `/blogs?filters[slug][$eq]=${slug}&populate=headerImage`
      );
    }
    
    if (!data || !data.data || data.data.length === 0) {
      console.warn(`⚠️ [getBlogBySlug] Blog post not found: ${categorySlug}/${slug}`);
      return null;
    }
    
    const item = data.data[0];
    const blog = item.attributes || item;
    
    // Get header image
    const headerImage = blog.headerImage ? getStrapiImageData(blog.headerImage) : null;
    
    // Format date
    const creationDate = blog.CreationDate || blog.creation_date;
    let formattedDate = '';
    if (creationDate) {
      const date = new Date(creationDate);
      formattedDate = date.toLocaleDateString('en-GB', { 
        day: 'numeric',
        month: 'long', 
        year: 'numeric' 
      });
    }
    
    // Format category name - use provided categorySlug or fall back to blog's categorySlug
    const actualCategorySlug = blog.categorySlug || categorySlug || 'uncategorized';
    const categoryName = formatCategorySlug(actualCategorySlug);
    
    const blogPost = {
      id: item.id,
      documentId: item.documentId || item.id,
      title: blog.title || 'Untitled Post',
      slug: blog.slug,
      categorySlug: actualCategorySlug,
      categoryName: categoryName,
      content: blog.content || '',
      blogExcerpt: blog.blogExcerpt || '',
      authorFullName: blog.authorFullName || 'Active Away',
      creationDate: creationDate,
      formattedDate: formattedDate,
      headerImage: headerImage,
      seo: blog.seo || null,
      publishedAt: blog.publishedAt || item.publishedAt
    };
    
    console.log(`✅ [getBlogBySlug] Blog post fetched: ${blogPost.title}`);
    return blogPost;
  } catch (error) {
    console.error(`❌ [getBlogBySlug] Error fetching ${categorySlug}/${slug}:`, error);
    return null;
  }
}

/**
 * Fetch SEO data for a blog post
 * @param {string} categorySlug - Category slug
 * @param {string} slug - Blog post slug
 * @returns {Promise<Object|null>} SEO data with metaImage
 */
export async function getBlogSEO(categorySlug, slug) {
  if (!categorySlug || !slug) {
    console.warn('⚠️ [getBlogSEO] Missing categorySlug or slug');
    return null;
  }

  try {
    console.log(`📝 [getBlogSEO] Fetching SEO data for: ${categorySlug}/${slug}`);
    
    // First try to find by categorySlug and slug
    let data = await fetchAPI(
      `/blogs?filters[categorySlug][$eq]=${categorySlug}&filters[slug][$eq]=${slug}&populate[seo][populate]=metaImage`
    );
    
    // If not found and categorySlug is 'uncategorized', also try to find posts with null categorySlug
    if ((!data || !data.data || data.data.length === 0) && categorySlug === 'uncategorized') {
      console.log(`📝 [getBlogSEO] Trying to find post with null categorySlug...`);
      data = await fetchAPI(
        `/blogs?filters[slug][$eq]=${slug}&populate[seo][populate]=metaImage`
      );
    }
    
    if (!data || !data.data || data.data.length === 0) {
      console.warn(`⚠️ [getBlogSEO] Blog post not found: ${categorySlug}/${slug}`);
      return null;
    }
    
    const item = data.data[0];
    const blog = item.attributes || item;
    const seoData = blog.seo;
    
    if (!seoData) {
      console.log(`📝 [getBlogSEO] No SEO component found for ${categorySlug}/${slug}`);
      return null;
    }

    // Extract meta image data with Cloudflare Images optimization
    const metaImageData = getOptimizedSEOImage(seoData.metaImage);
    
    console.log(`✅ [getBlogSEO] SEO data fetched for ${categorySlug}/${slug}`);
    
    return {
      metaTitle: seoData.metaTitle || null,
      metaDescription: seoData.metaDescription || null,
      keywords: seoData.keywords || null,
      canonicalURL: seoData.canonicalURL || null,
      metaImage: metaImageData.url || null,
      metaImageAlt: metaImageData.alt || null,
      metaImageWidth: metaImageData.width || null,
      metaImageHeight: metaImageData.height || null
    };
  } catch (error) {
    console.error(`❌ [getBlogSEO] Error fetching SEO for ${categorySlug}/${slug}:`, error);
    return null;
  }
}

/**
 * Fetch blog page data (index page with categories)
 * @returns {Promise<Object|null>} Blog page data with categories
 */
export async function getBlogPage() {
  try {
    console.log('📝 [getBlogPage] Fetching blog page data...');
    
    const data = await fetchAPI('/blog-page?populate[categories][populate]=image&populate=heroBackgroundImage');
    
    if (!data || !data.data) {
      console.warn('⚠️ [getBlogPage] No blog page data found');
      return null;
    }
    
    const pageData = data.data.attributes || data.data;
    
    // Process categories
    const categories = (pageData.categories || [])
      .map((cat) => {
        const image = cat.image ? getStrapiImageData(cat.image) : null;
        const categoryName = formatCategorySlug(cat.categorySlug);
        
        return {
          categorySlug: cat.categorySlug,
          categoryName: categoryName,
          title: cat.title,
          description: cat.description,
          image: image,
          order: cat.order || 0
        };
      })
      .sort((a, b) => a.order - b.order); // Sort by order field
    
    const heroBackgroundImage = pageData.heroBackgroundImage ? getStrapiImageData(pageData.heroBackgroundImage) : null;
    
    const blogPageData = {
      pageTitle: pageData.pageTitle || 'Blog',
      pageSubtitle: pageData.pageSubtitle || '',
      heroBackgroundImage: heroBackgroundImage,
      categories: categories,
      seo: pageData.seo || null
    };
    
    console.log(`✅ [getBlogPage] Blog page data fetched with ${categories.length} categories`);
    return blogPageData;
  } catch (error) {
    console.error('❌ [getBlogPage] Error fetching blog page:', error);
    return null;
  }
}

/**
 * Get category-specific data from blog-page (basic info only)
 * @param {string} categorySlug - Category slug to find
 * @returns {Promise<Object|null>} Category data (title, description, image)
 */
export async function getBlogCategoryData(categorySlug) {
  if (!categorySlug) {
    console.warn('⚠️ [getBlogCategoryData] No categorySlug provided');
    return null;
  }

  try {
    console.log(`📝 [getBlogCategoryData] Fetching category data for: ${categorySlug}`);
    
    // Simple populate for categories with image only
    const data = await fetchAPI('/blog-page?populate[categories][populate]=image');
    
    if (!data || !data.data) {
      console.warn('⚠️ [getBlogCategoryData] No blog page data found');
      return null;
    }
    
    const pageData = data.data.attributes || data.data;
    const categories = pageData.categories || [];
    
    console.log(`📝 [getBlogCategoryData] Found ${categories.length} categories in blog-page`);
    
    // Find the matching category
    const category = categories.find(cat => cat.categorySlug === categorySlug);
    
    if (!category) {
      console.log(`📝 [getBlogCategoryData] No category data found for: ${categorySlug}`);
      return null;
    }
    
    console.log(`📝 [getBlogCategoryData] Found category:`, category.title);
    console.log(`📝 [getBlogCategoryData] Category image object:`, category.image);
    
    const image = category.image ? getStrapiImageData(category.image) : null;
    const categoryName = formatCategorySlug(category.categorySlug);
    
    console.log(`📝 [getBlogCategoryData] Processed image:`, image);
    
    const categoryData = {
      categorySlug: category.categorySlug,
      categoryName: categoryName,
      title: category.title,
      description: category.description,
      image: image,
      order: category.order || 0
    };
    
    console.log(`✅ [getBlogCategoryData] Category data fetched for: ${categorySlug}`);
    return categoryData;
  } catch (error) {
    console.error(`❌ [getBlogCategoryData] Error fetching category data for ${categorySlug}:`, error);
    return null;
  }
}

/**
 * Get category SEO data from blog-page
 * @param {string} categorySlug - Category slug to find
 * @returns {Promise<Object|null>} SEO data for the category
 */
export async function getBlogCategorySEO(categorySlug) {
  if (!categorySlug) {
    console.warn('⚠️ [getBlogCategorySEO] No categorySlug provided');
    return null;
  }

  try {
    console.log(`📝 [getBlogCategorySEO] Fetching SEO data for: ${categorySlug}`);
    
    // Separate API call for SEO data
    const data = await fetchAPI('/blog-page?populate[categories][populate][seo][populate]=metaImage');
    
    if (!data || !data.data) {
      console.warn('⚠️ [getBlogCategorySEO] No blog page data found');
      return null;
    }
    
    const pageData = data.data.attributes || data.data;
    const categories = pageData.categories || [];
    
    // Find the matching category
    const category = categories.find(cat => cat.categorySlug === categorySlug);
    
    if (!category || !category.seo) {
      console.log(`📝 [getBlogCategorySEO] No SEO data found for: ${categorySlug}`);
      return null;
    }
    
    const seoData = category.seo;
    const metaImageData = getOptimizedSEOImage(seoData.metaImage);
    
    console.log(`✅ [getBlogCategorySEO] SEO data fetched for: ${categorySlug}`);
    
    return {
      metaTitle: seoData.metaTitle || null,
      metaDescription: seoData.metaDescription || null,
      keywords: seoData.keywords || null,
      canonicalURL: seoData.canonicalURL || null,
      metaImage: metaImageData.url || null,
      metaImageAlt: metaImageData.alt || null,
      metaImageWidth: metaImageData.width || null,
      metaImageHeight: metaImageData.height || null
    };
  } catch (error) {
    console.error(`❌ [getBlogCategorySEO] Error fetching SEO for ${categorySlug}:`, error);
    return null;
  }
}

/**
 * Fetch SEO data for blog page
 * @returns {Promise<Object|null>} SEO data with metaImage
 */
export async function getBlogPageSEO() {
  try {
    console.log('📝 [getBlogPageSEO] Fetching SEO data for blog page...');
    
    const data = await fetchAPI('/blog-page?populate[seo][populate]=metaImage');
    
    if (!data || !data.data) {
      console.warn('⚠️ [getBlogPageSEO] No blog page data found');
      return null;
    }
    
    const pageData = data.data.attributes || data.data;
    const seoData = pageData.seo;
    
    if (!seoData) {
      console.log('📝 [getBlogPageSEO] No SEO component found for blog page');
      return null;
    }

    // Extract meta image data with Cloudflare Images optimization
    const metaImageData = getOptimizedSEOImage(seoData.metaImage);
    
    console.log('✅ [getBlogPageSEO] SEO data fetched for blog page');
    
    return {
      metaTitle: seoData.metaTitle || null,
      metaDescription: seoData.metaDescription || null,
      keywords: seoData.keywords || null,
      canonicalURL: seoData.canonicalURL || null,
      metaImage: metaImageData.url || null,
      metaImageAlt: metaImageData.alt || null,
      metaImageWidth: metaImageData.width || null,
      metaImageHeight: metaImageData.height || null
    };
  } catch (error) {
    console.error('❌ [getBlogPageSEO] Error fetching SEO for blog page:', error);
    return null;
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
    const response = await fetch(`${getStrapiUrl()}/api/${endpoint}?populate=seo.metaImage`);
    
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
    const metaImageData = getOptimizedSEOImage(seoData.metaImage);
    
    if (metaImageData.url) {
      console.log(`📸 ${endpoint} meta image URL (optimized):`, metaImageData.url);
    }

    return {
      metaTitle: seoData.metaTitle || null,
      metaDescription: seoData.metaDescription || null,
      metaImage: metaImageData.url,
      metaImageAlt: metaImageData.alt,
      metaImageWidth: metaImageData.width,
      metaImageHeight: metaImageData.height,
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
          fileUrl = `${getStrapiUrl()}${fileUrl}`;
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
 * ====================================
 * FORMS
 * ====================================
 */

/**
 * Fetch all forms from Strapi
 * @param {number} page - Page number for pagination
 * @param {number} pageSize - Number of items per page
 * @returns {Promise<Array>} Array of forms
 */
export async function getForms(page = 1, pageSize = 25) {
  try {
    const data = await fetchAPI(
      `/forms?pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=createdAt:desc&filters[displayOnArchive][$eq]=true`
    );
    
    if (!data || !data.data) {
      console.log('📝 No forms found');
      return [];
    }

    console.log(`📝 Forms fetched: ${data.data.length} items`);

    return data.data.map(item => {
      const form = item.attributes || item;

      // Generate slug from title if not present
      const slug = form.slug || 
                   form.title?.toLowerCase()
                     .replace(/[^a-z0-9]+/g, '-')
                     .replace(/^-|-$/g, '') || 
                   item.documentId || 
                   item.id;

      return {
        id: item.id,
        documentId: item.documentId || item.id,
        title: form.title || 'Untitled Form',
        slug: slug,
        excerpt: form.excerpt || '',
        description: form.description || '',
        createdAt: form.createdAt || item.createdAt || new Date().toISOString(),
        publishedAt: form.publishedAt || item.publishedAt || null
      };
    });

  } catch (error) {
    console.error('❌ Error fetching forms:', error);
    return [];
  }
}

/**
 * Fetch Forms Page data from Strapi
 * @returns {Promise<Object>} Forms page data
 */
export async function getFormsPage() {
  try {
    const data = await fetchAPI('/forms-page?populate=*');
    
    if (!data || !data.data) {
      console.log('📝 No forms page data found');
      return null;
    }

    const pageData = data.data.attributes || data.data;
    console.log('📝 Forms page data fetched successfully');

    return {
      hero: {
        title: pageData.heroTitle || 'Forms',
        subtitle: pageData.heroSubtitle || 'Get in touch with us using one of our contact forms below.',
        kicker: pageData.heroKicker || 'GET IN TOUCH',
        backgroundImage: pageData.heroBackgroundImage ? getStrapiImageData(pageData.heroBackgroundImage) : null
      },
      meta: {
        title: pageData.metaTitle || 'Forms - Active Away',
        description: pageData.metaDescription || 'Contact Active Away using our forms.'
      }
    };

  } catch (error) {
    console.error('Error fetching forms page data:', error);
    return null;
  }
}

/**
 * Get Forms Page SEO data
 * @returns {Promise<Object|null>} SEO data
 */
export async function getFormsPageSEO() {
  try {
    console.log('📄 [getFormsPageSEO] Fetching SEO...');
    
    const data = await fetchAPI('/forms-page?populate[seo][populate]=metaImage');
    
    if (!data || !data.data) {
      console.warn('⚠️  [getFormsPageSEO] No page found');
      return null;
    }
    
    const page = data.data.attributes || data.data;
    const seo = page.seo;
    
    if (!seo) {
      console.warn('⚠️  [getFormsPageSEO] No SEO data');
      return null;
    }

    // Extract meta image data with Cloudflare Images optimization
    const metaImageData = getOptimizedSEOImage(seo.metaImage);
    
    if (metaImageData.url) {
      console.log(`📸 Forms page meta image URL (optimized):`, metaImageData.url);
    }
    
    const seoData = {
      metaTitle: seo.metaTitle,
      metaDescription: seo.metaDescription,
      keywords: seo.keywords,
      canonicalURL: seo.canonicalURL,
      metaImage: metaImageData.url,
      metaImageAlt: metaImageData.alt,
      metaImageWidth: metaImageData.width,
      metaImageHeight: metaImageData.height
    };
    
    console.log('✅ [getFormsPageSEO] SEO fetched');
    return seoData;
  } catch (error) {
    console.error('❌ [getFormsPageSEO] Error:', error);
    return null;
  }
}

/**
 * Normalize a form record returned by Strapi
 * @param {Object} item - Raw item from Strapi response
 * @returns {Object|null} Structured form data ready for rendering
 */
function transformFormDetail(item) {
  if (!item) {
    return null;
  }

  const form = item.attributes || item;

  // Parse form fields JSON
  let formFields = [];
  try {
    if (form.formFields) {
      formFields = typeof form.formFields === 'string' 
        ? JSON.parse(form.formFields) 
        : form.formFields;
    }
  } catch (error) {
    console.warn('Error parsing form fields JSON:', error);
  }

  // Extract SEO data
  const seo = form.seo ? {
    metaTitle: form.seo.metaTitle,
    metaDescription: form.seo.metaDescription,
    keywords: form.seo.keywords,
    canonicalURL: form.seo.canonicalURL,
    metaImage: form.seo.metaImage ? getStrapiImageData(form.seo.metaImage) : null,
    metaImageAlt: form.seo.metaImageAlt
  } : null;

  return {
    id: item.id,
    documentId: item.documentId || item.id,
    title: form.title || 'Untitled Form',
    slug: form.slug,
    excerpt: form.excerpt || '',
    description: form.description || '',
    descriptionTitle: form.descriptionTitle || '',
    hero: {
      title: form.heroTitle || form.title || 'Form',
      subtitle: form.heroSubtitle || form.excerpt || '',
      kicker: form.heroKicker || 'GET IN TOUCH',
      backgroundImage: form.heroBackgroundImage ? getStrapiImageData(form.heroBackgroundImage) : null
    },
    formHeading: form.formHeading || '',
    formSubtitle: form.formSubtitle || '',
    formLayout: form.formLayout || 'one-column',
    formFields: formFields,
    formWebhookUrl: form.formWebhookUrl || null,
    showOtherOptions: form.showOtherOptions || false,
    submitButtonConditional: form.submitButtonConditional || false,
    submitButtonConditionalField: form.submitButtonConditionalField || '',
    submitButtonConditionalOperator: form.submitButtonConditionalOperator || '',
    submitButtonConditionalValue: form.submitButtonConditionalValue || '',
    seo: seo,
    createdAt: form.createdAt || item.createdAt,
    publishedAt: form.publishedAt || item.publishedAt
  };
}

/**
 * Fetch a single form by slug
 * @param {string} slug - Form slug
 * @param {Object} [fallbackIdentifiers] - Optional Strapi identifiers
 * @returns {Promise<Object|null>} Form data with all fields
 */
export async function getFormBySlug(slug, fallbackIdentifiers) {
  if (!slug) {
    console.warn('No slug provided to getFormBySlug');
    return null;
  }

  try {
    const data = await fetchAPI(
      `/forms?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`
    );
    
    if (!data || !data.data || data.data.length === 0) {
      console.log(`📝 No form found with slug: ${slug}`);
      return null;
    }

    const item = data.data[0];
    const transformed = transformFormDetail(item);
    if (transformed) {
      console.log(`📝 Form fetched: ${transformed.title}`);
    }
    return transformed;

  } catch (error) {
    console.error(`❌ Error fetching form by slug (${slug}):`, error);
    return null;
  }
}

/**
 * SEPARATE API CALL: Fetch SEO data with metaImage for form
 * @param {string} slug - Form slug
 * @returns {Promise<Object|null>} SEO data object or null
 */
export async function getFormSEO(slug) {
  if (!slug) {
    console.warn('No slug provided to getFormSEO');
    return null;
  }

  try {
    const data = await fetchAPI(
      `/forms?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=seo.metaImage`
    );
    
    if (data && data.data && data.data.length > 0) {
      const item = data.data[0];
      const form = item.attributes || item;
      
      if (form.seo) {
        const seo = form.seo;
        const metaImageData = seo.metaImage ? getStrapiImageData(seo.metaImage) : null;
        
        const seoData = {
          metaTitle: seo.metaTitle || null,
          metaDescription: seo.metaDescription || null,
          metaImage: metaImageData?.url || null,
          metaImageAlt: metaImageData?.alt || null,
          keywords: seo.keywords || null,
          canonicalURL: seo.canonicalURL || null
        };
        
        console.log(`📄 SEO data fetched for form ${slug}:`, {
          hasMetaImage: !!seoData.metaImage,
          metaTitle: seoData.metaTitle
        });
        
        return seoData;
      }
    }
    
    return null;
  } catch (error) {
    console.error(`❌ Error fetching SEO data for form (${slug}):`, error);
    return null;
  }
}

/**
 * ====================================
 * VENUES
 * ====================================
 */

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
 * Generic function to fetch archive page content from Strapi
 * @param {string} pageSlug - The page slug (e.g., 'tennis-holiday-page')
 * @param {string} defaultTitle - Default title if not found
 * @param {string} defaultSubtitle - Default subtitle if not found
 * @param {string} defaultKicker - Default kicker if not found
 * @returns {Promise<Object|null>} Page content or null
 */
async function getArchivePage(pageSlug, defaultTitle, defaultSubtitle, defaultKicker) {
  try {
    const data = await fetchAPI(`/${pageSlug}?populate=*`);
    
    if (!data || !data.data) {
      console.log(`📍 No ${pageSlug} data found`);
      return null;
    }

    const pageData = data.data.attributes || data.data;
    console.log(`📄 ${pageSlug} data fetched successfully`);

    // Process SEO data
    let seoData = null;
    if (pageData.seo) {
      const seo = pageData.seo;
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
      hero: {
        title: pageData.heroTitle || defaultTitle,
        subtitle: pageData.heroSubtitle || defaultSubtitle,
        kicker: pageData.heroKicker || defaultKicker,
        backgroundImage: pageData.heroBackgroundImage ? getStrapiImageData(pageData.heroBackgroundImage) : null
      },
      seo: seoData
    };

  } catch (error) {
    console.error(`Error fetching ${pageSlug} data:`, error);
    return null;
  }
}

// Tennis Holiday Page
export async function getTennisHolidayPage() {
  return await getArchivePage(
    'tennis-holiday-page',
    'Discover Our Tennis Holidays',
    'Join us for unforgettable tennis holidays at stunning destinations worldwide. Expert coaching, beautiful resorts, and incredible experiences await.',
    'TENNIS HOLIDAYS'
  );
}

// Tennis Clinic Page
export async function getTennisClinicPage() {
  return await getArchivePage(
    'tennis-clinic-page',
    'Discover Our Tennis Clinics',
    'Improve your game with expert coaching at our tennis clinics. Perfect for players of all levels looking to develop their skills in prestigious locations.',
    'TENNIS CLINICS'
  );
}

// Junior Tennis Camp Page
export async function getJuniorCampPage() {
  return await getArchivePage(
    'junior-camp-page',
    'Discover Our Junior Tennis Camps',
    'Exciting junior tennis camps designed to develop young players\' skills while making lasting friendships. Expert coaching in inspiring locations.',
    'JUNIOR TENNIS CAMPS'
  );
}

// School Tennis Tour Page
export async function getSchoolTourPage() {
  return await getArchivePage(
    'school-tour-page',
    'Discover Our School Tennis Tours',
    'Unforgettable school tennis tours combining expert coaching with superb destinations. Perfect for schools looking to inspire their students.',
    'SCHOOL TENNIS TOURS'
  );
}

// Padel Holiday Page
export async function getPadelHolidayPage() {
  return await getArchivePage(
    'padel-holiday-page',
    'Discover Our Padel Holidays',
    'Join us for unforgettable padel holidays at stunning destinations worldwide. Expert coaching, beautiful resorts, and incredible experiences await.',
    'PADEL HOLIDAYS'
  );
}

// Welcomepacks Page
export async function getWelcomepacksPage() {
  return await getArchivePage(
    'welcomepacks-page',
    'Itineraries',
    'Download your event itineraries here (subject to change)',
    'BOOKING'
  );
}

// Welcomepacks Page SEO
export async function getWelcomepacksPageSEO() {
  try {
    const data = await fetchAPI('/welcomepacks-page?populate[seo][populate]=*');
    
    if (!data || !data.data) {
      console.log('📍 No welcomepacks SEO data found');
      return null;
    }

    const pageData = data.data.attributes || data.data;
    
    if (pageData.seo) {
      const seo = pageData.seo;
      const metaImageData = seo.metaImage ? getStrapiImageData(seo.metaImage) : null;
      
      return {
        metaTitle: seo.metaTitle || null,
        metaDescription: seo.metaDescription || null,
        metaImage: metaImageData?.url || null,
        metaImageAlt: metaImageData?.alt || null,
        metaImageWidth: metaImageData?.width || null,
        metaImageHeight: metaImageData?.height || null,
        keywords: seo.keywords || null,
        canonicalURL: seo.canonicalURL || null
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching welcomepacks SEO data:', error);
    return null;
  }
}

// Pickleball Holiday Page
export async function getPickleballHolidayPage() {
  return await getArchivePage(
    'pickleball-holiday-page',
    'Discover Our Pickleball Holidays',
    'Join us for unforgettable pickleball holidays at stunning destinations worldwide. Expert coaching, beautiful resorts, and incredible experiences await.',
    'PICKLEBALL HOLIDAYS'
  );
}

// Ski Holiday Page
export async function getSkiHolidayPage() {
  return await getArchivePage(
    'ski-holiday-page',
    'Discover Our Ski Holidays',
    'Join us for unforgettable ski holidays at stunning destinations worldwide. Expert guidance, beautiful resorts, and incredible mountain experiences await.',
    'SKI HOLIDAYS'
  );
}

// Play & Watch Page
export async function getPlayAndWatchPage() {
  return await getArchivePage(
    'play-and-watch-page',
    'Discover Our Play & Watch Events',
    'Experience the thrill of world-class tennis with our exclusive play & watch events. Combine playing tennis with watching the pros at prestigious tournaments.',
    'PLAY & WATCH'
  );
}

// Group Organiser Page
export async function getGroupOrganiserPage() {
  return await getArchivePage(
    'group-organiser-page',
    'Discover Our Group Organisers',
    'Browse our group organisers who partner with us to offer exceptional racket experiences.',
    'GROUP ORGANISERS'
  );
}

// Tennis Academy Page
export async function getTennisAcademyPage() {
  return await getArchivePage(
    'tennis-academy-page',
    'Discover Our Tennis Academies',
    'We select some of the best hotels around the world to offer the Active Away Tennis Academy. Offering Coaching to all ages and abilities, you can be sure of an incredible Tennis Experience at these locations.',
    'TENNIS ACADEMIES'
  );
}

// Events Page
export async function getEventsPage() {
  return await getArchivePage(
    'events-page',
    'Browse All Events',
    'Discover all our upcoming tennis, padel, pickleball, and ski events. Filter by type, location, price, and dates to find your perfect experience.',
    'EVENTS'
  );
}

// Video Archive Page
export async function getVideoArchivePage() {
  return await getArchivePage(
    'video-archive-page',
    'Videos',
    'Watch our collection of tennis, padel, and sporting videos. Learn techniques, get inspired, and see what Active Away is all about.',
    'VIDEOS'
  );
}

/**
 * Fetch all videos from Strapi
 * @returns {Promise<Object>} Object with videos array and metadata
 */
export async function getAllVideos() {
  try {
    console.log('🎥 [getAllVideos] Fetching videos...');
    
    // Fetch all videos where displayOnFrontEnd is true, sorted by ordering
    const data = await fetchAPI(
      '/videos?filters[displayOnFrontEnd][$eq]=true&sort=ordering:asc&pagination[pageSize]=100'
    );
    
    if (!data || !data.data || data.data.length === 0) {
      console.log('🎥 [getAllVideos] No videos found');
      return {
        videos: [],
        metadata: {
          total: 0,
          videoCategories: []
        }
      };
    }
    
    // Process videos
    const videos = data.data.map(item => {
      const video = item.attributes || item;
      
      return {
        id: item.id,
        title: video.title || '',
        videoDescription: video.videoDescription || '',
        youtubeUrl: video.youtubeUrl || '',
        videoCategory: video.videoCategory || '',
        ordering: video.ordering || 50
      };
    });
    
    // Extract unique video categories
    const videoCategories = [...new Set(videos.map(v => v.videoCategory).filter(Boolean))].sort();
    
    console.log(`🎥 [getAllVideos] Fetched ${videos.length} videos`);
    console.log(`📊 Video categories: ${videoCategories.join(', ')}`);
    
    return {
      videos,
      metadata: {
        total: videos.length,
        videoCategories
      }
    };
  } catch (error) {
    console.error('❌ [getAllVideos] Error fetching videos:', error);
    return {
      videos: [],
      metadata: {
        total: 0,
        videoCategories: []
      }
    };
  }
}

/**
 * Fetch Terms and Conditions Page from Strapi
 * @returns {Promise<Object|null>} Terms page data
 */
export async function getTermsPage() {
  try {
    const data = await fetchAPI('/terms-page?populate=*');
    
    if (!data || !data.data) {
      console.log('📄 No terms page data found');
      return null;
    }

    const pageData = data.data.attributes || data.data;
    console.log('📄 Terms page data fetched successfully');

    // Process SEO data
    let seoData = null;
    if (pageData.seo) {
      const seo = pageData.seo;
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
      slug: pageData.slug || 'booking-terms-conditions',
      heroBackgroundImage: pageData.heroBackgroundImage ? getStrapiImageData(pageData.heroBackgroundImage) : null,
      pageTitle: pageData.pageTitle || 'Booking Terms & Conditions',
      introText: pageData.introText || '',
      generalTerms: pageData.generalTerms || '',
      holidaysTerms: pageData.holidaysTerms || '',
      ukClinicsTerms: pageData.ukClinicsTerms || '',
      juniorCampsTerms: pageData.juniorCampsTerms || '',
      schoolToursTerms: pageData.schoolToursTerms || '',
      creditNotesTerms: pageData.creditNotesTerms || '',
      touristTaxTerms: pageData.touristTaxTerms || '',
      academyTerms: pageData.academyTerms || '',
      lastUpdated: pageData.lastUpdated || null,
      seo: seoData
    };

  } catch (error) {
    console.error('Error fetching terms page data:', error);
    return null;
  }
}

/**
 * Fetch Privacy Policy Page data from Strapi
 * @returns {Promise<Object>} Privacy policy page data
 */
export async function getPrivacyPolicyPage() {
  try {
    const data = await fetchAPI('/privacy-policy-page?populate[sections][populate]=*&populate[heroBackgroundImage][populate]=*&populate[seo][populate]=*');
    
    if (!data?.data) {
      console.log('📄 No privacy policy page data found');
      return null;
    }
    
    const page = data.data.attributes || data.data;
    console.log('📄 Privacy policy page data fetched successfully');
    
    // Process SEO data
    let seoData = null;
    if (page.seo) {
      const seo = page.seo;
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
      pageTitle: page.pageTitle || 'Privacy Policy',
      introText: page.introText || '',
      lastUpdated: page.lastUpdated || null,
      heroBackgroundImage: page.heroBackgroundImage ? getStrapiImageData(page.heroBackgroundImage) : null,
      sections: (page.sections || []).map(section => ({
        sectionTitle: section.sectionTitle || '',
        sectionSlug: section.sectionSlug || '',
        content: section.content || '',
        showForm: section.showForm || false,
        formFields: section.formFields || null,
        formWebhookUrl: section.formWebhookUrl || null,
        formSuccessMessage: section.formSuccessMessage || null
      })),
      seo: seoData
    };
  } catch (error) {
    console.error('Error fetching privacy policy page:', error);
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
    headingText: venue.headingText || '',
    country: venue.country || '',
    holidayType: holidayType,
    productType: venue.productType || holidayType.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' '),
    price: price,
    priceText: price ? `from £${price}pp` : null,
    dateFrom: venue.dateFrom || null,
    dateUntil: venue.dateUntil || null,
    uniqueValue: venue.uniqueValue || null,
    tennisCourtSurface: venue.tennisCourtSurface || null,
    groupOrganiserName: venue.groupOrganiserName || null,
    groupOrganiserProduct: venue.groupOrganiserProduct || null,
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
 * SCHOOL TENNIS TOUR FUNCTIONS
 * These follow the same pattern as tennis holidays but query the school-tennis-tours endpoint
 */

/**
 * SEPARATE API CALL: Fetch nested data for school tennis tour (rooms.roomGallery, tripImages)
 * @param {string} slug - School tennis tour slug
 * @returns {Promise<Object|null>} Object with rooms and tripImages, or null
 */
export async function getSchoolTennisTourNestedData(slug) {
  if (!slug) {
    console.warn('No slug provided to getSchoolTennisTourNestedData');
    return null;
  }

  try {
    const data = await fetchAPI(
      `/school-tennis-tours?filters[slug][$eq]=${encodeURIComponent(slug)}&populate[rooms][populate]=*&populate=tripImages`
    );
    
    if (data && data.data && data.data.length > 0) {
      const item = data.data[0];
      const tour = item.attributes || item;
      
      const rooms = [];
      const roomsSource = normalizeComponentArray(tour.rooms);
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
      
      const tripImages = tour.tripImages ? getStrapiImagesData(tour.tripImages) : [];
      
      console.log(`🏨 Nested data fetched for school tour ${slug}: ${rooms.length} rooms, ${tripImages.length} trip images`);
      
      return {
        rooms,
        tripImages
      };
    }
    
    return null;
  } catch (error) {
    console.error(`❌ Error fetching nested data for school tennis tour (${slug}):`, error);
    return null;
  }
}

/**
 * SEPARATE API CALL: Fetch SEO data with metaImage for school tennis tour
 * @param {string} slug - School tennis tour slug
 * @returns {Promise<Object|null>} SEO data object or null
 */
export async function getSchoolTennisTourSEO(slug) {
  if (!slug) {
    console.warn('No slug provided to getSchoolTennisTourSEO');
    return null;
  }

  try {
    const data = await fetchAPI(
      `/school-tennis-tours?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=seo.metaImage`
    );
    
    if (data && data.data && data.data.length > 0) {
      const item = data.data[0];
      const tour = item.attributes || item;
      
      if (tour.seo) {
        const seo = tour.seo;
        const metaImageData = seo.metaImage ? getStrapiImageData(seo.metaImage) : null;
        
        const seoData = {
          metaTitle: seo.metaTitle || null,
          metaDescription: seo.metaDescription || null,
          metaImage: metaImageData?.url || null,
          metaImageAlt: metaImageData?.alt || null,
          keywords: seo.keywords || null,
          canonicalURL: seo.canonicalURL || null
        };
        
        console.log(`📄 SEO data fetched for school tour ${slug}:`, {
          hasMetaImage: !!seoData.metaImage,
          metaTitle: seoData.metaTitle
        });
        
        return seoData;
      }
    }
    
    return null;
  } catch (error) {
    console.error(`❌ Error fetching SEO data for school tennis tour (${slug}):`, error);
    return null;
  }
}

/**
 * Fallback resolver for school tennis tours
 * @param {Object} identifiers - Object with documentId and/or id
 * @returns {Promise<Object|null>} School tennis tour data or null
 */
async function resolveSchoolTennisTourFallback(identifiers = {}) {
  const { documentId, id } = identifiers || {};

  if (documentId) {
    console.log(`🎒 Attempting fallback lookup by documentId: ${documentId}`);
    const byDocumentId = await getSchoolTennisTourByDocumentId(documentId);
    if (byDocumentId) {
      return byDocumentId;
    }
  }

  if (id !== undefined && id !== null) {
    const numericId = typeof id === 'string' ? Number(id) : id;
    if (!Number.isNaN(numericId)) {
      console.log(`🎒 Attempting fallback lookup by id: ${numericId}`);
      const byId = await getSchoolTennisTourById(numericId);
      if (byId) {
        return byId;
      }
    }
  }

  console.warn('⚠️ All school tennis tour fallback lookups failed');
  return null;
}

/**
 * Fetch a single school tennis tour by slug with all content
 * @param {string} slug - School tennis tour slug
 * @param {Object} fallbackIdentifiers - Optional fallback identifiers {documentId, id}
 * @returns {Promise<Object|null>} Complete school tennis tour data
 */
export async function getSchoolTennisTourBySlug(slug, fallbackIdentifiers) {
  const identifiers = typeof fallbackIdentifiers === 'object' && fallbackIdentifiers !== null
    ? fallbackIdentifiers
    : { id: fallbackIdentifiers };

  if (!slug) {
    console.warn('No slug provided to getSchoolTennisTourBySlug');
    return await resolveSchoolTennisTourFallback(identifiers);
  }

  try {
    const data = await fetchAPI(
      `/school-tennis-tours?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`
    );
    
    if (data && data.data && data.data.length > 0) {
      const transformed = transformTennisHolidayDetail(data.data[0]);
      if (transformed) {
        console.log(`🎒 School tennis tour fetched (slug=${slug}): ${transformed.title}`);
        console.log(`📸 Gallery images found: ${transformed.mainGallery?.length || 0}`);
      }
      return transformed;
    }

  } catch (error) {
    console.error(`❌ Error fetching school tennis tour by slug (${slug}):`, error);
  }

  return await resolveSchoolTennisTourFallback(identifiers);
}

/**
 * Fetch a single school tennis tour by documentId
 * @param {string} documentId - School tennis tour documentId
 * @returns {Promise<Object|null>} Complete school tennis tour data
 */
export async function getSchoolTennisTourByDocumentId(documentId) {
  if (!documentId) {
    return null;
  }

  try {
    const data = await fetchAPI(`/school-tennis-tours?filters[documentId][$eq]=${encodeURIComponent(documentId)}&populate=*`);
    
    if (data && data.data && data.data.length > 0) {
      return transformTennisHolidayDetail(data.data[0]);
    }
    return null;
  } catch (error) {
    console.error(`❌ Error fetching school tennis tour by documentId (${documentId}):`, error);
    return null;
  }
}

/**
 * Fetch a single school tennis tour by numeric ID
 * @param {number} id - School tennis tour ID
 * @returns {Promise<Object|null>} Complete school tennis tour data
 */
export async function getSchoolTennisTourById(identifier) {
  const numericId = typeof identifier === 'string' ? Number(identifier) : identifier;
  
  if (Number.isNaN(numericId) || numericId === null || numericId === undefined) {
    console.warn('Invalid ID provided to getSchoolTennisTourById:', identifier);
    return null;
  }

  try {
    const data = await fetchAPI(`/school-tennis-tours?filters[id][$eq]=${numericId}&populate=*`);
    
    if (data && data.data && data.data.length > 0) {
      return transformTennisHolidayDetail(data.data[0]);
    }
    return null;
  } catch (error) {
    console.error(`❌ Error fetching school tennis tour by ID (${numericId}):`, error);
    return null;
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
 * SKI HOLIDAY FUNCTIONS
 * These follow the same pattern as tennis holidays but query the ski-holidays endpoint
 */

/**
 * SEPARATE API CALL: Fetch nested data for ski holiday (rooms.roomGallery, tripImages)
 * @param {string} slug - Ski holiday slug
 * @returns {Promise<Object|null>} Object with rooms and tripImages, or null
 */
export async function getSkiHolidayNestedData(slug) {
  if (!slug) {
    console.warn('No slug provided to getSkiHolidayNestedData');
    return null;
  }

  try {
    const data = await fetchAPI(
      `/ski-holidays?filters[slug][$eq]=${encodeURIComponent(slug)}&populate[rooms][populate]=*&populate=tripImages`
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
      
      console.log(`🏨 Nested data fetched for ski ${slug}: ${rooms.length} rooms, ${tripImages.length} trip images`);
      
      return {
        rooms,
        tripImages
      };
    }
    
    return null;
  } catch (error) {
    console.error(`❌ Error fetching nested data for ski holiday (${slug}):`, error);
    return null;
  }
}

/**
 * SEPARATE API CALL: Fetch SEO data with metaImage for ski holiday
 * @param {string} slug - Ski holiday slug
 * @returns {Promise<Object|null>} SEO data object or null
 */
export async function getSkiHolidaySEO(slug) {
  if (!slug) {
    console.warn('No slug provided to getSkiHolidaySEO');
    return null;
  }

  try {
    const data = await fetchAPI(
      `/ski-holidays?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=seo.metaImage`
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
        
        console.log(`📄 SEO data fetched for ski ${slug}:`, {
          hasMetaImage: !!seoData.metaImage,
          metaTitle: seoData.metaTitle
        });
        
        return seoData;
      }
    }
    
    return null;
  } catch (error) {
    console.error(`❌ Error fetching SEO data for ski holiday (${slug}):`, error);
    return null;
  }
}

/**
 * Fallback resolver for ski holidays
 * @param {Object} identifiers - Object with documentId and/or id
 * @returns {Promise<Object|null>} Ski holiday data or null
 */
async function resolveSkiHolidayFallback(identifiers = {}) {
  const { documentId, id } = identifiers || {};

  if (documentId) {
    console.log(`⛷️ Attempting fallback lookup by documentId: ${documentId}`);
    const byDocumentId = await getSkiHolidayByDocumentId(documentId);
    if (byDocumentId) {
      return byDocumentId;
    }
  }

  if (id !== undefined && id !== null) {
    const numericId = typeof id === 'string' ? Number(id) : id;
    if (!Number.isNaN(numericId)) {
      console.log(`⛷️ Attempting fallback lookup by id: ${numericId}`);
      const byId = await getSkiHolidayById(numericId);
      if (byId) {
        return byId;
      }
    }
  }

  console.warn('⚠️ All ski holiday fallback lookups failed');
  return null;
}

/**
 * Fetch a single ski holiday by slug with all content
 * @param {string} slug - Ski holiday slug
 * @param {Object} fallbackIdentifiers - Optional fallback identifiers {documentId, id}
 * @returns {Promise<Object|null>} Complete ski holiday data
 */
export async function getSkiHolidayBySlug(slug, fallbackIdentifiers) {
  const identifiers = typeof fallbackIdentifiers === 'object' && fallbackIdentifiers !== null
    ? fallbackIdentifiers
    : { id: fallbackIdentifiers };

  if (!slug) {
    console.warn('No slug provided to getSkiHolidayBySlug');
    return await resolveSkiHolidayFallback(identifiers);
  }

  try {
    const data = await fetchAPI(
      `/ski-holidays?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`
    );
    
    if (data && data.data && data.data.length > 0) {
      const transformed = transformTennisHolidayDetail(data.data[0]);
      if (transformed) {
        console.log(`⛷️ Ski holiday fetched (slug=${slug}): ${transformed.title}`);
        console.log(`📸 Gallery images found: ${transformed.mainGallery?.length || 0}`);
      }
      return transformed;
    }

  } catch (error) {
    console.error(`❌ Error fetching ski holiday by slug (${slug}):`, error);
  }

  return await resolveSkiHolidayFallback(identifiers);
}

/**
 * Fetch a single ski holiday by documentId
 * @param {string} documentId - Ski holiday documentId
 * @returns {Promise<Object|null>} Complete ski holiday data
 */
export async function getSkiHolidayByDocumentId(documentId) {
  if (!documentId) {
    return null;
  }

  try {
    const data = await fetchAPI(`/ski-holidays?filters[documentId][$eq]=${encodeURIComponent(documentId)}&populate=*`);
    
    if (data && data.data && data.data.length > 0) {
      return transformTennisHolidayDetail(data.data[0]);
    }
    return null;
  } catch (error) {
    console.error(`❌ Error fetching ski holiday by documentId (${documentId}):`, error);
    return null;
  }
}

/**
 * Fetch a single ski holiday by numeric ID
 * @param {number} id - Ski holiday ID
 * @returns {Promise<Object|null>} Complete ski holiday data
 */
export async function getSkiHolidayById(identifier) {
  const numericId = typeof identifier === 'string' ? Number(identifier) : identifier;
  
  if (Number.isNaN(numericId) || numericId === null || numericId === undefined) {
    console.warn('Invalid ID provided to getSkiHolidayById:', identifier);
    return null;
  }

  try {
    const data = await fetchAPI(`/ski-holidays?filters[id][$eq]=${numericId}&populate=*`);
    
    if (data && data.data && data.data.length > 0) {
      return transformTennisHolidayDetail(data.data[0]);
    }
    return null;
  } catch (error) {
    console.error(`❌ Error fetching ski holiday by ID (${numericId}):`, error);
    return null;
  }
}

/**
 * TENNIS ACADEMY FUNCTIONS
 * Tennis academies have a different structure than holidays with unique fields
 */

/**
 * Transform tennis academy detail data
 * @param {Object} item - Raw Strapi tennis academy item
 * @returns {Object|null} Transformed tennis academy data
 */
function transformTennisAcademyDetail(item) {
  if (!item) {
    return null;
  }

  const academy = item.attributes || item;

  // Get header image
  const headerImage = academy.headerImage ? getStrapiImageData(academy.headerImage) : null;
  
  // Get gallery images (uses 'gallery' field instead of 'mainGallery')
  const gallery = academy.gallery ? getStrapiImagesData(academy.gallery) : [];
  
  // Get SEO data if available
  let seoData = null;
  if (academy.seo) {
    const seo = academy.seo;
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

  // Process quick links
  const quickLinks = [];
  const quickLinksSource = normalizeComponentArray(academy.quickLinks);
  quickLinksSource.forEach(link => {
    const linkImage = link.quickLinkImage ? getStrapiImageData(link.quickLinkImage) : null;
    
    quickLinks.push({
      id: link.id,
      image: linkImage?.url || null,
      imageAlt: linkImage?.alt || link.quickLinkTitle || '',
      title: link.quickLinkTitle || '',
      description: link.quickLinkDescription || '',
      buttonText: link.quickLinkButtonText || '',
      url: link.quickLinkURL || ''
    });
  });

  // Process coach information
  let coach = null;
  if (academy.coach) {
    const coachData = academy.coach;
    const coachImage = coachData.coachImage ? getStrapiImageData(coachData.coachImage) : null;
    
    coach = {
      image: coachImage?.url || null,
      imageAlt: coachImage?.alt || `${coachData.coachFirstName} ${coachData.coachLastName}`,
      firstName: coachData.coachFirstName || '',
      lastName: coachData.coachLastName || '',
      description: coachData.coachDescription || '',
      whatsappURL: coachData.coachWhatsAppURL || ''
    };
  }

  // Process useful resources
  const usefulResources = [];
  const resourcesSource = normalizeComponentArray(academy.usefulResources);
  resourcesSource.forEach(resource => {
    usefulResources.push({
      id: resource.id,
      title: resource.resourceTitle || '',
      text: resource.resourceText || '',
      url: resource.resourceURL || ''
    });
  });

  // Process hosted experiences
  const hostedExperiences = [];
  const experiencesSource = normalizeComponentArray(academy.hostedExperiences);
  experiencesSource.forEach(experience => {
    const experienceImage = experience.holidayImage ? getStrapiImageData(experience.holidayImage) : null;
    
    hostedExperiences.push({
      id: experience.id,
      title: experience.holidayTitle || '',
      description: experience.holidayDescription || '',
      image: experienceImage?.url || null,
      imageAlt: experienceImage?.alt || experience.holidayTitle || '',
      url: experience.holidayURL || ''
    });
  });

  const slug = academy.slug ||
    (academy.title
      ? academy.title.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
      : `tennis-academy-${item.id}`);

  return {
    id: item.id,
    documentId: item.documentId || item.id,
    wpId: academy.wpId,
    title: academy.title,
    slug: slug,
    excerpt: academy.excerpt || '',
    mainHeader: academy.mainHeader || academy.title,
    headingText: academy.headingText || '',
    belowHeadingText: academy.belowHeadingText || '',
    
    // Images
    headerImage: headerImage,
    gallery: gallery,
    
    // Location info
    venue: academy.venue,
    country: academy.country,
    
    // Key information (uses whyWeLoveVenue fields)
    whyWeLoveVenue1: academy.whyWeLoveVenue1,
    whyWeLoveVenue2: academy.whyWeLoveVenue2,
    whyWeLoveVenue3: academy.whyWeLoveVenue3,
    whyWeLoveVenue4: academy.whyWeLoveVenue4,
    
    // Academy-specific sections
    quickLinks: quickLinks,
    coach: coach,
    usefulResources: usefulResources,
    hostedExperiences: hostedExperiences,
    
    // FAQs
    faqs: academy.faqs || [],
    
    // Meta
    displayOnFrontEnd: academy.displayOnFrontEnd,
    ordering: academy.ordering,
    featured: academy.featured,
    seo: seoData,
    createdAt: academy.createdAt || item.createdAt,
    publishedAt: academy.publishedAt || item.publishedAt
  };
}

/**
 * Fetch Tennis Academies
 * @param {number} page - Page number (1-indexed)
 * @param {number} pageSize - Items per page
 * @returns {Promise<Array>} Array of normalized academy data
 */
export async function getTennisAcademies(page = 1, pageSize = 25) {
  try {
    const data = await fetchAPI(`/tennis-academies?populate=headerImage&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`);
    
    if (!data || !data.data || data.data.length === 0) {
      return [];
    }
    
    return data.data.map(item => normalizeVenueData(item, 'tennis-academy'));
  } catch (error) {
    console.error('❌ Error fetching tennis academies:', error);
    return [];
  }
}

/**
 * SEPARATE API CALL: Fetch tennis academies for "Other Academies" section with full image population
 * @param {number} page - Page number (1-indexed)
 * @param {number} pageSize - Items per page
 * @returns {Promise<Array>} Array of normalized academy data with images
 */
export async function getTennisAcademiesForCards(page = 1, pageSize = 25) {
  try {
    const data = await fetchAPI(`/tennis-academies?populate=headerImage&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`);
    
    if (!data || !data.data || data.data.length === 0) {
      return [];
    }
    
    return data.data.map(item => normalizeVenueData(item, 'tennis-academy'));
  } catch (error) {
    console.error('❌ Error fetching tennis academies for cards:', error);
    return [];
  }
}

/**
 * SEPARATE API CALL: Fetch nested data for tennis academy
 * @param {string} slug - Tennis academy slug
 * @returns {Promise<Object|null>} Object with nested data, or null
 */
export async function getTennisAcademyNestedData(slug) {
  if (!slug) {
    console.warn('No slug provided to getTennisAcademyNestedData');
    return null;
  }

  try {
    const data = await fetchAPI(
      `/tennis-academies?filters[slug][$eq]=${encodeURIComponent(slug)}&populate[quickLinks][populate]=*&populate[hostedExperiences][populate]=*&populate[coach][populate]=*`
    );
    
    if (data && data.data && data.data.length > 0) {
      const item = data.data[0];
      const academy = item.attributes || item;
      
      // Process quick links
      const quickLinks = [];
      const quickLinksSource = normalizeComponentArray(academy.quickLinks);
      quickLinksSource.forEach(link => {
        const linkImage = link.quickLinkImage ? getStrapiImageData(link.quickLinkImage) : null;
        
        quickLinks.push({
          id: link.id,
          image: linkImage?.url || null,
          imageAlt: linkImage?.alt || link.quickLinkTitle || '',
          title: link.quickLinkTitle || '',
          description: link.quickLinkDescription || '',
          buttonText: link.quickLinkButtonText || '',
          url: link.quickLinkURL || ''
        });
      });

      // Process hosted experiences
      const hostedExperiences = [];
      const experiencesSource = normalizeComponentArray(academy.hostedExperiences);
      experiencesSource.forEach(experience => {
        const experienceImage = experience.holidayImage ? getStrapiImageData(experience.holidayImage) : null;
        
        hostedExperiences.push({
          id: experience.id,
          title: experience.holidayTitle || '',
          description: experience.holidayDescription || '',
          image: experienceImage?.url || null,
          imageAlt: experienceImage?.alt || experience.holidayTitle || '',
          url: experience.holidayURL || ''
        });
      });

      // Process coach information
      let coach = null;
      if (academy.coach) {
        const coachData = academy.coach;
        const coachImage = coachData.coachImage ? getStrapiImageData(coachData.coachImage) : null;
        
        coach = {
          image: coachImage?.url || null,
          imageAlt: coachImage?.alt || `${coachData.coachFirstName} ${coachData.coachLastName}`,
          firstName: coachData.coachFirstName || '',
          lastName: coachData.coachLastName || '',
          description: coachData.coachDescription || '',
          whatsappURL: coachData.coachWhatsAppURL || ''
        };
      }
      
      console.log(`🎓 Nested data fetched for academy ${slug}: ${quickLinks.length} quick links, ${hostedExperiences.length} hosted experiences, coach: ${coach ? 'Yes' : 'No'}`);
      
      return {
        quickLinks,
        hostedExperiences,
        coach
      };
    }
    
    return null;
  } catch (error) {
    console.error(`❌ Error fetching nested data for tennis academy (${slug}):`, error);
    return null;
  }
}

/**
 * SEPARATE API CALL: Fetch SEO data with metaImage for tennis academy
 * @param {string} slug - Tennis academy slug
 * @returns {Promise<Object|null>} SEO data object or null
 */
export async function getTennisAcademySEO(slug) {
  if (!slug) {
    console.warn('No slug provided to getTennisAcademySEO');
    return null;
  }

  try {
    const data = await fetchAPI(
      `/tennis-academies?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=seo.metaImage`
    );
    
    if (data && data.data && data.data.length > 0) {
      const item = data.data[0];
      const academy = item.attributes || item;
      
      if (academy.seo) {
        const seo = academy.seo;
        const metaImageData = seo.metaImage ? getStrapiImageData(seo.metaImage) : null;
        
        const seoData = {
          metaTitle: seo.metaTitle || null,
          metaDescription: seo.metaDescription || null,
          metaImage: metaImageData?.url || null,
          metaImageAlt: metaImageData?.alt || null,
          keywords: seo.keywords || null,
          canonicalURL: seo.canonicalURL || null
        };
        
        console.log(`📄 SEO data fetched for academy ${slug}:`, {
          hasMetaImage: !!seoData.metaImage,
          metaTitle: seoData.metaTitle
        });
        
        return seoData;
      }
    }
    
    return null;
  } catch (error) {
    console.error(`❌ Error fetching SEO data for tennis academy (${slug}):`, error);
    return null;
  }
}

/**
 * Fallback resolver for tennis academies
 * @param {Object} identifiers - Object with documentId and/or id
 * @returns {Promise<Object|null>} Tennis academy data or null
 */
async function resolveTennisAcademyFallback(identifiers = {}) {
  const { documentId, id } = identifiers || {};

  if (documentId) {
    console.log(`🎓 Attempting fallback lookup by documentId: ${documentId}`);
    const byDocumentId = await getTennisAcademyByDocumentId(documentId);
    if (byDocumentId) {
      return byDocumentId;
    }
  }

  if (id !== undefined && id !== null) {
    const numericId = typeof id === 'string' ? Number(id) : id;
    if (!Number.isNaN(numericId)) {
      console.log(`🎓 Attempting fallback lookup by id: ${numericId}`);
      const byId = await getTennisAcademyById(numericId);
      if (byId) {
        return byId;
      }
    }
  }

  console.warn('⚠️ All tennis academy fallback lookups failed');
  return null;
}

/**
 * Fetch a single tennis academy by slug with all content
 * @param {string} slug - Tennis academy slug
 * @param {Object} fallbackIdentifiers - Optional fallback identifiers {documentId, id}
 * @returns {Promise<Object|null>} Complete tennis academy data
 */
export async function getTennisAcademyBySlug(slug, fallbackIdentifiers) {
  const identifiers = typeof fallbackIdentifiers === 'object' && fallbackIdentifiers !== null
    ? fallbackIdentifiers
    : { id: fallbackIdentifiers };

  if (!slug) {
    console.warn('No slug provided to getTennisAcademyBySlug');
    return await resolveTennisAcademyFallback(identifiers);
  }

  try {
    const data = await fetchAPI(
      `/tennis-academies?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`
    );
    
    if (data && data.data && data.data.length > 0) {
      const transformed = transformTennisAcademyDetail(data.data[0]);
      if (transformed) {
        console.log(`🎓 Tennis academy fetched (slug=${slug}): ${transformed.title}`);
        console.log(`📸 Gallery images found: ${transformed.gallery?.length || 0}`);
      }
      return transformed;
    }

  } catch (error) {
    console.error(`❌ Error fetching tennis academy by slug (${slug}):`, error);
  }

  return await resolveTennisAcademyFallback(identifiers);
}

/**
 * Fetch a single tennis academy by documentId
 * @param {string} documentId - Tennis academy documentId
 * @returns {Promise<Object|null>} Complete tennis academy data
 */
export async function getTennisAcademyByDocumentId(documentId) {
  if (!documentId) {
    return null;
  }

  try {
    const data = await fetchAPI(`/tennis-academies?filters[documentId][$eq]=${encodeURIComponent(documentId)}&populate=*`);
    
    if (data && data.data && data.data.length > 0) {
      return transformTennisAcademyDetail(data.data[0]);
    }
    return null;
  } catch (error) {
    console.error(`❌ Error fetching tennis academy by documentId (${documentId}):`, error);
    return null;
  }
}

/**
 * Fetch a single tennis academy by numeric ID
 * @param {number} id - Tennis academy ID
 * @returns {Promise<Object|null>} Complete tennis academy data
 */
export async function getTennisAcademyById(identifier) {
  const numericId = typeof identifier === 'string' ? Number(identifier) : identifier;
  
  if (Number.isNaN(numericId) || numericId === null || numericId === undefined) {
    console.warn('Invalid ID provided to getTennisAcademyById:', identifier);
    return null;
  }

  try {
    const data = await fetchAPI(`/tennis-academies?filters[id][$eq]=${numericId}&populate=*`);
    
    if (data && data.data && data.data.length > 0) {
      return transformTennisAcademyDetail(data.data[0]);
    }
    return null;
  } catch (error) {
    console.error(`❌ Error fetching tennis academy by ID (${numericId}):`, error);
    return null;
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
    boardBasisLg: holiday.boardBasisLg || holiday.boardBasis,
    
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
    settingDescription: holiday.settingDescription,
    boardBasis: holiday.boardBasis,
    boardBasisIncluded: holiday.boardBasisIncluded,
    boardBasisInfo: holiday.boardBasisInfo,
    restaurants: holiday.restaurants,
    bars: holiday.bars,
    restaurantInformation: holiday.restaurantInformation,
    barInformation: holiday.barInformation,
    tennisCourts: holiday.tennisCourts,
    tennisCourtsInfo: holiday.tennisCourtsInfo,
    topTips: holiday.topTips,
    gettingThere: holiday.gettingThere,
    theEvent: holiday.theEvent,
    whereWeStay: holiday.whereWeStay,
    howWeGetAround: holiday.howWeGetAround,
    
    // Tennis details
    tennisCourtSurface: holiday.tennisCourtSurface,
    airportTransfer: holiday.airportTransfer,
    destinationAirport: holiday.destinationAirport,
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
    residentialOrNonResidential: holiday.residentialOrNonResidential,
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
 * TENNIS CLINIC FUNCTIONS
 * These follow the same pattern as other holiday types but query the tennis-clinics endpoint
 */

/**
 * SEPARATE API CALL: Fetch nested data for tennis clinic (tripImages)
 * @param {string} slug - Tennis clinic slug
 * @returns {Promise<Object|null>} Object with tripImages, or null
 */
export async function getTennisClinicNestedData(slug) {
  if (!slug) {
    console.warn('No slug provided to getTennisClinicNestedData');
    return null;
  }

  try {
    const data = await fetchAPI(
      `/tennis-clinics?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=tripImages`
    );
    
    if (data && data.data && data.data.length > 0) {
      const item = data.data[0];
      const holiday = item.attributes || item;
      
      const tripImages = holiday.tripImages ? getStrapiImagesData(holiday.tripImages) : [];
      
      console.log(`🎾 Nested data fetched for tennis clinic ${slug}: ${tripImages.length} trip images`);
      
      return {
        tripImages
      };
    }
    
    return null;
  } catch (error) {
    console.error(`❌ Error fetching nested data for tennis clinic (${slug}):`, error);
    return null;
  }
}

/**
 * SEPARATE API CALL: Fetch SEO data with metaImage for tennis clinic
 * @param {string} slug - Tennis clinic slug
 * @returns {Promise<Object|null>} SEO data object or null
 */
export async function getTennisClinicSEO(slug) {
  if (!slug) {
    console.warn('No slug provided to getTennisClinicSEO');
    return null;
  }

  try {
    const data = await fetchAPI(
      `/tennis-clinics?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=seo.metaImage`
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
        
        console.log(`📄 SEO data fetched for tennis clinic ${slug}:`, {
          hasMetaImage: !!seoData.metaImage,
          metaTitle: seoData.metaTitle
        });
        
        return seoData;
      }
    }
    
    return null;
  } catch (error) {
    console.error(`❌ Error fetching SEO data for tennis clinic (${slug}):`, error);
    return null;
  }
}

async function resolveTennisClinicFallback(identifiers = {}) {
  const { documentId, id } = identifiers || {};

  if (documentId) {
    console.log(`🎾 Attempting fallback lookup by documentId: ${documentId}`);
    const byDocumentId = await getTennisClinicByDocumentId(documentId);
    if (byDocumentId) {
      return byDocumentId;
    }
  }

  if (id !== undefined && id !== null) {
    const numericId = typeof id === 'string' ? Number(id) : id;
    if (!Number.isNaN(numericId)) {
      console.log(`🎾 Attempting fallback lookup by id: ${numericId}`);
      const byId = await getTennisClinicById(numericId);
      if (byId) {
        return byId;
      }
    } else {
      console.warn(`⚠️ Provided fallback tennis clinic id is not numeric: ${id}`);
    }
  }

  return null;
}

export async function getTennisClinicBySlug(slug, fallbackIdentifiers) {
  const identifiers = typeof fallbackIdentifiers === 'object' && fallbackIdentifiers !== null
    ? fallbackIdentifiers
    : { id: fallbackIdentifiers };

  if (!slug) {
    console.warn('No slug provided to getTennisClinicBySlug');
    return await resolveTennisClinicFallback(identifiers);
  }

  try {
    const data = await fetchAPI(
      `/tennis-clinics?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`
    );
    
    if (data && data.data && data.data.length > 0) {
      const transformed = transformTennisHolidayDetail(data.data[0]);
      if (transformed) {
        console.log(`🎾 Tennis clinic fetched (slug=${slug}): ${transformed.title}`);
        console.log(`📸 Gallery images found: ${transformed.mainGallery?.length || 0}`);
      }
      return transformed;
    }

  } catch (error) {
    console.error(`❌ Error fetching tennis clinic by slug (${slug}):`, error);
  }

  return await resolveTennisClinicFallback(identifiers);
}

export async function getTennisClinicByDocumentId(documentId) {
  if (!documentId) {
    return null;
  }

  try {
    const data = await fetchAPI(`/tennis-clinics?filters[documentId][$eq]=${encodeURIComponent(documentId)}&populate=*`);
    
    if (data && data.data && data.data.length > 0) {
      return transformTennisHolidayDetail(data.data[0]);
    }
    return null;
  } catch (error) {
    console.error(`❌ Error fetching tennis clinic by documentId (${documentId}):`, error);
    return null;
  }
}

export async function getTennisClinicById(identifier) {
  if (identifier === undefined || identifier === null) {
    return null;
  }

  const numericId = typeof identifier === 'string' ? Number(identifier) : identifier;
  if (Number.isNaN(numericId)) {
    console.warn(`Cannot fetch tennis clinic by id, identifier is not numeric: ${identifier}`);
    return null;
  }

  try {
    const data = await fetchAPI(`/tennis-clinics?filters[id][$eq]=${numericId}&populate=*`);
    
    if (data && data.data && data.data.length > 0) {
      return transformTennisHolidayDetail(data.data[0]);
    }
    return null;
  } catch (error) {
    console.error(`❌ Error fetching tennis clinic by id (${numericId}):`, error);
    return null;
  }
}

/**
 * JUNIOR TENNIS CAMP FUNCTIONS
 * These follow the same pattern as tennis clinics but query the junior-tennis-camps endpoint
 */

/**
 * SEPARATE API CALL: Fetch nested data for junior tennis camp (tripImages)
 * @param {string} slug - Junior tennis camp slug
 * @returns {Promise<Object|null>} Object with tripImages, or null
 */
export async function getJuniorTennisCampNestedData(slug) {
  if (!slug) {
    console.warn('No slug provided to getJuniorTennisCampNestedData');
    return null;
  }

  try {
    const data = await fetchAPI(
      `/junior-tennis-camps?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=tripImages`
    );
    
    if (data && data.data && data.data.length > 0) {
      const item = data.data[0];
      const holiday = item.attributes || item;
      
      const tripImages = holiday.tripImages ? getStrapiImagesData(holiday.tripImages) : [];
      
      console.log(`👦 Nested data fetched for junior camp ${slug}: ${tripImages.length} trip images`);
      
      return {
        tripImages
      };
    }
    
    return null;
  } catch (error) {
    console.error(`❌ Error fetching nested data for junior camp (${slug}):`, error);
    return null;
  }
}

/**
 * SEPARATE API CALL: Fetch SEO data with metaImage for junior tennis camp
 * @param {string} slug - Junior tennis camp slug
 * @returns {Promise<Object|null>} SEO data object or null
 */
export async function getJuniorTennisCampSEO(slug) {
  if (!slug) {
    console.warn('No slug provided to getJuniorTennisCampSEO');
    return null;
  }

  try {
    const data = await fetchAPI(
      `/junior-tennis-camps?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=seo.metaImage`
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
        
        console.log(`📄 SEO data fetched for junior camp ${slug}:`, {
          hasMetaImage: !!seoData.metaImage,
          metaTitle: seoData.metaTitle
        });
        
        return seoData;
      }
    }
    
    return null;
  } catch (error) {
    console.error(`❌ Error fetching SEO data for junior camp (${slug}):`, error);
    return null;
  }
}

async function resolveJuniorTennisCampFallback(identifiers = {}) {
  const { documentId, id } = identifiers || {};

  if (documentId) {
    console.log(`👦 Attempting fallback lookup by documentId: ${documentId}`);
    const byDocumentId = await getJuniorTennisCampByDocumentId(documentId);
    if (byDocumentId) {
      return byDocumentId;
    }
  }

  if (id !== undefined && id !== null) {
    const numericId = typeof id === 'string' ? Number(id) : id;
    if (!Number.isNaN(numericId)) {
      console.log(`👦 Attempting fallback lookup by id: ${numericId}`);
      const byId = await getJuniorTennisCampById(numericId);
      if (byId) {
        return byId;
      }
    } else {
      console.warn(`⚠️ Provided fallback junior camp id is not numeric: ${id}`);
    }
  }

  return null;
}

export async function getJuniorTennisCampBySlug(slug, fallbackIdentifiers) {
  const identifiers = typeof fallbackIdentifiers === 'object' && fallbackIdentifiers !== null
    ? fallbackIdentifiers
    : { id: fallbackIdentifiers };

  if (!slug) {
    console.warn('No slug provided to getJuniorTennisCampBySlug');
    return await resolveJuniorTennisCampFallback(identifiers);
  }

  try {
    const data = await fetchAPI(
      `/junior-tennis-camps?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`
    );
    
    if (data && data.data && data.data.length > 0) {
      const transformed = transformTennisHolidayDetail(data.data[0]);
      if (transformed) {
        console.log(`👦 Junior camp fetched (slug=${slug}): ${transformed.title}`);
        console.log(`📸 Gallery images found: ${transformed.mainGallery?.length || 0}`);
      }
      return transformed;
    }

  } catch (error) {
    console.error(`❌ Error fetching junior camp by slug (${slug}):`, error);
  }

  return await resolveJuniorTennisCampFallback(identifiers);
}

export async function getJuniorTennisCampByDocumentId(documentId) {
  if (!documentId) {
    return null;
  }

  try {
    const data = await fetchAPI(`/junior-tennis-camps?filters[documentId][$eq]=${encodeURIComponent(documentId)}&populate=*`);
    
    if (data && data.data && data.data.length > 0) {
      return transformTennisHolidayDetail(data.data[0]);
    }
    return null;
  } catch (error) {
    console.error(`❌ Error fetching junior camp by documentId (${documentId}):`, error);
    return null;
  }
}

export async function getJuniorTennisCampById(identifier) {
  if (identifier === undefined || identifier === null) {
    return null;
  }

  const numericId = typeof identifier === 'string' ? Number(identifier) : identifier;
  if (Number.isNaN(numericId)) {
    console.warn(`Cannot fetch junior camp by id, identifier is not numeric: ${identifier}`);
    return null;
  }

  try {
    const data = await fetchAPI(`/junior-tennis-camps?filters[id][$eq]=${numericId}&populate=*`);
    
    if (data && data.data && data.data.length > 0) {
      return transformTennisHolidayDetail(data.data[0]);
    }
    return null;
  } catch (error) {
    console.error(`❌ Error fetching junior camp by id (${numericId}):`, error);
    return null;
  }
}

/**
 * PLAY AND WATCH FUNCTIONS
 * These follow the same pattern as tennis holidays but query the play-and-watches endpoint
 */

/**
 * SEPARATE API CALL: Fetch nested data for play-and-watch (rooms.roomGallery, tripImages)
 * @param {string} slug - Play and watch slug
 * @returns {Promise<Object|null>} Object with rooms and tripImages, or null
 */
export async function getPlayAndWatchNestedData(slug) {
  if (!slug) {
    console.warn('No slug provided to getPlayAndWatchNestedData');
    return null;
  }

  try {
    const data = await fetchAPI(
      `/play-and-watches?filters[slug][$eq]=${encodeURIComponent(slug)}&populate[rooms][populate]=*&populate=tripImages`
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
      
      console.log(`🏨 Nested data fetched for play-and-watch ${slug}: ${rooms.length} rooms, ${tripImages.length} trip images`);
      
      return {
        rooms,
        tripImages
      };
    }
    
    return null;
  } catch (error) {
    console.error(`❌ Error fetching nested data for play-and-watch (${slug}):`, error);
    return null;
  }
}

/**
 * SEPARATE API CALL: Fetch SEO data with metaImage for play-and-watch
 * @param {string} slug - Play and watch slug
 * @returns {Promise<Object|null>} SEO data object or null
 */
export async function getPlayAndWatchSEO(slug) {
  if (!slug) {
    console.warn('No slug provided to getPlayAndWatchSEO');
    return null;
  }

  try {
    const data = await fetchAPI(
      `/play-and-watches?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=seo.metaImage`
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
        
        console.log(`📄 SEO data fetched for play-and-watch ${slug}:`, {
          hasMetaImage: !!seoData.metaImage,
          metaTitle: seoData.metaTitle
        });
        
        return seoData;
      }
    }
    
    return null;
  } catch (error) {
    console.error(`❌ Error fetching SEO data for play-and-watch (${slug}):`, error);
    return null;
  }
}

async function resolvePlayAndWatchFallback(identifiers = {}) {
  const { documentId, id } = identifiers || {};

  if (documentId) {
    console.log(`🎾 Attempting fallback lookup by documentId: ${documentId}`);
    const byDocumentId = await getPlayAndWatchByDocumentId(documentId);
    if (byDocumentId) {
      return byDocumentId;
    }
  }

  if (id !== undefined && id !== null) {
    const numericId = typeof id === 'string' ? Number(id) : id;
    if (!Number.isNaN(numericId)) {
      console.log(`🎾 Attempting fallback lookup by id: ${numericId}`);
      const byId = await getPlayAndWatchById(numericId);
      if (byId) {
        return byId;
      }
    } else {
      console.warn(`⚠️ Provided fallback play-and-watch id is not numeric: ${id}`);
    }
  }

  return null;
}

export async function getPlayAndWatchBySlug(slug, fallbackIdentifiers) {
  const identifiers = typeof fallbackIdentifiers === 'object' && fallbackIdentifiers !== null
    ? fallbackIdentifiers
    : { id: fallbackIdentifiers };

  if (!slug) {
    console.warn('No slug provided to getPlayAndWatchBySlug');
    return await resolvePlayAndWatchFallback(identifiers);
  }

  try {
    const data = await fetchAPI(
      `/play-and-watches?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`
    );
    
    if (data && data.data && data.data.length > 0) {
      const transformed = transformTennisHolidayDetail(data.data[0]);
      if (transformed) {
        console.log(`🎾 Play-and-watch fetched (slug=${slug}): ${transformed.title}`);
        console.log(`📸 Gallery images found: ${transformed.mainGallery?.length || 0}`);
      }
      return transformed;
    }

  } catch (error) {
    console.error(`❌ Error fetching play-and-watch by slug (${slug}):`, error);
  }

  return await resolvePlayAndWatchFallback(identifiers);
}

export async function getPlayAndWatchByDocumentId(documentId) {
  if (!documentId) {
    return null;
  }

  try {
    const data = await fetchAPI(`/play-and-watches?filters[documentId][$eq]=${encodeURIComponent(documentId)}&populate=*`);
    
    if (data && data.data && data.data.length > 0) {
      return transformTennisHolidayDetail(data.data[0]);
    }
    return null;
  } catch (error) {
    console.error(`❌ Error fetching play-and-watch by documentId (${documentId}):`, error);
    return null;
  }
}

export async function getPlayAndWatchById(identifier) {
  if (identifier === undefined || identifier === null) {
    return null;
  }

  const numericId = typeof identifier === 'string' ? Number(identifier) : identifier;
  if (Number.isNaN(numericId)) {
    console.warn(`Cannot fetch play-and-watch by id, identifier is not numeric: ${identifier}`);
    return null;
  }

  try {
    const data = await fetchAPI(`/play-and-watches?filters[id][$eq]=${numericId}&populate=*`);
    
    if (data && data.data && data.data.length > 0) {
      return transformTennisHolidayDetail(data.data[0]);
    }
    return null;
  } catch (error) {
    console.error(`❌ Error fetching play-and-watch by id (${numericId}):`, error);
    return null;
  }
}

/**
 * Fetch all future events for the venues page date filter
 * @returns {Promise<Array>} Array of all future events
 */
async function fetchAllEvents() {
  try {
    // Get today's date to filter only future events
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString().split('T')[0];
    
    const data = await fetchAPI(`/events?filters[dateUntil][$gte]=${todayISO}&pagination[pageSize]=100&sort=dateFrom:asc`);
    
    if (!data || !data.data || data.data.length === 0) {
      console.log('ℹ️ No future events found');
      return [];
    }
    
    return data.data.map(item => {
      const event = item.attributes || item;
      return {
        id: item.id,
        uniqueValue: event.uniqueValue,
        dateFrom: event.dateFrom,
        dateUntil: event.dateUntil,
        dateText: event.dateText || ''
      };
    });
  } catch (error) {
    console.error('❌ Error fetching all events:', error);
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
    // Fetch venues and all events in parallel
    const [
      juniorCamps,
      padelHolidays,
      pickleballHolidays,
      playAndWatch,
      schoolTours,
      skiHolidays,
      tennisClinics,
      tennisHolidays,
      allEvents
    ] = await Promise.all([
      getJuniorTennisCamps(1, pageSize),
      getPadelTennisHolidays(1, pageSize),
      getPickleballHolidays(1, pageSize),
      getPlayAndWatchHolidays(1, pageSize),
      getSchoolTennisTours(1, pageSize),
      getSkiHolidays(1, pageSize),
      getTennisClinics(1, pageSize),
      getTennisHolidays(1, pageSize),
      fetchAllEvents()
    ]);
    
    // Debug: Log what was fetched from each collection
    console.log(`📍 Venues fetched per type:`);
    console.log(`  - Junior Tennis Camps: ${juniorCamps.length}`);
    console.log(`  - Padel Tennis Holidays: ${padelHolidays.length}`);
    console.log(`  - Pickleball Holidays: ${pickleballHolidays.length}`);
    console.log(`  - Play & Watch: ${playAndWatch.length}`);
    console.log(`  - School Tennis Tours: ${schoolTours.length}`);
    console.log(`  - Ski Holidays: ${skiHolidays.length}`);
    console.log(`  - Tennis Clinics: ${tennisClinics.length}`);
    console.log(`  - Tennis Holidays: ${tennisHolidays.length}`);
    console.log(`📅 Total events fetched: ${allEvents.length}`);
    
    // Create a map of uniqueValue to events for quick lookup
    const eventsByUniqueValue = {};
    allEvents.forEach(event => {
      if (event.uniqueValue) {
        if (!eventsByUniqueValue[event.uniqueValue]) {
          eventsByUniqueValue[event.uniqueValue] = [];
        }
        eventsByUniqueValue[event.uniqueValue].push(event);
      }
    });
    
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
    
    // Filter: only show venues with displayOnFrontEnd = true
    const visibleVenues = allVenues.filter(v => v.displayOnFrontEnd === true);
    console.log(`👁️ Filtered to ${visibleVenues.length} visible venues (out of ${allVenues.length} total)`);
    
    // Associate events with venues based on uniqueValue
    const allEventDates = [];
    visibleVenues.forEach(venue => {
      if (venue.uniqueValue && eventsByUniqueValue[venue.uniqueValue]) {
        venue.events = eventsByUniqueValue[venue.uniqueValue];
        venue.eventDates = venue.events.map(e => e.dateFrom).filter(Boolean);
      } else {
        venue.events = [];
        venue.eventDates = [];
      }
    });
    
    // Collect all unique event dates for the filter
    allEvents.forEach(event => {
      if (event.dateFrom) allEventDates.push(event.dateFrom);
      if (event.dateUntil) allEventDates.push(event.dateUntil);
    });
    const uniqueDates = [...new Set(allEventDates)].sort();
    
    console.log(`🔗 Matched ${visibleVenues.filter(v => v.events.length > 0).length} venues with events`);
    
    // Sort by creation date (newest first)
    visibleVenues.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Extract unique countries for filters
    const countries = [...new Set(visibleVenues.map(v => v.country).filter(Boolean))].sort();
    
    // Extract price range
    const prices = visibleVenues.map(v => v.price).filter(Boolean);
    const priceRange = prices.length > 0 ? {
      min: Math.min(...prices),
      max: Math.max(...prices)
    } : { min: 0, max: 5000 };
    
    console.log(`📍 Showing ${visibleVenues.length} total venues (displayOnFrontEnd = true)`);
    console.log(`📅 Available event dates: ${uniqueDates.length}`);
    
    return {
      venues: visibleVenues,
      metadata: {
        total: visibleVenues.length,
        countries,
        priceRange,
        availableDates: uniqueDates,
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

// =============================================================================
// GROUP ORGANISER API FUNCTIONS
// =============================================================================

/**
 * Fetch Group Organisers
 * @param {number} page - Page number (1-indexed)
 * @param {number} pageSize - Items per page
 * @returns {Promise<Array>} Array of normalized group organiser data
 */
export async function getGroupOrganisers(page = 1, pageSize = 25) {
  try {
    console.log(`🔍 Fetching group organisers page ${page} with pageSize ${pageSize}`);
    const data = await fetchAPI(`/group-organisers?pagination[page]=${page}&pagination[pageSize]=${pageSize}`);
    
    console.log(`📦 Received ${data?.data?.length || 0} group organisers`);
    
    if (!data || !data.data || data.data.length === 0) {
      return [];
    }
    
    return data.data.map(item => normalizeVenueData(item, 'group-organiser'));
  } catch (error) {
    console.error('❌ Error fetching group organisers:', error);
    return [];
  }
}

/**
 * Fetch a single group organiser by slug with all content
 * @param {string} slug - Group organiser slug
 * @param {Object} fallbackIdentifiers - Optional fallback identifiers {id, documentId}
 * @returns {Promise<Object|null>} Complete group organiser data
 */
export async function getGroupOrganiserBySlug(slug, fallbackIdentifiers = {}) {
  if (!slug) {
    console.warn('No slug provided to getGroupOrganiserBySlug');
    return null;
  }

  try {
    // Try primary lookup by slug
    const data = await fetchSingleGroupOrganiser(
      `filters[slug][$eq]=${encodeURIComponent(slug)}`,
      `slug: ${slug}`
    );

    if (data) {
      return data;
    }

    // Fallback lookups if primary fails
    console.warn(`⚠️ Group organiser not found by slug: ${slug}, trying fallbacks...`);
    return await resolveGroupOrganiserFallback(fallbackIdentifiers);

  } catch (error) {
    console.error(`❌ Error fetching group organiser by slug (${slug}):`, error);
    return null;
  }
}

/**
 * Fetch a single group organiser by documentId
 * @param {string} documentId - Group organiser documentId
 * @returns {Promise<Object|null>} Complete group organiser data
 */
export async function getGroupOrganiserByDocumentId(documentId) {
  if (!documentId) {
    console.warn('No documentId provided to getGroupOrganiserByDocumentId');
    return null;
  }

  try {
    return await fetchSingleGroupOrganiser(
      `documentId=${encodeURIComponent(documentId)}`,
      `documentId: ${documentId}`
    );
  } catch (error) {
    console.error(`❌ Error fetching group organiser by documentId (${documentId}):`, error);
    return null;
  }
}

/**
 * Fetch a single group organiser by numeric ID
 * @param {number} id - Group organiser numeric ID
 * @returns {Promise<Object|null>} Complete group organiser data
 */
export async function getGroupOrganiserById(id) {
  if (!id) {
    console.warn('No id provided to getGroupOrganiserById');
    return null;
  }

  try {
    return await fetchSingleGroupOrganiser(
      `filters[id][$eq]=${id}`,
      `id: ${id}`
    );
  } catch (error) {
    console.error(`❌ Error fetching group organiser by id (${id}):`, error);
    return null;
  }
}

/**
 * Transform raw Strapi group organiser data to frontend format
 * @param {Object} item - Raw Strapi API response item
 * @returns {Object} Transformed group organiser data
 */
function transformGroupOrganiserDetail(item) {
  const holiday = item.attributes || item;
  const seoData = holiday.seo || {};
  
  return {
    strapiId: item.id,
    documentId: item.documentId,
    title: holiday.title,
    slug: holiday.slug,
    excerpt: holiday.excerpt,
    venue: holiday.venue,
    shortLocationName: holiday.shortLocationName,
    country: holiday.country,
    countryLg: holiday.countryLg,
    airport: holiday.airport,
    lengthOfTrip: holiday.lengthOfTrip,
    internalRating: holiday.internalRating,
    uniqueValue: holiday.uniqueValue,
    
    // Master page reference fields
    masterPageType: holiday.masterPageType,
    masterPageSlug: holiday.masterPageSlug,
    eventsQueryCommaSeparated: holiday.eventsquerycommaseperated,
    
    // Hero Section
    mainHeader: holiday.mainHeader,
    headerImage: holiday.headerImage ? getStrapiImageData(holiday.headerImage) : null,
    headingText: holiday.headingText,
    belowHeadingText: holiday.belowHeadingText,
    
    // Gallery
    mainGallery: holiday.mainGallery ? getStrapiImagesData(holiday.mainGallery) : [],
    tripImages: [], // Fetched separately via getGroupOrganiserNestedData
    
    // Pricing
    priceFrom: holiday.priceFrom,
    singleOccupancyFrom: holiday.singleOccupancyFrom,
    singleOccupancyRange: holiday.singleOccupancyRange,
    boardBasisLg: holiday.boardBasisLg || holiday.boardBasis,
    
    // Why We Love This Venue
    whyWeLoveVenue1: holiday.whyWeLoveVenue1,
    whyWeLoveVenue2: holiday.whyWeLoveVenue2,
    whyWeLoveVenue3: holiday.whyWeLoveVenue3,
    whyWeLoveVenue4: holiday.whyWeLoveVenue4,
    
    // Ratings
    ourRating: holiday.ourRating,
    guestRating: holiday.guestRating,
    tennisCourtRating: holiday.tennisCourtRating,
    diningRating: holiday.diningRating,
    
    // Tennis/Court Information
    tennisCourtSurface: holiday.tennisCourtSurface,
    tennisCourts: holiday.tennisCourts,
    padelCourtsInfo: holiday.padelCourtsInfo,
    
    // What's Included/Not Included
    whatsIncluded: normalizeComponentArray(holiday.whatsIncluded),
    whatsNotIncluded: normalizeComponentArray(holiday.whatsNotIncluded),
    
    // Facilities
    facilities: normalizeComponentArray(holiday.facilities),
    facilitiesExtraInfo: holiday.facilitiesExtraInfo,
    
    // Venue Details
    setting: holiday.setting,
    boardBasis: holiday.boardBasis,
    restaurants: holiday.restaurants,
    bars: holiday.bars,
    airportTransfer: holiday.airportTransfer,
    
    // Rooms
    rooms: [], // Fetched separately via getGroupOrganiserNestedData
    roomsSubheading: holiday.roomsSubheading,
    
    // Itinerary & FAQs
    itinerary: normalizeComponentArray(holiday.itinerary),
    faqs: normalizeComponentArray(holiday.faqs),
    topTips: holiday.topTips,
    
    // Additional Info
    whereWeStay: holiday.whereWeStay,
    howWeGetAround: holiday.howWeGetAround,
    gettingThere: holiday.gettingThere,
    eventInformation: holiday.eventInformation,
    cafeInformation: holiday.cafeInformation,
    carParkingInformation: holiday.carParkingInformation,
    lunchInfo: holiday.lunchInfo,
    maximumGroupSize: holiday.maximumGroupSize,
    typicalGroupSize: holiday.typicalGroupSize,
    residentialType: holiday.residentialType,
    schoolToursLengthOfTrip: holiday.schoolToursLengthOfTrip,
    schoolToursAvailableMonths: holiday.schoolToursAvailableMonths,
    
    // Booking Options
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
    featured: holiday.featured,
    seo: seoData,
    createdAt: holiday.createdAt || item.createdAt,
    publishedAt: holiday.publishedAt || item.publishedAt
  };
}

async function fetchSingleGroupOrganiser(filterQuery, logContext = 'query') {
  const data = await fetchAPI(`/group-organisers?${filterQuery}&populate=*`);

  if (!data || !data.data || data.data.length === 0) {
    console.log(`👥 No group organiser found for ${logContext}`);
    return null;
  }

  const transformed = transformGroupOrganiserDetail(data.data[0]);
  if (transformed) {
    console.log(`👥 Group organiser fetched (${logContext}): ${transformed.title}`);
    console.log(`📸 Gallery images: ${transformed.mainGallery?.length || 0}`);
  }
  return transformed;
}

async function resolveGroupOrganiserFallback(identifiers = {}) {
  const { documentId, id } = identifiers || {};

  if (documentId) {
    console.log(`👥 Attempting fallback lookup by documentId: ${documentId}`);
    const byDocumentId = await getGroupOrganiserByDocumentId(documentId);
    if (byDocumentId) {
      return byDocumentId;
    }
  }

  if (id !== undefined && id !== null) {
    const numericId = typeof id === 'string' ? Number(id) : id;
    if (!Number.isNaN(numericId)) {
      console.log(`👥 Attempting fallback lookup by id: ${numericId}`);
      const byId = await getGroupOrganiserById(numericId);
      if (byId) {
        return byId;
      }
    } else {
      console.warn(`⚠️ Provided fallback group organiser id is not numeric: ${id}`);
    }
  }

  return null;
}

/**
 * SEPARATE API CALL: Fetch nested data for group organiser (rooms.roomGallery, tripImages)
 * This is called separately to handle Strapi v5's nested population requirements
 * @param {string} slug - Group organiser slug
 * @returns {Promise<Object|null>} Object with rooms and tripImages, or null
 */
export async function getGroupOrganiserNestedData(slug) {
  if (!slug) {
    console.warn('No slug provided to getGroupOrganiserNestedData');
    return null;
  }

  try {
    // Strapi v5 requires explicit nested population for deep relations
    const data = await fetchAPI(
      `/group-organisers?filters[slug][$eq]=${encodeURIComponent(slug)}&populate[rooms][populate]=*&populate=tripImages`
    );
    
    if (data && data.data && data.data.length > 0) {
      const item = data.data[0];
      const organiser = item.attributes || item;
      
      // Process rooms with nested roomGallery
      const rooms = [];
      const roomsSource = normalizeComponentArray(organiser.rooms);
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
      const tripImages = organiser.tripImages ? getStrapiImagesData(organiser.tripImages) : [];
      
      console.log(`🏨 Nested data fetched for ${slug}: ${rooms.length} rooms, ${tripImages.length} trip images`);
      
      return {
        rooms,
        tripImages
      };
    }
    
    return null;
  } catch (error) {
    console.error(`❌ Error fetching nested data for group organiser (${slug}):`, error);
    return null;
  }
}

/**
 * SEPARATE API CALL: Fetch SEO data with metaImage for group organiser
 * This is called separately to ensure proper population of nested SEO fields
 * @param {string} slug - Group organiser slug
 * @returns {Promise<Object|null>} SEO data object or null
 */
export async function getGroupOrganiserSEO(slug) {
  if (!slug) {
    console.warn('No slug provided to getGroupOrganiserSEO');
    return null;
  }

  try {
    const data = await fetchAPI(
      `/group-organisers?filters[slug][$eq]=${encodeURIComponent(slug)}&populate[seo][populate]=metaImage`
    );
    
    if (data && data.data && data.data.length > 0) {
      const item = data.data[0];
      const organiser = item.attributes || item;
      const seo = organiser.seo || {};
      
      // Extract meta image data with Cloudflare Images optimization
      const metaImageData = getOptimizedSEOImage(seo.metaImage);
      
      if (metaImageData.url) {
        console.log(`📸 Group organiser meta image URL (optimized):`, metaImageData.url);
      }
      
      return {
        metaTitle: seo.metaTitle,
        metaDescription: seo.metaDescription,
        keywords: seo.keywords,
        canonicalURL: seo.canonicalURL,
        metaImage: metaImageData.url,
        metaImageAlt: metaImageData.alt,
        metaImageWidth: metaImageData.width,
        metaImageHeight: metaImageData.height
      };
    }
    
    return null;
  } catch (error) {
    console.error(`❌ Error fetching SEO data for group organiser (${slug}):`, error);
    return null;
  }
}

/**
 * Fetch master page data based on masterPageType and masterPageSlug
 * @param {string} masterPageType - The type of master page (tennis-holiday, padel-holiday, etc.)
 * @param {string} masterPageSlug - The slug of the master page
 * @returns {Promise<Object|null>} Master page data or null
 */
export async function getMasterPageData(masterPageType, masterPageSlug) {
  if (!masterPageType || !masterPageSlug) {
    console.warn('⚠️ Missing masterPageType or masterPageSlug');
    return null;
  }

  try {
    console.log(`📄 Fetching master page: ${masterPageType}/${masterPageSlug}`);
    
    let masterData = null;
    
    switch (masterPageType) {
      case 'tennis-holiday':
        masterData = await getTennisHolidayBySlug(masterPageSlug);
        break;
      case 'padel-holiday':
      case 'padel-tennis-holiday':
        masterData = await getPadelHolidayBySlug(masterPageSlug);
        break;
      case 'pickleball-holiday':
        masterData = await getPickleballHolidayBySlug(masterPageSlug);
        break;
      case 'tennis-clinic':
        masterData = await getTennisClinicBySlug(masterPageSlug);
        break;
      default:
        console.warn(`⚠️ Unknown masterPageType: ${masterPageType}`);
        return null;
    }
    
    if (masterData) {
      console.log(`✅ Master page fetched: ${masterData.title}`);
    } else {
      console.warn(`⚠️ Master page not found: ${masterPageType}/${masterPageSlug}`);
    }
    
    return masterData;
  } catch (error) {
    console.error(`❌ Error fetching master page (${masterPageType}/${masterPageSlug}):`, error);
    return null;
  }
}

/**
 * ====================================
 * PRODUCT PAGES
 * ====================================
 */

/**
 * Get all product pages for static path generation
 * @returns {Promise<Array>} Array of product pages with basic info
 */
export async function getProductPages() {
  try {
    console.log('📦 [getProductPages] Fetching all product pages...');
    
    const data = await fetchAPI('/product-pages?populate=*&filters[displayOnFrontEnd][$eq]=true');
    
    if (!data || !data.data) {
      console.warn('⚠️  [getProductPages] No product pages found');
      return [];
    }
    
    const pages = data.data.map((item) => {
      const page = item.attributes || item;
      return {
        slug: page.slug,
        title: page.title,
        category: page.category
      };
    });
    
    console.log(`✅ [getProductPages] Fetched ${pages.length} product pages`);
    return pages;
  } catch (error) {
    console.error('❌ [getProductPages] Error:', error);
    return [];
  }
}

/**
 * Get product page data by slug with all nested components
 * @param {string} slug - Product page slug
 * @returns {Promise<Object|null>} Product page data
 */
export async function getProductPageBySlug(slug) {
  if (!slug) {
    console.warn('⚠️  [getProductPageBySlug] No slug provided');
    return null;
  }
  
  try {
    console.log(`📦 [getProductPageBySlug] Fetching product page: ${slug}`);
    
    // Fetch with all nested data populated
    const data = await fetchAPI(
      `/product-pages?filters[slug][$eq]=${slug}&` +
      'populate[hero][populate]=*&' +
      'populate[quote][populate]=*&' +
      'populate[jamieMurray][populate]=*&' +
      'populate[twoColumnContent][populate][leftBlock][populate]=*&' +
      'populate[twoColumnContent][populate][rightBlock][populate]=*&' +
      'populate[keyInformation][populate]=*&' +
      'populate[schedule][populate]=*&' +
      'populate[discount][populate]=*&' +
      'populate[faq][populate]=*&' +
      'populate[destinations][populate]=*&' +
      'populate[seo][populate]=*'
    );
    
    if (!data || !data.data || data.data.length === 0) {
      console.warn(`⚠️  [getProductPageBySlug] Product page not found: ${slug}`);
      return null;
    }
    
    const item = data.data[0];
    const page = item.attributes || item;
    
    // Process the data structure
    const productPage = {
      id: item.id,
      slug: page.slug,
      title: page.title,
      category: page.category,
      displayOnFrontEnd: page.displayOnFrontEnd,
      
      // Hero section
      hero: page.hero ? {
        kicker: page.hero.kicker,
        heading: page.hero.heading,
        subheading: page.hero.subheading,
        backgroundImage: getStrapiImageData(page.hero.backgroundImage),
        heroImages: getStrapiImagesData(page.hero.heroImages),
        buttonText: page.hero.buttonText,
        buttonLink: page.hero.buttonLink,
        mediaType: page.hero.mediaType || 'fullscreen-background',
        videoUrl: page.hero.videoUrl,
        rightSideImage: getStrapiImageData(page.hero.rightSideImage)
      } : null,
      
      // Quote section
      quote: page.quote ? {
        eyebrow: page.quote.eyebrow,
        quoteText: page.quote.quoteText,
        authorName: page.quote.authorName,
        authorImages: getStrapiImagesData(page.quote.authorImages),
        decorativeIcon: getStrapiImageData(page.quote.decorativeIcon)
      } : null,
      
      // Jamie Murray section
      jamieMurray: page.jamieMurray ? {
        title: page.jamieMurray.title,
        description: page.jamieMurray.description,
        buttonText: page.jamieMurray.buttonText,
        videoUrl: page.jamieMurray.videoUrl,
        image: getStrapiImageData(page.jamieMurray.image),
        achievements: page.jamieMurray.achievements || []
      } : null,
      
      // Two Column Content section
      twoColumnContent: page.twoColumnContent ? {
        eyebrow: page.twoColumnContent.eyebrow,
        leftBlock: page.twoColumnContent.leftBlock ? {
          heading: page.twoColumnContent.leftBlock.heading,
          content: page.twoColumnContent.leftBlock.content,
          image: getStrapiImageData(page.twoColumnContent.leftBlock.image),
          imagePosition: page.twoColumnContent.leftBlock.imagePosition || 'bottom'
        } : null,
        rightBlock: page.twoColumnContent.rightBlock ? {
          heading: page.twoColumnContent.rightBlock.heading,
          content: page.twoColumnContent.rightBlock.content,
          image: getStrapiImageData(page.twoColumnContent.rightBlock.image),
          imagePosition: page.twoColumnContent.rightBlock.imagePosition || 'bottom'
        } : null
      } : null,
      
      // Key Information section
      keyInformation: page.keyInformation ? {
        eyebrow: page.keyInformation.eyebrow,
        heading: page.keyInformation.heading,
        subtitle: page.keyInformation.subtitle,
        infoCards: page.keyInformation.infoCards || []
      } : null,
      
      // Schedule section
      schedule: page.schedule ? {
        heading: page.schedule.heading,
        scheduleRows: page.schedule.scheduleRows || []
      } : null,
      
      // Discount section
      discount: page.discount ? {
        eyebrow: page.discount.eyebrow,
        heading: page.discount.heading,
        description: page.discount.description,
        buttonText: page.discount.buttonText,
        buttonLink: page.discount.buttonLink,
        backgroundImage: getStrapiImageData(page.discount.backgroundImage)
      } : null,
      
      // FAQ section
      faq: page.faq ? {
        eyebrow: page.faq.eyebrow,
        heading: page.faq.heading,
        faqs: page.faq.faqs || []
      } : null,
      
      // Destinations section
      destinations: page.destinations ? {
        showDestinations: page.destinations.showDestinations !== false,
        heading: page.destinations.heading,
        eyebrow: page.destinations.eyebrow,
        featuredLocationSlugs: page.destinations.featuredLocationSlugs || []
      } : null,
      
      // SEO
      seo: page.seo || null
    };
    
    console.log(`✅ [getProductPageBySlug] Product page fetched: ${productPage.title}`);
    return productPage;
  } catch (error) {
    console.error(`❌ [getProductPageBySlug] Error fetching ${slug}:`, error);
    return null;
  }
}

/**
 * Get product page SEO data by slug
 * @param {string} slug - Product page slug
 * @returns {Promise<Object|null>} SEO data
 */
export async function getProductPageSEO(slug) {
  if (!slug) {
    console.warn('⚠️  [getProductPageSEO] No slug provided');
    return null;
  }
  
  try {
    console.log(`📄 [getProductPageSEO] Fetching SEO for product page: ${slug}`);
    
    const data = await fetchAPI(
      `/product-pages?filters[slug][$eq]=${slug}&populate[seo][populate]=metaImage`
    );
    
    if (!data || !data.data || data.data.length === 0) {
      console.warn(`⚠️  [getProductPageSEO] Product page not found: ${slug}`);
      return null;
    }
    
    const item = data.data[0];
    const page = item.attributes || item;
    const seo = page.seo;
    
    if (!seo) {
      console.warn(`⚠️  [getProductPageSEO] No SEO data for: ${slug}`);
      return null;
    }

    // Extract meta image data with Cloudflare Images optimization
    const metaImageData = getOptimizedSEOImage(seo.metaImage);
    
    if (metaImageData.url) {
      console.log(`📸 Product page meta image URL (optimized):`, metaImageData.url);
    }
    
    const seoData = {
      metaTitle: seo.metaTitle,
      metaDescription: seo.metaDescription,
      keywords: seo.keywords,
      canonicalURL: seo.canonicalURL,
      metaImage: metaImageData.url,
      metaImageAlt: metaImageData.alt,
      metaImageWidth: metaImageData.width,
      metaImageHeight: metaImageData.height
    };
    
    console.log(`✅ [getProductPageSEO] SEO data fetched for: ${slug}`);
    return seoData;
  } catch (error) {
    console.error(`❌ [getProductPageSEO] Error fetching SEO for ${slug}:`, error);
    return null;
  }
}

/**
 * ====================================
 * ABOUT PAGE
 * ====================================
 */

/**
 * Get About Page data with all nested components
 * @returns {Promise<Object|null>} About page data
 */
export async function getAboutPage() {
  try {
    console.log('📖 [getAboutPage] Fetching about page data...');
    
    const data = await fetchAPI(
      '/about-page?' +
      'populate[pageHero][populate]=*&' +
      'populate[hero][populate]=*&' +
      'populate[stats][populate]=*&' +
      'populate[contentBlocks][populate]=*&' +
      'populate[benefits][populate]=*&' +
      'populate[dragonsDen][populate]=*&' +
      'populate[history][populate]=*&' +
      'populate[faq][populate]=*&' +
      'populate[seo][populate]=*'
    );
    
    if (!data || !data.data) {
      console.warn('⚠️  [getAboutPage] No about page found');
      return null;
    }
    
    const page = data.data.attributes || data.data;
    
    const aboutPage = {
      title: page.title,
      displayOnFrontEnd: page.displayOnFrontEnd,
      
      pageHero: page.pageHero ? {
        kicker: page.pageHero.kicker,
        heading: page.pageHero.heading,
        subtitle: page.pageHero.subtitle,
        backgroundImage: getStrapiImageData(page.pageHero.backgroundImage),
        showBreadcrumbs: page.pageHero.showBreadcrumbs !== false
      } : null,
      
      hero: page.hero ? {
        eyebrow: page.hero.eyebrow,
        heading: page.hero.heading,
        topLeftImage: getStrapiImageData(page.hero.topLeftImage),
        topRightImage: getStrapiImageData(page.hero.topRightImage),
        introText: page.hero.introText,
        bottomLeftImage: getStrapiImageData(page.hero.bottomLeftImage),
        bottomRightImage: getStrapiImageData(page.hero.bottomRightImage),
        mainContent: page.hero.mainContent,
        highlights: page.hero.highlights || [],
        buttonText: page.hero.buttonText,
        buttonLink: page.hero.buttonLink
      } : null,
      
      stats: page.stats ? {
        stats: page.stats.stats || []
      } : null,
      
      contentBlocks: page.contentBlocks ? page.contentBlocks.map(block => ({
        heading: block.heading,
        content: block.content,
        image: getStrapiImageData(block.image),
        imagePosition: block.imagePosition || 'right',
        backgroundColor: block.backgroundColor || 'white'
      })) : [],
      
      showWhatWeOffer: page.showWhatWeOffer !== false,
      
      benefits: page.benefits ? {
        heading: page.benefits.heading,
        benefits: page.benefits.benefits || []
      } : null,
      
      dragonsDen: page.dragonsDen ? {
        heading: page.dragonsDen.heading,
        content: page.dragonsDen.content,
        image: getStrapiImageData(page.dragonsDen.image),
        videoUrl: page.dragonsDen.videoUrl,
        buttonText: page.dragonsDen.buttonText,
        buttonLink: page.dragonsDen.buttonLink,
        backgroundColor: page.dragonsDen.backgroundColor || 'navy'
      } : null,
      
      history: page.history ? {
        heading: page.history.heading,
        events: page.history.events || []
      } : null,
      
      showInstagram: page.showInstagram !== false,
      
      faq: page.faq ? {
        eyebrow: page.faq.eyebrow,
        heading: page.faq.heading,
        faqs: page.faq.faqs || []
      } : null,
      
      seo: page.seo || null
    };
    
    console.log('✅ [getAboutPage] About page data fetched successfully');
    return aboutPage;
  } catch (error) {
    console.error('❌ [getAboutPage] Error:', error);
    return null;
  }
}

/**
 * Get About Page SEO data
 * @returns {Promise<Object|null>} SEO data
 */
export async function getAboutPageSEO() {
  try {
    console.log('📄 [getAboutPageSEO] Fetching SEO for about page...');
    
    const data = await fetchAPI('/about-page?populate[seo][populate]=metaImage');
    
    if (!data || !data.data) {
      console.warn('⚠️  [getAboutPageSEO] No about page found');
      return null;
    }
    
    const page = data.data.attributes || data.data;
    const seo = page.seo;
    
    if (!seo) {
      console.warn('⚠️  [getAboutPageSEO] No SEO data');
      return null;
    }

    // Extract meta image data with Cloudflare Images optimization
    const metaImageData = getOptimizedSEOImage(seo.metaImage);
    
    if (metaImageData.url) {
      console.log(`📸 About page meta image URL (optimized):`, metaImageData.url);
    }
    
    const seoData = {
      metaTitle: seo.metaTitle,
      metaDescription: seo.metaDescription,
      keywords: seo.keywords,
      canonicalURL: seo.canonicalURL,
      metaImage: metaImageData.url,
      metaImageAlt: metaImageData.alt,
      metaImageWidth: metaImageData.width,
      metaImageHeight: metaImageData.height
    };
    
    console.log('✅ [getAboutPageSEO] SEO data fetched');
    return seoData;
  } catch (error) {
    console.error('❌ [getAboutPageSEO] Error:', error);
    return null;
  }
}

/**
 * ====================================
 * ANNOUNCEMENT BAR
 * ====================================
 */

/**
 * Get announcement bar data
 * @returns {Promise<Object|null>} Announcement bar data or null if inactive
 */
export async function getAnnouncementBar() {
  try {
    console.log('📣 [getAnnouncementBar] Fetching announcement bar...');
    
    const data = await fetchAPI('/announcement-bar');
    
    if (!data || !data.data) {
      console.warn('⚠️  [getAnnouncementBar] No announcement bar found');
      return null;
    }
    
    const bar = data.data.attributes || data.data;
    
    // Only return if active
    if (!bar.isActive) {
      console.log('ℹ️  [getAnnouncementBar] Announcement bar is inactive');
      return null;
    }
    
    const announcementBar = {
      isActive: bar.isActive,
      message: bar.message,
      ctaText: bar.ctaText,
      ctaLink: bar.ctaLink,
      backgroundColorStart: bar.backgroundColorStart || '#0D1C4E',
      backgroundColorEnd: bar.backgroundColorEnd || '#0a1539',
      textColor: bar.textColor || '#FFFFFF',
      ctaTextColor: bar.ctaTextColor || '#FFFFFF',
      ctaHoverColor: bar.ctaHoverColor || '#ad986c',
      isDismissible: bar.isDismissible !== false,
      cookieName: bar.cookieName || 'announcement-dismissed'
    };
    
    console.log('✅ [getAnnouncementBar] Announcement bar fetched');
    return announcementBar;
  } catch (error) {
    console.error('❌ [getAnnouncementBar] Error:', error);
    return null;
  }
}

/**
 * ====================================
 * DRAGONS' DEN PAGE
 * ====================================
 */

/**
 * Get Dragons' Den Page data
 * @returns {Promise<Object|null>} Dragons' Den page data
 */
export async function getDragonsDenPage() {
  try {
    console.log('🐲 [getDragonsDenPage] Fetching Dragons Den page...');
    
    const data = await fetchAPI(
      '/dragons-den-page?' +
      'populate[pageHero][populate]=*&' +
      'populate[quote][populate]=*&' +
      'populate[video1][populate]=*&' +
      'populate[contentBlock][populate]=*&' +
      'populate[video2][populate]=*&' +
      'populate[faq][populate]=*&' +
      'populate[seo][populate]=*'
    );
    
    if (!data || !data.data) {
      console.warn('⚠️  [getDragonsDenPage] No Dragons Den page found');
      return null;
    }
    
    const page = data.data.attributes || data.data;
    
    const dragonsDenPage = {
      title: page.title,
      displayOnFrontEnd: page.displayOnFrontEnd,
      
      pageHero: page.pageHero ? {
        kicker: page.pageHero.kicker,
        heading: page.pageHero.heading,
        subtitle: page.pageHero.subtitle,
        backgroundImage: getStrapiImageData(page.pageHero.backgroundImage),
        showBreadcrumbs: page.pageHero.showBreadcrumbs !== false
      } : null,
      
      quote: page.quote ? {
        eyebrow: page.quote.eyebrow,
        quoteText: page.quote.quoteText,
        authorName: page.quote.authorName,
        authorImages: getStrapiImagesData(page.quote.authorImages),
        decorativeIcon: getStrapiImageData(page.quote.decorativeIcon)
      } : null,
      
      video1: page.video1 ? {
        heading: page.video1.heading,
        content: page.video1.content,
        videoUrl: page.video1.videoUrl,
        layout: page.video1.layout || 'side-by-side',
        backgroundColor: page.video1.backgroundColor || 'white'
      } : null,
      
      contentBlock: page.contentBlock ? {
        heading: page.contentBlock.heading,
        content: page.contentBlock.content,
        image: getStrapiImageData(page.contentBlock.image),
        imagePosition: page.contentBlock.imagePosition || 'right',
        backgroundColor: page.contentBlock.backgroundColor || 'white'
      } : null,
      
      video2: page.video2 ? {
        heading: page.video2.heading,
        content: page.video2.content,
        videoUrl: page.video2.videoUrl,
        layout: page.video2.layout || 'stacked',
        backgroundColor: page.video2.backgroundColor || 'grey'
      } : null,
      
      showProductsGrid: page.showProductsGrid !== false,
      
      faq: page.faq ? {
        eyebrow: page.faq.eyebrow,
        heading: page.faq.heading,
        faqs: page.faq.faqs || []
      } : null,
      
      seo: page.seo || null
    };
    
    console.log('✅ [getDragonsDenPage] Dragons Den page fetched');
    return dragonsDenPage;
  } catch (error) {
    console.error('❌ [getDragonsDenPage] Error:', error);
    return null;
  }
}

/**
 * Get Dragons' Den Page SEO data
 * @returns {Promise<Object|null>} SEO data
 */
export async function getDragonsDenPageSEO() {
  try {
    console.log('📄 [getDragonsDenPageSEO] Fetching SEO...');
    
    const data = await fetchAPI('/dragons-den-page?populate[seo][populate]=metaImage');
    
    if (!data || !data.data) {
      console.warn('⚠️  [getDragonsDenPageSEO] No page found');
      return null;
    }
    
    const page = data.data.attributes || data.data;
    const seo = page.seo;
    
    if (!seo) {
      console.warn('⚠️  [getDragonsDenPageSEO] No SEO data');
      return null;
    }

    // Extract meta image data with Cloudflare Images optimization
    const metaImageData = getOptimizedSEOImage(seo.metaImage);
    
    if (metaImageData.url) {
      console.log(`📸 Dragons Den meta image URL (optimized):`, metaImageData.url);
    }
    
    const seoData = {
      metaTitle: seo.metaTitle,
      metaDescription: seo.metaDescription,
      keywords: seo.keywords,
      canonicalURL: seo.canonicalURL,
      metaImage: metaImageData.url,
      metaImageAlt: metaImageData.alt,
      metaImageWidth: metaImageData.width,
      metaImageHeight: metaImageData.height
    };
    
    console.log('✅ [getDragonsDenPageSEO] SEO fetched');
    return seoData;
  } catch (error) {
    console.error('❌ [getDragonsDenPageSEO] Error:', error);
    return null;
  }
}

/**
 * ====================================
 * JAMIE MURRAY PAGE
 * ====================================
 */

/**
 * Get Jamie Murray Page data
 * @returns {Promise<Object|null>} Jamie Murray page data
 */
export async function getJamieMurrayPage() {
  try {
    console.log('🎾 [getJamieMurrayPage] Fetching Jamie Murray page...');
    
    const data = await fetchAPI(
      '/jamie-murray-page?' +
      'populate[pageHero][populate]=*&' +
      'populate[quote][populate]=*&' +
      'populate[jamieMurrayProgramme][populate]=*&' +
      'populate[twoColumnContent][populate][leftBlock][populate]=*&' +
      'populate[twoColumnContent][populate][rightBlock][populate]=*&' +
      'populate[faq][populate]=*&' +
      'populate[seo][populate]=*'
    );
    
    if (!data || !data.data) {
      console.warn('⚠️  [getJamieMurrayPage] No Jamie Murray page found');
      return null;
    }
    
    const page = data.data.attributes || data.data;
    
    const jamieMurrayPage = {
      title: page.title,
      slug: page.slug,
      displayOnFrontEnd: page.displayOnFrontEnd,
      
      pageHero: page.pageHero ? {
        kicker: page.pageHero.kicker,
        heading: page.pageHero.heading,
        subtitle: page.pageHero.subtitle,
        backgroundImage: getStrapiImageData(page.pageHero.backgroundImage),
        showBreadcrumbs: page.pageHero.showBreadcrumbs !== false
      } : null,
      
      quote: page.quote ? {
        eyebrow: page.quote.eyebrow,
        quoteText: page.quote.quoteText,
        authorName: page.quote.authorName,
        authorImages: getStrapiImagesData(page.quote.authorImages),
        decorativeIcon: getStrapiImageData(page.quote.decorativeIcon)
      } : null,
      
      jamieMurrayProgramme: page.jamieMurrayProgramme ? {
        title: page.jamieMurrayProgramme.title,
        description: page.jamieMurrayProgramme.description,
        buttonText: page.jamieMurrayProgramme.buttonText,
        videoUrl: page.jamieMurrayProgramme.videoUrl,
        image: getStrapiImageData(page.jamieMurrayProgramme.image),
        achievements: page.jamieMurrayProgramme.achievements || []
      } : null,
      
      twoColumnContent: page.twoColumnContent ? {
        eyebrow: page.twoColumnContent.eyebrow,
        leftBlock: page.twoColumnContent.leftBlock ? {
          heading: page.twoColumnContent.leftBlock.heading,
          content: page.twoColumnContent.leftBlock.content,
          image: getStrapiImageData(page.twoColumnContent.leftBlock.image),
          imagePosition: page.twoColumnContent.leftBlock.imagePosition || 'bottom'
        } : null,
        rightBlock: page.twoColumnContent.rightBlock ? {
          heading: page.twoColumnContent.rightBlock.heading,
          content: page.twoColumnContent.rightBlock.content,
          image: getStrapiImageData(page.twoColumnContent.rightBlock.image),
          imagePosition: page.twoColumnContent.rightBlock.imagePosition || 'top'
        } : null
      } : null,
      
      showLocations: page.showLocations !== false,
      locationsHeading: page.locationsHeading,
      locationsEyebrow: page.locationsEyebrow,
      featuredLocationSlugs: page.featuredLocationSlugs,
      
      faq: page.faq ? {
        eyebrow: page.faq.eyebrow,
        heading: page.faq.heading,
        faqs: page.faq.faqs || []
      } : null,
      
      seo: page.seo || null
    };
    
    console.log('✅ [getJamieMurrayPage] Jamie Murray page fetched');
    return jamieMurrayPage;
  } catch (error) {
    console.error('❌ [getJamieMurrayPage] Error:', error);
    return null;
  }
}

/**
 * Get Jamie Murray Page SEO data
 * @returns {Promise<Object|null>} SEO data
 */
export async function getJamieMurrayPageSEO() {
  try {
    console.log('📄 [getJamieMurrayPageSEO] Fetching SEO...');
    
    const data = await fetchAPI('/jamie-murray-page?populate[seo][populate]=metaImage');
    
    if (!data || !data.data) {
      console.warn('⚠️  [getJamieMurrayPageSEO] No page found');
      return null;
    }
    
    const page = data.data.attributes || data.data;
    const seo = page.seo;
    
    if (!seo) {
      console.warn('⚠️  [getJamieMurrayPageSEO] No SEO data');
      return null;
    }

    // Extract meta image data with Cloudflare Images optimization
    const metaImageData = getOptimizedSEOImage(seo.metaImage);
    
    if (metaImageData.url) {
      console.log(`📸 Jamie Murray meta image URL (optimized):`, metaImageData.url);
    }
    
    const seoData = {
      metaTitle: seo.metaTitle,
      metaDescription: seo.metaDescription,
      keywords: seo.keywords,
      canonicalURL: seo.canonicalURL,
      metaImage: metaImageData.url,
      metaImageAlt: metaImageData.alt,
      metaImageWidth: metaImageData.width,
      metaImageHeight: metaImageData.height
    };
    
    console.log('✅ [getJamieMurrayPageSEO] SEO fetched');
    return seoData;
  } catch (error) {
    console.error('❌ [getJamieMurrayPageSEO] Error:', error);
    return null;
  }
}

/**
 * ====================================
 * FLIGHTS PAGE
 * ====================================
 */

/**
 * Get Flights Page data
 * @returns {Promise<Object|null>} Flights page data
 */
export async function getFlightsPage() {
  try {
    console.log('✈️ [getFlightsPage] Fetching Flights page...');
    
    const data = await fetchAPI(
      '/flights-page?' +
      'populate[pageHero][populate]=*&' +
      'populate[seo][populate]=*'
    );
    
    if (!data || !data.data) {
      console.warn('⚠️  [getFlightsPage] No Flights page found');
      return null;
    }
    
    const page = data.data.attributes || data.data;
    
    const flightsPage = {
      title: page.title,
      slug: page.slug,
      displayOnFrontEnd: page.displayOnFrontEnd,
      
      pageHero: page.pageHero ? {
        kicker: page.pageHero.kicker,
        heading: page.pageHero.heading,
        subtitle: page.pageHero.subtitle,
        backgroundImage: getStrapiImageData(page.pageHero.backgroundImage),
        showBreadcrumbs: page.pageHero.showBreadcrumbs !== false
      } : null,
      
      introHeading: page.introHeading,
      introText: page.introText,
      formHeading: page.formHeading,
      formDescription: page.formDescription,
      
      seo: page.seo || null
    };
    
    console.log('✅ [getFlightsPage] Flights page fetched');
    return flightsPage;
  } catch (error) {
    console.error('❌ [getFlightsPage] Error:', error);
    return null;
  }
}

/**
 * Get Flights Page SEO data
 * @returns {Promise<Object|null>} SEO data
 */
export async function getFlightsPageSEO() {
  try {
    console.log('📄 [getFlightsPageSEO] Fetching SEO...');
    
    const data = await fetchAPI('/flights-page?populate[seo][populate]=metaImage');
    
    if (!data || !data.data) {
      console.warn('⚠️  [getFlightsPageSEO] No page found');
      return null;
    }
    
    const page = data.data.attributes || data.data;
    const seo = page.seo;
    
    if (!seo) {
      console.warn('⚠️  [getFlightsPageSEO] No SEO data');
      return null;
    }

    // Extract meta image data with Cloudflare Images optimization
    const metaImageData = getOptimizedSEOImage(seo.metaImage);
    
    if (metaImageData.url) {
      console.log(`📸 Flights page meta image URL (optimized):`, metaImageData.url);
    }
    
    const seoData = {
      metaTitle: seo.metaTitle,
      metaDescription: seo.metaDescription,
      keywords: seo.keywords,
      canonicalURL: seo.canonicalURL,
      metaImage: metaImageData.url,
      metaImageAlt: metaImageData.alt,
      metaImageWidth: metaImageData.width,
      metaImageHeight: metaImageData.height
    };
    
    console.log('✅ [getFlightsPageSEO] SEO fetched');
    return seoData;
  } catch (error) {
    console.error('❌ [getFlightsPageSEO] Error:', error);
    return null;
  }
}

/**
 * ====================================
 * SELF RATING GUIDE PAGE
 * ====================================
 */

/**
 * Get Self Rating Guide Page data
 * @returns {Promise<Object|null>} Self Rating Guide page data
 */
export async function getSelfRatingGuidePage() {
  try {
    console.log('📊 [getSelfRatingGuidePage] Fetching Self Rating Guide page...');
    
    const data = await fetchAPI(
      '/self-rating-guide-page?' +
      'populate[pageHero][populate]=*&' +
      'populate[tennisImage][populate]=*&' +
      'populate[padelImage][populate]=*&' +
      'populate[pickleballImage][populate]=*&' +
      'populate[seo][populate]=*'
    );
    
    if (!data || !data.data) {
      console.warn('⚠️  [getSelfRatingGuidePage] No Self Rating Guide page found');
      return null;
    }
    
    const page = data.data;
    
    const selfRatingGuidePage = {
      pageHero: page.pageHero ? {
        kicker: page.pageHero.kicker,
        heading: page.pageHero.heading,
        subtitle: page.pageHero.subtitle,
        backgroundImage: getStrapiImageData(page.pageHero.backgroundImage),
        showBreadcrumbs: page.pageHero.showBreadcrumbs !== false
      } : null,
      
      introTitle: page.introTitle,
      introContent: page.introContent,
      downloadGuideUrl: page.downloadGuideUrl,
      
      tennisTitle: page.tennisTitle,
      tennisContent: page.tennisContent,
      tennisImage: getStrapiImageData(page.tennisImage),
      
      padelTitle: page.padelTitle,
      padelContent: page.padelContent,
      padelImage: getStrapiImageData(page.padelImage),
      
      pickleballTitle: page.pickleballTitle,
      pickleballContent: page.pickleballContent,
      pickleballImage: getStrapiImageData(page.pickleballImage),
      
      seo: page.seo || null
    };
    
    console.log('✅ [getSelfRatingGuidePage] Self Rating Guide page fetched');
    return selfRatingGuidePage;
  } catch (error) {
    console.error('❌ [getSelfRatingGuidePage] Error:', error);
    return null;
  }
}

/**
 * Get Self Rating Guide Page SEO data
 * @returns {Promise<Object|null>} SEO data
 */
export async function getSelfRatingGuidePageSEO() {
  try {
    console.log('📄 [getSelfRatingGuidePageSEO] Fetching SEO...');
    
    const data = await fetchAPI('/self-rating-guide-page?populate[seo][populate]=metaImage');
    
    if (!data || !data.data) {
      console.warn('⚠️  [getSelfRatingGuidePageSEO] No page found');
      return null;
    }
    
    const page = data.data.attributes || data.data;
    const seo = page.seo;
    
    if (!seo) {
      console.warn('⚠️  [getSelfRatingGuidePageSEO] No SEO data');
      return null;
    }

    // Extract meta image data with Cloudflare Images optimization
    const metaImageData = getOptimizedSEOImage(seo.metaImage);
    
    if (metaImageData.url) {
      console.log(`📸 Self Rating Guide page meta image URL (optimized):`, metaImageData.url);
    }
    
    const seoData = {
      metaTitle: seo.metaTitle,
      metaDescription: seo.metaDescription,
      keywords: seo.keywords,
      canonicalURL: seo.canonicalURL,
      metaImage: metaImageData.url,
      metaImageAlt: metaImageData.alt,
      metaImageWidth: metaImageData.width,
      metaImageHeight: metaImageData.height
    };
    
    console.log('✅ [getSelfRatingGuidePageSEO] SEO fetched');
    return seoData;
  } catch (error) {
    console.error('❌ [getSelfRatingGuidePageSEO] Error:', error);
    return null;
  }
}

/**
 * ====================================
 * BOOKING PROCESS PAGE
 * ====================================
 */

/**
 * Get Booking Process Page data
 * @returns {Promise<Object|null>} Booking process page data
 */
export async function getBookingProcessPage() {
  try {
    console.log('📋 [getBookingProcessPage] Fetching Booking Process page...');
    
    const data = await fetchAPI(
      '/booking-process-page?' +
      'populate[pageHero][populate]=*&' +
      'populate[seo][populate]=*'
    );
    
    if (!data || !data.data) {
      console.warn('⚠️  [getBookingProcessPage] No Booking Process page found');
      return null;
    }
    
    const page = data.data;
    
    const bookingProcessPage = {
      pageHero: page.pageHero ? {
        kicker: page.pageHero.kicker,
        heading: page.pageHero.heading,
        subtitle: page.pageHero.subtitle,
        backgroundImage: getStrapiImageData(page.pageHero.backgroundImage),
        showBreadcrumbs: page.pageHero.showBreadcrumbs !== false
      } : null,
      
      introTitle: page.introTitle,
      introSubtitle: page.introSubtitle,
      
      videoGuideTitle: page.videoGuideTitle || 'Video Guide',
      videoGuideUrl: page.videoGuideUrl,
      
      generalInfoTitle: page.generalInfoTitle || 'General Info',
      generalInfoContent: page.generalInfoContent,
      
      accommodationIncludedTitle: page.accommodationIncludedTitle || 'Accommodation Included',
      accommodationIncludedContent: page.accommodationIncludedContent,
      
      accommodationExcludedTitle: page.accommodationExcludedTitle || 'Accommodation Excluded',
      accommodationExcludedContent: page.accommodationExcludedContent,
      
      makingChangesTitle: page.makingChangesTitle || 'Making Changes',
      makingChangesContent: page.makingChangesContent,
      
      seo: page.seo || null
    };
    
    console.log('✅ [getBookingProcessPage] Booking Process page fetched');
    return bookingProcessPage;
  } catch (error) {
    console.error('❌ [getBookingProcessPage] Error:', error);
    return null;
  }
}

/**
 * Get Booking Process Page SEO data
 * @returns {Promise<Object|null>} SEO data
 */
export async function getBookingProcessPageSEO() {
  try {
    console.log('📄 [getBookingProcessPageSEO] Fetching SEO...');
    
    const data = await fetchAPI('/booking-process-page?populate[seo][populate]=metaImage');
    
    if (!data || !data.data) {
      console.warn('⚠️  [getBookingProcessPageSEO] No page found');
      return null;
    }
    
    const page = data.data.attributes || data.data;
    const seo = page.seo;
    
    if (!seo) {
      console.warn('⚠️  [getBookingProcessPageSEO] No SEO data');
      return null;
    }

    // Extract meta image data with Cloudflare Images optimization
    const metaImageData = getOptimizedSEOImage(seo.metaImage);
    
    if (metaImageData.url) {
      console.log(`📸 Booking Process page meta image URL (optimized):`, metaImageData.url);
    }
    
    const seoData = {
      metaTitle: seo.metaTitle,
      metaDescription: seo.metaDescription,
      keywords: seo.keywords,
      canonicalURL: seo.canonicalURL,
      metaImage: metaImageData.url,
      metaImageAlt: metaImageData.alt,
      metaImageWidth: metaImageData.width,
      metaImageHeight: metaImageData.height
    };
    
    console.log('✅ [getBookingProcessPageSEO] SEO fetched');
    return seoData;
  } catch (error) {
    console.error('❌ [getBookingProcessPageSEO] Error:', error);
    return null;
  }
}

/**
 * ====================================
 * AIRPORT TRANSFERS PAGE
 * ====================================
 */

/**
 * Get Airport Transfers Page data
 * @returns {Promise<Object|null>} Airport transfers page data
 */
export async function getAirportTransfersPage() {
  try {
    console.log('✈️  [getAirportTransfersPage] Fetching Airport Transfers page...');
    
    const data = await fetchAPI(
      '/airport-transfers-page?' +
      'populate[pageHero][populate]=*&' +
      'populate[contentsItems][populate]=*&' +
      'populate[keyInfoAccordions][populate]=*&' +
      'populate[pricingTable][populate]=*&' +
      'populate[seo][populate]=*'
    );
    
    if (!data || !data.data) {
      console.warn('⚠️  [getAirportTransfersPage] No Airport Transfers page found');
      return null;
    }
    
    const page = data.data;
    
    const airportTransfersPage = {
      pageHero: page.pageHero ? {
        kicker: page.pageHero.kicker,
        heading: page.pageHero.heading,
        subtitle: page.pageHero.subtitle,
        backgroundImage: getStrapiImageData(page.pageHero.backgroundImage),
        showBreadcrumbs: page.pageHero.showBreadcrumbs !== false
      } : null,
      
      importantEyebrow: page.importantEyebrow || 'IMPORTANT',
      importantContent: page.importantContent,
      
      showContents: page.showContents !== false,
      contentsItems: page.contentsItems || [],
      
      keyInfoTitle: page.keyInfoTitle || 'Key Information',
      keyInfoSubtitle: page.keyInfoSubtitle,
      keyInfoAccordions: page.keyInfoAccordions || [],
      
      pricingTitle: page.pricingTitle || 'Pricing',
      pricingSubtitle: page.pricingSubtitle,
      pricingTable: page.pricingTable || [],
      
      seo: page.seo || null
    };
    
    console.log('✅ [getAirportTransfersPage] Airport Transfers page fetched');
    return airportTransfersPage;
  } catch (error) {
    console.error('❌ [getAirportTransfersPage] Error:', error);
    return null;
  }
}

/**
 * Get Airport Transfers Page SEO data
 * @returns {Promise<Object|null>} SEO data
 */
export async function getAirportTransfersPageSEO() {
  try {
    console.log('📄 [getAirportTransfersPageSEO] Fetching SEO...');
    
    const data = await fetchAPI('/airport-transfers-page?populate[seo][populate]=metaImage');
    
    if (!data || !data.data) {
      console.warn('⚠️  [getAirportTransfersPageSEO] No page found');
      return null;
    }
    
    const page = data.data.attributes || data.data;
    const seo = page.seo;
    
    if (!seo) {
      console.warn('⚠️  [getAirportTransfersPageSEO] No SEO data');
      return null;
    }

    // Extract meta image data with Cloudflare Images optimization
    const metaImageData = getOptimizedSEOImage(seo.metaImage);
    
    if (metaImageData.url) {
      console.log(`📸 Airport Transfers page meta image URL (optimized):`, metaImageData.url);
    }
    
    const seoData = {
      metaTitle: seo.metaTitle,
      metaDescription: seo.metaDescription,
      keywords: seo.keywords,
      canonicalURL: seo.canonicalURL,
      metaImage: metaImageData.url,
      metaImageAlt: metaImageData.alt,
      metaImageWidth: metaImageData.width,
      metaImageHeight: metaImageData.height
    };
    
    console.log('✅ [getAirportTransfersPageSEO] SEO fetched');
    return seoData;
  } catch (error) {
    console.error('❌ [getAirportTransfersPageSEO] Error:', error);
    return null;
  }
}

/**
 * ====================================
 * TRAVEL GUIDES PAGE
 * ====================================
 */

/**
 * Get Travel Guides Page data
 * @returns {Promise<Object|null>} Travel guides page data
 */
export async function getTravelGuidesPage() {
  try {
    console.log('🗺️  [getTravelGuidesPage] Fetching Travel Guides page...');
    
    const data = await fetchAPI(
      '/travel-guides-page?' +
      'populate[pageHero][populate]=*&' +
      'populate[notices][populate]=*&' +
      'populate[seo][populate]=*'
    );
    
    if (!data || !data.data) {
      console.warn('⚠️  [getTravelGuidesPage] No Travel Guides page found');
      return null;
    }
    
    const page = data.data;
    
    const travelGuidesPage = {
      pageHero: page.pageHero ? {
        kicker: page.pageHero.kicker,
        heading: page.pageHero.heading,
        subtitle: page.pageHero.subtitle,
        backgroundImage: getStrapiImageData(page.pageHero.backgroundImage),
        showBreadcrumbs: page.pageHero.showBreadcrumbs !== false
      } : null,
      
      importantEyebrow: page.importantEyebrow || 'IMPORTANT',
      importantContent: page.importantContent,
      
      showContents: page.showContents !== false,
      contentsTitle: page.contentsTitle || 'Contents',
      
      noticesTitle: page.noticesTitle || 'Travel Notices',
      notices: page.notices || [],
      
      seo: page.seo || null
    };
    
    console.log('✅ [getTravelGuidesPage] Travel Guides page fetched');
    return travelGuidesPage;
  } catch (error) {
    console.error('❌ [getTravelGuidesPage] Error:', error);
    return null;
  }
}

/**
 * Get Travel Guides Page SEO data
 * @returns {Promise<Object|null>} SEO data
 */
export async function getTravelGuidesPageSEO() {
  try {
    console.log('📄 [getTravelGuidesPageSEO] Fetching SEO...');
    
    const data = await fetchAPI('/travel-guides-page?populate[seo][populate]=metaImage');
    
    if (!data || !data.data) {
      console.warn('⚠️  [getTravelGuidesPageSEO] No page found');
      return null;
    }
    
    const page = data.data.attributes || data.data;
    const seo = page.seo;
    
    if (!seo) {
      console.warn('⚠️  [getTravelGuidesPageSEO] No SEO data');
      return null;
    }

    // Extract meta image data with Cloudflare Images optimization
    const metaImageData = getOptimizedSEOImage(seo.metaImage);
    
    if (metaImageData.url) {
      console.log(`📸 Travel Guides page meta image URL (optimized):`, metaImageData.url);
    }
    
    const seoData = {
      metaTitle: seo.metaTitle,
      metaDescription: seo.metaDescription,
      keywords: seo.keywords,
      canonicalURL: seo.canonicalURL,
      metaImage: metaImageData.url,
      metaImageAlt: metaImageData.alt,
      metaImageWidth: metaImageData.width,
      metaImageHeight: metaImageData.height
    };
    
    console.log('✅ [getTravelGuidesPageSEO] SEO fetched');
    return seoData;
  } catch (error) {
    console.error('❌ [getTravelGuidesPageSEO] Error:', error);
    return null;
  }
}

/**
 * ====================================
 * FAQS INDEX PAGE
 * ====================================
 */

/**
 * Get FAQs Index Page data
 * @returns {Promise<Object|null>} FAQs index page data
 */
export async function getFAQsIndexPage() {
  try {
    console.log('❓ [getFAQsIndexPage] Fetching FAQs index page...');
    
    const data = await fetchAPI(
      '/faqs-index-page?' +
      'populate[pageHero][populate]=*&' +
      'populate[seo][populate]=*'
    );
    
    if (!data || !data.data) {
      console.warn('⚠️  [getFAQsIndexPage] No FAQs index page found');
      return null;
    }
    
    const page = data.data.attributes || data.data;
    
    const indexPage = {
      title: page.title,
      displayOnFrontEnd: page.displayOnFrontEnd,
      
      pageHero: page.pageHero ? {
        kicker: page.pageHero.kicker,
        heading: page.pageHero.heading,
        subtitle: page.pageHero.subtitle,
        backgroundImage: getStrapiImageData(page.pageHero.backgroundImage),
        showBreadcrumbs: page.pageHero.showBreadcrumbs !== false
      } : null,
      
      gridHeading: page.gridHeading,
      
      seo: page.seo || null
    };
    
    console.log('✅ [getFAQsIndexPage] FAQs index page fetched');
    return indexPage;
  } catch (error) {
    console.error('❌ [getFAQsIndexPage] Error:', error);
    return null;
  }
}

/**
 * Get FAQs Index Page SEO data
 * @returns {Promise<Object|null>} SEO data
 */
export async function getFAQsIndexPageSEO() {
  try {
    console.log('📄 [getFAQsIndexPageSEO] Fetching SEO...');
    
    const data = await fetchAPI('/faqs-index-page?populate[seo][populate]=metaImage');
    
    if (!data || !data.data) {
      console.warn('⚠️  [getFAQsIndexPageSEO] No page found');
      return null;
    }
    
    const page = data.data.attributes || data.data;
    const seo = page.seo;
    
    if (!seo) {
      console.warn('⚠️  [getFAQsIndexPageSEO] No SEO data');
      return null;
    }
    
    const metaImageData = getOptimizedSEOImage(seo.metaImage);
    
    if (metaImageData.url) {
      console.log(`📸 FAQs index meta image URL (optimized):`, metaImageData.url);
    }
    
    const seoData = {
      metaTitle: seo.metaTitle,
      metaDescription: seo.metaDescription,
      keywords: seo.keywords,
      canonicalURL: seo.canonicalURL,
      metaImage: metaImageData.url,
      metaImageAlt: metaImageData.alt,
      metaImageWidth: metaImageData.width,
      metaImageHeight: metaImageData.height
    };
    
    console.log('✅ [getFAQsIndexPageSEO] SEO fetched');
    return seoData;
  } catch (error) {
    console.error('❌ [getFAQsIndexPageSEO] Error:', error);
    return null;
  }
}

/**
 * ====================================
 * FAQ CATEGORIES
 * ====================================
 */

/**
 * Get all FAQ categories
 * @returns {Promise<Array>} Array of FAQ categories
 */
export async function getFAQCategories() {
  try {
    console.log('❓ [getFAQCategories] Fetching FAQ categories...');
    
    const data = await fetchAPI(
      '/faq-categories?filters[displayOnFrontEnd][$eq]=true&sort=order:asc&populate[faqSections][populate]=faqs'
    );
    
    if (!data || !data.data) {
      console.warn('⚠️  [getFAQCategories] No FAQ categories found');
      return [];
    }
    
    const categories = data.data.map((item) => {
      const cat = item.attributes || item;
      
      // Calculate total FAQ count across all sections
      let totalFaqs = 0;
      if (cat.faqSections && Array.isArray(cat.faqSections)) {
        cat.faqSections.forEach(section => {
          if (section.faqs && Array.isArray(section.faqs)) {
            totalFaqs += section.faqs.length;
          }
        });
      }
      
      return {
        id: item.id,
        title: cat.title,
        slug: cat.slug,
        eyebrow: cat.eyebrow,
        order: cat.order || 0,
        faqCount: totalFaqs
      };
    });
    
    console.log(`✅ [getFAQCategories] Fetched ${categories.length} categories`);
    return categories;
  } catch (error) {
    console.error('❌ [getFAQCategories] Error:', error);
    return [];
  }
}

/**
 * Get FAQ category by slug with all FAQs
 * @param {string} slug - Category slug
 * @returns {Promise<Object|null>} FAQ category data
 */
export async function getFAQCategoryBySlug(slug) {
  if (!slug) {
    console.warn('⚠️  [getFAQCategoryBySlug] No slug provided');
    return null;
  }
  
  try {
    console.log(`❓ [getFAQCategoryBySlug] Fetching category: ${slug}`);
    
    const data = await fetchAPI(
      `/faq-categories?filters[slug][$eq]=${slug}&` +
      'populate[pageHero][populate]=*&' +
      'populate[faqSections][populate]=*&' +
      'populate[seo][populate]=*'
    );
    
    if (!data || !data.data || data.data.length === 0) {
      console.warn(`⚠️  [getFAQCategoryBySlug] Category not found: ${slug}`);
      return null;
    }
    
    const item = data.data[0];
    const cat = item.attributes || item;
    
    const category = {
      id: item.id,
      title: cat.title,
      slug: cat.slug,
      eyebrow: cat.eyebrow,
      
      pageHero: cat.pageHero ? {
        kicker: cat.pageHero.kicker,
        heading: cat.pageHero.heading,
        subtitle: cat.pageHero.subtitle,
        backgroundImage: getStrapiImageData(cat.pageHero.backgroundImage),
        showBreadcrumbs: cat.pageHero.showBreadcrumbs !== false
      } : null,
      
      faqSections: cat.faqSections || [],
      
      seo: cat.seo || null
    };
    
    console.log(`✅ [getFAQCategoryBySlug] Category fetched: ${category.title}`);
    return category;
  } catch (error) {
    console.error(`❌ [getFAQCategoryBySlug] Error fetching ${slug}:`, error);
    return null;
  }
}

/**
 * Get FAQ category SEO data by slug
 * @param {string} slug - Category slug
 * @returns {Promise<Object|null>} SEO data
 */
export async function getFAQCategorySEO(slug) {
  if (!slug) {
    console.warn('⚠️  [getFAQCategorySEO] No slug provided');
    return null;
  }
  
  try {
    console.log(`📄 [getFAQCategorySEO] Fetching SEO for: ${slug}`);
    
    const data = await fetchAPI(
      `/faq-categories?filters[slug][$eq]=${slug}&populate[seo][populate]=metaImage`
    );
    
    if (!data || !data.data || data.data.length === 0) {
      console.warn(`⚠️  [getFAQCategorySEO] Category not found: ${slug}`);
      return null;
    }
    
    const item = data.data[0];
    const cat = item.attributes || item;
    const seo = cat.seo;
    
    if (!seo) {
      console.warn(`⚠️  [getFAQCategorySEO] No SEO data for: ${slug}`);
      return null;
    }
    
    const metaImageData = getOptimizedSEOImage(seo.metaImage);
    
    if (metaImageData.url) {
      console.log(`📸 FAQ category meta image URL (optimized):`, metaImageData.url);
    }
    
    const seoData = {
      metaTitle: seo.metaTitle,
      metaDescription: seo.metaDescription,
      keywords: seo.keywords,
      canonicalURL: seo.canonicalURL,
      metaImage: metaImageData.url,
      metaImageAlt: metaImageData.alt,
      metaImageWidth: metaImageData.width,
      metaImageHeight: metaImageData.height
    };
    
    console.log(`✅ [getFAQCategorySEO] SEO fetched for: ${slug}`);
    return seoData;
  } catch (error) {
    console.error(`❌ [getFAQCategorySEO] Error:`, error);
    return null;
  }
}

/**
 * ====================================
 * BASIC STATIC PAGES
 * ====================================
 */

/**
 * Get all basic static pages
 * @returns {Promise<Array>} Array of static pages
 */
export async function getBasicStaticPages() {
  try {
    console.log('📄 [getBasicStaticPages] Fetching all static pages...');
    
    const data = await fetchAPI(
      '/basic-static-pages?filters[displayOnFrontEnd][$eq]=true'
    );
    
    if (!data || !data.data) {
      console.warn('⚠️  [getBasicStaticPages] No static pages found');
      return [];
    }
    
    const pages = data.data.map((item) => {
      const page = item.attributes || item;
      return {
        id: item.id,
        slug: page.slug,
        title: page.title,
        pageType: page.pageType || 'static-page'
      };
    });
    
    console.log(`✅ [getBasicStaticPages] Fetched ${pages.length} static pages`);
    return pages;
  } catch (error) {
    console.error('❌ [getBasicStaticPages] Error:', error);
    return [];
  }
}

/**
 * Get basic static page by slug
 * @param {string} slug - Page slug
 * @returns {Promise<Object|null>} Static page data
 */
export async function getBasicStaticPageBySlug(slug) {
  if (!slug) {
    console.warn('⚠️  [getBasicStaticPageBySlug] No slug provided');
    return null;
  }
  
  try {
    console.log(`📄 [getBasicStaticPageBySlug] Fetching static page: ${slug}`);
    
    const data = await fetchAPI(
      `/basic-static-pages?filters[slug][$eq]=${slug}&` +
      'populate[pageHero][populate]=*&' +
      'populate[seo][populate]=*'
    );
    
    if (!data || !data.data || data.data.length === 0) {
      console.warn(`⚠️  [getBasicStaticPageBySlug] Page not found: ${slug}`);
      return null;
    }
    
    const item = data.data[0];
    const page = item.attributes || item;
    
    const staticPage = {
      id: item.id,
      slug: page.slug,
      title: page.title,
      pageType: page.pageType || 'static-page',
      displayOnFrontEnd: page.displayOnFrontEnd,
      
      pageHero: page.pageHero ? {
        kicker: page.pageHero.kicker,
        heading: page.pageHero.heading,
        subtitle: page.pageHero.subtitle,
        backgroundImage: getStrapiImageData(page.pageHero.backgroundImage),
        showBreadcrumbs: page.pageHero.showBreadcrumbs !== false
      } : null,
      
      importantEyebrow: page.importantEyebrow,
      importantHeading: page.importantHeading,
      importantContent: page.importantContent,
      content: page.content,
      
      seo: page.seo || null
    };
    
    console.log(`✅ [getBasicStaticPageBySlug] Static page fetched: ${staticPage.title}`);
    return staticPage;
  } catch (error) {
    console.error(`❌ [getBasicStaticPageBySlug] Error fetching ${slug}:`, error);
    return null;
  }
}

/**
 * ====================================
 * SALES LANDING PAGES
 * ====================================
 */

export async function getSalesLandingPages() {
  try {
    console.log('🎯 [getSalesLandingPages] Fetching sales landing pages...');
    
    const data = await fetchAPI(
      '/sales-landing-pages?' +
      'filters[displayOnFrontEnd][$eq]=true&' +
      'fields[0]=slug&fields[1]=title'
    );
    
    if (!data || !data.data) {
      console.warn('⚠️  [getSalesLandingPages] No landing pages found');
      return [];
    }
    
    const pages = data.data.map((item) => {
      const attributes = item.attributes || item;
      return {
        id: item.id,
        slug: attributes.slug,
        title: attributes.title
      };
    });
    
    console.log(`✅ [getSalesLandingPages] Loaded ${pages.length} landing pages`);
    return pages;
  } catch (error) {
    console.error('❌ [getSalesLandingPages] Error:', error);
    return [];
  }
}

export async function getSalesLandingPageBySlug(slug) {
  if (!slug) {
    console.warn('⚠️  [getSalesLandingPageBySlug] No slug provided');
    return null;
  }
  
  try {
    console.log(`🎯 [getSalesLandingPageBySlug] Fetching landing page: ${slug}`);
    
    const data = await fetchAPI(`/sales-landing-pages?filters[slug][$eq]=${slug}&pLevel=5`);
    
    if (!data || !data.data || data.data.length === 0) {
      console.warn(`⚠️  [getSalesLandingPageBySlug] Landing page not found: ${slug}`);
      return null;
    }
    
    const item = data.data[0];
    const page = item.attributes || item;
    
    // Get form data directly from formJson field
    const form = page.formSection?.formJson || null;
    
    const seoData = page.seo ? (() => {
      const metaImage = getOptimizedSEOImage(page.seo.metaImage);
      return {
        ...page.seo,
        metaImage: metaImage.url,
        metaImageAlt: metaImage.alt,
        metaImageWidth: metaImage.width,
        metaImageHeight: metaImage.height
      };
    })() : null;
    
    const landingPage = {
      id: item.id,
      documentId: item.documentId || null,
      slug: page.slug,
      title: page.title,
      displayOnFrontEnd: page.displayOnFrontEnd !== false,
      hero: page.hero ? {
        kicker: page.hero.kicker,
        heading: page.hero.heading,
        subheading: page.hero.subheading,
        backgroundImage: getStrapiImageData(page.hero.backgroundImage),
        primaryButtonLabel: page.hero.primaryButtonLabel,
        primaryButtonUrl: page.hero.primaryButtonUrl,
        secondaryButtonLabel: page.hero.secondaryButtonLabel,
        secondaryButtonUrl: page.hero.secondaryButtonUrl
      } : null,
      highlightCards: page.highlightCards?.map((card) => ({
        id: card.id,
        label: card.label,
        description: card.description,
        linkLabel: card.linkLabel,
        linkUrl: card.linkUrl
      })) || [],
      introSection: page.introSection ? {
        eyebrow: page.introSection.eyebrow,
        heading: page.introSection.heading,
        description: page.introSection.description,
        bulletPoints: page.introSection.bulletPoints?.map((bullet) => ({
          text: bullet.text || bullet
        })) || [],
        buttonLabel: page.introSection.buttonLabel,
        buttonUrl: page.introSection.buttonUrl,
        image: getStrapiImageData(page.introSection.image)
      } : null,
      reviewsSection: page.reviewsSection ? {
        eyebrow: page.reviewsSection.eyebrow,
        heading: page.reviewsSection.heading,
        subtitle: page.reviewsSection.subtitle,
        description: page.reviewsSection.description,
        backgroundImage: getStrapiImageData(page.reviewsSection.backgroundImage),
        ctaLabel: page.reviewsSection.ctaLabel,
        ctaUrl: page.reviewsSection.ctaUrl,
        reviews: page.reviewsSection.reviews?.map((review) => ({
          quote: review.quote,
          authorName: review.authorName,
          authorMeta: review.authorMeta,
          photo: getStrapiImageData(review.photo)
        })) || []
      } : null,
      formSection: page.formSection ? {
        eyebrow: page.formSection.eyebrow,
        heading: page.formSection.heading,
        description: page.formSection.description,
        privacyNote: page.formSection.privacyNote,
        form,
        webhookUrl: page.formSection.webhookUrl || null
      } : null,
      statsSection: page.statsSection ? {
        stats: page.statsSection.stats?.map((stat) => ({
          number: stat.number,
          label: stat.label
        })) || []
      } : null,
      featuresSection: page.featuresSection ? {
        title: page.featuresSection.title,
        subtitle: page.featuresSection.subtitle,
        logos: page.featuresSection.logos?.map((logo) => ({
          logoLabel: logo.logoLabel,
          logoImage: getStrapiImageData(logo.logoImage)
        })) || []
      } : null,
      gallerySection: page.gallerySection ? {
        eyebrow: page.gallerySection.eyebrow,
        heading: page.gallerySection.heading,
        description: page.gallerySection.description,
        ctaLabel: page.gallerySection.ctaLabel,
        ctaUrl: page.gallerySection.ctaUrl,
        tiles: page.gallerySection.tiles?.map((tile) => ({
          label: tile.label,
          subLabel: tile.subLabel,
          image: getStrapiImageData(tile.image)
        })) || []
      } : null,
      termsSection: page.termsSection ? {
        heading: page.termsSection.heading,
        footerNote: page.termsSection.footerNote,
        terms: page.termsSection.terms?.map((term) => ({
          text: term.text || term
        })) || []
      } : null,
      ratingHighlights: page.ratingHighlights?.map((rating) => ({
        score: rating.score,
        label: rating.label,
        description: rating.description
      })) || [],
      seo: seoData
    };
    
    console.log(`✅ [getSalesLandingPageBySlug] Landing page fetched: ${landingPage.title}`);
    return landingPage;
  } catch (error) {
    console.error(`❌ [getSalesLandingPageBySlug] Error fetching ${slug}:`, error);
    return null;
  }
}

/**
 * Fetch redirects managed in Strapi
 */
export async function getRedirects() {
  try {
    const params = [
      'filters[enabled][$eq]=true',
      'pagination[pageSize]=500',
      'sort[0]=sourcePath:desc'
    ].join('&');

    const data = await fetchAPI(`/redirects?${params}`);

    if (!data || !data.data) {
      return [];
    }

    const normalizePath = (value) => {
      if (!value) return null;
      let path = value.trim().toLowerCase();
      if (!path) return null;
      if (!path.startsWith('/')) {
        path = `/${path}`;
      }
      // collapse multiple slashes
      path = path.replace(/\/{2,}/g, '/');
      return path;
    };

    return data.data
      .map((item) => item.attributes || item)
      .map((redirect) => {
        const sourcePath = normalizePath(redirect.sourcePath);
        const destinationPath = normalizePath(redirect.destinationPath);
        if (!sourcePath || !destinationPath) {
          return null;
        }
        return {
          sourcePath,
          destinationPath,
          statusCode: parseInt(redirect.statusCode, 10) === 301 ? 301 : 302,
          notes: redirect.notes || null
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.sourcePath.length - a.sourcePath.length);
  } catch (error) {
    console.error('❌ [getRedirects] Failed to load redirects:', error);
    return [];
  }
}

/**
 * Get all people/team members from Team single-type
 * @returns {Promise<Array>} Array of people
 */
export async function getPeople() {
  try {
    console.log('👥 [getPeople] Fetching team members...');
    
    const data = await fetchAPI(
      '/team?populate[teamMembers][populate]=profile_image_people'
    );
    
    if (!data || !data.data) {
      console.warn('⚠️  [getPeople] No team data found');
      return [];
    }
    
    const team = data.data.attributes || data.data;
    const teamMembers = team.teamMembers || [];
    
    // Sort by order_people field
    const sortedPeople = teamMembers
      .sort((a, b) => (a.order_people || 0) - (b.order_people || 0))
      .map((person) => ({
        id: person.id,
        name: person.full_name,
        role: person.job_title,
        bio: person.short_description_people,
        image: getStrapiImageData(person.profile_image_people),
        linkedin: person.linkedin_url,
        email: person.email_address_people,
        website: person.website_person
      }));
    
    console.log(`✅ [getPeople] Fetched ${sortedPeople.length} team members`);
    return sortedPeople;
  } catch (error) {
    console.error('❌ [getPeople] Error:', error);
    return [];
  }
}
/**
 * Get Join The Team page data from Strapi
 * @returns {Promise<Object>} Join the team page data
 */
export async function getJoinTheTeamPage() {
  try {
    console.log('👥 [getJoinTheTeamPage] Fetching page data...');
    
    const data = await fetchAPI(
      '/join-the-team-page?' +
      'populate[0]=pageHero.backgroundImage&' +
      'populate[1]=quote.authorImages&' +
      'populate[2]=quote.decorativeIcon&' +
      'populate[3]=twoColumnContent.leftBlock.image&' +
      'populate[4]=twoColumnContent.rightBlock.image&' +
      'populate[5]=ourValues&' +
      'populate[6]=learnAboutUs.backgroundImage&' +
      'populate[7]=formSection&' +
      'populate[8]=faq.faqs&' +
      'populate[9]=seo.metaImage'
    );
    
    if (!data || !data.data) {
      console.warn('⚠️  [getJoinTheTeamPage] No page data found');
      return null;
    }
    
    const attributes = data.data.attributes || data.data;
    
    console.log('🔍 [getJoinTheTeamPage] Attributes keys:', Object.keys(attributes));
    
    // Debug two column content
    if (attributes.twoColumnContent) {
      console.log('🔍 [getJoinTheTeamPage] twoColumnContent exists');
      console.log('🔍 [getJoinTheTeamPage] leftBlock exists?', !!attributes.twoColumnContent.leftBlock);
      console.log('🔍 [getJoinTheTeamPage] rightBlock exists?', !!attributes.twoColumnContent.rightBlock);
      if (attributes.twoColumnContent.leftBlock) {
        console.log('🔍 [getJoinTheTeamPage] leftBlock.image exists?', !!attributes.twoColumnContent.leftBlock.image);
        console.log('🔍 [getJoinTheTeamPage] leftBlock.image:', attributes.twoColumnContent.leftBlock.image);
      }
      if (attributes.twoColumnContent.rightBlock) {
        console.log('🔍 [getJoinTheTeamPage] rightBlock.image exists?', !!attributes.twoColumnContent.rightBlock.image);
      }
    }
    
    return {
      pageHero: attributes.pageHero ? {
        heading: attributes.pageHero.heading,
        subtitle: attributes.pageHero.subtitle,
        kicker: attributes.pageHero.kicker,
        backgroundImage: getStrapiImageData(attributes.pageHero.backgroundImage),
        showBreadcrumbs: attributes.pageHero.showBreadcrumbs ?? true
      } : null,
      
      quote: attributes.quote ? {
        eyebrow: attributes.quote.eyebrow,
        quoteText: attributes.quote.quoteText,
        authorName: attributes.quote.authorName,
        authorImages: getStrapiImagesData(attributes.quote.authorImages),
        decorativeIcon: getStrapiImageData(attributes.quote.decorativeIcon)
      } : null,
      
      twoColumnContent: attributes.twoColumnContent ? {
        eyebrow: attributes.twoColumnContent.eyebrow,
        leftBlock: attributes.twoColumnContent.leftBlock ? {
          heading: attributes.twoColumnContent.leftBlock.heading,
          content: attributes.twoColumnContent.leftBlock.content,
          image: getStrapiImageData(attributes.twoColumnContent.leftBlock.image)
        } : null,
        rightBlock: attributes.twoColumnContent.rightBlock ? {
          heading: attributes.twoColumnContent.rightBlock.heading,
          content: attributes.twoColumnContent.rightBlock.content,
          image: getStrapiImageData(attributes.twoColumnContent.rightBlock.image)
        } : null
      } : null,
      
      valuesEyebrow: attributes.valuesEyebrow || 'WHY JOIN US',
      valuesHeading: attributes.valuesHeading || 'Our Values',
      ourValues: (attributes.ourValues || []).map(value => ({
        title: value.title,
        description: value.description
      })),
      
      learnAboutUs: attributes.learnAboutUs ? {
        eyebrow: attributes.learnAboutUs.eyebrow,
        heading: attributes.learnAboutUs.heading,
        description: attributes.learnAboutUs.description,
        buttonText: attributes.learnAboutUs.buttonText,
        buttonLink: attributes.learnAboutUs.buttonLink,
        backgroundImage: getStrapiImageData(attributes.learnAboutUs.backgroundImage)
      } : null,
      
      formSection: attributes.formSection ? {
        eyebrow: attributes.formSection.eyebrow,
        heading: attributes.formSection.heading,
        description: attributes.formSection.description,
        privacyNote: attributes.formSection.privacyNote,
        formJson: attributes.formSection.formJson,
        webhookUrl: attributes.formSection.webhookUrl
      } : null,
      
      faq: attributes.faq ? {
        eyebrow: attributes.faq.eyebrow,
        heading: attributes.faq.heading || 'Frequently Asked Questions',
        faqs: (attributes.faq.faqs || []).map(item => ({
          question: item.question,
          answer: item.answer
        }))
      } : null,
      
      seo: attributes.seo ? {
        metaTitle: attributes.seo.metaTitle,
        metaDescription: attributes.seo.metaDescription,
        metaImage: getStrapiImageData(attributes.seo.metaImage),
        metaImageAlt: attributes.seo.metaImageAlt,
        metaImageWidth: attributes.seo.metaImageWidth,
        metaImageHeight: attributes.seo.metaImageHeight,
        keywords: attributes.seo.keywords,
        canonicalURL: attributes.seo.canonicalURL
      } : null
    };
    
  } catch (error) {
    console.error('❌ [getJoinTheTeamPage] Error:', error);
    throw error;
  }
}

/**
 * Get Join The Team page SEO data
 * @returns {Promise<Object|null>} SEO data or null
 */
export async function getJoinTheTeamPageSEO() {
  try {
    const data = await fetchAPI('/join-the-team-page?fields[0]=id&populate[seo][populate]=metaImage');
    
    if (!data || !data.data || !data.data.attributes?.seo) {
      return null;
    }
    
    const seo = data.data.attributes.seo;
    
    return {
      metaTitle: seo.metaTitle,
      metaDescription: seo.metaDescription,
      metaImage: getStrapiImageData(seo.metaImage),
      metaImageAlt: seo.metaImageAlt,
      metaImageWidth: seo.metaImageWidth,
      metaImageHeight: seo.metaImageHeight,
      keywords: seo.keywords,
      canonicalURL: seo.canonicalURL
    };
    
  } catch (error) {
    console.warn('⚠️  [getJoinTheTeamPageSEO] Could not fetch SEO data:', error.message);
    return null;
  }
}

/**
 * Get WhatsApp Groups Page SEO data
 * @returns {Promise<Object|null>} SEO data for WhatsApp Groups page
 */
export async function getWhatsappGroupsPageSEO() {
  try {
    console.log('📄 [getWhatsappGroupsPageSEO] Fetching SEO...');
    
    const data = await fetchAPI('/whatsapp-groups-page?populate[seo][populate]=metaImage');
    
    if (!data || !data.data) {
      console.warn('⚠️  [getWhatsappGroupsPageSEO] No page found');
      return null;
    }
    
    const page = data.data.attributes || data.data;
    const seo = page.seo;
    
    if (!seo) {
      console.warn('⚠️  [getWhatsappGroupsPageSEO] No SEO data');
      return null;
    }

    const metaImageData = getOptimizedSEOImage(seo.metaImage);
    
    const seoData = {
      metaTitle: seo.metaTitle,
      metaDescription: seo.metaDescription,
      keywords: seo.keywords,
      canonicalURL: seo.canonicalURL || 'https://activeaway.com/whatsapp-groups',
      metaImage: metaImageData.url,
      metaImageAlt: metaImageData.alt,
      metaImageWidth: metaImageData.width,
      metaImageHeight: metaImageData.height
    };
    
    console.log('✅ [getWhatsappGroupsPageSEO] SEO fetched');
    return seoData;
  } catch (error) {
    console.error('❌ [getWhatsappGroupsPageSEO] Error:', error);
    return null;
  }
}

/**
 * ====================================
 * SEARCH RESULTS PAGE
 * ====================================
 */

/**
 * Fetch search-results page data from Strapi
 * @returns {Promise<Object|null>} Search results page data with hero and SEO
 */
export async function getSearchResultsPage() {
  try {
    console.log('🔍 [getSearchResultsPage] Fetching search results page data...');
    
    const data = await fetchAPI(
      '/search-results-page?populate[pageHero][populate]=*&populate[seo][populate]=*'
    );
    
    if (!data || !data.data) {
      console.warn('⚠️  [getSearchResultsPage] No data found');
      return null;
    }
    
    const pageData = data.data.attributes || data.data;
    
    const result = {
      pageHero: pageData.pageHero ? {
        kicker: pageData.pageHero.kicker || '',
        heading: pageData.pageHero.heading || 'Your Event Search',
        subtitle: pageData.pageHero.subtitle || 'Please complete your booking below',
        backgroundImage: getStrapiImageData(pageData.pageHero.backgroundImage),
        showBreadcrumbs: pageData.pageHero.showBreadcrumbs !== false
      } : null,
      
      seo: pageData.seo || null
    };
    
    console.log('✅ [getSearchResultsPage] Data fetched successfully');
    return result;
  } catch (error) {
    console.error('❌ [getSearchResultsPage] Error:', error);
    return null;
  }
}

/**
 * Fetch search-results page SEO data from Strapi
 * @returns {Promise<Object|null>} SEO data
 */
export async function getSearchResultsPageSEO() {
  return getPageSEO('search-results-page');
}
