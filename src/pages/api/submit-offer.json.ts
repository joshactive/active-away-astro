import type { APIRoute } from 'astro';

/**
 * Make an Offer Submission API Endpoint
 * Handles offer form submissions with Turnstile verification and forwards to webhook
 * 
 * Usage:
 * POST /api/submit-offer.json
 * Body: { ...offerData, "turnstileToken": "..." }
 */

export const POST: APIRoute = async ({ request, locals }) => {
  const runtimeEnv = locals.runtime?.env || {};
  const globalEnv = (globalThis as any)?.__env ?? (globalThis as any)?.ENV ?? {};
  const WEBHOOK_URL = runtimeEnv.MAKE_OFFER_WEBHOOK_URL 
    || globalEnv.MAKE_OFFER_WEBHOOK_URL 
    || import.meta.env.MAKE_OFFER_WEBHOOK_URL;
  const TURNSTILE_SECRET = runtimeEnv.TURNSTILE_SECRET_KEY 
    || globalEnv.TURNSTILE_SECRET_KEY 
    || import.meta.env.TURNSTILE_SECRET_KEY;
  const IS_DEV = runtimeEnv.DEV ?? globalEnv.DEV ?? import.meta.env.DEV;

  if (!WEBHOOK_URL) {
    console.error('❌ MAKE_OFFER_WEBHOOK_URL not configured');
    return new Response(JSON.stringify({ 
      error: 'Service not configured' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      if (IS_DEV) console.error('❌ Failed to parse request body');
      return new Response(JSON.stringify({ error: 'Invalid request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { turnstileToken, ...offerData } = body;

    // Validate required fields
    const requiredFields = ['offerId', 'firstName', 'surname', 'email', 'phone', 'numberOfPeople', 'offerAmount', 'eventTitle'];
    const missingFields = requiredFields.filter(field => !offerData[field]);
    
    if (missingFields.length > 0) {
      return new Response(JSON.stringify({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(offerData.email)) {
      return new Response(JSON.stringify({ 
        error: 'Invalid email address' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate offer amount
    if (typeof offerData.offerAmount !== 'number' || offerData.offerAmount <= 0) {
      return new Response(JSON.stringify({ 
        error: 'Offer amount must be a positive number' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verify Turnstile token (skip in development mode)
    if (TURNSTILE_SECRET && !IS_DEV) {
      if (!turnstileToken) {
        return new Response(JSON.stringify({ 
          error: 'Please complete the verification' 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      try {
        const turnstileResponse = await fetch(
          'https://challenges.cloudflare.com/turnstile/v0/siteverify',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              secret: TURNSTILE_SECRET,
              response: turnstileToken,
            }),
          }
        );

        const turnstileResult = await turnstileResponse.json();

        if (!turnstileResult.success) {
          if (IS_DEV) console.error('❌ Turnstile verification failed:', turnstileResult);
          return new Response(JSON.stringify({ 
            error: 'Verification failed. Please try again.' 
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      } catch (turnstileError) {
        if (IS_DEV) console.error('❌ Turnstile verification error:', turnstileError);
        return new Response(JSON.stringify({ 
          error: 'Verification service error. Please try again.' 
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } else if (IS_DEV) {
      console.warn('⚠️  Development mode: Skipping Turnstile verification');
    }

    // Build webhook payload
    const webhookPayload = {
      offerId: offerData.offerId,
      firstName: offerData.firstName,
      surname: offerData.surname,
      email: offerData.email,
      phone: offerData.phone,
      numberOfPeople: offerData.numberOfPeople,
      offerAmount: offerData.offerAmount,
      message: offerData.message || '',
      eventTitle: offerData.eventTitle,
      eventStartDate: offerData.eventStartDate || '',
      eventEndDate: offerData.eventEndDate || '',
      eventLocation: offerData.eventLocation || '',
      eventVenue: offerData.eventVenue || '',
      eventListedPrice: offerData.eventListedPrice || 0,
      timestamp: new Date().toISOString(),
      source: 'Active Away Website - Make an Offer'
    };

    if (IS_DEV) {
      console.log('📤 Sending offer to webhook:', WEBHOOK_URL.substring(0, 50) + '...');
      console.log('📦 Payload:', JSON.stringify(webhookPayload, null, 2));
    }

    // Forward to webhook
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookPayload),
    });

    if (!response.ok) {
      if (IS_DEV) console.error(`❌ Webhook failed with status ${response.status}`);
      return new Response(JSON.stringify({ error: 'Submission failed' }), {
        status: 502, // Bad Gateway
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (IS_DEV) {
      console.log('✅ Offer submission successful, offer ID:', offerData.offerId);
    }

    return new Response(JSON.stringify({ 
      success: true,
      offerId: offerData.offerId
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    if (IS_DEV) console.error('❌ Offer submission error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: IS_DEV && error instanceof Error ? error.message : undefined
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

