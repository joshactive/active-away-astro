import type { APIRoute } from 'astro';

/**
 * Update Preferences API Endpoint
 * Updates subscriber preferences directly via Moosend API
 * 
 * Usage:
 * POST /api/update-preferences.json
 * Body: { "email": "user@example.com", "preferences": ["Adult Tennis", "Padel"], "turnstileToken": "..." }
 */

// Test endpoint
export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ 
    status: 'ok',
    message: 'Update Preferences API endpoint is working',
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const POST: APIRoute = async ({ request, locals }) => {
  console.log('📝 Update Preferences API called');
  
  // Get environment variables
  const runtimeEnv = locals.runtime?.env || {};
  const globalEnv = (globalThis as any)?.__env ?? (globalThis as any)?.ENV ?? {};
  
  const MOOSEND_API_KEY = runtimeEnv.MOOSEND_API_KEY 
    || globalEnv.MOOSEND_API_KEY 
    || import.meta.env.MOOSEND_API_KEY;
  
  const MOOSEND_MAILING_LIST_ID = runtimeEnv.MOOSEND_MAILING_LIST_ID 
    || globalEnv.MOOSEND_MAILING_LIST_ID 
    || import.meta.env.MOOSEND_MAILING_LIST_ID;
  
  const TURNSTILE_SECRET = runtimeEnv.TURNSTILE_SECRET_KEY 
    || globalEnv.TURNSTILE_SECRET_KEY 
    || import.meta.env.TURNSTILE_SECRET_KEY;
  
  const IS_DEV = runtimeEnv.DEV ?? globalEnv.DEV ?? import.meta.env.DEV;

  // Validate API credentials
  if (!MOOSEND_API_KEY) {
    console.error('❌ MOOSEND_API_KEY not configured');
    return new Response(JSON.stringify({ 
      error: 'Preferences service not configured' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (!MOOSEND_MAILING_LIST_ID) {
    console.error('❌ MOOSEND_MAILING_LIST_ID not configured');
    return new Response(JSON.stringify({ 
      error: 'Preferences service not configured' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Parse request body
    let body;
    try {
      const rawBody = await request.text();
      
      if (!rawBody || rawBody.trim().length === 0) {
        console.error('❌ Request body is empty');
        return new Response(JSON.stringify({ 
          error: 'Request body is empty'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      body = JSON.parse(rawBody);
      if (IS_DEV) console.log('📦 Parsed body:', body);
    } catch (parseError) {
      console.error('❌ Failed to parse request body:', parseError);
      return new Response(JSON.stringify({ 
        error: 'Invalid request format'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { email, preferences, turnstileToken } = body;

    // Validate required fields
    if (!email) {
      return new Response(JSON.stringify({ 
        error: 'Email is required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!preferences || !Array.isArray(preferences) || preferences.length === 0) {
      return new Response(JSON.stringify({ 
        error: 'At least one preference must be selected' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ 
        error: 'Invalid email address' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verify Turnstile token (if configured and provided)
    if (TURNSTILE_SECRET && turnstileToken) {
      try {
        const turnstileResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            secret: TURNSTILE_SECRET,
            response: turnstileToken,
          }),
        });

        const turnstileResult = await turnstileResponse.json();
        
        if (!turnstileResult.success) {
          console.error('❌ Turnstile verification failed:', turnstileResult);
          return new Response(JSON.stringify({ 
            error: 'Security verification failed. Please try again.' 
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        if (IS_DEV) console.log('✅ Turnstile verification passed');
      } catch (turnstileError) {
        console.error('❌ Turnstile verification error:', turnstileError);
        // Don't fail the request if Turnstile verification fails due to network issues
      }
    }

    // Preferences is a built-in Moosend field (NOT a custom field)
    // It must be passed as an array of strings
    if (IS_DEV) console.log('📋 Preferences to save:', preferences);

    // Use the subscribe endpoint which handles both create and update
    const subscribeUrl = `https://api.moosend.com/v3/subscribers/${MOOSEND_MAILING_LIST_ID}/subscribe.json?apikey=${MOOSEND_API_KEY}`;
    
    // Moosend's Preferences field requires an array of exact option values
    const moosendPayload = {
      Email: email,
      Preferences: preferences  // Array of strings like ["Tennis", "Padel"]
    };

    if (IS_DEV) {
      console.log('📤 Updating subscriber preferences...');
      console.log('📦 Payload:', JSON.stringify(moosendPayload, null, 2));
    }

    const moosendResponse = await fetch(subscribeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(moosendPayload)
    });

    const responseText = await moosendResponse.text();
    if (IS_DEV) console.log('📥 Moosend response:', responseText.substring(0, 500));
    
    let moosendResult;
    if (!responseText.startsWith('{')) {
      throw new Error('Moosend returned invalid response: ' + responseText.substring(0, 100));
    }
    moosendResult = JSON.parse(responseText);
    
    if (IS_DEV) {
      console.log('📥 Moosend response status:', moosendResponse.status);
      console.log('📥 Moosend result:', JSON.stringify(moosendResult, null, 2));
    }

    // Check Moosend response
    if (!moosendResponse.ok) {
      console.error('❌ Moosend API error:', moosendResponse.status, moosendResult);
      return new Response(JSON.stringify({ 
        error: 'Failed to update preferences. Please try again.' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check for Moosend-specific error codes in successful response
    if (moosendResult.Code !== 0 && moosendResult.Error) {
      console.error('❌ Moosend returned error:', moosendResult.Error);
      return new Response(JSON.stringify({ 
        error: moosendResult.Error || 'Failed to update preferences' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('✅ Preferences updated successfully for:', email, '| Preferences:', preferences.join(', '));

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Preferences updated successfully!',
      email: email,
      preferences: preferences
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Update preferences error:', error);
    return new Response(JSON.stringify({ 
      error: 'An unexpected error occurred. Please try again.',
      details: IS_DEV && error instanceof Error ? error.message : undefined
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
