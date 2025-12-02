globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../renderers.mjs';

const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "PUBLIC_TURNSTILE_SITE_KEY": "0x4AAAAAAB9Kq5NzSwkzyLBP", "SITE": "https://activeaway.com", "SSR": true};
const prerender = false;
const POST = async ({ request, locals }) => {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const runtimeEnv = locals?.runtime?.env || {};
    const globalEnv = globalThis && (globalThis.__env || globalThis.ENV) || {};
    const R2_UPLOAD_URL = runtimeEnv.R2_UPLOAD_URL || globalEnv.R2_UPLOAD_URL || Object.assign(__vite_import_meta_env__, { UPLOAD_TOKEN: "83224072f2ed2a7a640a8bf6d342a28da334be0ca7b5184b9a123391c2140a08", R2_UPLOAD_URL: "https://active-away-r2-upload.josh-5da.workers.dev", R2_PUBLIC_BASE_URL: "https://files.activeaway.com", _: process.env._ }) && "https://active-away-r2-upload.josh-5da.workers.dev" || "https://r2-upload.activeaway.workers.dev";
    const UPLOAD_TOKEN = runtimeEnv.UPLOAD_TOKEN || globalEnv.UPLOAD_TOKEN || Object.assign(__vite_import_meta_env__, { UPLOAD_TOKEN: "83224072f2ed2a7a640a8bf6d342a28da334be0ca7b5184b9a123391c2140a08", R2_UPLOAD_URL: "https://active-away-r2-upload.josh-5da.workers.dev", R2_PUBLIC_BASE_URL: "https://files.activeaway.com", _: process.env._ }) && "83224072f2ed2a7a640a8bf6d342a28da334be0ca7b5184b9a123391c2140a08" || "";
    if (!UPLOAD_TOKEN) {
      console.error("❌ [upload-file] UPLOAD_TOKEN not configured");
      return new Response(JSON.stringify({ error: "Upload not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "-");
    const fileKey = `form-uploads/${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}/${timestamp}-${randomStr}-${sanitizedName}`;
    const uploadResponse = await fetch(`${R2_UPLOAD_URL}/${fileKey}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${UPLOAD_TOKEN}`,
        "Content-Type": file.type,
        "x-upload-metadata": JSON.stringify({
          originalName: file.name,
          uploadedAt: (/* @__PURE__ */ new Date()).toISOString(),
          source: "form-submission"
        })
      },
      body: file
    });
    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error("❌ [upload-file] R2 upload failed:", errorText);
      return new Response(JSON.stringify({ error: "Upload failed" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const uploadResult = await uploadResponse.json();
    const publicBase = runtimeEnv.R2_PUBLIC_BASE_URL && runtimeEnv.R2_PUBLIC_BASE_URL.trim() || globalEnv.R2_PUBLIC_BASE_URL && globalEnv.R2_PUBLIC_BASE_URL.trim() || "https://files.activeaway.com".trim() || "https://files.activeaway.com";
    const publicUrl = `${publicBase.replace(/\/+$/, "")}/${fileKey}`;
    console.log("✅ [upload-file] File uploaded:", fileKey);
    return new Response(JSON.stringify({
      success: true,
      url: publicUrl,
      key: fileKey,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      uploadedAt: (/* @__PURE__ */ new Date()).toISOString()
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("❌ [upload-file] Error:", error);
    return new Response(JSON.stringify({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
