import type { APIRoute } from 'astro';
import { getPreOrderBySlug } from '../../utils/strapi.js';

/**
 * Pre-Order Form Submission API Endpoint
 * Handles form submissions and forwards to webhook (Zapier/Make)
 * Fetches webhook URL from Strapi server-side for security
 * 
 * Usage:
 * POST /api/submit-pre-order.json
 * Body: { "preOrderSlug": "...", "preOrderTitle": "...", "formData": {...} }
 */

// Test endpoint
export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ 
    status: 'ok',
    message: 'Pre-order submission API endpoint is working',
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const POST: APIRoute = async ({ request }) => {
  console.log('📦 Pre-order submission API called');
  console.log('📨 Request method:', request.method);
  console.log('📨 Request URL:', request.url);

  try {
    let body;
    let rawBody = '';
    
    try {
      const contentType = request.headers.get('content-type');
      console.log('📋 Content-Type:', contentType);
      
      if (contentType?.includes('application/json')) {
        rawBody = await request.text();
        console.log('📄 Raw body length:', rawBody.length);
        body = JSON.parse(rawBody);
      } else if (contentType?.includes('application/x-www-form-urlencoded')) {
        const formData = await request.formData();
        body = Object.fromEntries(formData);
      } else {
        rawBody = await request.text();
        body = JSON.parse(rawBody);
      }
    } catch (parseError) {
      console.error('❌ Error parsing request body:', parseError);
      return new Response(JSON.stringify({ 
        error: 'Invalid request format',
        details: parseError instanceof Error ? parseError.message : 'Unknown error'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('📦 Parsed body keys:', Object.keys(body));

    // Extract slug and form data
    const { preOrderSlug, formData, preOrderTitle } = body;

    if (!preOrderSlug) {
      console.error('❌ No pre-order slug provided');
      return new Response(JSON.stringify({ 
        error: 'Pre-order slug is required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fetch webhook URL from Strapi (server-side, never exposed to client)
    console.log('🔍 Fetching webhook URL from Strapi for slug:', preOrderSlug);
    let webhookUrl: string | null = null;
    
    try {
      const preOrderData = await getPreOrderBySlug(preOrderSlug);
      
      if (!preOrderData) {
        console.error('❌ Pre-order not found:', preOrderSlug);
        return new Response(JSON.stringify({ 
          error: 'Pre-order not found' 
        }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      webhookUrl = (preOrderData as any).formWebhookUrl || null;
      console.log('✅ Webhook URL fetched from Strapi');
      
    } catch (strapiError) {
      console.error('❌ Error fetching from Strapi:', strapiError);
      return new Response(JSON.stringify({ 
        error: 'Failed to retrieve form configuration',
        details: strapiError instanceof Error ? strapiError.message : 'Unknown error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!webhookUrl) {
      console.error('❌ No webhook URL configured for this pre-order');
      return new Response(JSON.stringify({ 
        error: 'Form submission is not configured for this pre-order. Please contact us directly.' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!formData || typeof formData !== 'object') {
      console.error('❌ Invalid form data');
      return new Response(JSON.stringify({ 
        error: 'Form data is required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('📋 Pre-order submission:', {
      preOrderTitle: preOrderTitle || 'Unknown',
      webhookUrl: webhookUrl.substring(0, 50) + '...',
      formDataKeys: Object.keys(formData)
    });

    // Forward to webhook (Zapier, Make, etc.)
    try {
      const webhookPayload = {
        preOrderTitle: preOrderTitle || 'Pre-Order Submission',
        submittedAt: new Date().toISOString(),
        source: 'Active Away Website - Pre-Order Form',
        formData: formData
      };

      console.log('📤 Sending to webhook:', webhookUrl.substring(0, 50) + '...');
      console.log('📦 Payload:', JSON.stringify(webhookPayload, null, 2));

      const webhookResponse = await fetch(webhookUrl, {
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

      // Zapier/Make webhooks typically return plain text "Accepted" or JSON
      const contentType = webhookResponse.headers.get('content-type');
      let webhookResult;
      
      if (contentType && contentType.includes('application/json')) {
        webhookResult = await webhookResponse.json();
      } else {
        webhookResult = await webhookResponse.text();
      }
      
      console.log('✅ Webhook response:', webhookResult);
      console.log('✅ Pre-order submission successful');

      return new Response(JSON.stringify({ 
        success: true,
        message: 'Your submission has been received. Thank you!',
        timestamp: new Date().toISOString()
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (webhookError) {
      console.error('❌ Webhook submission failed:', webhookError);
      return new Response(JSON.stringify({ 
        error: 'Failed to submit form. Please try again later.',
        details: webhookError instanceof Error ? webhookError.message : 'Unknown error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('❌ Pre-order submission error:', error);
    return new Response(JSON.stringify({ 
      error: 'An unexpected error occurred',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

