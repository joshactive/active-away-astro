import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  console.log('📝 Waiting list submission API called');
  
  const WEBHOOK_URL = 'https://hook.eu1.make.com/ug8yvdco9x7arpu5taa5ebdp13807okv';

  try {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      console.error('❌ Failed to parse request body');
      return new Response(JSON.stringify({ error: 'Invalid request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Forward to Make.com webhook
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error(`❌ Webhook failed with status ${response.status}`);
      return new Response(JSON.stringify({ error: 'Submission failed' }), {
        status: 502, // Bad Gateway
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Waiting list submission error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

