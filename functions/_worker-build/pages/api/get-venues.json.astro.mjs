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
    const venueNames = /* @__PURE__ */ new Set();
    try {
      const juniorCampResponse = await fetch(
        `${STRAPI_URL}/api/junior-tennis-camps?pagination[pageSize]=100&fields[0]=title`,
        { headers }
      );
      if (juniorCampResponse.ok) {
        const data = await juniorCampResponse.json();
        data.data?.forEach((item) => {
          const title = item.title || item.attributes?.title;
          if (title) venueNames.add(title);
        });
        console.log("✅ Fetched junior-tennis-camps");
      }
      const padelResponse = await fetch(
        `${STRAPI_URL}/api/padel-tennis-holidays?pagination[pageSize]=100&fields[0]=title`,
        { headers }
      );
      if (padelResponse.ok) {
        const data = await padelResponse.json();
        data.data?.forEach((item) => {
          const title = item.title || item.attributes?.title;
          if (title) venueNames.add(title);
        });
        console.log("✅ Fetched padel-tennis-holidays");
      }
      const pickleballResponse = await fetch(
        `${STRAPI_URL}/api/pickleball-holidays?pagination[pageSize]=100&fields[0]=title`,
        { headers }
      );
      if (pickleballResponse.ok) {
        const data = await pickleballResponse.json();
        data.data?.forEach((item) => {
          const title = item.title || item.attributes?.title;
          if (title) venueNames.add(title);
        });
        console.log("✅ Fetched pickleball-holidays");
      }
      const playWatchResponse = await fetch(
        `${STRAPI_URL}/api/play-and-watches?pagination[pageSize]=100&fields[0]=title`,
        { headers }
      );
      if (playWatchResponse.ok) {
        const data = await playWatchResponse.json();
        data.data?.forEach((item) => {
          const title = item.title || item.attributes?.title;
          if (title) venueNames.add(title);
        });
        console.log("✅ Fetched play-and-watches");
      }
      const skiResponse = await fetch(
        `${STRAPI_URL}/api/ski-holidays?pagination[pageSize]=100&fields[0]=title`,
        { headers }
      );
      if (skiResponse.ok) {
        const data = await skiResponse.json();
        data.data?.forEach((item) => {
          const title = item.title || item.attributes?.title;
          if (title) venueNames.add(title);
        });
        console.log("✅ Fetched ski-holidays");
      }
      const clinicResponse = await fetch(
        `${STRAPI_URL}/api/tennis-clinics?pagination[pageSize]=100&fields[0]=title`,
        { headers }
      );
      if (clinicResponse.ok) {
        const data = await clinicResponse.json();
        data.data?.forEach((item) => {
          const title = item.title || item.attributes?.title;
          if (title) venueNames.add(title);
        });
        console.log("✅ Fetched tennis-clinics");
      }
      const tennisResponse = await fetch(
        `${STRAPI_URL}/api/tennis-holidays?pagination[pageSize]=100&fields[0]=title`,
        { headers }
      );
      if (tennisResponse.ok) {
        const data = await tennisResponse.json();
        data.data?.forEach((item) => {
          const title = item.title || item.attributes?.title;
          if (title) venueNames.add(title);
        });
        console.log("✅ Fetched tennis-holidays");
      }
    } catch (error) {
      console.error("Error fetching venues:", error);
    }
    const venues = Array.from(venueNames).sort();
    console.log(`✅ Fetched ${venues.length} unique venue names`);
    return new Response(JSON.stringify({
      success: true,
      venues
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache"
        // No caching during development
      }
    });
  } catch (error) {
    console.error("❌ Error fetching venues:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Failed to fetch venues",
      venues: []
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
