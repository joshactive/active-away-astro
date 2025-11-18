import type { APIRoute } from 'astro';

/**
 * Get Venues API Endpoint
 * Returns a list of all venue names from various collection types
 * Includes clinics and junior camps (unlike get-resorts which excludes them)
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

    const venueNames = new Set<string>();

    // Fetch only from these specific collection types
    try {
      // 1. Junior Tennis Camps
      const juniorCampResponse = await fetch(
        `${STRAPI_URL}/api/junior-tennis-camps?pagination[pageSize]=100&fields[0]=title`,
        { headers }
      );
      if (juniorCampResponse.ok) {
        const data = await juniorCampResponse.json();
        data.data?.forEach((item: any) => {
          const title = item.title || item.attributes?.title;
          if (title) venueNames.add(title);
        });
        console.log('✅ Fetched junior-tennis-camps');
      }

      // 2. Padel Tennis Holidays
      const padelResponse = await fetch(
        `${STRAPI_URL}/api/padel-tennis-holidays?pagination[pageSize]=100&fields[0]=title`,
        { headers }
      );
      if (padelResponse.ok) {
        const data = await padelResponse.json();
        data.data?.forEach((item: any) => {
          const title = item.title || item.attributes?.title;
          if (title) venueNames.add(title);
        });
        console.log('✅ Fetched padel-tennis-holidays');
      }

      // 3. Pickleball Holidays
      const pickleballResponse = await fetch(
        `${STRAPI_URL}/api/pickleball-holidays?pagination[pageSize]=100&fields[0]=title`,
        { headers }
      );
      if (pickleballResponse.ok) {
        const data = await pickleballResponse.json();
        data.data?.forEach((item: any) => {
          const title = item.title || item.attributes?.title;
          if (title) venueNames.add(title);
        });
        console.log('✅ Fetched pickleball-holidays');
      }

      // 4. Play & Watch
      const playWatchResponse = await fetch(
        `${STRAPI_URL}/api/play-and-watches?pagination[pageSize]=100&fields[0]=title`,
        { headers }
      );
      if (playWatchResponse.ok) {
        const data = await playWatchResponse.json();
        data.data?.forEach((item: any) => {
          const title = item.title || item.attributes?.title;
          if (title) venueNames.add(title);
        });
        console.log('✅ Fetched play-and-watches');
      }

      // 5. Ski Holidays
      const skiResponse = await fetch(
        `${STRAPI_URL}/api/ski-holidays?pagination[pageSize]=100&fields[0]=title`,
        { headers }
      );
      if (skiResponse.ok) {
        const data = await skiResponse.json();
        data.data?.forEach((item: any) => {
          const title = item.title || item.attributes?.title;
          if (title) venueNames.add(title);
        });
        console.log('✅ Fetched ski-holidays');
      }

      // 6. Tennis Clinics
      const clinicResponse = await fetch(
        `${STRAPI_URL}/api/tennis-clinics?pagination[pageSize]=100&fields[0]=title`,
        { headers }
      );
      if (clinicResponse.ok) {
        const data = await clinicResponse.json();
        data.data?.forEach((item: any) => {
          const title = item.title || item.attributes?.title;
          if (title) venueNames.add(title);
        });
        console.log('✅ Fetched tennis-clinics');
      }

      // 7. Tennis Holidays
      const tennisResponse = await fetch(
        `${STRAPI_URL}/api/tennis-holidays?pagination[pageSize]=100&fields[0]=title`,
        { headers }
      );
      if (tennisResponse.ok) {
        const data = await tennisResponse.json();
        data.data?.forEach((item: any) => {
          const title = item.title || item.attributes?.title;
          if (title) venueNames.add(title);
        });
        console.log('✅ Fetched tennis-holidays');
      }

    } catch (error) {
      console.error('Error fetching venues:', error);
    }

    // Convert Set to sorted array
    const venues = Array.from(venueNames).sort();

    console.log(`✅ Fetched ${venues.length} unique venue names`);

    return new Response(JSON.stringify({ 
      success: true,
      venues: venues
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache' // No caching during development
      }
    });

  } catch (error) {
    console.error('❌ Error fetching venues:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Failed to fetch venues',
      venues: []
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

