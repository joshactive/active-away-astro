import type { APIRoute } from 'astro';
import { getSitemapEntries, getSitemapGroups } from '../utils/sitemap';

export const GET: APIRoute = async ({ params, request }) => {
  const group = params.group;
  if (!group) {
    return new Response('Sitemap group not found', { status: 404 });
  }

  const siteUrl = import.meta.env.SITE || 'https://activeaway.com';

  try {
    const pages = await getSitemapEntries(group);
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/default-sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(page => {
    const loc = page.loc.startsWith('/') ? page.loc : `/${page.loc}`;
    const baseUrl = siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl;
    const fullUrl = `${baseUrl}${loc}`;
    
    return `
  <url>
    <loc>${fullUrl}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  }).join('')}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error(`Error generating sitemap for group ${group}:`, error);
    return new Response('Internal Server Error', { status: 500 });
  }
};
