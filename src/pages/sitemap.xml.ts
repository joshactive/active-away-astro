import type { APIRoute } from 'astro';
import { getSitemapGroups, getSitemapEntries } from '../utils/sitemap';

export const GET: APIRoute = async ({ request }) => {
  const siteUrl = import.meta.env.SITE || 'https://activeaway.com';
  const baseUrl = siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl;
  
  // Get available groups dynamically from the config
  const groups = getSitemapGroups();
  const now = new Date().toISOString();

  // Fetch counts for each group (Parallel)
  // We need to know how many URLs are in each group to display it
  const groupData = await Promise.all(groups.map(async (group) => {
    try {
      const entries = await getSitemapEntries(group);
      
      // Find the most recent lastmod if available, otherwise use current time
      let lastmod = now;
      if (entries.length > 0) {
        // Sort by date descending to get latest
        const sorted = [...entries].sort((a, b) => {
          const dateA = new Date(a.lastmod || 0).getTime();
          const dateB = new Date(b.lastmod || 0).getTime();
          return dateB - dateA;
        });
        if (sorted[0].lastmod) {
          lastmod = sorted[0].lastmod;
        }
      }

      return {
        group,
        count: entries.length,
        lastmod
      };
    } catch (e) {
      console.error(`Error fetching group ${group} for index:`, e);
      return { group, count: 0, lastmod: now };
    }
  }));

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/default-sitemap.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:aa="http://activeaway.com/schemas/sitemap">
  ${groupData.map(data => `
  <sitemap aa:count="${data.count}">
    <loc>${baseUrl}/${data.group}-sitemap.xml</loc>
    <lastmod>${data.lastmod}</lastmod>
  </sitemap>
  `).join('')}
</sitemapindex>`;

  return new Response(sitemapIndex, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};
