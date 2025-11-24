import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const siteUrl = 'https://activeaway.com';
  
  // Define the sitemaps we will generate
  // Note: In a real implementation, we would dynamically check if these have content
  // For now, we'll replicate the structure requested
  const sitemaps = [
    { loc: `${siteUrl}/addl-sitemap.xml`, lastmod: '2024-07-22T00:00:00+00:00' },
    { loc: `${siteUrl}/post-sitemap.xml`, lastmod: '2025-07-05T05:58:58+00:00' },
    { loc: `${siteUrl}/page-sitemap.xml`, lastmod: '2025-11-05T15:52:32+00:00' },
    { loc: `${siteUrl}/tour-sitemap.xml`, lastmod: '2025-09-13T11:13:24+00:00' },
    { loc: `${siteUrl}/ski-holidays-sitemap.xml`, lastmod: '2025-07-25T10:58:22+00:00' },
    { loc: `${siteUrl}/tennis-clinic-sitemap.xml`, lastmod: '2025-11-15T17:39:30+00:00' },
    { loc: `${siteUrl}/group-organiser-sitemap.xml`, lastmod: '2025-10-20T10:45:14+00:00' },
    { loc: `${siteUrl}/tennis-play-watch-sitemap.xml`, lastmod: '2025-07-21T13:08:18+00:00' },
    { loc: `${siteUrl}/tennis-academies-sitemap.xml`, lastmod: '2025-09-04T15:27:51+00:00' },
    { loc: `${siteUrl}/padel-tennis-holiday-sitemap.xml`, lastmod: '2025-08-11T11:15:07+00:00' },
    { loc: `${siteUrl}/school-tennis-tours-sitemap.xml`, lastmod: '2025-03-14T17:13:51+00:00' },
    { loc: `${siteUrl}/junior-tennis-camps-sitemap.xml`, lastmod: '2025-07-22T16:07:51+00:00' },
    { loc: `${siteUrl}/pickleball-holidays-sitemap.xml`, lastmod: '2025-07-23T11:34:42+00:00' },
    { loc: `${siteUrl}/post-archive-sitemap.xml`, lastmod: '2025-11-15T17:39:30+00:00' },
    { loc: `${siteUrl}/category-sitemap.xml`, lastmod: '2025-07-07T18:52:38+00:00' },
    { loc: `${siteUrl}/post_tag-sitemap.xml`, lastmod: '2025-02-24T16:54:07+00:00' }
  ];

  const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/default-sitemap.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(sitemap => `  <sitemap>
    <loc>${sitemap.loc}</loc>
    <lastmod>${sitemap.lastmod}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;

  return new Response(sitemapXML, {
    headers: {
      'Content-Type': 'application/xml'
    }
  });
};

