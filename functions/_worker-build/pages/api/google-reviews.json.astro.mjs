globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../renderers.mjs';

const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "PUBLIC_TURNSTILE_SITE_KEY": "0x4AAAAAAB9Kq5NzSwkzyLBP", "SITE": "https://active-away-astro.pages.dev", "SSR": true};
const GET = async ({ locals }) => {
  const runtimeEnv = locals.runtime?.env || {};
  const GOOGLE_API_KEY = runtimeEnv.GOOGLE_PLACES_API_KEY || "AIzaSyDHsGtyEGILgmdWyNL2Q2mC9VtS5UwMa-k";
  const PLACE_ID = runtimeEnv.GOOGLE_PLACE_ID || "ChIJ6aLvHHgPdkgR1oHhIDyNQtU";
  console.log("[reviews] locals keys:", Object.keys(locals || {}));
  console.log("[reviews] runtime env keys:", Object.keys(runtimeEnv));
  const globalEnv = globalThis?.__env ?? globalThis?.ENV ?? {};
  console.log("[reviews] global env keys:", Object.keys(globalEnv).filter((key) => key.includes("GOOGLE")));
  console.log("[reviews] env key prefix:", GOOGLE_API_KEY.slice(0, 6) );
  console.log("[reviews] env place id:", PLACE_ID);
  console.log("🔍 Environment check:", {
    hasApiKey: true,
    apiKeyLength: GOOGLE_API_KEY?.length || 0,
    apiKeyPrefix: GOOGLE_API_KEY?.substring(0, 10) || "none",
    placeId: PLACE_ID,
    allEnvKeys: Object.keys(Object.assign(__vite_import_meta_env__, { GOOGLE_PLACES_API_KEY: "AIzaSyDHsGtyEGILgmdWyNL2Q2mC9VtS5UwMa-k", GOOGLE_PLACE_ID: "ChIJ6aLvHHgPdkgR1oHhIDyNQtU", _: process.env._ })).filter((k) => k.includes("GOOGLE"))
  });
  try {
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${PLACE_ID}`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GOOGLE_API_KEY,
          "X-Goog-FieldMask": "displayName,rating,reviews,userRatingCount"
        }
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Google API error:", response.status, errorText);
      throw new Error(`Google API error: ${response.status}`);
    }
    const data = await response.json();
    const allReviews = data.reviews?.map((review, index) => ({
      id: review.relativePublishTimeDescription || index,
      name: review.authorAttribution?.displayName || "Anonymous",
      date: review.relativePublishTimeDescription || "",
      rating: review.rating || 5,
      text: review.text?.text || review.originalText?.text || "",
      avatar: review.authorAttribution?.photoUri || "https://via.placeholder.com/48",
      publishTime: review.publishTime
    })) || [];
    const reviews = allReviews.filter((review) => review.rating === 5).sort((a, b) => {
      return new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime();
    }).slice(0, 20);
    return new Response(JSON.stringify({
      reviews,
      placeInfo: {
        name: data.displayName?.text || "Active Away",
        rating: data.rating || 5,
        totalReviews: data.userRatingCount || 0
      }
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600"
        // Cache for 1 hour
      }
    });
  } catch (error) {
    console.error("Error fetching Google reviews:", error);
    return new Response(JSON.stringify({
      error: "Failed to fetch reviews",
      message: error instanceof Error ? error.message : "Unknown error"
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
