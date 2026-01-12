globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../renderers.mjs';

const POST = async ({ request, locals }) => {
  const runtimeEnv = locals.runtime?.env || {};
  const globalEnv = globalThis?.__env ?? globalThis?.ENV ?? {};
  const WEBHOOK_URL = runtimeEnv.WAITING_LIST_WEBHOOK_URL || globalEnv.WAITING_LIST_WEBHOOK_URL || "https://hook.eu1.make.com/ug8yvdco9x7arpu5taa5ebdp13807okv";
  const TURNSTILE_SECRET = runtimeEnv.TURNSTILE_SECRET_KEY || globalEnv.TURNSTILE_SECRET_KEY || "0x4AAAAAAB9Kq-hdews-RUj4mhTOKZIeZpA";
  const IS_DEV = runtimeEnv.DEV ?? globalEnv.DEV ?? false;
  try {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      if (IS_DEV) console.error("❌ Failed to parse request body");
      return new Response(JSON.stringify({ error: "Invalid request body" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { turnstileToken, ...formData } = body;
    if (TURNSTILE_SECRET && !IS_DEV) {
      if (!turnstileToken) {
        return new Response(JSON.stringify({
          error: "Please complete the verification"
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
      try {
        const turnstileResponse = await fetch(
          "https://challenges.cloudflare.com/turnstile/v0/siteverify",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              secret: TURNSTILE_SECRET,
              response: turnstileToken
            })
          }
        );
        const turnstileResult = await turnstileResponse.json();
        if (!turnstileResult.success) {
          if (IS_DEV) console.error("❌ Turnstile verification failed:", turnstileResult);
          return new Response(JSON.stringify({
            error: "Verification failed. Please try again."
          }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        }
      } catch (turnstileError) {
        if (IS_DEV) console.error("❌ Turnstile verification error:", turnstileError);
        return new Response(JSON.stringify({
          error: "Verification service error. Please try again."
        }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    const webhookPayload = {
      ...formData,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      source: "Active Away Website - Waiting List"
    };
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(webhookPayload)
    });
    if (!response.ok) {
      if (IS_DEV) console.error(`❌ Webhook failed with status ${response.status}`);
      return new Response(JSON.stringify({ error: "Submission failed" }), {
        status: 502,
        // Bad Gateway
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    if (IS_DEV) console.error("❌ Waiting list submission error:", error);
    return new Response(JSON.stringify({
      error: "Internal server error",
      details: IS_DEV && error instanceof Error ? error.message : void 0
    }), {
      status: 500,
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
