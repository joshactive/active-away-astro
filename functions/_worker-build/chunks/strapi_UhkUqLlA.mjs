globalThis.process ??= {}; globalThis.process.env ??= {};
// Cloudflare Images API utility functions
const CLOUDFLARE_ACCOUNT_HASH = '-aT8Z2F9gGvZ9fdofZcCaQ';
const CLOUDFLARE_BASE_URL = `https://activeaway.com/cdn-cgi/imagedelivery/${CLOUDFLARE_ACCOUNT_HASH}`;

// Image mappings for Cloudflare IDs
const IMAGE_MAPPING = {
  'hero-bg': '03bade93-3cf6-49b0-047f-a9eb556aa200',
  'logo': '4a4fae2f-b29c-4e69-5a9e-acf953fd3c00',
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
  'footer-logo': '4a4fae2f-b29c-4e69-5a9e-acf953fd3c00',
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
function getCloudflareImageUrl(imageId, options = {}) {
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
function getImageByName(imageName, options = {}) {
  const imageId = IMAGE_MAPPING[imageName];
  
  if (!imageId) {
    console.warn(`No Cloudflare ID found for image: ${imageName}`);
    return null;
  }

  return getCloudflareImageUrl(imageId, options);
}

/**
 * Get responsive image attributes by mapped image name
 * @param {string} imageName - Image name from mapping
 * @param {Object} config - Same config as getResponsiveImageAttrs
 * @returns {Object|null} Responsive image attributes or null if mapping missing
 */
function getResponsiveImageByName(imageName, config = {}) {
  const imageId = IMAGE_MAPPING[imageName];
  
  if (!imageId) {
    console.warn(`No Cloudflare ID found for image: ${imageName}`);
    return null;
  }

  return getResponsiveImageAttrs(imageId, config);
}

/**
 * Generate responsive srcset for an image
 * @param {string} imageId - Cloudflare image ID
 * @param {Array} widths - Array of widths [480, 768, 1200, 1920] or custom config [{width, height}]
 * @param {Object} baseOptions - Base options to apply to all sizes (format, quality, fit)
 * @returns {string} srcset string
 */
function generateSrcSet(imageId, widths = [480, 768, 1024, 1280, 1920], baseOptions = {}) {
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
function getResponsiveImageAttrs(imageId, config = {}) {
  const {
    displayWidth,
    displayHeight,
    fit = 'cover',
    alt = '',
    aspectRatio = 16 / 9,
    quality = 85
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
    quality
  });

  const srcset = generateSrcSet(imageId, configs, { fit, format: 'auto', quality });

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
    loading: 'lazy',
    url: src
  };
}

/**
 * Extract Cloudflare image ID from a URL
 * @param {string} url - Cloudflare image URL
 * @returns {string|null} Image ID or null if not found
 */
function extractImageId(url) {
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
 * Check if URL is a Cloudflare Images URL
 * @param {string} url - URL to check
 * @returns {boolean} True if it's a Cloudflare Images URL
 */
function isCloudflareImageUrl(url) {
  if (!url) return false;
  return url.includes('/imagedelivery/') || url.includes('cdn-cgi/imagedelivery');
}

/**
 * Get base Cloudflare URL without variant or query params
 * @param {string} url - Full Cloudflare image URL
 * @returns {string} Base URL without /variant or ?params
 */
function getCloudflareBaseUrl(url) {
  // Remove variant (like /public, /thumbnail) and any query params
  // For path-based URLs, we need to capture the full path, not just the first segment
  // Example: /imagedelivery/{hash}/activeaway.com/path/to/image.jpg/public
  // Should extract: /imagedelivery/{hash}/activeaway.com/path/to/image.jpg
  
  // First, remove query params
  const urlWithoutParams = url.split('?')[0];
  
  // Check if it ends with a known variant
  const knownVariants = ['/public', '/thumbnail', '/avatar', '/small', '/medium', '/large'];
  for (const variant of knownVariants) {
    if (urlWithoutParams.endsWith(variant)) {
      return urlWithoutParams.slice(0, -variant.length);
    }
  }
  
  // If no known variant at the end, try to match the pattern and remove the last segment
  return urlWithoutParams.replace(/\/[^/]+$/, '');
}

/**
 * Helper to get optimized Strapi image attributes
 * @param {Object} strapiImage - Strapi image object with url property
 * @param {Object} config - Same as getResponsiveImageAttrs config
 * @returns {Object} Responsive image attributes or original if not Cloudflare
 */
function getStrapiImageAttrs(strapiImage, config = {}) {
  if (!strapiImage || !strapiImage.url) {
    return null;
  }

  const url = strapiImage.url;
  
  // Check if it's a Cloudflare image (either UUID or path-based)
  if (isCloudflareImageUrl(url)) {
    const {
      displayWidth = 800,
      displayHeight,
      fit = 'cover',
      alt = '',
      quality = 85
    } = config;
    
    // Get base URL without variant
    const baseUrl = getCloudflareBaseUrl(url);
    
    // Calculate heights based on aspect ratio if not provided
    const aspectRatio = displayHeight ? displayWidth / displayHeight : 16 / 9;
    
    // Generate responsive widths (1x, 1.5x, 2x)
    const widths = [
      displayWidth,
      Math.round(displayWidth * 1.5),
      Math.round(displayWidth * 2)
    ];
    
    // Build srcset
    const srcsetParts = widths.map(w => {
      const h = displayHeight || Math.round(w / aspectRatio);
      const params = new URLSearchParams({
        width: w.toString(),
        height: h.toString(),
        fit,
        format: 'auto',
        quality: quality.toString()
      });
      return `${baseUrl}/public?${params.toString()} ${w}w`;
    });
    
    // Build src (use 1x size)
    const srcParams = new URLSearchParams({
      width: widths[0].toString(),
      height: (displayHeight || Math.round(widths[0] / aspectRatio)).toString(),
      fit,
      format: 'auto',
      quality: quality.toString()
    });
    
    return {
      src: `${baseUrl}/public?${srcParams.toString()}`,
      srcset: srcsetParts.join(', '),
      sizes: config.sizes || `(max-width: ${displayWidth}px) 100vw, ${displayWidth}px`,
      width: widths[0],
      height: displayHeight || Math.round(widths[0] / aspectRatio),
      alt: strapiImage.alt || alt,
      loading: 'lazy',
      url: `${baseUrl}/public?${srcParams.toString()}`
    };
  }

  // Extract UUID for legacy support
  const imageId = extractImageId(url);
  
  if (imageId) {
    // Use our responsive helper for UUID-based Cloudflare images
    return getResponsiveImageAttrs(imageId, {
      alt: strapiImage.alt || config.alt || '',
      ...config
    });
  }

  // Fallback for non-Cloudflare images
  return {
    src: url,
    width: strapiImage.width,
    height: strapiImage.height,
    alt: strapiImage.alt || config.alt || '',
    loading: 'lazy',
    url
  };
}

const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "PUBLIC_TURNSTILE_SITE_KEY": "0x4AAAAAAB9Kq5NzSwkzyLBP", "SITE": "https://activeaway.com", "SSR": true};
const DEFAULT_STRAPI_URL = "http://localhost:1337";
const DEFAULT_STRAPI_TOKEN = "";
function getRuntimeEnv() {
  if (typeof globalThis === "undefined") return void 0;
  return globalThis.__RUNTIME_ENV__ || globalThis.__env || globalThis.__env__ || globalThis.ENV;
}
function getEnvValue(key, fallback = "") {
  try {
    if (typeof import.meta !== "undefined" && Object.assign(__vite_import_meta_env__, { STRAPI_URL: "https://strapi-production-b96d.up.railway.app", STRAPI_API_TOKEN: "eefa701cf9f771a8825d61d29bd6b31ce72ef83549d9c7f56e5e1f52ac208aef3e644a61772ba13cfc6ddffd201d662342f1ac04e02f4bf448bd2804aefaea0003efd6e75b2cd3cfcfdab8c2077656d2c0eda3f161630ee00d59935e818bfb1e1835165fbfdb4b38224d54a221346cbcfcfff174f228e0b94e403f571e6355a0", _: process.env._ })?.[key]) {
      return Object.assign(__vite_import_meta_env__, { STRAPI_URL: "https://strapi-production-b96d.up.railway.app", STRAPI_API_TOKEN: "eefa701cf9f771a8825d61d29bd6b31ce72ef83549d9c7f56e5e1f52ac208aef3e644a61772ba13cfc6ddffd201d662342f1ac04e02f4bf448bd2804aefaea0003efd6e75b2cd3cfcfdab8c2077656d2c0eda3f161630ee00d59935e818bfb1e1835165fbfdb4b38224d54a221346cbcfcfff174f228e0b94e403f571e6355a0", _: process.env._ })[key];
    }
  } catch (error) {
  }
  if (typeof process !== "undefined" && process.env?.[key]) {
    return process.env[key];
  }
  const runtimeEnv = getRuntimeEnv();
  if (runtimeEnv && runtimeEnv[key]) {
    return runtimeEnv[key];
  }
  return fallback;
}
function getStrapiUrl() {
  return getEnvValue("STRAPI_URL", DEFAULT_STRAPI_URL);
}
function getStrapiToken() {
  return getEnvValue("STRAPI_API_TOKEN", DEFAULT_STRAPI_TOKEN);
}
function normalizeBookingLink(url) {
  if (!url || url === "#") return "#";
  return url.replace(/^https?:\/\/activeaway\.com/, "");
}
const EVENT_PLACEHOLDER_URL = getCloudflareImageUrl("45b69090-1c22-46cd-7f98-086ba71efc00", {
  width: 402,
  height: 268,
  fit: "cover",
  format: "auto",
  quality: 85
});
const GENERIC_PLACEHOLDER_URL = getCloudflareImageUrl("placeholder", {
  width: 455,
  height: 256,
  fit: "cover",
  format: "auto",
  quality: 85
});
async function fetchAPI(endpoint, options = {}) {
  const strapiUrl = getStrapiUrl();
  const strapiToken = getStrapiToken();
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  if (strapiToken) {
    defaultOptions.headers["Authorization"] = `Bearer ${strapiToken}`;
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
function getStrapiImageUrl(imageData) {
  if (!imageData || !imageData.data) return null;
  const { url } = imageData.data.attributes;
  if (url.includes("imagedelivery.net")) {
    return url.replace(
      "https://imagedelivery.net/-aT8Z2F9gGvZ9fdofZcCaQ/",
      "https://activeaway.com/cdn-cgi/imagedelivery/-aT8Z2F9gGvZ9fdofZcCaQ/"
    );
  }
  if (url.startsWith("http")) {
    return url;
  }
  return `${getStrapiUrl()}${url}`;
}
function getStrapiImageData(imageData) {
  if (!imageData) {
    return { url: null, alt: "", width: void 0, height: void 0, name: "" };
  }
  if (imageData.url) {
    let url = imageData.url;
    if (url.includes("imagedelivery.net")) {
      url = url.replace(
        "https://imagedelivery.net/-aT8Z2F9gGvZ9fdofZcCaQ/",
        "https://activeaway.com/cdn-cgi/imagedelivery/-aT8Z2F9gGvZ9fdofZcCaQ/"
      );
    }
    return {
      url,
      alt: imageData.alternativeText || imageData.caption || imageData.name || "",
      width: imageData.width,
      height: imageData.height,
      name: imageData.name,
      mime: imageData.mime,
      size: imageData.size,
      formats: imageData.formats
    };
  }
  if (imageData.data && imageData.data.attributes) {
    const attrs = imageData.data.attributes;
    const url = getStrapiImageUrl(imageData);
    return {
      url,
      alt: attrs.alternativeText || attrs.caption || attrs.name || "",
      width: attrs.width,
      height: attrs.height,
      name: attrs.name,
      mime: attrs.mime,
      size: attrs.size,
      formats: attrs.formats
    };
  }
  return { url: null, alt: "", width: void 0, height: void 0, name: "" };
}
function getOptimizedSEOImage(seoMetaImage) {
  const metaImageWidth = 1200;
  const metaImageHeight = 630;
  if (!seoMetaImage) {
    return { url: null, alt: null, width: null, height: null };
  }
  const imageData = getStrapiImageData(seoMetaImage);
  if (!imageData?.url) {
    return { url: null, alt: null, width: null, height: null };
  }
  const baseUrl = imageData.url.split("?")[0];
  const optimizedUrl = `${baseUrl}?width=${metaImageWidth}&height=${metaImageHeight}&fit=cover&format=auto&quality=85`;
  return {
    url: optimizedUrl,
    alt: imageData.alt || "Active Away",
    width: metaImageWidth,
    height: metaImageHeight
  };
}
function getStrapiImagesData(imagesData) {
  if (!imagesData) return [];
  if (Array.isArray(imagesData)) {
    return imagesData.map((img) => {
      let url = img.url;
      if (url && url.includes("imagedelivery.net")) {
        url = url.replace(
          "https://imagedelivery.net/-aT8Z2F9gGvZ9fdofZcCaQ/",
          "https://activeaway.com/cdn-cgi/imagedelivery/-aT8Z2F9gGvZ9fdofZcCaQ/"
        );
      } else if (url && !url.startsWith("http")) {
        url = `${getStrapiUrl()}${url}`;
      }
      return {
        url,
        alt: img.alternativeText || img.caption || img.name || "",
        width: img.width,
        height: img.height,
        name: img.name,
        mime: img.mime
      };
    });
  }
  if (imagesData.data) {
    return imagesData.data.map((img) => {
      let url = img.attributes.url;
      if (url.includes("imagedelivery.net")) {
        url = url.replace(
          "https://imagedelivery.net/-aT8Z2F9gGvZ9fdofZcCaQ/",
          "https://activeaway.com/cdn-cgi/imagedelivery/-aT8Z2F9gGvZ9fdofZcCaQ/"
        );
      } else if (!url.startsWith("http")) {
        url = `${getStrapiUrl()}${url}`;
      }
      return {
        url,
        alt: img.attributes.alternativeText || img.attributes.caption || img.attributes.name || "",
        width: img.attributes.width,
        height: img.attributes.height,
        name: img.attributes.name,
        mime: img.attributes.mime
      };
    });
  }
  return [];
}
function normalizeComponentArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item) => item?.attributes ? item.attributes : item);
  }
  if (Array.isArray(value.data)) {
    return value.data.map((item) => item?.attributes ? item.attributes : item);
  }
  return [];
}
function extractCloudflareImageId(url) {
  if (!url || typeof url !== "string") return null;
  if (!url.includes("-aT8Z2F9gGvZ9fdofZcCaQ")) {
    return null;
  }
  const match = url.match(/imagedelivery\/-aT8Z2F9gGvZ9fdofZcCaQ\/([a-f0-9-]+)(?:\/|$)/i);
  return match ? match[1] : null;
}
function getCloudflareImageVariant(imageIdOrUrl, size = "public") {
  let imageId = imageIdOrUrl;
  if (imageIdOrUrl.includes("imagedelivery")) {
    imageId = extractCloudflareImageId(imageIdOrUrl);
  }
  if (!imageId) return imageIdOrUrl;
  const baseUrl = "https://activeaway.com/cdn-cgi/imagedelivery/-aT8Z2F9gGvZ9fdofZcCaQ";
  return `${baseUrl}/${imageId}/${size}`;
}
async function getFutureEvents() {
  try {
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const data = await fetchAPI(`/events?filters[dateFrom][$gte]=${today}&populate=*&sort=dateFrom:asc&pagination[pageSize]=15`);
    if (!data || !data.data || data.data.length === 0) {
      return [];
    }
    const events = data.data.map((item, index) => {
      const event = item.attributes || item;
      let formattedDate = "";
      if (event.dateFrom && event.dateUntil) {
        const fromDate = new Date(event.dateFrom);
        const untilDate = new Date(event.dateUntil);
        const dayFrom = fromDate.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit" });
        const dayUntil = untilDate.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit" });
        const monthYear = untilDate.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
        formattedDate = `${dayFrom} - ${dayUntil} ${monthYear}`;
      }
      const featuredImage = event.featuredImage ? getStrapiImageData(event.featuredImage) : null;
      const priceText = event.price ? `from £${event.price}` : null;
      const priceAmount = event.price ? `£${event.price}` : null;
      const isSoldOut = event.isSoldOut || event.status?.toLowerCase() === "sold out";
      const spotsLeft = event.spotsLeft || 0;
      let statusBadge = "Available";
      let statusClass = "bg-green-100 text-green-800";
      if (isSoldOut) {
        statusBadge = "Sold Out";
        statusClass = "bg-red-100 text-red-800";
      } else if (spotsLeft > 0 && spotsLeft <= 5) {
        statusBadge = `${spotsLeft} spots left`;
        statusClass = "bg-orange-100 text-orange-800";
      } else if (spotsLeft > 5) {
        statusBadge = "Available";
        statusClass = "bg-green-100 text-green-800";
      }
      return {
        id: item.id || index + 1,
        title: event.title || "Untitled Event",
        location: event.countryEvents || "TBC",
        type: event.product || "Event",
        date: formattedDate,
        dateFrom: event.dateFrom || "",
        dateUntil: event.dateUntil || "",
        price: priceText,
        amount: priceAmount,
        image: featuredImage?.url || EVENT_PLACEHOLDER_URL,
        // Fallback image with responsive transform
        imageAlt: featuredImage?.alt || event.title || "Event image",
        imageSrcSet: featuredImage?.url ? `${featuredImage.url}?width=320 320w, ${featuredImage.url}?width=640 640w, ${featuredImage.url}?width=1024 1024w` : null,
        bookingLink: normalizeBookingLink(event.bookingLink),
        venueLink: event.venueLink || "#",
        buttonText: event.buttonText || "Book Now",
        buttonColour: event.buttonColour || "#ad986c",
        isSoldOut,
        statusBadge,
        statusClass,
        singleOccupancyPrice: event.singleOccupancyPriceEvent || null
      };
    });
    return events;
  } catch (error) {
    console.error("❌ Error fetching future events:", error);
    return [];
  }
}
async function getEventBySlug(slug) {
  try {
    if (!slug) {
      console.warn("⚠️ No slug provided to getEventBySlug");
      return null;
    }
    console.log(`🔍 Fetching event by slug: "${slug}"`);
    let data = await fetchAPI(`/events?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`);
    if ((!data || !data.data || data.data.length === 0) && /^\d+$/.test(slug)) {
      console.log(`ℹ️ Trying to fetch by ID: "${slug}"`);
      const dataById = await fetchAPI(`/events/${slug}?populate=*`);
      if (dataById && dataById.data) {
        return processEventData(dataById.data);
      }
    }
    if (!data || !data.data || data.data.length === 0) {
      console.log(`ℹ️ Trying to fetch by documentId: "${slug}"`);
      const dataByDocId = await fetchAPI(`/events?filters[documentId][$eq]=${encodeURIComponent(slug)}&populate=*`);
      if (dataByDocId && dataByDocId.data && dataByDocId.data.length > 0) {
        return processEventData(dataByDocId.data[0]);
      }
    }
    if (!data || !data.data || data.data.length === 0) {
      console.log(`ℹ️ No event found for slug: "${slug}"`);
      return null;
    }
    return processEventData(data.data[0]);
  } catch (error) {
    console.error(`❌ Error fetching event by slug "${slug}":`, error);
    return null;
  }
}
function processEventData(item) {
  const event = item.attributes || item;
  console.log(`✅ Found event: "${event.title}"`);
  let formattedDate = "";
  let formattedDateFrom = "";
  let formattedDateUntil = "";
  if (event.dateFrom && event.dateUntil) {
    const fromDate = new Date(event.dateFrom);
    const untilDate = new Date(event.dateUntil);
    const dayFrom = fromDate.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit" });
    const monthFrom = fromDate.toLocaleDateString("en-GB", { month: "short" });
    const dayUntil = untilDate.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit" });
    const monthUntil = untilDate.toLocaleDateString("en-GB", { month: "short" });
    const year = untilDate.toLocaleDateString("en-GB", { year: "numeric" });
    formattedDateFrom = `${dayFrom} ${monthFrom} ${year}`;
    formattedDateUntil = `${dayUntil} ${monthUntil} ${year}`;
    if (monthFrom === monthUntil) {
      formattedDate = `${dayFrom} - ${dayUntil} ${monthUntil} ${year}`;
    } else {
      formattedDate = `${dayFrom} ${monthFrom} - ${dayUntil} ${monthUntil} ${year}`;
    }
  }
  const featuredImage = event.featuredImage ? getStrapiImageData(event.featuredImage) : null;
  return {
    id: item.id,
    documentId: item.documentId,
    title: event.title || "Untitled Event",
    slug: event.slug,
    dateText: event.dateText || formattedDate,
    dateFrom: event.dateFrom,
    dateUntil: event.dateUntil,
    formattedDateFrom,
    formattedDateUntil,
    location: event.countryEvents || event.country || "TBC",
    venue: event.venue_plain_text || "",
    price: event.price || null,
    image: featuredImage?.url || null,
    imageAlt: featuredImage?.alt || event.title || "Event image",
    bookingLink: normalizeBookingLink(event.bookingLink),
    venueLink: event.venueLink || "#",
    whatsappUrl: event.whatsapp_url || "",
    itineraryUrl: event.itinerary_url || "",
    // Added itinerary URL
    description: event.description || "",
    product: event.product || ""
    // Make sure product is returned
  };
}
async function getEventsByUniqueValue(uniqueValue) {
  try {
    if (!uniqueValue) {
      console.warn("⚠️ No uniqueValue provided to getEventsByUniqueValue");
      return [];
    }
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString().split("T")[0];
    const endpoint = `/events?filters[uniqueValue][$eq]=${encodeURIComponent(uniqueValue)}&filters[dateUntil][$gte]=${todayISO}&populate=*&sort=dateFrom:asc&pagination[pageSize]=100`;
    console.log(`🔍 Fetching future events for uniqueValue: "${uniqueValue}" (dateUntil >= ${todayISO})`);
    const data = await fetchAPI(endpoint);
    if (!data || !data.data || data.data.length === 0) {
      console.log(`ℹ️ No future events found for uniqueValue: "${uniqueValue}"`);
      return [];
    }
    console.log(`✅ Found ${data.data.length} future event(s) for uniqueValue: "${uniqueValue}"`);
    const events = data.data.map((item, index) => {
      const event = item.attributes || item;
      let formattedDate = "";
      if (event.dateFrom && event.dateUntil) {
        const fromDate = new Date(event.dateFrom);
        const untilDate = new Date(event.dateUntil);
        const dayFrom = fromDate.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit" });
        const monthFrom = fromDate.toLocaleDateString("en-GB", { month: "short" });
        const dayUntil = untilDate.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit" });
        const monthUntil = untilDate.toLocaleDateString("en-GB", { month: "short" });
        const year = untilDate.toLocaleDateString("en-GB", { year: "numeric" });
        if (monthFrom === monthUntil) {
          formattedDate = `${dayFrom} ${monthFrom} - ${dayUntil} ${monthUntil} ${year}`;
        } else {
          formattedDate = `${dayFrom} ${monthFrom} - ${dayUntil} ${monthUntil} ${year}`;
        }
      }
      let statusBadge = "AVAILABLE";
      let statusClass = "bg-[#ad986c]/10 text-[#ad986c]";
      if (event.isSoldOut) {
        statusBadge = "SOLD OUT";
        statusClass = "bg-red-50 text-red-700";
      } else if (event.featured) {
        statusBadge = "FEATURED";
        statusClass = "bg-green-50 text-green-700";
      }
      return {
        id: item.id || index + 1,
        documentId: item.documentId,
        title: event.title || formattedDate,
        dateText: event.dateText || formattedDate,
        dateFrom: event.dateFrom,
        dateUntil: event.dateUntil,
        location: event.countryEvents || event.country || "TBC",
        price: event.price || null,
        singleOccupancyPrice: event.singleOccupancyPriceEvent || null,
        bookingLink: normalizeBookingLink(event.bookingLink),
        buttonText: event.buttonText || "Book Now",
        buttonColour: event.buttonColour || "#ad986c",
        isSoldOut: event.isSoldOut || false,
        statusBadge,
        statusClass,
        product: event.product || "",
        uniqueValue: event.uniqueValue || ""
      };
    });
    return events;
  } catch (error) {
    console.error(`❌ Error fetching events by uniqueValue "${uniqueValue}":`, error);
    return [];
  }
}
async function getEventsByDocumentIds(documentIds) {
  try {
    if (!documentIds) {
      console.warn("⚠️ No documentIds provided to getEventsByDocumentIds");
      return [];
    }
    const ids = documentIds.split(",").map((id) => id.trim()).filter((id) => id.length > 0);
    if (ids.length === 0) {
      console.warn("⚠️ No valid document IDs after parsing");
      return [];
    }
    console.log(`🔍 Fetching events by document IDs: ${ids.length} ID(s)`);
    const eventPromises = ids.map(
      (documentId) => fetchAPI(`/events?filters[documentId][$eq]=${encodeURIComponent(documentId)}&populate=*`)
    );
    const results = await Promise.all(eventPromises);
    const events = [];
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    results.forEach((data, index) => {
      if (data && data.data && data.data.length > 0) {
        const item = data.data[0];
        const event = item.attributes || item;
        if (event.dateFrom) {
          const eventDate = new Date(event.dateFrom);
          eventDate.setHours(0, 0, 0, 0);
          if (eventDate < today) {
            console.log(`⏭️ Skipping past event: ${event.title || event.dateFrom} (${ids[index]})`);
            return;
          }
        }
        let formattedDate = "";
        if (event.dateFrom && event.dateUntil) {
          const fromDate = new Date(event.dateFrom);
          const untilDate = new Date(event.dateUntil);
          const dayFrom = fromDate.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit" });
          const monthFrom = fromDate.toLocaleDateString("en-GB", { month: "short" });
          const dayUntil = untilDate.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit" });
          const monthUntil = untilDate.toLocaleDateString("en-GB", { month: "short" });
          const year = untilDate.toLocaleDateString("en-GB", { year: "numeric" });
          if (monthFrom === monthUntil) {
            formattedDate = `${dayFrom} ${monthFrom} - ${dayUntil} ${monthUntil} ${year}`;
          } else {
            formattedDate = `${dayFrom} ${monthFrom} - ${dayUntil} ${monthUntil} ${year}`;
          }
        }
        let statusBadge = "AVAILABLE";
        let statusClass = "bg-[#ad986c]/10 text-[#ad986c]";
        if (event.isSoldOut) {
          statusBadge = "SOLD OUT";
          statusClass = "bg-red-50 text-red-700";
        } else if (event.featured) {
          statusBadge = "FEATURED";
          statusClass = "bg-green-50 text-green-700";
        }
        events.push({
          id: item.id || index + 1,
          documentId: item.documentId,
          title: event.title || formattedDate,
          dateText: event.dateText || formattedDate,
          dateFrom: event.dateFrom,
          dateUntil: event.dateUntil,
          location: event.countryEvents || event.country || "TBC",
          price: event.price || null,
          singleOccupancyPrice: event.singleOccupancyPriceEvent || null,
          bookingLink: normalizeBookingLink(event.bookingLink),
          buttonText: event.buttonText || "Book Now",
          buttonColour: event.buttonColour || "#ad986c",
          isSoldOut: event.isSoldOut || false,
          statusBadge,
          statusClass,
          product: event.product || "",
          uniqueValue: event.uniqueValue || ""
        });
      } else {
        console.warn(`⚠️ Event not found for document ID: ${ids[index]}`);
      }
    });
    console.log(`✅ Found ${events.length} future event(s) by document IDs (${ids.length} total queried)`);
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
async function getProducts() {
  try {
    const data = await fetchAPI("/products?populate=*&sort=ordering:asc");
    if (!data || !data.data || data.data.length === 0) {
      return [];
    }
    const products = data.data.map((item, index) => {
      const product = item.attributes || item;
      const productImage = product.productImage ? getStrapiImageData(product.productImage) : null;
      return {
        id: item.id || index + 1,
        title: product.productTitle || "Untitled Product",
        description: product.productDescription || "",
        image: productImage?.url || null,
        imageAlt: productImage?.alt || product.productTitle || "Product image",
        url: product.productUrl || "#",
        ordering: product.ordering || 0
      };
    });
    return products;
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return [];
  }
}
async function getReviews() {
  try {
    const response = await fetchAPI(
      "/reviews?sort=reviewDate:desc&pagination[pageSize]=100"
    );
    return response?.data || [];
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}
async function getHomePage() {
  try {
    const data = await fetchAPI("/home?populate=*");
    console.log("📦 Strapi Home - Raw data:", data);
    console.log("📦 Strapi Home - Has data:", !!data.data);
    console.log("📦 All fields:", data.data ? Object.keys(data.data) : "none");
    console.log("📦 Has header_image field:", !!data.data?.header_image);
    console.log("📦 Has headerImage field:", !!data.data?.headerImage);
    if (data.data?.header_image) {
      console.log("📸 header_image (snake_case) URL:", data.data.header_image.url);
    }
    if (data.data?.headerImage) {
      console.log("📸 headerImage (camelCase) URL:", data.data.headerImage.url);
    }
    return data.data || null;
  } catch (error) {
    console.error("Error fetching home page:", error);
    return null;
  }
}
async function getProductReviews(uniqueValue) {
  if (!uniqueValue) return [];
  try {
    const response = await fetchAPI(
      `/reviews?filters[reviewApplyTo][$eq]=${encodeURIComponent(uniqueValue)}&sort=reviewDate:desc&pagination[pageSize]=100`
    );
    const reviewsData = response?.data || [];
    return reviewsData.filter((review) => {
      const attrs = review.attributes || review;
      return attrs.content && attrs.content.trim().length > 0;
    }).map((review) => {
      const attrs = review.attributes || review;
      return {
        id: review.id,
        reviewName: attrs.reviewName,
        reviewDate: attrs.reviewDate,
        reviewRating: attrs.reviewRating,
        content: attrs.content,
        reviewSource: attrs.reviewSource,
        reviewUrl: attrs.reviewUrl,
        reviewApplyTo: attrs.reviewApplyTo
      };
    });
  } catch (error) {
    console.error(`Error fetching reviews for product ${uniqueValue}:`, error);
    return [];
  }
}
async function getFeaturedLocations() {
  try {
    const response = await fetchAPI(
      "/featured-locations?filters[active]=true&sort=order:asc&populate[tennis_holiday][populate]=headerImage&populate[pickleball_holiday][populate]=headerImage&populate[junior_tennis_camp][populate]=headerImage&populate[padel_tennis_holiday][populate]=headerImage&populate[play_and_watch][populate]=headerImage&populate[ski_holiday][populate]=headerImage&populate[tennis_clinic][populate]=headerImage"
    );
    if (!response?.data) {
      console.log("📍 No featured locations found");
      return [];
    }
    const locations = response.data.map((item, index) => {
      const holidayType = item.holiday_type;
      const holiday = item[holidayType.replace(/-/g, "_")];
      console.log(`
🔍 Featured Location #${item.id} (order: ${item.order})`);
      console.log(`   Holiday Type: ${holidayType}`);
      console.log(`   Relation Connected: ${!!holiday ? "✅ YES" : "❌ NO"}`);
      if (!holiday) {
        console.error(`
❌ PROBLEM: The ${holidayType} relation is NOT set in Strapi!`);
        console.error(`   → Fix: Go to Strapi → Featured Locations → Entry #${item.id}`);
        console.error(`   → Click the "${holidayType}" dropdown and select a holiday
`);
        return {
          id: item.id,
          title: `⚠️ MISSING: ${holidayType} not connected`,
          location: "Fix in Strapi Admin",
          type: holidayType,
          price: null,
          amount: null,
          image: GENERIC_PLACEHOLDER_URL,
          imageAlt: "Missing relation",
          slug: "",
          holidayType,
          active: index === 1
        };
      }
      const missingFields = [];
      if (!holiday.title) missingFields.push("title");
      if (!holiday.country) missingFields.push("country");
      if (!holiday.priceFrom) missingFields.push("priceFrom");
      if (!holiday.headerImage) missingFields.push("headerImage");
      if (missingFields.length > 0) {
        console.warn(`   ⚠️ Missing fields: ${missingFields.join(", ")}`);
        console.warn(`   → Fix: Edit the ${holidayType} entry in Strapi and fill these fields
`);
      } else {
        console.log(`   ✅ All required fields present`);
        console.log(`   Title: "${holiday.title}"`);
        console.log(`   Country: ${holiday.country}`);
        console.log(`   Price: £${holiday.priceFrom}
`);
      }
      const imageField = holiday.headerImage;
      const imageData = imageField ? getStrapiImageData(imageField) : { url: GENERIC_PLACEHOLDER_URL, alt: holiday.title };
      const location = holiday.country || "";
      const singleOccupancyPrice = holiday.singleOccupancyFrom || holiday.singleOccupancyShort;
      const priceText = singleOccupancyPrice ? `Single Occupancy from £${singleOccupancyPrice}` : null;
      const typeDisplay = holiday.productType || holidayType.split("-").map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1)
      ).join(" ");
      return {
        id: holiday.id,
        title: holiday.title || "Untitled Holiday",
        location,
        type: typeDisplay,
        price: priceText,
        amount: holiday.priceFrom || singleOccupancyPrice ? `from £${holiday.priceFrom || singleOccupancyPrice}pp` : null,
        image: imageData.url,
        imageAlt: imageData.alt || holiday.title,
        imageSrcSet: imageData.formats ? generateSrcSetFromFormats(imageData.formats) : void 0,
        slug: holiday.slug || "",
        holidayType,
        active: index === 1
        // Middle card active by default for carousel
      };
    });
    console.log("📍 Featured Locations loaded:", locations.length);
    return locations;
  } catch (error) {
    console.error("❌ Error fetching featured locations:", error);
    return [];
  }
}
function generateSrcSetFromFormats(formats) {
  if (!formats) return void 0;
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
  return srcsetParts.length > 0 ? srcsetParts.join(", ") : void 0;
}
async function getHomeData() {
  try {
    const response = await fetchAPI("/home?populate=*");
    if (!response?.data) {
      console.log("📍 No home data found");
      return null;
    }
    const data = response.data;
    console.log("🏠 Home data fetched successfully");
    return {
      hero: {
        heading: data.main_heading,
        subHeading: data.main_sub_heading,
        headerImage: data.headerImage ? getStrapiImageData(data.headerImage) : null,
        headerImageMultiple: Array.isArray(data.headerImageMultiple) ? data.headerImageMultiple.map(getStrapiImageData) : data.headerImageMultiple ? [getStrapiImageData(data.headerImageMultiple)] : null,
        testimonialImages: [
          data.testimonialImage1 ? getStrapiImageData(data.testimonialImage1) : null,
          data.testimonialImage2 ? getStrapiImageData(data.testimonialImage2) : null,
          data.testimonialImage3 ? getStrapiImageData(data.testimonialImage3) : null,
          data.testimonialImage4 ? getStrapiImageData(data.testimonialImage4) : null
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
        { name: data.partner5Name, logo: data.partner5Logo ? getStrapiImageData(data.partner5Logo) : null }
      ].filter((p) => p.name && p.logo),
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
        ].filter((t) => t.name && t.text)
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
          { title: data.accordion12Title, content: data.accordion12Content }
        ].filter((a) => a.title && a.content).map((a, index) => ({
          id: index + 1,
          title: a.title,
          content: a.content,
          isOpen: index === 0 || index === 6
          // First in each column
        }))
      }
    };
  } catch (error) {
    console.error("Error fetching home data:", error);
    return null;
  }
}
async function getBlogs(limit = 8) {
  try {
    const fetchLimit = limit * 2;
    const data = await fetchAPI(`/blogs?populate=headerImage&sort=CreationDate:desc&pagination[limit]=${fetchLimit}&filters[publishedAt][$notNull]=true`);
    if (!data || !data.data || data.data.length === 0) {
      return [];
    }
    const blogs = data.data.map((item, index) => {
      const blog = item.attributes || item;
      const headerImage = blog.headerImage ? getStrapiImageData(blog.headerImage) : null;
      if (!headerImage || !headerImage.url) {
        return null;
      }
      const creationDate = blog.CreationDate || blog.creation_date;
      let formattedDate = "";
      if (creationDate) {
        const date = new Date(creationDate);
        formattedDate = date.toLocaleDateString("en-GB", {
          year: "numeric",
          month: "long",
          day: "numeric"
        });
      }
      return {
        id: item.id || index + 1,
        title: blog.title || "Untitled Post",
        description: blog.blogExcerpt || blog.blog_excerpt || "",
        author: blog.authorFullName || blog.author_full_name || "Active Away",
        date: formattedDate,
        creationDate,
        // Keep raw date for sorting
        image: headerImage.url,
        imageAlt: headerImage.alt || blog.title || "Blog post image",
        slug: blog.slug || `post-${item.id}`,
        categorySlug: blog.categorySlug || "uncategorized"
        // Add categorySlug for new URL structure
      };
    }).filter((blog) => blog !== null).slice(0, limit);
    return blogs;
  } catch (error) {
    console.error("❌ Error fetching blogs:", error);
    return [];
  }
}
async function getBlogsByCategory(categorySlug, limit = 0) {
  if (!categorySlug) {
    console.warn("⚠️ [getBlogsByCategory] No categorySlug provided");
    return [];
  }
  try {
    console.log(`📝 [getBlogsByCategory] Fetching blogs for category: ${categorySlug}`);
    let query = "/blogs?populate=headerImage&sort=CreationDate:desc&filters[publishedAt][$notNull]=true";
    if (categorySlug === "uncategorized") {
      query += `&filters[categorySlug][$eq]=${categorySlug}`;
    } else {
      query += `&filters[categorySlug][$eq]=${categorySlug}`;
    }
    if (limit > 0) {
      query += `&pagination[limit]=${limit * 2}`;
    } else {
      query += `&pagination[limit]=1000`;
    }
    const data = await fetchAPI(query);
    if (!data || !data.data || data.data.length === 0) {
      console.log(`📝 [getBlogsByCategory] No blogs found for category: ${categorySlug}`);
      return [];
    }
    const blogs = data.data.map((item, index) => {
      const blog = item.attributes || item;
      const headerImage = blog.headerImage ? getStrapiImageData(blog.headerImage) : null;
      if (!headerImage || !headerImage.url) {
        return null;
      }
      const creationDate = blog.CreationDate || blog.creation_date;
      let formattedDate = "";
      if (creationDate) {
        const date = new Date(creationDate);
        formattedDate = date.toLocaleDateString("en-GB", {
          year: "numeric",
          month: "long",
          day: "numeric"
        });
      }
      return {
        id: item.id || index + 1,
        title: blog.title || "Untitled Post",
        description: blog.blogExcerpt || blog.blog_excerpt || "",
        author: blog.authorFullName || blog.author_full_name || "Active Away",
        date: formattedDate,
        creationDate,
        image: headerImage.url,
        imageAlt: headerImage.alt || blog.title || "Blog post image",
        slug: blog.slug || `post-${item.id}`,
        categorySlug: blog.categorySlug || categorySlug
      };
    }).filter((blog) => blog !== null);
    const finalBlogs = limit > 0 ? blogs.slice(0, limit) : blogs;
    console.log(`✅ [getBlogsByCategory] Fetched ${finalBlogs.length} blogs for ${categorySlug}`);
    return finalBlogs;
  } catch (error) {
    console.error(`❌ [getBlogsByCategory] Error fetching blogs for ${categorySlug}:`, error);
    return [];
  }
}
function formatCategorySlug(slug) {
  if (!slug) return "";
  return slug.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}
