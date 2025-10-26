// Strapi API utility functions
const STRAPI_URL = import.meta.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = import.meta.env.STRAPI_API_TOKEN || '';

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

  // Add authorization header if token is available
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
 * Fetch upcoming events
 * @returns {Promise<Array>} Array of upcoming event data
 */
export async function getUpcomingEvents() {
  try {
    const today = new Date().toISOString();
    const data = await fetchAPI(`/events?filters[date][$gte]=${today}&populate=*&sort=date:asc`);
    return data.data || [];
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
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
    
    // Debug: Log simple info
    console.log('📦 Strapi Home - Has data:', !!data.data);
    console.log('📦 Has header_image field:', !!data.data?.header_image);
    if (data.data?.header_image) {
      console.log('📸 header_image URL:', data.data.header_image.url);
    }
    
    return data.data || null;
  } catch (error) {
    console.error('Error fetching home page:', error);
    return null;
  }
}

/**
 * Get featured locations for homepage carousel
 * Fetches from Featured Locations collection which references multiple holiday types
 * @returns {Promise<Array>} Array of normalized location objects
 */
export async function getFeaturedLocations() {
  try {
    // Fetch all active featured locations, sorted by order
    // Populate all possible holiday type relations and their images
    const response = await fetchAPI(
      '/featured-locations?' +
      'filters[active]=true&' +
      'sort=order:asc&' +
      'populate[tennis_holiday][populate][0]=mainHeaderImage&' +
      'populate[tennis_holiday][populate][1]=featuredImageLg&' +
      'populate[pickleball_holiday][populate][0]=featuredImage&' +
      'populate[pickleball_holiday][populate][1]=headerImage&' +
      'populate[junior_tennis_camp][populate][0]=featuredImage&' +
      'populate[junior_tennis_camp][populate][1]=headerImage&' +
      'populate[padel_tennis_holiday][populate][0]=featuredImage&' +
      'populate[padel_tennis_holiday][populate][1]=headerImage&' +
      'populate[play_and_watch][populate][0]=featuredImage&' +
      'populate[play_and_watch][populate][1]=headerImage&' +
      'populate[ski_holiday][populate][0]=featuredImage&' +
      'populate[ski_holiday][populate][1]=headerImage&' +
      'populate[tennis_clinic][populate][0]=featuredImage&' +
      'populate[tennis_clinic][populate][1]=headerImage'
    );
    
    if (!response?.data) {
      console.warn('⚠️  No featured locations found');
      return [];
    }

    // Map and normalize the data from different holiday types
    const locations = response.data.map((item, index) => {
      // Get the actual holiday based on holiday_type
      const holidayType = item.holiday_type;
      const holiday = item[holidayType.replace('-', '_')];
      
      if (!holiday) {
        console.warn(`⚠️  Featured location ${item.id} has no ${holidayType} reference`);
        return null;
      }

      // Get the appropriate image field based on holiday type
      let imageField;
      if (holidayType === 'tennis-holiday') {
        imageField = holiday.mainHeaderImage || holiday.featuredImageLg;
      } else {
        imageField = holiday.featuredImage || holiday.headerImage;
      }
      
      const imageData = getStrapiImageData(imageField);

      // Build location string - use country directly
      const location = holiday.country || '';

      // Build price text - only show if singleOccupancyFrom exists
      const priceText = holiday.singleOccupancyFrom 
                       ? `Single Occupancy from £${holiday.singleOccupancyFrom}` 
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
        price: priceText, // Can be null if singleOccupancyFrom doesn't exist
        amount: holiday.priceFrom || holiday.singleOccupancyFrom 
               ? `from £${holiday.priceFrom || holiday.singleOccupancyFrom}pp` 
               : null,
        image: imageData.url,
        imageAlt: imageData.alt || holiday.title,
        imageSrcSet: imageData.formats ? generateSrcSetFromFormats(imageData.formats) : undefined,
        slug: holiday.slug || '',
        holidayType: holidayType,
        active: index === 1 // Middle card active by default for carousel
      };
    }).filter(Boolean); // Remove null entries

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

