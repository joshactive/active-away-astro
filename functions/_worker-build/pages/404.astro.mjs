globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                  */
import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_BeIGjyuI.mjs';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_BFSQUzS2.mjs';
import { a as getResponsiveImageAttrs } from '../chunks/strapi_C3n-BgGz.mjs';
/* empty css                               */
export { renderers } from '../renderers.mjs';

const $$404 = createComponent(($$result, $$props, $$slots) => {
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
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": pageTitle, "description": pageDescription, "data-astro-cid-zetdm5md": true }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="relative w-full h-screen flex items-center justify-center overflow-hidden" data-astro-cid-zetdm5md> <!-- Background Image with Overlay --> <div class="absolute inset-0 w-full h-full" data-astro-cid-zetdm5md> <img${addAttribute(backgroundAttrs.src, "src")}${addAttribute(backgroundAttrs.srcset, "srcset")}${addAttribute(backgroundAttrs.sizes, "sizes")}${addAttribute(backgroundAttrs.alt, "alt")}${addAttribute(backgroundAttrs.width || BACKGROUND_WIDTH, "width")}${addAttribute(backgroundAttrs.height || BACKGROUND_HEIGHT, "height")} class="w-full h-full object-cover object-center" loading="eager" fetchpriority="high" data-astro-cid-zetdm5md> <!-- Dark overlay gradient for text readability --> <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60" data-astro-cid-zetdm5md></div> </div> <!-- Content Container --> <div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center" data-astro-cid-zetdm5md> <div class="max-w-3xl mx-auto flex flex-col items-center gap-6 sm:gap-8" data-astro-cid-zetdm5md> <!-- Page Not Found Heading --> <h1 class="font-playfair font-semibold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight" data-astro-cid-zetdm5md>
Page Not Found
</h1> <!-- Helpful Message --> <p class="font-inter text-base sm:text-lg lg:text-xl text-white/90 leading-relaxed max-w-2xl" data-astro-cid-zetdm5md>
We couldn't find the page you're looking for. It might have been moved, deleted, or perhaps the URL was mistyped.
</p> <!-- CTA Buttons --> <div class="flex flex-col sm:flex-row items-center gap-4 mt-4 sm:mt-6" data-astro-cid-zetdm5md> <!-- Primary CTA - Return Home --> <a href="/" class="inline-flex items-center justify-center bg-[#ad986c] hover:bg-[#8d7a56] text-white font-inter font-semibold px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-base sm:text-lg" data-astro-cid-zetdm5md> <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" data-astro-cid-zetdm5md> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" data-astro-cid-zetdm5md></path> </svg>
Return Home
</a> <!-- Secondary CTA - Browse Events --> <a href="/events" class="inline-flex items-center justify-center bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 text-white font-inter font-semibold px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl text-base sm:text-lg" data-astro-cid-zetdm5md> <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" data-astro-cid-zetdm5md> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" data-astro-cid-zetdm5md></path> </svg>
Browse Events
</a> </div> </div> </div> </section> ` })} `;
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
