globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                  */
import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, l as defineScriptVars, h as addAttribute, m as maybeRenderHead } from '../chunks/astro/server_DGNyvb9N.mjs';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_DFPiOYnu.mjs';
import { a as getResponsiveImageAttrs } from '../chunks/strapi_D13TtKqq.mjs';
/* empty css                               */
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://activeaway.com");
const $$404 = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$404;
  const BACKGROUND_WIDTH = 1920;
  const BACKGROUND_HEIGHT = 1080;
  const backgroundAttrs = getResponsiveImageAttrs("03bade93-3cf6-49b0-047f-a9eb556aa200", {
    displayWidth: BACKGROUND_WIDTH,
    displayHeight: BACKGROUND_HEIGHT,
    fit: "cover",
    alt: "404 - Page Not Found",
    quality: 60
  });
  const pageTitle = "404 - Page Not Found | Active Away";
  const pageDescription = "Oops! The page you're looking for doesn't exist. Explore our tennis, padel, and pickleball holidays instead.";
  const requestedPath = Astro2.url.pathname;
  const referrer = Astro2.request.headers.get("referer") || "Direct";
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": pageTitle, "description": pageDescription, "data-astro-cid-zetdm5md": true }, { "default": ($$result2) => renderTemplate(_a || (_a = __template(["  ", '<section class="relative w-full h-screen flex items-center justify-center overflow-hidden" data-astro-cid-zetdm5md> <!-- Background Image with Overlay --> <div class="absolute inset-0 w-full h-full" data-astro-cid-zetdm5md> <img', "", "", "", "", "", ` class="w-full h-full object-cover object-center" loading="eager" fetchpriority="high" data-astro-cid-zetdm5md> <!-- Dark overlay gradient for text readability --> <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60" data-astro-cid-zetdm5md></div> </div> <!-- Content Container --> <div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center" data-astro-cid-zetdm5md> <div class="max-w-3xl mx-auto flex flex-col items-center gap-6 sm:gap-8" data-astro-cid-zetdm5md> <!-- Page Not Found Heading --> <h1 class="font-playfair font-semibold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight" data-astro-cid-zetdm5md>
Page Not Found
</h1> <!-- Helpful Message --> <p class="font-inter text-base sm:text-lg lg:text-xl text-white/90 leading-relaxed max-w-2xl" data-astro-cid-zetdm5md>
We couldn't find the page you're looking for. It might have been moved, deleted, or perhaps the URL was mistyped.
</p> <!-- CTA Buttons --> <div class="flex flex-col sm:flex-row items-center gap-4 mt-4 sm:mt-6" data-astro-cid-zetdm5md> <!-- Primary CTA - Return Home --> <a href="/" class="inline-flex items-center justify-center bg-[#ad986c] hover:bg-[#8d7a56] text-white font-inter font-semibold px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-base sm:text-lg" data-astro-cid-zetdm5md> <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" data-astro-cid-zetdm5md> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" data-astro-cid-zetdm5md></path> </svg>
Return Home
</a> <!-- Secondary CTA - Browse Events --> <a href="/events" class="inline-flex items-center justify-center bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 text-white font-inter font-semibold px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl text-base sm:text-lg" data-astro-cid-zetdm5md> <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" data-astro-cid-zetdm5md> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" data-astro-cid-zetdm5md></path> </svg>
Browse Events
</a> </div> </div> </div> </section>  <script>(function(){`, "\n    // Track 404 errors in Google Analytics (if available)\n    if (typeof gtag !== 'undefined') {\n      gtag('event', 'exception', {\n        description: `404 Error: ${requestedPath}`,\n        fatal: false,\n        page_path: requestedPath,\n        page_referrer: referrer\n      });\n      \n      gtag('event', 'page_not_found', {\n        page_path: requestedPath,\n        referrer: referrer\n      });\n    }\n\n    // Also send to Google Tag Manager dataLayer (if available)\n    if (typeof window !== 'undefined' && window.dataLayer) {\n      window.dataLayer.push({\n        event: '404_error',\n        page_path: requestedPath,\n        referrer: referrer,\n        error_type: 'page_not_found'\n      });\n    }\n\n    // Console log for debugging (can be removed in production)\n    console.log('\u{1F6AB} 404 Error:', {\n      path: requestedPath,\n      referrer: referrer,\n      timestamp: new Date().toISOString()\n    });\n\n    // Send to server-side logging endpoint (which forwards to webhook)\n    fetch('/api/log-404.json', {\n      method: 'POST',\n      headers: { 'Content-Type': 'application/json' },\n      body: JSON.stringify({\n        path: requestedPath,\n        referrer: referrer,\n        userAgent: navigator.userAgent,\n        timestamp: new Date().toISOString()\n      })\n    }).catch(err => console.error('Failed to log 404:', err));\n  })();<\/script> "], ["  ", '<section class="relative w-full h-screen flex items-center justify-center overflow-hidden" data-astro-cid-zetdm5md> <!-- Background Image with Overlay --> <div class="absolute inset-0 w-full h-full" data-astro-cid-zetdm5md> <img', "", "", "", "", "", ` class="w-full h-full object-cover object-center" loading="eager" fetchpriority="high" data-astro-cid-zetdm5md> <!-- Dark overlay gradient for text readability --> <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60" data-astro-cid-zetdm5md></div> </div> <!-- Content Container --> <div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center" data-astro-cid-zetdm5md> <div class="max-w-3xl mx-auto flex flex-col items-center gap-6 sm:gap-8" data-astro-cid-zetdm5md> <!-- Page Not Found Heading --> <h1 class="font-playfair font-semibold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight" data-astro-cid-zetdm5md>
Page Not Found
</h1> <!-- Helpful Message --> <p class="font-inter text-base sm:text-lg lg:text-xl text-white/90 leading-relaxed max-w-2xl" data-astro-cid-zetdm5md>
We couldn't find the page you're looking for. It might have been moved, deleted, or perhaps the URL was mistyped.
</p> <!-- CTA Buttons --> <div class="flex flex-col sm:flex-row items-center gap-4 mt-4 sm:mt-6" data-astro-cid-zetdm5md> <!-- Primary CTA - Return Home --> <a href="/" class="inline-flex items-center justify-center bg-[#ad986c] hover:bg-[#8d7a56] text-white font-inter font-semibold px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-base sm:text-lg" data-astro-cid-zetdm5md> <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" data-astro-cid-zetdm5md> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" data-astro-cid-zetdm5md></path> </svg>
Return Home
</a> <!-- Secondary CTA - Browse Events --> <a href="/events" class="inline-flex items-center justify-center bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 text-white font-inter font-semibold px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl text-base sm:text-lg" data-astro-cid-zetdm5md> <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" data-astro-cid-zetdm5md> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" data-astro-cid-zetdm5md></path> </svg>
Browse Events
</a> </div> </div> </div> </section>  <script>(function(){`, "\n    // Track 404 errors in Google Analytics (if available)\n    if (typeof gtag !== 'undefined') {\n      gtag('event', 'exception', {\n        description: \\`404 Error: \\${requestedPath}\\`,\n        fatal: false,\n        page_path: requestedPath,\n        page_referrer: referrer\n      });\n      \n      gtag('event', 'page_not_found', {\n        page_path: requestedPath,\n        referrer: referrer\n      });\n    }\n\n    // Also send to Google Tag Manager dataLayer (if available)\n    if (typeof window !== 'undefined' && window.dataLayer) {\n      window.dataLayer.push({\n        event: '404_error',\n        page_path: requestedPath,\n        referrer: referrer,\n        error_type: 'page_not_found'\n      });\n    }\n\n    // Console log for debugging (can be removed in production)\n    console.log('\u{1F6AB} 404 Error:', {\n      path: requestedPath,\n      referrer: referrer,\n      timestamp: new Date().toISOString()\n    });\n\n    // Send to server-side logging endpoint (which forwards to webhook)\n    fetch('/api/log-404.json', {\n      method: 'POST',\n      headers: { 'Content-Type': 'application/json' },\n      body: JSON.stringify({\n        path: requestedPath,\n        referrer: referrer,\n        userAgent: navigator.userAgent,\n        timestamp: new Date().toISOString()\n      })\n    }).catch(err => console.error('Failed to log 404:', err));\n  })();<\/script> "])), maybeRenderHead(), addAttribute(backgroundAttrs.src, "src"), addAttribute(backgroundAttrs.srcset, "srcset"), addAttribute(backgroundAttrs.sizes, "sizes"), addAttribute(backgroundAttrs.alt, "alt"), addAttribute(backgroundAttrs.width || BACKGROUND_WIDTH, "width"), addAttribute(backgroundAttrs.height || BACKGROUND_HEIGHT, "height"), defineScriptVars({ requestedPath, referrer })) })} `;
}, "/Users/joshuathompson/active-away-astro/src/pages/404.astro", void 0);

const $$file = "/Users/joshuathompson/active-away-astro/src/pages/404.astro";
const $$url = "/404";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$404,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
