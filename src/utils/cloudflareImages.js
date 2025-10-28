// Cloudflare Images API utility functions
const CLOUDFLARE_ACCOUNT_HASH = '-aT8Z2F9gGvZ9fdofZcCaQ';
const CLOUDFLARE_BASE_URL = `https://activeaway.com/cdn-cgi/imagedelivery/${CLOUDFLARE_ACCOUNT_HASH}`;

// Image mapping for Cloudflare IDs
const IMAGE_MAPPING = {
  'hero-bg': '03bade93-3cf6-49b0-047f-a9eb556aa200',
  'logo': 'eedabea1-97ba-419d-35b4-98a08f3d0300',
  'man-1': '182d9302-4485-432a-479a-96b2b995f300',
  'man-2': '828f5d00-3d19-4fd5-0e8a-e3b1ee471b00',
  'man-3': 'c6048724-cc4f-405c-4bcc-811f8c74b700',
  'man-4': 'c791b2d7-a9c2-4e3b-887a-86bfb2f53f00',
  'about-us-1': 'fcc69dfe-1915-4cf6-61a4-025bbfcf2800',
  'about-us-2': 'c535e47a-3d15-4739-3c73-33f7fbb85400',
  'event-1': '165f3b14-f542-47fc-7b45-60beb2da0f00',
  'event-2': 'cc442461-b507-4bcd-e312-ee5e70449100',
  'event-3': '51e6e17a-0fe8-4a9b-9480-77ffb970f000',
  'location-1': '4d4726f4-1afd-4d8f-cbe9-609d581a1000',
  'location-2': '6d6cddb4-0436-40a4-252a-4fd079d23600',
  'location-3': '0d56cbee-cb80-4756-717b-b8752aadc000',
  'section-4-bg': '0e7d134c-25ac-45d1-abbe-3802f4d3fe00',
  'partner-1': 'b56e2113-bbbb-417e-6fd3-0243cb02b000',
  'partner-2': '4a7b3859-a76e-49bb-41b5-b4fa30194e00',
  'partner-3': '45c8453d-8665-4547-1805-e7282082e800',
  'partner-4': 'c889e707-028a-4bec-367a-fcd9f82dd100',
  'partner-5': '3bd31a76-b1a0-4d54-3ec5-8ff3b8eace00',
  'racket-specialist-bg': 'e6aae9dd-74e5-4fa8-c0f5-fc81643bea00',
  'racket-specialist-overlay': '44c06903-bd3a-4e68-ef36-e2690c8c1000',
  'racket-specialist-mask': '2213b621-694f-4731-95ad-7ead0228fd00',
  'thriving-community-bg': '8c97840b-210b-42f7-a8ce-f97dbe334800',
  'thriving-community-1': '99f6a01b-7e88-40c5-2410-980ce0a5a600',
  'thriving-community-2': '0aa13377-6c35-41ad-1842-e029396c3300',
  'offer-1': '931467e2-aeed-49b6-7318-af720b980d00',
  'offer-2': '7aacd870-f6bd-4803-b4a7-d054cb918900',
  'story-1': '115a3a90-8da5-4d07-8ece-29567a7fde00',
  'story-2': '6e5aee1a-69cf-4fa3-9cb3-189f41bf5c00',
  'story-3': '9ba2a032-91cc-4ae1-bb20-ef6d41635600',
  'story-4': 'c451d3b5-c3cb-49da-9eee-7b78e1213300',
  'story-5': 'ab4d08d4-30bb-4d5e-75ca-fada72240500',
  'story-6': '22a01123-05b2-4ade-2dcf-27176ce76100',
  'story-7': '463bb099-e5a5-45ca-36a2-a885537a7d00',
  'google-icon': '415213dc-060c-4c99-56c2-e86d4c988100',
  'blog-1': '3d9840b3-49ef-494c-e245-c3c9fe2a1700',
  'blog-2': '3c17fc9b-87a6-4aeb-d1b7-503b1085c300',
  'blog-3': '26c46489-e992-4fe5-9525-ac5900ac7200',
  'gallery-1': 'c086026c-a263-4257-47f0-81792108a500',
  'gallery-2': 'b5140375-f7d9-4eab-cbad-926e42fc2400',
  'gallery-3': 'cd91307f-8703-472f-4786-b8aa696db000',
  'gallery-4': '6e39a1fc-f006-4930-d5c9-25a94c62c500',
  'gallery-5': 'b834910c-b502-434a-1a0d-9128f26ede00',
  'instagram-icon': '9ebe88b7-4be7-4c4f-e322-53d5011b1200',
  'footer-logo': '3da5e152-28af-431c-ac5e-eb7188168a00',
  'footer-calling-icon': 'a689b567-cd19-43b4-08f7-6a46eb6e1d00',
  'footer-facebook-icon': 'ae5c52dd-db35-491d-89e6-da4c3deb1900',
  'footer-instagram-icon': '7d468354-d426-4ca6-0846-995cce67a100',
  'footer-linkedin-icon': '60547a30-8aa1-413f-3a71-c4caa5b1f700',
  'footer-location-icon': '969333ce-6684-4aec-18b4-1f8083ce2900',
  'footer-mail-icon': 'f8068b30-8107-4b2c-96f1-6d0e304a5700',
  'footer-trustpilot-icon': 'bfa8a6f4-cb1e-44d6-e929-cda460c81e00',
  'footer-protection-1': '9fe5bc63-1043-44c8-cd41-7cf36c5c2200',
  'footer-protection-2': '25e86a0f-ee67-4c6b-7925-e1c21db4b900',
  // Add more mappings as needed
};

