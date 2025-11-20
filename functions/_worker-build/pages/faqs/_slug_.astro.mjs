globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                     */
import { e as createAstro, f as createComponent, r as renderTemplate, k as renderComponent, m as maybeRenderHead, h as addAttribute, l as Fragment, u as unescapeHTML } from '../../chunks/astro/server_BeIGjyuI.mjs';
import { $ as $$BaseLayout } from '../../chunks/BaseLayout_BFSQUzS2.mjs';
import { $ as $$PageHeroTailwind, a as $$BreadcrumbsTailwind } from '../../chunks/BreadcrumbsTailwind_DpvF7--Y.mjs';
import { s as getFAQCategoryBySlug, t as getFAQCategorySEO } from '../../chunks/strapi_C3n-BgGz.mjs';
import { p as parseMarkdown } from '../../chunks/markdown_C9eAVA1x.mjs';
/* empty css                                     */
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://active-away-astro.pages.dev");
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  if (!slug) {
    return Astro2.redirect("/404");
  }
  let categoryData = null;
  try {
    categoryData = slug ? await getFAQCategoryBySlug(slug) : null;
    console.log(`\u2753 [faq-category] Data fetched: ${categoryData?.title || slug}`);
  } catch (error) {
    console.error(`\u274C [faq-category] Error fetching ${slug}:`, error);
  }
  let seoData = null;
  try {
    seoData = slug ? await getFAQCategorySEO(slug) : null;
    if (seoData) {
      console.log(`\u{1F4C4} [faq-category] SEO data fetched for: ${slug}`);
    }
  } catch (error) {
    console.warn(`\u26A0\uFE0F  [faq-category] Could not fetch SEO data:`, error);
  }
  if (!categoryData) {
    return Astro2.redirect("/404");
  }
  const pageTitle = seoData?.metaTitle || categoryData?.seo?.metaTitle || `${categoryData.title} FAQs | Active Away`;
  const pageDescription = seoData?.metaDescription || categoryData?.seo?.metaDescription || `Frequently asked questions about ${categoryData.title}.`;
  let metaImage = null;
  if (seoData?.metaImage) {
    metaImage = typeof seoData.metaImage === "string" ? seoData.metaImage : seoData.metaImage.url;
  } else if (categoryData?.seo?.metaImage) {
    metaImage = typeof categoryData.seo.metaImage === "string" ? categoryData.seo.metaImage : categoryData.seo.metaImage.url;
  }
  const metaImageAlt = seoData?.metaImageAlt || categoryData?.seo?.metaImageAlt || null;
  const metaImageWidth = seoData?.metaImageWidth || categoryData?.seo?.metaImageWidth || null;
  const metaImageHeight = seoData?.metaImageHeight || categoryData?.seo?.metaImageHeight || null;
  const keywords = seoData?.keywords || categoryData?.seo?.keywords || null;
  const canonicalURL = seoData?.canonicalURL || categoryData?.seo?.canonicalURL || `https://activeaway.com/faqs/${slug}`;
  const tableOfContents = categoryData.faqSections.map((section) => ({
    id: section.sectionName.toLowerCase().replace(/\s+/g, "-"),
    label: section.sectionName
  }));
  return renderTemplate(_a || (_a = __template(["", "  <script>\n  function toggleFaqAccordion(header) {\n    const accordion = header.closest('.faq-accordion');\n    if (!accordion) return;\n    \n    const content = accordion.querySelector('.faq-accordion-content');\n    const arrow = accordion.querySelector('.faq-arrow-icon');\n    const isOpen = accordion.classList.contains('open');\n    \n    // Toggle current accordion\n    if (isOpen) {\n      accordion.classList.remove('open');\n      if (content) {\n        content.style.maxHeight = '0';\n        content.style.opacity = '0';\n      }\n      if (arrow) {\n        arrow.classList.remove('rotate-180');\n      }\n    } else {\n      accordion.classList.add('open');\n      if (content) {\n        content.style.maxHeight = content.scrollHeight + 'px';\n        content.style.opacity = '1';\n      }\n      if (arrow) {\n        arrow.classList.add('rotate-180');\n      }\n    }\n  }\n<\/script>"])), renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": pageTitle, "description": pageDescription, "metaImage": metaImage, "metaImageAlt": metaImageAlt, "metaImageWidth": metaImageWidth, "metaImageHeight": metaImageHeight, "keywords": keywords, "canonicalURL": canonicalURL, "data-astro-cid-j4d7mhtg": true }, { "default": async ($$result2) => renderTemplate`  ${categoryData?.pageHero && renderTemplate`${renderComponent($$result2, "PageHeroTailwind", $$PageHeroTailwind, { "pageData": categoryData, "data-astro-cid-j4d7mhtg": true })}`} ${renderComponent($$result2, "BreadcrumbsTailwind", $$BreadcrumbsTailwind, { "breadcrumbs": [
    { label: "Home", href: "/" },
    { label: "FAQs", href: "/faqs" },
    { label: categoryData.title }
  ], "data-astro-cid-j4d7mhtg": true })}  ${tableOfContents.length > 0 && renderTemplate`${maybeRenderHead()}<section class="w-full bg-white py-12 sm:py-16 lg:py-20" data-astro-cid-j4d7mhtg> <div class="container mx-auto max-w-[1400px] px-4 sm:px-10" data-astro-cid-j4d7mhtg> <div class="bg-white border-2 border-gray-200 rounded-xl p-6 sm:p-8 shadow-sm" data-astro-cid-j4d7mhtg> <h2 class="text-2xl font-playfair font-bold text-gray-900 mb-6" data-astro-cid-j4d7mhtg>
Contents
</h2> <nav class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" data-astro-cid-j4d7mhtg> ${tableOfContents.map((item) => renderTemplate`<a${addAttribute(`#${item.id}`, "href")} class="flex items-center gap-2 text-base font-inter text-gray-700 hover:text-[#ad986c] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50" data-astro-cid-j4d7mhtg> <svg class="w-4 h-4 flex-shrink-0 text-[#ad986c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-j4d7mhtg> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" data-astro-cid-j4d7mhtg></path> </svg> ${item.label} </a>`)} </nav> </div> </div> </section>`} ${categoryData.faqSections.map((section, sectionIndex) => {
    const sectionId = section.sectionName.toLowerCase().replace(/\s+/g, "-");
    const bgClass = sectionIndex % 2 === 0 ? "bg-gray-50" : "bg-white";
    const parsedFaqs = section.faqs?.map((faq) => ({
      ...faq,
      answer: faq.answer ? parseMarkdown(faq.answer) : ""
    })) || [];
    return renderTemplate`<section${addAttribute(sectionId, "id")}${addAttribute(`w-full ${bgClass} py-12 sm:py-16 lg:py-20 scroll-mt-20`, "class")} data-astro-cid-j4d7mhtg> <div class="container mx-auto max-w-[1400px] px-4 sm:px-10" data-astro-cid-j4d7mhtg> <h2 class="text-2xl sm:text-3xl lg:text-4xl font-playfair font-semibold text-gray-900 mb-8 sm:mb-12 text-center" data-astro-cid-j4d7mhtg> ${section.sectionName} </h2> <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-8" data-astro-cid-j4d7mhtg> ${parsedFaqs.map((faq, faqIndex) => renderTemplate`<div class="faq-accordion bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md" data-astro-cid-j4d7mhtg> <div class="faq-accordion-header flex items-center justify-between p-4 sm:p-6 cursor-pointer hover:bg-gray-50 transition-colors" onclick="toggleFaqAccordion(this)" data-astro-cid-j4d7mhtg> <h3 class="text-base lg:text-lg font-inter font-medium text-gray-900 pr-4" data-astro-cid-j4d7mhtg> ${faq.question} </h3> <div class="flex-shrink-0" data-astro-cid-j4d7mhtg> <div class="faq-arrow-icon w-6 h-6 flex items-center justify-center transition-transform duration-300" data-astro-cid-j4d7mhtg> <svg width="16" height="16" viewBox="0 0 16 16" fill="none" data-astro-cid-j4d7mhtg> <path d="M4 6L8 10L12 6" stroke="#1E1E1E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-j4d7mhtg></path> </svg> </div> </div> </div> <div class="faq-accordion-content overflow-hidden transition-all duration-300 max-h-0 opacity-0" data-astro-cid-j4d7mhtg> <div class="px-4 pb-4 sm:px-6 sm:pb-6 pt-0" data-astro-cid-j4d7mhtg> <div class="text-base sm:text-lg font-inter text-gray-800 leading-relaxed prose max-w-none" data-astro-cid-j4d7mhtg> ${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate`${unescapeHTML(faq.answer)}` })} </div> </div> </div> </div>`)} </div> </div> </section>`;
  })}` }));
}, "/Users/joshuathompson/active-away-astro/src/pages/faqs/[slug].astro", void 0);

const $$file = "/Users/joshuathompson/active-away-astro/src/pages/faqs/[slug].astro";
const $$url = "/faqs/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
