globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, m as maybeRenderHead, h as addAttribute, s as spreadAttributes, r as renderTemplate, k as renderComponent, n as Fragment } from './astro/server_DGNyvb9N.mjs';
import { b as getStrapiImageAttrs } from './strapi_D13TtKqq.mjs';
/* empty css                          */

const $$Astro$1 = createAstro("https://activeaway.com");
const $$PageHeroTailwind = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$PageHeroTailwind;
  const { pageData, breadcrumbs } = Astro2.props;
  const heroData = {
    kicker: pageData?.pageHero?.kicker || "",
    heading: pageData?.pageHero?.heading || "Page Title",
    subtitle: pageData?.pageHero?.subtitle || "",
    backgroundImage: pageData?.pageHero?.backgroundImage || null,
    showBreadcrumbs: pageData?.pageHero?.showBreadcrumbs !== false
  };
  let backgroundImageAttrs = null;
  if (heroData.backgroundImage) {
    const imageUrl = heroData.backgroundImage.url || heroData.backgroundImage;
    const imageAlt = heroData.backgroundImage.alt || heroData.backgroundImage.alternativeText || heroData.heading;
    if (typeof imageUrl === "string") {
      backgroundImageAttrs = getStrapiImageAttrs(
        { url: imageUrl, alt: imageAlt },
        {
          displayWidth: 1920,
          displayHeight: 600,
          fit: "cover",
          sizes: "100vw",
          quality: 75
        }
      );
      if (!backgroundImageAttrs) {
        backgroundImageAttrs = {
          src: imageUrl,
          url: imageUrl,
          alt: imageAlt,
          loading: "eager"
        };
      }
    }
  }
  return renderTemplate`${maybeRenderHead()}<section class="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden" data-astro-cid-u33ifu2a> <!-- Background Image --> ${backgroundImageAttrs && renderTemplate`<img${addAttribute(backgroundImageAttrs.src || backgroundImageAttrs.url, "src")}${spreadAttributes(backgroundImageAttrs.srcset && { srcset: backgroundImageAttrs.srcset })}${spreadAttributes(backgroundImageAttrs.sizes && { sizes: backgroundImageAttrs.sizes })}${addAttribute(backgroundImageAttrs.alt || heroData.heading, "alt")}${addAttribute(backgroundImageAttrs.width || 1920, "width")}${addAttribute(backgroundImageAttrs.height || 600, "height")} class="absolute inset-0 w-full h-full object-cover object-center lg:object-top" fetchpriority="high" decoding="async" data-astro-cid-u33ifu2a>`} <!-- Gradient Overlay --> <div class="absolute inset-0 bg-gradient-to-b from-[#0D1C4E]/80 via-[#0D1C4E]/70 to-[#0D1C4E]/65 z-10" data-astro-cid-u33ifu2a></div> <!-- Content --> <div class="relative z-20 container mx-auto max-w-[1400px] px-4 sm:px-10 h-full flex flex-col justify-center items-center text-center" data-astro-cid-u33ifu2a> <!-- Kicker --> ${heroData.kicker && renderTemplate`<div class="hidden sm:block text-xs sm:text-sm font-inter font-semibold text-gold tracking-[0.2em] uppercase mb-4 sm:mb-6 border-t border-b border-gold/50 py-2 px-6" data-astro-cid-u33ifu2a> ${heroData.kicker} </div>`} <!-- Heading --> <h1 class="text-4xl sm:text-5xl lg:text-7xl font-playfair font-bold text-white mb-6 sm:mb-8 leading-tight max-w-4xl" data-astro-cid-u33ifu2a> ${heroData.heading} </h1> <!-- Subtitle --> ${heroData.subtitle && renderTemplate`<p class="text-lg sm:text-xl lg:text-2xl font-inter text-white max-w-3xl leading-relaxed" data-astro-cid-u33ifu2a> ${heroData.subtitle} </p>`} </div> </section> `;
}, "/Users/joshuathompson/active-away-astro/src/components/PageHeroTailwind.astro", void 0);

const $$Astro = createAstro("https://activeaway.com");
const $$BreadcrumbsTailwind = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BreadcrumbsTailwind;
  const { breadcrumbs } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="w-full bg-gray-50 py-4 border-b border-gray-200" data-astro-cid-qss4shkq> <div class="container mx-auto max-w-[1400px] px-4 sm:px-10" data-astro-cid-qss4shkq> <nav class="flex items-center gap-2 text-sm font-inter text-gray-600" data-astro-cid-qss4shkq> ${breadcrumbs.map((crumb, index) => renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "data-astro-cid-qss4shkq": true }, { "default": ($$result2) => renderTemplate`${crumb.href ? renderTemplate`<a${addAttribute(crumb.href, "href")} class="hover:text-[#ad986c] transition-colors" data-astro-cid-qss4shkq> ${crumb.label} </a>` : renderTemplate`<span class="text-gray-900 font-medium" data-astro-cid-qss4shkq>${crumb.label}</span>`}${index < breadcrumbs.length - 1 && renderTemplate`<svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-qss4shkq> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" data-astro-cid-qss4shkq></path> </svg>`}` })}`)} </nav> </div> </section> `;
}, "/Users/joshuathompson/active-away-astro/src/components/BreadcrumbsTailwind.astro", void 0);

export { $$PageHeroTailwind as $, $$BreadcrumbsTailwind as a };
