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
    const resortNames = /* @__PURE__ */ new Set();
    try {
      const padelResponse = await fetch(
        `${STRAPI_URL}/api/padel-tennis-holidays?pagination[pageSize]=100&fields[0]=title`,
        { headers }
      );
      if (padelResponse.ok) {
        const padelData = await padelResponse.json();
        padelData.data?.forEach((item) => {
          const title = item.title || item.attributes?.title;
          if (title) resortNames.add(title);
        });
        console.log("✅ Fetched padel-tennis-holidays");
      }
      const pickleballResponse = await fetch(
        `${STRAPI_URL}/api/pickleball-holidays?pagination[pageSize]=100&fields[0]=title`,
        { headers }
      );
      if (pickleballResponse.ok) {
        const pickleballData = await pickleballResponse.json();
        pickleballData.data?.forEach((item) => {
          const title = item.title || item.attributes?.title;
          if (title) resortNames.add(title);
        });
        console.log("✅ Fetched pickleball-holidays");
      }
      const playWatchResponse = await fetch(
        `${STRAPI_URL}/api/play-and-watches?pagination[pageSize]=100&fields[0]=title`,
        { headers }
      );
      if (playWatchResponse.ok) {
        const playWatchData = await playWatchResponse.json();
        playWatchData.data?.forEach((item) => {
          const title = item.title || item.attributes?.title;
          if (title) resortNames.add(title);
        });
        console.log("✅ Fetched play-and-watches");
      }
      const skiResponse = await fetch(
        `${STRAPI_URL}/api/ski-holidays?pagination[pageSize]=100&fields[0]=title`,
        { headers }
      );
      if (skiResponse.ok) {
        const skiData = await skiResponse.json();
        skiData.data?.forEach((item) => {
          const title = item.title || item.attributes?.title;
          if (title) resortNames.add(title);
        });
        console.log("✅ Fetched ski-holidays");
      }
      const tennisResponse = await fetch(
        `${STRAPI_URL}/api/tennis-holidays?pagination[pageSize]=100&fields[0]=title`,
        { headers }
      );
      if (tennisResponse.ok) {
        const tennisData = await tennisResponse.json();
        tennisData.data?.forEach((item) => {
          const title = item.title || item.attributes?.title;
          if (title) resortNames.add(title);
        });
        console.log("✅ Fetched tennis-holidays");
      }
    } catch (error) {
      console.error("Error fetching resorts:", error);
    }
    const resorts = Array.from(resortNames).sort();
    console.log(`✅ Fetched ${resorts.length} unique resort names`);
    return new Response(JSON.stringify({
      success: true,
      resorts
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache"
        // No caching during development
      }
    });
  } catch (error) {
    console.error("❌ Error fetching resorts:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Failed to fetch resorts",
      resorts: []
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
