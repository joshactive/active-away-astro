import type { APIRoute } from 'astro';

/**
 * Form Submission API Endpoint
 * Handles dynamic form submissions and forwards to webhook
 * 
 * Usage:
 * POST /api/submit-form.json
 * Body: { "formSlug": "contact-us", "data": {...}, "turnstileToken": "..." }
 */

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ 
    status: 'ok',
    message: 'Form submission API endpoint is working',
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const POST: APIRoute = async ({ request, locals }) => {
  console.log('📝 Form submission API called');
  
  const runtimeEnv = locals.runtime?.env || {};
  const globalEnv = (globalThis as any)?.__env ?? (globalThis as any)?.ENV ?? {};
  const STRAPI_URL = runtimeEnv.STRAPI_URL 
    || globalEnv.STRAPI_URL 
    || import.meta.env.STRAPI_URL 
    || 'https://strapi-production-b96d.up.railway.app';
  const STRAPI_TOKEN = runtimeEnv.STRAPI_API_TOKEN 
    || globalEnv.STRAPI_API_TOKEN 
    || import.meta.env.STRAPI_API_TOKEN;
  const TURNSTILE_SECRET = runtimeEnv.TURNSTILE_SECRET_KEY 
    || globalEnv.TURNSTILE_SECRET_KEY 
    || import.meta.env.TURNSTILE_SECRET_KEY;
  const IS_DEV = runtimeEnv.DEV ?? globalEnv.DEV ?? import.meta.env.DEV;

  try {
    let body;
    let rawBody = '';
    
    try {
      rawBody = await request.text();
      
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
      console.log('📦 Parsed body:', body);
    } catch (parseError) {
      console.error('❌ Failed to parse request body:', parseError);
      return new Response(JSON.stringify({ 
        error: 'Invalid request format'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const { formSlug, data: formData, turnstileToken, webhookUrl: providedWebhookUrl } = body;

    if (!formSlug || !formData) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields: formSlug, data' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fetch webhook URL from Strapi (secure - not exposed to client)
    // OR use provided webhook URL for inline forms (sales landing pages)
    let webhookUrl;
    let formFields: any[] = [];
    let webhookFormat = 'labels';
    let formTitle = '';
    
    if (providedWebhookUrl) {
      // Use provided webhook for inline/embedded forms (JSON-based)
      webhookUrl = providedWebhookUrl;
      formTitle = formSlug;
      webhookFormat = 'names';
      formFields = [];
      console.log('✅ Using provided webhook URL for inline form');
    } else {
      // Fetch from Strapi for regular forms
      try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      // Add authorization if token is available
      if (STRAPI_TOKEN) {
        headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`;
      }
      
      const strapiResponse = await fetch(
        `${STRAPI_URL}/api/forms?filters[slug][$eq]=${encodeURIComponent(formSlug)}`,
        { headers }
      );
      
      if (!strapiResponse.ok) {
        const errorText = await strapiResponse.text();
        console.error('❌ Strapi API error:', strapiResponse.status, errorText);
        throw new Error(`Failed to fetch form configuration: ${strapiResponse.status}`);
      }
      
      const strapiData = await strapiResponse.json();
      
      if (!strapiData.data || strapiData.data.length === 0) {
        console.error(`❌ Form not found in Strapi: ${formSlug}`);
        throw new Error(`Form not found: ${formSlug}`);
      }
      
      const form = strapiData.data[0];
      webhookUrl = form.formWebhookUrl;
      formTitle = form.title || formSlug;
      webhookFormat = form.webhookFormat || 'labels'; // 'labels' or 'names'
      
      if (!webhookUrl) {
        console.error(`❌ No webhook URL configured for form: ${formSlug}`);
        throw new Error('Webhook URL not configured for this form');
      }
      
      // Parse form fields to create name->label mapping
      try {
        if (form.formFields) {
          formFields = typeof form.formFields === 'string' 
            ? JSON.parse(form.formFields) 
            : form.formFields;
        }
      } catch (error) {
        console.warn('⚠️  Could not parse form fields:', error);
      }
      
      console.log(`✅ Webhook URL fetched securely from Strapi for form: ${formSlug}`);
      console.log(`📋 Webhook format: ${webhookFormat}`);
    } catch (strapiError) {
      console.error('❌ Failed to fetch form config from Strapi:', strapiError);
      return new Response(JSON.stringify({ 
        error: 'Form configuration error. Please contact support.',
        details: strapiError instanceof Error ? strapiError.message : 'Unknown error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    }

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

    console.log(`📝 Form submission for: ${formSlug}`);
    console.log('📝 Form data:', formData);

    // Forward to webhook
    try {
      let webhookPayload;
      
      if (webhookFormat === 'labels') {
        // Transform field names to labels for webhook (WordPress-style)
        const transformedData: Record<string, any> = {};
        
        // Add sections and fields in order with labels as keys
        for (const field of formFields) {
          if (field.type === 'section') {
            // Sections are added with empty string value
            transformedData[field.label] = '';
          } else if (field.name && formData[field.name] !== undefined) {
            // Regular fields use label as key
            transformedData[field.label] = formData[field.name];
          }
        }
        
        // Add form metadata
        transformedData['form_id'] = formSlug;
        transformedData['form_name'] = formTitle;
        
        webhookPayload = {
          ...transformedData,
          timestamp: new Date().toISOString(),
          source: 'Active Away Website - Form'
        };
      } else {
        // Use field names directly (clean format)
        webhookPayload = {
          ...formData,
          formSlug,
          formTitle,
          timestamp: new Date().toISOString(),
          source: 'Active Away Website - Form'
        };
      }

      console.log('📤 Sending to webhook:', webhookUrl);
      console.log('📦 Payload:', webhookPayload);

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

      const contentType = webhookResponse.headers.get('content-type');
      let webhookResult;
      
      if (contentType && contentType.includes('application/json')) {
        webhookResult = await webhookResponse.json();
      } else {
        webhookResult = await webhookResponse.text();
      }
      
      console.log('✅ Webhook response:', webhookResult);
      console.log('✅ Form submission successful');
    } catch (webhookError) {
      console.error('❌ Webhook request failed:', webhookError);
      throw new Error('Failed to send to webhook service');
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Form submitted successfully!'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Form submission error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process form submission. Please try again.',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

