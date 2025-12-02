globalThis.process ??= {}; globalThis.process.env ??= {};
import { aE as fetchAPI } from './strapi_CoI6gAxC.mjs';

// Configuration mapping Strapi collections to Frontend URL patterns
// Ordered by priority/importance
const CONTENT_TYPES = [
  // --- SPECIFIC COLLECTIONS (Split sitemaps) ---
  // Blog: populate[category] removed, using categorySlug field instead
  { group: 'blog', type: 'collection', endpoint: 'blogs', urlPrefix: '/blog', query: 'fields[0]=slug&fields[1]=updatedAt&fields[2]=categorySlug&populate[sitemap]=*' },
  { group: 'faq-category', type: 'collection', endpoint: 'faq-categories', urlPrefix: '/faqs', query: 'fields[0]=slug&fields[1]=updatedAt&populate[sitemap]=*' },
  { group: 'form', type: 'collection', endpoint: 'forms', urlPrefix: '/forms', query: 'fields[0]=slug&fields[1]=updatedAt&populate[sitemap]=*' },
  { group: 'group-organiser', type: 'collection', endpoint: 'group-organisers', urlPrefix: '/group-organiser', query: 'fields[0]=slug&fields[1]=updatedAt&populate[sitemap]=*' },
  { group: 'junior-tennis-camp', type: 'collection', endpoint: 'junior-tennis-camps', urlPrefix: '/junior-tennis-camp', query: 'fields[0]=slug&fields[1]=updatedAt&populate[sitemap]=*' },
  // Padel: Fixed endpoint name from padel-holidays to padel-tennis-holidays
  { group: 'padel-tennis-holiday', type: 'collection', endpoint: 'padel-tennis-holidays', urlPrefix: '/padel-holiday', query: 'fields[0]=slug&fields[1]=updatedAt&populate[sitemap]=*' },
  { group: 'pickleball-holiday', type: 'collection', endpoint: 'pickleball-holidays', urlPrefix: '/pickleball-holiday', query: 'fields[0]=slug&fields[1]=updatedAt&populate[sitemap]=*' },
  { group: 'play-watch', type: 'collection', endpoint: 'play-and-watches', urlPrefix: '/play-and-watch', query: 'fields[0]=slug&fields[1]=updatedAt&populate[sitemap]=*' },
  { group: 'pre-order', type: 'collection', endpoint: 'pre-orders', urlPrefix: '/pre-orders', query: 'fields[0]=slug&fields[1]=updatedAt&populate[sitemap]=*' },
  { group: 'school-tennis-tour', type: 'collection', endpoint: 'school-tennis-tours', urlPrefix: '/school-tennis-tour', query: 'fields[0]=slug&fields[1]=updatedAt&populate[sitemap]=*' },
  { group: 'ski-holiday', type: 'collection', endpoint: 'ski-holidays', urlPrefix: '/ski-holiday', query: 'fields[0]=slug&fields[1]=updatedAt&populate[sitemap]=*' },
  { group: 'tennis-academy', type: 'collection', endpoint: 'tennis-academies', urlPrefix: '/tennis-academy', query: 'fields[0]=slug&fields[1]=updatedAt&populate[sitemap]=*' },
  { group: 'tennis-clinic', type: 'collection', endpoint: 'tennis-clinics', urlPrefix: '/tennis-clinic', query: 'fields[0]=slug&fields[1]=updatedAt&populate[sitemap]=*' },
  { group: 'tennis-holiday', type: 'collection', endpoint: 'tennis-holidays', urlPrefix: '/tennis-holiday', query: 'fields[0]=slug&fields[1]=updatedAt&populate[sitemap]=*' },

  // --- PAGES GROUP (All Single Types + Special Collections + Manual) ---
  
  // Collections included in 'pages'
  { group: 'pages', type: 'collection', endpoint: 'product-pages', urlPrefix: '', query: 'fields[0]=slug&fields[1]=updatedAt&populate[sitemap]=*' },
  { group: 'pages', type: 'collection', endpoint: 'sales-landing-pages', urlPrefix: '/sales', query: 'fields[0]=slug&fields[1]=updatedAt&populate[sitemap]=*' },
  { group: 'pages', type: 'collection', endpoint: 'basic-static-pages', urlPrefix: '', query: 'fields[0]=slug&fields[1]=updatedAt&populate[sitemap]=*' },

  // Single Types in 'pages'
  { group: 'pages', type: 'single', endpoint: 'home', path: '/', query: 'populate[sitemap]=*' },
  { group: 'pages', type: 'single', endpoint: 'about-page', path: '/about-us', query: 'populate[sitemap]=*' },
  { group: 'pages', type: 'single', endpoint: 'airport-transfers-page', path: '/airport-transfers', query: 'populate[sitemap]=*' },
  { group: 'pages', type: 'single', endpoint: 'booking-process-page', path: '/booking-process', query: 'populate[sitemap]=*' },
  { group: 'pages', type: 'single', endpoint: 'dragons-den-page', path: '/dragons-den', query: 'populate[sitemap]=*' },
  { group: 'pages', type: 'single', endpoint: 'events-page', path: '/events', query: 'populate[sitemap]=*' },
  { group: 'pages', type: 'single', endpoint: 'faqs-index-page', path: '/faqs', query: 'populate[sitemap]=*' },
  { group: 'pages', type: 'single', endpoint: 'flights-page', path: '/flights', query: 'populate[sitemap]=*' },
  { group: 'pages', type: 'single', endpoint: 'jamie-murray-page', path: '/jamie-murray-tennis-programme', query: 'populate[sitemap]=*' },
  { group: 'pages', type: 'single', endpoint: 'join-the-team-page', path: '/join-the-team', query: 'populate[sitemap]=*' },
  { group: 'pages', type: 'single', endpoint: 'privacy-policy-page', path: '/privacy-policy', query: 'populate[sitemap]=*' },
  { group: 'pages', type: 'single', endpoint: 'self-rating-guide-page', path: '/self-rating-guide', query: 'populate[sitemap]=*' },
  { group: 'pages', type: 'single', endpoint: 'terms-page', path: '/terms-and-conditions', query: 'populate[sitemap]=*' },
  { group: 'pages', type: 'single', endpoint: 'travel-guides-page', path: '/travel-guides', query: 'populate[sitemap]=*' },
  { group: 'pages', type: 'single', endpoint: 'venues-page', path: '/venues', query: 'populate[sitemap]=*' },
  { group: 'pages', type: 'single', endpoint: 'video-archive-page', path: '/videos', query: 'populate[sitemap]=*' },
  { group: 'pages', type: 'single', endpoint: 'welcomepacks-page', path: '/welcomepacks', query: 'populate[sitemap]=*' },
  { group: 'pages', type: 'single', endpoint: 'whatsapp-groups-page', path: '/whatsapp-groups', query: 'populate[sitemap]=*' },

  // --- MANUAL PAGES (Static/Index Pages) ---
  { group: 'blog', type: 'manual', path: '/blog', changefreq: 'daily', priority: 0.9 },
  
  // Blog Categories
  { group: 'blog', type: 'manual', path: '/blog/tennis-coaching', changefreq: 'weekly', priority: 0.8 },
  { group: 'blog', type: 'manual', path: '/blog/grand-slam-tennis', changefreq: 'weekly', priority: 0.8 },
  { group: 'blog', type: 'manual', path: '/blog/padel-tennis', changefreq: 'weekly', priority: 0.8 },
  { group: 'blog', type: 'manual', path: '/blog/ski-holidays', changefreq: 'weekly', priority: 0.8 },
  { group: 'blog', type: 'manual', path: '/blog/tennis-camps', changefreq: 'weekly', priority: 0.8 },
  { group: 'blog', type: 'manual', path: '/blog/tennis-clinics', changefreq: 'weekly', priority: 0.8 },
  { group: 'blog', type: 'manual', path: '/blog/tennis-courts', changefreq: 'weekly', priority: 0.8 },
  { group: 'blog', type: 'manual', path: '/blog/tennis-fitness', changefreq: 'weekly', priority: 0.8 },
  { group: 'blog', type: 'manual', path: '/blog/tennis-holidays', changefreq: 'weekly', priority: 0.8 },
  { group: 'blog', type: 'manual', path: '/blog/tennis-injuries', changefreq: 'weekly', priority: 0.8 },
  { group: 'blog', type: 'manual', path: '/blog/tennis-rackets', changefreq: 'weekly', priority: 0.8 },
  { group: 'blog', type: 'manual', path: '/blog/travel-tips', changefreq: 'weekly', priority: 0.8 },
  { group: 'blog', type: 'manual', path: '/blog/uncategorized', changefreq: 'weekly', priority: 0.5 },

  // Collection Landing/Index Pages
  { group: 'pages', type: 'manual', path: '/adult-only-tennis-holidays', changefreq: 'monthly', priority: 0.8 },
  { group: 'pages', type: 'manual', path: '/family-holidays', changefreq: 'monthly', priority: 0.8 },
  { group: 'pages', type: 'manual', path: '/group-organiser', changefreq: 'monthly', priority: 0.8 },
  { group: 'pages', type: 'manual', path: '/junior-tennis-camp', changefreq: 'monthly', priority: 0.8 }, // Singular
  { group: 'pages', type: 'manual', path: '/junior-tennis-camps', changefreq: 'monthly', priority: 0.8 }, // Plural (Marketing)
  { group: 'pages', type: 'manual', path: '/one-day-tennis-clinics', changefreq: 'monthly', priority: 0.8 },
  { group: 'pages', type: 'manual', path: '/padel-holiday', changefreq: 'monthly', priority: 0.8 },
  { group: 'pages', type: 'manual', path: '/padel-tennis-holiday', changefreq: 'monthly', priority: 0.8 },
  { group: 'pages', type: 'manual', path: '/padel-tennis-holidays-info', changefreq: 'monthly', priority: 0.8 },
  { group: 'pages', type: 'manual', path: '/pickleball-holiday', changefreq: 'monthly', priority: 0.8 },
  { group: 'pages', type: 'manual', path: '/pickleball-holidays-info', changefreq: 'monthly', priority: 0.8 },
  { group: 'pages', type: 'manual', path: '/play-and-watch', changefreq: 'monthly', priority: 0.8 },
  { group: 'pages', type: 'manual', path: '/school-tennis-tour', changefreq: 'monthly', priority: 0.8 },
  { group: 'pages', type: 'manual', path: '/school-tennis-tours', changefreq: 'monthly', priority: 0.8 },
  { group: 'pages', type: 'manual', path: '/ski', changefreq: 'monthly', priority: 0.8 },
  { group: 'pages', type: 'manual', path: '/ski-holiday', changefreq: 'monthly', priority: 0.8 },
  { group: 'pages', type: 'manual', path: '/tennis-academy', changefreq: 'monthly', priority: 0.8 },
  { group: 'pages', type: 'manual', path: '/tennis-clinic', changefreq: 'monthly', priority: 0.8 },
  { group: 'pages', type: 'manual', path: '/tennis-facility-management', changefreq: 'monthly', priority: 0.8 },
  { group: 'pages', type: 'manual', path: '/tennis-holiday', changefreq: 'monthly', priority: 0.8 },
  { group: 'pages', type: 'manual', path: '/tournament-trips', changefreq: 'monthly', priority: 0.8 },
  { group: 'pages', type: 'manual', path: '/uk-weekend-breaks', changefreq: 'monthly', priority: 0.8 },
];

