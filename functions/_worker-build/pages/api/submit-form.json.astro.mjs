globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../renderers.mjs';

const GET = async () => {
  return new Response(JSON.stringify({
    status: "ok",
    message: "Form submission API endpoint is working",
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};
const POST = async ({ request, locals }) => {
  console.log("📝 Form submission API called");
  const runtimeEnv = locals.runtime?.env || {};
  const globalEnv = globalThis?.__env ?? globalThis?.ENV ?? {};
  const STRAPI_URL = runtimeEnv.STRAPI_URL || globalEnv.STRAPI_URL || "https://strapi-production-b96d.up.railway.app";
  const STRAPI_TOKEN = runtimeEnv.STRAPI_API_TOKEN || globalEnv.STRAPI_API_TOKEN || "eefa701cf9f771a8825d61d29bd6b31ce72ef83549d9c7f56e5e1f52ac208aef3e644a61772ba13cfc6ddffd201d662342f1ac04e02f4bf448bd2804aefaea0003efd6e75b2cd3cfcfdab8c2077656d2c0eda3f161630ee00d59935e818bfb1e1835165fbfdb4b38224d54a221346cbcfcfff174f228e0b94e403f571e6355a0";
  const TURNSTILE_SECRET = runtimeEnv.TURNSTILE_SECRET_KEY || globalEnv.TURNSTILE_SECRET_KEY || "0x4AAAAAAB9Kq-hdews-RUj4mhTOKZIeZpA";
  const IS_DEV = runtimeEnv.DEV ?? globalEnv.DEV ?? false;
  try {
    let body;
    let rawBody = "";
    try {
      rawBody = await request.text();
      if (!rawBody || rawBody.trim().length === 0) {
        console.error("❌ Request body is empty");
        return new Response(JSON.stringify({
          error: "Request body is empty"
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
      body = JSON.parse(rawBody);
      console.log("📦 Parsed body:", body);
    } catch (parseError) {
      console.error("❌ Failed to parse request body:", parseError);
      return new Response(JSON.stringify({
        error: "Invalid request format"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { formSlug, data: formData, turnstileToken, webhookUrl: providedWebhookUrl } = body;
    if (!formSlug || !formData) {
      return new Response(JSON.stringify({
        error: "Missing required fields: formSlug, data"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    let webhookUrl;
    let formFields = [];
    let webhookFormat = "labels";
    let formTitle = "";
    if (providedWebhookUrl) {
      webhookUrl = providedWebhookUrl;
      formTitle = formSlug;
      webhookFormat = "names";
      formFields = [];
      console.log("✅ Using provided webhook URL for inline form");
    } else {
      try {
        const headers = {
          "Content-Type": "application/json"
        };
        if (STRAPI_TOKEN) {
          headers["Authorization"] = `Bearer ${STRAPI_TOKEN}`;
        }
        const strapiResponse = await fetch(
          `${STRAPI_URL}/api/forms?filters[slug][$eq]=${encodeURIComponent(formSlug)}`,
          { headers }
        );
        if (!strapiResponse.ok) {
          const errorText = await strapiResponse.text();
          console.error("❌ Strapi API error:", strapiResponse.status, errorText);
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
        webhookFormat = form.webhookFormat || "labels";
        if (!webhookUrl) {
          console.error(`❌ No webhook URL configured for form: ${formSlug}`);
          throw new Error("Webhook URL not configured for this form");
        }
        try {
          if (form.formFields) {
            formFields = typeof form.formFields === "string" ? JSON.parse(form.formFields) : form.formFields;
          }
        } catch (error) {
          console.warn("⚠️  Could not parse form fields:", error);
        }
        console.log(`✅ Webhook URL fetched securely from Strapi for form: ${formSlug}`);
        console.log(`📋 Webhook format: ${webhookFormat}`);
      } catch (strapiError) {
        console.error("❌ Failed to fetch form config from Strapi:", strapiError);
        return new Response(JSON.stringify({
          error: "Form configuration error. Please contact support.",
          details: strapiError instanceof Error ? strapiError.message : "Unknown error"
        }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    if (TURNSTILE_SECRET && !IS_DEV) {
      if (!turnstileToken) {
        console.warn("⚠️  No Turnstile token provided");
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
          console.error("❌ Turnstile verification failed:", turnstileResult);
          return new Response(JSON.stringify({
            error: "Verification failed. Please try again."
          }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        }
        console.log("✅ Turnstile verification passed");
      } catch (turnstileError) {
        console.error("❌ Turnstile verification error:", turnstileError);
        return new Response(JSON.stringify({
          error: "Verification service error. Please try again."
        }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    } else if (IS_DEV) {
      console.warn("⚠️  Development mode: Skipping Turnstile verification");
    } else {
      console.warn("⚠️  Turnstile not configured, skipping verification");
    }
    console.log(`📝 Form submission for: ${formSlug}`);
    console.log("📝 Form data:", formData);
    try {
      let webhookPayload;
      if (webhookFormat === "labels") {
        const transformedData = {};
        for (const field of formFields) {
          if (field.type === "section") {
            transformedData[field.label] = "";
          } else if (field.name && formData[field.name] !== void 0) {
            transformedData[field.label] = formData[field.name];
          }
        }
        transformedData["form_id"] = formSlug;
        transformedData["form_name"] = formTitle;
        webhookPayload = {
          ...transformedData,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          source: "Active Away Website - Form"
        };
      } else {
        webhookPayload = {
          ...formData,
          formSlug,
          formTitle,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          source: "Active Away Website - Form"
        };
      }
      console.log("📤 Sending to webhook:", webhookUrl);
      console.log("📦 Payload:", webhookPayload);
      const webhookResponse = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(webhookPayload)
      });
      console.log("📥 Webhook response status:", webhookResponse.status);
      if (!webhookResponse.ok) {
        const errorText = await webhookResponse.text();
        console.error("❌ Webhook error:", webhookResponse.status, errorText);
        throw new Error(`Webhook returned ${webhookResponse.status}`);
      }
      const contentType = webhookResponse.headers.get("content-type");
      let webhookResult;
      if (contentType && contentType.includes("application/json")) {
        webhookResult = await webhookResponse.json();
      } else {
        webhookResult = await webhookResponse.text();
      }
      console.log("✅ Webhook response:", webhookResult);
      console.log("✅ Form submission successful");
    } catch (webhookError) {
      console.error("❌ Webhook request failed:", webhookError);
      throw new Error("Failed to send to webhook service");
    }
    return new Response(JSON.stringify({
      success: true,
      message: "Form submitted successfully!"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("❌ Form submission error:", error);
    return new Response(JSON.stringify({
      error: "Failed to process form submission. Please try again.",
      message: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