/**
 * Get Cloudflare image URL with optimization options
 * @param {string} imageId - Cloudflare image ID (e.g., 'eedabea1-97ba-419d-35b4-98a08f3d0300')
 * @param {Object} options - Image optimization options
 * @param {number} options.width - Image width in pixels
 * @param {number} options.height - Image height in pixels
 * @param {string} options.fit - Fit mode ('scale-down', 'contain', 'cover', 'crop', 'pad')
 * @param {string} options.format - Image format ('auto', 'webp', 'avif', 'jpeg', 'png')
 * @param {number} options.quality - Image quality (1-100)
 * @param {string} options.size - Legacy size format ('public', '480x270', etc.) - for backwards compatibility
 * @returns {string} Complete Cloudflare image URL
 */
export function getCloudflareImageUrl(imageId, options = {}) {
  const {
    width,
    height,
    fit = 'scale-down',
    format = 'auto',
    quality = 85,
    size // Legacy size option
  } = options;

  // Use legacy size format if provided (for backwards compatibility)
  if (size) {
    return `${CLOUDFLARE_BASE_URL}/${imageId}/${size}`;
  }

  // Build URL with flexible variant (using query params for transformations)
  let url = `${CLOUDFLARE_BASE_URL}/${imageId}/public`;
  
  const params = [];
  if (width) params.push(`width=${width}`);
  if (height) params.push(`height=${height}`);
  if (fit) params.push(`fit=${fit}`);
  if (format) params.push(`format=${format}`);
  if (quality) params.push(`quality=${quality}`);
  
  if (params.length > 0) {
    url += `?${params.join('&')}`;
  }

  return url;
}

/**
 * Get image URL by name (using mapping)
 * @param {string} imageName - Image name from mapping (e.g., 'logo', 'hero-bg')
 * @param {Object} options - Image optimization options
 * @returns {string} Complete Cloudflare image URL
 */
export function getImageByName(imageName, options = {}) {
  const imageId = IMAGE_MAPPING[imageName];
  
  if (!imageId) {
    console.warn(`No Cloudflare ID found for image: ${imageName}`);
    return null;
  }

  return getCloudflareImageUrl(imageId, options);
}

/**
 * Generate responsive srcset for an image
 * @param {string} imageId - Cloudflare image ID
 * @param {Array} widths - Array of widths [480, 768, 1200, 1920] or custom config [{width, height}]
 * @param {Object} baseOptions - Base options to apply to all sizes (format, quality, fit)
 * @returns {string} srcset string
 */
export function generateSrcSet(imageId, widths = [480, 768, 1024, 1280, 1920], baseOptions = {}) {
  return widths
    .map((config) => {
      // Handle both simple width arrays and complex config objects
      const width = typeof config === 'number' ? config : config.width;
      const height = typeof config === 'object' ? config.height : undefined;
      
      const url = getCloudflareImageUrl(imageId, {
        width,
        height,
        ...baseOptions
      });
      return `${url} ${width}w`;
    })
    .join(', ');
}