// Helper to normalize entries
const normalizeEntry = (entry, typeConfig) => {
  // Skip if explicit "showInSitemap" is false
  if (entry.sitemap?.showInSitemap === false) return null;

  let path = typeConfig.path || typeConfig.urlPrefix;

  // For collections, append the slug
  if (typeConfig.type === 'collection') {
    // Handle Blog specific logic (Using categorySlug field)
    if (typeConfig.endpoint === 'blogs') {
      if (entry.categorySlug) {
        path += `/${entry.categorySlug}`;
      }
    }
    
    // Ensure slug exists before appending
    if (entry.slug) {
      path += `/${entry.slug}`;
    } else {
      // Skip entries without slugs if they are collections
      return null;
    }
  }

  // Default Priorities
  let defaultPriority = 0.5;
  if (typeConfig.type === 'single') defaultPriority = 0.8;
  if (typeConfig.type === 'manual') defaultPriority = typeConfig.priority || 0.8;
  if (path === '/') defaultPriority = 1.0;

  return {
    loc: path,
    lastmod: entry.updatedAt || new Date().toISOString(),
    changefreq: entry.sitemap?.changeFrequency || typeConfig.changefreq || (typeConfig.type === 'single' ? 'monthly' : 'weekly'),
    priority: entry.sitemap?.priority || defaultPriority
  };
};

