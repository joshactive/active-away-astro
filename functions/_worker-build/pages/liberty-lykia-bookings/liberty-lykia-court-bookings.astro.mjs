globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                     */
import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DGNyvb9N.mjs';
import { $ as $$BaseLayout } from '../../chunks/BaseLayout_DFPiOYnu.mjs';
import { a as $$BreadcrumbsTailwind, $ as $$PageHeroTailwind } from '../../chunks/BreadcrumbsTailwind_DRUEr9kD.mjs';
/* empty css                                                           */
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$LibertyLykiaCourtBookings = createComponent(($$result, $$props, $$slots) => {
  const pageTitle = "Liberty Lykia Court Bookings | Active Away";
  const pageDescription = "Book tennis courts, padel courts, and racket hire at Liberty Lykia. View pricing and key information for your court bookings.";
  const metaImage = "https://activeaway.com/cdn-cgi/imagedelivery/-aT8Z2F9gGvZ9fdofZcCaQ/347a58af-ebc7-433a-a4f2-6063d9a2d800/public";
  const metaImageAlt = "Liberty Lykia Tennis Courts";
  const metaImageWidth = 1920;
  const metaImageHeight = 1080;
  const canonicalURL = "https://activeaway.com/liberty-lykia-bookings/liberty-lykia-court-bookings";
  const keywords = "Liberty Lykia court booking, tennis court hire, padel court hire, racket rental";
  const heroData = {
    pageHero: {
      heading: "Liberty Lykia Court Bookings",
      // Using the same background image as the parent page
      backgroundImage: {
        url: "https://activeaway.com/cdn-cgi/imagedelivery/-aT8Z2F9gGvZ9fdofZcCaQ/347a58af-ebc7-433a-a4f2-6063d9a2d800/public",
        alt: "Liberty Lykia Bookings"
      },
      showBreadcrumbs: true
    }
  };
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Liberty Lykia Bookings", href: "/liberty-lykia-bookings" },
    { label: "Court Bookings" }
  ];
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": pageTitle, "description": pageDescription, "metaImage": metaImage, "metaImageAlt": metaImageAlt, "metaImageWidth": metaImageWidth, "metaImageHeight": metaImageHeight, "canonicalURL": canonicalURL, "keywords": keywords, "data-astro-cid-de7gjylt": true }, { "default": ($$result2) => renderTemplate(_a || (_a = __template(["  ", '<div class="custom-hero-height" data-astro-cid-de7gjylt> ', " </div>  ", '  <div class="w-full bg-white py-8 sm:py-12" data-astro-cid-de7gjylt> <div class="container mx-auto max-w-[1400px] px-4 sm:px-10" data-astro-cid-de7gjylt> <div class="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6" data-astro-cid-de7gjylt> <!-- Main Page Button --> <a href="/liberty-lykia-bookings" class="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-[#0D1C4E] hover:bg-[#0D1C4E]/90 text-white px-8 py-4 rounded-full font-inter font-semibold text-base transition-all duration-300 hover:-translate-y-0.5" data-astro-cid-de7gjylt>\nMain Page\n</a> <!-- View by Product Button --> <a href="/liberty-lykia-bookings/liberty-lykia-court-bookings/" class="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-gold hover:bg-gold-700 text-white px-8 py-4 rounded-full font-inter font-semibold text-base transition-all duration-300 hover:-translate-y-0.5" data-astro-cid-de7gjylt>\nView by Product\n</a> </div> </div> </div>  <section class="w-full bg-white py-12 sm:py-16" data-astro-cid-de7gjylt> <div class="container mx-auto max-w-[1400px] px-4 sm:px-10" data-astro-cid-de7gjylt> <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10" data-astro-cid-de7gjylt> <!-- Card 1: Pricing --> <div class="flex flex-col items-center text-center group bg-white border-2 border-gray-200 rounded-2xl p-6 sm:p-8 hover:shadow-lg hover:border-gray-300 transition-all duration-300" data-astro-cid-de7gjylt> <!-- Icon (Star/Tag) --> <div class="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-[#ad986c] rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg" data-astro-cid-de7gjylt> <svg class="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-de7gjylt> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" data-astro-cid-de7gjylt></path> </svg> </div> <h3 class="text-lg sm:text-xl font-playfair font-semibold text-[#ad986c] mb-4" data-astro-cid-de7gjylt>\nPricing\n</h3> <div class="text-base sm:text-lg font-inter text-gray-700 leading-relaxed space-y-2" data-astro-cid-de7gjylt> <p data-astro-cid-de7gjylt><strong data-astro-cid-de7gjylt>Tennis Courts</strong> \u2013 Are \u20AC10/hr to pre-book (outside 24hrs) or free if booking inside 24hrs.</p> <p data-astro-cid-de7gjylt><strong data-astro-cid-de7gjylt>Padel Courts</strong> \u2013 Are \u20AC15/hr to pre-book (outside 24hrs) or free if booking inside 24hrs.</p> <p data-astro-cid-de7gjylt><strong data-astro-cid-de7gjylt>Racket Hire</strong> \u2013 Can be added for \u20AC5.</p> </div> </div> <!-- Card 2: Key Information --> <div class="flex flex-col items-center text-center group bg-white border-2 border-gray-200 rounded-2xl p-6 sm:p-8 hover:shadow-lg hover:border-gray-300 transition-all duration-300" data-astro-cid-de7gjylt> <!-- Icon (Shield/Info) --> <div class="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-[#ad986c] rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg" data-astro-cid-de7gjylt> <svg class="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-de7gjylt> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" data-astro-cid-de7gjylt></path> </svg> </div> <h3 class="text-lg sm:text-xl font-playfair font-semibold text-[#ad986c] mb-4" data-astro-cid-de7gjylt>\nKey Information\n</h3> <div class="text-base sm:text-lg font-inter text-gray-700 leading-relaxed text-left inline-block" data-astro-cid-de7gjylt> <ul class="list-disc pl-5 space-y-2" data-astro-cid-de7gjylt> <li data-astro-cid-de7gjylt>If you are doing a bulk court booking \u2013 please <a href="https://youtu.be/D7Ym2-F_Vq8" target="_blank" rel="noopener noreferrer" class="text-[#ad986c] hover:underline" data-astro-cid-de7gjylt>watch this video</a> & <a href="https://files.activeaway.com/Liberty_Mass_Court_Bookings_v2_1_79ad46f124.xlsx" class="text-[#ad986c] hover:underline" data-astro-cid-de7gjylt>download this spreadsheet</a> to process these.</li> <li data-astro-cid-de7gjylt>Bookings can\u2019t be cancelled \u2013 please ensure you\u2019ve read our <a href="/booking-terms-conditions/" target="_blank" class="text-[#ad986c] hover:underline" data-astro-cid-de7gjylt>Terms & Conditions</a>.</li> <li data-astro-cid-de7gjylt>Please be aware of daylight hours when booking.</li> </ul> </div> </div> </div> </div> </section>  <div class="w-full bg-gray-50 py-12 sm:py-16 lg:py-24" data-astro-cid-de7gjylt> <div class="container mx-auto max-w-[1400px] px-4 sm:px-10" data-astro-cid-de7gjylt> <h2 class="text-3xl sm:text-4xl font-playfair font-semibold text-center text-gray-900 mb-8 sm:mb-12" data-astro-cid-de7gjylt>\nBook a court or a session\n</h2> <!-- Planyo Container --> <div class="bg-white p-4 rounded-2xl shadow-sm" data-astro-cid-de7gjylt> <script type="text/javascript" src="https://www.planyo.com/as.js"><\/script> <iframe id="calp_3498649602" class="calprev_iframe caltype_1 w-full min-h-[600px]" scrolling="no" frameborder="0" src="https://www.planyo.com/embed-calendar.php?calendar=70114&feedback_url=https%3A%2F%2Factiveaway.com%2Fliberty-lykia-bookings%2F&custom-language=EN&desktop=1&ifr=calp_3498649602&resfilter=244505,244091,244436,244472,244473,244474,244475,244476,244477,244478,244479,244480,244481,244482,244483,244484,244485,244486,244487,244488,244493" data-astro-cid-de7gjylt>\n        </iframe> </div> </div> </div> '])), maybeRenderHead(), renderComponent($$result2, "PageHeroTailwind", $$PageHeroTailwind, { "pageData": heroData, "breadcrumbs": breadcrumbs, "data-astro-cid-de7gjylt": true }), renderComponent($$result2, "BreadcrumbsTailwind", $$BreadcrumbsTailwind, { "breadcrumbs": breadcrumbs, "data-astro-cid-de7gjylt": true })) })} `;
}, "/Users/joshuathompson/active-away-astro/src/pages/liberty-lykia-bookings/liberty-lykia-court-bookings.astro", void 0);

const $$file = "/Users/joshuathompson/active-away-astro/src/pages/liberty-lykia-bookings/liberty-lykia-court-bookings.astro";
const $$url = "/liberty-lykia-bookings/liberty-lykia-court-bookings";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$LibertyLykiaCourtBookings,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
