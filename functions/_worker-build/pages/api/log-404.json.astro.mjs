globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../renderers.mjs';

const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "PUBLIC_TURNSTILE_SITE_KEY": "0x4AAAAAAB9Kq5NzSwkzyLBP", "SITE": "https://activeaway.com", "SSR": true};
const POST = async (context) => {
  const request = context.request;
  const runtime = context.locals?.runtime;
  const WEBHOOK_URL = runtime?.env?.LOGGING_WEBHOOK_URL || Object.assign(__vite_import_meta_env__, { _: process.env._ }).LOGGING_WEBHOOK_URL;
  if (!WEBHOOK_URL) {
    console.error("Logging webhook not configured. Available env vars:", Object.keys(Object.assign(__vite_import_meta_env__, { _: process.env._ })));
    return new Response(JSON.stringify({ error: "Logging webhook not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const body = await request.json();
    const { path, referrer, userAgent, timestamp } = body;
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
              text: `*Path:*
\`${path}\``
            },
            {
              type: "mrkdwn",
              text: `*Referrer:*
${referrer || "Direct/Unknown"}`
            },
            {
              type: "mrkdwn",
              text: `*Time:*
${timestamp}`
            },
            {
              type: "mrkdwn",
              text: `*User Agent:*
${userAgent}`
            }
          ]
        }
      ],
      // Fallback/Generic fields
      path,
      referrer,
      userAgent,
      timestamp,
      environment: Object.assign(__vite_import_meta_env__, { _: process.env._ }).PROD ? "Production" : "Development"
    };
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (response.ok) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } else {
      console.error(`Webhook error: ${response.status} ${response.statusText}`);
      return new Response(JSON.stringify({ error: "Failed to send to logging service" }), {
        status: 502,
        headers: { "Content-Type": "application/json" }
      });
    }
  } catch (error) {
    console.error("Error logging 404:", error);
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