// Get unique groups
function getSitemapGroups() {
  const groups = new Set(CONTENT_TYPES.map(c => c.group));
  return Array.from(groups).sort();
}

// Helper to fetch ALL pages from Strapi with pagination
async function fetchAllPages(endpoint, query) {
  let allData = [];
  let page = 1;
  const pageSize = 100; // Fetch 100 at a time
  let pageCount = 1;

  try {
    do {
      // Construct pagination query
      // Ensure query doesn't already have pagination
      const paginationParams = `pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
      const fullQuery = `${query}&${paginationParams}`;
      
      console.log(`🔄 [Sitemap] Fetching ${endpoint} (Page ${page})...`);
      const response = await fetchAPI(`/${endpoint}?${fullQuery}`);
      
      if (!response || !response.data) break;
      
      const data = Array.isArray(response.data) ? response.data : [response.data];
      allData = [...allData, ...data];
      
      // Check meta pagination
      if (response.meta && response.meta.pagination) {
        pageCount = response.meta.pagination.pageCount;
      } else {
        pageCount = 1; // If no meta (single type or error), assume 1 page
      }
      
      page++;
    } while (page <= pageCount);
    
    return allData;
  } catch (error) {
    console.error(`❌ [Sitemap] Error fetching pages for ${endpoint}:`, error.message);
    return [];
  }
}

// Get entries filtered by group
async function getSitemapEntries(group = null) {
  console.log(`🗺️ [Sitemap] Fetching entries for group: ${group || 'ALL'}`);
  
  // Filter configs by group if provided
  const configsToFetch = group 
    ? CONTENT_TYPES.filter(c => c.group === group)
    : CONTENT_TYPES;

  const promises = configsToFetch.map(async (config) => {
    try {
      // Handle Manual Pages
      if (config.type === 'manual') {
        return [normalizeEntry({ updatedAt: new Date().toISOString() }, config)];
      }

      if (config.type === 'single') {
        // Single types don't need pagination loop, just simple fetch
        const response = await fetchAPI(`/${config.endpoint}?${config.query}`);
        if (!response?.data) return [];
        const attributes = response.data.attributes || response.data;
        const entry = normalizeEntry({ ...attributes, id: response.data.id }, config);
        return entry ? [entry] : [];
      }

      if (config.type === 'collection') {
        // Use recursive fetch for collections
        const rawData = await fetchAllPages(config.endpoint, config.query);
        
        return rawData
          .map(item => {
             const attributes = item.attributes || item;
             return normalizeEntry({ ...attributes, id: item.id }, config);
          })
          .filter(Boolean);
      }
      
      return [];
    } catch (error) {
      console.error(`❌ [Sitemap] Error processing ${config.endpoint}:`, error.message);
      return [];
    }
  });

  const results = await Promise.all(promises);
  const flattened = results.flat();
  
  // Remove duplicates based on loc
  const unique = new Map();
  for (const item of flattened) {
    unique.set(item.loc, item);
  }
  
  console.log(`✅ [Sitemap] Found ${unique.size} URLs for ${group || 'ALL'}`);
  return Array.from(unique.values());
}

export { getSitemapEntries as a, getSitemapGroups as g };
