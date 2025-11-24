
export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    const body = await request.json();
    const { eventName, eventId, eventTime, eventSourceUrl, userData, customData } = body;

    // Configuration
    const PIXEL_ID = '1239031756107828';
    const ACCESS_TOKEN = env.META_CONVERSIONS_API_TOKEN; // Needs to be set in Cloudflare Dashboard

    if (!ACCESS_TOKEN) {
      console.warn('Missing META_CONVERSIONS_API_TOKEN');
      // Don't fail hard for the client, just log it
      return new Response(JSON.stringify({ status: 'skipped', reason: 'missing_token' }), { status: 200 });
    }

    // Helper to hash data (SHA-256)
    async function hashData(data) {
      if (!data) return undefined;
      const normalized = data.trim().toLowerCase();
      const msgBuffer = new TextEncoder().encode(normalized);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Prepare User Data
    // See: https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/customer-information-parameters
    const hashedUserData = {
      em: userData.email ? await hashData(userData.email) : undefined,
      ph: userData.phone ? await hashData(userData.phone) : undefined,
      fn: userData.firstName ? await hashData(userData.firstName) : undefined,
      ln: userData.lastName ? await hashData(userData.lastName) : undefined,
      ct: userData.city ? await hashData(userData.city) : undefined,
      st: userData.state ? await hashData(userData.state) : undefined,
      zp: userData.zip ? await hashData(userData.zip) : undefined,
      country: userData.country ? await hashData(userData.country) : undefined,
      client_ip_address: request.headers.get('CF-Connecting-IP'),
      client_user_agent: request.headers.get('User-Agent'),
      fbc: getCookie(request, '_fbc'),
      fbp: getCookie(request, '_fbp'),
    };

    // Remove undefined keys
    Object.keys(hashedUserData).forEach(key => hashedUserData[key] === undefined && delete hashedUserData[key]);

    // Construct Payload
    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: eventTime,
          event_id: eventId,
          event_source_url: eventSourceUrl,
          action_source: 'website',
          user_data: hashedUserData,
          custom_data: customData,
        }
      ]
    };

    // Send to Meta
    const response = await fetch(`https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Meta CAPI Error:', JSON.stringify(result));
      return new Response(JSON.stringify({ status: 'error', details: result }), { status: 500 });
    }

    return new Response(JSON.stringify({ status: 'success', fb_trace_id: result.fbtrace_id }), { status: 200 });

  } catch (err) {
    console.error('Handler Error:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// Helper to parse cookies from request header
function getCookie(request, name) {
  const cookieString = request.headers.get('Cookie');
  if (!cookieString) return undefined;
  const cookies = cookieString.split(';');
  for (let cookie of cookies) {
    const [key, value] = cookie.split('=').map(c => c.trim());
    if (key === name) return value;
  }
  return undefined;
}

