import type { APIRoute } from 'astro';

export const POST: APIRoute = async (context) => {
  const request = context.request;
  const runtime = context.locals?.runtime;
  // @ts-ignore
  const WEBHOOK_URL = runtime?.env?.LOGGING_WEBHOOK_URL || import.meta.env.LOGGING_WEBHOOK_URL;

  if (!WEBHOOK_URL) {
    console.error('Logging webhook not configured. Available env vars:', Object.keys(import.meta.env));
    return new Response(JSON.stringify({ error: 'Logging webhook not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await request.json();
    const { path, referrer, userAgent, timestamp } = body;

    // Prepare payload for the webhook (e.g., Slack, Discord, or generic JSON)
    // Using a generic JSON structure that most services can parse
    const payload = {
      text: `🚫 404 Error Detected`,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*404 Error Detected on Active Away*`
          }
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Path:*\n\`${path}\``
            },
            {
              type: "mrkdwn",
              text: `*Referrer:*\n${referrer || 'Direct/Unknown'}`
            },
            {
              type: "mrkdwn",
              text: `*Time:*\n${timestamp}`
            },
            {
              type: "mrkdwn",
              text: `*User Agent:*\n${userAgent}`
            }
          ]
        }
      ],
      // Fallback/Generic fields
      path,
      referrer,
      userAgent,
      timestamp,
      environment: import.meta.env.PROD ? 'Production' : 'Development'
    };

    // Send to the external webhook
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      console.error(`Webhook error: ${response.status} ${response.statusText}`);
      return new Response(JSON.stringify({ error: 'Failed to send to logging service' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('Error logging 404:', error);
    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};














