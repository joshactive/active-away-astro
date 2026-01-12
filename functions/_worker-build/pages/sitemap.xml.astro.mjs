globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getSitemapGroups, a as getSitemapEntries } from '../chunks/sitemap_DdmAJyL8.mjs';
export { renderers } from '../renderers.mjs';

const GET = async ({ request }) => {
  const siteUrl = "https://activeaway.com";
  const baseUrl = siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl;
  const groups = getSitemapGroups();
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const groupData = await Promise.all(groups.map(async (group) => {
    try {
      const entries = await getSitemapEntries(group);
      let lastmod = now;
      if (entries.length > 0) {
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
  ${groupData.map((data) => `
  <sitemap aa:count="${data.count}">
    <loc>${baseUrl}/${data.group}-sitemap.xml</loc>
    <lastmod>${data.lastmod}</lastmod>
  </sitemap>
  `).join("")}
</sitemapindex>`;
  return new Response(sitemapIndex, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
