import type { APIRoute } from 'astro';

/**
 * Newsletter Signup API Endpoint
 * Handles form submissions and forwards to webhook
 * 
 * Usage:
 * POST /api/newsletter-signup.json
 * Body: { "name": "John Doe", "email": "john@example.com" }
 */

// Test endpoint
export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ 
    status: 'ok',
    message: 'Newsletter API endpoint is working',
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const POST: APIRoute = async ({ request }) => {
  console.log('🔔 Newsletter API called');
  console.log('📨 Request method:', request.method);
  console.log('📨 Request URL:', request.url);
  const WEBHOOK_URL = import.meta.env.NEWSLETTER_WEBHOOK_URL;
  const TURNSTILE_SECRET = import.meta.env.TURNSTILE_SECRET_KEY;
  const IS_DEV = import.meta.env.DEV;
  
  if (!WEBHOOK_URL) {
    console.error('❌ NEWSLETTER_WEBHOOK_URL not configured');
    return new Response(JSON.stringify({ 
      error: 'Newsletter service not configured' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    let body;
    let rawBody = '';
    
    try {
      const contentType = request.headers.get('content-type');
      console.log('📨 Request Content-Type:', contentType);
      console.log('📨 All Headers:', Object.fromEntries(request.headers.entries()));
      
      // Read the raw body as text first
      rawBody = await request.text();
      console.log('📨 Raw request body:', rawBody);
      console.log('📨 Raw body length:', rawBody.length);
      console.log('📨 Body is empty:', rawBody.length === 0);
      
      // Check if body is empty
      if (!rawBody || rawBody.trim().length === 0) {
        console.error('❌ Request body is empty!');
        return new Response(JSON.stringify({ 
          error: 'Request body is empty. Please ensure you are sending data.',
          debug: {
            contentType,
            bodyLength: rawBody.length,
            headers: Object.fromEntries(request.headers.entries())
          }
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Parse the raw body as JSON
      body = JSON.parse(rawBody);
      console.log('📦 Parsed body:', body);
      console.log('📦 Body keys:', Object.keys(body));
      console.log('📦 Request body details:', { 
        name: body?.name, 
        email: body?.email, 
        hasTurnstileToken: !!body?.turnstileToken 
      });
    } catch (parseError) {
      console.error('❌ Failed to parse request body:', parseError);
      console.error('❌ Parse error details:', {
        message: parseError instanceof Error ? parseError.message : 'Unknown',
        type: typeof parseError,
        rawBody: rawBody.substring(0, 200) // First 200 chars for debugging
      });
      return new Response(JSON.stringify({ 
        error: 'Invalid request format. Please ensure you are sending valid JSON data.',
        details: parseError instanceof Error ? parseError.message : 'Unknown error',
        debug: {
          bodyLength: rawBody.length,
          bodyPreview: rawBody.substring(0, 100)
        }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const { name, email, turnstileToken } = body;

    // Verify Turnstile token (skip in development mode)
    if (TURNSTILE_SECRET && !IS_DEV) {
      if (!turnstileToken) {
        console.warn('⚠️  No Turnstile token provided');
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
          console.error('❌ Turnstile verification failed:', turnstileResult);
          return new Response(JSON.stringify({ 
            error: 'Verification failed. Please try again.' 
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        console.log('✅ Turnstile verification passed');
      } catch (turnstileError) {
        console.error('❌ Turnstile verification error:', turnstileError);
        return new Response(JSON.stringify({ 
          error: 'Verification service error. Please try again.' 
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } else if (IS_DEV) {
      console.warn('⚠️  Development mode: Skipping Turnstile verification');
    } else {
      console.warn('⚠️  Turnstile not configured, skipping verification');
    }
    
    // Validate inputs
    if (!name || !email) {
      return new Response(JSON.stringify({ 
        error: 'Name and email are required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ 
        error: 'Invalid email address' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('📧 Newsletter signup:', { name, email });

    // Forward to webhook (make.com, Zapier, etc.)
    try {
      const webhookPayload = {
        name,
        email,
        timestamp: new Date().toISOString(),
        source: 'Active Away Website - Footer'
      };

      console.log('📤 Sending to webhook:', WEBHOOK_URL);
      console.log('📦 Payload:', webhookPayload);

      const webhookResponse = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookPayload)
      });

      console.log('📥 Webhook response status:', webhookResponse.status);

      if (!webhookResponse.ok) {
        const errorText = await webhookResponse.text();
        console.error('❌ Webhook error:', webhookResponse.status, errorText);
        throw new Error(`Webhook returned ${webhookResponse.status}`);
      }

      // Make.com webhooks typically return plain text "Accepted" or empty response
      const contentType = webhookResponse.headers.get('content-type');
      let webhookResult;
      
      if (contentType && contentType.includes('application/json')) {
        webhookResult = await webhookResponse.json();
      } else {
        webhookResult = await webhookResponse.text();
      }
      
      console.log('✅ Webhook response:', webhookResult);
      console.log('✅ Newsletter signup successful');
    } catch (webhookError) {
      console.error('❌ Webhook request failed:', webhookError);
      throw new Error('Failed to send to webhook service');
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Thank you for subscribing!'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Newsletter signup error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process signup. Please try again.',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

