import type { APIRoute } from 'astro';

/**
 * Get Subscriber Preferences API Endpoint
 * Fetches subscriber's current preferences from Moosend
 * 
 * Usage:
 * GET /api/get-preferences.json?email=user@example.com
 */

export const GET: APIRoute = async ({ request, locals }) => {
  const url = new URL(request.url);
  const email = url.searchParams.get('email');

  // Get environment variables
  const runtimeEnv = locals.runtime?.env || {};
  const globalEnv = (globalThis as any)?.__env ?? (globalThis as any)?.ENV ?? {};
  
  const MOOSEND_API_KEY = runtimeEnv.MOOSEND_API_KEY 
    || globalEnv.MOOSEND_API_KEY 
    || import.meta.env.MOOSEND_API_KEY;
  
  const MOOSEND_MAILING_LIST_ID = runtimeEnv.MOOSEND_MAILING_LIST_ID 
    || globalEnv.MOOSEND_MAILING_LIST_ID 
    || import.meta.env.MOOSEND_MAILING_LIST_ID;
  
  const IS_DEV = runtimeEnv.DEV ?? globalEnv.DEV ?? import.meta.env.DEV;

  // Validate email parameter
  if (!email) {
    return new Response(JSON.stringify({ 
      error: 'Email parameter is required',
      preferences: []
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Validate API credentials
  if (!MOOSEND_API_KEY || !MOOSEND_MAILING_LIST_ID) {
    console.error('❌ Moosend API credentials not configured');
    return new Response(JSON.stringify({ 
      error: 'Preferences service not configured',
      preferences: []
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Call Moosend API to get subscriber details
    // Correct format: /subscribers/{listId}/view.json?Email={email}
    const moosendUrl = `https://api.moosend.com/v3/subscribers/${MOOSEND_MAILING_LIST_ID}/view.json?apikey=${MOOSEND_API_KEY}&Email=${encodeURIComponent(email)}`;
    
    if (IS_DEV) {
      console.log('📤 Fetching subscriber from Moosend:', email);
      console.log('📤 URL:', moosendUrl.replace(MOOSEND_API_KEY, 'HIDDEN'));
    }

    const moosendResponse = await fetch(moosendUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    const responseText = await moosendResponse.text();
    if (IS_DEV) {
      console.log('📥 Raw response:', responseText.substring(0, 300));
    }
    
    const moosendResult = JSON.parse(responseText);
    
    if (IS_DEV) {
      console.log('📥 Moosend response status:', moosendResponse.status);
      console.log('📥 Moosend response:', JSON.stringify(moosendResult, null, 2));
    }

    // Check if subscriber was found
    if (moosendResult.Code !== 0 || moosendResult.Error) {
      if (IS_DEV) console.log('ℹ️ Subscriber not found or error:', moosendResult.Error);
      return new Response(JSON.stringify({ 
        success: true,
        found: false,
        email: email,
        preferences: [],
        message: 'Subscriber not found'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Extract preferences from the built-in Preferences field (not CustomFields)
    const subscriber = moosendResult.Context;
    let preferences: string[] = [];

    if (subscriber && subscriber.Preferences) {
      // Preferences is a built-in Moosend field that's already an array of strings
      if (Array.isArray(subscriber.Preferences)) {
        preferences = subscriber.Preferences;
      } else if (typeof subscriber.Preferences === 'string') {
        // Fallback: split comma-separated if it's a string
        preferences = subscriber.Preferences
          .split(',')
          .map((p: string) => p.trim())
          .filter((p: string) => p.length > 0);
      }
    }

    if (IS_DEV) {
      console.log('✅ Found preferences:', preferences);
    }

    return new Response(JSON.stringify({ 
      success: true,
      found: true,
      email: email,
      name: subscriber?.Name || '',
      preferences: preferences
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Get preferences error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch preferences',
      preferences: [],
      details: IS_DEV && error instanceof Error ? error.message : undefined
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