/**
 * Get responsive image attributes for a given display size
 * @param {string} imageId - Cloudflare image ID
 * @param {Object} config - Configuration
 * @param {number} config.displayWidth - Width the image will be displayed at (in CSS pixels)
 * @param {number} config.displayHeight - Height the image will be displayed at (in CSS pixels)
 * @param {string} config.fit - Fit mode ('cover', 'contain', 'scale-down')
 * @param {string} config.alt - Alt text
 * @param {number} config.aspectRatio - Aspect ratio (width/height) for calculating heights
 * @returns {Object} Object with src, srcset, width, height, sizes
 */
export function getResponsiveImageAttrs(imageId, config = {}) {
  const {
    displayWidth,
    displayHeight,
    fit = 'cover',
    alt = '',
    aspectRatio = 16 / 9
  } = config;

  // Generate responsive widths based on display size (1x, 2x for retina)
  const widths = displayWidth 
    ? [
        displayWidth, // 1x
        Math.round(displayWidth * 1.5), // 1.5x
        Math.round(displayWidth * 2), // 2x (retina)
      ]
    : [480, 768, 1024, 1280]; // Default responsive widths

  // Calculate heights if aspect ratio is provided
  const configs = widths.map(w => {
    const h = displayHeight || Math.round(w / aspectRatio);
    return { width: w, height: h };
  });

  const src = getCloudflareImageUrl(imageId, {
    width: widths[0],
    height: configs[0].height,
    fit,
    format: 'auto',
    quality: 85
  });

  const srcset = generateSrcSet(imageId, configs, { fit, format: 'auto', quality: 85 });

  // Generate sizes attribute (helps browser pick right image)
  const sizes = displayWidth 
    ? `(max-width: ${displayWidth}px) 100vw, ${displayWidth}px`
    : '100vw';

  return {
    src,
    srcset,
    width: widths[0],
    height: configs[0].height,
    sizes,
    alt,
    loading: 'lazy'
  };
}

/**
 * Add new image mapping
 * @param {string} imageName - Image name
 * @param {string} imageId - Cloudflare image ID
 */
export function addImageMapping(imageName, imageId) {
  IMAGE_MAPPING[imageName] = imageId;
}

/**
 * Get all image mappings
 * @returns {Object} All image mappings
 */
export function getAllImageMappings() {
  return { ...IMAGE_MAPPING };
}

/**
 * Extract Cloudflare image ID from a URL
 * @param {string} url - Cloudflare image URL
 * @returns {string|null} Image ID or null if not found
 */
export function extractImageId(url) {
  if (!url) return null;
  
  // Match pattern: /imagedelivery/{hash}/{imageId}/...
  // Handles both:
  // - https://activeaway.com/cdn-cgi/imagedelivery/-aT8Z2F9gGvZ9fdofZcCaQ/3b40f4d8-c0c6-417f-aeef-343af3a69000/public
  // - https://imagedelivery.net/-aT8Z2F9gGvZ9fdofZcCaQ/activeaway.com/Sani-Beach-Tennis-Courts.jpg/public
  const match = url.match(/\/imagedelivery\/[^/]+\/([^/]+)/);
  
  if (!match) return null;
  
  const extracted = match[1];
  
  // Check if extracted value is a UUID/hash (alphanumeric with dashes)
  // UUIDs are like: 3b40f4d8-c0c6-417f-aeef-343af3a69000
  const isUUID = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(extracted);
  
  if (isUUID) {
    return extracted;
  }
  
  // If it's not a UUID, it might be a path like "activeaway.com/Sani-Beach-Tennis-Courts.jpg"
  // In this case, we should return null and use the original URL
  return null;
}

/**
 * Helper to get optimized Strapi image attributes
 * @param {Object} strapiImage - Strapi image object with url property
 * @param {Object} config - Same as getResponsiveImageAttrs config
 * @returns {Object} Responsive image attributes or original if not Cloudflare
 */
export function getStrapiImageAttrs(strapiImage, config = {}) {
  if (!strapiImage || !strapiImage.url) {
    return null;
  }

  // Extract Cloudflare image ID from Strapi URL
  const imageId = extractImageId(strapiImage.url);
  
  if (imageId) {
    // Use our responsive helper for Cloudflare images
    return getResponsiveImageAttrs(imageId, {
      alt: strapiImage.alt || config.alt || '',
      ...config
    });
  }

  // Fallback for non-Cloudflare images
  return {
    src: strapiImage.url,
    width: strapiImage.width,
    height: strapiImage.height,
    alt: strapiImage.alt || config.alt || '',
    loading: 'lazy'
  };
}