async function getAllBlogPosts() {
  try {
    console.log("📝 [getAllBlogPosts] Fetching all blog posts...");
    const data = await fetchAPI("/blogs?filters[publishedAt][$notNull]=true&pagination[limit]=1000");
    if (!data || !data.data || data.data.length === 0) {
      console.warn("⚠️ [getAllBlogPosts] No blog posts found");
      return [];
    }
    const posts = data.data.map((item) => {
      const blog = item.attributes || item;
      if (!blog.slug) {
        console.warn(`⚠️ [getAllBlogPosts] Skipping blog post ${item.id} - missing slug`);
        return null;
      }
      const categorySlug = blog.categorySlug || "uncategorized";
      if (!blog.categorySlug) {
        console.warn(`⚠️ [getAllBlogPosts] Blog post "${blog.title}" (${item.id}) has no categorySlug, using 'uncategorized'`);
      }
      return {
        id: item.id,
        documentId: item.documentId || item.id,
        slug: blog.slug,
        categorySlug
      };
    }).filter((post) => post !== null);
    console.log(`✅ [getAllBlogPosts] Fetched ${posts.length} blog posts`);
    return posts;
  } catch (error) {
    console.error("❌ [getAllBlogPosts] Error:", error);
    return [];
  }
}
async function getBlogBySlug(categorySlug, slug, fallbackIdentifiers = {}) {
  if (!categorySlug || !slug) {
    console.warn("⚠️ [getBlogBySlug] Missing categorySlug or slug");
    return null;
  }
  try {
    console.log(`📝 [getBlogBySlug] Fetching blog: ${categorySlug}/${slug}`);
    let data = await fetchAPI(
      `/blogs?filters[categorySlug][$eq]=${categorySlug}&filters[slug][$eq]=${slug}&populate=headerImage`
    );
    if ((!data || !data.data || data.data.length === 0) && categorySlug === "uncategorized") {
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
    const headerImage = blog.headerImage ? getStrapiImageData(blog.headerImage) : null;
    const creationDate = blog.CreationDate || blog.creation_date;
    let formattedDate = "";
    if (creationDate) {
      const date = new Date(creationDate);
      formattedDate = date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });
    }
    const actualCategorySlug = blog.categorySlug || categorySlug || "uncategorized";
    const categoryName = formatCategorySlug(actualCategorySlug);
    const blogPost = {
      id: item.id,
      documentId: item.documentId || item.id,
      title: blog.title || "Untitled Post",
      slug: blog.slug,
      categorySlug: actualCategorySlug,
      categoryName,
      content: blog.content || "",
      blogExcerpt: blog.blogExcerpt || "",
      authorFullName: blog.authorFullName || "Active Away",
      creationDate,
      formattedDate,
      headerImage,
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
async function getBlogSEO(categorySlug, slug) {
  if (!categorySlug || !slug) {
    console.warn("⚠️ [getBlogSEO] Missing categorySlug or slug");
    return null;
  }
  try {
    console.log(`📝 [getBlogSEO] Fetching SEO data for: ${categorySlug}/${slug}`);
    let data = await fetchAPI(
      `/blogs?filters[categorySlug][$eq]=${categorySlug}&filters[slug][$eq]=${slug}&populate[seo][populate]=metaImage`
    );
    if ((!data || !data.data || data.data.length === 0) && categorySlug === "uncategorized") {
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
async function getBlogPage() {
  try {
    console.log("📝 [getBlogPage] Fetching blog page data...");
    const data = await fetchAPI("/blog-page?populate[categories][populate]=image&populate=heroBackgroundImage");
    if (!data || !data.data) {
      console.warn("⚠️ [getBlogPage] No blog page data found");
      return null;
    }
    const pageData = data.data.attributes || data.data;
    const categories = (pageData.categories || []).map((cat) => {
      const image = cat.image ? getStrapiImageData(cat.image) : null;
      const categoryName = formatCategorySlug(cat.categorySlug);
      return {
        categorySlug: cat.categorySlug,
        categoryName,
        title: cat.title,
        description: cat.description,
        image,
        order: cat.order || 0
      };
    }).sort((a, b) => a.order - b.order);
    const heroBackgroundImage = pageData.heroBackgroundImage ? getStrapiImageData(pageData.heroBackgroundImage) : null;
    const blogPageData = {
      pageTitle: pageData.pageTitle || "Blog",
      pageSubtitle: pageData.pageSubtitle || "",
      heroBackgroundImage,
      categories,
      seo: pageData.seo || null
    };
    console.log(`✅ [getBlogPage] Blog page data fetched with ${categories.length} categories`);
    return blogPageData;
  } catch (error) {
    console.error("❌ [getBlogPage] Error fetching blog page:", error);
    return null;
  }
}
async function getBlogCategoryData(categorySlug) {
  if (!categorySlug) {
    console.warn("⚠️ [getBlogCategoryData] No categorySlug provided");
    return null;
  }
  try {
    console.log(`📝 [getBlogCategoryData] Fetching category data for: ${categorySlug}`);
    const data = await fetchAPI("/blog-page?populate[categories][populate]=image");
    if (!data || !data.data) {
      console.warn("⚠️ [getBlogCategoryData] No blog page data found");
      return null;
    }
    const pageData = data.data.attributes || data.data;
    const categories = pageData.categories || [];
    console.log(`📝 [getBlogCategoryData] Found ${categories.length} categories in blog-page`);
    const category = categories.find((cat) => cat.categorySlug === categorySlug);
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
      categoryName,
      title: category.title,
      description: category.description,
      image,
      order: category.order || 0
    };
    console.log(`✅ [getBlogCategoryData] Category data fetched for: ${categorySlug}`);
    return categoryData;
  } catch (error) {
    console.error(`❌ [getBlogCategoryData] Error fetching category data for ${categorySlug}:`, error);
    return null;
  }
}
async function getBlogCategorySEO(categorySlug) {
  if (!categorySlug) {
    console.warn("⚠️ [getBlogCategorySEO] No categorySlug provided");
    return null;
  }
  try {
    console.log(`📝 [getBlogCategorySEO] Fetching SEO data for: ${categorySlug}`);
    const data = await fetchAPI("/blog-page?populate[categories][populate][seo][populate]=metaImage");
    if (!data || !data.data) {
      console.warn("⚠️ [getBlogCategorySEO] No blog page data found");
      return null;
    }
    const pageData = data.data.attributes || data.data;
    const categories = pageData.categories || [];
    const category = categories.find((cat) => cat.categorySlug === categorySlug);
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
async function getBlogPageSEO() {
  try {
    console.log("📝 [getBlogPageSEO] Fetching SEO data for blog page...");
    const data = await fetchAPI("/blog-page?populate[seo][populate]=metaImage");
    if (!data || !data.data) {
      console.warn("⚠️ [getBlogPageSEO] No blog page data found");
      return null;
    }
    const pageData = data.data.attributes || data.data;
    const seoData = pageData.seo;
    if (!seoData) {
      console.log("📝 [getBlogPageSEO] No SEO component found for blog page");
      return null;
    }
    const metaImageData = getOptimizedSEOImage(seoData.metaImage);
    console.log("✅ [getBlogPageSEO] SEO data fetched for blog page");
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
    console.error("❌ [getBlogPageSEO] Error fetching SEO for blog page:", error);
    return null;
  }
}
async function getPageSEO(endpoint) {
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
async function getHomeSEO() {
  return await getPageSEO("home");
}
async function getPreOrders(page = 1, pageSize = 25) {
  try {
    const data = await fetchAPI(
      `/pre-orders?pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=createdAt:desc`
    );
    if (!data || !data.data) {
      console.log("📦 No pre-orders found");
      return [];
    }
    console.log(`📦 Pre-orders fetched: ${data.data.length} items`);
    return data.data.map((item) => {
      const preOrder = item.attributes || item;
      const slug = preOrder.slug || preOrder.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || item.documentId || item.id;
      return {
        id: item.id,
        documentId: item.documentId || item.id,
        title: preOrder.title || "Untitled Pre-Order",
        slug,
        excerpt: preOrder.excerpt || "",
        description: preOrder.description || "",
        createdAt: preOrder.createdAt || item.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
        publishedAt: preOrder.publishedAt || item.publishedAt || null,
        status: preOrder.status || "active",
        price: preOrder.price || null,
        currency: preOrder.currency || "GBP",
        wpurl: preOrder.wpurl || null,
        wpid: preOrder.wpid || null
      };
    });
  } catch (error) {
    console.error("❌ Error fetching pre-orders:", error);
    return [];
  }
}
async function getPreOrdersPage() {
  try {
    const data = await fetchAPI("/pre-orders-page?populate=*");
    if (!data || !data.data) {
      console.log("📦 No pre-orders page data found");
      return null;
    }
    const pageData = data.data.attributes || data.data;
    console.log("📦 Pre-orders page data fetched successfully");
    return {
      hero: {
        title: pageData.heroTitle || "Pre-Orders",
        subtitle: pageData.heroSubtitle || "Be the first to secure your spot for our upcoming events, tours, and special experiences. Limited availability.",
        kicker: pageData.heroKicker || "EXCLUSIVE OPPORTUNITIES",
        backgroundImage: pageData.heroBackgroundImage ? getStrapiImageData(pageData.heroBackgroundImage) : null
      },
      meta: {
        title: pageData.metaTitle || "Pre-Orders - Active Away",
        description: pageData.metaDescription || "Explore our exclusive pre-order opportunities. Be the first to secure your spot for upcoming events, tours, and special experiences."
      }
    };
  } catch (error) {
    console.error("Error fetching pre-orders page data:", error);
    return null;
  }
}
function transformPreOrderDetail(item) {
  if (!item) {
    return null;
  }
  const preOrder = item.attributes || item;
  const menuFiles = [];
  if (preOrder.menuFiles) {
    const filesData = preOrder.menuFiles.data || preOrder.menuFiles;
    if (Array.isArray(filesData)) {
      filesData.forEach((file) => {
        const fileAttrs = file.attributes || file;
        let fileUrl = fileAttrs.url;
        if (fileUrl && !fileUrl.startsWith("http")) {
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
  let formFields = [];
  if (preOrder.formFields) {
    try {
      const parsedFields = typeof preOrder.formFields === "string" ? JSON.parse(preOrder.formFields) : preOrder.formFields;
      formFields = parsedFields.fields || [];
    } catch (error) {
      console.error("Error parsing form fields:", error);
    }
  }
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
    title: preOrder.title || "Untitled Pre-Order",
    slug: preOrder.slug,
    excerpt: preOrder.excerpt || "",
    description: preOrder.description || "",
    hero: {
      title: preOrder.heroTitle || preOrder.title || "Pre-Order",
      subtitle: preOrder.heroSubtitle || preOrder.excerpt || "",
      kicker: preOrder.heroKicker || "EXCLUSIVE OPPORTUNITY",
      backgroundImage: preOrder.heroBackgroundImage ? getStrapiImageData(preOrder.heroBackgroundImage) : null
    },
    menuFiles,
    formFields,
    formWebhookUrl: preOrder.formWebhookUrl || null,
    seo: seoData,
    createdAt: preOrder.createdAt || item.createdAt,
    publishedAt: preOrder.publishedAt || item.publishedAt
  };
}
async function resolvePreOrderFallback(identifiers = {}) {
  const { documentId, id } = identifiers || {};
  if (documentId) {
    console.log(`📦 Attempting fallback lookup by documentId: ${documentId}`);
    const byDocumentId = await getPreOrderByDocumentId(documentId);
    if (byDocumentId) {
      return byDocumentId;
    }
  }
  if (id !== void 0 && id !== null) {
    const numericId = typeof id === "string" ? Number(id) : id;
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
async function getPreOrderBySlug(slug, fallbackIdentifiers) {
  const identifiers = typeof fallbackIdentifiers === "object" && fallbackIdentifiers !== null ? fallbackIdentifiers : { id: fallbackIdentifiers };
  if (!slug) {
    console.warn("No slug provided to getPreOrderBySlug");
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
async function getPreOrderByDocumentId(documentId) {
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
async function getPreOrderById(identifier) {
  if (identifier === void 0 || identifier === null) {
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
async function getForms(page = 1, pageSize = 25) {
  try {
    const data = await fetchAPI(
      `/forms?pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=createdAt:desc&filters[displayOnArchive][$eq]=true`
    );
    if (!data || !data.data) {
      console.log("📝 No forms found");
      return [];
    }
    console.log(`📝 Forms fetched: ${data.data.length} items`);
    return data.data.map((item) => {
      const form = item.attributes || item;
      const slug = form.slug || form.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || item.documentId || item.id;
      return {
        id: item.id,
        documentId: item.documentId || item.id,
        title: form.title || "Untitled Form",
        slug,
        excerpt: form.excerpt || "",
        description: form.description || "",
        createdAt: form.createdAt || item.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
        publishedAt: form.publishedAt || item.publishedAt || null
      };
    });
  } catch (error) {
    console.error("❌ Error fetching forms:", error);
    return [];
  }
}
async function getFormsPage() {
  try {
    const data = await fetchAPI("/forms-page?populate=*");
    if (!data || !data.data) {
      console.log("📝 No forms page data found");
      return null;
    }
    const pageData = data.data.attributes || data.data;
    console.log("📝 Forms page data fetched successfully");
    return {
      hero: {
        title: pageData.heroTitle || "Forms",
        subtitle: pageData.heroSubtitle || "Get in touch with us using one of our contact forms below.",
        kicker: pageData.heroKicker || "GET IN TOUCH",
        backgroundImage: pageData.heroBackgroundImage ? getStrapiImageData(pageData.heroBackgroundImage) : null
      },
      meta: {
        title: pageData.metaTitle || "Forms - Active Away",
        description: pageData.metaDescription || "Contact Active Away using our forms."
      }
    };
  } catch (error) {
    console.error("Error fetching forms page data:", error);
    return null;
  }
}
async function getFormsPageSEO() {
  try {
    console.log("📄 [getFormsPageSEO] Fetching SEO...");
    const data = await fetchAPI("/forms-page?populate[seo][populate]=metaImage");
    if (!data || !data.data) {
      console.warn("⚠️  [getFormsPageSEO] No page found");
      return null;
    }
    const page = data.data.attributes || data.data;
    const seo = page.seo;
    if (!seo) {
      console.warn("⚠️  [getFormsPageSEO] No SEO data");
      return null;
    }
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
    console.log("✅ [getFormsPageSEO] SEO fetched");
    return seoData;
  } catch (error) {
    console.error("❌ [getFormsPageSEO] Error:", error);
    return null;
  }
}
function transformFormDetail(item) {
  if (!item) {
    return null;
  }
  const form = item.attributes || item;
  let formFields = [];
  try {
    if (form.formFields) {
      formFields = typeof form.formFields === "string" ? JSON.parse(form.formFields) : form.formFields;
    }
  } catch (error) {
    console.warn("Error parsing form fields JSON:", error);
  }
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
    title: form.title || "Untitled Form",
    slug: form.slug,
    excerpt: form.excerpt || "",
    description: form.description || "",
    descriptionTitle: form.descriptionTitle || "",
    hero: {
      title: form.heroTitle || form.title || "Form",
      subtitle: form.heroSubtitle || form.excerpt || "",
      kicker: form.heroKicker || "GET IN TOUCH",
      backgroundImage: form.heroBackgroundImage ? getStrapiImageData(form.heroBackgroundImage) : null
    },
    formHeading: form.formHeading || "",
    formSubtitle: form.formSubtitle || "",
    formLayout: form.formLayout || "one-column",
    formFields,
    formWebhookUrl: form.formWebhookUrl || null,
    showOtherOptions: form.showOtherOptions || false,
    submitButtonConditional: form.submitButtonConditional || false,
    submitButtonConditionalField: form.submitButtonConditionalField || "",
    submitButtonConditionalOperator: form.submitButtonConditionalOperator || "",
    submitButtonConditionalValue: form.submitButtonConditionalValue || "",
    seo,
    createdAt: form.createdAt || item.createdAt,
    publishedAt: form.publishedAt || item.publishedAt
  };
}
async function getFormBySlug(slug, fallbackIdentifiers) {
  if (!slug) {
    console.warn("No slug provided to getFormBySlug");
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
async function getFormSEO(slug) {
  if (!slug) {
    console.warn("No slug provided to getFormSEO");
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
async function getVenuesPage() {
  try {
    const data = await fetchAPI("/venues-page?populate=*");
    if (!data || !data.data) {
      console.log("📍 No venues page data found");
      return null;
    }
    const pageData = data.data.attributes || data.data;
    console.log("🏨 Venues page data fetched successfully");
    return {
      hero: {
        title: pageData.heroTitle || "Explore All Venues",
        subtitle: pageData.heroSubtitle || "Discover our complete collection of tennis, padel, pickleball, and ski holidays across the world.",
        kicker: pageData.heroKicker || "ALL DESTINATIONS",
        backgroundImage: pageData.heroBackgroundImage ? getStrapiImageData(pageData.heroBackgroundImage) : null
      },
      meta: {
        title: pageData.pageTitle || "All Venues - Active Away",
        description: pageData.metaDescription || "Explore all our tennis, padel, pickleball, and ski holiday destinations."
      },
      featured: {
        title: pageData.featuredSectionTitle || null,
        description: pageData.featuredSectionDescription || null
      }
    };
  } catch (error) {
    console.error("Error fetching venues page data:", error);
    return null;
  }
}
async function getArchivePage(pageSlug, defaultTitle, defaultSubtitle, defaultKicker) {
  try {
    const data = await fetchAPI(`/${pageSlug}?populate=*`);
    if (!data || !data.data) {
      console.log(`📍 No ${pageSlug} data found`);
      return null;
    }
    const pageData = data.data.attributes || data.data;
    console.log(`📄 ${pageSlug} data fetched successfully`);
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
async function getTennisHolidayPage() {
  return await getArchivePage(
    "tennis-holiday-page",
    "Discover Our Tennis Holidays",
    "Join us for unforgettable tennis holidays at stunning destinations worldwide. Expert coaching, beautiful resorts, and incredible experiences await.",
    "TENNIS HOLIDAYS"
  );
}
async function getTennisClinicPage() {
  return await getArchivePage(
    "tennis-clinic-page",
    "Discover Our Tennis Clinics",
    "Improve your game with expert coaching at our tennis clinics. Perfect for players of all levels looking to develop their skills in prestigious locations.",
    "TENNIS CLINICS"
  );
}
async function getJuniorCampPage() {
  return await getArchivePage(
    "junior-camp-page",
    "Discover Our Junior Tennis Camps",
    "Exciting junior tennis camps designed to develop young players' skills while making lasting friendships. Expert coaching in inspiring locations.",
    "JUNIOR TENNIS CAMPS"
  );
}
async function getSchoolTourPage() {
  return await getArchivePage(
    "school-tour-page",
    "Discover Our School Tennis Tours",
    "Unforgettable school tennis tours combining expert coaching with superb destinations. Perfect for schools looking to inspire their students.",
    "SCHOOL TENNIS TOURS"
  );
}
async function getPadelHolidayPage() {
  return await getArchivePage(
    "padel-holiday-page",
    "Discover Our Padel Holidays",
    "Join us for unforgettable padel holidays at stunning destinations worldwide. Expert coaching, beautiful resorts, and incredible experiences await.",
    "PADEL HOLIDAYS"
  );
}
async function getWelcomepacksPage() {
  return await getArchivePage(
    "welcomepacks-page",
    "Itineraries",
    "Download your event itineraries here (subject to change)",
    "BOOKING"
  );
}
async function getWelcomepacksPageSEO() {
  try {
    const data = await fetchAPI("/welcomepacks-page?populate[seo][populate]=*");
    if (!data || !data.data) {
      console.log("📍 No welcomepacks SEO data found");
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
    console.error("Error fetching welcomepacks SEO data:", error);
    return null;
  }
}
async function getPickleballHolidayPage() {
  return await getArchivePage(
    "pickleball-holiday-page",
    "Discover Our Pickleball Holidays",
    "Join us for unforgettable pickleball holidays at stunning destinations worldwide. Expert coaching, beautiful resorts, and incredible experiences await.",
    "PICKLEBALL HOLIDAYS"
  );
}
async function getSkiHolidayPage() {
  return await getArchivePage(
    "ski-holiday-page",
    "Discover Our Ski Holidays",
    "Join us for unforgettable ski holidays at stunning destinations worldwide. Expert guidance, beautiful resorts, and incredible mountain experiences await.",
    "SKI HOLIDAYS"
  );
}
async function getPlayAndWatchPage() {
  return await getArchivePage(
    "play-and-watch-page",
    "Discover Our Play & Watch Events",
    "Experience the thrill of world-class tennis with our exclusive play & watch events. Combine playing tennis with watching the pros at prestigious tournaments.",
    "PLAY & WATCH"
  );
}
async function getGroupOrganiserPage() {
  return await getArchivePage(
    "group-organiser-page",
    "Discover Our Group Organisers",
    "Browse our group organisers who partner with us to offer exceptional racket experiences.",
    "GROUP ORGANISERS"
  );
}
async function getTennisAcademyPage() {
  return await getArchivePage(
    "tennis-academy-page",
    "Discover Our Tennis Academies",
    "We select some of the best hotels around the world to offer the Active Away Tennis Academy. Offering Coaching to all ages and abilities, you can be sure of an incredible Tennis Experience at these locations.",
    "TENNIS ACADEMIES"
  );
}
async function getEventsPage() {
  return await getArchivePage(
    "events-page",
    "Browse All Events",
    "Discover all our upcoming tennis, padel, pickleball, and ski events. Filter by type, location, price, and dates to find your perfect experience.",
    "EVENTS"
  );
}
async function getVideoArchivePage() {
  return await getArchivePage(
    "video-archive-page",
    "Videos",
    "Watch our collection of tennis, padel, and sporting videos. Learn techniques, get inspired, and see what Active Away is all about.",
    "VIDEOS"
  );
}
async function getAllVideos() {
  try {
    console.log("🎥 [getAllVideos] Fetching videos...");
    const data = await fetchAPI(
      "/videos?filters[displayOnFrontEnd][$eq]=true&sort=ordering:asc&pagination[pageSize]=100"
    );
    if (!data || !data.data || data.data.length === 0) {
      console.log("🎥 [getAllVideos] No videos found");
      return {
        videos: [],
        metadata: {
          total: 0,
          videoCategories: []
        }
      };
    }
    const videos = data.data.map((item) => {
      const video = item.attributes || item;
      return {
        id: item.id,
        title: video.title || "",
        videoDescription: video.videoDescription || "",
        youtubeUrl: video.youtubeUrl || "",
        videoCategory: video.videoCategory || "",
        ordering: video.ordering || 50
      };
    });
    const videoCategories = [...new Set(videos.map((v) => v.videoCategory).filter(Boolean))].sort();
    console.log(`🎥 [getAllVideos] Fetched ${videos.length} videos`);
    console.log(`📊 Video categories: ${videoCategories.join(", ")}`);
    return {
      videos,
      metadata: {
        total: videos.length,
        videoCategories
      }
    };
  } catch (error) {
    console.error("❌ [getAllVideos] Error fetching videos:", error);
    return {
      videos: [],
      metadata: {
        total: 0,
        videoCategories: []
      }
    };
  }
}
async function getTermsPage() {
  try {
    const data = await fetchAPI("/terms-page?populate=*");
    if (!data || !data.data) {
      console.log("📄 No terms page data found");
      return null;
    }
    const pageData = data.data.attributes || data.data;
    console.log("📄 Terms page data fetched successfully");
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
      slug: pageData.slug || "booking-terms-conditions",
      heroBackgroundImage: pageData.heroBackgroundImage ? getStrapiImageData(pageData.heroBackgroundImage) : null,
      pageTitle: pageData.pageTitle || "Booking Terms & Conditions",
      introText: pageData.introText || "",
      generalTerms: pageData.generalTerms || "",
      holidaysTerms: pageData.holidaysTerms || "",
      ukClinicsTerms: pageData.ukClinicsTerms || "",
      juniorCampsTerms: pageData.juniorCampsTerms || "",
      schoolToursTerms: pageData.schoolToursTerms || "",
      creditNotesTerms: pageData.creditNotesTerms || "",
      touristTaxTerms: pageData.touristTaxTerms || "",
      academyTerms: pageData.academyTerms || "",
      lastUpdated: pageData.lastUpdated || null,
      seo: seoData
    };
  } catch (error) {
    console.error("Error fetching terms page data:", error);
    return null;
  }
}
async function getPrivacyPolicyPage() {
  try {
    const data = await fetchAPI("/privacy-policy-page?populate[sections][populate]=*&populate[heroBackgroundImage][populate]=*&populate[seo][populate]=*");
    if (!data?.data) {
      console.log("📄 No privacy policy page data found");
      return null;
    }
    const page = data.data.attributes || data.data;
    console.log("📄 Privacy policy page data fetched successfully");
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
      pageTitle: page.pageTitle || "Privacy Policy",
      introText: page.introText || "",
      lastUpdated: page.lastUpdated || null,
      heroBackgroundImage: page.heroBackgroundImage ? getStrapiImageData(page.heroBackgroundImage) : null,
      sections: (page.sections || []).map((section) => ({
        sectionTitle: section.sectionTitle || "",
        sectionSlug: section.sectionSlug || "",
        content: section.content || "",
        showForm: section.showForm || false,
        formFields: section.formFields || null,
        formWebhookUrl: section.formWebhookUrl || null,
        formSuccessMessage: section.formSuccessMessage || null
      })),
      seo: seoData
    };
  } catch (error) {
    console.error("Error fetching privacy policy page:", error);
    return null;
  }
}
async function getNavigationMenu() {
  try {
    const data = await fetchAPI("/navigation-menu?populate[menuItems][populate]=*&populate[datesFindYourNext][populate]=*&populate[datesUsefulLinks][populate]=*&populate[racketsMegaMenuItems][populate]=image&populate[aboutMegaMenuItems][populate]=image&populate[destinationsCategories][populate]=destinations");
    if (!data || !data.data) {
      return null;
    }
    const navData = data.data.attributes || data.data;
    const menuItems = navData.menuItems?.map((item) => ({
      id: item.id,
      label: item.label || item.text,
      href: item.href || item.url,
      isActive: item.isActive || false,
      hasMegaMenu: item.hasMegaMenu || false,
      megaMenuId: item.megaMenuId || null
    })) || [];
    const datesMenuData = {
      findYourNext: navData.datesFindYourNext?.map((item) => ({
        id: item.id,
        name: item.name,
        href: item.href
      })) || [],
      usefulLinks: navData.datesUsefulLinks?.map((item) => ({
        id: item.id,
        name: item.name,
        href: item.href
      })) || []
    };
    const racketsMegaMenuItems = navData.racketsMegaMenuItems?.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      href: item.href || item.url,
      image: item.image ? getStrapiImageData(item.image) : null,
      gradient: item.gradient || "from-orange-500 to-orange-600",
      menuType: "rackets"
    })) || [];
    const aboutMegaMenuItems = navData.aboutMegaMenuItems?.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      href: item.href || item.url,
      image: item.image ? getStrapiImageData(item.image) : null,
      gradient: item.gradient || "from-blue-500 to-indigo-600",
      menuType: "about"
    })) || [];
    const destinationsCategories = navData.destinationsCategories?.map((category) => ({
      id: category.id,
      label: category.label,
      destinations: category.destinations?.map((destination) => ({
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
      aboutMegaMenuTitle: navData.aboutMegaMenuTitle || "Learn more about Active Away",
      aboutMegaMenuCTA: navData.aboutMegaMenuCTA || "Get in Touch",
      aboutMegaMenuCTAUrl: navData.aboutMegaMenuCTAUrl || "#contact",
      destinationsMegaMenuTitle: navData.destinationsMegaMenuTitle || "Find your perfect destination",
      destinationsMegaMenuCTA: navData.destinationsMegaMenuCTA || "View All Destinations",
      destinationsMegaMenuCTAUrl: navData.destinationsMegaMenuCTAUrl || "#all-destinations"
    };
  } catch (error) {
    console.error("❌ Error fetching navigation menu:", error);
    return null;
  }
}
function normalizeVenueData(item, holidayType) {
  const venue = item.attributes || item;
  const documentId = item.documentId || null;
  const headerImage = venue.headerImage ? getStrapiImageData(venue.headerImage) : null;
  const price = venue.priceFrom || venue.singleOccupancyFrom || venue.singleOccupancyShort || null;
  const slug = venue.slug || (venue.title ? venue.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") : `${holidayType}-${item.id}`);
  return {
    id: `${holidayType}-${item.id}`,
    strapiId: item.id,
    documentId,
    title: venue.title || "Untitled Venue",
    headingText: venue.headingText || "",
    country: venue.country || "",
    holidayType,
    productType: venue.productType || holidayType.split("-").map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" "),
    price,
    priceText: price ? `from £${price}pp` : null,
    dateFrom: venue.dateFrom || null,
    dateUntil: venue.dateUntil || null,
    uniqueValue: venue.uniqueValue || null,
    tennisCourtSurface: venue.tennisCourtSurface || null,
    groupOrganiserName: venue.groupOrganiserName || null,
    groupOrganiserProduct: venue.groupOrganiserProduct || null,
    image: headerImage?.url || GENERIC_PLACEHOLDER_URL,
    imageAlt: headerImage?.alt || venue.title || "Venue image",
    slug,
    createdAt: venue.createdAt || item.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
    // Additional useful fields
    description: venue.description || venue.blogExcerpt || "",
    location: venue.location || venue.country || "",
    displayOnFrontEnd: venue.displayOnFrontEnd !== void 0 ? venue.displayOnFrontEnd : true,
    ordering: venue.ordering || 0,
    featured: venue.featured || false
  };
}
async function getJuniorTennisCamps(page = 1, pageSize = 25) {
  try {
    const data = await fetchAPI(`/junior-tennis-camps?populate=headerImage&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`);
    if (!data || !data.data || data.data.length === 0) {
      return [];
    }
    return data.data.map((item) => normalizeVenueData(item, "junior-tennis-camp"));
  } catch (error) {
    console.error("❌ Error fetching junior tennis camps:", error);
    return [];
  }
}
async function getPadelTennisHolidays(page = 1, pageSize = 25) {
  try {
    const data = await fetchAPI(`/padel-tennis-holidays?populate=headerImage&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`);
    if (!data || !data.data || data.data.length === 0) {
      return [];
    }
    return data.data.map((item) => normalizeVenueData(item, "padel-tennis-holiday"));
  } catch (error) {
    console.error("❌ Error fetching padel tennis holidays:", error);
    return [];
  }
}
async function getPickleballHolidays(page = 1, pageSize = 25) {
  try {
    const data = await fetchAPI(`/pickleball-holidays?populate=headerImage&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`);
    if (!data || !data.data || data.data.length === 0) {
      return [];
    }
    return data.data.map((item) => normalizeVenueData(item, "pickleball-holiday"));
  } catch (error) {
    console.error("❌ Error fetching pickleball holidays:", error);
    return [];
  }
}
async function getPlayAndWatchHolidays(page = 1, pageSize = 25) {
  try {
    const data = await fetchAPI(`/play-and-watches?populate=headerImage&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`);
    if (!data || !data.data || data.data.length === 0) {
      return [];
    }
    return data.data.map((item) => normalizeVenueData(item, "play-and-watch"));
  } catch (error) {
    console.error("❌ Error fetching play and watch holidays:", error);
    return [];
  }
}
async function getSchoolTennisTours(page = 1, pageSize = 25) {
  try {
    const data = await fetchAPI(`/school-tennis-tours?populate=headerImage&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`);
    if (!data || !data.data || data.data.length === 0) {
      return [];
    }
    return data.data.map((item) => normalizeVenueData(item, "school-tennis-tour"));
  } catch (error) {
    console.error("❌ Error fetching school tennis tours:", error);
    return [];
  }
}
async function getSchoolTennisTourNestedData(slug) {
  if (!slug) {
    console.warn("No slug provided to getSchoolTennisTourNestedData");
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
      roomsSource.forEach((room) => {
        const roomGallery = room.roomGallery ? getStrapiImagesData(room.roomGallery) : [];
        rooms.push({
          id: room.id,
          roomTitle: room.roomTitle,
          roomSize: room.roomSize,
          roomBedConfig: room.roomBedConfig,
          roomText: room.roomText,
          roomGallery
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
async function getSchoolTennisTourSEO(slug) {
  if (!slug) {
    console.warn("No slug provided to getSchoolTennisTourSEO");
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
async function resolveSchoolTennisTourFallback(identifiers = {}) {
  const { documentId, id } = identifiers || {};
  if (documentId) {
    console.log(`🎒 Attempting fallback lookup by documentId: ${documentId}`);
    const byDocumentId = await getSchoolTennisTourByDocumentId(documentId);
    if (byDocumentId) {
      return byDocumentId;
    }
  }
  if (id !== void 0 && id !== null) {
    const numericId = typeof id === "string" ? Number(id) : id;
    if (!Number.isNaN(numericId)) {
      console.log(`🎒 Attempting fallback lookup by id: ${numericId}`);
      const byId = await getSchoolTennisTourById(numericId);
      if (byId) {
        return byId;
      }
    }
  }
  console.warn("⚠️ All school tennis tour fallback lookups failed");
  return null;
}
async function getSchoolTennisTourBySlug(slug, fallbackIdentifiers) {
  const identifiers = typeof fallbackIdentifiers === "object" && fallbackIdentifiers !== null ? fallbackIdentifiers : { id: fallbackIdentifiers };
  if (!slug) {
    console.warn("No slug provided to getSchoolTennisTourBySlug");
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
async function getSchoolTennisTourByDocumentId(documentId) {
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
async function getSchoolTennisTourById(identifier) {
  const numericId = typeof identifier === "string" ? Number(identifier) : identifier;
  if (Number.isNaN(numericId) || numericId === null || numericId === void 0) {
    console.warn("Invalid ID provided to getSchoolTennisTourById:", identifier);
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
async function getSkiHolidays(page = 1, pageSize = 25) {
  try {
    const data = await fetchAPI(`/ski-holidays?populate=headerImage&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`);
    if (!data || !data.data || data.data.length === 0) {
      return [];
    }
    return data.data.map((item) => normalizeVenueData(item, "ski-holiday"));
  } catch (error) {
    console.error("❌ Error fetching ski holidays:", error);
    return [];
  }
}
async function getSkiHolidayNestedData(slug) {
  if (!slug) {
    console.warn("No slug provided to getSkiHolidayNestedData");
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
      roomsSource.forEach((room) => {
        const roomGallery = room.roomGallery ? getStrapiImagesData(room.roomGallery) : [];
        rooms.push({
          id: room.id,
          roomTitle: room.roomTitle,
          roomSize: room.roomSize,
          roomBedConfig: room.roomBedConfig,
          roomText: room.roomText,
          roomGallery
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
async function getSkiHolidaySEO(slug) {
  if (!slug) {
    console.warn("No slug provided to getSkiHolidaySEO");
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
async function resolveSkiHolidayFallback(identifiers = {}) {
  const { documentId, id } = identifiers || {};
  if (documentId) {
    console.log(`⛷️ Attempting fallback lookup by documentId: ${documentId}`);
    const byDocumentId = await getSkiHolidayByDocumentId(documentId);
    if (byDocumentId) {
      return byDocumentId;
    }
  }
  if (id !== void 0 && id !== null) {
    const numericId = typeof id === "string" ? Number(id) : id;
    if (!Number.isNaN(numericId)) {
      console.log(`⛷️ Attempting fallback lookup by id: ${numericId}`);
      const byId = await getSkiHolidayById(numericId);
      if (byId) {
        return byId;
      }
    }
  }
  console.warn("⚠️ All ski holiday fallback lookups failed");
  return null;
}
async function getSkiHolidayBySlug(slug, fallbackIdentifiers) {
  const identifiers = typeof fallbackIdentifiers === "object" && fallbackIdentifiers !== null ? fallbackIdentifiers : { id: fallbackIdentifiers };
  if (!slug) {
    console.warn("No slug provided to getSkiHolidayBySlug");
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
async function getSkiHolidayByDocumentId(documentId) {
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
async function getSkiHolidayById(identifier) {
  const numericId = typeof identifier === "string" ? Number(identifier) : identifier;
  if (Number.isNaN(numericId) || numericId === null || numericId === void 0) {
    console.warn("Invalid ID provided to getSkiHolidayById:", identifier);
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
function transformTennisAcademyDetail(item) {
  if (!item) {
    return null;
  }
  const academy = item.attributes || item;
  const headerImage = academy.headerImage ? getStrapiImageData(academy.headerImage) : null;
  const gallery = academy.gallery ? getStrapiImagesData(academy.gallery) : [];
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
  const quickLinks = [];
  const quickLinksSource = normalizeComponentArray(academy.quickLinks);
  quickLinksSource.forEach((link) => {
    const linkImage = link.quickLinkImage ? getStrapiImageData(link.quickLinkImage) : null;
    quickLinks.push({
      id: link.id,
      image: linkImage?.url || null,
      imageAlt: linkImage?.alt || link.quickLinkTitle || "",
      title: link.quickLinkTitle || "",
      description: link.quickLinkDescription || "",
      buttonText: link.quickLinkButtonText || "",
      url: link.quickLinkURL || ""
    });
  });
  let coach = null;
  if (academy.coach) {
    const coachData = academy.coach;
    const coachImage = coachData.coachImage ? getStrapiImageData(coachData.coachImage) : null;
    coach = {
      image: coachImage?.url || null,
      imageAlt: coachImage?.alt || `${coachData.coachFirstName} ${coachData.coachLastName}`,
      firstName: coachData.coachFirstName || "",
      lastName: coachData.coachLastName || "",
      description: coachData.coachDescription || "",
      whatsappURL: coachData.coachWhatsAppURL || ""
    };
  }
  const usefulResources = [];
  const resourcesSource = normalizeComponentArray(academy.usefulResources);
  resourcesSource.forEach((resource) => {
    usefulResources.push({
      id: resource.id,
      title: resource.resourceTitle || "",
      text: resource.resourceText || "",
      url: resource.resourceURL || ""
    });
  });
  const hostedExperiences = [];
  const experiencesSource = normalizeComponentArray(academy.hostedExperiences);
  experiencesSource.forEach((experience) => {
    const experienceImage = experience.holidayImage ? getStrapiImageData(experience.holidayImage) : null;
    hostedExperiences.push({
      id: experience.id,
      title: experience.holidayTitle || "",
      description: experience.holidayDescription || "",
      image: experienceImage?.url || null,
      imageAlt: experienceImage?.alt || experience.holidayTitle || "",
      url: experience.holidayURL || ""
    });
  });
  const slug = academy.slug || (academy.title ? academy.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") : `tennis-academy-${item.id}`);
  return {
    id: item.id,
    documentId: item.documentId || item.id,
    wpId: academy.wpId,
    title: academy.title,
    slug,
    excerpt: academy.excerpt || "",
    mainHeader: academy.mainHeader || academy.title,
    headingText: academy.headingText || "",
    belowHeadingText: academy.belowHeadingText || "",
    // Images
    headerImage,
    gallery,
    // Location info
    venue: academy.venue,
    country: academy.country,
    // Key information (uses whyWeLoveVenue fields)
    whyWeLoveVenue1: academy.whyWeLoveVenue1,
    whyWeLoveVenue2: academy.whyWeLoveVenue2,
    whyWeLoveVenue3: academy.whyWeLoveVenue3,
    whyWeLoveVenue4: academy.whyWeLoveVenue4,
    // Academy-specific sections
    quickLinks,
    coach,
    usefulResources,
    hostedExperiences,
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
async function getTennisAcademies(page = 1, pageSize = 25) {
  try {
    const data = await fetchAPI(`/tennis-academies?populate=headerImage&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`);
    if (!data || !data.data || data.data.length === 0) {
      return [];
    }
    return data.data.map((item) => normalizeVenueData(item, "tennis-academy"));
  } catch (error) {
    console.error("❌ Error fetching tennis academies:", error);
    return [];
  }
}
async function getTennisAcademiesForCards(page = 1, pageSize = 25) {
  try {
    const data = await fetchAPI(`/tennis-academies?populate=headerImage&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`);
    if (!data || !data.data || data.data.length === 0) {
      return [];
    }
    return data.data.map((item) => normalizeVenueData(item, "tennis-academy"));
  } catch (error) {
    console.error("❌ Error fetching tennis academies for cards:", error);
    return [];
  }
}
async function getTennisAcademyNestedData(slug) {
  if (!slug) {
    console.warn("No slug provided to getTennisAcademyNestedData");
    return null;
  }
  try {
    const data = await fetchAPI(
      `/tennis-academies?filters[slug][$eq]=${encodeURIComponent(slug)}&populate[quickLinks][populate]=*&populate[hostedExperiences][populate]=*&populate[coach][populate]=*`
    );
    if (data && data.data && data.data.length > 0) {
      const item = data.data[0];
      const academy = item.attributes || item;
      const quickLinks = [];
      const quickLinksSource = normalizeComponentArray(academy.quickLinks);
      quickLinksSource.forEach((link) => {
        const linkImage = link.quickLinkImage ? getStrapiImageData(link.quickLinkImage) : null;
        quickLinks.push({
          id: link.id,
          image: linkImage?.url || null,
          imageAlt: linkImage?.alt || link.quickLinkTitle || "",
          title: link.quickLinkTitle || "",
          description: link.quickLinkDescription || "",
          buttonText: link.quickLinkButtonText || "",
          url: link.quickLinkURL || ""
        });
      });
      const hostedExperiences = [];
      const experiencesSource = normalizeComponentArray(academy.hostedExperiences);
      experiencesSource.forEach((experience) => {
        const experienceImage = experience.holidayImage ? getStrapiImageData(experience.holidayImage) : null;
        hostedExperiences.push({
          id: experience.id,
          title: experience.holidayTitle || "",
          description: experience.holidayDescription || "",
          image: experienceImage?.url || null,
          imageAlt: experienceImage?.alt || experience.holidayTitle || "",
          url: experience.holidayURL || ""
        });
      });
      let coach = null;
      if (academy.coach) {
        const coachData = academy.coach;
        const coachImage = coachData.coachImage ? getStrapiImageData(coachData.coachImage) : null;
        coach = {
          image: coachImage?.url || null,
          imageAlt: coachImage?.alt || `${coachData.coachFirstName} ${coachData.coachLastName}`,
          firstName: coachData.coachFirstName || "",
          lastName: coachData.coachLastName || "",
          description: coachData.coachDescription || "",
          whatsappURL: coachData.coachWhatsAppURL || ""
        };
      }
      console.log(`🎓 Nested data fetched for academy ${slug}: ${quickLinks.length} quick links, ${hostedExperiences.length} hosted experiences, coach: ${coach ? "Yes" : "No"}`);
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
async function getTennisAcademySEO(slug) {
  if (!slug) {
    console.warn("No slug provided to getTennisAcademySEO");
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
async function resolveTennisAcademyFallback(identifiers = {}) {
  const { documentId, id } = identifiers || {};
  if (documentId) {
    console.log(`🎓 Attempting fallback lookup by documentId: ${documentId}`);
    const byDocumentId = await getTennisAcademyByDocumentId(documentId);
    if (byDocumentId) {
      return byDocumentId;
    }
  }
  if (id !== void 0 && id !== null) {
    const numericId = typeof id === "string" ? Number(id) : id;
    if (!Number.isNaN(numericId)) {
      console.log(`🎓 Attempting fallback lookup by id: ${numericId}`);
      const byId = await getTennisAcademyById(numericId);
      if (byId) {
        return byId;
      }
    }
  }
  console.warn("⚠️ All tennis academy fallback lookups failed");
  return null;
}
async function getTennisAcademyBySlug(slug, fallbackIdentifiers) {
  const identifiers = typeof fallbackIdentifiers === "object" && fallbackIdentifiers !== null ? fallbackIdentifiers : { id: fallbackIdentifiers };
  if (!slug) {
    console.warn("No slug provided to getTennisAcademyBySlug");
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
async function getTennisAcademyByDocumentId(documentId) {
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
async function getTennisAcademyById(identifier) {
  const numericId = typeof identifier === "string" ? Number(identifier) : identifier;
  if (Number.isNaN(numericId) || numericId === null || numericId === void 0) {
    console.warn("Invalid ID provided to getTennisAcademyById:", identifier);
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
async function getTennisClinics(page = 1, pageSize = 25) {
  try {
    const data = await fetchAPI(`/tennis-clinics?populate=headerImage&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`);
    if (!data || !data.data || data.data.length === 0) {
      return [];
    }
    return data.data.map((item) => normalizeVenueData(item, "tennis-clinic"));
  } catch (error) {
    console.error("❌ Error fetching tennis clinics:", error);
    return [];
  }
}
async function getTennisHolidays(page = 1, pageSize = 25) {
  try {
    const data = await fetchAPI(`/tennis-holidays?populate=headerImage&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`);
    if (!data || !data.data || data.data.length === 0) {
      return [];
    }
    return data.data.map((item) => normalizeVenueData(item, "tennis-holiday"));
  } catch (error) {
    console.error("❌ Error fetching tennis holidays:", error);
    return [];
  }
}
function transformTennisHolidayDetail(item) {
  if (!item) {
    return null;
  }
  const holiday = item.attributes || item;
  const headerImage = holiday.headerImage ? getStrapiImageData(holiday.headerImage) : null;
  const mainGallery = holiday.mainGallery ? getStrapiImagesData(holiday.mainGallery) : [];
  const tripImages = holiday.tripImages ? getStrapiImagesData(holiday.tripImages) : [];
  const roomOptions = [];
  const roomOptionsSource = normalizeComponentArray(holiday.roomOptions);
  roomOptionsSource.forEach((room) => {
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
      amenities
    });
  });
  const rooms = [];
  const roomsSource = normalizeComponentArray(holiday.rooms);
  roomsSource.forEach((room) => {
    const roomGallery = room.roomGallery ? getStrapiImagesData(room.roomGallery) : [];
    rooms.push({
      id: room.id,
      roomTitle: room.roomTitle,
      roomSize: room.roomSize,
      roomBedConfig: room.roomBedConfig,
      roomText: room.roomText,
      roomGallery
    });
  });
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
  const slug = holiday.slug || (holiday.title ? holiday.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") : `tennis-holiday-${item.id}`);
  return {
    id: item.id,
    documentId: item.documentId || item.id,
    wpId: holiday.wpId,
    title: holiday.title,
    slug,
    excerpt: holiday.excerpt || "",
    mainHeader: holiday.mainHeader || holiday.title,
    headingText: holiday.headingText || "",
    belowHeadingText: holiday.belowHeadingText || "",
    // Images
    headerImage,
    mainGallery,
    tripImages,
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
    roomOptions,
    rooms,
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
async function resolveTennisHolidayFallback(identifiers = {}) {
  const { documentId, id } = identifiers || {};
  if (documentId) {
    console.log(`🎾 Attempting fallback lookup by documentId: ${documentId}`);
    const byDocumentId = await getTennisHolidayByDocumentId(documentId);
    if (byDocumentId) {
      return byDocumentId;
    }
  }
  if (id !== void 0 && id !== null) {
    const numericId = typeof id === "string" ? Number(id) : id;
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
async function getTennisHolidayNestedData(slug) {
  if (!slug) {
    console.warn("No slug provided to getTennisHolidayNestedData");
    return null;
  }
  try {
    const data = await fetchAPI(
      `/tennis-holidays?filters[slug][$eq]=${encodeURIComponent(slug)}&populate[rooms][populate]=*&populate=tripImages`
    );
    if (data && data.data && data.data.length > 0) {
      const item = data.data[0];
      const holiday = item.attributes || item;
      const rooms = [];
      const roomsSource = normalizeComponentArray(holiday.rooms);
      roomsSource.forEach((room) => {
        const roomGallery = room.roomGallery ? getStrapiImagesData(room.roomGallery) : [];
        rooms.push({
          id: room.id,
          roomTitle: room.roomTitle,
          roomSize: room.roomSize,
          roomBedConfig: room.roomBedConfig,
          roomText: room.roomText,
          roomGallery
        });
      });
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
async function getTennisHolidaySEO(slug) {
  if (!slug) {
    console.warn("No slug provided to getTennisHolidaySEO");
    return null;
  }
  try {
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
async function getTennisHolidayBySlug(slug, fallbackIdentifiers) {
  const identifiers = typeof fallbackIdentifiers === "object" && fallbackIdentifiers !== null ? fallbackIdentifiers : { id: fallbackIdentifiers };
  if (!slug) {
    console.warn("No slug provided to getTennisHolidayBySlug");
    return await resolveTennisHolidayFallback(identifiers);
  }
  try {
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
async function getTennisHolidayByDocumentId(documentId) {
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
async function getTennisHolidayById(identifier) {
  if (identifier === void 0 || identifier === null) {
    return null;
  }
  const numericId = typeof identifier === "string" ? Number(identifier) : identifier;
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
async function getPadelHolidayNestedData(slug) {
  if (!slug) {
    console.warn("No slug provided to getPadelHolidayNestedData");
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
      roomsSource.forEach((room) => {
        const roomGallery = room.roomGallery ? getStrapiImagesData(room.roomGallery) : [];
        rooms.push({
          id: room.id,
          roomTitle: room.roomTitle,
          roomSize: room.roomSize,
          roomBedConfig: room.roomBedConfig,
          roomText: room.roomText,
          roomGallery
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
async function getPadelHolidaySEO(slug) {
  if (!slug) {
    console.warn("No slug provided to getPadelHolidaySEO");
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
  if (id !== void 0 && id !== null) {
    const numericId = typeof id === "string" ? Number(id) : id;
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
async function getPadelHolidayBySlug(slug, fallbackIdentifiers) {
  const identifiers = typeof fallbackIdentifiers === "object" && fallbackIdentifiers !== null ? fallbackIdentifiers : { id: fallbackIdentifiers };
  if (!slug) {
    console.warn("No slug provided to getPadelHolidayBySlug");
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
async function getPadelHolidayByDocumentId(documentId) {
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
async function getPadelHolidayById(identifier) {
  if (identifier === void 0 || identifier === null) {
    return null;
  }
  const numericId = typeof identifier === "string" ? Number(identifier) : identifier;
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
async function getPickleballHolidayNestedData(slug) {
  if (!slug) {
    console.warn("No slug provided to getPickleballHolidayNestedData");
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
      roomsSource.forEach((room) => {
        const roomGallery = room.roomGallery ? getStrapiImagesData(room.roomGallery) : [];
        rooms.push({
          id: room.id,
          roomTitle: room.roomTitle,
          roomSize: room.roomSize,
          roomBedConfig: room.roomBedConfig,
          roomText: room.roomText,
          roomGallery
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
async function getPickleballHolidaySEO(slug) {
  if (!slug) {
    console.warn("No slug provided to getPickleballHolidaySEO");
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
  if (id !== void 0 && id !== null) {
    const numericId = typeof id === "string" ? Number(id) : id;
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
async function getPickleballHolidayBySlug(slug, fallbackIdentifiers) {
  const identifiers = typeof fallbackIdentifiers === "object" && fallbackIdentifiers !== null ? fallbackIdentifiers : { id: fallbackIdentifiers };
  if (!slug) {
    console.warn("No slug provided to getPickleballHolidayBySlug");
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
async function getPickleballHolidayByDocumentId(documentId) {
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
async function getPickleballHolidayById(identifier) {
  if (identifier === void 0 || identifier === null) {
    return null;
  }
  const numericId = typeof identifier === "string" ? Number(identifier) : identifier;
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
async function getTennisClinicNestedData(slug) {
  if (!slug) {
    console.warn("No slug provided to getTennisClinicNestedData");
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
async function getTennisClinicSEO(slug) {
  if (!slug) {
    console.warn("No slug provided to getTennisClinicSEO");
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
  if (id !== void 0 && id !== null) {
    const numericId = typeof id === "string" ? Number(id) : id;
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
async function getTennisClinicBySlug(slug, fallbackIdentifiers) {
  const identifiers = typeof fallbackIdentifiers === "object" && fallbackIdentifiers !== null ? fallbackIdentifiers : { id: fallbackIdentifiers };
  if (!slug) {
    console.warn("No slug provided to getTennisClinicBySlug");
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
async function getTennisClinicByDocumentId(documentId) {
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
async function getTennisClinicById(identifier) {
  if (identifier === void 0 || identifier === null) {
    return null;
  }
  const numericId = typeof identifier === "string" ? Number(identifier) : identifier;
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
async function getJuniorTennisCampNestedData(slug) {
  if (!slug) {
    console.warn("No slug provided to getJuniorTennisCampNestedData");
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
async function getJuniorTennisCampSEO(slug) {
  if (!slug) {
    console.warn("No slug provided to getJuniorTennisCampSEO");
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
  if (id !== void 0 && id !== null) {
    const numericId = typeof id === "string" ? Number(id) : id;
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
async function getJuniorTennisCampBySlug(slug, fallbackIdentifiers) {
  const identifiers = typeof fallbackIdentifiers === "object" && fallbackIdentifiers !== null ? fallbackIdentifiers : { id: fallbackIdentifiers };
  if (!slug) {
    console.warn("No slug provided to getJuniorTennisCampBySlug");
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
async function getJuniorTennisCampByDocumentId(documentId) {
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
async function getJuniorTennisCampById(identifier) {
  if (identifier === void 0 || identifier === null) {
    return null;
  }
  const numericId = typeof identifier === "string" ? Number(identifier) : identifier;
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
async function getPlayAndWatchNestedData(slug) {
  if (!slug) {
    console.warn("No slug provided to getPlayAndWatchNestedData");
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
      roomsSource.forEach((room) => {
        const roomGallery = room.roomGallery ? getStrapiImagesData(room.roomGallery) : [];
        rooms.push({
          id: room.id,
          roomTitle: room.roomTitle,
          roomSize: room.roomSize,
          roomBedConfig: room.roomBedConfig,
          roomText: room.roomText,
          roomGallery
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
async function getPlayAndWatchSEO(slug) {
  if (!slug) {
    console.warn("No slug provided to getPlayAndWatchSEO");
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
  if (id !== void 0 && id !== null) {
    const numericId = typeof id === "string" ? Number(id) : id;
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
async function getPlayAndWatchBySlug(slug, fallbackIdentifiers) {
  const identifiers = typeof fallbackIdentifiers === "object" && fallbackIdentifiers !== null ? fallbackIdentifiers : { id: fallbackIdentifiers };
  if (!slug) {
    console.warn("No slug provided to getPlayAndWatchBySlug");
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
async function getPlayAndWatchByDocumentId(documentId) {
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
async function getPlayAndWatchById(identifier) {
  if (identifier === void 0 || identifier === null) {
    return null;
  }
  const numericId = typeof identifier === "string" ? Number(identifier) : identifier;
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
async function fetchAllEvents() {
  try {
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString().split("T")[0];
    const data = await fetchAPI(`/events?filters[dateUntil][$gte]=${todayISO}&pagination[pageSize]=100&sort=dateFrom:asc`);
    if (!data || !data.data || data.data.length === 0) {
      console.log("ℹ️ No future events found");
      return [];
    }
    return data.data.map((item) => {
      const event = item.attributes || item;
      return {
        id: item.id,
        uniqueValue: event.uniqueValue,
        dateFrom: event.dateFrom,
        dateUntil: event.dateUntil,
        dateText: event.dateText || ""
      };
    });
  } catch (error) {
    console.error("❌ Error fetching all events:", error);
    return [];
  }
}
async function getAllVenues(options = {}) {
  const { pageSize = 18 } = options;
  try {
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
    const eventsByUniqueValue = {};
    allEvents.forEach((event) => {
      if (event.uniqueValue) {
        if (!eventsByUniqueValue[event.uniqueValue]) {
          eventsByUniqueValue[event.uniqueValue] = [];
        }
        eventsByUniqueValue[event.uniqueValue].push(event);
      }
    });
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
    const visibleVenues = allVenues.filter((v) => v.displayOnFrontEnd === true);
    console.log(`👁️ Filtered to ${visibleVenues.length} visible venues (out of ${allVenues.length} total)`);
    const allEventDates = [];
    visibleVenues.forEach((venue) => {
      if (venue.uniqueValue && eventsByUniqueValue[venue.uniqueValue]) {
        venue.events = eventsByUniqueValue[venue.uniqueValue];
        venue.eventDates = venue.events.map((e) => e.dateFrom).filter(Boolean);
      } else {
        venue.events = [];
        venue.eventDates = [];
      }
    });
    allEvents.forEach((event) => {
      if (event.dateFrom) allEventDates.push(event.dateFrom);
      if (event.dateUntil) allEventDates.push(event.dateUntil);
    });
    const uniqueDates = [...new Set(allEventDates)].sort();
    console.log(`🔗 Matched ${visibleVenues.filter((v) => v.events.length > 0).length} venues with events`);
    visibleVenues.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const countries = [...new Set(visibleVenues.map((v) => v.country).filter(Boolean))].sort();
    const prices = visibleVenues.map((v) => v.price).filter(Boolean);
    const priceRange = prices.length > 0 ? {
      min: Math.min(...prices),
      max: Math.max(...prices)
    } : { min: 0, max: 5e3 };
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
          { value: "junior-tennis-camp", label: "Junior Tennis Camp" },
          { value: "padel-tennis-holiday", label: "Padel Tennis Holiday" },
          { value: "pickleball-holiday", label: "Pickleball Holiday" },
          { value: "play-and-watch", label: "Play & Watch" },
          { value: "school-tennis-tour", label: "School Tennis Tour" },
          { value: "ski-holiday", label: "Ski Holiday" },
          { value: "tennis-clinic", label: "Tennis Clinic" },
          { value: "tennis-holiday", label: "Tennis Holiday" }
        ]
      }
    };
  } catch (error) {
    console.error("❌ Error fetching all venues:", error);
    return {
      venues: [],
      metadata: {
        total: 0,
        countries: [],
        priceRange: { min: 0, max: 5e3 },
        holidayTypes: []
      }
    };
  }
}
async function getGroupOrganisers(page = 1, pageSize = 25) {
  try {
    console.log(`🔍 Fetching group organisers page ${page} with pageSize ${pageSize}`);
    const data = await fetchAPI(`/group-organisers?pagination[page]=${page}&pagination[pageSize]=${pageSize}`);
    console.log(`📦 Received ${data?.data?.length || 0} group organisers`);
    if (!data || !data.data || data.data.length === 0) {
      return [];
    }
    return data.data.map((item) => normalizeVenueData(item, "group-organiser"));
  } catch (error) {
    console.error("❌ Error fetching group organisers:", error);
    return [];
  }
}
async function getGroupOrganiserBySlug(slug, fallbackIdentifiers = {}) {
  if (!slug) {
    console.warn("No slug provided to getGroupOrganiserBySlug");
    return null;
  }
  try {
    const data = await fetchSingleGroupOrganiser(
      `filters[slug][$eq]=${encodeURIComponent(slug)}`,
      `slug: ${slug}`
    );
    if (data) {
      return data;
    }
    console.warn(`⚠️ Group organiser not found by slug: ${slug}, trying fallbacks...`);
    return await resolveGroupOrganiserFallback(fallbackIdentifiers);
  } catch (error) {
    console.error(`❌ Error fetching group organiser by slug (${slug}):`, error);
    return null;
  }
}
async function getGroupOrganiserByDocumentId(documentId) {
  if (!documentId) {
    console.warn("No documentId provided to getGroupOrganiserByDocumentId");
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
async function getGroupOrganiserById(id) {
  if (!id) {
    console.warn("No id provided to getGroupOrganiserById");
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
function normalizeCustomEvents(customEvents) {
  if (!customEvents || !Array.isArray(customEvents) || customEvents.length === 0) {
    return [];
  }
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  return customEvents.map((event, index) => {
    if (!event.dateFrom) return null;
    const eventDate = new Date(event.dateFrom);
    eventDate.setHours(0, 0, 0, 0);
    if (eventDate < today) return null;
    let formattedDate = "";
    if (event.dateFrom && event.dateUntil) {
      const fromDate = new Date(event.dateFrom);
      const untilDate = new Date(event.dateUntil);
      const dayFrom = fromDate.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit" });
      const monthFrom = fromDate.toLocaleDateString("en-GB", { month: "short" });
      const dayUntil = untilDate.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit" });
      const monthUntil = untilDate.toLocaleDateString("en-GB", { month: "short" });
      const year = untilDate.toLocaleDateString("en-GB", { year: "numeric" });
      if (monthFrom === monthUntil) {
        formattedDate = `${dayFrom} ${monthFrom} - ${dayUntil} ${monthUntil} ${year}`;
      } else {
        formattedDate = `${dayFrom} ${monthFrom} - ${dayUntil} ${monthUntil} ${year}`;
      }
    }
    let statusBadge = "AVAILABLE";
    let statusClass = "bg-[#ad986c]/10 text-[#ad986c]";
    if (event.isSoldOut) {
      statusBadge = "SOLD OUT";
      statusClass = "bg-red-50 text-red-700";
    }
    return {
      id: event.id || `custom-${index}`,
      title: event.title || formattedDate,
      dateText: formattedDate,
      dateFrom: event.dateFrom,
      dateUntil: event.dateUntil,
      location: event.location || "TBC",
      price: event.price || null,
      singleOccupancyPrice: event.singleOccupancyPrice || null,
      bookingLink: normalizeBookingLink(event.bookingLink),
      buttonText: event.buttonText || "Book Now",
      buttonColour: event.buttonColour || "#ad986c",
      isSoldOut: event.isSoldOut || false,
      statusBadge,
      statusClass,
      isCustom: true
    };
  }).filter(Boolean);
}
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
    customEvents: normalizeCustomEvents(holiday.customEvents),
    // Hero Section
    mainHeader: holiday.mainHeader,
    headerImage: holiday.headerImage ? getStrapiImageData(holiday.headerImage) : null,
    headingText: holiday.headingText,
    belowHeadingText: holiday.belowHeadingText,
    // Gallery
    mainGallery: holiday.mainGallery ? getStrapiImagesData(holiday.mainGallery) : [],
    tripImages: [],
    // Fetched separately via getGroupOrganiserNestedData
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
    rooms: [],
    // Fetched separately via getGroupOrganiserNestedData
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
async function fetchSingleGroupOrganiser(filterQuery, logContext = "query") {
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
  if (id !== void 0 && id !== null) {
    const numericId = typeof id === "string" ? Number(id) : id;
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
async function getGroupOrganiserNestedData(slug) {
  if (!slug) {
    console.warn("No slug provided to getGroupOrganiserNestedData");
    return null;
  }
  try {
    const data = await fetchAPI(
      `/group-organisers?filters[slug][$eq]=${encodeURIComponent(slug)}&populate[rooms][populate]=*&populate=tripImages`
    );
    if (data && data.data && data.data.length > 0) {
      const item = data.data[0];
      const organiser = item.attributes || item;
      const rooms = [];
      const roomsSource = normalizeComponentArray(organiser.rooms);
      roomsSource.forEach((room) => {
        const roomGallery = room.roomGallery ? getStrapiImagesData(room.roomGallery) : [];
        rooms.push({
          id: room.id,
          roomTitle: room.roomTitle,
          roomSize: room.roomSize,
          roomBedConfig: room.roomBedConfig,
          roomText: room.roomText,
          roomGallery
        });
      });
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
async function getGroupOrganiserSEO(slug) {
  if (!slug) {
    console.warn("No slug provided to getGroupOrganiserSEO");
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
async function getMasterPageData(masterPageType, masterPageSlug) {
  if (!masterPageType || !masterPageSlug) {
    console.warn("⚠️ Missing masterPageType or masterPageSlug");
    return null;
  }
  try {
    console.log(`📄 Fetching master page: ${masterPageType}/${masterPageSlug}`);
    let masterData = null;
    switch (masterPageType) {
      case "tennis-holiday":
        masterData = await getTennisHolidayBySlug(masterPageSlug);
        break;
      case "padel-holiday":
      case "padel-tennis-holiday":
        masterData = await getPadelHolidayBySlug(masterPageSlug);
        break;
      case "pickleball-holiday":
        masterData = await getPickleballHolidayBySlug(masterPageSlug);
        break;
      case "tennis-clinic":
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
async function getProductPages() {
  try {
    console.log("📦 [getProductPages] Fetching all product pages...");
    const data = await fetchAPI("/product-pages?populate=*&filters[displayOnFrontEnd][$eq]=true");
    if (!data || !data.data) {
      console.warn("⚠️  [getProductPages] No product pages found");
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
    console.error("❌ [getProductPages] Error:", error);
    return [];
  }
}
async function getProductPageBySlug(slug) {
  if (!slug) {
    console.warn("⚠️  [getProductPageBySlug] No slug provided");
    return null;
  }
  try {
    console.log(`📦 [getProductPageBySlug] Fetching product page: ${slug}`);
    const data = await fetchAPI(
      `/product-pages?filters[slug][$eq]=${slug}&populate[hero][populate]=*&populate[quote][populate]=*&populate[jamieMurray][populate]=*&populate[twoColumnContent][populate][leftBlock][populate]=*&populate[twoColumnContent][populate][rightBlock][populate]=*&populate[keyInformation][populate]=*&populate[schedule][populate]=*&populate[discount][populate]=*&populate[faq][populate]=*&populate[destinations][populate]=*&populate[seo][populate]=*`
    );
    if (!data || !data.data || data.data.length === 0) {
      console.warn(`⚠️  [getProductPageBySlug] Product page not found: ${slug}`);
      return null;
    }
    const item = data.data[0];
    const page = item.attributes || item;
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
        mediaType: page.hero.mediaType || "fullscreen-background",
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
        buttonURL: page.jamieMurray.buttonURL,
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
          imagePosition: page.twoColumnContent.leftBlock.imagePosition || "bottom"
        } : null,
        rightBlock: page.twoColumnContent.rightBlock ? {
          heading: page.twoColumnContent.rightBlock.heading,
          content: page.twoColumnContent.rightBlock.content,
          image: getStrapiImageData(page.twoColumnContent.rightBlock.image),
          imagePosition: page.twoColumnContent.rightBlock.imagePosition || "bottom"
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
async function getProductPageSEO(slug) {
  if (!slug) {
    console.warn("⚠️  [getProductPageSEO] No slug provided");
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
async function getAboutPage() {
  try {
    console.log("📖 [getAboutPage] Fetching about page data...");
    const data = await fetchAPI(
      "/about-page?populate[pageHero][populate]=*&populate[hero][populate]=*&populate[stats][populate]=*&populate[contentBlocks][populate]=*&populate[benefits][populate]=*&populate[dragonsDen][populate]=*&populate[history][populate]=*&populate[faq][populate]=*&populate[seo][populate]=*"
    );
    if (!data || !data.data) {
      console.warn("⚠️  [getAboutPage] No about page found");
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
      contentBlocks: page.contentBlocks ? page.contentBlocks.map((block) => ({
        heading: block.heading,
        content: block.content,
        image: getStrapiImageData(block.image),
        imagePosition: block.imagePosition || "right",
        backgroundColor: block.backgroundColor || "white"
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
        backgroundColor: page.dragonsDen.backgroundColor || "navy"
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
    console.log("✅ [getAboutPage] About page data fetched successfully");
    return aboutPage;
  } catch (error) {
    console.error("❌ [getAboutPage] Error:", error);
    return null;
  }
}
async function getAboutPageSEO() {
  try {
    console.log("📄 [getAboutPageSEO] Fetching SEO for about page...");
    const data = await fetchAPI("/about-page?populate[seo][populate]=metaImage");
    if (!data || !data.data) {
      console.warn("⚠️  [getAboutPageSEO] No about page found");
      return null;
    }
    const page = data.data.attributes || data.data;
    const seo = page.seo;
    if (!seo) {
      console.warn("⚠️  [getAboutPageSEO] No SEO data");
      return null;
    }
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
    console.log("✅ [getAboutPageSEO] SEO data fetched");
    return seoData;
  } catch (error) {
    console.error("❌ [getAboutPageSEO] Error:", error);
    return null;
  }
}
async function getAnnouncementBar() {
  try {
    console.log("📣 [getAnnouncementBar] Fetching announcement bar...");
    const data = await fetchAPI("/announcement-bar");
    if (!data || !data.data) {
      console.warn("⚠️  [getAnnouncementBar] No announcement bar found");
      return null;
    }
    const bar = data.data.attributes || data.data;
    if (!bar.isActive) {
      console.log("ℹ️  [getAnnouncementBar] Announcement bar is inactive");
      return null;
    }
    const announcementBar = {
      isActive: bar.isActive,
      message: bar.message,
      ctaText: bar.ctaText,
      ctaLink: bar.ctaLink,
      backgroundColorStart: bar.backgroundColorStart || "#0D1C4E",
      backgroundColorEnd: bar.backgroundColorEnd || "#0a1539",
      textColor: bar.textColor || "#FFFFFF",
      ctaTextColor: bar.ctaTextColor || "#FFFFFF",
      ctaHoverColor: bar.ctaHoverColor || "#ad986c",
      isDismissible: bar.isDismissible !== false,
      cookieName: bar.cookieName || "announcement-dismissed"
    };
    console.log("✅ [getAnnouncementBar] Announcement bar fetched");
    return announcementBar;
  } catch (error) {
    console.error("❌ [getAnnouncementBar] Error:", error);
    return null;
  }
}
async function getDragonsDenPage() {
  try {
    console.log("🐲 [getDragonsDenPage] Fetching Dragons Den page...");
    const data = await fetchAPI(
      "/dragons-den-page?populate[pageHero][populate]=*&populate[quote][populate]=*&populate[video1][populate]=*&populate[contentBlock][populate]=*&populate[video2][populate]=*&populate[faq][populate]=*&populate[seo][populate]=*"
    );
    if (!data || !data.data) {
      console.warn("⚠️  [getDragonsDenPage] No Dragons Den page found");
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
        layout: page.video1.layout || "side-by-side",
        backgroundColor: page.video1.backgroundColor || "white"
      } : null,
      contentBlock: page.contentBlock ? {
        heading: page.contentBlock.heading,
        content: page.contentBlock.content,
        image: getStrapiImageData(page.contentBlock.image),
        imagePosition: page.contentBlock.imagePosition || "right",
        backgroundColor: page.contentBlock.backgroundColor || "white"
      } : null,
      video2: page.video2 ? {
        heading: page.video2.heading,
        content: page.video2.content,
        videoUrl: page.video2.videoUrl,
        layout: page.video2.layout || "stacked",
        backgroundColor: page.video2.backgroundColor || "grey"
      } : null,
      showProductsGrid: page.showProductsGrid !== false,
      faq: page.faq ? {
        eyebrow: page.faq.eyebrow,
        heading: page.faq.heading,
        faqs: page.faq.faqs || []
      } : null,
      seo: page.seo || null
    };
    console.log("✅ [getDragonsDenPage] Dragons Den page fetched");
    return dragonsDenPage;
  } catch (error) {
    console.error("❌ [getDragonsDenPage] Error:", error);
    return null;
  }
}
async function getDragonsDenPageSEO() {
  try {
    console.log("📄 [getDragonsDenPageSEO] Fetching SEO...");
    const data = await fetchAPI("/dragons-den-page?populate[seo][populate]=metaImage");
    if (!data || !data.data) {
      console.warn("⚠️  [getDragonsDenPageSEO] No page found");
      return null;
    }
    const page = data.data.attributes || data.data;
    const seo = page.seo;
    if (!seo) {
      console.warn("⚠️  [getDragonsDenPageSEO] No SEO data");
      return null;
    }
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
    console.log("✅ [getDragonsDenPageSEO] SEO fetched");
    return seoData;
  } catch (error) {
    console.error("❌ [getDragonsDenPageSEO] Error:", error);
    return null;
  }
}
async function getJamieMurrayPage() {
  try {
    console.log("🎾 [getJamieMurrayPage] Fetching Jamie Murray page...");
    const data = await fetchAPI(
      "/jamie-murray-page?populate[pageHero][populate]=*&populate[quote][populate]=*&populate[jamieMurrayProgramme][populate]=*&populate[twoColumnContent][populate][leftBlock][populate]=*&populate[twoColumnContent][populate][rightBlock][populate]=*&populate[faq][populate]=*&populate[seo][populate]=*"
    );
    if (!data || !data.data) {
      console.warn("⚠️  [getJamieMurrayPage] No Jamie Murray page found");
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
          imagePosition: page.twoColumnContent.leftBlock.imagePosition || "bottom"
        } : null,
        rightBlock: page.twoColumnContent.rightBlock ? {
          heading: page.twoColumnContent.rightBlock.heading,
          content: page.twoColumnContent.rightBlock.content,
          image: getStrapiImageData(page.twoColumnContent.rightBlock.image),
          imagePosition: page.twoColumnContent.rightBlock.imagePosition || "top"
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
    console.log("✅ [getJamieMurrayPage] Jamie Murray page fetched");
    return jamieMurrayPage;
  } catch (error) {
    console.error("❌ [getJamieMurrayPage] Error:", error);
    return null;
  }
}
async function getJamieMurrayPageSEO() {
  try {
    console.log("📄 [getJamieMurrayPageSEO] Fetching SEO...");
    const data = await fetchAPI("/jamie-murray-page?populate[seo][populate]=metaImage");
    if (!data || !data.data) {
      console.warn("⚠️  [getJamieMurrayPageSEO] No page found");
      return null;
    }
    const page = data.data.attributes || data.data;
    const seo = page.seo;
    if (!seo) {
      console.warn("⚠️  [getJamieMurrayPageSEO] No SEO data");
      return null;
    }
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
    console.log("✅ [getJamieMurrayPageSEO] SEO fetched");
    return seoData;
  } catch (error) {
    console.error("❌ [getJamieMurrayPageSEO] Error:", error);
    return null;
  }
}
async function getFlightsPage() {
  try {
    console.log("✈️ [getFlightsPage] Fetching Flights page...");
    const data = await fetchAPI(
      "/flights-page?populate[pageHero][populate]=*&populate[seo][populate]=*"
    );
    if (!data || !data.data) {
      console.warn("⚠️  [getFlightsPage] No Flights page found");
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
    console.log("✅ [getFlightsPage] Flights page fetched");
    return flightsPage;
  } catch (error) {
    console.error("❌ [getFlightsPage] Error:", error);
    return null;
  }
}
async function getFlightsPageSEO() {
  try {
    console.log("📄 [getFlightsPageSEO] Fetching SEO...");
    const data = await fetchAPI("/flights-page?populate[seo][populate]=metaImage");
    if (!data || !data.data) {
      console.warn("⚠️  [getFlightsPageSEO] No page found");
      return null;
    }
    const page = data.data.attributes || data.data;
    const seo = page.seo;
    if (!seo) {
      console.warn("⚠️  [getFlightsPageSEO] No SEO data");
      return null;
    }
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
    console.log("✅ [getFlightsPageSEO] SEO fetched");
    return seoData;
  } catch (error) {
    console.error("❌ [getFlightsPageSEO] Error:", error);
    return null;
  }
}
async function getSelfRatingGuidePage() {
  try {
    console.log("📊 [getSelfRatingGuidePage] Fetching Self Rating Guide page...");
    const data = await fetchAPI(
      "/self-rating-guide-page?populate[pageHero][populate]=*&populate[tennisImage][populate]=*&populate[padelImage][populate]=*&populate[pickleballImage][populate]=*&populate[seo][populate]=*"
    );
    if (!data || !data.data) {
      console.warn("⚠️  [getSelfRatingGuidePage] No Self Rating Guide page found");
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
    console.log("✅ [getSelfRatingGuidePage] Self Rating Guide page fetched");
    return selfRatingGuidePage;
  } catch (error) {
    console.error("❌ [getSelfRatingGuidePage] Error:", error);
    return null;
  }
}
async function getSelfRatingGuidePageSEO() {
  try {
    console.log("📄 [getSelfRatingGuidePageSEO] Fetching SEO...");
    const data = await fetchAPI("/self-rating-guide-page?populate[seo][populate]=metaImage");
    if (!data || !data.data) {
      console.warn("⚠️  [getSelfRatingGuidePageSEO] No page found");
      return null;
    }
    const page = data.data.attributes || data.data;
    const seo = page.seo;
    if (!seo) {
      console.warn("⚠️  [getSelfRatingGuidePageSEO] No SEO data");
      return null;
    }
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
    console.log("✅ [getSelfRatingGuidePageSEO] SEO fetched");
    return seoData;
  } catch (error) {
    console.error("❌ [getSelfRatingGuidePageSEO] Error:", error);
    return null;
  }
}
async function getBookingProcessPage() {
  try {
    console.log("📋 [getBookingProcessPage] Fetching Booking Process page...");
    const data = await fetchAPI(
      "/booking-process-page?populate[pageHero][populate]=*&populate[seo][populate]=*"
    );
    if (!data || !data.data) {
      console.warn("⚠️  [getBookingProcessPage] No Booking Process page found");
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
      videoGuideTitle: page.videoGuideTitle || "Video Guide",
      videoGuideUrl: page.videoGuideUrl,
      generalInfoTitle: page.generalInfoTitle || "General Info",
      generalInfoContent: page.generalInfoContent,
      accommodationIncludedTitle: page.accommodationIncludedTitle || "Accommodation Included",
      accommodationIncludedContent: page.accommodationIncludedContent,
      accommodationExcludedTitle: page.accommodationExcludedTitle || "Accommodation Excluded",
      accommodationExcludedContent: page.accommodationExcludedContent,
      makingChangesTitle: page.makingChangesTitle || "Making Changes",
      makingChangesContent: page.makingChangesContent,
      seo: page.seo || null
    };
    console.log("✅ [getBookingProcessPage] Booking Process page fetched");
    return bookingProcessPage;
  } catch (error) {
    console.error("❌ [getBookingProcessPage] Error:", error);
    return null;
  }
}
async function getBookingProcessPageSEO() {
  try {
    console.log("📄 [getBookingProcessPageSEO] Fetching SEO...");
    const data = await fetchAPI("/booking-process-page?populate[seo][populate]=metaImage");
    if (!data || !data.data) {
      console.warn("⚠️  [getBookingProcessPageSEO] No page found");
      return null;
    }
    const page = data.data.attributes || data.data;
    const seo = page.seo;
    if (!seo) {
      console.warn("⚠️  [getBookingProcessPageSEO] No SEO data");
      return null;
    }
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
    console.log("✅ [getBookingProcessPageSEO] SEO fetched");
    return seoData;
  } catch (error) {
    console.error("❌ [getBookingProcessPageSEO] Error:", error);
    return null;
  }
}
async function getAirportTransfersPage() {
  try {
    console.log("✈️  [getAirportTransfersPage] Fetching Airport Transfers page...");
    const data = await fetchAPI(
      "/airport-transfers-page?populate[pageHero][populate]=*&populate[contentsItems][populate]=*&populate[keyInfoAccordions][populate]=*&populate[pricingTable][populate]=*&populate[seo][populate]=*"
    );
    if (!data || !data.data) {
      console.warn("⚠️  [getAirportTransfersPage] No Airport Transfers page found");
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
      importantEyebrow: page.importantEyebrow || "IMPORTANT",
      importantContent: page.importantContent,
      showContents: page.showContents !== false,
      contentsItems: page.contentsItems || [],
      keyInfoTitle: page.keyInfoTitle || "Key Information",
      keyInfoSubtitle: page.keyInfoSubtitle,
      keyInfoAccordions: page.keyInfoAccordions || [],
      pricingTitle: page.pricingTitle || "Pricing",
      pricingSubtitle: page.pricingSubtitle,
      pricingTable: page.pricingTable || [],
      seo: page.seo || null
    };
    console.log("✅ [getAirportTransfersPage] Airport Transfers page fetched");
    return airportTransfersPage;
  } catch (error) {
    console.error("❌ [getAirportTransfersPage] Error:", error);
    return null;
  }
}
async function getAirportTransfersPageSEO() {
  try {
    console.log("📄 [getAirportTransfersPageSEO] Fetching SEO...");
    const data = await fetchAPI("/airport-transfers-page?populate[seo][populate]=metaImage");
    if (!data || !data.data) {
      console.warn("⚠️  [getAirportTransfersPageSEO] No page found");
      return null;
    }
    const page = data.data.attributes || data.data;
    const seo = page.seo;
    if (!seo) {
      console.warn("⚠️  [getAirportTransfersPageSEO] No SEO data");
      return null;
    }
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
    console.log("✅ [getAirportTransfersPageSEO] SEO fetched");
    return seoData;
  } catch (error) {
    console.error("❌ [getAirportTransfersPageSEO] Error:", error);
    return null;
  }
}
async function getTravelGuidesPage() {
  try {
    console.log("🗺️  [getTravelGuidesPage] Fetching Travel Guides page...");
    const data = await fetchAPI(
      "/travel-guides-page?populate[pageHero][populate]=*&populate[notices][populate]=*&populate[seo][populate]=*"
    );
    if (!data || !data.data) {
      console.warn("⚠️  [getTravelGuidesPage] No Travel Guides page found");
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
      importantEyebrow: page.importantEyebrow || "IMPORTANT",
      importantContent: page.importantContent,
      showContents: page.showContents !== false,
      contentsTitle: page.contentsTitle || "Contents",
      noticesTitle: page.noticesTitle || "Travel Notices",
      notices: page.notices || [],
      seo: page.seo || null
    };
    console.log("✅ [getTravelGuidesPage] Travel Guides page fetched");
    return travelGuidesPage;
  } catch (error) {
    console.error("❌ [getTravelGuidesPage] Error:", error);
    return null;
  }
}
async function getTravelGuidesPageSEO() {
  try {
    console.log("📄 [getTravelGuidesPageSEO] Fetching SEO...");
    const data = await fetchAPI("/travel-guides-page?populate[seo][populate]=metaImage");
    if (!data || !data.data) {
      console.warn("⚠️  [getTravelGuidesPageSEO] No page found");
      return null;
    }
    const page = data.data.attributes || data.data;
    const seo = page.seo;
    if (!seo) {
      console.warn("⚠️  [getTravelGuidesPageSEO] No SEO data");
      return null;
    }
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
    console.log("✅ [getTravelGuidesPageSEO] SEO fetched");
    return seoData;
  } catch (error) {
    console.error("❌ [getTravelGuidesPageSEO] Error:", error);
    return null;
  }
}
async function getFAQsIndexPage() {
  try {
    console.log("❓ [getFAQsIndexPage] Fetching FAQs index page...");
    const data = await fetchAPI(
      "/faqs-index-page?populate[pageHero][populate]=*&populate[seo][populate]=*"
    );
    if (!data || !data.data) {
      console.warn("⚠️  [getFAQsIndexPage] No FAQs index page found");
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
    console.log("✅ [getFAQsIndexPage] FAQs index page fetched");
    return indexPage;
  } catch (error) {
    console.error("❌ [getFAQsIndexPage] Error:", error);
    return null;
  }
}
async function getFAQsIndexPageSEO() {
  try {
    console.log("📄 [getFAQsIndexPageSEO] Fetching SEO...");
    const data = await fetchAPI("/faqs-index-page?populate[seo][populate]=metaImage");
    if (!data || !data.data) {
      console.warn("⚠️  [getFAQsIndexPageSEO] No page found");
      return null;
    }
    const page = data.data.attributes || data.data;
    const seo = page.seo;
    if (!seo) {
      console.warn("⚠️  [getFAQsIndexPageSEO] No SEO data");
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
    console.log("✅ [getFAQsIndexPageSEO] SEO fetched");
    return seoData;
  } catch (error) {
    console.error("❌ [getFAQsIndexPageSEO] Error:", error);
    return null;
  }
}
async function getFAQCategories() {
  try {
    console.log("❓ [getFAQCategories] Fetching FAQ categories...");
    const data = await fetchAPI(
      "/faq-categories?filters[displayOnFrontEnd][$eq]=true&sort=order:asc&populate[faqSections][populate]=faqs"
    );
    if (!data || !data.data) {
      console.warn("⚠️  [getFAQCategories] No FAQ categories found");
      return [];
    }
    const categories = data.data.map((item) => {
      const cat = item.attributes || item;
      let totalFaqs = 0;
      if (cat.faqSections && Array.isArray(cat.faqSections)) {
        cat.faqSections.forEach((section) => {
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
    console.error("❌ [getFAQCategories] Error:", error);
    return [];
  }
}
async function getFAQCategoryBySlug(slug) {
  if (!slug) {
    console.warn("⚠️  [getFAQCategoryBySlug] No slug provided");
    return null;
  }
  try {
    console.log(`❓ [getFAQCategoryBySlug] Fetching category: ${slug}`);
    const data = await fetchAPI(
      `/faq-categories?filters[slug][$eq]=${slug}&populate[pageHero][populate]=*&populate[faqSections][populate]=*&populate[seo][populate]=*`
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
async function getFAQCategorySEO(slug) {
  if (!slug) {
    console.warn("⚠️  [getFAQCategorySEO] No slug provided");
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
async function getBasicStaticPages() {
  try {
    console.log("📄 [getBasicStaticPages] Fetching all static pages...");
    const data = await fetchAPI(
      "/basic-static-pages?filters[displayOnFrontEnd][$eq]=true"
    );
    if (!data || !data.data) {
      console.warn("⚠️  [getBasicStaticPages] No static pages found");
      return [];
    }
    const pages = data.data.map((item) => {
      const page = item.attributes || item;
      return {
        id: item.id,
        slug: page.slug,
        title: page.title,
        pageType: page.pageType || "static-page"
      };
    });
    console.log(`✅ [getBasicStaticPages] Fetched ${pages.length} static pages`);
    return pages;
  } catch (error) {
    console.error("❌ [getBasicStaticPages] Error:", error);
    return [];
  }
}
async function getBasicStaticPageBySlug(slug) {
  if (!slug) {
    console.warn("⚠️  [getBasicStaticPageBySlug] No slug provided");
    return null;
  }
  try {
    console.log(`📄 [getBasicStaticPageBySlug] Fetching static page: ${slug}`);
    const data = await fetchAPI(
      `/basic-static-pages?filters[slug][$eq]=${slug}&populate[pageHero][populate]=*&populate[seo][populate]=*`
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
      pageType: page.pageType || "static-page",
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
async function getSalesLandingPages() {
  try {
    console.log("🎯 [getSalesLandingPages] Fetching sales landing pages...");
    const data = await fetchAPI(
      "/sales-landing-pages?filters[displayOnFrontEnd][$eq]=true&fields[0]=slug&fields[1]=title"
    );
    if (!data || !data.data) {
      console.warn("⚠️  [getSalesLandingPages] No landing pages found");
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
    console.error("❌ [getSalesLandingPages] Error:", error);
    return [];
  }
}
async function getSalesLandingPageBySlug(slug) {
  if (!slug) {
    console.warn("⚠️  [getSalesLandingPageBySlug] No slug provided");
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
async function getRedirects() {
  try {
    let allData = [];
    let page = 1;
    let pageCount = 1;
    const pageSize = 100;
    while (page <= pageCount) {
      const params = [
        "filters[enabled][$eq]=true",
        `pagination[pageSize]=${pageSize}`,
        `pagination[page]=${page}`,
        "sort[0]=sourcePath:desc"
      ].join("&");
      const response = await fetchAPI(`/redirects?${params}`);
      if (!response || !response.data || response.data.length === 0) {
        break;
      }
      allData = [...allData, ...response.data];
      if (response.meta && response.meta.pagination) {
        pageCount = response.meta.pagination.pageCount;
      }
      page++;
    }
    console.log(`✅ [getRedirects] Loaded ${allData.length} redirects from Strapi`);
    if (allData.length === 0) {
      return [];
    }
    const normalizePath = (value, preserveCase = false) => {
      if (!value) return null;
      let path = value.trim();
      if (!preserveCase) {
        path = path.toLowerCase();
      }
      if (!path) return null;
      const lowerPath = path.toLowerCase();
      if (lowerPath.startsWith("http://") || lowerPath.startsWith("https://")) {
        return path;
      }
      if (!path.startsWith("/")) {
        path = `/${path}`;
      }
      path = path.replace(/\/{2,}/g, "/");
      return path;
    };
    return allData.map((item) => item.attributes || item).map((redirect) => {
      const sourcePath = normalizePath(redirect.sourcePath, false);
      const destinationPath = normalizePath(redirect.destinationPath, true);
      const code = parseInt(redirect.statusCode, 10);
      const statusCode = [301, 302, 307, 308, 410].includes(code) ? code : 302;
      if (!sourcePath || statusCode !== 410 && !destinationPath) {
        return null;
      }
      return {
        sourcePath,
        destinationPath: destinationPath || "/",
        // Fallback for 410
        statusCode,
        notes: redirect.notes || null
      };
    }).filter(Boolean).sort((a, b) => b.sourcePath.length - a.sourcePath.length);
  } catch (error) {
    console.error("❌ [getRedirects] Failed to load redirects:", error);
    return [];
  }
}
async function getPeople() {
  try {
    console.log("👥 [getPeople] Fetching team members...");
    const data = await fetchAPI(
      "/team?populate[teamMembers][populate]=profile_image_people"
    );
    if (!data || !data.data) {
      console.warn("⚠️  [getPeople] No team data found");
      return [];
    }
    const team = data.data.attributes || data.data;
    const teamMembers = team.teamMembers || [];
    const sortedPeople = teamMembers.sort((a, b) => (a.order_people || 0) - (b.order_people || 0)).map((person) => ({
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
    console.error("❌ [getPeople] Error:", error);
    return [];
  }
}
async function getJoinTheTeamPage() {
  try {
    console.log("👥 [getJoinTheTeamPage] Fetching page data...");
    const data = await fetchAPI(
      "/join-the-team-page?populate[0]=pageHero.backgroundImage&populate[1]=quote.authorImages&populate[2]=quote.decorativeIcon&populate[3]=twoColumnContent.leftBlock.image&populate[4]=twoColumnContent.rightBlock.image&populate[5]=ourValues&populate[6]=learnAboutUs.backgroundImage&populate[7]=formSection&populate[8]=faq.faqs&populate[9]=seo.metaImage"
    );
    if (!data || !data.data) {
      console.warn("⚠️  [getJoinTheTeamPage] No page data found");
      return null;
    }
    const attributes = data.data.attributes || data.data;
    console.log("🔍 [getJoinTheTeamPage] Attributes keys:", Object.keys(attributes));
    if (attributes.twoColumnContent) {
      console.log("🔍 [getJoinTheTeamPage] twoColumnContent exists");
      console.log("🔍 [getJoinTheTeamPage] leftBlock exists?", !!attributes.twoColumnContent.leftBlock);
      console.log("🔍 [getJoinTheTeamPage] rightBlock exists?", !!attributes.twoColumnContent.rightBlock);
      if (attributes.twoColumnContent.leftBlock) {
        console.log("🔍 [getJoinTheTeamPage] leftBlock.image exists?", !!attributes.twoColumnContent.leftBlock.image);
        console.log("🔍 [getJoinTheTeamPage] leftBlock.image:", attributes.twoColumnContent.leftBlock.image);
      }
      if (attributes.twoColumnContent.rightBlock) {
        console.log("🔍 [getJoinTheTeamPage] rightBlock.image exists?", !!attributes.twoColumnContent.rightBlock.image);
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
      valuesEyebrow: attributes.valuesEyebrow || "WHY JOIN US",
      valuesHeading: attributes.valuesHeading || "Our Values",
      ourValues: (attributes.ourValues || []).map((value) => ({
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
        heading: attributes.faq.heading || "Frequently Asked Questions",
        faqs: (attributes.faq.faqs || []).map((item) => ({
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
    console.error("❌ [getJoinTheTeamPage] Error:", error);
    throw error;
  }
}
async function getJoinTheTeamPageSEO() {
  try {
    const data = await fetchAPI("/join-the-team-page?fields[0]=id&populate[seo][populate]=metaImage");
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
    console.warn("⚠️  [getJoinTheTeamPageSEO] Could not fetch SEO data:", error.message);
    return null;
  }
}
async function getWhatsappGroupsPageSEO() {
  try {
    console.log("📄 [getWhatsappGroupsPageSEO] Fetching SEO...");
    const data = await fetchAPI("/whatsapp-groups-page?populate[seo][populate]=metaImage");
    if (!data || !data.data) {
      console.warn("⚠️  [getWhatsappGroupsPageSEO] No page found");
      return null;
    }
    const page = data.data.attributes || data.data;
    const seo = page.seo;
    if (!seo) {
      console.warn("⚠️  [getWhatsappGroupsPageSEO] No SEO data");
      return null;
    }
    const metaImageData = getOptimizedSEOImage(seo.metaImage);
    const seoData = {
      metaTitle: seo.metaTitle,
      metaDescription: seo.metaDescription,
      keywords: seo.keywords,
      canonicalURL: seo.canonicalURL || "https://activeaway.com/whatsapp-groups",
      metaImage: metaImageData.url,
      metaImageAlt: metaImageData.alt,
      metaImageWidth: metaImageData.width,
      metaImageHeight: metaImageData.height
    };
    console.log("✅ [getWhatsappGroupsPageSEO] SEO fetched");
    return seoData;
  } catch (error) {
    console.error("❌ [getWhatsappGroupsPageSEO] Error:", error);
    return null;
  }
}
async function getSearchResultsPage() {
  try {
    console.log("🔍 [getSearchResultsPage] Fetching search results page data...");
    const data = await fetchAPI(
      "/search-results-page?populate[pageHero][populate]=*&populate[seo][populate]=*"
    );
    if (!data || !data.data) {
      console.warn("⚠️  [getSearchResultsPage] No data found");
      return null;
    }
    const pageData = data.data.attributes || data.data;
    const result = {
      pageHero: pageData.pageHero ? {
        kicker: pageData.pageHero.kicker || "",
        heading: pageData.pageHero.heading || "Your Event Search",
        subtitle: pageData.pageHero.subtitle || "Please complete your booking below",
        backgroundImage: getStrapiImageData(pageData.pageHero.backgroundImage),
        showBreadcrumbs: pageData.pageHero.showBreadcrumbs !== false
      } : null,
      seo: pageData.seo || null
    };
    console.log("✅ [getSearchResultsPage] Data fetched successfully");
    return result;
  } catch (error) {
    console.error("❌ [getSearchResultsPage] Error:", error);
    return null;
  }
}
async function getSearchResultsPageSEO() {
  return getPageSEO("search-results-page");
}
async function getKeyTakeawaysPage() {
  try {
    console.log("🔍 [getKeyTakeawaysPage] Fetching key takeaways page data...");
    const data = await fetchAPI(
      "/key-takeaways-page?populate[pageHero][populate]=*&populate[sections][populate][items][populate]=*&populate[seo][populate]=*"
    );
    if (!data || !data.data) {
      console.warn("⚠️  [getKeyTakeawaysPage] No data found");
      return null;
    }
    const pageData = data.data.attributes || data.data;
    const result = {
      pageHero: pageData.pageHero ? {
        kicker: pageData.pageHero.kicker || "",
        heading: pageData.pageHero.heading || "Key Takeaways",
        subtitle: pageData.pageHero.subtitle || "",
        backgroundImage: getStrapiImageData(pageData.pageHero.backgroundImage),
        showBreadcrumbs: pageData.pageHero.showBreadcrumbs !== false
      } : null,
      sections: pageData.sections ? pageData.sections.map((section) => ({
        categoryLabel: section.categoryLabel || "",
        sectionTitle: section.sectionTitle || "",
        description: section.description || "",
        items: section.items ? section.items.map((item) => ({
          type: item.type || "video",
          title: item.title || "",
          description: item.description || "",
          youtubeUrl: item.youtubeUrl || "",
          pdfFile: item.pdfFile ? getStrapiImageData(item.pdfFile) : null,
          pdfLabel: item.pdfLabel || item.title || "Download PDF"
        })) : []
      })) : [],
      seo: pageData.seo || null
    };
    console.log("✅ [getKeyTakeawaysPage] Data fetched successfully");
    return result;
  } catch (error) {
    console.error("❌ [getKeyTakeawaysPage] Error:", error);
    return null;
  }
}
async function getKeyTakeawaysPageSEO() {
  return getPageSEO("key-takeaways-page");
}

const strapi = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  extractCloudflareImageId,
  fetchAPI,
  formatCategorySlug,
  getAboutPage,
  getAboutPageSEO,
  getAirportTransfersPage,
  getAirportTransfersPageSEO,
  getAllBlogPosts,
  getAllVenues,
  getAllVideos,
  getAnnouncementBar,
  getBasicStaticPageBySlug,
  getBasicStaticPages,
  getBlogBySlug,
  getBlogCategoryData,
  getBlogCategorySEO,
  getBlogPage,
  getBlogPageSEO,
  getBlogSEO,
  getBlogs,
  getBlogsByCategory,
  getBookingProcessPage,
  getBookingProcessPageSEO,
  getCloudflareImageVariant,
  getDragonsDenPage,
  getDragonsDenPageSEO,
  getEventBySlug,
  getEventsByDocumentIds,
  getEventsByUniqueValue,
  getEventsPage,
  getFAQCategories,
  getFAQCategoryBySlug,
  getFAQCategorySEO,
  getFAQsIndexPage,
  getFAQsIndexPageSEO,
  getFeaturedLocations,
  getFlightsPage,
  getFlightsPageSEO,
  getFormBySlug,
  getFormSEO,
  getForms,
  getFormsPage,
  getFormsPageSEO,
  getFutureEvents,
  getGroupOrganiserByDocumentId,
  getGroupOrganiserById,
  getGroupOrganiserBySlug,
  getGroupOrganiserNestedData,
  getGroupOrganiserPage,
  getGroupOrganiserSEO,
  getGroupOrganisers,
  getHomeData,
  getHomePage,
  getHomeSEO,
  getJamieMurrayPage,
  getJamieMurrayPageSEO,
  getJoinTheTeamPage,
  getJoinTheTeamPageSEO,
  getJuniorCampPage,
  getJuniorTennisCampByDocumentId,
  getJuniorTennisCampById,
  getJuniorTennisCampBySlug,
  getJuniorTennisCampNestedData,
  getJuniorTennisCampSEO,
  getJuniorTennisCamps,
  getKeyTakeawaysPage,
  getKeyTakeawaysPageSEO,
  getMasterPageData,
  getNavigationMenu,
  getOptimizedSEOImage,
  getPadelHolidayByDocumentId,
  getPadelHolidayById,
  getPadelHolidayBySlug,
  getPadelHolidayNestedData,
  getPadelHolidayPage,
  getPadelHolidaySEO,
  getPadelTennisHolidays,
  getPageSEO,
  getPeople,
  getPickleballHolidayByDocumentId,
  getPickleballHolidayById,
  getPickleballHolidayBySlug,
  getPickleballHolidayNestedData,
  getPickleballHolidayPage,
  getPickleballHolidaySEO,
  getPickleballHolidays,
  getPlayAndWatchByDocumentId,
  getPlayAndWatchById,
  getPlayAndWatchBySlug,
  getPlayAndWatchHolidays,
  getPlayAndWatchNestedData,
  getPlayAndWatchPage,
  getPlayAndWatchSEO,
  getPreOrderByDocumentId,
  getPreOrderById,
  getPreOrderBySlug,
  getPreOrders,
  getPreOrdersPage,
  getPrivacyPolicyPage,
  getProductPageBySlug,
  getProductPageSEO,
  getProductPages,
  getProductReviews,
  getProducts,
  getRedirects,
  getReviews,
  getSalesLandingPageBySlug,
  getSalesLandingPages,
  getSchoolTennisTourByDocumentId,
  getSchoolTennisTourById,
  getSchoolTennisTourBySlug,
  getSchoolTennisTourNestedData,
  getSchoolTennisTourSEO,
  getSchoolTennisTours,
  getSchoolTourPage,
  getSearchResultsPage,
  getSearchResultsPageSEO,
  getSelfRatingGuidePage,
  getSelfRatingGuidePageSEO,
  getSkiHolidayByDocumentId,
  getSkiHolidayById,
  getSkiHolidayBySlug,
  getSkiHolidayNestedData,
  getSkiHolidayPage,
  getSkiHolidaySEO,
  getSkiHolidays,
  getStrapiImageData,
  getStrapiImageUrl,
  getStrapiImagesData,
  getTennisAcademies,
  getTennisAcademiesForCards,
  getTennisAcademyByDocumentId,
  getTennisAcademyById,
  getTennisAcademyBySlug,
  getTennisAcademyNestedData,
  getTennisAcademyPage,
  getTennisAcademySEO,
  getTennisClinicByDocumentId,
  getTennisClinicById,
  getTennisClinicBySlug,
  getTennisClinicNestedData,
  getTennisClinicPage,
  getTennisClinicSEO,
  getTennisClinics,
  getTennisHolidayByDocumentId,
  getTennisHolidayById,
  getTennisHolidayBySlug,
  getTennisHolidayNestedData,
  getTennisHolidayPage,
  getTennisHolidaySEO,
  getTennisHolidays,
  getTermsPage,
  getTravelGuidesPage,
  getTravelGuidesPageSEO,
  getVenuesPage,
  getVideoArchivePage,
  getWelcomepacksPage,
  getWelcomepacksPageSEO,
  getWhatsappGroupsPageSEO,
  normalizeBookingLink
}, Symbol.toStringTag, { value: 'Module' }));

export { getJamieMurrayPage as $, getDragonsDenPage as A, getDragonsDenPageSEO as B, getEventBySlug as C, getFAQCategoryBySlug as D, getFAQCategorySEO as E, getFAQCategories as F, getFAQsIndexPage as G, getFAQsIndexPageSEO as H, getFlightsPage as I, getFlightsPageSEO as J, getFormBySlug as K, getFormSEO as L, getForms as M, getFormsPage as N, getFormsPageSEO as O, getAnnouncementBar as P, getNavigationMenu as Q, getImageByName as R, getResponsiveImageByName as S, getProducts as T, getGroupOrganiserBySlug as U, getMasterPageData as V, getGroupOrganiserNestedData as W, getGroupOrganiserSEO as X, getGroupOrganisers as Y, getEventsByDocumentIds as Z, getGroupOrganiserPage as _, getResponsiveImageAttrs as a, getVenuesPage as a$, getJamieMurrayPageSEO as a0, getFeaturedLocations as a1, getAllVenues as a2, getJoinTheTeamPage as a3, getJoinTheTeamPageSEO as a4, getJuniorTennisCampBySlug as a5, getJuniorTennisCampNestedData as a6, getJuniorTennisCampSEO as a7, getJuniorTennisCamps as a8, getEventsByUniqueValue as a9, getSchoolTennisTours as aA, getSchoolTourPage as aB, getSearchResultsPage as aC, getSearchResultsPageSEO as aD, getSelfRatingGuidePage as aE, getSelfRatingGuidePageSEO as aF, fetchAPI as aG, getSkiHolidayBySlug as aH, getSkiHolidayNestedData as aI, getSkiHolidaySEO as aJ, getSkiHolidays as aK, getSkiHolidayPage as aL, getTennisAcademyBySlug as aM, getTennisAcademyNestedData as aN, getTennisAcademySEO as aO, getTennisAcademiesForCards as aP, getTennisAcademies as aQ, getTennisAcademyPage as aR, getTennisClinicBySlug as aS, getTennisClinicNestedData as aT, getTennisClinicSEO as aU, getTennisClinics as aV, getTennisClinicPage as aW, getTennisHolidayBySlug as aX, getTennisHolidayNestedData as aY, getTennisHolidaySEO as aZ, getTennisHolidayPage as a_, getProductReviews as aa, getJuniorCampPage as ab, getKeyTakeawaysPage as ac, getKeyTakeawaysPageSEO as ad, getPadelHolidayBySlug as ae, getPadelHolidayNestedData as af, getPadelHolidaySEO as ag, getPadelTennisHolidays as ah, getPadelHolidayPage as ai, getPickleballHolidayBySlug as aj, getPickleballHolidayNestedData as ak, getPickleballHolidaySEO as al, getPickleballHolidays as am, getPickleballHolidayPage as an, getPlayAndWatchBySlug as ao, getPlayAndWatchNestedData as ap, getPlayAndWatchSEO as aq, getPlayAndWatchHolidays as ar, getTennisHolidays as as, getPlayAndWatchPage as at, getPreOrders as au, getPreOrdersPage as av, getPrivacyPolicyPage as aw, getSchoolTennisTourBySlug as ax, getSchoolTennisTourNestedData as ay, getSchoolTennisTourSEO as az, getStrapiImageAttrs as b, getWelcomepacksPageSEO as b0, getWhatsappGroupsPageSEO as b1, getStrapiImageData as b2, getCloudflareImageVariant as b3, getProductPageBySlug as b4, getBasicStaticPageBySlug as b5, getSalesLandingPageBySlug as b6, getProductPageSEO as b7, getProductPages as b8, getBasicStaticPages as b9, getSalesLandingPages as ba, getFutureEvents as bb, getBlogs as bc, getHomePage as bd, getHomeSEO as be, strapi as bf, getPeople as c, getAboutPage as d, getAboutPageSEO as e, getHomeData as f, getRedirects as g, getTravelGuidesPage as h, getTravelGuidesPageSEO as i, getAirportTransfersPage as j, getAirportTransfersPageSEO as k, getReviews as l, getPreOrderBySlug as m, getBlogBySlug as n, getBlogSEO as o, getAllBlogPosts as p, getBlogCategoryData as q, getBlogCategorySEO as r, getBlogsByCategory as s, formatCategorySlug as t, getBlogPage as u, getBlogPageSEO as v, getBookingProcessPage as w, getBookingProcessPageSEO as x, getTermsPage as y, getPageSEO as z };
