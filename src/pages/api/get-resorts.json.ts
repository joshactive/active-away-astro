import type { APIRoute } from 'astro';

/**
 * Get Resorts API Endpoint
 * Returns a list of all resort/venue names from various collection types
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

    const resortNames = new Set<string>();

    // Fetch only from these specific collection types
    try {
      // 1. Padel Tennis Holidays
      const padelResponse = await fetch(
        `${STRAPI_URL}/api/padel-tennis-holidays?pagination[pageSize]=100&fields[0]=title`,
        { headers }
      );
      if (padelResponse.ok) {
        const padelData = await padelResponse.json();
        padelData.data?.forEach((item: any) => {
          const title = item.title || item.attributes?.title;
          if (title) resortNames.add(title);
        });
        console.log('✅ Fetched padel-tennis-holidays');
      }

      // 2. Pickleball Holidays
      const pickleballResponse = await fetch(
        `${STRAPI_URL}/api/pickleball-holidays?pagination[pageSize]=100&fields[0]=title`,
        { headers }
      );
      if (pickleballResponse.ok) {
        const pickleballData = await pickleballResponse.json();
        pickleballData.data?.forEach((item: any) => {
          const title = item.title || item.attributes?.title;
          if (title) resortNames.add(title);
        });
        console.log('✅ Fetched pickleball-holidays');
      }

      // 3. Play & Watch
      const playWatchResponse = await fetch(
        `${STRAPI_URL}/api/play-and-watches?pagination[pageSize]=100&fields[0]=title`,
        { headers }
      );
      if (playWatchResponse.ok) {
        const playWatchData = await playWatchResponse.json();
        playWatchData.data?.forEach((item: any) => {
          const title = item.title || item.attributes?.title;
          if (title) resortNames.add(title);
        });
        console.log('✅ Fetched play-and-watches');
      }

      // 4. Ski Holidays
      const skiResponse = await fetch(
        `${STRAPI_URL}/api/ski-holidays?pagination[pageSize]=100&fields[0]=title`,
        { headers }
      );
      if (skiResponse.ok) {
        const skiData = await skiResponse.json();
        skiData.data?.forEach((item: any) => {
          const title = item.title || item.attributes?.title;
          if (title) resortNames.add(title);
        });
        console.log('✅ Fetched ski-holidays');
      }

      // 5. Tennis Holidays
      const tennisResponse = await fetch(
        `${STRAPI_URL}/api/tennis-holidays?pagination[pageSize]=100&fields[0]=title`,
        { headers }
      );
      if (tennisResponse.ok) {
        const tennisData = await tennisResponse.json();
        tennisData.data?.forEach((item: any) => {
          const title = item.title || item.attributes?.title;
          if (title) resortNames.add(title);
        });
        console.log('✅ Fetched tennis-holidays');
      }

    } catch (error) {
      console.error('Error fetching resorts:', error);
    }

    // Convert Set to sorted array
    const resorts = Array.from(resortNames).sort();

    console.log(`✅ Fetched ${resorts.length} unique resort names`);

    return new Response(JSON.stringify({ 
      success: true,
      resorts: resorts
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache' // No caching during development
      }
    });

  } catch (error) {
    console.error('❌ Error fetching resorts:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Failed to fetch resorts',
      resorts: []
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

