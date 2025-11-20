globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../renderers.mjs';

const GET = async ({ locals }) => {
  const runtimeEnv = locals.runtime?.env || {};
  const globalEnv = globalThis?.__env ?? globalThis?.ENV ?? {};
  const STRAPI_URL = runtimeEnv.STRAPI_URL || globalEnv.STRAPI_URL || "https://strapi-production-b96d.up.railway.app";
  const STRAPI_TOKEN = runtimeEnv.STRAPI_API_TOKEN || globalEnv.STRAPI_API_TOKEN || "eefa701cf9f771a8825d61d29bd6b31ce72ef83549d9c7f56e5e1f52ac208aef3e644a61772ba13cfc6ddffd201d662342f1ac04e02f4bf448bd2804aefaea0003efd6e75b2cd3cfcfdab8c2077656d2c0eda3f161630ee00d59935e818bfb1e1835165fbfdb4b38224d54a221346cbcfcfff174f228e0b94e403f571e6355a0";
  try {
    const headers = {
      "Content-Type": "application/json"
    };
    if (STRAPI_TOKEN) {
      headers["Authorization"] = `Bearer ${STRAPI_TOKEN}`;
    }
    const clinicNames = /* @__PURE__ */ new Set();
    try {
      const response = await fetch(
        `${STRAPI_URL}/api/tennis-clinics?pagination[pageSize]=100&fields[0]=title`,
        { headers }
      );
      if (response.ok) {
        const data = await response.json();
        if (data.data && Array.isArray(data.data)) {
          data.data.forEach((item) => {
            const title = item.title || item.attributes?.title;
            if (title) {
              clinicNames.add(title);
            }
          });
        }
        console.log("✅ Fetched tennis-clinics");
      } else {
        console.warn("Failed to fetch tennis-clinics:", response.status);
      }
    } catch (error) {
      console.error("Error fetching tennis-clinics:", error);
    }
    const clinics = Array.from(clinicNames).sort();
    console.log(`✅ Fetched ${clinics.length} unique clinic names`);
    return new Response(JSON.stringify({
      success: true,
      clinics
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache"
        // No caching during development
      }
    });
  } catch (error) {
    console.error("❌ Error fetching clinics:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Failed to fetch clinics",
      clinics: []
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
