import type { APIRoute } from 'astro';
import { fetchAPI } from '../utils/strapi';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    // Forward the request to Strapi's sitemap plugin endpoint
    // The plugin usually exposes /sitemap/index.xml or just /sitemap.xml
    // We'll try to proxy the request path (e.g. /sitemap.xml or /sitemap/xsl/sitemap.xsl)
    
    // Determine the Strapi endpoint path
    // If the request is for /sitemap.xml, usually Strapi plugin serves it at /sitemap/index.xml or similar
    // But commonly, standard plugins serve at /sitemap/index.xml
    
    // Let's assume standard behavior:
    // - /sitemap.xml -> proxies to Strapi's /sitemap/index.xml
    // - /sitemap/xsl/* -> proxies to Strapi's /sitemap/xsl/* (for styling)
    
    let strapiPath = '/sitemap/index.xml';
    
    // You might need to adjust this based on exactly how the plugin is configured
    // Standard strapi-plugin-sitemap output:
    const response = await fetch(`${import.meta.env.STRAPI_URL || 'http://localhost:1337'}${strapiPath}`);

    if (!response.ok) {
      return new Response('Sitemap not found', { status: 404 });
    }

    const xml = await response.text();

    // Replace Strapi URL with Site URL in the XML content if necessary
    // (The plugin might generate absolute URLs with Strapi domain if not configured with frontend URL)
    // const siteUrl = import.meta.env.SITE_URL || 'https://activeaway.com';
    // const strapiUrl = import.meta.env.STRAPI_URL || 'http://localhost:1337';
    // const cleanXml = xml.replaceAll(strapiUrl, siteUrl);

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error('Error proxying sitemap:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
};


