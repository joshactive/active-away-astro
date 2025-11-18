import type { APIRoute } from 'astro';

/**
 * Get Clinics API Endpoint
 * Returns a list of all clinic names from tennis-clinics collection
 */

export const GET: APIRoute = async ({ locals }) => {
  const runtimeEnv = locals.runtime?.env || {};
  const globalEnv = (globalThis as any)?.__env ?? (globalThis as any)?.ENV ?? {};
  const STRAPI_URL = runtimeEnv.STRAPI_URL 
    || globalEnv.STRAPI_URL 
    || import.meta.env.STRAPI_URL 
    || 'https://strapi-production-b96d.up.railway.app';
  const STRAPI_TOKEN = runtimeEnv.STRAPI_API_TOKEN 
    || globalEnv.STRAPI_API_TOKEN 
    || import.meta.env.STRAPI_API_TOKEN;

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (STRAPI_TOKEN) {
      headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`;
    }

    const clinicNames = new Set<string>();

    // Fetch tennis clinics
    try {
      const response = await fetch(
        `${STRAPI_URL}/api/tennis-clinics?pagination[pageSize]=100&fields[0]=title`,
        { headers }
      );

      if (response.ok) {
        const data = await response.json();
        
        if (data.data && Array.isArray(data.data)) {
          data.data.forEach((item: any) => {
            const title = item.title || item.attributes?.title;
            if (title) {
              clinicNames.add(title);
            }
          });
        }
        
        console.log('✅ Fetched tennis-clinics');
      } else {
        console.warn('Failed to fetch tennis-clinics:', response.status);
      }
    } catch (error) {
      console.error('Error fetching tennis-clinics:', error);
    }

    // Convert Set to sorted array
    const clinics = Array.from(clinicNames).sort();

    console.log(`✅ Fetched ${clinics.length} unique clinic names`);

    return new Response(JSON.stringify({ 
      success: true,
      clinics: clinics
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache' // No caching during development
      }
    });

  } catch (error) {
    console.error('❌ Error fetching clinics:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Failed to fetch clinics',
      clinics: []
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

